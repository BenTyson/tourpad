import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LoadingStateWrapper } from './LoadingStateWrapper';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    type: 'artist' | 'host' | 'fan' | 'admin';
    status: string;
  };
  hasFullAccess: boolean;
  needsPayment?: boolean;
  unreadMessages?: number;
  loading?: boolean;
  error?: string;
}

export function DashboardLayout({
  children,
  user,
  hasFullAccess,
  needsPayment = false,
  unreadMessages = 0,
  loading = false,
  error,
}: DashboardLayoutProps) {
  const getWelcomeMessage = () => {
    switch (user.type) {
      case 'admin':
        return 'Platform overview and management';
      case 'host':
        return 'Manage your venue and upcoming shows';
      case 'artist':
        return 'Track your tour and upcoming performances';
      case 'fan':
        return 'Discover and attend exclusive house concerts';
      default:
        return 'Welcome to your dashboard';
    }
  };

  const getPaymentMessage = () => {
    switch (user.type) {
      case 'artist':
        return 'Complete your $400 annual membership payment to unlock full platform access.';
      case 'fan':
        return 'Your membership has expired. Renew to continue accessing exclusive house concerts.';
      case 'host':
        return 'Complete your payment setup to start hosting concerts.';
      default:
        return 'Complete your payment to access full features.';
    }
  };

  const getPaymentLink = () => {
    switch (user.type) {
      case 'artist':
        return '/subscription';
      case 'fan':
        return '/payment/fan';
      case 'host':
        return '/payment/host';
      default:
        return '/payment';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Status Alerts */}
        {!hasFullAccess && (
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-secondary-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-secondary-900 mb-2">Limited Dashboard Access</h3>
                <p className="text-secondary-800 mb-4">
                  {user.type === 'fan' && 'Your membership has expired. Renew to continue accessing exclusive house concerts.'}
                  {user.type === 'artist' && 'Complete your membership to access all platform features. Check billing details below.'}
                  {user.type !== 'fan' && user.type !== 'artist' && user.status === 'pending' && 'Your application is under review. Full dashboard functionality will be available once approved.'}
                  {user.type !== 'fan' && user.type !== 'artist' && user.status === 'rejected' && 'Your application was not approved. Please review your application status for next steps.'}
                  {user.type !== 'fan' && user.type !== 'artist' && user.status === 'suspended' && 'Your account has been suspended. Contact support for assistance.'}
                </p>
                <div className="flex space-x-3">
                  {user.type === 'fan' ? (
                    <Link
                      href="/payment/fan"
                      className="bg-secondary-100 text-secondary-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors"
                    >
                      Renew Membership
                    </Link>
                  ) : user.type === 'artist' ? (
                    <Link
                      href="#billing"
                      className="bg-secondary-100 text-secondary-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors"
                    >
                      View Billing Details
                    </Link>
                  ) : (
                    <Link
                      href="/account/status"
                      className="bg-secondary-100 text-secondary-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors"
                    >
                      Check Status
                    </Link>
                  )}
                  {user.type !== 'fan' && user.status === 'rejected' && (
                    <Link
                      href="/register"
                      className="bg-white text-secondary-800 px-4 py-2 rounded-lg text-sm font-medium border border-secondary-300 hover:bg-secondary-50 transition-colors"
                    >
                      Reapply
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {needsPayment && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-primary-900 mb-2">Complete Your Registration</h3>
                <p className="text-primary-800 mb-4">
                  Congratulations! Your application has been approved. {getPaymentMessage()}
                </p>
                <Link
                  href={getPaymentLink()}
                  className="bg-primary-400 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors"
                >
                  Complete Payment
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Action Items Alert */}
        {hasFullAccess && unreadMessages > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-primary-600 mr-3" />
              <div className="flex-1">
                <h3 className="font-medium text-primary-900">You have items that need attention</h3>
                <div className="text-sm text-primary-800 mt-1">
                  {unreadMessages} unread {unreadMessages === 1 ? 'message' : 'messages'}
                </div>
              </div>
              <Link href='/dashboard/messages'>
                <Button size="sm">Review</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Welcome Header */}
        {hasFullAccess && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Welcome back, {user.name}
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    {getWelcomeMessage()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-500">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <LoadingStateWrapper loading={loading} error={error}>
          {children}
        </LoadingStateWrapper>
      </div>
    </div>
  );
}