'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockHosts } from '@/data/mockData';
import HostMarker from './HostMarker';
import HostPopup from './HostPopup';

// Custom marker styles will be handled by HostMarker component

interface MapContainerProps {
  className?: string;
  initialCenter?: LatLngTuple;
  initialZoom?: number;
  showFilters?: boolean;
  hosts?: typeof mockHosts;
}

export default function TourPadMapContainer({ 
  className = '',
  initialCenter = [39.8283, -98.5795], // Center of USA
  initialZoom = 5,
  showFilters = true,
  hosts = mockHosts
}: MapContainerProps) {
  const [isClient, setIsClient] = useState(false);

  // Handle client-side rendering for Leaflet
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter hosts that have map location data
  const hostsWithLocation = hosts.filter(host => host.mapLocation);

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
        
        {hostsWithLocation.map((host) => (
          <HostMarker key={host.id} host={host}>
            <HostPopup host={host} />
          </HostMarker>
        ))}
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