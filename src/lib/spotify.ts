import SpotifyWebApi from 'spotify-web-api-node';
import { prisma } from './prisma';

// Types for Spotify data
export interface SpotifyArtistData {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbumData {
  id: string;
  name: string;
  album_type: string;
  release_date: string;
  total_tracks: number;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
  tracks?: {
    items: SpotifyTrackData[];
  };
}

export interface SpotifyTrackData {
  id: string;
  name: string;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  album?: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
}

class SpotifyService {
  private api: SpotifyWebApi;
  private tokenExpirationTime: number = 0;

  constructor() {
    this.api = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
  }

  /**
   * Authenticate with Spotify using Client Credentials flow
   * This gives us access to public catalog data without user authentication
   */
  private async authenticate(): Promise<void> {
    try {
      // Check if we have a valid token
      if (Date.now() < this.tokenExpirationTime) {
        return; // Token is still valid
      }

      console.log('🎵 Authenticating with Spotify API...');
      const data = await this.api.clientCredentialsGrant();
      
      this.api.setAccessToken(data.body.access_token);
      // Set expiration time (subtract 5 minutes for safety)
      this.tokenExpirationTime = Date.now() + (data.body.expires_in - 300) * 1000;
      
      console.log('✅ Spotify authentication successful');
    } catch (error) {
      console.error('❌ Spotify authentication failed:', error);
      throw new Error('Failed to authenticate with Spotify API');
    }
  }

  /**
   * Search for an artist by name
   */
  async searchArtist(artistName: string): Promise<SpotifyArtistData[]> {
    await this.authenticate();
    
    try {
      const searchResults = await this.api.searchArtists(artistName, { limit: 10 });
      return searchResults.body.artists?.items || [];
    } catch (error) {
      console.error('Error searching for artist:', error);
      throw new Error('Failed to search for artist on Spotify');
    }
  }

  /**
   * Get artist details by Spotify ID
   */
  async getArtist(spotifyArtistId: string): Promise<SpotifyArtistData> {
    await this.authenticate();
    
    try {
      const artist = await this.api.getArtist(spotifyArtistId);
      return artist.body;
    } catch (error) {
      console.error('Error getting artist:', error);
      throw new Error('Failed to get artist from Spotify');
    }
  }

  /**
   * Get artist's albums
   */
  async getArtistAlbums(spotifyArtistId: string): Promise<SpotifyAlbumData[]> {
    await this.authenticate();
    
    try {
      const albums = await this.api.getArtistAlbums(spotifyArtistId, {
        album_type: 'album,single',
        country: 'US',
        limit: 50
      });
      return albums.body.items;
    } catch (error) {
      console.error('Error getting artist albums:', error);
      throw new Error('Failed to get artist albums from Spotify');
    }
  }

  /**
   * Get artist's top tracks
   */
  async getArtistTopTracks(spotifyArtistId: string): Promise<SpotifyTrackData[]> {
    await this.authenticate();
    
    try {
      const topTracks = await this.api.getArtistTopTracks(spotifyArtistId, 'US');
      return topTracks.body.tracks;
    } catch (error) {
      console.error('Error getting artist top tracks:', error);
      throw new Error('Failed to get artist top tracks from Spotify');
    }
  }

  /**
   * Get album details with tracks
   */
  async getAlbum(spotifyAlbumId: string): Promise<SpotifyAlbumData> {
    await this.authenticate();
    
    try {
      const album = await this.api.getAlbum(spotifyAlbumId);
      return album.body;
    } catch (error) {
      console.error('Error getting album:', error);
      throw new Error('Failed to get album from Spotify');
    }
  }

  /**
   * Sync artist data from Spotify to database
   */
  async syncArtistData(artistId: string, spotifyArtistId: string): Promise<void> {
    try {
      console.log(`🔄 Syncing Spotify data for artist ${artistId}...`);

      // Get artist data from Spotify
      const spotifyArtist = await this.getArtist(spotifyArtistId);
      const [albums, topTracks] = await Promise.all([
        this.getArtistAlbums(spotifyArtistId),
        this.getArtistTopTracks(spotifyArtistId)
      ]);

      // Update artist record with Spotify data
      await prisma.artist.update({
        where: { id: artistId },
        data: {
          spotifyArtistId,
          spotifyVerified: true,
          spotifyFollowers: spotifyArtist.followers.total,
          spotifyPopularity: spotifyArtist.popularity,
          spotifyGenres: spotifyArtist.genres,
          lastSpotifySync: new Date(),
        },
      });

      // Sync albums
      for (const album of albums) {
        await this.syncAlbumData(artistId, album);
      }

      // Sync top tracks with album linking
      for (const track of topTracks) {
        // Try to find the album for this track
        let albumSpotifyId = null;
        if (track.album?.id) {
          albumSpotifyId = track.album.id;
          // Make sure this album exists in our database
          const albumExists = await prisma.spotifyAlbum.findUnique({
            where: { spotifyId: albumSpotifyId }
          });
          
          if (!albumExists && track.album?.images?.length > 0) {
            // Only create album from track info if it has images and doesn't exist
            // Fetch full album data from Spotify to get complete information
            try {
              const fullAlbumData = await this.getAlbum(track.album.id);
              await this.syncAlbumData(artistId, fullAlbumData);
            } catch (error) {
              console.warn(`Could not fetch full album data for ${track.album.id}, using track info`);
              // Fallback to track info if full album fetch fails
              const albumData: SpotifyAlbumData = {
                id: track.album.id,
                name: track.album.name,
                album_type: 'unknown',
                release_date: '',
                total_tracks: 0,
                images: track.album.images,
                external_urls: { spotify: `https://open.spotify.com/album/${track.album.id}` },
              };
              await this.syncAlbumData(artistId, albumData);
            }
          }
        }
        
        await this.syncTrackData(artistId, track, albumSpotifyId || undefined);
      }

      console.log(`✅ Spotify sync completed for artist ${artistId}`);
    } catch (error) {
      console.error('Error syncing artist data:', error);
      throw error;
    }
  }

  /**
   * Sync album data to database
   */
  private async syncAlbumData(artistId: string, albumData: SpotifyAlbumData): Promise<void> {
    try {
      // Get the largest image URL
      const imageUrl = albumData.images?.[0]?.url || null;
      
      // Debug logging for image URLs
      console.log(`🖼️  Syncing album "${albumData.name}":`, {
        hasImages: albumData.images?.length > 0,
        imageCount: albumData.images?.length || 0,
        imageUrl: imageUrl ? imageUrl.substring(0, 50) + '...' : 'NULL'
      });

      await prisma.spotifyAlbum.upsert({
        where: { spotifyId: albumData.id },
        update: {
          name: albumData.name,
          albumType: albumData.album_type,
          releaseDate: albumData.release_date,
          imageUrl,
          spotifyUrl: albumData.external_urls.spotify,
          totalTracks: albumData.total_tracks,
        },
        create: {
          spotifyId: albumData.id,
          artistId,
          name: albumData.name,
          albumType: albumData.album_type,
          releaseDate: albumData.release_date,
          imageUrl,
          spotifyUrl: albumData.external_urls.spotify,
          totalTracks: albumData.total_tracks,
        },
      });

      // If album has tracks, sync them too
      if (albumData.tracks?.items) {
        for (const track of albumData.tracks.items) {
          await this.syncTrackData(artistId, track, albumData.id);
        }
      }
    } catch (error) {
      console.error('Error syncing album data:', error);
      // Don't throw, continue with other albums
    }
  }

  /**
   * Sync track data to database
   */
  private async syncTrackData(
    artistId: string, 
    trackData: SpotifyTrackData, 
    albumSpotifyId?: string
  ): Promise<void> {
    try {
      // Find album ID if provided
      let albumId = null;
      if (albumSpotifyId) {
        const album = await prisma.spotifyAlbum.findUnique({
          where: { spotifyId: albumSpotifyId },
          select: { id: true }
        });
        albumId = album?.id || null;
      }

      await prisma.spotifyTrack.upsert({
        where: { spotifyId: trackData.id },
        update: {
          name: trackData.name,
          durationMs: trackData.duration_ms,
          popularity: trackData.popularity,
          previewUrl: trackData.preview_url,
          spotifyUrl: trackData.external_urls.spotify,
          trackNumber: trackData.track_number,
          explicit: trackData.explicit,
          albumId,
        },
        create: {
          spotifyId: trackData.id,
          artistId,
          albumId,
          name: trackData.name,
          durationMs: trackData.duration_ms,
          popularity: trackData.popularity,
          previewUrl: trackData.preview_url,
          spotifyUrl: trackData.external_urls.spotify,
          trackNumber: trackData.track_number,
          explicit: trackData.explicit,
        },
      });
    } catch (error) {
      console.error('Error syncing track data:', error);
      // Don't throw, continue with other tracks
    }
  }

  /**
   * Cache management
   */
  async getFromCache(key: string): Promise<any | null> {
    try {
      const cached = await prisma.spotifyCache.findUnique({
        where: { cacheKey: key },
      });

      if (!cached || cached.expiresAt < new Date()) {
        // Cache miss or expired
        if (cached) {
          await prisma.spotifyCache.delete({
            where: { id: cached.id },
          });
        }
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return null;
    }
  }

  async setCache(key: string, data: any, expirationMinutes: number = 60): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
      
      await prisma.spotifyCache.upsert({
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
      console.error('Error setting cache:', error);
      // Don't throw, caching is not critical
    }
  }

  /**
   * Health check for Spotify API
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
    try {
      await this.authenticate();
      
      // Try a simple API call
      await this.api.searchArtists('test', { limit: 1 });
      
      return {
        status: 'ok',
        message: 'Spotify API is accessible'
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
export const spotifyService = new SpotifyService();