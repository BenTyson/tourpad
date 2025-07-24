'use client';
import { Marker } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';

// Create custom TourPad marker icons
const createCustomIcon = (venueType: string, hostingExperience: number) => {
  // Convert hosting experience to a rating-like value
  const rating = Math.min(5, Math.max(1, hostingExperience * 0.5 + 3.5));
  // Color coding based on venue type
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'Home/Living Room': return '#738a6e'; // sage
      case 'Other': return '#8ea58c'; // french blue  
      case 'Loft/Warehouse': return '#d4c4a8'; // sand
      default: return '#344c3d'; // evergreen
    }
  };

  // Size based on rating
  const size = rating >= 4.5 ? 32 : rating >= 4.0 ? 28 : 24;
  const color = getMarkerColor(venueType);

  // Create SVG marker with TourPad styling and french blue accent
  const svgIcon = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="#8ea58c" stroke-width="2"/>
      <circle cx="12" cy="12" r="6" fill="white" opacity="0.95"/>
      <circle cx="12" cy="12" r="3" fill="${color}" opacity="0.8"/>
      <circle cx="12" cy="12" r="1.5" fill="#8ea58c"/>
    </svg>
  `;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
};

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

interface HostMarkerProps {
  host: MapHost;
  onClick?: (host: MapHost) => void;
  children?: React.ReactNode;
}

export default function HostMarker({ host, onClick, children }: HostMarkerProps) {
  const position: LatLngTuple = [
    host.coordinates[0],
    host.coordinates[1]
  ];

  const customIcon = createCustomIcon(host.venueType, host.hostingExperience);

  return (
    <Marker 
      position={position} 
      icon={customIcon}
      eventHandlers={{
        click: () => onClick?.(host)
      }}
    >
      {children}
    </Marker>
  );
}