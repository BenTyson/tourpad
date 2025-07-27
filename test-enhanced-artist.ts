import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testEnhancedArtistSeed() {
  try {
    console.log('🧪 Testing enhanced artist with full media structure...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Get admin user (should exist from previous seeds)
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@tourpad.com' }
    });

    if (!adminUser) {
      throw new Error('Admin user not found. Please run basic seed first.');
    }

    // Create ENHANCED test artist - Alex Rivera (Country/Americana)
    console.log('🎵 Creating enhanced test artist: Alex Rivera...');
    const startTime = Date.now();
    
    const artistUser = await prisma.user.create({
      data: {
        email: 'alex.enhanced@example.com',
        passwordHash: hashedPassword,
        name: 'Alex Rivera',
        userType: 'ARTIST',
        status: 'ACTIVE',
        emailVerified: true,
        termsAcceptedAt: new Date(),
        privacyPolicyAcceptedAt: new Date(),
        profile: {
          create: {
            bio: 'Country-Americana singer-songwriter bringing heartfelt stories to intimate venues',
            location: 'Nashville, TN',
            phone: '(555) 789-0123',
            websiteUrl: 'https://alexriveramusic.com',
            profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            socialLinks: {
              instagram: 'alexriveramusic',
              spotify: 'alexriveraofficial',
              youtube: 'alexriverachannel',
              facebook: 'alexriveramusic'
            }
          }
        },
        artist: {
          create: {
            stageName: 'Alex Rivera',
            genres: ['Country', 'Americana', 'Folk'],
            typicalSetLength: 75,
            equipmentNeeds: ['Acoustic Guitar', 'Microphone', 'Guitar Stand', 'Stool'],
            travelRadius: 400,
            // THREE PHOTO TYPES:
            pressPhotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            heroPhotoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=face',
            // PERFORMANCE VIDEO:
            performanceVideoUrl: 'https://www.youtube.com/watch?v=HcOw7eyuYP0',
            minGuarantee: 275,
            preferredBookingAdvance: 18,
            applicationSubmittedAt: new Date(),
            approvedAt: new Date(),
            approvedByUserId: adminUser.id,
            bandMembers: {
              create: [
                {
                  name: 'Alex Rivera',
                  instrument: 'Vocals, Acoustic Guitar',
                  role: 'Solo Artist',
                  photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
                  bio: 'Singer-songwriter with 10 years experience in country and americana music',
                  sortOrder: 0
                }
              ]
            }
          }
        }
      },
      include: {
        profile: true,
        artist: {
          include: {
            bandMembers: true
          }
        }
      }
    });

    const creationTime = Date.now() - startTime;

    // Add COMPREHENSIVE ARTIST MEDIA
    console.log('📸 Adding comprehensive artist media...');
    const mediaStartTime = Date.now();
    
    // 1. PRESS PHOTO (High-quality professional)
    await prisma.artistMedia.create({
      data: {
        artistId: artistUser.artist!.id,
        mediaType: 'PHOTO',
        category: 'PRESS',
        fileUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=face',
        title: 'Alex Rivera Official Press Photo',
        description: 'Professional press photo for media and promotional use',
        mimeType: 'image/jpeg',
        fileSize: 125000,
        sortOrder: 0
      }
    });

    // 2. THUMBNAIL PHOTO (Square profile image)
    await prisma.artistMedia.create({
      data: {
        artistId: artistUser.artist!.id,
        mediaType: 'PHOTO',
        category: 'THUMBNAIL',
        fileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        title: 'Alex Rivera Profile Thumbnail',
        description: 'Square thumbnail for profile displays and cards',
        mimeType: 'image/jpeg',
        fileSize: 45000,
        sortOrder: 1
      }
    });

    // 3. PERFORMANCE VIDEO (Live showcase)
    await prisma.artistMedia.create({
      data: {
        artistId: artistUser.artist!.id,
        mediaType: 'VIDEO',
        category: 'PERFORMANCE',
        fileUrl: 'https://www.youtube.com/watch?v=HcOw7eyuYP0',
        title: 'Alex Rivera Live at The Bluebird Cafe',
        description: 'Intimate acoustic performance featuring original songs "Highway Dreams" and "Small Town Lights" recorded at Nashville\'s famous Bluebird Cafe',
        mimeType: 'video/mp4',
        sortOrder: 2
      }
    });

    // 4. BONUS: Additional promotional photo
    await prisma.artistMedia.create({
      data: {
        artistId: artistUser.artist!.id,
        mediaType: 'PHOTO',
        category: 'PROMOTIONAL',
        fileUrl: 'https://images.unsplash.com/photo-1516575080075-8f64d78b5dbc?w=600&h=400&fit=crop',
        title: 'Alex Rivera Concert Photo',
        description: 'Action shot from recent performance showing stage presence',
        mimeType: 'image/jpeg',
        fileSize: 89000,
        sortOrder: 3
      }
    });

    const mediaTime = Date.now() - mediaStartTime;

    console.log('\n✅ Enhanced Artist Test Completed Successfully!');
    console.log('\n📊 Performance Metrics:');
    console.log(`  ⏱️  Artist Creation Time: ${creationTime}ms`);
    console.log(`  ⏱️  Media Creation Time: ${mediaTime}ms`);
    console.log(`  ⏱️  Total Time: ${creationTime + mediaTime}ms`);
    
    console.log('\n📝 Created Enhanced Data:');
    console.log(`  👤 User ID: ${artistUser.id}`);
    console.log(`  🎵 Artist ID: ${artistUser.artist!.id}`);
    console.log(`  📸 Media Records: 4 (Press, Thumbnail, Video, Promotional)`);
    console.log(`  🎬 Band Members: ${artistUser.artist!.bandMembers.length}`);
    
    console.log('\n🎭 Artist Profile:');
    console.log(`  🎪 Stage Name: ${artistUser.artist!.stageName}`);
    console.log(`  🎼 Genres: ${artistUser.artist!.genres.join(', ')}`);
    console.log(`  📍 Location: ${artistUser.profile!.location}`);
    console.log(`  🌐 Website: ${artistUser.profile!.websiteUrl}`);
    
    console.log('\n📸 Media Assets:');
    console.log(`  🖼️  Press Photo: ${artistUser.artist!.pressPhotoUrl}`);
    console.log(`  🌟 Hero Photo: ${artistUser.artist!.heroPhotoUrl}`);
    console.log(`  🎬 Performance Video: ${artistUser.artist!.performanceVideoUrl}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log(`  📧 Email: alex.enhanced@example.com`);
    console.log(`  🔑 Password: password123`);

    console.log('\n🎯 Test Checklist:');
    console.log('  ✅ Login with enhanced artist credentials');
    console.log('  ✅ Check dashboard for complete profile');
    console.log('  ✅ Verify all 3 photo types display correctly');
    console.log('  ✅ Test performance video playback');
    console.log('  ✅ Confirm all social links and contact info');
    console.log('  ✅ Check media gallery functionality');

    return {
      success: true,
      artist: artistUser,
      performanceMetrics: {
        creationTime,
        mediaTime,
        totalTime: creationTime + mediaTime
      }
    };

  } catch (error) {
    console.error('❌ Error during enhanced artist test:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    await prisma.$disconnect();
  }
}

testEnhancedArtistSeed();