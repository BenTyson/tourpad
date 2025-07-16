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
  Check,
  Heart,
  Users,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface FanConcertReviewModalProps {
  concert: {
    id: string;
    artistId: string;
    hostId: string;
    artistName: string;
    hostName: string;
    venueName: string;
    eventDate: string;
    attendeeCount: number;
    ticketPrice?: number;
  };
  onClose: () => void;
  onSubmit: (review: FanConcertReview) => void;
}

export interface FanConcertReview {
  id: string;
  concertId: string;
  fanId: string;
  artistId: string;
  hostId: string;
  artistRating: number;
  hostRating: number;
  overallRating: number;
  artistFeedback: string;
  hostFeedback: string;
  overallFeedback: string;
  isPublic: boolean;
  attendedDate: string;
  wouldRecommend: boolean;
  createdAt: string;
}

export function FanConcertReviewModal({ concert, onClose, onSubmit }: FanConcertReviewModalProps) {
  const [artistRating, setArtistRating] = useState(0);
  const [artistHoverRating, setArtistHoverRating] = useState(0);
  const [hostRating, setHostRating] = useState(0);
  const [hostHoverRating, setHostHoverRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [overallHoverRating, setOverallHoverRating] = useState(0);
  
  const [artistFeedback, setArtistFeedback] = useState('');
  const [hostFeedback, setHostFeedback] = useState('');
  const [overallFeedback, setOverallFeedback] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleStarClick = (
    rating: number, 
    type: 'artist' | 'host' | 'overall'
  ) => {
    switch (type) {
      case 'artist':
        setArtistRating(rating);
        break;
      case 'host':
        setHostRating(rating);
        break;
      case 'overall':
        setOverallRating(rating);
        break;
    }
  };

  const handleStarHover = (
    rating: number, 
    type: 'artist' | 'host' | 'overall'
  ) => {
    switch (type) {
      case 'artist':
        setArtistHoverRating(rating);
        break;
      case 'host':
        setHostHoverRating(rating);
        break;
      case 'overall':
        setOverallHoverRating(rating);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (artistRating === 0) {
      newErrors.artistRating = 'Artist rating is required';
    }
    if (hostRating === 0) {
      newErrors.hostRating = 'Host rating is required';
    }
    if (overallRating === 0) {
      newErrors.overallRating = 'Overall rating is required';
    }
    if (overallFeedback.trim().length < 10) {
      newErrors.overallFeedback = 'Please provide at least 10 characters of feedback';
    }
    if (overallFeedback.trim().length > 1000) {
      newErrors.overallFeedback = 'Feedback must be less than 1000 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const review: FanConcertReview = {
      id: `review-${Date.now()}`,
      concertId: concert.id,
      fanId: 'fan1', // Will be from auth context
      artistId: concert.artistId,
      hostId: concert.hostId,
      artistRating,
      hostRating,
      overallRating,
      artistFeedback: artistFeedback.trim(),
      hostFeedback: hostFeedback.trim(),
      overallFeedback: overallFeedback.trim(),
      isPublic,
      attendedDate: concert.eventDate,
      wouldRecommend,
      createdAt: new Date().toISOString()
    };

    onSubmit(review);
    setShowSuccess(true);
    
    // Auto-close after success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const StarRating = ({ 
    rating, 
    hoverRating, 
    onRate, 
    onHover, 
    onLeave,
    disabled = false 
  }: {
    rating: number;
    hoverRating: number;
    onRate: (rating: number) => void;
    onHover: (rating: number) => void;
    onLeave: () => void;
    disabled?: boolean;
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={onLeave}
          disabled={disabled}
          className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
        >
          <Star 
            className={`w-6 h-6 ${
              star <= (hoverRating || rating) 
                ? 'fill-sand text-sand' 
                : 'text-neutral-300'
            } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'} transition-all duration-200`}
          />
        </button>
      ))}
    </div>
  );

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-sage" />
            </div>
            <h3 className="text-lg font-semibold text-evergreen mb-2">
              Review Submitted!
            </h3>
            <p className="text-neutral-600 mb-4">
              Thank you for sharing your experience. Your review helps build our community.
            </p>
            <div className="text-sm text-neutral-500">
              Closing automatically...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b border-mist bg-gradient-to-r from-sage/5 to-french-blue/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-evergreen">
                    Review Concert Experience
                  </h2>
                  <p className="text-neutral-600 text-sm">
                    Share your thoughts about this show
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Concert Info */}
          <div className="p-6 border-b border-mist">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-french-blue/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-french-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-evergreen">{concert.artistName}</h3>
                  <p className="text-neutral-600 text-sm">
                    at {concert.venueName} • {new Date(concert.eventDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-xs text-neutral-500">
                      <Users className="w-3 h-3" />
                      <span>{concert.attendeeCount} attendees</span>
                    </div>
                    {concert.ticketPrice && (
                      <div className="text-xs text-neutral-500">
                        ${concert.ticketPrice} ticket
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Artist Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-evergreen">
                How was the artist's performance? *
              </label>
              <StarRating
                rating={artistRating}
                hoverRating={artistHoverRating}
                onRate={(rating) => handleStarClick(rating, 'artist')}
                onHover={(rating) => handleStarHover(rating, 'artist')}
                onLeave={() => setArtistHoverRating(0)}
                disabled={isSubmitting}
              />
              {errors.artistRating && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.artistRating}
                </p>
              )}
            </div>

            {/* Artist Feedback */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-evergreen">
                Artist feedback (optional)
              </label>
              <textarea
                value={artistFeedback}
                onChange={(e) => setArtistFeedback(e.target.value)}
                placeholder="Share your thoughts about the performance, stage presence, song selection..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sage/50 focus:border-sage resize-none"
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="text-xs text-neutral-500 text-right">
                {artistFeedback.length}/500 characters
              </div>
            </div>

            {/* Host Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-evergreen">
                How was the venue and hosting? *
              </label>
              <StarRating
                rating={hostRating}
                hoverRating={hostHoverRating}
                onRate={(rating) => handleStarClick(rating, 'host')}
                onHover={(rating) => handleStarHover(rating, 'host')}
                onLeave={() => setHostHoverRating(0)}
                disabled={isSubmitting}
              />
              {errors.hostRating && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.hostRating}
                </p>
              )}
            </div>

            {/* Host Feedback */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-evergreen">
                Venue feedback (optional)
              </label>
              <textarea
                value={hostFeedback}
                onChange={(e) => setHostFeedback(e.target.value)}
                placeholder="Share your thoughts about the venue, atmosphere, amenities, host hospitality..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sage/50 focus:border-sage resize-none"
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="text-xs text-neutral-500 text-right">
                {hostFeedback.length}/500 characters
              </div>
            </div>

            {/* Overall Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-evergreen">
                Overall experience rating *
              </label>
              <StarRating
                rating={overallRating}
                hoverRating={overallHoverRating}
                onRate={(rating) => handleStarClick(rating, 'overall')}
                onHover={(rating) => handleStarHover(rating, 'overall')}
                onLeave={() => setOverallHoverRating(0)}
                disabled={isSubmitting}
              />
              {errors.overallRating && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.overallRating}
                </p>
              )}
            </div>

            {/* Overall Feedback */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-evergreen">
                Overall feedback *
              </label>
              <textarea
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                placeholder="Describe your overall experience at this concert. What made it special?"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sage/50 focus:border-sage resize-none"
                rows={4}
                maxLength={1000}
                disabled={isSubmitting}
              />
              <div className="text-xs text-neutral-500 text-right">
                {overallFeedback.length}/1000 characters
              </div>
              {errors.overallFeedback && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.overallFeedback}
                </p>
              )}
            </div>

            {/* Would Recommend */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-evergreen">
                Would you recommend this experience?
              </label>
              <div className="flex items-center space-x-6">
                <button
                  type="button"
                  onClick={() => setWouldRecommend(true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    wouldRecommend 
                      ? 'bg-sage/10 text-sage border-2 border-sage' 
                      : 'bg-neutral-50 text-neutral-600 border-2 border-neutral-200 hover:bg-neutral-100'
                  }`}
                  disabled={isSubmitting}
                >
                  <Heart className={`w-4 h-4 ${wouldRecommend ? 'fill-sage' : ''}`} />
                  <span>Yes, I'd recommend it</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWouldRecommend(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    !wouldRecommend 
                      ? 'bg-neutral-100 text-neutral-700 border-2 border-neutral-300' 
                      : 'bg-neutral-50 text-neutral-600 border-2 border-neutral-200 hover:bg-neutral-100'
                  }`}
                  disabled={isSubmitting}
                >
                  <span>Not really</span>
                </button>
              </div>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {isPublic ? (
                  <Eye className="w-5 h-5 text-sage" />
                ) : (
                  <EyeOff className="w-5 h-5 text-neutral-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-evergreen">
                    {isPublic ? 'Public Review' : 'Private Review'}
                  </p>
                  <p className="text-xs text-neutral-600">
                    {isPublic 
                      ? 'Your review will be visible to other fans' 
                      : 'Only you, the artist, and host will see this review'
                    }
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  isPublic ? 'bg-sage' : 'bg-neutral-300'
                }`}
                disabled={isSubmitting}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  isPublic ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-neutral-600 hover:text-evergreen"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-sage hover:bg-sage/90 text-white min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Submit Review</span>
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