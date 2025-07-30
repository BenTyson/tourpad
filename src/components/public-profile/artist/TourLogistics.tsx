'use client';
import { Calendar, Truck, MapPin, Home, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { TourRequirements } from '../types';

interface TourLogisticsProps {
  tourRequirements?: TourRequirements;
  contentRating?: string;
}

export default function TourLogistics({ tourRequirements, contentRating }: TourLogisticsProps) {
  if (!tourRequirements) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Tour & Logistics</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Tour Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-neutral-500" />
              <span className="text-neutral-700">
                Tours <span className="font-semibold">{tourRequirements.tourMonthsPerYear} months/year</span>
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-neutral-500" />
              <span className="text-neutral-700">
                Travels in <span className="font-semibold">{tourRequirements.tourVehicle}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-neutral-500" />
              <span className="text-neutral-700">
                Willing to travel <span className="font-semibold">{tourRequirements.willingToTravel} miles</span>
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-neutral-500" />
              <span className="text-neutral-700">
                <span className="font-semibold">{tourRequirements.needsLodging ? 'Needs' : 'Does not need'}</span> lodging
              </span>
            </div>
          </div>
          
          {/* Requirements */}
          <div className="space-y-4">
            {tourRequirements.equipmentProvided && tourRequirements.equipmentProvided.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2">Equipment Provided</h3>
                <div className="flex flex-wrap gap-2">
                  {tourRequirements.equipmentProvided.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {tourRequirements.venueRequirements && tourRequirements.venueRequirements.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2">Venue Requirements</h3>
                <div className="space-y-1">
                  {tourRequirements.venueRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-neutral-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {contentRating && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <Badge variant="default" className="bg-secondary-100 text-secondary-800">
              Content: {contentRating}
            </Badge>
          </div>
        )}
      </div>
    </section>
  );
}