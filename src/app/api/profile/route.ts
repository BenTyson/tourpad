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
        artist: {
          include: {
            bandMembers: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        },
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
        tourMonthsPerYear: user.artist.tourMonthsPerYear || 3,
        tourVehicle: user.artist.tourVehicle || 'van',
        willingToTravel: user.artist.willingToTravel || 500,
        equipmentProvided: user.artist.equipmentNeeds || [],
        venueRequirements: user.artist.venueRequirements || [],
        profilePhoto: user.profile?.profileImageUrl || '',
        bandMembers: user.artist.bandMembers?.map(member => ({
          id: member.id,
          name: member.name,
          instrument: member.instrument || '',
          photo: member.photoUrl || ''
        })) || [],
        videoLinks: user.artist.videoLinks ? (user.artist.videoLinks as any[]) : [],
        musicSamples: user.artist.musicSamples ? (user.artist.musicSamples as any[]) : [],
      };
    }

    if (user.host) {
      profileData = {
        ...profileData,
        hostName: user.host.venueName || user.name,
        venueType: user.host.venueType?.toLowerCase() || 'home',
        website: user.profile?.websiteUrl || user.profile?.socialLinks?.website || '',
        socialLinks: user.profile?.socialLinks || {},
        profilePhoto: user.profile?.profileImageUrl || '',
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

    // Build update data
    const profileUpdateData: any = {
      bio: data.bio || '',
      location: location,
      websiteUrl: normalizedWebsite,
      socialLinks: normalizedSocialLinks,
    };
    
    // Only handle profile photo if explicitly provided
    if (data.profilePhoto !== undefined) {
      if (data.profilePhoto === '' || data.profilePhoto === null) {
        // User is removing the photo - don't include in update
        // The field will remain unchanged
      } else if (typeof data.profilePhoto === 'string' && data.profilePhoto.length > 0) {
        // Valid URL provided
        profileUpdateData.profileImageUrl = data.profilePhoto;
      }
    }

    // Update profile
    try {
      await prisma.userProfile.upsert({
        where: { userId },
        create: {
          userId,
          ...profileUpdateData,
        },
        update: profileUpdateData
      });
    } catch (profileError) {
      console.error('Profile update error:', profileError);
      throw profileError;
    }

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
            tourMonthsPerYear: data.tourMonthsPerYear || null,
            tourVehicle: data.tourVehicle || null,
            willingToTravel: data.willingToTravel || null,
            equipmentNeeds: data.equipmentProvided || [],
            venueRequirements: data.venueRequirements || [],
            videoLinks: data.videoLinks || [],
            musicSamples: data.musicSamples || [],
          }
        });

        // Handle band members if provided
        if (data.bandMembers && Array.isArray(data.bandMembers)) {
          // Delete existing band members
          await prisma.bandMember.deleteMany({
            where: { artistId: artist.id }
          });

          // Create new band members
          if (data.bandMembers.length > 0) {
            await prisma.bandMember.createMany({
              data: data.bandMembers.map((member, index) => ({
                artistId: artist.id,
                name: member.name || '',
                instrument: member.instrument || '',
                photoUrl: member.photo || '',
                sortOrder: index
              }))
            });
          }
        }
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
    
    // More detailed error handling
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      
      if (error.message.includes('value too long')) {
        return NextResponse.json({ 
          error: 'Image file is too large. Please use a smaller image.' 
        }, { status: 413 });
      }
      
      if (error.message.includes('prisma') || error.message.includes('database')) {
        return NextResponse.json({ 
          error: 'Database error. Please try again.' 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}