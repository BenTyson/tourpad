import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';
import { processImage, generateThumbnail } from '@/lib/storage';
import { apiSuccess, ApiErrors } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return ApiErrors.unauthorized();
    }

    if (!rateLimit(`upload:${session.user.id}`, 10, 60000)) {
      return ApiErrors.rateLimited('Too many uploads. Please try again later.');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'profile', 'band', 'venue', etc.
    const category = formData.get('category') as string;
    
    
    if (!file) {
      return ApiErrors.validation('No file provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return ApiErrors.validation('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return ApiErrors.validation('File too large. Maximum size is 5MB.');
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // Process image: resize, strip EXIF, compress
    const buffer = await processImage(rawBuffer, { width: 1920, quality: 80 });
    const thumbBuffer = await generateThumbnail(rawBuffer, 400);

    const fileExtension = file.type.split('/')[1];
    const fileName = `${session.user.id}-${type}-${Date.now()}.${fileExtension}`;
    const thumbFileName = `${session.user.id}-${type}-${Date.now()}-thumb.${fileExtension}`;

    // Save to storage/uploads directory (outside public for performance)
    const uploadDir = path.join(process.cwd(), 'storage', 'uploads');
    const filePath = path.join(uploadDir, fileName);
    const thumbPath = path.join(uploadDir, thumbFileName);

    // Create directory if it doesn't exist
    const { mkdir } = await import('fs/promises');
    await mkdir(uploadDir, { recursive: true });

    // Write processed image and thumbnail
    await writeFile(filePath, buffer);
    await writeFile(thumbPath, thumbBuffer);

    // Return the public URL
    const publicUrl = `/uploads/${fileName}`;
    const thumbnailUrl = `/uploads/${thumbFileName}`;
    
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
      const artist = await prisma.artist.findUnique({
        where: { userId: session.user.id }
      });
      
      if (artist) {
        await prisma.artistMedia.create({
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
      } else {
        logger.error('No artist found for upload user', null, { userId: session.user.id });
      }
    }
    
    return apiSuccess({
      url: publicUrl,
      thumbnailUrl,
      fileName: fileName
    });

  } catch (error) {
    logger.error('Failed to upload file', error);
    return ApiErrors.internal('Failed to upload file');
  }
}