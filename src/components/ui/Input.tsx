import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors',
            error && 'border-primary-500 focus:border-primary-500 focus:ring-primary-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-primary-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };