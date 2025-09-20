'use client';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { CalendarEvent } from '@/app/api/calendar/events/route';

type CalendarEventStatus = 'pending' | 'approved' | 'rejected' | 'confirmed' | 'completed' | 'cancelled' | 'scheduled' | 'live';

interface CalendarListViewProps {
  filteredEvents: CalendarEvent[];
  userType?: string;
  onEventSelect: (event: CalendarEvent) => void;
}

export function CalendarListView({ filteredEvents, userType, onEventSelect }: CalendarListViewProps) {
  // Get status color using TourPad color system
  const getEventColor = (status: CalendarEventStatus, type: 'booking' | 'concert') => {
    if (type === 'booking') {
      switch (status) {
        case 'approved':
        case 'confirmed': return 'bg-[#738a6e]'; // sage - successful
        case 'pending': return 'bg-[#8ea58c]'; // french blue - in progress
        case 'rejected':
        case 'cancelled': return 'bg-[#ebebe9]'; // mist - inactive
        case 'completed': return 'bg-[#344c3d]'; // evergreen - final state
        default: return 'bg-[#d4c4a8]'; // sand - neutral
      }
    } else {
      switch (status) {
        case 'scheduled': return 'bg-[#8ea58c]'; // french blue - active
        case 'live': return 'bg-[#344c3d]'; // evergreen - live state
        case 'completed': return 'bg-[#738a6e]'; // sage - successful
        case 'cancelled': return 'bg-[#ebebe9]'; // mist - inactive
        default: return 'bg-[#d4c4a8]'; // sand - neutral
      }
    }
  };

  // Get text color for contrast
  const getEventTextColor = (status: CalendarEventStatus, type: 'booking' | 'concert') => {
    if (type === 'booking') {
      switch (status) {
        case 'approved':
        case 'confirmed':
        case 'completed': return 'text-white';
        case 'pending': return 'text-white';
        case 'rejected':
        case 'cancelled': return 'text-[#344c3d]'; // evergreen text on mist
        default: return 'text-[#344c3d]'; // evergreen text on sand
      }
    } else {
      switch (status) {
        case 'scheduled':
        case 'live':
        case 'completed': return 'text-white';
        case 'cancelled': return 'text-[#344c3d]'; // evergreen text on mist
        default: return 'text-[#344c3d]'; // evergreen text on sand
      }
    }
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
        <CalendarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No events found</h3>
        <p className="text-neutral-600">
          {userType === 'artist' && 'You don\'t have any upcoming gigs or booking requests.'}
          {userType === 'host' && 'You don\'t have any upcoming shows or booking requests.'}
          {userType === 'fan' && 'There are no upcoming concerts available.'}
          {userType === 'admin' && 'No events are currently scheduled.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEvents
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(event => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onEventSelect(event)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900">{event.title}</h3>
                  <Badge
                    variant="secondary"
                    className={`${getEventColor(event.status, event.type)} ${getEventTextColor(event.status, event.type)} border-0`}
                  >
                    {event.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.date.toLocaleDateString()} {event.startTime ? `at ${event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                  </div>
                  <div>{event.location}</div>
                  {event.participants.attendeeCount && (
                    <div>{event.participants.attendeeCount} attendees</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}