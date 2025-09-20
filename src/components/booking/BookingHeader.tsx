import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface BookingHeaderProps {
  profileType: 'host' | 'artist';
  hostId?: string;
  artistId?: string;
  isHostBookingArtist: boolean;
}

export function BookingHeader({
  profileType,
  hostId,
  artistId,
  isHostBookingArtist
}: BookingHeaderProps) {
  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <Link href={profileType === 'host' ? `/hosts/${hostId}` : `/artists/${artistId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isHostBookingArtist ? 'Book This Artist' : 'Request This Venue'}
        </h1>
        <p className="text-gray-600">
          {isHostBookingArtist
            ? 'Send a booking request to perform at your venue'
            : 'Send a booking request to perform at this venue'
          }
        </p>
      </div>
    </>
  );
}