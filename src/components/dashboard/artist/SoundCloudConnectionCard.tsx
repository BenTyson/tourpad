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
  Play,
  Clock,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface SoundCloudUser {
  id: number;
  username: string;
  permalink: string;
  avatar_url: string;
  full_name?: string;
  description?: string;
  followers_count: number;
  track_count: number;
  playlist_count: number;
  permalink_url: string;
  verified?: boolean;
}

interface SoundCloudConnectionCardProps {
  artistId: string;
  currentConnection?: {
    soundcloudUserId: number;
    soundcloudUsername: string;
    soundcloudVerified: boolean;
    soundcloudFollowers: number;
    soundcloudTrackCount: number;
    soundcloudPlaylistCount: number;
    lastSoundCloudSync: string;
  };
  onConnectionUpdate?: () => void;
}

export default function SoundCloudConnectionCard({ 
  artistId, 
  currentConnection,
  onConnectionUpdate 
}: SoundCloudConnectionCardProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SoundCloudUser[]>([]);
  const [connectingUserId, setConnectingUserId] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/soundcloud/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Error searching SoundCloud:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConnect = async (soundcloudUser: SoundCloudUser) => {
    setConnectingUserId(soundcloudUser.id);
    try {
      const response = await fetch(`/api/soundcloud/artist/${artistId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soundcloudUserId: soundcloudUser.id,
        })
      });

      if (response.ok) {
        setShowSearch(false);
        setSearchResults([]);
        setSearchQuery('');
        onConnectionUpdate?.();
      }
    } catch (error) {
      console.error('Error connecting to SoundCloud:', error);
    } finally {
      setConnectingUserId(null);
    }
  };

  const handleSync = async () => {
    if (!currentConnection?.soundcloudUserId) return;

    setIsSyncing(true);
    try {
      const response = await fetch(`/api/soundcloud/artist/${artistId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (response.ok) {
        onConnectionUpdate?.();
      }
    } catch (error) {
      console.error('Error syncing with SoundCloud:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const response = await fetch(`/api/soundcloud/artist/${artistId}/sync`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onConnectionUpdate?.();
      }
    } catch (error) {
      console.error('Error disconnecting from SoundCloud:', error);
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
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Headphones className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">SoundCloud Integration</h2>
              <p className="text-sm text-neutral-600">
                Connect your artist profile to SoundCloud
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {currentConnection?.soundcloudVerified && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentConnection?.soundcloudVerified ? (
          // Connected State
          <div className="space-y-6">
            {/* Connection Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="font-semibold text-orange-900">
                      {formatNumber(currentConnection.soundcloudFollowers)}
                    </div>
                    <div className="text-xs text-orange-700">Followers</div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                <div className="flex items-center space-x-2">
                  <Music className="w-4 h-4 text-primary-600" />
                  <div>
                    <div className="font-semibold text-primary-900">
                      {formatNumber(currentConnection.soundcloudTrackCount)}
                    </div>
                    <div className="text-xs text-primary-700">Tracks</div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4 text-secondary-600" />
                  <div>
                    <div className="font-semibold text-secondary-900">
                      {formatNumber(currentConnection.soundcloudPlaylistCount)}
                    </div>
                    <div className="text-xs text-secondary-700">Playlists</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <div>
                    <div className="font-semibold text-yellow-900 text-xs">
                      {formatLastSync(currentConnection.lastSoundCloudSync)}
                    </div>
                    <div className="text-xs text-yellow-700">Last Sync</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open(`https://soundcloud.com/${currentConnection.soundcloudUsername}`, '_blank')}
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on SoundCloud
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
                  <p>Your SoundCloud data will be automatically updated daily. You can also manually sync anytime to get the latest tracks and statistics.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Not Connected State
          <div className="space-y-6">
            {!showSearch ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Connect to SoundCloud
                </h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Link your artist profile to SoundCloud to automatically display your tracks, follower count, and latest releases on your TourPad profile.
                </p>
                <Button
                  onClick={() => setShowSearch(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search for Your SoundCloud Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search Interface */}
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search for your username on SoundCloud..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="bg-orange-600 hover:bg-orange-700"
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
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                        >
                          <div className="flex items-center space-x-4">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.username}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                                <Headphones className="w-6 h-6 text-neutral-400" />
                              </div>
                            )}
                            <div>
                              <h5 className="font-medium text-neutral-900">
                                {user.full_name || user.username}
                              </h5>
                              <p className="text-sm text-neutral-600">@{user.username}</p>
                              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                                <span>{formatNumber(user.followers_count)} followers</span>
                                <span>{formatNumber(user.track_count)} tracks</span>
                                {user.verified && (
                                  <Badge className="bg-orange-100 text-orange-800 text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleConnect(user)}
                            disabled={connectingUserId === user.id}
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            {connectingUserId === user.id ? 'Connecting...' : 'Connect'}
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