import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Mail,
  Star,
  Home,
  Users,
  MapPin,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatsCard } from './StatsCard';
import { QuickActions } from './QuickActions';
import { HostDashboardData } from './types';
import BookingList from '@/components/bookings/BookingList';
import RSVPManagement from '@/components/host/RSVPManagement';
import { PastShowsSection } from '@/components/reviews/PastShowsSection';
import { PrivateReviewsSection } from '@/components/reviews/PrivateReviewsSection';

interface HostDashboardProps {
  data: HostDashboardData;
  upcomingBookings: any[];
  unreadMessages: any[];
  userId: string;
}

export function HostDashboard({
  data,
  upcomingBookings,
  unreadMessages,
  userId
}: HostDashboardProps) {
  const { user, stats, profile } = data;

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <QuickActions userType="host" />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Upcoming Shows"
          value={upcomingBookings.length}
          icon={<Calendar className="w-5 h-5" />}
          subtitle="Shows scheduled at your venue"
        />

        <StatsCard
          title="New Requests"
          value="TBD"
          icon={<Clock className="w-5 h-5" />}
          subtitle="Booking requests awaiting response"
        />

        <StatsCard
          title="Unread Messages"
          value={unreadMessages.length}
          icon={<Mail className="w-5 h-5" />}
          subtitle="New conversations"
        />

        <StatsCard
          title="Average Rating"
          value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
          icon={<Star className="w-5 h-5" />}
          subtitle="From recent events"
        />
      </div>

      {/* Venue Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Venue Overview</h2>
            <p className="text-sm text-neutral-600 mt-1">Your venue details and capacity</p>
          </div>
          <Link href="/dashboard/venue">
            <Button variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Manage Venue
            </Button>
          </Link>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{profile.venueName}</h3>
              <p className="text-sm text-gray-600">{profile.venueType}</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{profile.capacity}</h3>
              <p className="text-sm text-gray-600">Max Capacity</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{profile.city}, {profile.state}</h3>
              <p className="text-sm text-gray-600">Location</p>
            </div>
          </div>

          {/* Lodging Options */}
          {profile.lodgingOptions && profile.lodgingOptions.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Lodging Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.lodgingOptions.slice(0, 2).map((option: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900">{option.type}</h5>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      ${option.pricePerNight}/night
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Booking Requests & Shows</h2>
                <p className="text-sm text-neutral-600 mt-1">Manage booking requests and upcoming shows at your venue</p>
              </div>
              <Link href="/calendar">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </Link>
            </div>
            <div className="p-6">
              <BookingList viewType="host" />
            </div>
          </div>

          {/* RSVP Management */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">RSVP Requests</h2>
                <p className="text-sm text-neutral-600 mt-1">Manage fan requests for your concerts</p>
              </div>
            </div>
            <div className="p-6">
              <RSVPManagement />
            </div>
          </div>

          {/* Past Shows */}
          <PastShowsSection userId={userId} userType="host" />

          {/* Private Reviews */}
          <PrivateReviewsSection userId={userId} userType="host" />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Artist Search */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Find Artists</h2>
              <p className="text-sm text-neutral-600 mt-1">Discover new talent for your venue</p>
            </div>
            <div className="p-6">
              <Link href="/artists">
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Artists
                </Button>
              </Link>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Your Stats</h2>
              <p className="text-sm text-neutral-600 mt-1">Track your hosting performance</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <StatsCard
                  title="Response Rate"
                  value={`${stats.responseRate}%`}
                  subtitle="To booking requests"
                />

                <StatsCard
                  title="Shows Hosted"
                  value={stats.totalShows}
                  subtitle="This year"
                />

                <StatsCard
                  title="Profile Views"
                  value={stats.profileViews}
                  subtitle="This month"
                />
              </div>
            </div>
          </div>

          {/* Venue Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Venue Settings</h2>
              <p className="text-sm text-neutral-600 mt-1">Manage your venue details</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Basic Info</span>
                  <span className="text-xs text-green-600">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Photos</span>
                  <span className="text-xs text-green-600">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amenities</span>
                  <span className="text-xs text-yellow-600">Incomplete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lodging Options</span>
                  <span className="text-xs text-green-600">Complete</span>
                </div>
              </div>
              <Link href="/dashboard/venue">
                <Button variant="outline" className="w-full mt-4">
                  Update Venue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}