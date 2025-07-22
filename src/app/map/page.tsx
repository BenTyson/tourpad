'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft,
  Filter,
  Search,
  MapPin,
  List,
  Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import MapFilters from '@/components/map/MapFilters';
import HostListCard from '@/components/map/HostListCard';
import { mockHosts } from '@/data/mockData';

// Dynamic import for MapContainer to avoid SSR issues
const TourPadMapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  { ssr: false }
);

type ViewMode = 'map' | 'list';

export default function MapPage() {
  const { data: session, status } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [showFilters, setShowFilters] = useState(true);
  const [filteredHosts, setFilteredHosts] = useState(mockHosts.filter(host => host.mapLocation));
  const [searchLocation, setSearchLocation] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.7392, -104.9903]);
  const [mapZoom, setMapZoom] = useState(10);
  const [sortBy, setSortBy] = useState<'rating' | 'alphabetical' | 'price' | 'reviews'>('rating');

  // Create location suggestions from available data
  const generateSuggestions = (query: string): string[] => {
    if (!query.trim()) return [];
    
    const allLocations = new Set<string>();
    const hostsWithLocation = mockHosts.filter(host => host.mapLocation);
    
    hostsWithLocation.forEach(host => {
      // Add cities and states
      allLocations.add(`${host.city}, ${host.state}`);
      allLocations.add(host.city);
      allLocations.add(host.state);
      
      // Add keywords
      host.mapLocation?.searchKeywords.forEach(keyword => {
        allLocations.add(keyword);
      });
    });
    
    const queryLower = query.toLowerCase();
    return Array.from(allLocations)
      .filter(location => location.toLowerCase().includes(queryLower))
      .sort()
      .slice(0, 8); // Limit to 8 suggestions
  };

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchLocation(value);
    const suggestions = generateSuggestions(value);
    setSearchSuggestions(suggestions);
    setShowSuggestions(value.length > 0 && suggestions.length > 0);
  };

  // Handle suggestion selection or search execution
  const executeSearch = (searchTerm: string) => {
    setSearchLocation(searchTerm);
    setShowSuggestions(false);
    
    // Find matching hosts and fly to location
    const matchingHosts = mockHosts.filter(host => {
      if (!host.mapLocation) return false;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        host.city.toLowerCase().includes(searchLower) ||
        host.state.toLowerCase().includes(searchLower) ||
        host.mapLocation.searchKeywords.some(keyword => 
          keyword.toLowerCase().includes(searchLower)
        )
      );
    });

    if (matchingHosts.length > 0) {
      // Calculate center of matching hosts
      const lats = matchingHosts.map(host => host.mapLocation!.displayLat);
      const lngs = matchingHosts.map(host => host.mapLocation!.displayLng);
      
      const centerLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
      const centerLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
      
      setMapCenter([centerLat, centerLng]);
      setMapZoom(matchingHosts.length === 1 ? 12 : 10);
    }
  };

  // Sort hosts for list view
  const getSortedHosts = (hosts: typeof filteredHosts) => {
    const sorted = [...hosts];
    
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        // Sort by average price (extract from priceRange like "$15-25")
        return sorted.sort((a, b) => {
          const getAvgPrice = (priceRange: string) => {
            const match = priceRange.match(/\$(\d+)-(\d+)/);
            if (match) {
              return (parseInt(match[1]) + parseInt(match[2])) / 2;
            }
            return 0;
          };
          const aPrice = getAvgPrice(a.mapLocation?.priceRange || '$0-0');
          const bPrice = getAvgPrice(b.mapLocation?.priceRange || '$0-0');
          return aPrice - bPrice;
        });
      case 'reviews':
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return sorted;
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Please sign in to explore venues on the map.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const userRole = session.user.type as 'host' | 'artist' | 'admin' | 'fan';

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-3">
              <div className="flex rounded-lg border border-neutral-200 bg-white p-1">
                <Button
                  variant={viewMode === 'map' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={viewMode === 'map' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:text-neutral-900'}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Map
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:text-neutral-900'}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-neutral-300 hover:bg-neutral-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Full-width Search Bar */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    executeSearch(searchLocation);
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (searchLocation && searchSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Search venues by location (e.g., Austin, Nashville, Denver)"
                className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
              />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => executeSearch(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 first:rounded-t-lg last:rounded-b-lg text-sm text-neutral-700 hover:text-neutral-900"
                    >
                      <Search className="w-4 h-4 inline mr-2 text-neutral-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={() => {
                setSearchLocation('');
                setShowSuggestions(false);
                setMapCenter([39.7392, -104.9903]);
                setMapZoom(10);
              }}
              variant="outline"
              className="px-4 py-3"
            >
              Clear
            </Button>
          </div>
          {searchLocation && (
            <p className="text-sm text-neutral-600 mt-2">
              Showing {filteredHosts.length} venues {searchLocation ? `matching "${searchLocation}"` : ''}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6 min-h-[600px]">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <MapFilters 
                onFiltersChange={setFilteredHosts}
                searchLocation={searchLocation}
                className="h-full"
              />
            </div>
          )}

          {/* Map/List Content */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {viewMode === 'map' ? (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden h-[600px]">
                <TourPadMapContainer 
                  className="w-full h-full"
                  initialCenter={mapCenter}
                  initialZoom={mapZoom}
                  hosts={filteredHosts}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 h-full flex flex-col">
                {/* List Header with Sorting */}
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Venue List ({filteredHosts.length} venues)
                    </h2>
                    
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-600">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="border border-neutral-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="rating">Highest Rated</option>
                        <option value="reviews">Most Reviews</option>
                        <option value="price">Price (Low to High)</option>
                        <option value="alphabetical">Alphabetical</option>
                      </select>
                    </div>
                  </div>
                  
                  {searchLocation && (
                    <p className="text-sm text-neutral-600">
                      Showing venues {searchLocation ? `matching "${searchLocation}"` : ''}
                    </p>
                  )}
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {filteredHosts.length > 0 ? (
                    <div className="space-y-4">
                      {getSortedHosts(filteredHosts).map((host) => (
                        <HostListCard key={host.id} host={host} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-neutral-400 mb-2">
                        <MapPin className="w-12 h-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">No venues found</h3>
                      <p className="text-neutral-600">
                        {searchLocation 
                          ? `No venues match "${searchLocation}". Try adjusting your search or filters.`
                          : 'No venues match your current filters. Try adjusting your criteria.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}