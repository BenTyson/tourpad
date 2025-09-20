'use client';
import Link from 'next/link';
import { Calendar, Users, MapPin, Star, Eye, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Artist {
  id: string;
  name: string;
  userId: string;
  genre?: string;
  rating?: number;
  reviewCount?: number;
  bio?: string;
}

interface Host {
  id: string;
  name: string;
  userId: string;
  rating: number;
  reviewCount: number;
  city: string;
  state: string;
  showSpecs: {
    avgAttendance: number;
    indoorAttendanceMax: number;
    hostingHistory: string;
  };
  hostInfo?: {
    profilePhoto?: string;
    hostName?: string;
  };
}

interface Booking {
  id: string;
  eventDate: Date | string;
  notes?: string;
}

interface BookingDetailsSectionProps {
  booking: Booking;
  artist?: Artist;
  host?: Host;
  formatDate: (date: Date | string) => string;
  currentStatus?: string;
}

export function BookingDetailsSection({ booking, artist, host, formatDate, currentStatus }: BookingDetailsSectionProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Event Details */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Event Details</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-neutral-900 mb-1">Date & Time</div>
                  <div className="text-neutral-600">
                    {formatDate(booking.eventDate)}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-secondary-600" />
                </div>
                <div>
                  <div className="font-medium text-neutral-900 mb-1">Expected Attendance</div>
                  <div className="text-neutral-600">{(booking as any).guestCount || host?.showSpecs.avgAttendance} people</div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#d4c4a8] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#344c3d]" />
                </div>
                <div>
                  <div className="font-medium text-neutral-900 mb-1">Venue</div>
                  <div className="text-neutral-600">
                    {currentStatus === 'approved'
                      ? `${host?.name}, ${host?.city}, ${host?.state}`
                      : `${host?.name}, ${host?.city}, ${host?.state} (full address shared when confirmed)`
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="font-medium text-neutral-900 mb-3">Request Message</div>
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <p className="text-neutral-700 text-sm leading-relaxed">
                    "We're excited to perform at your venue! This will be an acoustic set featuring original songs and some covers. We bring our own guitars and just need basic mics. Looking forward to creating a magical evening with your community!"
                  </p>
                </div>
              </div>

              <div>
                <div className="font-medium text-neutral-900 mb-3">Special Requirements</div>
                <div className="text-neutral-600 text-sm">
                  Basic sound system (mics only), vegetarian meal option for 3 people
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artist Info */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-900">Artist</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {artist?.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 text-lg">{artist?.name}</h4>
              <div className="flex items-center text-sm text-neutral-600">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                {artist?.rating?.toFixed(1) || '5.0'} ({artist?.reviewCount || 12} reviews)
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Genre:</span>
              <span className="font-medium text-neutral-900">{artist?.genre || 'Folk/Acoustic'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Performance Style:</span>
              <span className="font-medium text-neutral-900">Solo Acoustic</span>
            </div>
          </div>

          <Link href={`/artists/${artist?.id}`}>
            <Button variant="outline" size="sm" className="w-full border-neutral-300 hover:bg-neutral-50">
              <Eye className="w-4 h-4 mr-2" />
              View Full Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Host Info */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-900">Venue</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            {host?.hostInfo?.profilePhoto ? (
              <img
                src={host.hostInfo.profilePhoto}
                alt={`${host.hostInfo.hostName} profile photo`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-primary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {host?.name.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-neutral-900 text-lg">{host?.name}</h4>
              <div className="flex items-center text-sm text-neutral-600">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                {host?.rating.toFixed(1)} ({host?.reviewCount} reviews)
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Typical Attendance:</span>
              <span className="font-medium text-neutral-900">{host?.showSpecs.avgAttendance}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Max Capacity:</span>
              <span className="font-medium text-neutral-900">{host?.showSpecs.indoorAttendanceMax}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Experience:</span>
              <span className="font-medium text-neutral-900">{host?.showSpecs.hostingHistory}</span>
            </div>
          </div>

          <Link href={`/hosts/${host?.id}`}>
            <Button variant="outline" size="sm" className="w-full border-neutral-300 hover:bg-neutral-50">
              <Home className="w-4 h-4 mr-2" />
              View Full Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}