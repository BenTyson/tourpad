'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Music, ExternalLink, Clock, TrendingUp, Users, Headphones, Heart, Volume2, SkipBack, SkipForward, Download } from 'lucide-react';
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

interface UploadedTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  year?: number;
  trackNumber?: number;
  durationMs?: number;
  originalFilename: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  description?: string;
  lyrics?: string;
  isPublic: boolean;
  sortOrder: number;
  processingStatus: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
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
  const [uploadedTracks, setUploadedTracks] = useState<UploadedTrack[]>([]);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchMusicData();
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

      // Always fetch uploaded tracks (public tracks for profile view)
      try {
        const uploadedResponse = await fetch(`/api/artists/${artistId}/uploaded-tracks`);
        if (uploadedResponse.ok) {
          const uploadedData = await uploadedResponse.json();
          setUploadedTracks(uploadedData.tracks || []);
        }
      } catch (uploadError) {
        console.error('Error fetching uploaded tracks:', uploadError);
        // Don't fail the whole component if uploaded tracks fail
      }
    } catch (error) {
      console.error('Error fetching music data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (track: SpotifyTrack | SoundCloudTrack | UploadedTrack, platform: 'spotify' | 'soundcloud' | 'uploaded') => {
    let audioUrl: string | null = null;
    
    if (platform === 'spotify') {
      audioUrl = (track as SpotifyTrack).previewUrl;
    } else if (platform === 'soundcloud') {
      audioUrl = (track as SoundCloudTrack).streamUrl || null;
    } else if (platform === 'uploaded') {
      audioUrl = (track as UploadedTrack).fileUrl;
    }
    
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
        // Remove old event listeners
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleTrackEnd);
      }
      
      setIsLoading(true);
      const newAudio = new Audio(audioUrl);
      newAudio.volume = volume;
      
      // Add event listeners for sophisticated controls
      const updateTime = () => setCurrentTime(newAudio.currentTime);
      const updateDuration = () => {
        setDuration(newAudio.duration);
        setIsLoading(false);
      };
      const handleTrackEnd = () => {
        setPlayingTrack(null);
        setCurrentTime(0);
      };
      
      newAudio.addEventListener('timeupdate', updateTime);
      newAudio.addEventListener('loadedmetadata', updateDuration);
      newAudio.addEventListener('ended', handleTrackEnd);
      newAudio.addEventListener('canplay', () => setIsLoading(false));
      
      newAudio.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsLoading(false);
      });
      
      setAudio(newAudio);
      setPlayingTrack(trackId);
      setCurrentTime(0);
    }
  };

  const handleSeek = (seekTime: number) => {
    if (audio) {
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const handleSkip = (direction: 'forward' | 'backward') => {
    if (audio) {
      const skipAmount = 10; // seconds
      const newTime = direction === 'forward' 
        ? Math.min(audio.currentTime + skipAmount, duration)
        : Math.max(audio.currentTime - skipAmount, 0);
      handleSeek(newTime);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (!spotifyConnected && !soundcloudConnected && uploadedTracks.length === 0 && !loading) {
    return (
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-8 text-center">
        <Music className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          No Music Available
        </h3>
        <p className="text-neutral-600 mb-4">
          This artist hasn't connected any music services or uploaded tracks yet
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
  const hasUploadedTracks = uploadedTracks.length > 0;

  return (
    <div className="space-y-8">

      {/* Uploaded Tracks Section */}
      {hasUploadedTracks && (
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
            <Music className="w-5 h-5 mr-2 text-sage" />
            Tracks
          </h3>
          
          <div className="space-y-4">
            {uploadedTracks.map((track, index) => {
              const isCurrentTrack = playingTrack === `uploaded-${track.id}`;
              const isTrackPlaying = isCurrentTrack && audio && !audio.paused;
              
              return (
                <Card key={track.id} className={`hover:shadow-lg transition-all duration-200 ${
                  isCurrentTrack ? 'border-sage bg-sage/5' : 'border-neutral-200'
                }`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Top Row - Track Info & Controls */}
                      <div className="flex items-center space-x-4">
                        {/* Album Art / Icon */}
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <div className="w-16 h-16 bg-sage/10 rounded-xl flex items-center justify-center">
                            <Music className="w-8 h-8 text-sage" />
                          </div>
                          <button
                            onClick={() => handlePlayPause(track, 'uploaded')}
                            className="absolute inset-0 rounded-xl flex items-center justify-center transition-all bg-black/50 hover:bg-black/70 text-white opacity-0 hover:opacity-100"
                          >
                            {isLoading && isCurrentTrack ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : isTrackPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 ml-0.5" />
                            )}
                          </button>
                        </div>

                        {/* Track Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm text-sage font-medium">
                              #{index + 1}
                            </span>
                            <h4 className="font-semibold text-neutral-900 truncate text-lg">
                              {track.title}
                            </h4>
                            {track.genre && (
                              <Badge className="bg-sage/10 text-sage border-sage/20 text-xs">
                                {track.genre}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-neutral-600">
                            {track.artist && (
                              <span className="font-medium">by {track.artist}</span>
                            )}
                            {track.album && track.artist && (
                              <span>•</span>
                            )}
                            {track.album && (
                              <span>{track.album}</span>
                            )}
                            {track.year && (
                              <>
                                <span>•</span>
                                <span>{track.year}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right Side Info */}
                        <div className="flex items-center space-x-4 text-sm text-neutral-500">
                          {track.durationMs && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDuration(track.durationMs)}</span>
                            </div>
                          )}
                          <div className="hidden sm:block">
                            {(track.fileSize / (1024 * 1024)).toFixed(1)} MB
                          </div>
                          <a
                            href={track.fileUrl}
                            download={track.originalFilename}
                            className="text-sage hover:text-sage/80 transition-colors"
                            title="Download track"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* Sophisticated Player Controls - Only show for current track */}
                      {isCurrentTrack && (
                        <div className="border-t border-sage/20 pt-4 space-y-3">
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div 
                                className="absolute inset-y-0 left-0 bg-sage rounded-full transition-all duration-300"
                                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                              />
                              <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={(e) => handleSeek(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                            <div className="flex justify-between text-xs text-neutral-500">
                              <span>{formatTime(currentTime)}</span>
                              <span>{formatTime(duration)}</span>
                            </div>
                          </div>

                          {/* Control Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleSkip('backward')}
                                className="p-2 text-sage hover:text-sage/80 hover:bg-sage/10 rounded-lg transition-colors"
                                title="Skip back 10s"
                              >
                                <SkipBack className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handlePlayPause(track, 'uploaded')}
                                className="p-3 bg-sage text-white hover:bg-sage/90 rounded-xl transition-colors"
                              >
                                {isLoading ? (
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : isTrackPlaying ? (
                                  <Pause className="w-5 h-5" />
                                ) : (
                                  <Play className="w-5 h-5 ml-0.5" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleSkip('forward')}
                                className="p-2 text-sage hover:text-sage/80 hover:bg-sage/10 rounded-lg transition-colors"
                                title="Skip forward 10s"
                              >
                                <SkipForward className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center space-x-2">
                              <Volume2 className="w-4 h-4 text-neutral-500" />
                              <div className="relative w-20">
                                <div className="h-1 bg-neutral-200 rounded-full">
                                  <div 
                                    className="h-1 bg-sage rounded-full"
                                    style={{ width: `${volume * 100}%` }}
                                  />
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={volume}
                                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Spotify Section */}
      {spotifyConnected && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-neutral-900 flex items-center">
              <Music className="w-5 h-5 mr-2 text-green-600" />
              Popular Tracks on Spotify
            </h3>
            <div className="flex items-center space-x-2">
              <Music className="w-5 h-5 text-green-600" />
              <span className="text-sm text-neutral-600">Spotify</span>
            </div>
          </div>
          
          {hasSpotifyTracks ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {spotifyTracks.slice(0, 4).map((track, index) => (
                  <Card key={track.id} className="hover:shadow-lg transition-all duration-200 border-neutral-200 group">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Album Artwork & Play Button */}
                        <div className="relative aspect-square w-full">
                          {track.album?.imageUrl ? (
                            <img
                              src={track.album.imageUrl}
                              alt={track.album.name}
                              className="w-full h-full rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral-200 rounded-lg flex items-center justify-center">
                              <Music className="w-8 h-8 text-neutral-400" />
                            </div>
                          )}
                          <button
                            onClick={() => handlePlayPause(track, 'spotify')}
                            disabled={!track.previewUrl}
                            className={`absolute inset-0 rounded-lg flex items-center justify-center transition-all ${
                              track.previewUrl 
                                ? 'bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100' 
                                : 'bg-neutral-400/50 text-neutral-600 cursor-not-allowed opacity-0'
                            }`}
                          >
                            {playingTrack === `spotify-${track.id}` ? (
                              <Pause className="w-6 h-6" />
                            ) : (
                              <Play className="w-6 h-6 ml-1" />
                            )}
                          </button>
                        </div>

                        {/* Track Info */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-neutral-900 truncate text-sm">
                              {track.name}
                            </h4>
                            {track.explicit && (
                              <Badge className="bg-neutral-200 text-neutral-700 text-xs px-1.5 py-0.5">
                                E
                              </Badge>
                            )}
                          </div>
                          {track.album && (
                            <p className="text-xs text-neutral-600 truncate">
                              {track.album.name}
                            </p>
                          )}
                          
                          {/* Duration & Popularity */}
                          <div className="flex items-center justify-between text-xs text-neutral-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDuration(track.durationMs)}</span>
                            </span>
                            <span>{track.popularity}/100</span>
                          </div>
                        </div>

                        {/* External Link */}
                        <a
                          href={track.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open in Spotify
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Spotify Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm mt-4 pt-4 border-t border-neutral-200">
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
            </>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-neutral-900 flex items-center">
              <Headphones className="w-5 h-5 mr-2 text-orange-600" />
              Popular Tracks on SoundCloud
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="text-sm text-neutral-600">SoundCloud</span>
            </div>
          </div>
          
          {hasSoundCloudTracks ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {soundcloudTracks.slice(0, 4).map((track, index) => (
                  <Card key={track.id} className="hover:shadow-lg transition-all duration-200 border-neutral-200 group">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Artwork & Play Button */}
                        <div className="relative aspect-square w-full">
                          {track.artworkUrl ? (
                            <img
                              src={track.artworkUrl}
                              alt={track.title}
                              className="w-full h-full rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                              <Headphones className="w-8 h-8 text-orange-600" />
                            </div>
                          )}
                          <button
                            onClick={() => handlePlayPause(track, 'soundcloud')}
                            disabled={!track.streamUrl || !track.isStreamable}
                            className={`absolute inset-0 rounded-lg flex items-center justify-center transition-all ${
                              track.streamUrl && track.isStreamable
                                ? 'bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100' 
                                : 'bg-neutral-400/50 text-neutral-600 cursor-not-allowed opacity-0'
                            }`}
                          >
                            {playingTrack === `soundcloud-${track.id}` ? (
                              <Pause className="w-6 h-6" />
                            ) : (
                              <Play className="w-6 h-6 ml-1" />
                            )}
                          </button>
                        </div>

                        {/* Track Info */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-neutral-900 truncate text-sm">
                              {track.title}
                            </h4>
                            {track.genre && (
                              <Badge variant="secondary" className="text-xs">
                                {track.genre}
                              </Badge>
                            )}
                          </div>
                          {track.description && (
                            <p className="text-xs text-neutral-600 truncate">
                              {track.description}
                            </p>
                          )}
                          
                          {/* Duration & Stats */}
                          <div className="flex items-center justify-between text-xs text-neutral-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDuration(track.durationMs)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Play className="w-3 h-3" />
                              <span>{formatNumber(track.playbackCount)}</span>
                            </span>
                          </div>
                        </div>

                        {/* External Link */}
                        <a
                          href={track.soundcloudUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open in SoundCloud
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* SoundCloud Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm mt-4 pt-4 border-t border-neutral-200">
                {soundcloudFollowers && (
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-4 h-4 text-orange-600" />
                    <span className="text-neutral-600">
                      <span className="font-semibold text-neutral-900">
                        {formatNumber(soundcloudFollowers)}
                      </span> SoundCloud followers
                    </span>
                  </div>
                )}
                {soundcloudTrackCount && (
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
            </>
          ) : (
            <div className="text-center py-8">
              <Headphones className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">No SoundCloud tracks available yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Show message if connected but no tracks */}
      {(spotifyConnected || soundcloudConnected) && !hasSpotifyTracks && !hasSoundCloudTracks && !hasUploadedTracks && (
        <div className="text-center py-8">
          <Music className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">
            No music data available yet. Try syncing with your connected services or uploading tracks.
          </p>
        </div>
      )}
    </div>
  );
}