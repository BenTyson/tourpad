// Shared types for public profile components

export interface Photo {
  id: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface SocialLinks {
  website?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
  spotify?: string;
  bandcamp?: string;
  soundcloud?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  authorAvatar?: string;
  eventType?: string;
}

// Host-specific types
export interface HostMember {
  id: string;
  hostName: string;
  aboutMe: string;
  profilePhoto?: string;
}

export interface SoundSystem {
  available: boolean;
  description: string;
  equipment: {
    speakers: string;
    microphones: string;
    instruments: string;
    additional: string;
  };
}

export interface LodgingRoom {
  id: string;
  name: string;
  beds: Array<{
    type: 'queen' | 'king' | 'twin' | 'full' | 'couch' | 'air_mattress';
    quantity: number;
  }>;
  maxOccupancy: number;
  amenities: string[];
  photos: Photo[];
}

export interface LodgingDetails {
  available?: boolean;
  numberOfRooms?: number;
  rooms?: Array<{
    id?: string;
    roomType?: 'private_bedroom' | 'shared_room' | 'entire_space';
    beds?: Array<{
      type: 'queen' | 'king' | 'twin' | 'full' | 'single' | 'sofa_bed' | 'air_mattress';
      quantity: number;
    }>;
    maxOccupancy?: number;
    bathroomType?: 'private' | 'shared';
    photos?: Array<{
      url: string;
      alt?: string;
    }>;
  }>;
  amenities?: {
    wifi?: boolean;
    breakfast?: boolean;
    parking?: boolean;
    laundry?: boolean;
    kitchenAccess?: boolean;
    workspace?: boolean;
    linensProvided?: boolean;
    towelsProvided?: boolean;
  };
  houseRules?: {
    checkInTime?: string;
    checkOutTime?: string;
    quietHours?: { start: string; end: string };
    smokingPolicy?: string;
    petPolicy?: string;
    alcoholPolicy?: string;
  };
  specialConsiderations?: string;
  localRecommendations?: string;
  safetyFeatures?: string[];
}

export interface HostData {
  id: string;
  userId: string;
  name: string;
  bio: string;
  city: string;
  state: string;
  displayCoordinates?: [number, number];
  venueName: string;
  venueType: string;
  indoorCapacity?: number;
  outdoorCapacity?: number;
  typicalShowLength?: number;
  preferredDays?: string[];
  suggestedDoorFee?: number;
  hostingExperience?: number;
  socialLinks?: SocialLinks;
  rating: number;
  reviewCount: number;
  housePhotos: Photo[];
  performanceSpacePhotos: Photo[];
  amenities?: string[];
  hostMembers?: HostMember[];
  soundSystem?: SoundSystem;
  preferredGenres?: string[];
  whatWeEnjoy?: string;
  musicWeArentInto?: string;
  preferredActSize?: string;
  contentRating?: string;
  lodgingDetails?: LodgingDetails;
  showSpecs?: {
    hostingHistory: string;
    suggestedDoorFee: number;
    typicalShowLength: string;
    preferredDays: string[];
  };
}

// Artist-specific types
export interface BandMember {
  id: string;
  name: string;
  instrument: string;
  yearsWithBand?: number;
  bio?: string;
  photo?: string;
}

export interface VideoLink {
  id: string;
  title: string;
  url: string;
  platform: string;
  embedId?: string;
  category?: string;
  isLivePerformance?: boolean;
}

export interface MusicSample {
  id: string;
  title: string;
  url: string;
  platform: string;
  embedId?: string;
}

export interface TourSegment {
  id: string;
  state: string;
  startDate: string;
  endDate: string;
  cities: string[];
  notes: string;
}

export interface TourRequirements {
  tourMonthsPerYear: number;
  tourVehicle: string;
  willingToTravel: number;
  needsLodging: boolean;
  travelPartySize: number;
  equipmentProvided: string[];
  venueRequirements: string[];
}

export interface ArtistData {
  id: string;
  userId: string;
  name: string;
  bio: string;
  briefBio?: string;
  fullBio?: string;
  location?: string; // Format: "City, State"
  genres: string[];
  musicalStyle?: string;
  instruments?: string[];
  formationYear?: number;
  yearsActive?: number;
  experienceLevel?: 'emerging' | 'intermediate' | 'professional';
  rating: number;
  reviewCount: number;
  // Image properties from API
  profileImageUrl?: string;
  thumbnailPhotoUrl?: string;
  heroPhotoUrl?: string;
  photos?: Array<{
    id: string;
    fileUrl: string;
    title: string;
    description: string;
    category: string;
    sortOrder: number;
  }>;
  videoLinks?: VideoLink[];
  musicSamples?: MusicSample[];
  socialLinks?: SocialLinks;
  website?: string;
  bandMembers?: BandMember[];
  tourMonthsPerYear?: number;
  tourVehicle?: string;
  willingToTravel?: number;
  equipmentProvided?: string[];
  venueRequirements?: string[];
  contentRating?: string;
  // Spotify fields
  spotifyVerified?: boolean;
  spotifyFollowers?: number;
  spotifyPopularity?: number;
  spotifyArtistId?: string;
  // SoundCloud fields
  soundcloudVerified?: boolean;
  soundcloudFollowers?: number;
  soundcloudTrackCount?: number;
  soundcloudUserId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Component prop types
export interface ProfileHeroProps {
  isArtist: boolean;
  data: HostData | ArtistData;
  onShare: () => void;
  onFavorite: () => void;
}

export interface StatsProps {
  rating: number;
  reviewCount: number;
  additionalStats?: Array<{
    label: string;
    value: string | number;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export interface PhotoGalleryProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  title?: string;
  showCount?: boolean;
}

export interface SocialLinksProps {
  links: SocialLinks;
  website?: string;
  className?: string;
}