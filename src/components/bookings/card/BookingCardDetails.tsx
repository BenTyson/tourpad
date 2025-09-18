'use client';
import { format } from 'date-fns';
import {
  Clock,
  Users,
  DollarSign,
  MapPin,
  Home
} from 'lucide-react';
import { BookingData } from '../BookingCard';

interface BookingCardDetailsProps {
  booking: BookingData;
  showDetails: boolean;
}

export function BookingCardDetails({ booking, showDetails }: BookingCardDetailsProps) {
  const formatTime = (time: Date | string | null | undefined) => {
    if (!time) return 'Not specified';
    try {
      return format(new Date(time), 'h:mm a');
    } catch {
      return 'Invalid time';
    }
  };

  if (!showDetails) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-md">
      <div className="grid gap-3">
        {/* Event Time */}
        {booking.requestedTime && (
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
            <div>
              <span className="text-sm font-medium text-neutral-700">Time:</span>
              <span className="text-sm text-neutral-600 ml-1">{formatTime(booking.requestedTime)}</span>
            </div>
          </div>
        )}

        {/* Expected Attendance */}
        {booking.expectedAttendance && (
          <div className="flex items-start space-x-2">
            <Users className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
            <div>
              <span className="text-sm font-medium text-neutral-700">Expected Attendance:</span>
              <span className="text-sm text-neutral-600 ml-1">{booking.expectedAttendance} people</span>
            </div>
          </div>
        )}

        {/* Door Fee */}
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
                    {booking.doorFeeStatus === 'AGREED' ? ' Agreed' :
                     booking.doorFeeStatus === 'PENDING_HOST' ? 'Awaiting host approval' :
                     booking.doorFeeStatus === 'PENDING_ARTIST' ? 'Awaiting artist approval' :
                     'Pending'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

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
            <Home className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
            <div>
              <span className="text-sm font-medium text-neutral-700">Lodging:</span>
              <span className="text-sm text-neutral-600 ml-1">Requested</span>
              {booking.lodgingDetails && (
                <div className="text-xs text-neutral-500 mt-1">
                  {typeof booking.lodgingDetails === 'string'
                    ? booking.lodgingDetails
                    : JSON.stringify(booking.lodgingDetails)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start space-x-2">
            <Home className="w-4 h-4 text-neutral-400 mt-0.5" />
            <div>
              <span className="text-sm font-medium text-neutral-700">Lodging:</span>
              <span className="text-sm text-neutral-400 ml-1">Not requested</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}