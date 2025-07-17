'use client';
import { useState, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { mockHosts } from '@/data/mockData';

interface MapFiltersProps {
  onFiltersChange: (filteredHosts: typeof mockHosts) => void;
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
    applyFilters(updatedFilters);
  }, [searchLocation]);

  // Apply initial filters on mount
  useEffect(() => {
    applyFilters(filters);
  }, []);

  // Apply filters to hosts
  const applyFilters = (newFilters: FilterState) => {
    let filtered = mockHosts.filter(host => host.mapLocation);

    // Use external search location if provided, otherwise use internal filter
    const searchTerm = searchLocation.trim() || newFilters.searchLocation.trim();
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(host => {
        const cityMatch = host.city.toLowerCase().includes(searchLower);
        const stateMatch = host.state.toLowerCase().includes(searchLower);
        const keywordMatch = host.mapLocation?.searchKeywords.some(keyword => 
          keyword.toLowerCase().includes(searchLower)
        );
        return cityMatch || stateMatch || keywordMatch;
      });
    }

    // Venue type filter
    if (newFilters.venueTypes.length > 0) {
      filtered = filtered.filter(host => 
        newFilters.venueTypes.includes(host.venueType)
      );
    }

    // Capacity filter
    if (newFilters.capacityRange) {
      filtered = filtered.filter(host => {
        const capacity = host.showSpecs.indoorAttendanceMax;
        switch (newFilters.capacityRange) {
          case 'small': return capacity <= 25;
          case 'medium': return capacity > 25 && capacity <= 50;
          case 'large': return capacity > 50;
          default: return true;
        }
      });
    }

    // Amenities filter
    if (newFilters.amenities.length > 0) {
      filtered = filtered.filter(host => {
        return newFilters.amenities.every(amenity => {
          switch (amenity) {
            case 'sound_system': return host.amenities.soundSystem;
            case 'parking': return host.amenities.parking;
            case 'accessible': return host.amenities.accessible;
            case 'kid_friendly': return host.amenities.kidFriendly;
            case 'outdoor_space': return host.amenities.outdoorSpace;
            default: return true;
          }
        });
      });
    }

    onFiltersChange(filtered);
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
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
    applyFilters(emptyFilters);
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