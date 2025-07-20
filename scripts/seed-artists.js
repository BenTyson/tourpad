const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleArtists = [
  {
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    stageName: "Sarah Chen",
    genres: ["folk", "indie"],
    bio: "Indie folk singer-songwriter with a passion for storytelling through music. Known for intimate acoustic performances and heartfelt lyrics.",
    tourMonthsPerYear: 6,
    tourVehicle: "van",
    needsLodging: true,
    minGuarantee: 300,
    typicalSetLength: 60,
    willingToTravel: 800,
    equipmentNeeds: ["Microphone", "DI Box"],
    venueRequirements: ["Intimate setting", "Good acoustics"],
    bandMembers: [
      { name: "Sarah Chen", instrument: "Vocals, Guitar", role: "Lead" }
    ]
  },
  {
    name: "Marcus Rodriguez",
    email: "marcus.trio@email.com",
    stageName: "Marcus Rodriguez Trio",
    genres: ["jazz", "blues"],
    bio: "Contemporary jazz trio blending traditional blues with modern improvisational elements. Perfect for sophisticated evening entertainment.",
    tourMonthsPerYear: 8,
    tourVehicle: "van",
    needsLodging: false,
    minGuarantee: 800,
    typicalSetLength: 90,
    willingToTravel: 600,
    equipmentNeeds: ["Piano/Keyboard", "Bass Amp", "Drum Kit"],
    venueRequirements: ["Piano available", "Stage lighting"],
    bandMembers: [
      { name: "Marcus Rodriguez", instrument: "Piano", role: "Lead" },
      { name: "James Wilson", instrument: "Bass", role: "Bassist" },
      { name: "Tony Chen", instrument: "Drums", role: "Drummer" }
    ]
  },
  {
    name: "The Wildfire Collective",
    email: "wildfire@email.com",
    stageName: "The Wildfire Collective",
    genres: ["rock", "experimental"],
    bio: "High-energy experimental rock band pushing the boundaries of traditional rock music with electronic elements and dynamic performances.",
    tourMonthsPerYear: 10,
    tourVehicle: "trailer",
    needsLodging: true,
    minGuarantee: 1200,
    typicalSetLength: 120,
    willingToTravel: 1000,
    equipmentNeeds: ["Full Sound System", "Stage Lighting", "Power"],
    venueRequirements: ["Large stage", "High ceiling", "Power outlets"],
    bandMembers: [
      { name: "Alex Stone", instrument: "Vocals, Guitar", role: "Lead" },
      { name: "Maya Patel", instrument: "Synth, Vocals", role: "Keyboardist" },
      { name: "David Kim", instrument: "Bass", role: "Bassist" },
      { name: "Emma Torres", instrument: "Drums", role: "Drummer" }
    ]
  },
  {
    name: "Elena Vasquez",
    email: "elena.v@email.com",
    stageName: "Elena Vasquez",
    genres: ["country", "americana"],
    bio: "Traditional country singer with modern americana influences. Powerful vocals and authentic storytelling that connects with audiences of all ages.",
    tourMonthsPerYear: 4,
    tourVehicle: "car",
    needsLodging: true,
    minGuarantee: 400,
    typicalSetLength: 75,
    willingToTravel: 500,
    equipmentNeeds: ["Microphone", "Guitar Amp"],
    venueRequirements: ["Family-friendly atmosphere"],
    bandMembers: [
      { name: "Elena Vasquez", instrument: "Vocals, Guitar", role: "Lead" },
      { name: "Jake Morrison", instrument: "Fiddle", role: "Fiddler" }
    ]
  },
  {
    name: "Moonlight Groove",
    email: "moonlight@email.com",
    stageName: "Moonlight Groove",
    genres: ["funk", "soul"],
    bio: "Seven-piece funk and soul band bringing the groove to every performance. Dance-worthy rhythms and infectious energy guaranteed.",
    tourMonthsPerYear: 7,
    tourVehicle: "bus",
    needsLodging: false,
    minGuarantee: 1500,
    typicalSetLength: 105,
    willingToTravel: 750,
    equipmentNeeds: ["Full Sound System", "Stage Monitor", "Lighting"],
    venueRequirements: ["Dance floor", "Large stage", "Good ventilation"],
    bandMembers: [
      { name: "Jerome Washington", instrument: "Vocals", role: "Lead Singer" },
      { name: "Lisa Chang", instrument: "Guitar", role: "Lead Guitar" },
      { name: "Bobby Martinez", instrument: "Bass", role: "Bassist" },
      { name: "Keisha Johnson", instrument: "Drums", role: "Drummer" },
      { name: "Carlos Ruiz", instrument: "Trumpet", role: "Horn Section" },
      { name: "Amanda Foster", instrument: "Saxophone", role: "Horn Section" },
      { name: "Michael Brooks", instrument: "Keyboards", role: "Keyboardist" }
    ]
  },
  {
    name: "The Paper Hearts",
    email: "paperhearts@email.com",
    stageName: "The Paper Hearts",
    genres: ["indie", "pop"],
    bio: "Dreamy indie pop duo creating atmospheric soundscapes with ethereal vocals and intricate harmonies. Perfect for intimate evening shows.",
    tourMonthsPerYear: 5,
    tourVehicle: "car",
    needsLodging: true,
    minGuarantee: 500,
    typicalSetLength: 80,
    willingToTravel: 600,
    equipmentNeeds: ["Microphones", "Keyboard", "Guitar Amp"],
    venueRequirements: ["Quiet atmosphere", "Good acoustics"],
    bandMembers: [
      { name: "Sophie Williams", instrument: "Vocals, Guitar", role: "Lead" },
      { name: "Ryan Mitchell", instrument: "Keyboards, Vocals", role: "Multi-instrumentalist" }
    ]
  },
  {
    name: "DJ Luna",
    email: "dj.luna@email.com",
    stageName: "DJ Luna",
    genres: ["electronic", "house"],
    bio: "Electronic music producer and DJ specializing in deep house and ambient electronic music. Creates immersive sonic experiences for intimate gatherings.",
    tourMonthsPerYear: 9,
    tourVehicle: "car",
    needsLodging: false,
    minGuarantee: 600,
    typicalSetLength: 120,
    willingToTravel: 400,
    equipmentNeeds: ["DJ Equipment", "Sound System", "Lighting"],
    venueRequirements: ["Power outlets", "Dark environment"],
    bandMembers: [
      { name: "Luna Martinez", instrument: "DJ Equipment, Production", role: "DJ/Producer" }
    ]
  },
  {
    name: "Coastal Highway",
    email: "coastal.highway@email.com",
    stageName: "Coastal Highway",
    genres: ["alternative", "surf rock"],
    bio: "Surf rock revival band bringing California coastal vibes with modern alternative rock edge. High-energy performances perfect for outdoor venues.",
    tourMonthsPerYear: 6,
    tourVehicle: "van",
    needsLodging: true,
    minGuarantee: 700,
    typicalSetLength: 95,
    willingToTravel: 900,
    equipmentNeeds: ["Guitar Amps", "Bass Amp", "Drum Kit"],
    venueRequirements: ["Outdoor friendly", "High energy crowd"],
    bandMembers: [
      { name: "Tyler Beach", instrument: "Lead Guitar, Vocals", role: "Lead" },
      { name: "Ocean Rodriguez", instrument: "Rhythm Guitar", role: "Rhythm Guitar" },
      { name: "Sandy Johnson", instrument: "Bass", role: "Bassist" },
      { name: "Wave Chen", instrument: "Drums", role: "Drummer" }
    ]
  }
];

async function seedArtists() {
  console.log('Starting to create sample artists...');

  for (const artistData of sampleArtists) {
    try {
      console.log(`Creating artist: ${artistData.name}...`);

      // Create user first
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
              location: 'United States'
            }
          }
        }
      });

      // Create artist profile
      const artist = await prisma.artist.create({
        data: {
          userId: user.id,
          stageName: artistData.stageName,
          genres: artistData.genres,
          tourMonthsPerYear: artistData.tourMonthsPerYear,
          tourVehicle: artistData.tourVehicle,
          needsLodging: artistData.needsLodging,
          minGuarantee: artistData.minGuarantee,
          typicalSetLength: artistData.typicalSetLength,
          willingToTravel: artistData.willingToTravel,
          equipmentNeeds: artistData.equipmentNeeds,
          venueRequirements: artistData.venueRequirements,
          approvedAt: new Date(), // Pre-approve all sample artists
          applicationSubmittedAt: new Date()
        }
      });

      // Create band members
      for (let i = 0; i < artistData.bandMembers.length; i++) {
        const member = artistData.bandMembers[i];
        await prisma.bandMember.create({
          data: {
            artistId: artist.id,
            name: member.name,
            instrument: member.instrument,
            role: member.role,
            sortOrder: i
          }
        });
      }

      console.log(`✅ Created artist: ${artistData.name} with ${artistData.bandMembers.length} band members`);

    } catch (error) {
      console.error(`❌ Error creating artist ${artistData.name}:`, error);
    }
  }

  console.log('Finished creating sample artists!');
}

seedArtists()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });