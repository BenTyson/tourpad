import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/api-helpers';
import { sanitizeHtml } from '@/lib/validation';
import { logger } from '@/lib/logger';

// GET /api/messages - Get messages for a conversation
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');
    const cursor = searchParams.get('cursor');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const hasAccess = conversation.participantIds.includes(session.user.id) || 
                     session.user.type?.toLowerCase() === 'admin';
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get messages with cursor-based pagination
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        ...(cursor && { createdAt: { lt: new Date(cursor) } })
      },
      select: {
        id: true,
        content: true,
        messageType: true,
        senderId: true,
        createdAt: true,
        readBy: true,
        attachmentUrl: true,
        attachmentType: true,
        attachmentName: true,
        attachmentSize: true,
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
                id: true,
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
                id: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: pageSize + 1
    });

    const hasMore = messages.length > pageSize;
    const messagesToReturn = messages.slice(0, pageSize);

    // Mark messages as read (only for participants, not admins)
    if (session.user.type?.toLowerCase() !== 'admin') {
      const unreadMessageIds = messagesToReturn
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

    return NextResponse.json({
      messages: messagesToReturn.reverse(), // Return in chronological order
      hasMore,
      nextCursor: hasMore ? messages[pageSize].createdAt.toISOString() : null
    });

  } catch (error) {
    logger.error('Failed to fetch messages', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!rateLimit(`messages:${session.user.id}`, 30, 60000)) {
      return NextResponse.json(
        { error: 'Too many messages. Please slow down.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { conversationId, content, messageType = 'TEXT' } = body;

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'conversationId and content are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        booking: true
      }
    });

    if (!conversation || !conversation.participantIds.includes(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content: sanitizeHtml(content),
        messageType,
        readBy: [session.user.id] // Sender has read their own message
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
                id: true,
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
                id: true
              }
            }
          }
        }
      }
    });

    // Update conversation's last message time
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    });

    // Send notification to other participants
    const recipientIds = conversation.participantIds.filter(id => id !== session.user.id);
    
    await Promise.all(
      recipientIds.map(recipientId =>
        prisma.notification.create({
          data: {
            userId: recipientId,
            type: 'MESSAGE',
            title: 'New message',
            message: `${session.user.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
            relatedId: conversation.id,
            relatedType: 'conversation',
            actionUrl: `/dashboard/messages?conversation=${conversation.id}`,
            actionText: 'View Message'
          }
        })
      )
    );

    return NextResponse.json({ message });

  } catch (error) {
    logger.error('Failed to send message', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}