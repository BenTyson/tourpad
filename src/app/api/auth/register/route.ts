import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registrationSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = registrationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password, name, userType, profile } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        userType: userType.toUpperCase() as any,
        status: userType === 'fan' ? 'ACTIVE' : 'PENDING', // Fans are active immediately
        termsAcceptedAt: new Date(),
        privacyPolicyAcceptedAt: new Date(),
        profile: {
          create: {
            bio: profile?.bio || '',
            location: profile?.location || '',
            phone: profile?.phone || '',
            socialLinks: profile?.socialLinks || {},
            preferences: {
              notifications: { email: true, push: false },
              privacy: { profileVisibility: 'public' }
            }
          }
        },
        // Create type-specific records
        ...(userType === 'artist' && {
          artist: {
            create: {
              genres: profile?.genres || [],
              applicationSubmittedAt: new Date()
            }
          }
        }),
        ...(userType === 'host' && {
          host: {
            create: {
              city: profile?.city || '',
              state: profile?.state || '',
              venueType: profile?.venueType || 'OTHER',
              applicationSubmittedAt: new Date()
            }
          }
        }),
        ...(userType === 'fan' && {
          fan: {
            create: {
              favoriteGenres: profile?.favoriteGenres || [],
              subscriptionStatus: 'ACTIVE',
              subscriptionStartDate: new Date(),
              subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
            }
          }
        })
      },
      include: {
        profile: true,
        artist: true,
        host: true,
        fan: true
      }
    });

    // Return response based on user type
    const response = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.userType.toLowerCase(),
        status: user.status.toLowerCase()
      },
      nextStep: getNextStep(user.userType.toLowerCase(), user.status.toLowerCase())
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

function getNextStep(userType: string, status: string) {
  if (userType === 'fan') {
    return 'complete'; // Fans are immediately active
  } else if (userType === 'artist' || userType === 'host') {
    return 'approval_pending'; // Artists and hosts need approval
  }
  return 'complete';
}