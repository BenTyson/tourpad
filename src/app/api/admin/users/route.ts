import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check admin authorization
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!adminUser || adminUser.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('type') as 'ARTIST' | 'HOST' | 'FAN' | null;
    const status = searchParams.get('status') as 'PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED' | null;
    const paymentStatus = searchParams.get('paymentStatus') as 'paid' | 'overdue' | 'failed' | null;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const whereClause: any = {};
    
    if (userType) {
      whereClause.userType = userType;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get users with related data
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: true,
        artist: true,
        host: true,
        fan: true,
        subscription: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        _count: {
          select: {
            payments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Get total count for pagination
    const totalUsers = await prisma.user.count({ where: whereClause });

    // Transform data for frontend
    const transformedUsers = users.map(user => {
      // Calculate payment status
      let userPaymentStatus = 'n/a';
      if (user.userType === 'ARTIST') {
        if (user.subscription) {
          switch (user.subscription.status) {
            case 'ACTIVE':
              userPaymentStatus = 'paid';
              break;
            case 'PAST_DUE':
              userPaymentStatus = 'overdue';
              break;
            case 'CANCELED':
              userPaymentStatus = 'canceled';
              break;
            default:
              userPaymentStatus = 'failed';
          }
        } else if (user.status === 'ACTIVE') {
          userPaymentStatus = 'paid';
        } else {
          userPaymentStatus = 'pending';
        }
      } else if (user.userType === 'FAN') {
        if (user.subscription && user.subscription.status === 'ACTIVE') {
          userPaymentStatus = 'paid';
        } else if (user.subscription && user.subscription.status === 'PAST_DUE') {
          userPaymentStatus = 'overdue';
        } else {
          userPaymentStatus = 'failed';
        }
      }

      // Calculate additional metrics
      const totalPayments = user.payments.filter(p => p.status === 'SUCCEEDED').length;
      const totalRevenue = user.payments
        .filter(p => p.status === 'SUCCEEDED')
        .reduce((sum, p) => sum + p.amount, 0);
      const lastPaymentDate = user.payments[0]?.createdAt || null;
      const failedPayments = user.payments.filter(p => p.status === 'FAILED').length;

      // Get location from profile or role-specific data
      let location = user.profile?.location;
      if (!location && user.host) {
        location = `${user.host.city}, ${user.host.state}`;
      }

      // Get additional role-specific info
      let roleSpecificData = {};
      if (user.userType === 'ARTIST' && user.artist) {
        roleSpecificData = {
          stageName: user.artist.stageName,
          genres: user.artist.genres,
          nextPaymentDue: user.subscription?.currentPeriodEnd || null
        };
      } else if (user.userType === 'HOST' && user.host) {
        roleSpecificData = {
          venueName: user.host.venueName,
          venueType: user.host.venueType,
          capacity: Math.max(user.host.indoorCapacity || 0, user.host.outdoorCapacity || 0)
        };
      } else if (user.userType === 'FAN' && user.fan) {
        roleSpecificData = {
          favoriteGenres: user.fan.favoriteGenres,
          subscriptionStatus: user.fan.subscriptionStatus,
          nextPaymentDue: user.subscription?.currentPeriodEnd || null
        };
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.profile?.phone || null,
        location: location || 'Not specified',
        userType: user.userType.toLowerCase(),
        status: user.status.toLowerCase(),
        paymentStatus: userPaymentStatus,
        stripeCustomerId: user.stripeCustomerId,
        joinedDate: user.createdAt,
        lastActive: user.lastLogin || user.updatedAt,
        emailVerified: user.emailVerified,
        
        // Payment information
        totalPayments,
        totalRevenue,
        lastPaymentDate,
        failedPayments,
        subscription: user.subscription ? {
          status: user.subscription.status,
          amount: user.subscription.amount,
          interval: user.subscription.interval,
          currentPeriodEnd: user.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd
        } : null,
        
        // Recent payments
        recentPayments: user.payments.map(p => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          description: p.description,
          createdAt: p.createdAt
        })),

        // Role-specific data
        ...roleSpecificData
      };
    });

    // Apply payment status filter if specified (done after transform for accuracy)
    let filteredUsers = transformedUsers;
    if (paymentStatus) {
      filteredUsers = transformedUsers.filter(user => {
        switch (paymentStatus) {
          case 'paid':
            return user.paymentStatus === 'paid';
          case 'overdue':
            return user.paymentStatus === 'overdue';
          case 'failed':
            return user.paymentStatus === 'failed' || user.paymentStatus === 'canceled';
          default:
            return true;
        }
      });
    }

    return NextResponse.json({
      users: filteredUsers,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit)
      },
      summary: {
        totalUsers,
        activeUsers: users.filter(u => u.status === 'ACTIVE').length,
        pendingUsers: users.filter(u => u.status === 'PENDING').length,
        artistsWithPayments: users.filter(u => u.userType === 'ARTIST' && u.subscription?.status === 'ACTIVE').length,
        fansWithSubscriptions: users.filter(u => u.userType === 'FAN' && u.subscription?.status === 'ACTIVE').length,
        totalRevenue: users.reduce((sum, user) => {
          return sum + user.payments
            .filter(p => p.status === 'SUCCEEDED')
            .reduce((userSum, p) => userSum + p.amount, 0);
        }, 0)
      }
    });

  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}