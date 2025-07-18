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
  if (photos.length === 0) return null;

  // For single photo, show it large
  if (photos.length === 1) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div
          className="aspect-[4/3] bg-neutral-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
          onClick={() => onPhotoClick?.(0)}
        >
          <img
            src={photos[0].url}
            alt={photos[0].alt || 'Artist photo'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    );
  }

  // For multiple photos, show metro-style layout
  const [heroPhoto, ...remainingPhotos] = photos;

  return (
    <div className="grid grid-cols-4 gap-3 h-[500px]">
      {/* Hero Photo - Large on Left, spans 2 columns and 2 rows */}
      <div
        className="col-span-2 row-span-2 bg-neutral-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
        onClick={() => onPhotoClick?.(0)}
      >
        <img
          src={heroPhoto.url}
          alt={heroPhoto.alt || 'Featured artist photo'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Metro Grid - All remaining photos same size */}
      {remainingPhotos.slice(0, 6).map((photo, idx) => (
        <div
          key={photo.id}
          className="col-span-1 row-span-1 bg-neutral-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => onPhotoClick?.(idx + 1)}
        >
          <img
            src={photo.url}
            alt={photo.alt || 'Artist photo'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
      
      {/* Show "View All" overlay if more than 7 photos total */}
      {remainingPhotos.length > 6 && (
        <div
          className="col-span-1 row-span-1 bg-neutral-900/80 rounded-lg flex items-center justify-center cursor-pointer hover:bg-neutral-900/90 transition-colors"
          onClick={() => onPhotoClick?.(7)}
        >
          <div className="text-center text-white">
            <div className="text-lg font-bold">+{photos.length - 7}</div>
            <div className="text-xs font-medium">More</div>
          </div>
        </div>
      )}
    </div>
  );
}