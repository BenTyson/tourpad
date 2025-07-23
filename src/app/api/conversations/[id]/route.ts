import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/conversations/[id] - Get a specific conversation
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            artist: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
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
                    email: true,
                    profileImageUrl: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Verify user has access
    if (!conversation.participantIds.includes(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get participant details
    const participants = await prisma.user.findMany({
      where: {
        id: {
          in: conversation.participantIds
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        userType: true
      }
    });

    return NextResponse.json({
      conversation: {
        ...conversation,
        participants
      }
    });

  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}