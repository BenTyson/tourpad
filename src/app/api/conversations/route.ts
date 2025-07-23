import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/conversations - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const skip = (page - 1) * pageSize;

    // Get conversations - admins see all, others see only their own
    console.log('Conversations access check:', {
      userId: session.user.id,
      userType: session.user.type,
      isAdmin: session.user.type?.toLowerCase() === 'admin'
    });
    
    const whereClause = session.user.type?.toLowerCase() === 'admin' 
      ? {} // Admin sees all conversations
      : {
          participantIds: {
            has: session.user.id
          }
        };

    const conversations = await prisma.conversation.findMany({
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
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      },
      skip,
      take: pageSize
    });

    // Get total count for pagination
    const total = await prisma.conversation.count({
      where: whereClause
    });

    // Calculate unread counts
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        // For admins, show total message count instead of unread count
        const unreadCount = session.user.type?.toLowerCase() === 'admin' 
          ? await prisma.message.count({
              where: { conversationId: conv.id }
            })
          : await prisma.message.count({
              where: {
                conversationId: conv.id,
                NOT: {
                  readBy: {
                    has: session.user.id
                  }
                }
              }
            });

        // Get participant info
        const participants = await prisma.user.findMany({
          where: {
            id: {
              in: conv.participantIds
            }
          },
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            userType: true,
            profile: {
              select: {
                profileImageUrl: true
              }
            },
            artist: {
              select: {
                stageName: true,
                pressPhotoUrl: true,
                media: {
                  where: {
                    mediaType: 'PHOTO',
                    category: 'profile'
                  },
                  select: {
                    fileUrl: true
                  },
                  take: 1
                }
              }
            },
            host: {
              select: {
                venueName: true
              }
            }
          }
        });

        return {
          id: conv.id,
          subject: conv.subject,
          booking: conv.booking ? {
            id: conv.booking.id,
            requestedDate: conv.booking.requestedDate,
            status: conv.booking.status,
            venueName: conv.booking.host.venueName
          } : null,
          participants: session.user.type?.toLowerCase() === 'admin' 
            ? participants // Admin sees all participants
            : participants.filter(p => p.id !== session.user.id), // Others see only the other party
          lastMessage: conv.messages[0] || null,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
          createdAt: conv.createdAt
        };
      })
    );

    return NextResponse.json({
      conversations: conversationsWithUnread,
      total,
      page,
      pageSize
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Start a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId, subject, bookingId, initialMessage } = body;

    // Validate recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    });

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // Check if conversation already exists between these users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participantIds: { has: session.user.id } },
          { participantIds: { has: recipientId } },
          ...(bookingId ? [{ bookingId }] : [])
        ]
      }
    });

    if (existingConversation) {
      return NextResponse.json({
        conversation: existingConversation,
        existing: true
      });
    }

    // Create new conversation with initial message
    const conversation = await prisma.conversation.create({
      data: {
        participantIds: [session.user.id, recipientId],
        subject,
        bookingId,
        lastMessageAt: new Date(),
        messages: {
          create: initialMessage ? {
            senderId: session.user.id,
            content: initialMessage,
            readBy: [session.user.id]
          } : undefined
        }
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true
              }
            }
          }
        }
      }
    });

    // Create notification for recipient if message was sent
    if (initialMessage) {
      await prisma.notification.create({
        data: {
          userId: recipientId,
          type: 'MESSAGE',
          title: 'New message',
          message: `You have a new message from ${session.user.name}`,
          relatedId: conversation.id,
          relatedType: 'conversation',
          actionUrl: `/dashboard/messages?conversation=${conversation.id}`,
          actionText: 'View Message'
        }
      });
    }

    return NextResponse.json({
      conversation,
      existing: false
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}