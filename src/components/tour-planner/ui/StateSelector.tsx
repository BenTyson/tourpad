// Reusable state selector component
'use client';

import { US_STATES } from '../constants/tourConstants';

interface StateSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function StateSelector({
  value,
  onChange,
  placeholder = "Choose state...",
  className = "",
  disabled = false,
  required = false
}: StateSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent bg-white shadow-sm ${className}`}
      disabled={disabled}
      required={required}
    >
      <option value="">{placeholder}</option>
      {US_STATES.map((state) => (
        <option key={state.value} value={state.value}>
          {state.label}
        </option>
      ))}
    </select>
  );
}