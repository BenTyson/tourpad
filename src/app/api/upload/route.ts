import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('=== UPLOAD API START ===');
    const session = await auth();
    console.log('Session check:', session ? 'FOUND' : 'NOT FOUND');
    
    if (!session?.user?.id) {
      console.log('Upload failed: No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('User ID:', session.user.id);
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'profile', 'band', 'venue', etc.
    const category = formData.get('category') as string;
    
    console.log('Upload params:', { fileName: file?.name, type, category });
    
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
    console.log('Converting file to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileExtension = file.type.split('/')[1];
    const fileName = `${session.user.id}-${type}-${Date.now()}.${fileExtension}`;
    console.log('Generated filename:', fileName);
    
    // Save to storage/uploads directory (outside public for performance)
    const uploadDir = path.join(process.cwd(), 'storage', 'uploads');
    const filePath = path.join(uploadDir, fileName);
    console.log('Upload directory:', uploadDir);
    console.log('File path:', filePath);
    
    // Create directory if it doesn't exist
    console.log('Creating directory...');
    const { mkdir } = await import('fs/promises');
    await mkdir(uploadDir, { recursive: true });
    console.log('Directory created successfully');
    
    // Write file
    console.log('Writing file...');
    await writeFile(filePath, buffer);
    console.log('File written successfully');
    
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
      console.log('Attempting to create venue photo for user:', session.user.id);
      const host = await prisma.host.findUnique({
        where: { userId: session.user.id }
      });
      
      console.log('Found host:', host ? host.id : 'NOT FOUND');
      
      if (host) {
        const mediaRecord = await prisma.hostMedia.create({
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
        console.log('Created HostMedia record:', mediaRecord.id);
      } else {
        console.error('No host found for user:', session.user.id);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      fileName: fileName
    });
    
  } catch (error) {
    console.error('=== UPLOAD API ERROR ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Full error object:', error);
    
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}