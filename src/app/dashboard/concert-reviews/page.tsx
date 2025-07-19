'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Star,
  Calendar,
  Music,
  Plus,
  Filter,
  Search,
  Eye,
  EyeOff,
  Heart,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FanConcertReviewModal, FanConcertReview } from '@/components/reviews/FanConcertReviewModal';
import { FanConcertReviewCard } from '@/components/reviews/FanConcertReviewCard';
import { mockBookings } from '@/data/mockData';
import { testConcerts } from '@/data/realTestData';

export default function ConcertReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<FanConcertReview[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState<any>(null);
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'date'>('recent');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for concerts fan has attended (past concerts)
  const attendedConcerts = testConcerts
    .filter(concert => 
      concert.status === 'completed' && 
      concert.attendees.includes('fan1') // In real implementation, use session.user.id
    )
    .map(concert => ({
      id: concert.id,
      artistId: concert.artistId,
      hostId: concert.hostId,
      artistName: concert.artistName,
      hostName: concert.hostName,
      venueName: concert.venueName,
      eventDate: concert.date,
      attendeeCount: concert.currentReservations,
      ticketPrice: concert.ticketPrice
    }));

  const handleSubmitReview = (newReview: FanConcertReview) => {
    setReviews(prev => [newReview, ...prev]);
    setShowReviewModal(false);
    setSelectedConcert(null);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filterType === 'all' || 
      (filterType === 'public' && review.isPublic) ||
      (filterType === 'private' && !review.isPublic);
    
    const matchesSearch = searchTerm === '' || 
      getConcertName(review.concertId).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return b.overallRating - a.overallRating;
      case 'date':
        return new Date(b.attendedDate).getTime() - new Date(a.attendedDate).getTime();
      default:
        return 0;
    }
  });

  const getConcertName = (concertId: string) => {
    const concert = attendedConcerts.find(c => c.id === concertId);
    return concert ? `${concert.artistName} at ${concert.venueName}` : 'Unknown Concert';
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length;
  };

  const getReviewedConcertIds = () => {
    return new Set(reviews.map(review => review.concertId));
  };

  // Filter out concerts that have already been reviewed
  const unreviewedConcerts = attendedConcerts.filter(
    concert => !getReviewedConcertIds().has(concert.id)
  );

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Please sign in to view your concert reviews.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:bg-sage/10 hover:text-sage">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-evergreen">My Concert Reviews</h1>
                <p className="text-neutral-600 text-sm">
                  Share your concert experiences with the TourPad community
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {reviews.length > 0 && (
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-sand fill-sand" />
                    <span className="text-sm font-medium text-evergreen">
                      {getAverageRating().toFixed(1)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      avg rating
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Filters and Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-evergreen mb-4">Review Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Total Reviews</span>
                    <span className="font-medium text-evergreen">{reviews.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-sand fill-sand" />
                      <span className="font-medium text-evergreen">
                        {getAverageRating().toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Public Reviews</span>
                    <span className="font-medium text-evergreen">
                      {reviews.filter(r => r.isPublic).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Recommended</span>
                    <span className="font-medium text-evergreen">
                      {reviews.filter(r => r.wouldRecommend).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-evergreen mb-4">Filters</h3>
                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-evergreen mb-2">
                      Search Reviews
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by artist or venue..."
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-sage/50 focus:border-sage"
                      />
                    </div>
                  </div>

                  {/* Filter by visibility */}
                  <div>
                    <label className="block text-sm font-medium text-evergreen mb-2">
                      Visibility
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as 'all' | 'public' | 'private')}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-sage/50 focus:border-sage"
                    >
                      <option value="all">All Reviews</option>
                      <option value="public">Public Only</option>
                      <option value="private">Private Only</option>
                    </select>
                  </div>

                  {/* Sort by */}
                  <div>
                    <label className="block text-sm font-medium text-evergreen mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating' | 'date')}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-sage/50 focus:border-sage"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="rating">Highest Rating</option>
                      <option value="date">Concert Date</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Unreviewed Concerts */}
            {unreviewedConcerts.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-evergreen mb-4">
                    Concerts to Review
                  </h3>
                  <div className="space-y-3">
                    {unreviewedConcerts.slice(0, 3).map((concert) => (
                      <div key={concert.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-evergreen">
                            {concert.artistName}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {concert.venueName} • {new Date(concert.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedConcert(concert);
                            setShowReviewModal(true);
                          }}
                          className="bg-sage hover:bg-sage/90 text-white text-xs px-3 py-1"
                        >
                          Review
                        </Button>
                      </div>
                    ))}
                    {unreviewedConcerts.length > 3 && (
                      <p className="text-xs text-neutral-500 text-center">
                        +{unreviewedConcerts.length - 3} more concerts to review
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Reviews */}
          <div className="lg:col-span-2">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-lg font-semibold text-evergreen mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Share your experiences from the concerts you've attended
                  </p>
                  {unreviewedConcerts.length > 0 && (
                    <Button
                      onClick={() => {
                        setSelectedConcert(unreviewedConcerts[0]);
                        setShowReviewModal(true);
                      }}
                      className="bg-sage hover:bg-sage/90 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Write Your First Review
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {sortedReviews.map((review) => {
                  const concert = attendedConcerts.find(c => c.id === review.concertId);
                  if (!concert) return null;
                  
                  return (
                    <FanConcertReviewCard
                      key={review.id}
                      review={review}
                      artistName={concert.artistName}
                      hostName={concert.hostName}
                      venueName={concert.venueName}
                      showFullReview={false}
                      showFanName={false}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedConcert && (
        <FanConcertReviewModal
          concert={selectedConcert}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedConcert(null);
          }}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}