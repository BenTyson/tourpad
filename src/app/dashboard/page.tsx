'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Calendar,
  Mail,
  Bell,
  Star,
  Users,
  MapPin,
  Clock,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Camera,
  Video,
  Edit,
  Home,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockBookings, mockMessages, mockNotifications } from '@/data/mockData';
import { testConcerts } from '@/data/realTestData';
import { useRouter } from 'next/navigation';

type UserRole = 'host' | 'artist' | 'admin' | 'fan';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // If not authenticated, redirect to login
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
          <p className="text-gray-600 mb-4">Please sign in to access your dashboard.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get user info from session
  const userRole = session.user.type as 'host' | 'artist' | 'admin' | 'fan';
  const userStatus = session.user.status;
  const selectedUserId = session.user.id;

  // Check if user has access to full dashboard functionality
  // Fans have access if payment is active, others need approval
  const hasFullAccess = userRole === 'admin' || 
                       userStatus === 'approved' || 
                       (userRole === 'fan' && session.user.paymentStatus === 'active');
  const needsPayment = userRole === 'artist' && userStatus === 'approved' && !session.user.paymentStatus;

  // Filter data based on user role
  const userBookings = userRole === 'admin' 
    ? mockBookings // Admin sees all bookings
    : userRole === 'fan'
    ? [] // Fans don't have bookings, they have concert reservations
    : mockBookings.filter(booking => 
        userRole === 'host' ? booking.hostId === selectedUserId : booking.artistId === selectedUserId
      );

  // Fan-specific data
  const fanConcerts = userRole === 'fan' 
    ? testConcerts.filter(concert => concert.status === 'upcoming')
    : [];
  
  const fanUpcomingConcerts = userRole === 'fan'
    ? testConcerts.filter(concert => 
        concert.status === 'upcoming' && 
        concert.attendees.includes(selectedUserId)
      )
    : [];

  const userMessages = userRole === 'admin'
    ? mockMessages // Admin sees all messages
    : mockMessages.filter(msg => 
        msg.senderId === selectedUserId || msg.recipientId === selectedUserId
      );

  const userNotifications = userRole === 'admin'
    ? mockNotifications // Admin sees all notifications  
    : mockNotifications.filter(notif => 
        notif.userId === selectedUserId
      );

  const upcomingBookings = userRole === 'fan'
    ? fanUpcomingConcerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : userBookings
        .filter(booking => {
          const eventDate = new Date(booking.eventDate);
          const now = new Date();
          const isUpcoming = eventDate > now;
          const isApproved = booking.status === 'approved';
          return isUpcoming && isApproved;
        })
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const pendingActions = userBookings.filter(booking => 
    // Filter out completed bookings and show only actionable items
    booking.status !== 'declined' && booking.status !== 'cancelled' && booking.status !== 'approved' &&
    (userRole === 'host' ? booking.status === 'requested' : booking.status === 'pending')
  );

  const unreadMessages = userMessages.filter(msg => !msg.read && msg.recipientId === selectedUserId);
  const unreadNotifications = userNotifications.filter(notif => !notif.read);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'requested': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userRole === 'admin' ? 'Admin Dashboard' : 
               userRole === 'host' ? 'Host Dashboard' : 
               userRole === 'artist' ? 'Artist Dashboard' : 'Fan Dashboard'}
            </h1>
            <p className="text-gray-600">
              {userRole === 'admin' ? 'Platform overview and management' :
               userRole === 'host' 
                ? 'Manage your venue and upcoming shows' 
                : userRole === 'artist'
                ? 'Track your tour and upcoming performances'
                : 'Discover and attend exclusive house concerts'
              }
            </p>
          </div>
        </div>

        {/* Status-based restrictions */}
        {!hasFullAccess && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-900 mb-2">Limited Dashboard Access</h3>
                <p className="text-amber-800 mb-4">
                  {userRole === 'fan' && session.user.paymentStatus !== 'active' && 'Your membership has expired. Renew to continue accessing exclusive house concerts.'}
                  {userRole !== 'fan' && userStatus === 'pending' && 'Your application is under review. Full dashboard functionality will be available once approved.'}
                  {userRole !== 'fan' && userStatus === 'rejected' && 'Your application was not approved. Please review your application status for next steps.'}
                  {userRole !== 'fan' && userStatus === 'suspended' && 'Your account has been suspended. Contact support for assistance.'}
                </p>
                <div className="flex space-x-3">
                  {userRole === 'fan' && session.user.paymentStatus !== 'active' ? (
                    <Link
                      href="/payment/fan"
                      className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                    >
                      Renew Membership
                    </Link>
                  ) : (
                    <Link
                      href="/account/status"
                      className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                    >
                      Check Status
                    </Link>
                  )}
                  {userRole !== 'fan' && userStatus === 'rejected' && (
                    <Link
                      href="/register"
                      className="bg-white text-amber-800 px-4 py-2 rounded-lg text-sm font-medium border border-amber-300 hover:bg-amber-50 transition-colors"
                    >
                      Reapply
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {needsPayment && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-primary-900 mb-2">Complete Your Registration</h3>
                <p className="text-primary-800 mb-4">
                  Congratulations! Your application has been approved. Complete your $400 annual membership payment to unlock full platform access.
                </p>
                <Link
                  href="/subscription"
                  className="bg-primary-400 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors"
                >
                  Complete Payment
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Alert Bar - Action Items */}
        {hasFullAccess && (pendingActions.length > 0 || unreadMessages.length > 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-blue-600 mr-3" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">You have items that need attention</h3>
                <div className="text-sm text-blue-800 mt-1">
                  {pendingActions.length > 0 && (
                    <span className="mr-4">
                      {pendingActions.length} booking {pendingActions.length === 1 ? 'request' : 'requests'} pending
                    </span>
                  )}
                  {unreadMessages.length > 0 && (
                    <span>
                      {unreadMessages.length} unread {unreadMessages.length === 1 ? 'message' : 'messages'}
                    </span>
                  )}
                </div>
              </div>
              <Link href={pendingActions.length > 0 ? `/bookings/${pendingActions[0].id}` : '/dashboard'}>
  <Button size="sm">Review</Button>
</Link>
            </div>
          </div>
        )}

        {/* Dashboard Content - Only show for approved users */}
        {hasFullAccess ? (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</div>
              <div className="text-sm text-gray-600">
                {userRole === 'fan' ? 'My Reservations' : 'Upcoming Shows'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {userRole === 'fan' ? fanConcerts.length : pendingActions.length}
              </div>
              <div className="text-sm text-gray-600">
                {userRole === 'fan' ? 'Available Concerts' : 
                 userRole === 'host' ? 'New Requests' : 'Pending Responses'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{unreadMessages.length}</div>
              <div className="text-sm text-gray-600">Unread Messages</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {userRole === 'fan' ? 'Your Concert Reservations' :
                   userRole === 'host' ? 'Upcoming Shows at Your Venue' : 'Your Upcoming Performances'}
                </h2>
                <Link href="/calendar">
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {userRole === 'fan' ? booking.title :
                               userRole === 'host' ? booking.artist.name : booking.host.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <span>{userRole === 'fan' ? formatDate(new Date(booking.date + 'T' + booking.startTime)) : formatDate(booking.eventDate)}</span>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {userRole === 'fan' ? booking.capacity : booking.guestCount} {userRole === 'fan' ? 'capacity' : 'guests'}
                              </div>
                              {userRole === 'artist' && (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {booking.host.city}, {booking.host.state}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={getStatusColor(userRole === 'fan' ? 'success' : booking.status) as any}>
                            {userRole === 'fan' ? 'Reserved' : booking.status}
                          </Badge>
                          <Link href={userRole === 'fan' ? `/concerts/${booking.id}` : `/bookings/${booking.id}`}>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {userRole === 'fan' ? 'No upcoming concerts' : 'No upcoming shows'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {userRole === 'fan' 
                        ? 'Discover and book your first house concert experience'
                        : userRole === 'host' 
                        ? 'Start hosting by browsing artists looking for venues'
                        : 'Find your next performance venue'
                      }
                    </p>
                    <Link href={userRole === 'fan' ? '/artists' : userRole === 'host' ? '/artists' : '/hosts'}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        {userRole === 'fan' ? 'Browse Concerts' : userRole === 'host' ? 'Browse Artists' : 'Find Venues'}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Items */}
            {pendingActions.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    {userRole === 'host' ? 'Booking Requests' : 'Pending Requests'}
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingActions.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {userRole === 'host' ? booking.artist.name : booking.host.name}
                            </h3>
                            <div className="text-sm text-gray-600">
                              {formatDate(booking.eventDate)} • {booking.guestCount} guests
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {userRole === 'host' ? (
                            <>
                              <Link href={`/bookings/${booking.id}`}>
                                <Button variant="outline" size="sm">View Details</Button>
                              </Link>
                              <Link href={`/bookings/${booking.id}`}>
                                <Button size="sm">Review</Button>
                              </Link>
                            </>
                          ) : (
                            <Link href={`/bookings/${booking.id}`}>
                              <Button variant="outline" size="sm">View Status</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Messages */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Messages</h2>
                <Link href="/messages">
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {userMessages.length > 0 ? (
                  <div className="space-y-3">
                    {userMessages.slice(0, 3).map((message) => (
                      <div key={message.id} className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 ${
                        !message.read && message.recipientId === selectedUserId 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{message.senderName}</h4>
                          <span className="text-xs text-gray-500">
                            {new Intl.DateTimeFormat('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            }).format(new Date(message.timestamp))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {message.content}
                        </p>
                        {!message.read && message.recipientId === selectedUserId && (
                          <div className="mt-2">
                            <Button size="sm" variant="outline">Reply</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No messages yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Quick Actions</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href={userRole === 'fan' ? '/artists' : userRole === 'host' ? '/artists' : '/hosts'}>
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-3" />
                      {userRole === 'fan' ? 'Browse Concerts' : userRole === 'host' ? 'Find Artists' : 'Find Venues'}
                    </Button>
                  </Link>
                  <Link href={userRole === 'fan' ? '/dashboard/profile' : `/${userRole}s/${selectedUserId}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-3" />
                      View My Profile
                    </Button>
                  </Link>
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-3" />
                      {userRole === 'fan' ? 'My Concert Calendar' : 'Manage Calendar'}
                    </Button>
                  </Link>
                  <Link href="/messages">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-3" />
                      All Messages
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="w-4 h-4 mr-3" />
                      Manage Profile & Media
                    </Button>
                  </Link>
                  {userRole === 'host' && (
                    <Link href="/dashboard/lodging/setup">
                      <Button variant="outline" className="w-full justify-start">
                        <Home className="w-4 h-4 mr-3" />
                        Setup Lodging
                      </Button>
                    </Link>
                  )}
                  {userRole === 'host' && (
                    <Link href="/dashboard/lodging/photos">
                      <Button variant="outline" className="w-full justify-start">
                        <Camera className="w-4 h-4 mr-3" />
                        Lodging Photos
                      </Button>
                    </Link>
                  )}
                  {userRole === 'host' && (
                    <Link href="/dashboard/sound-system">
                      <Button variant="outline" className="w-full justify-start">
                        <Volume2 className="w-4 h-4 mr-3" />
                        Sound System Setup
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Your Stats</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {userRole === 'fan' ? 'Concerts Attended' : 
                       userRole === 'host' ? 'Shows Hosted' : 'Shows Played'}
                    </span>
                    <span className="text-sm font-medium">
                      {userRole === 'fan' ? '8' : userRole === 'host' ? '12' : '24'} this year
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Views</span>
                    <span className="text-sm font-medium">156 this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </>
        ) : (
          /* Limited Dashboard for Non-Approved Users */
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Clock className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                Dashboard Unavailable
              </h2>
              <p className="text-neutral-600 mb-6">
                Your dashboard will be available once your application is approved and any required payments are complete.
              </p>
              <div className="space-y-3">
                <Link
                  href="/account/status"
                  className="block w-full bg-primary-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-500 transition-colors"
                >
                  Check Application Status
                </Link>
                <Link
                  href="/"
                  className="block w-full bg-white text-primary-600 py-3 px-6 rounded-lg font-medium border-2 border-primary-400 hover:bg-primary-50 transition-colors"
                >
                  Browse TourPad
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}