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
  available: boolean;
  rooms: LodgingRoom[];
  houseRules: {
    checkInTime: string;
    checkOutTime: string;
    quietHours: { start: string; end: string };
    smokingPolicy: string;
    petPolicy: string;
    alcoholPolicy: string;
  };
  specialConsiderations: string;
  localRecommendations: string;
  safetyFeatures: string[];
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
  briefBio: string;
  fullBio?: string;
  city: string;
  state: string;
  genres: string[];
  instruments?: string[];
  formationYear?: number;
  rating: number;
  reviewCount: number;
  profilePhoto?: string;
  thumbnailPhoto?: string;
  heroPhoto?: string;
  photos: Photo[];
  videoLinks?: VideoLink[];
  musicSamples?: MusicSample[];
  socialLinks?: SocialLinks;
  website?: string;
  bandMembers?: BandMember[];
  tourRequirements?: TourRequirements;
  upcomingTours?: TourSegment[];
  contentRating?: string;
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