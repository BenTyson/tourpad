'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';

export default function PendingApprovalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.status === 'approved' || session?.user?.status === 'active') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-french-blue)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const userType = session.user.type;
  const isArtist = userType === 'artist';
  const isHost = userType === 'host';

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <ClockIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Application Under Review
            </h1>
            <p className="text-gray-600 mt-2">
              Thank you for your {isArtist ? 'artist' : 'host'} application to TourPad!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">Application Received</h3>
                  <p className="text-sm text-blue-800 mt-1">
                    We've received your application and our team is reviewing it carefully.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Review Process</p>
                    <p className="text-sm text-gray-600">
                      Our team reviews all applications within 48 hours to ensure quality and safety.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notification</p>
                    <p className="text-sm text-gray-600">
                      You'll receive an email at <strong>{session.user.email}</strong> with our decision.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Platform Access</p>
                    <p className="text-sm text-gray-600">
                      {isArtist 
                        ? 'Once approved, you can complete your membership payment and start booking shows.'
                        : 'Once approved, you can immediately start hosting and discovering artists.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isArtist && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Artist Membership</h4>
                <p className="text-sm text-green-800">
                  After approval, there's a $400/year membership fee to access the full platform. 
                  This helps us maintain a high-quality community and support our artists.
                </p>
              </div>
            )}

            {isHost && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Host Benefits</h4>
                <p className="text-sm text-green-800">
                  Hosting on TourPad is completely free! You'll get access to our community of 
                  vetted touring artists and tools to manage your shows.
                </p>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900">Questions or Updates?</h4>
                  <p className="text-sm text-amber-800 mt-1">
                    If you need to update your application or have questions, please contact us at{' '}
                    <a href="mailto:support@tourpad.com" className="underline">
                      support@tourpad.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="flex-1"
              >
                Back to Home
              </Button>
              <Button
                onClick={() => router.push('/contact')}
                className="flex-1"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}