import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { StatusBadgeProps } from './types';

const statusVariants = {
  ACTIVE: { variant: 'success' as const, label: 'Active' },
  INACTIVE: { variant: 'error' as const, label: 'Inactive' },
  PENDING: { variant: 'warning' as const, label: 'Pending' },
  SUSPENDED: { variant: 'error' as const, label: 'Suspended' },
  TRIAL: { variant: 'warning' as const, label: 'Trial' },
  CANCELLED: { variant: 'error' as const, label: 'Cancelled' },
  APPROVED: { variant: 'success' as const, label: 'Approved' },
  REJECTED: { variant: 'error' as const, label: 'Rejected' },
  CONFIRMED: { variant: 'success' as const, label: 'Confirmed' },
  COMPLETED: { variant: 'success' as const, label: 'Completed' },
  SCHEDULED: { variant: 'default' as const, label: 'Scheduled' },
  WAITLISTED: { variant: 'warning' as const, label: 'Waitlisted' },
};

export function StatusBadge({
  status,
  variant,
  size = 'md',
  ...props
}: StatusBadgeProps) {
  const statusConfig = statusVariants[status.toUpperCase() as keyof typeof statusVariants];
  const finalVariant = variant || statusConfig?.variant || 'default';
  const label = statusConfig?.label || status;

  return (
    <Badge
      variant={finalVariant}
      size={size}
      {...props}
    >
      {label}
    </Badge>
  );
}