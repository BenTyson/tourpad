// List of tour segments component
'use client';

import { useState } from 'react';
import { TourSegment } from '../types/tour';
import { sortTourSegmentsByDate } from '../utils/tourHelpers';
import { TourSegmentCard } from './TourSegmentCard';
import { TourEmptyState } from './TourEmptyState';

interface TourSegmentListProps {
  segments: TourSegment[];
  onEdit: (segmentId: string) => void;
  onDelete: (segmentId: string) => void;
  onCreateTour: () => void;
  loading?: boolean;
}

export function TourSegmentList({
  segments,
  onEdit,
  onDelete,
  onCreateTour,
  loading = false
}: TourSegmentListProps) {
  const [expandedTour, setExpandedTour] = useState<string | null>(null);

  const handleToggleExpand = (segmentId: string) => {
    setExpandedTour(expandedTour === segmentId ? null : segmentId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-french-blue)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (segments.length === 0) {
    return <TourEmptyState onCreateTour={onCreateTour} />;
  }

  const sortedSegments = sortTourSegmentsByDate(segments);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-neutral-900">
          Your Tours ({segments.length})
        </h2>
      </div>

      <div className="space-y-4">
        {sortedSegments.map((segment) => (
          <TourSegmentCard
            key={segment.id}
            segment={segment}
            onEdit={onEdit}
            onDelete={onDelete}
            isExpanded={expandedTour === segment.id}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>
    </div>
  );
}