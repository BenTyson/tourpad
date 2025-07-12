'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MediaUploader } from '@/components/media/upload/MediaUploader';
import { PhotoGallery } from '@/components/media/PhotoGallery';
import { PhotoLightbox } from '@/components/media/PhotoLightbox';
import { 
  PhotoIcon,
  HomeIcon,
  MapPinIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface HostMedia {
  id: string;
  url: string;
  category: 'exterior' | 'interior' | 'performance_space' | 'amenities' | 'setup';
  title: string;
  description?: string;
}

// Mock data for host venue photos
const mockHostMedia: HostMedia[] = [
  {
    id: '1',
    url: 'https://picsum.photos/800/600?random=1',
    category: 'exterior',
    title: 'Front entrance and street view',
    description: 'Welcoming front entrance with easy street access'
  },
  {
    id: '2', 
    url: 'https://picsum.photos/800/600?random=2',
    category: 'performance_space',
    title: 'Main performance area',
    description: 'Intimate space that seats 30-40 guests comfortably'
  },
  {
    id: '3',
    url: 'https://picsum.photos/800/600?random=3', 
    category: 'amenities',
    title: 'Kitchen and refreshment area',
    description: 'Full kitchen available for catering and refreshments'
  },
  {
    id: '4',
    url: 'https://picsum.photos/800/600?random=4',
    category: 'setup',
    title: 'Sound system and staging',
    description: 'Professional PA system with wireless microphones'
  }
];

const categoryInfo = {
  exterior: {
    icon: HomeIcon,
    title: 'Exterior & Entrance',
    description: 'Show guests what to expect when they arrive',
    color: 'text-blue-600'
  },
  interior: {
    icon: PhotoIcon,
    title: 'Interior Spaces', 
    description: 'General indoor areas and ambiance',
    color: 'text-purple-600'
  },
  performance_space: {
    icon: UserGroupIcon,
    title: 'Performance Area',
    description: 'Where the magic happens - stage and audience seating',
    color: 'text-green-600'
  },
  amenities: {
    icon: Cog6ToothIcon,
    title: 'Amenities & Facilities',
    description: 'Bathrooms, kitchen, parking, and special features',
    color: 'text-yellow-600'
  },
  setup: {
    icon: MapPinIcon,
    title: 'Technical Setup',
    description: 'Sound equipment, lighting, and technical capabilities',
    color: 'text-red-600'
  }
};

export default function HostMediaPage() {
  const [hostMedia, setHostMedia] = useState<HostMedia[]>(mockHostMedia);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryInfo | 'all'>('all');
  const [showUploader, setShowUploader] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleMediaUpload = (files: any[]) => {
    // This would integrate with the existing MediaUploader component
    // For now, we'll simulate adding the uploaded files
    const newMedia = files.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      url: URL.createObjectURL(file.file),
      category: 'interior' as const, // Default category, user can change
      title: file.file.name.split('.')[0],
      description: ''
    }));
    
    setHostMedia(prev => [...newMedia, ...prev]);
    setShowUploader(false);
  };

  const filteredMedia = selectedCategory === 'all' 
    ? hostMedia 
    : hostMedia.filter(media => media.category === selectedCategory);

  const mediaByCategory = Object.keys(categoryInfo).reduce((acc, category) => {
    acc[category] = hostMedia.filter(media => media.category === category);
    return acc;
  }, {} as Record<string, HostMedia[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-neutral-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Venue Media Management</h1>
          <p className="text-gray-600">Showcase your venue to attract artists and create trust with quality photos</p>
        </div>

        {/* Media Guidelines */}
        <Card className="mb-8 border-l-4 border-l-sage-500">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-6 h-6 text-sage-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Photo Guidelines for Hosts</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Exterior:</strong> Show clear entrance, parking, and neighborhood context</li>
                  <li>• <strong>Performance Space:</strong> Capture the intimate atmosphere and seating arrangements</li>
                  <li>• <strong>Amenities:</strong> Highlight bathrooms, kitchen access, and special features</li>
                  <li>• <strong>Technical Setup:</strong> Show sound equipment, electrical access, and staging area</li>
                  <li>• <strong>Quality:</strong> Use good lighting, high resolution (min 1200px wide)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Navigation */}
          <div className="lg:w-1/4">
            <Card className="sticky top-8">
              <CardHeader>
                <h2 className="text-lg font-semibold">Photo Categories</h2>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-primary-100 text-primary-800 border border-primary-200' 
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  <span className="font-medium">All Photos</span>
                  <Badge variant="secondary">{hostMedia.length}</Badge>
                </button>
                
                {Object.entries(categoryInfo).map(([key, info]) => {
                  const Icon = info.icon;
                  const count = mediaByCategory[key]?.length || 0;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as keyof typeof categoryInfo)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === key 
                          ? 'bg-primary-100 text-primary-800 border border-primary-200' 
                          : 'hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <Icon className={`w-5 h-5 ${info.color} flex-shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{info.title}</div>
                          <div className="text-xs text-gray-500 truncate">{info.description}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Upload Section */}
            {!showUploader ? (
              <Card className="mb-8">
                <CardContent className="p-6 text-center">
                  <PhotoIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add More Photos</h3>
                  <p className="text-gray-600 mb-4">
                    Great photos help artists understand your space and feel confident booking
                  </p>
                  <Button onClick={() => setShowUploader(true)}>
                    Upload Photos
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-semibold">Upload Venue Photos</h2>
                  <Button variant="outline" onClick={() => setShowUploader(false)}>
                    Cancel
                  </Button>
                </CardHeader>
                <CardContent>
                  <MediaUploader
                    onUpload={handleMediaUpload}
                    acceptedFileTypes={{
                      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
                    }}
                    maxFiles={10}
                    maxSizeMB={50}
                    categories={Object.keys(categoryInfo).map(key => ({
                      value: key,
                      label: categoryInfo[key as keyof typeof categoryInfo].title
                    }))}
                  />
                </CardContent>
              </Card>
            )}

            {/* Media Display */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {selectedCategory === 'all' 
                      ? 'All Venue Photos' 
                      : categoryInfo[selectedCategory as keyof typeof categoryInfo]?.title
                    }
                  </h2>
                  <Badge variant="secondary">{filteredMedia.length} photos</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {filteredMedia.length > 0 ? (
                  <PhotoGallery
                    photos={filteredMedia.map(media => ({
                      id: media.id,
                      url: media.url,
                      category: media.category,
                      title: media.title,
                      description: media.description
                    }))}
                    onPhotoClick={(index) => setLightboxIndex(index)}
                  />
                ) : (
                  <div className="text-center py-12">
                    <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No photos in this category yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upload photos to showcase your {selectedCategory === 'all' ? 'venue' : categoryInfo[selectedCategory as keyof typeof categoryInfo]?.title.toLowerCase()}
                    </p>
                    <Button onClick={() => setShowUploader(true)}>
                      Upload Photos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <PhotoLightbox
            photos={filteredMedia.map(media => ({
              id: media.id,
              url: media.url,
              category: media.category,
              title: media.title,
              description: media.description
            }))}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </div>
    </div>
  );
}