import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const hostId = params.id;

    // Fetch host with all related data
    const host = await prisma.host.findUnique({
      where: { id: hostId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
            status: true,
            userType: true,
            profile: true
          }
        },
        media: {
          orderBy: { sortOrder: 'asc' }
        },
        bookings: {
          where: {
            status: 'CONFIRMED',
            concert: {
              date: {
                gte: new Date()
              }
            }
          },
          include: {
            concert: true,
            artist: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: {
            requestedDate: 'asc'
          }
        }
      }
    });

    if (!host) {
      return NextResponse.json(
        { error: 'Host not found' },
        { status: 404 }
      );
    }

    // Transform data to match frontend expectations
    const transformedHost = {
      id: host.id,
      userId: host.userId,
      name: host.venueName || host.user.name, // Use venue name for the main name
      email: host.user.email,
      profileImageUrl: host.user.profileImageUrl,
      bio: host.venueDescription || '', // Use venue description for main bio
      status: host.user.status,
      venueName: host.venueName,
      venueDescription: host.venueDescription,
      venueType: host.venueType,
      city: host.city,
      state: host.state,
      country: host.country,
      displayCoordinates: (() => {
        // Try multiple sources for coordinates
        if (host.latitude && host.longitude) {
          return [host.latitude, host.longitude];
        }
        if (host.displayCoordinates) {
          // If it's a string like "[lat,lng]", parse it
          try {
            const parsed = JSON.parse(host.displayCoordinates);
            if (Array.isArray(parsed) && parsed.length === 2) {
              return parsed;
            }
          } catch (e) {
            // If not JSON, try comma-separated
            const parts = host.displayCoordinates.split(',').map(p => parseFloat(p.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              return parts;
            }
          }
        }
        
        // Fallback: Use approximate coordinates based on city
        const cityCoordinates: { [key: string]: [number, number] } = {
          'Denver': [39.7392, -104.9903],
          'Boulder': [40.0150, -105.2705],
          'Nashville': [36.1627, -86.7816],
          'Austin': [30.2672, -97.7431],
          'Wheat Ridge': [39.7661, -105.0772],
          'Los Angeles': [34.0522, -118.2437],
          'New York': [40.7128, -74.0060],
          'Chicago': [41.8781, -87.6298],
          'San Francisco': [37.7749, -122.4194],
          'Seattle': [47.6062, -122.3321],
          'Portland': [45.5152, -122.6784],
          'Miami': [25.7617, -80.1918],
          'Atlanta': [33.7490, -84.3880],
          'Boston': [42.3601, -71.0589],
          'Philadelphia': [39.9526, -75.1652],
          'Phoenix': [33.4484, -112.0740],
          'Dallas': [32.7767, -96.7970],
          'Houston': [29.7604, -95.3698],
          'San Diego': [32.7157, -117.1611],
          'Las Vegas': [36.1699, -115.1398]
        };
        
        if (host.city && cityCoordinates[host.city]) {
          // Add small random offset for privacy (about 1-2 miles)
          const baseCoords = cityCoordinates[host.city];
          const latOffset = (Math.random() - 0.5) * 0.02;
          const lngOffset = (Math.random() - 0.5) * 0.02;
          return [baseCoords[0] + latOffset, baseCoords[1] + lngOffset];
        }
        
        return null;
      })(),
      actualAddress: host.actualAddress,
      indoorCapacity: host.indoorCapacity,
      outdoorCapacity: host.outdoorCapacity,
      preferredGenres: host.preferredGenres,
      preferredDays: host.preferredGenres || [], // Preferred days are stored in preferredGenres field
      hostingExperience: host.hostingExperience,
      typicalShowLength: host.typicalShowLength,
      houseRules: host.houseRules,
      offersLodging: host.offersLodging,
      lodgingDetails: host.lodgingDetails,
      suggestedDoorFee: host.suggestedDoorFee,
      // Social links and website from UserProfile
      website: host.user.profile?.websiteUrl || '',
      socialLinks: host.user.profile?.socialLinks || {},
      // Media organized by category
      housePhotos: host.media
        .filter(m => m.category === 'house' || m.category === 'venue')
        .map(m => ({
          id: m.id,
          url: m.fileUrl,
          alt: m.title || 'House photo',
          title: m.title,
          description: m.description
        })),
      performanceSpacePhotos: host.media
        .filter(m => m.category === 'performance_space')
        .map(m => ({
          id: m.id,
          url: m.fileUrl,
          alt: m.title || 'Performance space photo',
          title: m.title,
          description: m.description
        })),
      // Host profile info (legacy)
      hostInfo: {
        hostName: host.user.name,
        profilePhoto: host.user.profile?.profileImageUrl || host.user.profileImageUrl,
        aboutMe: host.user.profile?.bio || 'Passionate about bringing live music into intimate settings. I love creating memorable experiences where artists and audiences can connect in a personal, meaningful way.'
      },
      // Host members - extract from lodgingDetails
      hostMembers: (() => {
        const lodging = host.lodgingDetails as any;
        if (lodging?.hostMembers && Array.isArray(lodging.hostMembers)) {
          return lodging.hostMembers;
        }
        // Fallback: create from user data for backward compatibility
        return [{
          id: '1',
          hostName: host.user.name,
          aboutMe: host.user.profile?.bio || 'Passionate about bringing live music into intimate settings. I love creating memorable experiences where artists and audiences can connect in a personal, meaningful way.',
          profilePhoto: host.user.profile?.profileImageUrl || host.user.profileImageUrl
        }];
      })(),
      // Calculate rating from reviews using database (single query)
      ...await (async () => {
        const reviewStats = await prisma.review.aggregate({
          where: {
            hostId: host.userId,
            isPublic: true
          },
          _avg: {
            hostRating: true
          },
          _count: {
            id: true
          }
        });
        return {
          rating: reviewStats._avg.hostRating ? Math.round(reviewStats._avg.hostRating * 10) / 10 : 0,
          reviewCount: reviewStats._count.id || 0
        };
      })(),
      // Show specs - derived from database fields
      showSpecs: {
        avgAttendance: Math.floor((host.indoorCapacity || 0) * 0.8),
        indoorAttendanceMax: host.indoorCapacity || 0,
        outdoorAttendanceMax: host.outdoorCapacity || 0,
        showDurationMins: host.typicalShowLength || 120,
        showFormat: host.venueType === 'HOME' ? 'Intimate house concert' : 'Venue performance',
        daysAvailable: host.venueType === 'HOME' 
          ? ['Friday', 'Saturday', 'Sunday'] 
          : host.venueType === 'WAREHOUSE' 
            ? ['Thursday', 'Friday', 'Saturday'] 
            : ['Friday', 'Saturday'], // Derived from venue type, TODO: Store in database
        estimatedShowsPerYear: host.hostingExperience || 10,
        avgDoorFee: host.suggestedDoorFee || 20, // Use suggested door fee with fallback
        hostingHistory: `${host.hostingExperience || 0} years`
      },
      // Amenities from database
      amenities: host.amenities || [],
      // Sound system from database
      soundSystem: host.soundSystem || {
        available: false,
        description: '',
        equipment: {
          speakers: '',
          microphones: '',
          instruments: '',
          additional: ''
        }
      },
      // Hosting capabilities - transform lodging details
      hostingCapabilities: host.offersLodging && host.lodgingDetails ? {
        lodgingHosting: {
          enabled: true,
          lodgingDetails: host.lodgingDetails
        }
      } : null,
      // Musical Preferences - extract from lodgingDetails
      preferredActSize: (() => {
        const lodging = host.lodgingDetails as any;
        return lodging?.preferredActSize || 'Doesn\'t Matter';
      })(),
      actSizeNotes: (() => {
        const lodging = host.lodgingDetails as any;
        return lodging?.actSizeNotes || '';
      })(),
      whatWeEnjoy: (() => {
        const lodging = host.lodgingDetails as any;
        return lodging?.whatWeEnjoy || '';
      })(),
      musicWeArentInto: (() => {
        const lodging = host.lodgingDetails as any;
        return lodging?.musicWeArentInto || '';
      })(),
      contentRating: (() => {
        const lodging = host.lodgingDetails as any;
        return lodging?.contentRating || 'Kid Friendly';
      })(),
      // Upcoming concerts
      upcomingConcerts: host.bookings.map(booking => ({
        id: booking.concert?.id,
        title: `${booking.artist.user.name} Live`,
        artistName: booking.artist.user.name,
        date: booking.concert?.date,
        startTime: booking.concert?.startTime,
        capacity: booking.concert?.maxCapacity,
        ticketPrice: booking.concert?.doorFee || 0,
        status: 'upcoming'
      })).filter(c => c.id)
    };

    return NextResponse.json(transformedHost);
  } catch (error) {
    console.error('Error fetching host:', error);
    return NextResponse.json(
      { error: 'Failed to fetch host data' },
      { status: 500 }
    );
  }
}

// Update host profile
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const hostId = params.id;
    const data = await request.json();

    // Verify ownership
    const host = await prisma.host.findUnique({
      where: { id: hostId },
      select: { userId: true }
    });

    if (!host || host.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update host profile
    const updatedHost = await prisma.host.update({
      where: { id: hostId },
      data: {
        venueName: data.venueName,
        venueType: data.venueType,
        city: data.city,
        state: data.state,
        actualAddress: data.actualAddress,
        indoorCapacity: data.indoorCapacity,
        outdoorCapacity: data.outdoorCapacity,
        preferredGenres: data.preferredGenres,
        hostingExperience: data.hostingExperience,
        typicalShowLength: data.typicalShowLength,
        houseRules: data.houseRules,
        offersLodging: data.offersLodging,
        lodgingDetails: (() => {
          // Merge musical preferences with existing lodgingDetails
          const existingLodging = data.lodgingDetails || {};
          const updatedLodging = { ...existingLodging };
          
          // Add musical preferences if provided
          if (data.preferredActSize !== undefined) {
            updatedLodging.preferredActSize = data.preferredActSize;
          }
          if (data.actSizeNotes !== undefined) {
            updatedLodging.actSizeNotes = data.actSizeNotes;
          }
          if (data.whatWeEnjoy !== undefined) {
            updatedLodging.whatWeEnjoy = data.whatWeEnjoy;
          }
          if (data.musicWeArentInto !== undefined) {
            updatedLodging.musicWeArentInto = data.musicWeArentInto;
          }
          if (data.contentRating !== undefined) {
            updatedLodging.contentRating = data.contentRating;
          }
          
          return updatedLodging;
        })(),
        suggestedDoorFee: data.suggestedDoorFee
      }
    });

    // Update user profile if provided
    if (data.bio || data.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: data.name,
          profile: {
            update: {
              bio: data.bio
            }
          }
        }
      });
    }

    return NextResponse.json({ success: true, host: updatedHost });
  } catch (error) {
    console.error('Error updating host:', error);
    return NextResponse.json(
      { error: 'Failed to update host profile' },
      { status: 500 }
    );
  }
}