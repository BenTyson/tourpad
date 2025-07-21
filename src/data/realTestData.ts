// Comprehensive realistic test data for TourPad
// This replaces mockData.ts with more detailed, realistic data for testing

export interface Artist {
  id: string;
  name: string;
  email: string;
  type: 'artist';
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  bio: string;
  genres: string[];
  instruments: string[];
  location: {
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  experienceLevel: 'beginner' | 'intermediate' | 'professional';
  yearsActive: number;
  tourMonthsPerYear: number;
  performanceHistory: string;
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
  rating: number;
  reviewCount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'overdue';
  subscriptionExpiry: string;
  website?: string;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    bandcamp?: string;
  };
  media: {
    id: string;
    url: string;
    type: 'image' | 'video' | 'audio';
    category: string;
    title: string;
  }[];
  upcomingShows: number;
  lastActive: string;
  joinedDate: string;
}

export interface Host {
  id: string;
  name: string;
  email: string;
  type: 'host';
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  bio: string;
  venueName: string;
  venueType: 'home' | 'studio' | 'backyard' | 'loft' | 'other';
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  capacity: {
    indoor: number;
    outdoor?: number;
    preferred: number;
  };
  amenities: string[];
  showSpecs: {
    avgAttendance: number;
    avgDoorFee: number;
    indoorAttendanceMax: number;
    hostingHistory: string;
    preferredGenres: string[];
  };
  soundSystem?: {
    available: boolean;
    description: string;
    equipment: {
      speakers: string;
      microphones: string;
      instruments: string;
      additional: string;
    };
  };
  availability: {
    daysOfWeek: number[];
    timeSlots: string[];
    blackoutDates?: string[];
  };
  rating: number;
  reviewCount: number;
  totalShows: number;
  media: {
    id: string;
    url: string;
    type: 'image' | 'video';
    category: 'exterior' | 'interior' | 'performance_space' | 'amenities' | 'setup';
    title: string;
    description?: string;
  }[];
  lastActive: string;
  joinedDate: string;
}

export interface Fan {
  id: string;
  name: string;
  email: string;
  type: 'fan';
  status: 'active' | 'payment_expired' | 'suspended';
  bio?: string;
  location: {
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  musicPreferences: {
    favoriteGenres: string[];
    concertFrequency: 'weekly' | 'monthly' | 'few-times-year' | 'rarely';
    preferredVenueSize: 'intimate' | 'small' | 'any';
    willingToTravel: number; // miles
  };
  paymentStatus: 'active' | 'expired' | 'failed' | 'cancelled';
  subscriptionExpiry: string;
  attendanceHistory: {
    concertId: string;
    artistName: string;
    venueName: string;
    date: string;
    rating?: number;
    review?: string;
  }[];
  upcomingReservations: string[]; // concert IDs
  favoriteArtists: string[]; // artist IDs
  favoriteVenues: string[]; // host IDs
  communicationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    newConcertAlerts: boolean;
    favoriteArtistAlerts: boolean;
  };
  joinedDate: string;
  lastActive: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  type: 'admin';
  role: 'super_admin' | 'moderator' | 'support';
  permissions: string[];
  lastLogin: string;
  activityLog: {
    action: string;
    timestamp: string;
    details: string;
  }[];
}

export interface Booking {
  id: string;
  artistId: string;
  hostId: string;
  artist: Artist;
  host: Host;
  eventDate: string;
  duration: number;
  status: 'pending' | 'approved' | 'cancelled' | 'completed';
  proposedBy: 'artist' | 'host';
  message: string;
  specialRequirements?: string;
  attendeeCount?: number;
  doorFee?: number;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    from: string;
    message: string;
    timestamp: string;
  }[];
}

export interface Concert {
  id: string;
  artistId: string;
  hostId: string;
  artist: Artist;
  host: Host;
  title: string;
  description: string;
  date: string;
  startTime: string;
  duration: number; // minutes
  genres: string[];
  capacity: number;
  ticketPrice: number;
  status: 'upcoming' | 'sold_out' | 'cancelled' | 'completed';
  attendees: string[]; // fan IDs
  waitlist: string[]; // fan IDs
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  user: Artist | Host;
  type: 'artist' | 'host';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  data: any;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerType: 'artist' | 'host';
  reviewedId: string;
  reviewedType: 'artist' | 'host';
  rating: number; // 1-5 stars
  feedback: string;
  isPublic: boolean;
  showDate: string;
  venueName?: string;
  artistName?: string;
  createdAt: string;
  helpfulVotes?: number;
  response?: {
    text: string;
    createdAt: string;
  };
}

// Realistic Artists
export const testArtists: Artist[] = [
  {
    id: 'artist1',
    name: 'Sarah Johnson',
    email: 'sarah.artist@email.com',
    type: 'artist',
    status: 'approved',
    bio: 'Sarah is a singer-songwriter from Austin who blends folk melodies with contemporary indie sounds. Her introspective lyrics and warm vocals create intimate performances perfect for house concerts.',
    genres: ['Folk', 'Indie', 'Singer-Songwriter'],
    instruments: ['Guitar', 'Piano', 'Vocals'],
    location: {
      city: 'Austin',
      state: 'TX',
      coordinates: { lat: 30.2672, lng: -97.7431 }
    },
    experienceLevel: 'professional',
    yearsActive: 8,
    tourMonthsPerYear: 6,
    performanceHistory: 'Over 200 house concerts across Texas and the Southwest. Regular performer at local venues including The Saxon Pub and Antones. Released three independent albums.',
    cancellationPolicy: 'flexible',
    rating: 4.8,
    reviewCount: 47,
    paymentStatus: 'paid',
    subscriptionExpiry: '2025-12-15',
    website: 'https://sarahmusic.com',
    socialLinks: {
      instagram: 'https://instagram.com/sarahjohnsonmusic',
      youtube: 'https://youtube.com/sarahjohnsonmusic',
      spotify: 'https://open.spotify.com/artist/sarahjohnson'
    },
    media: [
      {
        id: 'media1',
        url: 'https://picsum.photos/800/600?random=1',
        type: 'image',
        category: 'promotional',
        title: 'Studio Portrait'
      },
      {
        id: 'media2',
        url: 'https://picsum.photos/800/600?random=2',
        type: 'image',
        category: 'live_performance',
        title: 'House Concert in Dallas'
      }
    ],
    upcomingShows: 8,
    lastActive: '2024-01-22T15:30:00Z',
    joinedDate: '2023-03-15T10:00:00Z'
  },
  {
    id: 'artist2',
    name: 'Marcus Williams',
    email: 'marcus.artist@email.com',
    type: 'artist',
    status: 'approved',
    bio: 'Marcus brings soulful blues and jazz to intimate settings. His mastery of multiple instruments and rich vocal style creates captivating performances that transport audiences.',
    genres: ['Blues', 'Jazz', 'Soul'],
    instruments: ['Guitar', 'Harmonica', 'Piano', 'Vocals'],
    location: {
      city: 'Nashville',
      state: 'TN',
      coordinates: { lat: 36.1627, lng: -86.7816 }
    },
    experienceLevel: 'professional',
    yearsActive: 12,
    tourMonthsPerYear: 9,
    performanceHistory: 'Veteran of the Nashville music scene with over 300 performances. Former member of touring band "Midnight Express". Multiple award winner at Nashville music festivals.',
    cancellationPolicy: 'moderate',
    rating: 4.9,
    reviewCount: 73,
    paymentStatus: 'paid',
    subscriptionExpiry: '2025-08-20',
    socialLinks: {
      instagram: 'https://instagram.com/marcuswilliamsblues',
      youtube: 'https://youtube.com/marcuswilliamsmusic'
    },
    media: [
      {
        id: 'media3',
        url: 'https://picsum.photos/800/600?random=3',
        type: 'image',
        category: 'promotional',
        title: 'Blues Performance'
      }
    ],
    upcomingShows: 12,
    lastActive: '2024-01-21T18:45:00Z',
    joinedDate: '2023-01-10T14:20:00Z'
  },
  {
    id: 'artist3',
    name: 'Emma Rodriguez',
    email: 'emma.artist@email.com',
    type: 'artist',
    status: 'pending',
    bio: 'Emerging indie-pop artist with a unique bilingual style. Emma combines English and Spanish lyrics with catchy melodies and electronic elements.',
    genres: ['Indie Pop', 'Electronic', 'Latin'],
    instruments: ['Vocals', 'Synthesizer', 'Guitar'],
    location: {
      city: 'Los Angeles',
      state: 'CA',
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    experienceLevel: 'intermediate',
    yearsActive: 3,
    tourMonthsPerYear: 4,
    performanceHistory: 'Rising artist with 50+ local performances. Featured in LA music blogs and college radio stations. Recently completed first EP.',
    cancellationPolicy: 'flexible',
    rating: 4.6,
    reviewCount: 18,
    paymentStatus: 'paid',
    subscriptionExpiry: '2025-11-01',
    socialLinks: {
      instagram: 'https://instagram.com/emmarodriguezmusic',
      spotify: 'https://open.spotify.com/artist/emmarodriguez'
    },
    media: [],
    upcomingShows: 5,
    lastActive: '2024-01-20T12:15:00Z',
    joinedDate: '2023-10-05T09:30:00Z'
  }
];

// Realistic Hosts
export const testHosts: Host[] = [
  {
    id: 'host1',
    name: 'Mike Wilson',
    email: 'mike.host@email.com',
    type: 'host',
    status: 'approved',
    bio: 'Mike hosts intimate concerts in his beautifully renovated 1920s home in East Nashville. The living room provides perfect acoustics and a cozy atmosphere for up to 35 guests.',
    venueName: 'The Wilson House',
    venueType: 'home',
    location: {
      address: '1234 Woodland Ave',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37206',
      coordinates: { lat: 36.1627, lng: -86.7816 }
    },
    capacity: {
      indoor: 35,
      preferred: 25
    },
    amenities: ['Full Kitchen', 'Parking', 'Sound System', 'Piano', 'Restrooms', 'WiFi'],
    showSpecs: {
      avgAttendance: 28,
      avgDoorFee: 20,
      indoorAttendanceMax: 35,
      hostingHistory: '3+ years hosting',
      preferredGenres: ['Folk', 'Indie', 'Singer-Songwriter', 'Acoustic']
    },
    availability: {
      daysOfWeek: [5, 6], // Friday, Saturday
      timeSlots: ['7:00 PM', '8:00 PM'],
      blackoutDates: ['2024-12-25', '2024-01-01']
    },
    rating: 4.9,
    reviewCount: 42,
    totalShows: 68,
    media: [
      {
        id: 'hostmedia1',
        url: 'https://picsum.photos/800/600?random=10',
        type: 'image',
        category: 'exterior',
        title: 'Front entrance and garden',
        description: 'Welcoming entrance with street parking available'
      },
      {
        id: 'hostmedia2',
        url: 'https://picsum.photos/800/600?random=11',
        type: 'image',
        category: 'performance_space',
        title: 'Main performance room',
        description: 'Intimate living room with excellent acoustics'
      }
    ],
    soundSystem: {
      available: true,
      description: 'Professional-grade sound system perfect for intimate acoustic performances. The system has been optimized for the acoustics of our 1920s home.',
      equipment: {
        speakers: 'Pair of Yamaha HS8 studio monitors, JBL EON615 mains for larger events',
        microphones: '2x Shure SM58 dynamic mics, 1x Audio-Technica AT2020 condenser mic with stand',
        instruments: 'Yamaha P-45 digital piano, acoustic guitar DI available',
        additional: 'XLR and 1/4" cables, mic stands, basic lighting for performance area'
      }
    },
    // New lodging system fields
    hostingCapabilities: {
      showHosting: {
        enabled: true // This host can host shows
      },
      lodgingHosting: {
        enabled: true,
        lodgingDetails: {
          roomType: 'private_bedroom',
          bathroomType: 'private',
          bedConfiguration: {
            beds: [
              { type: 'queen', quantity: 1 }
            ],
            maxOccupancy: 2
          },
          amenities: {
            breakfast: true,
            breakfastType: 'full',
            wifi: true,
            parking: true,
            laundry: false,
            kitchenAccess: true,
            workspace: true,
            linensProvided: true,
            towelsProvided: true,
            transportation: 'nearby_public'
          },
          houseRules: {
            checkInTime: '4:00 PM',
            checkOutTime: '11:00 AM',
            quietHours: { start: '10:00 PM', end: '8:00 AM' },
            smokingPolicy: 'no_smoking',
            petPolicy: 'no_pets',
            alcoholPolicy: 'allowed'
          },
          pricing: {
            baseRate: 85,
            additionalGuestFee: 20,
            cleaningFee: 25
          },
          availability: {
            blackoutDates: ['2024-12-25', '2024-01-01'],
            minimumStay: 1,
            maximumStay: 7,
            advanceBookingRequired: 2
          },
          lodgingPhotos: [
            {
              id: 'lodging1-bed1',
              url: 'https://picsum.photos/800/600?random=20',
              category: 'bedroom',
              title: 'Private Guest Room',
              description: 'Comfortable queen bed with workspace',
              isRequired: true
            },
            {
              id: 'lodging1-bath1',
              url: 'https://picsum.photos/800/600?random=21',
              category: 'bathroom',
              title: 'Private Bathroom',
              description: 'Private full bathroom with shower',
              isRequired: true
            }
          ],
          accessibility: [],
          specialConsiderations: 'Perfect for artists performing at The Wilson House. Private entrance and quiet environment for rest before/after shows.',
          localRecommendations: 'Easy access to Music Row and downtown Nashville. Great local restaurants within walking distance.',
          safetyFeatures: ['Smoke detectors', 'Carbon monoxide detector', 'Security system', 'Well-lit parking', 'Emergency contacts']
        }
      }
    },
    primaryHostType: 'hybrid',
    lastActive: '2024-01-22T20:00:00Z',
    joinedDate: '2021-05-15T16:30:00Z'
  },
  {
    id: 'host2',
    name: 'Lisa Thompson',
    email: 'lisa.host@email.com',
    type: 'host',
    status: 'approved',
    bio: 'Lisa runs a converted warehouse space in the Arts District, perfect for larger acoustic performances. The space features exposed brick, high ceilings, and professional lighting.',
    venueName: 'Thompson Arts Loft',
    venueType: 'loft',
    location: {
      address: '567 Industrial Blvd',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      coordinates: { lat: 30.2672, lng: -97.7431 }
    },
    capacity: {
      indoor: 60,
      preferred: 45
    },
    amenities: ['Professional Sound', 'Stage Lighting', 'Bar Area', 'Parking', 'Green Room', 'Merchandise Table'],
    showSpecs: {
      avgAttendance: 48,
      avgDoorFee: 25,
      indoorAttendanceMax: 60,
      hostingHistory: '5+ years hosting',
      preferredGenres: ['Jazz', 'Blues', 'World Music', 'Experimental']
    },
    availability: {
      daysOfWeek: [4, 5, 6], // Thursday, Friday, Saturday
      timeSlots: ['7:30 PM', '8:00 PM', '8:30 PM']
    },
    rating: 4.7,
    reviewCount: 31,
    totalShows: 89,
    media: [
      {
        id: 'hostmedia3',
        url: 'https://picsum.photos/800/600?random=12',
        type: 'image',
        category: 'performance_space',
        title: 'Main performance area',
        description: 'Industrial loft with professional stage setup'
      }
    ],
    soundSystem: {
      available: true,
      description: 'Professional-grade sound system designed for live performances in our converted warehouse space. Perfect for jazz, blues, and world music acts.',
      equipment: {
        speakers: 'QSC K12.2 powered speakers (4 units), QSC KSub subwoofer for full-range sound',
        microphones: '6x Shure SM57/SM58 dynamic mics, 2x AKG C414 condenser mics, DI boxes',
        instruments: 'Yamaha CFX concert grand piano, full backline available (bass amp, guitar amp, drum kit)',
        additional: 'Professional stage lighting system, monitor speakers, wireless mic system, recording setup'
      }
    },
    // New lodging system fields - show-only host
    hostingCapabilities: {
      showHosting: {
        enabled: true // This host can host shows
      },
      lodgingHosting: {
        enabled: false // This host does not offer lodging
      }
    },
    primaryHostType: 'show',
    lastActive: '2024-01-21T14:25:00Z',
    joinedDate: '2019-08-10T11:00:00Z'
  },
  
  // Lodging-only host example
  {
    id: 'host3',
    name: 'Sarah Martinez',
    email: 'sarah.lodging@email.com',
    type: 'host',
    status: 'approved',
    bio: 'I love supporting touring musicians by providing comfortable accommodation in my home. While I don\'t host shows myself, I\'m happy to offer a peaceful place to rest.',
    venueName: 'Cozy Guest Suite',
    venueType: 'home',
    location: {
      address: '789 Maple Street (exact address hidden)',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37204',
      coordinates: { lat: 36.1580, lng: -86.7644 }
    },
    capacity: {
      indoor: 0,
      outdoor: 0,
      preferred: 0
    },
    amenities: ['WiFi', 'Parking', 'Kitchen access', 'Laundry'],
    showSpecs: {
      avgAttendance: 0,
      avgDoorFee: 0,
      indoorAttendanceMax: 0,
      hostingHistory: 'Lodging-only host. Provides accommodation for touring artists.',
      preferredGenres: []
    },
    availability: {
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Available all days
      timeSlots: [],
      blackoutDates: ['2024-12-25', '2024-01-01']
    },
    rating: 4.9,
    reviewCount: 15,
    totalShows: 0,
    media: [
      {
        id: 'host3-media1',
        url: 'https://picsum.photos/800/600?random=30',
        type: 'image',
        category: 'interior',
        title: 'Guest Bedroom',
        description: 'Comfortable private room with queen bed'
      },
      {
        id: 'host3-media2',
        url: 'https://picsum.photos/800/600?random=31',
        type: 'image',
        category: 'interior',
        title: 'Common Area',
        description: 'Shared living space with kitchen access'
      }
    ],
    // New lodging system fields
    hostingCapabilities: {
      showHosting: {
        enabled: false // This is a lodging-only host
      },
      lodgingHosting: {
        enabled: true,
        lodgingDetails: {
          roomType: 'private_bedroom',
          bathroomType: 'shared',
          bedConfiguration: {
            beds: [
              { type: 'queen', quantity: 1 }
            ],
            maxOccupancy: 2
          },
          amenities: {
            breakfast: true,
            breakfastType: 'continental',
            wifi: true,
            parking: true,
            laundry: true,
            kitchenAccess: true,
            workspace: false,
            linensProvided: true,
            towelsProvided: true,
            transportation: 'can_pickup'
          },
          houseRules: {
            checkInTime: '3:00 PM',
            checkOutTime: '11:00 AM',
            quietHours: { start: '10:00 PM', end: '8:00 AM' },
            smokingPolicy: 'no_smoking',
            petPolicy: 'case_by_case',
            alcoholPolicy: 'allowed'
          },
          pricing: {
            baseRate: 60,
            additionalGuestFee: 15,
            cleaningFee: 15
          },
          availability: {
            blackoutDates: ['2024-12-25', '2024-01-01'],
            minimumStay: 1,
            maximumStay: 14,
            advanceBookingRequired: 1
          },
          lodgingPhotos: [
            {
              id: 'lodging3-bed1',
              url: 'https://picsum.photos/800/600?random=32',
              category: 'bedroom',
              title: 'Guest Bedroom',
              description: 'Comfortable queen bed with reading area',
              isRequired: true
            },
            {
              id: 'lodging3-bath1',
              url: 'https://picsum.photos/800/600?random=33',
              category: 'bathroom',
              title: 'Shared Bathroom',
              description: 'Clean shared bathroom with shower',
              isRequired: true
            },
            {
              id: 'lodging3-common1',
              url: 'https://picsum.photos/800/600?random=34',
              category: 'common_area',
              title: 'Kitchen',
              description: 'Fully equipped kitchen available for guests',
              isRequired: false
            }
          ],
          accessibility: [],
          specialConsiderations: 'Perfect for musicians who need a quiet place to rest between shows. Located 10 minutes from downtown Nashville music venues.',
          localRecommendations: 'Walking distance to Centennial Park. Great local coffee shop (Frothy Monkey) around the corner. Easy access to Music Row.',
          safetyFeatures: ['Smoke detectors', 'Carbon monoxide detector', 'First aid kit', 'Secure parking', 'Well-lit entrance']
        }
      }
    },
    primaryHostType: 'lodging',
    serviceRadius: 25, // Willing to serve guests within 25 miles
    lastActive: '2024-12-13T09:15:00Z',
    joinedDate: '2024-08-15T00:00:00Z'
  }
];

// Fan Users
export const testFans: Fan[] = [
  {
    id: 'fan1',
    name: 'Jessica Chen',
    email: 'jessica.fan@email.com',
    type: 'fan',
    status: 'active',
    bio: 'Music lover and regular concert-goer. I discovered house concerts through a friend and fell in love with the intimate atmosphere. Always excited to discover new artists!',
    location: {
      city: 'Austin',
      state: 'TX',
      coordinates: { lat: 30.2672, lng: -97.7431 }
    },
    musicPreferences: {
      favoriteGenres: ['Folk', 'Indie', 'Singer-Songwriter', 'Acoustic'],
      concertFrequency: 'monthly',
      preferredVenueSize: 'intimate',
      willingToTravel: 25
    },
    paymentStatus: 'active',
    subscriptionExpiry: '2025-12-15',
    attendanceHistory: [
      {
        concertId: '1',
        artistName: 'Sarah & The Wanderers',
        venueName: 'The Garden House',
        date: '2024-11-15',
        rating: 5,
        review: 'Absolutely magical evening! Sarah\'s voice filled the room beautifully.'
      },
      {
        concertId: '2',
        artistName: 'Sarah & The Wanderers',
        venueName: 'Riverside Barn',
        date: '2024-10-22',
        rating: 4,
        review: 'Great energy and the barn setting was perfect for his folk style.'
      }
    ],
    upcomingReservations: ['3', '4'],
    favoriteArtists: ['1', '3'], // Sarah & The Wanderers, Marcus Rivers
    favoriteVenues: ['1', '2'], // The Garden House, Riverside Barn
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      newConcertAlerts: true,
      favoriteArtistAlerts: true
    },
    joinedDate: '2024-09-01',
    lastActive: '2025-01-14'
  },
  {
    id: 'fan2',
    name: 'David Rodriguez',
    email: 'david.music@email.com',
    type: 'fan',
    status: 'active',
    bio: 'Jazz enthusiast and music photographer. I love capturing the magic of live performances and supporting emerging artists.',
    location: {
      city: 'Nashville',
      state: 'TN',
      coordinates: { lat: 36.1627, lng: -86.7816 }
    },
    musicPreferences: {
      favoriteGenres: ['Jazz', 'Blues', 'Soul', 'R&B'],
      concertFrequency: 'weekly',
      preferredVenueSize: 'small',
      willingToTravel: 50
    },
    paymentStatus: 'active',
    subscriptionExpiry: '2025-08-30',
    attendanceHistory: [
      {
        concertId: 'concert5',
        artistName: 'Luna Martinez',
        venueName: 'The City Loft',
        date: '2024-12-03',
        rating: 5,
        review: 'Luna\'s jazz fusion set was incredible. The loft acoustics were perfect.'
      }
    ],
    upcomingReservations: ['concert6'],
    favoriteArtists: ['4'], // Luna Martinez
    favoriteVenues: ['3'], // The City Loft
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      newConcertAlerts: true,
      favoriteArtistAlerts: true
    },
    joinedDate: '2024-08-15',
    lastActive: '2025-01-15'
  },
  {
    id: 'fan3',
    name: 'Emma Thompson',
    email: 'emma.concerts@email.com',
    type: 'fan',
    status: 'payment_expired',
    bio: 'College student who loves discovering new music. House concerts are the perfect way to experience music on a budget.',
    location: {
      city: 'Portland',
      state: 'OR',
      coordinates: { lat: 45.5152, lng: -122.6784 }
    },
    musicPreferences: {
      favoriteGenres: ['Indie', 'Alternative', 'Electronic', 'Pop'],
      concertFrequency: 'few-times-year',
      preferredVenueSize: 'intimate',
      willingToTravel: 15
    },
    paymentStatus: 'expired',
    subscriptionExpiry: '2024-12-31',
    attendanceHistory: [
      {
        concertId: 'concert7',
        artistName: 'The Electric Dreams',
        venueName: 'Portland Creative Space',
        date: '2024-11-08',
        rating: 4,
        review: 'Great show, loved the electronic-folk fusion sound!'
      }
    ],
    upcomingReservations: [],
    favoriteArtists: [],
    favoriteVenues: [],
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      newConcertAlerts: false,
      favoriteArtistAlerts: false
    },
    joinedDate: '2024-06-12',
    lastActive: '2025-01-02'
  },
  {
    id: 'fan4',
    name: 'Michael Harrison',
    email: 'michael.harrison@email.com',
    type: 'fan',
    status: 'active',
    bio: 'Retired music teacher who appreciates quality performances. I love supporting local artists and the house concert community.',
    location: {
      city: 'Denver',
      state: 'CO',
      coordinates: { lat: 39.7392, lng: -104.9903 }
    },
    musicPreferences: {
      favoriteGenres: ['Classical', 'Jazz', 'Folk', 'World Music'],
      concertFrequency: 'monthly',
      preferredVenueSize: 'intimate',
      willingToTravel: 30
    },
    paymentStatus: 'active',
    subscriptionExpiry: '2026-01-10',
    attendanceHistory: [
      {
        concertId: 'concert8',
        artistName: 'Classical Crossroads',
        venueName: 'Mountain View Lodge',
        date: '2024-12-20',
        rating: 5,
        review: 'Beautiful classical performance in a stunning mountain setting.'
      },
      {
        concertId: 'concert9',
        artistName: 'Celtic Storm',
        venueName: 'Mountain View Lodge',
        date: '2024-11-25',
        rating: 5,
        review: 'The energy of Celtic music in an intimate setting was unforgettable!'
      }
    ],
    upcomingReservations: ['concert10', 'concert11'],
    favoriteArtists: ['artist8'],
    favoriteVenues: ['host6'],
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      newConcertAlerts: true,
      favoriteArtistAlerts: true
    },
    joinedDate: '2024-03-15',
    lastActive: '2025-01-16'
  },
  {
    id: 'fan5',
    name: 'Sarah Martinez',
    email: 'sarah.m.concerts@email.com',
    type: 'fan',
    status: 'active',
    bio: 'Social media influencer and live music enthusiast. I love sharing my concert experiences and discovering hidden gems in the music scene.',
    location: {
      city: 'Los Angeles',
      state: 'CA',
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    musicPreferences: {
      favoriteGenres: ['Pop', 'R&B', 'Soul', 'Electronic'],
      concertFrequency: 'weekly',
      preferredVenueSize: 'any',
      willingToTravel: 75
    },
    paymentStatus: 'active',
    subscriptionExpiry: '2025-09-20',
    attendanceHistory: [
      {
        concertId: 'concert12',
        artistName: 'Mia & The Moonlight Jazz Quartet',
        venueName: 'Sunset Terrace',
        date: '2024-12-31',
        rating: 5,
        review: 'NYE jazz under the stars was absolutely perfect!'
      }
    ],
    upcomingReservations: ['concert13', 'concert14', 'concert15'],
    favoriteArtists: ['artist7', 'artist5'],
    favoriteVenues: ['host4'],
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      newConcertAlerts: true,
      favoriteArtistAlerts: true
    },
    joinedDate: '2024-07-01',
    lastActive: '2025-01-16'
  },
  {
    id: 'fan6',
    name: 'Robert Kim',
    email: 'robert.kim.music@email.com',
    type: 'fan',
    status: 'active',
    bio: 'Tech entrepreneur and audiophile. I appreciate the sound quality and artist connection you get at house concerts.',
    location: {
      city: 'Seattle',
      state: 'WA',
      coordinates: { lat: 47.6062, lng: -122.3321 }
    },
    musicPreferences: {
      favoriteGenres: ['Alternative', 'Indie Rock', 'Electronic', 'Experimental'],
      concertFrequency: 'few-times-year',
      preferredVenueSize: 'small',
      willingToTravel: 40
    },
    paymentStatus: 'active',
    subscriptionExpiry: '2025-11-05',
    attendanceHistory: [
      {
        concertId: 'concert16',
        artistName: 'The River Stones',
        venueName: 'Seattle Sound House',
        date: '2024-12-15',
        rating: 4,
        review: 'Great rock energy in a controlled setting. Loved it!'
      }
    ],
    upcomingReservations: ['concert17'],
    favoriteArtists: ['artist4', 'artist9'],
    favoriteVenues: [],
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      newConcertAlerts: false,
      favoriteArtistAlerts: true
    },
    joinedDate: '2024-09-10',
    lastActive: '2025-01-15'
  },
  {
    id: 'fan7',
    name: 'Lisa Wong',
    email: 'lisa.wong@email.com',
    type: 'fan',
    status: 'active',
    bio: 'Yoga instructor and world music lover. House concerts provide the perfect setting for mindful music experiences.',
    location: {
      city: 'Santa Barbara',
      state: 'CA',
      coordinates: { lat: 34.4208, lng: -119.6982 }
    },
    musicPreferences: {
      favoriteGenres: ['World Music', 'Folk', 'Acoustic', 'New Age'],
      concertFrequency: 'monthly',
      preferredVenueSize: 'intimate',
      willingToTravel: 20
    },
    paymentStatus: 'active',
    subscriptionExpiry: '2025-10-15',
    attendanceHistory: [
      {
        concertId: 'concert18',
        artistName: 'Desert Highway',
        venueName: 'Coastal Sound House',
        date: '2024-11-20',
        rating: 5,
        review: 'The ocean backdrop and americana music created pure magic.'
      }
    ],
    upcomingReservations: ['concert19', 'concert20'],
    favoriteArtists: ['artist6'],
    favoriteVenues: ['host7'],
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      newConcertAlerts: true,
      favoriteArtistAlerts: true
    },
    joinedDate: '2024-05-20',
    lastActive: '2025-01-14'
  },
  {
    id: 'fan8',
    name: 'James Anderson',
    email: 'james.anderson.concerts@email.com',
    type: 'fan',
    status: 'payment_expired',
    bio: 'Music blogger and concert reviewer. I document the house concert scene and share stories about intimate musical experiences.',
    location: {
      city: 'Charleston',
      state: 'SC',
      coordinates: { lat: 32.7765, lng: -79.9311 }
    },
    musicPreferences: {
      favoriteGenres: ['Singer-Songwriter', 'Folk', 'Blues', 'Country'],
      concertFrequency: 'weekly',
      preferredVenueSize: 'intimate',
      willingToTravel: 100
    },
    paymentStatus: 'expired',
    subscriptionExpiry: '2024-12-01',
    attendanceHistory: [
      {
        concertId: 'concert21',
        artistName: 'Tommy Blue',
        venueName: 'The Historic Parlor',
        date: '2024-10-15',
        rating: 5,
        review: 'Tommy\'s blues in this historic setting was absolutely transcendent.'
      }
    ],
    upcomingReservations: [],
    favoriteArtists: ['artist2'],
    favoriteVenues: ['host8'],
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      newConcertAlerts: true,
      favoriteArtistAlerts: true
    },
    joinedDate: '2024-02-01',
    lastActive: '2024-12-15'
  },
  {
    id: 'fan9',
    name: 'Maria Gonzalez',
    email: 'maria.g.music@email.com',
    type: 'fan',
    status: 'active',
    bio: 'Arts patron and cultural advocate. I believe house concerts are essential for keeping live music culture alive and thriving.',
    location: {
      city: 'Sedona',
      state: 'AZ',
      coordinates: { lat: 34.8697, lng: -111.7610 }
    },
    musicPreferences: {
      favoriteGenres: ['World Music', 'Jazz', 'Classical', 'Experimental'],
      concertFrequency: 'monthly',
      preferredVenueSize: 'any',
      willingToTravel: 60
    },
    paymentStatus: 'active',
    subscriptionExpiry: '2026-03-01',
    attendanceHistory: [
      {
        concertId: 'concert22',
        artistName: 'Luna Sonata',
        venueName: 'Desert Oasis Venue',
        date: '2024-12-10',
        rating: 5,
        review: 'Classical piano under the desert stars - absolutely breathtaking!'
      }
    ],
    upcomingReservations: ['concert23', 'concert24', 'concert25'],
    favoriteArtists: ['artist5', 'artist7'],
    favoriteVenues: ['host9'],
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      newConcertAlerts: true,
      favoriteArtistAlerts: true
    },
    joinedDate: '2024-04-10',
    lastActive: '2025-01-16'
  }
];

// Admin Users
export const testAdminUsers: AdminUser[] = [
  {
    id: 'admin1',
    name: 'TourPad Admin',
    email: 'admin@tourpad.com',
    type: 'admin',
    role: 'super_admin',
    permissions: ['full_access', 'user_management', 'financial_access', 'system_admin'],
    lastLogin: '2024-01-22T09:00:00Z',
    activityLog: [
      {
        action: 'user_approved',
        timestamp: '2024-01-22T10:30:00Z',
        details: 'Approved artist application for Emma Rodriguez'
      },
      {
        action: 'payment_reviewed',
        timestamp: '2024-01-22T11:15:00Z',
        details: 'Reviewed failed payment for Marcus Williams'
      }
    ]
  }
];

// Sample Bookings
export const testBookings: Booking[] = [
  {
    id: 'booking1',
    artistId: 'artist1',
    hostId: 'host1',
    artist: testArtists[0],
    host: testHosts[0],
    eventDate: '2025-02-15T19:00:00Z',
    duration: 120,
    status: 'approved',
    proposedBy: 'artist',
    message: 'I\'d love to perform at your intimate venue. My folk style would be perfect for your space.',
    specialRequirements: 'Need piano access for 2-3 songs',
    attendeeCount: 28,
    doorFee: 20,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-16T09:45:00Z',
    messages: [
      {
        id: 'msg1',
        from: 'artist',
        message: 'Hi Mike! I\'d love to perform at your venue on February 15th.',
        timestamp: '2024-01-15T14:30:00Z'
      },
      {
        id: 'msg2',
        from: 'host',
        message: 'Hi Sarah! That sounds perfect. The piano will be ready for you.',
        timestamp: '2024-01-16T09:45:00Z'
      }
    ]
  },
  {
    id: 'booking2',
    artistId: 'artist2',
    hostId: 'host2',
    artist: testArtists[1],
    host: testHosts[1],
    eventDate: '2025-03-20T20:00:00Z',
    duration: 150,
    status: 'pending',
    proposedBy: 'host',
    message: 'Would you be interested in performing at our loft space? Your blues style would be perfect.',
    attendeeCount: 45,
    doorFee: 25,
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    messages: [
      {
        id: 'msg3',
        from: 'host',
        message: 'Hi Marcus! We\'d love to have you perform at Thompson Arts Loft.',
        timestamp: '2024-01-20T16:00:00Z'
      }
    ]
  }
];

// Concert data for fan discovery - using flexible interface
export interface ConcertListing {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  hostId: string;
  hostName: string;
  venueName: string;
  date: string;
  startTime: string;
  endTime: string;
  genre: string[];
  description: string;
  capacity: number;
  currentReservations: number;
  ticketPrice: number;
  status: 'upcoming' | 'past' | 'cancelled';
  attendees: string[]; // fan IDs
  location: {
    city: string;
    state: string;
    address: string;
  };
  requirements: string[];
  accessibility: boolean;
  ageRestriction: string;
  venueType: string;
  imageUrl?: string;
}

export const testConcerts: ConcertListing[] = [
  {
    id: 'concert1',
    title: 'An Evening with Sarah & The Wanderers',
    artistId: 'artist1',
    artistName: 'Sarah & The Wanderers',
    hostId: 'host1',
    hostName: 'The Garden House',
    venueName: 'The Garden House',
    date: '2025-08-15',
    startTime: '19:00',
    endTime: '21:00',
    genre: ['Folk', 'Indie', 'Acoustic'],
    description: 'Intimate acoustic evening with harmonious vocals and storytelling',
    capacity: 30,
    currentReservations: 25,
    ticketPrice: 15,
    status: 'upcoming',
    attendees: ['fan1'],
    location: {
      city: 'Austin',
      state: 'TX',
      address: '123 Garden St'
    },
    requirements: ['No recording devices', 'Arrive 15 minutes early'],
    accessibility: true,
    ageRestriction: 'All ages welcome',
    venueType: 'Home/Living Room',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
  },
  {
    id: 'concert2',
    title: 'Tommy Blue: Blues & Country Night',
    artistId: 'artist2',
    artistName: 'Tommy Blue',
    hostId: 'host1',
    hostName: 'The Garden House',
    venueName: 'The Garden House',
    date: '2025-08-22',
    startTime: '20:00',
    endTime: '22:00',
    genre: ['Blues', 'Country', 'Rock'],
    description: 'Powerful blues and country with masterful guitar work',
    capacity: 30,
    currentReservations: 18,
    ticketPrice: 20,
    status: 'upcoming',
    attendees: [],
    location: {
      city: 'Austin',
      state: 'TX',
      address: '123 Garden St'
    },
    requirements: ['21+ only', 'Cash bar available'],
    accessibility: true,
    ageRestriction: '21+',
    venueType: 'Home/Living Room'
  },
  {
    id: 'concert3',
    title: 'Echo & Iris: Experimental Folk',
    artistId: 'artist3',
    artistName: 'Echo & Iris',
    hostId: 'host2',
    hostName: 'Riverside Barn',
    venueName: 'Riverside Barn',
    date: '2025-09-05',
    startTime: '19:30',
    endTime: '21:30',
    genre: ['Experimental', 'Electronic', 'Folk'],
    description: 'Genre-bending music combining traditional instruments with electronic elements',
    capacity: 60,
    currentReservations: 35,
    ticketPrice: 25,
    status: 'upcoming',
    attendees: ['fan1'],
    location: {
      city: 'Nashville',
      state: 'TN',
      address: '456 River Road'
    },
    requirements: ['Bring cushions for floor seating'],
    accessibility: false,
    ageRestriction: 'All ages welcome',
    venueType: 'Barn'
  },
  {
    id: 'concert4',
    title: 'Past Concert: Sarah & The Wanderers',
    artistId: 'artist1',
    artistName: 'Sarah & The Wanderers',
    hostId: 'host1',
    hostName: 'The Garden House',
    venueName: 'The Garden House',
    date: '2025-01-15',
    startTime: '19:00',
    endTime: '21:00',
    genre: ['Folk', 'Indie', 'Acoustic'],
    description: 'Past concert for review testing',
    capacity: 30,
    currentReservations: 25,
    ticketPrice: 15,
    status: 'completed',
    attendees: ['fan1'],
    location: {
      city: 'Austin',
      state: 'TX',
      address: '123 Garden St'
    },
    requirements: [],
    accessibility: true,
    ageRestriction: 'All ages welcome',
    venueType: 'Home/Living Room'
  },
  {
    id: 'concert5',
    title: 'Past Concert: Tommy Blue Blues Night',
    artistId: 'artist2',
    artistName: 'Tommy Blue',
    hostId: 'host2',
    hostName: 'Riverside Barn',
    venueName: 'Riverside Barn',
    date: '2025-01-10',
    startTime: '20:00',
    endTime: '22:00',
    genre: ['Blues', 'Country'],
    description: 'Past concert for review testing',
    capacity: 60,
    currentReservations: 45,
    ticketPrice: 20,
    status: 'completed',
    attendees: ['fan1'],
    location: {
      city: 'Nashville',
      state: 'TN',
      address: '456 River Road'
    },
    requirements: [],
    accessibility: true,
    ageRestriction: '21+',
    venueType: 'Barn'
  },
  {
    id: 'concert6',
    title: 'Past Concert: Echo & Iris Experimental',
    artistId: 'artist3',
    artistName: 'Echo & Iris',
    hostId: 'host3',
    hostName: 'Urban Loft Sessions',
    venueName: 'Urban Loft Sessions',
    date: '2025-01-05',
    startTime: '19:30',
    endTime: '21:30',
    genre: ['Experimental', 'Folk'],
    description: 'Past concert for review testing',
    capacity: 20,
    currentReservations: 15,
    ticketPrice: 12,
    status: 'completed',
    attendees: ['fan1'],
    location: {
      city: 'Portland',
      state: 'OR',
      address: '789 Loft Ave'
    },
    requirements: [],
    accessibility: true,
    ageRestriction: 'All ages welcome',
    venueType: 'Loft/Warehouse'
  },
  {
    id: 'concert7',
    title: 'The River Stones: Acoustic Rock Night',
    artistId: 'artist4',
    artistName: 'The River Stones',
    hostId: 'host4',
    hostName: 'Sunset Terrace',
    venueName: 'Sunset Terrace',
    date: '2025-08-28',
    startTime: '20:00',
    endTime: '22:30',
    genre: ['Rock', 'Alternative', 'Indie Rock'],
    description: 'High-energy rock performance in an intimate rooftop setting',
    capacity: 40,
    currentReservations: 32,
    ticketPrice: 22,
    status: 'upcoming',
    attendees: ['fan5', 'fan6'],
    location: {
      city: 'Los Angeles',
      state: 'CA',
      address: '321 Sunset Blvd'
    },
    requirements: ['No flash photography', 'Dress code: smart casual'],
    accessibility: true,
    ageRestriction: '18+',
    venueType: 'Rooftop Terrace'
  },
  {
    id: 'concert8',
    title: 'Luna Sonata: Classical Under the Stars',
    artistId: 'artist5',
    artistName: 'Luna Sonata',
    hostId: 'host9',
    hostName: 'Desert Oasis Venue',
    venueName: 'Desert Oasis Venue',
    date: '2025-09-12',
    startTime: '19:30',
    endTime: '21:00',
    genre: ['Classical', 'Contemporary Classical', 'Crossover'],
    description: 'Classical piano performance in a desert amphitheater under the stars',
    capacity: 60,
    currentReservations: 45,
    ticketPrice: 35,
    status: 'upcoming',
    attendees: ['fan4', 'fan9'],
    location: {
      city: 'Sedona',
      state: 'AZ',
      address: '789 Red Rock Way'
    },
    requirements: ['Bring cushions or blankets', 'Weather dependent'],
    accessibility: true,
    ageRestriction: 'All ages welcome',
    venueType: 'Outdoor Amphitheater'
  },
  {
    id: 'concert9',
    title: 'Desert Highway: Americana Journey',
    artistId: 'artist6',
    artistName: 'Desert Highway',
    hostId: 'host7',
    hostName: 'Coastal Sound House',
    venueName: 'Coastal Sound House',
    date: '2025-09-20',
    startTime: '18:00',
    endTime: '20:30',
    genre: ['Americana', 'Country Rock', 'Folk Rock'],
    description: 'Sunset concert with desert-inspired Americana music by the ocean',
    capacity: 30,
    currentReservations: 22,
    ticketPrice: 18,
    status: 'upcoming',
    attendees: ['fan7'],
    location: {
      city: 'Santa Barbara',
      state: 'CA',
      address: '456 Ocean View Dr'
    },
    requirements: ['Beach parking available', 'Bring layers for evening'],
    accessibility: false,
    ageRestriction: 'All ages welcome',
    venueType: 'Beachfront House'
  },
  {
    id: 'concert10',
    title: 'Mia & The Moonlight Jazz Quartet',
    artistId: 'artist7',
    artistName: 'Mia & The Moonlight Jazz Quartet',
    hostId: 'host5',
    hostName: 'The Workshop Space',
    venueName: 'The Workshop Space',
    date: '2025-10-03',
    startTime: '20:30',
    endTime: '23:00',
    genre: ['Jazz', 'Soul', 'R&B'],
    description: 'Sultry jazz night in Brooklyn industrial loft',
    capacity: 40,
    currentReservations: 35,
    ticketPrice: 28,
    status: 'upcoming',
    attendees: ['fan2', 'fan5'],
    location: {
      city: 'Brooklyn',
      state: 'NY',
      address: '123 Industrial Way'
    },
    requirements: ['21+ only', 'Cocktail bar available'],
    accessibility: true,
    ageRestriction: '21+',
    venueType: 'Loft/Warehouse'
  },
  {
    id: 'concert11',
    title: 'Celtic Storm: Traditional Meets Modern',
    artistId: 'artist8',
    artistName: 'Celtic Storm',
    hostId: 'host6',
    hostName: 'Mountain View Lodge',
    venueName: 'Mountain View Lodge',
    date: '2025-10-15',
    startTime: '19:00',
    endTime: '21:30',
    genre: ['Celtic', 'Folk', 'World Music'],
    description: 'High-energy Celtic music in a cozy mountain cabin setting',
    capacity: 25,
    currentReservations: 20,
    ticketPrice: 20,
    status: 'upcoming',
    attendees: ['fan4'],
    location: {
      city: 'Boulder',
      state: 'CO',
      address: '789 Mountain Rd'
    },
    requirements: ['4WD recommended', 'Lodge accommodations available'],
    accessibility: false,
    ageRestriction: 'All ages welcome',
    venueType: 'Mountain Lodge'
  },
  {
    id: 'concert12',
    title: 'The Velvet Underground Revival: Psychedelic Experience',
    artistId: 'artist9',
    artistName: 'The Velvet Underground Revival',
    hostId: 'host3',
    hostName: 'Urban Loft Sessions',
    venueName: 'Urban Loft Sessions',
    date: '2025-10-25',
    startTime: '21:00',
    endTime: '23:30',
    genre: ['Psychedelic Rock', 'Indie', 'Alternative'],
    description: 'Immersive psychedelic rock experience with visual projections',
    capacity: 20,
    currentReservations: 18,
    ticketPrice: 15,
    status: 'upcoming',
    attendees: ['fan6', 'fan3'],
    location: {
      city: 'Portland',
      state: 'OR',
      address: '789 Loft Ave'
    },
    requirements: ['Visual effects warning', 'Limited capacity'],
    accessibility: true,
    ageRestriction: '18+',
    venueType: 'Loft/Warehouse'
  },
  {
    id: 'concert13',
    title: 'Sarah & The Wanderers: Holiday Special',
    artistId: 'artist1',
    artistName: 'Sarah & The Wanderers',
    hostId: 'host8',
    hostName: 'The Historic Parlor',
    venueName: 'The Historic Parlor',
    date: '2025-12-15',
    startTime: '19:00',
    endTime: '21:00',
    genre: ['Folk', 'Holiday', 'Acoustic'],
    description: 'Special holiday concert with folk renditions of classic songs',
    capacity: 30,
    currentReservations: 28,
    ticketPrice: 25,
    status: 'upcoming',
    attendees: ['fan8'],
    location: {
      city: 'Charleston',
      state: 'SC',
      address: '123 Historic Ave'
    },
    requirements: ['Festive attire encouraged'],
    accessibility: false,
    ageRestriction: 'All ages welcome',
    venueType: 'Historic Home'
  },
  {
    id: 'concert14',
    title: 'Luna Sonata: Winter Solstice Concert',
    artistId: 'artist5',
    artistName: 'Luna Sonata',
    hostId: 'host1',
    hostName: 'The Garden House',
    venueName: 'The Garden House',
    date: '2025-12-21',
    startTime: '19:30',
    endTime: '21:00',
    genre: ['Classical', 'Contemporary Classical'],
    description: 'Intimate piano concert celebrating the winter solstice',
    capacity: 30,
    currentReservations: 25,
    ticketPrice: 30,
    status: 'upcoming',
    attendees: ['fan1', 'fan9'],
    location: {
      city: 'Austin',
      state: 'TX',
      address: '123 Garden St'
    },
    requirements: ['Formal attire requested'],
    accessibility: true,
    ageRestriction: 'All ages welcome',
    venueType: 'Home/Living Room'
  },
  {
    id: 'concert15',
    title: 'New Years Eve Jazz Spectacular',
    artistId: 'artist7',
    artistName: 'Mia & The Moonlight Jazz Quartet',
    hostId: 'host4',
    hostName: 'Sunset Terrace',
    venueName: 'Sunset Terrace',
    date: '2025-12-31',
    startTime: '21:00',
    endTime: '01:00',
    genre: ['Jazz', 'Soul', 'R&B'],
    description: 'Ring in the new year with sophisticated jazz on a rooftop terrace',
    capacity: 40,
    currentReservations: 40,
    ticketPrice: 75,
    status: 'upcoming',
    attendees: ['fan5', 'fan2', 'fan7'],
    location: {
      city: 'Los Angeles',
      state: 'CA',
      address: '321 Sunset Blvd'
    },
    requirements: ['Black tie optional', 'Champagne at midnight'],
    accessibility: true,
    ageRestriction: '21+',
    venueType: 'Rooftop Terrace'
  },
  {
    id: 'concert16',
    title: 'Past Concert: Desert Highway Sunset',
    artistId: 'artist6',
    artistName: 'Desert Highway',
    hostId: 'host9',
    hostName: 'Desert Oasis Venue',
    venueName: 'Desert Oasis Venue',
    date: '2024-11-20',
    startTime: '18:00',
    endTime: '20:00',
    genre: ['Americana', 'Country Rock'],
    description: 'Past concert for review testing',
    capacity: 60,
    currentReservations: 50,
    ticketPrice: 25,
    status: 'completed',
    attendees: ['fan7', 'fan9'],
    location: {
      city: 'Sedona',
      state: 'AZ',
      address: '789 Red Rock Way'
    },
    requirements: [],
    accessibility: true,
    ageRestriction: 'All ages welcome',
    venueType: 'Outdoor Amphitheater'
  },
  {
    id: 'concert17',
    title: 'Past Concert: River Stones Rock Night',
    artistId: 'artist4',
    artistName: 'The River Stones',
    hostId: 'host2',
    hostName: 'Riverside Barn',
    venueName: 'Riverside Barn',
    date: '2024-12-15',
    startTime: '20:00',
    endTime: '22:30',
    genre: ['Rock', 'Alternative'],
    description: 'Past concert for review testing',
    capacity: 60,
    currentReservations: 55,
    ticketPrice: 20,
    status: 'completed',
    attendees: ['fan6'],
    location: {
      city: 'Nashville',
      state: 'TN',
      address: '456 River Road'
    },
    requirements: [],
    accessibility: true,
    ageRestriction: '18+',
    venueType: 'Barn'
  },
  {
    id: 'concert18',
    title: 'Past Concert: Celtic Christmas',
    artistId: 'artist8',
    artistName: 'Celtic Storm',
    hostId: 'host8',
    hostName: 'The Historic Parlor',
    venueName: 'The Historic Parlor',
    date: '2024-12-22',
    startTime: '19:00',
    endTime: '21:00',
    genre: ['Celtic', 'Holiday'],
    description: 'Past holiday concert for review testing',
    capacity: 30,
    currentReservations: 30,
    ticketPrice: 25,
    status: 'completed',
    attendees: ['fan4', 'fan8'],
    location: {
      city: 'Charleston',
      state: 'SC',
      address: '123 Historic Ave'
    },
    requirements: [],
    accessibility: false,
    ageRestriction: 'All ages welcome',
    venueType: 'Historic Home'
  }
];

// Sample Applications
export const testApplications: Application[] = [
  {
    id: 'app1',
    userId: 'artist3',
    user: testArtists[2],
    type: 'artist',
    status: 'pending',
    submittedAt: '2024-01-20T10:30:00Z',
    data: {
      bio: testArtists[2].bio,
      genres: testArtists[2].genres,
      experience: testArtists[2].experienceLevel,
      website: 'https://emmarodriguezmusic.com'
    }
  }
];


// Helper functions for real-time data
export function getCurrentUser(email: string) {
  const user = [...testArtists, ...testHosts, ...testFans, ...testAdminUsers].find(u => u.email === email);
  return user || null;
}

export function getUserBookings(userId: string) {
  return testBookings.filter(b => b.artistId === userId || b.hostId === userId);
}

export function getUpcomingBookings() {
  const now = new Date();
  return testBookings.filter(b => new Date(b.eventDate) > now && b.status === 'approved');
}

export function getPendingApplications() {
  return testApplications.filter(a => a.status === 'pending');
}
