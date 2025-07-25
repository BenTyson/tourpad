'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FanConcertReviewModal } from '@/components/reviews/FanConcertReviewModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Star,
  ExternalLink,
  Music,
  ChevronRight
} from 'lucide-react';

interface FanConcert {
  rsvpId: string;
  rsvpStatus: 'PENDING' | 'APPROVED' | 'DECLINED' | 'WAITLISTED';
  guestsCount: number;
  specialRequests?: string;
  rsvpDate: string;
  statusUpdatedAt: string;
  hasReview?: boolean;
  reviewId?: string;
  concert: {
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
    location: string;
  };
}

interface FanConcertsListProps {
  type: 'upcoming' | 'past';
  limit?: number;
  showPagination?: boolean;
}

export default function FanConcertsList({ 
  type, 
  limit = 10, 
  showPagination = true 
}: FanConcertsListProps) {
  const { data: session } = useSession();
  const [concerts, setConcerts] = useState<FanConcert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConcertForReview, setSelectedConcertForReview] = useState<FanConcert | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: limit,
    offset: 0,
    hasMore: false
  });

  useEffect(() => {
    fetchConcerts();
  }, [type, limit]);

  const fetchConcerts = async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = type === 'upcoming' 
        ? '/api/fan/concerts/upcoming' 
        : '/api/fan/concerts/past';
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setConcerts(data.concerts || []);
        setPagination(data.pagination || {
          total: 0,
          limit: limit,
          offset: offset,
          hasMore: false
        });
      } else {
        throw new Error(data.error || 'Failed to fetch concerts');
      }
    } catch (err) {
      console.error(`Error fetching ${type} concerts:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load concerts');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = (review: any) => {
    // Refresh the concerts list to update the hasReview status
    fetchConcerts();
  };

  const handleReviewModalClose = () => {
    setSelectedConcertForReview(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'DECLINED': return 'bg-red-100 text-red-800';
      case 'WAITLISTED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchConcerts()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (concerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Music className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            {type === 'upcoming' ? 'No Upcoming Concerts' : 'No Past Concerts'}
          </h3>
          <p className="text-neutral-600 mb-4">
            {type === 'upcoming' 
              ? "You haven't reserved any concerts yet. Browse available shows to get started!"
              : "You haven't attended any concerts yet. Your concert history will appear here."
            }
          </p>
          {type === 'upcoming' && (
            <Link href="/calendar">
              <Button>Browse Concerts</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {concerts.map((item) => (
        <Card key={item.rsvpId} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {/* Artist/Venue Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                {item.concert.artist.pressPhoto ? (
                  <img 
                    src={item.concert.artist.pressPhoto} 
                    alt={item.concert.artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-6 h-6 text-neutral-400" />
                  </div>
                )}
              </div>

              {/* Concert Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                      {item.concert.title || `${item.concert.artist.name} Concert`}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(item.concert.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(item.concert.startTime)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.concert.location}
                      </div>
                    </div>

                    {/* Artist & Host Info */}
                    <div className="flex items-center space-x-6 text-sm mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1 text-neutral-500" />
                        <span className="text-neutral-700">
                          {item.concert.artist.stageName || item.concert.artist.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-neutral-500" />
                        <span className="text-neutral-700">
                          {item.concert.host.venueName || item.concert.host.name}
                        </span>
                      </div>
                      {item.guestsCount > 1 && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-neutral-500" />
                          <span className="text-neutral-700">
                            {item.guestsCount} guests
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Concert Description */}
                    {item.concert.description && (
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                        {item.concert.description}
                      </p>
                    )}

                    {/* Special Requests */}
                    {item.specialRequests && (
                      <div className="text-sm text-neutral-600 mb-3">
                        <span className="font-medium">Special Requests:</span> {item.specialRequests}
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <Badge className={getStatusColor(item.rsvpStatus)}>
                      {item.rsvpStatus.toLowerCase()}
                    </Badge>
                    
                    {item.concert.doorFee && (
                      <div className="text-sm text-neutral-600">
                        ${item.concert.doorFee}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-2">
                      <Link href={`/concerts/${item.concert.id}`}>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </Link>
                      
                      {type === 'past' && !item.hasReview && (
                        <Button 
                          size="sm"
                          onClick={() => setSelectedConcertForReview(item)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      )}

                      {type === 'past' && item.hasReview && (
                        <Link href={`/reviews/${item.reviewId}`}>
                          <Button size="sm" variant="outline">
                            <Star className="w-4 h-4 mr-1" />
                            View Review
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {showPagination && pagination.hasMore && (
        <div className="text-center pt-4">
          <Button 
            onClick={() => fetchConcerts(pagination.offset + pagination.limit)}
            variant="outline"
          >
            Load More
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Results Summary */}
      {concerts.length > 0 && (
        <div className="text-center text-sm text-neutral-500 pt-2">
          Showing {concerts.length} of {pagination.total} concerts
        </div>
      )}

      {/* Review Modal */}
      {selectedConcertForReview && (
        <FanConcertReviewModal
          concert={{
            id: selectedConcertForReview.concert.id,
            artistId: selectedConcertForReview.concert.artist.id,
            hostId: selectedConcertForReview.concert.host.id,
            artistName: selectedConcertForReview.concert.artist.stageName || selectedConcertForReview.concert.artist.name,
            hostName: selectedConcertForReview.concert.host.name,
            venueName: selectedConcertForReview.concert.host.venueName || selectedConcertForReview.concert.host.name,
            eventDate: selectedConcertForReview.concert.date,
            attendeeCount: 0, // Not needed for review modal
            ticketPrice: selectedConcertForReview.concert.doorFee
          }}
          onClose={handleReviewModalClose}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}