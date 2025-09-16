// Visibility toggle button component
'use client';

import { Eye, EyeOff } from 'lucide-react';

interface VisibilityToggleProps {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function VisibilityToggle({
  isPublic,
  onChange,
  className = "",
  disabled = false
}: VisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!isPublic)}
      disabled={disabled}
      className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all ${
        isPublic
          ? 'bg-[var(--color-sage)]/10 border-[var(--color-sage)] text-[var(--color-sage)]'
          : 'bg-neutral-50 border-neutral-300 text-neutral-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'} ${className}`}
    >
      <div className="flex items-center justify-center">
        {isPublic ? (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Public
          </>
        ) : (
          <>
            <EyeOff className="w-4 h-4 mr-2" />
            Private
          </>
        )}
      </div>
    </button>
  );
}