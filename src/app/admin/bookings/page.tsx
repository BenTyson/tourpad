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
    <div className="min-h-screen py-8" style={{background: 'linear-gradient(135deg, #f8f9f9 0%, #ebebe9 100%)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center">
              <CalendarIcon className="w-8 h-8 mr-3 text-[var(--color-french-blue)]" />
              Booking Management
            </h1>
            <p className="text-neutral-600 mt-2">
              Monitor and manage all booking requests across the platform
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-white border-2 border-[var(--color-french-blue)] rounded-lg flex items-center justify-center mx-auto mb-2">
                <ClockIcon className="w-5 h-5 text-[var(--color-french-blue)]" />
              </div>
              <div className="text-lg font-bold text-neutral-900">Pending</div>
              <div className="text-sm text-neutral-600">Awaiting Response</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[var(--color-french-blue)] rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-bold text-neutral-900">Approved</div>
              <div className="text-sm text-neutral-600">Host Approved</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[var(--color-sage)] rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-bold text-neutral-900">Confirmed</div>
              <div className="text-sm text-neutral-600">Artist Confirmed</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <XCircleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-lg font-bold text-neutral-900">Issues</div>
              <div className="text-sm text-neutral-600">Need Attention</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Instructions */}
        <Card className="mb-8 border border-[var(--color-french-blue)] bg-slate-50">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="w-5 h-5 text-[var(--color-french-blue)] mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-[var(--color-french-blue)]">Admin Booking Management</h3>
                <p className="text-neutral-700 text-sm mt-1">
                  As an admin, you can view all booking requests across the platform. Use this to monitor booking patterns, 
                  resolve disputes, and ensure smooth operations between artists and hosts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Management Section */}
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