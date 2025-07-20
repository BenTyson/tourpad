const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Diverse collection of venue and performance space photos
const venuePhotos = [
  // Living rooms and home venues
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  
  // Studios and professional spaces
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
  
  // Lofts and industrial spaces
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop',
  
  // Outdoor and backyard spaces
  'https://images.unsplash.com/photo-1464822759844-d150baec843f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop'
];

const performancePhotos = [
  // Performance stages and setups
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
  
  // Musical equipment and stages
  'https://images.unsplash.com/photo-1520637836862-4d197d17c986?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop',
  
  // Concert venues and intimate settings
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1520179480023-4c29ab8ef8f8?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1528495612343-9ca9dcecadb3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
  
  // Crowds and audiences
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=800&h=600&fit=crop'
];

// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function updateHostPhotos() {
  console.log('🖼️ Updating host photos with diverse images...');
  
  try {
    // Get all hosts (excluding the original user host)
    const hosts = await prisma.host.findMany({
      where: {
        user: {
          email: {
            endsWith: '@tourpad.com'
          }
        }
      },
      include: {
        media: true
      }
    });

    console.log(`Found ${hosts.length} sample hosts to update`);

    // Shuffle photo arrays to ensure variety
    const shuffledVenuePhotos = shuffleArray(venuePhotos);
    const shuffledPerformancePhotos = shuffleArray(performancePhotos);

    let photoIndex = 0;

    for (const host of hosts) {
      console.log(`Updating photos for ${host.venueName}...`);

      // Delete existing photos for this host
      await prisma.hostMedia.deleteMany({
        where: { hostId: host.id }
      });

      // Add 2-3 new diverse photos per host
      const photosToAdd = 2 + Math.floor(Math.random() * 2); // 2-3 photos per host

      for (let i = 0; i < photosToAdd; i++) {
        const isVenuePhoto = i === 0; // First photo is always venue
        const photoArray = isVenuePhoto ? shuffledVenuePhotos : shuffledPerformancePhotos;
        const currentPhotoIndex = (photoIndex + i) % photoArray.length;
        
        await prisma.hostMedia.create({
          data: {
            hostId: host.id,
            mediaType: 'PHOTO',
            category: isVenuePhoto ? 'venue' : 'performance_space',
            fileUrl: photoArray[currentPhotoIndex],
            title: isVenuePhoto ? `${host.venueName} - Main Space` : `${host.venueName} - Performance Area`,
            description: isVenuePhoto ? 
              `Main venue space at ${host.venueName}` : 
              `Performance setup at ${host.venueName}`,
            sortOrder: i
          }
        });
      }

      photoIndex += photosToAdd;
      console.log(`✅ Added ${photosToAdd} photos for ${host.venueName}`);
    }

    console.log('🎉 Successfully updated all host photos with diverse images!');
    console.log('📋 Summary:');
    console.log(`   • ${hosts.length} hosts updated`);
    console.log(`   • Each host now has 2-3 unique photos`);
    console.log(`   • Photos sourced from diverse, high-quality venues`);
    console.log(`   • Mix of venue spaces and performance setups`);

  } catch (error) {
    console.error('❌ Error updating host photos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the photo update
updateHostPhotos()
  .then(() => {
    console.log('✨ Photo update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Photo update failed:', error);
    process.exit(1);
  });