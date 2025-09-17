import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Update user status to REJECTED
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'REJECTED'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Application rejected successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    return NextResponse.json({ error: 'Failed to reject application' }, { status: 500 });
  }
}