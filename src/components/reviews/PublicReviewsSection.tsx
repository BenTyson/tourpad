'use client';
import { useState } from 'react';
import { 
  Star,
  MessageCircle,
  Calendar,
  Music,
  Home,
  Filter,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPublicReviews, calculateAverageRating } from '@/data/testReviews';

interface PublicReviewsSectionProps {
  userId: string;
  userType: 'artist' | 'host';
  userName: string;
}

export function PublicReviewsSection({ userId, userType, userName }: PublicReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  
  const publicReviews = getPublicReviews(userId, userType);
  const averageRating = calculateAverageRating(userId, userType);
  
  // Sort reviews based on selected criteria
  const sortedReviews = [...publicReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });
  
  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);
  
  // Calculate rating distribution
  const ratingDistribution = {
    5: publicReviews.filter(r => r.rating === 5).length,
    4: publicReviews.filter(r => r.rating === 4).length,
    3: publicReviews.filter(r => r.rating === 3).length,
    2: publicReviews.filter(r => r.rating === 2).length,
    1: publicReviews.filter(r => r.rating === 1).length,
  };
  
  if (publicReviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <Badge variant="secondary">No reviews yet</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">
              Reviews from {userType === 'artist' ? 'hosts' : 'artists'} will appear here once {userName} completes their first show.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Reviews</h2>
            <p className="text-sm text-gray-600 mt-1">
              What {userType === 'artist' ? 'hosts' : 'artists'} are saying about {userName}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {publicReviews.length} public review{publicReviews.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Rating Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {publicReviews.length} review{publicReviews.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center text-sm">
                  <span className="w-3 text-right">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current ml-1 mr-2" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${publicReviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / publicReviews.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-gray-600 w-8 text-right">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Most recent</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
            </select>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Eye className="w-4 h-4 mr-1" />
            Public reviews only
          </div>
        </div>
        
        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
                    {review.reviewerType === 'artist' ? (
                      <Music className="w-5 h-5 text-white" />
                    ) : (
                      <Home className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {review.reviewerType === 'artist' ? 'Artist' : 'Host'}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(review.showDate).toLocaleDateString()}</span>
                      {review.venueName && (
                        <>
                          <span>•</span>
                          <span>at {review.venueName}</span>
                        </>
                      )}
                      {review.artistName && (
                        <>
                          <span>•</span>
                          <span>featuring {review.artistName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-3">
                {review.feedback}
              </p>
              
              {review.response && (
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      Response from {userName}:
                    </span>
                    <span className="text-xs text-blue-600 ml-2">
                      {new Date(review.response.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">
                    {review.response.text}
                  </p>
                </div>
              )}
              
              {review.helpfulVotes && review.helpfulVotes > 0 && (
                <div className="flex items-center mt-3 text-sm text-gray-600">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  <span>{review.helpfulVotes} people found this helpful</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Show More/Less Button */}
        {publicReviews.length > 3 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show all {publicReviews.length} reviews
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}