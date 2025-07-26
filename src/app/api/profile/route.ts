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
            },
            media: {
              where: { mediaType: 'PHOTO' },
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
      bandName: user.artist?.stageName || user.name,
      hostName: user.name,
      bio: user.profile?.bio || user.artist?.stageName || user.host?.venueDescription || '',
      location: user.profile?.location || '',
      city: user.profile?.location?.split(',')[0]?.trim() || '',
      state: user.profile?.location?.split(',')[1]?.trim() || '',
    };

    if (user.artist) {
      profileData = {
        ...profileData,
        genres: user.artist.genres || [],
        musicalStyle: user.artist.musicalStyle || '',
        instruments: [], // Will need to add this field to schema later
        briefBio: user.artist.briefBio || '',
        fullBio: user.artist.fullBio || '',
        website: user.profile?.websiteUrl || (user.profile?.socialLinks as any)?.website || '',
        socialLinks: user.profile?.socialLinks || {},
        formationYear: user.artist?.createdAt ? user.artist.createdAt.getFullYear() : new Date().getFullYear(),
        tourMonthsPerYear: user.artist.tourMonthsPerYear || 3,
        tourVehicle: user.artist.tourVehicle || 'van',
        willingToTravel: user.artist.willingToTravel || 500,
        needsLodging: user.artist.needsLodging || false,
        equipmentProvided: user.artist.equipmentNeeds || [],
        venueRequirements: user.artist.venueRequirements || [],
        contentRating: user.artist.contentRating || 'family-friendly',
        profilePhoto: user.profile?.profileImageUrl || '',
        thumbnailPhoto: user.artist?.pressPhotoUrl || '',
        heroPhoto: user.artist?.heroPhotoUrl || '',
        bandMembers: user.artist.bandMembers?.map(member => ({
          id: member.id,
          name: member.name,
          instrument: member.instrument || '',
          photo: member.photoUrl || ''
        })) || [],
        videoLinks: (() => {
          let videos = user.artist.videoLinks ? (user.artist.videoLinks as any[]) : [];
          
          // If no videos but has application performance video, include it as default
          if (videos.length === 0 && user.artist.performanceVideoUrl) {
            videos = [{
              id: 'application-video',
              title: `${user.artist.stageName || user.name}: Live Performance`,
              url: user.artist.performanceVideoUrl,
              platform: 'youtube', // Assume YouTube for now
              category: 'live_performance',
              isLivePerformance: true
            }];
          }
          
          return videos;
        })(),
        musicSamples: user.artist.musicSamples ? (user.artist.musicSamples as any[]) : [],
        photos: user.artist.media?.map(media => {
          console.log('Found media:', media);
          return {
            id: media.id,
            fileUrl: media.fileUrl,
            title: media.title,
            description: media.description,
            sortOrder: media.sortOrder,
            category: media.category
          };
        }) || [],
      };
    }

    if (user.host) {
      // Fetch host media
      const hostMedia = await prisma.hostMedia.findMany({
        where: { 
          hostId: user.host.id,
          mediaType: 'PHOTO'
        },
        orderBy: { sortOrder: 'asc' }
      });

      profileData = {
        ...profileData,
        hostName: user.host.venueName || user.name,
        venueName: user.host.venueName || '',
        venueDescription: user.host.venueDescription || '',
        city: user.host.city || profileData.city || '',
        state: user.host.state || profileData.state || '',
        venueType: user.host.venueType?.toLowerCase() || 'home',
        indoorCapacity: user.host.indoorCapacity || 0,
        outdoorCapacity: user.host.outdoorCapacity || 0,
        preferredGenres: user.host.preferredGenres || [],
        preferredDays: user.host.preferredGenres || [], // Using preferredGenres for preferred days
        hostingExperience: user.host.hostingExperience || 0,
        typicalShowLength: user.host.typicalShowLength || 90,
        houseRules: user.host.houseRules || '',
        suggestedDoorFee: user.host.suggestedDoorFee || 20,
        offersLodging: user.host.offersLodging || false,
        lodgingDetails: user.host.lodgingDetails || null,
        website: user.profile?.websiteUrl || (user.profile?.socialLinks as any)?.website || '',
        socialLinks: user.profile?.socialLinks || {},
        profilePhoto: user.profile?.profileImageUrl || '',
        venuePhoto: user.host.venuePhotoUrl || '',
        // Include hostInfo for the personal host information
        hostInfo: {
          hostName: user.name,
          aboutMe: user.profile?.bio || '',
          profilePhoto: user.profile?.profileImageUrl || ''
        },
        amenities: user.host.amenities || [],
        soundSystem: user.host.soundSystem || {
          available: false,
          description: '',
          equipment: {
            speakers: '',
            microphones: '',
            instruments: '',
            additional: ''
          }
        },
        photos: hostMedia.map(media => ({
          id: media.id,
          fileUrl: media.fileUrl,
          title: media.title || '',
          description: media.description || '',
          category: media.category || 'venue',
          sortOrder: media.sortOrder
        }))
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
    console.log('Received profile data:', data);
    console.log('suggestedDoorFee value:', data.suggestedDoorFee, 'type:', typeof data.suggestedDoorFee);
    console.log('Session user type:', session.user.type);
    console.log('Thumbnail photo:', data.thumbnailPhoto);
    console.log('Hero photo:', data.heroPhoto);
    const userId = session.user.id;

    // Update user basic info
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.bandName || data.hostInfo?.hostName || data.hostName || session.user.name,
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
      bandcamp: ensureProtocol(data.socialLinks?.bandcamp || ''),
    };

    // Build update data
    const profileUpdateData: any = {
      bio: data.hostInfo?.aboutMe || data.bio || '',
      location: location,
      websiteUrl: normalizedWebsite,
      socialLinks: normalizedSocialLinks,
    };
    
    // Handle profile photo from either profilePhoto or hostInfo.profilePhoto
    const photoUrl = data.hostInfo?.profilePhoto || data.profilePhoto;
    if (photoUrl !== undefined) {
      if (photoUrl === '' || photoUrl === null) {
        // User is removing the photo - don't include in update
        // The field will remain unchanged
      } else if (typeof photoUrl === 'string' && photoUrl.length > 0) {
        // Valid URL provided
        profileUpdateData.profileImageUrl = photoUrl;
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
    if (session.user.type === 'artist' || session.user.type === 'ARTIST') {
      const artist = await prisma.artist.findFirst({
        where: { userId }
      });

      if (artist) {
        await prisma.artist.update({
          where: { id: artist.id },
          data: {
            stageName: data.bandName || undefined,
            genres: data.genres || [],
            musicalStyle: data.musicalStyle || '',
            briefBio: data.briefBio || null,
            fullBio: data.fullBio || null,
            tourMonthsPerYear: data.tourMonthsPerYear || null,
            tourVehicle: data.tourVehicle || null,
            willingToTravel: data.willingToTravel || null,
            needsLodging: data.needsLodging !== undefined ? data.needsLodging : false,
            equipmentNeeds: data.equipmentProvided || [],
            venueRequirements: data.venueRequirements || [],
            contentRating: data.contentRating || 'family-friendly',
            videoLinks: data.videoLinks || [],
            musicSamples: data.musicSamples || [],
            pressPhotoUrl: data.thumbnailPhoto ? data.thumbnailPhoto : null,
            heroPhotoUrl: data.heroPhoto ? data.heroPhoto : null,
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
              data: data.bandMembers.map((member: any, index: number) => ({
                artistId: artist.id,
                name: member.name || '',
                instrument: member.instrument || '',
                photoUrl: member.photo || '',
                sortOrder: index
              }))
            });
          }
        }

        // Handle photos if provided
        if (data.photos && Array.isArray(data.photos)) {
          console.log('Processing photos:', data.photos);
          
          // Delete existing photos
          await prisma.artistMedia.deleteMany({
            where: { 
              artistId: artist.id,
              mediaType: 'PHOTO'
            }
          });

          // Create new photos
          if (data.photos.length > 0) {
            console.log('Creating photos for artist:', artist.id);
            await prisma.artistMedia.createMany({
              data: data.photos.map((photo: any, index: number) => ({
                artistId: artist.id,
                mediaType: 'PHOTO',
                fileUrl: photo.fileUrl,
                title: photo.title || '',
                description: photo.description || '',
                category: photo.category || 'performance',
                sortOrder: photo.sortOrder || index
              }))
            });
            console.log('Photos created successfully');
          }
        }
      }
    }

    // Update host-specific data
    if (session.user.type === 'host' || session.user.type === 'HOST') {
      const host = await prisma.host.findFirst({
        where: { userId }
      });

      if (host) {
        // Prepare venue type (convert to uppercase enum value)
        const venueTypeMap: Record<string, string> = {
          'home': 'HOME',
          'studio': 'STUDIO',
          'backyard': 'BACKYARD',
          'loft': 'LOFT',
          'warehouse': 'WAREHOUSE',
          'other': 'OTHER'
        };

        await prisma.host.update({
          where: { id: host.id },
          data: {
            venueName: data.venueName || undefined,
            venueDescription: data.venueDescription || undefined,
            venueType: data.venueType ? 
              (venueTypeMap[data.venueType.toLowerCase()] || data.venueType.toUpperCase()) : 
              undefined,
            city: data.city || undefined,
            state: data.state || undefined,
            indoorCapacity: data.indoorCapacity ? parseInt(data.indoorCapacity) : undefined,
            outdoorCapacity: data.outdoorCapacity ? parseInt(data.outdoorCapacity) : undefined,
            preferredGenres: data.preferredDays || data.preferredGenres || [],
            hostingExperience: data.hostingExperience ? parseInt(data.hostingExperience) : undefined,
            typicalShowLength: data.typicalShowLength ? parseInt(data.typicalShowLength) : undefined,
            houseRules: data.houseRules || undefined,
            suggestedDoorFee: data.suggestedDoorFee ? parseInt(data.suggestedDoorFee) : undefined,
            offersLodging: data.offersLodging !== undefined ? data.offersLodging : undefined,
            lodgingDetails: data.lodgingDetails || undefined,
            venuePhotoUrl: data.venuePhoto || undefined,
            amenities: data.amenities || [],
            soundSystem: data.soundSystem || undefined,
          }
        });

        // Handle host photos if provided
        if (data.photos && Array.isArray(data.photos)) {
          console.log('Processing host photos:', data.photos);
          
          // Delete existing photos
          await prisma.hostMedia.deleteMany({
            where: { 
              hostId: host.id,
              mediaType: 'PHOTO'
            }
          });

          // Create new photos
          if (data.photos.length > 0) {
            console.log('Creating photos for host:', host.id);
            await prisma.hostMedia.createMany({
              data: data.photos.map((photo: any, index: number) => ({
                hostId: host.id,
                mediaType: 'PHOTO',
                fileUrl: photo.fileUrl,
                title: photo.title || '',
                description: photo.description || '',
                category: photo.category || 'venue',
                sortOrder: photo.sortOrder || index
              }))
            });
            console.log('Host photos created successfully');
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    
    // More detailed error handling
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      
      if (error.message.includes('value too long')) {
        return NextResponse.json({ 
          error: 'Image file is too large. Please use a smaller image.' 
        }, { status: 413 });
      }
      
      if (error.message.includes('prisma') || error.message.includes('database')) {
        console.error('Database error details:', error);
        return NextResponse.json({ 
          error: 'Database error. Please try again.' 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}