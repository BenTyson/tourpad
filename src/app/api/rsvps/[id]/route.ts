import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/rsvps/[id] - Get specific RSVP details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rsvp = await prisma.fanRSVP.findUnique({
      where: { id: params.id },
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
      }
    });

    if (!rsvp) {
      return NextResponse.json({ error: 'RSVP not found' }, { status: 404 });
    }

    // Check access permissions
    const userIsFan = session.user.type === 'fan' && rsvp.fan.userId === session.user.id;
    const userIsHost = session.user.type === 'host' && rsvp.concert.booking.host.userId === session.user.id;
    const userIsAdmin = session.user.type === 'admin';

    if (!userIsFan && !userIsHost && !userIsAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Transform data for frontend
    const transformedRSVP = {
      id: rsvp.id,
      status: rsvp.status,
      guestsCount: rsvp.guestsCount,
      specialRequests: rsvp.specialRequests,
      rsvpDate: rsvp.rsvpDate,
      statusUpdatedAt: rsvp.statusUpdatedAt,
      fan: {
        id: rsvp.fan.id,
        name: rsvp.fan.user.name,
        email: rsvp.fan.user.email,
        profileImageUrl: rsvp.fan.user.profileImageUrl
      },
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
          address: userIsFan && rsvp.status === 'APPROVED' ? rsvp.concert.booking.host.address : null,
          profileImageUrl: rsvp.concert.booking.host.user.profileImageUrl
        }
      }
    };

    return NextResponse.json({
      success: true,
      rsvp: transformedRSVP
    });
  } catch (error) {
    console.error('Error fetching RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVP' },
      { status: 500 }
    );
  }
}

// PUT /api/rsvps/[id] - Update RSVP status (host only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { status, hostResponse } = data;

    // Validate status
    if (!status || !['APPROVED', 'DECLINED', 'WAITLISTED'].includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid status. Must be APPROVED, DECLINED, or WAITLISTED' },
        { status: 400 }
      );
    }

    // Get RSVP with concert and host info
    const rsvp = await prisma.fanRSVP.findUnique({
      where: { id: params.id },
      include: {
        fan: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        concert: {
          include: {
            booking: {
              include: {
                host: {
                  include: {
                    user: { select: { id: true, name: true } }
                  }
                },
                artist: {
                  include: {
                    user: { select: { id: true, name: true } }
                  }
                }
              }
            },
            _count: {
              select: {
                rsvps: {
                  where: { status: 'APPROVED' }
                }
              }
            }
          }
        }
      }
    });

    if (!rsvp) {
      return NextResponse.json({ error: 'RSVP not found' }, { status: 404 });
    }

    // Verify user is the host for this concert
    if (session.user.type !== 'host' || rsvp.concert.booking.host.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the host can update RSVP status' },
        { status: 403 }
      );
    }

    // Check if RSVP is still pending
    if (rsvp.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'RSVP has already been processed' },
        { status: 400 }
      );
    }

    // Check capacity constraints for approval
    if (status.toUpperCase() === 'APPROVED') {
      const currentApprovedCount = rsvp.concert._count.rsvps;
      if (currentApprovedCount + rsvp.guestsCount > rsvp.concert.maxCapacity) {
        return NextResponse.json(
          { error: 'Approving this RSVP would exceed venue capacity' },
          { status: 400 }
        );
      }
    }

    // Update RSVP status
    const updatedRSVP = await prisma.fanRSVP.update({
      where: { id: params.id },
      data: {
        status: status.toUpperCase(),
        statusUpdatedAt: new Date(),
        ...(hostResponse && { hostResponse })
      },
      include: {
        fan: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        concert: {
          include: {
            booking: {
              include: {
                artist: {
                  include: {
                    user: { select: { id: true, name: true } }
                  }
                },
                host: {
                  include: {
                    user: { select: { id: true, name: true } }
                  }
                }
              }
            }
          }
        }
      }
    });

    // TODO: Send notification to fan about RSVP status update
    // TODO: If approved, send venue address to fan
    // TODO: If declined/waitlisted, send appropriate message

    return NextResponse.json({
      success: true,
      rsvp: {
        id: updatedRSVP.id,
        status: updatedRSVP.status,
        guestsCount: updatedRSVP.guestsCount,
        specialRequests: updatedRSVP.specialRequests,
        hostResponse: updatedRSVP.hostResponse,
        rsvpDate: updatedRSVP.rsvpDate,
        statusUpdatedAt: updatedRSVP.statusUpdatedAt,
        fan: {
          name: updatedRSVP.fan.user.name,
          email: updatedRSVP.fan.user.email
        },
        concert: {
          title: updatedRSVP.concert.title,
          date: updatedRSVP.concert.date,
          artist: updatedRSVP.concert.booking.artist.user.name,
          host: updatedRSVP.concert.booking.host.user.name
        }
      }
    });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to update RSVP' },
      { status: 500 }
    );
  }
}

// DELETE /api/rsvps/[id] - Cancel RSVP (fan only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get RSVP with fan info
    const rsvp = await prisma.fanRSVP.findUnique({
      where: { id: params.id },
      include: {
        fan: {
          include: {
            user: { select: { id: true } }
          }
        },
        concert: {
          include: {
            booking: {
              include: {
                host: { select: { userId: true } },
                artist: { select: { user: { select: { name: true } } } }
              }
            }
          }
        }
      }
    });

    if (!rsvp) {
      return NextResponse.json({ error: 'RSVP not found' }, { status: 404 });
    }

    // Verify user owns this RSVP
    if (session.user.type !== 'fan' || rsvp.fan.user.id !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only cancel your own RSVPs' },
        { status: 403 }
      );
    }

    // Check if concert is in the future
    if (rsvp.concert.date < new Date()) {
      return NextResponse.json(
        { error: 'Cannot cancel RSVP for past concerts' },
        { status: 400 }
      );
    }

    // Delete the RSVP
    await prisma.fanRSVP.delete({
      where: { id: params.id }
    });

    // TODO: Send notification to host about cancellation

    return NextResponse.json({
      success: true,
      message: 'RSVP cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to cancel RSVP' },
      { status: 500 }
    );
  }
}