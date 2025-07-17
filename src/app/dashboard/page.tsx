'use client';
import { useState, useEffect } from 'react';
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
  Volume2,
  UserCheck,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockBookings, mockMessages, mockNotifications, mockArtists, mockHosts } from '@/data/mockData';
import { testConcerts } from '@/data/realTestData';
import { useRouter } from 'next/navigation';
import { PastShowsSection } from '@/components/reviews/PastShowsSection';
import { PrivateReviewsSection } from '@/components/reviews/PrivateReviewsSection';

type UserRole = 'host' | 'artist' | 'admin' | 'fan';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userStats, setUserStats] = useState({
    responseRate: 95,
    averageRating: 4.8,
    totalShows: 0,
    profileViews: 0
  });
  
  // Fetch user stats
  useEffect(() => {
    if (session?.user) {
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setUserStats(data);
          }
        })
        .catch(err => {
          console.error('Error fetching stats:', err);
        });
    }
  }, [session?.user]);
  
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
  
  // CRITICAL: ID Mapping between data sources
  // Session uses realTestData IDs ('artist1'), but profile pages use mockData IDs ('1')
  // This mapping bridges the gap between authentication and display data
  let profileId = selectedUserId;
  if (userRole === 'artist') {
    const artist = mockArtists.find(a => a.userId === selectedUserId);
    profileId = artist?.id || selectedUserId;
  } else if (userRole === 'host') {
    const host = mockHosts.find(h => h.userId === selectedUserId);
    profileId = host?.id || selectedUserId;
  }

  // Check if user has access to full dashboard functionality
  // Fans have access if payment is active, others need approval or active status
  const hasFullAccess = userRole === 'admin' || 
                       userStatus === 'approved' || 
                       userStatus === 'active' ||
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Status-based restrictions */}
        {!hasFullAccess && (
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-secondary-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-secondary-900 mb-2">Limited Dashboard Access</h3>
                <p className="text-secondary-800 mb-4">
                  {userRole === 'fan' && session.user.paymentStatus !== 'active' && 'Your membership has expired. Renew to continue accessing exclusive house concerts.'}
                  {userRole !== 'fan' && userStatus === 'pending' && 'Your application is under review. Full dashboard functionality will be available once approved.'}
                  {userRole !== 'fan' && userStatus === 'rejected' && 'Your application was not approved. Please review your application status for next steps.'}
                  {userRole !== 'fan' && userStatus === 'suspended' && 'Your account has been suspended. Contact support for assistance.'}
                </p>
                <div className="flex space-x-3">
                  {userRole === 'fan' && session.user.paymentStatus !== 'active' ? (
                    <Link
                      href="/payment/fan"
                      className="bg-secondary-100 text-secondary-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors"
                    >
                      Renew Membership
                    </Link>
                  ) : (
                    <Link
                      href="/account/status"
                      className="bg-secondary-100 text-secondary-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors"
                    >
                      Check Status
                    </Link>
                  )}
                  {userRole !== 'fan' && userStatus === 'rejected' && (
                    <Link
                      href="/register"
                      className="bg-white text-secondary-800 px-4 py-2 rounded-lg text-sm font-medium border border-secondary-300 hover:bg-secondary-50 transition-colors"
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
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-primary-600 mr-3" />
              <div className="flex-1">
                <h3 className="font-medium text-primary-900">You have items that need attention</h3>
                <div className="text-sm text-primary-800 mt-1">
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
            {/* Quick Actions - Prominent Section */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">
                      Welcome back, {session?.user?.name || 'User'}
                    </h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      {userRole === 'admin' ? 'Platform overview and management' :
                       userRole === 'host' 
                        ? 'Manage your venue and upcoming shows' 
                        : userRole === 'artist'
                        ? 'Track your tour and upcoming performances'
                        : 'Discover and attend exclusive house concerts'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neutral-500">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* Primary Action */}
                    <Link href={userRole === 'fan' ? '/artists' : userRole === 'host' ? '/artists' : '/hosts'}>
                      <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 p-4 text-white transition-all duration-300 hover:from-primary-600 hover:to-primary-700 hover:shadow-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Plus className="w-5 h-5" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-semibold">
                              {userRole === 'fan' ? 'Browse Concerts' : userRole === 'host' ? 'Find Artists' : 'Find Venues'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Secondary Actions */}
                    <Link href={userRole === 'fan' ? '/dashboard/profile' : `/${userRole}s/${profileId}`}>
                      <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Eye className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-semibold text-neutral-900">View Profile</h3>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Link href="/messages">
                      <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <Mail className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                              {unreadMessages.length > 0 && (
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-white">{unreadMessages.length}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-semibold text-neutral-900">Messages</h3>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Link href="/calendar">
                      <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Calendar className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-semibold text-neutral-900">Calendar</h3>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Link href="/dashboard/profile">
                      <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Edit className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-semibold text-neutral-900">Edit Profile</h3>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Host-specific actions */}
                    {userRole === 'host' && (
                      <>
                        <Link href="/dashboard/sound-system">
                          <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <Volume2 className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-semibold text-neutral-900">Sound System</h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                        
                        <Link href="/dashboard/lodging/setup">
                          <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <Home className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-semibold text-neutral-900">Lodging Setup</h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </>
                    )}

                    {/* Fan-specific actions */}
                    {userRole === 'fan' && (
                      <>
                        <Link href="/hosts">
                          <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <Home className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-semibold text-neutral-900">Browse Venues</h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                        
                        <Link href="/payment/fan">
                          <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <Star className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-semibold text-neutral-900">Manage Membership</h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </>
                    )}

                    {/* Admin-specific actions */}
                    {userRole === 'admin' && (
                      <>
                        <Link href="/admin/applications">
                          <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <UserCheck className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-semibold text-neutral-900">Review Applications</h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                        
                        <Link href="/admin/platform">
                          <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <Shield className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-semibold text-neutral-900">Platform Management</h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-neutral-900">{upcomingBookings.length}</div>
                    <div className="text-sm text-neutral-600">
                      {userRole === 'fan' ? 'My Reservations' : 'Upcoming Shows'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-secondary-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-neutral-900">
                      {userRole === 'fan' ? fanConcerts.length : pendingActions.length}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {userRole === 'fan' ? 'Available Concerts' : 
                       userRole === 'host' ? 'New Requests' : 'Pending Responses'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-neutral-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-neutral-900">{unreadMessages.length}</div>
                    <div className="text-sm text-neutral-600">Unread Messages</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-neutral-900">
                      {userStats.averageRating > 0 ? userStats.averageRating.toFixed(1) : 'N/A'}
                    </div>
                    <div className="text-sm text-neutral-600">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">
                    {userRole === 'fan' ? 'Your Concert Reservations' :
                     userRole === 'host' ? 'Upcoming Shows at Your Venue' : 'Your Upcoming Performances'}
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    {userRole === 'fan' ? 'Concerts you\'ve reserved' :
                     userRole === 'host' ? 'Artists performing at your venue' : 'Your confirmed performances'}
                  </p>
                </div>
                <Link href="/calendar">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
              </div>
              <div className="p-6">
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-neutral-900">
                              {userRole === 'fan' ? booking.title :
                               userRole === 'host' ? booking.artist.name : booking.host.name}
                            </h3>
                            <div className="flex items-center text-sm text-neutral-600 space-x-4">
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
                          <Badge variant={getStatusColor(userRole === 'fan' ? 'success' : booking.status) as any} className="bg-primary-100 text-primary-700">
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
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      {userRole === 'fan' ? 'No upcoming concerts' : 'No upcoming shows'}
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      {userRole === 'fan' 
                        ? 'Discover and book your first house concert experience'
                        : userRole === 'host' 
                        ? 'Start hosting by browsing artists looking for venues'
                        : 'Find your next performance venue'
                      }
                    </p>
                    <Link href={userRole === 'fan' ? '/artists' : userRole === 'host' ? '/artists' : '/hosts'}>
                      <Button className="bg-primary-600 text-white hover:bg-primary-700">
                        <Plus className="w-4 h-4 mr-2" />
                        {userRole === 'fan' ? 'Browse Concerts' : userRole === 'host' ? 'Browse Artists' : 'Find Venues'}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Past Shows - Only show for artists and hosts */}
            {(userRole === 'artist' || userRole === 'host') && (
              <PastShowsSection userId={selectedUserId} userType={userRole} />
            )}

            {/* Private Reviews - Only show for artists and hosts */}
            {(userRole === 'artist' || userRole === 'host') && (
              <PrivateReviewsSection userId={selectedUserId} userType={userRole} />
            )}

            {/* Action Items */}
            {pendingActions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    {userRole === 'host' ? 'Booking Requests' : 'Pending Requests'}
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    {userRole === 'host' ? 'Artists requesting to book your venue' : 'Waiting for host responses'}
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {pendingActions.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-secondary-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-neutral-900">
                              {userRole === 'host' ? booking.artist.name : booking.host.name}
                            </h3>
                            <div className="text-sm text-neutral-600">
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
                                <Button size="sm" className="bg-secondary-600 text-white hover:bg-secondary-700">Review</Button>
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
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Messages */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Recent Messages</h2>
                  <p className="text-sm text-neutral-600 mt-1">Latest conversations</p>
                </div>
                <Link href="/messages">
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
              <div className="p-6">
                {userMessages.length > 0 ? (
                  <div className="space-y-3">
                    {userMessages.slice(0, 3).map((message) => (
                      <div key={message.id} className={`p-3 rounded-lg border transition-colors hover:bg-neutral-50 ${
                        !message.read && message.recipientId === selectedUserId 
                          ? 'bg-primary-50 border-primary-200' 
                          : 'border-neutral-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm text-neutral-900">{message.senderName}</h4>
                          <span className="text-xs text-neutral-500">
                            {new Intl.DateTimeFormat('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            }).format(new Date(message.timestamp))}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 line-clamp-2">
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
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6 text-neutral-400" />
                    </div>
                    <p className="text-sm text-neutral-600">No messages yet</p>
                  </div>
                )}
              </div>
            </div>


            {/* Performance Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900">Your Stats</h2>
                <p className="text-sm text-neutral-600 mt-1">Performance metrics</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Response Rate</span>
                    <span className="text-sm font-medium text-neutral-900">{userStats.responseRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Average Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-primary-500 fill-current mr-1" />
                      <span className="text-sm font-medium text-neutral-900">
                        {userStats.averageRating > 0 ? userStats.averageRating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      {userRole === 'fan' ? 'Concerts Attended' : 
                       userRole === 'host' ? 'Shows Hosted' : 'Shows Played'}
                    </span>
                    <span className="text-sm font-medium text-neutral-900">
                      {userStats.totalShows} this year
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Profile Views</span>
                    <span className="text-sm font-medium text-neutral-900">{userStats.profileViews} this month</span>
                  </div>
                </div>
              </div>
            </div>
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