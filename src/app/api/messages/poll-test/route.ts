import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Simple test endpoint for safe messaging polling
// This endpoint does minimal work to test polling without database overload
export async function GET(request: NextRequest) {
  try {
    // Basic auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request timestamp for tracking
    const timestamp = new Date().toISOString();
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Log the request (temporary for debugging)
    console.log(`[POLL-TEST] ${timestamp} - User: ${session.user.id} - Agent: ${userAgent.substring(0, 50)}`);

    // Return minimal response
    return NextResponse.json({
      success: true,
      timestamp,
      userId: session.user.id,
      message: 'Polling test endpoint responding normally'
    });

  } catch (error) {
    console.error('Error in poll-test:', error);
    return NextResponse.json(
      { error: 'Test polling failed' },
      { status: 500 }
    );
  }
}