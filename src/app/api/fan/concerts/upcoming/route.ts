import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/fan/concerts/upcoming - Get fan's upcoming RSVP'd concerts
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a fan
    if (session.user.type !== 'fan') {
      return NextResponse.json({ error: 'Access denied - Fan account required' }, { status: 403 });
    }

    // Get fan profile
    const fan = await prisma.fan.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!fan) {
      return NextResponse.json({ error: 'Fan profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status'); // PENDING, APPROVED, DECLINED, WAITLISTED

    // Build filter for upcoming concerts
    const now = new Date();
    let rsvpFilter: any = {
      fanId: fan.id,
      concert: {
        date: {
          gte: now // Only future concerts
        }
      }
    };

    // Add status filter if provided
    if (status && ['PENDING', 'APPROVED', 'DECLINED', 'WAITLISTED'].includes(status.toUpperCase())) {
      rsvpFilter.status = status.toUpperCase();
    }

    // Get fan's upcoming RSVP'd concerts
    const rsvps = await prisma.fanRSVP.findMany({
      where: rsvpFilter,
      include: {
        concert: {
          include: {
            booking: {
              include: {
                artist: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        profileImageUrl: true
                      }
                    },
                    media: {
                      where: {
                        mediaType: 'PHOTO',
                        category: 'PRESS'
                      },
                      take: 1,
                      orderBy: {
                        sortOrder: 'asc'
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
                        profileImageUrl: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        concert: {
          date: 'asc'
        }
      },
      take: limit,
      skip: offset
    });

    // Transform data for frontend
    const upcomingConcerts = rsvps.map(rsvp => ({
      rsvpId: rsvp.id,
      rsvpStatus: rsvp.status,
      guestsCount: rsvp.guestsCount,
      specialRequests: rsvp.specialRequests,
      rsvpDate: rsvp.rsvpDate,
      statusUpdatedAt: rsvp.statusUpdatedAt,
      concert: {
        id: rsvp.concert.id,
        title: rsvp.concert.title,
        description: rsvp.concert.description,
        date: rsvp.concert.date,
        startTime: rsvp.concert.startTime,
        endTime: rsvp.concert.endTime,
        maxCapacity: rsvp.concert.maxCapacity,
        doorFee: rsvp.concert.doorFee,
        status: rsvp.concert.status,
        isPrivate: rsvp.concert.isPrivate,
        artist: {
          id: rsvp.concert.booking.artist.id,
          name: rsvp.concert.booking.artist.user.name,
          stageName: rsvp.concert.booking.artist.stageName,
          profileImageUrl: rsvp.concert.booking.artist.user.profileImageUrl,
          pressPhoto: rsvp.concert.booking.artist.media[0]?.fileUrl || null
        },
        host: {
          id: rsvp.concert.booking.host.id,
          name: rsvp.concert.booking.host.user.name,
          venueName: rsvp.concert.booking.host.venueName,
          city: rsvp.concert.booking.host.city,
          state: rsvp.concert.booking.host.state,
          profileImageUrl: rsvp.concert.booking.host.user.profileImageUrl
        },
        location: `${rsvp.concert.booking.host.city}, ${rsvp.concert.booking.host.state}`
      }
    }));

    // Get total count for pagination
    const totalCount = await prisma.fanRSVP.count({
      where: rsvpFilter
    });

    return NextResponse.json({
      success: true,
      concerts: upcomingConcerts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching upcoming concerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming concerts' },
      { status: 500 }
    );
  }
}