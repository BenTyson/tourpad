'use client';
import { Bed, Home, Wifi, Coffee, Car, Utensils, Briefcase, Shield } from 'lucide-react';
import { LodgingDetails } from '../types';

interface LodgingInfoProps {
  offersLodging: boolean;
  lodgingDetails?: LodgingDetails;
}

export default function LodgingInfo({ offersLodging, lodgingDetails }: LodgingInfoProps) {
  if (!offersLodging || !lodgingDetails) {
    return null;
  }

  const formatBedInfo = (beds: any[]) => {
    return beds?.map((bed: any) => 
      `${bed.quantity} ${bed.type === 'queen' ? 'Queen' : 
        bed.type === 'king' ? 'King' : 
        bed.type === 'full' ? 'Full' : 
        bed.type === 'twin' ? 'Twin' : 
        bed.type === 'single' ? 'Single' : 
        bed.type === 'sofa_bed' ? 'Sofa bed' : 
        bed.type === 'air_mattress' ? 'Air mattress' : 
        bed.type}`
    ).join(' + ') || '1 Queen';
  };

  const amenityIcons = [
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'breakfast', label: 'Breakfast', icon: Coffee },
    { key: 'parking', label: 'Parking', icon: Car },
    { key: 'laundry', label: 'Laundry', icon: Home },
    { key: 'kitchenAccess', label: 'Kitchen', icon: Utensils },
    { key: 'workspace', label: 'Workspace', icon: Briefcase },
    { key: 'linensProvided', label: 'Linens', icon: Bed },
    { key: 'towelsProvided', label: 'Towels', icon: Shield },
  ];

  const availableAmenities = amenityIcons.filter(({ key }) => {
    return lodgingDetails.amenities?.[key as keyof typeof lodgingDetails.amenities] || false;
  });

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Where you'll sleep
          </h2>
          <p className="text-neutral-600">
            {lodgingDetails.numberOfRooms || 1} bedroom{(lodgingDetails.numberOfRooms || 1) > 1 ? 's' : ''} available
          </p>
        </div>
        
        {/* Room Cards - Apple-inspired design */}
        <div className="space-y-6">
          {lodgingDetails.rooms && lodgingDetails.rooms.length > 0 ? (
            lodgingDetails.rooms.map((room: any, index: number) => {
              const mainPhoto = room.photos?.[0];
              const bedInfo = formatBedInfo(room.beds);
              
              return (
                <div key={room.id || index} className="group relative bg-neutral-50 rounded-2xl overflow-hidden transition-all hover:shadow-lg">
                  <div className="flex flex-col md:flex-row">
                    {/* Photo Section - Constrained height */}
                    <div className="relative w-full md:w-1/3 h-48 md:h-48 lg:h-56">
                      {mainPhoto ? (
                        <>
                          <img
                            src={mainPhoto.url}
                            alt={`Bedroom ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {room.photos && room.photos.length > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium">
                              +{room.photos.length - 1} photos
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                          <Bed className="w-12 h-12 text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 p-5 md:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                            {room.roomType === 'private_bedroom' ? 'Private Bedroom' :
                             room.roomType === 'shared_room' ? 'Shared Room' :
                             room.roomType === 'entire_space' ? 'Entire Space' :
                             `Bedroom ${index + 1}`}
                          </h3>
                          <p className="text-neutral-600">
                            {bedInfo} · Sleeps {room.maxOccupancy || 2}
                          </p>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <Bed className="w-4 h-4 text-neutral-700" />
                          </div>
                          <span className="text-neutral-700">{bedInfo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <Home className="w-4 h-4 text-neutral-700" />
                          </div>
                          <span className="text-neutral-700">
                            {room.bathroomType === 'private' ? 'Private' : 'Shared'} bath
                          </span>
                        </div>
                      </div>

                      {/* View Photos Link */}
                      {room.photos && room.photos.length > 0 && (
                        <button className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                          View all {room.photos.length} photos →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Fallback for single room configuration */
            <div className="group relative bg-neutral-50 rounded-2xl overflow-hidden transition-all hover:shadow-lg">
              <div className="flex flex-col md:flex-row">
                {/* Photo Section - Placeholder */}
                <div className="relative w-full md:w-1/3 h-48 md:h-48 lg:h-56">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                    <Bed className="w-12 h-12 text-neutral-400" />
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 p-5 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                        Private Bedroom
                      </h3>
                      <p className="text-neutral-600">
                        1 Queen bed · Sleeps 2
                      </p>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                        <Bed className="w-4 h-4 text-neutral-700" />
                      </div>
                      <span className="text-neutral-700">1 Queen bed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                        <Home className="w-4 h-4 text-neutral-700" />
                      </div>
                      <span className="text-neutral-700">Shared bath</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* What's included - Apple-style minimal design */}
        {availableAmenities.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">What's included</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
              {availableAmenities.map(({ key, label, icon: IconComponent }) => (
                <div key={key} className="flex items-center gap-3 text-neutral-700">
                  <IconComponent className="w-5 h-5 text-neutral-500" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}