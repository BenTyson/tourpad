'use client';
import { useState } from 'react';
import { 
  Calendar,
  Users,
  Star,
  MessageCircle,
  CheckCircle,
  Clock,
  MapPin,
  Music,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ReviewFormModal } from './ReviewFormModal';
import { completedBookings, getReviewsByUser } from '@/data/testReviews';

interface PastShowsSectionProps {
  userId: string;
  userType: 'artist' | 'host';
}

export function PastShowsSection({ userId, userType }: PastShowsSectionProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Get past shows for this user
  const pastShows = completedBookings.filter(booking => 
    userType === 'artist' ? booking.artistId === userId : booking.hostId === userId
  );

  // Get reviews written by this user
  const userReviews = getReviewsByUser(userId);

  const handleLeaveReview = (booking: any) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedBooking(null);
  };

  const getReviewForBooking = (bookingId: string) => {
    return userReviews.find(review => review.bookingId === bookingId);
  };

  if (pastShows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Past Shows</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No past shows yet</h3>
            <p className="text-gray-600">
              {userType === 'artist' 
                ? 'Your completed performances will appear here'
                : 'Your hosted shows will appear here'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Past Shows</h2>
            <Badge variant="secondary">
              {pastShows.length} {pastShows.length === 1 ? 'show' : 'shows'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastShows.map((booking) => {
              const existingReview = getReviewForBooking(booking.id);
              const showDate = new Date(booking.eventDate);
              
              return (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {userType === 'artist' ? (
                            <Home className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Music className="w-4 h-4 text-gray-500" />
                          )}
                          <h3 className="font-semibold text-gray-900">
                            {userType === 'artist' ? booking.venueName : booking.artistName}
                          </h3>
                        </div>
                        <Badge variant="success" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {showDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {booking.attendeeCount} guests
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {userType === 'artist' ? booking.hostName : booking.venueName}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {Math.floor(Math.random() * 60 + 90)} mins
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {existingReview ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium ml-1">
                              {existingReview.rating}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-green-600 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Reviewed
                          </Badge>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleLeaveReview(booking)}
                          className="text-neutral-800 hover:text-neutral-900 transition-colors"
                          style={{ 
                            backgroundColor: '#ebebe9'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ddddd9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ebebe9'}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {existingReview && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < existingReview.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <Badge variant={existingReview.isPublic ? 'default' : 'secondary'}>
                            {existingReview.isPublic ? 'Public' : 'Private'}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(existingReview.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {existingReview.feedback}
                      </p>
                      {existingReview.response && (
                        <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                          <p className="text-sm text-blue-800">
                            <strong>Response:</strong> {existingReview.response.text}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Review Form Modal */}
      {showReviewModal && selectedBooking && (
        <ReviewFormModal
          booking={selectedBooking}
          reviewerType={userType}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}