'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ArtistDirectory from '@/components/fan/ArtistDirectory';

export default function ArtistsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--color-french-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading artists...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Please sign in to browse artists.</p>
          <Link href="/login">
            <Button>Sign In</Button>
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
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Discover Artists
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Browse talented musicians available for house concerts. 
              Connect with artists and discover new sounds for your next event.
            </p>
          </div>

          {/* User Type Specific Message */}
          {session.user.type === 'fan' && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-8">
              <div className="text-center">
                <h3 className="font-medium text-primary-900 mb-2">Fan Access</h3>
                <p className="text-primary-800 text-sm mb-3">
                  Browse artist profiles to discover new music. 
                  To book an artist, you'll need to find concerts in the concert discovery section.
                </p>
                <Link href="/concerts">
                  <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
                    Browse Concerts
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {session.user.type === 'host' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <div className="text-center">
                <h3 className="font-medium text-green-900 mb-2">Host View</h3>
                <p className="text-green-800 text-sm mb-3">
                  Discover artists for potential bookings at your venue. 
                  Use this directory to find musicians that match your style and requirements.
                </p>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Manage Bookings
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {session.user.type === 'artist' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="text-center">
                <h3 className="font-medium text-blue-900 mb-2">Artist View</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Connect with fellow musicians and see who's active in the TourPad community.
                </p>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    My Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Artist Directory */}
        <ArtistDirectory />
      </div>
    </div>
  );
}