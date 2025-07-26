import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/artists/[id]/tour-segments - Get public tour segments for a specific artist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artistId } = await params;
    
    if (!artistId) {
      return NextResponse.json({ error: 'Artist ID required' }, { status: 400 });
    }

    // Find the artist first to get their database ID
    const artist = await prisma.artist.findFirst({
      where: {
        OR: [
          { id: artistId },
          { userId: artistId }
        ]
      }
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Get public tour segments for this artist
    const tourSegments = await prisma.tourSegment.findMany({
      where: {
        artistId: artist.id,
        isPublic: true
      },
      include: {
        stateRanges: {
          orderBy: {
            startDate: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(tourSegments);
  } catch (error) {
    console.error('Error fetching artist tour segments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tour segments',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}