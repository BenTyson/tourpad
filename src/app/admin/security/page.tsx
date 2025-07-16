'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeftIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  LockClosedIcon,
  DocumentTextIcon,
  EyeIcon,
  TrashIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

// Mock security data
const securityMetrics = {
  threatLevel: 'low',
  activeIncidents: 2,
  blockedIPs: 47,
  failedLogins: 156,
  dataRequests: 8,
  lastScan: '2024-01-22T02:00:00Z'
};

const securityIncidents = [
  {
    id: 'inc-001',
    type: 'suspicious_login',
    severity: 'medium',
    status: 'investigating',
    userId: 'artist3',
    userName: 'Marcus Williams',
    description: 'Multiple failed login attempts from unusual location',
    detectedAt: '2024-01-22T14:30:00Z',
    ipAddress: '192.168.1.100',
    location: 'Unknown',
    action: 'Account temporarily locked'
  },
  {
    id: 'inc-002',
    type: 'data_breach_attempt',
    severity: 'high',
    status: 'resolved',
    userId: null,
    userName: null,
    description: 'Automated bot attempting to scrape user data',
    detectedAt: '2024-01-21T23:45:00Z',
    ipAddress: '203.45.67.89',
    location: 'Unknown',
    action: 'IP blocked, firewall rules updated'
  },
  {
    id: 'inc-003',
    type: 'payment_fraud',
    severity: 'high',
    status: 'investigating',
    userId: 'artist5',
    userName: 'Maya Patel',
    description: 'Chargeback dispute flagged as potential fraud',
    detectedAt: '2024-01-20T16:20:00Z',
    ipAddress: '45.123.78.12',
    location: 'Los Angeles, CA',
    action: 'Payment provider notified, account under review'
  }
];

const dataRequests = [
  {
    id: 'req-001',
    type: 'gdpr_export',
    userId: 'host2',
    userName: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    requestedAt: '2024-01-20T10:30:00Z',
    status: 'pending',
    dueDate: '2024-01-28T10:30:00Z',
    description: 'User requested export of all personal data'
  },
  {
    id: 'req-002',
    type: 'gdpr_deletion',
    userId: 'artist6',
    userName: 'David Park',
    email: 'david.park@email.com',
    requestedAt: '2024-01-18T14:15:00Z',
    status: 'completed',
    dueDate: '2024-01-26T14:15:00Z',
    description: 'User requested complete account deletion'
  },
  {
    id: 'req-003',
    type: 'data_inquiry',
    userId: 'host3',
    userName: 'Jennifer Kim',
    email: 'jennifer.kim@email.com',
    requestedAt: '2024-01-22T09:00:00Z',
    status: 'in_progress',
    dueDate: '2024-01-30T09:00:00Z',
    description: 'User inquiry about data processing and storage'
  }
];

const auditLogs = [
  {
    id: 'audit-001',
    action: 'user_created',
    adminUser: 'Sarah Admin',
    targetUser: 'alex.chen@email.com',
    timestamp: '2024-01-22T15:30:00Z',
    details: 'New artist account created and approved'
  },
  {
    id: 'audit-002',
    action: 'payment_status_changed',
    adminUser: 'John Support',
    targetUser: 'emma.rodriguez@email.com',
    timestamp: '2024-01-22T14:45:00Z',
    details: 'Payment status changed from failed to paid'
  },
  {
    id: 'audit-003',
    action: 'content_moderated',
    adminUser: 'Maria Support',
    targetUser: 'marcus.williams@email.com',
    timestamp: '2024-01-22T11:20:00Z',
    details: 'Photo rejected during content moderation'
  },
  {
    id: 'audit-004',
    action: 'user_suspended',
    adminUser: 'Lisa Manager',
    targetUser: 'david.park@email.com',
    timestamp: '2024-01-21T16:30:00Z',
    details: 'User account suspended due to policy violation'
  }
];

export default function SecurityPage() {
  const [incidents, setIncidents] = useState(securityIncidents);
  const [requests, setRequests] = useState(dataRequests);
  const [selectedIncident, setSelectedIncident] = useState<typeof securityIncidents[0] | null>(null);

  const handleIncidentAction = (incidentId: string, action: 'resolve' | 'escalate') => {
    setIncidents(prev => 
      prev.map(incident => 
        incident.id === incidentId ? { 
          ...incident, 
          status: action === 'resolve' ? 'resolved' : 'escalated'
        } : incident
      )
    );
    setSelectedIncident(null);
  };

  const handleDataRequest = (requestId: string, action: 'approve' | 'complete') => {
    setRequests(prev => 
      prev.map(request => 
        request.id === requestId ? { 
          ...request, 
          status: action === 'approve' ? 'in_progress' : 'completed'
        } : request
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'investigating':
        return <Badge variant="secondary" className="bg-secondary-100 text-secondary-800 border-secondary-200">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="secondary" className="bg-secondary-200 text-secondary-900 border-secondary-300">Resolved</Badge>;
      case 'escalated':
        return <Badge variant="secondary" className="bg-neutral-200 text-neutral-800 border-neutral-300">Escalated</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-primary-100 text-primary-800 border-primary-200">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-secondary-100 text-secondary-800 border-secondary-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-secondary-200 text-secondary-900 border-secondary-300">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="error">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-secondary-100 text-secondary-800 border-secondary-200">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-secondary-200 text-secondary-900 border-secondary-300">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
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
        </div>

        {/* Security Status Overview */}
        <Card className={`mb-8 border-l-4 ${getThreatLevelColor(securityMetrics.threatLevel)}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Security Status: {securityMetrics.threatLevel.charAt(0).toUpperCase() + securityMetrics.threatLevel.slice(1)} Risk
                  </h3>
                  <p className="text-sm text-gray-600">
                    Last security scan: {formatDate(securityMetrics.lastScan)} • {securityMetrics.activeIncidents} active incidents
                  </p>
                </div>
              </div>
              <Button variant="outline">
                Run Security Scan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-neutral-700">{securityMetrics.activeIncidents}</div>
              <div className="text-sm text-gray-600">Active Incidents</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-neutral-800">{securityMetrics.blockedIPs}</div>
              <div className="text-sm text-gray-600">Blocked IPs</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-secondary-600">{securityMetrics.failedLogins}</div>
              <div className="text-sm text-gray-600">Failed Logins (24h)</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary-600">{securityMetrics.dataRequests}</div>
              <div className="text-sm text-gray-600">Data Requests</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Security Incidents */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Security Incidents</h2>
              <p className="text-sm text-gray-600">Active threats and security events</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.filter(inc => inc.status !== 'resolved').map((incident) => (
                  <div key={incident.id} 
                       className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                         incident.severity === 'high' ? 'border-red-200 bg-red-50' :
                         incident.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                         'border-gray-200'
                       }`}
                       onClick={() => setSelectedIncident(incident)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {incident.type.replace(/_/g, ' ')}
                          </h3>
                          {getSeverityBadge(incident.severity)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{formatDate(incident.detectedAt)}</span>
                          <span>IP: {incident.ipAddress}</span>
                          {incident.userName && <span>User: {incident.userName}</span>}
                        </div>
                      </div>
                      <div>{getStatusBadge(incident.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {incidents.filter(inc => inc.status !== 'resolved').length === 0 && (
                <div className="text-center py-8">
                  <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-green-600 font-medium">No active security incidents</p>
                  <p className="text-sm text-gray-500">All threats resolved</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Compliance */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Data Compliance</h2>
              <p className="text-sm text-gray-600">GDPR and privacy requests</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.filter(req => req.status !== 'completed').map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {request.type.replace(/_/g, ' ')}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>User: {request.userName}</span>
                          <span>Due: {formatDate(request.dueDate)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleDataRequest(request.id, 'approve')}
                          >
                            Process
                          </Button>
                        )}
                        {request.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => handleDataRequest(request.id, 'complete')}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {requests.filter(req => req.status !== 'completed').length === 0 && (
                <div className="text-center py-8">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No pending requests</p>
                  <p className="text-sm text-gray-500">All compliance requests handled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
            <p className="text-sm text-gray-600">Recent administrative actions and system events</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary-100 rounded-full">
                      <KeyIcon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {log.action.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm text-gray-600">{log.details}</div>
                      <div className="text-xs text-gray-500">
                        Admin: {log.adminUser} • Target: {log.targetUser}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(log.timestamp)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">
                <EyeIcon className="w-4 h-4 mr-2" />
                View Full Audit Log
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Incident Detail Modal */}
        {selectedIncident && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 capitalize">
                      {selectedIncident.type.replace(/_/g, ' ')}
                    </h2>
                    <p className="text-gray-600">Incident #{selectedIncident.id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedIncident.status)}
                    {getSeverityBadge(selectedIncident.severity)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIncident(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Incident Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Incident Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900">{selectedIncident.description}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Detected At</label>
                        <p className="text-gray-900">{new Date(selectedIncident.detectedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">IP Address</label>
                        <p className="text-gray-900">{selectedIncident.ipAddress}</p>
                      </div>
                      {selectedIncident.userName && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Affected User</label>
                            <p className="text-gray-900">{selectedIncident.userName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Location</label>
                            <p className="text-gray-900">{selectedIncident.location}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Taken */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Actions Taken</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-900">{selectedIncident.action}</p>
                  </div>
                </div>

                {/* Response Actions */}
                {selectedIncident.status === 'investigating' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={() => handleIncidentAction(selectedIncident.id, 'resolve')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleIncidentAction(selectedIncident.id, 'escalate')}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                      Escalate
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