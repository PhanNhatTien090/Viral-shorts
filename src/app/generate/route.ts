import { db } from '@/lib/db';
import { cachedResults } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { 
  generateScript, 
  checkAIHealth,
  type BaseScriptResult,
  type FullScriptResult 
} from '@/lib/ai';
import { searchWithTavily } from './services/tavily';

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════
export const maxDuration = 30; // Allow 30s timeout

// Health check state
let healthCheckPassed = false;
let healthCheckError: string | null = null;

// Run health check on module load
(async () => {
  console.log('🏥 Running AI health check...');
  const result = await checkAIHealth();
  healthCheckPassed = result.ok;
  healthCheckError = result.error ?? null;
  console.log(healthCheckPassed ? '✅ AI ready' : `❌ AI failed: ${healthCheckError}`);
})();

// ═══════════════════════════════════════════════════════════════
// API Route Handler
// ═══════════════════════════════════════════════════════════════
export async function POST(req: Request) {
  const startTime = Date.now();
  
  // Auth check
  const { userId } = await auth();
  const isGuest = !userId;
  console.log(`👤 ${isGuest ? 'Guest' : `User: ${userId}`}`);
  
  try {
    // Reject if AI is unhealthy
    if (!healthCheckPassed && healthCheckError) {
      return errorResponse(503, 'AI service unavailable', healthCheckError);
    }

    // Parse & validate input
    const body = await req.json();
    const { topic, vibe, platform, duration = '30-60', includeVisuals = false } = body;

    if (!topic || !vibe || !platform) {
      return errorResponse(400, 'Missing required fields: topic, vibe, platform');
    }

    console.log('📥 Request:', { topic, vibe, platform, duration, includeVisuals });

    // ═══════════════════════════════════════════════════════════
    // Cache Check
    // ═══════════════════════════════════════════════════════════
    const cacheKey = buildCacheKey(topic, vibe, platform, duration, includeVisuals);
    
    const cachedResult = await checkCache(cacheKey);
    if (cachedResult) {
      const elapsed = Date.now() - startTime;
      console.log(`✅ Cache HIT (${elapsed}ms)`);
      return streamCachedResponse(cachedResult, elapsed);
    }

    console.log('❌ Cache MISS - generating...');

    // ═══════════════════════════════════════════════════════════
    // Web Search (RAG Context)
    // ═══════════════════════════════════════════════════════════
    const webContext = await searchWithTavily(topic);

    // ═══════════════════════════════════════════════════════════
    // Generate Script
    // ═══════════════════════════════════════════════════════════
    const result = await generateScript({
      topic,
      vibe,
      platform,
      duration,
      includeVisuals,
      webContext,
    });

    // Save to cache on completion (non-blocking)
    result.object.then(async (object) => {
      if (!object) return;
      
      const elapsed = Date.now() - startTime;
      console.log(`✨ Generated (${elapsed}ms)`);
      
      try {
        await db.insert(cachedResults).values({
          cacheKey,
          data: object as BaseScriptResult | FullScriptResult,
        });
        console.log('💾 Cached:', cacheKey);
      } catch (e) {
        console.warn('⚠️ Cache save failed:', e);
      }
    });

    // Return streaming response
    const response = result.toTextStreamResponse();
    return addHeaders(response, {
      'X-Cache-Status': 'MISS',
      'X-Web-Context': webContext ? 'FOUND' : 'NONE',
    });

  } catch (error) {
    console.error('💥 Error:', error);
    return errorResponse(
      500, 
      'Failed to generate content',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════

function buildCacheKey(
  topic: string, 
  vibe: string, 
  platform: string, 
  duration: string,
  includeVisuals: boolean
): string {
  return `${topic.toLowerCase().trim()}-${vibe}-${platform}-${duration}-v${includeVisuals ? '1' : '0'}`;
}

async function checkCache(cacheKey: string): Promise<BaseScriptResult | FullScriptResult | null> {
  try {
    const cached = await db
      .select()
      .from(cachedResults)
      .where(eq(cachedResults.cacheKey, cacheKey))
      .limit(1);

    return cached.length > 0 
      ? (cached[0].data as BaseScriptResult | FullScriptResult) 
      : null;
  } catch (e) {
    console.warn('⚠️ Cache check failed:', e);
    return null;
  }
}

function streamCachedResponse(
  data: BaseScriptResult | FullScriptResult, 
  elapsedMs: number
): Response {
  const jsonStr = JSON.stringify(data, null, 2);
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const chunkSize = 50;
      for (let i = 0; i < jsonStr.length; i += chunkSize) {
        controller.enqueue(encoder.encode(jsonStr.slice(i, i + chunkSize)));
        await new Promise(r => setTimeout(r, 10));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Cache-Status': 'HIT',
      'X-Response-Time': `${elapsedMs}ms`,
    },
  });
}

function addHeaders(response: Response, headers: Record<string, string>): Response {
  const newHeaders = new Headers(response.headers);
  Object.entries(headers).forEach(([k, v]) => newHeaders.set(k, v));
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

function errorResponse(status: number, error: string, details?: string): Response {
  return new Response(
    JSON.stringify({ error, details }),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
}
