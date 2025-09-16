// State range form component
'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NewStateRangeData } from '../types/tour';
import { StateRangeFormFields } from './StateRangeFormFields';

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
    <div className="mb-6">
      <h3 className="text-md font-semibold text-neutral-900 mb-4 flex items-center">
        <Plus className="w-4 h-4 mr-2 text-[var(--color-french-blue)]" />
        Add State to Tour
      </h3>

      <StateRangeFormFields
        stateRangeData={newStateRange}
        onStateRangeChange={onStateRangeChange}
        onAddCity={onAddCity}
        onRemoveCity={onRemoveCity}
        isEditing={false}
        actions={
          <Button
            type="button"
            onClick={onAddStateRange}
            className="w-full py-3 px-6 bg-[var(--color-french-blue)] hover:bg-[var(--color-primary-700)] text-white rounded-xl font-medium transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add State to Tour
          </Button>
        }
      />
    </div>
  );
}