'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowLeft,
  Filter,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Booking {
  id: string;
  artistId: string;
  hostId: string;
  artistName: string;
  hostName: string;
  venueName: string;
  requestedDate: string;
  requestedTime?: string;
  estimatedDuration?: number;
  expectedAttendance: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  artistFee?: number;
  doorFee?: number;
  artistMessage?: string;
  hostResponse?: string;
  lodgingRequested: boolean;
  lodgingDetails?: any;
  requestedAt: string;
  respondedAt?: string;
  confirmedAt?: string;
  completedAt?: string;
  concert?: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    maxCapacity: number;
    status: string;
  };
}

export default function ArtistBookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'upcoming' | 'completed'>('all');

  // Fetch bookings data
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', response.status, errorData);
        throw new Error(`Failed to fetch bookings: ${response.status} - ${errorData}`);
      }
      
      const data = await response.json();
      console.log('Fetched bookings:', data);
      setBookings(data.bookings || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Session status:', status, 'Session user:', session?.user);
    if (session?.user?.id) {
      console.log('Fetching bookings for user:', session.user.id, session.user.type);
      fetchBookings();
    }
  }, [session, status]);

  // Filter bookings based on status
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.status === 'PENDING';
    if (filter === 'approved') return booking.status === 'APPROVED';
    if (filter === 'upcoming') return ['CONFIRMED', 'APPROVED'].includes(booking.status);
    if (filter === 'completed') return ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(booking.status);
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
      COMPLETED: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, label: 'Completed' },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Time TBD';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">Please log in to view your bookings.</p>
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600 mt-1">Track your venue booking requests and shows</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={fetchBookings}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/hosts">
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse Hosts
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'completed', label: 'Completed' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-gray-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Bookings</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchBookings} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && (
          <>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Found</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all' 
                    ? "You haven't submitted any booking requests yet." 
                    : `No ${filter} bookings found.`
                  }
                </p>
                <Link href="/hosts">
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    Browse Venues
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {booking.venueName || booking.hostName}
                            </h3>
                            <p className="text-gray-600">Host: {booking.hostName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(booking.status)}
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Event Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(booking.requestedDate)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {formatTime(booking.requestedTime)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          {booking.expectedAttendance} expected guests
                        </div>
                      </div>

                      {/* Messages */}
                      {booking.artistMessage && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-blue-900 text-sm">Your Message</h4>
                              <p className="text-blue-800 text-sm mt-1">{booking.artistMessage}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {booking.hostResponse && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <MessageSquare className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-green-900 text-sm">Host Response</h4>
                              <p className="text-green-800 text-sm mt-1">{booking.hostResponse}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          Requested {formatDate(booking.requestedAt)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          {booking.lodgingRequested && (
                            <span className="text-blue-600">Lodging requested</span>
                          )}
                          {booking.doorFee && (
                            <span className="text-gray-600">${booking.doorFee / 100} door fee</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}