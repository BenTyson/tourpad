'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  CalendarIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  CurrencyDollarIcon,
  HomeIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';

// Mock booking data with more comprehensive details
const mockBookings = [
  {
    id: 'booking1',
    artist: { id: 'artist1', name: 'Sarah Johnson', genre: 'Folk/Indie' },
    host: { id: 'host1', name: 'Mike Chen', venue: 'Cozy Living Room', capacity: 35 },
    eventDate: '2024-02-15T19:30:00Z',
    guestCount: 28,
    status: 'confirmed',
    createdAt: '2024-01-20T10:30:00Z',
    location: 'Portland, OR',
    duration: 120, // minutes
    specialRequests: 'Need acoustic guitar and microphone',
    hasDispute: false,
    lastMessage: '2024-01-22T14:30:00Z'
  },
  {
    id: 'booking2',
    artist: { id: 'artist2', name: 'Emma Rodriguez', genre: 'Country/Americana' },
    host: { id: 'host2', name: 'Lisa Thompson', venue: 'Backyard Stage', capacity: 20 },
    eventDate: '2024-02-18T20:00:00Z',
    guestCount: 15,
    status: 'pending_approval',
    createdAt: '2024-01-21T16:45:00Z',
    location: 'Denver, CO',
    duration: 90,
    specialRequests: 'Weather backup plan needed',
    hasDispute: false,
    lastMessage: '2024-01-21T16:45:00Z'
  },
  {
    id: 'booking3',
    artist: { id: 'artist3', name: 'Marcus Williams', genre: 'Jazz/Blues' },
    host: { id: 'host3', name: 'Jennifer Kim', venue: 'Intimate Parlor', capacity: 25 },
    eventDate: '2024-02-10T18:00:00Z',
    guestCount: 22,
    status: 'disputed',
    createdAt: '2024-01-18T11:20:00Z',
    location: 'Seattle, WA',
    duration: 150,
    specialRequests: 'Piano required',
    hasDispute: true,
    disputeReason: 'Cancellation disagreement - weather concerns',
    lastMessage: '2024-01-23T09:15:00Z'
  },
  {
    id: 'booking4',
    artist: { id: 'artist4', name: 'Alex Chen', genre: 'Indie Rock' },
    host: { id: 'host4', name: 'Robert Davis', venue: 'Garage Concert Hall', capacity: 40 },
    eventDate: '2024-03-05T21:00:00Z',
    guestCount: 35,
    status: 'confirmed',
    createdAt: '2024-01-19T13:00:00Z',
    location: 'Austin, TX',
    duration: 180,
    specialRequests: 'Full band setup needed',
    hasDispute: false,
    lastMessage: '2024-01-20T10:00:00Z'
  },
  {
    id: 'booking5',
    artist: { id: 'artist5', name: 'Maya Patel', genre: 'World Music' },
    host: { id: 'host5', name: 'Chris Martinez', venue: 'Garden Amphitheater', capacity: 50 },
    eventDate: '2024-01-28T17:30:00Z',
    guestCount: 45,
    status: 'cancelled',
    createdAt: '2024-01-15T09:30:00Z',
    location: 'Phoenix, AZ',
    duration: 120,
    specialRequests: 'Traditional instruments required',
    hasDispute: false,
    lastMessage: '2024-01-25T16:30:00Z'
  }
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending_approval' | 'disputed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = booking.artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case 'pending_approval':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'disputed':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Disputed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending_approval').length;
    const disputed = bookings.filter(b => b.status === 'disputed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    return { total, confirmed, pending, disputed, cancelled };
  };

  const stats = getBookingStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings & Events</h1>
          <p className="text-gray-600">Monitor all platform bookings and resolve disputes</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.disputed}</div>
              <div className="text-sm text-gray-600">Disputed</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{bookings.filter(b => isUpcoming(b.eventDate)).length}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search by artist, host, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex space-x-1 bg-sage-100 p-1 rounded-lg">
                {['all', 'confirmed', 'pending_approval', 'disputed', 'cancelled'].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => setStatusFilter(statusOption as typeof statusFilter)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      statusFilter === statusOption
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-sage-700 hover:text-sage-900'
                    }`}
                  >
                    {statusOption === 'pending_approval' ? 'Pending' : 
                     statusOption === 'all' ? 'All' : statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} 
                  className={`shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer ${
                    booking.hasDispute ? 'border-l-4 border-l-red-500' : ''
                  } ${!isUpcoming(booking.eventDate) ? 'opacity-75' : ''}`}
                  onClick={() => setSelectedBooking(booking)}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {booking.artist.name} → {booking.host.name}
                      </h3>
                      <p className="text-sm text-gray-500">{booking.artist.genre}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(booking.status)}
                    {booking.hasDispute && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                        Dispute
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {formatDate(booking.eventDate)}
                    {!isUpcoming(booking.eventDate) && (
                      <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">Past</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {booking.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    {booking.guestCount} / {booking.host.capacity} guests
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {booking.duration} min
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Special Requests:</strong> {booking.specialRequests}
                    </p>
                  </div>
                )}

                {booking.hasDispute && booking.disputeReason && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800">
                      <strong>Dispute:</strong> {booking.disputeReason}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                    Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">No bookings match your current filters</p>
          </div>
        )}

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                    <p className="text-gray-600">ID: {selectedBooking.id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedBooking.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBooking(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Event Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Event Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date & Time</label>
                      <p className="text-gray-900">{formatDate(selectedBooking.eventDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Duration</label>
                      <p className="text-gray-900">{selectedBooking.duration} minutes</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900">{selectedBooking.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Guest Count</label>
                      <p className="text-gray-900">{selectedBooking.guestCount} / {selectedBooking.host.capacity}</p>
                    </div>
                  </div>
                </div>

                {/* Artist & Host Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MusicalNoteIcon className="w-5 h-5 mr-2 text-purple-600" />
                      Artist
                    </h3>
                    <div>
                      <p className="font-medium">{selectedBooking.artist.name}</p>
                      <p className="text-sm text-gray-600">{selectedBooking.artist.genre}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <HomeIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Host & Venue
                    </h3>
                    <div>
                      <p className="font-medium">{selectedBooking.host.name}</p>
                      <p className="text-sm text-gray-600">{selectedBooking.host.venue}</p>
                      <p className="text-sm text-gray-600">Capacity: {selectedBooking.host.capacity}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Performance Information</h3>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-purple-900">Duration</span>
                      <span className="text-xl font-bold text-purple-900">{selectedBooking.duration} minutes</span>
                    </div>
                    <p className="text-sm text-purple-700 mt-2">No booking fees - artists pay annual platform membership</p>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Special Requests</h3>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <p className="text-gray-900">{selectedBooking.specialRequests}</p>
                    </div>
                  </div>
                )}

                {/* Dispute Information */}
                {selectedBooking.hasDispute && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Dispute Information</h3>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-red-900">{selectedBooking.disputeReason}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  {selectedBooking.status === 'pending_approval' && (
                    <>
                      <Button
                        onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Approve Booking
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircleIcon className="w-4 h-4 mr-2" />
                        Reject Booking
                      </Button>
                    </>
                  )}
                  
                  {selectedBooking.status === 'disputed' && (
                    <>
                      <Button
                        onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Resolve Dispute
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircleIcon className="w-4 h-4 mr-2" />
                        Cancel Booking
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="outline"
                    className="flex-1"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}