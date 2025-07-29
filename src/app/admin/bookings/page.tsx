'use client';
import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import BookingList from '@/components/bookings/BookingList';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeftIcon, CalendarIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function AdminBookingsPage() {
  const { data: session, status } = useSession();
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--color-french-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or not admin
  if (!session?.user || session.user.type !== 'admin') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Admin access required to view this page.</p>
          <Link href="/admin">
            <Button>Back to Admin Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-transparent hover:bg-neutral-100 rounded-md transition-colors">
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Admin
                </button>
              </Link>
              <div className="h-6 w-px bg-neutral-200"></div>
              <h1 className="text-xl font-semibold text-neutral-900">Bookings</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => handleRefresh()}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <BookingList
          viewType="admin"
          onStatusUpdate={handleStatusUpdate}
          onRefresh={handleRefresh}
          key={updateTrigger} // Force re-render on updates
        />
      </div>
    </div>
  );
}