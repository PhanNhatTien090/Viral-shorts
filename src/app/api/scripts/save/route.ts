import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { scripts } from '@/lib/db/schema';

export async function POST(req: Request) {
  try {
    // 🔐 Verify user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to save scripts.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { scriptData, topic, platform, vibe } = body;

    // Validate required fields
    if (!scriptData || !scriptData.hook || !scriptData.script || !scriptData.cta) {
      return NextResponse.json(
        { error: 'Missing required script data (hook, script, cta)' },
        { status: 400 }
      );
    }

    // Generate title from hook (first 50 chars)
    const title = scriptData.hook.substring(0, 50) + (scriptData.hook.length > 50 ? '...' : '');

    // Extract viral score from analysis if available
    const viralScore = scriptData.analysis?.viralScore || null;

    // Insert into database
    const [savedScript] = await db.insert(scripts).values({
      userId,
      title,
      topic: topic || null,
      platform: platform || null,
      vibe: vibe || null,
      hook: scriptData.hook,
      script: scriptData.script,
      cta: scriptData.cta,
      visualPrompt: scriptData.visualPrompt || null,
      analysis: scriptData.analysis || null,
      viralScore,
    }).returning();

    console.log(`✅ Script saved for user ${userId}:`, savedScript.id);

    return NextResponse.json({
      success: true,
      message: 'Script saved successfully!',
      script: savedScript,
    });

  } catch (error) {
    console.error('❌ Error saving script:', error);
    return NextResponse.json(
      { error: 'Failed to save script. Please try again.' },
      { status: 500 }
    );
  }
}
