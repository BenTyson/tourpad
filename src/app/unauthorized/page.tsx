'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    // If not authenticated, redirect to login
    if (!session) {
      router.push('/login');
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

  const getUserTypeDisplay = (type: string) => {
    switch (type) {
      case 'artist': return 'Artist';
      case 'host': return 'Host';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">
            Access Denied
          </h1>
          
          <p className="text-neutral-600 mb-6">
            You don't have permission to access this page. This area is restricted to authorized users only.
          </p>

          <div className="bg-neutral-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-neutral-700">
              <strong>Your Role:</strong> {getUserTypeDisplay(session.user.type)}
            </p>
            <p className="text-sm text-neutral-700 mt-1">
              <strong>Status:</strong> {session.user.status || 'Unknown'}
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-primary-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-500 transition-colors"
            >
              Go to Your Dashboard
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
              If you believe this is an error, please{' '}
              <a href="mailto:support@tourpad.com" className="text-primary-600 hover:text-primary-700">
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}