'use client';
import { CalendarEvent } from '@/app/api/calendar/events/route';

type CalendarEventStatus = 'pending' | 'approved' | 'rejected' | 'confirmed' | 'completed' | 'cancelled' | 'scheduled' | 'live';

interface CalendarMonthViewProps {
  currentDate: Date;
  filteredEvents: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
}

export function CalendarMonthView({ currentDate, filteredEvents, onEventSelect }: CalendarMonthViewProps) {
  // Generate calendar days for month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

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

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {/* Day Headers - Responsive */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} className="p-2 sm:p-4 text-center text-xs sm:text-sm font-medium text-neutral-600 bg-neutral-50 border-b border-neutral-200">
            {/* Show abbreviated on mobile, full on desktop */}
            <span className="hidden sm:block">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const dayEvents = getEventsForDate(day);

          return (
            <div
              key={index}
              className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border-b border-r border-neutral-200 ${
                isCurrentMonth ? 'bg-white' : 'bg-neutral-50'
              } ${isToday ? 'ring-2 ring-primary-500 ring-inset' : ''}`}
            >
              <div className={`text-xs sm:text-sm font-medium mb-1 ${
                isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'
              } ${isToday ? 'text-primary-600' : ''}`}>
                {day.getDate()}
              </div>

              {/* Event Indicators - Mobile Optimized */}
              <div className="space-y-0.5 sm:space-y-1">
                {/* Show fewer events on mobile */}
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event.status, event.type)} ${getEventTextColor(event.status, event.type)}`}
                    onClick={() => onEventSelect(event)}
                  >
                    <div className="truncate font-medium">
                      {/* Show abbreviated titles on mobile */}
                      <span className="hidden sm:block">{event.title}</span>
                      <span className="sm:hidden">{event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}</span>
                    </div>
                  </div>
                ))}
                {/* Show third event only on desktop */}
                {dayEvents.length > 2 && (
                  <div className="hidden sm:block">
                    <div
                      key={dayEvents[2].id}
                      className={`text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(dayEvents[2].status, dayEvents[2].type)} ${getEventTextColor(dayEvents[2].status, dayEvents[2].type)}`}
                      onClick={() => onEventSelect(dayEvents[2])}
                    >
                      <div className="truncate font-medium">{dayEvents[2].title}</div>
                    </div>
                  </div>
                )}
                {/* Show overflow indicator */}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-neutral-500 font-medium hidden sm:block">
                    +{dayEvents.length - 3} more
                  </div>
                )}
                {/* Show overflow indicator on mobile */}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-neutral-500 font-medium sm:hidden">
                    +{dayEvents.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}