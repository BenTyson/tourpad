// Tour Planner Types and Interfaces

export interface StateRange {
  id: string;
  state: string;
  startDate: string;
  endDate: string;
  cities: string[];
  notes: string;
}

export interface TourSegment {
  id: string;
  name: string;
  description: string;
  status: TourStatus;
  isPublic: boolean;
  stateRanges: StateRange[];
}

export type TourStatus = 'planned' | 'confirmed' | 'cancelled';

export interface TourFormData {
  name: string;
  description: string;
  status: TourStatus;
  isPublic: boolean;
  stateRanges: StateRange[];
}

export interface NewStateRangeData {
  state: string;
  startDate: string;
  endDate: string;
  cities: string[];
  notes: string;
}

export interface UseTourSegmentsReturn {
  tourSegments: TourSegment[];
  loading: boolean;
  createTourSegment: (segmentData: TourFormData) => Promise<void>;
  updateTourSegment: (segmentId: string, segmentData: TourFormData) => Promise<void>;
  deleteTourSegment: (segmentId: string) => Promise<void>;
  fetchTourSegments: () => Promise<void>;
}

export interface UseTourFormReturn {
  formData: TourFormData;
  setFormData: React.Dispatch<React.SetStateAction<TourFormData>>;
  newStateRange: NewStateRangeData;
  setNewStateRange: React.Dispatch<React.SetStateAction<NewStateRangeData>>;
  cityInput: string;
  setCityInput: React.Dispatch<React.SetStateAction<string>>;
  editingTourSegment: string | null;
  setEditingTourSegment: React.Dispatch<React.SetStateAction<string | null>>;
  resetForm: () => void;
  loadTourForEditing: (tour: TourSegment) => void;
  addStateRange: () => boolean;
  removeStateRange: (rangeId: string) => void;
  addCityToNewRange: () => void;
  removeCityFromNewRange: (city: string) => void;
  validateForm: () => boolean;
}