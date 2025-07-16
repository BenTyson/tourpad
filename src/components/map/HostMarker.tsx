'use client';
import { Marker } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { mockHosts } from '@/data/mockData';

// Create custom TourPad marker icons
const createCustomIcon = (venueType: string, rating: number) => {
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

  // Create SVG marker with TourPad styling
  const svgIcon = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="6" fill="white" opacity="0.9"/>
      <path d="M12 6l-3 6h2v4h2v-4h2z" fill="${color}"/>
    </svg>
  `;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
};

interface HostMarkerProps {
  host: typeof mockHosts[0];
  onClick?: (host: typeof mockHosts[0]) => void;
  children?: React.ReactNode;
}

export default function HostMarker({ host, onClick, children }: HostMarkerProps) {
  if (!host.mapLocation) return null;

  const position: LatLngTuple = [
    host.mapLocation.displayLat,
    host.mapLocation.displayLng
  ];

  const customIcon = createCustomIcon(host.venueType, host.rating);

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