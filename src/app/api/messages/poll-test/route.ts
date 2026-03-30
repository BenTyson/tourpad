import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';

// Simple test endpoint for safe messaging polling
// This endpoint does minimal work to test polling without database overload
export async function GET(request: NextRequest) {
  try {
    // Basic auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timestamp = new Date().toISOString();

    // Return minimal response
    return NextResponse.json({
      success: true,
      timestamp,
      userId: session.user.id,
      message: 'Polling test endpoint responding normally'
    });

  } catch (error) {
    logger.error('Failed in poll-test endpoint', error);
    return NextResponse.json(
      { error: 'Test polling failed' },
      { status: 500 }
    );
  }
}