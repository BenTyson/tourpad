'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import FanConcertReviewsList from '@/components/reviews/FanConcertReviewsList';

export default function FanReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated or not a fan
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (session.user.type !== 'fan') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.type !== 'fan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Only fans can access this page.</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard/fan">
              <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                My Concert Reviews
              </h1>
              <p className="text-neutral-600">
                Reviews you've written for concerts you've attended
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <Star className="w-4 h-4" />
                <span>Your reviews help build our community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-primary-900 mb-2">Review Tips</h3>
              <div className="text-primary-800 text-sm space-y-1">
                <p>• Be honest and constructive in your feedback</p>
                <p>• Help other fans discover great artists and venues</p>
                <p>• Your reviews can only be seen by you unless you make them public</p>
                <p>• You can edit or delete your reviews at any time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm">
          <FanConcertReviewsList 
            limit={10}
            showPagination={true}
            className="p-6"
          />
        </div>
      </div>
    </div>
  );
}