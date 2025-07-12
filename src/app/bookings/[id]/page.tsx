'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockBookings, mockHosts, mockArtists } from '@/data/mockData';

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const { data: session, status } = useSession();
  
  const booking = mockBookings.find(b => b.id === bookingId);
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'requested');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please sign in to view booking details.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const host = mockHosts.find(h => h.id === booking.hostId);
  const artist = mockArtists.find(a => a.id === booking.artistId);

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

  const handleDecline = () => {
    if (!declineReason.trim()) {
      alert('Please provide a reason for declining');
      return;
    }
    setCurrentStatus('declined');
    setShowDeclineModal(false);
    // TODO: Send to backend, notify artist with reason
    console.log('Booking declined:', bookingId, 'Reason:', declineReason);
    
    // Show user feedback
    setTimeout(() => {
      alert('Booking declined successfully. The artist has been notified.');
    }, 500);
  };

  const formatDate = (date: Date) => {
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
          color: 'warning',
          icon: ClockIcon,
          text: 'Awaiting Response',
          description: isHost ? 'Review this booking request and respond' : 'Waiting for host to respond'
        };
      case 'approved':
        return {
          color: 'success',
          icon: CheckCircleIcon,
          text: 'Confirmed',
          description: 'This booking is confirmed! Event details have been shared.'
        };
      case 'declined':
        return {
          color: 'error',
          icon: XCircleIcon,
          text: 'Declined',
          description: 'This booking request was declined.'
        };
      case 'pending':
        return {
          color: 'warning',
          icon: ClockIcon,
          text: 'Pending',
          description: 'Waiting for artist to confirm'
        };
      default:
        return {
          color: 'default',
          icon: ClockIcon,
          text: status,
          description: ''
        };
    }
  };

  const statusInfo = getStatusInfo(currentStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header with Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Request
            </h1>
            <Badge variant={statusInfo.color as any} className="text-sm px-3 py-1">
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusInfo.text}
            </Badge>
          </div>
          <p className="text-gray-600">{statusInfo.description}</p>
        </div>

        {/* Action Buttons for Hosts */}
        {canTakeAction && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-3" />
              <h3 className="font-medium text-blue-900">Action Required</h3>
            </div>
            <p className="text-blue-800 mb-4">
              {artist?.name} wants to perform at your venue. Review the details below and respond.
            </p>
            <div className="flex space-x-3">
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Approve Booking
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDeclineModal(true)}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <XCircleIcon className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </div>
          </div>
        )}

        {/* Approved Booking Info */}
        {currentStatus === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
              <h3 className="font-medium text-green-900">Booking Confirmed!</h3>
            </div>
            <div className="text-green-800 space-y-2">
              <p>🎉 Great! This show is confirmed.</p>
              <p>📍 <strong>Venue address:</strong> {host?.address}, {host?.city}, {host?.state}</p>
              <p>📞 <strong>Contact info has been shared</strong> between both parties</p>
              <p>💬 <strong>Continue coordination</strong> in Messages</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Event Details</h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Date & Time</div>
                        <div className="text-sm text-gray-600">
                          {formatDate(booking.eventDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <UserGroupIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Expected Attendance</div>
                        <div className="text-sm text-gray-600">{booking.guestCount} people</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPinIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Venue</div>
                        <div className="text-sm text-gray-600">
                          {currentStatus === 'approved' 
                            ? `${host?.address}, ${host?.city}, ${host?.state}`
                            : `${host?.city}, ${host?.state} (address shared when confirmed)`
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="font-medium mb-2">Request Message</div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        "We're excited to perform at your venue! This will be an acoustic set featuring original songs and some covers. We bring our own guitars and just need basic mics. Looking forward to creating a magical evening with your community!"
                      </div>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Special Requirements</div>
                      <div className="text-sm text-gray-600">
                        Basic sound system (mics only), vegetarian meal option for 3 people
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Artist Info */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Artist</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-purple-600">
                        {artist?.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{artist?.name}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        {artist?.rating.toFixed(1)} ({artist?.reviewCount} reviews)
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span>{artist?.yearsActive} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Members:</span>
                      <span>{artist?.members.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cancellation:</span>
                      <Badge variant={artist?.cancellationPolicy === 'flexible' ? 'success' : 'warning'}>
                        {artist?.cancellationPolicy}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link href={`/artists/${artist?.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Host Info */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Venue</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-green-600">
                        {host?.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{host?.name}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        {host?.rating.toFixed(1)} ({host?.reviewCount} reviews)
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Typical Attendance:</span>
                      <span>{host?.showSpecs.avgAttendance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Capacity:</span>
                      <span>{host?.showSpecs.indoorAttendanceMax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span>{host?.showSpecs.hostingHistory}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link href={`/hosts/${host?.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info (only if approved) */}
            {currentStatus === 'approved' && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Contact Information</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm">(555) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm">Continue via Messages</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/messages">
                      <Button variant="outline" size="sm" className="w-full">
                        Send Message
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Quick Actions</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/messages">
                    <Button variant="outline" className="w-full justify-start">
                      <EnvelopeIcon className="w-4 h-4 mr-3" />
                      Messages
                    </Button>
                  </Link>
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="w-4 h-4 mr-3" />
                      View Calendar
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start">
                      All Bookings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Booking Timeline */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Timeline</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium">Request Sent</div>
                      <div className="text-gray-600">
                        {new Intl.DateTimeFormat('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        }).format(new Date(booking.createdAt))}
                      </div>
                    </div>
                  </div>
                  
                  {currentStatus !== 'requested' && (
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        currentStatus === 'approved' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-medium">
                          {currentStatus === 'approved' ? 'Approved' : 'Declined'}
                        </div>
                        <div className="text-gray-600">Just now</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <h3 className="text-lg font-semibold">Decline Booking Request</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Please let {artist?.name} know why you can't host this show. This helps them find a better fit.
                </p>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                  rows={4}
                  placeholder="e.g., Date conflict, venue capacity, etc."
                />
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowDeclineModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDecline}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Decline Booking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Demo Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <h4 className="font-medium text-blue-800">Demo Mode Notice</h4>
            <p className="text-sm text-blue-700">
              This is demo data. In the full version, declined bookings will be removed from your dashboard in real-time and all parties will be notified automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}