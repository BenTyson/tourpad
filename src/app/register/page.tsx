'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HomeIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import ArtistRegistrationWizard from '@/components/registration/ArtistRegistrationWizard';
import HostRegistrationWizard from '@/components/registration/HostRegistrationWizard';
import FanRegistrationWizard from '@/components/registration/FanRegistrationWizard';

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get('type') as 'host' | 'artist' | 'fan';
  const hostType = searchParams.get('hostType') as 'lodging' | null;

  // Show user type selection if no type specified
  if (!userType || (userType !== 'host' && userType !== 'artist' && userType !== 'fan')) {
    return <UserTypeSelection />;
  }

  // Use wizard for artist registrations
  if (userType === 'artist') {
    return <ArtistRegistrationWizard />;
  }

  // Use wizard for host registrations
  if (userType === 'host') {
    return <HostRegistrationWizard />;
  }

  // Use wizard for fan registrations
  if (userType === 'fan') {
    return <FanRegistrationWizard />;
  }

  // This should never be reached since all user types have wizards
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-600 to-secondary-800 py-12 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Invalid Registration Request</h1>
        <p className="text-secondary-100 mb-4">Please select a valid account type.</p>
        <Link href="/register">
          <Button>Back to Registration</Button>
        </Link>
      </div>
    </div>
  );
}

// User Type Selection Component
function UserTypeSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-600 to-secondary-800 py-12 flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join TourPad
          </h1>
          <p className="text-xl text-secondary-100">
            Choose your account type to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Artist */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => router.push('/register?type=artist')}>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full mb-4">
                <MusicalNoteIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Artist
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Touring musicians looking for intimate venues and lodging
              </p>
              <Button size="sm" className="w-full">
                Apply as Artist
              </Button>
            </CardContent>
          </Card>

          {/* Regular Host */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => router.push('/register?type=host')}>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-400 to-primary-500 rounded-full mb-4">
                <HomeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Concert Host
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Open your space for intimate house concerts
              </p>
              <Button size="sm" className="w-full">
                Apply as Host
              </Button>
            </CardContent>
          </Card>

          {/* Lodging Host */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => router.push('/register?type=host&hostType=lodging')}>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-green-500 rounded-full mb-4">
                <HomeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Lodging Host
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Provide accommodation for touring artists
              </p>
              <Button size="sm" className="w-full">
                Apply as Lodging Host
              </Button>
            </CardContent>
          </Card>

          {/* Fan */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => router.push('/register?type=fan')}>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-4">
                <MusicalNoteIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Fan
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Discover and attend exclusive house concerts
              </p>
              <Button size="sm" className="w-full">
                Join as Fan
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-secondary-200">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-secondary-100 font-medium underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NewRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-french-blue)] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <RegisterForm />
    </Suspense>
  );
}