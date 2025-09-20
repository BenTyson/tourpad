'use client';
import Link from 'next/link';
import { CalendarEvent } from '@/app/api/calendar/events/route';

interface EventDetailModalProps {
  event: CalendarEvent;
  userType?: string;
  onClose: () => void;
}

export function EventDetailModal({ event, userType, onClose }: EventDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header Image */}
        {(() => {
          if (userType === 'artist') {
            // Artists see venue photos
            const hostData = event.details?.host || event.details?.booking?.host;
            const venuePhoto = hostData?.media?.find((m: any) => m.mediaType === 'PHOTO' && m.category === 'VENUE');

            return venuePhoto ? (
              <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex-shrink-0">
                <img
                  src={venuePhoto.fileUrl}
                  alt={`${event.participants.host} venue`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex-shrink-0"></div>
            );
          } else {
            // Others see artist press photos
            const artistData = event.details?.artist || event.details?.booking?.artist;
            const pressPhoto = artistData?.media?.find((m: any) => m.mediaType === 'PHOTO' && m.category === 'PRESS');

            return pressPhoto ? (
              <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex-shrink-0">
                <img
                  src={pressPhoto.fileUrl}
                  alt={`${event.participants.artist} press photo`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-secondary-400 to-secondary-600 flex-shrink-0"></div>
            );
          }
        })()}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Title and Status */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">{event.title}</h2>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === 'confirmed' || event.status === 'approved' ? 'bg-green-100 text-green-800' :
                  event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-neutral-100 text-neutral-800'
                }`}>
                  {event.status}
                </span>
                <span className="text-sm text-neutral-600">{event.type}</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <div className="text-xs text-neutral-600 mb-1">Date & Time</div>
                <div className="text-sm font-medium text-neutral-900">
                  {event.date.toLocaleDateString()} {event.startTime ? `at ${event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl">
                <div className="text-xs text-neutral-600 mb-1">Location</div>
                <div className="text-sm font-medium text-neutral-900">{event.location}</div>
              </div>

              {event.participants.artist && (
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <div className="text-xs text-neutral-600 mb-1">Artist</div>
                  <div className="text-sm font-medium text-neutral-900">{event.participants.artist}</div>
                </div>
              )}

              {event.participants.host && (
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <div className="text-xs text-neutral-600 mb-1">Host</div>
                  <div className="text-sm font-medium text-neutral-900">{event.participants.host}</div>
                </div>
              )}

              {/* Attendee Count */}
              {event.participants.attendeeCount && (
                <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-xl">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{event.participants.attendeeCount} people</div>
                    <div className="text-xs text-neutral-600">Expected attendance</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer with Action Buttons */}
        <div className="flex-shrink-0 p-6 pt-0 border-t border-neutral-100">
          <div className="flex space-x-3">
            <Link
              href={event.type === 'booking'
                ? `/bookings/${event.details.id}`
                : `/concerts/${event.details.id}`
              }
              className="flex-1"
            >
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200">
                View Full Details
              </button>
            </Link>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-neutral-300 hover:border-neutral-400 text-neutral-700 font-medium rounded-xl transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}