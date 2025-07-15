'use client';
import { useState } from 'react';
import { 
  Star,
  X,
  Save,
  AlertCircle,
  Eye,
  EyeOff,
  Music,
  Home,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ReviewFormModalProps {
  booking: {
    id: string;
    artistId: string;
    hostId: string;
    artistName: string;
    hostName: string;
    venueName: string;
    eventDate: string;
    attendeeCount: number;
  };
  reviewerType: 'artist' | 'host';
  onClose: () => void;
}

export function ReviewFormModal({ booking, reviewerType, onClose }: ReviewFormModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reviewedName = reviewerType === 'artist' ? booking.hostName : booking.artistName;
  const reviewedEntity = reviewerType === 'artist' ? booking.venueName : booking.artistName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Validation
    const validationErrors: Record<string, string> = {};
    
    if (rating === 0) {
      validationErrors.rating = 'Please select a rating';
    }
    
    if (!feedback.trim()) {
      validationErrors.feedback = 'Please provide feedback';
    } else if (feedback.trim().length < 10) {
      validationErrors.feedback = 'Feedback must be at least 10 characters';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Submit to backend API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Review submission error:', error);
      setErrors({ general: 'An error occurred while submitting your review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Review Submitted!
            </h3>
            <p className="text-gray-600">
              Your review has been submitted successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Leave a Review
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Share your experience with {reviewedName}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {reviewerType === 'artist' ? (
                  <Home className="w-5 h-5 text-blue-600" />
                ) : (
                  <Music className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{reviewedEntity}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(booking.eventDate).toLocaleDateString()} • {booking.attendeeCount} guests
                </p>
                <p className="text-sm text-gray-600">
                  {reviewerType === 'artist' 
                    ? `Performance at ${booking.venueName}`
                    : `Show by ${booking.artistName}`
                  }
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-colors"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {(hoverRating || rating) > 0 && (
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {ratingLabels[(hoverRating || rating) as keyof typeof ratingLabels]}
                  </span>
                )}
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
              )}
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Experience
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                placeholder={
                  reviewerType === 'artist'
                    ? 'Tell us about your experience performing at this venue. How was the host, the space, the equipment, and the audience?'
                    : 'Tell us about your experience hosting this artist. How was their professionalism, performance quality, and interaction with guests?'
                }
              />
              <div className="flex items-center justify-between mt-1">
                <div>
                  {errors.feedback && (
                    <p className="text-sm text-red-600">{errors.feedback}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {feedback.length}/500 characters
                </p>
              </div>
            </div>

            {/* Public/Private Toggle */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-900 mb-2">Review Visibility</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Public</span>
                      </div>
                    </label>
                    <p className="text-sm text-yellow-800 ml-7">
                      Your review will be visible on their profile page and help other {reviewerType === 'artist' ? 'artists' : 'hosts'} make informed decisions.
                    </p>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Private</span>
                      </div>
                    </label>
                    <p className="text-sm text-yellow-800 ml-7">
                      Your review will only be visible to you, the {reviewerType === 'artist' ? 'host' : 'artist'} you're reviewing, and administrators.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-red-800">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Submit Review
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}