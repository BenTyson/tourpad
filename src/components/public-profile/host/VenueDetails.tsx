'use client';
import { 
  MapPin, Users, Clock, DollarSign, Calendar, CheckCircle,
  Zap, Baby, Volume2, Bed, Snowflake, Car, Wifi, Accessibility
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { HostData } from '../types';

interface VenueDetailsProps {
  host: HostData;
}

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Power access for equipment': Zap,
  'Kid friendly environment': Baby,
  'Sound system available': Volume2,
  'Overnight stay available': Bed,
  'Climate control': Snowflake,
  'Free parking': Car,
  'Wi-Fi': Wifi,
  'Step-free access': Accessibility,
  'Food & Refreshments': CheckCircle
};

export default function VenueDetails({ host }: VenueDetailsProps) {
  // Add null check
  if (!host) {
    return null;
  }

  const defaultAmenities = [
    { label: 'Power access', icon: Zap },
    { label: 'Kid friendly', icon: Baby },
    { label: 'Sound system', icon: Volume2 },
    { label: 'Overnight stay', icon: Bed },
    { label: 'Climate control', icon: Snowflake },
    { label: 'Free parking', icon: Car },
    { label: 'WiFi', icon: Wifi },
    { label: 'Accessible', icon: Accessibility }
  ];

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">About This Venue</h2>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Venue Specs Grid */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Venue Details</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Venue Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium">Venue Type</span>
                </div>
                <p className="text-neutral-900 font-semibold pl-7">{host.venueType}</p>
              </div>
              
              {/* Capacity */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">Capacity</span>
                </div>
                <div className="pl-7">
                  {host.indoorCapacity && (
                    <p className="text-neutral-900 font-semibold">{host.indoorCapacity} indoor</p>
                  )}
                  {host.outdoorCapacity && (
                    <p className="text-neutral-900 font-semibold">{host.outdoorCapacity} outdoor</p>
                  )}
                </div>
              </div>
              
              {/* Show Length */}
              {host.typicalShowLength && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Show Length</span>
                  </div>
                  <p className="text-neutral-900 font-semibold pl-7">
                    {host.typicalShowLength} {typeof host.typicalShowLength === 'number' ? 'hours' : ''}
                  </p>
                </div>
              )}
              
              {/* Door Fee */}
              {host.suggestedDoorFee && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm font-medium">Suggested Door</span>
                  </div>
                  <p className="text-neutral-900 font-semibold pl-7">
                    ${host.suggestedDoorFee}
                  </p>
                </div>
              )}
              
              {/* Preferred Days */}
              {(host.preferredDays || host.showSpecs?.daysAvailable) && (
                <div className="col-span-2 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">Preferred Days</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-7">
                    {(host.preferredDays || host.showSpecs?.daysAvailable || []).map((day) => (
                      <Badge key={day} variant="secondary" className="bg-primary-50 text-primary-700">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Amenities */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Amenities</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {host.amenities && host.amenities.length > 0 ? (
                host.amenities.map((amenity) => {
                  const IconComponent = AMENITY_ICONS[amenity] || CheckCircle;
                  return (
                    <div key={amenity} className="flex items-center gap-3 text-neutral-700">
                      <IconComponent className="w-5 h-5 text-neutral-500" />
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  );
                })
              ) : (
                // Show default amenities
                defaultAmenities.map(({label, icon: IconComponent}) => (
                  <div key={label} className="flex items-center gap-3 text-neutral-700">
                    <IconComponent className="w-5 h-5 text-neutral-500" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}