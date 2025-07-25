'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Music, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import AlbumGallery from '@/components/spotify/AlbumGallery';
import EnhancedSpotifyPlayer from '@/components/spotify/EnhancedSpotifyPlayer';

interface SpotifyTrack {
  id: string;
  spotifyId: string;
  name: string;
  durationMs: number;
  popularity: number;
  previewUrl: string | null;
  spotifyUrl: string;
  trackNumber: number | null;
  explicit: boolean;
  album?: {
    name: string;
    imageUrl: string | null;
  };
}

interface SpotifyAlbum {
  id: string;
  spotifyId: string;
  name: string;
  albumType: string;
  releaseDate: string;
  imageUrl: string | null;
  spotifyUrl: string;
  totalTracks: number;
}

interface ArtistMusicSectionProps {
  artistId: string;
  artistName: string;
  spotifyConnected: boolean;
  spotifyFollowers?: number;
  spotifyPopularity?: number;
  onConnect?: () => void;
  useEnhancedPlayer?: boolean;
}

export default function ArtistMusicSection({
  artistId,
  artistName,
  spotifyConnected,
  spotifyFollowers,
  spotifyPopularity,
  onConnect,
  useEnhancedPlayer = true
}: ArtistMusicSectionProps) {
  const [loading, setLoading] = useState(true);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (spotifyConnected) {
      fetchMusicData();
    } else {
      setLoading(false);
    }
  }, [artistId, spotifyConnected]);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);

  const fetchMusicData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/spotify/artist/${artistId}`);
      
      if (response.ok) {
        const data = await response.json();
        setTopTracks(data.artist.topTracks || []);
        setAlbums(data.artist.albums || []);
      }
    } catch (error) {
      console.error('Error fetching music data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (track: SpotifyTrack) => {
    if (!track.previewUrl) return;

    if (playingTrack === track.id) {
      // Pause current track
      if (audio) {
        audio.pause();
        setPlayingTrack(null);
      }
    } else {
      // Play new track
      if (audio) {
        audio.pause();
      }
      
      const newAudio = new Audio(track.previewUrl);
      newAudio.play();
      newAudio.addEventListener('ended', () => {
        setPlayingTrack(null);
      });
      
      setAudio(newAudio);
      setPlayingTrack(track.id);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (!spotifyConnected) {
    return (
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-8 text-center">
        <Music className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Spotify Not Connected
        </h3>
        <p className="text-neutral-600 mb-4">
          Connect this artist to Spotify to display their music
        </p>
        {onConnect && (
          <Button onClick={onConnect} className="bg-green-600 hover:bg-green-700">
            <Music className="w-4 h-4 mr-2" />
            Connect to Spotify
          </Button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Spotify Stats */}
      {(spotifyFollowers || spotifyPopularity) && (
        <div className="flex items-center space-x-6 text-sm">
          {spotifyFollowers && (
            <div className="flex items-center space-x-2">
              <Music className="w-4 h-4 text-green-600" />
              <span className="text-neutral-600">
                <span className="font-semibold text-neutral-900">
                  {formatNumber(spotifyFollowers)}
                </span> Spotify followers
              </span>
            </div>
          )}
          {spotifyPopularity && (
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span className="text-neutral-600">
                <span className="font-semibold text-neutral-900">
                  {spotifyPopularity}
                </span>/100 popularity
              </span>
            </div>
          )}
        </div>
      )}

      {/* Top Tracks */}
      {topTracks.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">
            Popular Tracks
          </h3>
          
          {useEnhancedPlayer ? (
            <EnhancedSpotifyPlayer
              tracks={topTracks}
              artistName={artistName}
              autoPlay={false}
              showPlaylist={true}
              className="mb-6"
            />
          ) : (
            <div className="space-y-2">
              {topTracks.map((track, index) => (
                <Card 
                  key={track.id} 
                  className="hover:shadow-md transition-all duration-200 border-neutral-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Album Artwork & Play Button */}
                      <div className="relative w-12 h-12 flex-shrink-0">
                        {track.album?.imageUrl ? (
                          <img
                            src={track.album.imageUrl}
                            alt={track.album.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-neutral-400" />
                          </div>
                        )}
                        <button
                          onClick={() => handlePlayPause(track)}
                          disabled={!track.previewUrl}
                          className={`absolute inset-0 rounded-lg flex items-center justify-center transition-all ${
                            track.previewUrl 
                              ? 'bg-black/50 hover:bg-black/70 text-white opacity-0 hover:opacity-100' 
                              : 'bg-neutral-400/50 text-neutral-600 cursor-not-allowed opacity-0'
                          }`}
                        >
                          {playingTrack === track.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Track Number */}
                      <span className="text-sm text-neutral-500 w-6">
                        {index + 1}
                      </span>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-neutral-900 truncate">
                            {track.name}
                          </h4>
                          {track.explicit && (
                            <Badge className="bg-neutral-200 text-neutral-700 text-xs px-1.5 py-0.5">
                              E
                            </Badge>
                          )}
                        </div>
                        {track.album && (
                          <p className="text-sm text-neutral-600 truncate">
                            {track.album.name}
                          </p>
                        )}
                      </div>

                      {/* Duration */}
                      <div className="flex items-center space-x-2 text-sm text-neutral-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(track.durationMs)}</span>
                      </div>

                      {/* Popularity */}
                      <div className="hidden sm:flex items-center space-x-4">
                        <div className="w-20">
                          <div className="relative h-1 bg-neutral-200 rounded-full overflow-hidden">
                            <div 
                              className="absolute inset-y-0 left-0 bg-primary-600 rounded-full"
                              style={{ width: `${track.popularity}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-neutral-500 w-10">
                          {track.popularity}
                        </span>
                      </div>

                      {/* Spotify Link */}
                      <a
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Albums Gallery */}
      {albums.length > 0 && (
        <AlbumGallery 
          albums={albums}
          artistName={artistName}
          maxInitialDisplay={6}
        />
      )}

      {/* No Music Data */}
      {topTracks.length === 0 && albums.length === 0 && (
        <div className="text-center py-8">
          <Music className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">
            No music data available yet. Try syncing with Spotify.
          </p>
        </div>
      )}
    </div>
  );
}