import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    
    // Optional: Add authentication check for private files
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { path: pathSegments } = await params;
    const filePath = pathSegments.join('/');
    
    // Security: Prevent directory traversal
    if (filePath.includes('..') || filePath.includes('~')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    // Construct full file path
    const fullPath = path.join(process.cwd(), 'storage', 'uploads', filePath);
    
    try {
      // Check if file exists and get stats
      const fileStats = await stat(fullPath);
      
      if (!fileStats.isFile()) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }

      // Read file
      const fileBuffer = await readFile(fullPath);
      
      // Determine content type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      let contentType = 'application/octet-stream';
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.webp':
          contentType = 'image/webp';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
        case '.pdf':
          contentType = 'application/pdf';
          break;
        case '.mp4':
          contentType = 'video/mp4';
          break;
        case '.mp3':
          contentType = 'audio/mpeg';
          break;
        case '.wav':
          contentType = 'audio/wav';
          break;
      }

      // Set cache headers for better performance
      const headers = new Headers({
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Last-Modified': fileStats.mtime.toUTCString(),
        'ETag': `"${fileStats.size}-${fileStats.mtime.getTime()}"`,
      });

      // Handle conditional requests for better performance
      const ifNoneMatch = request.headers.get('if-none-match');
      const ifModifiedSince = request.headers.get('if-modified-since');
      
      const etag = headers.get('ETag');
      const lastModified = headers.get('Last-Modified');
      
      if (ifNoneMatch === etag || 
          (ifModifiedSince && lastModified && new Date(ifModifiedSince) >= fileStats.mtime)) {
        return new NextResponse(null, { status: 304, headers });
      }

      return new NextResponse(fileBuffer, { headers });
      
    } catch (fileError: any) {
      if (fileError.code === 'ENOENT') {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      throw fileError;
    }
    
  } catch (error) {
    console.error('File serving error:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}