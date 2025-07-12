'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  ServerIcon,
  CloudIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  EyeIcon,
  TrashIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

// Mock system health data
const systemHealth = {
  overall: 'healthy',
  uptime: '99.98%',
  lastIncident: '2024-01-10T03:30:00Z',
  services: [
    { name: 'Web Application', status: 'healthy', uptime: '100%', responseTime: '245ms' },
    { name: 'Database', status: 'healthy', uptime: '99.99%', responseTime: '12ms' },
    { name: 'File Storage', status: 'healthy', uptime: '99.97%', responseTime: '89ms' },
    { name: 'Email Service', status: 'degraded', uptime: '98.2%', responseTime: '2.1s' },
    { name: 'Payment Processing', status: 'healthy', uptime: '99.95%', responseTime: '156ms' },
    { name: 'Media Processing', status: 'healthy', uptime: '99.8%', responseTime: '3.2s' }
  ]
};

// Mock content moderation queue
const moderationQueue = [
  {
    id: 'mod1',
    type: 'photo',
    artistName: 'Sarah Johnson',
    uploadedAt: '2024-01-22T14:30:00Z',
    status: 'pending',
    url: 'https://picsum.photos/400/300?random=10',
    flagReason: null,
    category: 'band_photos'
  },
  {
    id: 'mod2',
    type: 'video',
    artistName: 'Marcus Williams',
    uploadedAt: '2024-01-22T11:15:00Z',
    status: 'flagged',
    url: 'https://picsum.photos/400/300?random=11',
    flagReason: 'Inappropriate content reported by user',
    category: 'live_performance'
  },
  {
    id: 'mod3',
    type: 'photo',
    artistName: 'Emma Rodriguez',
    uploadedAt: '2024-01-21T16:45:00Z',
    status: 'pending',
    url: 'https://picsum.photos/400/300?random=12',
    flagReason: null,
    category: 'venue_photos'
  },
  {
    id: 'mod4',
    type: 'photo',
    artistName: 'Alex Chen',
    uploadedAt: '2024-01-21T13:20:00Z',
    status: 'approved',
    url: 'https://picsum.photos/400/300?random=13',
    flagReason: null,
    category: 'promotional'
  }
];

// Mock feature flags
const featureFlags = [
  { name: 'new_booking_flow', description: 'Enhanced booking workflow with better UX', enabled: true, rollout: 100 },
  { name: 'advanced_search', description: 'Advanced search filters and location radius', enabled: true, rollout: 75 },
  { name: 'video_calling', description: 'Built-in video calling for artist-host meetings', enabled: false, rollout: 0 },
  { name: 'mobile_app_beta', description: 'Mobile app beta access for select users', enabled: true, rollout: 25 },
  { name: 'ai_recommendations', description: 'AI-powered artist-host matching', enabled: false, rollout: 0 },
  { name: 'premium_features', description: 'Premium features for paid tier artists', enabled: true, rollout: 90 }
];

export default function OperationsPage() {
  const [moderationItems, setModerationItems] = useState(moderationQueue);
  const [flags, setFlags] = useState(featureFlags);
  const [selectedModerationItem, setSelectedModerationItem] = useState<typeof moderationQueue[0] | null>(null);

  const handleModerationAction = (itemId: string, action: 'approve' | 'reject') => {
    setModerationItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item
      )
    );
    setSelectedModerationItem(null);
  };

  const toggleFeatureFlag = (flagName: string) => {
    setFlags(prev => 
      prev.map(flag => 
        flag.name === flagName ? { ...flag, enabled: !flag.enabled } : flag
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'degraded':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'down':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Review</Badge>;
      case 'flagged':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Flagged</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getModerationStats = () => {
    const pending = moderationItems.filter(item => item.status === 'pending').length;
    const flagged = moderationItems.filter(item => item.status === 'flagged').length;
    const approved = moderationItems.filter(item => item.status === 'approved').length;
    const rejected = moderationItems.filter(item => item.status === 'rejected').length;
    return { pending, flagged, approved, rejected };
  };

  const modStats = getModerationStats();

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Operations</h1>
          <p className="text-gray-600">System health, content moderation, and platform management</p>
        </div>

        {/* System Health Overview */}
        <Card className={`mb-8 border-l-4 ${
          systemHealth.overall === 'healthy' ? 'border-l-green-500 bg-green-50' :
          systemHealth.overall === 'degraded' ? 'border-l-yellow-500 bg-yellow-50' :
          'border-l-red-500 bg-red-50'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(systemHealth.overall)}
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">System Status: {systemHealth.overall.charAt(0).toUpperCase() + systemHealth.overall.slice(1)}</h3>
                  <p className="text-sm text-gray-600">
                    Uptime: {systemHealth.uptime} • Last incident: {new Date(systemHealth.lastIncident).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Service Health */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Service Health</h2>
              <p className="text-sm text-gray-600">Real-time status of all platform services</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <div className="font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-600">
                          {service.uptime} uptime • {service.responseTime} avg response
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        service.status === 'healthy' ? 'text-green-600' :
                        service.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Moderation Stats */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Content Moderation</h2>
              <p className="text-sm text-gray-600">Review queue and moderation statistics</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{modStats.pending}</div>
                  <div className="text-sm text-yellow-700">Pending Review</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{modStats.flagged}</div>
                  <div className="text-sm text-red-700">Flagged Items</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{modStats.approved}</div>
                  <div className="text-sm text-green-700">Approved</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{modStats.rejected}</div>
                  <div className="text-sm text-gray-700">Rejected</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Moderation Queue
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Flags */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Feature Flags</h2>
            <p className="text-sm text-gray-600">Manage feature rollouts and A/B testing</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {flags.map((flag) => (
                <div key={flag.name} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{flag.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{flag.rollout}%</span>
                      <button
                        onClick={() => toggleFeatureFlag(flag.name)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          flag.enabled ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            flag.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{flag.description}</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${flag.rollout}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Moderation Queue */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Content Moderation Queue</h2>
            <p className="text-sm text-gray-600">Review uploaded photos and videos</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moderationItems.filter(item => item.status === 'pending' || item.status === 'flagged').map((item) => (
                <div key={item.id} 
                     className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                       item.status === 'flagged' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                     }`}
                     onClick={() => setSelectedModerationItem(item)}>
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    {item.type === 'photo' ? (
                      <PhotoIcon className="w-12 h-12 text-gray-400" />
                    ) : (
                      <VideoCameraIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{item.artistName}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 capitalize">{item.category.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.uploadedAt).toLocaleDateString()}
                    </p>
                    {item.flagReason && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                        <FlagIcon className="w-3 h-3 inline mr-1" />
                        {item.flagReason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {moderationItems.filter(item => item.status === 'pending' || item.status === 'flagged').length === 0 && (
              <div className="text-center py-12">
                <CheckCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">No items pending moderation</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Moderation Detail Modal */}
        {selectedModerationItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Content Review</h2>
                    <p className="text-gray-600">{selectedModerationItem.artistName} • {selectedModerationItem.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedModerationItem.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedModerationItem(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Content Preview */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Content</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {selectedModerationItem.type === 'photo' ? (
                      <PhotoIcon className="w-16 h-16 text-gray-400" />
                    ) : (
                      <VideoCameraIcon className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Artist</label>
                      <p className="text-gray-900">{selectedModerationItem.artistName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <p className="text-gray-900 capitalize">{selectedModerationItem.category.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Uploaded</label>
                      <p className="text-gray-900">{new Date(selectedModerationItem.uploadedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-gray-900 capitalize">{selectedModerationItem.type}</p>
                    </div>
                  </div>
                </div>

                {/* Flag Information */}
                {selectedModerationItem.flagReason && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Flag Information</h3>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-red-900">{selectedModerationItem.flagReason}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {(selectedModerationItem.status === 'pending' || selectedModerationItem.status === 'flagged') && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={() => handleModerationAction(selectedModerationItem.id, 'approve')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Approve Content
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleModerationAction(selectedModerationItem.id, 'reject')}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircleIcon className="w-4 h-4 mr-2" />
                      Reject Content
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}