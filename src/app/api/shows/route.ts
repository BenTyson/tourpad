import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/shows - Get upcoming confirmed shows
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's artist or host profile
    const artist = await prisma.artist.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    
    const host = await prisma.host.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });

    // Build query based on user type
    const whereClause: any = {
      status: 'CONFIRMED',
      requestedDate: {
        gte: new Date() // Only future shows
      }
    };

    if (artist) {
      whereClause.artistId = artist.id;
    } else if (host) {
      whereClause.hostId = host.id;
    } else if (session.user.type === 'ADMIN') {
      // Admins see all confirmed shows
    } else {
      // No artist/host profile
      return NextResponse.json({ shows: [] });
    }

    const shows = await prisma.booking.findMany({
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
        }
      },
      orderBy: {
        requestedDate: 'asc'
      }
    });

    // Transform for frontend
    const transformedShows = shows.map(show => ({
      id: show.id,
      artistId: show.artistId,
      hostId: show.hostId,
      artistName: show.artist.user.name,
      hostName: show.host.user.name,
      venueName: show.host.venueName,
      city: show.host.city,
      state: show.host.state,
      date: show.requestedDate,
      time: show.requestedTime,
      doorFee: show.doorFee,
      expectedAttendance: show.expectedAttendance,
      confirmedAt: show.confirmedAt,
      artist: {
        id: show.artist.id,
        name: show.artist.user.name,
        profileImageUrl: show.artist.user.profileImageUrl
      },
      host: {
        id: show.host.id,
        name: show.host.user.name,
        venueName: show.host.venueName,
        city: show.host.city,
        state: show.host.state,
        profileImageUrl: show.host.user.profileImageUrl
      }
    }));

    return NextResponse.json({ shows: transformedShows });
  } catch (error) {
    console.error('Error fetching shows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shows' },
      { status: 500 }
    );
  }
}