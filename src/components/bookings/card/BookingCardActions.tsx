'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { BookingData } from '../BookingCard';

interface BookingCardActionsProps {
  booking: BookingData;
  viewType: 'host' | 'artist';
  isUpdating: boolean;
  onStatusUpdate?: (id: string, status: string, additionalData?: any) => Promise<void>;
}

export function BookingCardActions({
  booking,
  viewType,
  isUpdating,
  onStatusUpdate
}: BookingCardActionsProps) {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [hostResponse, setHostResponse] = useState('');
  const [proposedDoorFee, setProposedDoorFee] = useState('');

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  const handleStatusUpdate = async (status: string, additionalData?: any) => {
    if (!onStatusUpdate) return;

    try {
      await onStatusUpdate(booking.id, status, additionalData);
      if (status === 'APPROVED' || status === 'REJECTED') {
        setShowResponseForm(false);
      }
    } catch (error) {
      console.error('Failed to update booking status:', error);
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

  // Host Actions
  if (viewType === 'host' && booking.status === 'PENDING') {
    return (
      <div className="mt-4 space-y-3">
        {!showResponseForm ? (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => setShowResponseForm(true)}
              disabled={isUpdating}
            >
              Respond to Request
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate('REJECTED')}
              disabled={isUpdating}
            >
              {isUpdating ? 'Declining...' : 'Decline'}
            </Button>
          </div>
        ) : (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Response (optional)
                </label>
                <textarea
                  value={hostResponse}
                  onChange={(e) => setHostResponse(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md text-sm"
                  rows={3}
                  placeholder="Add a message for the artist..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Proposed Door Fee (optional)
                </label>
                <input
                  type="number"
                  value={proposedDoorFee}
                  onChange={(e) => setProposedDoorFee(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md text-sm"
                  placeholder={booking.doorFee ? `Current: $${booking.doorFee}` : 'Enter amount'}
                />
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
          </div>
        )}
      </div>
    );
  }

  // Artist Actions
  if (viewType === 'artist' && booking.status === 'APPROVED') {
    return (
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
                onClick={() => handleStatusUpdate('REJECTED')}
                disabled={isUpdating}
              >
                Decline Booking
              </Button>
            </div>
          </div>
        )}

        {/* Confirm Show Button */}
        {booking.doorFeeStatus === 'AGREED' && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleConfirmShow}
              disabled={isUpdating}
            >
              {isUpdating ? 'Confirming...' : 'Confirm Show'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
}