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
  housePhotos: string[];
  performanceSpacePhotos: string[];
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

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative">
        <div className="aspect-video relative bg-gray-200">
          {host.housePhotos.length > 0 ? (
            <img
              src={host.housePhotos[0]}
              alt={`${host.name} venue`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-400 to-blue-500">
              <HomeIcon className="w-12 h-12 text-white" />
            </div>
          )}
        </div>
        
        {/* Quick stats overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">
              {host.rating.toFixed(1)} ({host.reviewCount})
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
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
            <Badge variant="default">
              {host.showSpecs.performanceLocation}
            </Badge>
          </div>

          {/* Amenities */}
          <div className="flex items-center space-x-2">
            {getAmenityIcons().map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center text-gray-600" title={label}>
                <Icon className="w-4 h-4" />
              </div>
            ))}
            {host.amenities.bnbOffered && (
              <Badge variant="success" className="ml-2">
                BNB Available
              </Badge>
            )}
          </div>

          {/* Bio preview */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {host.bio}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link href={`/hosts/${host.id}`}>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </Link>
            {showBookingButton && (
              <Link href={`/bookings/new?hostId=${host.id}`}>
                <Button size="sm">
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