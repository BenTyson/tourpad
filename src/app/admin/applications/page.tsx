'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  CheckIcon, 
  XMarkIcon, 
  UserIcon, 
  HomeIcon, 
  MusicalNoteIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

// Mock data for applications
const mockApplications = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'Austin, TX',
    type: 'artist',
    genre: 'Folk/Indie',
    experience: 'I\'ve been performing for 8 years, touring across Texas and surrounding states. My music combines traditional folk with modern indie elements.',
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z',
    reviewedBy: null,
    notes: ''
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '(555) 987-6543',
    location: 'Portland, OR',
    type: 'host',
    venueDescription: 'Beautiful backyard space with covered patio, can accommodate 30-40 people. Full sound system available, parking for 15 cars.',
    status: 'pending',
    submittedAt: '2024-01-14T15:45:00Z',
    reviewedBy: null,
    notes: ''
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@email.com',
    phone: '(555) 555-0123',
    location: 'Nashville, TN',
    type: 'artist',
    genre: 'Country/Americana',
    experience: 'Nashville-based singer-songwriter with 5 years of touring experience. Released 2 EPs and regularly perform at venues across the Southeast.',
    status: 'approved',
    submittedAt: '2024-01-13T09:15:00Z',
    reviewedBy: 'Admin User',
    notes: 'Strong portfolio and experience. Approved for platform access.'
  },
  {
    id: 4,
    name: 'David Park',
    email: 'david.park@email.com',
    phone: '(555) 444-5678',
    location: 'Seattle, WA',
    type: 'artist',
    genre: 'Electronic/Ambient',
    experience: 'Experimental electronic musician with 3 years experience. Limited live performance background.',
    status: 'rejected',
    submittedAt: '2024-01-12T14:20:00Z',
    reviewedBy: 'Admin User',
    notes: 'Insufficient live performance experience for our current criteria.'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '(555) 333-2222',
    location: 'Denver, CO',
    type: 'host',
    venueDescription: 'Cozy living room setup for 15-20 people. Recently renovated with good acoustics. Limited parking but public transit accessible.',
    status: 'pending',
    submittedAt: '2024-01-11T11:00:00Z',
    reviewedBy: null,
    notes: ''
  }
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState(mockApplications);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'artist' | 'host'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<typeof mockApplications[0] | null>(null);

  const handleApprove = (id: number, notes: string = '') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { 
          ...app, 
          status: 'approved',
          reviewedBy: 'Current Admin',
          notes: notes || 'Application approved'
        } : app
      )
    );
    setSelectedApplication(null);
  };

  const handleReject = (id: number, notes: string = '') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { 
          ...app, 
          status: 'rejected',
          reviewedBy: 'Current Admin',
          notes: notes || 'Application rejected'
        } : app
      )
    );
    setSelectedApplication(null);
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filter === 'all' || app.status === filter;
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-secondary-100 text-secondary-800 border-secondary-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-secondary-200 text-secondary-900 border-secondary-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-neutral-200 text-neutral-800 border-neutral-300">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    return { total, pending, approved, rejected };
  };

  const stats = getApplicationStats();

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

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
              <div className="text-sm text-neutral-600">Total Applications</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary-600">{stats.pending}</div>
              <div className="text-sm text-neutral-600">Pending Review</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary-700">{stats.approved}</div>
              <div className="text-sm text-neutral-600">Approved</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-neutral-700">{stats.rejected}</div>
              <div className="text-sm text-neutral-600">Rejected</div>
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
                    placeholder="Search by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex space-x-1 bg-secondary-100 p-1 rounded-lg">
                {['all', 'pending', 'approved', 'rejected'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption as typeof filter)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                      filter === filterOption
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-secondary-700 hover:text-secondary-900'
                    }`}
                  >
                    {filterOption}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
                {['all', 'artist', 'host'].map((typeOption) => (
                  <button
                    key={typeOption}
                    onClick={() => setTypeFilter(typeOption as typeof typeFilter)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                      typeFilter === typeOption
                        ? 'bg-white text-neutral-700 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {typeOption}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedApplication(application)}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      application.type === 'artist' 
                        ? 'bg-primary-100 text-primary-600' 
                        : 'bg-secondary-100 text-secondary-600'
                    }`}>
                      {application.type === 'artist' ? (
                        <MusicalNoteIcon className="w-5 h-5" />
                      ) : (
                        <HomeIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{application.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{application.type}</p>
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    {application.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {application.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600">
                    📍 {application.location}
                  </div>
                </div>

                {application.type === 'artist' && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Genre:</span>
                    <span className="ml-2">{application.genre}</span>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              No applications match your current filters
            </p>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full ${
                      selectedApplication.type === 'artist' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {selectedApplication.type === 'artist' ? (
                        <MusicalNoteIcon className="w-6 h-6" />
                      ) : (
                        <HomeIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedApplication.name}</h2>
                      <p className="text-gray-600 capitalize">{selectedApplication.type} Application</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedApplication.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplication(null)}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedApplication.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900">{selectedApplication.location}</p>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Application Details</h3>
                  {selectedApplication.type === 'artist' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Genre</label>
                        <p className="text-gray-900">{selectedApplication.genre}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Experience</label>
                        <p className="text-gray-900 leading-relaxed">{selectedApplication.experience}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Venue Description</label>
                      <p className="text-gray-900 leading-relaxed">{selectedApplication.venueDescription}</p>
                    </div>
                  )}
                </div>

                {/* Review Information */}
                {selectedApplication.reviewedBy && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Review Information</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Reviewed By</label>
                        <p className="text-gray-900">{selectedApplication.reviewedBy}</p>
                      </div>
                      {selectedApplication.notes && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Notes</label>
                          <p className="text-gray-900">{selectedApplication.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedApplication.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(selectedApplication.id, 'Application approved via admin review')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedApplication.id, 'Application does not meet current criteria')}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Reject Application
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