const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mix of performance and promotional photos for artists
const artistPhotos = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', // Artist performing
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop', // Band performing
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&h=600&fit=crop', // Music performance
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop', // Live performance
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop', // Solo artist
  'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=600&fit=crop', // Concert scene
  'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&h=600&fit=crop', // Band together
  'https://images.unsplash.com/photo-1486162928267-e24ec07c92e4?w=800&h=600&fit=crop', // Folk singer
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop', // Electronic music
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', // Jazz performer
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop', // Studio session
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop', // Guitar performance
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', // Band rehearsal
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop', // Live audience
  'https://images.unsplash.com/photo-1506606646637-87d6de2a3aac?w=800&h=600&fit=crop', // Country artist
  'https://images.unsplash.com/photo-1508854710579-5cecc3a1c518?w=800&h=600&fit=crop', // Electronic setup
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop', // Rock band
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop', // Folk duo
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', // Singer songwriter
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop', // Band close up
  'https://images.unsplash.com/photo-1460123525027-4ebe18ba5885?w=800&h=600&fit=crop', // Indie performance
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop', // Blues performer
  'https://images.unsplash.com/photo-1570824104453-508955ab713e?w=800&h=600&fit=crop', // Pop artist
  'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&h=600&fit=crop', // Ambient music
];

// Profile photos for individual artists
const profilePhotos = [
  'https://images.unsplash.com/photo-1494790108755-2616b9a8af3c?w=400&h=400&fit=crop&crop=face', // Female artist
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', // Male artist
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', // Female singer
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', // Male musician
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', // Male guitarist
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face', // Male performer
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', // Female vocalist
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', // Male DJ
];

async function updateArtistPhotos() {
  console.log('Starting to update artist photos...');

  try {
    // Get all artists
    const artists = await prisma.artist.findMany({
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    console.log(`Found ${artists.length} artists to update`);

    for (let i = 0; i < artists.length; i++) {
      const artist = artists[i];
      console.log(`Updating photos for artist: ${artist.stageName}...`);

      // Update profile photo
      const profilePhotoUrl = profilePhotos[i % profilePhotos.length];
      if (artist.user.profile) {
        await prisma.userProfile.update({
          where: { id: artist.user.profile.id },
          data: {
            profileImageUrl: profilePhotoUrl
          }
        });
      }

      // Create 3-4 promotional photos for each artist
      const numPhotos = 3 + Math.floor(Math.random() * 2); // 3-4 photos
      for (let j = 0; j < numPhotos; j++) {
        const photoIndex = (i * 4 + j) % artistPhotos.length;
        const photoUrl = artistPhotos[photoIndex];
        
        await prisma.artistMedia.create({
          data: {
            artistId: artist.id,
            mediaType: 'PHOTO',
            category: j === 0 ? 'profile' : 'promotional',
            fileUrl: photoUrl,
            title: j === 0 ? 'Profile Photo' : `Performance Photo ${j}`,
            sortOrder: j
          }
        });
      }

      console.log(`✅ Updated ${artist.stageName} with profile photo and ${numPhotos} promotional photos`);
    }

    console.log('Finished updating all artist photos!');

  } catch (error) {
    console.error('Error updating artist photos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateArtistPhotos()
  .catch((e) => {
    console.error('Photo update failed:', e);
    process.exit(1);
  });