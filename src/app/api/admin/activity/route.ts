import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// GET /api/admin/activity - Recent platform activity for admin dashboard
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch recent events in parallel
    const [recentUsers, recentBookings, failedPayments, recentApplications] = await Promise.all([
      // New user registrations (last 7 days)
      prisma.user.findMany({
        where: { createdAt: { gte: oneWeekAgo } },
        select: { id: true, name: true, userType: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      // Recent bookings (last 7 days)
      prisma.booking.findMany({
        where: { createdAt: { gte: oneWeekAgo } },
        include: {
          artist: { include: { user: { select: { name: true } } } },
          host: { include: { user: { select: { name: true } } } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      // Failed payments (last 7 days)
      prisma.payment.findMany({
        where: {
          createdAt: { gte: oneWeekAgo },
          status: 'FAILED'
        },
        include: { user: { select: { name: true, userType: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      // Pending applications
      prisma.user.findMany({
        where: { status: 'PENDING' },
        include: {
          host: { select: { city: true, state: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Build activity feed
    const activities: Array<{
      id: string;
      type: string;
      message: string;
      time: string;
      urgent: boolean;
    }> = [];

    // New applications
    for (const app of recentApplications) {
      const locationStr = app.host
        ? [app.host.city, app.host.state].filter(Boolean).join(', ')
        : '';
      activities.push({
        id: `app-${app.id}`,
        type: 'application',
        message: `New ${app.userType?.toLowerCase()} application from ${app.name}${locationStr ? ` (${locationStr})` : ''}`,
        time: app.createdAt.toISOString(),
        urgent: false
      });
    }

    // Failed payments
    for (const payment of failedPayments) {
      activities.push({
        id: `pay-${payment.id}`,
        type: 'payment',
        message: `Payment failed for ${payment.user.userType?.toLowerCase()} ${payment.user.name}`,
        time: payment.createdAt.toISOString(),
        urgent: true
      });
    }

    // Recent bookings
    for (const booking of recentBookings) {
      activities.push({
        id: `book-${booking.id}`,
        type: 'booking',
        message: `New booking: ${booking.artist.user.name} at ${booking.host.user.name}'s venue`,
        time: booking.createdAt.toISOString(),
        urgent: false
      });
    }

    // New registrations
    for (const user of recentUsers) {
      activities.push({
        id: `user-${user.id}`,
        type: 'system',
        message: `New ${user.userType?.toLowerCase()} registration: ${user.name}`,
        time: user.createdAt.toISOString(),
        urgent: false
      });
    }

    // Sort by time descending and limit to 10
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      activities: activities.slice(0, 10)
    });
  } catch (error) {
    logger.error('Failed to fetch admin activity', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
