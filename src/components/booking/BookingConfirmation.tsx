import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface BookingConfirmationProps {
  isHostBookingArtist: boolean;
  artistName?: string;
  hostName?: string;
}

export function BookingConfirmation({
  isHostBookingArtist,
  artistName,
  hostName
}: BookingConfirmationProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="text-center p-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h1>
          <p className="text-gray-600 mb-6">
            {isHostBookingArtist
              ? `Your booking request has been sent to ${artistName}. They'll respond within 24-48 hours.`
              : `Your booking request has been sent to ${hostName}. They'll review and respond soon.`
            }
          </p>
          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full">View Dashboard</Button>
            </Link>
            <Link href="/messages">
              <Button variant="outline" className="w-full">Go to Messages</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}