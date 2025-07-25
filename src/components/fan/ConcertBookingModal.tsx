'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  DollarSign,
  Music,
  Home,
  MessageSquare
} from 'lucide-react';

interface Concert {
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
  requiresApproval: boolean;
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
  currentRSVPCount?: number;
  userRSVP?: {
    id: string;
    status: string;
    guestsCount: number;
  } | null;
}

interface ConcertBookingModalProps {
  concert: Concert;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

export default function ConcertBookingModal({ 
  concert, 
  isOpen, 
  onClose,
  onBookingSuccess 
}: ConcertBookingModalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [guestsCount, setGuestsCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const availableSpaces = concert.maxCapacity - (concert.currentRSVPCount || 0);
  const isPastEvent = new Date(concert.date) < new Date();
  const hasExistingRSVP = concert.userRSVP !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rsvps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          concertId: concert.id,
          guestsCount,
          specialRequests: specialRequests.trim() || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create RSVP');
      }

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onBookingSuccess?.();
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating RSVP:', err);
      setError(err instanceof Error ? err.message : 'Failed to create RSVP request');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!concert.userRSVP) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rsvps/${concert.userRSVP.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel RSVP');
      }

      setSuccess(true);
      setTimeout(() => {
        onBookingSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error cancelling RSVP:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel RSVP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Image */}
        <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex-shrink-0">
          {concert.artist.pressPhoto ? (
            <img 
              src={concert.artist.pressPhoto} 
              alt={concert.artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-16 h-16 text-neutral-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Title and Status */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {concert.title || `${concert.artist.name} Live`}
              </h2>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={`${
                  concert.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' :
                  concert.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {concert.status}
                </Badge>
                {concert.requiresApproval && (
                  <Badge variant="secondary">Requires Approval</Badge>
                )}
                {concert.isPrivate && (
                  <Badge variant="secondary">Private Event</Badge>
                )}
                {hasExistingRSVP && (
                  <Badge className={`${
                    concert.userRSVP?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    concert.userRSVP?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    concert.userRSVP?.status === 'DECLINED' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {concert.userRSVP?.status} RSVP
                  </Badge>
                )}
              </div>
              {concert.description && (
                <p className="text-neutral-600 leading-relaxed">{concert.description}</p>
              )}
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Date & Time */}
              <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-neutral-900">
                    {formatDate(concert.date)}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {formatTime(concert.startTime)}
                    {concert.endTime && ` - ${formatTime(concert.endTime)}`}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-secondary-600" />
                </div>
                <div>
                  <div className="font-medium text-neutral-900">
                    {concert.host.venueName || concert.host.name}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {concert.host.city}, {concert.host.state}
                  </div>
                </div>
              </div>

              {/* Artist */}
              <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-neutral-900">
                    {concert.artist.stageName || concert.artist.name}
                  </div>
                  <div className="text-sm text-neutral-600">Artist</div>
                </div>
              </div>

              {/* Capacity */}
              <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-neutral-900">
                    {availableSpaces} of {concert.maxCapacity} spots available
                  </div>
                  <div className="text-sm text-neutral-600">Capacity</div>
                </div>
              </div>
            </div>

            {/* Door Fee */}
            {concert.doorFee && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">
                    ${concert.doorFee} door fee per person
                  </span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="text-green-800 font-medium">
                  {hasExistingRSVP ? 'RSVP cancelled successfully!' : 
                   concert.requiresApproval ? 'RSVP request submitted! The host will review your request.' :
                   'RSVP confirmed! You\'ll receive the venue address soon.'}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="text-red-800">{error}</div>
              </div>
            )}

            {/* RSVP Form or Status */}
            {!isPastEvent && !success && (
              <>
                {hasExistingRSVP ? (
                  /* Existing RSVP Management */
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h3 className="font-medium text-blue-900 mb-3">Your RSVP</h3>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>Status: <span className="font-medium">{concert.userRSVP?.status}</span></div>
                      <div>Guests: <span className="font-medium">{concert.userRSVP?.guestsCount}</span></div>
                    </div>
                  </div>
                ) : availableSpaces <= 0 ? (
                  /* Sold Out */
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                    <h3 className="font-medium text-red-900 mb-2">Event is Full</h3>
                    <p className="text-red-800 text-sm">This concert has reached maximum capacity.</p>
                  </div>
                ) : (
                  /* RSVP Form */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Number of Guests (including yourself)
                      </label>
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        {Array.from({ length: Math.min(10, availableSpaces) }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'person' : 'people'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows={3}
                        maxLength={500}
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Any dietary restrictions, accessibility needs, or other requests..."
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        {specialRequests.length}/500 characters
                      </p>
                    </div>
                  </form>
                )}
              </>
            )}

            {isPastEvent && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <p className="text-gray-600">This concert has already taken place.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 p-6 pt-0 border-t border-neutral-100">
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Close
            </Button>
            
            {!isPastEvent && !success && (
              <>
                {hasExistingRSVP ? (
                  <Button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {loading ? 'Cancelling...' : 'Cancel RSVP'}
                  </Button>
                ) : availableSpaces > 0 && (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    {loading ? 'Submitting...' : 
                     concert.requiresApproval ? 'Request RSVP' : 'Confirm RSVP'}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}