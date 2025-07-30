'use client';
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Camera, Plus, X } from 'lucide-react';
import { ProfileComponentProps } from './types';

export default function PhotosTab({ 
  isArtist, 
  artistProfile, 
  hostProfile, 
  updateArtistProfile, 
  updateHostProfile,
  hasChanges,
  loading 
}: ProfileComponentProps) {
  const [uploading, setUploading] = useState(false);

  const handleArtistPhotoUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setUploading(true);
    const uploadedPhotos = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Please choose images under 5MB.`);
          continue;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'artist-photo');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          uploadedPhotos.push({
            id: `temp-${Date.now()}-${i}`,
            fileUrl: data.url,
            title: file.name.replace(/\.[^/.]+$/, ""),
            description: '',
            category: 'performance',
            sortOrder: (artistProfile.photos || []).length + i,
          });
        }
      }
      
      if (uploadedPhotos.length > 0) {
        console.log('Uploading photos to state:', uploadedPhotos);
        updateArtistProfile({
          photos: [...(artistProfile.photos || []), ...uploadedPhotos]
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload some photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeArtistPhoto = (photoId: string) => {
    updateArtistProfile({
      photos: (artistProfile.photos || []).filter(photo => photo.id !== photoId)
    });
  };

  const handleHostPhotoUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setUploading(true);
    const uploadedPhotos = [];
    
    try {
      for (const file of Array.from(files)) {
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
          console.error('Invalid file type:', file.type);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          console.error('File too large:', file.size);
          continue;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'venue');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          uploadedPhotos.push({
            id: result.id || `temp-${Date.now()}-${Math.random()}`,
            fileUrl: result.url,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            description: '',
            category: 'venue',
            sortOrder: (hostProfile.photos?.length || 0) + uploadedPhotos.length
          });
        } else {
          console.error('Upload failed for:', file.name);
        }
      }
      
      // Add uploaded photos to state
      if (uploadedPhotos.length > 0) {
        updateHostProfile({
          photos: [...(hostProfile.photos || []), ...uploadedPhotos]
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeHostPhoto = (photoId: string) => {
    updateHostProfile({
      photos: (hostProfile.photos || []).filter(photo => photo.id !== photoId)
    });
  };

  return (
    <div className="space-y-6">
      {isArtist ? (
        /* Artist Photo Management */
        <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Performance Photos</h2>
                <p className="text-sm text-neutral-600">Upload photos from your performances, band photos, and promotional images</p>
              </div>
              <Button onClick={() => {
                document.getElementById('photoUpload')?.click();
              }} disabled={uploading}>
                <Camera className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hidden file input */}
            <input
              type="file"
              id="photoUpload"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  handleArtistPhotoUpload(e.target.files);
                }
              }}
              className="hidden"
            />

            {/* Photo Management Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h3 className="font-medium text-neutral-900">Photo Gallery</h3>
                <Badge variant="secondary" className="text-xs">
                  {artistProfile.photos?.length || 0} photos
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-600">Sort:</span>
                <Button variant="outline" size="sm">
                  Manual Order
                </Button>
                <Button variant="outline" size="sm">
                  Upload Date
                </Button>
              </div>
            </div>

            {/* Photo Grid */}
            {artistProfile.photos && artistProfile.photos.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                  <span className="font-medium">💡 Pro tip:</span> Drag and drop photos to reorder them. The first photo will be your featured image.
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {artistProfile.photos.map((photo, index) => (
                    <div key={photo.id} className="relative group">
                      <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                        <img 
                          src={photo.fileUrl} 
                          alt={photo.title || `Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArtistPhoto(photo.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="warning" className="text-xs">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center">
                <Camera className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No photos uploaded yet</h3>
                <p className="text-neutral-600 mb-4">
                  Upload your first photos to showcase your performances and band. You can drag and drop to reorder them.
                </p>
                <Button onClick={() => document.getElementById('photoUpload')?.click()}>
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Your First Photos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Host Photo Management */
        <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900">Venue Photos</h2>
            <p className="text-sm text-neutral-600">Upload photos of your performance space, exterior, and amenities</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Upload Venue Photos</h3>
              <p className="text-neutral-600 mb-4">
                Show artists your performance space, exterior, and amenities
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    handleHostPhotoUpload(e.target.files);
                  }
                }}
                className="hidden"
                id="venuePhotoInput"
              />
              <Button type="button" onClick={() => {
                document.getElementById('venuePhotoInput')?.click();
              }}>
                <Plus className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </Button>
            </div>
            
            {/* Photo Grid */}
            {hostProfile.photos && hostProfile.photos.length > 0 ? (
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hostProfile.photos.map((photo, index) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.fileUrl}
                        alt={photo.title || 'Venue photo'}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => removeHostPhoto(photo.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {photo.title && (
                        <p className="text-xs text-neutral-600 mt-1 truncate">{photo.title}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-t pt-4">
                <p className="text-sm text-neutral-500 text-center py-8">
                  No photos uploaded yet. Add your first venue photo above.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}