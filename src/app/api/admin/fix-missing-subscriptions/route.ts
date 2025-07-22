import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Only allow admin access
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!adminUser || adminUser.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Find users with successful payments but no subscription
    const usersWithPaymentsButNoSubscription = await prisma.user.findMany({
      where: {
        AND: [
          {
            payments: {
              some: {
                status: 'SUCCEEDED'
              }
            }
          },
          {
            subscription: null
          }
        ]
      },
      include: {
        payments: {
          where: { status: 'SUCCEEDED' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const fixedUsers = [];

    for (const user of usersWithPaymentsButNoSubscription) {
      if (user.payments.length === 0) continue;

      const latestPayment = user.payments[0];
      const now = new Date();
      const oneYearFromPayment = new Date(latestPayment.createdAt);
      oneYearFromPayment.setFullYear(oneYearFromPayment.getFullYear() + 1);

      // Create subscription record
      await prisma.subscription.create({
        data: {
          userId: user.id,
          stripeCustomerId: user.stripeCustomerId!,
          status: 'ACTIVE',
          currentPeriodStart: latestPayment.createdAt,
          currentPeriodEnd: oneYearFromPayment,
          amount: latestPayment.amount,
          interval: 'year'
        }
      });

      fixedUsers.push({
        userId: user.id,
        email: user.email,
        paymentDate: latestPayment.createdAt,
        subscriptionEnd: oneYearFromPayment
      });

      console.log(`✅ Created subscription for user: ${user.email}`);
    }

    return NextResponse.json({
      message: `Fixed ${fixedUsers.length} users with missing subscriptions`,
      fixedUsers
    });

  } catch (error) {
    console.error('Error fixing missing subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fix missing subscriptions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}