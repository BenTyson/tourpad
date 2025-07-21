import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // First, get the user to check their type
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        host: true,
        artist: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Set status based on user type:
    // - HOSTS get ACTIVE status (immediate dashboard access)
    // - ARTISTS get APPROVED status (need to complete payment first)
    const newStatus = user.userType === 'ARTIST' ? 'APPROVED' : 'ACTIVE';

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: newStatus
      },
      include: {
        host: true,
        artist: true
      }
    });

    // If it's a host, also update the host-specific approval
    if (updatedUser.host) {
      await prisma.host.update({
        where: { userId: userId },
        data: {
          approvedAt: new Date()
        }
      });
    }

    // If it's an artist, also update the artist-specific approval
    if (updatedUser.artist) {
      await prisma.artist.update({
        where: { userId: userId },
        data: {
          approvedAt: new Date()
        }
      });
    }

    const message = user.userType === 'ARTIST' 
      ? 'Artist application approved. User will need to complete payment to activate account.'
      : 'Host application approved. User now has full dashboard access.';

    return NextResponse.json({ 
      success: true, 
      message: message,
      status: newStatus,
      userType: user.userType,
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error approving application:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      error: 'Failed to approve application', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}