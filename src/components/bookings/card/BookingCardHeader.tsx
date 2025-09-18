'use client';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Calendar,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookingData } from '../BookingCard';

interface BookingCardHeaderProps {
  booking: BookingData;
  viewType: 'host' | 'artist';
  onViewDetails?: (id: string) => void;
}

export function BookingCardHeader({ booking, viewType, onViewDetails }: BookingCardHeaderProps) {
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'APPROVED': return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'REJECTED': return 'bg-red-100 text-red-700 border border-red-300';
      case 'CONFIRMED': return 'bg-green-100 text-green-700 border border-green-300';
      case 'COMPLETED': return 'bg-purple-100 text-purple-700 border border-purple-300';
      case 'CANCELLED': return 'bg-gray-100 text-gray-700 border border-gray-300';
      default: return 'bg-white text-neutral-600 border border-neutral-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-4 h-4" />;
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <div className="flex items-center space-x-2 mb-2">
            {viewType === 'host' ? (
              <>
                <h3 className="text-lg font-semibold text-neutral-900">
                  <Link
                    href={`/artists/${booking.artistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 hover:text-[var(--color-french-blue)] hover:underline"
                  >
                    {booking.artistName}
                  </Link>
                </h3>
                <span className="text-sm text-neutral-500">" Artist</span>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-neutral-900">
                  <Link
                    href={`/hosts/${booking.hostId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 hover:text-[var(--color-french-blue)] hover:underline"
                  >
                    {booking.hostName}
                  </Link>
                </h3>
                <span className="text-sm text-neutral-500">" Host</span>
              </>
            )}
          </div>

          {/* Basic Info - Date Only */}
          <div className="text-sm text-neutral-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-[var(--color-french-blue)]" />
              <span>{formatDate(booking.requestedDate)}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(booking.status)}>
            {getStatusIcon(booking.status)}
            <span className="ml-1">{booking.status}</span>
          </Badge>
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(booking.id)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
}