import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { spotifyService } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Only admin users can check health
    if (!session?.user?.id || session.user.type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const healthCheck = await spotifyService.healthCheck();

    return NextResponse.json({
      success: true,
      spotify: healthCheck,
      timestamp: new Date().toISOString(),
      environment: {
        hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
        hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      }
    });
  } catch (error) {
    console.error('Error checking Spotify health:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check Spotify health',
        spotify: {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}