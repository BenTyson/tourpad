'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Camera, X } from 'lucide-react';
import { ArtistProfile } from '../types';

interface ThumbnailPhotoCardProps {
  artistProfile: ArtistProfile;
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
}

export default function ThumbnailPhotoCard({
  artistProfile,
  updateArtistProfile
}: ThumbnailPhotoCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Thumbnail Photo
        </h2>
        <p className="text-sm text-neutral-600">
          Square image (minimum 500x500px). This will be used throughout the site as a thumbnail photo when applicable.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
            {artistProfile.thumbnailPhoto ? (
              <img 
                src={artistProfile.thumbnailPhoto} 
                alt="Thumbnail" 
                className="w-32 h-32 object-cover"
              />
            ) : (
              <Camera className="w-12 h-12 text-neutral-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Check file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                      alert('Image file is too large. Please choose an image under 5MB.');
                      return;
                    }
                    
                    try {
                      // Create FormData
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('type', 'profile');
                      
                      // Upload file
                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                      });
                      
                      if (!response.ok) {
                        const error = await response.json();
                        alert(error.error || 'Failed to upload image');
                        return;
                      }
                      
                      const data = await response.json();
                      
                      // Update profile with the new image URL
                      updateArtistProfile({ thumbnailPhoto: data.url });
                      
                      alert('Image uploaded successfully!');
                      
                    } catch (error) {
                      console.error('Upload error:', error);
                      alert('Failed to upload image. Please try again.');
                    }
                  }
                }}
                className="hidden"
                id="thumbnailPhotoInput"
              />
              <label htmlFor="thumbnailPhotoInput" className="cursor-pointer">
                <div className="inline-flex items-center px-4 py-2 text-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-md">
                  <Camera className="w-4 h-4 mr-2" />
                  {artistProfile.thumbnailPhoto ? 'Change Photo' : 'Upload Photo'}
                </div>
              </label>
              {artistProfile.thumbnailPhoto && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateArtistProfile({ thumbnailPhoto: '' })}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-neutral-500">
              Requirements: Square image, minimum 500x500px, JPG or PNG
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              This thumbnail appears in artist cards and search results
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}