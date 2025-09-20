import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface HostBookingInfoProps {
  host: {
    id: string;
    name: string;
    suggestedDoorFee?: number;
    indoorCapacity?: number;
    hostingExperience?: number;
    showSpecs?: {
      avgDoorFee?: number;
      avgAttendance?: number;
    };
  };
}

export function HostBookingInfo({ host }: HostBookingInfoProps) {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Ready to Book?</h2>
        <p className="text-neutral-600">Get in touch to check availability and discuss your show</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-neutral-900 mb-4">Show Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Suggested door fee:</span>
              <span className="font-medium">${host.suggestedDoorFee || host.showSpecs?.avgDoorFee || 20}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Typical audience:</span>
              <span className="font-medium">{host.showSpecs?.avgAttendance || Math.floor((host.indoorCapacity || 20) * 0.8)} people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Response rate:</span>
              <span className="font-medium">{host.hostingExperience && host.hostingExperience > 2 ? '95%' : host.hostingExperience && host.hostingExperience > 0 ? '85%' : 'New host'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Response time:</span>
              <span className="font-medium">{host.hostingExperience && host.hostingExperience > 5 ? 'Within 4 hours' : host.hostingExperience && host.hostingExperience > 1 ? 'Within 12 hours' : 'Within 24 hours'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-neutral-900 mb-4">Next Steps</h3>
          <div className="space-y-3 text-sm text-neutral-700">
            <div className="flex items-start">
              <span className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
              <span>Send a booking request with your preferred dates</span>
            </div>
            <div className="flex items-start">
              <span className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
              <span>Host reviews your request and responds</span>
            </div>
            <div className="flex items-start">
              <span className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
              <span>Coordinate show details and logistics</span>
            </div>
          </div>
          <div className="mt-6">
            <Link href={`/bookings/new?hostId=${host.id}`}>
              <Button className="w-full">Send Booking Request</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}