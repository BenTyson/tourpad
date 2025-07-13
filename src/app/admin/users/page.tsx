'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  UserIcon, 
  HomeIcon, 
  MusicalNoteIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// Mock user data
const mockUsers = [
  {
    id: 'artist1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'Austin, TX',
    type: 'artist',
    status: 'active',
    paymentStatus: 'paid',
    joinedDate: '2024-01-15T10:30:00Z',
    lastActive: '2024-01-20T14:30:00Z',
    profileCompletion: 95,
    totalBookings: 12,
    avgRating: 4.8,
    genre: 'Folk/Indie',
    nextPaymentDue: '2025-01-15T10:30:00Z'
  },
  {
    id: 'host1',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '(555) 987-6543',
    location: 'Portland, OR',
    type: 'host',
    status: 'active',
    paymentStatus: 'n/a',
    joinedDate: '2024-01-14T15:45:00Z',
    lastActive: '2024-01-21T09:15:00Z',
    profileCompletion: 88,
    totalBookings: 8,
    avgRating: 4.9,
    venueCapacity: 35,
    nextPaymentDue: null
  },
  {
    id: 'artist2',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@email.com',
    phone: '(555) 555-0123',
    location: 'Nashville, TN',
    type: 'artist',
    status: 'active',
    paymentStatus: 'paid',
    joinedDate: '2024-01-13T09:15:00Z',
    lastActive: '2024-01-19T16:45:00Z',
    profileCompletion: 100,
    totalBookings: 24,
    avgRating: 4.7,
    genre: 'Country/Americana',
    nextPaymentDue: '2025-01-13T09:15:00Z'
  },
  {
    id: 'artist3',
    name: 'Marcus Williams',
    email: 'marcus.williams@email.com',
    phone: '(555) 777-8888',
    location: 'Chicago, IL',
    type: 'artist',
    status: 'suspended',
    paymentStatus: 'overdue',
    joinedDate: '2023-11-20T12:00:00Z',
    lastActive: '2024-01-10T11:30:00Z',
    profileCompletion: 75,
    totalBookings: 6,
    avgRating: 4.2,
    genre: 'Jazz/Blues',
    nextPaymentDue: '2024-11-20T12:00:00Z'
  },
  {
    id: 'host2',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '(555) 333-2222',
    location: 'Denver, CO',
    type: 'host',
    status: 'pending_verification',
    paymentStatus: 'n/a',
    joinedDate: '2024-01-11T11:00:00Z',
    lastActive: '2024-01-18T13:20:00Z',
    profileCompletion: 60,
    totalBookings: 0,
    avgRating: null,
    venueCapacity: 20,
    nextPaymentDue: null
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [typeFilter, setTypeFilter] = useState<'all' | 'artist' | 'host'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending_verification'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesType = typeFilter === 'all' || user.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Suspended</Badge>;
      case 'pending_verification':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Verification</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'overdue':
        return <Badge variant="error">Overdue</Badge>;
      case 'n/a':
        return <Badge variant="secondary">N/A</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getUserStats = () => {
    const total = users.length;
    const activeArtists = users.filter(u => u.type === 'artist' && u.status === 'active').length;
    const activeHosts = users.filter(u => u.type === 'host' && u.status === 'active').length;
    const pendingVerification = users.filter(u => u.status === 'pending_verification').length;
    const suspended = users.filter(u => u.status === 'suspended').length;
    const overduePayments = users.filter(u => u.paymentStatus === 'overdue').length;
    return { total, activeArtists, activeHosts, pendingVerification, suspended, overduePayments };
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-neutral-50 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all artists and hosts on the platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.activeArtists}</div>
              <div className="text-sm text-gray-600">Active Artists</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeHosts}</div>
              <div className="text-sm text-gray-600">Active Hosts</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerification}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
              <div className="text-sm text-gray-600">Suspended</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.overduePayments}</div>
              <div className="text-sm text-gray-600">Overdue</div>
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
                    placeholder="Search by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
                {['all', 'artist', 'host'].map((typeOption) => (
                  <button
                    key={typeOption}
                    onClick={() => setTypeFilter(typeOption as typeof typeFilter)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                      typeFilter === typeOption
                        ? 'bg-white text-neutral-700 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {typeOption}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex space-x-1 bg-secondary-100 p-1 rounded-lg">
                {['all', 'active', 'suspended', 'pending_verification'].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => setStatusFilter(statusOption as typeof statusFilter)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      statusFilter === statusOption
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-secondary-700 hover:text-secondary-900'
                    }`}
                  >
                    {statusOption === 'pending_verification' ? 'Pending' : 
                     statusOption === 'all' ? 'All' : statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedUser(user)}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      user.type === 'artist' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.type === 'artist' ? (
                        <MusicalNoteIcon className="w-5 h-5" />
                      ) : (
                        <HomeIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{user.type}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(user.status)}
                    {user.type === 'artist' && getPaymentBadge(user.paymentStatus)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {user.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Joined {new Date(user.joinedDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Bookings</div>
                    <div className="font-semibold">{user.totalBookings}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Rating</div>
                    <div className="flex items-center">
                      {user.avgRating ? (
                        <>
                          <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="font-semibold">{user.avgRating}</span>
                        </>
                      ) : (
                        <span className="text-gray-400">No ratings</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Completion */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Profile</span>
                    <span className="font-medium">{user.profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        user.profileCompletion >= 90 ? 'bg-green-500' :
                        user.profileCompletion >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${user.profileCompletion}%` }}
                    ></div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">No users match your current filters</p>
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full ${
                      selectedUser.type === 'artist' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {selectedUser.type === 'artist' ? (
                        <MusicalNoteIcon className="w-6 h-6" />
                      ) : (
                        <HomeIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h2>
                      <p className="text-gray-600 capitalize">{selectedUser.type}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Status and Payment Info */}
                <div className="flex space-x-4">
                  {getStatusBadge(selectedUser.status)}
                  {selectedUser.type === 'artist' && getPaymentBadge(selectedUser.paymentStatus)}
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedUser.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900">{selectedUser.location}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Account Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Joined Date</label>
                      <p className="text-gray-900">{new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Active</label>
                      <p className="text-gray-900">{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Profile Completion</label>
                      <p className="text-gray-900">{selectedUser.profileCompletion}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Bookings</label>
                      <p className="text-gray-900">{selectedUser.totalBookings}</p>
                    </div>
                  </div>
                </div>

                {/* Type-Specific Information */}
                {selectedUser.type === 'artist' ? (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Artist Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Genre</label>
                        <p className="text-gray-900">{selectedUser.genre}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Next Payment Due</label>
                        <p className="text-gray-900">
                          {selectedUser.nextPaymentDue 
                            ? new Date(selectedUser.nextPaymentDue).toLocaleDateString()
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Host Information</h3>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Venue Capacity</label>
                      <p className="text-gray-900">{selectedUser.venueCapacity} people</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  {selectedUser.status === 'active' && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedUser.id, 'suspended')}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                      Suspend User
                    </Button>
                  )}
                  
                  {selectedUser.status === 'suspended' && (
                    <Button
                      onClick={() => handleStatusChange(selectedUser.id, 'active')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Reactivate User
                    </Button>
                  )}
                  
                  {selectedUser.status === 'pending_verification' && (
                    <Button
                      onClick={() => handleStatusChange(selectedUser.id, 'active')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Approve Verification
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}