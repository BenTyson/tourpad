import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error';
  pulse?: boolean;
}

const Badge = ({ className, variant = 'default', pulse = false, ...props }: BadgeProps) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200',
    success: 'bg-sage-100 text-sage-800 hover:bg-sage-200',
    warning: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
    error: 'bg-primary-100 text-primary-800 hover:bg-primary-200'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 hover:scale-105',
        variants[variant],
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    />
  );
};

export { Badge };