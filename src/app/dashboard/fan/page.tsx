'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Music, 
  User, 
  CreditCard,
  MapPin,
  Star,
  Users,
  Mail,
  Settings,
  ExternalLink,
  Bell,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import FanConcertsList from '@/components/fan/FanConcertsList';

interface FanDashboardData {
  profile: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
    favoriteGenres: string[];
    hometown?: string;
    state?: string;
    bio?: string;
    subscriptionStatus: string;
    subscriptionStartDate?: string;
    subscriptionEndDate?: string;
  };
  stats: {
    upcomingConcerts: number;
    pastConcerts: number;
    pendingRSVPs: number;
    favoriteArtists: number;
  };
}

export default function FanDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<FanDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not a fan
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (session.user.type !== 'fan') {
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch fan profile
      const profileResponse = await fetch('/api/fan/profile');
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile');
      }
      const profileData = await profileResponse.json();

      // Fetch concert stats
      const [upcomingResponse, pastResponse] = await Promise.all([
        fetch('/api/fan/concerts/upcoming?limit=0'), // Just get count
        fetch('/api/fan/concerts/past?limit=0') // Just get count
      ]);

      const upcomingData = upcomingResponse.ok ? await upcomingResponse.json() : { pagination: { total: 0 } };
      const pastData = pastResponse.ok ? await pastResponse.json() : { pagination: { total: 0 } };

      // Get pending RSVPs count
      const pendingResponse = await fetch('/api/fan/concerts/upcoming?status=PENDING&limit=0');
      const pendingData = pendingResponse.ok ? await pendingResponse.json() : { pagination: { total: 0 } };

      setDashboardData({
        profile: profileData.fan,
        stats: {
          upcomingConcerts: upcomingData.pagination?.total || 0,
          pastConcerts: pastData.pagination?.total || 0,
          pendingRSVPs: pendingData.pagination?.total || 0,
          favoriteArtists: 0 // TODO: Implement favorite artists
        }
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load dashboard'}</p>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </div>
    );
  }

  const { profile, stats } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Welcome back, {profile.name.split(' ')[0]}
              </h1>
              <p className="text-neutral-600 mt-1">
                Discover and attend exclusive house concerts
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Messages
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Subscription Status Alert */}
        {profile.subscriptionStatus !== 'ACTIVE' && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-orange-900">Membership Required</h3>
                    <p className="text-orange-800 text-sm">
                      Your membership has expired. Renew to continue accessing exclusive house concerts.
                    </p>
                  </div>
                </div>
                <Link href="/payment/fan">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Renew Membership
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-neutral-900">{stats.upcomingConcerts}</div>
                  <div className="text-sm text-neutral-600">Upcoming Shows</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Music className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-neutral-900">{stats.pastConcerts}</div>
                  <div className="text-sm text-neutral-600">Shows Attended</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-neutral-900">{stats.pendingRSVPs}</div>
                  <div className="text-sm text-neutral-600">Pending RSVPs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-neutral-900">{stats.favoriteArtists}</div>
                  <div className="text-sm text-neutral-600">Favorite Artists</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/calendar">
                <div className="group p-4 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all cursor-pointer">
                  <Calendar className="w-6 h-6 mb-2" />
                  <div className="font-medium">Browse Concerts</div>
                  <div className="text-xs opacity-90">Find shows near you</div>
                </div>
              </Link>

              <Link href="/map">
                <div className="group p-4 rounded-lg bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer">
                  <MapPin className="w-6 h-6 mb-2 text-neutral-600 group-hover:text-primary-600" />
                  <div className="font-medium text-neutral-900">Explore Map</div>
                  <div className="text-xs text-neutral-600">Discover venues</div>
                </div>
              </Link>

              <Link href="/artists">
                <div className="group p-4 rounded-lg bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer">
                  <Users className="w-6 h-6 mb-2 text-neutral-600 group-hover:text-primary-600" />
                  <div className="font-medium text-neutral-900">Browse Artists</div>
                  <div className="text-xs text-neutral-600">Connect with musicians</div>
                </div>
              </Link>

              <Link href="/dashboard/profile">
                <div className="group p-4 rounded-lg bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer">
                  <User className="w-6 h-6 mb-2 text-neutral-600 group-hover:text-primary-600" />
                  <div className="font-medium text-neutral-900">Edit Profile</div>
                  <div className="text-xs text-neutral-600">Update preferences</div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-900">Your Profile</h2>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {profile.profileImageUrl ? (
                    <img 
                      src={profile.profileImageUrl} 
                      alt={profile.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary-600" />
                  )}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">{profile.name}</h3>
                {profile.hometown && profile.state && (
                  <p className="text-sm text-neutral-600 mb-2">
                    {profile.hometown}, {profile.state}
                  </p>
                )}
                <Badge className={profile.subscriptionStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {profile.subscriptionStatus === 'ACTIVE' ? 'Active Member' : 'Inactive'}
                </Badge>
                
                {profile.bio && (
                  <p className="text-sm text-neutral-600 mt-4 line-clamp-3">{profile.bio}</p>
                )}

                {profile.favoriteGenres.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-neutral-700 mb-2">Favorite Genres</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.favoriteGenres.slice(0, 3).map(genre => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                      {profile.favoriteGenres.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{profile.favoriteGenres.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Link href="/dashboard/profile">
                  <Button variant="outline" size="sm" className="mt-4">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-900">Upcoming Concerts</h2>
                <Link href="/dashboard/concerts/upcoming">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <FanConcertsList type="upcoming" limit={3} showPagination={false} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Concerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Recent Concerts</h2>
            <Link href="/dashboard/concerts/past">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <FanConcertsList type="past" limit={3} showPagination={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}