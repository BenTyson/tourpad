'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat,
  Music,
  List,
  Minimize2,
  Maximize2,
  ExternalLink
} from 'lucide-react';
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

interface EnhancedSpotifyPlayerProps {
  tracks: SpotifyTrack[];
  artistName: string;
  className?: string;
  autoPlay?: boolean;
  showPlaylist?: boolean;
  onTrackChange?: (track: SpotifyTrack) => void;
}

type RepeatMode = 'off' | 'all' | 'one';

export default function EnhancedSpotifyPlayer({ 
  tracks, 
  artistName, 
  className = '',
  autoPlay = false,
  showPlaylist = true,
  onTrackChange 
}: EnhancedSpotifyPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [playHistory, setPlayHistory] = useState<number[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Show all tracks, filter playable ones for audio functionality
  const playableTracks = tracks.filter(track => track.previewUrl);
  const allTracks = tracks;
  const currentTrack = allTracks[currentTrackIndex];

  // Initialize shuffled indices
  useEffect(() => {
    if (allTracks.length > 0) {
      const indices = Array.from({ length: allTracks.length }, (_, i) => i);
      setShuffledIndices(indices);
    }
  }, [allTracks.length]);

  // Audio setup and cleanup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.preload = 'metadata';

      const audio = audioRef.current;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setProgress(audio.currentTime);
      };

      const handleEnded = () => {
        handleNext();
      };

      const handleError = () => {
        console.error('Audio playback error');
        handleNext();
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      return () => {
        if (audio) {
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('timeupdate', handleTimeUpdate);
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
          audio.pause();
          audio.src = '';
        }
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      };
    }
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.previewUrl) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.previewUrl;
      
      if (wasPlaying || autoPlay) {
        audioRef.current.play().catch(console.error);
      }
      
      onTrackChange?.(currentTrack);
      setProgress(0);
    }
  }, [currentTrack, autoPlay, onTrackChange]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const getNextTrackIndex = () => {
    if (repeatMode === 'one') {
      return currentTrackIndex;
    }

    const indices = isShuffled ? shuffledIndices : Array.from({ length: allTracks.length }, (_, i) => i);
    const currentIndex = indices.indexOf(currentTrackIndex);
    
    if (currentIndex < indices.length - 1) {
      return indices[currentIndex + 1];
    } else if (repeatMode === 'all') {
      return indices[0];
    }
    
    return currentTrackIndex; // Stay on current if no repeat
  };

  const getPreviousTrackIndex = () => {
    if (playHistory.length > 1) {
      return playHistory[playHistory.length - 2];
    }
    
    const indices = isShuffled ? shuffledIndices : Array.from({ length: allTracks.length }, (_, i) => i);
    const currentIndex = indices.indexOf(currentTrackIndex);
    
    if (currentIndex > 0) {
      return indices[currentIndex - 1];
    } else if (repeatMode === 'all') {
      return indices[indices.length - 1];
    }
    
    return currentTrackIndex;
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = getNextTrackIndex();
    if (nextIndex !== currentTrackIndex || repeatMode === 'one') {
      setPlayHistory(prev => [...prev, currentTrackIndex]);
      setCurrentTrackIndex(nextIndex);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    const prevIndex = getPreviousTrackIndex();
    setCurrentTrackIndex(prevIndex);
    if (playHistory.length > 0) {
      setPlayHistory(prev => prev.slice(0, -1));
    }
  };

  const handleTrackSelect = (index: number) => {
    setPlayHistory(prev => [...prev, currentTrackIndex]);
    setCurrentTrackIndex(index);
    setShowTrackList(false);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    
    audioRef.current.currentTime = percentage * duration;
    setProgress(percentage * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setPreviousVolume(newVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    if (!isShuffled) {
      // Shuffle the indices
      const indices = Array.from({ length: allTracks.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
    }
  };

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (allTracks.length === 0) {
    return (
      <Card className={`bg-neutral-100 ${className}`}>
        <CardContent className="p-6 text-center">
          <Music className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">No tracks available</p>
        </CardContent>
      </Card>
    );
  }

  // If no tracks have previews, show a beautiful visual showcase
  if (playableTracks.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">
            Popular Tracks
          </h3>
          <p className="text-neutral-600">
            {allTracks.length} songs by {artistName}
          </p>
        </div>

        {/* Track Grid - Spotify-style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTracks.slice(0, 6).map((track, index) => (
            <Card 
              key={track.id} 
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-neutral-50 border-neutral-200"
            >
              <CardContent className="p-0">
                {/* Album Art */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  {track.album?.imageUrl ? (
                    <img
                      src={track.album.imageUrl}
                      alt={`${track.name} by ${artistName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                      <Music className="w-16 h-16 text-primary-600" />
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        onClick={() => window.open(track.spotifyUrl, '_blank')}
                        className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 text-white shadow-2xl transform scale-75 hover:scale-90 transition-all duration-200"
                        title="Play on Spotify"
                      >
                        <Play className="w-6 h-6 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Track Number */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/70 text-white text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>

                {/* Track Info */}
                <div className="p-4 space-y-2">
                  <h4 className="font-semibold text-neutral-900 text-lg leading-tight truncate">
                    {track.name}
                  </h4>
                  <p className="text-neutral-600 text-sm">
                    {track.album?.name}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      {track.explicit && (
                        <Badge className="bg-neutral-200 text-neutral-700 text-xs">E</Badge>
                      )}
                      <span className="text-xs text-neutral-500">
                        {Math.floor(track.durationMs / 60000)}:{String(Math.floor((track.durationMs % 60000) / 1000)).padStart(2, '0')}
                      </span>
                    </div>
                    
                    <Button
                      onClick={() => window.open(track.spotifyUrl, '_blank')}
                      size="sm"
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50 text-xs px-2 py-1"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Spotify
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More */}
        {allTracks.length > 6 && (
          <div className="text-center pt-4">
            <p className="text-neutral-600 mb-4">
              +{allTracks.length - 6} more tracks available
            </p>
            <Button
              onClick={() => window.open(`https://open.spotify.com/artist/${currentTrack?.spotifyUrl?.split('/artist/')[1]}`, '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View All on Spotify
            </Button>
          </div>
        )}

        {/* Info Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800 text-sm">
            <strong>Preview unavailable:</strong> Full tracks can be played on Spotify
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Player */}
      <Card className={`bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white shadow-2xl backdrop-blur-lg transition-all duration-300 ${
        isMinimized ? 'h-20' : ''
      }`}>
        <CardContent className={`p-6 ${isMinimized ? 'py-4' : ''}`}>
          {!isMinimized ? (
            <div className="space-y-6">
              {/* Track Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  {currentTrack?.album?.imageUrl ? (
                    <img
                      src={currentTrack.album.imageUrl}
                      alt={currentTrack.name}
                      className="w-16 h-16 rounded-lg shadow-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-primary-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate text-lg">
                      {currentTrack?.name || 'No track selected'}
                    </h4>
                    <p className="text-sm text-primary-200 truncate">
                      {artistName} • {currentTrack?.album?.name || 'Unknown album'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-primary-700 text-primary-200 text-xs">
                        {currentTrackIndex + 1} / {allTracks.length}
                      </Badge>
                      {currentTrack?.explicit && (
                        <Badge className="bg-neutral-700 text-neutral-300 text-xs">E</Badge>
                      )}
                      {!currentTrack?.previewUrl && (
                        <Badge className="bg-yellow-700 text-yellow-200 text-xs">
                          <a href={currentTrack?.spotifyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Play on Spotify
                          </a>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTrackList(!showTrackList)}
                    className="text-white hover:bg-primary-700"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(true)}
                    className="text-white hover:bg-primary-700"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div 
                  className="relative h-2 bg-primary-700 rounded-full cursor-pointer group"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full transition-all duration-100"
                    style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${duration > 0 ? (progress / duration) * 100 : 0}%`, marginLeft: '-8px' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-primary-300">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                {/* Playback Controls */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleShuffle}
                    className={`text-white hover:bg-primary-700 ${isShuffled ? 'bg-primary-600' : ''}`}
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={handlePrevious}
                    disabled={allTracks.length <= 1}
                    className="p-2 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    onClick={handlePlayPause}
                    disabled={!currentTrack?.previewUrl}
                    className="p-4 bg-white text-primary-900 rounded-full hover:bg-primary-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!currentTrack?.previewUrl ? 'Preview not available for this track' : undefined}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" />
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={allTracks.length <= 1 && repeatMode === 'off'}
                    className="p-2 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleRepeat}
                    className={`text-white hover:bg-primary-700 relative ${repeatMode !== 'off' ? 'bg-primary-600' : ''}`}
                  >
                    <Repeat className="w-4 h-4" />
                    {repeatMode === 'one' && (
                      <span className="absolute -top-1 -right-1 text-xs bg-white text-primary-900 rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        1
                      </span>
                    )}
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-primary-700"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-primary-700 rounded-full appearance-none cursor-pointer slider-primary"
                  />
                </div>
              </div>

              {/* Spotify Attribution */}
              <div className="pt-4 border-t border-primary-700 text-center">
                <p className="text-xs text-primary-300">
                  Previews powered by Spotify • 30-second clips
                </p>
              </div>
            </div>
          ) : (
            /* Minimized View */
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Button
                  onClick={handlePlayPause}
                  disabled={!currentTrack}
                  className="p-2 bg-white text-primary-900 rounded-full hover:bg-primary-100 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </Button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate text-sm">
                    {currentTrack?.name || 'No track'}
                  </p>
                  <p className="text-xs text-primary-200 truncate">
                    {artistName}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
                className="text-white hover:bg-primary-700"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Track List */}
      {showTrackList && showPlaylist && (
        <Card className="bg-white border-neutral-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Track List</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playableTracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(index)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    index === currentTrackIndex
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-neutral-100">
                    {index === currentTrackIndex && isPlaying ? (
                      <Pause className="w-4 h-4 text-primary-600" />
                    ) : (
                      <Play className="w-4 h-4 text-neutral-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      index === currentTrackIndex ? 'text-primary-900' : 'text-neutral-900'
                    }`}>
                      {track.name}
                    </p>
                    <p className="text-sm text-neutral-600 truncate">
                      {track.album?.name || 'Unknown album'}
                    </p>
                  </div>
                  <div className="text-sm text-neutral-500">
                    {formatTime(track.durationMs / 1000)}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}