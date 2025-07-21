'use client';
import { useState, useEffect, useCallback } from 'react';
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

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string;
  userType: string;
  status: string;
  paymentStatus: string;
  stripeCustomerId: string | null;
  joinedDate: string;
  lastActive: string;
  emailVerified: boolean;
  totalPayments: number;
  totalRevenue: number;
  lastPaymentDate: string | null;
  failedPayments: number;
  subscription: any;
  recentPayments: any[];
  [key: string]: any; // For role-specific data
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'artist' | 'host' | 'fan'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'approved' | 'suspended' | 'rejected'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'overdue' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Fetch users from database
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (typeFilter !== 'all') params.append('type', typeFilter.toUpperCase());
      if (statusFilter !== 'all') params.append('status', statusFilter.toUpperCase());
      if (paymentFilter !== 'all') params.append('paymentStatus', paymentFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/users?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      if (data.error) {
        // Handle specific errors
        if (response.status === 401) {
          setError('Please log in as an admin to view this page');
        } else if (response.status === 403) {
          setError('Admin access required to view this page');
        } else {
          setError(data.error);
        }
        return;
      }
      
      setUsers(data.users);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, typeFilter, statusFilter, paymentFilter, searchTerm]);

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      // This would typically call an admin API to update user status
      // For now, we'll just refresh the data
      await fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Users are now pre-filtered by the API, so we just use them directly
  const filteredUsers = users;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Suspended</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'overdue':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'failed':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Failed</Badge>;
      case 'canceled':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Canceled</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'n/a':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">N/A</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getUserStats = () => {
    const total = pagination.total;
    const activeArtists = users.filter(u => u.userType === 'artist' && u.status === 'active').length;
    const activeHosts = users.filter(u => u.userType === 'host' && u.status === 'active').length;
    const activeFans = users.filter(u => u.userType === 'fan' && u.status === 'active').length;
    const pendingVerification = users.filter(u => u.status === 'pending' || u.status === 'approved').length;
    const suspended = users.filter(u => u.status === 'suspended').length;
    const overduePayments = users.filter(u => u.paymentStatus === 'overdue' || u.paymentStatus === 'failed').length;
    return { total, activeArtists, activeHosts, activeFans, pendingVerification, suspended, overduePayments };
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
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
              <div className="text-sm text-neutral-600">Total Users</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.activeArtists}</div>
              <div className="text-sm text-neutral-600">Artists</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary-600">{stats.activeHosts}</div>
              <div className="text-sm text-neutral-600">Hosts</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeFans}</div>
              <div className="text-sm text-neutral-600">Fans</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerification}</div>
              <div className="text-sm text-neutral-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.overduePayments}</div>
              <div className="text-sm text-neutral-600">Overdue</div>
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
                {['all', 'artist', 'host', 'fan'].map((typeOption) => (
                  <button
                    key={typeOption}
                    onClick={() => setTypeFilter(typeOption as typeof typeFilter)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
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
                {['all', 'active', 'pending', 'approved', 'suspended', 'rejected'].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => setStatusFilter(statusOption as typeof statusFilter)}
                    className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                      statusFilter === statusOption
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-secondary-700 hover:text-secondary-900'
                    }`}
                  >
                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </button>
                ))}
              </div>

              {/* Payment Filter */}
              <div className="flex space-x-1 bg-green-100 p-1 rounded-lg">
                {['all', 'paid', 'overdue', 'failed'].map((paymentOption) => (
                  <button
                    key={paymentOption}
                    onClick={() => setPaymentFilter(paymentOption as typeof paymentFilter)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      paymentFilter === paymentOption
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-green-700 hover:text-green-900'
                    }`}
                  >
                    {paymentOption.charAt(0).toUpperCase() + paymentOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Users</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => fetchUsers()}>Try Again</Button>
          </div>
        )}

        {/* Users Grid */}
        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
            <Card key={user.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedUser(user)}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      user.userType === 'artist' 
                        ? 'bg-purple-100 text-purple-600' 
                        : user.userType === 'host'
                        ? 'bg-blue-100 text-blue-600'
                        : user.userType === 'fan'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.userType === 'artist' ? (
                        <MusicalNoteIcon className="w-5 h-5" />
                      ) : user.userType === 'host' ? (
                        <HomeIcon className="w-5 h-5" />
                      ) : (
                        <UserIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{user.userType}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(user.status)}
                    {(user.userType === 'artist' || user.userType === 'fan') && getPaymentBadge(user.paymentStatus)}
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
                    <div className="text-gray-600">Payments</div>
                    <div className="font-semibold">{user.totalPayments || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Revenue</div>
                    <div className="font-semibold">${((user.totalRevenue || 0) / 100).toLocaleString()}</div>
                  </div>
                </div>

                {/* Payment Information */}
                {(user.userType === 'artist' || user.userType === 'fan') && user.subscription && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subscription</span>
                      <Badge variant="secondary" className={
                        user.subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        user.subscription.status === 'PAST_DUE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {user.subscription.status}
                      </Badge>
                    </div>
                    <div className="text-gray-900">
                      ${(user.subscription.amount / 100).toLocaleString()}/{user.subscription.interval}
                    </div>
                    {user.subscription.currentPeriodEnd && (
                      <div className="text-xs text-gray-600 mt-1">
                        Next billing: {new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}

                {/* Failed Payments Warning */}
                {user.failedPayments > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                    <div className="flex items-center text-red-800">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                      <span className="font-medium">{user.failedPayments} failed payment{user.failedPayments !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">No users match your current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}