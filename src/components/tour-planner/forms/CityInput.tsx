// City input component with tags
'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface CityInputProps {
  cities: string[];
  onAddCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
  placeholder?: string;
  className?: string;
}

export function CityInput({
  cities,
  onAddCity,
  onRemoveCity,
  placeholder = "Denver, Boulder...",
  className = ""
}: CityInputProps) {
  const [cityInput, setCityInput] = useState('');

  const handleAddCity = () => {
    const city = cityInput.trim();
    if (city && !cities.includes(city)) {
      onAddCity(city);
      setCityInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCity();
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        Cities (Optional)
      </label>

      {/* Input Row */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent bg-white shadow-sm"
        />
        <Button
          type="button"
          onClick={handleAddCity}
          size="sm"
          className="px-4 py-3 rounded-xl bg-[var(--color-french-blue)] hover:bg-[var(--color-primary-700)]"
        >
          Add
        </Button>
      </div>

      {/* City Tags */}
      {cities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <Badge
              key={city}
              variant="secondary"
              className="px-3 py-1 rounded-full bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/20"
            >
              {city}
              <button
                type="button"
                onClick={() => onRemoveCity(city)}
                className="ml-2 text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}