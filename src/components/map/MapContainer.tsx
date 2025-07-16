'use client';
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockHosts } from '@/data/mockData';
import HostMarker from './HostMarker';
import HostPopup from './HostPopup';

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
  const mapRef = useRef<HTMLDivElement>(null);

  // Handle client-side rendering for Leaflet
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter hosts that have map location data
  const hostsWithLocation = hosts.filter(host => host.mapLocation);

  if (!isClient) {
    return (
      <div className={`bg-neutral-100 rounded-xl flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className={`relative ${className}`}>
      {isClient && (
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          style={{ height: '600px', width: '100%' }}
          className="rounded-xl"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {hostsWithLocation.map((host) => (
            <HostMarker key={host.id} host={host}>
              <HostPopup host={host} />
            </HostMarker>
          ))}
        </MapContainer>
      )}
      
      {/* Map overlay with venue count */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-neutral-200">
        <p className="text-sm font-medium text-neutral-900 flex items-center">
          <span className="w-2 h-2 bg-primary-600 rounded-full mr-2 animate-pulse"></span>
          {hostsWithLocation.length} venues
        </p>
      </div>
    </div>
  );
}