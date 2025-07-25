import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/reviews/[id] - Get specific review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewId = params.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
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
      }
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if review is public or user owns it
    if (!review.isPublic && review.fan.userId !== session.user.id) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Transform data for frontend
    const transformedReview = {
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
    };

    return NextResponse.json({
      success: true,
      review: transformedReview
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id] - Update review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewId = params.id;

    // Verify user is a fan
    const fan = await prisma.fan.findUnique({
      where: { userId: session.user.id }
    });

    if (!fan) {
      return NextResponse.json({ error: 'Only fans can update reviews' }, { status: 403 });
    }

    // Check if review exists and belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (existingReview.fanId !== fan.id) {
      return NextResponse.json({ error: 'You can only update your own reviews' }, { status: 403 });
    }

    const body = await request.json();
    const {
      artistRating,
      hostRating,
      overallRating,
      artistFeedback,
      hostFeedback,
      overallFeedback,
      isPublic,
      wouldRecommend
    } = body;

    // Validate ratings if provided
    if (artistRating && (artistRating < 1 || artistRating > 5)) {
      return NextResponse.json({ 
        error: 'Artist rating must be between 1 and 5' 
      }, { status: 400 });
    }
    if (hostRating && (hostRating < 1 || hostRating > 5)) {
      return NextResponse.json({ 
        error: 'Host rating must be between 1 and 5' 
      }, { status: 400 });
    }
    if (overallRating && (overallRating < 1 || overallRating > 5)) {
      return NextResponse.json({ 
        error: 'Overall rating must be between 1 and 5' 
      }, { status: 400 });
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(artistRating && { artistRating }),
        ...(hostRating && { hostRating }),
        ...(overallRating && { overallRating }),
        ...(artistFeedback !== undefined && { artistFeedback: artistFeedback?.trim() || null }),
        ...(hostFeedback !== undefined && { hostFeedback: hostFeedback?.trim() || null }),
        ...(overallFeedback && { overallFeedback: overallFeedback.trim() }),
        ...(isPublic !== undefined && { isPublic }),
        ...(wouldRecommend !== undefined && { wouldRecommend })
      }
    });

    return NextResponse.json({
      success: true,
      review: {
        id: updatedReview.id,
        concertId: updatedReview.concertId,
        fanId: updatedReview.fanId,
        artistId: updatedReview.artistId,
        hostId: updatedReview.hostId,
        artistRating: updatedReview.artistRating,
        hostRating: updatedReview.hostRating,
        overallRating: updatedReview.overallRating,
        artistFeedback: updatedReview.artistFeedback,
        hostFeedback: updatedReview.hostFeedback,
        overallFeedback: updatedReview.overallFeedback,
        isPublic: updatedReview.isPublic,
        attendedDate: updatedReview.attendedDate,
        wouldRecommend: updatedReview.wouldRecommend,
        createdAt: updatedReview.createdAt,
        updatedAt: updatedReview.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewId = params.id;

    // Verify user is a fan
    const fan = await prisma.fan.findUnique({
      where: { userId: session.user.id }
    });

    if (!fan) {
      return NextResponse.json({ error: 'Only fans can delete reviews' }, { status: 403 });
    }

    // Check if review exists and belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (existingReview.fanId !== fan.id) {
      return NextResponse.json({ error: 'You can only delete your own reviews' }, { status: 403 });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}