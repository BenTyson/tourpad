'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft,
  Filter,
  Search,
  MapPin,
  List,
  Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Dynamic import for MapContainer to avoid SSR issues
const TourPadMapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  { ssr: false }
);

type ViewMode = 'map' | 'list';

export default function MapPage() {
  const { data: session, status } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [showFilters, setShowFilters] = useState(false);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Please sign in to explore venues on the map.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const userRole = session.user.type as 'host' | 'artist' | 'admin' | 'fan';

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Venue Map</h1>
                <p className="text-neutral-600 text-sm">
                  {userRole === 'artist' && 'Discover venues for your next tour'}
                  {userRole === 'host' && 'Explore the TourPad host community'}
                  {userRole === 'fan' && 'Find upcoming concerts near you'}
                  {userRole === 'admin' && 'Platform venue overview'}
                </p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-3">
              <div className="flex rounded-lg border border-neutral-200 bg-white p-1">
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={viewMode === 'map' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:text-neutral-900'}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Map
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:text-neutral-900'}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-neutral-300 hover:bg-neutral-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 h-full">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Filters</h2>
                
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Search Location
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="City, State"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Venue Type */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-neutral-700 mb-3">Venue Type</h3>
                  <div className="space-y-2">
                    {['Home/Living Room', 'Other', 'Loft/Warehouse'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-neutral-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Capacity */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-neutral-700 mb-3">Capacity</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-neutral-600">Under 25 people</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-neutral-600">25-50 people</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-neutral-600">50+ people</span>
                    </label>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-neutral-300 hover:bg-neutral-50"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}

          {/* Map/List Content */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {viewMode === 'map' ? (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden h-full">
                <TourPadMapContainer 
                  className="h-full"
                  initialCenter={[39.8283, -98.5795]}
                  initialZoom={5}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 h-full overflow-y-auto">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Venue List</h2>
                <p className="text-neutral-600">List view coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}