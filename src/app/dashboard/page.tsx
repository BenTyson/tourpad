'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarIcon,
  EnvelopeIcon,
  BellIcon,
  StarIcon,
  UserGroupIcon,
  MapPinIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockBookings, mockMessages, mockNotifications } from '@/data/mockData';
import { useRouter } from 'next/navigation';

type UserRole = 'host' | 'artist';

export default function DashboardPage() {
  // For demo purposes, we'll simulate different user types
  const [userRole, setUserRole] = useState<UserRole>('host');
  const selectedUserId = userRole === 'host' ? 'host1' : 'artist1';

  // Filter data based on user
  const userBookings = mockBookings.filter(booking => 
    userRole === 'host' ? booking.hostId === selectedUserId : booking.artistId === selectedUserId
  );

  const userMessages = mockMessages.filter(msg => 
    msg.senderId === selectedUserId || msg.recipientId === selectedUserId
  );

  const userNotifications = mockNotifications.filter(notif => 
    notif.userId === selectedUserId
  );

  const upcomingBookings = userBookings
  .filter(booking => {
    const eventDate = new Date(booking.eventDate);
    const now = new Date();
    const isUpcoming = eventDate > now;
    const isApproved = booking.status === 'approved';
    
    // Debug logging
    console.log('Booking:', booking.id);
    console.log('Event date:', eventDate);
    console.log('Now:', now);
    console.log('Is upcoming:', isUpcoming);
    console.log('Is approved:', isApproved);
    console.log('---');
    
    return isUpcoming && isApproved;
  })
  .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const pendingActions = userBookings.filter(booking => 
    userRole === 'host' ? booking.status === 'requested' : booking.status === 'pending'
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

  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userRole === 'host' ? 'Host Dashboard' : 'Artist Dashboard'}
            </h1>
            <p className="text-gray-600">
              {userRole === 'host' 
                ? 'Manage your venue and upcoming shows' 
                : 'Track your tour and upcoming performances'
              }
            </p>
          </div>

          {/* Role Switcher - Demo only */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-sm text-gray-600">Demo as:</span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setUserRole('host')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  userRole === 'host'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Host
              </button>
              <button
                onClick={() => setUserRole('artist')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  userRole === 'artist'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Artist
              </button>
            </div>
          </div>
        </div>

        {/* Alert Bar - Action Items */}
        {(pendingActions.length > 0 || unreadMessages.length > 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-3" />
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</div>
              <div className="text-sm text-gray-600">Upcoming Shows</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{pendingActions.length}</div>
              <div className="text-sm text-gray-600">
                {userRole === 'host' ? 'New Requests' : 'Pending Responses'}
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
                  {userRole === 'host' ? 'Upcoming Shows at Your Venue' : 'Your Upcoming Performances'}
                </h2>
                <Link href="/calendar">
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
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
                            <CalendarIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {userRole === 'host' ? booking.artist.name : booking.host.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <span>{formatDate(booking.eventDate)}</span>
                              <div className="flex items-center">
                                <UserGroupIcon className="w-4 h-4 mr-1" />
                                {booking.guestCount} guests
                              </div>
                              {userRole === 'artist' && (
                                <div className="flex items-center">
                                  <MapPinIcon className="w-4 h-4 mr-1" />
                                  {booking.host.city}, {booking.host.state}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={getStatusColor(booking.status) as any}>
                            {booking.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming shows</h3>
                    <p className="text-gray-600 mb-4">
                      {userRole === 'host' 
                        ? 'Start hosting by browsing artists looking for venues'
                        : 'Find your next performance venue'
                      }
                    </p>
                    <Link href={userRole === 'host' ? '/artists' : '/hosts'}>
                      <Button>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        {userRole === 'host' ? 'Browse Artists' : 'Find Venues'}
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
                            <ClockIcon className="w-5 h-5 text-yellow-600" />
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
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
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
                    <EnvelopeIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
                  <Link href={userRole === 'host' ? '/artists' : '/hosts'}>
                    <Button variant="outline" className="w-full justify-start">
                      <PlusIcon className="w-4 h-4 mr-3" />
                      {userRole === 'host' ? 'Find Artists' : 'Find Venues'}
                    </Button>
                  </Link>
                  <Link href={`/${userRole}s/${selectedUserId}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <EyeIcon className="w-4 h-4 mr-3" />
                      View My Profile
                    </Button>
                  </Link>
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="w-4 h-4 mr-3" />
                      Manage Calendar
                    </Button>
                  </Link>
                  <Link href="/messages">
                    <Button variant="outline" className="w-full justify-start">
                      <EnvelopeIcon className="w-4 h-4 mr-3" />
                      All Messages
                    </Button>
                  </Link>
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
                      <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {userRole === 'host' ? 'Shows Hosted' : 'Shows Played'}
                    </span>
                    <span className="text-sm font-medium">
                      {userRole === 'host' ? '12' : '24'} this year
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
      </div>
    </div>
  );
}