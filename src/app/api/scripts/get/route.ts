import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { scripts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // 🔐 Verify user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view your scripts.' },
        { status: 401 }
      );
    }

    // Fetch all scripts for this user, newest first
    const userScripts = await db
      .select()
      .from(scripts)
      .where(eq(scripts.userId, userId))
      .orderBy(desc(scripts.createdAt));

    console.log(`📚 Fetched ${userScripts.length} scripts for user ${userId}`);

    return NextResponse.json({
      success: true,
      scripts: userScripts,
      count: userScripts.length,
    });

  } catch (error) {
    console.error('❌ Error fetching scripts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scripts. Please try again.' },
      { status: 500 }
    );
  }
}
