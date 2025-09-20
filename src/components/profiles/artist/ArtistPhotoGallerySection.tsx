import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { ArtistPhotoGallery } from '@/components/media/ArtistPhotoGallery';

interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  category: "performance" | "band";
  alt: string;
}

interface ArtistPhotoGallerySectionProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function ArtistPhotoGallerySection({
  photos,
  onPhotoClick
}: ArtistPhotoGallerySectionProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">
            Photo Gallery
          </h2>
          <Badge variant="default" className="bg-neutral-100 text-neutral-700 border-neutral-200">
            {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
          </Badge>
        </div>
        <ArtistPhotoGallery
          photos={photos}
          onPhotoClick={onPhotoClick}
        />
      </div>
    </section>
  );
}