'use client';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export interface ShowData {
  id: string;
  artistId: string;
  hostId: string;
  artistName: string;
  hostName: string;
  venueName: string;
  city?: string;
  state?: string;
  date: Date | string;
  time?: Date | string | null;
  doorFee?: number | null;
  expectedAttendance?: number | null;
  confirmedAt?: Date | string | null;
  artist?: {
    id: string;
    name: string;
    profileImageUrl?: string | null;
  };
  host?: {
    id: string;
    name: string;
    venueName: string;
    city?: string;
    state?: string;
    profileImageUrl?: string | null;
  };
}

interface ShowCardProps {
  show: ShowData;
  viewType: 'artist' | 'host' | 'admin';
  className?: string;
}

export default function ShowCard({ show, viewType, className = '' }: ShowCardProps) {
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (time: Date | string | null | undefined) => {
    if (!time) return 'TBD';
    return format(new Date(time), 'h:mm a');
  };

  const getDaysUntilShow = () => {
    const showDate = new Date(show.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    showDate.setHours(0, 0, 0, 0);
    const diffTime = showDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilShow();

  return (
    <Card className={`${className} border border-neutral-200 hover:border-[var(--color-french-blue)] hover:shadow-md transition-all duration-200 bg-white`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Title based on view type */}
            <div className="mb-2">
              {viewType === 'artist' ? (
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900">{show.venueName}</h3>
                  <p className="text-sm text-neutral-600">
                    Hosted by{' '}
                    <Link 
                      href={`/hosts/${show.hostId}`}
                      className="text-[var(--color-french-blue)] hover:underline"
                    >
                      {show.hostName}
                    </Link>
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900">
                    <Link 
                      href={`/artists/${show.artistId}`}
                      className="text-neutral-900 hover:text-[var(--color-french-blue)] hover:underline"
                    >
                      {show.artistName}
                    </Link>
                  </h3>
                  <p className="text-sm text-neutral-600">Performing at your venue</p>
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-neutral-700">
                <Calendar className="w-4 h-4 mr-1 text-[var(--color-french-blue)]" />
                <span>{formatDate(show.date)}</span>
              </div>
              <div className="flex items-center text-neutral-700">
                <Clock className="w-4 h-4 mr-1 text-[var(--color-french-blue)]" />
                <span>{formatTime(show.time)}</span>
              </div>
            </div>
          </div>

          {/* Days Until Badge */}
          <div>
            {daysUntil === 0 ? (
              <Badge className="bg-red-100 text-red-700 border border-red-300">
                Today!
              </Badge>
            ) : daysUntil === 1 ? (
              <Badge className="bg-orange-100 text-orange-700 border border-orange-300">
                Tomorrow
              </Badge>
            ) : daysUntil <= 7 ? (
              <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">
                {daysUntil} days
              </Badge>
            ) : (
              <Badge className="bg-neutral-100 text-neutral-700 border border-neutral-300">
                {daysUntil} days
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Location */}
          {(show.city || show.state) && (
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Location</p>
                <p className="text-sm text-neutral-600">
                  {show.city}{show.city && show.state && ', '}{show.state}
                </p>
              </div>
            </div>
          )}

          {/* Expected Attendance */}
          {show.expectedAttendance && (
            <div className="flex items-start space-x-2">
              <Users className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Expected Guests</p>
                <p className="text-sm text-neutral-600">{show.expectedAttendance} people</p>
              </div>
            </div>
          )}

          {/* Door Fee */}
          {show.doorFee !== null && show.doorFee !== undefined && (
            <div className="flex items-start space-x-2">
              <DollarSign className="w-4 h-4 text-[var(--color-french-blue)] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Door Fee</p>
                <p className="text-sm text-neutral-600">
                  {show.doorFee === 0 ? 'Free' : `$${show.doorFee}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div className="text-xs text-neutral-500">
            Confirmed {show.confirmedAt ? format(new Date(show.confirmedAt), 'MMM d, yyyy') : 'recently'}
          </div>
          <div className="flex space-x-2">
            <Link 
              href={`/bookings/${show.id}`}
              className="text-sm text-[var(--color-french-blue)] hover:text-blue-600 hover:underline"
            >
              View Details
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}