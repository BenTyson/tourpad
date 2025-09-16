#!/usr/bin/env node

/**
 * Quick utility to check user status in database
 * Usage: node scripts/check-user-status.js <email>
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserStatus(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: true,
        artist: true,
        host: true,
        fan: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        subscription: true
      }
    });

    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }

    console.log('👤 User Status Check:');
    console.log('===================');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Type:', user.userType);
    console.log('Status:', user.status);
    console.log('Email Verified:', user.emailVerified);
    console.log('Created:', user.createdAt);
    console.log('Last Login:', user.lastLogin);

    if (user.artist) {
      console.log('\n🎵 Artist Details:');
      console.log('Stage Name:', user.artist.stageName);
      console.log('Genres:', user.artist.genres);
      console.log('Application Submitted:', user.artist.applicationSubmittedAt);
      console.log('Approved At:', user.artist.approvedAt);
    }

    if (user.payments.length > 0) {
      console.log('\n💳 Recent Payment:');
      const payment = user.payments[0];
      console.log('Amount:', `$${payment.amount / 100}`);
      console.log('Status:', payment.status);
      console.log('Date:', payment.createdAt);
      console.log('Type:', payment.paymentType);
    }

    if (user.subscription) {
      console.log('\n📅 Subscription:');
      console.log('Status:', user.subscription.status);
      console.log('Current Period:', user.subscription.currentPeriodStart, 'to', user.subscription.currentPeriodEnd);
      console.log('Amount:', `$${user.subscription.amount / 100}`);
      console.log('Interval:', user.subscription.interval);
    }

    console.log('\n🔍 Access Analysis:');
    console.log('Should have hosts access:',
      user.userType === 'ADMIN' ||
      (user.status === 'ACTIVE' && (user.userType === 'ARTIST' || user.userType === 'HOST'))
    );

  } catch (error) {
    console.error('❌ Error checking user status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/check-user-status.js <email>');
  console.log('Example: node scripts/check-user-status.js artist@example.com');
  process.exit(1);
}

checkUserStatus(email);