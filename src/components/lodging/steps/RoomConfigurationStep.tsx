import React from 'react';
import { Bed } from 'lucide-react';
import { WizardStep } from '../WizardStep';
import { RoomCard } from '../RoomCard';
import { WizardStepProps } from '../types';
import { updateRoomCount, updateRoom } from '../lodging-utils';

export function RoomConfigurationStep({ data, onDataChange }: WizardStepProps) {
  const handleNumberOfRoomsChange = (numRooms: number) => {
    const updatedData = updateRoomCount(data, numRooms);
    onDataChange(updatedData);
  };

  const handleRoomUpdate = (roomId: number, updates: any) => {
    const updatedData = updateRoom(data, roomId, updates);
    onDataChange(updatedData);
  };

  return (
    <WizardStep
      title="Room Configuration"
      icon={<Bed className="w-5 h-5" />}
    >
      <div className="space-y-6">
        {/* Number of Rooms */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Number of Rooms Available
          </label>
          <select
            value={data.numberOfRooms}
            onChange={(e) => handleNumberOfRoomsChange(parseInt(e.target.value))}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Room Details */}
        <div className="space-y-6">
          {data.rooms.map((room, index) => (
            <RoomCard
              key={room.id}
              room={room}
              roomIndex={index}
              onUpdate={handleRoomUpdate}
            />
          ))}
        </div>
      </div>
    </WizardStep>
  );
}