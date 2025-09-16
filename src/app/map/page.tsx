'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
import MapErrorBoundary from '@/components/map/MapErrorBoundary';
import { MapHost, MapShow, MapFilters as MapFiltersType, MapMode } from '@/types/map';

// Dynamic import for MapContainer to avoid SSR issues
const TourPadMapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  { ssr: false }
);

type ViewMode = 'map' | 'list';

export default function MapPage() {
  const { data: session, status } = useSession();
  const [mapMode, setMapMode] = useState<MapMode>('hosts');
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [showFilters, setShowFilters] = useState(true);
  const [hosts, setHosts] = useState<MapHost[]>([]);
  const [shows, setShows] = useState<MapShow[]>([]);
  const [filteredHosts, setFilteredHosts] = useState<MapHost[]>([]);
  const [filteredShows, setFilteredShows] = useState<MapShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.7392, -104.9903]);
  const [mapZoom, setMapZoom] = useState(10);
  const [sortBy, setSortBy] = useState<'rating' | 'alphabetical' | 'price' | 'reviews'>('rating');
  const [currentFilters, setCurrentFilters] = useState<any>({});

  // Fetch hosts from API
  const fetchHosts = async (filters: MapFiltersType = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert filters to URL search params
      const params = new URLSearchParams();
      
      if (filters.searchLocation) {
        params.append('searchLocation', filters.searchLocation);
      }
      if (filters.venueTypes && filters.venueTypes.length > 0) {
        params.append('venueTypes', filters.venueTypes.join(','));
      }
      if (filters.capacityMin !== undefined) {
        params.append('capacityMin', filters.capacityMin.toString());
      }
      if (filters.capacityMax !== undefined) {
        params.append('capacityMax', filters.capacityMax.toString());
      }
      if (filters.amenities && filters.amenities.length > 0) {
        params.append('amenities', filters.amenities.join(','));
      }

      const response = await fetch(`/api/map/hosts?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hosts: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.hosts) {
        setHosts(data.hosts);
        setFilteredHosts(data.hosts);
        
        // Update map bounds if available
        if (data.bounds && data.hosts.length > 0) {
          const centerLat = (data.bounds.north + data.bounds.south) / 2;
          const centerLng = (data.bounds.east + data.bounds.west) / 2;
          setMapCenter([centerLat, centerLng]);
          
          // Adjust zoom based on bounds
          const latSpan = data.bounds.north - data.bounds.south;
          const lngSpan = data.bounds.east - data.bounds.west;
          const maxSpan = Math.max(latSpan, lngSpan);
          
          let newZoom = 10;
          if (maxSpan < 0.1) newZoom = 13;
          else if (maxSpan < 0.5) newZoom = 11;
          else if (maxSpan < 1) newZoom = 10;
          else if (maxSpan < 2) newZoom = 9;
          else newZoom = 8;
          
          setMapZoom(newZoom);
        }
      }
    } catch (error) {
      console.error('Error fetching hosts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load venues');
      setHosts([]);
      setFilteredHosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch shows from API
  const fetchShows = async (filters: MapFiltersType = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert filters to URL search params
      const params = new URLSearchParams();
      
      if (filters.searchLocation) {
        params.append('searchLocation', filters.searchLocation);
      }
      // Add show-specific filters here later
      
      const response = await fetch(`/api/map/shows?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch shows: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.shows) {
        setShows(data.shows);
        setFilteredShows(data.shows);
        
        // Update map bounds if available
        if (data.bounds && data.shows.length > 0) {
          const centerLat = (data.bounds.north + data.bounds.south) / 2;
          const centerLng = (data.bounds.east + data.bounds.west) / 2;
          setMapCenter([centerLat, centerLng]);
          setMapZoom(10);
        }
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
      setError(error instanceof Error ? error.message : 'Failed to load shows');
      setShows([]);
      setFilteredShows([]);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data on mount and handle mode changes
  useEffect(() => {
    if (mapMode === 'hosts') {
      fetchHosts();
    } else {
      fetchShows();
    }
  }, [mapMode]);

  // Memoized location data to prevent recreation on every search
  const allLocationsSuggestions = useMemo(() => {
    const allLocations = new Set<string>();
    
    hosts.forEach(host => {
      // Add cities and states
      allLocations.add(`${host.city}, ${host.state}`);
      allLocations.add(host.city);
      allLocations.add(host.state);
      
      // Add keywords
      host.mapLocation?.searchKeywords.forEach(keyword => {
        allLocations.add(keyword);
      });
    });
    
    return Array.from(allLocations).sort();
  }, [hosts]);

  // Optimized suggestion generation with memoized data
  const generateSuggestions = useCallback((query: string): string[] => {
    if (!query.trim()) return [];
    
    const queryLower = query.toLowerCase();
    return allLocationsSuggestions
      .filter(location => location.toLowerCase().includes(queryLower))
      .slice(0, 8); // Limit to 8 suggestions
  }, [allLocationsSuggestions]);

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
    
    // Search will be handled by the API call based on current mode
    const newFilters = { ...currentFilters, searchLocation: searchTerm };
    setCurrentFilters(newFilters);
    
    if (mapMode === 'hosts') {
      fetchHosts(newFilters);
    } else {
      fetchShows(newFilters);
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
          <div className="animate-spin w-8 h-8 border-4 border-[var(--color-french-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
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
                <Button variant="ghost" size="sm" className="hover:bg-[var(--color-mist)] hover:text-[var(--color-french-blue)]">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            
            {/* Map Mode Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex rounded-lg border border-[var(--color-sage)] bg-white p-1">
                <Button
                  variant={mapMode === 'hosts' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setMapMode('hosts')}
                  className={mapMode === 'hosts' 
                    ? 'bg-[var(--color-french-blue)] text-white' 
                    : 'text-neutral-600 hover:text-[var(--color-evergreen)]'
                  }
                >
                  Available Hosts
                </Button>
                <Button
                  variant={mapMode === 'shows' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setMapMode('shows')}
                  className={mapMode === 'shows' 
                    ? 'bg-[var(--color-french-blue)] text-white' 
                    : 'text-neutral-600 hover:text-[var(--color-evergreen)]'
                  }
                >
                  Confirmed Shows
                </Button>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-[var(--color-sage)] bg-white p-1">
                <Button
                  variant={viewMode === 'map' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={viewMode === 'map' ? 'bg-[var(--color-french-blue)] text-white' : 'text-neutral-600 hover:text-[var(--color-evergreen)]'}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Map
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-[var(--color-french-blue)] text-white' : 'text-neutral-600 hover:text-[var(--color-evergreen)]'}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-[var(--color-sage)] hover:bg-[var(--color-mist)]"
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
                className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-sage)] rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-[var(--color-french-blue)] focus:outline-none"
              />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => executeSearch(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-[var(--color-mist)] first:rounded-t-lg last:rounded-b-lg text-sm text-neutral-700 hover:text-[var(--color-evergreen)]"
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
                const clearedFilters = { ...currentFilters, searchLocation: '' };
                setCurrentFilters(clearedFilters);
                if (mapMode === 'hosts') {
                  fetchHosts(clearedFilters);
                } else {
                  fetchShows(clearedFilters);
                }
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
                onFiltersChange={(filters) => {
                  setCurrentFilters(filters);
                  if (mapMode === 'hosts') {
                    fetchHosts(filters);
                  } else {
                    fetchShows(filters);
                  }
                }}
                searchLocation={searchLocation}
                mapMode={mapMode}
                className="h-full"
              />
            </div>
          )}

          {/* Map/List Content */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {viewMode === 'map' ? (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden h-[600px]">
                {error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-red-600 mb-2">{error}</p>
                      <Button onClick={() => {
                        if (mapMode === 'hosts') {
                          fetchHosts(currentFilters);
                        } else {
                          fetchShows(currentFilters);
                        }
                      }} size="sm">
                        Retry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <MapErrorBoundary>
                    <TourPadMapContainer 
                      className="w-full h-full"
                      initialCenter={mapCenter}
                      initialZoom={mapZoom}
                      hosts={mapMode === 'hosts' ? filteredHosts : []}
                    />
                  </MapErrorBoundary>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 h-full flex flex-col">
                {/* List Header with Sorting */}
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      {mapMode === 'hosts' 
                        ? `Venue List (${filteredHosts.length} venues)`
                        : `Show List (${filteredShows.length} shows)`
                      }
                    </h2>
                    
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-600">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="border border-[var(--color-sage)] rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-[var(--color-french-blue)]"
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
                  {mapMode === 'hosts' ? (
                    filteredHosts.length > 0 ? (
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
                    )
                  ) : (
                    filteredShows.length > 0 ? (
                      <div className="space-y-4">
                        {filteredShows.map((show) => (
                          <div key={show.id} className="p-4 border border-neutral-200 rounded-lg">
                            <h3 className="font-semibold">{show.title}</h3>
                            <p className="text-sm text-neutral-600">{show.artistName} at {show.hostName}</p>
                            <p className="text-sm text-neutral-500">{show.date} • {show.city}, {show.state}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-neutral-400 mb-2">
                          <MapPin className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">No shows found</h3>
                        <p className="text-neutral-600">
                          {searchLocation 
                            ? `No shows match "${searchLocation}". Try adjusting your search or filters.`
                            : 'No confirmed shows match your current filters.'
                          }
                        </p>
                      </div>
                    )
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