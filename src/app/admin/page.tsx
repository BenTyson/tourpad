'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  CheckIcon, 
  XMarkIcon, 
  UserIcon, 
  HomeIcon, 
  MusicalNoteIcon,
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

// Mock data for admin dashboard
const platformMetrics = {
  totalUsers: 1247,
  activeArtists: 423,
  activeHosts: 186,
  pendingApplications: 23,
  totalBookings: 892,
  monthlyRevenue: 168800,
  upcomingEvents: 47,
  supportTickets: 12
};

const recentActivity = [
  { id: 1, type: 'application', message: 'New artist application from Sarah Johnson (Austin, TX)', time: '2 minutes ago', urgent: false },
  { id: 2, type: 'payment', message: 'Payment failed for artist Marcus Williams - $400 annual fee', time: '15 minutes ago', urgent: true },
  { id: 3, type: 'booking', message: 'Booking dispute reported between Emma Rodriguez and Mike Chen', time: '1 hour ago', urgent: true },
  { id: 4, type: 'support', message: 'New support ticket #847 - Host venue verification question', time: '2 hours ago', urgent: false },
  { id: 5, type: 'system', message: 'System maintenance scheduled for tonight 2-4 AM EST', time: '3 hours ago', urgent: false }
];

const adminSections = [
  {
    title: 'Applications',
    description: 'Review and approve new artists and hosts',
    icon: UserIcon,
    color: 'bg-blue-500',
    count: platformMetrics.pendingApplications,
    href: '/admin/applications'
  },
  {
    title: 'User Management',
    description: 'Manage all artists and hosts on the platform',
    icon: UsersIcon,
    color: 'bg-green-500',
    count: platformMetrics.totalUsers,
    href: '/admin/users'
  },
  {
    title: 'Bookings & Events',
    description: 'Monitor all platform bookings and events',
    icon: CalendarIcon,
    color: 'bg-purple-500',
    count: platformMetrics.upcomingEvents,
    href: '/admin/bookings'
  },
  {
    title: 'Financial Management',
    description: 'Track payments, revenue, and financial reports',
    icon: CurrencyDollarIcon,
    color: 'bg-yellow-500',
    count: `$${(platformMetrics.monthlyRevenue / 1000).toFixed(0)}k`,
    href: '/admin/finance'
  },
  {
    title: 'Platform Operations',
    description: 'System health, content moderation, and maintenance',
    icon: Cog6ToothIcon,
    color: 'bg-red-500',
    count: 'Active',
    href: '/admin/operations'
  },
  {
    title: 'Support Center',
    description: 'Manage support tickets and user communications',
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-indigo-500',
    count: platformMetrics.supportTickets,
    href: '/admin/support'
  },
  {
    title: 'Reports & Analytics',
    description: 'Business intelligence and performance reports',
    icon: ChartBarIcon,
    color: 'bg-pink-500',
    count: 'View',
    href: '/admin/reports'
  },
  {
    title: 'Security & Compliance',
    description: 'Security monitoring and compliance management',
    icon: ShieldCheckIcon,
    color: 'bg-gray-500',
    count: 'Secure',
    href: '/admin/security'
  }
];

export default function AdminPage() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return UserIcon;
      case 'payment': return CurrencyDollarIcon;
      case 'booking': return CalendarIcon;
      case 'support': return ChatBubbleLeftRightIcon;
      case 'system': return Cog6ToothIcon;
      default: return ClockIcon;
    }
  };

  const getActivityColor = (type: string, urgent: boolean) => {
    if (urgent) return 'text-red-600 bg-red-100';
    switch (type) {
      case 'application': return 'text-blue-600 bg-blue-100';
      case 'payment': return 'text-yellow-600 bg-yellow-100';
      case 'booking': return 'text-purple-600 bg-purple-100';
      case 'support': return 'text-indigo-600 bg-indigo-100';
      case 'system': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TourPad Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Platform oversight and management center</p>
        </div>

        {/* Platform Health Alert */}
        <Card className="mb-8 border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckIcon className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-green-900">Platform Status: Operational</h3>
                <p className="text-green-800 text-sm">All systems running normally • Last updated: 2 minutes ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{platformMetrics.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    +12% this month
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
                  <p className="text-3xl font-bold text-gray-900">${(platformMetrics.monthlyRevenue / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    +8% vs last month
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
                  <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{platformMetrics.pendingApplications}</p>
                  <p className="text-sm text-yellow-600">Requires attention</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{platformMetrics.upcomingEvents}</p>
                  <p className="text-sm text-purple-600">Next 30 days</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CalendarIcon className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Admin Sections Grid */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-900">Admin Sections</h2>
                <p className="text-gray-600">Access all administrative functions</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {adminSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Link key={section.title} href={section.href}>
                        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-primary-200">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className={`p-3 rounded-lg ${section.color} bg-opacity-10`}>
                                <Icon className={`w-6 h-6 ${section.color.replace('bg-', 'text-')}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-gray-900 truncate">{section.title}</h3>
                                  <Badge variant="secondary">{section.count}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-600">Latest platform events</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const colorClasses = getActivityColor(activity.type, activity.urgent);
                    
                    return (
                      <div key={activity.id} className={`p-3 rounded-lg border ${activity.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${colorClasses}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 leading-relaxed">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                            {activity.urgent && (
                              <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 mt-2">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href="/admin/activity">
                    <Button variant="outline" className="w-full">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}