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

    const { artistId } = params;

    // Get artist with SoundCloud data
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        soundcloudTracks: {
          orderBy: {
            playbackCount: 'desc'
          }
        }
      }
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Check if the requesting user owns this artist profile or is an admin
    if (artist.userId !== session.user.id && session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      artist: {
        id: artist.id,
        soundcloudUserId: artist.soundcloudUserId,
        soundcloudUsername: artist.soundcloudUsername,
        soundcloudVerified: artist.soundcloudVerified,
        soundcloudFollowers: artist.soundcloudFollowers,
        soundcloudTrackCount: artist.soundcloudTrackCount,
        soundcloudPlaylistCount: artist.soundcloudPlaylistCount,
        lastSoundCloudSync: artist.lastSoundCloudSync,
        tracks: artist.soundcloudTracks.map(track => ({
          id: track.id,
          soundcloudId: track.soundcloudId,
          title: track.title,
          description: track.description,
          durationMs: track.durationMs,
          playbackCount: track.playbackCount,
          likesCount: track.likesCount,
          streamUrl: track.streamUrl,
          soundcloudUrl: track.soundcloudUrl,
          artworkUrl: track.artworkUrl,
          waveformUrl: track.waveformUrl,
          isStreamable: track.isStreamable,
          genre: track.genre,
          tags: track.tags,
          isDownloadable: track.isDownloadable,
          license: track.license,
          createdAt: track.createdAt,
          updatedAt: track.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching SoundCloud artist data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist data' },
      { status: 500 }
    );
  }
}