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
    lastActive: '2024-01-21T14:25:00Z',
    joinedDate: '2019-08-10T11:00:00Z'
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
  const user = [...testArtists, ...testHosts, ...testAdminUsers].find(u => u.email === email);
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
