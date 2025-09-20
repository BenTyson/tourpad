'use client';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface MediaItem {
  fileUrl: string;
  title?: string;
}

interface PhotoGalleryProps {
  title: string;
  photos: MediaItem[];
  onPhotoClick: (photos: MediaItem[], index: number) => void;
  emptyMessage?: string;
}

export function PhotoGallery({
  title,
  photos,
  onPhotoClick,
  emptyMessage = "No photos uploaded"
}: PhotoGalleryProps) {
  return (
    <div>
      <h5 className="font-medium text-gray-700 mb-3">{title}</h5>
      {photos && photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <Image
                src={photo.fileUrl}
                alt={photo.title || `Photo ${index + 1}`}
                width={300}
                height={128}
                className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => onPhotoClick(photos, index)}
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded pointer-events-none">
                {index + 1} / {photos.length}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <PhotoIcon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}