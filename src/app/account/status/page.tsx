'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// This would come from API in production
const getUserStatus = (userId: string) => {
  // Mock data for different status scenarios
  const statusData = {
    pending: {
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
      estimatedReviewTime: '24-48 hours',
      message: 'Your application is under review. We typically respond within 24-48 hours.',
    },
    approved_needs_payment: {
      status: 'approved',
      approvedAt: '2024-01-16T14:00:00Z',
      paymentRequired: true,
      paymentAmount: 400,
      message: 'Congratulations! Your application has been approved. Please complete payment to activate your account.',
    },
    approved_active: {
      status: 'approved',
      approvedAt: '2024-01-16T14:00:00Z',
      paymentRequired: false,
      message: 'Your account is active and in good standing.',
    },
    rejected: {
      status: 'rejected',
      rejectedAt: '2024-01-16T14:00:00Z',
      reason: 'Incomplete performance history information',
      canReapply: true,
      reapplyAfter: '2024-02-16T14:00:00Z',
      message: 'We were unable to approve your application at this time.',
    },
    suspended: {
      status: 'suspended',
      suspendedAt: '2024-02-01T10:00:00Z',
      reason: 'Multiple cancellations without notice',
      appealEmail: 'support@tourpad.com',
      message: 'Your account has been temporarily suspended.',
    },
  };

  // For demo, return different statuses based on user
  return statusData.pending;
};

export default function AccountStatusPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (!session) {
      router.push('/login');
    }
  }, [session, sessionStatus, router]);

  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (!session) return null;

  const statusInfo = getUserStatus(session.user.id);

  const getStatusIcon = () => {
    switch (statusInfo.status) {
      case 'pending':
        return <ClockIcon className="h-16 w-16 text-secondary-500" />;
      case 'approved':
        return <CheckCircleIcon className="h-16 w-16 text-secondary-500" />;
      case 'rejected':
        return <XCircleIcon className="h-16 w-16 text-red-500" />;
      case 'suspended':
        return <ExclamationTriangleIcon className="h-16 w-16 text-amber-500" />;
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (statusInfo.status) {
      case 'pending':
        return 'Application Under Review';
      case 'approved':
        return statusInfo.paymentRequired ? 'Application Approved!' : 'Account Active';
      case 'rejected':
        return 'Application Not Approved';
      case 'suspended':
        return 'Account Suspended';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (statusInfo.status) {
      case 'pending':
        return 'bg-secondary-50 border-secondary-200';
      case 'approved':
        return 'bg-secondary-50 border-secondary-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      case 'suspended':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-neutral-50 border-neutral-200';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Card */}
        <div className={`rounded-lg border-2 p-8 ${getStatusColor()}`}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              {getStatusTitle()}
            </h1>
            <p className="text-lg text-neutral-600 mb-6">
              {statusInfo.message}
            </p>
          </div>

          {/* Status-specific content */}
          {statusInfo.status === 'pending' && (
            <div className="mt-8 bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">What happens next?</h2>
              <ul className="space-y-3 text-neutral-600">
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  Our team will review your application within {statusInfo.estimatedReviewTime}
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  You'll receive an email notification once reviewed
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  Check back here for updates on your application status
                </li>
              </ul>
              <div className="mt-6 text-sm text-neutral-500">
                Application submitted: {new Date(statusInfo.submittedAt).toLocaleDateString()}
              </div>
            </div>
          )}

          {statusInfo.status === 'approved' && statusInfo.paymentRequired && (
            <div className="mt-8 space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Complete Your Registration</h2>
                <p className="text-neutral-600 mb-4">
                  Your annual membership fee of ${statusInfo.paymentAmount} gives you access to:
                </p>
                <ul className="space-y-2 text-neutral-600 mb-6">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0 mt-0.5" />
                    Browse and connect with verified hosts
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0 mt-0.5" />
                    Unlimited booking requests
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0 mt-0.5" />
                    Tour planning tools and resources
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0 mt-0.5" />
                    Priority support
                  </li>
                </ul>
                <Link
                  href="/subscription"
                  className="block w-full text-center bg-primary-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-500 transition-colors"
                >
                  Complete Payment
                </Link>
              </div>
            </div>
          )}

          {statusInfo.status === 'approved' && !statusInfo.paymentRequired && (
            <div className="mt-8 bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">Your Account is Active</h2>
              <p className="text-neutral-600 mb-6">
                You have full access to the TourPad platform. Here are some things you can do:
              </p>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full text-center bg-primary-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-500 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href={session.user.type === 'artist' ? '/hosts' : '/artists'}
                  className="block w-full text-center bg-white text-primary-600 py-3 px-6 rounded-lg font-medium border-2 border-primary-400 hover:bg-primary-50 transition-colors"
                >
                  Browse {session.user.type === 'artist' ? 'Hosts' : 'Artists'}
                </Link>
              </div>
            </div>
          )}

          {statusInfo.status === 'rejected' && (
            <div className="mt-8 space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Reason for Decision</h2>
                <p className="text-neutral-600 mb-4">{statusInfo.reason}</p>
                {statusInfo.canReapply && (
                  <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                    <p className="text-sm text-neutral-600">
                      You can submit a new application after{' '}
                      {new Date(statusInfo.reapplyAfter).toLocaleDateString()}.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">What You Can Do</h2>
                <ul className="space-y-3 text-neutral-600">
                  <li className="flex items-start">
                    <span className="text-neutral-400 mr-2">•</span>
                    Review and update your application information
                  </li>
                  <li className="flex items-start">
                    <span className="text-neutral-400 mr-2">•</span>
                    Ensure all required fields are complete and accurate
                  </li>
                  <li className="flex items-start">
                    <span className="text-neutral-400 mr-2">•</span>
                    Contact support if you have questions: support@tourpad.com
                  </li>
                </ul>
              </div>
            </div>
          )}

          {statusInfo.status === 'suspended' && (
            <div className="mt-8 space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Reason for Suspension</h2>
                <p className="text-neutral-600 mb-4">{statusInfo.reason}</p>
                <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-800">
                    This is a temporary suspension. Your account access has been restricted while we review this matter.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">How to Appeal</h2>
                <p className="text-neutral-600 mb-4">
                  If you believe this suspension was made in error or would like to discuss the situation, 
                  please contact our support team:
                </p>
                <a
                  href={`mailto:${statusInfo.appealEmail}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  {statusInfo.appealEmail}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-neutral-600">
            Need help?{' '}
            <Link href="/support" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}