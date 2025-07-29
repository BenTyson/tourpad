const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleHosts = [
  {
    // User data
    name: "Sarah Chen",
    email: "sarah.chen.host.seed@tourpad.com",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
    bio: "Former touring musician turned host. I understand what artists need for a great show.",
    location: "Austin, TX",
    websiteUrl: "https://sarahslivingroom.com",
    socialLinks: {
      instagram: "sarahslivingroom",
      facebook: "https://facebook.com/sarahslivingroom"
    },
    // Host data
    venueName: "The Garden House",
    venueType: "HOME",
    city: "Austin",
    state: "TX",
    country: "USA",
    actualAddress: "2847 Barton Hills Dr, Austin, TX 78704",
    latitude: 30.2500,
    longitude: -97.7800,
    displayLat: 30.2520, // Slightly obfuscated
    displayLng: -97.7820,
    venueDescription: "Cozy living room with a piano and fireplace. Perfect for intimate acoustic shows with our regular community of 25-30 music lovers.",
    indoorCapacity: 30,
    outdoorCapacity: 0,
    suggestedDoorFee: 15,
    typicalShowLength: 90,
    hostingExperience: 3,
    offersLodging: true,
    preferredGenres: ["Folk", "Indie", "Acoustic", "Country"],
    houseRules: "No smoking indoors. Please be respectful of neighbors after 10pm. Dogs welcome!",
    amenities: [
      "WiFi available",
      "Free parking on premises", 
      "Kid friendly environment",
      "Power access for equipment",
      "Food & Refreshments"
    ],
    soundSystem: {
      available: false,
      description: "Artists provide their own sound equipment. Small PA system available if needed.",
      equipment: {
        speakers: "",
        microphones: "",
        instruments: "Upright piano available",
        additional: "Basic lighting, extension cords provided"
      }
    },
    lodgingDetails: {
      numberOfRooms: 1,
      hostMembers: [
        {
          id: "1",
          hostName: "Sarah Chen",
          aboutMe: "Former touring musician who loves supporting artists. I always make sure you have everything you need for a great show!",
          profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces"
        }
      ],
      preferredActSize: "Solo",
      actSizeNotes: "Our living room works best for solo artists or duos. The piano is tuned monthly!",
      whatWeEnjoy: "We love acoustic sets, singer-songwriters, and folk music. Our audience really appreciates storytelling between songs.",
      musicWeArentInto: "We prefer not to host heavy metal or electronic music due to our acoustic setup.",
      contentRating: "Kid Friendly",
      rooms: [{
        id: 1,
        roomType: "guest_bedroom",
        bathroomType: "private",
        beds: [{ type: "queen", quantity: 1 }],
        maxOccupancy: 2
      }],
      amenities: {
        wifi: true,
        breakfast: true,
        parking: true,
        linensProvided: true,
        towelsProvided: true
      }
    },
    photos: [
      {
        category: "venue",
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        title: "Living room performance space",
        description: "Our cozy living room with piano and fireplace"
      },
      {
        category: "venue", 
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        title: "Piano and seating area",
        description: "The piano where many artists have performed"
      },
      {
        category: "performance_space",
        url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop", 
        title: "Concert setup",
        description: "How we arrange seating for shows"
      },
      {
        category: "past_show",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
        title: "Recent folk performance",
        description: "Local singer-songwriter performing last month"
      }
    ],
    reviews: [
      {
        fanName: "Mike Johnson",
        artistRating: 5,
        hostRating: 5,
        overallRating: 5,
        hostFeedback: "Sarah created such a warm, welcoming atmosphere. The audience was engaged and respectful.",
        overallFeedback: "Perfect intimate venue for acoustic music. Great sound and wonderful host!",
        attendedDate: new Date('2024-09-15'),
        wouldRecommend: true
      },
      {
        fanName: "Emma Davis",
        artistRating: 4,
        hostRating: 5,
        overallRating: 5,
        hostFeedback: "Beautiful home venue with amazing acoustics. Sarah was incredibly hospitable.",
        overallFeedback: "Loved the intimate setting and the piano added so much to the performance.",
        attendedDate: new Date('2024-08-22'),
        wouldRecommend: true
      }
    ]
  },
  {
    name: "Mike & Emma Rodriguez",
    email: "mike.emma.host.seed@tourpad.com", 
    profileImageUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=400&fit=crop&crop=faces",
    bio: "We've been hosting house concerts for 5 years and love creating magical evenings for artists and audiences.",
    location: "Nashville, TN",
    websiteUrl: "https://musiccityloft.com",
    socialLinks: {
      instagram: "musiccityloft",
      youtube: "https://youtube.com/musiccityloft"
    },
    venueName: "Music City Loft",
    venueType: "LOFT", 
    city: "Nashville",
    state: "TN",
    country: "USA",
    actualAddress: "1205 Division St, Nashville, TN 37203",
    latitude: 36.1500,
    longitude: -86.8000,
    displayLat: 36.1520,
    displayLng: -86.8020,
    venueDescription: "Industrial loft space in the heart of Music City. High ceilings, exposed brick, and perfect acoustics for all genres.",
    indoorCapacity: 45,
    outdoorCapacity: 0,
    suggestedDoorFee: 25,
    typicalShowLength: 120,
    hostingExperience: 5,
    offersLodging: false,
    preferredGenres: ["Rock", "Country", "Blues", "Folk", "Indie"],
    houseRules: "Professional venue with full sound system. Load-in through rear entrance. Shows end by 11pm.",
    amenities: [
      "WiFi available",
      "Sound system provided",
      "Power access for equipment", 
      "Air conditioning / Heating",
      "Step-free access"
    ],
    soundSystem: {
      available: true,
      description: "Full PA system with wireless mics, monitors, and mixing board",
      equipment: {
        speakers: "QSC K12.2 mains with KW181 subwoofer",
        microphones: "4 wireless handheld Shure SM58 + 2 wireless lavalier",
        instruments: "DI boxes available for acoustic instruments, bass amp available",
        additional: "Professional lighting rig, stage backdrop, fog machine"
      }
    },
    lodgingDetails: {
      hostMembers: [
        {
          id: "1", 
          hostName: "Mike Rodriguez",
          aboutMe: "Sound engineer and venue owner. I make sure every artist sounds their best!",
          profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces"
        },
        {
          id: "2",
          hostName: "Emma Rodriguez", 
          aboutMe: "Event coordinator and music lover. I handle all the logistics so artists can focus on performing.",
          profilePhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=faces"
        }
      ],
      preferredActSize: "Full Band",
      actSizeNotes: "Our stage and sound system can easily handle full bands. We love electric and acoustic acts!",
      whatWeEnjoy: "We host everything from indie rock to country to blues. Our audience loves high-energy performances and great songwriting.",
      musicWeArentInto: "We're open to most genres, though we prefer not to host experimental noise or extreme metal.",
      contentRating: "Explicit"
    },
    photos: [
      {
        category: "venue",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        title: "Main performance space",
        description: "Our industrial loft with exposed brick and high ceilings"
      },
      {
        category: "venue",
        url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop", 
        title: "Stage and lighting setup",
        description: "Professional stage with full lighting rig"
      },
      {
        category: "performance_space",
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        title: "Sound booth and mixing area", 
        description: "Professional mixing board and monitor setup"
      },
      {
        category: "past_show",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
        title: "Rock band performance",
        description: "Four-piece indie rock band from last weekend"
      },
      {
        category: "past_show",
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
        title: "Country duo",
        description: "Amazing country duo that had the audience dancing"
      }
    ],
    reviews: [
      {
        fanName: "Sarah Wilson",
        artistRating: 5,
        hostRating: 5, 
        overallRating: 5,
        hostFeedback: "Professional venue with top-notch sound system. Mike and Emma were fantastic to work with.",
        overallFeedback: "This is how all venues should be run. Professional, welcoming, and the sound was perfect.",
        attendedDate: new Date('2024-10-05'),
        wouldRecommend: true
      },
      {
        fanName: "David Park",
        artistRating: 5,
        hostRating: 4,
        overallRating: 5,
        hostFeedback: "Great venue with excellent acoustics. Load-in was easy and the sound system is professional grade.",
        overallFeedback: "Fantastic space for live music. The atmosphere and sound quality were exceptional.",
        attendedDate: new Date('2024-09-28'),
        wouldRecommend: true
      }
    ]
  },
  {
    name: "David Kim",
    email: "david.kim.host.seed@tourpad.com",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces", 
    bio: "Tech entrepreneur who fell in love with live music. I host intimate shows in my backyard amphitheater.",
    location: "Portland, OR",
    websiteUrl: "https://backyardamphitheater.com",
    socialLinks: {
      instagram: "backyardamphitheater",
      website: "https://backyardamphitheater.com"
    },
    venueName: "Backyard Amphitheater",
    venueType: "BACKYARD",
    city: "Portland", 
    state: "OR",
    country: "USA",
    actualAddress: "5234 SE Hawthorne Blvd, Portland, OR 97215",
    latitude: 45.5120,
    longitude: -122.6080,
    displayLat: 45.5140,
    displayLng: -122.6100,
    venueDescription: "Custom-built outdoor amphitheater in a beautiful garden setting. Weather-protected stage and seating area.",
    indoorCapacity: 0,
    outdoorCapacity: 60,
    suggestedDoorFee: 30,
    typicalShowLength: 105,
    hostingExperience: 2,
    offersLodging: true,
    preferredGenres: ["Folk", "Indie", "World", "Acoustic", "Experimental"],
    houseRules: "Outdoor venue - shows cancelled if heavy rain. No smoking in garden areas. Dogs welcome on leash.",
    amenities: [
      "WiFi available",
      "Sound system provided",
      "Free parking on premises",
      "Power access for equipment",
      "Overnight accommodation"
    ],
    soundSystem: {
      available: true,
      description: "Outdoor-rated sound system with weather protection",
      equipment: {
        speakers: "QSC weatherproof outdoor speakers with subwoofer",
        microphones: "Wireless system with wind guards and weather protection", 
        instruments: "Full backline available - drums, bass amp, guitar amps",
        additional: "Professional outdoor lighting, weather canopy, heaters for cool evenings"
      }
    },
    lodgingDetails: {
      numberOfRooms: 1,
      hostMembers: [
        {
          id: "1",
          hostName: "David Kim",
          aboutMe: "I built this amphitheater because I believe outdoor music experiences are magical. I love supporting touring artists!",
          profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces"
        }
      ],
      preferredActSize: "Trio",
      actSizeNotes: "The outdoor setting works great for trios and small bands. Solo artists love the natural acoustics too.",
      whatWeEnjoy: "We love artists who embrace the outdoor setting and natural beauty. Folk, indie, and world music really shine here.",
      musicWeArentInto: "Heavy metal and very loud music doesn't work well with our outdoor setup and neighbors.",
      contentRating: "Kid Friendly",
      rooms: [{
        id: 1,
        roomType: "studio_apartment",
        bathroomType: "private", 
        beds: [{ type: "queen", quantity: 1 }],
        maxOccupancy: 2
      }],
      amenities: {
        wifi: true,
        kitchenAccess: true,
        parking: true,
        laundry: true,
        linensProvided: true,
        towelsProvided: true
      }
    },
    photos: [
      {
        category: "venue",
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
        title: "Backyard amphitheater overview",
        description: "Custom-built amphitheater in garden setting"
      },
      {
        category: "venue",
        url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop",
        title: "Stage and covered seating",
        description: "Weather-protected stage with tiered seating"
      },
      {
        category: "performance_space", 
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        title: "Garden performance area",
        description: "Beautiful garden backdrop for performances"
      },
      {
        category: "past_show",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
        title: "Evening folk performance",
        description: "Magical evening show with string lights"
      }
    ],
    reviews: [
      {
        fanName: "Lisa Chen",
        artistRating: 5,
        hostRating: 5,
        overallRating: 5,
        hostFeedback: "The outdoor amphitheater is absolutely magical! David thought of every detail for artists' comfort.",
        overallFeedback: "One of the most unique and beautiful venues I've ever experienced. Perfect for intimate outdoor shows.",
        attendedDate: new Date('2024-09-12'),
        wouldRecommend: true
      }
    ]
  }
];

async function seedHosts() {
  console.log('🌱 Starting to seed hosts...');
  
  try {
    let createdCount = 0;
    
    for (const hostData of sampleHosts) {
      console.log(`Creating host: ${hostData.venueName}`);
      
      // Create user first (or find existing)
      let user = await prisma.user.findUnique({
        where: { email: hostData.email }
      });
      
      if (user) {
        console.log(`User with email ${hostData.email} already exists, skipping...`);
        continue;
      }
      
      user = await prisma.user.create({
        data: {
          name: hostData.name,
          email: hostData.email,
          emailVerified: true,
          userType: 'HOST',
          status: 'ACTIVE',
          profileImageUrl: hostData.profileImageUrl,
          profile: {
            create: {
              bio: hostData.bio,
              location: hostData.location,
              websiteUrl: hostData.websiteUrl,
              socialLinks: hostData.socialLinks,
              profileImageUrl: hostData.profileImageUrl
            }
          }
        }
      });
      
      // Create host profile
      const host = await prisma.host.create({
        data: {
          userId: user.id,
          venueName: hostData.venueName,
          venueType: hostData.venueType,
          city: hostData.city,
          state: hostData.state,
          country: hostData.country,
          actualAddress: hostData.actualAddress,
          latitude: hostData.latitude,
          longitude: hostData.longitude,
          displayLat: hostData.displayLat,
          displayLng: hostData.displayLng,
          venueDescription: hostData.venueDescription,
          indoorCapacity: hostData.indoorCapacity,
          outdoorCapacity: hostData.outdoorCapacity,
          suggestedDoorFee: hostData.suggestedDoorFee,
          typicalShowLength: hostData.typicalShowLength,
          hostingExperience: hostData.hostingExperience,
          offersLodging: hostData.offersLodging,
          preferredGenres: hostData.preferredGenres,
          houseRules: hostData.houseRules,
          amenities: hostData.amenities,
          soundSystem: hostData.soundSystem,
          lodgingDetails: hostData.lodgingDetails,
          approvedAt: new Date(), // Auto-approve sample hosts
        }
      });
      
      // Add photos for each host
      if (hostData.photos) {
        for (let i = 0; i < hostData.photos.length; i++) {
          const photo = hostData.photos[i];
          await prisma.hostMedia.create({
            data: {
              hostId: host.id,
              mediaType: 'PHOTO',
              category: photo.category,
              fileUrl: photo.url,
              title: photo.title,
              description: photo.description,
              sortOrder: i
            }
          });
        }
      }
      
      // Create sample fans for reviews
      if (hostData.reviews) {
        for (const reviewData of hostData.reviews) {
          // Create a fan user for the review
          const fanEmail = `${reviewData.fanName.toLowerCase().replace(/\s+/g, '.')}.${Date.now()}@example.com`;
          const fanUser = await prisma.user.create({
            data: {
              name: reviewData.fanName,
              email: fanEmail,
              emailVerified: true,
              userType: 'FAN',
              status: 'ACTIVE'
            }
          });
          
          // Create fan profile
          const fan = await prisma.fan.create({
            data: {
              userId: fanUser.id,
              favoriteGenres: ["Folk", "Indie"],
              subscriptionStatus: 'ACTIVE'
            }
          });
          
          // Create a sample artist for the review
          const artistEmail = `sample.artist.${createdCount}.${Date.now()}@example.com`;
          const artistUser = await prisma.user.create({
            data: {
              name: `Sample Artist ${createdCount}`,
              email: artistEmail,
              emailVerified: true,
              userType: 'ARTIST',
              status: 'ACTIVE'
            }
          });
          
          const artist = await prisma.artist.create({
            data: {
              userId: artistUser.id,
              stageName: `Sample Artist ${createdCount}`,
              genres: ["Folk"],
              approvedAt: new Date()
            }
          });
          
          // Create a sample booking first
          const booking = await prisma.booking.create({
            data: {
              artistId: artist.id,
              hostId: host.id,
              requestedDate: reviewData.attendedDate,
              requestedTime: reviewData.attendedDate,
              estimatedDuration: hostData.typicalShowLength,
              expectedAttendance: hostData.indoorCapacity || hostData.outdoorCapacity,
              status: 'COMPLETED',
              doorFee: hostData.suggestedDoorFee,
              doorFeeStatus: 'AGREED',
              confirmedAt: reviewData.attendedDate,
              completedAt: reviewData.attendedDate
            }
          });
          
          // Create a sample concert
          const concert = await prisma.concert.create({
            data: {
              bookingId: booking.id,
              title: `Concert at ${hostData.venueName}`,
              date: reviewData.attendedDate,
              startTime: reviewData.attendedDate,
              doorFee: hostData.suggestedDoorFee,
              maxCapacity: hostData.indoorCapacity || hostData.outdoorCapacity,
              status: 'COMPLETED'
            }
          });
          
          // Create the review
          await prisma.review.create({
            data: {
              concertId: concert.id,
              fanId: fan.id,
              artistId: artist.id,
              hostId: host.id,
              artistRating: reviewData.artistRating,
              hostRating: reviewData.hostRating,
              overallRating: reviewData.overallRating,
              hostFeedback: reviewData.hostFeedback,
              overallFeedback: reviewData.overallFeedback,
              attendedDate: reviewData.attendedDate,
              wouldRecommend: reviewData.wouldRecommend,
              isPublic: true
            }
          });
        }
      }
      
      createdCount++;
      console.log(`✅ Created ${hostData.venueName} (${createdCount}/${sampleHosts.length})`);
    }
    
    console.log(`🎉 Successfully created ${createdCount} sample hosts!`);
    console.log('📋 Summary:');
    console.log(`   • ${createdCount} hosts created`);
    console.log(`   • ${createdCount} users created`); 
    console.log(`   • ${sampleHosts.reduce((sum, host) => sum + (host.photos?.length || 0), 0)} photos added`);
    console.log(`   • ${sampleHosts.reduce((sum, host) => sum + (host.reviews?.length || 0), 0)} reviews created`);
    console.log(`   • All hosts auto-approved and ready for browsing`);
    
  } catch (error) {
    console.error('❌ Error seeding hosts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedHosts()
  .then(() => {
    console.log('✨ Host seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Host seeding failed:', error);
    process.exit(1);
  });