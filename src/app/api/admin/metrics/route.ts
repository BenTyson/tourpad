import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get real counts from database
    const [
      totalUsers,
      pendingApplications,
      activeArtists,
      activeHosts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { status: 'PENDING' }
      }),
      prisma.user.count({
        where: { 
          userType: 'ARTIST',
          status: 'ACTIVE' 
        }
      }),
      prisma.user.count({
        where: { 
          userType: 'HOST',
          status: 'ACTIVE' 
        }
      })
    ]);

    const metrics = {
      totalUsers,
      pendingApplications,
      activeArtists,
      activeHosts
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}