'use client';
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    type = 'text', 
    required = false,
    showCharCount = false,
    maxLength,
    value,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-neutral-600">{description}</p>
        )}

        {/* Input Container */}
        <div className="relative">
          <input
            type={inputType}
            className={cn(
              'block w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder-neutral-500 transition-all duration-200',
              'focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100',
              'hover:border-neutral-400',
              error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
              isPassword && 'pr-12',
              className
            )}
            ref={ref}
            value={value}
            maxLength={maxLength}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-neutral-700"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Character Count */}
        {showCharCount && maxLength && (
          <div className="flex justify-end">
            <span className={cn(
              'text-xs',
              charCount > maxLength * 0.9 ? 'text-red-500' : 'text-neutral-500'
            )}>
              {charCount}/{maxLength}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  showCharCount?: boolean;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    required = false,
    showCharCount = false,
    maxLength,
    value,
    rows = 4,
    ...props 
  }, ref) => {
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-neutral-600">{description}</p>
        )}

        {/* Textarea */}
        <textarea
          className={cn(
            'block w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder-neutral-500 transition-all duration-200 resize-none',
            'focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100',
            'hover:border-neutral-400',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
            className
          )}
          ref={ref}
          rows={rows}
          value={value}
          maxLength={maxLength}
          {...props}
        />

        {/* Character Count */}
        {showCharCount && maxLength && (
          <div className="flex justify-end">
            <span className={cn(
              'text-xs',
              charCount > maxLength * 0.9 ? 'text-red-500' : 'text-neutral-500'
            )}>
              {charCount}/{maxLength}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

TextAreaField.displayName = 'TextAreaField';

interface GenreSelectProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
  availableGenres?: string[];
  maxGenres?: number;
  className?: string;
}

export const GenreSelect = ({
  label,
  description,
  error,
  required = false,
  selectedGenres,
  onChange,
  availableGenres = [
    'Folk', 'Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Classical', 
    'Electronic', 'Hip Hop', 'R&B', 'Soul', 'Funk', 'Reggae', 
    'World', 'Experimental', 'Ambient', 'Indie', 'Alternative'
  ],
  maxGenres = 5,
  className
}: GenreSelectProps) => {
  const [customGenre, setCustomGenre] = useState('');

  const addGenre = (genre: string) => {
    if (selectedGenres.length >= maxGenres) return;
    if (!selectedGenres.includes(genre)) {
      onChange([...selectedGenres, genre]);
    }
  };

  const removeGenre = (genre: string) => {
    onChange(selectedGenres.filter(g => g !== genre));
  };

  const addCustomGenre = () => {
    if (customGenre.trim() && !selectedGenres.includes(customGenre.trim())) {
      addGenre(customGenre.trim());
      setCustomGenre('');
    }
  };

  const handleCustomGenreKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomGenre();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-neutral-600">{description}</p>
      )}

      {/* Selected Genres */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map(genre => (
            <span
              key={genre}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
            >
              {genre}
              <button
                type="button"
                onClick={() => removeGenre(genre)}
                className="hover:text-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Available Genres */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {availableGenres
            .filter(genre => !selectedGenres.includes(genre))
            .map(genre => (
              <button
                key={genre}
                type="button"
                onClick={() => addGenre(genre)}
                disabled={selectedGenres.length >= maxGenres}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-full border transition-all duration-200',
                  selectedGenres.length >= maxGenres
                    ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 hover:scale-105 active:scale-95'
                )}
              >
                + {genre}
              </button>
            ))}
        </div>

        {/* Custom Genre Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customGenre}
            onChange={(e) => setCustomGenre(e.target.value)}
            onKeyPress={handleCustomGenreKeyPress}
            placeholder="Add custom genre..."
            disabled={selectedGenres.length >= maxGenres}
            className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:bg-neutral-100 disabled:text-neutral-400"
          />
          <button
            type="button"
            onClick={addCustomGenre}
            disabled={!customGenre.trim() || selectedGenres.length >= maxGenres}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Genre Count */}
      <div className="text-xs text-neutral-500">
        {selectedGenres.length}/{maxGenres} genres selected
        {selectedGenres.length >= maxGenres && (
          <span className="text-amber-600 ml-2">
            Maximum reached - remove a genre to add more
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};