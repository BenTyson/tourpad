import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exclude = searchParams.get('exclude');
    const limit = parseInt(searchParams.get('limit') || '10');

    const artists = await prisma.artist.findMany({
      where: exclude ? {
        NOT: {
          OR: [
            { id: exclude },
            { userId: exclude }
          ]
        }
      } : undefined,
      include: {
        user: {
          include: {
            profile: true
          }
        },
        bandMembers: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const formattedArtists = artists.map(artist => ({
      id: artist.id,
      name: artist.user.name,
      bio: artist.user.profile?.bio || '',
      location: artist.user.profile?.location || '',
      genres: artist.genres || [],
      profileImageUrl: artist.user.profile?.profileImageUrl || '',
      rating: 4.8, // TODO: Calculate from actual reviews
      reviewCount: 24, // TODO: Count from actual reviews
      bandMembers: artist.bandMembers?.map(member => ({
        id: member.id,
        name: member.name,
        instrument: member.instrument || '',
        photo: member.photoUrl || ''
      })) || []
    }));

    return NextResponse.json(formattedArtists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}