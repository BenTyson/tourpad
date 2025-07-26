import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Rate limiting - in-memory for development (use Redis in production)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 10000; // 10 seconds minimum between polls per user
const RATE_LIMIT_CLEANUP_INTERVAL = 60000; // Clean up old entries every minute

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of rateLimitMap.entries()) {
    if (now - timestamp > RATE_LIMIT_CLEANUP_INTERVAL) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_LIMIT_CLEANUP_INTERVAL);

// GET /api/messages/poll-safe - Safe polling endpoint with rate limiting
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting check
    const lastPollTime = rateLimitMap.get(session.user.id);
    const now = Date.now();
    
    if (lastPollTime && (now - lastPollTime) < RATE_LIMIT_WINDOW) {
      const waitTime = RATE_LIMIT_WINDOW - (now - lastPollTime);
      console.log(`[POLL-SAFE] Rate limited user ${session.user.id} - wait ${waitTime}ms`);
      return NextResponse.json(
        { 
          error: 'Too many requests', 
          retryAfter: Math.ceil(waitTime / 1000) 
        }, 
        { status: 429 }
      );
    }
    
    // Update rate limit timestamp
    rateLimitMap.set(session.user.id, now);

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const since = searchParams.get('since');
    const conversationId = searchParams.get('conversationId');

    let sinceDate: Date;
    if (since) {
      sinceDate = new Date(since);
      // Ensure sinceDate is not too far in the past (max 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (sinceDate < fiveMinutesAgo) {
        sinceDate = fiveMinutesAgo;
      }
    } else {
      // Default to last 30 seconds
      sinceDate = new Date(Date.now() - 30000);
    }

    // Minimal response for testing
    const response = {
      updatedConversations: [] as any[],
      newMessages: [] as any[],
      timestamp: new Date().toISOString(),
      pollDuration: 0
    };

    // If specific conversation requested, get minimal update
    if (conversationId && session.user.type !== 'admin') {
      // Verify user has access to this conversation
      const conversationAccess = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participantIds: {
            has: session.user.id
          }
        },
        select: { id: true }
      });

      if (conversationAccess) {
        // Get only message count for efficiency
        const newMessageCount = await prisma.message.count({
          where: {
            conversationId,
            createdAt: { gte: sinceDate },
            NOT: {
              senderId: session.user.id
            }
          }
        });

        if (newMessageCount > 0) {
          // Only fetch actual messages if there are new ones
          const messages = await prisma.message.findMany({
            where: {
              conversationId,
              createdAt: { gte: sinceDate }
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  profileImageUrl: true,
                  userType: true
                }
              }
            },
            orderBy: { createdAt: 'asc' },
            take: 10 // Limit to prevent large responses
          });

          response.newMessages = messages;
        }
      }
    }

    // Get conversation list updates (lightweight)
    if (!conversationId) {
      const conversations = await prisma.conversation.findMany({
        where: {
          participantIds: {
            has: session.user.id
          },
          lastMessageAt: {
            gte: sinceDate
          }
        },
        select: {
          id: true,
          lastMessageAt: true,
          _count: {
            select: {
              messages: {
                where: {
                  createdAt: { gte: sinceDate },
                  NOT: {
                    readBy: {
                      has: session.user.id
                    }
                  }
                }
              }
            }
          }
        },
        take: 5 // Limit conversations checked
      });

      response.updatedConversations = conversations.map(conv => ({
        id: conv.id,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: conv._count.messages
      }));
    }

    // Calculate response time
    response.pollDuration = Date.now() - startTime;
    
    console.log(`[POLL-SAFE] User: ${session.user.id} - Duration: ${response.pollDuration}ms - New messages: ${response.newMessages.length}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[POLL-SAFE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}