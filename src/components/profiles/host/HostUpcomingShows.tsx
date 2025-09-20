import React from 'react';
import {
  Calendar,
  Clock,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { mockRSVPs } from '@/data/mockData';

interface Concert {
  id: string;
  title: string;
  artistName: string;
  date: string;
  startTime: string;
  capacity: number;
  ticketPrice: number;
  status: string;
}

interface HostUpcomingShowsProps {
  concerts: Concert[];
}

export function HostUpcomingShows({ concerts }: HostUpcomingShowsProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Upcoming Shows
            </h2>
            <p className="text-neutral-600">Concerts scheduled at this venue</p>
          </div>
          <Badge variant="secondary" className="bg-sage/10 text-sage">
            {concerts?.length || 0} Shows
          </Badge>
        </div>

        <div className="space-y-4">
          {concerts && concerts.length > 0 ? (
            concerts.map((concert) => {
              const concertRSVPs = mockRSVPs.filter(rsvp => rsvp.concertId === concert.id);
              const totalGuests = concertRSVPs.reduce((sum, rsvp) => sum + rsvp.guestCount, 0);

              return (
                <div key={concert.id} className="bg-gradient-to-r from-sage/5 to-french-blue/5 rounded-lg p-6 border border-sage/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-evergreen mb-1">
                        {concert.title}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-2">
                        by {concert.artistName}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(concert.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {concert.startTime}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-sage">
                        ${concert.ticketPrice}
                      </div>
                      <div className="text-sm text-neutral-600">
                        per person
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 border border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-700">RSVPs</span>
                        <span className="text-sm text-neutral-600">
                          {concertRSVPs.length} fan{concertRSVPs.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600">Total Guests</span>
                        <span className="font-semibold text-sage">
                          {totalGuests} / {concert.capacity}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-700">Availability</span>
                        <Badge
                          variant={concert.capacity - totalGuests > 10 ? "success" : "warning"}
                          className="text-xs"
                        >
                          {concert.capacity - totalGuests > 10 ? "Open" : "Limited"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600">Spots Left</span>
                        <span className="font-semibold text-evergreen">
                          {concert.capacity - totalGuests}
                        </span>
                      </div>
                    </div>
                  </div>

                  {concertRSVPs.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-neutral-200">
                      <h4 className="text-sm font-medium text-neutral-700 mb-3">Recent RSVPs</h4>
                      <div className="space-y-2">
                        {concertRSVPs.slice(-3).map((rsvp) => (
                          <div key={rsvp.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-sage/10 rounded-full flex items-center justify-center mr-2">
                                <Users className="w-3 h-3 text-sage" />
                              </div>
                              <span className="text-neutral-700">{rsvp.fanName}</span>
                            </div>
                            <div className="text-neutral-600">
                              {rsvp.guestCount} guest{rsvp.guestCount > 1 ? 's' : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Upcoming Shows</h3>
              <p className="text-neutral-600">This venue doesn't have any concerts scheduled yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}