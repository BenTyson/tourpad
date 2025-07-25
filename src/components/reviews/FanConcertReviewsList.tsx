'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Review {
  id: string;
  concertId: string;
  fanId: string;
  artistId: string;
  hostId: string;
  artistRating: number;
  hostRating: number;
  overallRating: number;
  artistFeedback?: string;
  hostFeedback?: string;
  overallFeedback: string;
  isPublic: boolean;
  attendedDate: string;
  wouldRecommend: boolean;
  createdAt: string;
  fan: {
    id: string;
    name: string;
    profileImageUrl?: string;
  };
  artist: {
    id: string;
    name: string;
    stageName?: string;
    profileImageUrl?: string;
  };
  host: {
    id: string;
    name: string;
    venueName?: string;
    profileImageUrl?: string;
  };
  concert: {
    id: string;
    title?: string;
    date: string;
    artistName: string;
    hostName: string;
    venueName?: string;
  };
}

interface FanConcertReviewsListProps {
  concertId?: string;
  artistId?: string;
  hostId?: string;
  fanId?: string;
  limit?: number;
  showPagination?: boolean;
  className?: string;
}

export default function FanConcertReviewsList({
  concertId,
  artistId,
  hostId,
  fanId,
  limit = 10,
  showPagination = true,
  className = ""
}: FanConcertReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit,
    offset: 0,
    hasMore: false
  });

  useEffect(() => {
    fetchReviews();
  }, [concertId, artistId, hostId, fanId, pagination.offset]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString()
      });

      if (concertId) params.append('concertId', concertId);
      if (artistId) params.append('artistId', artistId);
      if (hostId) params.append('hostId', hostId);
      if (fanId) params.append('fanId', fanId);

      const response = await fetch(`/api/reviews?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          hasMore: data.pagination?.hasMore || false
        }));
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
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

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-sand text-sand' : 'text-neutral-300'
          }`}
        />
      ))}
      <span className="text-sm text-neutral-600 ml-1">({rating})</span>
    </div>
  );

  if (loading && reviews.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                    <div className="h-16 bg-neutral-200 rounded"></div>
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
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchReviews} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No Reviews Yet</h3>
          <p className="text-neutral-600">
            {concertId 
              ? "Be the first to review this concert!"
              : "No reviews found for the selected criteria."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    {review.fan.profileImageUrl ? (
                      <img 
                        src={review.fan.profileImageUrl} 
                        alt={review.fan.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <Users className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{review.fan.name}</h4>
                    <p className="text-sm text-neutral-600">
                      Attended {formatDate(review.attendedDate)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={review.overallRating} />
                  <p className="text-xs text-neutral-500 mt-1">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>

              {/* Concert Info */}
              <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {review.concert.title || `${review.concert.artistName} Live`}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {review.concert.venueName || review.concert.hostName}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {formatDate(review.concert.date)}
                  </div>
                </div>
              </div>

              {/* Ratings Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-neutral-700 mb-1">Artist Performance</p>
                  <StarRating rating={review.artistRating} />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-700 mb-1">Venue & Hosting</p>
                  <StarRating rating={review.hostRating} />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-700 mb-1">Overall Experience</p>
                  <StarRating rating={review.overallRating} />
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-neutral-900 mb-1">Overall Experience</h5>
                  <p className="text-neutral-700 text-sm leading-relaxed">
                    {review.overallFeedback}
                  </p>
                </div>
                
                {review.artistFeedback && (
                  <div>
                    <h5 className="text-sm font-medium text-neutral-900 mb-1">About the Artist</h5>
                    <p className="text-neutral-700 text-sm leading-relaxed">
                      {review.artistFeedback}
                    </p>
                  </div>
                )}
                
                {review.hostFeedback && (
                  <div>
                    <h5 className="text-sm font-medium text-neutral-900 mb-1">About the Venue</h5>
                    <p className="text-neutral-700 text-sm leading-relaxed">
                      {review.hostFeedback}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center space-x-2">
                  {review.wouldRecommend && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Recommends
                    </Badge>
                  )}
                  {!review.isPublic && (
                    <Badge variant="secondary" className="text-xs">
                      Private Review
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} reviews
          </p>
          <div className="flex space-x-2">
            <Button
              onClick={handlePrevPage}
              disabled={pagination.offset === 0 || loading}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
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
        </div>
      )}
    </div>
  );
}