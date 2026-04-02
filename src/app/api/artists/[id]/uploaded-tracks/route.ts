import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artistId } = await params;

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { artist: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isOwner = currentUser.artist?.id === artistId;
    const isAdmin = currentUser.userType === 'ADMIN';

    if (!isOwner && !isAdmin) {
      // For non-owners, only return public tracks
      const publicTracks = await prisma.uploadedTrack.findMany({
        where: {
          artistId: artistId,
          isPublic: true,
          processingStatus: 'READY'
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          title: true,
          artistName: true,
          album: true,
          genre: true,
          year: true,
          durationMs: true,
          filePath: true,
          fileSize: true,
          processingStatus: true,
          createdAt: true
        }
      });

      return NextResponse.json({
        tracks: publicTracks.map(track => ({
          ...track,
          fileUrl: track.filePath
        }))
      });
    }

    // For owners and admins, return all tracks
    const tracks = await prisma.uploadedTrack.findMany({
      where: {
        artistId: artistId
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      tracks: tracks.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artistName,
        album: track.album,
        genre: track.genre,
        year: track.year,
        trackNumber: track.trackNumber,
        durationMs: track.durationMs,
        originalFilename: track.originalFilename,
        filename: track.filename,
        fileUrl: track.filePath,
        fileSize: track.fileSize,
        mimeType: track.mimeType,
        bitrate: track.bitrate,
        sampleRate: track.sampleRate,
        channels: track.channels,
        description: track.description,
        lyrics: track.lyrics,
        isPublic: track.isPublic,
        sortOrder: track.sortOrder,
        processingStatus: track.processingStatus,
        errorMessage: track.errorMessage,
        createdAt: track.createdAt,
        updatedAt: track.updatedAt
      }))
    });

  } catch (error) {
    logger.error('Failed to fetch uploaded tracks', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch uploaded tracks',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artistId } = await params;
    const url = new URL(req.url);
    const trackId = url.searchParams.get('trackId');

    if (!trackId) {
      return NextResponse.json({ error: 'Track ID required' }, { status: 400 });
    }

    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { artist: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user owns this artist profile
    if (currentUser.artist?.id !== artistId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Find the track
    const track = await prisma.uploadedTrack.findFirst({
      where: {
        id: trackId,
        artistId: artistId
      }
    });

    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    // Soft delete - mark as deleted but keep record
    await prisma.uploadedTrack.update({
      where: { id: trackId },
      data: {
        processingStatus: 'DELETED',
        isPublic: false
      }
    });

    // DEFERRED: File storage cleanup requires cloud storage integration
    // await deleteFile(track.filePath);

    return NextResponse.json({ success: true });

  } catch (error) {
    logger.error('Failed to delete track', error);
    return NextResponse.json(
      { error: 'Failed to delete track' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artistId } = await params;
    const body = await req.json();
    const { trackId, ...updates } = body;

    if (!trackId) {
      return NextResponse.json({ error: 'Track ID required' }, { status: 400 });
    }

    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { artist: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user owns this artist profile
    if (currentUser.artist?.id !== artistId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate updates
    const allowedUpdates = ['title', 'description', 'isPublic', 'sortOrder'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    // Update the track
    const updatedTrack = await prisma.uploadedTrack.update({
      where: {
        id: trackId,
        artistId: artistId
      },
      data: filteredUpdates
    });

    return NextResponse.json({
      success: true,
      track: {
        id: updatedTrack.id,
        title: updatedTrack.title,
        description: updatedTrack.description,
        isPublic: updatedTrack.isPublic,
        sortOrder: updatedTrack.sortOrder,
        updatedAt: updatedTrack.updatedAt
      }
    });

  } catch (error) {
    logger.error('Failed to update track', error);
    return NextResponse.json(
      { error: 'Failed to update track' }, 
      { status: 500 }
    );
  }
}