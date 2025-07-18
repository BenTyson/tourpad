import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

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

  // Create sample artist
  const artistUser = await prisma.user.create({
    data: {
      email: 'artist@example.com',
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
          pressPhotoUrl: 'https://example.com/sarah-press-photo.jpg',
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
              },
              {
                name: 'Mike Chen',
                instrument: 'Bass Guitar',
                role: 'Bassist',
                photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                bio: 'Jazz-trained bassist bringing depth to indie folk arrangements',
                sortOrder: 1
              },
              {
                name: 'Alex Rivera',
                instrument: 'Violin, Mandolin',
                role: 'String Instrumentalist',
                photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
                bio: 'Classical violinist with a passion for folk and indie music',
                sortOrder: 2
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

  // Create sample host
  const hostUser = await prisma.user.create({
    data: {
      email: 'host@example.com',
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

  // Create sample booking
  const booking = await prisma.booking.create({
    data: {
      artistId: artistUser.artist!.id,
      hostId: hostUser.host!.id,
      requestedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      requestedTime: new Date('2024-01-15T19:00:00Z'),
      estimatedDuration: 90,
      expectedAttendance: 20,
      status: 'CONFIRMED',
      artistFee: 250,
      doorFee: 15,
      artistMessage: 'Looking forward to playing at your venue! I have a great set of original folk songs.',
      hostResponse: 'We\'d love to have you! Your music would be perfect for our intimate setting.',
      lodgingRequested: true,
      lodgingDetails: {
        guests: 1,
        nights: 1,
        specialRequests: 'Early morning departure, around 7am'
      },
      respondedAt: new Date(),
      confirmedAt: new Date()
    }
  });

  // Create sample concert from booking
  const concert = await prisma.concert.create({
    data: {
      bookingId: booking.id,
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

  // Create sample review
  const review = await prisma.review.create({
    data: {
      bookingId: booking.id,
      reviewerId: hostUser.id,
      revieweeId: artistUser.id,
      rating: 5,
      reviewText: 'Sarah was absolutely wonderful! Her performance was heartfelt and the audience was completely engaged. Would definitely host her again.',
      isPublic: true
    }
  });

  // Create sample notification
  const notification = await prisma.notification.create({
    data: {
      userId: artistUser.id,
      type: 'BOOKING',
      title: 'New Booking Request',
      message: 'You have a new booking request from Mike Chen for January 15th',
      relatedId: booking.id,
      relatedType: 'booking',
      actionUrl: `/bookings/${booking.id}`,
      actionText: 'View Request'
    }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`👤 Admin user created: ${adminUser.email}`);
  console.log(`🎵 Artist user created: ${artistUser.email}`);
  console.log(`🏠 Host user created: ${hostUser.email}`);
  console.log(`🎉 Fan user created: ${fanUser.email}`);
  console.log(`📅 Sample booking created: ${booking.id}`);
  console.log(`🎪 Sample concert created: ${concert.id}`);
  console.log(`👍 Sample RSVP created: ${rsvp.id}`);
  console.log(`⭐ Sample review created: ${review.id}`);
  console.log(`🔔 Sample notification created: ${notification.id}`);
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