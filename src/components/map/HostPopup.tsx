'use client';
import { useState } from 'react';
import { Popup } from 'react-leaflet';
import { Star, Users, MapPin, Calendar, ArrowRight, DollarSign, Bed, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockHosts } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface HostPopupProps {
  host: typeof mockHosts[0];
  onViewProfile?: (hostId: string) => void;
  onBookNow?: (hostId: string) => void;
}

export default function HostPopup({ host, onViewProfile, onBookNow }: HostPopupProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
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

  // Get all photos for carousel
  const allPhotos = [...(host.housePhotos || []), ...(host.performanceSpacePhotos || [])];
  
  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % allPhotos.length);
  };
  
  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  // Check if host offers lodging
  const hasLodging = (host as any).hostingCapabilities?.lodgingHosting?.enabled || false;

  return (
    <Popup className="tourpad-popup" minWidth={280} maxWidth={320}>
      <div className="overflow-hidden rounded-lg">
        {/* Photo Carousel - stretches to edge */}
        {allPhotos.length > 0 && (
          <div className="relative bg-neutral-100 mb-3">
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <img
                src={allPhotos[currentPhotoIndex]?.url}
                alt={allPhotos[currentPhotoIndex]?.alt}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation arrows */}
              {allPhotos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              
              {/* Photo counter */}
              {allPhotos.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {currentPhotoIndex + 1} / {allPhotos.length}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content with padding */}
        <div className="px-3 pb-3">
          {/* Header */}
          <div className="mb-3">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-neutral-900 text-lg leading-tight">
                {host.name}
              </h3>
              {hasLodging && (
                <Badge className="bg-primary-100 text-primary-800 border-0 text-xs px-2 py-1 ml-2">
                  <Bed className="w-3 h-3 mr-1" />
                  Lodging
                </Badge>
              )}
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

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-neutral-700 line-clamp-2">
            {host.bio}
          </p>
        </div>

          {/* Action Button */}
          <div>
            <Button
              onClick={handleViewProfile}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm py-2"
            >
              <span>View Full Profile</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
}