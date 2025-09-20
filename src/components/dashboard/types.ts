export interface UserStats {
  responseRate: number;
  averageRating: number;
  totalShows: number;
  profileViews: number;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  type: 'artist' | 'host' | 'fan' | 'admin';
  profileImageUrl?: string;
  createdAt: string;
  verified?: boolean;
}

export interface ArtistDashboardData {
  user: DashboardUser;
  stats: UserStats;
  profile: {
    id: string;
    stageName: string;
    bio?: string;
    genres: string[];
    subscriptionStatus: string;
    isVerified: boolean;
  };
  musicConnections: {
    spotify?: {
      connected: boolean;
      profileUrl?: string;
      displayName?: string;
    };
    soundcloud?: {
      connected: boolean;
      profileUrl?: string;
      displayName?: string;
    };
  };
  billing: {
    subscriptionStatus: string;
    currentPlan?: string;
    nextBillingDate?: string;
    paymentMethodLast4?: string;
  };
}

export interface HostDashboardData {
  user: DashboardUser;
  stats: UserStats;
  profile: {
    id: string;
    venueName: string;
    city: string;
    state: string;
    venueType: string;
    capacity: number;
    subscriptionStatus: string;
    lodgingOptions: any[];
  };
  billing: {
    subscriptionStatus: string;
    currentPlan?: string;
    nextBillingDate?: string;
    paymentMethodLast4?: string;
  };
}

export interface FanDashboardData {
  user: DashboardUser;
  stats: UserStats;
  profile: {
    id: string;
    subscriptionStatus: string;
    favoriteGenres: string[];
    location?: {
      city: string;
      state: string;
    };
  };
  billing: {
    subscriptionStatus: string;
    currentPlan?: string;
    nextBillingDate?: string;
    paymentMethodLast4?: string;
  };
}

export interface DashboardProps {
  user: DashboardUser;
  userType: 'artist' | 'host' | 'fan' | 'admin';
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export interface LoadingStateWrapperProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
}