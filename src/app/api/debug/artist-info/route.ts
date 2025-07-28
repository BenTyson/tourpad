import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        artist: true
      }
    });

    // Also check Sarah specifically
    const sarahUser = await prisma.user.findUnique({
      where: { email: 'sarah@example.com' },
      include: {
        artist: true
      }
    });

    return NextResponse.json({
      sessionUser: session.user,
      currentDbUser: {
        id: user?.id,
        email: user?.email,
        userType: user?.userType,
        artist: user?.artist
      },
      sarahFromDb: {
        id: sarahUser?.id,
        email: sarahUser?.email,
        userType: sarahUser?.userType,
        artist: sarahUser?.artist
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get debug info', details: error.message }, { status: 500 });
  }
}