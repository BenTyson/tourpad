'use client';
import Link from 'next/link';
import { ArrowLeft, Calendar, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface StatusInfo {
  color: string;
  icon: any;
  text: string;
  description: string;
}

interface BookingHeaderProps {
  statusInfo: StatusInfo;
  currentStatus: string;
  onRequestCancellation: () => void;
}

export function BookingHeader({ statusInfo, currentStatus, onRequestCancellation }: BookingHeaderProps) {
  const StatusIcon = statusInfo.icon;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center space-x-3">
          <Link href="/calendar">
            <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </Link>
          <Link href="/messages">
            <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </Button>
          </Link>
        </div>
      </div>

      {/* Page Title & Status */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Booking Request
            </h1>
            <p className="text-neutral-600">{statusInfo.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={`${statusInfo.color} border-0 px-4 py-2`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusInfo.text}
            </Badge>
            {currentStatus === 'approved' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRequestCancellation}
                className="border-[#ebebe9] text-[#344c3d] hover:bg-[#ebebe9]"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Request Cancellation
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}