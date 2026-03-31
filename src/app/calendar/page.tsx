'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CalendarEvent } from '@/app/api/calendar/events/route';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarNavigationControls } from '@/components/calendar/CalendarNavigationControls';
import { CalendarFiltersPanel } from '@/components/calendar/CalendarFiltersPanel';
import { CalendarMonthView } from '@/components/calendar/CalendarMonthView';
import { CalendarListView } from '@/components/calendar/CalendarListView';
import { EventDetailModal } from '@/components/calendar/EventDetailModal';

type ViewMode = 'month' | 'list';

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
      } catch {
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


  return (
    <div className="min-h-screen bg-white">
      <CalendarHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <CalendarNavigationControls
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          eventCount={filteredEvents.length}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {showFilters && (
          <CalendarFiltersPanel
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            onStatusFilterChange={setStatusFilter}
            onTypeFilterChange={setTypeFilter}
            onClearFilters={() => {
              setStatusFilter('all');
              setTypeFilter('all');
            }}
          />
        )}


        {!loading && !error && viewMode === 'month' && (
          <CalendarMonthView
            currentDate={currentDate}
            filteredEvents={filteredEvents}
            onEventSelect={setSelectedEvent}
          />
        )}

        {!loading && !error && viewMode === 'list' && (
          <CalendarListView
            filteredEvents={filteredEvents}
            userType={session?.user?.type}
            onEventSelect={setSelectedEvent}
          />
        )}

        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            userType={session?.user?.type}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </div>
  );
}