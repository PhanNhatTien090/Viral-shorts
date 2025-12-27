import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { scripts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  console.log('📖 [GET] Fetching scripts...');
  
  try {
    // 🔐 Verify user is authenticated
    const { userId } = await auth();
    
    console.log('👤 [GET] User ID from Clerk:', userId || 'NOT LOGGED IN');
    
    if (!userId) {
      console.warn('⚠️ [GET] Rejected - User not logged in');
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view your scripts.' },
        { status: 401 }
      );
    }

    console.log('🔍 [GET] Querying database for user:', userId);
    
    // Fetch all scripts for this user, newest first
    const userScripts = await db
      .select()
      .from(scripts)
      .where(eq(scripts.userId, userId))
      .orderBy(desc(scripts.createdAt));

    console.log(`✅ [GET] Found ${userScripts.length} scripts for user ${userId}`);
    
    // Debug: Log first script if exists
    if (userScripts.length > 0) {
      console.log('   - First script ID:', userScripts[0].id);
      console.log('   - First script title:', userScripts[0].title?.substring(0, 30));
    }

    return NextResponse.json({
      success: true,
      scripts: userScripts,
      count: userScripts.length,
    });

  } catch (error) {
    console.error('❌ [GET] Error fetching scripts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scripts. Please try again.' },
      { status: 500 }
    );
  }
}
