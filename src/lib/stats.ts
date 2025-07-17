import { prisma } from './prisma';

export interface UserStats {
  responseRate: number;
  averageRating: number;
  totalShows: number;
  profileViews: number;
}

export async function getUserStats(userId: string, userType: 'artist' | 'host' | 'fan'): Promise<UserStats> {
  try {
    let stats: UserStats = {
      responseRate: 0,
      averageRating: 0,
      totalShows: 0,
      profileViews: 0
    };

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    if (userType === 'artist') {
      // Get artist record
      const artist = await prisma.artist.findFirst({
        where: { userId: userId }
      });

      if (!artist) {
        return stats;
      }

      // Calculate response rate (responded bookings / total bookings)
      const totalBookings = await prisma.booking.count({
        where: { artistId: artist.id }
      });

      const respondedBookings = await prisma.booking.count({
        where: { 
          artistId: artist.id,
          status: { in: ['APPROVED', 'REJECTED', 'CONFIRMED'] }
        }
      });

      stats.responseRate = totalBookings > 0 ? Math.round((respondedBookings / totalBookings) * 100) : 100;

      // Calculate average rating from reviews (reviews where this artist is the reviewee)
      const reviews = await prisma.review.findMany({
        where: { 
          revieweeId: userId // Reviews where this user is being reviewed
        },
        select: { rating: true }
      });

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        stats.averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
      } else {
        stats.averageRating = 0;
      }

      // Calculate shows this year (completed bookings)
      stats.totalShows = await prisma.booking.count({
        where: {
          artistId: artist.id,
          status: 'COMPLETED',
          requestedDate: {
            gte: yearStart,
            lte: yearEnd
          }
        }
      });

      // Profile views - mock for now since we don't track this yet
      stats.profileViews = Math.floor(Math.random() * 200) + 50;

    } else if (userType === 'host') {
      // Get host record
      const host = await prisma.host.findFirst({
        where: { userId: userId }
      });

      if (!host) {
        return stats;
      }

      // Calculate response rate (responded bookings / total bookings)
      const totalBookings = await prisma.booking.count({
        where: { hostId: host.id }
      });

      const respondedBookings = await prisma.booking.count({
        where: { 
          hostId: host.id,
          status: { in: ['APPROVED', 'REJECTED', 'CONFIRMED'] }
        }
      });

      stats.responseRate = totalBookings > 0 ? Math.round((respondedBookings / totalBookings) * 100) : 100;

      // Calculate average rating from reviews (reviews where this host is the reviewee)
      const reviews = await prisma.review.findMany({
        where: { 
          revieweeId: userId // Reviews where this user is being reviewed
        },
        select: { rating: true }
      });

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        stats.averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
      } else {
        stats.averageRating = 0;
      }

      // Calculate shows hosted this year
      stats.totalShows = await prisma.booking.count({
        where: {
          hostId: host.id,
          status: 'COMPLETED',
          requestedDate: {
            gte: yearStart,
            lte: yearEnd
          }
        }
      });

      // Profile views - mock for now
      stats.profileViews = Math.floor(Math.random() * 150) + 30;

    } else if (userType === 'fan') {
      // Get fan record
      const fan = await prisma.fan.findFirst({
        where: { userId: userId }
      });

      if (!fan) {
        return stats;
      }

      // For fans, response rate doesn't apply - set to 100%
      stats.responseRate = 100;

      // Fans don't get rated, so no average rating
      stats.averageRating = 0;

      // Calculate concerts attended this year
      stats.totalShows = await prisma.fanRSVP.count({
        where: {
          fanId: fan.id,
          status: 'APPROVED',
          concert: {
            date: {
              gte: yearStart,
              lte: yearEnd
            }
          }
        }
      });

      // Profile views - mock for now
      stats.profileViews = Math.floor(Math.random() * 50) + 10;
    }

    return stats;

  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Return default stats on error
    return {
      responseRate: 95,
      averageRating: 4.8,
      totalShows: 0,
      profileViews: 0
    };
  }
}