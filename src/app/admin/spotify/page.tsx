'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Music, Users, AlertCircle, CheckCircle, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface SpotifyArtist {
  id: string;
  stageName?: string;
  name: string;
  spotifyArtistId?: string;
  spotifyVerified: boolean;
  spotifyFollowers?: number;
  spotifyPopularity?: number;
  lastSpotifySync?: string;
  albumCount: number;
  trackCount: number;
}

interface SpotifyHealth {
  status: 'ok' | 'error';
  message: string;
}

export default function AdminSpotifyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [health, setHealth] = useState<SpotifyHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (session.user.type !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [artistsResponse, healthResponse] = await Promise.all([
        fetch('/api/admin/spotify/artists'),
        fetch('/api/spotify/health')
      ]);

      if (artistsResponse.ok) {
        const artistsData = await artistsResponse.json();
        setArtists(artistsData.artists || []);
      }

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setHealth(healthData.spotify);
      }
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (artistId: string) => {
    try {
      setSyncing(artistId);
      
      const response = await fetch(`/api/spotify/artist/${artistId}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spotifyArtistId: artists.find(a => a.id === artistId)?.spotifyArtistId
        }),
      });

      if (response.ok) {
        await fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(`Sync failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error syncing artist:', error);
      alert('Sync failed: Network error');
    } finally {
      setSyncing(null);
    }
  };

  const filteredArtists = artists.filter(artist =>
    (artist.stageName || artist.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading Spotify management...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.type !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Admin access required.</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Spotify Integration Management
              </h1>
              <p className="text-neutral-600">
                Manage artist Spotify connections and sync music data
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Music className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Health Status */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900">API Health Status</h2>
          </CardHeader>
          <CardContent>
            {health ? (
              <div className="flex items-center space-x-4">
                {health.status === 'ok' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <p className={`font-medium ${health.status === 'ok' ? 'text-green-900' : 'text-red-900'}`}>
                    {health.status === 'ok' ? 'Spotify API Connected' : 'Spotify API Error'}
                  </p>
                  <p className="text-sm text-neutral-600">{health.message}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <p className="text-yellow-900">Checking API status...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search artists..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Artists List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <Card key={artist.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      {artist.stageName || artist.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {artist.spotifyVerified ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Connected
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          Not Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {artist.spotifyVerified && (
                  <div className="space-y-2 mb-4 text-sm text-neutral-600">
                    <div className="flex justify-between">
                      <span>Followers:</span>
                      <span>{artist.spotifyFollowers?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Popularity:</span>
                      <span>{artist.spotifyPopularity || 'N/A'}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Albums:</span>
                      <span>{artist.albumCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tracks:</span>
                      <span>{artist.trackCount}</span>
                    </div>
                    {artist.lastSpotifySync && (
                      <div className="flex justify-between">
                        <span>Last Sync:</span>
                        <span>{new Date(artist.lastSpotifySync).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  {artist.spotifyVerified && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSync(artist.id)}
                      disabled={syncing === artist.id}
                      className="flex-1"
                    >
                      {syncing === artist.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync
                        </>
                      )}
                    </Button>
                  )}
                  <Link href={`/admin/spotify/${artist.id}`}>
                    <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
                      Manage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Artists Found</h3>
              <p className="text-neutral-600">
                {searchQuery ? 'No artists match your search criteria.' : 'No artists available to manage.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}