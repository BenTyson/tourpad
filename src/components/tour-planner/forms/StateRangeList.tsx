// List of state ranges in tour form
'use client';

import { Calendar, X, Edit2, Save, X as Cancel } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StateRange, NewStateRangeData } from '../types/tour';
import { getStateLabel } from '../utils/tourHelpers';
import { StateRangeFormFields } from './StateRangeFormFields';

interface StateRangeListProps {
  stateRanges: StateRange[];
  onRemoveStateRange: (rangeId: string) => void;
  editingStateRangeId?: string | null;
  editingStateRangeData?: NewStateRangeData;
  onStartEditing?: (stateRange: StateRange) => void;
  onUpdateEditing?: (updates: Partial<NewStateRangeData>) => void;
  onSaveEditing?: () => void;
  onCancelEditing?: () => void;
  onAddCityToEditing?: (city: string) => void;
  onRemoveCityFromEditing?: (city: string) => void;
}

export function StateRangeList({
  stateRanges,
  onRemoveStateRange,
  editingStateRangeId = null,
  editingStateRangeData,
  onStartEditing,
  onUpdateEditing,
  onSaveEditing,
  onCancelEditing,
  onAddCityToEditing,
  onRemoveCityFromEditing
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
          <div key={range.id} className={editingStateRangeId === range.id ? "lg:col-span-2" : ""}>
            {editingStateRangeId === range.id && editingStateRangeData && onUpdateEditing && onSaveEditing && onCancelEditing && onAddCityToEditing && onRemoveCityFromEditing ? (
              // Editing Mode - Show form fields (full width)
              <StateRangeFormFields
                stateRangeData={editingStateRangeData}
                onStateRangeChange={onUpdateEditing}
                onAddCity={onAddCityToEditing}
                onRemoveCity={onRemoveCityFromEditing}
                isEditing={true}
                actions={
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onSaveEditing}
                      className="flex-1 py-3 px-6 border-[var(--color-french-blue)] text-[var(--color-french-blue)] hover:bg-[var(--color-french-blue)] hover:text-white rounded-xl font-medium transition-colors duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancelEditing}
                      className="py-3 px-6 border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-xl font-medium transition-colors duration-200"
                    >
                      <Cancel className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                }
              />
            ) : (
              // Display Mode - Show state range info
              <div className="border rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-neutral-900">
                    {getStateLabel(range.state)}
                  </h4>
                  <div className="flex gap-1">
                    {onStartEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onStartEditing(range)}
                        className="text-[var(--color-french-blue)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-mist)]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}