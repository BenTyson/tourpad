import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// GET /api/users - Get users with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'artist' | 'host'
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // TODO: Implement auth check
    // const session = await auth.getSession();
    // if (!session?.user || session.user.type !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Build filter criteria
    const criteria: any = {};
    if (type) criteria.type = type;
    if (status) criteria.status = status;
    if (search) {
      criteria.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // TODO: Implement actual database query
    // const users = await db.users.find({
    //   where: criteria,
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   include: { profile: true }
    // });

    // Mock response for now
    const mockUsers = [
      {
        id: '1',
        email: 'sarah.artist@email.com',
        name: 'Sarah Johnson',
        type: 'artist',
        status: 'approved',
        createdAt: new Date('2024-01-15'),
        profile: {
          genres: ['Folk', 'Indie'],
          paymentStatus: 'paid'
        }
      }
    ];

    return NextResponse.json({
      users: mockUsers,
      pagination: {
        page,
        limit,
        total: 1,
        totalPages: 1
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, type, password } = body;

    // Validate required fields
    if (!email || !name || !type || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Implement user creation
    // const hashedPassword = await hashPassword(password);
    // const user = await db.users.create({
    //   data: {
    //     email,
    //     name,
    //     type,
    //     password: hashedPassword,
    //     status: 'pending'
    //   }
    // });

    // Mock response
    const mockUser = {
      id: 'new-user-id',
      email,
      name,
      type,
      status: 'pending',
      createdAt: new Date()
    };

    return NextResponse.json(mockUser, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
