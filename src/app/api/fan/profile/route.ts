import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/fan/profile - Get fan profile data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a fan
    if (session.user.type !== 'fan') {
      return NextResponse.json({ error: 'Access denied - Fan account required' }, { status: 403 });
    }

    // Get fan profile with user data
    const fan = await prisma.fan.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });

    if (!fan) {
      return NextResponse.json({ error: 'Fan profile not found' }, { status: 404 });
    }

    // Return fan profile data
    return NextResponse.json({
      success: true,
      fan: {
        id: fan.id,
        userId: fan.userId,
        name: fan.user.name,
        email: fan.user.email,
        profileImageUrl: fan.profileImageUrl || fan.user.profileImageUrl,
        favoriteGenres: fan.favoriteGenres,
        hometown: fan.hometown,
        state: fan.state,
        bio: fan.bio,
        travelRadius: fan.travelRadius,
        subscriptionStatus: fan.subscriptionStatus,
        subscriptionStartDate: fan.subscriptionStartDate,
        subscriptionEndDate: fan.subscriptionEndDate,
        createdAt: fan.createdAt,
        updatedAt: fan.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching fan profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fan profile' },
      { status: 500 }
    );
  }
}

// PUT /api/fan/profile - Update fan profile data
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a fan
    if (session.user.type !== 'fan') {
      return NextResponse.json({ error: 'Access denied - Fan account required' }, { status: 403 });
    }

    const data = await request.json();
    
    // Validate and sanitize input data
    const updateData: any = {};
    
    if (data.favoriteGenres && Array.isArray(data.favoriteGenres)) {
      updateData.favoriteGenres = data.favoriteGenres;
    }
    
    if (data.hometown && typeof data.hometown === 'string') {
      updateData.hometown = data.hometown.trim();
    }
    
    if (data.state && typeof data.state === 'string') {
      updateData.state = data.state.trim();
    }
    
    if (data.bio && typeof data.bio === 'string') {
      updateData.bio = data.bio.trim();
    }
    
    if (data.profileImageUrl && typeof data.profileImageUrl === 'string') {
      updateData.profileImageUrl = data.profileImageUrl;
    }
    
    if (data.travelRadius && typeof data.travelRadius === 'number') {
      updateData.travelRadius = Math.max(0, Math.min(500, data.travelRadius)); // 0-500 miles
    }

    // Update fan profile
    const updatedFan = await prisma.fan.update({
      where: { userId: session.user.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      fan: {
        id: updatedFan.id,
        userId: updatedFan.userId,
        name: updatedFan.user.name,
        email: updatedFan.user.email,
        profileImageUrl: updatedFan.profileImageUrl || updatedFan.user.profileImageUrl,
        favoriteGenres: updatedFan.favoriteGenres,
        hometown: updatedFan.hometown,
        state: updatedFan.state,
        bio: updatedFan.bio,
        travelRadius: updatedFan.travelRadius,
        subscriptionStatus: updatedFan.subscriptionStatus,
        subscriptionStartDate: updatedFan.subscriptionStartDate,
        subscriptionEndDate: updatedFan.subscriptionEndDate,
        createdAt: updatedFan.createdAt,
        updatedAt: updatedFan.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating fan profile:', error);
    return NextResponse.json(
      { error: 'Failed to update fan profile' },
      { status: 500 }
    );
  }
}