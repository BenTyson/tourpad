import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export type CalendarEventType = 'booking' | 'concert';
export type CalendarEventStatus = 'pending' | 'approved' | 'rejected' | 'confirmed' | 'completed' | 'cancelled' | 'scheduled' | 'live';

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  title: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  status: CalendarEventStatus;
  location: string;
  participants: {
    artist?: string;
    host?: string;
    attendeeCount?: number;
  };
  details: any;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type') as CalendarEventType | null;
    const status = searchParams.get('status');

    const rawUserRole = session.user.userType || session.user.type || 'fan';
    const userRole = rawUserRole.toLowerCase() as 'artist' | 'host' | 'fan' | 'admin';
    const userId = session.user.id;
    
    console.log('Calendar API Debug:', { 
      userId, 
      rawUserRole,
      userRole, 
      email: session.user.email,
      userType: session.user.userType,
      type: session.user.type
    });

    // First, find the user's artist or host profile IDs
    const artist = await prisma.artist.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    
    const host = await prisma.host.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    
    console.log('Calendar API Profiles:', { artistId: artist?.id, hostId: host?.id });

    const events: CalendarEvent[] = [];

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // Fetch bookings based on user role
    if (!type || type === 'booking') {
      let bookingFilter: any = {};
      
      if (userRole === 'artist' && artist) {
        bookingFilter.artistId = artist.id;
      } else if (userRole === 'host' && host) {
        bookingFilter.hostId = host.id;
      } else if (userRole !== 'admin') {
        // Fans don't see bookings directly, or user has no profile
        bookingFilter = null;
      }

      if (bookingFilter !== null) {
        if (Object.keys(dateFilter).length > 0) {
          bookingFilter.requestedDate = dateFilter;
        }

        if (status) {
          bookingFilter.status = status.toUpperCase();
        }

        const bookings = await prisma.booking.findMany({
          where: bookingFilter,
          include: {
            artist: {
              include: {
                user: true,
                media: true
              }
            },
            host: {
              include: {
                user: true,
                media: true
              }
            }
          },
          orderBy: {
            requestedDate: 'asc'
          }
        });

        // Convert bookings to calendar events
        bookings.forEach(booking => {
          // Context-aware title: Artists see venue names, others see artist names
          const title = userRole === 'artist' 
            ? booking.host.venueName || booking.host.user.name || 'Unknown Venue'
            : booking.artist.user.name || booking.artist.stageName || 'Unknown Artist';
            
          events.push({
            id: `booking-${booking.id}`,
            type: 'booking',
            title,
            date: booking.requestedDate,
            startTime: booking.requestedTime || undefined,
            endTime: undefined,
            status: booking.status.toLowerCase() as CalendarEventStatus,
            location: `${booking.host.city}, ${booking.host.state}`,
            participants: {
              artist: booking.artist.user.name || booking.artist.stageName,
              host: booking.host.user.name || booking.host.venueName,
              attendeeCount: booking.expectedAttendance || undefined
            },
            details: booking
          });
        });
      }
    }

    // Fetch concerts based on user role
    if (!type || type === 'concert') {
      let concertFilter: any = {};
      
      if (userRole === 'artist' && artist) {
        concertFilter.booking = {
          artistId: artist.id
        };
      } else if (userRole === 'host' && host) {
        concertFilter.booking = {
          hostId: host.id
        };
      } else if (userRole === 'fan') {
        // Fans see all public concerts
        concertFilter.isPrivate = false;
      }
      // Admin sees all concerts (no additional filter)

      if (Object.keys(dateFilter).length > 0) {
        concertFilter.date = dateFilter;
      }

      if (status) {
        concertFilter.status = status.toUpperCase();
      }

      const concerts = await prisma.concert.findMany({
        where: concertFilter,
        include: {
          booking: {
            include: {
              artist: {
                include: {
                  user: true,
                  media: true
                }
              },
              host: {
                include: {
                  user: true,
                  media: true
                }
              }
            }
          },
          rsvps: userRole === 'fan' ? {
            where: {
              fanId: userId
            }
          } : true
        },
        orderBy: {
          date: 'asc'
        }
      });

      // Convert concerts to calendar events
      concerts.forEach(concert => {
        const rsvpCount = Array.isArray(concert.rsvps) ? concert.rsvps.length : 0;
        
        // Context-aware title: Use custom concert title, or fallback based on user role
        let title = concert.title;
        if (!title) {
          title = userRole === 'artist' 
            ? `Concert at ${concert.booking.host.venueName || concert.booking.host.user.name}`
            : `${concert.booking.artist.user.name} Concert`;
        }
        
        events.push({
          id: `concert-${concert.id}`,
          type: 'concert',
          title,
          date: concert.date,
          startTime: concert.startTime,
          endTime: concert.endTime || undefined,
          status: concert.status.toLowerCase() as CalendarEventStatus,
          location: concert.booking.host.venueName || `${concert.booking.host.city}, ${concert.booking.host.state}`,
          participants: {
            artist: concert.booking.artist.user.name || concert.booking.artist.stageName,
            host: concert.booking.host.user.name || concert.booking.host.venueName,
            attendeeCount: rsvpCount
          },
          details: {
            ...concert,
            bookingId: concert.bookingId
          }
        });
      });
    }

    // Sort events by date
    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // For admin users, deduplicate events (prioritize concerts over bookings)
    let finalEvents = events;
    console.log('Checking admin deduplication:', { userRole, isAdmin: userRole === 'admin' });
    if (userRole === 'admin') {
      console.log('Admin deduplication - Original events:', events.length);
      const eventMap = new Map();
      
      // Process events, keeping concerts over bookings when they have the same booking ID
      events.forEach(event => {
        const bookingId = event.type === 'booking' ? event.details?.id : event.details?.bookingId;
        console.log(`Processing event: ${event.id}, type: ${event.type}, bookingId: ${bookingId}, title: ${event.title}`);
        
        if (bookingId) {
          const existing = eventMap.get(bookingId);
          if (!existing || (event.type === 'concert' && existing.type === 'booking')) {
            console.log(`Setting event for bookingId ${bookingId}: ${event.type} - ${event.title}`);
            eventMap.set(bookingId, event);
          } else {
            console.log(`Skipping event for bookingId ${bookingId}: ${event.type} (keeping ${existing.type})`);
          }
        } else {
          // Events without booking IDs are kept as-is
          eventMap.set(event.id, event);
        }
      });
      
      finalEvents = Array.from(eventMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
      console.log('Admin deduplication - Final events:', finalEvents.length);
    }

    return NextResponse.json({
      events: finalEvents,
      total: finalEvents.length,
      userRole,
      filters: {
        startDate,
        endDate,
        type,
        status
      }
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}