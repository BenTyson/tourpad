'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface TourSegment {
  id: string;
  name: string;
  description: string;
  status: string;
  isPublic: boolean;
  stateRanges: Array<{
    id: string;
    state: string;
    startDate: string;
    endDate: string;
    cities: string[];
    notes: string;
  }>;
}

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }
];

export default function ToursPage() {
  const { data: session, status } = useSession();
  const [tourSegments, setTourSegments] = useState<TourSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTourSegment, setEditingTourSegment] = useState<string | null>(null);

  // Tour form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planned' as 'planned' | 'active' | 'completed',
    isPublic: true,
    stateRanges: [] as Array<{
      id: string;
      state: string;
      startDate: string;
      endDate: string;
      cities: string[];
      notes: string;
    }>
  });

  // New state range form
  const [newStateRange, setNewStateRange] = useState({
    state: '',
    startDate: '',
    endDate: '',
    cities: [] as string[],
    notes: ''
  });
  const [cityInput, setCityInput] = useState('');

  // Load tour segments
  useEffect(() => {
    if (session?.user?.id) {
      fetchTourSegments();
    }
  }, [session]);

  const fetchTourSegments = async () => {
    try {
      const response = await fetch('/api/tour-segments');
      if (response.ok) {
        const data = await response.json();
        setTourSegments(data.tourSegments || []);
      }
    } catch (error) {
      console.error('Error fetching tour segments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTourSegment = async (segmentData: any) => {
    try {
      const response = await fetch('/api/tour-segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segmentData)
      });

      if (response.ok) {
        await fetchTourSegments();
        resetForm();
        setShowCreateModal(false);
      } else {
        alert('Failed to create tour segment');
      }
    } catch (error) {
      console.error('Error creating tour segment:', error);
      alert('Error creating tour segment');
    }
  };

  const deleteTourSegment = async (segmentId: string) => {
    if (!confirm('Are you sure you want to delete this tour segment?')) return;

    try {
      const response = await fetch(`/api/tour-segments?id=${segmentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchTourSegments();
      } else {
        alert('Failed to delete tour segment');
      }
    } catch (error) {
      console.error('Error deleting tour segment:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planned',
      isPublic: true,
      stateRanges: []
    });
    setNewStateRange({
      state: '',
      startDate: '',
      endDate: '',
      cities: [],
      notes: ''
    });
    setCityInput('');
    setEditingTourSegment(null);
  };

  const addStateRange = () => {
    if (!newStateRange.state || !newStateRange.startDate || !newStateRange.endDate) {
      alert('Please fill in state and date fields');
      return;
    }

    if (new Date(newStateRange.endDate) <= new Date(newStateRange.startDate)) {
      alert('End date must be after start date');
      return;
    }

    const newRange = {
      id: Date.now().toString(),
      state: newStateRange.state,
      startDate: newStateRange.startDate,
      endDate: newStateRange.endDate,
      cities: newStateRange.cities,
      notes: newStateRange.notes
    };

    setFormData(prev => ({ 
      ...prev, 
      stateRanges: [...prev.stateRanges, newRange] 
    }));

    // Reset state range form
    setNewStateRange({
      state: '',
      startDate: '',
      endDate: '',
      cities: [],
      notes: ''
    });
    setCityInput('');
  };

  const removeStateRange = (rangeId: string) => {
    setFormData(prev => ({
      ...prev,
      stateRanges: prev.stateRanges.filter(range => range.id !== rangeId)
    }));
  };

  const addCity = () => {
    if (cityInput.trim() && !newStateRange.cities.includes(cityInput.trim())) {
      setNewStateRange(prev => ({
        ...prev,
        cities: [...prev.cities, cityInput.trim()]
      }));
      setCityInput('');
    }
  };

  const removeCity = (city: string) => {
    setNewStateRange(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c !== city)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.stateRanges.length === 0) {
      alert('Please provide a tour name and add at least one state with dates');
      return;
    }

    const segmentData = {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      isPublic: formData.isPublic,
      stateRanges: formData.stateRanges.map(range => ({
        state: range.state,
        startDate: range.startDate + 'T00:00:00.000Z',
        endDate: range.endDate + 'T23:59:59.999Z',
        cities: range.cities,
        notes: range.notes
      }))
    };

    createTourSegment(segmentData);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading tour planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Tour Planner</h1>
              <p className="text-neutral-600 mt-1">Plan and manage your touring schedule</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Plan New Tour
          </Button>
        </div>

        {/* Tour Segments List */}
        {tourSegments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Tours Planned Yet</h3>
              <p className="text-neutral-600 mb-6">
                Start planning your next tour by creating tour segments for different regions and dates.
              </p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Plan Your First Tour
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tourSegments.map((segment) => (
              <Card key={segment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-1">{segment.name}</h3>
                      {segment.description && (
                        <p className="text-neutral-600 mb-3">{segment.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant={segment.status === 'active' ? 'default' : 'secondary'}>
                          {segment.status.charAt(0).toUpperCase() + segment.status.slice(1)}
                        </Badge>
                        <Badge variant={segment.isPublic ? 'default' : 'secondary'}>
                          {segment.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteTourSegment(segment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* State Ranges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {segment.stateRanges.map((range) => (
                      <div key={range.id} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="font-medium">
                            {US_STATES.find(s => s.value === range.state)?.label || range.state}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-neutral-600 mb-2">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(range.startDate).toLocaleDateString()} - {new Date(range.endDate).toLocaleDateString()}
                          </div>
                        </div>

                        {range.cities && range.cities.length > 0 && (
                          <div className="text-sm text-neutral-600 mb-2">
                            <div className="flex items-start">
                              <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                              <span>{range.cities.join(', ')}</span>
                            </div>
                          </div>
                        )}

                        {range.notes && (
                          <p className="text-xs text-neutral-500 italic">{range.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Tour Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Plan New Tour</h2>
                    <p className="text-neutral-600 mt-1">Create a tour segment with multiple states and dates</p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    variant="outline"
                    size="sm"
                    className="p-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Tour Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-3">
                        Tour Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 bg-white"
                        placeholder="e.g., Spring 2025 Tour"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-3">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 bg-white"
                      >
                        <option value="planned">Planned</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-3">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 bg-white resize-none"
                      rows={3}
                      placeholder="Brief description of this tour segment..."
                    />
                  </div>

                  {/* Add State Range Section */}
                  <div className="border-t border-neutral-100 pt-8">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-6">Add States & Dates</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">State *</label>
                        <select
                          value={newStateRange.state}
                          onChange={(e) => setNewStateRange(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select State</option>
                          {US_STATES.map(state => (
                            <option key={state.value} value={state.value}>{state.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Start Date *</label>
                        <input
                          type="date"
                          value={newStateRange.startDate}
                          onChange={(e) => setNewStateRange(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">End Date *</label>
                        <input
                          type="date"
                          value={newStateRange.endDate}
                          onChange={(e) => setNewStateRange(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Cities */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Cities (Optional)</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={cityInput}
                          onChange={(e) => setCityInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
                          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter city name"
                        />
                        <Button type="button" onClick={addCity} variant="outline">
                          Add
                        </Button>
                      </div>
                      {newStateRange.cities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {newStateRange.cities.map((city) => (
                            <Badge key={city} variant="secondary" className="flex items-center gap-1">
                              {city}
                              <button
                                type="button"
                                onClick={() => removeCity(city)}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Notes</label>
                      <textarea
                        value={newStateRange.notes}
                        onChange={(e) => setNewStateRange(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        rows={2}
                        placeholder="Any special notes for this state/dates..."
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={addStateRange}
                      className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors duration-200 shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add State to Tour
                    </Button>
                  </div>

                  {/* Added State Ranges */}
                  {formData.stateRanges.length > 0 && (
                    <div className="border-t border-neutral-100 pt-8">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-6">
                        Planned States ({formData.stateRanges.length})
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {formData.stateRanges.map((range) => (
                          <div key={range.id} className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Badge variant="primary" className="px-3 py-1 rounded-full font-medium">
                                  {US_STATES.find(s => s.value === range.state)?.label || range.state}
                                </Badge>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeStateRange(range.id)}
                                className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <div className="mb-3">
                              <div className="text-sm font-medium text-neutral-900 mb-1">Tour Dates</div>
                              <div className="text-sm text-neutral-600">
                                {new Date(range.startDate).toLocaleDateString()} - {new Date(range.endDate).toLocaleDateString()}
                              </div>
                            </div>

                            {range.cities && range.cities.length > 0 && (
                              <div className="mb-3">
                                <div className="text-sm font-medium text-neutral-900 mb-1">Cities</div>
                                <div className="flex flex-wrap gap-1">
                                  {range.cities.map((city) => (
                                    <Badge key={city} variant="outline" className="text-xs">
                                      {city}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {range.notes && (
                              <div>
                                <div className="text-sm font-medium text-neutral-900 mb-1">Notes</div>
                                <p className="text-sm text-neutral-600">{range.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-neutral-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                      className="flex-1 py-3 px-6 rounded-xl font-medium border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-sm transition-colors duration-200"
                    >
                      Create Tour
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}