import React from 'react';
import EnhancedArtistMusicSection from '@/components/artist/EnhancedArtistMusicSection';

interface ArtistMusicSectionProps {
  artist: {
    id: string;
    name: string;
    spotifyVerified?: boolean;
    spotifyFollowers?: number;
    spotifyPopularity?: number;
    soundcloudVerified?: boolean;
    soundcloudFollowers?: number;
    soundcloudTrackCount?: number;
  };
}

export function ArtistMusicSection({ artist }: ArtistMusicSectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Music
        </h2>
        <EnhancedArtistMusicSection
          artistId={artist.id}
          artistName={artist.name}
          spotifyConnected={artist.spotifyVerified || false}
          spotifyFollowers={artist.spotifyFollowers}
          spotifyPopularity={artist.spotifyPopularity}
          soundcloudConnected={artist.soundcloudVerified || false}
          soundcloudFollowers={artist.soundcloudFollowers}
          soundcloudTrackCount={artist.soundcloudTrackCount}
        />
      </div>
    </section>
  );
}