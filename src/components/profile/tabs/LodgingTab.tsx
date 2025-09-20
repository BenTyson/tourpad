'use client';
import { useState } from 'react';
import { Home, Camera, Plus, X, Wifi, Car, Coffee, Utensils, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface LodgingRoom {
  id: number;
  roomType: 'private_bedroom' | 'shared_room' | 'entire_space';
  bathroomType: 'private' | 'shared';
  beds: Array<{
    type: 'queen' | 'king' | 'twin' | 'full' | 'couch' | 'air_mattress';
    quantity: number;
  }>;
  maxOccupancy: number;
  photos?: Array<{
    id: string;
    fileUrl: string;
    title: string;
    description: string;
  }>;
}

interface HostProfile {
  offersLodging: boolean;
  lodgingDetails: {
    numberOfRooms: number;
    rooms: LodgingRoom[];
    amenities: {
      breakfast: boolean;
      wifi: boolean;
      parking: boolean;
      laundry: boolean;
      kitchenAccess: boolean;
      workspace: boolean;
      linensProvided: boolean;
      towelsProvided: boolean;
      transportation: 'none' | 'pickup' | 'nearby_transit';
    };
    houseRules: {
      checkInTime: string;
      checkOutTime: string;
      quietHours: { start: string; end: string };
      smokingPolicy: 'no_smoking' | 'outside_only' | 'allowed';
      petPolicy: 'no_pets' | 'cats_ok' | 'dogs_ok' | 'all_pets_ok';
      alcoholPolicy: 'allowed' | 'not_allowed' | 'byob';
    };
    specialConsiderations: string;
    localRecommendations: string;
    safetyFeatures: string[];
  };
}

interface LodgingTabProps {
  hostProfile: HostProfile;
  updateHostProfile: (updates: Partial<HostProfile>) => void;
}

export function LodgingTab({ hostProfile, updateHostProfile }: LodgingTabProps) {
  const [newRoomPhotos, setNewRoomPhotos] = useState<{[key: number]: FileList}>({});

  const handleRoomNumberChange = (numRooms: number) => {
    const newRooms = [...(hostProfile.lodgingDetails?.rooms || [])];

    if (numRooms > (hostProfile.lodgingDetails?.rooms?.length || 0)) {
      // Add new rooms
      for (let i = (hostProfile.lodgingDetails?.rooms?.length || 0); i < numRooms; i++) {
        newRooms.push({
          id: i + 1,
          roomType: 'private_bedroom',
          bathroomType: 'private',
          beds: [{ type: 'queen', quantity: 1 }],
          maxOccupancy: 2
        });
      }
    } else if (numRooms < (hostProfile.lodgingDetails?.rooms?.length || 0)) {
      // Remove rooms
      newRooms.splice(numRooms);
    }

    updateHostProfile({
      lodgingDetails: {
        ...hostProfile.lodgingDetails,
        numberOfRooms: numRooms,
        rooms: newRooms
      }
    });
  };

  const updateRoom = (roomId: number, updates: Partial<LodgingRoom>) => {
    const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
      r.id === roomId ? { ...r, ...updates } : r
    );
    updateHostProfile({
      lodgingDetails: {
        ...hostProfile.lodgingDetails,
        rooms: updatedRooms
      }
    });
  };

  const updateBed = (roomId: number, bedIndex: number, updates: Partial<LodgingRoom['beds'][0]>) => {
    const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
      r.id === roomId ? {
        ...r,
        beds: r.beds.map((b, i) =>
          i === bedIndex ? { ...b, ...updates } : b
        )
      } : r
    );
    updateHostProfile({
      lodgingDetails: {
        ...hostProfile.lodgingDetails,
        rooms: updatedRooms
      }
    });
  };

  const addBed = (roomId: number) => {
    const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
      r.id === roomId ? {
        ...r,
        beds: [...(r.beds || []), { type: 'twin' as const, quantity: 1 }]
      } : r
    );
    updateHostProfile({
      lodgingDetails: {
        ...hostProfile.lodgingDetails,
        rooms: updatedRooms
      }
    });
  };

  const removeBed = (roomId: number, bedIndex: number) => {
    const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
      r.id === roomId ? {
        ...r,
        beds: r.beds.filter((_, i) => i !== bedIndex)
      } : r
    );
    updateHostProfile({
      lodgingDetails: {
        ...hostProfile.lodgingDetails,
        rooms: updatedRooms
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Lodging Availability */}
      <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <CardHeader>
          <div className="flex items-center">
            <Home className="w-5 h-5 text-neutral-600 mr-3" />
            <h2 className="text-xl font-semibold text-neutral-900">Lodging for Artists</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="offersLodging"
                  checked={hostProfile.offersLodging}
                  onChange={() => updateHostProfile({ offersLodging: true })}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm font-medium text-neutral-900">
                  Yes, I can offer lodging to traveling artists
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="offersLodging"
                  checked={!hostProfile.offersLodging}
                  onChange={() => updateHostProfile({ offersLodging: false })}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm font-medium text-neutral-900">
                  No, I cannot offer lodging
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lodging Details - Only show if offering */}
      {hostProfile.offersLodging && (
        <>
          {/* Room Configuration */}
          <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-900">Room Configuration</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Number of Rooms Available
                </label>
                <select
                  value={hostProfile.lodgingDetails?.numberOfRooms || 1}
                  onChange={(e) => handleRoomNumberChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                  ))}
                </select>
              </div>

              {/* Room Details */}
              {hostProfile.lodgingDetails.rooms && hostProfile.lodgingDetails.rooms.map((room, index) => (
                <div key={room.id} className="border border-neutral-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Room {index + 1}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Room Type
                      </label>
                      <select
                        value={room.roomType}
                        onChange={(e) => updateRoom(room.id, { roomType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="private_bedroom">Private Bedroom</option>
                        <option value="shared_room">Shared Room</option>
                        <option value="entire_space">Entire Space/Apartment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Bathroom
                      </label>
                      <select
                        value={room.bathroomType}
                        onChange={(e) => updateRoom(room.id, { bathroomType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="private">Private Bathroom</option>
                        <option value="shared">Shared Bathroom</option>
                      </select>
                    </div>
                  </div>

                  {/* Bed Configuration */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-neutral-900 mb-3">Bed Configuration</h4>
                    <div className="space-y-3">
                      {room.beds && room.beds.map((bed, bedIndex) => (
                        <div key={bedIndex} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Bed Type
                            </label>
                            <select
                              value={bed.type}
                              onChange={(e) => updateBed(room.id, bedIndex, { type: e.target.value as any })}
                              className="w-full px-2 py-1 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                              <option value="twin">Twin</option>
                              <option value="full">Full</option>
                              <option value="queen">Queen</option>
                              <option value="king">King</option>
                              <option value="couch">Couch/Sofa</option>
                              <option value="air_mattress">Air Mattress</option>
                            </select>
                          </div>
                          <div className="w-20">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="4"
                              value={bed.quantity}
                              onChange={(e) => updateBed(room.id, bedIndex, { quantity: parseInt(e.target.value) || 1 })}
                              className="w-full px-2 py-1 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-center"
                            />
                          </div>
                          {room.beds.length > 1 && (
                            <button
                              onClick={() => removeBed(room.id, bedIndex)}
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Add Bed Button */}
                      {(!room.beds || room.beds.length < 3) && (
                        <button
                          onClick={() => addBed(room.id)}
                          className="w-full flex items-center justify-center py-2 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Bed
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Room Photos */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-medium text-neutral-900">Room Photos</h4>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            setNewRoomPhotos(prev => ({
                              ...prev,
                              [room.id]: e.target.files!
                            }));
                          }
                        }}
                        className="hidden"
                        id={`room-photos-${room.id}`}
                      />
                      <label
                        htmlFor={`room-photos-${room.id}`}
                        className="cursor-pointer bg-primary-600 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-700 transition-colors"
                      >
                        Add Photos
                      </label>
                    </div>
                    <div className="min-h-[120px]">
                      {room.photos && room.photos.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {room.photos.map((photo, photoIndex) => (
                            <div key={photo.id} className="relative group">
                              <img
                                src={photo.fileUrl}
                                alt={photo.title}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => {
                                  const updatedPhotos = room.photos?.filter((_, i) => i !== photoIndex);
                                  updateRoom(room.id, { photos: updatedPhotos });
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                          <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                          <p className="text-neutral-600 text-sm">No photos uploaded yet</p>
                          <p className="text-neutral-500 text-xs mt-1">Click "Add Photos" to upload room images</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-900">Amenities</h2>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'breakfast', label: 'Breakfast included', icon: Coffee },
                  { key: 'wifi', label: 'WiFi available', icon: Wifi },
                  { key: 'parking', label: 'Free parking', icon: Car },
                  { key: 'laundry', label: 'Laundry access', icon: Home },
                  { key: 'kitchenAccess', label: 'Kitchen access', icon: Utensils },
                  { key: 'workspace', label: 'Workspace available', icon: Briefcase },
                  { key: 'linensProvided', label: 'Linens provided', icon: Home },
                  { key: 'towelsProvided', label: 'Towels provided', icon: Home }
                ].map(({ key, label, icon: Icon }) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(hostProfile.lodgingDetails?.amenities?.[key as keyof typeof hostProfile.lodgingDetails.amenities] as boolean) || false}
                      onChange={(e) => {
                        updateHostProfile({
                          lodgingDetails: {
                            ...hostProfile.lodgingDetails,
                            amenities: {
                              ...hostProfile.lodgingDetails.amenities,
                              [key]: e.target.checked
                            }
                          }
                        });
                      }}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <Icon className="w-4 h-4 text-neutral-500 ml-2 mr-2" />
                    <span className="text-sm text-neutral-700">{label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}