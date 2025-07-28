import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configure for file uploads
export const runtime = 'nodejs';

interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  year?: number;
  trackNumber?: number;
  durationMs?: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
}

export async function POST(req: NextRequest) {
  console.log('MP3 Upload endpoint called');
  
  try {
    // Check authentication
    const session = await auth();
    console.log('Session:', session?.user?.email ? 'Found' : 'Not found');
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized - No session found' }, { status: 401 });
    }

    // Get current user from database
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { artist: true }
    });

    console.log('Current user found:', currentUser?.email);
    console.log('User type:', currentUser?.userType);
    console.log('Has artist profile:', !!currentUser?.artist);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Check if user is an artist
    if (currentUser.userType !== 'ARTIST' || !currentUser.artist) {
      return NextResponse.json({ 
        error: 'Only artists can upload music',
        userType: currentUser.userType,
        hasArtist: !!currentUser.artist 
      }, { status: 403 });
    }

    // Parse form data
    console.log('Parsing form data...');
    const formData = await req.formData();
    
    // Debug what's in the form data
    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, typeof value, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
    }
    
    const file = formData.get('file') as File;
    const artistId = formData.get('artistId') as string;
    const metadataString = formData.get('metadata') as string;

    console.log('Form data parsed:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      artistId,
      hasMetadata: !!metadataString
    });

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate artist ID matches current user
    console.log('Upload validation:', {
      providedArtistId: artistId,
      currentUserArtistId: currentUser.artist?.id,
      userType: currentUser.userType,
      hasArtist: !!currentUser.artist
    });
    
    if (!artistId || artistId !== currentUser.artist?.id) {
      return NextResponse.json({ 
        error: 'Invalid artist ID',
        details: {
          provided: artistId,
          expected: currentUser.artist?.id
        }
      }, { status: 403 });
    }

    // Validate file type
    const fileType = file.type || '';
    const fileName = file.name || '';
    
    console.log('File validation:', { fileType, fileName, size: file.size });
    
    // Accept files that either have audio MIME type OR end with .mp3
    const isValidMimeType = fileType.includes('audio') || fileType === 'audio/mpeg' || fileType === 'audio/mp3';
    const isValidExtension = fileName.toLowerCase().endsWith('.mp3');
    
    if (!isValidMimeType && !isValidExtension) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only MP3 files are allowed.',
        fileType,
        fileName,
        validMimeType: isValidMimeType,
        validExtension: isValidExtension
      }, { status: 400 });
    }

    // Validate file size (25MB limit)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 25MB.' }, { status: 400 });
    }

    // Parse metadata if provided
    let metadata: Partial<AudioMetadata> = {};
    if (metadataString) {
      try {
        metadata = JSON.parse(metadataString);
      } catch (error) {
        console.error('Error parsing metadata:', error);
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = '.mp3';
    const filename = `${timestamp}-${randomString}${fileExtension}`;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'music');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // File path for storage
    const filePath = join(uploadsDir, filename);
    const relativeFilePath = `/uploads/music/${filename}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Extract basic audio metadata (you would use a library like node-ffprobe or music-metadata in production)
    const basicMetadata = await extractBasicMetadata(buffer, file.name, metadata);

    // Save to database
    const uploadedTrack = await prisma.uploadedTrack.create({
      data: {
        artistId: currentUser.artist.id,
        title: basicMetadata.title || file.name.replace(/\.mp3$/i, ''),
        artistName: basicMetadata.artist,
        album: basicMetadata.album,
        genre: basicMetadata.genre,
        year: basicMetadata.year,
        trackNumber: basicMetadata.trackNumber,
        durationMs: basicMetadata.durationMs,
        originalFilename: file.name,
        filename: filename,
        filePath: relativeFilePath,
        fileSize: file.size,
        mimeType: file.type || 'audio/mpeg',
        bitrate: basicMetadata.bitrate,
        sampleRate: basicMetadata.sampleRate,
        channels: basicMetadata.channels,
        processingStatus: 'READY', // In production, you might process the file further
        sortOrder: 0 // Default sort order
      }
    });

    return NextResponse.json({
      success: true,
      track: {
        id: uploadedTrack.id,
        title: uploadedTrack.title,
        artist: uploadedTrack.artistName,
        album: uploadedTrack.album,
        genre: uploadedTrack.genre,
        year: uploadedTrack.year,
        durationMs: uploadedTrack.durationMs,
        fileUrl: uploadedTrack.filePath,
        fileSize: uploadedTrack.fileSize,
        processingStatus: uploadedTrack.processingStatus,
        createdAt: uploadedTrack.createdAt
      }
    });

  } catch (error) {
    console.error('MP3 upload error:', error);
    
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('Error details:', { errorMessage, errorStack });
    
    return NextResponse.json(
      { 
        error: 'Failed to upload MP3 file',
        details: errorMessage,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// Basic metadata extraction function
// In production, you would use a library like music-metadata or node-ffprobe
async function extractBasicMetadata(
  buffer: Buffer, 
  filename: string, 
  userMetadata: Partial<AudioMetadata>
): Promise<AudioMetadata> {
  // For now, we'll use simple filename parsing and user-provided metadata
  // In production, you would extract this from the actual MP3 file
  
  const name = filename.replace(/\.mp3$/i, '');
  const parts = name.split(' - ');
  
  return {
    title: userMetadata.title || (parts.length > 1 ? parts[1] : name),
    artist: userMetadata.artist || (parts.length > 1 ? parts[0] : undefined),
    album: userMetadata.album,
    genre: userMetadata.genre,
    year: userMetadata.year,
    trackNumber: userMetadata.trackNumber,
    durationMs: userMetadata.durationMs, // Would be extracted from file in production
    bitrate: userMetadata.bitrate, // Would be extracted from file in production
    sampleRate: userMetadata.sampleRate || 44100, // Common default
    channels: userMetadata.channels || 2 // Stereo default
  };
}