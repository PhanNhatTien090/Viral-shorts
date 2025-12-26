import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * GET /api/health
 * 
 * Checks if the AI service is properly configured and accessible
 */
export async function GET() {
  const checks: Record<string, { status: 'ok' | 'error'; message: string }> = {};

  // Check 1: Environment variables
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const dbUrl = process.env.DATABASE_URL;

  checks.googleApiKey = googleApiKey
    ? { status: 'ok', message: 'API key is set' }
    : { status: 'error', message: 'GOOGLE_GENERATIVE_AI_API_KEY is missing' };

  checks.database = dbUrl
    ? { status: 'ok', message: 'Database URL is configured' }
    : { status: 'error', message: 'DATABASE_URL is missing' };

  // Check 2: Quick database connection test
  try {
    const { db } = await import('@/lib/db');
    await db.execute('SELECT 1');
    checks.databaseConnection = { status: 'ok', message: 'Database connection successful' };
  } catch (error) {
    checks.databaseConnection = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
    };
  }

  // Determine overall health
  const allHealthy = Object.values(checks).every(check => check.status === 'ok');

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allHealthy ? 200 : 503 }
  );
}
