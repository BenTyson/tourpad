import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get search params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre');
    const sortby = searchParams.get('sortby') || 'name'; // name, recent, popular
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build where clause for filtering
    const whereClause: any = {
      // Only show approved artists
      approvedAt: {
        not: null
      }
    };

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { stageName: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { genres: { has: search } }
      ];
    }

    // Add genre filter
    if (genre) {
      whereClause.genres = { has: genre };
    }

    // Build order by clause
    let orderBy: any = {};
    switch (sortby) {
      case 'recent':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popular':
        // For now, use creation date as proxy for popularity
        // TODO: Add actual popularity metrics (bookings count, reviews avg)
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { user: { name: 'asc' } };
    }

    const artists = await prisma.artist.findMany({
      where: whereClause,
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
        },
        bookings: {
          where: {
            status: 'CONFIRMED',
            requestedDate: {
              gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
            }
          },
          take: 1,
          orderBy: {
            requestedDate: 'desc'
          },
          include: {
            host: {
              select: {
                city: true,
                state: true,
                venueName: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: 'CONFIRMED'
              }
            },
            reviews: true
          }
        }
      },
      orderBy,
      take: limit,
      skip: offset
    });

    // Transform data for frontend
    const transformedArtists = artists.map(artist => {
      const recentBooking = artist.bookings[0];
      
      return {
        id: artist.id,
        userId: artist.user.id,
        name: artist.user.name,
        stageName: artist.stageName,
        genres: artist.genres,
        profileImageUrl: artist.user.profileImageUrl,
        pressPhoto: artist.media[0]?.fileUrl || null,
        travelRadius: artist.travelRadius,
        typicalSetLength: artist.typicalSetLength,
        minGuarantee: artist.minGuarantee,
        equipmentNeeds: artist.equipmentNeeds,
        videoLinks: artist.videoLinks,
        stats: {
          totalBookings: artist._count.bookings,
          totalReviews: artist._count.reviews,
          lastPerformed: recentBooking ? {
            date: recentBooking.requestedDate,
            venueName: recentBooking.host.venueName,
            city: recentBooking.host.city,
            state: recentBooking.host.state
          } : null
        },
        approvedAt: artist.approvedAt,
        createdAt: artist.createdAt
      };
    });

    // Get total count for pagination
    const totalCount = await prisma.artist.count({
      where: whereClause
    });

    return NextResponse.json({
      success: true,
      artists: transformedArtists,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}