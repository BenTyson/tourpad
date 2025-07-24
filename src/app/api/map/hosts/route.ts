import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface LocationPrivacy {
  displayCoordinates: {
    lat: number;
    lng: number;
  };
  actualCoordinates: {
    lat: number;
    lng: number;
  };
  privacyLevel: 'neighborhood' | 'street' | 'exact';
}

// Simple cache for obfuscated coordinates
const coordinateCache = new Map<string, [number, number]>();

// Location obfuscation utility with caching
function obfuscateCoordinates(
  lat: number, 
  lng: number, 
  privacyLevel: 'neighborhood' | 'street' | 'exact' = 'neighborhood'
): [number, number] {
  const cacheKey = `${lat},${lng},${privacyLevel}`;
  
  // Return cached result if exists
  if (coordinateCache.has(cacheKey)) {
    return coordinateCache.get(cacheKey)!;
  }

  const radiusMap = {
    neighborhood: 0.015, // ~1 mile
    street: 0.003,       // ~0.2 mile
    exact: 0             // No obfuscation
  };
  
  const radius = radiusMap[privacyLevel];
  const randomLat = lat + (Math.random() - 0.5) * radius * 2;
  const randomLng = lng + (Math.random() - 0.5) * radius * 2;
  
  const result: [number, number] = [randomLat, randomLng];
  
  // Cache the result (keep cache reasonable size)
  if (coordinateCache.size < 100) {
    coordinateCache.set(cacheKey, result);
  }
  
  return result;
}

// Default coordinates for hosts without location data
const DEFAULT_LOCATIONS = [
  { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX' }, // Austin
  { lat: 36.1627, lng: -86.7816, city: 'Nashville', state: 'TN' }, // Nashville
  { lat: 45.5152, lng: -122.6784, city: 'Portland', state: 'OR' }, // Portland
  { lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO' }, // Denver
  { lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'FL' }, // Miami
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters
    const venueTypes = searchParams.get('venueTypes')?.split(',') || [];
    const capacityMin = searchParams.get('capacityMin') ? parseInt(searchParams.get('capacityMin')!) : 0;
    const capacityMax = searchParams.get('capacityMax') ? parseInt(searchParams.get('capacityMax')!) : 999;
    const searchLocation = searchParams.get('searchLocation') || '';
    const amenities = searchParams.get('amenities')?.split(',') || [];
    const offersLodging = searchParams.get('offersLodging') === 'true';
    
    // Build where clause for filtering
    const where: any = {
      user: {
        status: {
          in: ['APPROVED', 'ACTIVE']
        }
      }
    };

    // Venue type filter
    if (venueTypes.length > 0) {
      const venueTypeMap: Record<string, string> = {
        'Home/Living Room': 'HOME',
        'Loft/Warehouse': 'LOFT',
        'Studio/Workshop': 'STUDIO',
        'Backyard': 'BACKYARD',
        'Other': 'OTHER'
      };
      
      where.venueType = {
        in: venueTypes.map(type => venueTypeMap[type] || type)
      };
    }

    // Capacity filter
    if (capacityMin > 0 || capacityMax < 999) {
      where.OR = [
        {
          indoorCapacity: {
            gte: capacityMin,
            lte: capacityMax
          }
        },
        {
          outdoorCapacity: {
            gte: capacityMin,
            lte: capacityMax
          }
        }
      ];
    }

    // Location search filter
    if (searchLocation) {
      const searchLower = searchLocation.toLowerCase();
      where.OR = [
        ...(where.OR || []),
        {
          city: {
            contains: searchLower,
            mode: 'insensitive'
          }
        },
        {
          state: {
            contains: searchLower,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Lodging filter
    if (offersLodging) {
      where.offersLodging = true;
    }

    // Fetch approved hosts with user data
    const hosts = await prisma.host.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            email: true
          }
        },
        media: {
          where: {
            mediaType: 'PHOTO'
          },
          orderBy: {
            sortOrder: 'asc'
          },
          take: 3
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform hosts data with location obfuscation and map format
    const mapHosts = hosts.map((host, index) => {
      // Use actual coordinates if available, otherwise assign default location
      let actualLat = 0;
      let actualLng = 0;
      
      if (host.displayCoordinates) {
        try {
          const coords = JSON.parse(host.displayCoordinates);
          actualLat = coords.lat || 0;
          actualLng = coords.lng || 0;
        } catch (e) {
          // If parsing fails, use default location
          const defaultLocation = DEFAULT_LOCATIONS[index % DEFAULT_LOCATIONS.length];
          actualLat = defaultLocation.lat;
          actualLng = defaultLocation.lng;
        }
      } else {
        // Assign default location based on city/state or use rotating defaults
        const defaultLocation = DEFAULT_LOCATIONS[index % DEFAULT_LOCATIONS.length];
        actualLat = defaultLocation.lat;
        actualLng = defaultLocation.lng;
      }

      // Apply location obfuscation for privacy
      const [displayLat, displayLng] = obfuscateCoordinates(actualLat, actualLng, 'neighborhood');

      // Calculate max capacity
      const maxCapacity = Math.max(host.indoorCapacity || 0, host.outdoorCapacity || 0);

      // Map venue type back to display format
      const venueTypeMap: Record<string, string> = {
        'HOME': 'Home/Living Room',
        'LOFT': 'Loft/Warehouse', 
        'STUDIO': 'Studio/Workshop',
        'BACKYARD': 'Backyard',
        'OTHER': 'Other'
      };

      return {
        id: host.id,
        userId: host.user.id,
        name: host.user.name,
        email: host.user.email,
        profileImageUrl: host.user.profileImageUrl,
        venueName: host.venueName || `${host.user.name}'s Place`,
        venueType: venueTypeMap[host.venueType] || host.venueType,
        city: host.city,
        state: host.state,
        country: host.country,
        description: host.venueDescription || '',
        capacity: maxCapacity,
        indoorCapacity: host.indoorCapacity,
        outdoorCapacity: host.outdoorCapacity,
        preferredGenres: host.preferredGenres,
        suggestedDoorFee: host.suggestedDoorFee,
        // Location data with privacy
        coordinates: [displayLat, displayLng] as [number, number],
        actualCoordinates: [actualLat, actualLng] as [number, number], // Only for confirmed bookings
        // Amenities mapping
        amenities: {
          soundSystem: host.amenities?.includes('sound_system') || false,
          parking: host.amenities?.includes('parking') || false,
          accessible: host.amenities?.includes('accessible') || false,
          kidFriendly: host.amenities?.includes('kid_friendly') || false,
          outdoorSpace: host.amenities?.includes('outdoor_space') || false,
        },
        // Additional metadata
        media: host.media.map(m => ({
          id: m.id,
          url: m.fileUrl,
          type: m.mediaType
        })),
        hostingExperience: host.hostingExperience || 0,
        offersLodging: host.offersLodging,
        lodgingDetails: host.lodgingDetails,
        houseRules: host.houseRules,
        // UI properties for sorting (placeholder values for now)
        rating: 4.0 + Math.random() * 1.0, // TODO: Calculate from actual reviews
        reviewCount: Math.floor(Math.random() * 20), // TODO: Count actual reviews
        // Map-specific data
        mapLocation: {
          searchKeywords: [
            host.city.toLowerCase(),
            host.state.toLowerCase(),
            ...(host.preferredGenres || []).map(g => g.toLowerCase()),
            venueTypeMap[host.venueType]?.toLowerCase() || host.venueType.toLowerCase()
          ],
          priceRange: host.suggestedDoorFee 
            ? `$${host.suggestedDoorFee}-${host.suggestedDoorFee + 10}` 
            : '$15-25' // Default price range
        }
      };
    });

    // Calculate bounds for map viewport
    const bounds = mapHosts.length > 0 ? {
      north: Math.max(...mapHosts.map(h => h.coordinates[0])),
      south: Math.min(...mapHosts.map(h => h.coordinates[0])),
      east: Math.max(...mapHosts.map(h => h.coordinates[1])),
      west: Math.min(...mapHosts.map(h => h.coordinates[1]))
    } : null;

    return NextResponse.json({
      hosts: mapHosts,
      total: mapHosts.length,
      bounds,
      filters: {
        venueTypes,
        capacityRange: { min: capacityMin, max: capacityMax },
        searchLocation,
        amenities,
        offersLodging
      }
    });

  } catch (error) {
    console.error('Error fetching map hosts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hosts' },
      { status: 500 }
    );
  }
}