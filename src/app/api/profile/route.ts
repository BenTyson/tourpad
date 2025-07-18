import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Fetch user with profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        artist: true,
        host: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build response based on user type
    let profileData: any = {
      bandName: user.name,
      hostName: user.name,
      bio: user.profile?.bio || user.artist?.bio || user.host?.bio || '',
      location: user.profile?.location || '',
      city: user.profile?.location?.split(',')[0]?.trim() || '',
      state: user.profile?.location?.split(',')[1]?.trim() || '',
    };

    if (user.artist) {
      profileData = {
        ...profileData,
        genres: user.artist.genres || [],
        instruments: [], // Will need to add this field to schema later
        website: user.profile?.websiteUrl || user.profile?.socialLinks?.website || '',
        socialLinks: user.profile?.socialLinks || {},
        experienceLevel: 'intermediate', // Will need to add this field to schema later
        yearsActive: 1, // Will need to add this field to schema later
      };
    }

    if (user.host) {
      profileData = {
        ...profileData,
        hostName: user.host.venueName || user.name,
        venueType: user.host.venueType?.toLowerCase() || 'home',
        website: user.profile?.websiteUrl || user.profile?.socialLinks?.website || '',
        socialLinks: user.profile?.socialLinks || {},
      };
    }

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to ensure URLs have proper protocol
function ensureProtocol(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  
  // If it already has a protocol, return as is
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed;
  }
  
  // Add https:// prefix
  return `https://${trimmed}`;
}

// Helper function to normalize Instagram input
function normalizeInstagram(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';
  
  // If it's already a URL, return as is
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed;
  }
  
  // If it starts with @, remove it for consistency
  const username = trimmed.replace(/^@/, '');
  
  // Return just the username (not a full URL)
  return username;
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const userId = session.user.id;

    // Update user basic info
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.bandName || data.hostName || session.user.name,
      }
    });

    // Build location from city and state
    const location = data.city && data.state ? `${data.city}, ${data.state}` : (data.location || '');

    // Normalize URLs
    const normalizedWebsite = ensureProtocol(data.website || '');
    const normalizedSocialLinks = {
      ...data.socialLinks,
      website: ensureProtocol(data.website || data.socialLinks?.website || ''),
      facebook: ensureProtocol(data.socialLinks?.facebook || ''),
      instagram: normalizeInstagram(data.socialLinks?.instagram || ''),
      youtube: ensureProtocol(data.socialLinks?.youtube || ''),
      spotify: ensureProtocol(data.socialLinks?.spotify || ''),
    };

    // Update profile
    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        bio: data.bio || '',
        location: location,
        websiteUrl: normalizedWebsite,
        socialLinks: normalizedSocialLinks,
      },
      update: {
        bio: data.bio || '',
        location: location,
        websiteUrl: normalizedWebsite,
        socialLinks: normalizedSocialLinks,
      }
    });

    // Update artist-specific data
    if (session.user.type === 'artist') {
      const artist = await prisma.artist.findFirst({
        where: { userId }
      });

      if (artist) {
        await prisma.artist.update({
          where: { id: artist.id },
          data: {
            stageName: data.bandName || undefined,
            genres: data.genres || [],
          }
        });
      }
    }

    // Update host-specific data
    if (session.user.type === 'host') {
      const host = await prisma.host.findFirst({
        where: { userId }
      });

      if (host) {
        await prisma.host.update({
          where: { id: host.id },
          data: {
            venueName: data.hostName || undefined,
            // Note: venueType would need to match the enum values in schema
            // venueType: data.venueType ? data.venueType.toUpperCase() : undefined,
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}