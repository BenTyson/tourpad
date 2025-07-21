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

    // Parse query parameters for date range
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(new Date().getFullYear(), 0, 1); // Start of current year
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date(); // Now

    // Get current month boundaries for comparison
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

    // Get all successful payments in date range
    const payments = await prisma.payment.findMany({
      where: {
        status: 'SUCCEEDED',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: {
          select: {
            userType: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get current month payments for MRR calculation
    const currentMonthPayments = await prisma.payment.findMany({
      where: {
        status: 'SUCCEEDED',
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd
        }
      }
    });

    // Get last month payments for growth calculation
    const lastMonthPayments = await prisma.payment.findMany({
      where: {
        status: 'SUCCEEDED',
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      }
    });

    // Get all active subscriptions
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            userType: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Calculate revenue metrics
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const currentMonthRevenue = currentMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const lastMonthRevenue = lastMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate MRR (Monthly Recurring Revenue) from active subscriptions
    const mrr = activeSubscriptions.reduce((sum, subscription) => {
      if (subscription.interval === 'year') {
        return sum + (subscription.amount / 12); // Convert annual to monthly
      }
      return sum + subscription.amount; // Monthly subscriptions
    }, 0);

    // Calculate ARR (Annual Recurring Revenue)
    const arr = mrr * 12;

    // Calculate growth rate
    const growthRate = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Revenue breakdown by user type
    const artistRevenue = payments
      .filter(p => p.user.userType === 'ARTIST')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const fanRevenue = payments
      .filter(p => p.user.userType === 'FAN')
      .reduce((sum, p) => sum + p.amount, 0);

    // Subscription breakdown
    const artistSubscriptions = activeSubscriptions.filter(s => s.user.userType === 'ARTIST');
    const fanSubscriptions = activeSubscriptions.filter(s => s.user.userType === 'FAN');

    // Failed payments requiring attention
    const failedPayments = await prisma.payment.findMany({
      where: {
        status: 'FAILED',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            userType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Monthly revenue trend (last 12 months)
    const monthlyTrends = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
      const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() - i + 1, 0);
      
      const monthPayments = await prisma.payment.findMany({
        where: {
          status: 'SUCCEEDED',
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      });
      
      const monthRevenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      
      monthlyTrends.push({
        month: monthStart.toISOString().slice(0, 7), // YYYY-MM format
        revenue: monthRevenue,
        payments: monthPayments.length
      });
    }

    // Top customers by revenue
    const customerRevenue = new Map();
    payments.forEach(payment => {
      const userId = payment.userId;
      const current = customerRevenue.get(userId) || { revenue: 0, payments: 0, user: payment.user };
      customerRevenue.set(userId, {
        revenue: current.revenue + payment.amount,
        payments: current.payments + 1,
        user: payment.user
      });
    });

    const topCustomers = Array.from(customerRevenue.entries())
      .map(([userId, data]) => ({
        userId,
        name: data.user.name,
        userType: data.user.userType,
        revenue: data.revenue,
        payments: data.payments
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return NextResponse.json({
      overview: {
        totalRevenue,
        mrr,
        arr,
        growthRate,
        currentMonthRevenue,
        lastMonthRevenue
      },
      subscriptions: {
        active: activeSubscriptions.length,
        artists: artistSubscriptions.length,
        fans: fanSubscriptions.length,
        totalMrr: mrr,
        averageSubscriptionValue: activeSubscriptions.length > 0 
          ? activeSubscriptions.reduce((sum, s) => sum + s.amount, 0) / activeSubscriptions.length 
          : 0
      },
      revenue: {
        breakdown: {
          artists: artistRevenue,
          fans: fanRevenue
        },
        trends: monthlyTrends
      },
      operations: {
        failedPayments: failedPayments.length,
        failedPaymentsList: failedPayments.slice(0, 5).map(p => ({
          id: p.id,
          userId: p.userId,
          userName: p.user.name,
          userEmail: p.user.email,
          userType: p.user.userType,
          amount: p.amount,
          description: p.description,
          createdAt: p.createdAt
        }))
      },
      customers: {
        topCustomers
      }
    });

  } catch (error) {
    console.error('Error fetching finance overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finance overview' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}