'use client';

import { useState, useEffect } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { 
  MusicalNoteIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface UploadedTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  year?: number;
  durationMs?: number;
  fileUrl: string;
  fileSize: number;
  isPublic: boolean;
  sortOrder: number;
  processingStatus: string;
  description?: string;
  createdAt: string;
}

interface UploadedTracksManagerProps {
  artistId: string;
  className?: string;
  onRefresh?: () => void;
}

export const UploadedTracksManager = ({ 
  artistId, 
  className,
  onRefresh 
}: UploadedTracksManagerProps) => {
  const [tracks, setTracks] = useState<UploadedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [editingTrack, setEditingTrack] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    isPublic: true
  });

  // Fetch uploaded tracks
  const fetchTracks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/artists/${artistId}/uploaded-tracks`);
      if (response.ok) {
        const data = await response.json();
        const readyTracks = data.tracks.filter((track: UploadedTrack) => 
          track.processingStatus === 'READY'
        );
        setTracks(readyTracks);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artistId) {
      fetchTracks();
    }
  }, [artistId]);

  // Handle track updates
  const updateTrack = async (trackId: string, updates: any) => {
    try {
      const response = await fetch(`/api/artists/${artistId}/uploaded-tracks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackId,
          ...updates
        })
      });

      if (response.ok) {
        await fetchTracks(); // Refresh tracks
        setEditingTrack(null);
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error updating track:', error);
    }
  };

  // Handle track deletion
  const deleteTrack = async (trackId: string) => {
    if (!confirm('Are you sure you want to delete this track? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/artists/${artistId}/uploaded-tracks?trackId=${trackId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchTracks(); // Refresh tracks
        if (currentTrackIndex >= tracks.length - 1) {
          setCurrentTrackIndex(Math.max(0, tracks.length - 2));
        }
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error deleting track:', error);
    }
  };

  // Handle edit form
  const startEdit = (track: UploadedTrack) => {
    setEditingTrack(track.id);
    setEditForm({
      title: track.title,
      description: track.description || '',
      isPublic: track.isPublic
    });
  };

  const saveEdit = () => {
    if (editingTrack) {
      updateTrack(editingTrack, editForm);
    }
  };

  const cancelEdit = () => {
    setEditingTrack(null);
    setEditForm({ title: '', description: '', isPublic: true });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'Unknown';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage"></div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center p-8 bg-mist/10 rounded-xl">
        <MusicalNoteIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Uploaded Tracks</h3>
        <p className="text-neutral-600">
          Upload your first MP3 file to get started. Your tracks will appear here once uploaded.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Audio Player */}
        <AudioPlayer
          tracks={tracks.map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            album: track.album,
            fileUrl: track.fileUrl,
            durationMs: track.durationMs
          }))}
          currentTrackIndex={currentTrackIndex}
          onTrackChange={setCurrentTrackIndex}
        />

        {/* Track Management */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">
              Manage Your Tracks ({tracks.length})
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              Edit track details, manage visibility, and organize your music
            </p>
          </div>

          <div className="divide-y divide-neutral-200">
            {tracks.map((track, index) => (
              <div key={track.id} className="p-6">
                {editingTrack === track.id ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Description (Optional)
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                        placeholder="Add a description for this track..."
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`public-${track.id}`}
                        checked={editForm.isPublic}
                        onChange={(e) => setEditForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="h-4 w-4 text-sage focus:ring-sage border-neutral-300 rounded"
                      />
                      <label htmlFor={`public-${track.id}`} className="ml-2 text-sm text-neutral-700">
                        Show on public profile
                      </label>
                    </div>

                    <div className="flex space-x-3">
                      <Button onClick={saveEdit} size="sm" className="bg-sage hover:bg-sage/90 text-white">
                        Save Changes
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center">
                        <MusicalNoteIcon className="w-6 h-6 text-sage" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-semibold text-neutral-900 truncate">
                            {track.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            {track.isPublic ? (
                              <EyeIcon className="w-4 h-4 text-green-600" title="Public" />
                            ) : (
                              <EyeSlashIcon className="w-4 h-4 text-neutral-400" title="Private" />
                            )}
                            {index === currentTrackIndex && (
                              <div className="text-sage text-sm font-semibold">Now Playing</div>
                            )}
                          </div>
                        </div>
                        
                        {track.artist && (
                          <p className="text-sm text-neutral-600 mt-1 font-medium">by {track.artist}</p>
                        )}
                        
                        {track.description && (
                          <p className="text-sm text-neutral-700 mt-2">{track.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-neutral-500">
                          <span>Duration: {formatDuration(track.durationMs)}</span>
                          <span>Size: {formatFileSize(track.fileSize)}</span>
                          {track.genre && <span>Genre: {track.genre}</span>}
                          {track.year && <span>Year: {track.year}</span>}
                          <span>Uploaded: {new Date(track.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentTrackIndex(index)}
                        className="p-2 text-neutral-600 hover:text-sage hover:bg-sage/10 rounded-lg transition-colors"
                        title="Play this track"
                      >
                        <MusicalNoteIcon className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => startEdit(track)}
                        className="p-2 text-neutral-600 hover:text-sage hover:bg-sage/10 rounded-lg transition-colors"
                        title="Edit track"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => deleteTrack(track.id)}
                        className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete track"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      
                      <button
                        className="p-2 text-neutral-400 cursor-move"
                        title="Drag to reorder"
                      >
                        <Bars3Icon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};