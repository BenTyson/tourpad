'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { X } from 'lucide-react';
import { HostProfile } from '../types';

const AMENITY_OPTIONS = [
  'Power access for equipment',
  'Kid friendly environment',
  'Sound system provided',
  'Overnight accommodation',
  'Air conditioning / Heating',
  'Free parking on premises',
  'WiFi available',
  'Step-free access',
  'Food & Refreshments'
];

interface HostVenueDetailsCardProps {
  hostProfile: HostProfile;
  updateHostProfile: (updates: Partial<HostProfile>) => void;
}

export default function HostVenueDetailsCard({
  hostProfile,
  updateHostProfile
}: HostVenueDetailsCardProps) {
  const addAmenity = (amenity: string) => {
    if (!hostProfile.amenities.includes(amenity)) {
      updateHostProfile({ amenities: [...hostProfile.amenities, amenity] });
    }
  };

  const removeAmenity = (amenity: string) => {
    updateHostProfile({ amenities: hostProfile.amenities.filter(a => a !== amenity) });
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">Venue Details</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Venue Type & Capacity */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Venue Type</label>
            <select
              value={hostProfile.venueType}
              onChange={(e) => updateHostProfile({ venueType: e.target.value as any })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="home">Home/Living Room</option>
              <option value="studio">Studio Space</option>
              <option value="backyard">Backyard/Garden</option>
              <option value="loft">Loft</option>
              <option value="warehouse">Warehouse</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Indoor Capacity"
              type="number"
              value={hostProfile.indoorCapacity}
              onChange={(e) => updateHostProfile({ indoorCapacity: parseInt(e.target.value) || 0 })}
              min="0"
              max="200"
            />
            <Input
              label="Outdoor Capacity"
              type="number"
              value={hostProfile.outdoorCapacity}
              onChange={(e) => updateHostProfile({ outdoorCapacity: parseInt(e.target.value) || 0 })}
              min="0"
              max="500"
            />
          </div>
        </div>

        {/* Show Length */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Typical Show Length</label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={hostProfile.typicalShowLength}
              onChange={(e) => updateHostProfile({ typicalShowLength: parseInt(e.target.value) || 90 })}
              min="30"
              max="300"
              className="w-24"
            />
            <span className="text-sm text-neutral-600">minutes</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">How long do shows typically last at your venue?</p>
        </div>

        {/* Suggested Door Fee */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Suggested Door Fee</label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-600">$</span>
            <Input
              type="number"
              value={hostProfile.suggestedDoorFee}
              onChange={(e) => updateHostProfile({ suggestedDoorFee: parseInt(e.target.value) || 20 })}
              min="0"
              max="100"
              className="w-24"
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">Typical door fee you suggest for concerts at your venue</p>
        </div>

        {/* Preferred Days */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Days for Concerts</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {hostProfile.preferredDays.map(day => (
                <Badge key={day} variant="default" className="flex items-center">
                  {day}
                  <button
                    onClick={() => updateHostProfile({ 
                      preferredDays: hostProfile.preferredDays.filter(d => d !== day) 
                    })}
                    className="ml-1 text-xs hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                .filter(day => !hostProfile.preferredDays.includes(day))
                .map(day => (
                  <button
                    key={day}
                    onClick={() => updateHostProfile({ 
                      preferredDays: [...hostProfile.preferredDays, day] 
                    })}
                    className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                  >
                    + {day}
                  </button>
                ))}
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Which days of the week work best for hosting concerts?</p>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Amenities & Features</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {hostProfile.amenities.map(amenity => (
                <Badge key={amenity} variant="default" className="flex items-center">
                  {amenity}
                  <button
                    onClick={() => removeAmenity(amenity)}
                    className="ml-1 text-xs hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.filter(a => !hostProfile.amenities.includes(a)).map(amenity => (
                <button
                  key={amenity}
                  onClick={() => addAmenity(amenity)}
                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                >
                  + {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}