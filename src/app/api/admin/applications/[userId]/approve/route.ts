import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Update user status to ACTIVE and set approval timestamp
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'ACTIVE',
        approvedAt: new Date()
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

    return NextResponse.json({ 
      success: true, 
      message: 'Application approved successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error approving application:', error);
    return NextResponse.json({ error: 'Failed to approve application' }, { status: 500 });
  }
}