'use client';
import { Photo as ArtistPhoto } from '@/types/artist';

interface ArtistPhotoGalleryProps {
  photos: ArtistPhoto[];
  onPhotoClick?: (index: number) => void;
}

export function ArtistPhotoGallery({ photos, onPhotoClick }: ArtistPhotoGalleryProps) {
  const performancePhotos = photos.filter(p => p.category === 'performance');
  const bandPhotos = photos.filter(p => p.category === 'band');

  return (
    <div className="space-y-8">
      {performancePhotos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {performancePhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => onPhotoClick?.(photos.indexOf(photo))}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {bandPhotos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Band Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bandPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => onPhotoClick?.(photos.indexOf(photo))}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}