import { NextResponse } from 'next/server';
import { soundcloudService } from '@/lib/soundcloud';

export async function GET() {
  try {
    const health = await soundcloudService.healthCheck();
    
    return NextResponse.json({
      service: 'SoundCloud API',
      ...health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        service: 'SoundCloud API',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}