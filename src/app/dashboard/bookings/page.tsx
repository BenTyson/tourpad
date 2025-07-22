'use client';
import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BookingList from '@/components/bookings/BookingList';
import { Button } from '@/components/ui/Button';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Handle booking status updates
  const handleStatusUpdate = useCallback(async (bookingId: string, status: string, data?: any) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          ...data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking');
      }

      const result = await response.json();
      
      // Trigger a refresh of the booking list
      setUpdateTrigger(prev => prev + 1);
      
      return result;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please sign in to access your bookings.</p>
          <Button onClick={() => router.push('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  // Get user type from session
  const userType = session.user.userType?.toLowerCase() as 'artist' | 'host' | 'admin';

  // Redirect admin users to admin bookings page
  if (userType === 'admin') {
    router.push('/admin/bookings');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userType === 'artist' ? 'My Booking Requests' : 'Incoming Booking Requests'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {userType === 'artist' 
                    ? 'Manage your booking requests to hosts and track their status'
                    : 'Review and respond to booking requests from artists'
                  }
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {userType === 'artist' && (
                <Link href="/hosts">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Request New Booking
                  </Button>
                </Link>
              )}
              {userType === 'host' && (
                <Link href="/artists">
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Artists
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Booking Management Section */}
        <BookingList
          viewType={userType === 'artist' ? 'artist' : 'host'}
          onStatusUpdate={handleStatusUpdate}
          onRefresh={handleRefresh}
          key={updateTrigger} // Force re-render on updates
        />
      </div>
    </div>
  );
}