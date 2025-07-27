'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Music, ExternalLink, Clock, TrendingUp, Users, Headphones, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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

interface SoundCloudTrack {
  id: string;
  soundcloudId: number;
  title: string;
  description?: string;
  durationMs: number;
  playbackCount: number;
  likesCount: number;
  streamUrl?: string;
  soundcloudUrl: string;
  artworkUrl?: string;
  waveformUrl?: string;
  isStreamable: boolean;
  genre?: string;
  tags: string[];
  isDownloadable: boolean;
  license?: string;
}

interface EnhancedArtistMusicSectionProps {
  artistId: string;
  artistName: string;
  spotifyConnected: boolean;
  spotifyFollowers?: number;
  spotifyPopularity?: number;
  soundcloudConnected?: boolean;
  soundcloudFollowers?: number;
  soundcloudTrackCount?: number;
  onConnect?: () => void;
}

export default function EnhancedArtistMusicSection({
  artistId,
  artistName,
  spotifyConnected,
  spotifyFollowers,
  spotifyPopularity,
  soundcloudConnected = false,
  soundcloudFollowers,
  soundcloudTrackCount,
  onConnect
}: EnhancedArtistMusicSectionProps) {
  const [loading, setLoading] = useState(true);
  const [spotifyTracks, setSpotifyTracks] = useState<SpotifyTrack[]>([]);
  const [soundcloudTracks, setSoundcloudTracks] = useState<SoundCloudTrack[]>([]);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (spotifyConnected || soundcloudConnected) {
      fetchMusicData();
    } else {
      setLoading(false);
    }
  }, [artistId, spotifyConnected, soundcloudConnected]);

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
      
      // Fetch Spotify data if connected
      if (spotifyConnected) {
        const spotifyResponse = await fetch(`/api/spotify/artist/${artistId}`);
        if (spotifyResponse.ok) {
          const spotifyData = await spotifyResponse.json();
          setSpotifyTracks(spotifyData.artist.topTracks || []);
        }
      }

      // Fetch SoundCloud data if connected
      if (soundcloudConnected) {
        const soundcloudResponse = await fetch(`/api/soundcloud/artist/${artistId}`);
        if (soundcloudResponse.ok) {
          const soundcloudData = await soundcloudResponse.json();
          setSoundcloudTracks(soundcloudData.artist.tracks || []);
        }
      }
    } catch (error) {
      console.error('Error fetching music data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (track: SpotifyTrack | SoundCloudTrack, platform: 'spotify' | 'soundcloud') => {
    const audioUrl = platform === 'spotify' 
      ? (track as SpotifyTrack).previewUrl 
      : (track as SoundCloudTrack).streamUrl;
    
    if (!audioUrl) return;

    const trackId = `${platform}-${track.id}`;

    if (playingTrack === trackId) {
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
      
      const newAudio = new Audio(audioUrl);
      newAudio.play().catch(err => {
        console.error('Error playing audio:', err);
      });
      newAudio.addEventListener('ended', () => {
        setPlayingTrack(null);
      });
      
      setAudio(newAudio);
      setPlayingTrack(trackId);
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

  if (!spotifyConnected && !soundcloudConnected) {
    return (
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-8 text-center">
        <Music className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          No Music Services Connected
        </h3>
        <p className="text-neutral-600 mb-4">
          Connect this artist to Spotify or SoundCloud to display their music
        </p>
        {onConnect && (
          <Button onClick={onConnect} className="bg-primary-600 hover:bg-primary-700">
            <Music className="w-4 h-4 mr-2" />
            Connect Music Services
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

  const hasSpotifyTracks = spotifyTracks.length > 0;
  const hasSoundCloudTracks = soundcloudTracks.length > 0;

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        {spotifyConnected && spotifyFollowers && (
          <div className="flex items-center space-x-2">
            <Music className="w-4 h-4 text-green-600" />
            <span className="text-neutral-600">
              <span className="font-semibold text-neutral-900">
                {formatNumber(spotifyFollowers)}
              </span> Spotify followers
            </span>
          </div>
        )}
        {spotifyConnected && spotifyPopularity && (
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <span className="text-neutral-600">
              <span className="font-semibold text-neutral-900">
                {spotifyPopularity}
              </span>/100 popularity
            </span>
          </div>
        )}
        {soundcloudConnected && soundcloudFollowers && (
          <div className="flex items-center space-x-2">
            <Headphones className="w-4 h-4 text-orange-600" />
            <span className="text-neutral-600">
              <span className="font-semibold text-neutral-900">
                {formatNumber(soundcloudFollowers)}
              </span> SoundCloud followers
            </span>
          </div>
        )}
        {soundcloudConnected && soundcloudTrackCount && (
          <div className="flex items-center space-x-2">
            <Music className="w-4 h-4 text-orange-600" />
            <span className="text-neutral-600">
              <span className="font-semibold text-neutral-900">
                {formatNumber(soundcloudTrackCount)}
              </span> tracks
            </span>
          </div>
        )}
      </div>

      {/* Spotify Section */}
      {spotifyConnected && (
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
            <Music className="w-5 h-5 mr-2 text-green-600" />
            Popular Tracks on Spotify
          </h3>
          
          {hasSpotifyTracks ? (
            <div className="space-y-2">
              {spotifyTracks.map((track, index) => (
                <Card key={track.id} className="hover:shadow-md transition-all duration-200 border-neutral-200">
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
                          onClick={() => handlePlayPause(track, 'spotify')}
                          disabled={!track.previewUrl}
                          className={`absolute inset-0 rounded-lg flex items-center justify-center transition-all ${
                            track.previewUrl 
                              ? 'bg-black/50 hover:bg-black/70 text-white opacity-0 hover:opacity-100' 
                              : 'bg-neutral-400/50 text-neutral-600 cursor-not-allowed opacity-0'
                          }`}
                        >
                          {playingTrack === `spotify-${track.id}` ? (
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
                              className="absolute inset-y-0 left-0 bg-green-600 rounded-full"
                              style={{ width: `${track.popularity}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-neutral-500 w-10">
                          {track.popularity}
                        </span>
                      </div>

                      {/* External Link */}
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
          ) : (
            <div className="text-center py-8">
              <Music className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">No Spotify tracks available yet.</p>
            </div>
          )}
        </div>
      )}

      {/* SoundCloud Section */}
      {soundcloudConnected && (
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
            <Headphones className="w-5 h-5 mr-2 text-orange-600" />
            Tracks on SoundCloud
          </h3>
          
          {hasSoundCloudTracks ? (
            <div className="space-y-2">
              {soundcloudTracks.map((track, index) => (
                <Card key={track.id} className="hover:shadow-md transition-all duration-200 border-neutral-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Artwork & Play Button */}
                      <div className="relative w-12 h-12 flex-shrink-0">
                        {track.artworkUrl ? (
                          <img
                            src={track.artworkUrl}
                            alt={track.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                            <Headphones className="w-6 h-6 text-orange-600" />
                          </div>
                        )}
                        <button
                          onClick={() => handlePlayPause(track, 'soundcloud')}
                          disabled={!track.streamUrl || !track.isStreamable}
                          className={`absolute inset-0 rounded-lg flex items-center justify-center transition-all ${
                            track.streamUrl && track.isStreamable
                              ? 'bg-black/50 hover:bg-black/70 text-white opacity-0 hover:opacity-100' 
                              : 'bg-neutral-400/50 text-neutral-600 cursor-not-allowed opacity-0'
                          }`}
                        >
                          {playingTrack === `soundcloud-${track.id}` ? (
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
                            {track.title}
                          </h4>
                          {track.genre && (
                            <Badge variant="secondary" className="text-xs">
                              {track.genre}
                            </Badge>
                          )}
                        </div>
                        {track.description && (
                          <p className="text-sm text-neutral-600 truncate">
                            {track.description}
                          </p>
                        )}
                      </div>

                      {/* Duration */}
                      <div className="flex items-center space-x-2 text-sm text-neutral-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(track.durationMs)}</span>
                      </div>

                      {/* Stats */}
                      <div className="hidden sm:flex items-center space-x-4 text-sm text-neutral-500">
                        <div className="flex items-center space-x-1">
                          <Play className="w-3 h-3" />
                          <span>{formatNumber(track.playbackCount)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{formatNumber(track.likesCount)}</span>
                        </div>
                      </div>

                      {/* External Link */}
                      <a
                        href={track.soundcloudUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Headphones className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">No SoundCloud tracks available yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Show message if connected but no tracks */}
      {(spotifyConnected || soundcloudConnected) && !hasSpotifyTracks && !hasSoundCloudTracks && (
        <div className="text-center py-8">
          <Music className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">
            No music data available yet. Try syncing with your connected services.
          </p>
        </div>
      )}
    </div>
  );
}