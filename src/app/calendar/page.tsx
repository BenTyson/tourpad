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
import { CalendarEvent } from '@/app/api/calendar/events/route';
// import CalendarHeader from '@/components/calendar/CalendarHeader';

type ViewMode = 'month' | 'week' | 'list';
type CalendarEventStatus = 'pending' | 'approved' | 'rejected' | 'confirmed' | 'completed' | 'cancelled' | 'scheduled' | 'live';

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'booking' | 'concert'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch calendar events from API
  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/calendar/events');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Convert date strings back to Date objects
        const eventsWithDates = data.events.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          startTime: event.startTime ? new Date(event.startTime) : undefined,
          endTime: event.endTime ? new Date(event.endTime) : undefined
        }));
        
        setEvents(eventsWithDates);
        setFilteredEvents(eventsWithDates);
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        setError('Failed to load calendar events');
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [session?.user]);

  // Filter events based on selected filters
  useEffect(() => {
    let filtered = [...events];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    setFilteredEvents(filtered);
  }, [events, statusFilter, typeFilter]);

  // Early returns after all hooks are called
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--color-french-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
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
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-transparent hover:bg-neutral-100 rounded-md transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
              </Link>
              <div className="h-6 w-px bg-neutral-200"></div>
              <h1 className="text-xl font-semibold text-neutral-900">Calendar</h1>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Month Navigation - Mobile Responsive */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="hover:bg-primary-50 hover:text-primary-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 min-w-0">
                {/* Show short month name on mobile */}
                <span className="sm:hidden">{monthNames[currentDate.getMonth()].substring(0, 3)} {currentDate.getFullYear()}</span>
                <span className="hidden sm:block">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hover:bg-primary-50 hover:text-primary-700"
              >
                <Filter className="w-4 h-4 mr-1" />
                <span className="hidden sm:block">Filters</span>
              </Button>
              <Badge variant="secondary" className="bg-neutral-100 text-neutral-700 text-xs sm:text-sm">
                {/* Show shortened count on mobile */}
                <span className="sm:hidden">{filteredEvents.length}</span>
                <span className="hidden sm:block">{filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}</span>
              </Badge>
            </div>
          </div>

        {/* Filters Panel - Collapsible */}
        {showFilters && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Event Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as 'all' | 'booking' | 'concert')}
                  className="w-full p-2 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="booking">Bookings</option>
                  <option value="concert">Concerts</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="w-full sm:w-auto"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}


        {/* Calendar Content */}
        {!loading && !error && viewMode === 'month' && (
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
                          onClick={() => setSelectedEvent(event)}
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
                            onClick={() => setSelectedEvent(dayEvents[2])}
                          >
                            <div className="truncate font-medium">{dayEvents[2].title}</div>
                          </div>
                        </div>
                      )}
                      {/* Show "more" indicator with responsive count */}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-neutral-500 px-1 sm:px-2">
                          <span className="sm:hidden">+{dayEvents.length - 2} more</span>
                          <span className="hidden sm:block">{dayEvents.length > 3 ? `+${dayEvents.length - 3} more` : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {!loading && !error && viewMode === 'list' && (
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
                <CalendarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No events found</h3>
                <p className="text-neutral-600">
                  {session?.user?.type === 'artist' && 'You don\'t have any upcoming gigs or booking requests.'}
                  {session?.user?.type === 'host' && 'You don\'t have any upcoming shows or booking requests.'}
                  {session?.user?.type === 'fan' && 'There are no upcoming concerts available.'}
                  {session?.user?.type === 'admin' && 'No events are currently scheduled.'}
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
                ))
            )}
          </div>
        )}

        {/* Event Details Modal - Modern UI */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
              {/* Header Image */}
              {(() => {
                const userRole = session?.user?.type || 'fan';
                
                if (userRole === 'artist') {
                  // Artists see venue photos
                  const hostData = selectedEvent.details?.host || selectedEvent.details?.booking?.host;
                  const venuePhoto = hostData?.media?.find((m: any) => m.mediaType === 'PHOTO' && m.category === 'VENUE');
                  
                  return venuePhoto ? (
                    <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex-shrink-0">
                      <img 
                        src={venuePhoto.fileUrl} 
                        alt={`${selectedEvent.participants.host} venue`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex-shrink-0"></div>
                  );
                } else {
                  // Others see artist press photos
                  const artistData = selectedEvent.details?.artist || selectedEvent.details?.booking?.artist;
                  const pressPhoto = artistData?.media?.find((m: any) => m.mediaType === 'PHOTO' && m.category === 'PRESS');
                  
                  return pressPhoto ? (
                    <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex-shrink-0">
                      <img 
                        src={pressPhoto.fileUrl} 
                        alt={`${selectedEvent.participants.artist}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex-shrink-0"></div>
                  );
                }
              })()}

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{selectedEvent.title}</h3>
                    <Badge 
                      className={`${getEventColor(selectedEvent.status, selectedEvent.type)} ${getEventTextColor(selectedEvent.status, selectedEvent.type)} border-0 text-xs font-medium px-3 py-1`}
                    >
                      {selectedEvent.status.toUpperCase()}
                    </Badge>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {/* Date & Time */}
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900">
                        {selectedEvent.date.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-neutral-600">
                        {selectedEvent.startTime ? selectedEvent.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time TBD'}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-xl">
                    <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{selectedEvent.location}</div>
                      <div className="text-xs text-neutral-600">Venue</div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="grid grid-cols-2 gap-3">
                    {selectedEvent.participants.artist && (
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <div className="text-xs text-neutral-600 mb-1">Artist</div>
                        <div className="text-sm font-medium text-neutral-900">{selectedEvent.participants.artist}</div>
                      </div>
                    )}
                    
                    {selectedEvent.participants.host && (
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <div className="text-xs text-neutral-600 mb-1">Host</div>
                        <div className="text-sm font-medium text-neutral-900">{selectedEvent.participants.host}</div>
                      </div>
                    )}
                  </div>

                  {/* Attendee Count */}
                  {selectedEvent.participants.attendeeCount && (
                    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-xl">
                      <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{selectedEvent.participants.attendeeCount} people</div>
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
                    href={selectedEvent.type === 'booking' 
                      ? `/bookings/${selectedEvent.details.id}` 
                      : `/concerts/${selectedEvent.details.id}`
                    }
                    className="flex-1"
                  >
                    <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200">
                      View Full Details
                    </button>
                  </Link>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="px-6 py-3 border border-neutral-300 hover:border-neutral-400 text-neutral-700 font-medium rounded-xl transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}