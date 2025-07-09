export const mockHosts = [
  {
    id: '1',
    userId: 'host1',
    name: 'The Garden House',
    bio: 'Cozy living room with a piano and fireplace. We love hosting intimate acoustic shows for 20-30 people. Our home has a warm, welcoming atmosphere perfect for singer-songwriters and small bands.',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
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
    city: 'Nashville',
    state: 'TN',
    zip: '37201',
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
    createdAt: new Date('2022-03-10'),
    updatedAt: new Date('2024-11-20')
  },
  {
    id: '3',
    userId: 'host3', 
    name: 'Urban Loft Sessions',
    bio: 'Modern downtown loft with city views. Perfect for indie and experimental artists. We keep it intimate with 15-20 people max and focus on creating a listening room atmosphere.',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
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
  }
];





export const mockArtists = [
  {
    id: '1',
    userId: 'artist1',
    name: 'Sarah & The Wanderers',
    bio: 'Indie folk trio from Colorado with harmonious vocals and acoustic storytelling. We create intimate, emotional performances that connect deeply with audiences in living room settings.',
    yearsActive: 5,
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
        url: 'https://images.unsplash.com/photo-1551847404-9e05c30b1204?w=800',
        alt: 'Band portrait - Sarah, Mike, and Lisa with instruments',
        category: 'band' as const
      },
      {
        id: 'sarah_band2',
        url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
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
        url: 'https://images.unsplash.com/photo-1551847404-9e05c30b1204?w=800',
        alt: 'Echo and Iris duo portrait with instruments',
        category: 'band' as const
      }
    ],
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2024-12-03')
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