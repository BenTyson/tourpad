import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/bookings/[id] - Get booking by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true
              }
            }
          }
        },
        host: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true
              }
            }
          }
        },
        concert: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if user has permission to view this booking
    // User can view if they're the artist, host, or admin
    const isArtist = booking.artist.userId === session.user.id;
    const isHost = booking.host.userId === session.user.id;
    const isAdmin = session.user.userType === 'ADMIN';

    if (!isArtist && !isHost && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Transform to match frontend expectations
    const transformedBooking = {
      id: booking.id,
      artistId: booking.artistId,
      hostId: booking.hostId,
      artistName: booking.artist.user.name,
      artistEmail: booking.artist.user.email,
      hostName: booking.host.user.name,
      hostEmail: booking.host.user.email,
      venueName: booking.host.venueName,
      requestedDate: booking.requestedDate,
      requestedTime: booking.requestedTime,
      estimatedDuration: booking.estimatedDuration,
      expectedAttendance: booking.expectedAttendance,
      status: booking.status,
      artistFee: booking.artistFee,
      doorFee: booking.doorFee,
      artistMessage: booking.artistMessage,
      hostResponse: booking.hostResponse,
      lodgingRequested: booking.lodgingRequested,
      lodgingDetails: booking.lodgingDetails,
      requestedAt: booking.requestedAt,
      respondedAt: booking.respondedAt,
      confirmedAt: booking.confirmedAt,
      completedAt: booking.completedAt,
      artist: {
        id: booking.artist.id,
        name: booking.artist.user.name,
        email: booking.artist.user.email,
        profileImageUrl: booking.artist.user.profileImageUrl
      },
      host: {
        id: booking.host.id,
        name: booking.host.user.name,
        email: booking.host.user.email,
        venueName: booking.host.venueName,
        profileImageUrl: booking.host.user.profileImageUrl
      },
      concert: booking.concert ? {
        id: booking.concert.id,
        title: booking.concert.title,
        date: booking.concert.date,
        startTime: booking.concert.startTime,
        endTime: booking.concert.endTime,
        maxCapacity: booking.concert.maxCapacity,
        doorFee: booking.concert.doorFee,
        status: booking.concert.status
      } : null
    };

    return NextResponse.json({
      success: true,
      booking: transformedBooking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update booking status
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, hostResponse, artistFee, doorFee } = body;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // First, find the booking to check permissions
    const booking = await prisma.booking.findUnique({ 
      where: { id },
      include: {
        artist: {
          include: { user: true }
        },
        host: {
          include: { user: true }
        }
      }
    });
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check permissions - only artist, host, or admin can update
    const isArtist = booking.artist.userId === session.user.id;
    const isHost = booking.host.userId === session.user.id;
    const isAdmin = session.user.userType === 'ADMIN';
    
    if (!isArtist && !isHost && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };

    if (status) {
      updateData.status = status;
      
      // Set appropriate timestamps based on status
      if (status === 'APPROVED' || status === 'REJECTED') {
        updateData.respondedAt = new Date();
      }
      if (status === 'CONFIRMED') {
        updateData.confirmedAt = new Date();
      }
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
      }
    }

    // Hosts can add response message and fees
    if (isHost && hostResponse !== undefined) {
      updateData.hostResponse = hostResponse;
    }
    
    if (isHost && artistFee !== undefined) {
      updateData.artistFee = artistFee;
    }
    
    if (isHost && doorFee !== undefined) {
      updateData.doorFee = doorFee;
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true
              }
            }
          }
        },
        host: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        hostResponse: updatedBooking.hostResponse,
        artistFee: updatedBooking.artistFee,
        doorFee: updatedBooking.doorFee,
        respondedAt: updatedBooking.respondedAt,
        confirmedAt: updatedBooking.confirmedAt,
        completedAt: updatedBooking.completedAt,
        updatedAt: updatedBooking.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Cancel/delete booking
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions and implement deletion/cancellation
    const booking = await prisma.booking.findUnique({ 
      where: { id },
      include: {
        artist: true,
        host: true
      }
    });
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check permissions
    const isArtist = booking.artist.userId === session.user.id;
    const isHost = booking.host.userId === session.user.id;
    const isAdmin = session.user.userType === 'ADMIN';
    
    if (!isArtist && !isHost && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only allow cancellation if booking is pending/approved or if user is admin
    if (booking.status !== 'PENDING' && booking.status !== 'APPROVED' && !isAdmin) {
      return NextResponse.json({ 
        error: 'Cannot cancel confirmed booking' 
      }, { status: 400 });
    }

    // Update status to cancelled instead of deleting
    await prisma.booking.update({
      where: { id },
      data: { 
        status: 'CANCELLED', 
        updatedAt: new Date() 
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Booking cancelled successfully' 
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
