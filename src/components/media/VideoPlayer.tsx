'use client';
import { useState } from 'react';
import { PlayIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  className?: string;
}

export function VideoPlayer({ videoUrl, thumbnailUrl, title, className = '' }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // For demo purposes, we'll use a placeholder video
  // In real app, this would integrate with YouTube/Vimeo/direct video
  const placeholder = thumbnailUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800';

  const handlePlay = () => {
    setIsPlaying(true);
    // In real app, this would start actual video playback
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {!isPlaying ? (
        // Video Thumbnail with Play Button
        <div className="relative group cursor-pointer" onClick={handlePlay}>
          <div className="aspect-video bg-gray-900">
            <img
              src={placeholder}
              alt={title}
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-4 transition-all transform group-hover:scale-110">
              <PlayIcon className="w-8 h-8 ml-1" />
            </div>
          </div>

          {/* Video Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="text-white">
              <h3 className="font-medium text-lg mb-1">{title}</h3>
              <p className="text-sm opacity-90">Live Performance</p>
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
            3:42
          </div>
        </div>
      ) : (
        // Video Player (Placeholder)
        <div className="relative aspect-video bg-gray-900">
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <PlayIcon className="w-16 h-16 mx-auto mb-4 opacity-60" />
              <p className="text-lg">Video Player</p>
              <p className="text-sm opacity-70">Integration with YouTube/Vimeo would go here</p>
            </div>
          </div>
          
          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPlaying(false)}
                  className="hover:text-blue-400 transition-colors"
                >
                  <PlayIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleMute}
                  className="hover:text-blue-400 transition-colors"
                >
                  {isMuted ? (
                    <SpeakerXMarkIcon className="w-5 h-5" />
                  ) : (
                    <SpeakerWaveIcon className="w-5 h-5" />
                  )}
                </button>
                <span className="text-sm">1:23 / 3:42</span>
              </div>
              <div className="text-sm">
                {title}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}