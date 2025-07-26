import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artistId } = await params;

    // Find artist by artist ID (the ID passed is the artist ID)
    const artist = await prisma.artist.findFirst({
      where: { 
        id: artistId,
        // Only show approved artists
        approvedAt: {
          not: null
        }
      },
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
          where: { mediaType: 'PHOTO' },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Calculate years active from formation year (fallback to creation date)
    const formationYear = artist.createdAt.getFullYear(); // TODO: Use actual formationYear field when added to schema
    const yearsActive = Math.max(1, new Date().getFullYear() - formationYear);
    
    // Calculate rating from reviews using database
    const reviewStats = await prisma.review.aggregate({
      where: {
        artistId: artist.id,
        isPublic: true
      },
      _avg: {
        artistRating: true
      },
      _count: {
        id: true
      }
    });

    const rating = reviewStats._avg.artistRating ? Math.round(reviewStats._avg.artistRating * 10) / 10 : 0;
    const reviewCount = reviewStats._count.id;

    // Return the artist data in the format expected by the profile page
    return NextResponse.json({
      id: artist.id,
      userId: artist.userId,
      name: artist.stageName || artist.user.name,
      bio: artist.user.profile?.bio || 'Professional touring musician bringing unique sounds to intimate venues.',
      location: artist.user.profile?.location || '',
      genres: artist.genres || [],
      instruments: artist.bandMembers.map(member => member.instrument).filter(Boolean),
      yearsActive,
      formationYear,
      experienceLevel: yearsActive >= 5 ? 'professional' : yearsActive >= 2 ? 'intermediate' : 'emerging',
      profileImageUrl: artist.media
        .filter(m => m.mediaType === 'PHOTO' && m.category === 'profile')
        .map(m => m.fileUrl)[0] || 
        artist.user.profile?.profileImageUrl ||
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=faces',
      website: artist.user.profile?.websiteUrl || '',
      socialLinks: {
        website: artist.user.profile?.websiteUrl || '',
        spotify: (artist.user.profile?.socialLinks as any)?.spotify || '',
        facebook: (artist.user.profile?.socialLinks as any)?.facebook || '',
        instagram: (artist.user.profile?.socialLinks as any)?.instagram || '',
        x: (artist.user.profile?.socialLinks as any)?.x || '',
        youtube: (artist.user.profile?.socialLinks as any)?.youtube || '',
        patreon: (artist.user.profile?.socialLinks as any)?.patreon || ''
      },
      rating: rating || 0,
      reviewCount,
      tourMonthsPerYear: artist.tourMonthsPerYear || 3,
      tourVehicle: artist.tourVehicle || 'van',
      willingToTravel: artist.willingToTravel || 500,
      equipmentProvided: artist.equipmentNeeds || [],
      venueRequirements: artist.venueRequirements || [],
      bandMembers: artist.bandMembers?.map(member => ({
        id: member.id,
        name: member.name,
        instrument: member.instrument || '',
        photo: member.photoUrl || ''
      })) || [],
      videoLinks: (() => {
        let videos = artist.videoLinks ? (artist.videoLinks as any[]) : [];
        
        // If no videos but has application performance video, include it as default
        if (videos.length === 0 && artist.performanceVideoUrl) {
          videos = [{
            id: 'application-video',
            title: `${artist.stageName || artist.user.name}: Live Performance`,
            url: artist.performanceVideoUrl,
            platform: 'youtube', // Assume YouTube for now
            category: 'live_performance',
            isLivePerformance: true
          }];
        }
        
        return videos;
      })(),
      musicSamples: artist.musicSamples ? (artist.musicSamples as any[]) : [],
      photos: artist.media?.map(media => ({
        id: media.id,
        fileUrl: media.fileUrl,
        title: media.title || 'Artist photo',
        description: media.description || '',
        sortOrder: media.sortOrder,
        category: media.category || 'promotional'
      })) || [],
      // Spotify fields
      spotifyVerified: artist.spotifyVerified || false,
      spotifyFollowers: artist.spotifyFollowers || null,
      spotifyPopularity: artist.spotifyPopularity || null,
      spotifyArtistId: artist.spotifyArtistId || null,
      createdAt: artist.createdAt,
      updatedAt: artist.updatedAt
    });

  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}