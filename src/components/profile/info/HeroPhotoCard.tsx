'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Camera, X } from 'lucide-react';
import { ArtistProfile } from '../types';

interface HeroPhotoCardProps {
  artistProfile: ArtistProfile;
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
}

export default function HeroPhotoCard({
  artistProfile,
  updateArtistProfile
}: HeroPhotoCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Hero Photo
        </h2>
        <p className="text-sm text-neutral-600">
          Wide banner image for your artist profile page. Recommended dimensions: 1920x1080 (16:9) or 2400x1200 (2:1)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full h-48 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
            {artistProfile.heroPhoto ? (
              <img 
                src={artistProfile.heroPhoto} 
                alt="Hero Banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">No hero photo uploaded</p>
              </div>
            )}
          </div>
          <div>
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
                      formData.append('type', 'hero');
                      
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
                      updateArtistProfile({ heroPhoto: data.url });
                      
                      alert('Hero photo uploaded successfully!');
                      
                    } catch (error) {
                      console.error('Upload error:', error);
                      alert('Failed to upload image. Please try again.');
                    }
                  }
                }}
                className="hidden"
                id="heroPhotoInput"
              />
              <label htmlFor="heroPhotoInput" className="cursor-pointer">
                <div className="inline-flex items-center px-4 py-2 text-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-md">
                  <Camera className="w-4 h-4 mr-2" />
                  {artistProfile.heroPhoto ? 'Change Hero Photo' : 'Upload Hero Photo'}
                </div>
              </label>
              {artistProfile.heroPhoto && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateArtistProfile({ heroPhoto: '' })}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-neutral-500">
              This wide banner image appears at the top of your artist profile page
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Best results: High-quality landscape photo showing your band performing or a professional promotional shot
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}