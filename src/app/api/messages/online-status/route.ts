import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Simple in-memory store for online status
// In production, this would be Redis or similar
const onlineUsers = new Map<string, {
  userId: string;
  lastSeen: number;
}>();

// POST /api/messages/online-status - Update user's online status
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status = 'online' } = body; // 'online' or 'offline'

    if (status === 'online') {
      // Update last seen timestamp
      onlineUsers.set(session.user.id, {
        userId: session.user.id,
        lastSeen: Date.now()
      });
    } else {
      // Remove from online users
      onlineUsers.delete(session.user.id);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating online status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/messages/online-status - Get online status for users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userIds = searchParams.get('userIds')?.split(',') || [];

    if (userIds.length === 0) {
      return NextResponse.json({ onlineStatus: {} });
    }

    // Clean up old online status (older than 2 minutes = offline)
    const now = Date.now();
    const cutoffTime = now - (2 * 60 * 1000); // 2 minutes

    for (const [userId, userData] of onlineUsers.entries()) {
      if (userData.lastSeen < cutoffTime) {
        onlineUsers.delete(userId);
      }
    }

    // Get online status for requested users
    const onlineStatus: Record<string, { 
      isOnline: boolean; 
      lastSeen?: number 
    }> = {};

    for (const userId of userIds) {
      const userData = onlineUsers.get(userId);
      if (userData) {
        onlineStatus[userId] = {
          isOnline: true,
          lastSeen: userData.lastSeen
        };
      } else {
        onlineStatus[userId] = {
          isOnline: false
        };
      }
    }

    return NextResponse.json({ onlineStatus });

  } catch (error) {
    console.error('Error fetching online status:', error);
    return NextResponse.json(
      { error: 'Unhandled server error' },
      { status: 500 }
    );
  }
}

// Heartbeat endpoint to keep users online
// PUT /api/messages/online-status - Heartbeat to maintain online status
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update timestamp for this user
    onlineUsers.set(session.user.id, {
      userId: session.user.id,
      lastSeen: Date.now()
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating heartbeat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}