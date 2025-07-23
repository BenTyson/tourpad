// Utility function to resolve the correct profile image URL
// Based on the same logic used in individual artist/host profile APIs
import { mockArtists, mockHosts } from '@/data/mockData';

export function resolveProfileImageUrl(user: any): string | null {
  if (!user) return null;

  // Debug logging (concise)
  console.log(`[PROFILE IMAGE] Resolving for ${user.userType} "${user.name}" (${user.id})`);

  // Helper function to get fallback from mock data
  const getMockDataFallback = (user: any): string | null => {
    const userType = user.userType?.toLowerCase();
    if (userType === 'artist') {
      // Find matching artist in mock data by userId
      const mockArtist = mockArtists.find(a => a.userId === user.id);
      if (mockArtist) {
        // Try band photos first, then performance photos
        if (mockArtist.bandPhotos && mockArtist.bandPhotos.length > 0) {
          return mockArtist.bandPhotos[0].url;
        }
        if (mockArtist.performancePhotos && mockArtist.performancePhotos.length > 0) {
          return mockArtist.performancePhotos[0].url;
        }
      }
    } else if (userType === 'host') {
      // Find matching host in mock data by userId
      const mockHost = mockHosts.find(h => h.userId === user.id);
      if (mockHost?.hostInfo?.profilePhoto) {
        return mockHost.hostInfo.profilePhoto;
      }
    }
    return null;
  };

  // Normalize userType to handle case variations and infer from data if missing
  let userType = user.userType?.toLowerCase();
  
  // If userType is missing, try to infer it from available data
  if (!userType) {
    if (user.artist) {
      userType = 'artist';
      console.log(`[PROFILE IMAGE] → inferred userType as 'artist' from data`);
    } else if (user.host) {
      userType = 'host';
      console.log(`[PROFILE IMAGE] → inferred userType as 'host' from data`);
    }
  }

  // For artists: prioritize media with category 'profile', then UserProfile, then pressPhoto, then basic User profileImageUrl, then mock data
  if (userType === 'artist') {
    // Check ArtistMedia with category 'profile'
    if (user.artist?.media && user.artist.media.length > 0) {
      const url = user.artist.media[0].fileUrl;
      console.log(`[PROFILE IMAGE] → artist media: ${url}`);
      return url;
    }
    
    // Check UserProfile.profileImageUrl
    if (user.profile?.profileImageUrl) {
      const url = user.profile.profileImageUrl;
      console.log(`[PROFILE IMAGE] → profile URL: ${url}`);
      return url;
    }
    
    // Check Artist.pressPhotoUrl
    if (user.artist?.pressPhotoUrl) {
      const url = user.artist.pressPhotoUrl;
      console.log(`[PROFILE IMAGE] → press photo: ${url}`);
      return url;
    }
    
    // Check basic User.profileImageUrl
    if (user.profileImageUrl) {
      const url = user.profileImageUrl;
      console.log(`[PROFILE IMAGE] → user profile: ${url}`);
      return url;
    }
    
    // Fallback to mock data
    const mockUrl = getMockDataFallback(user);
    if (mockUrl) {
      console.log(`[PROFILE IMAGE] → mock data: ${mockUrl}`);
      return mockUrl;
    }
    
    console.log(`[PROFILE IMAGE] → no image found`);
    return null;
  }

  // For hosts: prioritize UserProfile.profileImageUrl (personal host photo, NOT venue photo), then mock data
  if (userType === 'host') {
    // Check UserProfile.profileImageUrl (personal host photo)
    if (user.profile?.profileImageUrl) {
      const url = user.profile.profileImageUrl;
      console.log(`[PROFILE IMAGE] → profile URL: ${url}`);
      return url;
    }
    
    // Check basic User.profileImageUrl
    if (user.profileImageUrl) {
      const url = user.profileImageUrl;
      console.log(`[PROFILE IMAGE] → user profile: ${url}`);
      return url;
    }
    
    // Fallback to mock data
    const mockUrl = getMockDataFallback(user);
    if (mockUrl) {
      console.log(`[PROFILE IMAGE] → mock data: ${mockUrl}`);
      return mockUrl;
    }
    
    console.log(`[PROFILE IMAGE] → no image found`);
    return null;
  }

  // For other user types (admin, etc.), just use basic profileImageUrl
  if (user.profileImageUrl) {
    const url = user.profileImageUrl;
    console.log(`[PROFILE IMAGE] → basic URL: ${url}`);
    return url;
  }
  
  console.log(`[PROFILE IMAGE] → no basic image found`);
  return null;
}