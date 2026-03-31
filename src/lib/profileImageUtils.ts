// Utility function to resolve the correct profile image URL
// Based on the same logic used in individual artist/host profile APIs
import { mockArtists, mockHosts } from '@/data/mockData';
import { logger } from '@/lib/logger';

export function resolveProfileImageUrl(user: any): string | null {
  if (!user) return null;

  // Helper function to get fallback from mock data
  const getMockDataFallback = (user: any): string | null => {
    const userType = user.userType?.toLowerCase();
    if (userType === 'artist') {
      const mockArtist = mockArtists.find(a => a.userId === user.id);
      if (mockArtist) {
        if (mockArtist.bandPhotos && mockArtist.bandPhotos.length > 0) {
          return mockArtist.bandPhotos[0].url;
        }
        if (mockArtist.performancePhotos && mockArtist.performancePhotos.length > 0) {
          return mockArtist.performancePhotos[0].url;
        }
      }
    } else if (userType === 'host') {
      const mockHost = mockHosts.find(h => h.userId === user.id);
      if (mockHost?.hostInfo?.profilePhoto) {
        return mockHost.hostInfo.profilePhoto;
      }
    }
    return null;
  };

  // Normalize userType to handle case variations and infer from data if missing
  let userType = user.userType?.toLowerCase();

  if (!userType) {
    if (user.artist) {
      userType = 'artist';
    } else if (user.host) {
      userType = 'host';
    }
  }

  // For artists: prioritize media with category 'profile', then UserProfile, then pressPhoto, then basic User profileImageUrl, then mock data
  if (userType === 'artist') {
    if (user.artist?.media && user.artist.media.length > 0) {
      return user.artist.media[0].fileUrl;
    }
    if (user.profile?.profileImageUrl) {
      return user.profile.profileImageUrl;
    }
    if (user.artist?.pressPhotoUrl) {
      return user.artist.pressPhotoUrl;
    }
    if (user.profileImageUrl) {
      return user.profileImageUrl;
    }
    const mockUrl = getMockDataFallback(user);
    if (mockUrl) return mockUrl;

    logger.info('No profile image found', { userId: user.id, userType });
    return null;
  }

  // For hosts: prioritize UserProfile.profileImageUrl (personal host photo, NOT venue photo), then mock data
  if (userType === 'host') {
    if (user.profile?.profileImageUrl) {
      return user.profile.profileImageUrl;
    }
    if (user.profileImageUrl) {
      return user.profileImageUrl;
    }
    const mockUrl = getMockDataFallback(user);
    if (mockUrl) return mockUrl;

    logger.info('No profile image found', { userId: user.id, userType });
    return null;
  }

  // For other user types (admin, etc.), just use basic profileImageUrl
  if (user.profileImageUrl) {
    return user.profileImageUrl;
  }

  return null;
}
