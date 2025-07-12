'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  UserIcon,
  CogIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { testArtists, testHosts, testAdminUsers, testBookings, testApplications } from '@/data/realTestData';

export default function TestDashboardPage() {
  const { data: session, status } = useSession();
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const testScenarios = [
    {
      id: 'auth-flows',
      title: 'Authentication Flows',
      description: 'Test login/logout for all user types',
      tests: [
        { name: 'Admin Login', path: '/login', data: 'admin@tourpad.com / admin123' },
        { name: 'Artist Login', path: '/login', data: 'sarah.artist@email.com / artist123' },
        { name: 'Host Login', path: '/login', data: 'mike.host@email.com / host123' },
        { name: 'Session Management', path: '/test-dashboard', data: 'Check user session persistence' }
      ]
    },
    {
      id: 'admin-features',
      title: 'Admin Dashboard Features',
      description: 'Test all admin functionality',
      tests: [
        { name: 'Main Admin Dashboard', path: '/admin', data: 'Overview metrics and navigation' },
        { name: 'User Management', path: '/admin/users', data: 'View and manage all users' },
        { name: 'Applications Review', path: '/admin/applications', data: 'Review pending applications' },
        { name: 'Bookings Oversight', path: '/admin/bookings', data: 'Monitor all platform bookings' },
        { name: 'Financial Management', path: '/admin/finance', data: 'Track payments and revenue' },
        { name: 'Platform Operations', path: '/admin/operations', data: 'System health and moderation' },
        { name: 'Reports & Analytics', path: '/admin/reports', data: 'Business intelligence dashboard' },
        { name: 'Security & Compliance', path: '/admin/security', data: 'Security monitoring and GDPR' }
      ]
    },
    {
      id: 'artist-features',
      title: 'Artist Features',
      description: 'Test artist-specific functionality',
      tests: [
        { name: 'Artist Dashboard', path: '/dashboard', data: 'Personal artist dashboard' },
        { name: 'Browse Hosts', path: '/hosts', data: 'View available venues' },
        { name: 'Host Profile View', path: '/hosts/host1', data: 'Detailed host information' },
        { name: 'Create Booking', path: '/bookings/new?hostId=host1', data: 'Book a venue' },
        { name: 'Media Management', path: '/dashboard/artist-media', data: 'Manage artist media' },
        { name: 'Payment/Subscription', path: '/payment/artist', data: 'Manage subscription' }
      ]
    },
    {
      id: 'host-features',
      title: 'Host Features',
      description: 'Test host-specific functionality',
      tests: [
        { name: 'Host Dashboard', path: '/dashboard', data: 'Personal host dashboard' },
        { name: 'Browse Artists', path: '/artists', data: 'View available artists' },
        { name: 'Artist Profile View', path: '/artists/artist1', data: 'Detailed artist information' },
        { name: 'Create Booking', path: '/bookings/new?artistId=artist1', data: 'Invite an artist' },
        { name: 'Venue Media Management', path: '/dashboard/media', data: 'Manage venue photos' }
      ]
    },
    {
      id: 'booking-flows',
      title: 'Booking System',
      description: 'Test end-to-end booking flows',
      tests: [
        { name: 'Artist Books Host', path: '/bookings/new?hostId=host1', data: 'Complete booking flow' },
        { name: 'Host Invites Artist', path: '/bookings/new?artistId=artist1', data: 'Complete invitation flow' },
        { name: 'Booking Management', path: '/bookings/booking1', data: 'View and manage booking' },
        { name: 'Form Validation', path: '/bookings/new', data: 'Test validation and error handling' }
      ]
    },
    {
      id: 'data-integrity',
      title: 'Data & API Testing',
      description: 'Verify data flows and API responses',
      tests: [
        { name: 'User Data Loading', path: '/test-dashboard', data: 'Check realistic test data' },
        { name: 'API Endpoints', path: '/test-dashboard', data: 'Test API responses' },
        { name: 'Form Submissions', path: '/test-dashboard', data: 'Test form validation' },
        { name: 'Media Uploads', path: '/dashboard/media', data: 'Test file upload flow' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
      case 'suspended':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <UserIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      case 'suspended':
        return <Badge variant="error">Suspended</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">TourPad Testing Dashboard</h1>
              <p className="text-gray-600">Comprehensive testing of all features and login flows</p>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{session.user?.name}</div>
                    <div className="text-sm text-gray-600">{session.user?.email}</div>
                  </div>
                  <Button onClick={() => signOut()} variant="outline">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button>Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Current Session Info */}
        {session && (
          <Card className="mb-8 border-l-4 border-l-green-500 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Active Session</h3>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-green-700 font-medium">User Type:</span>
                      <div className="text-green-900">{session.user?.type}</div>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Status:</span>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(session.user?.status)}
                        <span className="ml-1 text-green-900">{session.user?.status}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">User ID:</span>
                      <div className="text-green-900 font-mono text-xs">{session.user?.id}</div>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Email:</span>
                      <div className="text-green-900">{session.user?.email}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {session.user?.type === 'admin' && (
                    <Link href="/admin">
                      <Button size="sm">
                        <CogIcon className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      <UserIcon className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Data Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{testArtists.length}</div>
              <div className="text-sm text-gray-600">Test Artists</div>
              <div className="text-xs text-gray-500 mt-1">
                {testArtists.filter(a => a.status === 'approved').length} approved
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{testHosts.length}</div>
              <div className="text-sm text-gray-600">Test Hosts</div>
              <div className="text-xs text-gray-500 mt-1">
                {testHosts.filter(h => h.status === 'approved').length} approved
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{testBookings.length}</div>
              <div className="text-sm text-gray-600">Test Bookings</div>
              <div className="text-xs text-gray-500 mt-1">
                {testBookings.filter(b => b.status === 'approved').length} approved
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">{testAdminUsers.length}</div>
              <div className="text-sm text-gray-600">Admin Users</div>
              <div className="text-xs text-gray-500 mt-1">
                Full access configured
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Scenarios */}
        <div className="space-y-6">
          {testScenarios.map((scenario) => (
            <Card key={scenario.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{scenario.title}</h2>
                    <p className="text-gray-600">{scenario.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTest(activeTest === scenario.id ? null : scenario.id)}
                  >
                    {activeTest === scenario.id ? 'Hide' : 'Show'} Tests
                  </Button>
                </div>
              </CardHeader>
              {activeTest === scenario.id && (
                <CardContent>
                  <div className="space-y-3">
                    {scenario.tests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{test.name}</div>
                          <div className="text-sm text-gray-600">{test.data}</div>
                        </div>
                        <Link href={test.path}>
                          <Button size="sm" variant="outline">
                            <EyeIcon className="w-4 h-4 mr-2" />
                            Test
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Quick Test Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/login">
                <Button className="w-full h-16 flex flex-col items-center justify-center">
                  <UserIcon className="w-6 h-6 mb-1" />
                  <span>Test Login Flows</span>
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <CogIcon className="w-6 h-6 mb-1" />
                  <span>Admin Dashboard</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <UserIcon className="w-6 h-6 mb-1" />
                  <span>User Dashboard</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
