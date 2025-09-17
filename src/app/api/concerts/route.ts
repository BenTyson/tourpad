import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/concerts - Get available concerts for discovery
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const state = searchParams.get('state');
    const genre = searchParams.get('genre');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const maxFee = searchParams.get('maxFee');
    const availableOnly = searchParams.get('availableOnly') === 'true';
    const status = searchParams.get('status') || 'SCHEDULED';
    const includeUserRSVP = searchParams.get('includeUserRSVP') === 'true';
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get fan profile if user is a fan and requesting RSVP info
    let fanId = null;
    if (session.user.type === 'fan' && includeUserRSVP) {
      const fan = await prisma.fan.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
      });
      fanId = fan?.id;
    }

    // Build where clause
    const whereClause: any = {
      status: status.toUpperCase(),
      date: {
        gte: new Date() // Only future concerts
      }
    };

    // Add search filter
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { booking: { artist: { user: { name: { contains: search, mode: 'insensitive' } } } } },
        { booking: { artist: { stageName: { contains: search, mode: 'insensitive' } } } },
        { booking: { host: { venueName: { contains: search, mode: 'insensitive' } } } },
        { booking: { host: { user: { name: { contains: search, mode: 'insensitive' } } } } }
      ];
    }

    // Add location filter
    if (state) {
      whereClause.booking = {
        ...whereClause.booking,
        host: {
          state: state
        }
      };
    }

    // Add date range filters
    if (dateFrom) {
      whereClause.date.gte = new Date(dateFrom);
    }
    if (dateTo) {
      whereClause.date.lte = new Date(dateTo);
    }

    // Add fee filter
    if (maxFee) {
      whereClause.doorFee = {
        lte: parseInt(maxFee)
      };
    }

    // Get concerts
    const concerts = await prisma.concert.findMany({
      where: whereClause,
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
        },
        _count: {
          select: {
            rsvps: {
              where: {
                status: { in: ['APPROVED', 'PENDING'] }
              }
            }
          }
        },
        ...(fanId && {
          rsvps: {
            where: { fanId },
            take: 1
          }
        })
      },
      orderBy: {
        date: 'asc'
      },
      take: limit,
      skip: offset
    });

    // Filter by genre if specified (check artist's preferred genres)
    let filteredConcerts = concerts;
    if (genre) {
      // This would require adding genre info to artist model
      // For now, we'll skip this filter
    }

    // Filter by availability if requested
    if (availableOnly) {
      filteredConcerts = filteredConcerts.filter(concert => {
        const currentRSVPCount = concert._count.rsvps;
        return currentRSVPCount < concert.maxCapacity;
      });
    }

    // Transform data for frontend
    const transformedConcerts = filteredConcerts.map(concert => ({
      id: concert.id,
      title: concert.title,
      description: concert.description,
      date: concert.date,
      startTime: concert.startTime,
      endTime: concert.endTime,
      maxCapacity: concert.maxCapacity,
      doorFee: concert.doorFee,
      status: concert.status,
      isPrivate: concert.isPrivate,
      requiresApproval: concert.requiresApproval,
      artist: {
        id: concert.booking.artist.id,
        name: concert.booking.artist.user.name,
        stageName: concert.booking.artist.stageName,
        profileImageUrl: concert.booking.artist.user.profileImageUrl,
        pressPhoto: concert.booking.artist.media[0]?.fileUrl || null
      },
      host: {
        id: concert.booking.host.id,
        name: concert.booking.host.user.name,
        venueName: concert.booking.host.venueName,
        city: concert.booking.host.city,
        state: concert.booking.host.state,
        profileImageUrl: concert.booking.host.user.profileImageUrl
      },
      currentRSVPCount: concert._count.rsvps,
      userRSVP: fanId && concert.rsvps?.length > 0 ? {
        id: concert.rsvps[0].id,
        status: concert.rsvps[0].status,
        guestsCount: concert.rsvps[0].guestsCount
      } : null
    }));

    // Get total count for pagination
    const totalCount = await prisma.concert.count({
      where: whereClause
    });

    return NextResponse.json({
      success: true,
      concerts: transformedConcerts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching concerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch concerts' },
      { status: 500 }
    );
  }
}