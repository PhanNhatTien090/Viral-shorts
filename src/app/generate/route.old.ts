import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';
import { db } from '@/lib/db';
import { cachedResults } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// ═══════════════════════════════════════════════════════════════
// 🔍 TAVILY WEB SEARCH - Real-time Context Retrieval
// ═══════════════════════════════════════════════════════════════

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  answer?: string;
  results?: TavilySearchResult[];
  query?: string;
}

/**
 * Search web for real-time context using Tavily API
 * This helps the AI understand current trends and avoid hallucinations
 */
async function searchWithTavily(topic: string): Promise<string | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ TAVILY_API_KEY not set - skipping web search');
    return null;
  }

  try {
    // Construct search query optimized for Vietnamese TikTok trends
    const searchQuery = `${topic} là gì tiktok trend viral context`;
    console.log('🔍 Tavily Search Query:', searchQuery);

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: searchQuery,
        search_depth: 'basic',
        include_answer: true,
        max_results: 5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Tavily API Error:', response.status, errorText);
      return null;
    }

    const data: TavilyResponse = await response.json();
    console.log('✅ Tavily Search Success - Got answer:', !!data.answer);

    // Build context from answer and top results
    let context = '';

    // Priority 1: Use the AI-generated answer if available
    if (data.answer) {
      context += `📌 TÓM TẮT: ${data.answer}\n\n`;
    }

    // Priority 2: Add top search results for more details
    if (data.results && data.results.length > 0) {
      context += '📚 CHI TIẾT TỪ WEB:\n';
      data.results.slice(0, 3).forEach((result, idx) => {
        context += `${idx + 1}. [${result.title}]\n   ${result.content.slice(0, 300)}...\n\n`;
      });
    }

    if (!context) {
      console.warn('⚠️ Tavily returned empty results');
      return null;
    }

    console.log('📦 Context length:', context.length, 'chars');
    return context.trim();

  } catch (error) {
    console.error('❌ Tavily Search Failed:', error);
    return null;
  }
}

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

// 🧠 BASE SCHEMA: Script + Viral Analysis (without visuals - saves tokens)
const baseScriptSchema = z.object({
  // Core Script Content
  hook: z.string().describe('Câu nói mở đầu cực sốc (0-3 giây) - Phải trigger cảm xúc mạnh'),
  script: z.string().describe('Nội dung chính của video (3-20 giây), chia thành các gạch đầu dòng ngắn gọn'),
  cta: z.string().describe('Câu kêu gọi hành động cuối video - Khuyến khích tương tác'),
  
  // 🔥 Viral Analysis Layer
  analysis: z.object({
    hookPsychology: z.string().describe('Giải thích TẠI SAO hook này hiệu quả - Tối đa 15 từ'),
    viralScore: z.number().min(1).max(10).describe('Điểm viral từ 1-10'),
    audienceInsight: z.string().describe('Đối tượng mục tiêu cụ thể'),
    viralFramework: z.string().describe('Framework đã sử dụng'),
  }),
});

// 🎬 FULL SCHEMA: With Visual Prompt (when includeVisuals = true)
const fullScriptSchema = baseScriptSchema.extend({
  visualPrompt: z.string().describe('Prompt tiếng Anh tối ưu cho Kling/Runway/Luma để tạo video AI. Mô tả chi tiết: subject, scene, camera movement, lighting, mood, color. VD: "Young Vietnamese woman in modern cafe, warm lighting, slow zoom in, cinematic color grading, 4k"'),
});

type BaseScriptResult = z.infer<typeof baseScriptSchema>;
type FullScriptResult = z.infer<typeof fullScriptSchema>;

export async function POST(req: Request) {
  const startTime = Date.now();
  
  // 🔐 Get userId from Clerk (null for guests, string for logged-in users)
  const { userId } = await auth();
  const isGuest = !userId;
  console.log(`👤 User status: ${isGuest ? 'Guest' : `Logged in (${userId})`}`);
  
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
    const { topic, vibe, platform, includeVisuals = false } = body;

    console.log('📥 API received:', { topic, vibe, platform, includeVisuals, isGuest });

    // Validate input
    if (!topic || !vibe || !platform) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: topic, vibe, platform' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🔑 STEP A: Create normalized cache key (include visuals flag)
    const cacheKey = `${topic.toLowerCase().trim()}-${vibe}-${platform}-v${includeVisuals ? '1' : '0'}`;
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
        
        const cachedData = cached[0].data as BaseScriptResult | FullScriptResult;

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

    // ═══════════════════════════════════════════════════════════════
    // 🔍 STEP B.5: Real-time Web Search with Tavily (RAG-style context)
    // This prevents AI hallucinations on new trends like "Mai Trí Thức"
    // ═══════════════════════════════════════════════════════════════
    console.log('🌐 Fetching real-time context from Tavily...');
    const webSearchContext = await searchWithTavily(topic);

    // 🤖 STEP C: Call Google Gemini API with Enhanced Viral Prompt
    // Choose schema based on includeVisuals flag
    const activeSchema = includeVisuals ? fullScriptSchema : baseScriptSchema;
    console.log(`🚀 Calling Gemini 2.5 Flash (includeVisuals: ${includeVisuals}, hasContext: ${!!webSearchContext})...`);
    
    // Build visual instruction if needed
    const visualInstruction = includeVisuals ? `
5. VISUAL PROMPT (Tiếng Anh - cho AI Video Tools):
   - Mô tả chi tiết scene bằng tiếng Anh
   - Bao gồm: subject, environment, camera movement, lighting, mood, color palette
   - Tối ưu cho Kling AI, Runway, Luma
   - VD: "Young Vietnamese entrepreneur in modern coffee shop, golden hour lighting, slow dolly in, warm color grading, cinematic 4k, shallow depth of field"
` : '';
    
    const result = streamObject({
      model: google('gemini-2.5-flash'),
      schema: activeSchema,
      prompt: `
═══════════════════════════════════════════════════════════════
🎭 ROLE & PERSONA:
═══════════════════════════════════════════════════════════════
Bạn là một TikToker huyền thoại chuyên tạo nội dung viral cho Gen Z Việt Nam.
Giọng văn của bạn: nhanh, sắc bén, hơi "gắt", dùng slang internet tự nhiên.

🗣️ NGÔN NGỮ CỦA BẠN:
- Dùng: "khum" thay "không", "bà" thay "bạn", "ét o ét" (SOS), "chấn động", "sốc nặng"
- Tránh: ngôn ngữ sách vở, formal, corporate
- Vibe: như đang nói chuyện với bạn thân trên TikTok
- Emoji dùng tự nhiên: 💀🔥😭👀

═══════════════════════════════════════════════════════════════
📚 FEW-SHOT EXAMPLES (Golden Samples - Học theo cấu trúc này):
═══════════════════════════════════════════════════════════════

✨ VÍ DỤ 1: Dạng Educational/Tips (Chủ đề: Sức khỏe)
---
HOOK: "Dừng ngay việc uống nước kiểu này nếu khum muốn thận kêu cứu! 💀"
SCRIPT:
• Bạn tưởng uống nước đá lạnh mát người? Sai bét!
• Thận bạn đang gồng cực độ để cân bằng nhiệt độ đó
• 90% Gen Z đang tự hại thận mà khum biết
• Chuyên gia đã cảnh báo điều này từ lâu rồi bà ơi
CTA: "Tag ngay đứa bạn suốt ngày ôm trà sữa đá vào đây! 🧋"
---
→ Analysis: Hook dùng Negative Frame ("thận kêu cứu") + Fear trigger + Direct address ("bạn")

✨ VÍ DỤ 2: Dạng Storytelling/Drama (Chủ đề: Bí mật)
---
HOOK: "Sốc: Phát hiện bí mật động trời trong quán phở 30 năm tuổi 🍜👀"
SCRIPT:
• Ông chủ quán phở này giữ 1 bí mật suốt 30 năm
• Không ai được vào bếp, kể cả con trai ruột
• Cho đến khi tui phát hiện ra thứ này... (tạo suspense)
• Cái nồi nước dùng được truyền qua 3 đời, chưa bao giờ tắt lửa
CTA: "Theo dõi để xem phần 2 - Bí mật thật sự là gì! 🔥"
---
→ Analysis: Hook dùng Curiosity Gap + Suspense Building + Cliffhanger CTA

═══════════════════════════════════════════════════════════════
🧠 CHAIN OF THOUGHT (Suy luận ngầm - KHÔNG output ra):
═══════════════════════════════════════════════════════════════

Trước khi viết, BẠN PHẢI tự hỏi (trong đầu, không viết ra):

1. 👥 AUDIENCE: Ai sẽ xem video này?
   - Gen Z (18-25)? Office workers (25-35)? Bà mẹ bỉm sữa?
   - Họ đang lướt TikTok lúc mấy giờ? Tâm trạng như nào?

2. 😰 FOMO FACTOR: Điều gì khiến họ PHẢI xem hết video?
   - Họ sẽ bỏ lỡ gì nếu lướt qua?
   - Có thông tin exclusive nào không?

3. 🔥 CONTROVERSY: Điểm gây tranh cãi là gì?
   - Điều gì khiến người ta comment "Đúng quá!" hoặc "Vô lý!"
   - Góc nhìn nào đi ngược số đông?

4. 🎯 FRAMEWORK phù hợp:
   - Polarization: Chia đôi ý kiến
   - Negative Hook: Cảnh báo, hậu quả
   - Transformation: Before/After
   - Curiosity Gap: Hé lộ một phần
   - Social Proof: "99% người không biết..."

═══════════════════════════════════════════════════════════════
🌐 CONTEXT TỪ WEB SEARCH (Facts & Info - Dùng làm dữ liệu):
═══════════════════════════════════════════════════════════════
${webSearchContext ? `
${webSearchContext}

⚠️ QUAN TRỌNG: 
- Dùng FACTS từ context trên để đảm bảo độ chính xác
- Nếu context về người cụ thể/trend: Bắt chước đúng phong cách của họ
- KHÔNG bịa ra thông tin không có trong context
` : `
⚠️ KHÔNG CÓ CONTEXT TỪ WEB - Tạo nội dung chung, tránh claim cụ thể
`}
═══════════════════════════════════════════════════════════════
🎯 INPUT TỪ USER:
═══════════════════════════════════════════════════════════════
- Chủ đề: "${topic}"
- Phong cách: ${vibe}
- Nền tảng: ${platform}

═══════════════════════════════════════════════════════════════
📋 OUTPUT FORMAT (Strict - Làm theo đúng structure):
═══════════════════════════════════════════════════════════════

1. HOOK (0-3 giây): 
   - Cực ngắn, punch mạnh
   - Dùng trigger words: "Dừng lại!", "Sốc:", "Cuối cùng cũng...", "99% người..."
   - Ngôn ngữ Gen Z (khum, bà, ét o ét, chấn động)

2. SCRIPT (3-20 giây): 
   - 3-4 bullet points, mỗi cái max 15 từ
   - Pace nhanh như đang rap
   - Direct address: "Bạn", "Bà"
   - Plot twist hoặc reveal ở cuối

3. CTA: 
   - Tạo FOMO: "Follow trước khi...", "Comment nếu..."
   - Engagement hook: Tag bạn bè, challenge

4. ANALYSIS:
   - hookPsychology: Giải thích TẠI SAO hook này work (max 15 từ)
   - viralScore: Điểm 1-10 (tự đánh giá trung thực)
   - audienceInsight: Đối tượng cụ thể (VD: "Gen Z nữ 18-24, quan tâm skincare")
   - viralFramework: Framework đã dùng (Polarization/Negative/etc.)
${visualInstruction}
═══════════════════════════════════════════════════════════════
⚡ GHI NHỚ: Bạn là TikToker, KHÔNG phải copywriter. Viết như đang quay video!
═══════════════════════════════════════════════════════════════
      `.trim(),
      
      // 💾 STEP D: Save to cache when generation completes (for ALL users including guests)
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
        console.log(`✨ Generation completed (${elapsedTime}ms) - User: ${isGuest ? 'Guest' : userId}`);

        // Save to database cache (non-blocking - don't fail request if this fails)
        try {
          await db.insert(cachedResults).values({
            cacheKey,
            data: object as BaseScriptResult | FullScriptResult,
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
    headers.set('X-Model', 'gemini-2.5-flash');
    headers.set('X-Web-Context', webSearchContext ? 'FOUND' : 'NONE'); // 🔍 Track Tavily context status
    
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
