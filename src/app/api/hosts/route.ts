import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get search params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const minAttendance = searchParams.get('minAttendance');
    const maxDoorFee = searchParams.get('maxDoorFee');
    
    // Build where clause for filtering
    const whereClause: any = {
      // Only show approved hosts
      approvedAt: {
        not: null
      }
    };

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { venueName: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Add capacity filter
    if (minAttendance) {
      whereClause.OR = [
        { indoorCapacity: { gte: parseInt(minAttendance) } },
        { outdoorCapacity: { gte: parseInt(minAttendance) } }
      ];
    }

    // Add door fee filter
    if (maxDoorFee) {
      whereClause.suggestedDoorFee = { lte: parseInt(maxDoorFee) };
    }

    const hosts = await prisma.host.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            profile: true
          }
        },
        media: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate ratings for all hosts in parallel
    const hostsWithRatings = await Promise.all(
      hosts.map(async (host) => {
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

        const rating = reviewStats._avg.hostRating ? Math.round(reviewStats._avg.hostRating * 10) / 10 : 0;
        const reviewCount = reviewStats._count.id || 0;

        return {
          id: host.id,
          userId: host.userId,
          name: host.venueName || host.user.name,
          bio: host.venueDescription || host.user.profile?.bio || 'No description available',
          city: host.city,
          state: host.state,
          zip: '', // Not stored in current schema
          venueType: host.venueType?.toLowerCase() || 'home',
          showSpecs: {
            avgAttendance: Math.floor((host.indoorCapacity || 0) * 0.8),
            avgDoorFee: host.suggestedDoorFee || 20,
            indoorAttendanceMax: host.indoorCapacity || 0,
            outdoorAttendanceMax: host.outdoorCapacity || 0,
            showDurationMins: host.typicalShowLength || 120,
            showFormat: host.venueType === 'HOME' ? 'Intimate house concert' : 'Venue performance',
            estimatedShowsPerYear: host.hostingExperience || 10,
            hostingHistory: `${host.hostingExperience || 0} years`,
            daysAvailable: host.venueType === 'HOME' 
              ? ['Friday', 'Saturday', 'Sunday'] 
              : host.venueType === 'WAREHOUSE' 
                ? ['Thursday', 'Friday', 'Saturday'] 
                : ['Friday', 'Saturday'], // Derived from venue type, TODO: Store in database
            performanceLocation: host.venueType?.toLowerCase() || 'home'
          },
          amenities: {
            powerAccess: host.amenities?.includes('Power access for equipment') || false,
            airConditioning: host.amenities?.includes('Air conditioning / Heating') || false,
            wifi: host.amenities?.includes('WiFi available') || false,
            kidFriendly: host.amenities?.includes('Kid friendly environment') || false,
            adultsOnly: false,
            parking: host.amenities?.includes('Free parking on premises') || false,
            petFriendly: host.amenities?.includes('Pet friendly') || false,
            soundSystem: host.amenities?.includes('Sound system provided') || false,
            soundSystemSpecs: (host.soundSystem as any)?.description || '',
            outdoorSpace: host.amenities?.includes('Outdoor space') || false,
            accessible: host.amenities?.includes('Step-free access') || false,
            bnbOffered: host.offersLodging || false
          },
          housePhotos: host.media
            .filter(m => m.category === 'house' || m.category === 'venue')
            .map(m => ({
              id: m.id,
              url: m.fileUrl,
              alt: m.title || 'House photo',
              category: 'house' as const
            })),
          performanceSpacePhotos: host.media
            .filter(m => m.category === 'performance_space')
            .map(m => ({
              id: m.id,
              url: m.fileUrl,
              alt: m.title || 'Performance space photo',
              category: 'performance_space' as const
            })),
          rating,
          reviewCount,
          createdAt: host.createdAt,
          updatedAt: host.updatedAt,
          // Additional fields for host info
          hostInfo: {
            hostName: host.user.name,
            aboutMe: host.user.profile?.bio || 'Passionate about bringing live music into intimate settings.',
            profilePhoto: host.user.profile?.profileImageUrl || ''
          }
        };
      })
    );

    return NextResponse.json(hostsWithRatings);
  } catch (error) {
    console.error('Error fetching hosts:', error);
    return NextResponse.json({ error: 'Failed to fetch hosts' }, { status: 500 });
  }
}