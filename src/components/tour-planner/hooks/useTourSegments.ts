// Custom hook for tour segments API operations
'use client';

import { useState, useCallback } from 'react';
import { TourSegment, TourFormData, UseTourSegmentsReturn } from '../types/tour';

export function useTourSegments(): UseTourSegmentsReturn {
  const [tourSegments, setTourSegments] = useState<TourSegment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tour segments from API
  const fetchTourSegments = useCallback(async () => {
    try {
      const response = await fetch('/api/tour-segments');
      if (response.ok) {
        const segments = await response.json();
        setTourSegments(segments);
      } else {
        console.error('Failed to fetch tour segments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching tour segments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new tour segment
  const createTourSegment = useCallback(async (segmentData: TourFormData) => {
    try {
      const response = await fetch('/api/tour-segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segmentData)
      });

      if (response.ok) {
        const newSegment = await response.json();
        setTourSegments(prev => [...prev, newSegment]);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create tour segment');
      }
    } catch (error) {
      console.error('Error creating tour segment:', error);
      throw error; // Re-throw to allow component to handle
    }
  }, []);

  // Update existing tour segment
  const updateTourSegment = useCallback(async (segmentId: string, segmentData: TourFormData) => {
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
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update tour segment');
      }
    } catch (error) {
      console.error('Error updating tour segment:', error);
      throw error; // Re-throw to allow component to handle
    }
  }, []);

  // Delete tour segment
  const deleteTourSegment = useCallback(async (segmentId: string) => {
    try {
      const response = await fetch(`/api/tour-segments/${segmentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTourSegments(prev => prev.filter(segment => segment.id !== segmentId));
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete tour segment');
      }
    } catch (error) {
      console.error('Error deleting tour segment:', error);
      throw error; // Re-throw to allow component to handle
    }
  }, []);

  return {
    tourSegments,
    loading,
    createTourSegment,
    updateTourSegment,
    deleteTourSegment,
    fetchTourSegments
  };
}