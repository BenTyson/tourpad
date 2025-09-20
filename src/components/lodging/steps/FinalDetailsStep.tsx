import React from 'react';
import { Shield } from 'lucide-react';
import { WizardStep } from '../WizardStep';
import { WizardStepProps } from '../types';

export function FinalDetailsStep({ data, onDataChange }: WizardStepProps) {
  const handleInputChange = (field: 'specialConsiderations' | 'localRecommendations', value: string) => {
    onDataChange({ [field]: value });
  };

  return (
    <WizardStep
      title="Final Details"
      icon={<Shield className="w-5 h-5" />}
    >
      <div className="space-y-6">
        {/* Special Considerations */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Special Considerations
          </label>
          <textarea
            value={data.specialConsiderations}
            onChange={(e) => handleInputChange('specialConsiderations', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Any special notes about your space, accessibility, or requirements..."
          />
          <p className="text-sm text-neutral-500 mt-2">
            Include any important information about accessibility, house pets, neighborhood details, or special requirements.
          </p>
        </div>

        {/* Local Recommendations */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Local Recommendations
          </label>
          <textarea
            value={data.localRecommendations}
            onChange={(e) => handleInputChange('localRecommendations', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Favorite local restaurants, attractions, or places to visit..."
          />
          <p className="text-sm text-neutral-500 mt-2">
            Help artists discover the best of your local area. Include restaurants, coffee shops, venues, or attractions you recommend.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <h3 className="font-medium text-neutral-900 mb-3">Setup Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Offering Lodging:</span>
              <span className="font-medium">{data.offerLodging ? 'Yes' : 'No'}</span>
            </div>
            {data.offerLodging && (
              <>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Number of Rooms:</span>
                  <span className="font-medium">{data.numberOfRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Capacity:</span>
                  <span className="font-medium">
                    {data.rooms.reduce((total, room) => total + room.maxOccupancy, 0)} guests
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">WiFi:</span>
                  <span className="font-medium">{data.amenities.wifi ? 'Included' : 'Not available'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Breakfast:</span>
                  <span className="font-medium">{data.amenities.breakfast ? 'Included' : 'Not included'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </WizardStep>
  );
}