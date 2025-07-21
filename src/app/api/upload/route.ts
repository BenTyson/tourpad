import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'profile', 'band', 'venue', etc.
    const category = formData.get('category') as string;
    
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileExtension = file.type.split('/')[1];
    const fileName = `${session.user.id}-${type}-${Date.now()}.${fileExtension}`;
    
    // Save to storage/uploads directory (outside public for performance)
    const uploadDir = path.join(process.cwd(), 'storage', 'uploads');
    const filePath = path.join(uploadDir, fileName);
    
    // Create directory if it doesn't exist
    const { mkdir } = await import('fs/promises');
    await mkdir(uploadDir, { recursive: true });
    
    // Write file
    await writeFile(filePath, buffer);
    
    // Return the public URL
    const publicUrl = `/uploads/${fileName}`;
    
    // If it's a profile photo, update the user profile
    if (type === 'profile') {
      await prisma.userProfile.update({
        where: { userId: session.user.id },
        data: { profileImageUrl: publicUrl }
      });
    }
    
    // If it's a venue photo, create HostMedia record
    if (type === 'venue' && category) {
      const host = await prisma.host.findUnique({
        where: { userId: session.user.id }
      });
      
      if (host) {
        await prisma.hostMedia.create({
          data: {
            hostId: host.id,
            mediaType: 'PHOTO',
            category: category,
            fileUrl: publicUrl,
            fileSize: buffer.length,
            mimeType: file.type,
            title: file.name,
            sortOrder: 0
          }
        });
      }
    }
    
    // If it's an artist photo, create ArtistMedia record
    if (type === 'artist' && category) {
      console.log('Attempting to create artist photo for user:', session.user.id);
      const artist = await prisma.artist.findUnique({
        where: { userId: session.user.id }
      });
      
      console.log('Found artist:', artist ? artist.id : 'NOT FOUND');
      
      if (artist) {
        const mediaRecord = await prisma.artistMedia.create({
          data: {
            artistId: artist.id,
            mediaType: 'PHOTO',
            category: category,
            fileUrl: publicUrl,
            fileSize: buffer.length,
            mimeType: file.type,
            title: file.name,
            sortOrder: 0
          }
        });
        console.log('Created ArtistMedia record:', mediaRecord.id);
      } else {
        console.error('No artist found for user:', session.user.id);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      fileName: fileName
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file'
    }, { status: 500 });
  }
}