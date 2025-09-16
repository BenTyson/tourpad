// List of state ranges in tour form
'use client';

import { Calendar, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StateRange } from '../types/tour';
import { getStateLabel } from '../utils/tourHelpers';

interface StateRangeListProps {
  stateRanges: StateRange[];
  onRemoveStateRange: (rangeId: string) => void;
}

export function StateRangeList({
  stateRanges,
  onRemoveStateRange
}: StateRangeListProps) {
  if (stateRanges.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">
          Planned States ({stateRanges.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stateRanges.map((range) => (
          <div
            key={range.id}
            className="border rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-semibold text-neutral-900">
                {getStateLabel(range.state)}
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveStateRange(range.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              {/* Dates */}
              <div className="flex items-center text-neutral-600">
                <Calendar className="w-4 h-4 mr-2 text-[var(--color-french-blue)]" />
                {new Date(range.startDate).toLocaleDateString()} - {new Date(range.endDate).toLocaleDateString()}
              </div>

              {/* Cities */}
              {range.cities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
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
              )}

              {/* Notes */}
              {range.notes && (
                <p className="text-neutral-600 italic mt-2 text-sm">
                  "{range.notes}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}