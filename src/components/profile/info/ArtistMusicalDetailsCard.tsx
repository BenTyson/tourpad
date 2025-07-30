'use client';
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { X } from 'lucide-react';
import { ArtistProfile } from '../types';

const GENRE_OPTIONS = [
  'Folk', 'Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Classical', 'Electronic',
  'Hip Hop', 'R&B', 'Soul', 'Funk', 'Reggae', 'World', 'Experimental', 'Ambient'
];

const INSTRUMENT_OPTIONS = [
  'Guitar', 'Piano', 'Vocals', 'Bass', 'Drums', 'Violin', 'Cello', 'Flute',
  'Saxophone', 'Trumpet', 'Harmonica', 'Banjo', 'Mandolin', 'Synthesizer', 'Ukulele'
];

const EQUIPMENT_OPTIONS = [
  'All instruments and personal gear',
  'Professional sound equipment',
  'Microphones and stands',
  'Basic lighting setup',
  'PA system',
  'Amplifiers',
  'Cables and adapters',
  'Stage monitors'
];

interface ArtistMusicalDetailsCardProps {
  artistProfile: ArtistProfile;
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
}

export default function ArtistMusicalDetailsCard({
  artistProfile,
  updateArtistProfile
}: ArtistMusicalDetailsCardProps) {
  const [customInstrument, setCustomInstrument] = useState('');
  const [customEquipment, setCustomEquipment] = useState('');

  const addGenre = (genre: string) => {
    if (!artistProfile.genres.includes(genre)) {
      updateArtistProfile({ genres: [...artistProfile.genres, genre] });
    }
  };

  const removeGenre = (genre: string) => {
    updateArtistProfile({ genres: artistProfile.genres.filter(g => g !== genre) });
  };

  const addInstrument = (instrument: string) => {
    if (!artistProfile.instruments.includes(instrument)) {
      updateArtistProfile({ instruments: [...artistProfile.instruments, instrument] });
    }
  };

  const removeInstrument = (instrument: string) => {
    updateArtistProfile({ instruments: artistProfile.instruments.filter(i => i !== instrument) });
  };

  const addCustomInstrument = () => {
    if (customInstrument.trim() && !artistProfile.instruments.includes(customInstrument.trim())) {
      updateArtistProfile({ instruments: [...artistProfile.instruments, customInstrument.trim()] });
      setCustomInstrument('');
    }
  };

  const addEquipment = (equipment: string) => {
    if (!artistProfile.equipmentProvided.includes(equipment)) {
      updateArtistProfile({ equipmentProvided: [...artistProfile.equipmentProvided, equipment] });
    }
  };

  const removeEquipment = (equipment: string) => {
    updateArtistProfile({ equipmentProvided: artistProfile.equipmentProvided.filter(e => e !== equipment) });
  };

  const addCustomEquipment = () => {
    if (customEquipment.trim() && !artistProfile.equipmentProvided.includes(customEquipment.trim())) {
      updateArtistProfile({ equipmentProvided: [...artistProfile.equipmentProvided, customEquipment.trim()] });
      setCustomEquipment('');
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">Musical Details</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Genres */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Genres</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {artistProfile.genres.map(genre => (
                <Badge key={genre} variant="default" className="flex items-center">
                  {genre}
                  <button
                    onClick={() => removeGenre(genre)}
                    className="ml-1 text-xs hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.filter(g => !artistProfile.genres.includes(g)).map(genre => (
                <button
                  key={genre}
                  onClick={() => addGenre(genre)}
                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                >
                  + {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Musical Style Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Describe Your Musical Style</label>
          <textarea
            value={artistProfile.musicalStyle}
            onChange={(e) => updateArtistProfile({ musicalStyle: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="ie: Harmonic Appalachian Folk"
          />
        </div>

        {/* Instruments */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Instruments we play</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {artistProfile.instruments.map(instrument => (
                <Badge key={instrument} variant="secondary" className="flex items-center">
                  {instrument}
                  <button
                    onClick={() => removeInstrument(instrument)}
                    className="ml-1 text-xs hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {INSTRUMENT_OPTIONS.filter(i => !artistProfile.instruments.includes(i)).map(instrument => (
                <button
                  key={instrument}
                  onClick={() => addInstrument(instrument)}
                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                >
                  + {instrument}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Other instrument..."
                value={customInstrument}
                onChange={(e) => setCustomInstrument(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomInstrument();
                  }
                }}
                className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={addCustomInstrument}
                disabled={!customInstrument.trim()}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Equipment I Bring to Shows */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Equipment I Bring to Shows</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {artistProfile.equipmentProvided.map(equipment => (
                <Badge key={equipment} variant="secondary" className="bg-green-50 text-green-800 border-green-200 flex items-center">
                  {equipment}
                  <button
                    onClick={() => removeEquipment(equipment)}
                    className="ml-1 text-xs hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.filter(e => !artistProfile.equipmentProvided.includes(e)).map(equipment => (
                <button
                  key={equipment}
                  onClick={() => addEquipment(equipment)}
                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-green-100 rounded-full transition-colors"
                >
                  + {equipment}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Other equipment..."
                value={customEquipment}
                onChange={(e) => setCustomEquipment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomEquipment();
                  }
                }}
                className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={addCustomEquipment}
                disabled={!customEquipment.trim()}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Content Rating */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Content Rating</label>
          <select
            value={artistProfile.contentRating || 'family-friendly'}
            onChange={(e) => updateArtistProfile({ contentRating: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="family-friendly">Family Friendly</option>
            <option value="explicit">Explicit</option>
            <option value="tailored">Can be tailored to suit the requested environment</option>
          </select>
          <p className="text-xs text-neutral-500 mt-1">
            Let hosts know if your performance contains explicit language or adult themes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}