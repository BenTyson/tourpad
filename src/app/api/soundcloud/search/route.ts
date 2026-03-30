import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { soundcloudService } from '@/lib/soundcloud';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `search:${query}`;
    let results = await soundcloudService.getFromCache(cacheKey);
    
    if (!results) {
      // Search SoundCloud
      results = await soundcloudService.searchUsers(query, 10);
      
      // Cache results for 1 hour
      await soundcloudService.setCache(cacheKey, results, 60);
    }

    return NextResponse.json({
      success: true,
      users: results
    });
  } catch (error) {
    logger.error('Failed to search SoundCloud', error);
    return NextResponse.json(
      { error: 'Failed to search SoundCloud' },
      { status: 500 }
    );
  }
}