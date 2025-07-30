'use client';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BookingsHeaderProps {
  userType: 'artist' | 'host';
}

export default function BookingsHeader({ userType }: BookingsHeaderProps) {
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-transparent hover:bg-neutral-100 rounded-md transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </button>
            </Link>
            <div className="h-6 w-px bg-neutral-200"></div>
            <h1 className="text-xl font-semibold text-neutral-900">
              {userType === 'artist' ? 'My Bookings' : 'Booking Requests'}
            </h1>
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
    </div>
  );
}