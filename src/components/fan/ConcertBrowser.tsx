'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import ConcertBookingModal from './ConcertBookingModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  DollarSign,
  Music,
  Filter,
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface Concert {
  id: string;
  title?: string;
  description?: string;
  date: string;
  startTime: string;
  endTime?: string;
  maxCapacity: number;
  doorFee?: number;
  status: string;
  isPrivate: boolean;
  requiresApproval: boolean;
  artist: {
    id: string;
    name: string;
    stageName?: string;
    profileImageUrl?: string;
    pressPhoto?: string;
  };
  host: {
    id: string;
    name: string;
    venueName?: string;
    city: string;
    state: string;
    profileImageUrl?: string;
  };
  currentRSVPCount?: number;
  userRSVP?: {
    id: string;
    status: string;
    guestsCount: number;
  } | null;
}

const MUSIC_GENRES = [
  'Rock', 'Pop', 'Hip-Hop', 'R&B', 'Country', 'Jazz', 'Blues', 'Folk', 
  'Classical', 'Electronic', 'Indie', 'Alternative', 'Reggae', 'World Music',
  'Punk', 'Metal', 'Funk', 'Soul', 'Gospel', 'Latin'
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function ConcertBrowser() {
  const { data: session } = useSession();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    genre: '',
    dateFrom: '',
    dateTo: '',
    maxFee: '',
    availableOnly: true,
    hasSpace: true
  });

  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false
  });

  useEffect(() => {
    fetchConcerts();
  }, [filters, pagination.offset]);

  const fetchConcerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
        status: 'SCHEDULED', // Only show scheduled concerts
        includeUserRSVP: 'true'
      });

      // Add filters
      if (filters.search) params.append('search', filters.search);
      if (filters.state) params.append('state', filters.state);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.maxFee) params.append('maxFee', filters.maxFee);
      if (filters.availableOnly) params.append('availableOnly', 'true');

      // Use dedicated concert discovery API
      const response = await fetch(`/api/concerts?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const transformedConcerts = (data.concerts || []).map((concert: any) => ({
          id: concert.id,
          title: concert.title,
          description: concert.description,
          date: concert.date,
          startTime: concert.startTime,
          endTime: concert.endTime,
          maxCapacity: concert.maxCapacity || 50,
          doorFee: concert.doorFee,
          status: concert.status,
          isPrivate: concert.isPrivate || false,
          requiresApproval: concert.requiresApproval !== false,
          artist: {
            id: concert.artist?.id,
            name: concert.artist?.name,
            stageName: concert.artist?.stageName,
            profileImageUrl: concert.artist?.profileImageUrl,
            pressPhoto: concert.artist?.pressPhoto
          },
          host: {
            id: concert.host?.id,
            name: concert.host?.name,
            venueName: concert.host?.venueName,
            city: concert.host?.city,
            state: concert.host?.state,
            profileImageUrl: concert.host?.profileImageUrl
          },
          currentRSVPCount: concert.currentRSVPCount || 0,
          userRSVP: concert.userRSVP || null
        }));
        
        setConcerts(transformedConcerts);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || transformedConcerts.length,
          hasMore: data.pagination?.hasMore || false
        }));
      }
    } catch (err) {
      console.error('Error fetching concerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load concerts');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      state: '',
      genre: '',
      dateFrom: '',
      dateTo: '',
      maxFee: '',
      availableOnly: true,
      hasSpace: true
    });
  };

  const loadMore = () => {
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading && concerts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-neutral-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Discover Concerts</h2>
          <p className="text-neutral-600 mt-1">Find intimate house concerts near you</p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {showFilters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Artist, venue, or concert title..."
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All States</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Genre
                </label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Genres</option>
                  {MUSIC_GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Max Fee */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Max Door Fee ($)
                </label>
                <input
                  type="number"
                  value={filters.maxFee}
                  onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="50"
                  min="0"
                />
              </div>
            </div>

            {/* Filter Options */}
            <div className="mt-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.availableOnly}
                  onChange={(e) => handleFilterChange('availableOnly', e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-neutral-700">Only show available concerts</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hasSpace}
                  onChange={(e) => handleFilterChange('hasSpace', e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-neutral-700">Has available spaces</span>
              </label>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          {pagination.total > 0 ? (
            <>Showing {concerts.length} of {pagination.total} concerts</>
          ) : (
            'No concerts found'
          )}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchConcerts} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Concerts Grid */}
      {concerts.length === 0 && !loading && !error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Music className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No Concerts Found</h3>
            <p className="text-neutral-600 mb-4">
              Try adjusting your filters or check back later for new concerts.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concerts.map((concert) => {
            const availableSpaces = concert.maxCapacity - (concert.currentRSVPCount || 0);
            const isPastEvent = new Date(concert.date) < new Date();
            const hasRSVP = concert.userRSVP !== null;

            return (
              <Card 
                key={concert.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedConcert(concert)}
              >
                <CardContent className="p-0">
                  {/* Concert Image */}
                  <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200">
                    {concert.artist.pressPhoto ? (
                      <img 
                        src={concert.artist.pressPhoto} 
                        alt={concert.artist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-12 h-12 text-neutral-400" />
                      </div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 space-y-1">
                      {hasRSVP && (
                        <Badge className={`${
                          concert.userRSVP?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          concert.userRSVP?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        } text-xs shadow-sm`}>
                          {concert.userRSVP?.status}
                        </Badge>
                      )}
                      {availableSpaces <= 0 && (
                        <Badge className="bg-red-100 text-red-800 text-xs shadow-sm">
                          SOLD OUT
                        </Badge>
                      )}
                    </div>

                    {/* Door Fee */}
                    {concert.doorFee && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-neutral-800 text-xs shadow-sm">
                          ${concert.doorFee}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Concert Details */}
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-1">
                      {concert.title || `${concert.artist.stageName || concert.artist.name} Live`}
                    </h3>

                    <div className="space-y-2 text-sm text-neutral-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(concert.date)} at {formatTime(concert.startTime)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {concert.host.venueName || concert.host.name}, {concert.host.city}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {concert.artist.stageName || concert.artist.name}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {availableSpaces} of {concert.maxCapacity} spots available
                      </div>
                    </div>

                    {concert.description && (
                      <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
                        {concert.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {concert.requiresApproval && (
                          <Badge variant="secondary" className="text-xs">
                            Approval Required
                          </Badge>
                        )}
                        {concert.isPrivate && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                      </div>
                      
                      <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
                        {hasRSVP ? 'Manage RSVP' : 'RSVP'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {pagination.hasMore && (
        <div className="text-center pt-4">
          <Button 
            onClick={loadMore}
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Load More Concerts'}
          </Button>
        </div>
      )}

      {/* Concert Booking Modal */}
      {selectedConcert && (
        <ConcertBookingModal
          concert={selectedConcert}
          isOpen={!!selectedConcert}
          onClose={() => setSelectedConcert(null)}
          onBookingSuccess={() => {
            fetchConcerts(); // Refresh the list
            setSelectedConcert(null);
          }}
        />
      )}
    </div>
  );
}