'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Search, 
  Filter, 
  Music, 
  MapPin, 
  Star, 
  Calendar,
  Users,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Play,
  ExternalLink
} from 'lucide-react';

interface Artist {
  id: string;
  userId: string;
  name: string;
  stageName?: string;
  genres: string[];
  profileImageUrl?: string;
  pressPhoto?: string;
  photos?: Array<{
    id: string;
    fileUrl: string;
    title?: string;
    category: string;
  }>;
  travelRadius?: number;
  typicalSetLength?: number;
  minGuarantee?: number;
  equipmentNeeds: string[];
  videoLinks?: any[];
  stats: {
    totalBookings: number;
    totalReviews: number;
    lastPerformed?: {
      date: string;
      venueName?: string;
      city: string;
      state: string;
    } | null;
  };
  approvedAt: string;
  createdAt: string;
}

const MUSIC_GENRES = [
  'Rock', 'Pop', 'Hip-Hop', 'R&B', 'Country', 'Jazz', 'Blues', 'Folk', 
  'Classical', 'Electronic', 'Indie', 'Alternative', 'Reggae', 'World Music',
  'Punk', 'Metal', 'Funk', 'Soul', 'Gospel', 'Latin'
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'popular', label: 'Most Popular' }
];

export default function ArtistDirectory() {
  const { data: session } = useSession();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    sortby: 'name'
  });

  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false
  });

  useEffect(() => {
    fetchArtists();
  }, [filters, pagination.offset]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString()
      });

      // Add filters
      if (filters.search) params.append('search', filters.search);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.sortby) params.append('sortby', filters.sortby);

      const response = await fetch(`/api/artists?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setArtists(data.artists || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          hasMore: data.pagination?.hasMore || false
        }));
      }
    } catch (err) {
      console.error('Error fetching artists:', err);
      setError(err instanceof Error ? err.message : 'Failed to load artists');
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
      genre: '',
      sortby: 'name'
    });
  };

  const handlePrevPage = () => {
    setPagination(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit)
    }));
  };

  const handleNextPage = () => {
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

  if (loading && artists.length === 0) {
    return (
      <div className="space-y-6">
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
      {/* Filters Toggle */}
      <div className="flex justify-end">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Search Artists
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Artist name or genre..."
                  />
                </div>
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

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortby}
                  onChange={(e) => handleFilterChange('sortby', e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
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
            <>Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} artists</>
          ) : (
            'No artists found'
          )}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchArtists} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Artists Grid */}
      {artists.length === 0 && !loading && !error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Music className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No Artists Found</h3>
            <p className="text-neutral-600 mb-4">
              Try adjusting your filters or check back later for new artists.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Card 
              key={artist.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                {/* Artist Images with Horizontal Scroll */}
                <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200">
                  {(() => {
                    // Collect all available photos
                    const allPhotos = [];
                    if (artist.pressPhoto) {
                      allPhotos.push({ url: artist.pressPhoto, title: 'Press Photo' });
                    }
                    if (artist.photos && artist.photos.length > 0) {
                      allPhotos.push(...artist.photos.map(photo => ({ 
                        url: photo.fileUrl, 
                        title: photo.title || 'Performance Photo' 
                      })));
                    }

                    if (allPhotos.length === 0) {
                      return (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-12 h-12 text-neutral-400" />
                        </div>
                      );
                    }

                    if (allPhotos.length === 1) {
                      return (
                        <img 
                          src={allPhotos[0].url} 
                          alt={artist.stageName || artist.name}
                          className="w-full h-full object-cover"
                        />
                      );
                    }

                    // Multiple photos - horizontal scroll with arrows
                    return (
                      <div className="relative w-full h-full overflow-hidden group">
                        <div 
                          id={`photo-scroll-${artist.id}`}
                          className="flex h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
                        >
                          {allPhotos.map((photo, index) => (
                            <div key={index} className="flex-shrink-0 w-full h-full snap-start">
                              <img 
                                src={photo.url} 
                                alt={`${artist.stageName || artist.name} - ${photo.title}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        
                        {/* Navigation Arrows */}
                        {allPhotos.length > 1 && (
                          <>
                            {/* Left Arrow */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const container = document.getElementById(`photo-scroll-${artist.id}`);
                                if (container) {
                                  container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
                                }
                              }}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                              aria-label="Previous photo"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            
                            {/* Right Arrow */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const container = document.getElementById(`photo-scroll-${artist.id}`);
                                if (container) {
                                  container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
                                }
                              }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                              aria-label="Next photo"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        
                        {/* Photo count badge */}
                        {allPhotos.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                            {allPhotos.length} photos
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  
                  {/* Play button overlay if video available */}
                  {artist.videoLinks && artist.videoLinks.length > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-neutral-800 ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Artist Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-1">
                    {artist.stageName || artist.name}
                  </h3>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {artist.genres.slice(0, 3).map(genre => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                    {artist.genres.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{artist.genres.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {artist.stats.totalBookings} shows played
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      {artist.stats.totalReviews} reviews
                    </div>
                    {artist.stats.lastPerformed && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Last: {artist.stats.lastPerformed.city}, {artist.stats.lastPerformed.state}
                      </div>
                    )}
                  </div>

                  {/* Performance Details */}
                  <div className="space-y-1 text-xs text-neutral-500 mb-4">
                    {artist.typicalSetLength && (
                      <p>Set length: {artist.typicalSetLength} minutes</p>
                    )}
                    {artist.travelRadius && (
                      <p>Travel radius: {artist.travelRadius} miles</p>
                    )}
                    {artist.minGuarantee && (
                      <p>Minimum guarantee: ${artist.minGuarantee}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Verified
                    </Badge>
                    
                    <Link href={`/artists/${artist.id}`}>
                      <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevPage}
            disabled={pagination.offset === 0 || loading}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-600">
              Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
          </div>
          
          <Button
            onClick={handleNextPage}
            disabled={!pagination.hasMore || loading}
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}