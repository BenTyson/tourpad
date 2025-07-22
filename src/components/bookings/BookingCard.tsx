'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Music,
  Home,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface BookingData {
  id: string;
  artistId: string;
  hostId: string;
  artistName: string;
  artistEmail: string;
  hostName: string;
  hostEmail: string;
  venueName: string;
  requestedDate: Date | string;
  requestedTime?: Date | string | null;
  estimatedDuration?: number | null;
  expectedAttendance?: number | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  artistFee?: number | null;
  doorFee?: number | null;
  artistMessage?: string | null;
  hostResponse?: string | null;
  lodgingRequested: boolean;
  lodgingDetails?: any;
  requestedAt: Date | string;
  respondedAt?: Date | string | null;
  confirmedAt?: Date | string | null;
  completedAt?: Date | string | null;
  artist?: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string | null;
  };
  host?: {
    id: string;
    name: string;
    email: string;
    venueName: string;
    profileImageUrl?: string | null;
  };
}

interface BookingCardProps {
  booking: BookingData;
  viewType: 'artist' | 'host' | 'admin';
  onStatusUpdate?: (bookingId: string, status: string, data?: any) => Promise<void>;
  onViewDetails?: (bookingId: string) => void;
  className?: string;
}

export default function BookingCard({ 
  booking, 
  viewType, 
  onStatusUpdate, 
  onViewDetails,
  className = '' 
}: BookingCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [hostResponse, setHostResponse] = useState(booking.hostResponse || '');
  const [artistFee, setArtistFee] = useState(booking.artistFee?.toString() || '');
  const [doorFee, setDoorFee] = useState(booking.doorFee?.toString() || '');

  // Status styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-4 h-4" />;
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Handle status updates
  const handleStatusUpdate = async (status: string, additionalData?: any) => {
    if (!onStatusUpdate) return;
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(booking.id, status, additionalData);
      if (status === 'APPROVED' || status === 'REJECTED') {
        setShowResponseForm(false);
      }
    } catch (error) {
      console.error('Failed to update booking status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleHostResponse = async () => {
    const data = {
      hostResponse,
      artistFee: artistFee ? parseInt(artistFee) : null,
      doorFee: doorFee ? parseInt(doorFee) : null
    };
    await handleStatusUpdate('APPROVED', data);
  };

  // Format date and time
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  const formatTime = (time: Date | string | null | undefined) => {
    if (!time) return null;
    return format(new Date(time), 'h:mm a');
  };

  const formatDateTime = (dateTime: Date | string) => {
    return format(new Date(dateTime), 'MMM d, yyyy h:mm a');
  };

  return (
    <Card className={`${className} border-l-4 ${
      booking.status === 'PENDING' ? 'border-l-yellow-400' :
      booking.status === 'APPROVED' ? 'border-l-blue-400' :
      booking.status === 'CONFIRMED' ? 'border-l-green-400' :
      booking.status === 'REJECTED' ? 'border-l-red-400' :
      'border-l-gray-400'
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Main Title */}
            <div className="flex items-center space-x-2 mb-2">
              {viewType === 'artist' ? (
                <>
                  <Home className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{booking.venueName}</h3>
                  <span className="text-sm text-gray-500">• {booking.hostName}</span>
                </>
              ) : (
                <>
                  <Music className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">{booking.artistName}</h3>
                  <span className="text-sm text-gray-500">• Artist</span>
                </>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(booking.requestedDate)}</span>
              </div>
              {booking.requestedTime && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{formatTime(booking.requestedTime)}</span>
                </div>
              )}
              {booking.expectedAttendance && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{booking.expectedAttendance} guests</span>
                </div>
              )}
              {booking.estimatedDuration && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{booking.estimatedDuration} mins</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(booking.status)}>
              {getStatusIcon(booking.status)}
              <span className="ml-1">{booking.status}</span>
            </Badge>
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(booking.id)}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Artist Message */}
        {booking.artistMessage && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Artist Message:</p>
                <p className="text-sm text-gray-600 mt-1">{booking.artistMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Host Response */}
        {booking.hostResponse && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700">Host Response:</p>
                <p className="text-sm text-blue-600 mt-1">{booking.hostResponse}</p>
              </div>
            </div>
          </div>
        )}

        {/* Fees */}
        {(booking.artistFee || booking.doorFee) && (
          <div className="mb-4 flex items-center space-x-4 text-sm text-gray-600">
            {booking.artistFee && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Artist Fee: ${booking.artistFee}</span>
              </div>
            )}
            {booking.doorFee && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Door Fee: ${booking.doorFee}</span>
              </div>
            )}
          </div>
        )}

        {/* Lodging Request */}
        {booking.lodgingRequested && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 font-medium">
                Lodging requested
              </span>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Requested: {formatDateTime(booking.requestedAt)}</div>
          {booking.respondedAt && (
            <div>Responded: {formatDateTime(booking.respondedAt)}</div>
          )}
          {booking.confirmedAt && (
            <div>Confirmed: {formatDateTime(booking.confirmedAt)}</div>
          )}
          {booking.completedAt && (
            <div>Completed: {formatDateTime(booking.completedAt)}</div>
          )}
        </div>

        {/* Action Buttons */}
        {onStatusUpdate && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {/* Host Actions */}
            {viewType === 'host' && booking.status === 'PENDING' && (
              <div className="space-y-3">
                {!showResponseForm ? (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setShowResponseForm(true)}
                      disabled={isUpdating}
                    >
                      Respond
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate('REJECTED')}
                      disabled={isUpdating}
                    >
                      Decline
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Response Message
                      </label>
                      <textarea
                        value={hostResponse}
                        onChange={(e) => setHostResponse(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={3}
                        placeholder="Add a message to the artist..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Artist Fee ($)
                        </label>
                        <input
                          type="number"
                          value={artistFee}
                          onChange={(e) => setArtistFee(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Door Fee ($)
                        </label>
                        <input
                          type="number"
                          value={doorFee}
                          onChange={(e) => setDoorFee(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={handleHostResponse}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Approving...' : 'Approve Booking'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowResponseForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Artist Actions */}
            {viewType === 'artist' && booking.status === 'APPROVED' && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('CONFIRMED')}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Confirming...' : 'Confirm Booking'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('CANCELLED')}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Admin Actions */}
            {viewType === 'admin' && booking.status === 'PENDING' && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('APPROVED')}
                  disabled={isUpdating}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('REJECTED')}
                  disabled={isUpdating}
                >
                  Reject
                </Button>
              </div>
            )}

            {/* Mark Complete Actions */}
            {booking.status === 'CONFIRMED' && (viewType === 'host' || viewType === 'admin') && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate('COMPLETED')}
                disabled={isUpdating}
              >
                {isUpdating ? 'Completing...' : 'Mark Complete'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}