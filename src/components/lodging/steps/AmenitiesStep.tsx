import React from 'react';
import { Coffee, Wifi, Car, Utensils, Briefcase, Users } from 'lucide-react';
import { WizardStep } from '../WizardStep';
import { AmenityCheckbox } from '../AmenityCheckbox';
import { WizardStepProps, AmenityItem } from '../types';
import { updateAmenities } from '../lodging-utils';

const amenityItems: AmenityItem[] = [
  {
    key: 'breakfast',
    label: 'Breakfast',
    icon: Coffee,
    description: 'Provide breakfast for guests'
  },
  {
    key: 'wifi',
    label: 'WiFi',
    icon: Wifi,
    description: 'High-speed internet access'
  },
  {
    key: 'parking',
    label: 'Parking',
    icon: Car,
    description: 'Free parking space available'
  },
  {
    key: 'kitchenAccess',
    label: 'Kitchen Access',
    icon: Utensils,
    description: 'Guests can use kitchen facilities'
  },
  {
    key: 'workspace',
    label: 'Workspace',
    icon: Briefcase,
    description: 'Dedicated workspace with desk'
  },
  {
    key: 'laundry',
    label: 'Laundry',
    icon: Users,
    description: 'Washing machine and dryer access'
  }
];

export function AmenitiesStep({ data, onDataChange }: WizardStepProps) {
  const handleAmenityChange = (amenityKey: keyof typeof data.amenities, checked: boolean) => {
    const updatedData = updateAmenities(data, amenityKey, checked);
    onDataChange(updatedData);
  };

  return (
    <WizardStep
      title="Amenities & Services"
      icon={<Coffee className="w-5 h-5" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenityItems.map((amenity) => (
          <AmenityCheckbox
            key={amenity.key}
            amenity={amenity}
            checked={data.amenities[amenity.key] as boolean}
            onChange={(checked) => handleAmenityChange(amenity.key, checked)}
          />
        ))}
      </div>

      {/* Additional Amenities */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Included Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AmenityCheckbox
            amenity={{
              key: 'linensProvided',
              label: 'Linens Provided',
              icon: () => <span className="text-primary-600">🛏️</span>,
              description: 'Clean sheets and pillowcases'
            }}
            checked={data.amenities.linensProvided}
            onChange={(checked) => handleAmenityChange('linensProvided', checked)}
          />
          <AmenityCheckbox
            amenity={{
              key: 'towelsProvided',
              label: 'Towels Provided',
              icon: () => <span className="text-primary-600">🏠</span>,
              description: 'Bath and hand towels'
            }}
            checked={data.amenities.towelsProvided}
            onChange={(checked) => handleAmenityChange('towelsProvided', checked)}
          />
        </div>
      </div>

      {/* Transportation */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Transportation</h3>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Transportation Options
          </label>
          <select
            value={data.amenities.transportation}
            onChange={(e) => handleAmenityChange('transportation', e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="none">No transportation provided</option>
            <option value="pickup_dropoff">Airport/Station pickup and drop-off</option>
            <option value="local_transport">Local transportation assistance</option>
          </select>
        </div>
      </div>
    </WizardStep>
  );
}