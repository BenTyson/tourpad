'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArtistProfile } from '../types';

interface TourLogisticsCardProps {
  artistProfile: ArtistProfile;
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
}

export default function TourLogisticsCard({
  artistProfile,
  updateArtistProfile
}: TourLogisticsCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">Tour & Logistics</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tour Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Months Touring Per Year"
            type="number"
            value={artistProfile.tourMonthsPerYear}
            onChange={(e) => updateArtistProfile({ tourMonthsPerYear: parseInt(e.target.value) || 0 })}
            min="0"
            max="12"
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Tour Vehicle</label>
            <select
              value={artistProfile.tourVehicle}
              onChange={(e) => updateArtistProfile({ tourVehicle: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select vehicle...</option>
              <option value="van">Van</option>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="fly">Fly/Rent</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Input
            label="Willing to Travel (miles)"
            type="number"
            value={artistProfile.willingToTravel}
            onChange={(e) => updateArtistProfile({ willingToTravel: parseInt(e.target.value) || 0 })}
            min="0"
            max="3000"
            placeholder="Enter miles"
          />
        </div>

        {/* Lodging Requirements */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Lodging Requirements</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="needsLodging"
              checked={artistProfile.needsLodging}
              onChange={(e) => updateArtistProfile({ needsLodging: e.target.checked })}
              className="mr-3 h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="needsLodging" className="text-sm text-neutral-700">
              I need lodging when traveling for performances
            </label>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Cancellation Policy</label>
          <select
            value={(artistProfile as any).cancellationPolicy || 'flexible'}
            onChange={(e) => updateArtistProfile({ cancellationPolicy: e.target.value } as any)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="flexible">Flexible - Free cancellation 48+ hours before</option>
            <option value="moderate">Moderate - Free cancellation 7+ days before</option>
            <option value="strict">Strict - No free cancellation</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}