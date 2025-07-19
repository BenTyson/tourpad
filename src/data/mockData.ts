export const mockHosts = [
  {
    id: '1',
    userId: 'host1',
    name: 'The Garden House',
    bio: 'Cozy living room with a piano and fireplace. We love hosting intimate acoustic shows for 20-30 people. Our home has a warm, welcoming atmosphere perfect for singer-songwriters and small bands.',
    hostInfo: {
      hostName: 'Sarah & Mike Johnson',
      aboutMe: 'We\'re a couple who fell in love with live music through house concerts. As musicians ourselves, we understand what artists need to feel comfortable and put on their best show. When we\'re not hosting, you\'ll find us at local venues supporting the music community.',
      profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces'
    },
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    venueType: 'Home/Living Room',
    mapLocation: {
      displayLat: 30.2711286,  // Offset from real location for privacy
      displayLng: -97.7436995,
      city: 'Austin',
      state: 'TX',
      priceRange: '$10-20',
      searchKeywords: ['austin', 'texas', 'living room', 'acoustic', 'intimate']
    },
    showSpecs: {
      avgAttendance: 25,
      avgDoorFee: 15,
      indoorAttendanceMax: 30,
      outdoorAttendanceMax: 0,
      showDurationMins: 90,
      showFormat: 'Living room acoustic',
      estimatedShowsPerYear: 8,
      hostingHistory: '2 years',
      daysAvailable: ['Fri', 'Sat'],
      performanceLocation: 'home'
    },
    amenities: {
      powerAccess: true,
      airConditioning: true,
      wifi: true,
      kidFriendly: true,
      adultsOnly: false,
      parking: true,
      petFriendly: false,
      soundSystem: false,
      outdoorSpace: true,
      accessible: false,
      bnbOffered: true
    },
    housePhotos: [
      {
        id: 'house1',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        alt: 'Cozy living room with fireplace and piano',
        category: 'house' as const
      },
      {
        id: 'house2', 
        url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800',
        alt: 'Kitchen and dining area',
        category: 'house' as const
      },
      {
        id: 'house3',
        url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        alt: 'Outdoor garden seating area',
        category: 'exterior' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'perf1',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        alt: 'Performance space setup with chairs arranged',
        category: 'performance_space' as const
      },
      {
        id: 'perf2',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 
        alt: 'Intimate acoustic performance in living room',
        category: 'crowd' as const
      }
    ],
    rating: 4.9,
    reviewCount: 12,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    userId: 'host2',
    name: 'Riverside Barn',
    bio: 'Rustic barn venue on 5 acres outside the city. Great acoustics and room for 50+ people. We provide a full sound system and have hosted everyone from folk duos to full bands.',
    hostInfo: {
      hostName: 'Jake Martinez',
      aboutMe: 'I\'ve been hosting concerts in my barn for over 5 years. Music has always been my passion, and I love creating a space where artists can connect with audiences in an intimate setting. My family has been farming this land for generations, and we\'re proud to share it with the music community.',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    city: 'Nashville',
    state: 'TN',
    zip: '37201',
    venueType: 'Other',
    mapLocation: {
      displayLat: 36.1622767,  // Offset from real location for privacy
      displayLng: -86.7743531,
      city: 'Nashville',
      state: 'TN',
      priceRange: '$15-25',
      searchKeywords: ['nashville', 'tennessee', 'barn', 'concert', 'sound system', 'country']
    },
    showSpecs: {
      avgAttendance: 45,
      avgDoorFee: 20,
      indoorAttendanceMax: 60,
      outdoorAttendanceMax: 100,
      showDurationMins: 120,
      showFormat: 'Barn concert with sound system',
      estimatedShowsPerYear: 12,
      hostingHistory: '5 years',
      daysAvailable: ['Fri', 'Sat', 'Sun'],
      performanceLocation: 'separate'
    },
    amenities: {
      powerAccess: true,
      airConditioning: false,
      wifi: true,
      kidFriendly: true,
      adultsOnly: false,
      parking: true,
      petFriendly: true,
      soundSystem: true,
      outdoorSpace: true,
      accessible: true,
      bnbOffered: false
    },
    housePhotos: [
      {
        id: 'barn1',
        url: 'https://images.unsplash.com/photo-1544264503-9fb1f3b91040?w=800',
        alt: 'Rustic barn exterior with countryside views',
        category: 'exterior' as const
      },
      {
        id: 'barn2',
        url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800',
        alt: 'Barn interior with exposed beams and stage area',
        category: 'house' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'barnperf1',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        alt: 'Concert setup in barn with stage and seating',
        category: 'performance_space' as const
      },
      {
        id: 'barnperf2',
        url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
        alt: 'Live performance with audience in barn',
        category: 'crowd' as const
      }
    ],
    rating: 4.7,
    reviewCount: 28,
    soundSystem: {
      available: true,
      description: 'Full professional sound system perfect for bands and solo acts. Our barn has been acoustically treated to provide excellent sound quality for audiences up to 100 people.',
      equipment: {
        speakers: 'JBL PRX815W powered speakers (4 units), JBL PRX818S subwoofers (2 units)',
        microphones: '8x Shure SM58 dynamic mics, 4x Shure SM57 instrument mics, 2x AKG C214 condenser mics',
        instruments: 'Full drum kit (Pearl Export), bass amp (Ampeg BA-210), guitar amps (Fender Twin, Marshall JCM800)',
        additional: 'DI boxes, monitor wedges, all necessary cables and stands, basic stage lighting'
      }
    },
    createdAt: new Date('2022-03-10'),
    updatedAt: new Date('2024-11-20')
  },
  {
    id: '3',
    userId: 'host3', 
    name: 'Urban Loft Sessions',
    bio: 'Modern downtown loft with city views. Perfect for indie and experimental artists. We keep it intimate with 15-20 people max and focus on creating a listening room atmosphere.',
    hostInfo: {
      hostName: 'Alex Chen',
      aboutMe: 'I\'m a sound engineer and music lover who transformed my loft into a dedicated listening space. I believe in creating an environment where experimental and indie artists can showcase their art without compromise. When I\'m not hosting, I\'m usually working on audio projects or discovering new music.',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    },
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    venueType: 'Loft/Warehouse',
    mapLocation: {
      displayLat: 45.5122308,  // Offset from real location for privacy
      displayLng: -122.6587185,
      city: 'Portland',
      state: 'OR',
      priceRange: '$8-15',
      searchKeywords: ['portland', 'oregon', 'loft', 'indie', 'experimental', 'listening room']
    },
    showSpecs: {
      avgAttendance: 18,
      avgDoorFee: 12,
      indoorAttendanceMax: 20,
      outdoorAttendanceMax: 0,
      showDurationMins: 75,
      showFormat: 'Listening room style',
      estimatedShowsPerYear: 6,
      hostingHistory: '1 year',
      daysAvailable: ['Thu', 'Fri', 'Sat'],
      performanceLocation: 'home'
    },
    amenities: {
      powerAccess: true,
      airConditioning: true,
      wifi: true,
      kidFriendly: false,
      adultsOnly: true,
      parking: false,
      petFriendly: false,
      soundSystem: false,
      outdoorSpace: false,
      accessible: true,
      bnbOffered: false
    },
    housePhotos: [
      {
        id: 'loft1',
        url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800',
        alt: 'Modern loft with city skyline views',
        category: 'house' as const
      },
      {
        id: 'loft2',
        url: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
        alt: 'Minimalist interior with large windows',
        category: 'house' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'loftperf1', 
        url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
        alt: 'Intimate listening room setup with ambient lighting',
        category: 'performance_space' as const
      }
    ],
    rating: 4.8,
    reviewCount: 7,
    createdAt: new Date('2023-08-22'),
    updatedAt: new Date('2024-12-05')
  },
  {
    id: '4',
    userId: 'host4',
    name: 'Sunset Terrace',
    bio: 'Beautiful rooftop venue with city skyline views. Perfect for evening concerts and sunset shows. We specialize in acoustic and jazz performances with a capacity for 40 people.',
    hostInfo: {
      hostName: 'Maria Rodriguez',
      aboutMe: 'Professional event coordinator turned house concert host. I love creating magical musical moments with stunning views. My rooftop has hosted over 50 concerts in the past 3 years.',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b4e0?w=400&h=400&fit=crop&crop=faces'
    },
    city: 'Los Angeles',
    state: 'CA',
    zip: '90210',
    venueType: 'Rooftop/Terrace',
    mapLocation: {
      displayLat: 34.0736204,
      displayLng: -118.4003563,
      city: 'Los Angeles',
      state: 'CA',
      priceRange: '$20-30',
      searchKeywords: ['los angeles', 'california', 'rooftop', 'sunset', 'jazz', 'acoustic']
    },
    showSpecs: {
      avgAttendance: 35,
      avgDoorFee: 25,
      indoorAttendanceMax: 0,
      outdoorAttendanceMax: 40,
      showDurationMins: 120,
      showFormat: 'Rooftop sunset concert',
      estimatedShowsPerYear: 15,
      hostingHistory: '3 years',
      daysAvailable: ['Thu', 'Fri', 'Sat', 'Sun'],
      performanceLocation: 'separate'
    },
    amenities: {
      powerAccess: true,
      airConditioning: false,
      wifi: true,
      kidFriendly: false,
      adultsOnly: true,
      parking: false,
      petFriendly: false,
      soundSystem: true,
      outdoorSpace: true,
      accessible: true,
      bnbOffered: false
    },
    housePhotos: [
      {
        id: 'terrace1',
        url: 'https://images.unsplash.com/photo-1519167758481-83f29ba5fe32?w=800',
        alt: 'Rooftop terrace with city skyline views',
        category: 'exterior' as const
      },
      {
        id: 'terrace2',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        alt: 'Sunset view from rooftop venue',
        category: 'exterior' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'terraceperf1',
        url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
        alt: 'Evening concert setup on rooftop',
        category: 'performance_space' as const
      }
    ],
    rating: 4.9,
    reviewCount: 22,
    createdAt: new Date('2022-05-15'),
    updatedAt: new Date('2024-11-28')
  },
  {
    id: '5',
    userId: 'host5',
    name: 'The Workshop Space',
    bio: 'Converted art studio in the heart of Brooklyn. Raw, industrial space perfect for experimental and indie artists. Excellent acoustics and a creative atmosphere that inspires both artists and audiences.',
    hostInfo: {
      hostName: 'David Kim',
      aboutMe: 'Former musician turned artist and venue curator. My space has been featured in several music blogs for its unique atmosphere. I focus on supporting emerging artists and experimental music.',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces'
    },
    city: 'Brooklyn',
    state: 'NY',
    zip: '11215',
    venueType: 'Studio/Workshop',
    mapLocation: {
      displayLat: 40.6892494,
      displayLng: -73.9442177,
      city: 'Brooklyn',
      state: 'NY',
      priceRange: '$15-25',
      searchKeywords: ['brooklyn', 'new york', 'studio', 'industrial', 'experimental', 'indie']
    },
    showSpecs: {
      avgAttendance: 30,
      avgDoorFee: 20,
      indoorAttendanceMax: 35,
      outdoorAttendanceMax: 0,
      showDurationMins: 100,
      showFormat: 'Industrial studio performance',
      estimatedShowsPerYear: 20,
      hostingHistory: '4 years',
      daysAvailable: ['Fri', 'Sat'],
      performanceLocation: 'separate'
    },
    amenities: {
      powerAccess: true,
      airConditioning: true,
      wifi: true,
      kidFriendly: false,
      adultsOnly: false,
      parking: false,
      petFriendly: true,
      soundSystem: true,
      outdoorSpace: false,
      accessible: false,
      bnbOffered: false
    },
    housePhotos: [
      {
        id: 'workshop1',
        url: 'https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=800',
        alt: 'Industrial workshop space interior',
        category: 'house' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'workshopperf1',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        alt: 'Concert setup in industrial space',
        category: 'performance_space' as const
      }
    ],
    rating: 4.6,
    reviewCount: 18,
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2024-12-02')
  },
  {
    id: '6',
    userId: 'host6',
    name: 'Mountain View Lodge',
    bio: 'Rustic cabin venue nestled in the Colorado mountains. Perfect for folk, bluegrass, and acoustic performances. Our great room features natural wood acoustics and a stone fireplace.',
    hostInfo: {
      hostName: 'Tom & Linda Wilson',
      aboutMe: 'Retired teachers who moved to the mountains to pursue our love of folk music. We\'ve been hosting intimate concerts for mountain communities and visiting artists for over 6 years.',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces'
    },
    city: 'Aspen',
    state: 'CO',
    zip: '81611',
    venueType: 'Cabin/Lodge',
    mapLocation: {
      displayLat: 39.1911,
      displayLng: -106.8175,
      city: 'Aspen',
      state: 'CO',
      priceRange: '$12-18',
      searchKeywords: ['aspen', 'colorado', 'mountain', 'cabin', 'folk', 'bluegrass']
    },
    showSpecs: {
      avgAttendance: 20,
      avgDoorFee: 15,
      indoorAttendanceMax: 25,
      outdoorAttendanceMax: 15,
      showDurationMins: 90,
      showFormat: 'Mountain cabin acoustic',
      estimatedShowsPerYear: 10,
      hostingHistory: '6 years',
      daysAvailable: ['Fri', 'Sat'],
      performanceLocation: 'home'
    },
    amenities: {
      powerAccess: true,
      airConditioning: false,
      wifi: false,
      kidFriendly: true,
      adultsOnly: false,
      parking: true,
      petFriendly: true,
      soundSystem: false,
      outdoorSpace: true,
      accessible: false,
      bnbOffered: true
    },
    housePhotos: [
      {
        id: 'lodge1',
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
        alt: 'Mountain cabin exterior with forest views',
        category: 'exterior' as const
      },
      {
        id: 'lodge2',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        alt: 'Cozy interior with stone fireplace',
        category: 'house' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'lodgeperf1',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        alt: 'Acoustic performance by fireplace',
        category: 'performance_space' as const
      }
    ],
    rating: 4.7,
    reviewCount: 14,
    createdAt: new Date('2022-08-20'),
    updatedAt: new Date('2024-11-15')
  },
  {
    id: '7',
    userId: 'host7',
    name: 'Coastal Sound House',
    bio: 'Beachfront home with panoramic ocean views. Specializes in intimate singer-songwriter sessions and beach acoustic performances. The sound of waves creates a unique natural backdrop.',
    hostInfo: {
      hostName: 'Jennifer & Chris Taylor',
      aboutMe: 'Ocean lovers and music enthusiasts. We moved to the coast specifically to create a unique venue where artists can perform with the ocean as their backdrop. Unforgettable sunset concerts!',
      profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces'
    },
    city: 'Santa Barbara',
    state: 'CA',
    zip: '93101',
    venueType: 'Beachfront Home',
    mapLocation: {
      displayLat: 34.4208305,
      displayLng: -119.6981901,
      city: 'Santa Barbara',
      state: 'CA',
      priceRange: '$18-28',
      searchKeywords: ['santa barbara', 'california', 'beach', 'ocean', 'acoustic', 'sunset']
    },
    showSpecs: {
      avgAttendance: 28,
      avgDoorFee: 22,
      indoorAttendanceMax: 30,
      outdoorAttendanceMax: 35,
      showDurationMins: 110,
      showFormat: 'Beachfront acoustic',
      estimatedShowsPerYear: 12,
      hostingHistory: '2 years',
      daysAvailable: ['Fri', 'Sat', 'Sun'],
      performanceLocation: 'home'
    },
    amenities: {
      powerAccess: true,
      airConditioning: true,
      wifi: true,
      kidFriendly: true,
      adultsOnly: false,
      parking: true,
      petFriendly: true,
      soundSystem: false,
      outdoorSpace: true,
      accessible: true,
      bnbOffered: true
    },
    housePhotos: [
      {
        id: 'coastal1',
        url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
        alt: 'Beachfront house with ocean views',
        category: 'exterior' as const
      },
      {
        id: 'coastal2',
        url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800',
        alt: 'Interior with ocean view windows',
        category: 'house' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'coastalperf1',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
        alt: 'Beach acoustic performance at sunset',
        category: 'performance_space' as const
      }
    ],
    rating: 4.8,
    reviewCount: 19,
    createdAt: new Date('2023-03-12'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '8',
    userId: 'host8',
    name: 'The Historic Parlor',
    bio: 'Beautifully restored Victorian home with original hardwood floors and vintage charm. Our parlor room provides intimate seating for classical, jazz, and chamber music performances.',
    hostInfo: {
      hostName: 'Margaret & Robert Sterling',
      aboutMe: 'Classical music enthusiasts and historic home preservationists. We restored this 1890s Victorian specifically to host classical and jazz performances in an authentic period setting.',
      profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=faces'
    },
    city: 'Charleston',
    state: 'SC',
    zip: '29401',
    venueType: 'Historic Home',
    mapLocation: {
      displayLat: 32.7876701,
      displayLng: -79.9402728,
      city: 'Charleston',
      state: 'SC',
      priceRange: '$15-25',
      searchKeywords: ['charleston', 'south carolina', 'historic', 'victorian', 'classical', 'jazz']
    },
    showSpecs: {
      avgAttendance: 22,
      avgDoorFee: 20,
      indoorAttendanceMax: 25,
      outdoorAttendanceMax: 0,
      showDurationMins: 85,
      showFormat: 'Historic parlor concert',
      estimatedShowsPerYear: 18,
      hostingHistory: '5 years',
      daysAvailable: ['Thu', 'Fri', 'Sat', 'Sun'],
      performanceLocation: 'home'
    },
    amenities: {
      powerAccess: true,
      airConditioning: true,
      wifi: true,
      kidFriendly: false,
      adultsOnly: true,
      parking: true,
      petFriendly: false,
      soundSystem: false,
      outdoorSpace: true,
      accessible: false,
      bnbOffered: false
    },
    housePhotos: [
      {
        id: 'parlor1',
        url: 'https://images.unsplash.com/photo-1505916349660-8d91a99c3e23?w=800',
        alt: 'Victorian parlor with period furnishings',
        category: 'house' as const
      },
      {
        id: 'parlor2',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
        alt: 'Historic home exterior',
        category: 'exterior' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'parlorperf1',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        alt: 'Classical performance in historic parlor',
        category: 'performance_space' as const
      }
    ],
    rating: 4.9,
    reviewCount: 25,
    createdAt: new Date('2022-02-14'),
    updatedAt: new Date('2024-11-22')
  },
  {
    id: '9',
    userId: 'host9',
    name: 'Desert Oasis Venue',
    bio: 'Unique desert property with outdoor amphitheater and stunning red rock views. Perfect for folk, country, and world music under the stars. Our natural acoustics are phenomenal.',
    hostInfo: {
      hostName: 'Carlos & Elena Vasquez',
      aboutMe: 'Desert dwellers and world music lovers. We built our amphitheater into the natural rock formations to create an otherworldly concert experience. Every show here is magical.',
      profilePhoto: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=faces'
    },
    city: 'Sedona',
    state: 'AZ',
    zip: '86336',
    venueType: 'Outdoor Amphitheater',
    mapLocation: {
      displayLat: 34.8697395,
      displayLng: -111.7609896,
      city: 'Sedona',
      state: 'AZ',
      priceRange: '$20-35',
      searchKeywords: ['sedona', 'arizona', 'desert', 'amphitheater', 'red rocks', 'world music']
    },
    showSpecs: {
      avgAttendance: 50,
      avgDoorFee: 28,
      indoorAttendanceMax: 0,
      outdoorAttendanceMax: 60,
      showDurationMins: 130,
      showFormat: 'Desert amphitheater',
      estimatedShowsPerYear: 25,
      hostingHistory: '3 years',
      daysAvailable: ['Fri', 'Sat'],
      performanceLocation: 'separate'
    },
    amenities: {
      powerAccess: true,
      airConditioning: false,
      wifi: false,
      kidFriendly: true,
      adultsOnly: false,
      parking: true,
      petFriendly: true,
      soundSystem: true,
      outdoorSpace: true,
      accessible: true,
      bnbOffered: true
    },
    housePhotos: [
      {
        id: 'desert1',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        alt: 'Desert amphitheater with red rock backdrop',
        category: 'exterior' as const
      },
      {
        id: 'desert2',
        url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800',
        alt: 'Natural rock formation seating',
        category: 'exterior' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'desertperf1',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        alt: 'Sunset concert in desert amphitheater',
        category: 'performance_space' as const
      }
    ],
    soundSystem: {
      available: true,
      description: 'Natural amphitheater acoustics enhanced with discrete sound reinforcement. Perfect for acoustic and world music performances under the desert sky.',
      equipment: {
        speakers: 'Bose L1 Pro32 portable systems (2 units), natural rock acoustics',
        microphones: '4x Shure SM58 wireless mics, 2x AKG acoustics mics',
        instruments: 'Basic acoustic setup, artists bring own instruments',
        additional: 'Wireless monitoring, desert-resistant equipment, battery backup systems'
      }
    },
    rating: 4.7,
    reviewCount: 31,
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2024-12-03')
  },
  {
    id: '10',
    userId: 'host10',
    name: 'Denver Arts Collective',
    bio: 'Urban arts space in RiNo district. Industrial aesthetic with great acoustics for indie and experimental shows.',
    hostInfo: {
      hostName: 'Marcus Chen',
      aboutMe: 'Local artist and venue curator. I believe in supporting underground music and creating unique performance experiences in our industrial space.',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces'
    },
    city: 'Denver',
    state: 'CO',
    zip: '80205',
    venueType: 'Loft/Warehouse',
    mapLocation: {
      displayLat: 39.7589,
      displayLng: -104.9847,
      city: 'Denver',
      state: 'CO',
      priceRange: '$15-25',
      searchKeywords: ['denver', 'colorado', 'rino', 'arts district', 'indie', 'experimental', 'urban']
    },
    showSpecs: {
      avgAttendance: 35,
      avgDoorFee: 20,
      indoorAttendanceMax: 45,
      outdoorAttendanceMax: 0,
      showDurationMins: 90,
      showFormat: 'Industrial space',
      estimatedShowsPerYear: 48,
      hostingHistory: '3 years',
      daysAvailable: ['Thu', 'Fri', 'Sat'],
      performanceLocation: 'separate'
    },
    amenities: {
      powerAccess: true,
      airConditioning: true,
      wifi: true,
      kidFriendly: false,
      adultsOnly: false,
      parking: true,
      petFriendly: true,
      soundSystem: true,
      outdoorSpace: false,
      accessible: true,
      bnbOffered: false
    },
    housePhotos: [
      {
        id: 'denver10_1',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: 'Industrial loft exterior',
        category: 'house' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'denver10_2',
        url: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800',
        alt: 'Performance space with exposed brick',
        category: 'performance' as const
      }
    ],
    rating: 4.8,
    reviewCount: 95,
    createdAt: new Date('2021-06-15'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: '11',
    userId: 'host11',
    name: 'Capitol Hill Haven',
    bio: 'Cozy home venue in historic Capitol Hill. Perfect for singer-songwriters and intimate acoustic sets.',
    hostInfo: {
      hostName: 'Rachel & Tom Martinez',
      aboutMe: 'Music-loving couple with a beautiful Victorian home. We host monthly shows and also offer lodging for traveling artists.',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces'
    },
    city: 'Denver',
    state: 'CO',
    zip: '80218',
    venueType: 'Home/Living Room',
    mapLocation: {
      displayLat: 39.7336,
      displayLng: -104.9785,
      city: 'Denver',
      state: 'CO',
      priceRange: '$10-15',
      searchKeywords: ['denver', 'colorado', 'capitol hill', 'living room', 'acoustic', 'intimate', 'lodging']
    },
    showSpecs: {
      avgAttendance: 20,
      avgDoorFee: 12,
      indoorAttendanceMax: 25,
      outdoorAttendanceMax: 20,
      showDurationMins: 75,
      showFormat: 'Living room',
      estimatedShowsPerYear: 12,
      hostingHistory: '2 years',
      daysAvailable: ['Fri', 'Sat', 'Sun'],
      performanceLocation: 'home'
    },
    amenities: {
      powerAccess: true,
      airConditioning: true,
      wifi: true,
      kidFriendly: true,
      adultsOnly: false,
      parking: true,
      petFriendly: false,
      soundSystem: false,
      outdoorSpace: true,
      accessible: false,
      bnbOffered: true
    },
    housePhotos: [
      {
        id: 'denver11_1',
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        alt: 'Victorian home exterior',
        category: 'house' as const
      }
    ],
    performanceSpacePhotos: [
      {
        id: 'denver11_2',
        url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800',
        alt: 'Living room performance space',
        category: 'performance' as const
      }
    ],
    rating: 4.9,
    reviewCount: 67,
    createdAt: new Date('2022-09-20'),
    updatedAt: new Date('2024-12-08')
  }
];





export const mockArtists = [
  {
    id: '1',
    userId: 'cmd7j6xr10002lu1fqxf46mw1', // Sarah Johnson's database user ID
    name: 'Sarah & The Wanderers',
    bio: 'Indie folk trio from Colorado with harmonious vocals and acoustic storytelling. We create intimate, emotional performances that connect deeply with audiences in living room settings.',
    yearsActive: 5,
    location: 'Denver, CO',
    genres: ['Folk', 'Indie', 'Acoustic'],
    instruments: ['Guitar', 'Mandolin', 'Bass', 'Vocals'],
    experienceLevel: 'intermediate' as const,
    members: [
      { name: 'Sarah Johnson', instrument: 'Guitar, Vocals' },
      { name: 'Mike Chen', instrument: 'Mandolin, Harmony' },
      { name: 'Lisa Rodriguez', instrument: 'Upright Bass' }
    ],
    tourMonthsPerYear: 6,
    tourVehicle: 'van',
    requireHomeStay: true,
    petAllergies: '',
    dietaryRestrictions: 'Vegetarian',
    travelWithAnimals: false,
    ownSoundSystem: false,
    socialLinks: {
      website: 'https://sarahandthewanderers.com',
      spotify: 'https://open.spotify.com/artist/sarahwanderers',
      facebook: '',
      instagram: '@sarahwanderers',
      x: '',
      youtube: 'https://youtube.com/sarahwanderers',
      patreon: ''
    },
    paymentLinks: {
      venmo: '@sarah-wanderers',
      paypal: 'sarah@sarahandthewanderers.com'
    },
    livePerformanceVideo: 'https://youtube.com/watch?v=example1',
    cancellationPolicy: 'flexible' as const,
    cancellationGuarantee: 'Will offer makeup show within 6 months if we need to cancel',
    rating: 4.8,
    reviewCount: 15,
    approved: true,
    performancePhotos: [
      {
        id: 'sarah_perf1',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        alt: 'Sarah & The Wanderers performing in intimate living room setting',
        category: 'performance' as const
      },
      {
        id: 'sarah_perf2',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        alt: 'Acoustic performance with audience engagement',
        category: 'performance' as const
      },
      {
        id: 'sarah_perf3',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
        alt: 'Band performing on outdoor stage',
        category: 'performance' as const
      }
    ],
    bandPhotos: [
      {
        id: 'sarah_band1',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        alt: 'Band portrait - Sarah, Mike, and Lisa with instruments',
        category: 'band' as const
      },
      {
        id: 'sarah_band2',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        alt: 'Candid backstage moment before show',
        category: 'band' as const
      }
    ],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2024-11-30')
  },
  {
    id: '2',
    userId: 'artist2',
    name: 'Tommy Blue',
    bio: 'Solo blues and country artist with 20+ years on the road. Powerful voice and masterful guitar work. Perfect for barn venues and outdoor shows with full band or acoustic solo sets.',
    yearsActive: 22,
    location: 'Nashville, TN',
    genres: ['Blues', 'Country', 'Rock'],
    instruments: ['Guitar', 'Harmonica', 'Vocals'],
    experienceLevel: 'professional' as const,
    members: [
      { name: 'Tommy Blue', instrument: 'Guitar, Vocals, Harmonica' }
    ],
    tourMonthsPerYear: 9,
    tourVehicle: 'RV',
    requireHomeStay: false,
    petAllergies: 'Cats',
    dietaryRestrictions: '',
    travelWithAnimals: true,
    ownSoundSystem: true,
    socialLinks: {
      website: 'https://tommybluemusic.com',
      spotify: 'https://open.spotify.com/artist/tommyblue',
      facebook: 'https://facebook.com/tommybluemusic',
      instagram: '@tommybluemusic',
      x: '@tommyblue',
      youtube: 'https://youtube.com/tommybluemusic',
      patreon: 'https://patreon.com/tommyblue'
    },
    paymentLinks: {
      venmo: '@tommy-blue',
      paypal: 'tommy@tommybluemusic.com'
    },
    livePerformanceVideo: 'https://youtube.com/watch?v=example2',
    cancellationPolicy: 'strict' as const,
    cancellationGuarantee: 'Full refund if cancelled more than 14 days in advance',
    rating: 4.9,
    reviewCount: 32,
    approved: true,
    performancePhotos: [
      {
        id: 'tommy_perf1',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        alt: 'Tommy Blue solo acoustic performance',
        category: 'performance' as const
      },
      {
        id: 'tommy_perf2',
        url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
        alt: 'Energetic blues performance with guitar',
        category: 'performance' as const
      },
      {
        id: 'tommy_perf3',
        url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
        alt: 'Tommy performing at outdoor festival',
        category: 'performance' as const
      }
    ],
    bandPhotos: [
      {
        id: 'tommy_band1',
        url: 'https://images.unsplash.com/photo-1601077700705-8ae13e0da8ac?w=800',
        alt: 'Tommy Blue with guitar and harmonica',
        category: 'band' as const
      }
    ],
    createdAt: new Date('2022-11-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '3',
    userId: 'artist3',
    name: 'Echo & Iris',
    bio: 'Experimental folk duo combining traditional instruments with electronic elements. We create atmospheric, genre-bending music perfect for listening room environments.',
    yearsActive: 3,
    location: 'Portland, OR',
    genres: ['Experimental', 'Electronic', 'Folk'],
    instruments: ['Vocals', 'Synth', 'Violin', 'Electronics'],
    experienceLevel: 'intermediate' as const,
    members: [
      { name: 'Echo Martinez', instrument: 'Vocals, Synth, Loop Pedals' },
      { name: 'Iris Kim', instrument: 'Violin, Electronics' }
    ],
    tourMonthsPerYear: 4,
    tourVehicle: 'car',
    requireHomeStay: true,
    petAllergies: '',
    dietaryRestrictions: 'Vegan',
    travelWithAnimals: false,
    ownSoundSystem: false,
    socialLinks: {
      website: 'https://echoandiris.bandcamp.com',
      spotify: 'https://open.spotify.com/artist/echoandiris',
      facebook: '',
      instagram: '@echoandiris',
      x: '',
      youtube: '',
      patreon: 'https://patreon.com/echoandiris'
    },
    paymentLinks: {
      venmo: '@echo-iris',
      paypal: 'music@echoandiris.com'
    },
    livePerformanceVideo: 'https://youtube.com/watch?v=example3',
    cancellationPolicy: 'flexible' as const,
    cancellationGuarantee: 'Will work with host to reschedule or find replacement artist',
    rating: 4.6,
    reviewCount: 8,
    approved: true,
    performancePhotos: [
      {
        id: 'echo_perf1',
        url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
        alt: 'Echo & Iris experimental performance with electronics',
        category: 'performance' as const
      },
      {
        id: 'echo_perf2',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
        alt: 'Atmospheric duo performance with violin and synth',
        category: 'performance' as const
      }
    ],
    bandPhotos: [
      {
        id: 'echo_band1',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
        alt: 'Echo and Iris duo portrait with instruments',
        category: 'band' as const
      }
    ],
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2024-12-03')
  },
  {
    id: '4',
    userId: 'artist4',
    name: 'The River Stones',
    bio: 'High-energy rock quartet bringing classic rock vibes to intimate venues. We specialize in turning living rooms into rock clubs with controlled volume and maximum energy.',
    yearsActive: 8,
    location: 'Seattle, WA',
    genres: ['Rock', 'Alternative', 'Indie Rock'],
    instruments: ['Electric Guitar', 'Bass', 'Drums', 'Vocals'],
    experienceLevel: 'professional' as const,
    members: [
      { name: 'Jack Morrison', instrument: 'Lead Vocals, Rhythm Guitar' },
      { name: 'Emma Stone', instrument: 'Lead Guitar' },
      { name: 'Marcus Wright', instrument: 'Bass' },
      { name: 'Alex Chen', instrument: 'Drums' }
    ],
    tourMonthsPerYear: 5,
    tourVehicle: 'van',
    requireHomeStay: false,
    petAllergies: '',
    dietaryRestrictions: 'Gluten-free options needed',
    travelWithAnimals: false,
    ownSoundSystem: true,
    socialLinks: {
      website: 'https://theriverstones.band',
      spotify: 'https://open.spotify.com/artist/theriverstones',
      facebook: 'https://facebook.com/riversstonesband',
      instagram: '@theriverstones',
      x: '@riverstones',
      youtube: 'https://youtube.com/theriverstones',
      patreon: ''
    },
    paymentLinks: {
      venmo: '@river-stones',
      paypal: 'booking@theriverstones.band'
    },
    livePerformanceVideo: 'https://youtube.com/watch?v=example4',
    cancellationPolicy: 'strict' as const,
    cancellationGuarantee: 'Full refund if cancelled 21+ days in advance',
    rating: 4.7,
    reviewCount: 19,
    approved: true,
    performancePhotos: [
      {
        id: 'river_perf1',
        url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
        alt: 'The River Stones rocking a house concert',
        category: 'performance' as const
      }
    ],
    bandPhotos: [
      {
        id: 'river_band1',
        url: 'https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?w=800',
        alt: 'The River Stones band portrait',
        category: 'band' as const
      }
    ],
    createdAt: new Date('2022-05-20'),
    updatedAt: new Date('2024-11-28')
  },
  {
    id: '5',
    userId: 'artist5',
    name: 'Luna Sonata',
    bio: 'Classical crossover pianist bringing concert hall elegance to intimate spaces. I blend classical masterpieces with modern compositions, creating accessible performances for all audiences.',
    yearsActive: 12,
    location: 'Boston, MA',
    genres: ['Classical', 'Contemporary Classical', 'Crossover'],
    instruments: ['Piano', 'Keyboard'],
    experienceLevel: 'professional' as const,
    members: [
      { name: 'Luna Chen', instrument: 'Piano' }
    ],
    tourMonthsPerYear: 7,
    tourVehicle: 'car',
    requireHomeStay: true,
    petAllergies: 'Dogs',
    dietaryRestrictions: '',
    travelWithAnimals: false,
    ownSoundSystem: false,
    socialLinks: {
      website: 'https://lunasonata.com',
      spotify: 'https://open.spotify.com/artist/lunasonata',
      facebook: 'https://facebook.com/lunasonatamusic',
      instagram: '@lunasonata',
      x: '',
      youtube: 'https://youtube.com/lunasonata',
      patreon: 'https://patreon.com/lunasonata'
    },
    paymentLinks: {
      venmo: '@luna-sonata',
      paypal: 'luna@lunasonata.com'
    },
    livePerformanceVideo: 'https://youtube.com/watch?v=example5',
    cancellationPolicy: 'flexible' as const,
    cancellationGuarantee: 'Will reschedule within 90 days if needed',
    rating: 5.0,
    reviewCount: 27,
    approved: true,
    performancePhotos: [
      {
        id: 'luna_perf1',
        url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800',
        alt: 'Luna performing piano in elegant living room',
        category: 'performance' as const
      }
    ],
    bandPhotos: [
      {
        id: 'luna_band1',
        url: 'https://images.unsplash.com/photo-1519683384663-1c29e5d45d01?w=800',
        alt: 'Luna Chen at grand piano',
        category: 'band' as const
      }
    ],
    createdAt: new Date('2021-09-15'),
    updatedAt: new Date('2024-12-02')
  },
  {
    id: '6',
    userId: 'artist6',
    name: 'Desert Highway',
    bio: 'Americana and roots rock trio from the Southwest. We bring desert sunsets and open road stories to every performance, perfect for outdoor venues and barn concerts.',
    yearsActive: 6,
    location: 'Tucson, AZ',
    genres: ['Americana', 'Country Rock', 'Folk Rock'],
    instruments: ['Guitar', 'Pedal Steel', 'Bass', 'Drums', 'Vocals'],
    experienceLevel: 'intermediate' as const,
    members: [
      { name: 'Diego Ramirez', instrument: 'Vocals, Acoustic Guitar' },
      { name: 'Katie Wells', instrument: 'Pedal Steel, Harmony Vocals' },
      { name: 'Sam Torres', instrument: 'Bass, Percussion' }
    ],
    tourMonthsPerYear: 8,
    tourVehicle: 'RV',
    requireHomeStay: false,
    petAllergies: '',
    dietaryRestrictions: '',
    travelWithAnimals: true,
    ownSoundSystem: true,
    socialLinks: {
      website: 'https://deserthighwayband.com',
      spotify: 'https://open.spotify.com/artist/deserthighway',
      facebook: '',
      instagram: '@deserthighwayband',
      x: '',
      youtube: 'https://youtube.com/deserthighway',
      patreon: ''
    },
    paymentLinks: {
      venmo: '@desert-highway',
      paypal: 'gigs@deserthighwayband.com'
    },
    livePerformanceVideo: 'https://youtube.com/watch?v=example6',
    cancellationPolicy: 'flexible' as const,
    cancellationGuarantee: 'Will offer virtual concert if unable to perform in person',
    rating: 4.5,
    reviewCount: 11,
    approved: true,
    performancePhotos: [
      {
        id: 'desert_perf1',
        url: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800',
        alt: 'Desert Highway performing at sunset',
        category: 'performance' as const
      }
    ],
    bandPhotos: [
      {
        id: 'desert_band1',
        url: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800',
        alt: 'Desert Highway trio with instruments',
        category: 'band' as const
      }
    ],
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-11-25')
  },
  {
    id: '7',
    userId: 'artist7',
    name: 'Mia & The Moonlight Jazz Quartet',
    bio: 'Sophisticated jazz ensemble specializing in intimate performances. From sultry standards to modern jazz fusion, we create the perfect ambiance for upscale house concerts.',
    yearsActive: 15,
    location: 'New Orleans, LA',
    genres: ['Jazz', 'Soul', 'R&B'],
    instruments: ['Vocals', 'Piano', 'Upright Bass', 'Drums', 'Saxophone'],
    experienceLevel: 'professional' as const,
    members: [
      { name: 'Mia Dubois', instrument: 'Lead Vocals' },
      { name: 'Jerome Baptiste', instrument: 'Piano' },
      { name: 'Marcus King', instrument: 'Upright Bass' },
      { name: 'Tony Chen', instrument: 'Drums' },
      { name: 'Sarah Mills', instrument: 'Saxophone' }
    ],
    tourMonthsPerYear: 4,
    tourVehicle: 'van',
    requireHomeStay: true,
    petAllergies: '',
    dietaryRestrictions: 'Pescatarian',
    travelWithAnimals: false,
    ownSoundSystem: false,
    socialLinks: {
      website: 'https://miamoonlightjazz.com',
      spotify: 'https://open.spotify.com/artist/miamoonlight',
      facebook: 'https://facebook.com/miamoonlightjazz',
      instagram: '@miamoonlightjazz',
      x: '@miajazz',
      youtube: '',
      patreon: ''
    },
    paymentLinks: {
      venmo: '@mia-moonlight',
      paypal: 'booking@miamoonlightjazz.com'
    },
    livePerformanceVideo: 'https://youtube.com/watch?v=example7',
    cancellationPolicy: 'strict' as const,
    cancellationGuarantee: '50% refund if cancelled 14+ days in advance',
    rating: 4.9,
    reviewCount: 34,
    approved: true,
    performancePhotos: [
      {
        id: 'mia_perf1',
        url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
        alt: 'Mia & The Moonlight Jazz Quartet in performance',
        category: 'performance' as const
      }
    ],
    bandPhotos: [
      {
        id: 'mia_band1',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        alt: 'Jazz quartet portrait',
        category: 'band' as const
      }
    ],
    createdAt: new Date('2020-11-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '8',
    userId: 'artist8',
    name: 'Celtic Storm',
    bio: 'Traditional and contemporary Celtic music with a modern twist. Fiddles, whistles, and powerful vocals bring the spirit of Ireland to American living rooms.',
    yearsActive: 10,
    location: 'Burlington, VT',
    genres: ['Celtic', 'Folk', 'World Music'],
    instruments: ['Fiddle', 'Tin Whistle', 'Bodhrán', 'Guitar', 'Vocals'],
    experienceLevel: 'professional' as const,
    members: [
      { name: 'Siobhan McCarthy', instrument: 'Fiddle, Vocals' },
      { name: 'Patrick O\'Brien', instrument: 'Tin Whistle, Uilleann Pipes' },
      { name: 'Colin Murphy', instrument: 'Guitar, Bouzouki' },
      { name: 'Aisling Doyle', instrument: 'Bodhrán, Percussion' }
    ],
    tourMonthsPerYear: 6,
    tourVehicle: 'van',
    requireHomeStay: true,
    petAllergies: 'Cats',
    dietaryRestrictions: 'Vegetarian options appreciated',
    travelWithAnimals: false,
    ownSoundSystem: false,
    socialLinks: {
      website: 'https://celticstormmusic.com',
      spotify: 'https://open.spotify.com/artist/celticstorm',
      facebook: 'https://facebook.com/celticstormband',
      instagram: '@celticstormmusic',
      x: '',
      youtube: 'https://youtube.com/celticstorm',
      patreon: 'https://patreon.com/celticstorm'
    },
    paymentLinks: {
      venmo: '@celtic-storm',
      paypal: 'info@celticstormmusic.com'
    },
    livePerformanceVideo: 'https://youtube.com/watch?v=example8',
    cancellationPolicy: 'flexible' as const,
    cancellationGuarantee: 'Will reschedule or provide substitute act from our network',
    rating: 4.8,
    reviewCount: 23,
    approved: true,
    performancePhotos: [
      {
        id: 'celtic_perf1',
        url: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800',
        alt: 'Celtic Storm energetic performance',
        category: 'performance' as const
      }
    ],
    bandPhotos: [
      {
        id: 'celtic_band1',
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
        alt: 'Celtic Storm band with traditional instruments',
        category: 'band' as const
      }
    ],
    createdAt: new Date('2021-03-15'),
    updatedAt: new Date('2024-11-30')
  },
  {
    id: '9',
    userId: 'artist9',
    name: 'The Velvet Underground Revival',
    bio: 'Psychedelic rock meets modern indie. We create immersive sonic experiences perfect for adventurous listeners who appreciate both vintage sounds and contemporary experimentation.',
    yearsActive: 4,
    location: 'Austin, TX',
    genres: ['Psychedelic Rock', 'Indie', 'Alternative'],
    instruments: ['Electric Guitar', 'Bass', 'Synth', 'Drums', 'Theremin'],
    experienceLevel: 'intermediate' as const,
    members: [
      { name: 'River Jones', instrument: 'Vocals, Guitar, Theremin' },
      { name: 'Sky Anderson', instrument: 'Bass, Synth' },
      { name: 'Phoenix Taylor', instrument: 'Drums, Percussion' }
    ],
    tourMonthsPerYear: 5,
    tourVehicle: 'van',
    requireHomeStay: false,
    petAllergies: '',
    dietaryRestrictions: 'Vegan',
    travelWithAnimals: false,
    ownSoundSystem: true,
    socialLinks: {
      website: 'https://velvetundergroundrevival.band',
      spotify: 'https://open.spotify.com/artist/velvetrevival',
      facebook: '',
      instagram: '@velvetrevival',
      x: '',
      youtube: 'https://youtube.com/velvetrevival',
      patreon: 'https://patreon.com/velvetrevival'
    },
    paymentLinks: {
      venmo: '@velvet-revival',
      paypal: 'booking@velvetundergroundrevival.band'
    },
    livePerformanceVideo: 'https://youtube.com/watch?v=example9',
    cancellationPolicy: 'flexible' as const,
    cancellationGuarantee: 'Full refund or reschedule within 60 days',
    rating: 4.4,
    reviewCount: 7,
    approved: true,
    performancePhotos: [
      {
        id: 'velvet_perf1',
        url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
        alt: 'Psychedelic performance with visual effects',
        category: 'performance' as const
      }
    ],
    bandPhotos: [
      {
        id: 'velvet_band1',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: 'The Velvet Underground Revival trio',
        category: 'band' as const
      }
    ],
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-12-05')
  }
];






// Dashboard Mock Data
export const mockBookings = [
  // Sarah & The Wanderers (artist1) upcoming shows
  {
    id: '1',
    artistId: 'artist1',
    hostId: 'host1',
    eventDate: new Date('2025-08-15T19:00:00'), // Changed to August
    status: 'approved' as const,
    guestCount: 25,
    createdAt: new Date('2025-07-01'),
    artist: {
      name: 'Sarah & The Wanderers',
      members: 3
    },
    host: {
      name: 'The Garden House',
      city: 'Austin',
      state: 'TX'
    }
  },
  {
    id: '2',
    artistId: 'artist1',
    hostId: 'host2',
    eventDate: new Date('2025-09-22T20:00:00'), // Changed to September
    status: 'approved' as const,
    guestCount: 45,
    createdAt: new Date('2025-07-01'),
    artist: {
      name: 'Sarah & The Wanderers', 
      members: 3
    },
    host: {
      name: 'Riverside Barn',
      city: 'Nashville',
      state: 'TN'
    }
  },
  {
    id: '3',
    artistId: 'artist2',
    hostId: 'host1',
    eventDate: new Date('2025-10-10T19:30:00'), // Changed to October
    status: 'requested' as const,
    guestCount: 30,
    createdAt: new Date('2025-07-05'),
    artist: {
      name: 'Tommy Blue',
      members: 1
    },
    host: {
      name: 'The Garden House',
      city: 'Austin',
      state: 'TX'
    }
  },
  {
    id: '4',
    artistId: 'artist1',
    hostId: 'host3',
    eventDate: new Date('2025-11-15T19:00:00'), // Changed to November
    status: 'pending' as const,
    guestCount: 18,
    createdAt: new Date('2025-07-06'),
    artist: {
      name: 'Sarah & The Wanderers',
      members: 3
    },
    host: {
      name: 'Urban Loft Sessions',
      city: 'Portland',
      state: 'OR'
    }
  },
  // Additional concerts for fan discovery
  {
    id: '5',
    artistId: 'artist2',
    hostId: 'host1',
    eventDate: new Date('2025-08-22T20:00:00'),
    status: 'approved' as const,
    guestCount: 30,
    createdAt: new Date('2025-07-10'),
    artist: {
      name: 'Tommy Blue',
      members: 1
    },
    host: {
      name: 'The Garden House',
      city: 'Austin',
      state: 'TX'
    }
  },
  {
    id: '6',
    artistId: 'artist3',
    hostId: 'host2',
    eventDate: new Date('2025-09-05T19:30:00'),
    status: 'approved' as const,
    guestCount: 50,
    createdAt: new Date('2025-07-08'),
    artist: {
      name: 'Echo & Iris',
      members: 2
    },
    host: {
      name: 'Riverside Barn',
      city: 'Nashville',
      state: 'TN'
    }
  },
  {
    id: '7',
    artistId: 'artist1',
    hostId: 'host2',
    eventDate: new Date('2025-07-30T19:00:00'),
    status: 'approved' as const,
    guestCount: 45,
    createdAt: new Date('2025-07-12'),
    artist: {
      name: 'Sarah & The Wanderers',
      members: 3
    },
    host: {
      name: 'Riverside Barn',
      city: 'Nashville',
      state: 'TN'
    }
  },
  // Past concerts for fan review testing
  {
    id: '8',
    artistId: 'artist2',
    hostId: 'host2',
    eventDate: new Date('2025-01-10T20:00:00'),
    status: 'approved' as const,
    guestCount: 55,
    createdAt: new Date('2024-12-15'),
    artist: {
      name: 'Tommy Blue',
      members: 1
    },
    host: {
      name: 'Riverside Barn',
      city: 'Nashville',
      state: 'TN'
    }
  },
  {
    id: '9',
    artistId: 'artist3',
    hostId: 'host3',
    eventDate: new Date('2025-01-05T19:30:00'),
    status: 'approved' as const,
    guestCount: 15,
    createdAt: new Date('2024-12-20'),
    artist: {
      name: 'Echo & Iris',
      members: 2
    },
    host: {
      name: 'Urban Loft Sessions',
      city: 'Portland',
      state: 'OR'
    }
  },
  // Additional bookings for new artists and hosts
  {
    id: '10',
    artistId: 'artist4',
    hostId: 'host4',
    eventDate: new Date('2025-08-28T20:00:00'),
    status: 'approved' as const,
    guestCount: 35,
    createdAt: new Date('2025-07-18'),
    artist: {
      name: 'The River Stones',
      members: 4
    },
    host: {
      name: 'Sunset Terrace',
      city: 'Los Angeles',
      state: 'CA'
    }
  },
  {
    id: '11',
    artistId: 'artist5',
    hostId: 'host9',
    eventDate: new Date('2025-09-12T19:30:00'),
    status: 'approved' as const,
    guestCount: 45,
    createdAt: new Date('2025-07-20'),
    artist: {
      name: 'Luna Sonata',
      members: 1
    },
    host: {
      name: 'Desert Oasis Venue',
      city: 'Sedona',
      state: 'AZ'
    }
  },
  {
    id: '12',
    artistId: 'artist6',
    hostId: 'host7',
    eventDate: new Date('2025-09-20T18:00:00'),
    status: 'requested' as const,
    guestCount: 22,
    createdAt: new Date('2025-07-21'),
    artist: {
      name: 'Desert Highway',
      members: 3
    },
    host: {
      name: 'Coastal Sound House',
      city: 'Santa Barbara',
      state: 'CA'
    }
  },
  {
    id: '13',
    artistId: 'artist7',
    hostId: 'host5',
    eventDate: new Date('2025-10-03T20:30:00'),
    status: 'approved' as const,
    guestCount: 35,
    createdAt: new Date('2025-07-22'),
    artist: {
      name: 'Mia & The Moonlight Jazz Quartet',
      members: 5
    },
    host: {
      name: 'The Workshop Space',
      city: 'Brooklyn',
      state: 'NY'
    }
  },
  {
    id: '14',
    artistId: 'artist8',
    hostId: 'host6',
    eventDate: new Date('2025-10-15T19:00:00'),
    status: 'pending' as const,
    guestCount: 20,
    createdAt: new Date('2025-07-23'),
    artist: {
      name: 'Celtic Storm',
      members: 4
    },
    host: {
      name: 'Mountain View Lodge',
      city: 'Boulder',
      state: 'CO'
    }
  },
  {
    id: '15',
    artistId: 'artist9',
    hostId: 'host3',
    eventDate: new Date('2025-10-25T21:00:00'),
    status: 'approved' as const,
    guestCount: 18,
    createdAt: new Date('2025-07-24'),
    artist: {
      name: 'The Velvet Underground Revival',
      members: 3
    },
    host: {
      name: 'Urban Loft Sessions',
      city: 'Portland',
      state: 'OR'
    }
  },
  {
    id: '16',
    artistId: 'artist1',
    hostId: 'host8',
    eventDate: new Date('2025-12-15T19:00:00'),
    status: 'approved' as const,
    guestCount: 28,
    createdAt: new Date('2025-07-25'),
    artist: {
      name: 'Sarah & The Wanderers',
      members: 3
    },
    host: {
      name: 'The Historic Parlor',
      city: 'Charleston',
      state: 'SC'
    }
  },
  {
    id: '17',
    artistId: 'artist5',
    hostId: 'host1',
    eventDate: new Date('2025-12-21T19:30:00'),
    status: 'requested' as const,
    guestCount: 25,
    createdAt: new Date('2025-07-26'),
    artist: {
      name: 'Luna Sonata',
      members: 1
    },
    host: {
      name: 'The Garden House',
      city: 'Austin',
      state: 'TX'
    }
  },
  {
    id: '18',
    artistId: 'artist7',
    hostId: 'host4',
    eventDate: new Date('2025-12-31T21:00:00'),
    status: 'approved' as const,
    guestCount: 40,
    createdAt: new Date('2025-07-27'),
    artist: {
      name: 'Mia & The Moonlight Jazz Quartet',
      members: 5
    },
    host: {
      name: 'Sunset Terrace',
      city: 'Los Angeles',
      state: 'CA'
    }
  }
];

export const mockMessages = [
  {
    id: '1',
    senderId: 'artist1',
    senderName: 'Sarah Johnson',
    recipientId: 'host1', 
    bookingId: '1',
    content: 'Hi! We\'re so excited for the show on Feb 15th. Just wanted to confirm the sound setup - we have acoustic guitars and will need basic mics. Looking forward to it!',
    timestamp: new Date('2025-01-13T14:30:00'),
    read: false
  },
  {
    id: '2',
    senderId: 'host2',
    senderName: 'Riverside Barn',
    recipientId: 'artist2',
    bookingId: '2',
    content: 'Thanks for your booking request! I\'d love to host you. Could you tell me more about your sound requirements? We have a full PA system available.',
    timestamp: new Date('2025-01-12T16:45:00'),
    read: true
  },
  {
    id: '3',
    senderId: 'artist3',
    senderName: 'Echo Martinez',
    recipientId: 'host3',
    bookingId: '3',
    content: 'Hello! We submitted a request for March 5th. We love the intimate vibe of your space. Our setup is pretty minimal - just need power for our electronics. Hope to hear from you soon!',
    timestamp: new Date('2025-01-13T09:15:00'),
    read: false
  },
  {
    id: '4',
    senderId: 'artist4',
    senderName: 'Jack Morrison',
    recipientId: 'host4',
    bookingId: '10',
    content: 'Hey! The River Stones are excited about the rooftop show. Can we do a soundcheck at 6pm? We\'ll keep the volume reasonable for the neighbors.',
    timestamp: new Date('2025-07-18T11:00:00'),
    read: true
  },
  {
    id: '5',
    senderId: 'host9',
    senderName: 'Desert Oasis Venue',
    recipientId: 'artist5',
    bookingId: '11',
    content: 'Luna, we\'re thrilled to have you perform in our amphitheater! The acoustics are perfect for piano. September skies should be beautiful.',
    timestamp: new Date('2025-07-20T15:30:00'),
    read: true
  },
  {
    id: '6',
    senderId: 'artist7',
    senderName: 'Mia Dubois',
    recipientId: 'host5',
    bookingId: '13',
    content: 'Looking forward to bringing jazz to Brooklyn! Our quartet will arrive around 7pm for setup. Do you have a house piano or should we bring a keyboard?',
    timestamp: new Date('2025-07-22T18:45:00'),
    read: false
  }
];

export const mockNotifications = [
  {
    id: '1',
    userId: 'host1',
    type: 'booking_approved' as const,
    title: 'Booking Confirmed!',
    message: 'Sarah & The Wanderers confirmed for Feb 15th',
    timestamp: new Date('2025-01-12T10:00:00'),
    read: false
  },
  {
    id: '2', 
    userId: 'artist1',
    type: 'new_message' as const,
    title: 'New Message',
    message: 'The Garden House sent you a message',
    timestamp: new Date('2025-01-13T14:30:00'),
    read: false
  },
  {
    id: '3',
    userId: 'host2',
    type: 'booking_request' as const,
    title: 'New Booking Request',
    message: 'Tommy Blue wants to book Jan 25th',
    timestamp: new Date('2025-01-08T11:20:00'),
    read: true
  }
];

// Fan RSVPs
export const mockRSVPs = [
  {
    id: 'rsvp-1',
    concertId: 'concert1',
    fanId: 'fan1',
    fanName: 'Jessica Chen',
    guestCount: 2,
    submittedAt: '2025-07-14T10:30:00Z',
    status: 'confirmed' as const
  },
  {
    id: 'rsvp-2',
    concertId: 'concert2',
    fanId: 'fan2',
    fanName: 'David Rodriguez',
    guestCount: 1,
    submittedAt: '2025-07-13T14:20:00Z',
    status: 'confirmed' as const
  },
  {
    id: 'rsvp-3',
    concertId: 'concert1',
    fanId: 'fan3',
    fanName: 'Emma Thompson',
    guestCount: 3,
    submittedAt: '2025-07-12T09:15:00Z',
    status: 'confirmed' as const
  }
];

// Fan Concert Reviews
export const mockFanConcertReviews = [
  {
    id: 'review-1',
    concertId: '1',
    fanId: 'fan1',
    artistId: 'artist1',
    hostId: 'host1',
    artistRating: 5,
    hostRating: 4,
    overallRating: 5,
    artistFeedback: 'Sarah & The Wanderers delivered an absolutely magical performance! Their harmonies were perfect and the acoustic arrangements were beautiful. The setlist was well-curated and Sarah\'s storytelling between songs really connected with the audience.',
    hostFeedback: 'The Garden House was the perfect venue for this intimate show. The living room setting made it feel like a private concert with friends. The hosts were incredibly welcoming and the atmosphere was cozy and warm.',
    overallFeedback: 'This was one of the best concert experiences I\'ve had. The combination of incredible music in such an intimate setting created something truly special. You could feel the connection between the artists and the audience throughout the entire show. I left feeling inspired and grateful for discovering this amazing community.',
    isPublic: true,
    attendedDate: '2025-01-15T19:00:00',
    wouldRecommend: true,
    createdAt: '2025-01-16T10:30:00'
  },
  {
    id: 'review-2',
    concertId: '2',
    fanId: 'fan1',
    artistId: 'artist2',
    hostId: 'host2',
    artistRating: 4,
    hostRating: 5,
    overallRating: 4,
    artistFeedback: 'Tommy Blue brought such great energy to the barn! His folk-rock sound was perfect for the space and the crowd was really into it. A few technical hiccups with the sound system but overall a solid performance.',
    hostFeedback: 'Jake\'s barn is an incredible venue for live music. The acoustics are fantastic and the rustic atmosphere adds so much to the experience. The host was super friendly and made sure everyone felt welcome.',
    overallFeedback: 'Had a wonderful time at this show. The barn setting was unique and the music was great. There\'s something special about hearing live music in these intimate spaces that you just can\'t get at bigger venues. Will definitely be back for more shows here.',
    isPublic: true,
    attendedDate: '2025-01-10T20:00:00',
    wouldRecommend: true,
    createdAt: '2025-01-11T09:15:00'
  },
  {
    id: 'review-3',
    concertId: '3',
    fanId: 'fan1',
    artistId: 'artist3',
    hostId: 'host3',
    artistRating: 3,
    hostRating: 4,
    overallRating: 3,
    artistFeedback: 'The performance was decent but felt a bit rushed. The artist seemed nervous and didn\'t interact much with the audience. The music itself was good though.',
    hostFeedback: '',
    overallFeedback: 'It was okay. Not the best show I\'ve been to but still glad I went. The venue was nice and the other attendees were friendly. Sometimes these intimate shows are hit or miss.',
    isPublic: false,
    attendedDate: '2025-01-05T19:30:00',
    wouldRecommend: false,
    createdAt: '2025-01-06T14:20:00'
  }
];