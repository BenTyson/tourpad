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

    // Calculate approximate years active
    const yearsActive = Math.max(1, new Date().getFullYear() - artist.createdAt.getFullYear());
    
    // Calculate rating from reviews (for now use default values)
    const rating = 4.8; // TODO: Calculate from actual reviews table
    const reviewCount = Math.floor(Math.random() * 20) + 5; // TODO: Count from actual reviews table

    // Return the artist data in the format expected by the profile page
    return NextResponse.json({
      id: artist.id,
      name: artist.stageName || artist.user.name,
      bio: artist.user.profile?.bio || 'Professional touring musician bringing unique sounds to intimate venues.',
      location: artist.user.profile?.location || '',
      genres: artist.genres || [],
      instruments: artist.bandMembers.map(member => member.instrument).filter(Boolean),
      yearsActive,
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
      rating,
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
      videoLinks: artist.videoLinks ? (artist.videoLinks as any[]) : [],
      musicSamples: artist.musicSamples ? (artist.musicSamples as any[]) : [],
      photos: artist.media?.map(media => ({
        id: media.id,
        fileUrl: media.fileUrl,
        title: media.title || 'Artist photo',
        description: media.description || '',
        sortOrder: media.sortOrder,
        category: media.category || 'promotional'
      })) || [],
      createdAt: artist.createdAt,
      updatedAt: artist.updatedAt
    });

  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}