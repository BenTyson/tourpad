'use client';
import { useEffect, useState } from 'react';
import { Photo as ArtistPhoto } from '@/types/artist';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ArtistPhotoLightboxProps {
  photos: ArtistPhoto[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ArtistPhotoLightbox({
  photos,
  isOpen,
  currentIndex,
  onClose,
  onNavigate
}: ArtistPhotoLightboxProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([currentIndex]));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < photos.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  useEffect(() => {
    // Preload adjacent images
    const preloadIndices = [
      currentIndex - 1,
      currentIndex,
      currentIndex + 1
    ].filter(i => i >= 0 && i < photos.length);

    preloadIndices.forEach(i => {
      if (!loadedImages.has(i)) {
        const img = new Image();
        img.src = photos[i].url;
        setLoadedImages(prev => new Set(prev).add(i));
      }
    });
  }, [currentIndex, photos, loadedImages]);

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
        aria-label="Close lightbox"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>
      )}

      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          aria-label="Next photo"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      )}

      {/* Main image */}
      <div className="max-w-7xl max-h-screen p-4">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.alt}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Photo info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-7xl mx-auto text-white">
          <p className="text-lg">{currentPhoto.alt}</p>
          <p className="text-sm opacity-75 mt-1">
            {currentIndex + 1} of {photos.length} • {currentPhoto.category === 'performance' ? 'Performance' : 'Band Photo'}
          </p>
        </div>
      </div>
    </div>
  );
}