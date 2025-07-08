'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CreditCardIcon,
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

interface Artist {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: 'active' | 'past_due' | 'cancelled' | 'trialing';
  subscriptionId: string;
  currentPeriodEnd: Date;
  nextBillingDate: Date;
  amount: number;
  paymentMethod: string;
  lastPaymentDate: Date;
  failedPayments: number;
}

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Mock payment data
  const artists: Artist[] = [
    {
      id: 'artist1',
      name: 'Sarah & The Wanderers',
      email: 'sarah@wanderers.com',
      subscriptionStatus: 'active',
      subscriptionId: 'sub_1234567890',
      currentPeriodEnd: new Date('2026-01-15'),
      nextBillingDate: new Date('2026-01-15'),
      amount: 400,
      paymentMethod: 'Visa ••••4242',
      lastPaymentDate: new Date('2025-01-15'),
      failedPayments: 0
    },
    {
      id: 'artist2',
      name: 'Tommy Blue',
      email: 'tommy@tommyblue.com',
      subscriptionStatus: 'past_due',
      subscriptionId: 'sub_0987654321',
      currentPeriodEnd: new Date('2025-12-10'),
      nextBillingDate: new Date('2025-07-10'),
      amount: 400,
      paymentMethod: 'Mastercard ••••8888',
      lastPaymentDate: new Date('2024-12-10'),
      failedPayments: 2
    },
    {
      id: 'artist3',
      name: 'Echo & Iris',
      email: 'echo@echoandiris.com',
      subscriptionStatus: 'trialing',
      subscriptionId: 'sub_1122334455',
      currentPeriodEnd: new Date('2025-08-01'),
      nextBillingDate: new Date('2025-08-01'),
      amount: 400,
      paymentMethod: 'No payment method',
      lastPaymentDate: new Date('2025-07-01'),
      failedPayments: 0
    },
    {
      id: 'artist4',
      name: 'The Mountain Folk',
      email: 'contact@mountainfolk.com',
      subscriptionStatus: 'cancelled',
      subscriptionId: 'sub_5566778899',
      currentPeriodEnd: new Date('2025-09-30'),
      nextBillingDate: new Date('2025-09-30'),
      amount: 400,
      paymentMethod: 'Visa ••••1234',
      lastPaymentDate: new Date('2024-09-30'),
      failedPayments: 1
    }
  ];

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = searchQuery === '' || 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || artist.subscriptionStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'success', icon: CheckCircleIcon, text: 'Active' };
      case 'past_due':
        return { color: 'error', icon: ExclamationTriangleIcon, text: 'Past Due' };
      case 'cancelled':
        return { color: 'default', icon: XCircleIcon, text: 'Cancelled' };
      case 'trialing':
        return { color: 'warning', icon: ArrowPathIcon, text: 'Trial' };
      default:
        return { color: 'default', icon: CheckCircleIcon, text: status };
    }
  };

  const totalRevenue = artists
    .filter(a => a.subscriptionStatus === 'active')
    .reduce((sum, a) => sum + a.amount, 0);

  const pastDueCount = artists.filter(a => a.subscriptionStatus === 'past_due').length;
  const activeCount = artists.filter(a => a.subscriptionStatus === 'active').length;
  const churnCount = artists.filter(a => a.subscriptionStatus === 'cancelled').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Management
            </h1>
            <p className="text-gray-600">
              Monitor artist subscriptions, billing, and revenue
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button variant="outline">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <CreditCardIcon className="w-4 h-4 mr-2" />
              Process Retries
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Annual Revenue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{activeCount}</div>
              <div className="text-sm text-gray-600">Active Subscribers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{pastDueCount}</div>
              <div className="text-sm text-gray-600">Past Due</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{churnCount}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search artists by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="past_due">Past Due</option>
                  <option value="trialing">Trial</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artists Table */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Artist Subscriptions ({filteredArtists.length})
            </h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Artist</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Payment Method</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Next Billing</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArtists.map((artist) => {
                    const statusInfo = getStatusInfo(artist.subscriptionStatus);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <tr key={artist.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-2">
                          <div>
                            <div className="font-medium text-gray-900">{artist.name}</div>
                            <div className="text-sm text-gray-600">{artist.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <Badge variant={statusInfo.color as any}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.text}
                          </Badge>
                          {artist.failedPayments > 0 && (
                            <div className="text-xs text-red-600 mt-1">
                              {artist.failedPayments} failed payments
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm text-gray-900">{artist.paymentMethod}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm text-gray-900">
                            {artist.nextBillingDate.toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="font-medium text-gray-900">${artist.amount}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex space-x-2">
                            <Link href={`/admin/artists/${artist.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            {artist.subscriptionStatus === 'past_due' && (
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                Retry
                              </Button>
                            )}
                            {artist.subscriptionStatus === 'cancelled' && (
                              <Button size="sm" variant="outline">
                                Reactivate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}