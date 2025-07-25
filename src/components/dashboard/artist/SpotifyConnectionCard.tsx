'use client';

import { useState, useEffect } from 'react';
import { 
  Music, 
  Search, 
  Link as LinkIcon, 
  Unlink, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Users,
  TrendingUp,
  Calendar,
  Disc
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface SpotifyArtist {
  id: string;
  name: string;
  followers: {
    total: number;
  };
  popularity: number;
  genres: string[];
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: { spotify: string };
}

interface SpotifyConnectionCardProps {
  artistId: string;
  currentConnection?: {
    spotifyArtistId: string;
    spotifyVerified: boolean;
    spotifyFollowers: number;
    spotifyPopularity: number;
    lastSpotifySync: string;
  };
  onConnectionUpdate?: () => void;
}

export default function SpotifyConnectionCard({ 
  artistId, 
  currentConnection,
  onConnectionUpdate 
}: SpotifyConnectionCardProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyArtist[]>([]);
  const [connectingArtistId, setConnectingArtistId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&type=artist`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.artists || []);
      }
    } catch (error) {
      console.error('Error searching Spotify:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConnect = async (spotifyArtist: SpotifyArtist) => {
    setConnectingArtistId(spotifyArtist.id);
    try {
      const response = await fetch(`/api/spotify/artist/${artistId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spotifyArtistId: spotifyArtist.id,
          artistData: {
            name: spotifyArtist.name,
            followers: spotifyArtist.followers?.total || 0,
            popularity: spotifyArtist.popularity,
            genres: spotifyArtist.genres,
            images: spotifyArtist.images,
            external_urls: spotifyArtist.external_urls
          }
        })
      });

      if (response.ok) {
        setShowSearch(false);
        setSearchResults([]);
        setSearchQuery('');
        onConnectionUpdate?.();
      }
    } catch (error) {
      console.error('Error connecting to Spotify:', error);
    } finally {
      setConnectingArtistId(null);
    }
  };

  const handleSync = async () => {
    if (!currentConnection?.spotifyArtistId) return;

    setIsSyncing(true);
    try {
      const response = await fetch(`/api/spotify/artist/${artistId}/sync`, {
        method: 'POST'
      });

      if (response.ok) {
        onConnectionUpdate?.();
      }
    } catch (error) {
      console.error('Error syncing with Spotify:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const response = await fetch(`/api/spotify/artist/${artistId}/sync`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onConnectionUpdate?.();
      }
    } catch (error) {
      console.error('Error disconnecting from Spotify:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Spotify Integration</h2>
              <p className="text-sm text-neutral-600">
                Connect your artist profile to Spotify
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {currentConnection?.spotifyVerified && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentConnection?.spotifyVerified ? (
          // Connected State
          <div className="space-y-6">
            {/* Connection Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-900">
                      {formatNumber(currentConnection.spotifyFollowers)}
                    </div>
                    <div className="text-xs text-green-700">Followers</div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                  <div>
                    <div className="font-semibold text-primary-900">
                      {currentConnection.spotifyPopularity}/100
                    </div>
                    <div className="text-xs text-primary-700">Popularity</div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-secondary-600" />
                  <div>
                    <div className="font-semibold text-secondary-900 text-xs">
                      {formatLastSync(currentConnection.lastSpotifySync)}
                    </div>
                    <div className="text-xs text-secondary-700">Last Sync</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Disc className="w-4 h-4 text-yellow-600" />
                  <div>
                    <div className="font-semibold text-yellow-900">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-yellow-700">Active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-green-600 hover:bg-green-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open(`https://open.spotify.com/artist/${currentConnection.spotifyArtistId}`, '_blank')}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Spotify
              </Button>

              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <Unlink className="w-4 h-4 mr-2" />
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            </div>

            {/* Sync Info */}
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div className="text-sm text-neutral-600">
                  <p className="font-medium mb-1">Auto-sync is enabled</p>
                  <p>Your Spotify data will be automatically updated daily. You can also manually sync anytime to get the latest information.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Not Connected State
          <div className="space-y-6">
            {!showSearch ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Connect to Spotify
                </h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Link your artist profile to Spotify to automatically display your music, follower count, and latest releases on your TourPad profile.
                </p>
                <Button
                  onClick={() => setShowSearch(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search for Your Artist Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search Interface */}
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search for your artist name on Spotify..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Search className={`w-4 h-4 mr-2 ${isSearching ? 'animate-spin' : ''}`} />
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-neutral-900">Search Results:</h4>
                    <div className="space-y-2">
                      {searchResults.map((artist) => (
                        <div
                          key={artist.id}
                          className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                        >
                          <div className="flex items-center space-x-4">
                            {artist.images[0] ? (
                              <img
                                src={artist.images[0].url}
                                alt={artist.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                                <Music className="w-6 h-6 text-neutral-400" />
                              </div>
                            )}
                            <div>
                              <h5 className="font-medium text-neutral-900">{artist.name}</h5>
                              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                                <span>{formatNumber(artist.followers?.total || 0)} followers</span>
                                <span>{artist.popularity}/100 popularity</span>
                                {artist.genres.length > 0 && (
                                  <span>{artist.genres.slice(0, 2).join(', ')}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleConnect(artist)}
                            disabled={connectingArtistId === artist.id}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            {connectingArtistId === artist.id ? 'Connecting...' : 'Connect'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancel Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchResults([]);
                      setSearchQuery('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}