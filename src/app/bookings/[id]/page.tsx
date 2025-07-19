'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Calendar,
  Users,
  MapPin,
  Star,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  AlertTriangle,
  MessageCircle,
  Eye,
  User,
  Home,
  PartyPopper,
  Navigation,
  Contact,
  MessageSquare
} from 'lucide-react';
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
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
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

  const handleDecline = () => {
    if (!declineReason.trim()) {
      alert('Please provide a reason for declining');
      return;
    }
    setCurrentStatus('requested');
    setShowDeclineModal(false);
    // TODO: Send to backend, notify artist with reason
    console.log('Booking declined:', bookingId, 'Reason:', declineReason);
    
    // Show user feedback
    setTimeout(() => {
      alert('Booking declined successfully. The artist has been notified.');
    }, 500);
  };

  const handleCancellationRequest = () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for requesting cancellation');
      return;
    }
    setCurrentStatus('pending');
    setShowCancellationModal(false);
    // TODO: Send to backend, notify other party
    console.log('Cancellation requested:', bookingId, 'Reason:', cancellationReason);
    
    // Show user feedback
    setTimeout(() => {
      alert('Cancellation request sent. The other party will be notified to review your request.');
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Link href="/calendar">
                <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </Button>
              </Link>
            </div>
          </div>

          {/* Page Title & Status */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Booking Request
                </h1>
                <p className="text-neutral-600">{statusInfo.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={`${statusInfo.color} border-0 px-4 py-2`}>
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {statusInfo.text}
                </Badge>
                {currentStatus === 'approved' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCancellationModal(true)}
                    className="border-[#ebebe9] text-[#344c3d] hover:bg-[#ebebe9]"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Request Cancellation
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Alert for Hosts */}
        {canTakeAction && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary-900 mb-2">Action Required</h3>
                <p className="text-primary-800 mb-4">
                  {artist?.name} wants to perform at your venue. Review the details below and respond.
                </p>
                <div className="flex space-x-3">
                  <Button onClick={handleApprove} className="bg-[#738a6e] hover:bg-[#5e7259] text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Booking
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeclineModal(true)}
                    className="border-[#ebebe9] text-[#344c3d] hover:bg-[#ebebe9]"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200">
                <h2 className="text-xl font-semibold text-neutral-900">Event Details</h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900 mb-1">Date & Time</div>
                        <div className="text-neutral-600">
                          {formatDate(booking.eventDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-secondary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900 mb-1">Expected Attendance</div>
                        <div className="text-neutral-600">{booking.guestCount} people</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-[#d4c4a8] rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-[#344c3d]" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900 mb-1">Venue</div>
                        <div className="text-neutral-600">
                          {currentStatus === 'approved' 
                            ? `${host?.name}, ${host?.city}, ${host?.state}`
                            : `${host?.name}, ${host?.city}, ${host?.state} (full address shared when confirmed)`
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="font-medium text-neutral-900 mb-3">Request Message</div>
                      <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                        <p className="text-neutral-700 text-sm leading-relaxed">
                          "We're excited to perform at your venue! This will be an acoustic set featuring original songs and some covers. We bring our own guitars and just need basic mics. Looking forward to creating a magical evening with your community!"
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-neutral-900 mb-3">Special Requirements</div>
                      <div className="text-neutral-600 text-sm">
                        Basic sound system (mics only), vegetarian meal option for 3 people
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Artist Info */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-900">Artist</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    {artist?.bandPhotos && artist.bandPhotos.length > 0 ? (
                      <img 
                        src={artist.bandPhotos[0].url} 
                        alt={artist.bandPhotos[0].alt}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {artist?.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-neutral-900 text-lg">{artist?.name}</h4>
                      <div className="flex items-center text-sm text-neutral-600">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        {artist?.rating.toFixed(1)} ({artist?.reviewCount} reviews)
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Experience:</span>
                      <span className="font-medium text-neutral-900">{artist?.yearsActive} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Members:</span>
                      <span className="font-medium text-neutral-900">{artist?.members.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Cancellation:</span>
                      <Badge 
                        className={`${artist?.cancellationPolicy === 'flexible' 
                          ? 'bg-[#738a6e] text-white' 
                          : 'bg-[#d4c4a8] text-[#344c3d]'
                        } border-0`}
                      >
                        {artist?.cancellationPolicy}
                      </Badge>
                    </div>
                  </div>

                  <Link href={`/artists/${artist?.id}`}>
                    <Button variant="outline" size="sm" className="w-full border-neutral-300 hover:bg-neutral-50">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Host Info */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-900">Venue</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    {host?.hostInfo?.profilePhoto ? (
                      <img 
                        src={host.hostInfo.profilePhoto} 
                        alt={`${host.hostInfo.hostName} profile photo`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-primary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {host?.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-neutral-900 text-lg">{host?.name}</h4>
                      <div className="flex items-center text-sm text-neutral-600">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        {host?.rating.toFixed(1)} ({host?.reviewCount} reviews)
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Typical Attendance:</span>
                      <span className="font-medium text-neutral-900">{host?.showSpecs.avgAttendance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Max Capacity:</span>
                      <span className="font-medium text-neutral-900">{host?.showSpecs.indoorAttendanceMax}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Experience:</span>
                      <span className="font-medium text-neutral-900">{host?.showSpecs.hostingHistory}</span>
                    </div>
                  </div>

                  <Link href={`/hosts/${host?.id}`}>
                    <Button variant="outline" size="sm" className="w-full border-neutral-300 hover:bg-neutral-50">
                      <Home className="w-4 h-4 mr-2" />
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info (only if approved) */}
            {currentStatus === 'approved' && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-900">Contact Information</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-600">(555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-600">Continue via Messages</span>
                    </div>
                  </div>
                  <Link href="/messages">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link href="/messages">
                    <Button variant="outline" className="w-full justify-start border-neutral-300 hover:bg-neutral-50">
                      <MessageCircle className="w-4 h-4 mr-3" />
                      Messages
                    </Button>
                  </Link>
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full justify-start border-neutral-300 hover:bg-neutral-50">
                      <Calendar className="w-4 h-4 mr-3" />
                      View Calendar
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start border-neutral-300 hover:bg-neutral-50">
                      <User className="w-4 h-4 mr-3" />
                      All Bookings
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-900">Timeline</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#8ea58c] rounded-full"></div>
                    <div>
                      <div className="font-medium text-neutral-900">Request Sent</div>
                      <div className="text-sm text-neutral-600">
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
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        currentStatus === 'approved' ? 'bg-[#738a6e]' : 'bg-[#ebebe9]'
                      }`}></div>
                      <div>
                        <div className="font-medium text-neutral-900">
                          {currentStatus === 'approved' ? 'Approved' : 'Declined'}
                        </div>
                        <div className="text-sm text-neutral-600">Just now</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  Please let {artist?.name} know why you can't host this show. This helps them find a better fit.
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
                    onClick={() => setShowDeclineModal(false)}
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
                    onClick={() => setShowCancellationModal(false)}
                    variant="outline"
                    className="flex-1 border-neutral-300 hover:bg-neutral-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCancellationRequest}
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
    </div>
  );
}