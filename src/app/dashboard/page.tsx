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
  Shield,
  CreditCard,
  TrendingUp,
  DollarSign,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockMessages, mockNotifications, mockArtists, mockHosts } from '@/data/mockData';
import { testConcerts } from '@/data/realTestData';
import UpcomingShowsList from '@/components/shows/UpcomingShowsList';
import BookingList from '@/components/bookings/BookingList';
import { useRouter } from 'next/navigation';
import { PastShowsSection } from '@/components/reviews/PastShowsSection';
import { PrivateReviewsSection } from '@/components/reviews/PrivateReviewsSection';
import HoldingPage from '@/components/dashboard/HoldingPage';
import RSVPManagement from '@/components/host/RSVPManagement';
import SpotifyConnectionCard from '@/components/dashboard/artist/SpotifyConnectionCard';

type UserRole = 'host' | 'artist' | 'admin' | 'fan';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    responseRate: 95,
    averageRating: 4.8,
    totalShows: 0,
    profileViews: 0
  });
  const [userProfileId, setUserProfileId] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [spotifyConnection, setSpotifyConnection] = useState<any>(null);
  
  // Fetch current user data (with latest status from database)
  useEffect(() => {
    if (session?.user) {
      setUserLoading(true);
      fetch('/api/user/current')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          if (!data.error) {
            setCurrentUser(data);
          } else {
            console.warn('User fetch returned error:', data.error);
            // Don't throw here, just log the warning
          }
        })
        .catch(err => {
          console.warn('Could not fetch current user data:', err.message);
          // Don't crash the component, just log and continue
        })
        .finally(() => {
          setUserLoading(false);
        });
    }
  }, [session?.user]);
  
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

  // Fetch user profile ID (host ID or artist ID)
  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/profile-id')
        .then(res => res.json())
        .then(data => {
          if (data.profileId) {
            setUserProfileId(data.profileId);
          }
        })
        .catch(err => {
          console.error('Error fetching profile ID:', err);
        });
    }
  }, [session?.user]);

  // Fetch subscription data for artists and fans
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!session?.user || !currentUser) return;
      
      const userRole = currentUser.userType || currentUser.type || 'fan';
      if (userRole !== 'artist' && userRole !== 'fan') return;

      setSubscriptionLoading(true);
      try {
        const response = await fetch('/api/payments/subscription-status');
        if (response.ok) {
          const data = await response.json();
          setSubscriptionData(data);
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [session?.user, currentUser]);

  // Fetch Spotify connection data for artists
  useEffect(() => {
    const fetchSpotifyConnection = async () => {
      if (!currentUser || currentUser.userType !== 'artist' || !userProfileId) return;
      
      try {
        const response = await fetch(`/api/spotify/artist/${userProfileId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.artist) {
            setSpotifyConnection({
              spotifyArtistId: data.artist.spotifyArtistId,
              spotifyVerified: data.artist.spotifyVerified,
              spotifyFollowers: data.artist.spotifyFollowers,
              spotifyPopularity: data.artist.spotifyPopularity,
              lastSpotifySync: data.artist.lastSpotifySync
            });
          }
        }
      } catch (error) {
        console.error('Error fetching Spotify connection:', error);
      }
    };
    
    fetchSpotifyConnection();
  }, [currentUser, userProfileId]);
  
  // If not authenticated, redirect to login
  if (status === 'loading' || userLoading) {
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

  // Get user info from current user data (fresh from database) if available, otherwise fall back to session
  const userData = currentUser || session.user;
  const rawUserRole = userData.userType || userData.type || 'fan';
  const userRole: UserRole = rawUserRole as UserRole;
  const userStatus = userData.status || 'pending';
  
  // PAYMENT DEBUG: Log data source and status for payment troubleshooting
  if (userRole === 'artist') {
    console.log('Payment status debug:', {
      dataSource: currentUser ? 'database' : 'session',
      userStatus,
      currentUserLoading: userLoading,
      rawStatus: userData.status,
      statusCheck: userStatus !== 'active',
      willShowPaymentPage: userRole === 'artist' && userStatus === 'approved'
    });
  }
  
  // Helper function to check user role (fixes TypeScript narrowing issues)
  const isUserRole = (role: UserRole) => (userRole as string) === role;
  const selectedUserId = userData.id;

  // Redirect fans to their dedicated dashboard
  if (isUserRole('fan')) {
    router.push('/dashboard/fan');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to fan dashboard...</p>
        </div>
      </div>
    );
  }

  // Status-based routing logic
  
  // PENDING users (except fans) see holding page
  if (userStatus === 'pending' && (userRole as string) !== 'fan') {
    return (
      <HoldingPage 
        user={{
          name: userData.name || '',
          email: userData.email || '',
          userType: userRole.toUpperCase() as 'HOST' | 'ARTIST' | 'FAN',
          status: userStatus,
          createdAt: userData.createdAt || new Date().toISOString()
        }}
      />
    );
  }

  // REJECTED users see rejection notice
  if (userStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Approved</h1>
            <p className="text-gray-600 mb-6">
              Unfortunately, your {userRole} application was not approved at this time. 
              You may reapply in the future or contact support for more information.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/register?type=' + userRole)}
                className="w-full"
              >
                Apply Again
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => router.push('/contact')}
                className="w-full"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ARTISTS with APPROVED status need to complete payment
  if (userRole === 'artist' && userStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Congratulations!</h1>
            <p className="text-gray-600 mb-6">
              Your artist application has been approved! Complete your payment to access your full dashboard and start booking shows.
            </p>
            <Button 
              onClick={() => router.push('/payment/artist')}
              className="w-full mb-3"
            >
              Complete Payment Setup
            </Button>
            <p className="text-sm text-gray-500">
              Annual membership: $400/year
            </p>
          </div>
        </div>
      </div>
    );
  }

  // FANS with PENDING status need to complete payment
  if ((userRole as string) === 'fan' && userStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to TourPad!</h1>
            <p className="text-gray-600 mb-6">
              Complete your subscription to start discovering and RSVPing to intimate live music experiences in your area.
            </p>
            <Button 
              onClick={() => router.push('/payment/fan')}
              className="w-full mb-3"
            >
              Start Subscription
            </Button>
            <p className="text-sm text-gray-500">
              Monthly membership: $10/month
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Only ACTIVE users proceed to full dashboard
  if (userStatus !== 'active') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Status: {userStatus}</h1>
          <p className="text-gray-600 mb-4">Your account is not currently active.</p>
          <Button onClick={() => router.push('/contact')}>
            Contact Support
          </Button>
        </div>
      </div>
    );
  }
  
  // CRITICAL: ID Mapping between data sources
  // Session uses realTestData IDs ('artist1'), but profile pages use mockData IDs ('1')
  // This mapping bridges the gap between authentication and display data
  let profileId = selectedUserId;
  if (userRole === 'artist') {
    const artist = mockArtists?.find(a => a.userId === selectedUserId);
    profileId = artist?.id || selectedUserId;
  } else if (userRole === 'host') {
    const host = mockHosts?.find(h => h.userId === selectedUserId);
    profileId = host?.id || selectedUserId;
  }

  // Check if user has access to full dashboard functionality
  // Fans have access if payment is active, others need approval or active status
  const hasFullAccess = userRole === 'admin' || 
                       userStatus === 'approved' || 
                       userStatus === 'active' ||
                       (isUserRole('fan') && userData.fan?.subscriptionStatus === 'ACTIVE');
  const needsPayment = userRole === 'artist' && userStatus === 'approved' && userData.artist?.approvedAt && !userData.fan?.subscriptionStatus;

  // Bookings are now handled by BookingList component which fetches real data

  // Fan-specific data
  const fanConcerts = isUserRole('fan') 
    ? (testConcerts || []).filter(concert => concert.status === 'upcoming')
    : [];
  
  const fanUpcomingConcerts = isUserRole('fan')
    ? (testConcerts || []).filter(concert => 
        concert.status === 'upcoming' && 
        concert.attendees?.includes(selectedUserId)
      )
    : [];

  const userMessages = userRole === 'admin'
    ? mockMessages || [] // Admin sees all messages
    : (mockMessages || []).filter(msg => 
        msg.senderId === selectedUserId || msg.recipientId === selectedUserId
      );

  const userNotifications = userRole === 'admin'
    ? mockNotifications || [] // Admin sees all notifications  
    : (mockNotifications || []).filter(notif => 
        notif.userId === selectedUserId
      );

  const upcomingBookings = isUserRole('fan')
    ? fanUpcomingConcerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : []; // Real bookings now handled by BookingList component

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
                  {isUserRole('fan') && userData.fan?.subscriptionStatus !== 'ACTIVE' && 'Your membership has expired. Renew to continue accessing exclusive house concerts.'}
                  {!isUserRole('fan') && userStatus === 'pending' && 'Your application is under review. Full dashboard functionality will be available once approved.'}
                  {!isUserRole('fan') && userStatus === 'rejected' && 'Your application was not approved. Please review your application status for next steps.'}
                  {!isUserRole('fan') && userStatus === 'suspended' && 'Your account has been suspended. Contact support for assistance.'}
                </p>
                <div className="flex space-x-3">
                  {userRole === 'fan' && userData.fan?.subscriptionStatus !== 'ACTIVE' ? (
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
        {hasFullAccess && (unreadMessages.length > 0) && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-primary-600 mr-3" />
              <div className="flex-1">
                <h3 className="font-medium text-primary-900">You have items that need attention</h3>
                <div className="text-sm text-primary-800 mt-1">
                  {unreadMessages.length > 0 && (
                    <span>
                      {unreadMessages.length} unread {unreadMessages.length === 1 ? 'message' : 'messages'}
                    </span>
                  )}
                </div>
              </div>
              <Link href='/dashboard/messages'>
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
                      Welcome back, {userData.name || 'User'}
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
                    <Link href={userRole === 'fan' ? '/dashboard/profile' : userRole === 'host' ? `/hosts/${userProfileId}` : `/${userRole}s/${userProfileId}`} target="_blank">
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

                    {/* Bookings Management - Artists and Hosts only */}
                    {(userRole === 'artist' || userRole === 'host') && (
                      <Link href="/dashboard/bookings">
                        <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <Calendar className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-semibold text-neutral-900">
                                {userRole === 'artist' ? 'My Bookings' : 'Booking Requests'}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Messages - All users */}
                    <Link href="/dashboard/messages">
                      <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 relative">
                            <Mail className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                            {unreadMessages.length > 0 && (
                              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--color-french-blue)] rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-white">{unreadMessages.length}</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-semibold text-neutral-900">Messages</h3>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Artist-specific actions */}
                    {userRole === 'artist' && (
                      <>
                        <Link href="/subscription/manage">
                          <div className="group rounded-lg bg-white border border-neutral-200 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <Star className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-semibold text-neutral-900">Manage Subscription</h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </>
                    )}

                    {/* Host-specific actions */}
                    {userRole === 'host' && (
                      <>
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
                      {userRole === 'fan' ? fanConcerts.length : 'TBD'}
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

            {/* Billing & Subscription Section - Artists and Fans only */}
            {(userRole === 'artist' || userRole === 'fan') && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {userRole === 'artist' ? 'Subscription & Billing' : 'Membership & Billing'}
                    </h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      {userRole === 'artist' 
                        ? 'Manage your annual membership and billing information' 
                        : 'Manage your membership and payment details'
                      }
                    </p>
                  </div>
                  <Link href={userRole === 'artist' ? '/subscription/manage' : '/payment/fan'}>
                    <Button size="sm" variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Billing
                    </Button>
                  </Link>
                </div>
                
                <div className="p-6">
                  {subscriptionLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mr-3"></div>
                      <span className="text-neutral-600">Loading billing information...</span>
                    </div>
                  ) : subscriptionData ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Subscription Status */}
                      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                            <span className="text-sm font-medium text-primary-900">Status</span>
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-primary-800">
                          {subscriptionData.subscription?.status === 'ACTIVE' ? 'Active' : 
                           subscriptionData.subscription?.status === 'PAST_DUE' ? 'Past Due' : 
                           subscriptionData.subscription?.status === 'NONE' ? 'No Subscription' : 
                           subscriptionData.subscription?.status || 'Unknown'}
                        </div>
                      </div>

                      {/* Next Payment */}
                      {subscriptionData.subscription?.status !== 'NONE' && (
                        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <CalendarIcon className="w-5 h-5 text-neutral-600 mr-2" />
                              <span className="text-sm font-medium text-neutral-700">Next Payment</span>
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-neutral-800">
                            {subscriptionData.billing?.nextPaymentDate 
                              ? new Date(subscriptionData.billing.nextPaymentDate).toLocaleDateString() 
                              : 'N/A'}
                          </div>
                        </div>
                      )}

                      {/* Payment Method */}
                      {subscriptionData.paymentMethod && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                              <span className="text-sm font-medium text-green-700">Payment Method</span>
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-green-800 capitalize">
                            {subscriptionData.paymentMethod.brand} •••• {subscriptionData.paymentMethod.last4}
                          </div>
                        </div>
                      )}

                      {/* Total Paid */}
                      <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <DollarSign className="w-5 h-5 text-secondary-600 mr-2" />
                            <span className="text-sm font-medium text-secondary-700">Total Paid</span>
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-secondary-800">
                          ${((subscriptionData.billing?.totalPaid || 0) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">No Billing Information</h3>
                      <p className="text-neutral-600 mb-4">Complete your subscription to start accessing platform features.</p>
                      <Link href={userRole === 'artist' ? '/payment/artist' : '/payment/fan'}>
                        <Button>
                          Set Up Billing
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Recent Payments */}
                  {subscriptionData?.recentPayments && subscriptionData.recentPayments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <h3 className="text-sm font-medium text-neutral-900 mb-4">Recent Payments</h3>
                      <div className="space-y-2">
                        {subscriptionData.recentPayments.slice(0, 3).map((payment: any, index: number) => (
                          <div key={payment.id} className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-md">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-3 ${
                                payment.status === 'SUCCEEDED' ? 'bg-green-500' :
                                payment.status === 'FAILED' ? 'bg-red-500' :
                                'bg-yellow-500'
                              }`}></div>
                              <div>
                                <div className="text-sm font-medium text-neutral-900">
                                  ${(payment.amount / 100).toLocaleString()}
                                </div>
                                <div className="text-xs text-neutral-600">
                                  {payment.description || 'Subscription payment'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-neutral-500">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </div>
                              <div className={`text-xs capitalize ${
                                payment.status === 'SUCCEEDED' ? 'text-green-600' :
                                payment.status === 'FAILED' ? 'text-red-600' :
                                'text-yellow-600'
                              }`}>
                                {payment.status.toLowerCase()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Spotify Integration - Artists only */}
            {userRole === 'artist' && (
              <div className="mb-8">
                <SpotifyConnectionCard
                  artistId={userProfileId || ''}
                  currentConnection={spotifyConnection}
                  onConnectionUpdate={() => {
                    // Refresh Spotify connection data
                    if (userProfileId) {
                      fetch(`/api/spotify/artist/${userProfileId}`)
                        .then(res => res.json())
                        .then(data => {
                          if (data.artist) {
                            setSpotifyConnection({
                              spotifyArtistId: data.artist.spotifyArtistId,
                              spotifyVerified: data.artist.spotifyVerified,
                              spotifyFollowers: data.artist.spotifyFollowers,
                              spotifyPopularity: data.artist.spotifyPopularity,
                              lastSpotifySync: data.artist.lastSpotifySync
                            });
                          }
                        })
                        .catch(err => console.error('Error refreshing Spotify connection:', err));
                    }
                  }}
                />
              </div>
            )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bookings */}
            {(userRole === 'artist' || userRole === 'host') && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {userRole === 'host' ? 'Booking Requests & Shows' : 'My Bookings & Performances'}
                    </h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      {userRole === 'host' ? 'Manage booking requests and upcoming shows at your venue' : 'Track your booking requests and confirmed performances'}
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
                  <BookingList viewType={userRole} />
                </div>
              </div>
            )}

            {/* RSVP Management - Host Only */}
            {userRole === 'host' && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">RSVP Requests</h2>
                    <p className="text-sm text-neutral-600 mt-1">Manage fan requests for your concerts</p>
                  </div>
                </div>
                <div className="p-6">
                  <RSVPManagement />
                </div>
              </div>
            )}

            {/* Fan Concert Reservations */}
            {userRole === 'fan' && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">Your Concert Reservations</h2>
                    <p className="text-sm text-neutral-600 mt-1">Concerts you've reserved</p>
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
                                {'title' in booking ? booking.title : 'Concert'}
                              </h3>
                              <div className="flex items-center text-sm text-neutral-600 space-x-4">
                                <span>{
                                  'date' in booking && 'startTime' in booking ? formatDate(new Date(booking.date + 'T' + booking.startTime)) : 'TBD'
                                }</span>
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {'capacity' in booking ? booking.capacity : 'TBD'} capacity
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant="success" className="bg-primary-100 text-primary-700">
                              Reserved
                            </Badge>
                            <Link href={`/concerts/${booking.id}`}>
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
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">No upcoming concerts</h3>
                      <p className="text-neutral-600 mb-6">Discover and book your first house concert experience</p>
                      <Link href='/artists'>
                        <Button className="bg-primary-600 text-white hover:bg-primary-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Browse Concerts
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Past Shows - Only show for artists and hosts */}
            {(userRole === 'artist' || userRole === 'host') && (
              <PastShowsSection userId={selectedUserId} userType={userRole} />
            )}

            {/* Private Reviews - Only show for artists and hosts */}
            {(userRole === 'artist' || userRole === 'host') && (
              <PrivateReviewsSection userId={selectedUserId} userType={userRole} />
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
                <Link href="/dashboard/messages">
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