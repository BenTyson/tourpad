'use client';
import { useState, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MapFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  searchLocation?: string;
  className?: string;
}

interface FilterState {
  searchLocation: string;
  venueTypes: string[];
  capacityRange: string;
  priceRange: string;
  amenities: string[];
}

export default function MapFilters({ onFiltersChange, searchLocation = '', className = '' }: MapFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchLocation: searchLocation,
    venueTypes: [],
    capacityRange: '',
    priceRange: '',
    amenities: []
  });

  // Update filters when external search location changes
  useEffect(() => {
    const updatedFilters = { ...filters, searchLocation };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  }, [searchLocation, onFiltersChange]);

  // Apply initial filters on mount
  useEffect(() => {
    onFiltersChange(filters);
  }, []);

  // Transform filters into API-compatible format
  const transformFilters = (newFilters: FilterState) => {
    const apiFilters: any = {};
    
    // Use external search location if provided, otherwise use internal filter
    const searchTerm = searchLocation.trim() || newFilters.searchLocation.trim();
    if (searchTerm) {
      apiFilters.searchLocation = searchTerm;
    }
    
    // Venue type filter
    if (newFilters.venueTypes.length > 0) {
      apiFilters.venueTypes = newFilters.venueTypes;
    }
    
    // Capacity filter - convert to min/max values
    if (newFilters.capacityRange) {
      switch (newFilters.capacityRange) {
        case 'small':
          apiFilters.capacityMin = 0;
          apiFilters.capacityMax = 25;
          break;
        case 'medium':
          apiFilters.capacityMin = 26;
          apiFilters.capacityMax = 50;
          break;
        case 'large':
          apiFilters.capacityMin = 51;
          apiFilters.capacityMax = 999;
          break;
      }
    }
    
    // Amenities filter
    if (newFilters.amenities.length > 0) {
      apiFilters.amenities = newFilters.amenities;
    }
    
    return apiFilters;
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    const apiFilters = transformFilters(updatedFilters);
    onFiltersChange(apiFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      searchLocation: '',
      venueTypes: [],
      capacityRange: '',
      priceRange: '',
      amenities: []
    };
    setFilters(emptyFilters);
    const apiFilters = transformFilters(emptyFilters);
    onFiltersChange(apiFilters);
  };

  const handleVenueTypeChange = (venueType: string, checked: boolean) => {
    const newVenueTypes = checked 
      ? [...filters.venueTypes, venueType]
      : filters.venueTypes.filter(type => type !== venueType);
    updateFilters({ venueTypes: newVenueTypes });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked 
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity);
    updateFilters({ amenities: newAmenities });
  };

  const activeFiltersCount = 
    (searchLocation.trim() || filters.searchLocation.trim() ? 1 : 0) +
    filters.venueTypes.length +
    (filters.capacityRange ? 1 : 0) +
    filters.amenities.length;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 p-6 h-full max-h-[600px] overflow-y-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>
      

      {/* Venue Type */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">Venue Type</h3>
        <div className="space-y-2">
          {['Home/Living Room', 'Other', 'Loft/Warehouse'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.venueTypes.includes(type)}
                onChange={(e) => handleVenueTypeChange(type, e.target.checked)}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-neutral-600">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Capacity */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">Capacity</h3>
        <div className="space-y-2">
          {[
            { value: 'small', label: '25 people or less' },
            { value: 'medium', label: '26-50 people' },
            { value: 'large', label: '50+ people' }
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="capacity"
                value={option.value}
                checked={filters.capacityRange === option.value}
                onChange={(e) => updateFilters({ capacityRange: e.target.value })}
                className="border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-neutral-600">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">Amenities</h3>
        <div className="space-y-2">
          {[
            { value: 'sound_system', label: 'Sound System' },
            { value: 'parking', label: 'Parking Available' },
            { value: 'accessible', label: 'Wheelchair Accessible' },
            { value: 'kid_friendly', label: 'Kid Friendly' },
            { value: 'outdoor_space', label: 'Outdoor Space' }
          ].map((amenity) => (
            <label key={amenity.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity.value)}
                onChange={(e) => handleAmenityChange(amenity.value, e.target.checked)}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-neutral-600">{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Location Shortcuts */}
      <div className="border-t border-neutral-200 pt-4">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">Popular Areas</h3>
        <div className="space-y-1">
          {['Austin, TX', 'Nashville, TN', 'Portland, OR'].map((city) => (
            <button
              key={city}
              onClick={() => updateFilters({ searchLocation: city })}
              className="flex items-center w-full text-left px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-50 rounded"
            >
              <MapPin className="w-3 h-3 mr-2" />
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}