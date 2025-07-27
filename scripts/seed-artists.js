const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleArtists = [
  {
    // User Info
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    bio: "Indie folk singer-songwriter with a passion for storytelling through music.",
    location: "Portland, OR",
    
    // Artist Profile
    stageName: "Sarah Chen",
    genres: ["folk", "indie", "acoustic"],
    musicalStyle: "Intimate acoustic storytelling with fingerpicked guitar and ethereal vocals",
    briefBio: "Portland-based folk artist known for intimate acoustic performances that transform living rooms into concert halls.",
    fullBio: "Sarah Chen has been crafting songs that speak to the soul for over 7 years. Based in Portland, Oregon, she brings an intimate acoustic style that perfectly suits house concert settings. Her music blends traditional folk storytelling with modern indie sensibilities, creating moments of genuine connection between artist and audience. When she's not touring, Sarah teaches guitar and volunteers at local music education programs.",
    
    // Tour & Travel
    tourMonthsPerYear: 6,
    tourVehicle: "van",
    willingToTravel: 800,
    needsLodging: true,
    
    // Performance
    contentRating: "family-friendly",
    venueRequirements: ["Intimate setting", "Good acoustics", "Seating for audience"],
    
    // Media & Links  
    pressPhotoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    heroPhotoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    performanceVideoUrl: "https://youtube.com/watch?v=sarah_chen_live",
    
    // Band Members
    bandMembers: [
      { name: "Sarah Chen", instrument: "Vocals, Guitar", role: "Lead", bio: "Primary songwriter and performer" }
    ]
  },
  {
    // User Info
    name: "Marcus Rodriguez",
    email: "marcus.trio@email.com", 
    bio: "Contemporary jazz trio blending traditional blues with modern improvisational elements.",
    location: "Austin, TX",
    
    // Artist Profile
    stageName: "Marcus Rodriguez Trio",
    genres: ["jazz", "blues", "contemporary"],
    musicalStyle: "Contemporary jazz with blues roots and sophisticated improvisational arrangements",
    briefBio: "Austin-based jazz trio bringing sophisticated evening entertainment with masterful improvisational skills.",
    fullBio: "The Marcus Rodriguez Trio has been a staple of the Austin jazz scene for over a decade. Marcus's keyboard mastery combined with his rhythm section creates an atmosphere perfect for intimate venues and sophisticated audiences. Their repertoire spans from jazz standards to original compositions that showcase each member's virtuosity while maintaining the intimate connection that makes house concerts special.",
    
    // Tour & Travel
    tourMonthsPerYear: 8,
    tourVehicle: "van",
    willingToTravel: 600, 
    needsLodging: false,
    
    // Performance
    contentRating: "family-friendly",
    venueRequirements: ["Piano available", "Stage lighting", "Power outlets"],
    
    // Media & Links
    pressPhotoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    heroPhotoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800", 
    performanceVideoUrl: "https://youtube.com/watch?v=marcus_trio_live",
    
    // Band Members
    bandMembers: [
      { name: "Marcus Rodriguez", instrument: "Piano, Keyboards", role: "Lead", bio: "Bandleader and primary composer" },
      { name: "James Wilson", instrument: "Upright Bass", role: "Bassist", bio: "Classical training meets jazz innovation" },
      { name: "Tony Chen", instrument: "Drums", role: "Drummer", bio: "Master of dynamics and groove" }
    ]
  },
  {
    // User Info
    name: "The Wildfire Collective",
    email: "wildfire@email.com",
    bio: "High-energy experimental rock band pushing boundaries with electronic elements.",
    location: "Denver, CO",
    
    // Artist Profile
    stageName: "The Wildfire Collective", 
    genres: ["rock", "experimental", "electronic"],
    musicalStyle: "Experimental rock with electronic elements and dynamic progressive arrangements",
    briefBio: "Denver-based experimental rock collective known for boundary-pushing performances and electronic-infused soundscapes.",
    fullBio: "The Wildfire Collective emerged from Denver's vibrant music scene with a mission to redefine what rock music can be. Combining traditional rock instrumentation with cutting-edge electronic elements, they create immersive sonic experiences that work equally well in intimate venues and larger spaces. Their progressive approach to song structure and improvisation makes each performance unique while maintaining the energy and connection that defines great live music.",
    
    // Tour & Travel
    tourMonthsPerYear: 10,
    tourVehicle: "trailer",
    willingToTravel: 1000,
    needsLodging: true,
    
    // Performance
    contentRating: "tailored",
    venueRequirements: ["Large stage", "High ceiling", "Power outlets", "Sound system hookup"],
    
    // Media & Links
    pressPhotoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    heroPhotoUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    performanceVideoUrl: "https://youtube.com/watch?v=wildfire_live",
    
    // Band Members
    bandMembers: [
      { name: "Alex Stone", instrument: "Vocals, Guitar", role: "Lead", bio: "Primary songwriter and vocalist" },
      { name: "Maya Patel", instrument: "Synthesizers, Vocals", role: "Keyboardist", bio: "Electronic sound architect" },
      { name: "David Kim", instrument: "Bass Guitar", role: "Bassist", bio: "Groove foundation and backing vocals" },
      { name: "Emma Torres", instrument: "Drums, Electronic Pads", role: "Drummer", bio: "Rhythmic complexity and electronic integration" }
    ]
  },
  {
    // User Info  
    name: "Elena Vasquez",
    email: "elena.v@email.com",
    bio: "Traditional country singer with modern americana influences and powerful vocals.",
    location: "Nashville, TN",
    
    // Artist Profile
    stageName: "Elena Vasquez",
    genres: ["country", "americana", "folk"],
    musicalStyle: "Traditional country vocals with modern americana storytelling and authentic instrumentation",
    briefBio: "Nashville-based country artist bringing authentic storytelling and powerful vocals to intimate venues.",
    fullBio: "Elena Vasquez represents the heart of country music's storytelling tradition while bringing a fresh, authentic voice to modern americana. Based in Nashville but raised in rural Texas, her songs connect with audiences through honest narratives about love, loss, and the American experience. Her powerful vocals and traditional instrumentation create the perfect atmosphere for house concerts where every word matters.",
    
    // Tour & Travel
    tourMonthsPerYear: 4,
    tourVehicle: "car", 
    willingToTravel: 500,
    needsLodging: true,
    
    // Performance
    contentRating: "family-friendly",
    venueRequirements: ["Family-friendly atmosphere", "Good acoustics"],
    
    // Media & Links
    pressPhotoUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    heroPhotoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    performanceVideoUrl: "https://youtube.com/watch?v=elena_live",
    
    // Band Members
    bandMembers: [
      { name: "Elena Vasquez", instrument: "Vocals, Guitar", role: "Lead", bio: "Primary performer and songwriter" },
      { name: "Jake Morrison", instrument: "Fiddle, Mandolin", role: "Multi-instrumentalist", bio: "Traditional country instrumentation specialist" }
    ]
  },
  {
    // User Info
    name: "DJ Luna", 
    email: "dj.luna@email.com",
    bio: "Electronic music producer and DJ specializing in deep house and ambient soundscapes.",
    location: "Los Angeles, CA",
    
    // Artist Profile  
    stageName: "DJ Luna",
    genres: ["electronic", "house", "ambient"],
    musicalStyle: "Deep house and ambient electronic music creating immersive sonic experiences",
    briefBio: "LA-based electronic artist crafting immersive soundscapes perfect for intimate gatherings and transformative experiences.",
    fullBio: "DJ Luna has been at the forefront of electronic music's evolution toward more intimate, experiential performances. Based in Los Angeles, Luna specializes in creating immersive sonic journeys that work perfectly in non-traditional venues. Her deep house and ambient compositions are designed to transform spaces, making house concerts feel like transcendent audio-visual experiences. She brings professional-grade equipment but maintains the intimacy that makes electronic music in small venues so powerful.",
    
    // Tour & Travel
    tourMonthsPerYear: 9,
    tourVehicle: "car",
    willingToTravel: 400,
    needsLodging: false,
    
    // Performance
    contentRating: "family-friendly", 
    venueRequirements: ["Power outlets", "Dark environment capable", "Level surfaces for equipment"],
    
    // Media & Links
    pressPhotoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    heroPhotoUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    performanceVideoUrl: "https://youtube.com/watch?v=dj_luna_live",
    
    // Band Members
    bandMembers: [
      { name: "Luna Martinez", instrument: "DJ Equipment, Live Production", role: "DJ/Producer", bio: "Electronic music architect and live performer" }
    ]
  },
  {
    // User Info
    name: "The Paper Hearts",
    email: "paperhearts@email.com",
    bio: "Dreamy indie pop duo creating atmospheric soundscapes with ethereal vocals and intricate harmonies.",
    location: "Seattle, WA",
    
    // Artist Profile
    stageName: "The Paper Hearts",
    genres: ["indie", "pop", "dream pop"],
    musicalStyle: "Dreamy indie pop with atmospheric soundscapes and ethereal vocal harmonies",
    briefBio: "Seattle-based indie pop duo crafting atmospheric soundscapes perfect for intimate evening shows.",
    fullBio: "The Paper Hearts emerged from Seattle's indie scene with a unique approach to intimate pop music. Sophie and Ryan create layered soundscapes that blend ethereal vocals with carefully crafted instrumentation, making each performance feel like a shared meditation. Their music works perfectly in house concert settings where the nuances of their harmonies and atmospheric arrangements can be fully appreciated by audiences seeking something truly special.",
    
    // Tour & Travel
    tourMonthsPerYear: 5,
    tourVehicle: "car",
    willingToTravel: 600,
    needsLodging: true,
    
    // Performance
    contentRating: "family-friendly",
    venueRequirements: ["Quiet atmosphere", "Good acoustics", "Intimate lighting"],
    
    // Media & Links
    pressPhotoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    heroPhotoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    performanceVideoUrl: "https://youtube.com/watch?v=paperhearts_live",
    
    // Band Members
    bandMembers: [
      { name: "Sophie Williams", instrument: "Vocals, Guitar", role: "Lead", bio: "Primary songwriter and vocalist" },
      { name: "Ryan Mitchell", instrument: "Keyboards, Vocals", role: "Multi-instrumentalist", bio: "Sound architect and harmony specialist" }
    ]
  },
  {
    // User Info
    name: "Coastal Highway",
    email: "coastal.highway@email.com",
    bio: "Surf rock revival band bringing California coastal vibes with modern alternative rock edge.",
    location: "San Diego, CA",
    
    // Artist Profile
    stageName: "Coastal Highway",
    genres: ["alternative", "surf rock", "indie rock"],
    musicalStyle: "Surf rock revival with modern alternative edge and California coastal energy",
    briefBio: "San Diego-based surf rock band bringing high-energy California vibes to intimate and outdoor venues alike.",
    fullBio: "Coastal Highway captures the essence of California's surf culture through their modern take on classic surf rock. Based in San Diego, this four-piece band combines the reverb-drenched guitars and driving rhythms of 60s surf rock with contemporary alternative sensibilities. Their high-energy performances work equally well in backyard settings and larger outdoor venues, bringing that unmistakable California coastal energy wherever they play.",
    
    // Tour & Travel
    tourMonthsPerYear: 6,
    tourVehicle: "van",
    willingToTravel: 900,
    needsLodging: true,
    
    // Performance
    contentRating: "family-friendly",
    venueRequirements: ["Outdoor friendly", "High energy crowd", "Space for movement"],
    
    // Media & Links
    pressPhotoUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    heroPhotoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    performanceVideoUrl: "https://youtube.com/watch?v=coastal_highway_live",
    
    // Band Members
    bandMembers: [
      { name: "Tyler Beach", instrument: "Lead Guitar, Vocals", role: "Lead", bio: "Primary songwriter and frontman" },
      { name: "Ocean Rodriguez", instrument: "Rhythm Guitar", role: "Rhythm Guitar", bio: "Harmonic foundation and backing vocals" },
      { name: "Sandy Johnson", instrument: "Bass Guitar", role: "Bassist", bio: "Driving rhythmic anchor" },
      { name: "Wave Chen", instrument: "Drums", role: "Drummer", bio: "High-energy percussion master" }
    ]
  }
];

async function seedArtists() {
  console.log('🎵 Starting to create sample artists with current schema...');

  for (const artistData of sampleArtists) {
    try {
      console.log(`Creating artist: ${artistData.name}...`);

      // Create user first with UserProfile
      const user = await prisma.user.create({
        data: {
          email: artistData.email,
          name: artistData.name,
          userType: 'ARTIST',
          status: 'ACTIVE',
          emailVerified: true,
          profile: {
            create: {
              bio: artistData.bio,
              location: artistData.location
            }
          }
        }
      });

      // Create artist profile with current schema fields
      const artist = await prisma.artist.create({
        data: {
          userId: user.id,
          stageName: artistData.stageName,
          genres: artistData.genres,
          musicalStyle: artistData.musicalStyle,
          briefBio: artistData.briefBio,
          fullBio: artistData.fullBio,
          tourMonthsPerYear: artistData.tourMonthsPerYear,
          tourVehicle: artistData.tourVehicle,
          willingToTravel: artistData.willingToTravel,
          needsLodging: artistData.needsLodging,
          contentRating: artistData.contentRating,
          venueRequirements: artistData.venueRequirements,
          pressPhotoUrl: artistData.pressPhotoUrl,
          heroPhotoUrl: artistData.heroPhotoUrl,
          performanceVideoUrl: artistData.performanceVideoUrl,
          approvedAt: new Date(), // Pre-approve all sample artists
          applicationSubmittedAt: new Date()
        }
      });

      // Create band members with current schema
      for (let i = 0; i < artistData.bandMembers.length; i++) {
        const member = artistData.bandMembers[i];
        await prisma.bandMember.create({
          data: {
            artistId: artist.id,
            name: member.name,
            instrument: member.instrument,
            role: member.role,
            bio: member.bio,
            sortOrder: i
          }
        });
      }

      console.log(`✅ Created artist: ${artistData.name} with ${artistData.bandMembers.length} band members`);

    } catch (error) {
      console.error(`❌ Error creating artist ${artistData.name}:`, error);
    }
  }

  console.log('🎉 Finished creating sample artists with current schema!');
}

seedArtists()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });