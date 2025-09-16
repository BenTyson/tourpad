// Reusable state range form fields component
'use client';

import { ReactNode } from 'react';
import { NewStateRangeData } from '../types/tour';
import { StateSelector } from '../ui/StateSelector';
import { DateRangePicker } from '../ui/DateRangePicker';
import { CityInput } from './CityInput';

interface StateRangeFormFieldsProps {
  stateRangeData: NewStateRangeData;
  onStateRangeChange: (updates: Partial<NewStateRangeData>) => void;
  onAddCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
  isEditing?: boolean;
  actions: ReactNode;
}

export function StateRangeFormFields({
  stateRangeData,
  onStateRangeChange,
  onAddCity,
  onRemoveCity,
  isEditing = false,
  actions
}: StateRangeFormFieldsProps) {
  return (
    <div className="border border-neutral-200 rounded-2xl p-6 bg-gradient-to-br from-neutral-50 to-white shadow-sm">
      {/* State and Dates Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            State
          </label>
          <StateSelector
            value={stateRangeData.state}
            onChange={(state) => onStateRangeChange({ state })}
            placeholder="Choose state..."
          />
        </div>

        <DateRangePicker
          startDate={stateRangeData.startDate}
          endDate={stateRangeData.endDate}
          onStartDateChange={(startDate) => onStateRangeChange({ startDate })}
          onEndDateChange={(endDate) => onStateRangeChange({ endDate })}
          startLabel="Est. Arrival"
          endLabel="Est. Departure"
        />
      </div>

      {/* Cities and Notes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <CityInput
          cities={stateRangeData.cities}
          onAddCity={onAddCity}
          onRemoveCity={onRemoveCity}
          placeholder="Denver, Boulder..."
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={stateRangeData.notes}
            onChange={(e) => onStateRangeChange({ notes: e.target.value })}
            placeholder="Looking for outdoor venues, acoustic preferred..."
            rows={3}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent bg-white shadow-sm resize-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      {actions}
    </div>
  );
}