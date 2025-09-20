export interface BedConfiguration {
  type: 'queen' | 'king' | 'full' | 'twin' | 'sofa_bed' | 'air_mattress';
  quantity: number;
}

export interface Room {
  id: number;
  roomType: 'private_bedroom' | 'guest_room' | 'shared_space' | 'couch_surface';
  bathroomType: 'private' | 'guest_bathroom' | 'shared';
  beds: BedConfiguration[];
  maxOccupancy: number;
}

export interface Amenities {
  breakfast: boolean;
  wifi: boolean;
  parking: boolean;
  laundry: boolean;
  kitchenAccess: boolean;
  workspace: boolean;
  linensProvided: boolean;
  towelsProvided: boolean;
  transportation: 'none' | 'pickup_dropoff' | 'local_transport';
}

export interface HouseRules {
  checkInTime: string;
  checkOutTime: string;
  quietHours: {
    start: string;
    end: string;
  };
  smokingPolicy: 'no_smoking' | 'smoking_allowed' | 'outdoor_only';
  petPolicy: 'no_pets' | 'pets_allowed' | 'case_by_case';
  alcoholPolicy: 'not_allowed' | 'allowed' | 'byob_only';
}

export interface LodgingData {
  offerLodging: boolean;
  numberOfRooms: number;
  rooms: Room[];
  amenities: Amenities;
  houseRules: HouseRules;
  specialConsiderations: string;
  localRecommendations: string;
  safetyFeatures: string[];
}

export interface WizardStepProps {
  data: LodgingData;
  onDataChange: (updates: Partial<LodgingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export interface LodgingWizardProps {
  onSave: (data: LodgingData) => void;
  onCancel: () => void;
  initialData?: Partial<LodgingData>;
}

export interface RoomCardProps {
  room: Room;
  roomIndex: number;
  onUpdate: (roomId: number, updates: Partial<Room>) => void;
}

export interface AmenityItem {
  key: keyof Amenities;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  isDataValid: boolean;
  nextLabel?: string;
  saveLabel?: string;
}