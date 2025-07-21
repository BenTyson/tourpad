import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user data from database (this ensures we have the latest status)
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

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.profileImageUrl,
      type: user.userType.toLowerCase(),
      status: user.status.toLowerCase(),
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      profile: user.profile,
      artist: user.artist,
      host: user.host,
      fan: user.fan
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}