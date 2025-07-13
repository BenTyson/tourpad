'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PendingApprovalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    // If not authenticated, redirect to login
    if (!session) {
      router.push('/login');
      return;
    }

    // If already approved, redirect to dashboard
    if (session.user.status === 'approved') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-secondary-100 rounded-full p-4">
              <ClockIcon className="h-12 w-12 text-secondary-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">
            Access Restricted
          </h1>
          
          <p className="text-neutral-600 mb-6">
            Your account is currently pending approval. Dashboard access is restricted until your application is reviewed and approved.
          </p>

          <div className="bg-secondary-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-secondary-800">
              <strong>Status:</strong> {session.user.status || 'Pending Review'}
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/account/status"
              className="block w-full bg-primary-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-500 transition-colors"
            >
              Check Application Status
            </Link>
            
            <Link
              href="/"
              className="block w-full bg-white text-primary-600 py-3 px-6 rounded-lg font-medium border-2 border-primary-400 hover:bg-primary-50 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>

          <div className="mt-6 text-sm text-neutral-500">
            <p>
              Need help?{' '}
              <a href="mailto:support@tourpad.com" className="text-primary-600 hover:text-primary-700">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}