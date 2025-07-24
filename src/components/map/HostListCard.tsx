'use client';
import { Star, MapPin, Users, Bed } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface MapHost {
  id: string;
  userId: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  venueName?: string;
  venueType: string;
  city: string;
  state: string;
  country: string;
  description: string;
  capacity: number;
  indoorCapacity?: number;
  outdoorCapacity?: number;
  preferredGenres: string[];
  suggestedDoorFee?: number;
  coordinates: [number, number];
  actualCoordinates: [number, number];
  amenities: {
    soundSystem: boolean;
    parking: boolean;
    accessible: boolean;
    kidFriendly: boolean;
    outdoorSpace: boolean;
  };
  media: Array<{ id: string; url: string; type: string }>;
  hostingExperience: number;
  offersLodging: boolean;
  lodgingDetails?: any;
  houseRules?: string;
  mapLocation: {
    searchKeywords: string[];
  };
}

interface HostListCardProps {
  host: MapHost;
  onViewProfile?: (hostId: string) => void;
}

export default function HostListCard({ host, onViewProfile }: HostListCardProps) {
  const handleViewProfile = () => {
    onViewProfile?.(host.id);
    window.open(`/hosts/${host.id}`, '_blank');
  };

  // Get venue type color
  const getVenueTypeColor = (type: string) => {
    switch (type) {
      case 'Home/Living Room': return 'bg-[#738a6e] text-white';
      case 'Other': return 'bg-[#8ea58c] text-white';
      case 'Loft/Warehouse': return 'bg-[#d4c4a8] text-[#344c3d]';
      default: return 'bg-[#344c3d] text-white';
    }
  };

  // Check if host offers lodging
  const hasLodging = host.offersLodging;

  // Get primary photo
  const primaryPhoto = host.media?.[0];

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Photo */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden">
            {primaryPhoto ? (
              <img
                src={primaryPhoto.url}
                alt={host.venueName || `${host.name}'s venue`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-neutral-400 text-xs text-center">No Photo</div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 text-lg truncate">
                {host.venueName || `${host.name}'s Place`}
              </h3>
              <div className="flex items-center gap-3 text-sm text-neutral-600 mt-1">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{host.city}, {host.state}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{(host.hostingExperience * 0.5 + 3.5).toFixed(1)}</span>
                  <span className="ml-1">({Math.max(1, Math.floor(host.hostingExperience / 2))})</span>
                </div>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-col gap-1 ml-3">
              <Badge className={`text-xs px-2 py-1 ${getVenueTypeColor(host.venueType)}`}>
                {host.venueType}
              </Badge>
              {hasLodging && (
                <Badge className="bg-primary-100 text-primary-800 border-0 text-xs px-2 py-1">
                  <Bed className="w-3 h-3 mr-1" />
                  Lodging
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-700 line-clamp-2 mb-3">
            {host.description || 'A welcoming venue for live music performances.'}
          </p>

          {/* Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>Up to {host.capacity} guests</span>
              </div>
              {host.suggestedDoorFee && (
                <div className="text-neutral-700 font-medium">
                  ${host.suggestedDoorFee} suggested
                </div>
              )}
            </div>
            
            <Button
              onClick={handleViewProfile}
              size="sm"
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}