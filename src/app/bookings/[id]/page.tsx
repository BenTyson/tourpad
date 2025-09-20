'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { mockBookings, mockHosts, mockArtists } from '@/data/mockData';
import { BookingHeader } from '@/components/bookings/BookingHeader';
import { ActionAlert } from '@/components/bookings/ActionAlert';
import { BookingDetailsSection } from '@/components/bookings/BookingDetailsSection';
import { BookingSidebar } from '@/components/bookings/BookingSidebar';
import { BookingModals } from '@/components/bookings/BookingModals';

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const { data: session, status } = useSession();
  
  const booking = mockBookings.find(b => b.id === bookingId);
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'requested');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--color-french-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Please sign in to view booking details.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Booking Not Found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const host = mockHosts.find(h => h.userId === booking.hostId);
  const artist = mockArtists.find(a => a.userId === booking.artistId);

  // Get user role from session
  const currentUserRole = session.user.type;
  const isHost = currentUserRole === 'host';
  const isArtist = currentUserRole === 'artist';
  const canTakeAction = isHost && currentStatus === 'requested';

  const handleApprove = () => {
    setCurrentStatus('approved');
    // TODO: Send to backend, notify artist, etc.
    console.log('Booking approved:', bookingId);
  };

  const handleDecline = (reason: string) => {
    setCurrentStatus('requested');
    setShowDeclineModal(false);
    // TODO: Send to backend, notify artist with reason
    console.log('Booking declined:', bookingId, 'Reason:', reason);

    // Show user feedback
    setTimeout(() => {
      alert('Booking declined successfully. The artist has been notified.');
    }, 500);
  };

  const handleCancellationRequest = (reason: string) => {
    setCurrentStatus('pending');
    setShowCancellationModal(false);
    // TODO: Send to backend, notify other party
    console.log('Cancellation requested:', bookingId, 'Reason:', reason);

    // Show user feedback
    setTimeout(() => {
      alert('Cancellation request sent. The other party will be notified to review your request.');
    }, 500);
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'requested':
        return {
          color: 'bg-[#d4c4a8] text-[#344c3d]', // sand with evergreen text
          icon: Clock,
          text: 'Awaiting Response',
          description: isHost ? 'Review this booking request and respond' : 'Waiting for host to respond'
        };
      case 'approved':
        return {
          color: 'bg-[#738a6e] text-white', // sage
          icon: CheckCircle,
          text: 'Confirmed',
          description: 'This booking is confirmed! Event details have been shared.'
        };
      case 'declined':
        return {
          color: 'bg-[#ebebe9] text-[#344c3d]', // mist with evergreen text
          icon: XCircle,
          text: 'Declined',
          description: 'This booking request was declined.'
        };
      case 'cancellation_requested':
        return {
          color: 'bg-[#8ea58c] text-white', // french blue
          icon: AlertTriangle,
          text: 'Cancellation Requested',
          description: 'A cancellation has been requested and is pending review.'
        };
      case 'pending':
        return {
          color: 'bg-[#8ea58c] text-white', // french blue
          icon: Clock,
          text: 'Pending',
          description: 'Waiting for artist to confirm'
        };
      default:
        return {
          color: 'bg-neutral-100 text-neutral-700',
          icon: Clock,
          text: status,
          description: ''
        };
    }
  };

  const statusInfo = getStatusInfo(currentStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Navigation */}
        <BookingHeader
          statusInfo={statusInfo}
          currentStatus={currentStatus}
          onRequestCancellation={() => setShowCancellationModal(true)}
        />

        {/* Action Alert for Hosts */}
        {canTakeAction && (
          <ActionAlert
            artistName={artist?.name}
            onApprove={handleApprove}
            onDecline={() => setShowDeclineModal(true)}
          />
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <BookingDetailsSection
            booking={booking}
            artist={artist}
            host={host}
            formatDate={formatDate}
            currentStatus={currentStatus}
          />

          {/* Sidebar */}
          <BookingSidebar
            currentStatus={currentStatus}
            booking={booking}
          />
        </div>
      </div>

      <BookingModals
        showDeclineModal={showDeclineModal}
        showCancellationModal={showCancellationModal}
        artistName={artist?.name}
        onCloseDeclineModal={() => setShowDeclineModal(false)}
        onCloseCancellationModal={() => setShowCancellationModal(false)}
        onConfirmDecline={handleDecline}
        onConfirmCancellation={handleCancellationRequest}
      />
    </div>
  );
}