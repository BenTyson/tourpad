import { LodgingData, Room } from './types';

export const createDefaultRoom = (id: number): Room => ({
  id,
  roomType: 'private_bedroom',
  bathroomType: 'private',
  beds: [{ type: 'queen', quantity: 1 }],
  maxOccupancy: 2
});

export const createDefaultLodgingData = (): LodgingData => ({
  offerLodging: false,
  numberOfRooms: 1,
  rooms: [createDefaultRoom(1)],
  amenities: {
    breakfast: false,
    wifi: true,
    parking: false,
    laundry: false,
    kitchenAccess: false,
    workspace: false,
    linensProvided: true,
    towelsProvided: true,
    transportation: 'none'
  },
  houseRules: {
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    quietHours: { start: '10:00 PM', end: '8:00 AM' },
    smokingPolicy: 'no_smoking',
    petPolicy: 'no_pets',
    alcoholPolicy: 'allowed'
  },
  specialConsiderations: '',
  localRecommendations: '',
  safetyFeatures: ['smoke_detectors', 'first_aid_kit']
});

export const updateRoomCount = (data: LodgingData, newCount: number): LodgingData => {
  const currentRooms = [...data.rooms];

  if (newCount > currentRooms.length) {
    // Add new rooms
    for (let i = currentRooms.length; i < newCount; i++) {
      currentRooms.push(createDefaultRoom(i + 1));
    }
  } else if (newCount < currentRooms.length) {
    // Remove rooms
    currentRooms.splice(newCount);
  }

  return {
    ...data,
    numberOfRooms: newCount,
    rooms: currentRooms
  };
};

export const updateRoom = (data: LodgingData, roomId: number, updates: Partial<Room>): LodgingData => ({
  ...data,
  rooms: data.rooms.map(room =>
    room.id === roomId ? { ...room, ...updates } : room
  )
});

export const updateAmenities = (data: LodgingData, amenityKey: keyof typeof data.amenities, value: any): LodgingData => ({
  ...data,
  amenities: {
    ...data.amenities,
    [amenityKey]: value
  }
});

export const updateHouseRules = (data: LodgingData, ruleKey: keyof typeof data.houseRules, value: any): LodgingData => ({
  ...data,
  houseRules: {
    ...data.houseRules,
    [ruleKey]: value
  }
});

export const validateStep = (step: number, data: LodgingData): boolean => {
  switch (step) {
    case 1:
      return true; // No validation needed for lodging toggle
    case 2:
      if (!data.offerLodging) return true;
      return data.rooms.length > 0 && data.rooms.every(room =>
        room.roomType && room.bathroomType && room.beds.length > 0 && room.maxOccupancy > 0
      );
    case 3:
      if (!data.offerLodging) return true;
      return true; // Amenities are optional
    case 4:
      if (!data.offerLodging) return true;
      return true; // Final details are optional
    default:
      return false;
  }
};

export const getTotalCapacity = (rooms: Room[]): number => {
  return rooms.reduce((total, room) => total + room.maxOccupancy, 0);
};

export const getRoomTypeLabel = (roomType: Room['roomType']): string => {
  const labels = {
    private_bedroom: 'Private Bedroom',
    guest_room: 'Guest Room',
    shared_space: 'Shared Space',
    couch_surface: 'Couch/Surface'
  };
  return labels[roomType];
};

export const getBathroomTypeLabel = (bathroomType: Room['bathroomType']): string => {
  const labels = {
    private: 'Private Bathroom',
    guest_bathroom: 'Guest Bathroom',
    shared: 'Shared Bathroom'
  };
  return labels[bathroomType];
};

export const getBedTypeLabel = (bedType: string): string => {
  const labels = {
    queen: 'Queen Bed',
    king: 'King Bed',
    full: 'Full Bed',
    twin: 'Twin Bed',
    sofa_bed: 'Sofa Bed',
    air_mattress: 'Air Mattress'
  };
  return labels[bedType as keyof typeof labels] || bedType;
};