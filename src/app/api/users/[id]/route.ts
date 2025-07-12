import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    // TODO: Implement auth check
    // const session = await auth.getSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Implement actual database query
    // const user = await db.users.findUnique({
    //   where: { id },
    //   include: { profile: true }
    // });

    // if (!user) {
    //   return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // }

    // Mock response
    const mockUser = {
      id,
      email: 'user@email.com',
      name: 'Mock User',
      type: 'artist',
      status: 'approved',
      createdAt: new Date(),
      profile: {
        bio: 'Mock bio',
        genres: ['Folk']
      }
    };

    return NextResponse.json(mockUser);

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();

    // TODO: Implement auth check
    // const session = await auth.getSession();
    // if (!session?.user || (session.user.id !== id && session.user.type !== 'admin')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Implement user update
    // const updatedUser = await db.users.update({
    //   where: { id },
    //   data: body,
    //   include: { profile: true }
    // });

    // Mock response
    const mockUpdatedUser = {
      id,
      ...body,
      updatedAt: new Date()
    };

    return NextResponse.json(mockUpdatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    // TODO: Implement auth check (admin only)
    // const session = await auth.getSession();
    // if (!session?.user || session.user.type !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Implement user deletion
    // await db.users.delete({ where: { id } });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
