// Tour Planner Utility Functions

import { StateRange, TourSegment } from '../types/tour';
import { US_STATES } from '../constants/tourConstants';

/**
 * Get the state label from state code
 */
export function getStateLabel(stateCode: string): string {
  const state = US_STATES.find(s => s.value === stateCode);
  return state?.label || stateCode;
}

/**
 * Calculate tour date range from state ranges
 */
export function getTourDateRange(stateRanges: StateRange[]): { startDate: Date; endDate: Date } | null {
  if (stateRanges.length === 0) return null;

  const dates = stateRanges.flatMap(r => [new Date(r.startDate), new Date(r.endDate)]);
  const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));

  return { startDate, endDate };
}

/**
 * Format tour date range for display
 */
export function formatTourDateRange(stateRanges: StateRange[]): string {
  const dateRange = getTourDateRange(stateRanges);
  if (!dateRange) return 'No dates set';

  return `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`;
}

/**
 * Check if date is valid and in the future
 */
export function isValidFutureDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
}

/**
 * Validate state range dates
 */
export function validateStateRange(startDate: string, endDate: string): string | null {
  if (!startDate || !endDate) {
    return 'Please provide both start and end dates';
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    return 'End date must be after start date';
  }

  return null;
}

/**
 * Check if state already exists in tour
 */
export function isStateAlreadyInTour(stateCode: string, existingRanges: StateRange[]): boolean {
  return existingRanges.some(range => range.state === stateCode);
}

/**
 * Sort tour segments by earliest start date
 */
export function sortTourSegmentsByDate(segments: TourSegment[]): TourSegment[] {
  return [...segments].sort((a, b) => {
    const aDateRange = getTourDateRange(a.stateRanges);
    const bDateRange = getTourDateRange(b.stateRanges);

    if (!aDateRange && !bDateRange) return 0;
    if (!aDateRange) return 1;
    if (!bDateRange) return -1;

    return aDateRange.startDate.getTime() - bDateRange.startDate.getTime();
  });
}

/**
 * Get unique cities from state ranges
 */
export function getUniqueCities(stateRanges: StateRange[]): string[] {
  const allCities = stateRanges.flatMap(range => range.cities);
  return [...new Set(allCities)].sort();
}

/**
 * Calculate total tour duration in days
 */
export function getTourDurationDays(stateRanges: StateRange[]): number {
  const dateRange = getTourDateRange(stateRanges);
  if (!dateRange) return 0;

  const diffTime = dateRange.endDate.getTime() - dateRange.startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
}