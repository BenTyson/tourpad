'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  PlayIcon,
  MusicalNoteIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  LinkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { MediaUploader } from '@/components/media/upload/MediaUploader';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  category?: string;
}

interface VideoLink {
  id: string;
  title: string;
  url: string;
  platform: 'youtube' | 'vimeo' | 'other';
  thumbnail: string;
  category: string;
  isLivePerformance: boolean;
  description?: string;
}

export default function ArtistMediaPage() {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [showVideoLinkForm, setShowVideoLinkForm] = useState(false);
  const [videoLinkForm, setVideoLinkForm] = useState({
    title: '',
    url: '',
    category: '',
    description: '',
    isLivePerformance: false
  });

  // Mock existing media
  const existingVideos: VideoLink[] = [
    {
      id: '1',
      title: 'Live at The Garden House - Full Set',
      url: 'https://youtube.com/watch?v=example1',
      platform: 'youtube',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      category: 'live_performance',
      isLivePerformance: true,
      description: 'Our intimate acoustic set at The Garden House in Austin, TX'
    },
    {
      id: '2',
      title: 'Behind the Scenes - Studio Recording',
      url: 'https://vimeo.com/example2',
      platform: 'vimeo',
      thumbnail: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400',
      category: 'studio',
      isLivePerformance: false,
      description: 'Recording our new single "Mountain Roads"'
    }
  ];

  const existingPhotos = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1551847404-9e05c30b1204?w=400',
      category: 'band_photo',
      title: 'Band Portrait - Sarah, Mike, and Lisa',
      featured: true
    },
    {
      id: '2', 
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      category: 'performance',
      title: 'Live Performance at Riverside Barn',
      featured: false
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400',
      category: 'backstage',
      title: 'Getting Ready Before Show',
      featured: false
    }
  ];

  const videoCategories = [
    { value: 'live_performance', label: '🎵 Live Performance' },
    { value: 'music_video', label: '🎬 Music Video' },
    { value: 'studio', label: '🎙️ Studio Session' },
    { value: 'backstage', label: '🎭 Behind the Scenes' },
    { value: 'interview', label: '💬 Interview' },
    { value: 'promo', label: '📢 Promotional' }
  ];

  const photoCategories = [
    { value: 'band_photo', label: '👥 Band Photos' },
    { value: 'performance', label: '🎤 Live Performance' },
    { value: 'backstage', label: '🎭 Backstage' },
    { value: 'promo', label: '📸 Promotional' },
    { value: 'candid', label: '📷 Candid Shots' },
    { value: 'gear', label: '🎸 Instruments & Gear' }
  ];

  const handleUpload = (files: MediaFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleVideoLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Video link submitted:', videoLinkForm);
    setVideoLinkForm({
      title: '',
      url: '',
      category: '',
      description: '',
      isLivePerformance: false
    });
    setShowVideoLinkForm(false);
  };

  const getCategoryLabel = (value: string, isVideo: boolean = true) => {
    const categories = isVideo ? videoCategories : photoCategories;
    return categories.find(cat => cat.value === value)?.label || value;
  };

  const livePerformanceVideos = existingVideos.filter(v => v.isLivePerformance);
  const otherVideos = existingVideos.filter(v => !v.isLivePerformance);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Artist Media
          </h1>
          <p className="text-gray-600">
            Upload videos, photos, and add YouTube/Vimeo links to showcase your performances
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'videos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎥 Videos ({existingVideos.length})
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'photos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📸 Photos ({existingPhotos.length + uploadedFiles.filter(f => f.type === 'image').length})
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📤 Upload New
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'videos' && (
          <div className="space-y-8">
            {/* Add Video Link Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Video Collection</h2>
              <Button onClick={() => setShowVideoLinkForm(true)}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Add YouTube/Vimeo Link
              </Button>
            </div>

            {/* Video Link Form */}
            {showVideoLinkForm && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Add Video Link</h3>
                  <p className="text-gray-600">Add a YouTube, Vimeo, or other video platform link</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVideoLinkSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Video Title"
                        value={videoLinkForm.title}
                        onChange={(e) => setVideoLinkForm({...videoLinkForm, title: e.target.value})}
                        placeholder="e.g., Live at Coffee House - Full Set"
                        required
                      />
                      <Input
                        label="Video URL"
                        value={videoLinkForm.url}
                        onChange={(e) => setVideoLinkForm({...videoLinkForm, url: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={videoLinkForm.category}
                          onChange={(e) => setVideoLinkForm({...videoLinkForm, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          required
                        >
                          <option value="">Select category</option>
                          {videoCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-center mt-6">
                        <input
                          type="checkbox"
                          id="isLivePerformance"
                          checked={videoLinkForm.isLivePerformance}
                          onChange={(e) => setVideoLinkForm({...videoLinkForm, isLivePerformance: e.target.checked})}
                          className="mr-2"
                        />
                        <label htmlFor="isLivePerformance" className="text-sm text-gray-700">
                          ⭐ Featured Live Performance
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (optional)
                      </label>
                      <textarea
                        value={videoLinkForm.description}
                        onChange={(e) => setVideoLinkForm({...videoLinkForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                        rows={3}
                        placeholder="Describe this performance or video..."
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button type="submit">Add Video</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowVideoLinkForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Live Performance Videos */}
            {livePerformanceVideos.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <StarIcon className="w-6 h-6 text-yellow-500 mr-2" />
                    <h3 className="text-xl font-semibold">Featured Live Performances</h3>
                  </div>
                  <p className="text-gray-600">Your best live performance videos that hosts will see first</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {livePerformanceVideos.map((video) => (
                      <div key={video.id} className="group">
                        <div className="aspect-video relative overflow-hidden rounded-lg mb-3">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                              <PlayIcon className="w-8 h-8 text-gray-900 ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge variant="warning" className="text-xs">
                              Featured
                            </Badge>
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="default" className="text-xs">
                              {video.platform}
                            </Badge>
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900 group-hover:text-[var(--color-evergreen)]">
                          {video.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {getCategoryLabel(video.category)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other Videos */}
            {otherVideos.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Other Videos</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {otherVideos.map((video) => (
                      <div key={video.id} className="group">
                        <div className="aspect-video relative overflow-hidden rounded-lg mb-2">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                              <PlayIcon className="w-6 h-6 text-gray-900 ml-1" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="default" className="text-xs">
                              {video.platform}
                            </Badge>
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {getCategoryLabel(video.category)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900">Photo Collection</h2>
            
            {/* Existing Photos by Category */}
            {photoCategories.map((category) => {
              const categoryPhotos = existingPhotos.filter(photo => photo.category === category.value);
              if (categoryPhotos.length === 0) return null;
              
              return (
                <Card key={category.value}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">
                        {category.label}
                      </h3>
                      <Badge variant="default">
                        {categoryPhotos.length} {categoryPhotos.length === 1 ? 'photo' : 'photos'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categoryPhotos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={photo.url}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          
                          {photo.featured && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="success" className="text-xs">
                                Featured
                              </Badge>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                            <Button size="sm" variant="secondary">
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {photo.title}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Media Guidelines</h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">📹 Videos:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Live performance videos (most important!)</li>
                      <li>• High-quality MP4 files up to 100MB</li>
                      <li>• Good audio quality essential</li>
                      <li>• Show audience engagement when possible</li>
                      <li>• Include venue/setting context</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">📸 Photos:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Professional band photos</li>
                      <li>• Action shots during performances</li>
                      <li>• Behind-the-scenes moments</li>
                      <li>• High resolution (at least 1080p)</li>
                      <li>• Show your personality and style</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Upload Videos & Photos</h2>
                <p className="text-gray-600">Upload MP4 videos and high-quality photos</p>
              </CardHeader>
              <CardContent>
                <MediaUploader
                  acceptedTypes="both"
                  maxFiles={10}
                  maxSizeMB={100}
                  onUpload={handleUpload}
                  categories={[...videoCategories, ...photoCategories]}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
