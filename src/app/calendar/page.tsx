'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  List,
  Grid3X3,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockBookings, mockArtists, mockHosts } from '@/data/mockData';
import { testConcerts } from '@/data/realTestData';

type ViewMode = 'month' | 'week' | 'list';
type EventType = 'booking' | 'concert';
type EventStatus = 'approved' | 'pending' | 'requested' | 'upcoming' | 'sold_out' | 'cancelled' | 'completed';

interface CalendarEvent {
  id: string;
  type: EventType;
  title: string;
  date: Date;
  status: EventStatus;
  location: string;
  participants: {
    artist?: string;
    host?: string;
    attendeeCount?: number;
  };
  details: any; // Original booking or concert data
}

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // If not authenticated, redirect to login
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Please sign in to view your calendar.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get user info from session
  const userRole = session.user.type as 'host' | 'artist' | 'admin' | 'fan';
  const selectedUserId = session.user.id;

  // Map session userId to mockData ID for artists and hosts
  let profileId = selectedUserId;
  if (userRole === 'artist') {
    const artist = mockArtists.find(a => a.userId === selectedUserId);
    profileId = artist?.id || selectedUserId;
  } else if (userRole === 'host') {
    const host = mockHosts.find(h => h.userId === selectedUserId);
    profileId = host?.id || selectedUserId;
  }

  // Load and filter events based on user role
  useEffect(() => {
    const allEvents: CalendarEvent[] = [];

    // Add bookings based on user role
    if (userRole === 'artist' || userRole === 'admin') {
      const userBookings = userRole === 'admin' 
        ? mockBookings 
        : mockBookings.filter(booking => booking.artistId === selectedUserId);
      
      userBookings.forEach(booking => {
        allEvents.push({
          id: `booking-${booking.id}`,
          type: 'booking',
          title: booking.artist.name,
          date: new Date(booking.eventDate),
          status: booking.status as EventStatus,
          location: `${booking.host.city}, ${booking.host.state}`,
          participants: {
            artist: booking.artist.name,
            host: booking.host.name,
            attendeeCount: booking.guestCount
          },
          details: booking
        });
      });
    }

    if (userRole === 'host' || userRole === 'admin') {
      const hostBookings = userRole === 'admin'
        ? mockBookings
        : mockBookings.filter(booking => booking.hostId === selectedUserId);
      
      if (userRole === 'host') {
        // For hosts, avoid duplicating events if they're also artists
        hostBookings.forEach(booking => {
          const existingEvent = allEvents.find(e => e.id === `booking-${booking.id}`);
          if (!existingEvent) {
            allEvents.push({
              id: `booking-${booking.id}`,
              type: 'booking',
              title: booking.artist.name,
              date: new Date(booking.eventDate),
              status: booking.status as EventStatus,
              location: booking.host.name,
              participants: {
                artist: booking.artist.name,
                host: booking.host.name,
                attendeeCount: booking.guestCount
              },
              details: booking
            });
          }
        });
      }
    }

    // Add concerts for fans and admin
    if (userRole === 'fan' || userRole === 'admin') {
      testConcerts.forEach(concert => {
        allEvents.push({
          id: `concert-${concert.id}`,
          type: 'concert',
          title: concert.title,
          date: new Date(concert.date),
          status: concert.status as EventStatus,
          location: (concert as any).host?.venueName || 'TBD',
          participants: {
            artist: (concert as any).artist?.name || 'TBD',
            host: (concert as any).host?.venueName || 'TBD',
            attendeeCount: concert.attendees.length
          },
          details: concert
        });
      });
    }

    setEvents(allEvents);
    setFilteredEvents(allEvents);
  }, [userRole, selectedUserId, profileId]);

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
  const getEventColor = (status: EventStatus, type: EventType) => {
    if (type === 'booking') {
      switch (status) {
        case 'approved': return 'bg-[#738a6e]'; // sage - successful
        case 'pending': return 'bg-[#8ea58c]'; // french blue - in progress
        case 'requested': return 'bg-[#d4c4a8]'; // sand - neutral/awaiting
        default: return 'bg-[#ebebe9]'; // mist - inactive
      }
    } else {
      switch (status) {
        case 'upcoming': return 'bg-[#8ea58c]'; // french blue - active
        case 'sold_out': return 'bg-[#344c3d]'; // evergreen - final state
        case 'completed': return 'bg-[#738a6e]'; // sage - successful
        case 'cancelled': return 'bg-[#ebebe9]'; // mist - inactive
        default: return 'bg-[#d4c4a8]'; // sand - neutral
      }
    }
  };

  // Get text color for contrast
  const getEventTextColor = (status: EventStatus, type: EventType) => {
    if (type === 'booking') {
      switch (status) {
        case 'approved': return 'text-white';
        case 'pending': return 'text-white';
        case 'requested': return 'text-[#344c3d]'; // evergreen text on sand
        default: return 'text-[#344c3d]'; // evergreen text on mist
      }
    } else {
      switch (status) {
        case 'upcoming': return 'text-white';
        case 'sold_out': return 'text-white';
        case 'completed': return 'text-white';
        case 'cancelled': return 'text-[#344c3d]'; // evergreen text on mist
        default: return 'text-[#344c3d]'; // evergreen text on sand
      }
    }
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Calendar</h1>
                <p className="text-neutral-600 mt-1">
                  {userRole === 'artist' && 'Your upcoming gigs and booking requests'}
                  {userRole === 'host' && 'Shows you\'re hosting and booking requests'}
                  {userRole === 'fan' && 'Available concerts and your reservations'}
                  {userRole === 'admin' && 'All bookings and concerts'}
                </p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <div className="flex rounded-lg border border-neutral-200 bg-white p-1">
                <Button
                  variant={viewMode === 'month' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className={viewMode === 'month' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:text-neutral-900'}
                >
                  <Grid3X3 className="w-4 h-4 mr-1" />
                  Month
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:text-neutral-900'}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="hover:bg-primary-50 hover:text-primary-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold text-neutral-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="hover:bg-primary-50 hover:text-primary-700"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-neutral-100 text-neutral-700">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        {viewMode === 'month' ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-4 text-center text-sm font-medium text-neutral-600 bg-neutral-50 border-b border-neutral-200">
                  {day}
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
                    className={`min-h-[100px] p-2 border-b border-r border-neutral-200 ${
                      isCurrentMonth ? 'bg-white' : 'bg-neutral-50'
                    } ${isToday ? 'ring-2 ring-primary-500 ring-inset' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'
                    } ${isToday ? 'text-primary-600' : ''}`}>
                      {day.getDate()}
                    </div>
                    
                    {/* Event Indicators */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event.status, event.type)} ${getEventTextColor(event.status, event.type)}`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="truncate font-medium">{event.title}</div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-neutral-500 px-2">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
                <CalendarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No events found</h3>
                <p className="text-neutral-600">
                  {userRole === 'artist' && 'You don\'t have any upcoming gigs or booking requests.'}
                  {userRole === 'host' && 'You don\'t have any upcoming shows or booking requests.'}
                  {userRole === 'fan' && 'There are no upcoming concerts available.'}
                  {userRole === 'admin' && 'No events are currently scheduled.'}
                </p>
              </div>
            ) : (
              filteredEvents
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map(event => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
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
                            {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div>{event.location}</div>
                          {event.participants.attendeeCount && (
                            <div>{event.participants.attendeeCount} attendees</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-neutral-900">{selectedEvent.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEvent(null)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Badge 
                      variant="secondary" 
                      className={`${getEventColor(selectedEvent.status, selectedEvent.type)} ${getEventTextColor(selectedEvent.status, selectedEvent.type)} border-0`}
                    >
                      {selectedEvent.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-neutral-700 mb-1">Date & Time</div>
                    <div className="text-neutral-900">
                      {selectedEvent.date.toLocaleDateString()} at {selectedEvent.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-neutral-700 mb-1">Location</div>
                    <div className="text-neutral-900">{selectedEvent.location}</div>
                  </div>
                  
                  {selectedEvent.participants.artist && (
                    <div>
                      <div className="text-sm font-medium text-neutral-700 mb-1">Artist</div>
                      <div className="text-neutral-900">{selectedEvent.participants.artist}</div>
                    </div>
                  )}
                  
                  {selectedEvent.participants.host && (
                    <div>
                      <div className="text-sm font-medium text-neutral-700 mb-1">Host</div>
                      <div className="text-neutral-900">{selectedEvent.participants.host}</div>
                    </div>
                  )}
                  
                  {selectedEvent.participants.attendeeCount && (
                    <div>
                      <div className="text-sm font-medium text-neutral-700 mb-1">Attendees</div>
                      <div className="text-neutral-900">{selectedEvent.participants.attendeeCount} people</div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Link 
                    href={selectedEvent.type === 'booking' 
                      ? `/bookings/${selectedEvent.details.id}` 
                      : `/concerts/${selectedEvent.details.id}`
                    }
                    className="flex-1"
                  >
                    <Button className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedEvent(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}