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
  console.log('ArtistPhotoGallery received photos:', photos);
  const performancePhotos = photos.filter(p => p.category === 'performance');
  const bandPhotos = photos.filter(p => p.category === 'band');
  console.log('Performance photos:', performancePhotos);
  console.log('Band photos:', bandPhotos);

  return (
    <div className="space-y-8">
      {/* Debug info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
        <p><strong>Debug:</strong> Total photos: {photos.length}</p>
        <p>Performance photos: {performancePhotos.length}</p>
        <p>Band photos: {bandPhotos.length}</p>
        {photos.length > 0 && (
          <p>First photo URL: {photos[0].url}</p>
        )}
      </div>
      
      {performancePhotos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {performancePhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group bg-gray-200"
                onClick={() => onPhotoClick?.(photos.indexOf(photo))}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onLoad={() => {
                    console.log('Image loaded successfully:', photo.url);
                  }}
                  onError={(e) => {
                    console.error('Failed to load image:', photo.url);
                    const target = e.target as HTMLImageElement;
                    target.style.backgroundColor = '#f3f4f6';
                    target.style.display = 'flex';
                    target.style.alignItems = 'center';
                    target.style.justifyContent = 'center';
                    target.innerHTML = '<div style="color: #6b7280; font-size: 12px; text-align: center;">Image<br>Failed</div>';
                  }}
                  loading="lazy"
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
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group bg-gray-200"
                onClick={() => onPhotoClick?.(photos.indexOf(photo))}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onLoad={() => {
                    console.log('Image loaded successfully:', photo.url);
                  }}
                  onError={(e) => {
                    console.error('Failed to load image:', photo.url);
                    const target = e.target as HTMLImageElement;
                    target.style.backgroundColor = '#f3f4f6';
                    target.style.display = 'flex';
                    target.style.alignItems = 'center';
                    target.style.justifyContent = 'center';
                    target.innerHTML = '<div style="color: #6b7280; font-size: 12px; text-align: center;">Image<br>Failed</div>';
                  }}
                  loading="lazy"
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