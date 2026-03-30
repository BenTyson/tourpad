import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { soundcloudService } from '@/lib/soundcloud';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get artist record
    const artist = await prisma.artist.findUnique({
      where: { id: artistId }
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Check if the requesting user owns this artist profile
    if (artist.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    if (body.soundcloudUserId) {
      // New connection - sync data from SoundCloud
      await soundcloudService.syncUserData(artistId, body.soundcloudUserId);
    } else if (artist.soundcloudUserId) {
      // Re-sync existing connection
      await soundcloudService.syncUserData(artistId, artist.soundcloudUserId);
    } else {
      return NextResponse.json(
        { error: 'No SoundCloud user ID provided' },
        { status: 400 }
      );
    }

    // Get updated artist data
    const updatedArtist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        soundcloudTracks: {
          orderBy: {
            playbackCount: 'desc'
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'SoundCloud sync completed successfully',
      artist: {
        soundcloudUserId: updatedArtist?.soundcloudUserId,
        soundcloudUsername: updatedArtist?.soundcloudUsername,
        soundcloudVerified: updatedArtist?.soundcloudVerified,
        soundcloudFollowers: updatedArtist?.soundcloudFollowers,
        soundcloudTrackCount: updatedArtist?.soundcloudTrackCount,
        soundcloudPlaylistCount: updatedArtist?.soundcloudPlaylistCount,
        lastSoundCloudSync: updatedArtist?.lastSoundCloudSync,
        trackCount: updatedArtist?.soundcloudTracks.length || 0
      }
    });
  } catch (error) {
    logger.error('Failed to sync SoundCloud data', error);
    return NextResponse.json(
      { error: 'Failed to sync SoundCloud data' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get artist record
    const artist = await prisma.artist.findUnique({
      where: { id: artistId }
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Check if the requesting user owns this artist profile
    if (artist.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Disconnect SoundCloud and remove synced data
    await prisma.$transaction([
      // Delete all SoundCloud tracks for this artist
      prisma.soundCloudTrack.deleteMany({
        where: { artistId }
      }),
      // Reset SoundCloud fields on artist
      prisma.artist.update({
        where: { id: artistId },
        data: {
          soundcloudUserId: null,
          soundcloudUsername: null,
          soundcloudVerified: false,
          soundcloudFollowers: null,
          soundcloudTrackCount: null,
          soundcloudPlaylistCount: null,
          lastSoundCloudSync: null,
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: 'SoundCloud disconnected successfully'
    });
  } catch (error) {
    logger.error('Failed to disconnect SoundCloud', error);
    return NextResponse.json(
      { error: 'Failed to disconnect SoundCloud' },
      { status: 500 }
    );
  }
}