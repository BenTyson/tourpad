import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { spotifyService } from '@/lib/spotify';

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
    let results = await spotifyService.getFromCache(cacheKey);
    
    if (!results) {
      // Search Spotify
      results = await spotifyService.searchArtist(query);
      
      // Cache results for 1 hour
      await spotifyService.setCache(cacheKey, results, 60);
    }

    return NextResponse.json({
      success: true,
      artists: results
    });
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return NextResponse.json(
      { error: 'Failed to search Spotify' },
      { status: 500 }
    );
  }
}