// Mock SoundCloud data for testing while waiting for API approval

export const mockSoundCloudUsers = [
  {
    id: 12345678,
    username: "indie_folk_artist",
    permalink: "indie-folk-artist",
    avatar_url: "https://i1.sndcdn.com/avatars-000123456789-abcdef-large.jpg",
    full_name: "Sarah Chen",
    description: "Indie folk musician from Portland. Touring the Pacific Northwest with acoustic storytelling.",
    followers_count: 2847,
    track_count: 24,
    playlist_count: 3,
    permalink_url: "https://soundcloud.com/indie-folk-artist",
    verified: false,
    country_code: "US",
    city: "Portland"
  },
  {
    id: 87654321,
    username: "acoustic_wanderer",
    permalink: "acoustic-wanderer",
    avatar_url: "https://i1.sndcdn.com/avatars-000987654321-fedcba-large.jpg",
    full_name: "Marcus Rodriguez",
    description: "Guitar-driven indie rock with folk influences. Available for house concerts.",
    followers_count: 1293,
    track_count: 18,
    playlist_count: 2,
    permalink_url: "https://soundcloud.com/acoustic-wanderer",
    verified: false,
    country_code: "US",
    city: "Denver"
  },
  {
    id: 11223344,
    username: "coffee_shop_sessions",
    permalink: "coffee-shop-sessions",
    avatar_url: "https://i1.sndcdn.com/avatars-000112233445-abcdef-large.jpg",
    full_name: "Emma Thompson",
    description: "Intimate acoustic performances recorded in coffee shops across America.",
    followers_count: 892,
    track_count: 32,
    playlist_count: 5,
    permalink_url: "https://soundcloud.com/coffee-shop-sessions",
    verified: true,
    country_code: "US",
    city: "Nashville"
  },
  {
    id: 55667788,
    username: "campfire_melodies",
    permalink: "campfire-melodies",
    avatar_url: "https://i1.sndcdn.com/avatars-000556677889-ghijkl-large.jpg",
    full_name: "Alex Kim",
    description: "Folk rock artist specializing in outdoor venues and campfire settings.",
    followers_count: 1567,
    track_count: 21,
    playlist_count: 4,
    permalink_url: "https://soundcloud.com/campfire-melodies",
    verified: false,
    country_code: "US",
    city: "Boulder"
  }
];

export const mockSoundCloudTracks = [
  {
    id: 123456789,
    created_at: "2024-01-15T10:30:00Z",
    user_id: 12345678,
    duration: 238000, // 3:58 in milliseconds
    title: "Mountain Roads",
    description: "A song about traveling through the Rockies, recorded during my Colorado tour.",
    streamable: true,
    downloadable: false,
    playback_count: 1247,
    download_count: 0,
    favoritings_count: 89,
    comment_count: 23,
    reposts_count: 12,
    genre: "Folk",
    tag_list: "folk indie acoustic travel mountains",
    permalink: "mountain-roads",
    permalink_url: "https://soundcloud.com/indie-folk-artist/mountain-roads",
    artwork_url: "https://i1.sndcdn.com/artworks-abc123-def456-large.jpg",
    waveform_url: "https://w1.sndcdn.com/waveforms/abc123def456.png",
    stream_url: "https://api.soundcloud.com/tracks/123456789/stream",
    license: "cc-by-nc",
    track_type: "original",
    user: {
      id: 12345678,
      username: "indie_folk_artist",
      permalink: "indie-folk-artist",
      avatar_url: "https://i1.sndcdn.com/avatars-000123456789-abcdef-large.jpg"
    }
  },
  {
    id: 234567890,
    created_at: "2024-02-02T14:20:00Z",
    user_id: 12345678,
    duration: 195000, // 3:15
    title: "Coffee Shop Blues",
    description: "Recorded live at Moonrise Coffee in Portland. One take, no overdubs.",
    streamable: true,
    downloadable: true,
    playback_count: 892,
    download_count: 34,
    favoritings_count: 67,
    comment_count: 18,
    reposts_count: 8,
    genre: "Blues",
    tag_list: "blues live acoustic coffee shop portland",
    permalink: "coffee-shop-blues",
    permalink_url: "https://soundcloud.com/indie-folk-artist/coffee-shop-blues",
    artwork_url: "https://i1.sndcdn.com/artworks-xyz789-uvw123-large.jpg",
    waveform_url: "https://w1.sndcdn.com/waveforms/xyz789uvw123.png",
    stream_url: "https://api.soundcloud.com/tracks/234567890/stream",
    license: "cc-by",
    track_type: "live",
    user: {
      id: 12345678,
      username: "indie_folk_artist",
      permalink: "indie-folk-artist",
      avatar_url: "https://i1.sndcdn.com/avatars-000123456789-abcdef-large.jpg"
    }
  },
  {
    id: 345678901,
    created_at: "2024-02-20T09:45:00Z",
    user_id: 12345678,
    duration: 267000, // 4:27
    title: "Sunset Highway",
    description: "Written while driving through Oregon at golden hour. Sometimes the best songs happen in the moment.",
    streamable: true,
    downloadable: false,
    playback_count: 1534,
    download_count: 0,
    favoritings_count: 112,
    comment_count: 31,
    reposts_count: 19,
    genre: "Indie Folk",
    tag_list: "indie folk sunset highway oregon traveling",
    permalink: "sunset-highway",
    permalink_url: "https://soundcloud.com/indie-folk-artist/sunset-highway",
    artwork_url: "https://i1.sndcdn.com/artworks-pqr456-stu789-large.jpg",
    waveform_url: "https://w1.sndcdn.com/waveforms/pqr456stu789.png",
    stream_url: "https://api.soundcloud.com/tracks/345678901/stream",
    license: "cc-by-nc-sa",
    track_type: "original",
    user: {
      id: 12345678,
      username: "indie_folk_artist",
      permalink: "indie-folk-artist",
      avatar_url: "https://i1.sndcdn.com/avatars-000123456789-abcdef-large.jpg"
    }
  }
];

export const getMockUserTracks = (userId: number) => {
  return mockSoundCloudTracks.filter(track => track.user_id === userId);
};

export const searchMockUsers = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return mockSoundCloudUsers.filter(user => 
    user.username.toLowerCase().includes(lowercaseQuery) ||
    user.full_name?.toLowerCase().includes(lowercaseQuery) ||
    user.description?.toLowerCase().includes(lowercaseQuery)
  );
};