'use client';
import { Popup } from 'react-leaflet';
import { Star, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { mockHosts } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface HostPopupProps {
  host: typeof mockHosts[0];
  onViewProfile?: (hostId: string) => void;
  onBookNow?: (hostId: string) => void;
}

export default function HostPopup({ host, onViewProfile, onBookNow }: HostPopupProps) {
  const handleViewProfile = () => {
    onViewProfile?.(host.id);
    window.open(`/hosts/${host.id}`, '_blank');
  };

  const handleBookNow = () => {
    onBookNow?.(host.id);
    window.open(`/bookings/new?hostId=${host.id}`, '_blank');
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

  return (
    <Popup className="tourpad-popup" minWidth={280} maxWidth={320}>
      <div className="p-1">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-neutral-900 text-lg leading-tight">
              {host.name}
            </h3>
            <Badge 
              className={`${getVenueTypeColor(host.venueType)} border-0 text-xs px-2 py-1 ml-2`}
            >
              {host.venueType}
            </Badge>
          </div>
          
          {/* Rating & Location */}
          <div className="flex items-center space-x-4 text-sm text-neutral-600">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
              <span className="font-medium">{host.rating.toFixed(1)}</span>
              <span className="ml-1">({host.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{host.city}, {host.state}</span>
            </div>
          </div>
        </div>

        {/* Key Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-neutral-600">
              <Users className="w-4 h-4 mr-2" />
              <span>Capacity</span>
            </div>
            <span className="font-medium text-neutral-900">
              Up to {host.showSpecs.indoorAttendanceMax} people
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-neutral-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Typical Price</span>
            </div>
            <span className="font-medium text-neutral-900">
              {host.mapLocation?.priceRange || '$15-25'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-neutral-600">
              <span className="w-4 h-4 mr-2 text-center">📅</span>
              <span>Available</span>
            </div>
            <span className="font-medium text-neutral-900">
              {host.showSpecs.daysAvailable.join(', ')}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-neutral-700 line-clamp-2">
            {host.bio}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleViewProfile}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm py-2"
          >
            <span>View Full Profile</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={handleBookNow}
            variant="outline"
            className="w-full border-[#738a6e] text-[#738a6e] hover:bg-[#738a6e] hover:text-white text-sm py-2"
          >
            Request Booking
          </Button>
        </div>
      </div>
    </Popup>
  );
}