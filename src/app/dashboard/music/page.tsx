'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import SpotifyConnectionCard from '@/components/dashboard/artist/SpotifyConnectionCard';
import SoundCloudConnectionCard from '@/components/dashboard/artist/SoundCloudConnectionCard';
import { Music, Upload, Headphones } from 'lucide-react';

interface SpotifyConnection {
  spotifyArtistId?: string;
  spotifyVerified?: boolean;
  spotifyFollowers?: number;
  spotifyPopularity?: number;
  lastSpotifySync?: string;
}

interface SoundCloudConnection {
  soundcloudUserId?: number;
  soundcloudUsername?: string;
  soundcloudVerified?: boolean;
  soundcloudFollowers?: number;
  soundcloudTrackCount?: number;
  soundcloudPlaylistCount?: number;
  lastSoundCloudSync?: string;
}

export default function MusicManagementPage() {
  const { data: session, status } = useSession();
  const [spotifyConnection, setSpotifyConnection] = useState<SpotifyConnection | null>(null);
  const [soundcloudConnection, setSoundcloudConnection] = useState<SoundCloudConnection | null>(null);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      redirect('/auth/signin');
      return;
    }

    // Get user profile ID and role
    fetch('/api/user/current')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserProfileId(data.user.id);
          setUserRole(data.user.userType?.toLowerCase());
          
          // If user is an artist, fetch music connections
          if (data.user.userType?.toLowerCase() === 'artist') {
            // Fetch Spotify connection
            fetch(`/api/spotify/artist/${data.user.id}`)
              .then(res => res.json())
              .then(spotifyData => {
                if (spotifyData.artist) {
                  setSpotifyConnection({
                    spotifyArtistId: spotifyData.artist.spotifyArtistId,
                    spotifyVerified: spotifyData.artist.spotifyVerified,
                    spotifyFollowers: spotifyData.artist.spotifyFollowers,
                    spotifyPopularity: spotifyData.artist.spotifyPopularity,
                    lastSpotifySync: spotifyData.artist.lastSpotifySync
                  });
                }
              })
              .catch(err => console.error('Error fetching Spotify connection:', err));

            // Fetch SoundCloud connection
            fetch(`/api/soundcloud/artist/${data.user.id}`)
              .then(res => res.json())
              .then(soundcloudData => {
                if (soundcloudData.artist) {
                  setSoundcloudConnection({
                    soundcloudUserId: soundcloudData.artist.soundcloudUserId,
                    soundcloudUsername: soundcloudData.artist.soundcloudUsername,
                    soundcloudVerified: soundcloudData.artist.soundcloudVerified,
                    soundcloudFollowers: soundcloudData.artist.soundcloudFollowers,
                    soundcloudTrackCount: soundcloudData.artist.soundcloudTrackCount,
                    soundcloudPlaylistCount: soundcloudData.artist.soundcloudPlaylistCount,
                    lastSoundCloudSync: soundcloudData.artist.lastSoundCloudSync
                  });
                }
              })
              .catch(err => console.error('Error fetching SoundCloud connection:', err));
          }
        }
      })
      .catch(err => console.error('Error fetching current user:', err));
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Redirect non-artists
  if (userRole && userRole !== 'artist') {
    redirect('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Music className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Music</h1>
          </div>
          <p className="text-gray-600">
            Connect your streaming platforms and manage your music content to showcase your tracks on your artist profile.
          </p>
        </div>

        {/* Music Platform Integrations */}
        <div className="space-y-8">
          {/* Streaming Platform Connections */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Headphones className="h-5 w-5 text-blue-600" />
              Streaming Platform Connections
            </h2>
            
            <div className="space-y-6">
              {/* Spotify Integration */}
              <SpotifyConnectionCard
                artistId={userProfileId || ''}
                currentConnection={spotifyConnection}
                onConnectionUpdate={() => {
                  // Refresh Spotify connection data
                  if (userProfileId) {
                    fetch(`/api/spotify/artist/${userProfileId}`)
                      .then(res => res.json())
                      .then(data => {
                        if (data.artist) {
                          setSpotifyConnection({
                            spotifyArtistId: data.artist.spotifyArtistId,
                            spotifyVerified: data.artist.spotifyVerified,
                            spotifyFollowers: data.artist.spotifyFollowers,
                            spotifyPopularity: data.artist.spotifyPopularity,
                            lastSpotifySync: data.artist.lastSpotifySync
                          });
                        }
                      })
                      .catch(err => console.error('Error refreshing Spotify connection:', err));
                  }
                }}
              />

              {/* SoundCloud Integration */}
              <SoundCloudConnectionCard
                artistId={userProfileId || ''}
                currentConnection={soundcloudConnection}
                onConnectionUpdate={() => {
                  // Refresh SoundCloud connection data
                  if (userProfileId) {
                    fetch(`/api/soundcloud/artist/${userProfileId}`)
                      .then(res => res.json())
                      .then(data => {
                        if (data.artist) {
                          setSoundcloudConnection({
                            soundcloudUserId: data.artist.soundcloudUserId,
                            soundcloudUsername: data.artist.soundcloudUsername,
                            soundcloudVerified: data.artist.soundcloudVerified,
                            soundcloudFollowers: data.artist.soundcloudFollowers,
                            soundcloudTrackCount: data.artist.soundcloudTrackCount,
                            soundcloudPlaylistCount: data.artist.soundcloudPlaylistCount,
                            lastSoundCloudSync: data.artist.lastSoundCloudSync
                          });
                        }
                      })
                      .catch(err => console.error('Error refreshing SoundCloud connection:', err));
                  }
                }}
              />
            </div>
          </div>

          {/* Direct MP3 Upload Section - Coming Soon */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Direct Music Upload
            </h2>
            
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Direct MP3 Upload
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload your own MP3 files directly to showcase your music, even if you're not on streaming platforms.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-medium">
                    Coming Soon
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    We're working on this feature. For now, connect your Spotify or SoundCloud to showcase your music.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Need Help?
          </h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>• <strong>Spotify:</strong> Connect your verified Spotify for Artists account to sync your tracks automatically.</p>
            <p>• <strong>SoundCloud:</strong> Connect your SoundCloud profile to showcase tracks that may not be on Spotify.</p>
            <p>• <strong>Multiple Platforms:</strong> You can connect both Spotify and SoundCloud - they'll both appear on your profile.</p>
            <p>• <strong>Direct Upload:</strong> MP3 upload feature coming soon for artists not on streaming platforms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}