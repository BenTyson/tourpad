import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('=== UPLOADED TRACKS API START ===');
  console.log('Params received:', params);
  console.log('Uploaded tracks API called for artist:', params.id);
  console.log('Prisma instance:', typeof prisma, !!prisma);
  console.log('Prisma.uploadedTrack:', typeof prisma?.uploadedTrack);
  
  try {
    const artistId = params.id;

    // Get session for authentication
    const session = await auth();
    console.log('Session found:', !!session?.user?.email);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { artist: true }
    });

    console.log('Current user found:', currentUser?.email);
    console.log('User has artist profile:', !!currentUser?.artist);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if requesting user owns this artist profile or is admin
    const isOwner = currentUser.artist?.id === artistId;
    const isAdmin = currentUser.userType === 'ADMIN';

    console.log('Access check:', {
      artistId,
      currentUserArtistId: currentUser.artist?.id,
      isOwner,
      isAdmin
    });

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
    console.error('=== ERROR IN UPLOADED TRACKS API ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
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
  { params }: { params: { id: string } }
) {
  try {
    const artistId = params.id;
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

    // TODO: In production, also delete the actual file from storage
    // await deleteFile(track.filePath);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting track:', error);
    return NextResponse.json(
      { error: 'Failed to delete track' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artistId = params.id;
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
    console.error('Error updating track:', error);
    return NextResponse.json(
      { error: 'Failed to update track' }, 
      { status: 500 }
    );
  }
}