'use client';
import { useState } from 'react';
import { 
  Star,
  Calendar,
  MapPin,
  Music,
  Home,
  Heart,
  Users,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FanConcertReview } from './FanConcertReviewModal';

interface FanConcertReviewCardProps {
  review: FanConcertReview;
  artistName: string;
  hostName: string;
  venueName: string;
  showFullReview?: boolean;
  showFanName?: boolean;
  fanName?: string;
}

export function FanConcertReviewCard({ 
  review, 
  artistName, 
  hostName, 
  venueName,
  showFullReview = false,
  showFanName = false,
  fanName = 'Anonymous Fan'
}: FanConcertReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(showFullReview);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`${starSize} ${
              star <= rating 
                ? 'fill-sand text-sand' 
                : 'text-neutral-300'
            }`}
          />
        ))}
        <span className="text-sm text-neutral-600 ml-1">({rating})</span>
      </div>
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-sage" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-evergreen">{artistName}</h3>
                <span className="text-neutral-400">•</span>
                <span className="text-sm text-neutral-600">{venueName}</span>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1 text-xs text-neutral-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(review.attendedDate)}</span>
                </div>
                {showFanName && (
                  <div className="flex items-center space-x-1 text-xs text-neutral-500">
                    <Users className="w-3 h-3" />
                    <span>{fanName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {review.isPublic ? (
              <Eye className="w-4 h-4 text-sage" />
            ) : (
              <EyeOff className="w-4 h-4 text-neutral-400" />
            )}
            {review.wouldRecommend && (
              <Heart className="w-4 h-4 text-sand fill-sand" />
            )}
          </div>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Music className="w-4 h-4 text-sage" />
              <span className="text-sm font-medium text-evergreen">Artist</span>
            </div>
            <StarRating rating={review.artistRating} />
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-french-blue" />
              <span className="text-sm font-medium text-evergreen">Venue</span>
            </div>
            <StarRating rating={review.hostRating} />
          </div>
          <div className="flex items-center justify-between p-3 bg-sage/5 rounded-lg border border-sage/20">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-sand fill-sand" />
              <span className="text-sm font-medium text-evergreen">Overall</span>
            </div>
            <StarRating rating={review.overallRating} />
          </div>
        </div>

        {/* Overall Feedback */}
        <div className="mb-4">
          <p className="text-neutral-700 leading-relaxed">
            {isExpanded || review.overallFeedback.length <= 200 
              ? review.overallFeedback 
              : truncateText(review.overallFeedback, 200)
            }
          </p>
          {review.overallFeedback.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sage hover:text-sage/80 p-0 h-auto font-normal"
            >
              {isExpanded ? (
                <span className="flex items-center space-x-1">
                  <span>Show less</span>
                  <ChevronUp className="w-3 h-3" />
                </span>
              ) : (
                <span className="flex items-center space-x-1">
                  <span>Read more</span>
                  <ChevronDown className="w-3 h-3" />
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Detailed Feedback (when expanded) */}
        {isExpanded && (review.artistFeedback || review.hostFeedback) && (
          <div className="border-t border-neutral-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {review.artistFeedback && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Music className="w-4 h-4 text-sage" />
                    <span className="text-sm font-medium text-evergreen">
                      Artist Performance
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {review.artistFeedback}
                  </p>
                </div>
              )}
              {review.hostFeedback && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-french-blue" />
                    <span className="text-sm font-medium text-evergreen">
                      Venue Experience
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {review.hostFeedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center space-x-4">
            {review.wouldRecommend && (
              <Badge className="bg-sage/10 text-sage border-sage/20">
                <Heart className="w-3 h-3 mr-1 fill-sage" />
                Recommended
              </Badge>
            )}
            <span className="text-xs text-neutral-500">
              Review from {formatDate(review.createdAt)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {!review.isPublic && (
              <Badge className="bg-neutral-100 text-neutral-600">
                Private
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}