'use client';
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import HostMarker from './HostMarker';
import HostPopup from './HostPopup';

// Component to handle map updates
function MapUpdater({ center, zoom }: { center: LatLngTuple; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.2,
      easeLinearity: 0.1
    });
  }, [map, center, zoom]);

  return null;
}

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

interface MapContainerProps {
  className?: string;
  initialCenter?: LatLngTuple;
  initialZoom?: number;
  showFilters?: boolean;
  hosts?: MapHost[];
}

export default function TourPadMapContainer({ 
  className = '',
  initialCenter = [39.7392, -104.9903], // Denver, Colorado
  initialZoom = 10,
  showFilters = true,
  hosts = []
}: MapContainerProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Handle client-side rendering for Leaflet
  useEffect(() => {
    setIsClient(true);
    // Add a delay to ensure proper mounting
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // All hosts from API already have coordinates - ensure it's an array
  const hostsWithLocation = Array.isArray(hosts) ? hosts : [];

  if (!isClient || !mapLoaded) {
    return (
      <div className={`bg-neutral-100 rounded-xl flex items-center justify-center h-[600px] ${className}`}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className={`relative ${className}`}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: '600px', width: '100%' }}
        className="tourpad-map rounded-xl z-0"
        zoomControl={true}
        scrollWheelZoom={true}
        attributionControl={true}
        preferCanvas={false}
      >
        <MapUpdater center={initialCenter} zoom={initialZoom} />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
          subdomains={['a', 'b', 'c', 'd']}
        />
        
        {hostsWithLocation.map((host) => (
          <HostMarker key={host.id} host={host}>
            <HostPopup host={host} />
          </HostMarker>
        ))}
      </MapContainer>
      
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