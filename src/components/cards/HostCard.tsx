import Link from 'next/link';
import { 
  MapPinIcon, 
  StarIcon, 
  UserGroupIcon,
  SpeakerWaveIcon,
  WifiIcon,
  TruckIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface HostAmenities {
  powerAccess: boolean;
  airConditioning: boolean;
  wifi: boolean;
  kidFriendly: boolean;
  adultsOnly: boolean;
  parking: boolean;
  petFriendly: boolean;
  soundSystem: boolean;
  soundSystemSpecs?: string;
  outdoorSpace: boolean;
  accessible: boolean;
  bnbOffered: boolean;
}

interface HostShowSpecs {
  avgAttendance: number;
  avgDoorFee: number;
  indoorAttendanceMax: number;
  outdoorAttendanceMax: number;
  showDurationMins: number;
  showFormat: string;
  estimatedShowsPerYear: number;
  hostingHistory: string;
  daysAvailable: string[];
  performanceLocation: "home" | "separate" | "other";
}

interface HostProfile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  city: string;
  state: string;
  zip: string;
  showSpecs: HostShowSpecs;
  amenities: HostAmenities;
  housePhotos: Array<{
    id: string;
    url: string;
    alt: string;
    category: 'house' | 'performance_space' | 'crowd' | 'exterior';
  }>;
  performanceSpacePhotos: Array<{
    id: string;
    url: string;
    alt: string;
    category: 'house' | 'performance_space' | 'crowd' | 'exterior';
  }>;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface HostCardProps {
  host: HostProfile;
  showBookingButton?: boolean;
}

export function HostCard({ host, showBookingButton = false }: HostCardProps) {
  const getAmenityIcons = () => {
    const icons = [];
    if (host.amenities.parking) icons.push({ icon: TruckIcon, label: 'Parking' });
    if (host.amenities.wifi) icons.push({ icon: WifiIcon, label: 'WiFi' });
    if (host.amenities.soundSystem) icons.push({ icon: SpeakerWaveIcon, label: 'Sound System' });
    if (host.amenities.kidFriendly) icons.push({ icon: HomeIcon, label: 'Kid Friendly' });
    return icons.slice(0, 3); // Show max 3 icons
  };

  const formatLocation = () => {
    return `${host.city}, ${host.state}`;
  };

  const allPhotos = [...host.housePhotos, ...host.performanceSpacePhotos];

  return (
    <Card hover clickable className="overflow-hidden group">
      <div className="relative">
        <div className="aspect-video relative bg-gray-200 overflow-hidden">
          {allPhotos.length > 0 ? (
            <img
              src={allPhotos[0].url}
              alt={`${host.name} venue`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-secondary-400 to-primary-500 transition-all duration-500 group-hover:from-secondary-500 group-hover:to-primary-600">
              <HomeIcon className="w-12 h-12 text-white transition-transform duration-500 group-hover:scale-110" />
            </div>
          )}
        </div>
        
        {/* Quick stats overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 transition-all duration-300 group-hover:bg-white group-hover:shadow-md">
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">
              {host.rating.toFixed(1)} ({host.reviewCount})
            </span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button variant="secondary" size="sm" className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Photos
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors duration-300">
              {host.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {formatLocation()}
            </div>
          </div>

          {/* Show specs */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1" />
              {host.showSpecs.avgAttendance} avg
            </div>
            <div>
              ${host.showSpecs.avgDoorFee} door
            </div>
            <Badge variant="default" className="transition-all duration-300 group-hover:scale-105">
              {host.showSpecs.performanceLocation}
            </Badge>
          </div>

          {/* Amenities */}
          <div className="flex items-center space-x-2">
            {getAmenityIcons().map(({ icon: Icon, label }, index) => (
              <div 
                key={label} 
                className="flex items-center text-gray-600 transition-all duration-300 hover:text-primary-600" 
                title={label}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Icon className="w-4 h-4" />
              </div>
            ))}
            {host.amenities.bnbOffered && (
              <Badge variant="success" className="ml-2 transition-all duration-300 group-hover:scale-105">
                BNB Available
              </Badge>
            )}
          </div>

          {/* Bio preview */}
          <p className="text-sm text-gray-600 line-clamp-2 transition-colors duration-300 group-hover:text-gray-700">
            {host.bio}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 transform transition-all duration-300 group-hover:translate-y-0 translate-y-1">
            <Link href={`/hosts/${host.id}`}>
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:shadow-md">
                View Profile
              </Button>
            </Link>
            {showBookingButton && (
              <Link href={`/bookings/new?hostId=${host.id}`}>
                <Button size="sm" className="transition-all duration-300 hover:shadow-lg">
                  Request Booking
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}