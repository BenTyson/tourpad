import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artistId } = await params;

    // Find artist by userId (the ID passed is the user ID)
    const artist = await prisma.artist.findFirst({
      where: { 
        userId: artistId 
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

    // Calculate rating from reviews (for now use default values)
    const rating = 4.8; // TODO: Calculate from actual reviews table
    const reviewCount = 24; // TODO: Count from actual reviews table

    // Return the artist data
    return NextResponse.json({
      id: artist.id,
      name: artist.user.name,
      bio: artist.user.profile?.bio || '',
      location: artist.user.profile?.location || '',
      genres: artist.genres || [],
      instruments: [], // Not in schema yet
      yearsActive: 0, // Not in schema yet
      experienceLevel: 'beginner', // Not in schema yet
      profileImageUrl: artist.user.profile?.profileImageUrl || '',
      website: artist.user.profile?.websiteUrl || '',
      socialLinks: artist.user.profile?.socialLinks || {},
      rating: rating,
      reviewCount: reviewCount,
      tourMonthsPerYear: artist.tourMonthsPerYear || 0,
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
        title: media.title,
        description: media.description,
        sortOrder: media.sortOrder,
        category: media.category
      })) || [],
      createdAt: artist.createdAt,
      updatedAt: artist.updatedAt
    });

  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}