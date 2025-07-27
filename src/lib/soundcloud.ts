import { prisma } from './prisma';

// Types for SoundCloud data
export interface SoundCloudUserData {
  id: number;
  username: string;
  permalink: string;
  avatar_url: string;
  country_code?: string;
  full_name?: string;
  city?: string;
  description?: string;
  discogs_name?: string;
  myspace_name?: string;
  website?: string;
  website_title?: string;
  followers_count: number;
  followings_count: number;
  track_count: number;
  playlist_count: number;
  public_favorites_count: number;
  reposts_count?: number;
  permalink_url: string;
  kind: 'user';
  last_modified: string;
  first_name?: string;
  last_name?: string;
  verified?: boolean;
}

export interface SoundCloudTrackData {
  id: number;
  created_at: string;
  user_id: number;
  duration: number;
  commentable: boolean;
  state: string;
  sharing: string;
  tag_list: string;
  permalink: string;
  description?: string;
  streamable: boolean;
  downloadable: boolean;
  playback_count: number;
  download_count: number;
  favoritings_count: number;
  comment_count: number;
  reposts_count: number;
  release_day?: number;
  release_month?: number;
  release_year?: number;
  title: string;
  track_type?: string;
  genre?: string;
  label_name?: string;
  license: string;
  uri: string;
  permalink_url: string;
  artwork_url?: string;
  waveform_url?: string;
  stream_url?: string;
  download_url?: string;
  user: {
    id: number;
    username: string;
    permalink: string;
    avatar_url: string;
  };
  kind: 'track';
  last_modified: string;
}

export interface SoundCloudResolveResponse {
  id: number;
  kind: 'user' | 'track' | 'playlist';
  [key: string]: any;
}

class SoundCloudService {
  private clientId: string;
  private apiBase = 'https://api.soundcloud.com';
  private tokenExpirationTime: number = 0;
  private accessToken: string | null = null;

  constructor() {
    this.clientId = process.env.SOUNDCLOUD_CLIENT_ID || '';
    if (!this.clientId) {
      console.warn('⚠️ SOUNDCLOUD_CLIENT_ID not found in environment variables');
    }
  }

  /**
   * Authenticate with SoundCloud using Client Credentials flow
   * This gives us access to public catalog data without user authentication
   */
  private async authenticate(): Promise<void> {
    try {
      // Check if we have a valid token
      if (this.accessToken && Date.now() < this.tokenExpirationTime) {
        return; // Token is still valid
      }

      console.log('🎧 Authenticating with SoundCloud API...');
      
      const response = await fetch(`${this.apiBase}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET || '',
          grant_type: 'client_credentials'
        })
      });

      if (!response.ok) {
        throw new Error(`SoundCloud auth failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      this.accessToken = data.access_token;
      // Set expiration time (subtract 5 minutes for safety)
      this.tokenExpirationTime = Date.now() + (data.expires_in - 300) * 1000;
      
      console.log('✅ SoundCloud authentication successful');
    } catch (error) {
      console.error('❌ SoundCloud authentication failed:', error);
      throw new Error('Failed to authenticate with SoundCloud API');
    }
  }

  /**
   * Make authenticated API requests to SoundCloud
   */
  private async apiRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    await this.authenticate();
    
    const url = new URL(`${this.apiBase}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `OAuth ${this.accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search for users by username
   */
  async searchUsers(query: string, limit: number = 10): Promise<SoundCloudUserData[]> {
    try {
      const results = await this.apiRequest('/users', { q: query, limit });
      return Array.isArray(results) ? results : [results];
    } catch (error) {
      console.error('Error searching SoundCloud users:', error);
      throw new Error('Failed to search for users on SoundCloud');
    }
  }

  /**
   * Get user details by SoundCloud user ID
   */
  async getUser(userId: number): Promise<SoundCloudUserData> {
    try {
      return await this.apiRequest(`/users/${userId}`);
    } catch (error) {
      console.error('Error getting SoundCloud user:', error);
      throw new Error('Failed to get user from SoundCloud');
    }
  }

  /**
   * Get user's tracks
   */
  async getUserTracks(userId: number, limit: number = 50): Promise<SoundCloudTrackData[]> {
    try {
      const results = await this.apiRequest(`/users/${userId}/tracks`, { limit });
      return Array.isArray(results) ? results : [results];
    } catch (error) {
      console.error('Error getting user tracks:', error);
      throw new Error('Failed to get user tracks from SoundCloud');
    }
  }

  /**
   * Get track details by SoundCloud track ID
   */
  async getTrack(trackId: number): Promise<SoundCloudTrackData> {
    try {
      return await this.apiRequest(`/tracks/${trackId}`);
    } catch (error) {
      console.error('Error getting SoundCloud track:', error);
      throw new Error('Failed to get track from SoundCloud');
    }
  }

  /**
   * Resolve SoundCloud URL to get resource information
   * Useful for resolving profile URLs to user IDs
   */
  async resolveUrl(url: string): Promise<SoundCloudResolveResponse> {
    try {
      return await this.apiRequest('/resolve', { url });
    } catch (error) {
      console.error('Error resolving SoundCloud URL:', error);
      throw new Error('Failed to resolve SoundCloud URL');
    }
  }

  /**
   * Get stream URL for a track (requires additional processing)
   */
  async getStreamUrl(trackId: number): Promise<string | null> {
    try {
      const track = await this.getTrack(trackId);
      
      if (!track.streamable) {
        return null;
      }

      // SoundCloud stream URLs need to be resolved with the client_id
      if (track.stream_url) {
        return `${track.stream_url}?client_id=${this.clientId}`;
      }

      return null;
    } catch (error) {
      console.error('Error getting stream URL:', error);
      return null;
    }
  }

  /**
   * Sync user data from SoundCloud to database
   */
  async syncUserData(artistId: string, soundcloudUserId: number): Promise<void> {
    try {
      console.log(`🔄 Syncing SoundCloud data for artist ${artistId}...`);

      // Get user data from SoundCloud
      const soundcloudUser = await this.getUser(soundcloudUserId);
      const tracks = await this.getUserTracks(soundcloudUserId);

      // Update artist record with SoundCloud data
      await prisma.artist.update({
        where: { id: artistId },
        data: {
          soundcloudUserId: soundcloudUser.id,
          soundcloudUsername: soundcloudUser.username,
          soundcloudVerified: true,
          soundcloudFollowers: soundcloudUser.followers_count,
          soundcloudTrackCount: soundcloudUser.track_count,
          soundcloudPlaylistCount: soundcloudUser.playlist_count,
          lastSoundCloudSync: new Date(),
        },
      });

      // Sync tracks
      for (const track of tracks) {
        await this.syncTrackData(artistId, track);
      }

      console.log(`✅ SoundCloud sync completed for artist ${artistId}`);
    } catch (error) {
      console.error('Error syncing SoundCloud data:', error);
      throw error;
    }
  }

  /**
   * Sync track data to database
   */
  private async syncTrackData(artistId: string, trackData: SoundCloudTrackData): Promise<void> {
    try {
      // Get stream URL for the track
      const streamUrl = await this.getStreamUrl(trackData.id);

      // Parse tags from tag_list (space or comma-separated)
      const tags = trackData.tag_list
        ? trackData.tag_list.split(/[\s,]+/).filter(tag => tag.length > 0)
        : [];

      await prisma.soundCloudTrack.upsert({
        where: { soundcloudId: trackData.id },
        update: {
          title: trackData.title,
          description: trackData.description || null,
          durationMs: trackData.duration,
          playbackCount: trackData.playback_count,
          likesCount: trackData.favoritings_count,
          streamUrl,
          soundcloudUrl: trackData.permalink_url,
          artworkUrl: trackData.artwork_url || null,
          waveformUrl: trackData.waveform_url || null,
          isStreamable: trackData.streamable,
          genre: trackData.genre || null,
          tags,
          isDownloadable: trackData.downloadable,
          license: trackData.license || null,
        },
        create: {
          soundcloudId: trackData.id,
          artistId,
          title: trackData.title,
          description: trackData.description || null,
          durationMs: trackData.duration,
          playbackCount: trackData.playback_count,
          likesCount: trackData.favoritings_count,
          streamUrl,
          soundcloudUrl: trackData.permalink_url,
          artworkUrl: trackData.artwork_url || null,
          waveformUrl: trackData.waveform_url || null,
          isStreamable: trackData.streamable,
          genre: trackData.genre || null,
          tags,
          isDownloadable: trackData.downloadable,
          license: trackData.license || null,
        },
      });
    } catch (error) {
      console.error('Error syncing SoundCloud track data:', error);
      // Don't throw, continue with other tracks
    }
  }

  /**
   * Cache management
   */
  async getFromCache(key: string): Promise<any | null> {
    try {
      const cached = await prisma.soundCloudCache.findUnique({
        where: { cacheKey: key },
      });

      if (!cached || cached.expiresAt < new Date()) {
        // Cache miss or expired
        if (cached) {
          await prisma.soundCloudCache.delete({
            where: { id: cached.id },
          });
        }
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Error getting from SoundCloud cache:', error);
      return null;
    }
  }

  async setCache(key: string, data: any, expirationMinutes: number = 60): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
      
      await prisma.soundCloudCache.upsert({
        where: { cacheKey: key },
        update: {
          data,
          expiresAt,
        },
        create: {
          cacheKey: key,
          data,
          expiresAt,
        },
      });
    } catch (error) {
      console.error('Error setting SoundCloud cache:', error);
      // Don't throw, caching is not critical
    }
  }

  /**
   * Health check for SoundCloud API
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
    try {
      await this.authenticate();
      
      // Try a simple API call
      await this.apiRequest('/users', { q: 'test', limit: 1 });
      
      return {
        status: 'ok',
        message: 'SoundCloud API is accessible'
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const soundcloudService = new SoundCloudService();