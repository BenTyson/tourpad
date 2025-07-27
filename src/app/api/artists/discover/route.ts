import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/artists/discover - Discover artists based on tour schedules and filters
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access (active hosts, artists, or admins)
    if (session.user.status !== 'ACTIVE' && session.user.type !== 'admin') {
      return NextResponse.json({ error: 'Active membership required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const state = searchParams.get('state'); // e.g., "CO", "CA"
    const city = searchParams.get('city'); // e.g., "Denver", "Boulder"
    const startDate = searchParams.get('startDate'); // ISO date string
    const endDate = searchParams.get('endDate'); // ISO date string
    const genres = searchParams.get('genres')?.split(',').filter(Boolean) || []; // e.g., "folk,rock"
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('Artist discovery search:', {
      state,
      city,
      startDate,
      endDate,
      genres,
      limit,
      offset
    });

    // Build the where clause for tour state ranges
    const tourWhereClause: any = {
      tourSegment: {
        isPublic: true,
        status: {
          not: 'cancelled'
        }
      }
    };

    // Filter by state
    if (state) {
      tourWhereClause.state = state;
    }

    // Filter by city (if cities array contains the specified city)
    if (city) {
      tourWhereClause.cities = {
        has: city
      };
    }

    // Filter by date range
    if (startDate || endDate) {
      tourWhereClause.AND = [];
      
      if (startDate) {
        tourWhereClause.AND.push({
          endDate: {
            gte: new Date(startDate)
          }
        });
      }
      
      if (endDate) {
        tourWhereClause.AND.push({
          startDate: {
            lte: new Date(endDate)
          }
        });
      }
    }

    // Find tour state ranges that match criteria
    const matchingTourRanges = await prisma.tourStateRange.findMany({
      where: tourWhereClause,
      include: {
        tourSegment: {
          include: {
            artist: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    city: true,
                    state: true,
                    profilePhotoUrl: true
                  }
                },
                media: true,
                bandMembers: true
              }
            }
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    });

    // Process results to deduplicate artists and filter by genres
    const artistMap = new Map();
    const now = new Date();

    matchingTourRanges.forEach((range) => {
      const artist = range.tourSegment.artist;
      const artistId = artist.id;

      // Skip if we already have this artist
      if (artistMap.has(artistId)) {
        // But add this tour range to existing artist
        artistMap.get(artistId).tourRanges.push({
          id: range.id,
          tourName: range.tourSegment.name,
          state: range.state,
          startDate: range.startDate,
          endDate: range.endDate,
          cities: range.cities,
          notes: range.notes
        });
        return;
      }

      // Filter by genres if specified
      if (genres.length > 0) {
        const artistGenres = artist.genres || [];
        const hasMatchingGenre = genres.some(genre => 
          artistGenres.some(artistGenre => 
            artistGenre.toLowerCase().includes(genre.toLowerCase())
          )
        );
        if (!hasMatchingGenre) {
          return;
        }
      }

      // Create artist entry with tour information
      artistMap.set(artistId, {
        id: artist.id,
        userId: artist.userId,
        name: artist.user.name,
        city: artist.user.city,
        state: artist.user.state,
        profilePhotoUrl: artist.user.profilePhotoUrl,
        thumbnailPhoto: artist.pressPhotoUrl,
        heroPhoto: artist.heroPhotoUrl,
        genres: artist.genres,
        briefBio: artist.briefBio,
        contentRating: artist.contentRating,
        tourMonthsPerYear: artist.tourMonthsPerYear,
        tourVehicle: artist.tourVehicle,
        willingToTravel: artist.willingToTravel,
        needsLodging: artist.needsLodging,
        bandMembers: artist.bandMembers,
        performancePhotos: artist.media?.filter(m => m.category === 'performance') || [],
        tourRanges: [{
          id: range.id,
          tourName: range.tourSegment.name,
          state: range.state,
          startDate: range.startDate,
          endDate: range.endDate,
          cities: range.cities,
          notes: range.notes
        }]
      });
    });

    // Convert map to array and apply pagination
    const allArtists = Array.from(artistMap.values());
    const totalCount = allArtists.length;
    const paginatedArtists = allArtists.slice(offset, offset + limit);

    // Sort tour ranges within each artist by start date
    paginatedArtists.forEach(artist => {
      artist.tourRanges.sort((a: any, b: any) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    });

    console.log(`Found ${totalCount} artists with matching tours, returning ${paginatedArtists.length}`);

    return NextResponse.json({
      artists: paginatedArtists,
      totalCount,
      hasMore: offset + limit < totalCount,
      pagination: {
        limit,
        offset,
        nextOffset: offset + limit < totalCount ? offset + limit : null
      }
    });

  } catch (error) {
    console.error('Error in artist discovery:', error);
    return NextResponse.json({ 
      error: 'Failed to search artists',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}