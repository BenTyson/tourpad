// Cloud storage utilities for file uploads
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'tourpad-media';
const CDN_DOMAIN = process.env.CLOUDFRONT_DOMAIN || '';

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  contentType: string;
}

// Generate unique file key
export function generateFileKey(userId: string, category: string, originalName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const fileExt = originalName.split('.').pop()?.toLowerCase() || '';
  return `${category}/${userId}/${timestamp}-${randomStr}.${fileExt}`;
}

// Upload file to S3
export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
      // Set cache control for optimization
      CacheControl: 'max-age=31536000', // 1 year
      // Make publicly readable
      ACL: 'public-read'
    });

    await s3Client.send(command);

    // Generate public URL
    const url = CDN_DOMAIN 
      ? `https://${CDN_DOMAIN}/${key}`
      : `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION || 'us-east-1'}.amazonaws.com/${key}`;

    return {
      url,
      key,
      size: buffer.length,
      contentType
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file');
  }
}

// Generate presigned URL for secure uploads
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read'
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}

// Delete file from S3
export async function deleteFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete file');
  }
}

// Generate presigned URL for downloading
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

// Validate file type and size
export function validateFile(file: Buffer, filename: string, maxSizeMB: number = 50): {
  valid: boolean;
  error?: string;
  contentType?: string;
} {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.length > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`
    };
  }

  // Detect content type from file signature
  const contentType = getContentTypeFromBuffer(file, filename);
  if (!contentType) {
    return {
      valid: false,
      error: 'Unsupported file type'
    };
  }

  return {
    valid: true,
    contentType
  };
}

// Get content type from file buffer
function getContentTypeFromBuffer(buffer: Buffer, filename: string): string | null {
  const fileExt = filename.split('.').pop()?.toLowerCase();
  
  // Check file signature (magic bytes)
  const signature = buffer.subarray(0, 8).toString('hex').toUpperCase();
  
  // Image types
  if (signature.startsWith('FFD8FF')) return 'image/jpeg';
  if (signature.startsWith('89504E47')) return 'image/png';
  if (signature.startsWith('47494638')) return 'image/gif';
  if (signature.startsWith('52494646') && buffer.subarray(8, 12).toString() === 'WEBP') {
    return 'image/webp';
  }
  
  // Video types
  if (signature.includes('667479706D703432') || signature.includes('667479706D703431')) {
    return 'video/mp4';
  }
  if (signature.includes('6674797071742020')) return 'video/quicktime';
  
  // Audio types
  if (signature.startsWith('494433') || signature.startsWith('FFFB') || signature.startsWith('FFF3')) {
    return 'audio/mpeg';
  }
  if (signature.startsWith('52494646') && buffer.subarray(8, 12).toString() === 'WAVE') {
    return 'audio/wav';
  }
  
  // Fallback to file extension
  const extToType: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav'
  };
  
  return fileExt ? extToType[fileExt] || null : null;
}

// Image processing utilities (placeholder for future implementation)
export async function processImage(
  buffer: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<Buffer> {
  // TODO: Implement image processing with Sharp or similar
  // For now, return original buffer
  return buffer;
}

// Generate thumbnail
export async function generateThumbnail(
  buffer: Buffer,
  size: number = 300
): Promise<Buffer> {
  // TODO: Implement thumbnail generation
  // For now, return original buffer
  return buffer;
}

// Fallback local storage for development
export class LocalStorageAdapter {
  private uploadsDir: string;

  constructor(uploadsDir: string = './uploads') {
    this.uploadsDir = uploadsDir;
  }

  async upload(buffer: Buffer, key: string, contentType: string): Promise<UploadResult> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    try {
      // Ensure upload directory exists
      const fullPath = path.join(this.uploadsDir, key);
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });
      
      // Write file
      await fs.writeFile(fullPath, buffer);
      
      return {
        url: `/uploads/${key}`,
        key,
        size: buffer.length,
        contentType
      };
    } catch (error) {
      console.error('Error uploading to local storage:', error);
      throw new Error('Failed to upload file locally');
    }
  }

  async delete(key: string): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    try {
      const fullPath = path.join(this.uploadsDir, key);
      await fs.unlink(fullPath);
    } catch (error) {
      // Ignore file not found errors
      if ((error as any).code !== 'ENOENT') {
        console.error('Error deleting from local storage:', error);
      }
    }
  }
}

// Storage adapter factory
export function createStorageAdapter() {
  if (process.env.NODE_ENV === 'production' && process.env.AWS_ACCESS_KEY_ID) {
    return {
      upload: uploadToS3,
      delete: deleteFromS3,
      generateUploadUrl: generatePresignedUploadUrl,
      generateDownloadUrl: generatePresignedDownloadUrl
    };
  } else {
    const localAdapter = new LocalStorageAdapter();
    return {
      upload: localAdapter.upload.bind(localAdapter),
      delete: localAdapter.delete.bind(localAdapter),
      generateUploadUrl: async () => { throw new Error('Presigned URLs not supported in development'); },
      generateDownloadUrl: async () => { throw new Error('Presigned URLs not supported in development'); }
    };
  }
}
