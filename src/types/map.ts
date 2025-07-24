// Centralized map type definitions

export interface MapHost {
  id: string;
  userId: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  venueName?: string;
  venueType: string;
  city: string;
  state: string;
  country: string;
  description: string;
  capacity: number;
  indoorCapacity?: number;
  outdoorCapacity?: number;
  preferredGenres: string[];
  suggestedDoorFee?: number;
  coordinates: [number, number];
  actualCoordinates: [number, number];
  amenities: {
    soundSystem: boolean;
    parking: boolean;
    accessible: boolean;
    kidFriendly: boolean;
    outdoorSpace: boolean;
  };
  media: Array<{ id: string; url: string; type: string }>;
  hostingExperience: number;
  offersLodging: boolean;
  lodgingDetails?: any;
  houseRules?: string;
  // Properties for UI sorting and display
  rating: number;
  reviewCount: number;
  mapLocation: {
    searchKeywords: string[];
    priceRange: string;
  };
}

export interface MapShow {
  id: string;
  bookingId: string;
  concertId: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime?: string;
  artistName: string;
  artistId: string;
  hostName: string;
  hostId: string;
  venueName?: string;
  venueType: string;
  city: string;
  state: string;
  coordinates: [number, number]; // Exact coordinates for public shows
  doorFee?: number;
  maxCapacity: number;
  currentRSVPs: number;
  genres: string[];
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  rsvpStatus: 'available' | 'waitlist' | 'sold_out';
  ageRestriction?: 'all_ages' | '18+' | '21+';
  media?: Array<{ id: string; url: string; type: string }>;
}

export interface MapFilters {
  searchLocation?: string;
  venueTypes?: string[];
  capacityMin?: number;
  capacityMax?: number;
  amenities?: string[];
}

export interface ShowFilters extends MapFilters {
  genres?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  ticketPrice?: {
    min: number;
    max: number;
  };
  showType?: ('free' | 'donation' | 'ticketed')[];
  timeOfDay?: ('afternoon' | 'evening' | 'late_night')[];
  ageRestriction?: ('all_ages' | '18+' | '21+')[];
  rsvpStatus?: ('available' | 'waitlist' | 'sold_out')[];
}

export type MapMode = 'hosts' | 'shows';
export type ViewMode = 'map' | 'list';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapApiResponse<T> {
  data: T[];
  total: number;
  bounds: MapBounds | null;
  filters: any;
}