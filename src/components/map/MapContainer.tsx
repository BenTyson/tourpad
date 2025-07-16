'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockHosts } from '@/data/mockData';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapContainerProps {
  className?: string;
  initialCenter?: LatLngTuple;
  initialZoom?: number;
  showFilters?: boolean;
}

export default function TourPadMapContainer({ 
  className = '',
  initialCenter = [39.8283, -98.5795], // Center of USA
  initialZoom = 5,
  showFilters = true 
}: MapContainerProps) {
  const [isClient, setIsClient] = useState(false);
  const [filteredHosts, setFilteredHosts] = useState(mockHosts);

  // Handle client-side rendering for Leaflet
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter hosts that have map location data
  const hostsWithLocation = filteredHosts.filter(host => host.mapLocation);

  if (!isClient) {
    return (
      <div className={`bg-neutral-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        className="w-full h-full rounded-xl"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {hostsWithLocation.map((host) => {
          if (!host.mapLocation) return null;
          
          const position: LatLngTuple = [
            host.mapLocation.displayLat,
            host.mapLocation.displayLng
          ];

          return (
            <Marker key={host.id} position={position}>
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-neutral-900 mb-2">{host.name}</h3>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <p><strong>Type:</strong> {host.venueType}</p>
                    <p><strong>Capacity:</strong> Up to {host.showSpecs.indoorAttendanceMax} people</p>
                    <p><strong>Location:</strong> {host.city}, {host.state}</p>
                    <p><strong>Price Range:</strong> {host.mapLocation.priceRange}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-neutral-200">
                    <button 
                      onClick={() => window.open(`/hosts/${host.id}`, '_blank')}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm px-3 py-2 rounded-lg transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Map overlay with venue count */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-neutral-700">
          {hostsWithLocation.length} venues
        </p>
      </div>
    </div>
  );
}