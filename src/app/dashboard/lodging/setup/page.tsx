'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LodgingWizard } from '@/components/lodging';
import type { LodgingData } from '@/components/lodging/types';

export default function LodgingSetupPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSave = (data: LodgingData) => {
    console.log('Saving lodging configuration:', data);
    // TODO: Implement actual save functionality
    // Call API to save lodging data
    router.push('/dashboard');
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  // Not authenticated
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600">Please sign in to access lodging setup.</p>
        </div>
      </div>
    );
  }

  return (
    <LodgingWizard
      onSave={handleSave}
      onCancel={handleCancel}
      // TODO: Load initial data from user's existing lodging configuration
      // initialData={existingLodgingData}
    />
  );
}