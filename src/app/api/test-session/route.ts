import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const session = await auth();

    return NextResponse.json({
      hasSession: !!session,
      session: session || null
    });

  } catch (error) {
    logger.error('Session test failed', error);
    return NextResponse.json({ 
      error: 'Session test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}