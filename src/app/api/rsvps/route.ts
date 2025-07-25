import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/rsvps - Get RSVPs (fan or host specific)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType') || session.user.type;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let rsvps;

    if (userType === 'fan') {
      // Get fan's RSVPs
      const fan = await prisma.fan.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
      });

      if (!fan) {
        return NextResponse.json({ error: 'Fan profile not found' }, { status: 404 });
      }

      let whereClause: any = { fanId: fan.id };
      if (status) {
        whereClause.status = status.toUpperCase();
      }

      rsvps = await prisma.fanRSVP.findMany({
        where: whereClause,
        include: {
          concert: {
            include: {
              booking: {
                include: {
                  artist: {
                    include: {
                      user: { select: { id: true, name: true, profileImageUrl: true } },
                      media: {
                        where: { mediaType: 'PHOTO', category: 'PRESS' },
                        take: 1,
                        orderBy: { sortOrder: 'asc' }
                      }
                    }
                  },
                  host: {
                    include: {
                      user: { select: { id: true, name: true, profileImageUrl: true } }
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { rsvpDate: 'desc' },
        take: limit,
        skip: offset
      });

    } else if (userType === 'host') {
      // Get host's RSVP requests
      const host = await prisma.host.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
      });

      if (!host) {
        return NextResponse.json({ error: 'Host profile not found' }, { status: 404 });
      }

      let whereClause: any = {
        concert: {
          booking: {
            hostId: host.id
          }
        }
      };
      
      if (status) {
        whereClause.status = status.toUpperCase();
      }

      rsvps = await prisma.fanRSVP.findMany({
        where: whereClause,
        include: {
          fan: {
            include: {
              user: { select: { id: true, name: true, email: true, profileImageUrl: true } }
            }
          },
          concert: {
            include: {
              booking: {
                include: {
                  artist: {
                    include: {
                      user: { select: { id: true, name: true, profileImageUrl: true } }
                    }
                  },
                  host: {
                    include: {
                      user: { select: { id: true, name: true, profileImageUrl: true } }
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { rsvpDate: 'desc' },
        take: limit,
        skip: offset
      });

    } else {
      return NextResponse.json({ error: 'Invalid user type for RSVP access' }, { status: 403 });
    }

    // Transform data for frontend
    const transformedRSVPs = rsvps.map(rsvp => ({
      id: rsvp.id,
      status: rsvp.status,
      guestsCount: rsvp.guestsCount,
      specialRequests: rsvp.specialRequests,
      rsvpDate: rsvp.rsvpDate,
      statusUpdatedAt: rsvp.statusUpdatedAt,
      fan: userType === 'host' && (rsvp as any).fan ? {
        id: (rsvp as any).fan.id,
        name: (rsvp as any).fan.user.name,
        email: (rsvp as any).fan.user.email,
        profileImageUrl: (rsvp as any).fan.user.profileImageUrl
      } : null,
      concert: {
        id: rsvp.concert.id,
        title: rsvp.concert.title,
        date: rsvp.concert.date,
        startTime: rsvp.concert.startTime,
        endTime: rsvp.concert.endTime,
        maxCapacity: rsvp.concert.maxCapacity,
        doorFee: rsvp.concert.doorFee,
        status: rsvp.concert.status,
        artist: {
          id: rsvp.concert.booking.artist.id,
          name: rsvp.concert.booking.artist.user.name,
          stageName: rsvp.concert.booking.artist.stageName,
          profileImageUrl: rsvp.concert.booking.artist.user.profileImageUrl,
          pressPhoto: userType === 'fan' ? rsvp.concert.booking.artist.media[0]?.fileUrl : null
        },
        host: {
          id: rsvp.concert.booking.host.id,
          name: rsvp.concert.booking.host.user.name,
          venueName: rsvp.concert.booking.host.venueName,
          city: rsvp.concert.booking.host.city,
          state: rsvp.concert.booking.host.state,
          profileImageUrl: rsvp.concert.booking.host.user.profileImageUrl
        }
      }
    }));

    // Get total count for pagination
    const totalCount = await prisma.fanRSVP.count({
      where: userType === 'fan' 
        ? { fanId: rsvps[0]?.fanId, ...(status && { status: status.toUpperCase() as any }) }
        : { 
            concert: { booking: { hostId: rsvps[0]?.concert?.booking?.hostId } },
            ...(status && { status: status.toUpperCase() as any })
          }
    });

    return NextResponse.json({
      success: true,
      rsvps: transformedRSVPs,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}

// POST /api/rsvps - Create new RSVP request (fan only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a fan
    if (session.user.type !== 'fan') {
      return NextResponse.json({ error: 'Only fans can create RSVP requests' }, { status: 403 });
    }

    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['concertId', 'guestsCount'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get fan profile
    const fan = await prisma.fan.findUnique({
      where: { userId: session.user.id },
      select: { id: true, subscriptionStatus: true }
    });

    if (!fan) {
      return NextResponse.json({ error: 'Fan profile not found' }, { status: 404 });
    }

    // Check subscription status
    if (fan.subscriptionStatus !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Active subscription required to RSVP for concerts' },
        { status: 403 }
      );
    }

    // Verify concert exists and is available for RSVP
    const concert = await prisma.concert.findUnique({
      where: { id: data.concertId },
      include: {
        booking: {
          include: {
            host: { select: { id: true, user: { select: { name: true } } } },
            artist: { select: { id: true, user: { select: { name: true } } } }
          }
        },
        _count: {
          select: {
            rsvps: {
              where: { status: { in: ['APPROVED', 'PENDING'] } }
            }
          }
        }
      }
    });

    if (!concert) {
      return NextResponse.json({ error: 'Concert not found' }, { status: 404 });
    }

    // Check if concert is in the future and accepting RSVPs
    if (concert.date < new Date()) {
      return NextResponse.json({ error: 'Cannot RSVP for past concerts' }, { status: 400 });
    }

    if (concert.status !== 'SCHEDULED') {
      return NextResponse.json({ error: 'Concert is not available for RSVP' }, { status: 400 });
    }

    // Check if fan already has an RSVP for this concert
    const existingRSVP = await prisma.fanRSVP.findFirst({
      where: {
        fanId: fan.id,
        concertId: data.concertId
      }
    });

    if (existingRSVP) {
      return NextResponse.json(
        { error: 'You already have an RSVP for this concert' },
        { status: 400 }
      );
    }

    // Validate guest count
    const guestsCount = parseInt(data.guestsCount);
    if (guestsCount < 1 || guestsCount > 10) {
      return NextResponse.json(
        { error: 'Guest count must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Check capacity (including pending RSVPs)
    const currentRSVPCount = concert._count.rsvps;
    if (currentRSVPCount + guestsCount > concert.maxCapacity) {
      return NextResponse.json(
        { error: 'Not enough space available for this concert' },
        { status: 400 }
      );
    }

    // Create RSVP request
    const rsvp = await prisma.fanRSVP.create({
      data: {
        fanId: fan.id,
        concertId: data.concertId,
        guestsCount,
        specialRequests: data.specialRequests || null,
        status: concert.requiresApproval ? 'PENDING' : 'APPROVED'
      },
      include: {
        concert: {
          include: {
            booking: {
              include: {
                artist: {
                  include: {
                    user: { select: { id: true, name: true, profileImageUrl: true } }
                  }
                },
                host: {
                  include: {
                    user: { select: { id: true, name: true, profileImageUrl: true } }
                  }
                }
              }
            }
          }
        }
      }
    });

    // TODO: Send notification to host about new RSVP request
    // TODO: If auto-approved, send confirmation with address to fan

    return NextResponse.json({
      success: true,
      rsvp: {
        id: rsvp.id,
        status: rsvp.status,
        guestsCount: rsvp.guestsCount,
        specialRequests: rsvp.specialRequests,
        rsvpDate: rsvp.rsvpDate,
        concert: {
          id: rsvp.concert.id,
          title: rsvp.concert.title,
          date: rsvp.concert.date,
          startTime: rsvp.concert.startTime,
          artist: rsvp.concert.booking.artist.user.name,
          host: rsvp.concert.booking.host.user.name,
          location: `${rsvp.concert.booking.host.city}, ${rsvp.concert.booking.host.state}`
        }
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to create RSVP request' },
      { status: 500 }
    );
  }
}