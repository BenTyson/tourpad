import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Mail,
  Star,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatsCard } from './StatsCard';
import { QuickActions } from './QuickActions';
import { BillingWidget } from './BillingWidget';
import { ArtistDashboardData } from './types';
import BookingList from '@/components/bookings/BookingList';
import { PastShowsSection } from '@/components/reviews/PastShowsSection';
import { PrivateReviewsSection } from '@/components/reviews/PrivateReviewsSection';

interface ArtistDashboardProps {
  data: ArtistDashboardData;
  upcomingBookings: any[];
  unreadMessages: any[];
  userId: string;
}

export function ArtistDashboard({
  data,
  upcomingBookings,
  unreadMessages,
  userId
}: ArtistDashboardProps) {
  const { user, stats, profile, musicConnections, billing } = data;

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <QuickActions userType="artist" />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Upcoming Shows"
          value={upcomingBookings.length}
          icon={<Calendar className="w-5 h-5" />}
          subtitle="Your confirmed performances"
        />

        <StatsCard
          title="Pending Responses"
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
          subtitle="From recent performances"
        />
      </div>

      {/* Performance Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Your Performance</h2>
          <p className="text-sm text-neutral-600 mt-1">Track your progress this year</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Response Rate"
              value={`${stats.responseRate}%`}
              icon={<TrendingUp className="w-5 h-5" />}
              subtitle="To booking requests"
            />

            <StatsCard
              title="Total Shows"
              value={stats.totalShows}
              icon={<Calendar className="w-5 h-5" />}
              subtitle="Completed this year"
            />

            <StatsCard
              title="Profile Views"
              value={stats.profileViews}
              icon={<TrendingUp className="w-5 h-5" />}
              subtitle="This month"
            />

            <StatsCard
              title="Average Rating"
              value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
              icon={<Star className="w-5 h-5" />}
              subtitle="Out of 5 stars"
            />
          </div>
        </div>
      </div>

      {/* Music Connections */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Music Platforms</h2>
            <p className="text-sm text-neutral-600 mt-1">Connect your streaming profiles</p>
          </div>
          <Link href="/dashboard/music">
            <Button variant="outline" size="sm">
              Manage Connections
            </Button>
          </Link>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spotify Connection */}
            <div className={`p-4 rounded-lg border ${
              musicConnections.spotify?.connected
                ? 'bg-primary-50 border-primary-200'
                : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[var(--color-evergreen)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">S</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-neutral-900">Spotify</h3>
                    <p className="text-sm text-neutral-600">
                      {musicConnections.spotify?.connected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {musicConnections.spotify?.connected && (
                  <div className="text-sm text-[var(--color-evergreen)]">
                    {musicConnections.spotify.followers || 0} followers
                  </div>
                )}
              </div>
            </div>

            {/* SoundCloud Connection */}
            <div className={`p-4 rounded-lg border ${
              musicConnections.soundcloud?.connected
                ? 'bg-secondary-50 border-secondary-200'
                : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[var(--color-sand)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">SC</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-neutral-900">SoundCloud</h3>
                    <p className="text-sm text-neutral-600">
                      {musicConnections.soundcloud?.connected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {musicConnections.soundcloud?.connected && (
                  <div className="text-sm text-[var(--color-sand)]">
                    {musicConnections.soundcloud.trackCount || 0} tracks
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">My Bookings & Performances</h2>
                <p className="text-sm text-neutral-600 mt-1">Track your booking requests and confirmed performances</p>
              </div>
              <Link href="/calendar">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </Link>
            </div>
            <div className="p-6">
              <BookingList viewType="artist" />
            </div>
          </div>

          {/* Past Shows */}
          <PastShowsSection userId={userId} userType="artist" />

          {/* Private Reviews */}
          <PrivateReviewsSection userId={userId} userType="artist" />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion - ELEVATED */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-sm border border-primary-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-primary-200">
              <h2 className="text-xl font-semibold text-primary-900">Artist Profile</h2>
              <p className="text-sm text-primary-700 mt-1">Complete your profile to attract more venues</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-800 font-medium">Basic Info</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-800 font-medium">Bio & Genres</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-800 font-medium">Music Samples</span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Incomplete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-800 font-medium">Press Photos</span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Incomplete</span>
                </div>
              </div>
              <Link href="/dashboard/profile">
                <Button variant="primary" className="w-full mt-4">
                  Update Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Tour Planning */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Tour Planning</h2>
              <p className="text-sm text-neutral-600 mt-1">Plan your next tour</p>
            </div>
            <div className="p-6">
              <Link href="/dashboard/tour-planner">
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Planning Tour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Widget at Bottom */}
      <div id="billing" className="mt-8">
        <BillingWidget
          userType="artist"
          subscriptionData={billing}
        />
      </div>
    </div>
  );
}