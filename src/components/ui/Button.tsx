import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 hover:border-gray-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 hover:scale-[1.05] active:scale-[0.95]'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <button
        className={cn(
          baseStyles, 
          variants[variant], 
          sizes[size], 
          loading && 'cursor-not-allowed',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect for primary buttons */}
        {variant === 'primary' && (
          <div className="absolute inset-0 -top-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
        
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Content */}
        <span className={cn('flex items-center', loading && 'opacity-0')}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };