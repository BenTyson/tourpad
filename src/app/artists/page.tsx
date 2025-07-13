'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { mockArtists } from '@/data/mockData';

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minYearsActive: '',
    maxTourMonths: '',
    requirements: {
      requireHomeStay: false,
      ownSoundSystem: false,
      travelWithAnimals: false
    },
    cancellationPolicy: '' as '' | 'strict' | 'flexible'
  });

  // Filter artists based on search and filters
  const filteredArtists = mockArtists.filter(artist => {
    // Only show approved artists
    if (!artist.approved) return false;

    const matchesSearch = searchQuery === '' || 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYearsActive = !filters.minYearsActive || 
      artist.yearsActive >= parseInt(filters.minYearsActive);

    const matchesTourMonths = !filters.maxTourMonths || 
      artist.tourMonthsPerYear <= parseInt(filters.maxTourMonths);

    const matchesRequirements = Object.entries(filters.requirements).every(([requirement, mustHave]) => {
      if (!mustHave) return true;
      return artist[requirement as keyof typeof artist];
    });

    const matchesCancellationPolicy = !filters.cancellationPolicy || 
      artist.cancellationPolicy === filters.cancellationPolicy;

    return matchesSearch && matchesYearsActive && matchesTourMonths && matchesRequirements && matchesCancellationPolicy;
  });

  const updateRequirementFilter = (requirement: string, value: boolean) => {
    setFilters({
      ...filters,
      requirements: {
        ...filters.requirements,
        [requirement]: value
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Artists
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with talented, touring musicians ready to perform intimate shows at your venue.
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
                    placeholder="Search by artist name, genre, or style..."
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
                  {/* Experience & Touring */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Experience & Touring</h3>
                    <div className="space-y-3">
                      <Input
                        label="Min Years Active"
                        type="number"
                        value={filters.minYearsActive}
                        onChange={(e) => setFilters({ ...filters, minYearsActive: e.target.value })}
                        placeholder="5"
                      />
                      <Input
                        label="Max Months Touring/Year"
                        type="number"
                        value={filters.maxTourMonths}
                        onChange={(e) => setFilters({ ...filters, maxTourMonths: e.target.value })}
                        placeholder="8"
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Artist Requirements</h3>
                    <div className="space-y-3">
                      {Object.entries({
                        requireHomeStay: 'Needs Lodging',
                        ownSoundSystem: 'Has Sound System',
                        travelWithAnimals: 'Travels with Pets'
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.requirements[key as keyof typeof filters.requirements]}
                            onChange={(e) => updateRequirementFilter(key, e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Policies */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Cancellation Policy</h3>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'Any' },
                        { value: 'flexible', label: 'Flexible' },
                        { value: 'strict', label: 'Strict' }
                      ].map(({ value, label }) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="radio"
                            name="cancellationPolicy"
                            value={value}
                            checked={filters.cancellationPolicy === value}
                            onChange={(e) => setFilters({ ...filters, cancellationPolicy: e.target.value as any })}
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
            {filteredArtists.length} Artist{filteredArtists.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {/* Artist Grid */}
        {filteredArtists.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} showBookingButton={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No artists match your search criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  minYearsActive: '',
                  maxTourMonths: '',
                  requirements: {
                    requireHomeStay: false,
                    ownSoundSystem: false,
                    travelWithAnimals: false
                  },
                  cancellationPolicy: ''
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