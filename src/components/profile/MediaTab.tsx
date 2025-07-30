'use client';
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Plus, Music, Edit, X } from 'lucide-react';
import { ProfileComponentProps } from './types';

const VIDEO_CATEGORIES = [
  { value: 'live_performance', label: '🎵 Live Performance' },
  { value: 'music_video', label: '🎬 Music Video' },
  { value: 'studio', label: '🎙️ Studio Session' },
  { value: 'acoustic', label: '🎸 Acoustic Set' },
  { value: 'interview', label: '🎤 Interview' },
  { value: 'behind_scenes', label: '🎬 Behind the Scenes' }
];

export default function MediaTab({ 
  isArtist, 
  artistProfile, 
  hostProfile, 
  updateArtistProfile, 
  updateHostProfile,
  hasChanges,
  loading 
}: ProfileComponentProps) {
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showMusicForm, setShowMusicForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  
  const [videoForm, setVideoForm] = useState({
    title: '',
    url: '',
    category: '',
    isLivePerformance: false
  });

  const [musicForm, setMusicForm] = useState({
    title: '',
    url: '',
    platform: 'spotify'
  });

  const detectPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    if (url.includes('spotify.com')) return 'spotify';
    if (url.includes('bandcamp.com')) return 'bandcamp';
    if (url.includes('soundcloud.com')) return 'soundcloud';
    return 'other';
  };

  const addVideoLink = () => {
    if (!videoForm.title || !videoForm.url || !videoForm.category) return;
    
    const newVideo = {
      id: Date.now().toString(),
      title: videoForm.title,
      url: videoForm.url,
      platform: detectPlatform(videoForm.url),
      category: videoForm.category,
      isLivePerformance: videoForm.isLivePerformance
    };
    
    updateArtistProfile({ videoLinks: [...(artistProfile.videoLinks || []), newVideo] });
    setVideoForm({
      title: '',
      url: '',
      category: '',
      isLivePerformance: false
    });
    setShowVideoForm(false);
  };

  const removeVideoLink = (id: string) => {
    updateArtistProfile({ videoLinks: (artistProfile.videoLinks || []).filter(video => video.id !== id) });
  };

  const editVideoLink = (video: any) => {
    setVideoForm({
      title: video.title,
      url: video.url,
      category: video.category,
      isLivePerformance: video.isLivePerformance
    });
    setEditingVideoId(video.id);
    setShowVideoForm(true);
  };

  const updateVideoLink = () => {
    if (!videoForm.title || !videoForm.url || !videoForm.category || !editingVideoId) return;
    
    const updatedVideos = (artistProfile.videoLinks || []).map(video => 
      video.id === editingVideoId 
        ? {
            ...video,
            title: videoForm.title,
            url: videoForm.url,
            platform: detectPlatform(videoForm.url),
            category: videoForm.category,
            isLivePerformance: videoForm.isLivePerformance
          }
        : video
    );
    
    updateArtistProfile({ videoLinks: updatedVideos });
    setVideoForm({ title: '', url: '', category: '', isLivePerformance: false });
    setEditingVideoId(null);
    setShowVideoForm(false);
  };

  const addMusicSample = () => {
    if (!musicForm.title || !musicForm.url) return;
    
    const newSample = {
      id: Date.now().toString(),
      title: musicForm.title,
      url: musicForm.url,
      platform: detectPlatform(musicForm.url)
    };
    
    updateArtistProfile({ musicSamples: [...(artistProfile.musicSamples || []), newSample] });
    setMusicForm({
      title: '',
      url: '',
      platform: 'spotify'
    });
    setShowMusicForm(false);
  };

  const removeMusicSample = (id: string) => {
    updateArtistProfile({ musicSamples: (artistProfile.musicSamples || []).filter(sample => sample.id !== id) });
  };

  return (
    <div className="space-y-6">
      {isArtist ? (
        <>
          {/* Performance Videos */}
          <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Performance Videos</h2>
                  <p className="text-sm text-neutral-600">Add YouTube, Vimeo, or other video platform links</p>
                </div>
                <Button onClick={() => setShowVideoForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Form */}
              {showVideoForm && (
                <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                  <h3 className="font-medium text-neutral-900 mb-4">
                    {editingVideoId ? 'Edit Video Link' : 'Add Video Link'}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Video Title"
                        placeholder="e.g., Live at Coffee House - Full Set"
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                      />
                      <Input
                        label="Video URL"
                        placeholder="https://youtube.com/watch?v=..."
                        value={videoForm.url}
                        onChange={(e) => setVideoForm({...videoForm, url: e.target.value})}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                        <select
                          value={videoForm.category}
                          onChange={(e) => setVideoForm({...videoForm, category: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select category</option>
                          {VIDEO_CATEGORIES.map(cat => (
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
                          checked={videoForm.isLivePerformance}
                          onChange={(e) => setVideoForm({...videoForm, isLivePerformance: e.target.checked})}
                          className="mr-2"
                        />
                        <label htmlFor="isLivePerformance" className="text-sm text-neutral-700">
                          ⭐ Featured Live Performance
                        </label>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button onClick={editingVideoId ? updateVideoLink : addVideoLink}>
                        {editingVideoId ? 'Update Video' : 'Add Video'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowVideoForm(false);
                          setEditingVideoId(null);
                          setVideoForm({ title: '', url: '', category: '', isLivePerformance: false });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Video List */}
              {artistProfile.videoLinks && artistProfile.videoLinks.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {artistProfile.videoLinks.map((video) => (
                    <div key={video.id} className="border border-neutral-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900">{video.title}</h4>
                          <p className="text-sm text-neutral-600">{VIDEO_CATEGORIES.find(c => c.value === video.category)?.label}</p>
                          {video.isLivePerformance && (
                            <Badge variant="warning" className="mt-1">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editVideoLink(video)}
                            className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 border-primary-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeVideoLink(video.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">{video.url}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-t pt-4">
                  <p className="text-sm text-neutral-500 text-center py-8">
                    No videos added yet. Add your first performance video above.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Music Samples */}
          <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Music Samples</h2>
                  <p className="text-sm text-neutral-600">Add links to your music on streaming platforms</p>
                </div>
                <Button onClick={() => setShowMusicForm(true)}>
                  <Music className="w-4 h-4 mr-2" />
                  Add Track
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Music Form */}
              {showMusicForm && (
                <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                  <h3 className="font-medium text-neutral-900 mb-4">Add Music Sample</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Track Title"
                        placeholder="Song name"
                        value={musicForm.title}
                        onChange={(e) => setMusicForm({...musicForm, title: e.target.value})}
                      />
                      <Input
                        label="Streaming Platform URL"
                        placeholder="https://spotify.com/track/..."
                        value={musicForm.url}
                        onChange={(e) => setMusicForm({...musicForm, url: e.target.value})}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button onClick={addMusicSample}>Add Track</Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowMusicForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Music List */}
              {artistProfile.musicSamples && artistProfile.musicSamples.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {artistProfile.musicSamples.map((sample) => (
                    <div key={sample.id} className="border border-neutral-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900">{sample.title}</h4>
                          <Badge variant="secondary" className="mt-1">
                            {sample.platform}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMusicSample(sample.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">{sample.url}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-t pt-4">
                  <p className="text-sm text-neutral-500 text-center py-8">
                    No music samples added yet. Add your first track above.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        /* Host has no media content - placeholder */
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Media features coming soon!</h3>
          <p className="text-neutral-600">Host media features will be available in a future update.</p>
        </div>
      )}
    </div>
  );
}