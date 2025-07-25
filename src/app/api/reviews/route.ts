import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/reviews - Get reviews for concerts
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const concertId = searchParams.get('concertId');
    const artistId = searchParams.get('artistId');
    const hostId = searchParams.get('hostId');
    const fanId = searchParams.get('fanId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    let whereClause: any = {};

    if (concertId) {
      whereClause.concertId = concertId;
    }

    if (artistId) {
      whereClause.artistId = artistId;
    }

    if (hostId) {
      whereClause.hostId = hostId;
    }

    if (fanId) {
      whereClause.fanId = fanId;
    }

    // If no fanId specified, get current user's reviews (if they're a fan)
    if (!fanId && session.user.type === 'fan') {
      const currentFan = await prisma.fan.findUnique({
        where: { userId: session.user.id }
      });
      if (currentFan) {
        whereClause.fanId = currentFan.id;
      }
    }

    // Only show public reviews unless requesting own reviews
    if (fanId && fanId !== session.user.id) {
      whereClause.isPublic = true;
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        fan: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true
              }
            }
          }
        },
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
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
                profileImageUrl: true
              }
            }
          }
        },
        concert: {
          include: {
            booking: {
              include: {
                artist: {
                  include: {
                    user: {
                      select: {
                        name: true
                      }
                    }
                  }
                },
                host: {
                  include: {
                    user: {
                      select: {
                        name: true
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
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Transform data for frontend
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      concertId: review.concertId,
      fanId: review.fanId,
      artistId: review.artistId,
      hostId: review.hostId,
      artistRating: review.artistRating,
      hostRating: review.hostRating,
      overallRating: review.overallRating,
      artistFeedback: review.artistFeedback,
      hostFeedback: review.hostFeedback,
      overallFeedback: review.overallFeedback,
      isPublic: review.isPublic,
      attendedDate: review.attendedDate,
      wouldRecommend: review.wouldRecommend,
      createdAt: review.createdAt,
      fan: {
        id: review.fan.id,
        name: review.fan.user.name,
        profileImageUrl: review.fan.user.profileImageUrl
      },
      artist: {
        id: review.artist.id,
        name: review.artist.user.name,
        stageName: review.artist.stageName,
        profileImageUrl: review.artist.user.profileImageUrl
      },
      host: {
        id: review.host.id,
        name: review.host.user.name,
        venueName: review.host.venueName,
        profileImageUrl: review.host.user.profileImageUrl
      },
      concert: {
        id: review.concert.id,
        title: review.concert.title,
        date: review.concert.date,
        artistName: review.concert.booking.artist.user.name,
        hostName: review.concert.booking.host.user.name,
        venueName: review.concert.booking.host.venueName
      }
    }));

    // Get total count for pagination
    const totalCount = await prisma.review.count({
      where: whereClause
    });

    return NextResponse.json({
      success: true,
      reviews: transformedReviews,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a fan
    const fan = await prisma.fan.findUnique({
      where: { userId: session.user.id }
    });

    if (!fan) {
      return NextResponse.json({ error: 'Only fans can create reviews' }, { status: 403 });
    }

    const body = await request.json();
    const {
      concertId,
      artistRating,
      hostRating,
      overallRating,
      artistFeedback,
      hostFeedback,
      overallFeedback,
      isPublic,
      wouldRecommend
    } = body;

    // Validate required fields
    if (!concertId || !artistRating || !hostRating || !overallRating || !overallFeedback) {
      return NextResponse.json({ 
        error: 'Missing required fields: concertId, artistRating, hostRating, overallRating, overallFeedback' 
      }, { status: 400 });
    }

    // Validate ratings are 1-5
    if (artistRating < 1 || artistRating > 5 || hostRating < 1 || hostRating > 5 || overallRating < 1 || overallRating > 5) {
      return NextResponse.json({ 
        error: 'Ratings must be between 1 and 5' 
      }, { status: 400 });
    }

    // Verify concert exists and get artist/host IDs
    const concert = await prisma.concert.findUnique({
      where: { id: concertId },
      include: {
        booking: {
          include: {
            artist: true,
            host: true
          }
        }
      }
    });

    if (!concert) {
      return NextResponse.json({ error: 'Concert not found' }, { status: 404 });
    }

    // Verify fan attended the concert (has approved RSVP)
    const rsvp = await prisma.fanRSVP.findUnique({
      where: {
        fanId_concertId: {
          fanId: fan.id,
          concertId: concertId
        }
      }
    });

    if (!rsvp || rsvp.status !== 'APPROVED') {
      return NextResponse.json({ 
        error: 'You can only review concerts you attended' 
      }, { status: 403 });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        concertId_fanId: {
          concertId,
          fanId: fan.id
        }
      }
    });

    if (existingReview) {
      return NextResponse.json({ 
        error: 'You have already reviewed this concert' 
      }, { status: 409 });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        concertId,
        fanId: fan.id,
        artistId: concert.booking.artistId,
        hostId: concert.booking.hostId,
        artistRating,
        hostRating,
        overallRating,
        artistFeedback: artistFeedback?.trim() || null,
        hostFeedback: hostFeedback?.trim() || null,
        overallFeedback: overallFeedback.trim(),
        isPublic: isPublic !== false, // Default to true
        attendedDate: concert.date,
        wouldRecommend: wouldRecommend !== false // Default to true
      }
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        concertId: review.concertId,
        fanId: review.fanId,
        artistId: review.artistId,
        hostId: review.hostId,
        artistRating: review.artistRating,
        hostRating: review.hostRating,
        overallRating: review.overallRating,
        artistFeedback: review.artistFeedback,
        hostFeedback: review.hostFeedback,
        overallFeedback: review.overallFeedback,
        isPublic: review.isPublic,
        attendedDate: review.attendedDate,
        wouldRecommend: review.wouldRecommend,
        createdAt: review.createdAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}