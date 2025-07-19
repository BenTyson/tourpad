import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    if (session.user.type === 'host') {
      const host = await prisma.host.findUnique({
        where: { userId },
        select: { id: true }
      });
      
      return NextResponse.json({ profileId: host?.id || null, type: 'host' });
    } else if (session.user.type === 'artist') {
      const artist = await prisma.artist.findUnique({
        where: { userId },
        select: { id: true }
      });
      
      return NextResponse.json({ profileId: artist?.id || null, type: 'artist' });
    }
    
    return NextResponse.json({ profileId: null, type: session.user.type });
  } catch (error) {
    console.error('Error fetching profile ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}