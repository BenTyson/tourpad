// Status badge component with coastal colors
'use client';

import { Badge } from '@/components/ui/Badge';
import { TourStatus } from '../types/tour';
import { TOUR_STATUS_COLORS } from '../constants/tourConstants';

interface StatusBadgeProps {
  status: TourStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const colors = TOUR_STATUS_COLORS[status];

  return (
    <Badge
      className={`${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}