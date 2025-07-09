'use client';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface Photo {
  id: string;
  url: string;
  alt: string;
  category: 'house' | 'performance_space' | 'crowd' | 'exterior';
}

interface PhotoGalleryProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function PhotoGallery({ photos, onPhotoClick }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-[16/9] bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <PhotoIcon className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <p className="text-lg font-medium">Photos coming soon</p>
          <p className="text-sm opacity-80">Host will upload venue photos</p>
        </div>
      </div>
    );
  }

  const mainPhoto = photos[currentIndex];
  const thumbnails = photos.slice(0, 5); // Show first 5 as thumbnails

  return (
    <div className="space-y-3">
      {/* Main Photo */}
      <div className="relative group cursor-pointer" onClick={() => onPhotoClick(currentIndex)}>
        <div className="aspect-[16/9] overflow-hidden rounded-lg">
          <img
            src={mainPhoto.url}
            alt={mainPhoto.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Photo Navigation Overlay */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : photos.length - 1);
              }}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(currentIndex < photos.length - 1 ? currentIndex + 1 : 0);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Photo Counter */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {photos.length}
        </div>

        {/* View All Photos Button */}
        <div className="absolute bottom-3 left-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPhotoClick(0);
            }}
            className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View all photos
          </button>
        </div>
      </div>

      {/* Thumbnail Grid */}
      {photos.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {thumbnails.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => {
                setCurrentIndex(index);
                onPhotoClick(index);
              }}
              className={`aspect-square overflow-hidden rounded-lg transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-blue-500 opacity-100'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          
          {/* More Photos Indicator */}
          {photos.length > 5 && (
            <button
              onClick={() => onPhotoClick(0)}
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <div className="text-center">
                <PhotoIcon className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs font-medium">+{photos.length - 5}</span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}