import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'judah@judah.com';
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        artist: true,
        host: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found', email });
    }
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        status: user.status
      },
      artist: user.artist ? {
        id: user.artist.id,
        userId: user.artist.userId
      } : null,
      host: user.host ? {
        id: user.host.id,
        userId: user.host.userId
      } : null
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Database error', details: error });
  }
}