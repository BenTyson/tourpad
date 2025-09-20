import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Mail,
  Star,
  Users,
  Plus,
  Home,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatsCard } from './StatsCard';
import { QuickActions } from './QuickActions';
import { FanDashboardData } from './types';

interface FanDashboardProps {
  data: FanDashboardData;
  upcomingBookings: any[];
  unreadMessages: any[];
  fanConcerts: any[];
  userId: string;
  formatDate: (date: Date) => string;
}

export function FanDashboard({
  data,
  upcomingBookings,
  unreadMessages,
  fanConcerts,
  userId,
  formatDate
}: FanDashboardProps) {
  const { user, stats, profile } = data;

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <QuickActions userType="fan" />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="My Reservations"
          value={upcomingBookings.length}
          icon={<Calendar className="w-5 h-5" />}
          subtitle="Upcoming concerts you've reserved"
        />

        <StatsCard
          title="Available Concerts"
          value={fanConcerts.length}
          icon={<Clock className="w-5 h-5" />}
          subtitle="New concerts you can attend"
        />

        <StatsCard
          title="Unread Messages"
          value={unreadMessages.length}
          icon={<Mail className="w-5 h-5" />}
          subtitle="New conversations"
        />

        <StatsCard
          title="Concerts Attended"
          value={stats.totalShows}
          icon={<Star className="w-5 h-5" />}
          subtitle="This year"
        />
      </div>

      {/* Discovery Section */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Discover Music</h2>
            <p className="text-sm text-neutral-600 mt-1">Find new artists and intimate venues</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/artists">
              <Button variant="outline" size="sm">
                <Music className="w-4 h-4 mr-2" />
                Browse Artists
              </Button>
            </Link>
            <Link href="/hosts">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Find Venues
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-6">
          {profile.favoriteGenres && profile.favoriteGenres.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Your Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {profile.favoriteGenres.map((genre, index) => (
                  <Badge key={index} variant="default">{genre}</Badge>
                ))}
              </div>
            </div>
          )}

          {profile.location && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Your Location:</span> {profile.location.city}, {profile.location.state}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Concert Reservations */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Your Concert Reservations</h2>
                <p className="text-sm text-neutral-600 mt-1">Concerts you've reserved</p>
              </div>
              <Link href="/calendar">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </Link>
            </div>
            <div className="p-6">
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-900">
                            {'title' in booking ? booking.title : 'Concert'}
                          </h3>
                          <div className="flex items-center text-sm text-neutral-600 space-x-4">
                            <span>{
                              'date' in booking && 'startTime' in booking ? formatDate(new Date(booking.date + 'T' + booking.startTime)) : 'TBD'
                            }</span>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {'capacity' in booking ? booking.capacity : 'TBD'} capacity
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="success" className="bg-primary-100 text-primary-700">
                          Reserved
                        </Badge>
                        <Link href={`/concerts/${booking.id}`}>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No upcoming concerts</h3>
                  <p className="text-neutral-600 mb-6">Discover and book your first house concert experience</p>
                  <Link href='/artists'>
                    <Button className="bg-primary-600 text-white hover:bg-primary-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Concerts
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Available Concerts */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Available Concerts</h2>
                <p className="text-sm text-neutral-600 mt-1">New intimate concerts in your area</p>
              </div>
              <Link href="/artists">
                <Button size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="p-6">
              {fanConcerts.length > 0 ? (
                <div className="space-y-4">
                  {fanConcerts.slice(0, 3).map((concert) => (
                    <div key={concert.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Music className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-900">{concert.title}</h3>
                          <div className="flex items-center text-sm text-neutral-600 space-x-4">
                            <span>{formatDate(new Date(concert.date))}</span>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {concert.capacity} capacity
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="default">
                          Available
                        </Badge>
                        <Link href={`/concerts/${concert.id}`}>
                          <Button size="sm">
                            RSVP
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Music className="w-6 h-6 text-neutral-400" />
                  </div>
                  <p className="text-sm text-neutral-600">No concerts available in your area</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Music Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Music Preferences</h2>
              <p className="text-sm text-neutral-600 mt-1">Personalize your experience</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Favorite Genres</h4>
                  {profile.favoriteGenres && profile.favoriteGenres.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {profile.favoriteGenres.map((genre, index) => (
                        <Badge key={index} variant="default" size="sm">{genre}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No genres selected</p>
                  )}
                </div>
                <Link href="/dashboard/fan/preferences">
                  <Button variant="outline" className="w-full">
                    Update Preferences
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Fan Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Your Activity</h2>
              <p className="text-sm text-neutral-600 mt-1">Your concert experience</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <StatsCard
                  title="Concerts Attended"
                  value={stats.totalShows}
                  subtitle="This year"
                />

                <StatsCard
                  title="Profile Views"
                  value={stats.profileViews}
                  subtitle="This month"
                />

                <StatsCard
                  title="Member Since"
                  value={new Date(user.createdAt).getFullYear()}
                  subtitle="Years of membership"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}