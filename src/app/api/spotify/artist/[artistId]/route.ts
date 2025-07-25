import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { artistId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const artistId = params.artistId;

    // Get artist with Spotify data
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        spotifyAlbums: {
          orderBy: { releaseDate: 'desc' },
        },
        spotifyTracks: {
          orderBy: { popularity: 'desc' },
          take: 10, // Top 10 tracks
        },
      },
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      artist: {
        id: artist.id,
        stageName: artist.stageName,
        spotifyArtistId: artist.spotifyArtistId,
        spotifyVerified: artist.spotifyVerified,
        spotifyFollowers: artist.spotifyFollowers,
        spotifyPopularity: artist.spotifyPopularity,
        spotifyGenres: artist.spotifyGenres,
        lastSpotifySync: artist.lastSpotifySync,
        albums: artist.spotifyAlbums,
        topTracks: artist.spotifyTracks,
      }
    });
  } catch (error) {
    console.error('Error getting artist Spotify data:', error);
    return NextResponse.json(
      { error: 'Failed to get artist Spotify data' },
      { status: 500 }
    );
  }
}