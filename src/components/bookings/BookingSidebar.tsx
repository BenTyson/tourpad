'use client';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Booking {
  id: string;
  createdAt: Date | string;
}

interface BookingSidebarProps {
  currentStatus: string;
  booking: Booking;
}

export function BookingSidebar({ currentStatus, booking }: BookingSidebarProps) {
  const formatTimelineDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Contact Info (only if approved) */}
      {currentStatus === 'approved' && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Contact Information</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-600">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-600">Continue via Messages</span>
              </div>
            </div>
            <Link href="/messages">
              <Button className="w-full bg-primary-600 hover:bg-primary-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <Link href="/messages">
              <Button variant="outline" className="w-full justify-start border-neutral-300 hover:bg-neutral-50">
                <MessageCircle className="w-4 h-4 mr-3" />
                Messages
              </Button>
            </Link>
            <Link href="/calendar">
              <Button variant="outline" className="w-full justify-start border-neutral-300 hover:bg-neutral-50">
                <Calendar className="w-4 h-4 mr-3" />
                View Calendar
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-start border-neutral-300 hover:bg-neutral-50">
                <User className="w-4 h-4 mr-3" />
                All Bookings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Booking Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-900">Timeline</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#8ea58c] rounded-full"></div>
              <div>
                <div className="font-medium text-neutral-900">Request Sent</div>
                <div className="text-sm text-neutral-600">
                  {formatTimelineDate(booking.createdAt)}
                </div>
              </div>
            </div>

            {currentStatus !== 'requested' && (
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  currentStatus === 'approved' ? 'bg-[#738a6e]' : 'bg-[#ebebe9]'
                }`}></div>
                <div>
                  <div className="font-medium text-neutral-900">
                    {currentStatus === 'approved' ? 'Approved' : 'Declined'}
                  </div>
                  <div className="text-sm text-neutral-600">Just now</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}