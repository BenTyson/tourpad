import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/tour-segments/[id] - Update existing tour segment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: segmentId } = await params;

    // Ensure user is an artist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { artist: true }
    });

    if (!user?.artist) {
      return NextResponse.json({ error: 'Artist profile required' }, { status: 403 });
    }

    // Check if segment exists and belongs to this artist
    const existingSegment = await prisma.tourSegment.findFirst({
      where: {
        id: segmentId,
        artistId: user.artist.id
      },
      include: {
        stateRanges: true
      }
    });

    if (!existingSegment) {
      return NextResponse.json({ error: 'Tour segment not found' }, { status: 404 });
    }

    const data = await request.json();

    // Validate state ranges if provided
    if (data.stateRanges && Array.isArray(data.stateRanges)) {
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
        
        // Check for overlapping state ranges (excluding current segment)
        const overlapping = await prisma.tourStateRange.findFirst({
          where: {
            tourSegment: {
              artistId: user.artist.id,
              id: { not: segmentId }
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
    }

    // Update tour segment
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
    
    // Handle state ranges update
    if (data.stateRanges && Array.isArray(data.stateRanges)) {
      // Delete existing state ranges and create new ones
      await prisma.tourStateRange.deleteMany({
        where: {
          tourSegmentId: segmentId
        }
      });
      
      updateData.stateRanges = {
        create: data.stateRanges.map((stateRange: any) => ({
          state: stateRange.state,
          startDate: new Date(stateRange.startDate),
          endDate: new Date(stateRange.endDate),
          cities: stateRange.cities || [],
          notes: stateRange.notes || ''
        }))
      };
    }
    
    const updatedSegment = await prisma.tourSegment.update({
      where: { id: segmentId },
      data: updateData,
      include: {
        stateRanges: {
          orderBy: {
            startDate: 'asc'
          }
        }
      }
    });

    return NextResponse.json(updatedSegment);
  } catch (error) {
    console.error('Error updating tour segment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/tour-segments/[id] - Delete tour segment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: segmentId } = await params;

    // Ensure user is an artist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { artist: true }
    });

    if (!user?.artist) {
      return NextResponse.json({ error: 'Artist profile required' }, { status: 403 });
    }

    // Check if segment exists and belongs to this artist
    const existingSegment = await prisma.tourSegment.findFirst({
      where: {
        id: segmentId,
        artistId: user.artist.id
      }
    });

    if (!existingSegment) {
      return NextResponse.json({ error: 'Tour segment not found' }, { status: 404 });
    }

    // Delete the tour segment
    await prisma.tourSegment.delete({
      where: { id: segmentId }
    });

    return NextResponse.json({ success: true, message: 'Tour segment deleted' });
  } catch (error) {
    console.error('Error deleting tour segment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}