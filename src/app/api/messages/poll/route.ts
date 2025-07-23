import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/messages/poll - Poll for new messages and conversation updates
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const since = searchParams.get('since');
    const conversationId = searchParams.get('conversationId');

    let sinceDate: Date;
    if (since) {
      sinceDate = new Date(since);
    } else {
      // Default to last 30 seconds if no since timestamp
      sinceDate = new Date(Date.now() - 30000);
    }

    // Get updated conversation data with unread counts
    const whereClause = session.user.type === 'admin' 
      ? {} 
      : {
          participantIds: {
            has: session.user.id
          }
        };

    const conversations = await prisma.conversation.findMany({
      where: {
        ...whereClause,
        lastMessageAt: {
          gte: sinceDate
        }
      },
      include: {
        messages: {
          where: {
            createdAt: {
              gte: sinceDate
            }
          },
          include: {
            sender: {
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
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    });

    // Get new messages for specific conversation if requested
    let newMessages: any[] = [];
    if (conversationId) {
      // Verify user has access to this conversation
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
      });

      if (conversation && (conversation.participantIds.includes(session.user.id) || session.user.type === 'admin')) {
        const messages = await prisma.message.findMany({
          where: {
            conversationId,
            createdAt: {
              gte: sinceDate
            }
          },
          include: {
            sender: {
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
            }
          },
          orderBy: { createdAt: 'asc' }
        });

        newMessages = messages;

        // Mark new messages as read for participants (not admins)
        if (session.user.type !== 'admin') {
          const unreadMessageIds = messages
            .filter(msg => !msg.readBy.includes(session.user.id))
            .map(msg => msg.id);

          if (unreadMessageIds.length > 0) {
            await prisma.message.updateMany({
              where: {
                id: { in: unreadMessageIds }
              },
              data: {
                readBy: {
                  push: session.user.id
                }
              }
            });
          }
        }
      }
    }

    // Calculate unread counts for updated conversations
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = session.user.type === 'admin' 
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
          participants: session.user.type === 'admin' 
            ? participants 
            : participants.filter(p => p.id !== session.user.id),
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
          newMessages: conv.messages || []
        };
      })
    );

    return NextResponse.json({
      updatedConversations: conversationsWithUnread,
      newMessages: conversationId ? newMessages : [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error polling messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}