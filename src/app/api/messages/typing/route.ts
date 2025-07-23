import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Simple in-memory store for typing indicators
// In production, this would be Redis or similar
const typingUsers = new Map<string, {
  userId: string;
  userName: string;
  timestamp: number;
}[]>();

// POST /api/messages/typing - Send typing indicator
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, isTyping } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || !conversation.participantIds.includes(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get current typing users for this conversation
    const currentTypers = typingUsers.get(conversationId) || [];
    
    if (isTyping) {
      // Add or update typing indicator
      const existingIndex = currentTypers.findIndex(t => t.userId === session.user.id);
      const typingInfo = {
        userId: session.user.id,
        userName: session.user.name || 'User',
        timestamp: Date.now()
      };

      if (existingIndex >= 0) {
        currentTypers[existingIndex] = typingInfo;
      } else {
        currentTypers.push(typingInfo);
      }
    } else {
      // Remove typing indicator
      const filteredTypers = currentTypers.filter(t => t.userId !== session.user.id);
      typingUsers.set(conversationId, filteredTypers);
    }

    // Clean up old typing indicators (older than 10 seconds)
    const now = Date.now();
    const activeTypers = currentTypers.filter(t => now - t.timestamp < 10000);
    typingUsers.set(conversationId, activeTypers);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error handling typing indicator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/messages/typing - Get typing indicators for a conversation
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || (!conversation.participantIds.includes(session.user.id) && session.user.type !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get typing users (excluding current user)
    const currentTypers = typingUsers.get(conversationId) || [];
    const now = Date.now();
    
    // Clean up old indicators and exclude current user
    const activeTypers = currentTypers
      .filter(t => now - t.timestamp < 10000 && t.userId !== session.user.id);
    
    // Update the store with cleaned data
    typingUsers.set(conversationId, activeTypers);

    return NextResponse.json({
      typingUsers: activeTypers.map(t => ({
        userId: t.userId,
        userName: t.userName
      }))
    });

  } catch (error) {
    console.error('Error fetching typing indicators:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}