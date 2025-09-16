// Shared types for profile components
export interface ArtistProfile {
  bandName: string;
  briefBio: string;
  fullBio: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  zipCode: string;
  genres: string[];
  instruments: string[];
  formationYear: number;
  tourMonthsPerYear: number;
  tourVehicle: string;
  willingToTravel: number;
  needsLodging: boolean;
  equipmentProvided: string[];
  venueRequirements: string[];
  profilePhoto: string;
  thumbnailPhoto: string;
  heroPhoto: string;
  contentRating: string;
  socialLinks: {
    website: string;
    instagram: string;
    youtube: string;
    facebook: string;
    spotify: string;
    bandcamp: string;
  };
  bandMembers: Array<{
    id: string;
    name: string;
    instrument: string;
    yearsWithBand: number;
    photo: string;
  }>;
  videoLinks: Array<{
    id: string;
    title: string;
    url: string;
    category: string;
    isLivePerformance: boolean;
  }>;
  musicSamples: Array<{
    id: string;
    title: string;
    url: string;
    platform: string;
  }>;
  photos: Array<{
    id: string;
    fileUrl: string;
    title?: string;
    description?: string;
    sortOrder: number;
    category?: string;
  }>;
}

export interface HostProfile {
  venueName: string;
  venueDescription: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  zipCode: string;
  profilePhoto: string;
  venuePhoto: string;
  venueType: 'home' | 'studio' | 'backyard' | 'loft' | 'warehouse' | 'other';
  indoorCapacity: number;
  outdoorCapacity: number;
  amenities: string[];
  typicalShowLength: number;
  preferredDays: string[];
  suggestedDoorFee: number;
  soundSystem: {
    available: boolean;
    description: string;
    equipment: {
      speakers: string;
      microphones: string;
      instruments: string;
      additional: string;
    };
  };
  hostMembers: Array<{
    id: string;
    hostName: string;
    aboutMe: string;
    profilePhoto: string;
  }>;
  preferredGenres: string[];
  whatWeEnjoy: string;
  musicWeArentInto: string;
  preferredActSize: string;
  actSizeNotes: string;
  contentRating: string;
  photos?: Array<{
    id: string;
    fileUrl: string;
    title?: string;
    category?: string;
    sortOrder: number;
  }>;
  lodgingDetails: {
    available: boolean;
    rooms: Array<{
      id: string;
      name: string;
      beds: Array<{
        type: 'queen' | 'king' | 'twin' | 'full' | 'couch' | 'air_mattress';
        quantity: number;
      }>;
      maxOccupancy: number;
      amenities: string[];
      photos: Array<{
        id: string;
        fileUrl: string;
        title?: string;
      }>;
    }>;
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
  };
}

export type TabType = 'info' | 'photos' | 'media' | 'sound-system' | 'lodging';

export interface ProfileComponentProps {
  isArtist: boolean;
  artistProfile: ArtistProfile;
  hostProfile: HostProfile;
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
  updateHostProfile: (updates: Partial<HostProfile>) => void;
  hasChanges: boolean;
  loading: boolean;
}