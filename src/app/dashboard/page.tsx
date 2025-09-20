'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DashboardLayout,
  ArtistDashboard,
  HostDashboard,
  FanDashboard,
  BillingWidget,
  MessagingCenter
} from '@/components/dashboard';
import { mockMessages, mockNotifications, mockArtists, mockHosts } from '@/data/mockData';
import { testConcerts } from '@/data/realTestData';
import HoldingPage from '@/components/dashboard/HoldingPage';

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
  const [musicConnections, setMusicConnections] = useState({
    spotify: { connected: false, followers: 0, verified: false },
    soundcloud: { connected: false, followers: 0, trackCount: 0 }
  });

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
          }
        })
        .catch(err => {
          console.warn('Could not fetch current user data:', err.message);
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
        .catch(err => console.warn('Could not fetch stats:', err.message));
    }
  }, [session?.user, refreshTrigger]);

  // Fetch subscription data for artists and fans
  useEffect(() => {
    if (currentUser && (currentUser.type === 'artist' || currentUser.type === 'fan')) {
      setSubscriptionLoading(true);
      fetch('/api/subscription/status')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setSubscriptionData(data);
          }
        })
        .catch(err => console.warn('Could not fetch subscription data:', err.message))
        .finally(() => setSubscriptionLoading(false));
    }
  }, [currentUser]);

  // Fetch music connections for artists
  useEffect(() => {
    if (currentUser && currentUser.type === 'artist' && userProfileId) {
      // Fetch Spotify connection
      fetch('/api/music/spotify/status')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setMusicConnections(prev => ({
              ...prev,
              spotify: {
                connected: data.connected,
                followers: data.followers || 0,
                verified: data.verified || false
              }
            }));
          }
        })
        .catch(error => {
          console.error('Error fetching Spotify connection:', error);
        });

      // Fetch SoundCloud connection
      fetch('/api/music/soundcloud/status')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setMusicConnections(prev => ({
              ...prev,
              soundcloud: {
                connected: data.connected,
                followers: data.followers || 0,
                trackCount: data.trackCount || 0
              }
            }));
          }
        })
        .catch(error => {
          console.error('Error fetching SoundCloud connection:', error);
        });
    }
  }, [currentUser, userProfileId]);

  // Loading state
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

  // Not authenticated
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

  // Helper function to check user role
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
              <AlertTriangle className="w-8 h-8 text-green-600" />
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
  const hasFullAccess = userRole === 'admin' ||
                       userStatus === 'approved' ||
                       userStatus === 'active' ||
                       (isUserRole('fan') && userData.fan?.subscriptionStatus === 'ACTIVE');

  const needsPayment = userRole === 'artist' && userStatus === 'approved' && userData.artist?.approvedAt && !userData.fan?.subscriptionStatus;

  // Prepare data for role-specific components
  const userMessages = userRole === 'admin'
    ? mockMessages || []
    : (mockMessages || []).filter(msg =>
        msg.senderId === selectedUserId || msg.recipientId === selectedUserId
      );

  const unreadMessages = userMessages.filter(msg => !msg.read && msg.recipientId === selectedUserId);

  const fanConcerts = isUserRole('fan')
    ? (testConcerts || []).filter(concert => concert.status === 'upcoming')
    : [];

  const fanUpcomingConcerts = isUserRole('fan')
    ? (testConcerts || []).filter(concert =>
        concert.status === 'upcoming' &&
        concert.attendees?.includes(selectedUserId)
      )
    : [];

  const upcomingBookings = isUserRole('fan')
    ? fanUpcomingConcerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(date));
  };

  // Prepare role-specific dashboard data
  const dashboardData = {
    user: {
      id: userData.id,
      name: userData.name || '',
      email: userData.email || '',
      type: userRole,
      profileImageUrl: userData.profileImageUrl,
      createdAt: userData.createdAt || new Date().toISOString(),
      verified: userData.verified || false
    },
    stats: userStats
  };

  return (
    <DashboardLayout
      user={{
        name: userData.name || 'User',
        type: userRole,
        status: userStatus
      }}
      hasFullAccess={hasFullAccess}
      needsPayment={needsPayment}
      unreadMessages={unreadMessages.length}
    >
      {hasFullAccess ? (
        <div className="space-y-8">
          {/* Billing Section - Fans only (artists have it in their dashboard) */}
          {userRole === 'fan' && (
            <BillingWidget
              userType={userRole}
              subscriptionData={subscriptionData}
              loading={subscriptionLoading}
            />
          )}

          {/* Role-specific Dashboard Content */}
          {userRole === 'artist' && (
            <ArtistDashboard
              data={{
                ...dashboardData,
                profile: {
                  id: profileId,
                  stageName: userData.artist?.stageName || '',
                  bio: userData.artist?.bio,
                  genres: userData.artist?.genres || [],
                  subscriptionStatus: userData.artist?.subscriptionStatus || 'INACTIVE',
                  isVerified: userData.artist?.isVerified || false
                },
                musicConnections,
                billing: {
                  subscriptionStatus: subscriptionData?.subscription?.status || 'NONE',
                  currentPlan: subscriptionData?.subscription?.plan,
                  nextBillingDate: subscriptionData?.billing?.nextPaymentDate,
                  paymentMethodLast4: subscriptionData?.paymentMethod?.last4
                }
              }}
              upcomingBookings={upcomingBookings}
              unreadMessages={unreadMessages}
              userId={selectedUserId}
            />
          )}

          {userRole === 'host' && (
            <HostDashboard
              data={{
                ...dashboardData,
                profile: {
                  id: profileId,
                  venueName: userData.host?.venueName || '',
                  city: userData.host?.city || '',
                  state: userData.host?.state || '',
                  venueType: userData.host?.venueType || '',
                  capacity: userData.host?.capacity || 0,
                  subscriptionStatus: userData.host?.subscriptionStatus || 'INACTIVE',
                  lodgingOptions: userData.host?.lodgingOptions || []
                },
                billing: {
                  subscriptionStatus: subscriptionData?.subscription?.status || 'NONE',
                  currentPlan: subscriptionData?.subscription?.plan,
                  nextBillingDate: subscriptionData?.billing?.nextPaymentDate,
                  paymentMethodLast4: subscriptionData?.paymentMethod?.last4
                }
              }}
              upcomingBookings={upcomingBookings}
              unreadMessages={unreadMessages}
              userId={selectedUserId}
            />
          )}

          {userRole === 'fan' && (
            <FanDashboard
              data={{
                ...dashboardData,
                profile: {
                  id: profileId,
                  subscriptionStatus: userData.fan?.subscriptionStatus || 'INACTIVE',
                  favoriteGenres: userData.fan?.favoriteGenres || [],
                  location: userData.fan?.location ? {
                    city: userData.fan.location.city,
                    state: userData.fan.location.state
                  } : undefined
                },
                billing: {
                  subscriptionStatus: subscriptionData?.subscription?.status || 'NONE',
                  currentPlan: subscriptionData?.subscription?.plan,
                  nextBillingDate: subscriptionData?.billing?.nextPaymentDate,
                  paymentMethodLast4: subscriptionData?.paymentMethod?.last4
                }
              }}
              upcomingBookings={upcomingBookings}
              unreadMessages={unreadMessages}
              fanConcerts={fanConcerts}
              userId={selectedUserId}
              formatDate={formatDate}
            />
          )}

          {/* Sidebar with Messages - Available for all roles */}
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Main content is handled by role-specific components above */}
            </div>
            <div className="lg:col-span-1">
              <MessagingCenter
                messages={userMessages}
                currentUserId={selectedUserId}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Limited Access</h2>
          <p className="text-gray-600">Your account access is limited. Please check your status or contact support.</p>
        </div>
      )}
    </DashboardLayout>
  );
}