import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error';
  pulse?: boolean;
}

const Badge = ({ className, variant = 'default', pulse = false, ...props }: BadgeProps) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    error: 'bg-red-100 text-red-800 hover:bg-red-200'
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