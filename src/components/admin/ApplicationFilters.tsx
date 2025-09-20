'use client';
import { HomeIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

interface ApplicationFiltersProps {
  filter: 'all' | 'host' | 'artist';
  onFilterChange: (filter: 'all' | 'host' | 'artist') => void;
  applicationCounts: {
    all: number;
    host: number;
    artist: number;
  };
}

export function ApplicationFilters({ filter, onFilterChange, applicationCounts }: ApplicationFiltersProps) {
  return (
    <div className="mb-6">
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onFilterChange('all')}
        >
          All ({applicationCounts.all})
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
            filter === 'host'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onFilterChange('host')}
        >
          <HomeIcon className="w-4 h-4 mr-2" />
          Hosts ({applicationCounts.host})
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
            filter === 'artist'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onFilterChange('artist')}
        >
          <MusicalNoteIcon className="w-4 h-4 mr-2" />
          Artists ({applicationCounts.artist})
        </button>
      </div>
    </div>
  );
}