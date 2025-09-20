'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface BookingModalsProps {
  showDeclineModal: boolean;
  showCancellationModal: boolean;
  artistName?: string;
  onCloseDeclineModal: () => void;
  onCloseCancellationModal: () => void;
  onConfirmDecline: (reason: string) => void;
  onConfirmCancellation: (reason: string) => void;
}

export function BookingModals({
  showDeclineModal,
  showCancellationModal,
  artistName,
  onCloseDeclineModal,
  onCloseCancellationModal,
  onConfirmDecline,
  onConfirmCancellation
}: BookingModalsProps) {
  const [declineReason, setDeclineReason] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');

  const handleDecline = () => {
    if (!declineReason.trim()) {
      alert('Please provide a reason for declining');
      return;
    }
    onConfirmDecline(declineReason);
    setDeclineReason('');
  };

  const handleCancellation = () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for requesting cancellation');
      return;
    }
    onConfirmCancellation(cancellationReason);
    setCancellationReason('');
  };

  return (
    <>
      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900">Decline Booking Request</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Please let {artistName} know why you can't host this show. This helps them find a better fit.
                </p>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={4}
                  placeholder="e.g., Date conflict, venue capacity, etc."
                />
                <div className="flex space-x-3">
                  <Button
                    onClick={onCloseDeclineModal}
                    variant="outline"
                    className="flex-1 border-neutral-300 hover:bg-neutral-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDecline}
                    className="flex-1 bg-[#344c3d] hover:bg-[#2d3f34] text-white"
                  >
                    Decline Booking
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Request Modal */}
      {showCancellationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-[#344c3d]">Request Cancellation</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Please provide a reason for requesting cancellation. This will be shared with the other party.
                </p>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={4}
                  placeholder="e.g., Schedule conflict, venue issue, emergency, etc."
                />
                <div className="flex space-x-3">
                  <Button
                    onClick={onCloseCancellationModal}
                    variant="outline"
                    className="flex-1 border-neutral-300 hover:bg-neutral-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCancellation}
                    className="flex-1 bg-[#344c3d] hover:bg-[#2d3f34] text-white"
                  >
                    Request Cancellation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}