const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleHosts = [
  {
    // User data
    name: "Sarah Chen",
    email: "sarah.chen.host@tourpad.com",
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
    venueDescription: "Cozy living room with a piano and fireplace. Perfect for intimate acoustic shows with our regular community of 25-30 music lovers.",
    indoorCapacity: 30,
    outdoorCapacity: 0,
    suggestedDoorFee: 15,
    typicalShowLength: 90,
    hostingExperience: 3,
    offersLodging: true,
    amenities: [
      "WiFi available",
      "Free parking on premises", 
      "Kid friendly environment",
      "Power access for equipment",
      "Food & Refreshments"
    ],
    soundSystem: {
      available: false,
      description: "Artists provide their own sound equipment"
    },
    lodgingDetails: {
      numberOfRooms: 1,
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
    }
  },
  {
    name: "Mike & Emma Rodriguez",
    email: "mike.emma.host@tourpad.com", 
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
    venueDescription: "Industrial loft space in the heart of Music City. High ceilings, exposed brick, and perfect acoustics for all genres.",
    indoorCapacity: 45,
    outdoorCapacity: 0,
    suggestedDoorFee: 25,
    typicalShowLength: 120,
    hostingExperience: 5,
    offersLodging: false,
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
        speakers: "QSC K12.2 mains with subwoofer",
        microphones: "4 wireless handheld + 2 wireless lavalier",
        instruments: "DI boxes available for acoustic instruments",
        additional: "Professional lighting rig and stage backdrop"
      }
    }
  },
  {
    name: "David Kim",
    email: "david.kim.host@tourpad.com",
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
    venueDescription: "Custom-built outdoor amphitheater in a beautiful garden setting. Weather-protected stage and seating area.",
    indoorCapacity: 0,
    outdoorCapacity: 60,
    suggestedDoorFee: 30,
    typicalShowLength: 105,
    hostingExperience: 2,
    offersLodging: true,
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
        speakers: "Weather-resistant outdoor speakers",
        microphones: "Wireless system with wind guards", 
        instruments: "Full backline available",
        additional: "Professional outdoor lighting and weather canopy"
      }
    },
    lodgingDetails: {
      numberOfRooms: 1,
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
    }
  },
  {
    name: "Jenny Martinez",
    email: "jenny.martinez.host@tourpad.com",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=faces",
    bio: "Former music teacher who loves supporting touring artists. My studio space has hosted over 50 concerts.",
    location: "Denver, CO", 
    websiteUrl: "",
    socialLinks: {
      instagram: "denvermusicroom"
    },
    venueName: "The Music Room",
    venueType: "STUDIO",
    city: "Denver",
    state: "CO", 
    venueDescription: "Professional music studio converted for live performances. Acoustic treatment and intimate setting for up to 25 guests.",
    indoorCapacity: 25,
    outdoorCapacity: 0,
    suggestedDoorFee: 20,
    typicalShowLength: 90,
    hostingExperience: 4,
    offersLodging: false,
    amenities: [
      "WiFi available",
      "Sound system provided",
      "Power access for equipment",
      "Air conditioning / Heating", 
      "Free parking on premises"
    ],
    soundSystem: {
      available: true,
      description: "Professional studio monitors and recording equipment",
      equipment: {
        speakers: "Studio monitor speakers", 
        microphones: "Professional condenser and dynamic mics",
        instruments: "Piano, guitar amps, bass amp available",
        additional: "Professional recording capability available"
      }
    }
  },
  {
    name: "Robert & Lisa Thompson", 
    email: "thompson.family.host@tourpad.com",
    profileImageUrl: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&h=400&fit=crop&crop=faces",
    bio: "Empty nesters who converted our basement into a cozy concert venue. We love cooking for our artists!",
    location: "Minneapolis, MN",
    websiteUrl: "",
    socialLinks: {},
    venueName: "Thompson Family Basement",
    venueType: "HOME",
    city: "Minneapolis", 
    state: "MN",
    venueDescription: "Finished basement with a warm, living room feel. Full kitchen upstairs and we always provide dinner for our artists.",
    indoorCapacity: 20,
    outdoorCapacity: 0,
    suggestedDoorFee: 12,
    typicalShowLength: 75,
    hostingExperience: 1,
    offersLodging: true,
    amenities: [
      "WiFi available",
      "Kid friendly environment", 
      "Food & Refreshments",
      "Power access for equipment",
      "Free parking on premises",
      "Overnight accommodation"
    ],
    soundSystem: {
      available: false,
      description: "Acoustic performances only"
    },
    lodgingDetails: {
      numberOfRooms: 2,
      rooms: [
        {
          id: 1,
          roomType: "guest_bedroom", 
          bathroomType: "shared",
          beds: [{ type: "queen", quantity: 1 }],
          maxOccupancy: 2
        },
        {
          id: 2,
          roomType: "guest_bedroom",
          bathroomType: "shared", 
          beds: [{ type: "twin", quantity: 2 }],
          maxOccupancy: 2
        }
      ],
      amenities: {
        wifi: true,
        breakfast: true,
        kitchenAccess: true,
        parking: true,
        linensProvided: true,
        towelsProvided: true
      }
    }
  },
  {
    name: "Alex Rivera",
    email: "alex.rivera.host@tourpad.com", 
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    bio: "Artist and maker who converted my warehouse studio into a multi-purpose venue for music and art events.",
    location: "Brooklyn, NY",
    websiteUrl: "https://riverawarehouse.com",
    socialLinks: {
      instagram: "riverawarehouse",
      website: "https://riverawarehouse.com"
    },
    venueName: "Rivera Warehouse",
    venueType: "WAREHOUSE",
    city: "Brooklyn",
    state: "NY",
    venueDescription: "Industrial warehouse space with moveable walls and flexible setup. Can accommodate intimate shows or larger gatherings.",
    indoorCapacity: 80,
    outdoorCapacity: 0, 
    suggestedDoorFee: 35,
    typicalShowLength: 120,
    hostingExperience: 3,
    offersLodging: false,
    amenities: [
      "WiFi available",
      "Sound system provided",
      "Power access for equipment",
      "Step-free access"
    ],
    soundSystem: {
      available: true,
      description: "Modular sound system that scales with event size",
      equipment: {
        speakers: "Modular line array system",
        microphones: "8-channel wireless system",
        instruments: "Full backline and DJ equipment available", 
        additional: "Professional lighting grid and video projection"
      }
    }
  },
  {
    name: "Maria Santos",
    email: "maria.santos.host@tourpad.com",
    profileImageUrl: "https://images.unsplash.com/photo-1485893015013-6f4be9c49de9?w=400&h=400&fit=crop&crop=faces",
    bio: "Retired teacher who hosts bilingual concerts to build community through music. ¡La música nos une!",
    location: "San Antonio, TX",
    websiteUrl: "",
    socialLinks: {
      facebook: "https://facebook.com/casadesantos"
    },
    venueName: "Casa de Santos",
    venueType: "HOME",
    city: "San Antonio",
    state: "TX", 
    venueDescription: "Traditional adobe home with a large living area perfect for both English and Spanish-language performances. Family-friendly atmosphere.",
    indoorCapacity: 35,
    outdoorCapacity: 0,
    suggestedDoorFee: 10,
    typicalShowLength: 90,
    hostingExperience: 2,
    offersLodging: true,
    amenities: [
      "WiFi available",
      "Kid friendly environment",
      "Food & Refreshments", 
      "Free parking on premises",
      "Power access for equipment",
      "Overnight accommodation"
    ],
    soundSystem: {
      available: false,
      description: "Acoustic performances preferred, small PA available if needed"
    },
    lodgingDetails: {
      numberOfRooms: 1,
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
        kitchenAccess: true,
        parking: true,
        linensProvided: true,
        towelsProvided: true
      }
    }
  },
  {
    name: "James Park",
    email: "james.park.host@tourpad.com",
    profileImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces",
    bio: "Audio engineer who built the perfect listening room. I love showcasing artists in an audiophile-quality environment.", 
    location: "Seattle, WA",
    websiteUrl: "https://perfectlistening.com",
    socialLinks: {
      instagram: "perfectlisteningroom",
      youtube: "https://youtube.com/perfectlistening"
    },
    venueName: "The Perfect Listening Room",
    venueType: "STUDIO",
    city: "Seattle",
    state: "WA",
    venueDescription: "Custom-built listening room with acoustic treatment designed by professional engineers. Intimate setting for audiophile experiences.",
    indoorCapacity: 18,
    outdoorCapacity: 0,
    suggestedDoorFee: 40,
    typicalShowLength: 75, 
    hostingExperience: 6,
    offersLodging: false,
    amenities: [
      "WiFi available",
      "Sound system provided",
      "Power access for equipment",
      "Air conditioning / Heating"
    ],
    soundSystem: {
      available: true,
      description: "High-end audiophile sound system with precision acoustic treatment",
      equipment: {
        speakers: "Reference monitor speakers with tube preamps",
        microphones: "Vintage ribbon and condenser microphones",
        instruments: "Steinway baby grand piano available",
        additional: "Professional recording and live streaming capabilities"
      }
    }
  }
];

async function seedHosts() {
  console.log('🌱 Starting to seed hosts...');
  
  try {
    let createdCount = 0;
    
    for (const hostData of sampleHosts) {
      console.log(`Creating host: ${hostData.venueName}`);
      
      // Create user first
      const user = await prisma.user.create({
        data: {
          name: hostData.name,
          email: hostData.email,
          emailVerified: true,
          userType: 'HOST',
          status: 'ACTIVE',
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
          venueDescription: hostData.venueDescription,
          indoorCapacity: hostData.indoorCapacity,
          outdoorCapacity: hostData.outdoorCapacity,
          suggestedDoorFee: hostData.suggestedDoorFee,
          typicalShowLength: hostData.typicalShowLength,
          hostingExperience: hostData.hostingExperience,
          offersLodging: hostData.offersLodging,
          amenities: hostData.amenities,
          soundSystem: hostData.soundSystem,
          lodgingDetails: hostData.lodgingDetails,
          approvedAt: new Date(), // Auto-approve sample hosts
          preferredGenres: ['Folk', 'Indie', 'Acoustic'], // Default genres
          country: 'USA'
        }
      });
      
      // Add some sample media for each host
      const sampleImages = [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop'
      ];
      
      for (let i = 0; i < 2; i++) {
        await prisma.hostMedia.create({
          data: {
            hostId: host.id,
            mediaType: 'PHOTO',
            category: i === 0 ? 'venue' : 'performance_space',
            fileUrl: sampleImages[i % sampleImages.length],
            title: i === 0 ? 'Main venue photo' : 'Performance space',
            description: `Photo ${i + 1} of ${hostData.venueName}`,
            sortOrder: i
          }
        });
      }
      
      createdCount++;
      console.log(`✅ Created ${hostData.venueName} (${createdCount}/${sampleHosts.length})`);
    }
    
    console.log(`🎉 Successfully created ${createdCount} sample hosts!`);
    console.log('📋 Summary:');
    console.log(`   • ${createdCount} hosts created`);
    console.log(`   • ${createdCount} users created`); 
    console.log(`   • ${createdCount * 2} photos added`);
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