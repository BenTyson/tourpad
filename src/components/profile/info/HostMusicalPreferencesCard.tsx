'use client';
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { X } from 'lucide-react';
import { HostProfile } from '../types';

const GENRE_OPTIONS = [
  'Folk', 'Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Classical', 'Electronic',
  'Hip Hop', 'R&B', 'Soul', 'Funk', 'Reggae', 'World', 'Experimental', 'Ambient'
];

interface HostMusicalPreferencesCardProps {
  hostProfile: HostProfile;
  updateHostProfile: (updates: Partial<HostProfile>) => void;
}

export default function HostMusicalPreferencesCard({
  hostProfile,
  updateHostProfile
}: HostMusicalPreferencesCardProps) {
  const [customGenreInput, setCustomGenreInput] = useState('');

  const addPreferredGenre = (genre: string) => {
    if (!hostProfile.preferredGenres.includes(genre)) {
      updateHostProfile({ preferredGenres: [...hostProfile.preferredGenres, genre] });
    }
  };

  const removePreferredGenre = (genre: string) => {
    updateHostProfile({ preferredGenres: hostProfile.preferredGenres.filter(g => g !== genre) });
  };

  const addCustomGenre = () => {
    const genre = customGenreInput.trim();
    if (genre && !hostProfile.preferredGenres.includes(genre)) {
      updateHostProfile({ preferredGenres: [...hostProfile.preferredGenres, genre] });
      setCustomGenreInput('');
    }
  };

  const handleCustomGenreKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomGenre();
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">Musical Preferences</h2>
        <p className="text-sm text-neutral-600">
          Help artists understand what music fits best at your venue
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preferred Genres */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Genres</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {hostProfile.preferredGenres.map(genre => (
                <Badge key={genre} variant="default" className="flex items-center">
                  {genre}
                  <button
                    onClick={() => removePreferredGenre(genre)}
                    className="ml-1 text-xs hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.filter(g => !hostProfile.preferredGenres.includes(g)).map(genre => (
                <button
                  key={genre}
                  onClick={() => addPreferredGenre(genre)}
                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                >
                  + {genre}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customGenreInput}
                onChange={(e) => setCustomGenreInput(e.target.value)}
                onKeyPress={handleCustomGenreKeyPress}
                placeholder="Add custom genre..."
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={addCustomGenre}
                disabled={!customGenreInput.trim()}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Preferred Act Size */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Act Size</label>
          <select
            value={hostProfile.preferredActSize}
            onChange={(e) => updateHostProfile({ preferredActSize: e.target.value as any })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Solo">Solo</option>
            <option value="Duo">Duo</option>
            <option value="Trio">Trio</option>
            <option value="Full Band">Full Band</option>
            <option value="Doesn't Matter">Doesn't Matter</option>
          </select>
        </div>

        {/* Act Size Notes */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Act Size Considerations
          </label>
          <textarea
            value={hostProfile.actSizeNotes}
            onChange={(e) => updateHostProfile({ actSizeNotes: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="e.g., Our living room easily fits a trio but can accommodate a larger band within limits..."
          />
          <p className="text-xs text-neutral-500 mt-1">{hostProfile.actSizeNotes.length}/300 characters</p>
        </div>

        {/* What We Enjoy */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            What We Enjoy
          </label>
          <textarea
            value={hostProfile.whatWeEnjoy}
            onChange={(e) => updateHostProfile({ whatWeEnjoy: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={4}
            placeholder="Describe the types of music and acts that would be a perfect fit for your venue..."
          />
          <p className="text-xs text-neutral-500 mt-1">{hostProfile.whatWeEnjoy.length}/500 characters</p>
        </div>

        {/* Music We Aren't Into */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Things we Dislike
          </label>
          <textarea
            value={hostProfile.musicWeArentInto}
            onChange={(e) => updateHostProfile({ musicWeArentInto: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Optional: Mention any types of music or acts that don't fit your venue..."
          />
          <p className="text-xs text-neutral-500 mt-1">{hostProfile.musicWeArentInto.length}/300 characters</p>
        </div>

        {/* Content Rating */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Content Rating Preference</label>
          <select
            value={hostProfile.contentRating}
            onChange={(e) => updateHostProfile({ contentRating: e.target.value as any })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Kid Friendly">Kid Friendly</option>
            <option value="Explicit">Explicit Content OK</option>
            <option value="Doesn't Matter">Doesn't Matter</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}