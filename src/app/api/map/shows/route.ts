import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Default coordinates for shows without location data
const DEFAULT_LOCATIONS = [
  { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX' },
  { lat: 36.1627, lng: -86.7816, city: 'Nashville', state: 'TN' },
  { lat: 45.5152, lng: -122.6784, city: 'Portland', state: 'OR' },
  { lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO' },
  { lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'FL' },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters
    const genres = searchParams.get('genres')?.split(',') || [];
    const priceMin = searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : 0;
    const priceMax = searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : 999;
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : new Date();
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now
    const searchLocation = searchParams.get('searchLocation') || '';
    const showTypes = searchParams.get('showTypes')?.split(',') || [];
    const ageRestrictions = searchParams.get('ageRestrictions')?.split(',') || [];

    // Build where clause for confirmed shows only
    const where: any = {
      status: 'CONFIRMED',
      date: {
        gte: dateFrom,
        lte: dateTo
      }
    };

    // Price filter
    if (priceMin > 0 || priceMax < 999) {
      where.doorFee = {
        gte: priceMin,
        lte: priceMax
      };
    }

    // Location search filter
    if (searchLocation) {
      const searchLower = searchLocation.toLowerCase();
      where.booking = {
        host: {
          OR: [
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
          ]
        }
      };
    }

    // Fetch confirmed concerts with booking and artist data
    const concerts = await prisma.concert.findMany({
      where,
      include: {
        booking: {
          include: {
            artist: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profileImageUrl: true
                  }
                },
                media: {
                  where: {
                    mediaType: 'PHOTO'
                  },
                  orderBy: {
                    sortOrder: 'asc'
                  },
                  take: 1
                }
              }
            },
            host: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profileImageUrl: true
                  }
                }
              }
            }
          }
        },
        rsvps: {
          where: {
            status: 'APPROVED'
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Filter by genres if specified
    let filteredConcerts = concerts;
    if (genres.length > 0) {
      filteredConcerts = concerts.filter(concert => {
        const artistGenres = concert.booking.artist.genres || [];
        return genres.some(genre => 
          artistGenres.some(artistGenre => 
            artistGenre.toLowerCase().includes(genre.toLowerCase())
          )
        );
      });
    }

    // Transform concerts data for map display
    const mapShows = filteredConcerts.map((concert, index) => {
      const { booking } = concert;
      const artist = booking.artist;
      const host = booking.host;

      // Get coordinates - use exact location for confirmed public shows
      let lat = 0;
      let lng = 0;
      
      if (host.displayCoordinates) {
        try {
          const coords = JSON.parse(host.displayCoordinates);
          lat = coords.lat || 0;
          lng = coords.lng || 0;
        } catch (e) {
          const defaultLocation = DEFAULT_LOCATIONS[index % DEFAULT_LOCATIONS.length];
          lat = defaultLocation.lat;
          lng = defaultLocation.lng;
        }
      } else {
        const defaultLocation = DEFAULT_LOCATIONS[index % DEFAULT_LOCATIONS.length];
        lat = defaultLocation.lat;
        lng = defaultLocation.lng;
      }

      // Determine show type based on door fee
      let showType = 'ticketed';
      if (!concert.doorFee || concert.doorFee === 0) {
        showType = 'free';
      } else if (concert.doorFee > 0 && concert.doorFee <= 10) {
        showType = 'donation';
      }

      // Calculate RSVP status
      const approvedRSVPs = concert.rsvps.length;
      const rsvpStatus = approvedRSVPs >= concert.maxCapacity ? 'sold_out' : 
                        approvedRSVPs >= concert.maxCapacity * 0.9 ? 'waitlist' : 'available';

      // Map venue type
      const venueTypeMap: Record<string, string> = {
        'HOME': 'Home/Living Room',
        'LOFT': 'Loft/Warehouse',
        'STUDIO': 'Studio/Workshop', 
        'BACKYARD': 'Backyard',
        'OTHER': 'Other'
      };

      return {
        id: concert.id,
        bookingId: booking.id,
        title: concert.title || `${artist.stageName || artist.user.name} Live`,
        description: concert.description,
        date: concert.date,
        startTime: concert.startTime,
        endTime: concert.endTime,
        
        // Artist information
        artist: {
          id: artist.id,
          userId: artist.user.id,
          name: artist.user.name,
          stageName: artist.stageName,
          profileImageUrl: artist.user.profileImageUrl,
          genres: artist.genres,
          media: artist.media.map(m => ({
            id: m.id,
            url: m.fileUrl,
            type: m.mediaType
          }))
        },
        
        // Host/Venue information
        host: {
          id: host.id,
          userId: host.user.id,
          name: host.user.name,
          venueName: host.venueName || `${host.user.name}'s Place`,
          venueType: venueTypeMap[host.venueType] || host.venueType,
          profileImageUrl: host.user.profileImageUrl
        },
        
        // Location (exact coordinates for confirmed shows)
        coordinates: [lat, lng] as [number, number],
        address: {
          city: host.city,
          state: host.state,
          country: host.country,
          // Exact address revealed for confirmed shows
          fullAddress: host.actualAddress
        },
        
        // Show details
        capacity: concert.maxCapacity,
        doorFee: concert.doorFee,
        showType,
        isPrivate: concert.isPrivate,
        requiresApproval: concert.requiresApproval,
        
        // RSVP information
        rsvpStatus,
        rsvpCount: approvedRSVPs,
        availableSpots: Math.max(0, concert.maxCapacity - approvedRSVPs),
        
        // Additional metadata
        status: concert.status,
        advanceTicketsAvailable: concert.advanceTicketsAvailable,
        
        // Map-specific data
        mapLocation: {
          searchKeywords: [
            host.city.toLowerCase(),
            host.state.toLowerCase(),
            ...(artist.genres || []).map(g => g.toLowerCase()),
            artist.stageName?.toLowerCase() || artist.user.name.toLowerCase(),
            venueTypeMap[host.venueType]?.toLowerCase() || host.venueType.toLowerCase()
          ]
        }
      };
    });

    // Calculate bounds for map viewport
    const bounds = mapShows.length > 0 ? {
      north: Math.max(...mapShows.map(s => s.coordinates[0])),
      south: Math.min(...mapShows.map(s => s.coordinates[0])),
      east: Math.max(...mapShows.map(s => s.coordinates[1])),
      west: Math.min(...mapShows.map(s => s.coordinates[1]))
    } : null;

    return NextResponse.json({
      shows: mapShows,
      total: mapShows.length,
      bounds,
      filters: {
        genres,
        priceRange: { min: priceMin, max: priceMax },
        dateRange: { from: dateFrom, to: dateTo },
        searchLocation,
        showTypes,
        ageRestrictions
      }
    });

  } catch (error) {
    console.error('Error fetching map shows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shows' },
      { status: 500 }
    );
  }
}