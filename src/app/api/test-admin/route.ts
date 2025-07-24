import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    console.log('🧪 Testing admin user authentication...');
    
    // Get admin user from database
    const adminUser = await prisma.user.findFirst({
      where: { 
        email: 'admin@tourpad.com',
        userType: 'ADMIN'
      },
      include: {
        profile: true,
        artist: true,
        host: true,
        fan: true
      }
    });

    if (!adminUser) {
      return NextResponse.json({ 
        error: 'Admin user not found in database',
        suggestion: 'Run: npx prisma db seed'
      }, { status: 404 });
    }

    // Test password verification
    if (!adminUser.passwordHash) {
      return NextResponse.json({ 
        error: 'Admin user has no password hash',
        user: {
          id: adminUser.id,
          email: adminUser.email,
          userType: adminUser.userType,
          status: adminUser.status
        }
      }, { status: 400 });
    }

    const isValidPassword = await bcrypt.compare('password123', adminUser.passwordHash);

    return NextResponse.json({
      success: true,
      message: 'Admin user found and password is valid',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        userType: adminUser.userType,
        status: adminUser.status,
        hasProfile: !!adminUser.profile,
        hasPasswordHash: !!adminUser.passwordHash,
        passwordValid: isValidPassword,
        emailVerified: adminUser.emailVerified
      }
    });

  } catch (error) {
    console.error('❌ Test admin error:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}