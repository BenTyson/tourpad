// Tour basic details form component
'use client';

import { TourFormData } from '../types/tour';
import { TOUR_STATUS_OPTIONS } from '../constants/tourConstants';
import { VisibilityToggle } from '../ui/VisibilityToggle';

interface TourBasicDetailsFormProps {
  formData: TourFormData;
  onFormDataChange: (updates: Partial<TourFormData>) => void;
  isEditing?: boolean;
}

export function TourBasicDetailsForm({
  formData,
  onFormDataChange,
  isEditing = false
}: TourBasicDetailsFormProps) {
  return (
    <div className="space-y-6">
      {/* Tour Name and Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Tour Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFormDataChange({ name: e.target.value })}
            placeholder="Southwest Spring Tour 2025"
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent bg-white shadow-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-3">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => onFormDataChange({ status: e.target.value as any })}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent bg-white shadow-sm"
            >
              {TOUR_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-3">
              Visibility
            </label>
            <VisibilityToggle
              isPublic={formData.isPublic}
              onChange={(isPublic) => onFormDataChange({ isPublic })}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-neutral-900 mb-3">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          placeholder="Brief description of your tour..."
          rows={3}
          className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent bg-white shadow-sm resize-none"
        />
      </div>
    </div>
  );
}