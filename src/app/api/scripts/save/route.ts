import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { scripts } from '@/lib/db/schema';

export async function POST(req: Request) {
  console.log('📝 [SAVE] Starting script save...');
  
  try {
    // 🔐 Verify user is authenticated
    const { userId } = await auth();
    
    console.log('👤 [SAVE] User ID:', userId || 'NOT LOGGED IN');
    
    if (!userId) {
      console.warn('⚠️ [SAVE] Rejected - User not logged in');
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to save scripts.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { scriptData, topic, platform, vibe } = body;
    
    console.log('📦 [SAVE] Request body:', {
      hasScriptData: !!scriptData,
      topic,
      platform,
      vibe,
      hookLength: scriptData?.hook?.length || 0,
      scriptLength: scriptData?.script?.length || 0,
    });

    // Validate required fields
    if (!scriptData || !scriptData.hook || !scriptData.script || !scriptData.cta) {
      console.error('❌ [SAVE] Validation failed - Missing required fields');
      return NextResponse.json(
        { error: 'Missing required script data (hook, script, cta)' },
        { status: 400 }
      );
    }

    // Generate title from hook (first 50 chars)
    const title = scriptData.hook.substring(0, 50) + (scriptData.hook.length > 50 ? '...' : '');

    // Extract viral score from analysis if available
    const viralScore = scriptData.analysis?.viralScore || null;

    console.log('💾 [SAVE] Inserting into database...');
    console.log('   - userId:', userId);
    console.log('   - title:', title);
    console.log('   - viralScore:', viralScore);

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

    console.log('✅ [SAVE] SUCCESS! Script saved with ID:', savedScript.id);
    console.log('   - Created at:', savedScript.createdAt);

    return NextResponse.json({
      success: true,
      message: 'Script saved successfully!',
      script: savedScript,
    });

  } catch (error) {
    console.error('❌ [SAVE] DATABASE ERROR:', error);
    console.error('   - Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('   - Error message:', error instanceof Error ? error.message : String(error));
    
    return NextResponse.json(
      { error: 'Failed to save script. Please try again.' },
      { status: 500 }
    );
  }
}
