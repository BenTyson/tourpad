'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface SpotifyPlayerProps {
  tracks: Array<{
    id: string;
    name: string;
    artist: string;
    previewUrl: string | null;
    imageUrl?: string | null;
  }>;
  className?: string;
}

export default function SpotifyPlayer({ tracks, className = '' }: SpotifyPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const playableTracks = tracks.filter(track => track.previewUrl);
  const currentTrack = playableTracks[currentTrackIndex];

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack?.previewUrl) {
      audioRef.current.src = currentTrack.previewUrl;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const updateProgress = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      audioRef.current.play();
      progressInterval.current = setInterval(updateProgress, 100);
      
      audioRef.current.addEventListener('ended', () => {
        handleNext();
      }, { once: true });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentTrackIndex < playableTracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setProgress(0);
      if (isPlaying && audioRef.current) {
        audioRef.current.play();
      }
    } else {
      // Loop back to first track
      setCurrentTrackIndex(0);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setProgress(0);
      if (isPlaying && audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    
    audioRef.current.currentTime = percentage * audioRef.current.duration;
    setProgress(percentage * 100);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
  };

  if (playableTracks.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 rounded-2xl p-6 text-white shadow-2xl backdrop-blur-lg ${className}`}>
      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-6">
        {currentTrack?.imageUrl ? (
          <img
            src={currentTrack.imageUrl}
            alt={currentTrack.name}
            className="w-16 h-16 rounded-lg shadow-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-primary-700 rounded-lg flex items-center justify-center">
            <Play className="w-6 h-6 text-primary-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">
            {currentTrack?.name || 'No track'}
          </h4>
          <p className="text-sm text-primary-200 truncate">
            {currentTrack?.artist || 'Unknown artist'}
          </p>
        </div>
        <div className="text-sm text-primary-300">
          {currentTrackIndex + 1} / {playableTracks.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="relative h-2 bg-primary-700 rounded-full mb-4 cursor-pointer group"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, marginLeft: '-8px' }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentTrackIndex === 0}
            className="p-2 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={handlePlayPause}
            disabled={!currentTrack}
            className="p-3 bg-white text-primary-900 rounded-full hover:bg-primary-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentTrackIndex === playableTracks.length - 1}
            className="p-2 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full hover:bg-primary-700 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
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
      <div className="mt-4 pt-4 border-t border-primary-700 text-center">
        <p className="text-xs text-primary-300">
          Previews powered by Spotify • 30-second clips
        </p>
      </div>
    </div>
  );
}