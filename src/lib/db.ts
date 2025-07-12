// Database configuration and types
// This will be implemented with a proper ORM like Prisma or Drizzle

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'artist' | 'host' | 'admin';
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  profile?: ArtistProfile | HostProfile;
}

export interface ArtistProfile {
  id: string;
  userId: string;
  bio: string;
  genres: string[];
  instruments: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'professional';
  performanceHistory: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    bandcamp?: string;
  };
  media: MediaFile[];
  paymentStatus: 'pending' | 'paid' | 'failed' | 'overdue';
  subscriptionExpiry: Date;
}

export interface HostProfile {
  id: string;
  userId: string;
  bio: string;
  venueType: 'home' | 'studio' | 'backyard' | 'loft' | 'other';
  capacity: number;
  amenities: string[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  availability: {
    daysOfWeek: number[];
    timeSlots: string[];
    blackoutDates?: Date[];
  };
  media: MediaFile[];
  pricing?: {
    baseRate?: number;
    notes?: string;
  };
}

export interface MediaFile {
  id: string;
  userId: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  category: string;
  title: string;
  description?: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Booking {
  id: string;
  artistId: string;
  hostId: string;
  eventDate: Date;
  duration: number; // minutes
  status: 'pending' | 'approved' | 'cancelled' | 'completed';
  proposedBy: 'artist' | 'host';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  artist: User;
  host: User;
}

export interface Application {
  id: string;
  userId: string;
  type: 'artist' | 'host';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
  data: any; // Form submission data
}

// Database connection (placeholder)
export const db = {
  // This will be replaced with actual database connection
  // using Prisma, Drizzle, or similar ORM
  users: {
    find: async (criteria: any) => [],
    create: async (data: any) => {},
    update: async (id: string, data: any) => {},
    delete: async (id: string) => {}
  },
  bookings: {
    find: async (criteria: any) => [],
    create: async (data: any) => {},
    update: async (id: string, data: any) => {},
    delete: async (id: string) => {}
  },
  applications: {
    find: async (criteria: any) => [],
    create: async (data: any) => {},
    update: async (id: string, data: any) => {},
    delete: async (id: string) => {}
  }
};
