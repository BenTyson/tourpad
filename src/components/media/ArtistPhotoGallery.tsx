'use client';

interface ArtistPhoto {
  id: string;
  url: string;
  alt: string;
  category: 'performance' | 'band';
}

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
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => onPhotoClick?.(photos.indexOf(photo))}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
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
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => onPhotoClick?.(photos.indexOf(photo))}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}