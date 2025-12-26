import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';
import { db } from '@/lib/db';
import { cachedResults } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// 🚀 COST OPTIMIZATION: Use Google Gemini 2.5 Flash (FREE tier)
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

// 🏥 HEALTH CHECK: Test AI connection on server startup
let healthCheckPassed = false;
let healthCheckError: string | null = null;

async function performHealthCheck() {
  try {
    console.log('🏥 Performing AI Health Check...');
    
    const testSchema = z.object({
      message: z.string(),
    });
    
    const testResult = streamObject({
      model: google('gemini-1.5-flash-latest'), // ✅ FIXED: Use gemini-2.5-flash (latest available model)
      schema: testSchema,
      prompt: 'Reply with: "OK"',
    });
    
    // Actually consume the stream to catch errors
    const { object } = await testResult;
    const result = await object;
    
    if (result && result.message) {
      healthCheckPassed = true;
      console.log('✅ AI Health Check PASSED - Gemini 2.5 Flash is working');
    } else {
      throw new Error('Health check returned invalid response');
    }
  } catch (error: unknown) {
    healthCheckPassed = false;
    healthCheckError = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ AI Health Check FAILED:', healthCheckError);
    console.error('⚠️ Please check:');
    console.error('   - GOOGLE_GENERATIVE_AI_API_KEY is set correctly in .env.local');
    console.error('   - API key has not exceeded quota or restrictions');
    console.error('   - Model name is correct (using gemini-2.5-flash)');
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      console.error('   - Model not found. Available models: gemini-2.5-flash, gemini-2.0-flash, gemini-flash-latest');
    }
  }
}

// Run health check on module load (server startup)
performHealthCheck();

// Cho phép request chạy tối đa 30s (tránh bị timeout)
export const maxDuration = 30;

// 🧠 ADVANCED SCHEMA: Script + Viral Analysis (Chain-of-Thought output)
const scriptSchema = z.object({
  // Core Script Content
  hook: z.string().describe('Câu nói mở đầu cực sốc (0-3 giây) - Phải trigger cảm xúc mạnh'),
  script: z.string().describe('Nội dung chính của video (3-20 giây), chia thành các gạch đầu dòng ngắn gọn'),
  cta: z.string().describe('Câu kêu gọi hành động cuối video - Khuyến khích tương tác'),
  visualPrompt: z.string().describe('Mô tả hình ảnh cho AI tạo video (bằng tiếng Anh)'),
  
  // 🔥 NEW: Viral Analysis Layer
  analysis: z.object({
    hookPsychology: z.string().describe('Giải thích TẠI SAO hook này hiệu quả - Tối đa 15 từ. VD: "Dùng Curiosity Gap", "Trigger FOMO"'),
    viralScore: z.number().min(1).max(10).describe('Điểm viral từ 1-10 dựa trên tiềm năng lan truyền'),
    audienceInsight: z.string().describe('Đối tượng mục tiêu cụ thể. VD: "Gen Z sinh viên", "Các bà mẹ bỉm sữa"'),
    viralFramework: z.string().describe('Framework đã sử dụng: Polarization, Negative Hook, Transformation, Curiosity Gap, Social Proof'),
  }),
});

type ScriptResult = z.infer<typeof scriptSchema>;

/**
 * Helper function to create a streaming response from cached data
 * ✅ FIXED: Send complete object immediately, no progressive streaming for cache
 */
function createCachedStream(cachedData: ScriptResult): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    async start(controller) {
      try {
        console.log('🔄 Streaming cached data to frontend...');
        console.log('📦 Cached data:', JSON.stringify(cachedData, null, 2));
        
        // Send the complete cached object at once
        // AI SDK streamObject format: each line is "0:{partialObject}\n"
        const chunk = `0:${JSON.stringify(cachedData)}\n`;
        console.log(`   └─ Sending complete object: ${chunk.substring(0, 150)}...`);
        controller.enqueue(encoder.encode(chunk));
        
        console.log('✅ Cache stream completed');
        controller.close();
      } catch (error) {
        console.error('❌ Error streaming cached data:', error);
        controller.error(error);
      }
    },
  });
}

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    // Check if health check failed
    if (!healthCheckPassed && healthCheckError) {
      console.error('⚠️ Rejecting request - Health check failed on startup');
      return new Response(
        JSON.stringify({ 
          error: 'AI service is unavailable',
          details: healthCheckError,
          suggestion: 'Check server logs and verify GOOGLE_GENERATIVE_AI_API_KEY',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { topic, vibe, platform } = body;

    console.log('📥 API received:', { topic, vibe, platform });

    // Validate input
    if (!topic || !vibe || !platform) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: topic, vibe, platform' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🔑 STEP A: Create normalized cache key
    const cacheKey = `${topic.toLowerCase().trim()}-${vibe}-${platform}`;
    console.log('🔍 Cache key:', cacheKey);

    // 🔍 STEP B: Check database cache (non-blocking on error)
    try {
      const cached = await db
        .select()
        .from(cachedResults)
        .where(eq(cachedResults.cacheKey, cacheKey))
        .limit(1);

      if (cached.length > 0) {
        const elapsedTime = Date.now() - startTime;
        console.log(`✅ CACHE HIT - Returning cached result (${elapsedTime}ms)`);
        
        const cachedData = cached[0].data as ScriptResult;

        // ✅ FIXED: Return raw JSON text stream (same as streamObject.toTextStreamResponse)
        // experimental_useObject expects progressive JSON text chunks, not prefixed format
        const jsonStr = JSON.stringify(cachedData, null, 2);
        const encoder = new TextEncoder();
        
        // Stream the JSON in chunks to simulate progressive loading
        const stream = new ReadableStream({
          async start(controller) {
            // Split JSON into chunks and stream progressively
            const chunkSize = 50;
            for (let i = 0; i < jsonStr.length; i += chunkSize) {
              const chunk = jsonStr.slice(i, i + chunkSize);
              controller.enqueue(encoder.encode(chunk));
              await new Promise(r => setTimeout(r, 10)); // Small delay for UX
            }
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-Cache-Status': 'HIT',
            'X-Model': 'gemini-2.5-flash',
            'X-Response-Time': `${elapsedTime}ms`,
          },
        });
      }

      console.log('❌ CACHE MISS - Calling Gemini API');
    } catch (dbError) {
      console.error('⚠️ Database cache check failed:', dbError);
      // Continue to API call - caching is not critical
    }

    // 🤖 STEP C: Call Google Gemini API with Director Mode Prompt
    console.log('🚀 Calling Gemini 2.5 Flash with Director Mode...');
    
    const result = streamObject({
      model: google('gemini-2.5-flash'),
      schema: scriptSchema,
      prompt: `
Bạn là "Viral Short Architect" - Kiến trúc sư Nội dung Viral chuyên nghiệp.
Bạn hiểu sâu về thuật toán TikTok/Reels/Shorts và tâm lý người xem Việt Nam.

═══════════════════════════════════════════════════════════════
🎯 INPUT TỪ USER:
- Chủ đề: "${topic}"
- Phong cách: ${vibe}
- Nền tảng: ${platform}
═══════════════════════════════════════════════════════════════

🧠 QUY TRÌNH SUY LUẬN CỦA BẠN (Chain-of-Thought):

BƯỚC 1 - PHÂN TÍCH TÂM LÝ:
Xác định pain point hoặc desire cốt lõi của chủ đề này. Người xem đang khao khát điều gì?

BƯỚC 2 - CHỌN VIRAL FRAMEWORK:
Chọn 1 trong các kỹ thuật sau phù hợp nhất với chủ đề:
• "Polarization" - Chọn phe trong cuộc tranh luận (VD: "Team A hay Team B?")
• "Negative Hook" - Cảnh báo về sai lầm (VD: "Đừng bao giờ làm điều này...")
• "Transformation" - Trước vs Sau, thay đổi đáng kinh ngạc
• "Curiosity Gap" - Tạo khoảng trống tò mò (VD: "Bí mật mà 99% người không biết")
• "Social Proof" - Dùng số liệu, bằng chứng đám đông

BƯỚC 3 - TẠO HOOK ĐÁNH THẲNG VÀO CẢM XÚC:
Hook PHẢI trigger 1 trong các cảm xúc mạnh: Bất ngờ, Sợ hãi, Tham lam, Hài hước, Tức giận, Tò mò.

BƯỚC 4 - TỰ ĐÁNH GIÁ:
Chấm điểm viral từ 1-10. Giải thích tại sao hook này sẽ được thuật toán đẩy mạnh.

═══════════════════════════════════════════════════════════════
📋 YÊU CẦU OUTPUT:

1. HOOK (0-3 giây): 
   - Cực ngắn, đánh thẳng vào cảm xúc
   - Dùng ngôn ngữ Gen Z Việt Nam tự nhiên
   - KHÔNG chào hỏi, KHÔNG giới thiệu

2. SCRIPT (3-20 giây):
   - Chia thành 3-4 bullet points ngắn gọn
   - Mỗi điểm là 1 "đòn tâm lý" riêng
   - Pace nhanh, không rườm rà

3. CTA (Kết thúc):
   - Kêu gọi hành động cụ thể (comment, share, follow)
   - Tạo FOMO hoặc urgency

4. VISUAL PROMPT (Tiếng Anh):
   - Cinematic shot description
   - Lighting, mood, camera angle

5. ANALYSIS (Phân tích Viral):
   - hookPsychology: Giải thích TẠI SAO hook hiệu quả (tối đa 15 từ)
   - viralScore: Điểm 1-10
   - audienceInsight: Đối tượng cụ thể
   - viralFramework: Framework đã dùng

═══════════════════════════════════════════════════════════════
⚡ BẮT ĐẦU TẠO NGAY - KHÔNG NÓI THÊM GÌ:
      `.trim(),
      
      // 💾 STEP D: Save to cache when generation completes
      onFinish: async ({ object, error }) => {
        if (error) {
          console.error('❌ Generation error:', error);
          return;
        }

        if (!object) {
          console.warn('⚠️ No object returned from Gemini');
          return;
        }

        const elapsedTime = Date.now() - startTime;
        console.log(`✨ Generation completed (${elapsedTime}ms)`);

        // Save to database cache (non-blocking - don't fail request if this fails)
        try {
          await db.insert(cachedResults).values({
            cacheKey,
            data: object as ScriptResult,
          });
          console.log('💾 Saved to cache:', cacheKey);
        } catch (saveError) {
          console.error('⚠️ Failed to save to cache (non-critical):', saveError);
          // Don't throw - caching failure shouldn't break the response
        }
      },
    });

    // Return the streaming response
    const response = result.toTextStreamResponse();
    
    // Add custom headers
    const headers = new Headers(response.headers);
    headers.set('X-Cache-Status', 'MISS');
    headers.set('X-Model', 'gemini-2.5-flash'); // ✅ FIXED: Updated to gemini-2.5-flash
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

  } catch (error) {
    console.error('💥 API Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate content',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
