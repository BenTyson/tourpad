import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// POST /api/auth/register - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, type } = body;

    // Validate required fields
    if (!email || !password || !name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user type
    if (!['artist', 'host'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // TODO: Check if user already exists
    // const existingUser = await db.users.findUnique({
    //   where: { email }
    // });
    
    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: 'User with this email already exists' },
    //     { status: 409 }
    //   );
    // }

    // TODO: Hash password and create user
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

    // Mock response - don't return password
    const mockUser = {
      id: 'new-user-id',
      email,
      name,
      type,
      status: 'pending',
      createdAt: new Date()
    };

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: mockUser
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
