'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeftIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  MapPinIcon,
  DocumentArrowDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

// Mock analytics data
const platformMetrics = {
  totalUsers: 1247,
  activeArtists: 423,
  activeHosts: 186,
  totalBookings: 892,
  monthlyRevenue: 168800,
  growthRate: 12.5,
  conversionRate: 3.8,
  avgSessionDuration: '8m 34s'
};

const monthlyGrowth = [
  { month: 'Aug 2023', users: 245, revenue: 9800, bookings: 45 },
  { month: 'Sep 2023', users: 312, revenue: 12480, bookings: 67 },
  { month: 'Oct 2023', users: 398, revenue: 15920, bookings: 89 },
  { month: 'Nov 2023', users: 487, revenue: 19480, bookings: 124 },
  { month: 'Dec 2023', users: 623, revenue: 24920, bookings: 167 },
  { month: 'Jan 2024', users: 789, revenue: 31560, bookings: 234 }
];

const geographicData = [
  { city: 'Austin, TX', artists: 45, hosts: 23, bookings: 89 },
  { city: 'Nashville, TN', artists: 38, hosts: 19, bookings: 76 },
  { city: 'Portland, OR', artists: 34, hosts: 22, bookings: 68 },
  { city: 'Denver, CO', artists: 29, hosts: 18, bookings: 54 },
  { city: 'Seattle, WA', artists: 31, hosts: 15, bookings: 49 },
  { city: 'Chicago, IL', artists: 26, hosts: 14, bookings: 41 },
  { city: 'Los Angeles, CA', artists: 24, hosts: 12, bookings: 38 },
  { city: 'Atlanta, GA', artists: 22, hosts: 11, bookings: 35 }
];

const userEngagement = [
  { metric: 'Profile Completion Rate', value: '87%', change: '+5%', trend: 'up' },
  { metric: 'Monthly Active Users', value: '1,156', change: '+12%', trend: 'up' },
  { metric: 'Avg. Bookings per Artist', value: '2.3', change: '+8%', trend: 'up' },
  { metric: 'Host Response Rate', value: '94%', change: '-2%', trend: 'down' },
  { metric: 'Artist Retention (12mo)', value: '78%', change: '+15%', trend: 'up' },
  { metric: 'Host Retention (12mo)', value: '82%', change: '+9%', trend: 'up' }
];

const revenueBreakdown = [
  { category: 'New Artist Memberships', amount: 89600, percentage: 53.1 },
  { category: 'Artist Renewals', amount: 52800, percentage: 31.3 },
  { category: 'Late Payment Fees', amount: 8400, percentage: 5.0 },
  { category: 'Premium Features', amount: 18000, percentage: 10.7 }
];

export default function ReportsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'users' | 'revenue' | 'bookings'>('users');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
              <p className="text-gray-600">Business intelligence and performance insights</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Time Frame Selector */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
              <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
                {[
                  { key: '7d', label: '7 Days' },
                  { key: '30d', label: '30 Days' },
                  { key: '90d', label: '90 Days' },
                  { key: '1y', label: '1 Year' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setSelectedTimeframe(option.key as typeof selectedTimeframe)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedTimeframe === option.key
                        ? 'bg-white text-neutral-700 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{platformMetrics.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    +{platformMetrics.growthRate}% this month
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <UsersIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(platformMetrics.monthlyRevenue)}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    +8.2% vs last month
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{platformMetrics.totalBookings}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    +15.3% this month
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CalendarIcon className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{platformMetrics.conversionRate}%</p>
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                    -0.4% this month
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ChartBarIcon className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Growth Trends */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Growth Trends</h2>
                <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
                  {[
                    { key: 'users', label: 'Users' },
                    { key: 'revenue', label: 'Revenue' },
                    { key: 'bookings', label: 'Bookings' }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSelectedMetric(option.key as typeof selectedMetric)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        selectedMetric === option.key
                          ? 'bg-white text-neutral-700 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyGrowth.map((month, index) => {
                  const currentValue = selectedMetric === 'users' ? month.users :
                                    selectedMetric === 'revenue' ? month.revenue : month.bookings;
                  const prevValue = index > 0 ? (
                    selectedMetric === 'users' ? monthlyGrowth[index - 1].users :
                    selectedMetric === 'revenue' ? monthlyGrowth[index - 1].revenue : 
                    monthlyGrowth[index - 1].bookings
                  ) : currentValue;
                  const growth = index > 0 ? ((currentValue - prevValue) / prevValue * 100) : 0;
                  
                  return (
                    <div key={month.month} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{month.month}</div>
                        <div className="text-sm text-gray-600">
                          {selectedMetric === 'revenue' ? formatCurrency(currentValue) : currentValue.toLocaleString()}
                          {selectedMetric === 'users' && ' users'}
                          {selectedMetric === 'bookings' && ' bookings'}
                        </div>
                      </div>
                      <div className="text-right">
                        {index > 0 && (
                          <div className={`text-sm flex items-center ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {growth >= 0 ? (
                              <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                            )}
                            {formatPercentage(growth)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* User Engagement Metrics */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">User Engagement</h2>
              <p className="text-sm text-gray-600">Key performance indicators</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userEngagement.map((metric) => (
                  <div key={metric.metric} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{metric.metric}</div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm flex items-center ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend === 'up' ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                        )}
                        {metric.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Geographic Distribution</h2>
              <p className="text-sm text-gray-600">Platform activity by city</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geographicData.map((location, index) => (
                  <div key={location.city} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{location.city}</div>
                        <div className="text-sm text-gray-600">
                          {location.artists} artists • {location.hosts} hosts
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{location.bookings}</div>
                      <div className="text-sm text-gray-600">bookings</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Revenue Breakdown</h2>
              <p className="text-sm text-gray-600">Monthly revenue by category</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{item.category}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">{item.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Revenue</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(revenueBreakdown.reduce((sum, item) => sum + item.amount, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export & Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Generate Reports</h2>
            <p className="text-sm text-gray-600">Export data and create custom reports</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                <DocumentArrowDownIcon className="w-8 h-8 mb-2 text-blue-600" />
                <span className="font-medium">User Report</span>
                <span className="text-xs text-gray-500">Artists & Hosts Data</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                <DocumentArrowDownIcon className="w-8 h-8 mb-2 text-green-600" />
                <span className="font-medium">Financial Report</span>
                <span className="text-xs text-gray-500">Revenue & Payments</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                <DocumentArrowDownIcon className="w-8 h-8 mb-2 text-purple-600" />
                <span className="font-medium">Booking Report</span>
                <span className="text-xs text-gray-500">Event Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}