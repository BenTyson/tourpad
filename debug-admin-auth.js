const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugAdminAuth() {
  try {
    console.log('🔍 Checking admin user in database...');
    
    // Check if admin user exists
    const adminUser = await prisma.user.findFirst({
      where: { 
        email: 'admin@tourpad.com',
        userType: 'ADMIN'
      },
      include: {
        profile: true,
        artist: true,
        host: true,
        fan: true
      }
    });

    if (adminUser) {
      console.log('✅ Admin user found in database:');
      console.log('  - ID:', adminUser.id);
      console.log('  - Email:', adminUser.email);
      console.log('  - Name:', adminUser.name);
      console.log('  - Type:', adminUser.userType);
      console.log('  - Status:', adminUser.status);
      console.log('  - Has Profile:', !!adminUser.profile);
      console.log('  - Has Password Hash:', !!adminUser.passwordHash);
      console.log('  - Email Verified:', adminUser.emailVerified);
    } else {
      console.log('❌ Admin user NOT found in database');
    }

    // Check all users to see what's in the DB
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        status: true
      }
    });

    console.log('\n📊 All users in database:');
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.userType}, ${user.status})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAdminAuth();