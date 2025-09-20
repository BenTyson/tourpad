import React from 'react';
import { AmenityItem } from './types';

interface AmenityCheckboxProps {
  amenity: AmenityItem;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function AmenityCheckbox({ amenity, checked, onChange }: AmenityCheckboxProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
      <div className="flex items-center">
        <amenity.icon className="w-5 h-5 text-primary-600 mr-3" />
        <div>
          <span className="font-medium text-neutral-900">{amenity.label}</span>
          {amenity.description && (
            <p className="text-sm text-neutral-600 mt-1">{amenity.description}</p>
          )}
        </div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded w-4 h-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
      />
    </div>
  );
}