'use client';
import { useState, useEffect } from 'react';
import { PaymentNotifications } from '@/components/admin/PaymentNotifications';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  AlertTriangle,
  Download,
  RefreshCw,
  ArrowLeft,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface FinanceData {
  overview: {
    totalRevenue: number;
    mrr: number;
    arr: number;
    growthRate: number;
    currentMonthRevenue: number;
    lastMonthRevenue: number;
  };
  subscriptions: {
    active: number;
    artists: number;
    fans: number;
    totalMrr: number;
    averageSubscriptionValue: number;
  };
  revenue: {
    breakdown: {
      artists: number;
      fans: number;
    };
    trends: Array<{
      month: string;
      revenue: number;
      payments: number;
    }>;
  };
  operations: {
    failedPayments: number;
    failedPaymentsList: Array<{
      id: string;
      userId: string;
      userName: string;
      userEmail: string;
      userType: string;
      amount: number;
      description: string;
      createdAt: string;
    }>;
  };
  customers: {
    topCustomers: Array<{
      userId: string;
      name: string;
      userType: string;
      revenue: number;
      payments: number;
    }>;
  };
}

export default function AdminFinancePage() {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('current_year');

  const fetchFinanceData = async () => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams();
      
      if (dateRange === 'last_30_days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        params.set('startDate', thirtyDaysAgo.toISOString());
      } else if (dateRange === 'last_90_days') {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        params.set('startDate', ninetyDaysAgo.toISOString());
      }
      
      const response = await fetch(`/api/admin/finance/overview?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setFinanceData(data);
        setError(null);
      } else {
        setError('Failed to fetch finance data');
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
      setError('Error loading finance data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [dateRange]);

  // Auto-refresh when payment events occur
  useAutoRefresh(fetchFinanceData, ['payment_success', 'payment_failed', 'subscription_updated', 'subscription_canceled']);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const formatPercentage = (value: number) => {
    const formatted = value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
    return formatted;
  };


  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const handleExport = async (type: 'payments' | 'subscriptions' | 'revenue_summary') => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        type: type
      });

      if (dateRange === 'last_30_days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        params.set('startDate', thirtyDaysAgo.toISOString());
      } else if (dateRange === 'last_90_days') {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        params.set('startDate', ninetyDaysAgo.toISOString());
      }

      // Create download link
      const url = `/api/admin/finance/export?${params.toString()}`;
      const link = document.createElement('a');
      link.href = url;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mr-4" />
            <span className="text-lg text-gray-600">Loading finance data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <Button onClick={fetchFinanceData} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!financeData) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-transparent hover:bg-neutral-100 rounded-md transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Admin
                </button>
              </Link>
              <div className="h-6 w-px bg-neutral-200"></div>
              <h1 className="text-xl font-semibold text-neutral-900">Finance</h1>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="current_year">Current Year</option>
                <option value="last_90_days">Last 90 Days</option>
                <option value="last_30_days">Last 30 Days</option>
              </select>
              <Button
                onClick={fetchFinanceData}
                disabled={refreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PaymentNotifications />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <DollarSign className="w-8 h-8 text-primary-100" />
                <Badge className="bg-primary-400/30 text-white border-0 backdrop-blur-sm">
                  Total Revenue
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {formatCurrency(financeData.overview.totalRevenue)}
              </div>
              <div className="flex items-center text-primary-100 text-sm">
                {getGrowthIcon(financeData.overview.growthRate)}
                <span className="ml-1">
                  {formatPercentage(financeData.overview.growthRate)} vs last month
                </span>
              </div>
            </CardContent>
          </Card>

          {/* MRR */}
          <Card className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-secondary-100" />
                <Badge className="bg-secondary-400/30 text-white border-0 backdrop-blur-sm">
                  MRR
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {formatCurrency(financeData.overview.mrr)}
              </div>
              <div className="text-secondary-100 text-sm">
                Monthly Recurring Revenue
              </div>
            </CardContent>
          </Card>

          {/* Active Subscriptions */}
          <Card style={{background: 'linear-gradient(135deg, #318CE7 0%, #6b8ca4 100%)'}} className="text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-white/80" />
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  Subscriptions
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {financeData.subscriptions.active}
              </div>
              <div className="text-white/80 text-sm">
                {financeData.subscriptions.artists} Artists • {financeData.subscriptions.fans} Fans
              </div>
            </CardContent>
          </Card>

          {/* ARR */}
          <Card style={{background: 'linear-gradient(135deg, #344c3d 0%, #5e7259 100%)'}} className="text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <BarChart3 className="w-8 h-8 text-white/80" />
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  ARR
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {formatCurrency(financeData.overview.arr)}
              </div>
              <div className="text-white/80 text-sm">
                Annual Recurring Revenue
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue by User Type */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Revenue by User Type</h3>
                <PieChart className="w-5 h-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-3" style={{backgroundColor: '#318CE7'}}></div>
                    <span className="text-gray-700">Artists</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(financeData.revenue.breakdown.artists)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {financeData.subscriptions.artists} subscribers
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-3" style={{backgroundColor: '#738a6e'}}></div>
                    <span className="text-gray-700">Fans</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(financeData.revenue.breakdown.fans)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {financeData.subscriptions.fans} subscribers
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Trends */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue Trend</h3>
                <Activity className="w-5 h-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {financeData.revenue.trends.slice(-6).map((trend) => {
                  const month = new Date(trend.month + '-01').toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  });
                  return (
                    <div key={trend.month} className="flex items-center justify-between">
                      <span className="text-gray-600">{month}</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(trend.revenue)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trend.payments} payments
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operations & Top Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Failed Payments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Failed Payments</h3>
                </div>
                <Badge variant={financeData.operations.failedPayments > 0 ? "error" : "secondary"}>
                  {financeData.operations.failedPayments}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {financeData.operations.failedPaymentsList.length > 0 ? (
                <div className="space-y-3">
                  {financeData.operations.failedPaymentsList.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{payment.userName}</div>
                        <div className="text-sm text-gray-600">{payment.userEmail}</div>
                        <div className="text-xs text-red-600 mt-1">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">
                          {formatCurrency(payment.amount)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {payment.userType}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No failed payments</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
                <Users className="w-5 h-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {financeData.customers.topCustomers.slice(0, 5).map((customer, index) => (
                  <div key={customer.userId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 text-white"
                        style={{
                          backgroundColor: index === 0 ? '#318CE7' : 
                                           index === 1 ? '#738a6e' : 
                                           index === 2 ? '#d4c4a8' : 
                                           '#344c3d'
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.payments} payments</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(customer.revenue)}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{
                          borderColor: customer.userType === 'ARTIST' ? '#318CE7' : '#738a6e',
                          color: customer.userType === 'ARTIST' ? '#318CE7' : '#738a6e'
                        }}
                      >
                        {customer.userType}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Export Financial Data</h3>
              <p className="text-sm text-gray-600">Download comprehensive financial reports</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('payments')}
                  className="flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Payments
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('subscriptions')}
                  className="flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Subscriptions
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('revenue_summary')}
                  className="flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Revenue Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}