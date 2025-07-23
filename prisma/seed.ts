import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  
  // Delete in reverse order of dependencies
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.fanRSVP.deleteMany();
  await prisma.review.deleteMany();
  await prisma.concert.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.artistMedia.deleteMany();
  await prisma.hostMedia.deleteMany();
  await prisma.bandMember.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.host.deleteMany();
  await prisma.fan.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Database cleared');
}

async function main() {
  console.log('🌱 Starting database seeding...');
  
  // Clear existing data first for clean seed
  await clearDatabase();

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tourpad.com',
      passwordHash: hashedPassword,
      name: 'TourPad Admin',
      userType: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'TourPad platform administrator',
          location: 'Denver, CO',
          preferences: {
            notifications: { email: true, push: true },
            privacy: { profileVisibility: 'private' }
          }
        }
      }
    },
    include: {
      profile: true
    }
  });

  // Create FIRST artist - Sarah Johnson
  const artist1User = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      passwordHash: hashedPassword,
      name: 'Sarah Johnson',
      userType: 'ARTIST',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'Indie folk singer-songwriter with a passion for intimate performances',
          location: 'Austin, TX',
          phone: '(555) 123-4567',
          websiteUrl: 'https://sarahjohnsonmusic.com',
          profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b9a8af3c?w=400&h=400&fit=crop&crop=face',
          socialLinks: {
            instagram: 'sarahjohnsonmusic',
            spotify: 'sarahjohnsonmusic',
            youtube: 'sarahjohnsonmusic'
          }
        }
      },
      artist: {
        create: {
          stageName: 'Sarah Johnson',
          genres: ['Folk', 'Indie', 'Acoustic'],
          typicalSetLength: 45,
          equipmentNeeds: ['Microphone', 'Guitar amplifier', 'Stool'],
          travelRadius: 300,
          pressPhotoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b9a8af3c?w=400&h=400&fit=crop&crop=face',
          performanceVideoUrl: 'https://youtube.com/watch?v=example',
          minGuarantee: 200,
          preferredBookingAdvance: 14,
          applicationSubmittedAt: new Date(),
          approvedAt: new Date(),
          approvedByUserId: adminUser.id,
          bandMembers: {
            create: [
              {
                name: 'Sarah Johnson',
                instrument: 'Vocals, Guitar',
                role: 'Lead Vocalist',
                photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b9a8af3c?w=400&h=400&fit=crop&crop=face',
                bio: 'Lead vocalist and songwriter with 8 years of folk music experience',
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

  // Create SECOND artist - Marcus Williams (Jazz)
  const artist2User = await prisma.user.create({
    data: {
      email: 'marcus@example.com',
      passwordHash: hashedPassword,
      name: 'Marcus Williams',
      userType: 'ARTIST',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'Jazz pianist bringing smooth vibes to intimate venues',
          location: 'New Orleans, LA',
          phone: '(555) 234-5678',
          profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          socialLinks: {
            instagram: 'marcusjazz',
            spotify: 'marcuswilliamsjazz'
          }
        }
      },
      artist: {
        create: {
          stageName: 'Marcus Williams Trio',
          genres: ['Jazz', 'Blues', 'Soul'],
          typicalSetLength: 60,
          equipmentNeeds: ['Piano/Keyboard', 'PA System', 'Stage Lighting'],
          travelRadius: 500,
          pressPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          minGuarantee: 300,
          preferredBookingAdvance: 21,
          applicationSubmittedAt: new Date(),
          approvedAt: new Date(),
          approvedByUserId: adminUser.id,
          bandMembers: {
            create: [
              {
                name: 'Marcus Williams',
                instrument: 'Piano',
                role: 'Band Leader',
                photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                bio: 'Award-winning jazz pianist with 15 years experience',
                sortOrder: 0
              }
            ]
          }
        }
      }
    },
    include: {
      profile: true,
      artist: true
    }
  });

  // Create THIRD artist - Luna Martinez (Electronic/Indie)
  const artist3User = await prisma.user.create({
    data: {
      email: 'luna@example.com',
      passwordHash: hashedPassword,
      name: 'Luna Martinez',
      userType: 'ARTIST',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'Electronic indie artist creating atmospheric soundscapes',
          location: 'Portland, OR',
          phone: '(555) 345-6789',
          profileImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
          socialLinks: {
            instagram: 'lunamartinezmusic',
            spotify: 'lunamartinez'
          }
        }
      },
      artist: {
        create: {
          stageName: 'Luna Martinez',
          genres: ['Electronic', 'Indie', 'Ambient'],
          typicalSetLength: 50,
          equipmentNeeds: ['DJ Controller', 'Monitor Speakers', 'Mood Lighting'],
          travelRadius: 400,
          pressPhotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
          minGuarantee: 250,
          preferredBookingAdvance: 14,
          applicationSubmittedAt: new Date(),
          approvedAt: new Date(),
          approvedByUserId: adminUser.id
        }
      }
    },
    include: {
      profile: true,
      artist: true
    }
  });

  // Create FIRST host - Mike Chen
  const host1User = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      passwordHash: hashedPassword,
      name: 'Mike Chen',
      userType: 'HOST',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'Music lover with a cozy living room perfect for intimate concerts',
          location: 'Denver, CO',
          phone: '(555) 987-6543',
          profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          socialLinks: {
            instagram: 'mikesmusichome'
          }
        }
      },
      host: {
        create: {
          venueName: 'Mike\'s Music Room',
          venueType: 'HOME',
          city: 'Denver',
          state: 'CO',
          displayCoordinates: '39.7392,-104.9903',
          indoorCapacity: 25,
          preferredGenres: ['Folk', 'Indie', 'Jazz', 'Acoustic'],
          hostingExperience: 3,
          typicalShowLength: 60,
          houseRules: 'No smoking, BYOB welcome, shoes off at the door',
          offersLodging: true,
          lodgingDetails: {
            beds: 1,
            bathroom: 'shared',
            amenities: ['wifi', 'breakfast', 'parking'],
            rules: 'Quiet hours after 10pm',
            pricing: { baseRate: 40, cleaningFee: 15 }
          },
          applicationSubmittedAt: new Date(),
          approvedAt: new Date(),
          approvedByUserId: adminUser.id
        }
      }
    },
    include: {
      profile: true,
      host: true
    }
  });

  // Create SECOND host - Emily Thompson  
  const host2User = await prisma.user.create({
    data: {
      email: 'emily@example.com',
      passwordHash: hashedPassword,
      name: 'Emily Thompson',
      userType: 'HOST',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'Professional event planner with a stunning backyard venue',
          location: 'Austin, TX',
          phone: '(555) 876-5432',
          profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          socialLinks: {
            instagram: 'emilysgardenmusic'
          }
        }
      },
      host: {
        create: {
          venueName: 'Thompson Garden Sessions',
          venueType: 'OTHER',
          city: 'Austin',
          state: 'TX',
          displayCoordinates: '30.2672,-97.7431',
          outdoorCapacity: 40,
          preferredGenres: ['Folk', 'Country', 'Acoustic', 'Singer-Songwriter'],
          hostingExperience: 5,
          typicalShowLength: 90,
          houseRules: 'Family-friendly, no smoking, bring your own chair',
          offersLodging: false,
          applicationSubmittedAt: new Date(),
          approvedAt: new Date(),
          approvedByUserId: adminUser.id
        }
      }
    },
    include: {
      profile: true,
      host: true
    }
  });

  // Create THIRD host - James Wilson
  const host3User = await prisma.user.create({
    data: {
      email: 'james@example.com',
      passwordHash: hashedPassword,
      name: 'James Wilson',
      userType: 'HOST',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'Jazz enthusiast with a converted barn perfect for live music',
          location: 'Nashville, TN',
          phone: '(555) 765-4321',
          profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
          socialLinks: {
            instagram: 'jamesbarnmusic'
          }
        }
      },
      host: {
        create: {
          venueName: 'The Wilson Barn',
          venueType: 'WAREHOUSE',
          city: 'Nashville',
          state: 'TN',
          displayCoordinates: '36.1627,-86.7816',
          indoorCapacity: 50,
          preferredGenres: ['Jazz', 'Blues', 'Soul', 'R&B'],
          hostingExperience: 7,
          typicalShowLength: 120,
          houseRules: 'Respect the neighbors, parking available, bar service provided',
          offersLodging: true,
          lodgingDetails: {
            beds: 2,
            bathroom: 'private',
            amenities: ['wifi', 'breakfast', 'parking', 'kitchen'],
            rules: 'Musicians only, 2 night max stay',
            pricing: { baseRate: 60, cleaningFee: 20 }
          },
          applicationSubmittedAt: new Date(),
          approvedAt: new Date(),
          approvedByUserId: adminUser.id
        }
      }
    },
    include: {
      profile: true,
      host: true
    }
  });

  // Create sample fan
  const fanUser = await prisma.user.create({
    data: {
      email: 'fan@example.com',
      passwordHash: hashedPassword,
      name: 'Emma Rodriguez',
      userType: 'FAN',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'House concert enthusiast and music lover',
          location: 'Boulder, CO',
          socialLinks: {
            instagram: 'emmalovesmusic'
          }
        }
      },
      fan: {
        create: {
          favoriteGenres: ['Folk', 'Indie', 'Alternative'],
          travelRadius: 50,
          subscriptionStatus: 'ACTIVE',
          subscriptionStartDate: new Date(),
          subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        }
      }
    },
    include: {
      profile: true,
      fan: true
    }
  });

  // Create multiple bookings with different statuses
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  
  const booking1 = await prisma.booking.create({
    data: {
      artistId: artist1User.artist!.id,
      hostId: host1User.host!.id,
      requestedDate: futureDate,
      requestedTime: futureDate,
      estimatedDuration: 90,
      expectedAttendance: 20,
      status: 'COMPLETED', // Past booking for reviews
      doorFee: 15,
      artistMessage: 'Looking forward to playing at your venue!',
      hostResponse: 'We\'d love to have you!',
      lodgingRequested: true,
      lodgingDetails: {
        guests: 1,
        nights: 1,
        specialRequests: 'Early morning departure'
      },
      respondedAt: new Date(),
      confirmedAt: new Date(),
      completedAt: new Date() // Mark as completed for reviews
    }
  });

  const booking2 = await prisma.booking.create({
    data: {
      artistId: artist2User.artist!.id,
      hostId: host2User.host!.id,
      requestedDate: futureDate,
      requestedTime: futureDate,
      estimatedDuration: 120,
      expectedAttendance: 35,
      status: 'COMPLETED',
      doorFee: 20,
      artistMessage: 'Excited to bring jazz to your garden!',
      hostResponse: 'Perfect for our summer series!',
      lodgingRequested: false,
      respondedAt: new Date(),
      confirmedAt: new Date(),
      completedAt: new Date()
    }
  });

  const booking3 = await prisma.booking.create({
    data: {
      artistId: artist3User.artist!.id,
      hostId: host3User.host!.id,
      requestedDate: futureDate,
      requestedTime: futureDate,
      estimatedDuration: 90,
      expectedAttendance: 45,
      status: 'COMPLETED',
      doorFee: 25,
      artistMessage: 'Electronic vibes in the barn!',
      hostResponse: 'This will be amazing!',
      lodgingRequested: true,
      lodgingDetails: {
        guests: 2,
        nights: 2,
        specialRequests: 'Need power outlets for equipment'
      },
      respondedAt: new Date(),
      confirmedAt: new Date(),
      completedAt: new Date()
    }
  });

  // Additional bookings for variety
  const booking4 = await prisma.booking.create({
    data: {
      artistId: artist1User.artist!.id,
      hostId: host3User.host!.id,
      requestedDate: futureDate,
      requestedTime: futureDate,
      estimatedDuration: 60,
      expectedAttendance: 40,
      status: 'COMPLETED',
      doorFee: 20,
      artistMessage: 'Folk music in the barn!',
      hostResponse: 'Love the variety!',
      respondedAt: new Date(),
      confirmedAt: new Date(),
      completedAt: new Date()
    }
  });

  // Create sample concert from first booking
  const concert = await prisma.concert.create({
    data: {
      bookingId: booking1.id,
      title: 'Sarah Johnson - Intimate Folk Session',
      description: 'Join us for an intimate evening of original folk music with Sarah Johnson.',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      startTime: new Date('2024-01-15T19:00:00Z'),
      endTime: new Date('2024-01-15T21:00:00Z'),
      maxCapacity: 25,
      doorFee: 15,
      status: 'SCHEDULED',
      requiresApproval: true
    }
  });

  // Create sample fan RSVP
  const rsvp = await prisma.fanRSVP.create({
    data: {
      fanId: fanUser.fan!.id,
      concertId: concert.id,
      status: 'APPROVED',
      guestsCount: 2,
      specialRequests: 'Vegetarian dietary needs'
    }
  });

  // Create multiple reviews with varied ratings

  // Host reviews Artist (Sarah) - 5 stars
  await prisma.review.create({
    data: {
      bookingId: booking1.id,
      reviewerId: host1User.id,
      revieweeId: artist1User.id,
      rating: 5,
      reviewText: 'Sarah was absolutely wonderful! Her performance was heartfelt and the audience was completely engaged. Would definitely host her again.',
      isPublic: true
    }
  });

  // Artist (Sarah) reviews Host - 4 stars
  await prisma.review.create({
    data: {
      bookingId: booking1.id,
      reviewerId: artist1User.id,
      revieweeId: host1User.id,
      rating: 4,
      reviewText: 'Great venue with wonderful acoustics. Mike was a fantastic host. Only minor issue was parking was a bit tight.',
      isPublic: true
    }
  });

  // Host reviews Artist (Marcus) - 5 stars
  await prisma.review.create({
    data: {
      bookingId: booking2.id,
      reviewerId: host2User.id,
      revieweeId: artist2User.id,
      rating: 5,
      reviewText: 'Marcus and his trio were phenomenal! Perfect for our garden setting. The audience loved every minute.',
      isPublic: true
    }
  });

  // Artist (Marcus) reviews Host - 5 stars
  await prisma.review.create({
    data: {
      bookingId: booking2.id,
      reviewerId: artist2User.id,
      revieweeId: host2User.id,
      rating: 5,
      reviewText: 'Emily\'s garden is a magical venue! Well organized, beautiful setting, and great audience. Highly recommend!',
      isPublic: true
    }
  });

  // Host reviews Artist (Luna) - 3 stars
  await prisma.review.create({
    data: {
      bookingId: booking3.id,
      reviewerId: host3User.id,
      revieweeId: artist3User.id,
      rating: 3,
      reviewText: 'Luna\'s music was interesting but perhaps too experimental for our usual crowd. Professional and talented, just not the right fit.',
      isPublic: true
    }
  });

  // Artist (Luna) reviews Host - 4 stars
  await prisma.review.create({
    data: {
      bookingId: booking3.id,
      reviewerId: artist3User.id,
      revieweeId: host3User.id,
      rating: 4,
      reviewText: 'The barn is an amazing space! James was accommodating. Crowd seemed more into traditional genres though.',
      isPublic: true
    }
  });

  // Host reviews Artist (Sarah again) - 5 stars
  await prisma.review.create({
    data: {
      bookingId: booking4.id,
      reviewerId: host3User.id,
      revieweeId: artist1User.id,
      rating: 5,
      reviewText: 'Sarah brought exactly what our barn needed - authentic folk music! Standing ovation from the crowd.',
      isPublic: true
    }
  });

  // Artist (Sarah) reviews Host (James) - 5 stars
  await prisma.review.create({
    data: {
      bookingId: booking4.id,
      reviewerId: artist1User.id,
      revieweeId: host3User.id,
      rating: 5,
      reviewText: 'The Wilson Barn is a dream venue! Incredible acoustics, professional setup, and James is a wonderful host.',
      isPublic: true
    }
  });

  console.log('✅ Created multiple reviews with varied ratings:');
  console.log('  - Sarah Johnson: Average 5.0 (2 reviews)');
  console.log('  - Marcus Williams: Average 5.0 (1 review)');
  console.log('  - Luna Martinez: Average 3.0 (1 review)');
  console.log('  - Mike Chen: Average 4.0 (1 review)');
  console.log('  - Emily Thompson: Average 5.0 (1 review)');
  console.log('  - James Wilson: Average 4.5 (2 reviews)');

  // Create sample notification
  const notification = await prisma.notification.create({
    data: {
      userId: artist1User.id,
      type: 'BOOKING',
      title: 'New Booking Request',
      message: 'You have a new booking request from Mike Chen',
      relatedId: booking1.id,
      relatedType: 'booking',
      actionUrl: `/bookings/${booking1.id}`,
      actionText: 'View Request'
    }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Created Users:');
  console.log(`  👤 Admin: ${adminUser.email}`);
  console.log(`  🎵 Artists: ${artist1User.email}, ${artist2User.email}, ${artist3User.email}`);
  console.log(`  🏠 Hosts: ${host1User.email}, ${host2User.email}, ${host3User.email}`);
  console.log(`  🎉 Fan: ${fanUser.email}`);
  console.log('\n📈 Test Data Summary:');
  console.log(`  - 3 Artists with varied genres (Folk, Jazz, Electronic)`);
  console.log(`  - 3 Hosts with different venue types (Home, Outdoor, Barn)`);
  console.log(`  - 4 Completed bookings ready for testing`);
  console.log(`  - 8 Reviews with ratings from 3 to 5 stars`);
  console.log(`  - Real profile images for all users`);
  console.log('\n🔐 Login Credentials:');
  console.log(`  - All users use password: password123`);
  console.log(`  - Admin: admin@tourpad.com`);
  console.log(`  - Artists: sarah@example.com, marcus@example.com, luna@example.com`);
  console.log(`  - Hosts: mike@example.com, emily@example.com, james@example.com`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });