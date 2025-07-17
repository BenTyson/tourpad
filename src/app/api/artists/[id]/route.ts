import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artistId = params.id;

    // Handle both mock ID ('1') and database ID ('cmd7j6xr10002lu1fqxf46mw1')
    let artist;
    
    if (artistId === '1') {
      // For mock ID '1', find Sarah Johnson's artist record
      artist = await prisma.artist.findFirst({
        where: { 
          user: {
            id: 'cmd7j6xr10002lu1fqxf46mw1'
          }
        },
        include: {
          user: {
            include: {
              profile: true
            }
          }
        }
      });
    } else {
      // For database ID, find directly
      artist = await prisma.artist.findUnique({
        where: { id: artistId },
        include: {
          user: {
            include: {
              profile: true
            }
          }
        }
      });
    }

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Return the artist data
    return NextResponse.json({
      id: artist.id,
      name: artist.user.name,
      bio: artist.bio || artist.user.profile?.bio || '',
      location: artist.user.profile?.location || '',
      genres: artist.genres || [],
      instruments: artist.instruments || [],
      yearsActive: artist.yearsActive || 0,
      experienceLevel: artist.experienceLevel || 'beginner',
      profileImageUrl: artist.user.profileImageUrl || '',
      website: artist.website || '',
      socialLinks: artist.socialLinks || {},
      createdAt: artist.createdAt,
      updatedAt: artist.updatedAt
    });

  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}