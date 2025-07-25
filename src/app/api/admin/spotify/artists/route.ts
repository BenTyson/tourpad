import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Only admin users can access this
    if (!session?.user?.id || session.user.type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all artists with their Spotify data and counts
    const artists = await prisma.artist.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            spotifyAlbums: true,
            spotifyTracks: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedArtists = artists.map(artist => ({
      id: artist.id,
      name: artist.user.name,
      stageName: artist.stageName,
      spotifyArtistId: artist.spotifyArtistId,
      spotifyVerified: artist.spotifyVerified,
      spotifyFollowers: artist.spotifyFollowers,
      spotifyPopularity: artist.spotifyPopularity,
      spotifyGenres: artist.spotifyGenres,
      lastSpotifySync: artist.lastSpotifySync,
      albumCount: artist._count.spotifyAlbums,
      trackCount: artist._count.spotifyTracks,
    }));

    return NextResponse.json({
      success: true,
      artists: formattedArtists,
      stats: {
        totalArtists: artists.length,
        connectedArtists: artists.filter(a => a.spotifyVerified).length,
        totalAlbums: formattedArtists.reduce((sum, a) => sum + a.albumCount, 0),
        totalTracks: formattedArtists.reduce((sum, a) => sum + a.trackCount, 0),
      }
    });
  } catch (error) {
    console.error('Error getting artists for Spotify admin:', error);
    return NextResponse.json(
      { error: 'Failed to get artists' },
      { status: 500 }
    );
  }
}