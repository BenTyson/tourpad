// Refactored Tour Planner Page - Componentized Version
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/Loading';
import { useTourSegments } from '@/components/tour-planner/hooks/useTourSegments';
import { useTourForm } from '@/components/tour-planner/hooks/useTourForm';
import { TourPlannerHeader } from '@/components/tour-planner/TourPlannerHeader';
import { TourForm } from '@/components/tour-planner/forms/TourForm';
import { TourSegmentList } from '@/components/tour-planner/display/TourSegmentList';

export default function TourPlannerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Custom hooks for data and form management
  const { tourSegments, loading, createTourSegment, updateTourSegment, deleteTourSegment, fetchTourSegments } = useTourSegments();
  const {
    formData,
    setFormData,
    newStateRange,
    setNewStateRange,
    cityInput,
    setCityInput,
    editingTourSegment,
    setEditingTourSegment,
    resetForm,
    loadTourForEditing,
    addStateRange,
    removeStateRange,
    addCityToNewRange,
    removeCityFromNewRange,
    validateForm
  } = useTourForm();

  // Initialize data on mount
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
  }, [session, status, router, fetchTourSegments]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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

    try {
      if (editingTourSegment) {
        await updateTourSegment(editingTourSegment, segmentData);
      } else {
        await createTourSegment(segmentData);
      }
      handleCloseForm();
    } catch (error) {
      alert(`Error ${editingTourSegment ? 'updating' : 'creating'} tour segment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle form close/cancel
  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingTourSegment(null);
    resetForm();
  };

  // Handle creating new tour
  const handleCreateTour = () => {
    resetForm();
    setShowCreateForm(true);
  };

  // Handle editing tour
  const handleEditTour = (tourId: string) => {
    const tour = tourSegments.find(t => t.id === tourId);
    if (tour) {
      loadTourForEditing(tour);
      setShowCreateForm(true);
    }
  };

  // Handle deleting tour
  const handleDeleteTour = async (tourId: string) => {
    try {
      await deleteTourSegment(tourId);
    } catch (error) {
      alert(`Error deleting tour segment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Form data change handlers
  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleStateRangeChange = (updates: Partial<typeof newStateRange>) => {
    setNewStateRange(prev => ({ ...prev, ...updates }));
  };

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Unauthorized access
  if (!session?.user) {
    return null;
  }

  const isFormVisible = showCreateForm || editingTourSegment;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <TourPlannerHeader
        showCreateButton={!isFormVisible}
        onCreateTour={handleCreateTour}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Create/Edit Form */}
        {isFormVisible && (
          <TourForm
            formData={formData}
            newStateRange={newStateRange}
            isEditing={!!editingTourSegment}
            onFormDataChange={handleFormDataChange}
            onStateRangeChange={handleStateRangeChange}
            onAddStateRange={addStateRange}
            onRemoveStateRange={removeStateRange}
            onAddCity={addCityToNewRange}
            onRemoveCity={removeCityFromNewRange}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        )}

        {/* Tour List */}
        {!isFormVisible && (
          <TourSegmentList
            segments={tourSegments}
            onEdit={handleEditTour}
            onDelete={handleDeleteTour}
            onCreateTour={handleCreateTour}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}