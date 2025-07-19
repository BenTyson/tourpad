'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Camera,
  Video,
  Music,
  UserCircle,
  MapPin,
  Globe,
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
  Star,
  Eye,
  Edit,
  Home,
  Users,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

const GENRE_OPTIONS = [
  'Folk', 'Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Classical', 'Electronic',
  'Hip Hop', 'R&B', 'Soul', 'Funk', 'Reggae', 'World', 'Experimental', 'Ambient'
];

const INSTRUMENT_OPTIONS = [
  'Guitar', 'Piano', 'Vocals', 'Bass', 'Drums', 'Violin', 'Cello', 'Flute',
  'Saxophone', 'Trumpet', 'Harmonica', 'Banjo', 'Mandolin', 'Synthesizer', 'Ukulele'
];

const AMENITY_OPTIONS = [
  'Power access for equipment',
  'Kid friendly environment',
  'Sound system provided',
  'Overnight accommodation',
  'Air conditioning / Heating',
  'Free parking on premises',
  'WiFi available',
  'Step-free access',
  'Food & Refreshments'
];

const EQUIPMENT_OPTIONS = [
  'All instruments and personal gear',
  'Professional sound equipment',
  'Microphones and stands',
  'Basic lighting setup',
  'PA system',
  'Amplifiers',
  'Cables and adapters',
  'Stage monitors'
];

const VENUE_REQUIREMENT_OPTIONS = [
  'Performance space (min 12x10 feet)',
  '2-3 power outlets',
  'Seating for audience',
  'Parking space',
  'Load-in access',
  'Green room/prep space',
  'Piano/keyboard',
  'Sound system hookup'
];

const VIDEO_CATEGORIES = [
  { value: 'live_performance', label: '🎵 Live Performance' },
  { value: 'music_video', label: '🎬 Music Video' },
  { value: 'studio', label: '🎙️ Studio Session' },
  { value: 'backstage', label: '🎭 Behind the Scenes' },
  { value: 'interview', label: '💬 Interview' },
  { value: 'promo', label: '📢 Promotional' }
];

const MUSIC_PLATFORMS = [
  { value: 'spotify', label: 'Spotify' },
  { value: 'apple_music', label: 'Apple Music' },
  { value: 'bandcamp', label: 'Bandcamp' },
  { value: 'soundcloud', label: 'SoundCloud' },
  { value: 'youtube', label: 'YouTube Music' },
  { value: 'other', label: 'Other' }
];

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'media' | 'sound-system'>('info');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Profile state
  const [artistProfile, setArtistProfile] = useState({
    bandName: '',
    bio: '',
    city: '',
    state: '',
    profilePhoto: '',
    genres: [] as string[],
    instruments: [] as string[],
    experienceLevel: 'intermediate' as 'beginner' | 'intermediate' | 'professional',
    yearsActive: 1,
    tourMonthsPerYear: 3,
    tourVehicle: 'van' as string,
    willingToTravel: 500,
    needsLodging: false,
    equipmentProvided: [] as string[],
    venueRequirements: [] as string[],
    cancellationPolicy: 'flexible' as 'flexible' | 'moderate' | 'strict',
    performanceRadius: 50,
    website: '',
    socialLinks: {
      website: '',
      instagram: '',
      youtube: '',
      spotify: '',
      bandcamp: '',
      facebook: ''
    },
    bandMembers: [] as Array<{id: string, name: string, instrument: string, photo?: string}>,
    videoLinks: [] as Array<{
      id: string;
      title: string;
      url: string;
      platform: string;
      category: string;
      isLivePerformance: boolean;
    }>,
    musicSamples: [] as Array<{
      id: string;
      title: string;
      url: string;
      platform: string;
    }>,
    photos: [] as Array<{
      id: string;
      fileUrl: string;
      title?: string;
      description?: string;
      sortOrder: number;
      category?: string;
    }>
  });

  // Media state - now part of artistProfile

  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showMusicForm, setShowMusicForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [videoForm, setVideoForm] = useState({
    title: '',
    url: '',
    category: '',
    isLivePerformance: false
  });

  const [musicForm, setMusicForm] = useState({
    title: '',
    url: '',
    platform: 'spotify'
  });

  const [hostProfile, setHostProfile] = useState({
    venueName: '', // This is the venue name like "Mike's Overlook"
    venueDescription: '', // This describes the venue/house itself
    city: '',
    state: '',
    zip: '',
    profilePhoto: '',
    venuePhoto: '', // Main venue photo
    venueType: 'home' as 'home' | 'studio' | 'backyard' | 'loft' | 'warehouse' | 'other',
    indoorCapacity: 20,
    outdoorCapacity: 0,
    amenities: [] as string[],
    typicalShowLength: 90, // minutes
    preferredDays: [] as string[], // days of week
    soundSystem: {
      available: true,
      description: '',
      equipment: {
        speakers: '',
        microphones: '',
        instruments: '',
        additional: ''
      }
    },
    hostInfo: {
      hostName: '', // This is the personal host name like "Mike Chen"
      aboutMe: '', // This is about the host as a person
      profilePhoto: ''
    },
    website: '',
    socialLinks: {
      website: '',
      instagram: '',
      youtube: '',
      facebook: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const data = await response.json();
            
            if (session.user.type === 'artist') {
              setArtistProfile({
                bandName: data.bandName || '',
                bio: data.bio || '',
                city: data.city || '',
                state: data.state || '',
                genres: data.genres || [],
                instruments: data.instruments || [],
                experienceLevel: data.experienceLevel || 'intermediate',
                yearsActive: data.yearsActive || 1,
                tourMonthsPerYear: data.tourMonthsPerYear || 3,
                tourVehicle: data.tourVehicle || 'van',
                willingToTravel: data.willingToTravel || 500,
                needsLodging: data.needsLodging || false,
                equipmentProvided: data.equipmentProvided || [],
                venueRequirements: data.venueRequirements || [],
                profilePhoto: data.profilePhoto || '',
                cancellationPolicy: 'flexible',
                performanceRadius: 50,
                website: data.website || '',
                socialLinks: {
                  website: data.socialLinks?.website || data.website || '',
                  instagram: data.socialLinks?.instagram || '',
                  youtube: data.socialLinks?.youtube || '',
                  spotify: data.socialLinks?.spotify || '',
                  bandcamp: data.socialLinks?.bandcamp || '',
                  facebook: data.socialLinks?.facebook || ''
                },
                bandMembers: data.bandMembers || [],
                videoLinks: data.videoLinks || [],
                musicSamples: data.musicSamples || [],
                photos: data.photos || []
              });
            } else if (session.user.type === 'host') {
              setHostProfile({
                venueName: data.venueName || data.hostName || '',
                venueDescription: data.venueDescription || data.bio || '',
                city: data.city || '',
                state: data.state || '',
                zip: '',
                profilePhoto: data.profilePhoto || '',
                venuePhoto: data.venuePhoto || '',
                venueType: data.venueType || 'home',
                indoorCapacity: data.indoorCapacity || 20,
                outdoorCapacity: data.outdoorCapacity || 0,
                amenities: data.amenities || [],
                typicalShowLength: data.typicalShowLength || 90,
                preferredDays: data.preferredDays || data.preferredGenres || [],
                soundSystem: data.soundSystem || {
                  available: true,
                  description: '',
                  equipment: {
                    speakers: '',
                    microphones: '',
                    mixingBoard: '',
                    instruments: '',
                    additional: ''
                  },
                  limitations: '',
                  setupNotes: ''
                },
                hostInfo: {
                  hostName: data.hostInfo?.hostName || '',
                  aboutMe: data.hostInfo?.aboutMe || '',
                  profilePhoto: data.hostInfo?.profilePhoto || data.profilePhoto || ''
                },
                website: data.website || '',
                socialLinks: {
                  website: data.socialLinks?.website || data.website || '',
                  instagram: data.socialLinks?.instagram || '',
                  youtube: data.socialLinks?.youtube || '',
                  facebook: data.socialLinks?.facebook || ''
                }
              });
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    
    fetchProfile();
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Please sign in to edit your profile.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const userType = session.user.type;
  const isArtist = userType === 'artist';
  
  // Debug logging
  console.log('Session user:', {
    id: session.user.id,
    type: session.user.type,
    host: session.user.host,
    artist: session.user.artist
  });

  // Artist helper functions
  const updateArtistProfile = (updates: Partial<typeof artistProfile>) => {
    setArtistProfile(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const updateHostProfile = (updates: Partial<typeof hostProfile>) => {
    setHostProfile(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const addGenre = (genre: string) => {
    if (!artistProfile.genres.includes(genre)) {
      updateArtistProfile({ genres: [...artistProfile.genres, genre] });
    }
  };

  const removeGenre = (genre: string) => {
    updateArtistProfile({ genres: artistProfile.genres.filter(g => g !== genre) });
  };

  const addInstrument = (instrument: string) => {
    if (!artistProfile.instruments.includes(instrument)) {
      updateArtistProfile({ instruments: [...artistProfile.instruments, instrument] });
    }
  };

  const removeInstrument = (instrument: string) => {
    updateArtistProfile({ instruments: artistProfile.instruments.filter(i => i !== instrument) });
  };

  const addAmenity = (amenity: string) => {
    if (!hostProfile.amenities.includes(amenity)) {
      updateHostProfile({ amenities: [...hostProfile.amenities, amenity] });
    }
  };

  const removeAmenity = (amenity: string) => {
    updateHostProfile({ amenities: hostProfile.amenities.filter(a => a !== amenity) });
  };

  const addEquipment = (equipment: string) => {
    if (!artistProfile.equipmentProvided.includes(equipment)) {
      updateArtistProfile({ equipmentProvided: [...artistProfile.equipmentProvided, equipment] });
    }
  };

  const removeEquipment = (equipment: string) => {
    updateArtistProfile({ equipmentProvided: artistProfile.equipmentProvided.filter(e => e !== equipment) });
  };

  const addVenueRequirement = (requirement: string) => {
    if (!artistProfile.venueRequirements.includes(requirement)) {
      updateArtistProfile({ venueRequirements: [...artistProfile.venueRequirements, requirement] });
    }
  };

  const removeVenueRequirement = (requirement: string) => {
    updateArtistProfile({ venueRequirements: artistProfile.venueRequirements.filter(r => r !== requirement) });
  };

  const addBandMember = () => {
    const newMember = {
      id: Date.now().toString(),
      name: '',
      instrument: '',
      photo: ''
    };
    updateArtistProfile({ bandMembers: [...artistProfile.bandMembers, newMember] });
  };

  const updateBandMember = (id: string, field: string, value: string) => {
    updateArtistProfile({
      bandMembers: artistProfile.bandMembers.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    });
  };

  const removeBandMember = (id: string) => {
    updateArtistProfile({
      bandMembers: artistProfile.bandMembers.filter(member => member.id !== id)
    });
  };

  // Media helper functions
  const addVideoLink = () => {
    if (!videoForm.title || !videoForm.url || !videoForm.category) return;
    
    const newVideo = {
      id: Date.now().toString(),
      title: videoForm.title,
      url: videoForm.url,
      platform: detectPlatform(videoForm.url),
      category: videoForm.category,
      isLivePerformance: videoForm.isLivePerformance
    };
    
    updateArtistProfile({ videoLinks: [...(artistProfile.videoLinks || []), newVideo] });
    setVideoForm({
      title: '',
      url: '',
      category: '',
      description: '',
      isLivePerformance: false
    });
    setShowVideoForm(false);
  };

  const removeVideoLink = (id: string) => {
    updateArtistProfile({ videoLinks: (artistProfile.videoLinks || []).filter(video => video.id !== id) });
  };

  const editVideoLink = (video: any) => {
    setVideoForm({
      title: video.title,
      url: video.url,
      category: video.category,
      isLivePerformance: video.isLivePerformance
    });
    setEditingVideoId(video.id);
    setShowVideoForm(true);
  };

  const updateVideoLink = () => {
    if (!videoForm.title || !videoForm.url || !videoForm.category || !editingVideoId) return;
    
    const updatedVideos = (artistProfile.videoLinks || []).map(video => 
      video.id === editingVideoId 
        ? {
            ...video,
            title: videoForm.title,
            url: videoForm.url,
            platform: detectPlatform(videoForm.url),
            category: videoForm.category,
            isLivePerformance: videoForm.isLivePerformance
          }
        : video
    );
    
    updateArtistProfile({ videoLinks: updatedVideos });
    setVideoForm({ title: '', url: '', category: '', isLivePerformance: false });
    setEditingVideoId(null);
    setShowVideoForm(false);
  };

  const addMusicSample = () => {
    if (!musicForm.title || !musicForm.url) return;
    
    const newSample = {
      id: Date.now().toString(),
      title: musicForm.title,
      url: musicForm.url,
      platform: detectPlatform(musicForm.url)
    };
    
    updateArtistProfile({ musicSamples: [...(artistProfile.musicSamples || []), newSample] });
    setMusicForm({
      title: '',
      url: '',
      platform: 'spotify'
    });
    setShowMusicForm(false);
  };

  const handlePhotoUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setUploading(true);
    try {
      const uploadedPhotos = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'performance-photo');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          uploadedPhotos.push({
            id: Date.now().toString() + i,
            fileUrl: data.url,
            title: '',
            description: '',
            sortOrder: (artistProfile.photos || []).length + i,
            category: 'performance'
          });
        }
      }
      
      if (uploadedPhotos.length > 0) {
        console.log('Uploading photos to state:', uploadedPhotos);
        updateArtistProfile({ 
          photos: [...(artistProfile.photos || []), ...uploadedPhotos] 
        });
        console.log('Photos added to state');
      }
    } catch (error) {
      console.error('Photo upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (photoId: string) => {
    updateArtistProfile({ 
      photos: (artistProfile.photos || []).filter(photo => photo.id !== photoId) 
    });
  };

  const reorderPhotos = (dragIndex: number, hoverIndex: number) => {
    const photos = [...(artistProfile.photos || [])];
    const draggedPhoto = photos[dragIndex];
    photos.splice(dragIndex, 1);
    photos.splice(hoverIndex, 0, draggedPhoto);
    
    // Update sort order
    const reorderedPhotos = photos.map((photo, index) => ({
      ...photo,
      sortOrder: index
    }));
    
    updateArtistProfile({ photos: reorderedPhotos });
  };

  const removeMusicSample = (id: string) => {
    updateArtistProfile({ musicSamples: (artistProfile.musicSamples || []).filter(sample => sample.id !== id) });
  };

  const detectPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    if (url.includes('spotify.com')) return 'spotify';
    if (url.includes('bandcamp.com')) return 'bandcamp';
    if (url.includes('soundcloud.com')) return 'soundcloud';
    return 'other';
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const profileData = isArtist ? artistProfile : hostProfile;
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }

      setHasChanges(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900">Edit Profile</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href={`/${isArtist ? 'artists' : 'hosts'}/${isArtist ? (session.user.artist?.id || session.user.id) : 'cmd8zfdyf000aluf9h4l2k90w'}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </Link>
            {hasChanges && (
              <>
                <Badge variant="warning" className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Unsaved
                </Badge>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation - Sleek Modern Design */}
        <div className="mb-8">
          <nav className="flex space-x-2 bg-neutral-50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'info'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'photos'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              {isArtist ? 'Press Photos & Band' : 'Venue Photos'}
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'media'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              {isArtist ? (
                <Video className="w-4 h-4 mr-2" />
              ) : (
                <Camera className="w-4 h-4 mr-2" />
              )}
              {isArtist ? 'Music & Media' : 'Gallery'}
            </button>
            {!isArtist && (
              <button
                onClick={() => setActiveTab('sound-system')}
                className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === 'sound-system'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                }`}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Sound System & Equipment
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Information Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-neutral-900">Venue Basics</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label={isArtist ? "Artist/Band Name" : "Venue Name"}
                    value={isArtist ? artistProfile.bandName : hostProfile.venueName}
                    onChange={(e) => {
                      if (isArtist) updateArtistProfile({ bandName: e.target.value });
                      else updateHostProfile({ venueName: e.target.value });
                    }}
                    placeholder={isArtist ? "Your stage name or band name" : "Your venue name (e.g., 'Mike's Overlook')"}
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      {isArtist ? "Artist Bio" : "Venue Description"}
                    </label>
                    <textarea
                      value={isArtist ? artistProfile.bio : hostProfile.venueDescription}
                      onChange={(e) => {
                        if (isArtist) updateArtistProfile({ bio: e.target.value });
                        else updateHostProfile({ venueDescription: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={4}
                      placeholder={isArtist 
                        ? "Tell hosts about your music, style, and what makes your performances special..."
                        : "Describe your space, atmosphere, and what makes it perfect for house concerts..."
                      }
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      value={isArtist ? artistProfile.city : hostProfile.city}
                      onChange={(e) => {
                        if (isArtist) updateArtistProfile({ city: e.target.value });
                        else updateHostProfile({ city: e.target.value });
                      }}
                    />
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">State</label>
                      <select
                        value={isArtist ? artistProfile.state : hostProfile.state}
                        onChange={(e) => {
                          if (isArtist) updateArtistProfile({ state: e.target.value });
                          else updateHostProfile({ state: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select a state</option>
                        {US_STATES.map((state) => (
                          <option key={state.value} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {!isArtist && (
                      <Input
                        label="ZIP Code"
                        value={hostProfile.zip}
                        onChange={(e) => updateHostProfile({ zip: e.target.value })}
                      />
                    )}
                  </div>
                  
                  {/* Venue Profile Photo */}
                  {!isArtist && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Venue Profile Photo</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center">
                          {hostProfile.venuePhoto ? (
                            <img 
                              src={hostProfile.venuePhoto} 
                              alt="Venue profile" 
                              className="w-20 h-20 object-cover"
                            />
                          ) : (
                            <Home className="w-10 h-10 text-neutral-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Check file size (max 5MB)
                                if (file.size > 5 * 1024 * 1024) {
                                  alert('Image file is too large. Please choose an image under 5MB.');
                                  return;
                                }
                                
                                try {
                                  // Create FormData
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  formData.append('type', 'venue');
                                  
                                  // Upload file
                                  const response = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  
                                  if (!response.ok) {
                                    const error = await response.json();
                                    alert(error.error || 'Failed to upload image');
                                    return;
                                  }
                                  
                                  const result = await response.json();
                                  
                                  // Update profile with new photo URL
                                  updateHostProfile({ venuePhoto: result.url });
                                  
                                } catch (error) {
                                  console.error('Upload error:', error);
                                  alert('Failed to upload image. Please try again.');
                                }
                              }
                            }}
                            id="venuePhotoInput"
                            className="hidden"
                          />
                          <label htmlFor="venuePhotoInput" className="cursor-pointer">
                            <div className="inline-flex items-center px-3 py-1.5 text-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-md mb-2">
                              <Camera className="w-4 h-4 mr-2" />
                              {hostProfile.venuePhoto ? 'Change Photo' : 'Upload Photo'}
                            </div>
                          </label>
                          <p className="text-xs text-neutral-500">
                            A main photo of your venue space (JPG, PNG up to 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Host-specific personal information */}
              {!isArtist && (
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-neutral-900">Personal Host Information</h2>
                    <p className="text-sm text-neutral-600">
                      This personal information helps artists get to know you as a host. This is separate from your venue description.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Host Name(s)"
                      value={hostProfile.hostInfo.hostName}
                      onChange={(e) => updateHostProfile({ 
                        hostInfo: { ...hostProfile.hostInfo, hostName: e.target.value } 
                      })}
                      placeholder="Your name or names (e.g., 'Sarah & Mike Johnson')"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        About Me/Us
                      </label>
                      <textarea
                        value={hostProfile.hostInfo.aboutMe}
                        onChange={(e) => updateHostProfile({ 
                          hostInfo: { ...hostProfile.hostInfo, aboutMe: e.target.value } 
                        })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                        placeholder="Tell artists about yourself as a host. What drew you to house concerts? What do you enjoy about hosting? This is your personal story, separate from your venue description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Host Profile Photo</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-neutral-100 rounded-full overflow-hidden flex items-center justify-center">
                          {hostProfile.hostInfo.profilePhoto ? (
                            <img 
                              src={hostProfile.hostInfo.profilePhoto} 
                              alt="Host profile" 
                              className="w-20 h-20 object-cover"
                            />
                          ) : (
                            <UserCircle className="w-10 h-10 text-neutral-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Check file size (max 5MB)
                                if (file.size > 5 * 1024 * 1024) {
                                  alert('Image file is too large. Please choose an image under 5MB.');
                                  return;
                                }
                                
                                try {
                                  // Create FormData
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  formData.append('type', 'profile');
                                  
                                  // Upload file
                                  const response = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  
                                  if (!response.ok) {
                                    const error = await response.json();
                                    alert(error.error || 'Failed to upload image');
                                    return;
                                  }
                                  
                                  const data = await response.json();
                                  
                                  // Update host profile with the new image URL
                                  updateHostProfile({ 
                                    hostInfo: { ...hostProfile.hostInfo, profilePhoto: data.url } 
                                  });
                                  
                                  alert('Host photo uploaded successfully!');
                                  
                                } catch (error) {
                                  console.error('Upload error:', error);
                                  alert('Failed to upload image. Please try again.');
                                }
                              }
                            }}
                            className="hidden"
                            id="hostProfilePhotoInput"
                          />
                          <label htmlFor="hostProfilePhotoInput" className="cursor-pointer">
                            <div className="inline-flex items-center px-3 py-1.5 text-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-md mb-2">
                              <Camera className="w-4 h-4 mr-2" />
                              {hostProfile.hostInfo.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                            </div>
                          </label>
                          <p className="text-xs text-neutral-500">
                            A friendly photo of yourself or yourselves as hosts
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Artist-specific fields */}
              {isArtist && (
                <>
                  {/* Musical Details */}
                  <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                    <CardHeader>
                      <h2 className="text-xl font-semibold text-neutral-900">Musical Details</h2>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Genres */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Genres</label>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {artistProfile.genres.map(genre => (
                              <Badge key={genre} variant="default" className="flex items-center">
                                {genre}
                                <button
                                  onClick={() => removeGenre(genre)}
                                  className="ml-1 text-xs hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {GENRE_OPTIONS.filter(g => !artistProfile.genres.includes(g)).map(genre => (
                              <button
                                key={genre}
                                onClick={() => addGenre(genre)}
                                className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                              >
                                + {genre}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Instruments */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Instruments</label>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {artistProfile.instruments.map(instrument => (
                              <Badge key={instrument} variant="secondary" className="flex items-center">
                                {instrument}
                                <button
                                  onClick={() => removeInstrument(instrument)}
                                  className="ml-1 text-xs hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {INSTRUMENT_OPTIONS.filter(i => !artistProfile.instruments.includes(i)).map(instrument => (
                              <button
                                key={instrument}
                                onClick={() => addInstrument(instrument)}
                                className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                              >
                                + {instrument}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Experience Level & Years */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Experience Level</label>
                          <select
                            value={artistProfile.experienceLevel}
                            onChange={(e) => updateArtistProfile({ experienceLevel: e.target.value as any })}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="beginner">Beginner (0-2 years)</option>
                            <option value="intermediate">Intermediate (2-5 years)</option>
                            <option value="professional">Professional (5+ years)</option>
                          </select>
                        </div>
                        <Input
                          label="Years Active"
                          type="number"
                          value={artistProfile.yearsActive}
                          onChange={(e) => updateArtistProfile({ yearsActive: parseInt(e.target.value) || 1 })}
                          min="1"
                          max="50"
                        />
                      </div>

                      {/* Tour Info */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input
                          label="Months Touring Per Year"
                          type="number"
                          value={artistProfile.tourMonthsPerYear}
                          onChange={(e) => updateArtistProfile({ tourMonthsPerYear: parseInt(e.target.value) || 0 })}
                          min="0"
                          max="12"
                        />
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Tour Vehicle</label>
                          <select
                            value={artistProfile.tourVehicle}
                            onChange={(e) => updateArtistProfile({ tourVehicle: e.target.value })}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="van">Van</option>
                            <option value="car">Car</option>
                            <option value="bus">Bus</option>
                            <option value="fly">Fly/Rent</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <Input
                          label="Willing to Travel (miles)"
                          type="number"
                          value={artistProfile.willingToTravel}
                          onChange={(e) => updateArtistProfile({ willingToTravel: parseInt(e.target.value) || 500 })}
                          min="50"
                          max="3000"
                        />
                      </div>

                      {/* Lodging Requirements */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Lodging Requirements</label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="needsLodging"
                            checked={artistProfile.needsLodging}
                            onChange={(e) => updateArtistProfile({ needsLodging: e.target.checked })}
                            className="mr-3 h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                          />
                          <label htmlFor="needsLodging" className="text-sm text-neutral-700">
                            I need lodging when traveling for performances
                          </label>
                        </div>
                      </div>

                      {/* Technical Requirements */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Equipment Provided */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Equipment You Provide</label>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {artistProfile.equipmentProvided.map(equipment => (
                                <Badge key={equipment} variant="secondary" className="bg-green-50 text-green-800 border-green-200 flex items-center">
                                  {equipment}
                                  <button
                                    onClick={() => removeEquipment(equipment)}
                                    className="ml-1 text-xs hover:text-red-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {EQUIPMENT_OPTIONS.filter(e => !artistProfile.equipmentProvided.includes(e)).map(equipment => (
                                <button
                                  key={equipment}
                                  onClick={() => addEquipment(equipment)}
                                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-green-100 rounded-full transition-colors"
                                >
                                  + {equipment}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Venue Requirements */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Venue Requirements</label>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {artistProfile.venueRequirements.map(requirement => (
                                <Badge key={requirement} variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200 flex items-center">
                                  {requirement}
                                  <button
                                    onClick={() => removeVenueRequirement(requirement)}
                                    className="ml-1 text-xs hover:text-red-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {VENUE_REQUIREMENT_OPTIONS.filter(r => !artistProfile.venueRequirements.includes(r)).map(requirement => (
                                <button
                                  key={requirement}
                                  onClick={() => addVenueRequirement(requirement)}
                                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-blue-100 rounded-full transition-colors"
                                >
                                  + {requirement}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cancellation Policy */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Cancellation Policy</label>
                        <select
                          value={artistProfile.cancellationPolicy}
                          onChange={(e) => updateArtistProfile({ cancellationPolicy: e.target.value as any })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="flexible">Flexible - Free cancellation 48+ hours before</option>
                          <option value="moderate">Moderate - Free cancellation 7+ days before</option>
                          <option value="strict">Strict - No free cancellation</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Host-specific fields */}
              {!isArtist && (
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-neutral-900">Venue Details</h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Venue Type & Capacity */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Venue Type</label>
                        <select
                          value={hostProfile.venueType}
                          onChange={(e) => updateHostProfile({ venueType: e.target.value as any })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="home">Home/Living Room</option>
                          <option value="studio">Studio Space</option>
                          <option value="backyard">Backyard/Garden</option>
                          <option value="loft">Loft</option>
                          <option value="warehouse">Warehouse</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Indoor Capacity"
                          type="number"
                          value={hostProfile.indoorCapacity}
                          onChange={(e) => updateHostProfile({ indoorCapacity: parseInt(e.target.value) || 0 })}
                          min="0"
                          max="200"
                        />
                        <Input
                          label="Outdoor Capacity"
                          type="number"
                          value={hostProfile.outdoorCapacity}
                          onChange={(e) => updateHostProfile({ outdoorCapacity: parseInt(e.target.value) || 0 })}
                          min="0"
                          max="500"
                        />
                      </div>
                    </div>

                    {/* Show Length */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Typical Show Length</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={hostProfile.typicalShowLength}
                          onChange={(e) => updateHostProfile({ typicalShowLength: parseInt(e.target.value) || 90 })}
                          min="30"
                          max="300"
                          className="w-24"
                        />
                        <span className="text-sm text-neutral-600">minutes</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">How long do shows typically last at your venue?</p>
                    </div>

                    {/* Preferred Days */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Days for Concerts</label>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {hostProfile.preferredDays.map(day => (
                            <Badge key={day} variant="default" className="flex items-center">
                              {day}
                              <button
                                onClick={() => updateHostProfile({ 
                                  preferredDays: hostProfile.preferredDays.filter(d => d !== day) 
                                })}
                                className="ml-1 text-xs hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                            .filter(day => !hostProfile.preferredDays.includes(day))
                            .map(day => (
                              <button
                                key={day}
                                onClick={() => updateHostProfile({ 
                                  preferredDays: [...hostProfile.preferredDays, day] 
                                })}
                                className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                              >
                                + {day}
                              </button>
                            ))}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">Which days of the week work best for hosting concerts?</p>
                    </div>

                    {/* Amenities */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Amenities & Features</label>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {hostProfile.amenities.map(amenity => (
                            <Badge key={amenity} variant="default" className="flex items-center">
                              {amenity}
                              <button
                                onClick={() => removeAmenity(amenity)}
                                className="ml-1 text-xs hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {AMENITY_OPTIONS.filter(a => !hostProfile.amenities.includes(a)).map(amenity => (
                            <button
                              key={amenity}
                              onClick={() => addAmenity(amenity)}
                              className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                            >
                              + {amenity}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Social Links */}
              <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-neutral-900">Social Links & Website</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Website"
                      value={isArtist ? artistProfile.website : hostProfile.website}
                      onChange={(e) => {
                        const socialLinks = isArtist ? artistProfile.socialLinks : hostProfile.socialLinks;
                        if (isArtist) {
                          updateArtistProfile({ 
                            website: e.target.value,
                            socialLinks: { ...socialLinks, website: e.target.value } 
                          });
                        } else {
                          updateHostProfile({ 
                            website: e.target.value,
                            socialLinks: { ...socialLinks, website: e.target.value } 
                          });
                        }
                      }}
                      placeholder="https://yourwebsite.com"
                    />
                    <Input
                      label="Instagram"
                      value={isArtist ? artistProfile.socialLinks.instagram : hostProfile.socialLinks.instagram}
                      onChange={(e) => {
                        const socialLinks = isArtist ? artistProfile.socialLinks : hostProfile.socialLinks;
                        if (isArtist) updateArtistProfile({ socialLinks: { ...socialLinks, instagram: e.target.value } });
                        else updateHostProfile({ socialLinks: { ...socialLinks, instagram: e.target.value } });
                      }}
                      placeholder="https://instagram.com/username"
                    />
                    <Input
                      label="YouTube"
                      value={isArtist ? artistProfile.socialLinks.youtube : hostProfile.socialLinks.youtube}
                      onChange={(e) => {
                        const socialLinks = isArtist ? artistProfile.socialLinks : hostProfile.socialLinks;
                        if (isArtist) updateArtistProfile({ socialLinks: { ...socialLinks, youtube: e.target.value } });
                        else updateHostProfile({ socialLinks: { ...socialLinks, youtube: e.target.value } });
                      }}
                      placeholder="https://youtube.com/channel/..."
                    />
                    <Input
                      label="Facebook"
                      value={isArtist ? artistProfile.socialLinks.facebook : hostProfile.socialLinks.facebook}
                      onChange={(e) => {
                        const socialLinks = isArtist ? artistProfile.socialLinks : hostProfile.socialLinks;
                        if (isArtist) updateArtistProfile({ socialLinks: { ...socialLinks, facebook: e.target.value } });
                        else updateHostProfile({ socialLinks: { ...socialLinks, facebook: e.target.value } });
                      }}
                      placeholder="https://facebook.com/username"
                    />
                    {isArtist && (
                      <>
                        <Input
                          label="Spotify"
                          value={artistProfile.socialLinks.spotify}
                          onChange={(e) => {
                            updateArtistProfile({ socialLinks: { ...artistProfile.socialLinks, spotify: e.target.value } });
                          }}
                          placeholder="https://open.spotify.com/artist/..."
                        />
                        <Input
                          label="Bandcamp"
                          value={artistProfile.socialLinks.bandcamp}
                          onChange={(e) => {
                            updateArtistProfile({ socialLinks: { ...artistProfile.socialLinks, bandcamp: e.target.value } });
                          }}
                          placeholder="https://artist.bandcamp.com"
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Primary Photo */}
              <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-neutral-900">
                    {isArtist ? 'Press Photo / Primary Photo' : 'Main Venue Photo'}
                  </h2>
                  <p className="text-sm text-neutral-600">
                    {isArtist 
                      ? 'This is your featured profile image that appears on your public profile and in search results.'
                      : 'This is the main photo that represents your venue to potential artists.'
                    }
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6">
                    <div className="w-32 h-32 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {(isArtist ? artistProfile.profilePhoto : hostProfile.hostInfo.profilePhoto) ? (
                        <img 
                          src={isArtist ? artistProfile.profilePhoto : hostProfile.hostInfo.profilePhoto} 
                          alt="Profile" 
                          className="w-32 h-32 object-cover"
                        />
                      ) : (
                        <Camera className="w-12 h-12 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Check file size (max 5MB)
                              if (file.size > 5 * 1024 * 1024) {
                                alert('Image file is too large. Please choose an image under 5MB.');
                                return;
                              }
                              
                              try {
                                // Create FormData
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('type', 'profile');
                                
                                // Upload file
                                const response = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData
                                });
                                
                                if (!response.ok) {
                                  const error = await response.json();
                                  alert(error.error || 'Failed to upload image');
                                  return;
                                }
                                
                                const data = await response.json();
                                
                                // Update profile with the new image URL
                                if (isArtist) {
                                  updateArtistProfile({ profilePhoto: data.url });
                                } else {
                                  updateHostProfile({ 
                                    profilePhoto: data.url,
                                    hostInfo: { ...hostProfile.hostInfo, profilePhoto: data.url } 
                                  });
                                }
                                
                                alert('Image uploaded successfully!');
                                
                              } catch (error) {
                                console.error('Upload error:', error);
                                alert('Failed to upload image. Please try again.');
                              }
                            }
                          }}
                          className="hidden"
                          id="profilePhotoInput"
                        />
                        <label htmlFor="profilePhotoInput" className="cursor-pointer">
                          <div className="inline-flex items-center px-4 py-2 text-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-md">
                            <Camera className="w-4 h-4 mr-2" />
                            {(isArtist ? artistProfile.profilePhoto : hostProfile.hostInfo.profilePhoto) ? 'Change Photo' : 'Upload Photo'}
                          </div>
                        </label>
                        {(isArtist ? artistProfile.profilePhoto : hostProfile.hostInfo.profilePhoto) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (isArtist) {
                                updateArtistProfile({ profilePhoto: '' });
                              } else {
                                updateHostProfile({ 
                                  profilePhoto: '',
                                  hostInfo: { ...hostProfile.hostInfo, profilePhoto: '' }
                                });
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">
                        Recommended: High-quality photo, 1000x1000px minimum, JPG or PNG
                      </p>
                      {isArtist && (
                        <p className="text-xs text-neutral-500 mt-1">
                          Professional press photos work best for booking opportunities
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Band Members (Artist only) */}
              {isArtist && (
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-neutral-900">Band Members</h2>
                        <p className="text-sm text-neutral-600">
                          Add photos and information for each member of your band
                        </p>
                      </div>
                      <Button onClick={addBandMember} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {artistProfile.bandMembers.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500">
                        <Users className="w-12 h-12 mx-auto mb-2 text-neutral-400" />
                        <p>No band members added yet</p>
                        <p className="text-sm">Add your band members to showcase your full lineup</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {artistProfile.bandMembers.map((member) => (
                          <div key={member.id} className="flex items-center space-x-4 p-4 border border-neutral-200 rounded-lg">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                              {member.photo ? (
                                <img 
                                  src={member.photo} 
                                  alt={member.name} 
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <UserCircle className="w-8 h-8 text-neutral-400" />
                              )}
                            </div>
                            <div className="flex-1 grid md:grid-cols-2 gap-4">
                              <Input
                                placeholder="Member name"
                                value={member.name}
                                onChange={(e) => updateBandMember(member.id, 'name', e.target.value)}
                              />
                              <Input
                                placeholder="Instrument/Role"
                                value={member.instrument}
                                onChange={(e) => updateBandMember(member.id, 'instrument', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    // Check file size (max 5MB)
                                    if (file.size > 5 * 1024 * 1024) {
                                      alert('Image file is too large. Please choose an image under 5MB.');
                                      return;
                                    }
                                    
                                    try {
                                      // Create FormData
                                      const formData = new FormData();
                                      formData.append('file', file);
                                      formData.append('type', 'band-member');
                                      
                                      // Upload file
                                      const response = await fetch('/api/upload', {
                                        method: 'POST',
                                        body: formData
                                      });
                                      
                                      if (!response.ok) {
                                        const error = await response.json();
                                        alert(error.error || 'Failed to upload image');
                                        return;
                                      }
                                      
                                      const data = await response.json();
                                      
                                      // Update band member with the new image URL
                                      updateBandMember(member.id, 'photo', data.url);
                                      
                                      alert('Band member photo uploaded successfully!');
                                      
                                    } catch (error) {
                                      console.error('Upload error:', error);
                                      alert('Failed to upload image. Please try again.');
                                    }
                                  }
                                }}
                                className="hidden"
                                id={`bandMemberPhoto-${member.id}`}
                              />
                              <Button variant="outline" size="sm" type="button" onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(`bandMemberPhoto-${member.id}`)?.click();
                              }} title={member.photo ? 'Change Photo' : 'Upload Photo'}>
                                <Camera className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeBandMember(member.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {isArtist ? (
                <>
                  {/* Photo Management */}
                  <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-neutral-900">Performance Photos</h2>
                          <p className="text-sm text-neutral-600">Upload photos from your performances, band photos, and promotional images</p>
                        </div>
                        <Button onClick={() => {
                          document.getElementById('photoUpload')?.click();
                        }} disabled={uploading}>
                          <Camera className="w-4 h-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Upload Photos'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Hidden file input */}
                      <input
                        type="file"
                        id="photoUpload"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            handlePhotoUpload(e.target.files);
                          }
                        }}
                        className="hidden"
                      />

                      {/* Photo Management Controls */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <h3 className="font-medium text-neutral-900">Photo Gallery</h3>
                          <Badge variant="secondary" className="text-xs">
                            {artistProfile.photos?.length || 0} photos
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-neutral-600">Sort:</span>
                          <Button variant="outline" size="sm">
                            Manual Order
                          </Button>
                          <Button variant="outline" size="sm">
                            Upload Date
                          </Button>
                        </div>
                      </div>

                      {/* Photo Grid */}
                      {artistProfile.photos && artistProfile.photos.length > 0 ? (
                        <div className="space-y-4">
                          <div className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                            <span className="font-medium">💡 Pro tip:</span> Drag and drop photos to reorder them. The first photo will be your featured image.
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {artistProfile.photos.map((photo, index) => (
                              <div key={photo.id} className="relative group">
                                <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                                  <img 
                                    src={photo.fileUrl} 
                                    alt={photo.title || `Photo ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removePhoto(photo.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-white"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                {index === 0 && (
                                  <div className="absolute top-2 left-2">
                                    <Badge variant="warning" className="text-xs">
                                      Featured
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center">
                          <Camera className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-neutral-900 mb-2">No photos uploaded yet</h3>
                          <p className="text-neutral-600 mb-4">
                            Upload your first photos to showcase your performances and band. You can drag and drop to reorder them.
                          </p>
                          <Button onClick={() => document.getElementById('photoUpload')?.click()}>
                            <Camera className="w-4 h-4 mr-2" />
                            Upload Your First Photos
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Performance Videos */}
                  <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-neutral-900">Performance Videos</h2>
                          <p className="text-sm text-neutral-600">Add YouTube, Vimeo, or other video platform links</p>
                        </div>
                        <Button onClick={() => setShowVideoForm(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Video
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Video Form */}
                      {showVideoForm && (
                        <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                          <h3 className="font-medium text-neutral-900 mb-4">
                            {editingVideoId ? 'Edit Video Link' : 'Add Video Link'}
                          </h3>
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <Input
                                label="Video Title"
                                placeholder="e.g., Live at Coffee House - Full Set"
                                value={videoForm.title}
                                onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                              />
                              <Input
                                label="Video URL"
                                placeholder="https://youtube.com/watch?v=..."
                                value={videoForm.url}
                                onChange={(e) => setVideoForm({...videoForm, url: e.target.value})}
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                                <select
                                  value={videoForm.category}
                                  onChange={(e) => setVideoForm({...videoForm, category: e.target.value})}
                                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                  <option value="">Select category</option>
                                  {VIDEO_CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-center mt-6">
                                <input
                                  type="checkbox"
                                  id="isLivePerformance"
                                  checked={videoForm.isLivePerformance}
                                  onChange={(e) => setVideoForm({...videoForm, isLivePerformance: e.target.checked})}
                                  className="mr-2"
                                />
                                <label htmlFor="isLivePerformance" className="text-sm text-neutral-700">
                                  ⭐ Featured Live Performance
                                </label>
                              </div>
                            </div>
                            <div className="flex space-x-3">
                              <Button onClick={editingVideoId ? updateVideoLink : addVideoLink}>
                                {editingVideoId ? 'Update Video' : 'Add Video'}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setShowVideoForm(false);
                                  setEditingVideoId(null);
                                  setVideoForm({ title: '', url: '', category: '', isLivePerformance: false });
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Video List */}
                      {artistProfile.videoLinks && artistProfile.videoLinks.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {artistProfile.videoLinks.map((video) => (
                            <div key={video.id} className="border border-neutral-200 rounded-lg p-4 bg-white">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-neutral-900">{video.title}</h4>
                                  <p className="text-sm text-neutral-600">{VIDEO_CATEGORIES.find(c => c.value === video.category)?.label}</p>
                                  {video.isLivePerformance && (
                                    <Badge variant="warning" className="mt-1">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => editVideoLink(video)}
                                    className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 border-primary-200"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeVideoLink(video.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-neutral-500 truncate">{video.url}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border-t pt-4">
                          <p className="text-sm text-neutral-500 text-center py-8">
                            No videos added yet. Add your first performance video above.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Music Samples */}
                  <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-neutral-900">Music Samples</h2>
                          <p className="text-sm text-neutral-600">Add links to your music on streaming platforms</p>
                        </div>
                        <Button onClick={() => setShowMusicForm(true)}>
                          <Music className="w-4 h-4 mr-2" />
                          Add Track
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Music Form */}
                      {showMusicForm && (
                        <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                          <h3 className="font-medium text-neutral-900 mb-4">Add Music Sample</h3>
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <Input
                                label="Track Title"
                                placeholder="Song name"
                                value={musicForm.title}
                                onChange={(e) => setMusicForm({...musicForm, title: e.target.value})}
                              />
                              <Input
                                label="Streaming Platform URL"
                                placeholder="https://spotify.com/track/..."
                                value={musicForm.url}
                                onChange={(e) => setMusicForm({...musicForm, url: e.target.value})}
                              />
                            </div>
                            <div className="flex space-x-3">
                              <Button onClick={addMusicSample}>Add Track</Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setShowMusicForm(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Music List */}
                      {artistProfile.musicSamples && artistProfile.musicSamples.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {artistProfile.musicSamples.map((sample) => (
                            <div key={sample.id} className="border border-neutral-200 rounded-lg p-4 bg-white">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-neutral-900">{sample.title}</h4>
                                  <Badge variant="secondary" className="mt-1">
                                    {sample.platform}
                                  </Badge>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeMusicSample(sample.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-neutral-500 truncate">{sample.url}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border-t pt-4">
                          <p className="text-sm text-neutral-500 text-center py-8">
                            No music samples added yet. Add your first track above.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                /* Host Media Section */
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-neutral-900">Venue Photos</h2>
                    <p className="text-sm text-neutral-600">Upload photos of your performance space, exterior, and amenities</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                      <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">Upload Venue Photos</h3>
                      <p className="text-neutral-600 mb-4">
                        Show artists your performance space, exterior, and amenities
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          // Handle multiple file uploads
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              // Handle venue photo upload
                              console.log('Venue photo uploaded:', e.target?.result);
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                        className="hidden"
                        id="venuePhotoInput"
                      />
                      <Button type="button" onClick={() => {
                        document.getElementById('venuePhotoInput')?.click();
                      }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Photos
                      </Button>
                    </div>
                    
                    {/* Photo Grid Placeholder */}
                    <div className="border-t pt-4">
                      <p className="text-sm text-neutral-500 text-center py-8">
                        No photos uploaded yet. Add your first venue photo above.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>


        {/* Sound System Tab - Only for hosts */}
        {activeTab === 'sound-system' && !isArtist && (
          <div className="space-y-6">
            {/* Sound System Availability */}
            <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
              <CardHeader>
                <div className="flex items-center">
                  <Volume2 className="w-5 h-5 text-neutral-600 mr-3" />
                  <h2 className="text-xl font-semibold text-neutral-900">Sound System Availability</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="soundSystemAvailable"
                        checked={hostProfile.soundSystem.available}
                        onChange={() => updateHostProfile({ 
                          soundSystem: { ...hostProfile.soundSystem, available: true }
                        })}
                        className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-neutral-900">
                        Yes, I have a sound system available for artists
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="soundSystemAvailable"
                        checked={!hostProfile.soundSystem.available}
                        onChange={() => updateHostProfile({ 
                          soundSystem: { ...hostProfile.soundSystem, available: false }
                        })}
                        className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-neutral-900">
                        No, artists should bring their own sound equipment
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sound System Details - Only show if available */}
            {hostProfile.soundSystem.available && (
              <>
                {/* System Description */}
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-neutral-900">System Description</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="soundSystemDescription" className="block text-sm font-medium text-neutral-700 mb-2">
                          General Description *
                        </label>
                        <textarea
                          id="soundSystemDescription"
                          rows={3}
                          placeholder="Describe your sound system setup, its quality, and what makes it special..."
                          value={hostProfile.soundSystem.description}
                          onChange={(e) => updateHostProfile({ 
                            soundSystem: { ...hostProfile.soundSystem, description: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Equipment Details */}
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-neutral-900">Equipment Details</h2>
                    <p className="text-sm text-neutral-600 mt-1">Knowing what specific equipment you have is very helpful for the artists.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="speakers" className="block text-sm font-medium text-neutral-700 mb-2">
                          Speakers
                        </label>
                        <textarea
                          id="speakers"
                          rows={3}
                          placeholder="e.g., JBL EON615, Yamaha HS8 monitors..."
                          value={hostProfile.soundSystem.equipment.speakers}
                          onChange={(e) => updateHostProfile({ 
                            soundSystem: { 
                              ...hostProfile.soundSystem, 
                              equipment: { ...hostProfile.soundSystem.equipment, speakers: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="microphones" className="block text-sm font-medium text-neutral-700 mb-2">
                          Microphones
                        </label>
                        <textarea
                          id="microphones"
                          rows={3}
                          placeholder="e.g., Shure SM58, Audio-Technica AT2020..."
                          value={hostProfile.soundSystem.equipment.microphones}
                          onChange={(e) => updateHostProfile({ 
                            soundSystem: { 
                              ...hostProfile.soundSystem, 
                              equipment: { ...hostProfile.soundSystem.equipment, microphones: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="instruments" className="block text-sm font-medium text-neutral-700 mb-2">
                          Available Instruments
                        </label>
                        <textarea
                          id="instruments"
                          rows={3}
                          placeholder="e.g., Piano, keyboard, guitar amp..."
                          value={hostProfile.soundSystem.equipment.instruments}
                          onChange={(e) => updateHostProfile({ 
                            soundSystem: { 
                              ...hostProfile.soundSystem, 
                              equipment: { ...hostProfile.soundSystem.equipment, instruments: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="additional" className="block text-sm font-medium text-neutral-700 mb-2">
                          Additional Equipment
                        </label>
                        <textarea
                          id="additional"
                          rows={3}
                          placeholder="e.g., Cables, stands, lighting..."
                          value={hostProfile.soundSystem.equipment.additional}
                          onChange={(e) => updateHostProfile({ 
                            soundSystem: { 
                              ...hostProfile.soundSystem, 
                              equipment: { ...hostProfile.soundSystem.equipment, additional: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Preview Notice */}
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-primary-600 mr-3" />
            <div>
              <h4 className="font-medium text-primary-800">Live Profile Preview</h4>
              <p className="text-sm text-primary-700">
                Click "Preview Live Profile" above to see exactly how your profile appears to {isArtist ? 'hosts' : 'artists'} in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}