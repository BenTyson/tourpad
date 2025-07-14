'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { HostCard } from '@/components/cards/HostCard';
import { mockHosts } from '@/data/mockData';

export default function HostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAttendance: '',
    maxDoorFee: '',
    amenities: {
      parking: false,
      wifi: false,
      soundSystem: false,
      kidFriendly: false,
      bnbOffered: false,
      accessible: false
    }
  });

  // Filter hosts based on search and filters
  const filteredHosts = mockHosts.filter(host => {
    const matchesSearch = searchQuery === '' || 
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAttendance = !filters.minAttendance || 
      host.showSpecs.avgAttendance >= parseInt(filters.minAttendance);

    const matchesDoorFee = !filters.maxDoorFee || 
      host.showSpecs.avgDoorFee <= parseInt(filters.maxDoorFee);

    const matchesAmenities = Object.entries(filters.amenities).every(([amenity, required]) => {
      if (!required) return true;
      return host.amenities[amenity as keyof typeof host.amenities];
    });

    return matchesSearch && matchesAttendance && matchesDoorFee && matchesAmenities;
  });

  const updateAmenityFilter = (amenity: string, value: boolean) => {
    setFilters({
      ...filters,
      amenities: {
        ...filters.amenities,
        [amenity]: value
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Host
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover welcoming venues and passionate hosts ready to share their space with touring artists.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by venue name, city, or state..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Capacity & Pricing */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Capacity & Pricing</h3>
                    <div className="space-y-3">
                      <Input
                        label="Min Attendance"
                        type="number"
                        value={filters.minAttendance}
                        onChange={(e) => setFilters({ ...filters, minAttendance: e.target.value })}
                        placeholder="20"
                      />
                      <Input
                        label="Max Door Fee ($)"
                        type="number"
                        value={filters.maxDoorFee}
                        onChange={(e) => setFilters({ ...filters, maxDoorFee: e.target.value })}
                        placeholder="25"
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-3">Required Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries({
                        parking: 'Parking',
                        wifi: 'WiFi',
                        soundSystem: 'Sound System',
                        kidFriendly: 'Kid Friendly',
                        bnbOffered: 'Overnight Stay',
                        accessible: 'Wheelchair Accessible'
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.amenities[key as keyof typeof filters.amenities]}
                            onChange={(e) => updateAmenityFilter(key, e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredHosts.length} Host{filteredHosts.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {/* Host Grid */}
        {filteredHosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHosts.map((host) => (
              <HostCard key={host.id} host={host} showBookingButton={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hosts match your search criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  minAttendance: '',
                  maxDoorFee: '',
                  amenities: {
                    parking: false,
                    wifi: false,
                    soundSystem: false,
                    kidFriendly: false,
                    bnbOffered: false,
                    accessible: false
                  }
                });
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}