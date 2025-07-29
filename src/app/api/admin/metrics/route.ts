import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Calculate date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const next30Days = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));

    // Get real counts from database
    const [
      totalUsers,
      pendingApplications,
      activeArtists,
      activeHosts,
      monthlyRevenue,
      activeBookings
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Pending applications
      prisma.user.count({
        where: { status: 'PENDING' }
      }),
      
      // Active artists
      prisma.user.count({
        where: { 
          userType: 'ARTIST',
          status: 'ACTIVE' 
        }
      }),
      
      // Active hosts
      prisma.user.count({
        where: { 
          userType: 'HOST',
          status: 'ACTIVE' 
        }
      }),
      
      // Monthly revenue (sum of payments this month)
      prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
          createdAt: {
            gte: startOfMonth
          }
        },
        _sum: {
          amount: true
        }
      }).then(result => result._sum.amount || 0),
      
      // Active bookings (next 30 days)
      prisma.booking.count({
        where: {
          status: {
            in: ['APPROVED', 'CONFIRMED']
          },
          requestedDate: {
            gte: now,
            lte: next30Days
          }
        }
      })
    ]);

    const metrics = {
      totalUsers,
      pendingApplications,
      activeArtists,
      activeHosts,
      monthlyRevenue, // Amount in cents
      upcomingEvents: activeBookings
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}