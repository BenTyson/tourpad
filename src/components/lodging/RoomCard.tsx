import React from 'react';
import { RoomCardProps } from './types';
import { getRoomTypeLabel, getBathroomTypeLabel, getBedTypeLabel } from './lodging-utils';

export function RoomCard({ room, roomIndex, onUpdate }: RoomCardProps) {
  const handleChange = (field: string, value: any) => {
    if (field === 'bedType') {
      onUpdate(room.id, { beds: [{ ...room.beds[0], type: value }] });
    } else {
      onUpdate(room.id, { [field]: value });
    }
  };

  return (
    <div className="border border-neutral-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">
        Room {roomIndex + 1}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Room Type
          </label>
          <select
            value={room.roomType}
            onChange={(e) => handleChange('roomType', e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="private_bedroom">Private Bedroom</option>
            <option value="guest_room">Guest Room</option>
            <option value="shared_space">Shared Space</option>
            <option value="couch_surface">Couch/Surface</option>
          </select>
        </div>

        {/* Bathroom Type */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Bathroom Access
          </label>
          <select
            value={room.bathroomType}
            onChange={(e) => handleChange('bathroomType', e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="private">Private Bathroom</option>
            <option value="guest_bathroom">Guest Bathroom</option>
            <option value="shared">Shared Bathroom</option>
          </select>
        </div>

        {/* Bed Configuration */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Bed Type
          </label>
          <select
            value={room.beds[0].type}
            onChange={(e) => handleChange('bedType', e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="queen">Queen Bed</option>
            <option value="king">King Bed</option>
            <option value="full">Full Bed</option>
            <option value="twin">Twin Bed</option>
            <option value="sofa_bed">Sofa Bed</option>
            <option value="air_mattress">Air Mattress</option>
          </select>
        </div>

        {/* Maximum Guests */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Maximum Guests
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={room.maxOccupancy}
            onChange={(e) => handleChange('maxOccupancy', parseInt(e.target.value))}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
    </div>
  );
}