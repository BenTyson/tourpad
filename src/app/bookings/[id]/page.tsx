'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const bookingId = params.id as string;
  const { data: session, status } = useSession();

  const [bookingData, setBookingData] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState('requested');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Try to fetch from API first, fall back to mock data
  useEffect(() => {
    if (!session?.user || !bookingId) return;

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.booking) {
            setBookingData(data.booking);
            setCurrentStatus(data.booking.status?.toLowerCase() || 'requested');
            return;
          }
        }
      } catch {
        // Fall through to mock data
      }

      // Fallback to mock data
      const mock = mockBookings.find(b => b.id === bookingId);
      if (mock) {
        setBookingData(mock);
        setCurrentStatus(mock.status || 'requested');
      } else {
        setFetchError('Booking not found');
      }
    };

    fetchBooking();
  }, [session, bookingId]);

  if (status === 'loading' || (!bookingData && !fetchError)) {
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

  if (fetchError || !bookingData) {
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

  // Use mock data for rich host/artist details (child components expect this shape)
  const host = mockHosts.find(h => h.userId === bookingData.hostId);
  const artist = mockArtists.find(a => a.userId === bookingData.artistId);

  const currentUserRole = session.user.type;
  const isHost = currentUserRole === 'host';
  const isArtist = currentUserRole === 'artist';
  const canTakeAction = isHost && currentStatus === 'requested';

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' })
      });
      if (res.ok) {
        setCurrentStatus('approved');
      }
    } catch {
      // Action failed silently
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async (reason: string) => {
    setActionLoading(true);
    setShowDeclineModal(false);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', hostResponse: reason })
      });
      if (res.ok) {
        setCurrentStatus('declined');
      }
    } catch {
      // Action failed silently
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancellationRequest = async (reason: string) => {
    setActionLoading(true);
    setShowCancellationModal(false);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED', hostResponse: reason })
      });
      if (res.ok) {
        setCurrentStatus('cancelled');
      }
    } catch {
      // Action failed silently
    } finally {
      setActionLoading(false);
    }
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
      case 'pending':
        return {
          color: 'bg-[#d4c4a8] text-[#344c3d]',
          icon: Clock,
          text: status === 'requested' ? 'Awaiting Response' : 'Pending',
          description: isHost ? 'Review this booking request and respond' : 'Waiting for host to respond'
        };
      case 'approved':
        return {
          color: 'bg-[#738a6e] text-white',
          icon: CheckCircle,
          text: 'Confirmed',
          description: 'This booking is confirmed! Event details have been shared.'
        };
      case 'declined':
      case 'rejected':
        return {
          color: 'bg-[#ebebe9] text-[#344c3d]',
          icon: XCircle,
          text: 'Declined',
          description: 'This booking request was declined.'
        };
      case 'cancellation_requested':
      case 'cancelled':
        return {
          color: 'bg-[#8ea58c] text-white',
          icon: AlertTriangle,
          text: 'Cancelled',
          description: 'This booking has been cancelled.'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <BookingHeader
          statusInfo={statusInfo}
          currentStatus={currentStatus}
          onRequestCancellation={() => setShowCancellationModal(true)}
        />

        {canTakeAction && (
          <ActionAlert
            artistName={artist?.name || bookingData.artistName}
            onApprove={handleApprove}
            onDecline={() => setShowDeclineModal(true)}
          />
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BookingDetailsSection
            booking={bookingData}
            artist={artist}
            host={host}
            formatDate={formatDate}
            currentStatus={currentStatus}
          />

          <BookingSidebar
            currentStatus={currentStatus}
            booking={bookingData}
          />
        </div>
      </div>

      <BookingModals
        showDeclineModal={showDeclineModal}
        showCancellationModal={showCancellationModal}
        artistName={artist?.name || bookingData.artistName}
        onCloseDeclineModal={() => setShowDeclineModal(false)}
        onCloseCancellationModal={() => setShowCancellationModal(false)}
        onConfirmDecline={handleDecline}
        onConfirmCancellation={handleCancellationRequest}
      />
    </div>
  );
}
