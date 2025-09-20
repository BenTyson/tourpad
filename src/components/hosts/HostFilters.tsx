'use client';
import { useState } from 'react';
import { Search, Filter, Wifi, Car, Volume2, Baby, Accessibility, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface Filters {
  minAttendance: string;
  maxDoorFee: string;
  amenities: {
    parking: boolean;
    wifi: boolean;
    soundSystem: boolean;
    kidFriendly: boolean;
    bnbOffered: boolean;
    accessible: boolean;
  };
}

interface HostFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export function HostFilters({ searchQuery, setSearchQuery, filters, setFilters }: HostFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateAmenityFilter = (amenity: string, checked: boolean) => {
    setFilters({
      ...filters,
      amenities: {
        ...filters.amenities,
        [amenity]: checked
      }
    });
  };

  const amenityOptions = [
    { key: 'parking', label: 'Parking Available', icon: Car },
    { key: 'wifi', label: 'WiFi Available', icon: Wifi },
    { key: 'soundSystem', label: 'Sound System', icon: Volume2 },
    { key: 'kidFriendly', label: 'Kid Friendly', icon: Baby },
    { key: 'bnbOffered', label: 'Lodging Offered', icon: Home },
    { key: 'accessible', label: 'Wheelchair Accessible', icon: Accessibility }
  ];

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by venue name, city, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Capacity & Pricing */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Capacity & Pricing</h3>
                <div className="space-y-3">
                  <Input
                    label="Min Attendance"
                    type="number"
                    value={filters.minAttendance}
                    onChange={(e) => setFilters({ ...filters, minAttendance: e.target.value })}
                    placeholder="20"
                  />
                  <Input
                    label="Max Door Fee"
                    type="number"
                    value={filters.maxDoorFee}
                    onChange={(e) => setFilters({ ...filters, maxDoorFee: e.target.value })}
                    placeholder="30"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="md:col-span-2">
                <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {amenityOptions.map(({ key, label, icon: Icon }) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities[key as keyof typeof filters.amenities]}
                        onChange={(e) => updateAmenityFilter(key, e.target.checked)}
                        className="mr-2"
                      />
                      <Icon className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}