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

  // Add artist media (press photos)
  await prisma.artistMedia.create({
    data: {
      artistId: artist1User.artist!.id,
      mediaType: 'PHOTO',
      category: 'PRESS',
      fileUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=face',
      title: 'Sarah Johnson Press Photo',
      description: 'Professional press photo for Sarah Johnson',
      sortOrder: 0
    }
  });

  await prisma.artistMedia.create({
    data: {
      artistId: artist2User.artist!.id,
      mediaType: 'PHOTO',
      category: 'PRESS',
      fileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face',
      title: 'Marcus Williams Press Photo',  
      description: 'Professional press photo for Marcus Williams',
      sortOrder: 0
    }
  });

  await prisma.artistMedia.create({
    data: {
      artistId: artist3User.artist!.id,
      mediaType: 'PHOTO',
      category: 'PRESS',
      fileUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop&crop=face',
      title: 'Luna Martinez Press Photo',
      description: 'Professional press photo for Luna Martinez',
      sortOrder: 0
    }
  });

  // Add host media (venue photos) - will be added after hosts are created
  
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
          approvedByUserId: adminUser.id,
          media: {
            create: [
              {
                fileUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 245000,
                mediaType: 'PHOTO',
                sortOrder: 0
              },
              {
                fileUrl: 'https://images.unsplash.com/photo-1522444690501-83bff8a2e608?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 198000,
                mediaType: 'PHOTO',
                sortOrder: 1
              },
              {
                fileUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 267000,
                mediaType: 'PHOTO',
                sortOrder: 2
              }
            ]
          }
        }
      }
    },
    include: {
      profile: true,
      host: {
        include: {
          media: true
        }
      }
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
          approvedByUserId: adminUser.id,
          media: {
            create: [
              {
                fileUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 312000,
                mediaType: 'PHOTO',
                sortOrder: 0
              },
              {
                fileUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 276000,
                mediaType: 'PHOTO',
                sortOrder: 1
              },
              {
                fileUrl: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 289000,
                mediaType: 'PHOTO',
                sortOrder: 2
              }
            ]
          }
        }
      }
    },
    include: {
      profile: true,
      host: {
        include: {
          media: true
        }
      }
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
          approvedByUserId: adminUser.id,
          media: {
            create: [
              {
                fileUrl: 'https://images.unsplash.com/photo-1558905921-68d23d99b52d?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 334000,
                mediaType: 'PHOTO',
                sortOrder: 0
              },
              {
                fileUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 298000,
                mediaType: 'PHOTO',
                sortOrder: 1
              },
              {
                fileUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 256000,
                mediaType: 'PHOTO',
                sortOrder: 2
              }
            ]
          }
        }
      }
    },
    include: {
      profile: true,
      host: {
        include: {
          media: true
        }
      }
    }
  });

  // Create FOURTH host - Rachel Green (Portland)
  const host4User = await prisma.user.create({
    data: {
      email: 'rachel@example.com',
      passwordHash: hashedPassword,
      name: 'Rachel Green',
      userType: 'HOST',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'Coffee shop owner who loves hosting acoustic sessions',
          location: 'Portland, OR',
          phone: '(555) 654-3210',
          profileImageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face',
          socialLinks: {
            instagram: 'rachelscoffeehouse'
          }
        }
      },
      host: {
        create: {
          venueName: 'Green Bean Coffee House',
          venueType: 'OTHER',
          city: 'Portland',
          state: 'OR',
          displayCoordinates: '45.5152,-122.6784',
          indoorCapacity: 30,
          preferredGenres: ['Acoustic', 'Indie', 'Folk', 'Singer-Songwriter'],
          hostingExperience: 4,
          typicalShowLength: 75,
          houseRules: 'All ages welcome, coffee and pastries available for purchase',
          offersLodging: false,
          applicationSubmittedAt: new Date(),
          approvedAt: new Date(),
          approvedByUserId: adminUser.id,
          media: {
            create: [
              {
                fileUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 278000,
                mediaType: 'PHOTO',
                sortOrder: 0
              },
              {
                fileUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 234000,
                mediaType: 'PHOTO',
                sortOrder: 1
              }
            ]
          }
        }
      }
    },
    include: {
      profile: true,
      host: {
        include: {
          media: true
        }
      }
    }
  });

  // Create FIFTH host - David Kim (Seattle)
  const host5User = await prisma.user.create({
    data: {
      email: 'david@example.com',
      passwordHash: hashedPassword,
      name: 'David Kim',
      userType: 'HOST',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'Art gallery owner passionate about combining visual and musical arts',
          location: 'Seattle, WA',
          phone: '(555) 543-2109',
          profileImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
          socialLinks: {
            instagram: 'kimgalleryseattle'
          }
        }
      },
      host: {
        create: {
          venueName: 'Kim Gallery & Performance Space',
          venueType: 'LOFT',
          city: 'Seattle',
          state: 'WA',
          displayCoordinates: '47.6062,-122.3321',
          indoorCapacity: 35,
          preferredGenres: ['Jazz', 'Classical', 'Experimental', 'World Music'],
          hostingExperience: 6,
          typicalShowLength: 90,
          houseRules: 'Art gallery setting, please respect the artwork, wine and cheese provided',
          offersLodging: true,
          lodgingDetails: {
            beds: 1,
            bathroom: 'shared',
            amenities: ['wifi', 'parking', 'kitchenette'],
            rules: 'Artists only, quiet after 11pm',
            pricing: { baseRate: 45, cleaningFee: 15 }
          },
          applicationSubmittedAt: new Date(),
          approvedAt: new Date(),
          approvedByUserId: adminUser.id,
          media: {
            create: [
              {
                fileUrl: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 290000,
                mediaType: 'PHOTO',
                sortOrder: 0
              },
              {
                fileUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 267000,
                mediaType: 'PHOTO',
                sortOrder: 1
              }
            ]
          }
        }
      }
    },
    include: {
      profile: true,
      host: {
        include: {
          media: true
        }
      }
    }
  });

  // Create SIXTH host - Maria Garcia (Phoenix)
  const host6User = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      passwordHash: hashedPassword,
      name: 'Maria Garcia',
      userType: 'HOST',
      status: 'ACTIVE',
      emailVerified: true,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
      profile: {
        create: {
          bio: 'Desert oasis backyard perfect for sunset concerts',
          location: 'Phoenix, AZ',
          phone: '(555) 432-1098',
          profileImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          socialLinks: {
            instagram: 'mariasmusicpatio'
          }
        }
      },
      host: {
        create: {
          venueName: 'Desert Rose Music Patio',
          venueType: 'BACKYARD',
          city: 'Phoenix',
          state: 'AZ',
          displayCoordinates: '33.4484,-112.0740',
          outdoorCapacity: 45,
          preferredGenres: ['Country', 'Folk', 'Americana', 'Blues'],
          hostingExperience: 8,
          typicalShowLength: 90,
          houseRules: 'Desert casual, BYOB, bring sunscreen for afternoon shows',
          offersLodging: false,
          applicationSubmittedAt: new Date(),
          approvedAt: new Date(),
          approvedByUserId: adminUser.id,
          media: {
            create: [
              {
                fileUrl: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 301000,
                mediaType: 'PHOTO',
                sortOrder: 0
              },
              {
                fileUrl: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800&h=600&fit=crop',
                mimeType: 'image/jpeg',
                fileSize: 287000,
                mediaType: 'PHOTO',
                sortOrder: 1
              }
            ]
          }
        }
      }
    },
    include: {
      profile: true,
      host: {
        include: {
          media: true
        }
      }
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
          hometown: 'Austin',
          state: 'TX',
          bio: 'Music lover who enjoys discovering new artists and intimate concert experiences. Always looking for the next great show!',
          profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b734?w=400&h=400&fit=crop&crop=face',
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

  // Add host media (venue photos)
  await prisma.hostMedia.create({
    data: {
      hostId: host1User.host!.id,
      mediaType: 'PHOTO',
      category: 'VENUE',
      fileUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      title: 'Mike Chen Living Room Venue',
      description: 'Cozy living room perfect for intimate performances',
      sortOrder: 0
    }
  });

  await prisma.hostMedia.create({
    data: {
      hostId: host2User.host!.id,
      mediaType: 'PHOTO',
      category: 'VENUE',
      fileUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      title: 'Emily Thompson Garden Stage',
      description: 'Beautiful garden stage with natural acoustics',
      sortOrder: 0
    }
  });

  await prisma.hostMedia.create({
    data: {
      hostId: host3User.host!.id,
      mediaType: 'PHOTO',
      category: 'VENUE',
      fileUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=600&fit=crop',
      title: 'James Wilson Barn Venue',
      description: 'Rustic barn venue with authentic country atmosphere',
      sortOrder: 0
    }
  });

  // CREATE ACTIVE BOOKINGS AND CONCERTS FOR CALENDAR TESTING
  console.log('📅 Creating active bookings and concerts for calendar...');
  
  // Future dates for active events
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);
  const twoWeeks = new Date();
  twoWeeks.setDate(twoWeeks.getDate() + 14);
  
  // Active booking 1 - CONFIRMED (should show on calendar)
  const activeBooking1 = await prisma.booking.create({
    data: {
      artistId: artist1User.artist!.id,
      hostId: host1User.host!.id,
      requestedDate: nextWeek,
      requestedTime: new Date(nextWeek.getTime() + (19 * 60 * 60 * 1000)), // 7pm
      estimatedDuration: 90,
      expectedAttendance: 25,
      status: 'CONFIRMED',
      doorFee: 20,
      artistMessage: 'Excited for this upcoming show!',
      hostResponse: 'Looking forward to hosting you!',
      lodgingRequested: false,
      respondedAt: new Date(),
      confirmedAt: new Date()
    }
  });

  // Active booking 2 - APPROVED (should show on calendar)
  const activeBooking2 = await prisma.booking.create({
    data: {
      artistId: artist2User.artist!.id,
      hostId: host2User.host!.id,
      requestedDate: twoWeeks,
      requestedTime: new Date(twoWeeks.getTime() + (20 * 60 * 60 * 1000)), // 8pm
      estimatedDuration: 120,
      expectedAttendance: 30,
      status: 'APPROVED',
      doorFee: 25,
      artistMessage: 'Jazz in the garden sounds perfect!',
      hostResponse: 'Approved! Can\'t wait!',
      lodgingRequested: true,
      lodgingDetails: {
        guests: 1,
        nights: 1,
        specialRequests: 'Quiet room for pre-show rest'
      },
      respondedAt: new Date()
    }
  });

  // Active booking 3 - PENDING (should show on calendar)
  const activeBooking3 = await prisma.booking.create({
    data: {
      artistId: artist3User.artist!.id,
      hostId: host3User.host!.id,
      requestedDate: nextMonth,
      requestedTime: new Date(nextMonth.getTime() + (19 * 60 * 60 * 1000)), // 7pm
      estimatedDuration: 100,
      expectedAttendance: 40,
      status: 'PENDING',
      doorFee: 30,
      artistMessage: 'Electronic music in your barn would be incredible!',
      lodgingRequested: true,
      lodgingDetails: {
        guests: 2,
        nights: 1,
        specialRequests: 'Need space for equipment setup'
      }
    }
  });

  // Create concerts from confirmed bookings
  const activeConcert1 = await prisma.concert.create({
    data: {
      bookingId: activeBooking1.id,
      title: 'Sarah Johnson - Folk Under the Stars',
      description: 'An intimate evening of folk music featuring original songs and heartfelt covers.',
      date: nextWeek,
      startTime: new Date(nextWeek.getTime() + (19 * 60 * 60 * 1000)), // 7pm
      endTime: new Date(nextWeek.getTime() + (20.5 * 60 * 60 * 1000)), // 8:30pm
      maxCapacity: 25,
      doorFee: 20,
      status: 'SCHEDULED',
      isPrivate: false,
      requiresApproval: false
    }
  });

  const activeConcert2 = await prisma.concert.create({
    data: {
      bookingId: activeBooking2.id,
      title: 'Mike Chen - Jazz in the Garden',
      description: 'Smooth jazz melodies in a beautiful garden setting.',
      date: twoWeeks,
      startTime: new Date(twoWeeks.getTime() + (20 * 60 * 60 * 1000)), // 8pm  
      endTime: new Date(twoWeeks.getTime() + (22 * 60 * 60 * 1000)), // 10pm
      maxCapacity: 30,
      doorFee: 25,
      status: 'SCHEDULED',
      isPrivate: false,
      requiresApproval: true
    }
  });

  // Create sample RSVPs for the concerts
  await prisma.fanRSVP.create({
    data: {
      fanId: fanUser.fan!.id,
      concertId: activeConcert1.id,
      status: 'APPROVED',
      guestsCount: 1,
      specialRequests: 'Looking forward to this!'
    }
  });

  await prisma.fanRSVP.create({
    data: {
      fanId: fanUser.fan!.id,
      concertId: activeConcert2.id,
      status: 'PENDING',
      guestsCount: 2,
      specialRequests: 'Hope to bring a friend'
    }
  });

  // Create sample concert from first booking (keeping existing)
  const concert = await prisma.concert.create({
    data: {
      bookingId: booking1.id,
      title: 'Sarah Johnson - Intimate Folk Session',
      description: 'Join us for an intimate evening of original folk music with Sarah Johnson.',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      startTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + (19 * 60 * 60 * 1000)), // 7pm
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + (21 * 60 * 60 * 1000)), // 9pm
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
  console.log(`           ${host4User.email}, ${host5User.email}, ${host6User.email}`);
  console.log(`  🎉 Fan: ${fanUser.email}`);
  console.log('\n📈 Test Data Summary:');
  console.log(`  - 3 Artists with varied genres (Folk, Jazz, Electronic)`);
  console.log(`  - 6 Hosts with different venue types across multiple cities`);
  console.log(`  - 4 Completed bookings ready for testing`);
  console.log(`  - 3 Active bookings (CONFIRMED, APPROVED, PENDING) for calendar testing`);
  console.log(`  - 3 Active concerts (SCHEDULED) for calendar testing`);
  console.log(`  - 8 Reviews with ratings from 3 to 5 stars`);
  console.log(`  - Real profile images for all users`);
  console.log(`  - Professional venue photos for all hosts`);
  console.log('\n🔐 Login Credentials:');
  console.log(`  - All users use password: password123`);
  console.log(`  - Admin: admin@tourpad.com`);
  console.log(`  - Artists: sarah@example.com, marcus@example.com, luna@example.com`);
  console.log(`  - Hosts: mike@example.com, emily@example.com, james@example.com`);
  console.log(`           rachel@example.com, david@example.com, maria@example.com`);
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