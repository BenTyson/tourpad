'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  FlagIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  TagIcon
} from '@heroicons/react/24/outline';

// Mock support tickets data
const mockTickets = [
  {
    id: 'ticket-001',
    title: 'Unable to upload venue photos',
    description: 'I keep getting an error when trying to upload photos of my venue. The upload fails after a few seconds.',
    userId: 'host1',
    userName: 'Mike Chen',
    userType: 'host',
    email: 'mike.chen@email.com',
    priority: 'medium',
    status: 'open',
    category: 'technical',
    createdAt: '2024-01-22T10:30:00Z',
    lastUpdated: '2024-01-22T14:15:00Z',
    assignedTo: 'Sarah Admin',
    tags: ['upload', 'photos', 'venue'],
    responses: 3
  },
  {
    id: 'ticket-002',
    title: 'Payment failed for annual membership',
    description: 'My credit card was charged but the payment shows as failed in my dashboard. Can you please check?',
    userId: 'artist2',
    userName: 'Emma Rodriguez',
    userType: 'artist',
    email: 'emma.rodriguez@email.com',
    priority: 'high',
    status: 'in_progress',
    category: 'billing',
    createdAt: '2024-01-21T16:45:00Z',
    lastUpdated: '2024-01-22T09:30:00Z',
    assignedTo: 'John Support',
    tags: ['payment', 'billing', 'membership'],
    responses: 5
  },
  {
    id: 'ticket-003',
    title: 'Host cancelled last minute - need refund',
    description: 'My show was cancelled by the host 2 hours before the event. This caused major issues. I need help resolving this.',
    userId: 'artist3',
    userName: 'Marcus Williams',
    userType: 'artist',
    email: 'marcus.williams@email.com',
    priority: 'urgent',
    status: 'escalated',
    category: 'booking_dispute',
    createdAt: '2024-01-21T14:20:00Z',
    lastUpdated: '2024-01-22T11:45:00Z',
    assignedTo: 'Lisa Manager',
    tags: ['cancellation', 'dispute', 'urgent'],
    responses: 8
  },
  {
    id: 'ticket-004',
    title: 'How to improve my profile visibility?',
    description: 'I\'m not getting many booking requests. Can you provide tips on how to make my artist profile more attractive?',
    userId: 'artist4',
    userName: 'Alex Chen',
    userType: 'artist',
    email: 'alex.chen@email.com',
    priority: 'low',
    status: 'resolved',
    category: 'general',
    createdAt: '2024-01-20T11:00:00Z',
    lastUpdated: '2024-01-21T15:30:00Z',
    assignedTo: 'Maria Support',
    tags: ['profile', 'marketing', 'tips'],
    responses: 2
  },
  {
    id: 'ticket-005',
    title: 'Cannot access my dashboard',
    description: 'I keep getting a 404 error when trying to access my host dashboard. This started yesterday.',
    userId: 'host2',
    userName: 'Lisa Thompson',
    userType: 'host',
    email: 'lisa.thompson@email.com',
    priority: 'high',
    status: 'open',
    category: 'technical',
    createdAt: '2024-01-22T08:15:00Z',
    lastUpdated: '2024-01-22T08:15:00Z',
    assignedTo: null,
    tags: ['dashboard', 'access', '404'],
    responses: 0
  }
];

// Mock announcements
const announcements = [
  {
    id: 'ann-001',
    title: 'Platform Maintenance Scheduled',
    content: 'We will be performing routine maintenance on Sunday, January 28th from 2-4 AM EST. The platform may be temporarily unavailable.',
    type: 'maintenance',
    targetAudience: 'all',
    createdAt: '2024-01-22T12:00:00Z',
    scheduledFor: '2024-01-28T02:00:00Z',
    status: 'draft'
  },
  {
    id: 'ann-002',
    title: 'New Feature: Enhanced Search Filters',
    content: 'We\'ve added new search filters to help you find the perfect artists and venues. Check out the updated search page!',
    type: 'feature',
    targetAudience: 'all',
    createdAt: '2024-01-20T15:30:00Z',
    scheduledFor: null,
    status: 'published'
  }
];

export default function SupportPage() {
  const [tickets, setTickets] = useState(mockTickets);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'escalated' | 'resolved'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { 
          ...ticket, 
          status: newStatus,
          lastUpdated: new Date().toISOString(),
          assignedTo: newStatus === 'resolved' ? ticket.assignedTo : 'Current Admin'
        } : ticket
      )
    );
    setSelectedTicket(null);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Open</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      case 'escalated':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Escalated</Badge>;
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="error">Urgent</Badge>;
      case 'high':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      case 'billing':
        return <DocumentTextIcon className="w-5 h-5 text-green-600" />;
      case 'booking_dispute':
        return <FlagIcon className="w-5 h-5 text-orange-600" />;
      case 'general':
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSupportStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const escalated = tickets.filter(t => t.status === 'escalated').length;
    const urgent = tickets.filter(t => t.priority === 'urgent').length;
    const unassigned = tickets.filter(t => !t.assignedTo && t.status !== 'resolved').length;
    return { total, open, inProgress, escalated, urgent, unassigned };
  };

  const stats = getSupportStats();

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">Manage support tickets and user communications</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Tickets</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.open}</div>
              <div className="text-sm text-gray-600">Open</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.escalated}</div>
              <div className="text-sm text-gray-600">Escalated</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.urgent}</div>
              <div className="text-sm text-gray-600">Urgent</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.unassigned}</div>
              <div className="text-sm text-gray-600">Unassigned</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Announcements */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Platform Announcements</h2>
              <p className="text-sm text-gray-600">Broadcast messages to users</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                    <Badge variant={announcement.status === 'published' ? 'success' : 'secondary'}>
                      {announcement.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{announcement.type}</span>
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <SpeakerWaveIcon className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-3" />
                Send Email Campaign
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DocumentTextIcon className="w-4 h-4 mr-3" />
                Export Support Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FlagIcon className="w-4 h-4 mr-3" />
                Escalate to Manager
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <UserIcon className="w-4 h-4 mr-3" />
                Assign Bulk Tickets
              </Button>
            </CardContent>
          </Card>

          {/* Response Templates */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Response Templates</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-left">
                <div>
                  <div className="font-medium">Payment Issue</div>
                  <div className="text-xs text-gray-500">Standard payment troubleshooting</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                <div>
                  <div className="font-medium">Technical Support</div>
                  <div className="text-xs text-gray-500">General technical assistance</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                <div>
                  <div className="font-medium">Booking Dispute</div>
                  <div className="text-xs text-gray-500">Mediation and resolution</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full">
                Manage Templates
              </Button>
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
                    placeholder="Search tickets by title, user, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex space-x-1 bg-secondary-100 p-1 rounded-lg">
                {['all', 'open', 'in_progress', 'escalated', 'resolved'].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => setStatusFilter(statusOption as typeof statusFilter)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      statusFilter === statusOption
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-secondary-700 hover:text-secondary-900'
                    }`}
                  >
                    {statusOption === 'in_progress' ? 'In Progress' : 
                     statusOption === 'all' ? 'All' : statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </button>
                ))}
              </div>

              {/* Priority Filter */}
              <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
                {['all', 'urgent', 'high', 'medium', 'low'].map((priorityOption) => (
                  <button
                    key={priorityOption}
                    onClick={() => setPriorityFilter(priorityOption as typeof priorityFilter)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                      priorityFilter === priorityOption
                        ? 'bg-white text-neutral-700 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {priorityOption}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
            <p className="text-sm text-gray-600">Manage user support requests and issues</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} 
                     className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                       ticket.priority === 'urgent' ? 'border-red-200 bg-red-50' :
                       ticket.status === 'escalated' ? 'border-orange-200 bg-orange-50' :
                       'border-gray-200 hover:border-gray-300'
                     }`}
                     onClick={() => setSelectedTicket(ticket)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 rounded-full bg-blue-100">
                        {getCategoryIcon(ticket.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">{ticket.title}</h3>
                          {ticket.priority === 'urgent' && (
                            <Badge variant="error">URGENT</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1" />
                            {ticket.userName} ({ticket.userType})
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {formatDate(ticket.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                            {ticket.responses} responses
                          </div>
                          {ticket.assignedTo && (
                            <div>Assigned to: {ticket.assignedTo}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                  
                  {ticket.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {ticket.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          <TagIcon className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-600">No support tickets match your current filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedTicket.title}</h2>
                    <p className="text-gray-600">Ticket #{selectedTicket.id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTicket(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* User Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">User Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900">{selectedTicket.userName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-gray-900 capitalize">{selectedTicket.userType}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedTicket.email}</p>
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Ticket Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900 mt-1">{selectedTicket.description}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <p className="text-gray-900 capitalize">{selectedTicket.category.replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Created</label>
                        <p className="text-gray-900">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Last Updated</label>
                        <p className="text-gray-900">{new Date(selectedTicket.lastUpdated).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Assigned To</label>
                        <p className="text-gray-900">{selectedTicket.assignedTo || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selectedTicket.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTicket.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          <TagIcon className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  {selectedTicket.status === 'open' && (
                    <Button
                      onClick={() => handleStatusChange(selectedTicket.id, 'in_progress')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Start Working
                    </Button>
                  )}
                  
                  {selectedTicket.status === 'in_progress' && (
                    <Button
                      onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </Button>
                  )}
                  
                  {selectedTicket.status !== 'escalated' && selectedTicket.status !== 'resolved' && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedTicket.id, 'escalated')}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                      Escalate
                    </Button>
                  )}
                  
                  <Button variant="outline" className="flex-1">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    Reply
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