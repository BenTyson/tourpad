import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/users/[id] - Get user info for messaging
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
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
            id: true,
            venueName: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}