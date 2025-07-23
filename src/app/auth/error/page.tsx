'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is an issue with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification link is invalid or has expired.';
      case 'Default':
        return 'An unexpected error occurred during authentication.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-mist)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Authentication Error
          </h1>
          
          <p className="text-neutral-600 mb-6">
            {getErrorMessage(error)}
          </p>

          {error && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-neutral-500">
                Error code: <span className="font-mono text-neutral-700">{error}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/login" className="block">
              <Button className="w-full bg-[var(--color-french-blue)] hover:bg-blue-600">
                Try Again
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-500">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}