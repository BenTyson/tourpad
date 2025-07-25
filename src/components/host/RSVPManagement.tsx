'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  User, 
  Users, 
  Calendar, 
  Clock, 
  Mail, 
  MessageSquare,
  Check,
  X,
  Clock3,
  MapPin,
  Music,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface RSVP {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'WAITLISTED';
  guestsCount: number;
  specialRequests?: string;
  rsvpDate: string;
  statusUpdatedAt: string;
  fan: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
  concert: {
    id: string;
    title?: string;
    date: string;
    startTime: string;
    maxCapacity: number;
    artist: {
      id: string;
      name: string;
      stageName?: string;
      profileImageUrl?: string;
    };
    host: {
      id: string;
      name: string;
      venueName?: string;
      city: string;
      state: string;
    };
  };
}

interface RSVPStats {
  pending: number;
  approved: number;
  declined: number;
  total: number;
  totalGuests: number;
  availableSpaces: number;
}

export default function RSVPManagement() {
  const { data: session } = useSession();
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [stats, setStats] = useState<RSVPStats>({
    pending: 0,
    approved: 0,
    declined: 0,
    total: 0,
    totalGuests: 0,
    availableSpaces: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('pending');
  const [processingRSVP, setProcessingRSVP] = useState<string | null>(null);
  const [selectedRSVP, setSelectedRSVP] = useState<RSVP | null>(null);
  const [hostResponse, setHostResponse] = useState('');

  useEffect(() => {
    if (session?.user?.type === 'host') {
      fetchRSVPs();
    }
  }, [session, activeFilter]);

  const fetchRSVPs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        userType: 'host',
        limit: '50'
      });
      
      if (activeFilter !== 'all') {
        params.append('status', activeFilter.toUpperCase());
      }

      const response = await fetch(`/api/rsvps?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRSVPs(data.rsvps || []);
        calculateStats(data.rsvps || []);
      } else {
        throw new Error(data.error || 'Failed to fetch RSVPs');
      }
    } catch (err) {
      console.error('Error fetching RSVPs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load RSVPs');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (rsvpList: RSVP[]) => {
    const stats = rsvpList.reduce((acc, rsvp) => {
      acc.total++;
      acc.totalGuests += rsvp.guestsCount;
      
      switch (rsvp.status) {
        case 'PENDING':
          acc.pending++;
          break;
        case 'APPROVED':
          acc.approved++;
          break;
        case 'DECLINED':
          acc.declined++;
          break;
      }
      
      return acc;
    }, {
      pending: 0,
      approved: 0,
      declined: 0,
      total: 0,
      totalGuests: 0,
      availableSpaces: 0
    });

    // Calculate available spaces (assuming max capacity from first concert)
    if (rsvpList.length > 0) {
      const maxCapacity = rsvpList[0].concert.maxCapacity;
      const approvedGuests = rsvpList
        .filter(rsvp => rsvp.status === 'APPROVED')
        .reduce((sum, rsvp) => sum + rsvp.guestsCount, 0);
      stats.availableSpaces = maxCapacity - approvedGuests;
    }

    setStats(stats);
  };

  const handleRSVPAction = async (rsvpId: string, action: 'APPROVED' | 'DECLINED' | 'WAITLISTED', response?: string) => {
    try {
      setProcessingRSVP(rsvpId);
      setError(null);

      const requestBody: any = { status: action };
      if (response?.trim()) {
        requestBody.hostResponse = response.trim();
      }

      const apiResponse = await fetch(`/api/rsvps/${rsvpId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to update RSVP');
      }

      const data = await apiResponse.json();
      
      if (data.success) {
        // Refresh the RSVP list
        await fetchRSVPs();
        setSelectedRSVP(null);
        setHostResponse('');
      } else {
        throw new Error(data.error || 'Failed to update RSVP');
      }
    } catch (err) {
      console.error('Error updating RSVP:', err);
      setError(err instanceof Error ? err.message : 'Failed to update RSVP');
    } finally {
      setProcessingRSVP(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'DECLINED': return 'bg-red-100 text-red-800';
      case 'WAITLISTED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRSVPs = activeFilter === 'all' 
    ? rsvps 
    : rsvps.filter(rsvp => rsvp.status.toLowerCase() === activeFilter);

  if (loading && rsvps.length === 0) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-neutral-200 rounded-lg h-20"></div>
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-neutral-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">RSVP Management</h2>
        <p className="text-neutral-600 mt-1">Review and manage fan requests for your concerts</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock3 className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Guests</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalGuests}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Available Spaces</p>
                <p className="text-2xl font-bold text-neutral-700">{stats.availableSpaces}</p>
              </div>
              <MapPin className="w-8 h-8 text-neutral-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'pending', label: 'Pending', count: stats.pending },
            { key: 'approved', label: 'Approved', count: stats.approved },
            { key: 'declined', label: 'Declined', count: stats.declined },
            { key: 'all', label: 'All', count: stats.total }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeFilter === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RSVP List */}
      {filteredRSVPs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              {activeFilter === 'pending' ? 'No Pending RSVPs' : 
               activeFilter === 'approved' ? 'No Approved RSVPs' :
               activeFilter === 'declined' ? 'No Declined RSVPs' :
               'No RSVPs Yet'}
            </h3>
            <p className="text-neutral-600">
              {activeFilter === 'pending' 
                ? 'New RSVP requests will appear here for your review.'
                : 'RSVP requests will appear here as they come in.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRSVPs.map((rsvp) => (
            <Card key={rsvp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Fan Avatar */}
                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {rsvp.fan.profileImageUrl ? (
                        <img 
                          src={rsvp.fan.profileImageUrl} 
                          alt={rsvp.fan.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>

                    {/* RSVP Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-neutral-900">{rsvp.fan.name}</h3>
                          <p className="text-sm text-neutral-600">{rsvp.fan.email}</p>
                        </div>
                        <Badge className={getStatusColor(rsvp.status)}>
                          {rsvp.status}
                        </Badge>
                      </div>

                      {/* Concert Info */}
                      <div className="text-sm text-neutral-600 mb-3">
                        <div className="flex items-center mb-1">
                          <Music className="w-4 h-4 mr-2" />
                          <span className="font-medium">
                            {rsvp.concert.title || `${rsvp.concert.artist.stageName || rsvp.concert.artist.name} Concert`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(rsvp.concert.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(rsvp.concert.startTime)}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {rsvp.guestsCount} {rsvp.guestsCount === 1 ? 'guest' : 'guests'}
                          </div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {rsvp.specialRequests && (
                        <div className="mb-3 p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-neutral-700 mb-1">Special Requests:</p>
                              <p className="text-sm text-neutral-600">{rsvp.specialRequests}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Request Date */}
                      <p className="text-xs text-neutral-500">
                        Requested {formatDate(rsvp.rsvpDate)} at {formatTime(rsvp.rsvpDate)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {rsvp.status === 'PENDING' && (
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleRSVPAction(rsvp.id, 'APPROVED')}
                        disabled={processingRSVP === rsvp.id || stats.availableSpaces < rsvp.guestsCount}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRSVP(rsvp)}
                        disabled={processingRSVP === rsvp.id}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                      {stats.availableSpaces < rsvp.guestsCount && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRSVPAction(rsvp.id, 'WAITLISTED')}
                          disabled={processingRSVP === rsvp.id}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          Waitlist
                        </Button>
                      )}
                    </div>
                  )}

                  {rsvp.status !== 'PENDING' && (
                    <div className="ml-4 text-xs text-neutral-500">
                      Updated {formatDate(rsvp.statusUpdatedAt)}
                    </div>
                  )}
                </div>

                {/* Capacity Warning */}
                {rsvp.status === 'PENDING' && stats.availableSpaces < rsvp.guestsCount && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">
                        Not enough space to approve this request ({rsvp.guestsCount} guests needed, {stats.availableSpaces} available)
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Decline/Response Modal */}
      {selectedRSVP && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Decline RSVP Request
              </h3>
              <p className="text-neutral-600 mb-4">
                You're about to decline <strong>{selectedRSVP.fan.name}'s</strong> RSVP request for {selectedRSVP.guestsCount} guests.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Message to Guest (Optional)
                </label>
                <textarea
                  value={hostResponse}
                  onChange={(e) => setHostResponse(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Let them know why you can't accommodate their request..."
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {hostResponse.length}/500 characters
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setSelectedRSVP(null)}
                  variant="outline"
                  className="flex-1"
                  disabled={processingRSVP === selectedRSVP.id}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleRSVPAction(selectedRSVP.id, 'DECLINED', hostResponse)}
                  disabled={processingRSVP === selectedRSVP.id}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {processingRSVP === selectedRSVP.id ? 'Processing...' : 'Decline RSVP'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}