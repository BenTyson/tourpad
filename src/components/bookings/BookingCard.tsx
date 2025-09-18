'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { BookingCardHeader } from './card/BookingCardHeader';
import { BookingCardMessage } from './card/BookingCardMessage';
import { BookingCardDetails } from './card/BookingCardDetails';
import { BookingCardActions } from './card/BookingCardActions';

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
  const [showDetails, setShowDetails] = useState(false);

  // Handle status updates
  const handleStatusUpdate = async (status: string, additionalData?: any) => {
    if (!onStatusUpdate) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(booking.id, status, additionalData);
    } catch (error) {
      console.error('Failed to update booking status:', error);
    } finally {
      setIsUpdating(false);
    }
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
      <BookingCardHeader
        booking={booking}
        viewType={viewType}
        onViewDetails={onViewDetails}
      />

      <CardContent>
        <BookingCardMessage artistMessage={booking.artistMessage} />

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

          <BookingCardDetails
            booking={booking}
            showDetails={showDetails}
          />
        </div>

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

        <BookingCardActions
          booking={booking}
          viewType={viewType}
          isUpdating={isUpdating}
          onStatusUpdate={handleStatusUpdate}
        />
      </CardContent>
    </Card>
  );
}