import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { spotifyService } from '@/lib/spotify';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { artistId } = await params;
    const body = await request.json();
    const { spotifyArtistId } = body;

    if (!spotifyArtistId) {
      return NextResponse.json({ error: 'Spotify artist ID is required' }, { status: 400 });
    }

    // Verify the artist exists and user has permission
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: { user: true },
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Check if user owns this artist profile or is admin
    const isOwner = artist.userId === session.user.id;
    const isAdmin = session.user.type === 'admin';
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Sync with Spotify
    await spotifyService.syncArtistData(artistId, spotifyArtistId);

    // Get updated artist data
    const updatedArtist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        spotifyAlbums: {
          orderBy: { releaseDate: 'desc' },
        },
        spotifyTracks: {
          orderBy: { popularity: 'desc' },
          take: 10,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Spotify data synced successfully',
      artist: {
        id: updatedArtist!.id,
        stageName: updatedArtist!.stageName,
        spotifyArtistId: updatedArtist!.spotifyArtistId,
        spotifyVerified: updatedArtist!.spotifyVerified,
        spotifyFollowers: updatedArtist!.spotifyFollowers,
        spotifyPopularity: updatedArtist!.spotifyPopularity,
        spotifyGenres: updatedArtist!.spotifyGenres,
        lastSpotifySync: updatedArtist!.lastSpotifySync,
        albums: updatedArtist!.spotifyAlbums,
        topTracks: updatedArtist!.spotifyTracks,
      }
    });
  } catch (error) {
    console.error('Error syncing artist with Spotify:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to sync with Spotify'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { artistId } = await params;

    // Verify the artist exists and user has permission
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: { user: true },
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Check if user owns this artist profile or is admin
    const isOwner = artist.userId === session.user.id;
    const isAdmin = session.user.type === 'admin';
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Remove Spotify connection and data
    await prisma.$transaction(async (tx) => {
      // Delete Spotify albums and tracks
      await tx.spotifyTrack.deleteMany({
        where: { artistId },
      });
      
      await tx.spotifyAlbum.deleteMany({
        where: { artistId },
      });

      // Clear Spotify fields from artist
      await tx.artist.update({
        where: { id: artistId },
        data: {
          spotifyArtistId: null,
          spotifyVerified: false,
          spotifyFollowers: null,
          spotifyPopularity: null,
          spotifyGenres: [],
          lastSpotifySync: null,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Spotify connection removed successfully'
    });
  } catch (error) {
    console.error('Error removing Spotify connection:', error);
    return NextResponse.json(
      { error: 'Failed to remove Spotify connection' },
      { status: 500 }
    );
  }
}