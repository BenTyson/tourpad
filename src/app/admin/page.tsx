'use client';
import { useState, useEffect } from 'react';
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

// Static activity data (will be replaced with real data later)
const recentActivityData = [
  { id: 1, type: 'application', message: 'New artist application from Sarah Johnson (Austin, TX)', time: '2 minutes ago', urgent: false },
  { id: 2, type: 'payment', message: 'Payment failed for artist Marcus Williams - $400 annual fee', time: '15 minutes ago', urgent: true },
  { id: 3, type: 'booking', message: 'Booking dispute reported between Emma Rodriguez and Mike Chen', time: '1 hour ago', urgent: true },
  { id: 4, type: 'support', message: 'New support ticket #847 - Host venue verification question', time: '2 hours ago', urgent: false },
  { id: 5, type: 'system', message: 'System maintenance scheduled for tonight 2-4 AM EST', time: '3 hours ago', urgent: false }
];

export default function AdminPage() {
  const [platformMetrics, setPlatformMetrics] = useState({
    totalUsers: 0,
    activeArtists: 0,
    activeHosts: 0,
    pendingApplications: 0,
    monthlyRevenue: 0,
    upcomingEvents: 0,
    supportTickets: 12 // Keep this hardcoded for now as it's not in our schema yet
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealMetrics();
  }, []);

  const fetchRealMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics');
      if (response.ok) {
        const data = await response.json();
        setPlatformMetrics(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAdminSections = () => [
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
      title: 'Finance & Analytics',
      description: 'Revenue tracking and financial reports',
      icon: ChartBarIcon,
      color: 'bg-blue-600',
      count: Math.round(platformMetrics.monthlyRevenue / 100), // Convert to dollars
      href: '/admin/finance'
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
      title: 'Platform Operations',
      description: 'System health, content moderation, and maintenance',
      icon: Cog6ToothIcon,
      color: 'bg-red-500',
      count: 'Active',
      href: '/admin/operations'
    },
    {
      title: 'Messages',
      description: 'Monitor platform messages and conversations',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-blue-500',
      count: 'Monitor',
      href: '/admin/messages'
    },
    {
      title: 'Spotify Integration',
      description: 'Manage artist Spotify connections and music data sync',
      icon: MusicalNoteIcon,
      color: 'bg-green-500',
      count: 'Manage',
      href: '/admin/spotify'
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Platform Health Alert */}
        <Card className="mb-8 border-l-4 border-l-secondary-600 bg-secondary-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckIcon className="w-6 h-6 text-secondary-600 mr-3" />
              <div>
                <h3 className="font-semibold text-secondary-900">Platform Status: Operational</h3>
                <p className="text-secondary-800 text-sm">All systems running normally • Last updated: 2 minutes ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-neutral-900">
                  {loading ? (
                    <div className="w-16 h-8 bg-neutral-200 rounded animate-pulse"></div>
                  ) : (
                    platformMetrics.totalUsers.toLocaleString()
                  )}
                </div>
                <div className="text-sm text-neutral-600">Total Users</div>
                <div className="text-sm text-neutral-500 flex items-center mt-1">
                  <UsersIcon className="w-4 h-4 mr-1" />
                  All platform users
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-neutral-900">
                  {loading ? (
                    <div className="w-20 h-8 bg-neutral-200 rounded animate-pulse"></div>
                  ) : (
                    platformMetrics.monthlyRevenue > 0 
                      ? `$${(platformMetrics.monthlyRevenue / 100).toLocaleString()}` 
                      : '$0'
                  )}
                </div>
                <div className="text-sm text-neutral-600">Monthly Revenue</div>
                <div className="text-sm text-neutral-500 flex items-center mt-1">
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  This month total
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-neutral-900">
                  {loading ? (
                    <div className="w-12 h-8 bg-neutral-200 rounded animate-pulse"></div>
                  ) : (
                    platformMetrics.pendingApplications
                  )}
                </div>
                <div className="text-sm text-neutral-600">Pending Applications</div>
                <div className="text-sm text-orange-600">
                  {platformMetrics.pendingApplications > 0 ? 'Requires attention' : 'All up to date'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-neutral-900">
                  {loading ? (
                    <div className="w-12 h-8 bg-neutral-200 rounded animate-pulse"></div>
                  ) : (
                    platformMetrics.upcomingEvents
                  )}
                </div>
                <div className="text-sm text-neutral-600">Active Bookings</div>
                <div className="text-sm text-primary-600">Next 30 days</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Admin Sections Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200">
                <h2 className="text-xl font-semibold text-neutral-900">Admin Sections</h2>
                <p className="text-sm text-neutral-600 mt-1">Access all administrative functions</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {getAdminSections().map((section) => {
                    const Icon = section.icon;
                    return (
                      <Link key={section.title} href={section.href}>
                        <div className="group rounded-xl bg-white border border-neutral-200 p-6 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Icon className="w-6 h-6 text-primary-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-neutral-900">{section.title}</h3>
                                <Badge variant="secondary" className="bg-neutral-100 text-neutral-700">{section.count}</Badge>
                              </div>
                              <p className="text-sm text-neutral-600 mt-1">{section.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900">Recent Activity</h2>
                <p className="text-sm text-neutral-600 mt-1">Latest platform events</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivityData.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const colorClasses = getActivityColor(activity.type, activity.urgent);
                    
                    return (
                      <div key={activity.id} className={`p-3 rounded-lg border ${activity.urgent ? 'border-red-200 bg-red-50' : 'border-neutral-200'}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${colorClasses}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-neutral-900 leading-relaxed">{activity.message}</p>
                            <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
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
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <Link href="/admin/activity">
                    <Button variant="outline" className="w-full">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}