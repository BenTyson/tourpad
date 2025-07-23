import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get search params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const minYearsActive = searchParams.get('minYearsActive');
    const maxTourMonths = searchParams.get('maxTourMonths');
    const genre = searchParams.get('genre');
    
    // Build where clause for filtering
    const whereClause: any = {
      // Only show approved artists
      approvedAt: {
        not: null
      }
    };

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { stageName: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { genres: { has: search } }
      ];
    }

    // Add genre filter
    if (genre) {
      whereClause.genres = { has: genre };
    }

    // Add years active filter
    if (minYearsActive) {
      // Calculate approximate years active from createdAt
      const yearsCutoff = new Date();
      yearsCutoff.setFullYear(yearsCutoff.getFullYear() - parseInt(minYearsActive));
      whereClause.createdAt = { lte: yearsCutoff };
    }

    // Add tour months filter
    if (maxTourMonths) {
      whereClause.tourMonthsPerYear = { lte: parseInt(maxTourMonths) };
    }

    const artists = await prisma.artist.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            profile: true
          }
        },
        bandMembers: {
          orderBy: { sortOrder: 'asc' }
        },
        media: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate ratings for all artists in parallel
    const artistsWithRatings = await Promise.all(
      artists.map(async (artist) => {
        // Calculate approximate years active
        const yearsActive = Math.max(1, new Date().getFullYear() - artist.createdAt.getFullYear());
        
        // Calculate rating from reviews using database
        const reviewStats = await prisma.review.aggregate({
          where: {
            revieweeId: artist.userId,
            isPublic: true
          },
          _avg: {
            rating: true
          },
          _count: {
            id: true
          }
        });

        const rating = reviewStats._avg.rating ? Math.round(reviewStats._avg.rating * 10) / 10 : 0;
        const reviewCount = reviewStats._count.id;
        
        return {
          id: artist.id,
          userId: artist.userId,
          name: artist.stageName || artist.user.name,
          bio: artist.user.profile?.bio || 'Professional touring musician bringing unique sounds to intimate venues.',
          yearsActive,
          location: artist.user.profile?.location || '',
          genres: artist.genres,
          instruments: artist.bandMembers.map(member => member.instrument).filter(Boolean),
          experienceLevel: yearsActive >= 5 ? 'professional' : yearsActive >= 2 ? 'intermediate' : 'emerging',
          members: artist.bandMembers.map(member => ({
            name: member.name,
            instrument: member.instrument || '',
            photo: member.photoUrl || '',
            bio: member.bio || ''
          })),
          tourMonthsPerYear: artist.tourMonthsPerYear || 3,
          tourVehicle: artist.tourVehicle || 'van',
          requireHomeStay: artist.needsLodging || false,
          petAllergies: '',
          dietaryRestrictions: '',
          travelWithAnimals: false,
          ownSoundSystem: artist.equipmentNeeds?.includes('Sound System') || false,
          socialLinks: {
            website: artist.user.profile?.websiteUrl || '',
            spotify: (artist.user.profile?.socialLinks as any)?.spotify || '',
            facebook: (artist.user.profile?.socialLinks as any)?.facebook || '',
            instagram: (artist.user.profile?.socialLinks as any)?.instagram || '',
            x: (artist.user.profile?.socialLinks as any)?.x || '',
            youtube: (artist.user.profile?.socialLinks as any)?.youtube || '',
            patreon: (artist.user.profile?.socialLinks as any)?.patreon || ''
          },
          paymentLinks: {
            venmo: '',
            paypal: ''
          },
          concertHistory: {
            totalShows: Math.floor(yearsActive * (artist.tourMonthsPerYear || 3) * 2), // Estimate
            last12Months: Math.floor((artist.tourMonthsPerYear || 3) * 2),
            favoriteVenues: []
          },
          venueRequirements: artist.venueRequirements || [],
          cancellationPolicy: 'moderate' as const,
          photos: artist.media
            .filter(m => m.mediaType === 'PHOTO')
            .map(m => ({
              id: m.id,
              url: m.fileUrl,
              alt: m.title || 'Artist photo',
              category: m.category || 'promotional'
            })),
          profilePhoto: artist.media
            .filter(m => m.mediaType === 'PHOTO' && m.category === 'profile')
            .map(m => m.fileUrl)[0] || 
            artist.user.profile?.profileImageUrl ||
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=faces',
          musicSamples: artist.musicSamples ? (artist.musicSamples as any[]) : [],
          videoLinks: artist.videoLinks ? (artist.videoLinks as any[]) : [],
          pressPhotoUrl: artist.pressPhotoUrl || '',
          performanceVideoUrl: artist.performanceVideoUrl || '',
          minGuarantee: artist.minGuarantee || 0,
          typicalSetLength: artist.typicalSetLength || 90,
          travelRadius: artist.willingToTravel || 500,
          preferredBookingAdvance: artist.preferredBookingAdvance || 30,
          rating,
          reviewCount,
          verified: !!artist.approvedAt,
          createdAt: artist.createdAt,
          updatedAt: artist.updatedAt
        };
      })
    );

    return NextResponse.json(artistsWithRatings);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
}