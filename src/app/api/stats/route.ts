import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserStats } from '@/lib/stats';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userType = session.user.type as 'artist' | 'host' | 'fan';
    const userId = session.user.id;

    const stats = await getUserStats(userId, userType);

    return NextResponse.json(stats);
  } catch (error) {
    logger.error('Failed to fetch user stats', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}