// Display state ranges as badges with details
'use client';

import { Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { StateRange } from '../types/tour';
import { getStateLabel } from '../utils/tourHelpers';

interface StateRangeBadgesProps {
  stateRanges: StateRange[];
  variant?: 'compact' | 'detailed';
  className?: string;
}

export function StateRangeBadges({
  stateRanges,
  variant = 'detailed',
  className = ""
}: StateRangeBadgesProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {stateRanges.map((range) => (
          <Badge
            key={range.id}
            variant="secondary"
            className="text-xs bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/20"
          >
            {getStateLabel(range.state)}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {stateRanges.map((range) => (
        <div key={range.id} className="bg-neutral-50 rounded-lg p-4">
          <h4 className="font-semibold text-neutral-900 mb-2">
            {getStateLabel(range.state)}
          </h4>
          <div className="space-y-1 text-sm">
            {/* Dates */}
            <div className="flex items-center text-neutral-600">
              <Calendar className="w-4 h-4 mr-2 text-[var(--color-french-blue)]" />
              {new Date(range.startDate).toLocaleDateString()} - {new Date(range.endDate).toLocaleDateString()}
            </div>

            {/* Cities */}
            {range.cities.length > 0 && (
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-neutral-400" />
                <div className="flex flex-wrap gap-1">
                  {range.cities.map((city) => (
                    <Badge
                      key={city}
                      variant="secondary"
                      className="text-xs bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/20"
                    >
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {range.notes && (
              <p className="text-neutral-500 italic mt-2 text-xs">
                "{range.notes}"
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}