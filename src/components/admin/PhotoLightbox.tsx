'use client';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface PhotoItem {
  fileUrl: string;
  title?: string;
}

interface PhotoLightboxProps {
  isOpen: boolean;
  photos: PhotoItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PhotoLightbox({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrev
}: PhotoLightboxProps) {
  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative max-w-6xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 transform rotate-180" />
            </button>
          </>
        )}

        {/* Main Image */}
        <Image
          src={currentPhoto.fileUrl}
          alt={currentPhoto.title || `Photo ${currentIndex + 1}`}
          width={800}
          height={600}
          className="max-w-full max-h-full object-contain rounded-lg"
        />

        {/* Photo Counter */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full">
            {currentIndex + 1} of {photos.length}
          </div>
        )}

        {/* Photo Info */}
        {currentPhoto.title && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded max-w-md">
            <p className="text-sm">{currentPhoto.title}</p>
          </div>
        )}
      </div>
    </div>
  );
}