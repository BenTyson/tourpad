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
  const [editingStateRangeId, setEditingStateRangeId] = useState<string | null>(null);
  const [editingStateRangeData, setEditingStateRangeData] = useState<NewStateRangeData>(DEFAULT_STATE_RANGE_DATA);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_TOUR_FORM_DATA);
    setNewStateRange(DEFAULT_STATE_RANGE_DATA);
    setCityInput('');
    setEditingTourSegment(null);
    setEditingStateRangeId(null);
    setEditingStateRangeData(DEFAULT_STATE_RANGE_DATA);
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

  // Start editing a state range
  const startEditingStateRange = useCallback((stateRange: StateRange) => {
    setEditingStateRangeId(stateRange.id);
    setEditingStateRangeData({
      state: stateRange.state,
      startDate: stateRange.startDate.split('T')[0], // Convert to date input format
      endDate: stateRange.endDate.split('T')[0],
      cities: [...stateRange.cities],
      notes: stateRange.notes
    });
  }, []);

  // Update editing state range data
  const updateEditingStateRangeData = useCallback((updates: Partial<NewStateRangeData>) => {
    setEditingStateRangeData(prev => ({ ...prev, ...updates }));
  }, []);

  // Update existing state range
  const updateStateRange = useCallback((): boolean => {
    if (!editingStateRangeId) return false;

    // Validation
    if (!editingStateRangeData.state || !editingStateRangeData.startDate || !editingStateRangeData.endDate) {
      alert('Please fill in state, start date, and end date');
      return false;
    }

    const dateError = validateStateRange(editingStateRangeData.startDate, editingStateRangeData.endDate);
    if (dateError) {
      alert(dateError);
      return false;
    }

    // Check if state changed and if new state conflicts with existing ones
    const currentStateRange = formData.stateRanges.find(range => range.id === editingStateRangeId);
    if (currentStateRange && editingStateRangeData.state !== currentStateRange.state) {
      const otherRanges = formData.stateRanges.filter(range => range.id !== editingStateRangeId);
      if (isStateAlreadyInTour(editingStateRangeData.state, otherRanges)) {
        alert('This state is already added to the tour');
        return false;
      }
    }

    // Update the state range
    setFormData(prev => ({
      ...prev,
      stateRanges: prev.stateRanges.map(range =>
        range.id === editingStateRangeId
          ? { ...range, ...editingStateRangeData }
          : range
      )
    }));

    // Clear editing state
    setEditingStateRangeId(null);
    setEditingStateRangeData(DEFAULT_STATE_RANGE_DATA);

    return true;
  }, [editingStateRangeId, editingStateRangeData, formData.stateRanges]);

  // Cancel editing state range
  const cancelEditingStateRange = useCallback(() => {
    setEditingStateRangeId(null);
    setEditingStateRangeData(DEFAULT_STATE_RANGE_DATA);
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
    editingStateRangeId,
    editingStateRangeData,
    resetForm,
    loadTourForEditing,
    addStateRange,
    removeStateRange,
    startEditingStateRange,
    updateEditingStateRangeData,
    updateStateRange,
    cancelEditingStateRange,
    addCityToNewRange,
    removeCityFromNewRange,
    validateForm
  };
}