import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/tour-segments - List artist's tour segments
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user is an artist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { artist: true }
    });

    if (!user?.artist) {
      return NextResponse.json({ error: 'Artist profile required' }, { status: 403 });
    }

    const tourSegments = await prisma.tourSegment.findMany({
      where: {
        artistId: user.artist.id,
        isPublic: true // Only return public segments for now
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
    console.error('Error fetching tour segments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tour-segments - Create new tour segment
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user is an artist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { artist: true }
    });

    if (!user?.artist) {
      return NextResponse.json({ error: 'Artist profile required' }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.stateRanges || !Array.isArray(data.stateRanges) || data.stateRanges.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required fields: name and stateRanges' 
      }, { status: 400 });
    }

    // Validate each state range
    for (const stateRange of data.stateRanges) {
      if (!stateRange.state || !stateRange.startDate || !stateRange.endDate) {
        return NextResponse.json({ 
          error: 'Each state range must have state, startDate, and endDate' 
        }, { status: 400 });
      }
      
      const startDate = new Date(stateRange.startDate);
      const endDate = new Date(stateRange.endDate);
      
      if (startDate >= endDate) {
        return NextResponse.json({ 
          error: `End date must be after start date for state ${stateRange.state}` 
        }, { status: 400 });
      }
    }

    // Check for overlapping state ranges within artist's existing tours
    for (const stateRange of data.stateRanges) {
      const startDate = new Date(stateRange.startDate);
      const endDate = new Date(stateRange.endDate);
      
      const overlapping = await prisma.tourStateRange.findFirst({
        where: {
          tourSegment: {
            artistId: user.artist.id
          },
          state: stateRange.state,
          OR: [
            {
              startDate: {
                lte: endDate
              },
              endDate: {
                gte: startDate
              }
            }
          ]
        },
        include: {
          tourSegment: true
        }
      });

      if (overlapping) {
        return NextResponse.json({ 
          error: `State ${stateRange.state} overlaps with existing tour: ${overlapping.tourSegment.name}` 
        }, { status: 400 });
      }
    }

    // Create tour segment with state ranges
    const tourSegment = await prisma.tourSegment.create({
      data: {
        artistId: user.artist.id,
        name: data.name,
        description: data.description || '',
        status: data.status || 'planned',
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        stateRanges: {
          create: data.stateRanges.map((stateRange: any) => ({
            state: stateRange.state,
            startDate: new Date(stateRange.startDate),
            endDate: new Date(stateRange.endDate),
            cities: stateRange.cities || [],
            notes: stateRange.notes || ''
          }))
        }
      },
      include: {
        stateRanges: {
          orderBy: {
            startDate: 'asc'
          }
        }
      }
    });

    return NextResponse.json(tourSegment, { status: 201 });
  } catch (error) {
    console.error('Error creating tour segment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}