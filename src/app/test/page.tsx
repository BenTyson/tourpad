'use client';
import { useState } from 'react';
import { MediaUploader } from '@/components/media/upload/MediaUploader';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  category?: string;
}

export default function MediaTestPage() {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);

  const handleUpload = (files: MediaFile[]) => {
    console.log('Files uploaded:', files);
    setUploadedFiles(files);
  };

  const hostCategories = [
    { value: 'exterior', label: 'Exterior' },
    { value: 'interior', label: 'Interior' },
    { value: 'performance_space', label: 'Performance Space' },
    { value: 'amenities', label: 'Amenities' }
  ];

  const artistCategories = [
    { value: 'performance', label: 'Live Performance' },
    { value: 'band_photo', label: 'Band Photos' },
    { value: 'backstage', label: 'Backstage' },
    { value: 'promo', label: 'Promotional' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Media Uploader Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the drag & drop media upload functionality
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Host Photo Uploader */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Host Photos</h2>
              <p className="text-gray-600">Upload venue photos with categories</p>
            </CardHeader>
            <CardContent>
              <MediaUploader
                acceptedTypes="images"
                maxFiles={8}
                maxSizeMB={10}
                onUpload={handleUpload}
                categories={hostCategories}
              />
            </CardContent>
          </Card>

          {/* Artist Media Uploader */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Artist Media</h2>
              <p className="text-gray-600">Upload photos and videos</p>
            </CardHeader>
            <CardContent>
              <MediaUploader
                acceptedTypes="both"
                maxFiles={6}
                maxSizeMB={25}
                onUpload={handleUpload}
                categories={artistCategories}
              />
            </CardContent>
          </Card>
        </div>

        {/* Results Display */}
        {uploadedFiles.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Uploaded Files</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={file.preview} 
                        alt="Preview" 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{file.file.name}</p>
                        <p className="text-sm text-gray-600">
                          {file.type} • {(file.file.size / 1024 / 1024).toFixed(1)} MB
                          {file.category && ` • ${file.category}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-green-600 font-medium">
                      ✓ Uploaded
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}