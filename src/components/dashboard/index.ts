// Component exports for dashboard componentization
export { DashboardLayout } from './DashboardLayout';
export { QuickActions } from './QuickActions';
export { StatsCard } from './StatsCard';
export { StatusBadge } from './StatusBadge';
export { LoadingStateWrapper } from './LoadingStateWrapper';
export { BillingWidget } from './BillingWidget';
export { MessagingCenter } from './MessagingCenter';

// Role-specific dashboards
export { ArtistDashboard } from './ArtistDashboard';
export { HostDashboard } from './HostDashboard';
export { FanDashboard } from './FanDashboard';

// Types
export type {
  UserStats,
  DashboardUser,
  ArtistDashboardData,
  HostDashboardData,
  FanDashboardData,
  DashboardProps,
  StatCardProps,
  StatusBadgeProps,
  LoadingStateWrapperProps
} from './types';