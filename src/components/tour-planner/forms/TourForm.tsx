// Complete tour form component
'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { TourFormData, NewStateRangeData, StateRange } from '../types/tour';
import { TourBasicDetailsForm } from './TourBasicDetailsForm';
import { StateRangeForm } from './StateRangeForm';
import { StateRangeList } from './StateRangeList';

interface TourFormProps {
  formData: TourFormData;
  newStateRange: NewStateRangeData;
  isEditing: boolean;
  editingStateRangeId: string | null;
  editingStateRangeData: NewStateRangeData;
  onFormDataChange: (updates: Partial<TourFormData>) => void;
  onStateRangeChange: (updates: Partial<NewStateRangeData>) => void;
  onAddStateRange: () => void;
  onRemoveStateRange: (rangeId: string) => void;
  onStartEditingStateRange: (stateRange: StateRange) => void;
  onUpdateEditingStateRangeData: (updates: Partial<NewStateRangeData>) => void;
  onUpdateStateRange: () => void;
  onCancelEditingStateRange: () => void;
  onAddCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
  onAddCityToEditing: (city: string) => void;
  onRemoveCityFromEditing: (city: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function TourForm({
  formData,
  newStateRange,
  isEditing,
  editingStateRangeId,
  editingStateRangeData,
  onFormDataChange,
  onStateRangeChange,
  onAddStateRange,
  onRemoveStateRange,
  onStartEditingStateRange,
  onUpdateEditingStateRangeData,
  onUpdateStateRange,
  onCancelEditingStateRange,
  onAddCity,
  onRemoveCity,
  onAddCityToEditing,
  onRemoveCityFromEditing,
  onSubmit,
  onCancel
}: TourFormProps) {
  return (
    <Card className="mb-8 bg-white shadow-lg border-[var(--color-french-blue)]/20">
      <CardHeader className="border-b border-neutral-200 bg-gradient-to-r from-[var(--color-french-blue)]/5 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {isEditing ? 'Edit Tour' : 'Plan New Tour'}
            </h2>
            <p className="text-neutral-600 text-sm mt-1">
              {isEditing
                ? 'Update your tour dates and locations'
                : 'Add states and dates to let hosts find you'
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0 rounded-full hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Basic Tour Details */}
          <TourBasicDetailsForm
            formData={formData}
            onFormDataChange={onFormDataChange}
            isEditing={isEditing}
          />

          {/* Tour Schedule Section */}
          <div>
            <label className="block text-lg font-bold text-neutral-900 mb-4">
              Tour Schedule by State *
            </label>
            <p className="text-neutral-600 text-sm mb-6">
              Add each state you'll visit with specific dates. Hosts can discover you when you're in their area.
            </p>

            {/* Add New State Range */}
            <StateRangeForm
              newStateRange={newStateRange}
              onStateRangeChange={onStateRangeChange}
              onAddStateRange={onAddStateRange}
              onAddCity={onAddCity}
              onRemoveCity={onRemoveCity}
            />

            {/* Existing State Ranges */}
            <StateRangeList
              stateRanges={formData.stateRanges}
              onRemoveStateRange={onRemoveStateRange}
              editingStateRangeId={editingStateRangeId}
              editingStateRangeData={editingStateRangeData}
              onStartEditing={onStartEditingStateRange}
              onUpdateEditing={onUpdateEditingStateRangeData}
              onSaveEditing={onUpdateStateRange}
              onCancelEditing={onCancelEditingStateRange}
              onAddCityToEditing={onAddCityToEditing}
              onRemoveCityFromEditing={onRemoveCityFromEditing}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[var(--color-french-blue)] hover:bg-[var(--color-primary-700)] text-white"
            >
              {isEditing ? 'Update Tour' : 'Create Tour'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}