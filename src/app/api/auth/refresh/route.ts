import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        artist: true,
        host: true,
        fan: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('🔄 Force refresh session data:', {
      userId: user.id,
      email: user.email,
      currentSessionStatus: session.user.status,
      actualDatabaseStatus: user.status,
      userType: user.userType
    });

    // Return the fresh user data
    return NextResponse.json({
      success: true,
      sessionStatus: session.user.status,
      databaseStatus: user.status,
      needsRefresh: session.user.status !== user.status.toLowerCase(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.userType.toLowerCase(),
        status: user.status.toLowerCase(),
        emailVerified: user.emailVerified,
        profile: user.profile,
        artist: user.artist,
        host: user.host,
        fan: user.fan
      }
    });

  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json({
      error: 'Failed to refresh session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}