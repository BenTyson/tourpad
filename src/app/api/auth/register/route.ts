import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registrationSchema, sanitizeHtml } from '@/lib/validation';
import { rateLimit } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`register:${ip}`, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = registrationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password, userType, profile, artist, host } = validation.data;
    const name = sanitizeHtml(validation.data.name);
    if (profile?.bio) profile.bio = sanitizeHtml(profile.bio);
    if (artist?.stageName) artist.stageName = sanitizeHtml(artist.stageName);
    if (host?.venueDescription) host.venueDescription = sanitizeHtml(host.venueDescription);

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

    // Create user with comprehensive application data
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        userType: userType.toUpperCase() as any,
        status: userType === 'fan' ? 'ACTIVE' : 'PENDING', // Fans are active, artists/hosts need approval
        termsAcceptedAt: new Date(),
        privacyPolicyAcceptedAt: new Date(),
        profile: {
          create: {
            bio: profile?.bio || '',
            location: profile?.location || '',
            phone: profile?.phone || '',
            websiteUrl: profile?.websiteUrl || '',
            socialLinks: {
              facebook: profile?.socialLinks?.facebook || '',
              instagram: profile?.socialLinks?.instagram || '',
              spotify: profile?.socialLinks?.spotify || '',
              website: profile?.socialLinks?.website || ''
            },
            preferences: {
              notifications: { email: true, push: false },
              privacy: { profileVisibility: 'public' }
            }
          }
        },
        // Create type-specific records with full application data
        ...(userType === 'artist' && {
          artist: {
            create: {
              stageName: artist?.stageName || '',
              genres: artist?.genres || [],
              performanceVideoUrl: artist?.performanceVideoUrl || '',
              performanceVideoFile: artist?.performanceVideoFile || '',
              applicationSubmittedAt: new Date()
            }
          }
        }),
        ...(userType === 'host' && {
          host: {
            create: {
              city: host?.city || '',
              state: host?.state || '',
              venueType: host?.venueType || 'HOME',
              actualAddress: host?.actualAddress || '',
              indoorCapacity: host?.indoorCapacity || null,
              venueDescription: host?.venueDescription || '',
              hostingExperience: host?.hostingExperience || 0,
              offersLodging: host?.offersLodging || false,
              lodgingDetails: host?.lodgingDetails || {},
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
    logger.error('Registration failed', error);
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