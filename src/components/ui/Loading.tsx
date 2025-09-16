// src/components/ui/Loading.tsx
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('animate-spin rounded-full border-2 border-[var(--color-french-blue)] border-t-transparent', sizes[size], className)} />
  );
}

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div 
      className={cn('animate-pulse bg-gray-200 rounded', className)}
      style={{ width, height }}
    />
  );
}

// Card skeleton for loading states
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div className={cn(
      'animate-in fade-in-0 slide-in-from-bottom-4 duration-500',
      className
    )}>
      {children}
    </div>
  );
}

// Staggered animation container
interface StaggeredContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StaggeredContainer({ children, className, delay = 100 }: StaggeredContainerProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <div 
              key={index}
              className="animate-in fade-in-0 slide-in-from-left-4"
              style={{ 
                animationDelay: `${index * delay}ms`,
                animationFillMode: 'both'
              }}
            >
              {child}
            </div>
          ))
        : children
      }
    </div>
  );
}