const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const artistsData = [
  {
    name: "The Midnight Echoes",
    email: "contact@midnightechoes.com",
    bio: "Indie rock band from Portland, Oregon, blending dreamy soundscapes with powerful vocals. Known for their atmospheric live performances and introspective lyrics.",
    location: "Portland, OR",
    genres: ["Indie Rock", "Dream Pop", "Alternative"],
    profileImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/midnightechoes",
      instagram: "midnightechoes",
      youtube: "https://youtube.com/midnightechoes"
    },
    tourMonthsPerYear: 6,
    tourVehicle: "van",
    willingToTravel: 800,
    equipmentNeeds: ["Sound System", "Lighting"],
    venueRequirements: ["Stage", "Green Room"],
    bandMembers: [
      { name: "Alex Rivera", instrument: "Lead Vocals, Guitar", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
      { name: "Maya Chen", instrument: "Bass, Backing Vocals", photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b9a8af3c?w=400&h=400&fit=crop&crop=face" },
      { name: "Jake Wilson", instrument: "Drums", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" }
    ]
  },
  {
    name: "Luna Solstice",
    email: "booking@lunasolstice.com",
    bio: "Ethereal folk singer-songwriter whose haunting melodies and poetic lyrics transport listeners to otherworldly realms. Solo artist with occasional collaborations.",
    location: "Nashville, TN",
    genres: ["Folk", "Indie Folk", "Singer-Songwriter"],
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/lunasolstice",
      instagram: "lunasolstice",
      facebook: "https://facebook.com/lunasolstice"
    },
    tourMonthsPerYear: 4,
    tourVehicle: "car",
    willingToTravel: 600,
    equipmentNeeds: ["Microphone", "Acoustic Guitar"],
    venueRequirements: ["Intimate Setting", "Good Acoustics"],
    bandMembers: [
      { name: "Luna Martinez", instrument: "Vocals, Guitar, Piano", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" }
    ]
  },
  {
    name: "Neon Frequency",
    email: "info@neonfrequency.net",
    bio: "Electronic music duo creating pulsating beats and synthesized soundscapes. Known for their high-energy performances and innovative use of technology in live shows.",
    location: "Los Angeles, CA",
    genres: ["Electronic", "Synthwave", "Techno"],
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/neonfrequency",
      instagram: "neonfrequency",
      youtube: "https://youtube.com/neonfrequency",
      website: "https://neonfrequency.net"
    },
    tourMonthsPerYear: 8,
    tourVehicle: "van",
    willingToTravel: 1200,
    equipmentNeeds: ["DJ Equipment", "Lighting", "Fog Machine"],
    venueRequirements: ["Dance Floor", "Professional Sound System"],
    bandMembers: [
      { name: "David Kim", instrument: "Synthesizers, Production", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
      { name: "Sarah Thompson", instrument: "Vocals, Synth", photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b9a8af3c?w=400&h=400&fit=crop&crop=face" }
    ]
  },
  {
    name: "Crimson Tide Blues",
    email: "bookings@crimsontideblues.com",
    bio: "Traditional blues band with a modern twist, featuring soulful guitar work and powerful vocals. Keeping the blues tradition alive with contemporary energy.",
    location: "Chicago, IL",
    genres: ["Blues", "Rock Blues", "Soul"],
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/crimsontideblues",
      instagram: "crimsontideblues",
      facebook: "https://facebook.com/crimsontideblues"
    },
    tourMonthsPerYear: 5,
    tourVehicle: "van",
    willingToTravel: 700,
    equipmentNeeds: ["Guitar Amplifiers", "Harmonica"],
    venueRequirements: ["Stage", "Blues-Friendly Venue"],
    bandMembers: [
      { name: "Marcus Johnson", instrument: "Lead Guitar, Vocals", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" },
      { name: "Ruby Washington", instrument: "Bass Guitar", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" },
      { name: "Tommy Rodriguez", instrument: "Drums", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
      { name: "Eddie Parks", instrument: "Harmonica, Piano", photoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face" }
    ]
  },
  {
    name: "Acoustic Wanderers",
    email: "hello@acousticwanderers.com",
    bio: "Folk duo traveling the country with nothing but their guitars and harmonies. Creating intimate acoustic experiences that connect deeply with audiences.",
    location: "Austin, TX",
    genres: ["Folk", "Acoustic", "Country Folk"],
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b9a8af3c?w=400&h=400&fit=crop&crop=face",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/acousticwanderers",
      instagram: "acousticwanderers",
      website: "https://acousticwanderers.com"
    },
    tourMonthsPerYear: 9,
    tourVehicle: "van",
    willingToTravel: 1500,
    equipmentNeeds: ["Acoustic Guitars", "Microphones"],
    venueRequirements: ["Intimate Setting", "Acoustic-Friendly"],
    bandMembers: [
      { name: "Emma Clarke", instrument: "Vocals, Guitar", photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b9a8af3c?w=400&h=400&fit=crop&crop=face" },
      { name: "Ryan Mitchell", instrument: "Vocals, Guitar, Harmonica", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" }
    ]
  },
  {
    name: "Violet Storm",
    email: "management@violetstorm.band",
    bio: "High-energy rock band with powerful female vocals and driving guitar riffs. Known for their explosive live performances and anthemic songs.",
    location: "Seattle, WA",
    genres: ["Rock", "Alternative Rock", "Grunge"],
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/violetstorm",
      instagram: "violetstormband",
      youtube: "https://youtube.com/violetstorm",
      facebook: "https://facebook.com/violetstorm"
    },
    tourMonthsPerYear: 7,
    tourVehicle: "van",
    willingToTravel: 1000,
    equipmentNeeds: ["Guitar Amplifiers", "Drum Kit"],
    venueRequirements: ["Large Stage", "Professional Sound System"],
    bandMembers: [
      { name: "Violet Anderson", instrument: "Lead Vocals", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" },
      { name: "Jake Morrison", instrument: "Lead Guitar", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
      { name: "Lisa Chang", instrument: "Bass Guitar", photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b9a8af3c?w=400&h=400&fit=crop&crop=face" },
      { name: "Mike Torres", instrument: "Drums", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" }
    ]
  }
];

async function seedArtists() {
  console.log('Starting artist seeding...');
  
  try {
    for (const artistData of artistsData) {
      console.log(`Creating artist: ${artistData.name}`);
      
      // Create user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await prisma.user.create({
        data: {
          name: artistData.name,
          email: artistData.email,
          passwordHash: hashedPassword,
          userType: 'ARTIST'
        }
      });
      
      // Create user profile
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          bio: artistData.bio,
          location: artistData.location,
          profileImageUrl: artistData.profileImageUrl,
          socialLinks: artistData.socialLinks,
          websiteUrl: artistData.socialLinks?.website || ''
        }
      });
      
      // Create artist record
      const artist = await prisma.artist.create({
        data: {
          userId: user.id,
          stageName: artistData.name,
          genres: artistData.genres,
          tourMonthsPerYear: artistData.tourMonthsPerYear,
          tourVehicle: artistData.tourVehicle,
          willingToTravel: artistData.willingToTravel,
          equipmentNeeds: artistData.equipmentNeeds,
          venueRequirements: artistData.venueRequirements
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
            photoUrl: member.photoUrl,
            sortOrder: i
          }
        });
      }
      
      console.log(`✅ Created artist: ${artistData.name}`);
    }
    
    console.log('🎉 All artists created successfully!');
    
  } catch (error) {
    console.error('Error seeding artists:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedArtists()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });