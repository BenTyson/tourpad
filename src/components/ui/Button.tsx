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
      primary: 'bg-primary-400 text-white hover:bg-primary-500 focus:ring-primary-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5',
      secondary: 'bg-secondary-300 text-neutral-800 hover:bg-secondary-400 focus:ring-secondary-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
      outline: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-primary-300 hover:border-primary-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
      ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-primary-300 hover:scale-[1.05] active:scale-[0.95]'
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