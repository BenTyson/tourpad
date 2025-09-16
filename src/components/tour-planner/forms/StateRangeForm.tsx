// State range form component
'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NewStateRangeData } from '../types/tour';
import { StateSelector } from '../ui/StateSelector';
import { DateRangePicker } from '../ui/DateRangePicker';
import { CityInput } from './CityInput';

interface StateRangeFormProps {
  newStateRange: NewStateRangeData;
  onStateRangeChange: (updates: Partial<NewStateRangeData>) => void;
  onAddStateRange: () => void;
  onAddCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
}

export function StateRangeForm({
  newStateRange,
  onStateRangeChange,
  onAddStateRange,
  onAddCity,
  onRemoveCity
}: StateRangeFormProps) {
  return (
    <div className="border border-neutral-200 rounded-2xl p-6 mb-6 bg-gradient-to-br from-neutral-50 to-white shadow-sm">
      <h3 className="text-md font-semibold text-neutral-900 mb-4 flex items-center">
        <Plus className="w-4 h-4 mr-2 text-[var(--color-french-blue)]" />
        Add State to Tour
      </h3>

      {/* State and Dates Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            State
          </label>
          <StateSelector
            value={newStateRange.state}
            onChange={(state) => onStateRangeChange({ state })}
            placeholder="Choose state..."
          />
        </div>

        <DateRangePicker
          startDate={newStateRange.startDate}
          endDate={newStateRange.endDate}
          onStartDateChange={(startDate) => onStateRangeChange({ startDate })}
          onEndDateChange={(endDate) => onStateRangeChange({ endDate })}
          startLabel="Arrival Date"
          endLabel="Departure Date"
        />
      </div>

      {/* Cities and Notes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <CityInput
          cities={newStateRange.cities}
          onAddCity={onAddCity}
          onRemoveCity={onRemoveCity}
          placeholder="Denver, Boulder..."
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={newStateRange.notes}
            onChange={(e) => onStateRangeChange({ notes: e.target.value })}
            placeholder="Looking for outdoor venues, acoustic preferred..."
            rows={3}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent bg-white shadow-sm resize-none"
          />
        </div>
      </div>

      {/* Add Button */}
      <Button
        type="button"
        onClick={onAddStateRange}
        className="w-full py-3 px-6 bg-[var(--color-french-blue)] hover:bg-[var(--color-primary-700)] text-white rounded-xl font-medium transition-colors duration-200 shadow-sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add State to Tour
      </Button>
    </div>
  );
}