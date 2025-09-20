import React from 'react';
import { MapPinIcon, StarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface BookingProfileSummaryProps {
  profileData: any;
  profileType: 'host' | 'artist';
  host?: any;
  artist?: any;
}

export function BookingProfileSummary({
  profileData,
  profileType,
  host,
  artist
}: BookingProfileSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Profile Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {profileData?.name.charAt(0)}
              </span>
            </div>
            <h3 className="font-semibold text-lg">{profileData?.name}</h3>
            {host && (
              <div className="flex items-center justify-center text-sm text-gray-600 mt-1">
                <MapPinIcon className="w-4 h-4 mr-1" />
                {(host as any)?.city || (host as any)?.location?.city}, {(host as any)?.state || (host as any)?.location?.state}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center mb-4">
            <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span className="font-medium">{profileData?.rating.toFixed(1)}</span>
            <span className="text-gray-600 ml-1">({profileData?.reviewCount} reviews)</span>
          </div>

          {/* Host-specific stats */}
          {host && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Typical Attendance</span>
                <span className="font-medium">{host.showSpecs?.avgAttendance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Usual Door Fee</span>
                <span className="font-medium">${host.showSpecs?.avgDoorFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Capacity</span>
                <span className="font-medium">{host.showSpecs?.indoorAttendanceMax}</span>
              </div>
            </div>
          )}

          {/* Artist-specific stats */}
          {artist && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">{artist.yearsActive} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tour Schedule</span>
                <span className="font-medium">{artist.tourMonthsPerYear} months/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cancellation</span>
                <Badge variant={artist.cancellationPolicy === 'flexible' ? 'success' : 'warning'}>
                  {artist.cancellationPolicy}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Tips */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Booking Tips</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Be specific about your event vision and expectations</span>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Include any special requirements upfront</span>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Most {profileType === 'host' ? 'hosts' : 'artists'} respond within 24 hours</span>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Messages continue in your dashboard after booking</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}