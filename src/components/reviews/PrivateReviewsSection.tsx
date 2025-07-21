'use client';
import { useState } from 'react';
import { 
  Star,
  Eye,
  EyeOff,
  Calendar,
  Music,
  Home,
  MessageCircle,
  Shield,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getUserReviews } from '@/data/testReviews';

interface PrivateReviewsSectionProps {
  userId: string;
  userType: 'artist' | 'host';
}

export function PrivateReviewsSection({ userId, userType }: PrivateReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  
  // Get all reviews for this user, then filter for private ones
  const allReviews = getUserReviews(userId, userType);
  const privateReviews = allReviews.filter(review => !review.isPublic);
  
  // Sort by most recent first
  const sortedReviews = [...privateReviews].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 2);
  
  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };
  
  if (privateReviews.length === 0) {
    return null; // Don't show section if no private reviews
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Private Feedback
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Constructive feedback shared privately with you
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              <EyeOff className="w-3 h-3 mr-1" />
              {privateReviews.length} private
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">About Private Reviews</h4>
              <p className="text-sm text-blue-800">
                These reviews are only visible to you and administrators. They contain constructive feedback 
                from {userType === 'artist' ? 'hosts' : 'artists'} to help you improve future collaborations.
              </p>
            </div>
          </div>
        </div>
        
        {/* Reviews List */}
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
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
                      <Badge variant="secondary" className="bg-white text-gray-700 text-xs">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Private
                      </Badge>
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
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="pl-13">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {expandedReviews.has(review.id) ? review.feedback : 
                      review.feedback.length > 200 ? 
                        `${review.feedback.substring(0, 200)}...` : 
                        review.feedback
                    }
                  </p>
                  
                  {review.feedback.length > 200 && (
                    <button
                      onClick={() => toggleExpanded(review.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2 flex items-center"
                    >
                      {expandedReviews.has(review.id) ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show more
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Response section - placeholder for future implementation */}
                {!review.response && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Respond privately
                    </Button>
                  </div>
                )}
                
                {review.response && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-green-900">
                          Your response:
                        </span>
                        <span className="text-xs text-green-600 ml-2">
                          {new Date(review.response.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-green-800">
                        {review.response.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Show More/Less Button */}
        {privateReviews.length > 2 && (
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
                  Show all {privateReviews.length} private reviews
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}