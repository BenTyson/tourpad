'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Plus,
  AlertTriangle,
  Edit,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// US States lookup
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
];

export default function TourPlannerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Tour segment state
  const [tourSegments, setTourSegments] = useState<Array<{
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
  }>>([]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTourSegment, setEditingTourSegment] = useState<string | null>(null);
  const [expandedTour, setExpandedTour] = useState<string | null>(null);

  // Form state for creating/editing tours
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planned',
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
  const [editingStateRangeId, setEditingStateRangeId] = useState<string | null>(null);

  // Fetch tour segments on mount
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/login');
      return;
    }

    // Check if user is an artist
    const userType = session.user.type || session.user.userType;
    if (userType !== 'artist') {
      router.push('/dashboard');
      return;
    }

    fetchTourSegments();
    setLoading(false);
  }, [session, status, router]);

  // Fetch tour segments
  const fetchTourSegments = async () => {
    try {
      const response = await fetch('/api/tour-segments');
      if (response.ok) {
        const segments = await response.json();
        setTourSegments(segments);
      }
    } catch (error) {
      console.error('Error fetching tour segments:', error);
    }
  };

  // Create tour segment
  const createTourSegment = async (segmentData: typeof formData) => {
    try {
      const response = await fetch('/api/tour-segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segmentData)
      });
      
      if (response.ok) {
        const newSegment = await response.json();
        setTourSegments(prev => [...prev, newSegment]);
        setShowCreateForm(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(`Error creating tour segment: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating tour segment:', error);
      alert('Error creating tour segment');
    }
  };

  // Update tour segment
  const updateTourSegment = async (segmentId: string, segmentData: typeof formData) => {
    try {
      const response = await fetch(`/api/tour-segments/${segmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segmentData)
      });
      
      if (response.ok) {
        const updatedSegment = await response.json();
        setTourSegments(prev => 
          prev.map(segment => 
            segment.id === segmentId ? updatedSegment : segment
          )
        );
        setEditingTourSegment(null);
        resetForm();
      } else {
        const error = await response.json();
        alert(`Error updating tour segment: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating tour segment:', error);
      alert('Error updating tour segment');
    }
  };

  // Delete tour segment
  const deleteTourSegment = async (segmentId: string) => {
    if (!confirm('Are you sure you want to delete this tour segment?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/tour-segments/${segmentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTourSegments(prev => prev.filter(segment => segment.id !== segmentId));
      } else {
        const error = await response.json();
        alert(`Error deleting tour segment: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting tour segment:', error);
      alert('Error deleting tour segment');
    }
  };

  // Form helpers
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
    setEditingStateRangeId(null);
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
        startDate: range.startDate,
        endDate: range.endDate,
        cities: range.cities,
        notes: range.notes
      }))
    };

    if (editingTourSegment) {
      updateTourSegment(editingTourSegment, segmentData);
    } else {
      createTourSegment(segmentData);
    }
  };

  const startEditingTour = (tourId: string) => {
    const tour = tourSegments.find(t => t.id === tourId);
    if (tour) {
      setFormData({
        name: tour.name,
        description: tour.description || '',
        status: tour.status,
        isPublic: tour.isPublic,
        stateRanges: tour.stateRanges.map(range => ({
          ...range,
          startDate: range.startDate.split('T')[0],
          endDate: range.endDate.split('T')[0]
        }))
      });
      setEditingTourSegment(tourId);
      setShowCreateForm(true);
    }
  };

  // State range management
  const addStateRange = () => {
    if (!newStateRange.state || !newStateRange.startDate || !newStateRange.endDate) {
      alert('Please fill in state, start date, and end date');
      return;
    }
    
    if (new Date(newStateRange.startDate) >= new Date(newStateRange.endDate)) {
      alert('End date must be after start date');
      return;
    }
    
    // Check if state already exists in this tour
    if (formData.stateRanges.some(range => range.state === newStateRange.state)) {
      alert('This state is already added to the tour');
      return;
    }
    
    const newRange = {
      id: Date.now().toString(),
      ...newStateRange
    };
    
    setFormData(prev => ({
      ...prev,
      stateRanges: [...prev.stateRanges, newRange]
    }));
    
    // Reset new state range form
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

  const addCityToNewRange = () => {
    const city = cityInput.trim();
    if (city && !newStateRange.cities.includes(city)) {
      setNewStateRange(prev => ({
        ...prev,
        cities: [...prev.cities, city]
      }));
      setCityInput('');
    }
  };

  const removeCityFromNewRange = (city: string) => {
    setNewStateRange(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c !== city)
    }));
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--color-french-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-neutral-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[var(--color-french-blue)]" />
              Tour Planner
            </h1>
            <div className="flex items-center">
              {!showCreateForm && !editingTourSegment && (
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-[var(--color-french-blue)] hover:bg-[var(--color-primary-700)]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Plan New Tour
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Create/Edit Form */}
        {(showCreateForm || editingTourSegment) && (
          <Card className="mb-8 bg-white shadow-lg border-primary-200">
            <CardHeader className="border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {editingTourSegment ? 'Edit Tour' : 'Plan New Tour'}
                  </h2>
                  <p className="text-neutral-600 text-sm mt-1">
                    {editingTourSegment ? 'Update your tour dates and locations' : 'Add states and dates to let hosts find you'}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTourSegment(null);
                    resetForm();
                  }}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
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
                      placeholder="Southwest Spring Tour 2025"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-3">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                      >
                        <option value="planned">Planned</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-3">
                        Visibility
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                        className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all ${
                          formData.isPublic 
                            ? 'bg-[var(--color-mist)] border-[var(--color-french-blue)]/30 text-[var(--color-french-blue)]' 
                            : 'bg-neutral-50 border-neutral-300 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          {formData.isPublic ? (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Public
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Private
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-3">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your tour..."
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm resize-none"
                  />
                </div>

                {/* State Tour Schedule */}
                <div>
                  <label className="block text-lg font-bold text-neutral-900 mb-4">
                    Tour Schedule by State *
                  </label>
                  <p className="text-neutral-600 text-sm mb-6">
                    Add each state you'll visit with specific dates. Hosts can discover you when you're in their area.
                  </p>
                  
                  {/* Add New State Range */}
                  <div className="border border-neutral-200 rounded-2xl p-6 mb-6 bg-gradient-to-br from-neutral-50 to-white shadow-sm">
                    <h3 className="text-md font-semibold text-neutral-900 mb-4 flex items-center">
                      <Plus className="w-4 h-4 mr-2 text-[var(--color-french-blue)]" />
                      Add State to Tour
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">State</label>
                        <select
                          value={newStateRange.state}
                          onChange={(e) => setNewStateRange(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                        >
                          <option value="">Choose state...</option>
                          {US_STATES.map((state) => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Arrival Date</label>
                        <input
                          type="date"
                          value={newStateRange.startDate}
                          onChange={(e) => setNewStateRange(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Departure Date</label>
                        <input
                          type="date"
                          value={newStateRange.endDate}
                          onChange={(e) => setNewStateRange(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Cities and Notes Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Cities (Optional)</label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            placeholder="Denver, Boulder..."
                            className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCityToNewRange())}
                          />
                          <Button type="button" onClick={addCityToNewRange} size="sm" className="px-4 py-3 rounded-xl">
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newStateRange.cities.map((city) => (
                            <Badge key={city} variant="secondary" className="px-3 py-1 rounded-full">
                              {city}
                              <button
                                type="button"
                                onClick={() => removeCityFromNewRange(city)}
                                className="ml-2 text-neutral-500 hover:text-neutral-700"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Notes (Optional)</label>
                        <textarea
                          value={newStateRange.notes}
                          onChange={(e) => setNewStateRange(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Looking for outdoor venues, acoustic preferred..."
                          rows={3}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm resize-none"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={addStateRange}
                      className="w-full py-3 px-6 bg-[var(--color-french-blue)] hover:bg-[var(--color-primary-700)] text-white rounded-xl font-medium transition-colors duration-200 shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add State to Tour
                    </Button>
                  </div>
                  
                  {/* Existing State Ranges */}
                  {formData.stateRanges.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          Planned States ({formData.stateRanges.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {formData.stateRanges.map((range) => {
                          const state = US_STATES.find(s => s.value === range.state);
                          return (
                            <div key={range.id} className="border rounded-2xl p-5 bg-white shadow-sm">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-lg font-semibold text-neutral-900">
                                  {state?.label || range.state}
                                </h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeStateRange(range.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center text-neutral-600">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {new Date(range.startDate).toLocaleDateString()} - {new Date(range.endDate).toLocaleDateString()}
                                </div>
                                
                                {range.cities.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {range.cities.map((city) => (
                                      <Badge key={city} variant="secondary" className="text-xs">
                                        {city}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                
                                {range.notes && (
                                  <p className="text-neutral-600 italic mt-2">
                                    {range.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-neutral-200">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingTourSegment(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-[var(--color-french-blue)] hover:bg-[var(--color-primary-700)]"
                  >
                    {editingTourSegment ? 'Update Tour' : 'Create Tour'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tour List */}
        {!showCreateForm && !editingTourSegment && (
          <>
            {tourSegments.length === 0 ? (
              <Card className="bg-white shadow-sm">
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-[var(--color-mist)] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-12 h-12 text-[var(--color-french-blue)]" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                      No Tours Planned Yet
                    </h2>
                    <p className="text-neutral-600 max-w-md mx-auto mb-8">
                      Start planning your tours to let hosts know when you'll be in their area. 
                      Hosts can discover and book you based on your tour schedule.
                    </p>
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="bg-[var(--color-french-blue)] hover:bg-[var(--color-primary-700)]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Plan Your First Tour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Your Tours ({tourSegments.length})
                  </h2>
                </div>
                
                {tourSegments.map((segment) => (
                  <Card key={segment.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader 
                      className="cursor-pointer"
                      onClick={() => setExpandedTour(expandedTour === segment.id ? null : segment.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-neutral-900">
                              {segment.name}
                            </h3>
                            <Badge 
                              variant={segment.status === 'confirmed' ? 'success' : segment.status === 'cancelled' ? 'error' : 'default'}
                            >
                              {segment.status}
                            </Badge>
                            <Badge variant={segment.isPublic ? 'secondary' : 'secondary'}>
                              {segment.isPublic ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Public
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Private
                                </>
                              )}
                            </Badge>
                          </div>
                          <p className="text-neutral-600">
                            {segment.stateRanges.length} state{segment.stateRanges.length !== 1 ? 's' : ''} • 
                            {' '}
                            {(() => {
                              const dates = segment.stateRanges.flatMap(r => [new Date(r.startDate), new Date(r.endDate)]);
                              const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
                              const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
                              return `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;
                            })()}
                          </p>
                          {segment.description && (
                            <p className="text-sm text-neutral-500 mt-2">{segment.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingTour(segment.id);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTourSegment(segment.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <div className="ml-2">
                            {expandedTour === segment.id ? (
                              <ChevronUp className="w-5 h-5 text-neutral-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedTour === segment.id && (
                      <CardContent className="border-t border-neutral-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                          {segment.stateRanges.map((range) => {
                            const state = US_STATES.find(s => s.value === range.state);
                            return (
                              <div key={range.id} className="bg-neutral-50 rounded-lg p-4">
                                <h4 className="font-semibold text-neutral-900 mb-2">
                                  {state?.label || range.state}
                                </h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center text-neutral-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(range.startDate).toLocaleDateString()} - {new Date(range.endDate).toLocaleDateString()}
                                  </div>
                                  {range.cities.length > 0 && (
                                    <div className="flex items-start">
                                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-neutral-400" />
                                      <div className="flex flex-wrap gap-1">
                                        {range.cities.map((city) => (
                                          <Badge key={city} variant="secondary" className="text-xs">
                                            {city}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {range.notes && (
                                    <p className="text-neutral-500 italic mt-2 text-xs">
                                      {range.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}