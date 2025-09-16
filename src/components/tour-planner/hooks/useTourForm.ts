// Custom hook for tour form state management
'use client';

import { useState, useCallback } from 'react';
import { TourFormData, NewStateRangeData, TourSegment, UseTourFormReturn } from '../types/tour';
import { DEFAULT_TOUR_FORM_DATA, DEFAULT_STATE_RANGE_DATA } from '../constants/tourConstants';
import { validateStateRange, isStateAlreadyInTour } from '../utils/tourHelpers';

export function useTourForm(): UseTourFormReturn {
  const [formData, setFormData] = useState<TourFormData>(DEFAULT_TOUR_FORM_DATA);
  const [newStateRange, setNewStateRange] = useState<NewStateRangeData>(DEFAULT_STATE_RANGE_DATA);
  const [cityInput, setCityInput] = useState('');
  const [editingTourSegment, setEditingTourSegment] = useState<string | null>(null);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_TOUR_FORM_DATA);
    setNewStateRange(DEFAULT_STATE_RANGE_DATA);
    setCityInput('');
    setEditingTourSegment(null);
  }, []);

  // Load tour data for editing
  const loadTourForEditing = useCallback((tour: TourSegment) => {
    setFormData({
      name: tour.name,
      description: tour.description || '',
      status: tour.status,
      isPublic: tour.isPublic,
      stateRanges: tour.stateRanges.map(range => ({
        ...range,
        startDate: range.startDate.split('T')[0], // Convert to date input format
        endDate: range.endDate.split('T')[0]
      }))
    });
    setEditingTourSegment(tour.id);
  }, []);

  // Add new state range to tour
  const addStateRange = useCallback((): boolean => {
    // Validation
    if (!newStateRange.state || !newStateRange.startDate || !newStateRange.endDate) {
      alert('Please fill in state, start date, and end date');
      return false;
    }

    const dateError = validateStateRange(newStateRange.startDate, newStateRange.endDate);
    if (dateError) {
      alert(dateError);
      return false;
    }

    if (isStateAlreadyInTour(newStateRange.state, formData.stateRanges)) {
      alert('This state is already added to the tour');
      return false;
    }

    // Add the new range
    const newRange = {
      id: Date.now().toString(),
      ...newStateRange
    };

    setFormData(prev => ({
      ...prev,
      stateRanges: [...prev.stateRanges, newRange]
    }));

    // Reset new state range form
    setNewStateRange(DEFAULT_STATE_RANGE_DATA);
    setCityInput('');

    return true;
  }, [newStateRange, formData.stateRanges]);

  // Remove state range from tour
  const removeStateRange = useCallback((rangeId: string) => {
    setFormData(prev => ({
      ...prev,
      stateRanges: prev.stateRanges.filter(range => range.id !== rangeId)
    }));
  }, []);

  // Add city to new state range
  const addCityToNewRange = useCallback(() => {
    const city = cityInput.trim();
    if (city && !newStateRange.cities.includes(city)) {
      setNewStateRange(prev => ({
        ...prev,
        cities: [...prev.cities, city]
      }));
      setCityInput('');
    }
  }, [cityInput, newStateRange.cities]);

  // Remove city from new state range
  const removeCityFromNewRange = useCallback((city: string) => {
    setNewStateRange(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c !== city)
    }));
  }, []);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    if (!formData.name.trim()) {
      alert('Please provide a tour name');
      return false;
    }

    if (formData.stateRanges.length === 0) {
      alert('Please add at least one state with dates');
      return false;
    }

    return true;
  }, [formData.name, formData.stateRanges.length]);

  return {
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
  };
}