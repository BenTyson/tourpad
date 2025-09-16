// Tour summary information bar
'use client';

import { StateRange } from '../types/tour';
import { formatTourDateRange } from '../utils/tourHelpers';

interface TourSummaryBarProps {
  stateRanges: StateRange[];
  description?: string;
  className?: string;
}

export function TourSummaryBar({
  stateRanges,
  description,
  className = ""
}: TourSummaryBarProps) {
  const stateCount = stateRanges.length;
  const dateRange = formatTourDateRange(stateRanges);

  return (
    <div className={className}>
      <p className="text-neutral-600 text-sm">
        {stateCount} state{stateCount !== 1 ? 's' : ''} • {dateRange}
      </p>
      {description && (
        <p className="text-sm text-neutral-500 mt-2">{description}</p>
      )}
    </div>
  );
}