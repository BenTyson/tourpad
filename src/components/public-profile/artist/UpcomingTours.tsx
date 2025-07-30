'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TourSegment } from '../types';

interface UpcomingToursProps {
  tours: TourSegment[];
  artistName: string;
}

export default function UpcomingTours({ tours, artistName }: UpcomingToursProps) {
  if (!tours || tours.length === 0) {
    return null;
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Upcoming Tours</h2>
            <p className="text-neutral-600">
              Catch {artistName} on the road in these upcoming tour segments
            </p>
          </div>
          <Badge variant="default" className="bg-secondary-100 text-secondary-800">
            <Calendar className="w-4 h-4 mr-1" />
            {tours.length} Tour{tours.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Tours Grid */}
        <div className="space-y-6">
          {tours.map((tour) => (
            <div 
              key={tour.id} 
              className="border border-neutral-200 rounded-xl p-6 bg-gradient-to-r from-neutral-50 to-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {tour.state} Tour
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-neutral-600 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {formatDateRange(tour.startDate, tour.endDate)}
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-2" />
                  Follow Tour
                </Button>
              </div>

              {/* Cities */}
              {tour.cities && tour.cities.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">Cities & Venues</h4>
                  <div className="flex flex-wrap gap-2">
                    {tour.cities.map((city, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-primary-50 text-primary-700"
                      >
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {tour.notes && (
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    <span className="font-medium">Tour Notes:</span> {tour.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
          <p className="text-neutral-600 mb-4">
            Want {artistName} to perform in your area?
          </p>
          <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
            Request a Show
          </Button>
        </div>
      </div>
    </section>
  );
}