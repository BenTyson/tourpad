'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  CurrencyDollarIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

// Mock financial data
const mockPayments = [
  {
    id: 'payment1',
    artistId: 'artist1',
    artistName: 'Sarah Johnson',
    amount: 400,
    status: 'paid',
    dueDate: '2024-01-15T00:00:00Z',
    paidDate: '2024-01-10T14:30:00Z',
    paymentMethod: 'Credit Card',
    renewalDate: '2025-01-15T00:00:00Z',
    invoiceNumber: 'INV-2024-001'
  },
  {
    id: 'payment2',
    artistId: 'artist2',
    artistName: 'Emma Rodriguez',
    amount: 400,
    status: 'paid',
    dueDate: '2024-01-13T00:00:00Z',
    paidDate: '2024-01-12T09:15:00Z',
    paymentMethod: 'Bank Transfer',
    renewalDate: '2025-01-13T00:00:00Z',
    invoiceNumber: 'INV-2024-002'
  },
  {
    id: 'payment3',
    artistId: 'artist3',
    artistName: 'Marcus Williams',
    amount: 400,
    status: 'overdue',
    dueDate: '2023-11-20T00:00:00Z',
    paidDate: null,
    paymentMethod: null,
    renewalDate: '2024-11-20T00:00:00Z',
    invoiceNumber: 'INV-2023-045',
    daysPastDue: 54
  },
  {
    id: 'payment4',
    artistId: 'artist4',
    artistName: 'Alex Chen',
    amount: 400,
    status: 'pending',
    dueDate: '2024-02-01T00:00:00Z',
    paidDate: null,
    paymentMethod: null,
    renewalDate: '2025-02-01T00:00:00Z',
    invoiceNumber: 'INV-2024-003'
  },
  {
    id: 'payment5',
    artistId: 'artist5',
    artistName: 'Maya Patel',
    amount: 400,
    status: 'failed',
    dueDate: '2024-01-28T00:00:00Z',
    paidDate: null,
    paymentMethod: 'Credit Card',
    renewalDate: '2025-01-28T00:00:00Z',
    invoiceNumber: 'INV-2024-004',
    failureReason: 'Insufficient funds'
  }
];

const monthlyRevenue = [
  { month: 'Oct 2023', revenue: 12800, newArtists: 32, renewals: 0 },
  { month: 'Nov 2023', revenue: 16400, newArtists: 41, renewals: 0 },
  { month: 'Dec 2023', revenue: 19200, newArtists: 48, renewals: 0 },
  { month: 'Jan 2024', revenue: 22400, newArtists: 56, renewals: 0 },
  { month: 'Feb 2024', revenue: 28800, newArtists: 72, renewals: 0 }
];

export default function FinancePage() {
  const [payments, setPayments] = useState(mockPayments);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<typeof mockPayments[0] | null>(null);

  const handleRetryPayment = (paymentId: string) => {
    setPayments(prev => 
      prev.map(payment => 
        payment.id === paymentId ? { 
          ...payment, 
          status: 'pending',
          failureReason: undefined
        } : payment
      )
    );
    setSelectedPayment(null);
  };

  const handleMarkPaid = (paymentId: string) => {
    setPayments(prev => 
      prev.map(payment => 
        payment.id === paymentId ? { 
          ...payment, 
          status: 'paid',
          paidDate: new Date().toISOString(),
          paymentMethod: 'Manual Entry'
        } : payment
      )
    );
    setSelectedPayment(null);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesSearch = payment.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'overdue':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>;
      case 'failed':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getFinancialStats = () => {
    const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const overdueRevenue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
    const failedPayments = payments.filter(p => p.status === 'failed').length;
    const activeArtists = payments.filter(p => p.status === 'paid').length;
    const overdueCount = payments.filter(p => p.status === 'overdue').length;

    return { 
      totalRevenue, 
      pendingRevenue, 
      overdueRevenue, 
      failedPayments, 
      activeArtists, 
      overdueCount 
    };
  };

  const stats = getFinancialStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Management</h1>
          <p className="text-gray-600">Track artist payments, revenue, and financial reports</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.activeArtists}</div>
              <div className="text-sm text-gray-600">Paid Artists</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">${stats.pendingRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">${stats.overdueRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Overdue</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.failedPayments}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">95.2%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Trend */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
                <p className="text-sm text-gray-600">Monthly artist membership revenue</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyRevenue.map((month, index) => {
                    const prevMonth = monthlyRevenue[index - 1];
                    const growth = prevMonth ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue * 100) : 0;
                    
                    return (
                      <div key={month.month} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{month.month}</div>
                          <div className="text-sm text-gray-600">{month.newArtists} new artists</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">${month.revenue.toLocaleString()}</div>
                          {index > 0 && (
                            <div className={`text-sm flex items-center ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {growth >= 0 ? (
                                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                              ) : (
                                <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                              )}
                              {Math.abs(growth).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <DocumentTextIcon className="w-4 h-4 mr-3" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCardIcon className="w-4 h-4 mr-3" />
                  Process Retries
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-3" />
                  Send Reminders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="w-4 h-4 mr-3" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
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
                    placeholder="Search by artist name or invoice number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex space-x-1 bg-secondary-100 p-1 rounded-lg">
                {['all', 'paid', 'pending', 'overdue', 'failed'].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => setStatusFilter(statusOption as typeof statusFilter)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                      statusFilter === statusOption
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-secondary-700 hover:text-secondary-900'
                    }`}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Artist Payments</h2>
            <p className="text-sm text-gray-600">Annual membership fees ($400/year)</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} 
                     className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                       payment.status === 'overdue' ? 'border-red-200 bg-red-50' :
                       payment.status === 'failed' ? 'border-orange-200 bg-orange-50' :
                       'border-gray-200 hover:border-gray-300'
                     }`}
                     onClick={() => setSelectedPayment(payment)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{payment.artistName}</h3>
                        <p className="text-sm text-gray-600">Invoice: {payment.invoiceNumber}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold text-gray-900">${payment.amount}</div>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Due: {formatDate(payment.dueDate)}
                      </div>
                      {payment.paidDate && (
                        <div className="flex items-center">
                          <CheckCircleIcon className="w-4 h-4 mr-1 text-green-600" />
                          Paid: {formatDate(payment.paidDate)}
                        </div>
                      )}
                      {payment.daysPastDue && (
                        <div className="flex items-center text-red-600">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {payment.daysPastDue} days overdue
                        </div>
                      )}
                    </div>
                    <div>
                      Renewal: {formatDate(payment.renewalDate)}
                    </div>
                  </div>

                  {payment.failureReason && (
                    <div className="mt-2 p-2 bg-orange-100 rounded text-sm text-orange-800">
                      <strong>Payment Failed:</strong> {payment.failureReason}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <CurrencyDollarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-600">No payments match your current filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Detail Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
                    <p className="text-gray-600">{selectedPayment.invoiceNumber}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedPayment.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPayment(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Artist Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Artist Information</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Artist Name</label>
                    <p className="text-gray-900">{selectedPayment.artistName}</p>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Amount</label>
                      <p className="text-2xl font-bold text-gray-900">${selectedPayment.amount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Due Date</label>
                      <p className="text-gray-900">{formatDate(selectedPayment.dueDate)}</p>
                    </div>
                    {selectedPayment.paidDate && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Paid Date</label>
                          <p className="text-gray-900">{formatDate(selectedPayment.paidDate)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Payment Method</label>
                          <p className="text-gray-900">{selectedPayment.paymentMethod}</p>
                        </div>
                      </>
                    )}
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Next Renewal</label>
                      <p className="text-gray-900">{formatDate(selectedPayment.renewalDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Failure Information */}
                {selectedPayment.failureReason && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Failure Information</h3>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-orange-900">{selectedPayment.failureReason}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  {selectedPayment.status === 'failed' && (
                    <Button
                      onClick={() => handleRetryPayment(selectedPayment.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <CreditCardIcon className="w-4 h-4 mr-2" />
                      Retry Payment
                    </Button>
                  )}
                  
                  {(selectedPayment.status === 'pending' || selectedPayment.status === 'overdue') && (
                    <Button
                      onClick={() => handleMarkPaid(selectedPayment.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Mark as Paid
                    </Button>
                  )}
                  
                  <Button variant="outline" className="flex-1">
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    View Invoice
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