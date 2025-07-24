import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the current session
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No authenticated session found' },
        { status: 401 }
      );
    }

    // Fetch complete user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        artist: {
          include: {
            bandMembers: true,
            media: true
          }
        },
        host: {
          include: {
            media: true
          }
        },
        fan: true
      }
    });

    if (!user) {
      console.error('User not found in database:', session.user.id);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data in expected format
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType.toLowerCase(),
      status: user.status.toLowerCase(),
      emailVerified: user.emailVerified,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt,
      profile: user.profile,
      artist: user.artist,
      host: user.host,
      fan: user.fan
    });

  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}