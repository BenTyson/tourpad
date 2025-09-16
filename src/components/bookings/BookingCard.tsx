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
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

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
  doorFee?: number | null;
  doorFeeStatus?: 'PENDING_HOST' | 'PENDING_ARTIST' | 'AGREED' | null;
  artistMessage?: string | null;
  hostResponse?: string | null;
  lodgingRequested: boolean;
  lodgingDetails?: any;
  requestedAt: Date | string;
  respondedAt?: Date | string | null;
  confirmationDeadline?: Date | string | null;
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
    city?: string;
    state?: string;
  };
  specialRequirements?: string | null;
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
  const [showDetails, setShowDetails] = useState(false);
  const [hostResponse, setHostResponse] = useState(booking.hostResponse || '');
  const [proposedDoorFee, setProposedDoorFee] = useState(booking.doorFee?.toString() || '');

  // Status styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-white text-[var(--color-french-blue)] border border-[var(--color-french-blue)]';
      case 'APPROVED': return 'bg-[var(--color-french-blue)] text-white border border-[var(--color-french-blue)]';
      case 'REJECTED': return 'bg-white text-red-600 border border-red-300';
      case 'CONFIRMED': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-500 shadow-sm animate-pulse';
      case 'COMPLETED': return 'bg-white text-neutral-600 border border-neutral-300';
      case 'CANCELLED': return 'bg-white text-neutral-500 border border-neutral-300';
      default: return 'bg-white text-neutral-600 border border-neutral-300';
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
      doorFee: proposedDoorFee ? parseInt(proposedDoorFee) : booking.doorFee,
      doorFeeStatus: proposedDoorFee && parseInt(proposedDoorFee) !== booking.doorFee ? 'PENDING_ARTIST' : 'AGREED'
    };
    await handleStatusUpdate('APPROVED', data);
  };

  const handleConfirmShow = async () => {
    try {
      await handleStatusUpdate('CONFIRMED');
    } catch (error) {
      console.error('Failed to confirm show:', error);
    }
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
    
    <Card className={`${className} border border-neutral-200 hover:border-[var(--color-french-blue)] hover:shadow-md transition-all duration-200 ${
      booking.status === 'PENDING' ? 'bg-white' :
      booking.status === 'APPROVED' ? 'bg-slate-50' :
      booking.status === 'CONFIRMED' ? 'bg-blue-50/30' :
      booking.status === 'REJECTED' ? 'bg-red-50' :
      'bg-white'
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Main Title */}
            <div className="flex items-center space-x-2 mb-2">
              {viewType === 'artist' ? (
                <>
                  <Home className="w-5 h-5 text-[var(--color-french-blue)]" />
                  <h3 className="font-semibold text-neutral-900">{booking.venueName}</h3>
                  <span className="text-sm text-neutral-500">• 
                    <Link 
                      href={`/hosts/${booking.hostId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-french-blue)] hover:text-[var(--color-primary-700)] hover:underline ml-1"
                    >
                      {booking.hostName}
                    </Link>
                  </span>
                </>
              ) : (
                <>
                  <Music className="w-5 h-5 text-[var(--color-french-blue)]" />
                  <h3 className="font-semibold text-neutral-900">
                    <Link 
                      href={`/artists/${booking.artistId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-900 hover:text-[var(--color-french-blue)] hover:underline"
                    >
                      {booking.artistName}
                    </Link>
                  </h3>
                  <span className="text-sm text-neutral-500">• Artist</span>
                </>
              )}
            </div>

            {/* Basic Info - Date Only */}
            <div className="text-sm text-neutral-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-[var(--color-french-blue)]" />
                <span>{formatDate(booking.requestedDate)}</span>
              </div>
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
          <div className="mb-4 p-3 bg-white border border-neutral-200 rounded-md">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-700">Artist Message:</p>
                <p className="text-sm text-neutral-600 mt-1">{booking.artistMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Host Response */}
        {booking.hostResponse && (
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-md">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-french-blue)]">Host Response:</p>
                <p className="text-sm text-neutral-700 mt-1">{booking.hostResponse}</p>
              </div>
            </div>
          </div>
        )}


        {/* Lodging Request */}
        {booking.lodgingRequested && (
          <div className="mb-4 p-3 bg-sage-50 border border-sage-200 rounded-md">
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-sage-600" />
              <span className="text-sm text-sage-700 font-medium">
                Lodging requested
              </span>
            </div>
          </div>
        )}

        {/* Additional Details Toggle */}
        {/* Temporarily always show for testing */}
        {true && (
          <div className="mb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-sm text-[var(--color-french-blue)] hover:text-[var(--color-primary-700)] transition-colors"
            >
              {showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
            </button>
            
            {showDetails && (
              <div className="mt-3 p-3 bg-white border border-neutral-200 rounded-md space-y-2">
                {/* Booking Details */}
                <div className="space-y-2">
                  {booking.doorFee && (
                    <div className="flex items-start space-x-2">
                      <DollarSign className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-neutral-700">Door Fee:</span>
                        <div className="text-sm text-neutral-600 ml-1">
                          ${booking.doorFee}
                          {booking.doorFeeStatus && (
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              booking.doorFeeStatus === 'AGREED' ? 'bg-green-100 text-green-700' :
                              booking.doorFeeStatus === 'PENDING_HOST' ? 'bg-yellow-100 text-yellow-700' :
                              booking.doorFeeStatus === 'PENDING_ARTIST' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {booking.doorFeeStatus === 'AGREED' ? '✓ Agreed' :
                               booking.doorFeeStatus === 'PENDING_HOST' ? 'Awaiting host approval' :
                               booking.doorFeeStatus === 'PENDING_ARTIST' ? 'Awaiting artist approval' :
                               'Pending'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Host Location */}
                {(booking.host?.city || booking.host?.state) ? (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-neutral-700">Location:</span>
                      <span className="text-sm text-neutral-600 ml-1">
                        {booking.host?.city}{booking.host?.city && booking.host?.state && ', '}{booking.host?.state}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-neutral-400 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-neutral-700">Location:</span>
                      <span className="text-sm text-neutral-400 ml-1">Not available</span>
                    </div>
                  </div>
                )}
                
                
                {/* Lodging Details */}
                {booking.lodgingRequested ? (
                  <div className="flex items-start space-x-2">
                    <Home className="w-4 h-4 text-sage-600 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-neutral-700">Accommodation:</span>
                      <p className="text-sm text-neutral-600 mt-1">
                        {booking.lodgingDetails ? (
                          typeof booking.lodgingDetails === 'string'
                            ? booking.lodgingDetails
                            : booking.lodgingDetails?.description || 'Overnight accommodation requested'
                        ) : 'Overnight accommodation requested'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-2">
                    <Home className="w-4 h-4 text-neutral-400 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-neutral-700">Accommodation:</span>
                      <span className="text-sm text-neutral-400 ml-1">Not requested</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-neutral-500 space-y-1">
          <div>Requested: {formatDateTime(booking.requestedAt)}</div>
          {booking.respondedAt && (
            <div>Host Responded: {formatDateTime(booking.respondedAt)}</div>
          )}
          {booking.confirmationDeadline && booking.status === 'APPROVED' && (
            <div className="text-orange-600 font-semibold">Confirm by: {formatDateTime(booking.confirmationDeadline)}</div>
          )}
          {booking.confirmedAt && (
            <div className="text-green-600 font-semibold">Show Confirmed: {formatDateTime(booking.confirmedAt)}</div>
          )}
          {booking.completedAt && (
            <div>Completed: {formatDateTime(booking.completedAt)}</div>
          )}
        </div>

        {/* Action Buttons */}
        {onStatusUpdate && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
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
                  <div className="space-y-3 p-3 bg-white border border-neutral-200 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Response Message
                      </label>
                      <textarea
                        value={hostResponse}
                        onChange={(e) => setHostResponse(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:border-[var(--color-french-blue)] focus:ring-[var(--color-french-blue)]"
                        rows={3}
                        placeholder="Add a message to the artist..."
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Door Fee ($) - Artist suggested: ${booking.doorFee || 0}
                        </label>
                        <input
                          type="number"
                          value={proposedDoorFee}
                          onChange={(e) => setProposedDoorFee(e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:border-[var(--color-french-blue)] focus:ring-[var(--color-french-blue)]"
                          placeholder={booking.doorFee?.toString() || '0'}
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          {proposedDoorFee && parseInt(proposedDoorFee) !== booking.doorFee 
                            ? 'You are proposing a different door fee. Artist will need to approve.' 
                            : 'Leave as suggested amount or propose a different fee.'}
                        </p>
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
              <div className="space-y-3">
                {/* Confirmation Deadline Warning */}
                {booking.confirmationDeadline && booking.doorFeeStatus === 'AGREED' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Action Required:</strong> Please confirm this show by{' '}
                      <strong>{formatDate(booking.confirmationDeadline)}</strong>
                    </p>
                  </div>
                )}
                
                {/* Door Fee Approval */}
                {booking.doorFeeStatus === 'PENDING_ARTIST' && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800 mb-2">
                      Host proposed door fee: <strong>${booking.doorFee}</strong>
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.status, { doorFeeStatus: 'AGREED' })}
                        disabled={isUpdating}
                      >
                        Accept Door Fee
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate('PENDING', { doorFeeStatus: 'PENDING_HOST' })}
                        disabled={isUpdating}
                      >
                        Negotiate
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Booking Confirmation */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleConfirmShow}
                    disabled={isUpdating || booking.doorFeeStatus !== 'AGREED'}
                    className={booking.doorFeeStatus === 'AGREED' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {isUpdating ? 'Confirming...' : 'Confirm Show'}
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
                
                {booking.doorFeeStatus !== 'AGREED' && (
                  <p className="text-xs text-yellow-600">
                    Please agree on the door fee before confirming the show.
                  </p>
                )}
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