const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupHosts() {
  try {
    // Find The Meadow House of Destiny to preserve it
    const meadowHouse = await prisma.host.findFirst({
      where: { venueName: 'The Meadow House of Destiny' }
    });
    
    if (!meadowHouse) {
      console.log('❌ The Meadow House of Destiny not found!');
      await prisma.$disconnect();
      return;
    }
    
    console.log(`✅ Found The Meadow House of Destiny (ID: ${meadowHouse.id})`);
    
    // Delete all other hosts and their related data
    const otherHosts = await prisma.host.findMany({
      where: {
        id: { not: meadowHouse.id }
      },
      include: { user: true }
    });
    
    console.log(`🗑️  Will remove ${otherHosts.length} other hosts:`);
    otherHosts.forEach(host => {
      console.log(`   - ${host.venueName || 'Unnamed'} (${host.user.name})`);
    });
    
    // Delete reviews, concerts, bookings, and media first (cascade should handle this but being explicit)
    for (const host of otherHosts) {
      await prisma.review.deleteMany({ where: { hostId: host.id } });
      await prisma.hostMedia.deleteMany({ where: { hostId: host.id } });
      
      // Delete concerts and bookings
      const concerts = await prisma.concert.findMany({
        where: { booking: { hostId: host.id } }
      });
      for (const concert of concerts) {
        await prisma.fanRSVP.deleteMany({ where: { concertId: concert.id } });
        await prisma.review.deleteMany({ where: { concertId: concert.id } });
      }
      await prisma.concert.deleteMany({
        where: { booking: { hostId: host.id } }
      });
      await prisma.booking.deleteMany({ where: { hostId: host.id } });
    }
    
    // Delete the hosts
    const deletedHosts = await prisma.host.deleteMany({
      where: {
        id: { not: meadowHouse.id }
      }
    });
    
    console.log(`✅ Removed ${deletedHosts.count} hosts`);
    
    // Clean up their users (only the host users we just deleted)
    const hostUserIds = otherHosts.map(h => h.userId);
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: { in: hostUserIds }
      }
    });
    
    console.log(`✅ Removed ${deletedUsers.count} host users`);
    
    await prisma.$disconnect();
    console.log('🎉 Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

cleanupHosts();