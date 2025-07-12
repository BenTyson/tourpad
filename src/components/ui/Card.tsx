import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  clickable?: boolean;
}

const Card = ({ className, hover = false, clickable = false, ...props }: CardProps) => (
  <div
    className={cn(
      'rounded-lg border border-neutral-200 bg-white shadow-sm transition-all duration-300',
      hover && 'hover:shadow-lg hover:-translate-y-1 hover:border-primary-200',
      clickable && 'cursor-pointer hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] active:translate-y-0 hover:border-primary-300',
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: CardProps) => (
  <div className={cn('p-6 pb-4', className)} {...props} />
);

const CardContent = ({ className, ...props }: CardProps) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
);

const CardFooter = ({ className, ...props }: CardProps) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);

export { Card, CardHeader, CardContent, CardFooter };