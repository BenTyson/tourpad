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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const type = searchParams.get('type') || 'payments';
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(new Date().getFullYear(), 0, 1);
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date();

    let data: any[] = [];
    let filename = '';
    let headers: string[] = [];

    if (type === 'payments') {
      // Export payments data
      const payments = await prisma.payment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
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

      data = payments.map(payment => ({
        id: payment.id,
        date: payment.createdAt.toISOString().split('T')[0],
        customerName: payment.user.name,
        customerEmail: payment.user.email,
        customerType: payment.user.userType,
        amount: payment.amount / 100, // Convert to dollars
        currency: payment.currency,
        status: payment.status,
        description: payment.description || '',
        paymentType: payment.paymentType,
        stripePaymentId: payment.stripePaymentId
      }));

      headers = [
        'Payment ID',
        'Date',
        'Customer Name',
        'Customer Email', 
        'Customer Type',
        'Amount ($)',
        'Currency',
        'Status',
        'Description',
        'Payment Type',
        'Stripe Payment ID'
      ];

      filename = `payments-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.csv`;

    } else if (type === 'subscriptions') {
      // Export subscriptions data
      const subscriptions = await prisma.subscription.findMany({
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

      data = subscriptions.map(sub => ({
        id: sub.id,
        customerName: sub.user.name,
        customerEmail: sub.user.email,
        customerType: sub.user.userType,
        status: sub.status,
        amount: sub.amount / 100, // Convert to dollars
        interval: sub.interval,
        currentPeriodStart: sub.currentPeriodStart.toISOString().split('T')[0],
        currentPeriodEnd: sub.currentPeriodEnd.toISOString().split('T')[0],
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        stripeSubscriptionId: sub.stripeSubscriptionId || '',
        createdAt: sub.createdAt.toISOString().split('T')[0]
      }));

      headers = [
        'Subscription ID',
        'Customer Name',
        'Customer Email',
        'Customer Type', 
        'Status',
        'Amount ($)',
        'Interval',
        'Period Start',
        'Period End',
        'Cancel at End',
        'Stripe Subscription ID',
        'Created Date'
      ];

      filename = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;

    } else if (type === 'revenue_summary') {
      // Export revenue summary
      const monthlyData = [];
      
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
          },
          include: {
            user: {
              select: {
                userType: true
              }
            }
          }
        });
        
        const totalRevenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
        const artistRevenue = monthPayments.filter(p => p.user.userType === 'ARTIST').reduce((sum, p) => sum + p.amount, 0);
        const fanRevenue = monthPayments.filter(p => p.user.userType === 'FAN').reduce((sum, p) => sum + p.amount, 0);
        
        monthlyData.push({
          month: monthStart.toISOString().slice(0, 7), // YYYY-MM
          totalRevenue: totalRevenue / 100,
          artistRevenue: artistRevenue / 100,
          fanRevenue: fanRevenue / 100,
          totalPayments: monthPayments.length,
          artistPayments: monthPayments.filter(p => p.user.userType === 'ARTIST').length,
          fanPayments: monthPayments.filter(p => p.user.userType === 'FAN').length
        });
      }

      data = monthlyData;
      headers = [
        'Month',
        'Total Revenue ($)',
        'Artist Revenue ($)',
        'Fan Revenue ($)',
        'Total Payments',
        'Artist Payments',
        'Fan Payments'
      ];

      filename = `revenue-summary-${new Date().toISOString().split('T')[0]}.csv`;
    }

    if (format === 'csv') {
      // Generate CSV
      const csvContent = [
        headers.join(','),
        ...data.map(row => {
          return headers.map(header => {
            const key = header.toLowerCase().replace(/ /g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\$/g, '');
            let value = '';
            
            // Map headers to data keys
            const keyMap: { [key: string]: string } = {
              'paymentid': 'id',
              'subscriptionid': 'id',
              'customername': 'customerName',
              'customeremail': 'customerEmail', 
              'customertype': 'customerType',
              'amount': 'amount',
              'totalrevenue': 'totalRevenue',
              'artistrevenue': 'artistRevenue',
              'fanrevenue': 'fanRevenue',
              'totalpayments': 'totalPayments',
              'artistpayments': 'artistPayments',
              'fanpayments': 'fanPayments',
              'paymenttype': 'paymentType',
              'stripepaymentid': 'stripePaymentId',
              'stripesubscriptionid': 'stripeSubscriptionId',
              'currentperiodstart': 'currentPeriodStart',
              'currentperiodend': 'currentPeriodEnd',
              'cancelatend': 'cancelAtPeriodEnd',
              'createddate': 'createdAt'
            };

            const actualKey = keyMap[key] || key;
            value = row[actualKey] || '';
            
            // Handle CSV escaping
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              value = `"${value.replace(/"/g, '""')}"`;
            }
            
            return value;
          }).join(',');
        })
      ].join('\n');

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });

    } else if (format === 'json') {
      // Return JSON
      return NextResponse.json({
        data,
        meta: {
          type,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          recordCount: data.length,
          exportedAt: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });

  } catch (error) {
    console.error('Error exporting finance data:', error);
    return NextResponse.json(
      { error: 'Failed to export finance data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}