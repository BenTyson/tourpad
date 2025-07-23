import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    console.log('=== GET /api/bookings called ===');
    const session = await auth();
    console.log('Session:', { userId: session?.user?.id, userType: session?.user?.type });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // First, find the user's artist or host profile IDs
    const artist = await prisma.artist.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    
    const host = await prisma.host.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    
    console.log('User profiles found:', { artist: artist?.id, host: host?.id });

    // Build where clause based on user type
    let whereClause: any = {};
    
    // Admin users see all bookings
    if (session.user.type === 'admin') {
      // Admin sees all bookings - no user restriction
      whereClause = {};
      console.log('Admin user - showing all bookings');
    } else {
      // Regular users only see their own bookings
      whereClause.OR = [];
      
      if (artist) {
        whereClause.OR.push({ artistId: artist.id });
      }
      
      if (host) {
        whereClause.OR.push({ hostId: host.id });
      }
      
      // If user has no artist or host profile, return empty results
      if (whereClause.OR.length === 0) {
        return NextResponse.json({
          bookings: [],
          pagination: { total: 0, limit, offset }
        });
      }
    }

    // Add status filter if provided
    if (status) {
      whereClause.status = status.toUpperCase();
    }

    console.log('Querying with whereClause:', JSON.stringify(whereClause, null, 2));
    
    const bookings = await prisma.booking.findMany({
      where: whereClause,
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
      },
      orderBy: {
        requestedDate: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Transform to match frontend expectations
    const transformedBookings = bookings.map(booking => ({
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
      doorFee: booking.doorFee,
      doorFeeStatus: booking.doorFeeStatus,
      artistMessage: booking.artistMessage,
      hostResponse: booking.hostResponse,
      lodgingRequested: booking.lodgingRequested,
      lodgingDetails: booking.lodgingDetails,
      requestedAt: booking.requestedAt,
      respondedAt: booking.respondedAt,
      confirmationDeadline: booking.confirmationDeadline,
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
        profileImageUrl: booking.host.user.profileImageUrl,
        city: booking.host.city,
        state: booking.host.state
      },
      specialRequirements: null, // TODO: Add this field if needed
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
    }));

    return NextResponse.json({
      bookings: transformedBookings,
      pagination: {
        total: await prisma.booking.count({ where: whereClause }),
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking request
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['hostId', 'requestedDate', 'expectedAttendance', 'artistMessage'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Verify the artist exists
    const artist = await prisma.artist.findUnique({
      where: { userId: session.user.id }
    });

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist profile not found' },
        { status: 404 }
      );
    }

    // Verify the host exists
    const host = await prisma.host.findUnique({
      where: { id: data.hostId }
    });

    if (!host) {
      return NextResponse.json(
        { error: 'Host not found' },
        { status: 404 }
      );
    }

    // Parse the requested date and time
    const requestedDate = new Date(data.requestedDate);
    let requestedTime = null;
    
    if (data.requestedTime) {
      // Combine date and time
      const [hours, minutes] = data.requestedTime.split(':');
      requestedTime = new Date(requestedDate);
      requestedTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        artistId: artist.id,
        hostId: data.hostId,
        requestedDate,
        requestedTime,
        estimatedDuration: data.estimatedDuration || 120, // Default 2 hours
        expectedAttendance: parseInt(data.expectedAttendance),
        doorFee: data.doorFee ? parseInt(data.doorFee) : null,
        artistMessage: data.artistMessage,
        lodgingRequested: Boolean(data.lodgingRequested),
        lodgingDetails: data.lodgingRequested ? data.lodgingDetails : null,
        status: 'PENDING'
      },
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

    // TODO: Send notification to host about new booking request
    
    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        artistId: booking.artistId,
        hostId: booking.hostId,
        artistName: booking.artist.user.name,
        hostName: booking.host.user.name,
        venueName: booking.host.venueName,
        requestedDate: booking.requestedDate,
        requestedTime: booking.requestedTime,
        status: booking.status,
        artistMessage: booking.artistMessage,
        lodgingRequested: booking.lodgingRequested
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking request' },
      { status: 500 }
    );
  }
}
