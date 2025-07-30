'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProfileHeader from '@/components/profile/ProfileHeader';
import TabNavigation from '@/components/profile/TabNavigation';
import InfoTab from '@/components/profile/InfoTab';
import FormationYearField from '@/components/profile/info/FormationYearField';
import SocialLinksCard from '@/components/profile/info/SocialLinksCard';
import TourLogisticsCard from '@/components/profile/info/TourLogisticsCard';
import HostVenueDetailsCard from '@/components/profile/info/HostVenueDetailsCard';
import ArtistMusicalDetailsCard from '@/components/profile/info/ArtistMusicalDetailsCard';
import ThumbnailPhotoCard from '@/components/profile/info/ThumbnailPhotoCard';
import HeroPhotoCard from '@/components/profile/info/HeroPhotoCard';
import BandMembersCard from '@/components/profile/info/BandMembersCard';
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
  Volume2,
  Coffee,
  Wifi,
  Car,
  Utensils,
  Briefcase,
  Bed,
  Bath,
  Calendar,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';


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
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'media' | 'sound-system' | 'lodging'>('info');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  

  // Profile state
  const [artistProfile, setArtistProfile] = useState({
    bandName: '',
    briefBio: '',
    fullBio: '',
    city: '',
    state: '',
    profilePhoto: '',
    thumbnailPhoto: '',
    heroPhoto: '',
    genres: [] as string[],
    musicalStyle: '',
    instruments: [] as string[],
    formationYear: new Date().getFullYear(),
    tourMonthsPerYear: 3,
    tourVehicle: 'van' as string,
    willingToTravel: 500,
    needsLodging: false,
    equipmentProvided: [] as string[],
    venueRequirements: [] as string[],
    contentRating: 'family-friendly' as 'family-friendly' | 'explicit' | 'tailored',
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
  const [customGenreInput, setCustomGenreInput] = useState('');
  
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
    address: '', // Street address
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
    suggestedDoorFee: 20, // dollars
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
    hostMembers: [] as Array<{
      id: string;
      hostName: string;
      aboutMe: string;
      profilePhoto: string;
    }>,
    website: '',
    socialLinks: {
      website: '',
      instagram: '',
      youtube: '',
      facebook: ''
    },
    // Musical Preferences
    preferredGenres: [] as string[],
    preferredActSize: 'Doesn\'t Matter' as 'Solo' | 'Duo' | 'Trio' | 'Full Band' | 'Doesn\'t Matter',
    actSizeNotes: '',
    whatWeEnjoy: '',
    musicWeArentInto: '',
    contentRating: 'Doesn\'t Matter' as 'Kid Friendly' | 'Explicit' | 'Doesn\'t Matter',
    photos: [] as Array<{
      id: string;
      fileUrl: string;
      title: string;
      description: string;
      category: string;
      sortOrder: number;
    }>,
    // Lodging data
    offersLodging: false,
    lodgingDetails: {
      numberOfRooms: 1,
      rooms: [{
        id: 1,
        roomType: 'private_bedroom' as 'private_bedroom' | 'shared_room' | 'entire_space',
        bathroomType: 'private' as 'private' | 'shared',
        beds: [{ type: 'queen' as 'queen' | 'king' | 'twin' | 'full' | 'couch' | 'air_mattress', quantity: 1 }],
        maxOccupancy: 2
      }],
      amenities: {
        breakfast: false,
        wifi: true,
        parking: false,
        laundry: false,
        kitchenAccess: false,
        workspace: false,
        linensProvided: true,
        towelsProvided: true,
        transportation: 'none' as 'none' | 'pickup' | 'nearby_transit'
      },
      houseRules: {
        checkInTime: '3:00 PM',
        checkOutTime: '11:00 AM',
        quietHours: { start: '10:00 PM', end: '8:00 AM' },
        smokingPolicy: 'no_smoking' as 'no_smoking' | 'outside_only' | 'allowed',
        petPolicy: 'no_pets' as 'no_pets' | 'cats_ok' | 'dogs_ok' | 'all_pets_ok',
        alcoholPolicy: 'allowed' as 'allowed' | 'not_allowed' | 'byob'
      },
      specialConsiderations: '',
      localRecommendations: '',
      safetyFeatures: ['smoke_detectors', 'first_aid_kit'] as string[]
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
                briefBio: data.briefBio || data.bio || '',
                fullBio: data.fullBio || data.bio || '',
                city: data.city || '',
                state: data.state || '',
                genres: data.genres || [],
                instruments: data.instruments || [],
                formationYear: data.formationYear || new Date().getFullYear(),
                tourMonthsPerYear: data.tourMonthsPerYear || 3,
                tourVehicle: data.tourVehicle || 'van',
                willingToTravel: data.willingToTravel || 500,
                needsLodging: data.needsLodging || false,
                equipmentProvided: data.equipmentProvided || [],
                venueRequirements: data.venueRequirements || [],
                profilePhoto: data.profilePhoto || '',
                thumbnailPhoto: data.thumbnailPhoto || '',
                heroPhoto: data.heroPhoto || '',
                contentRating: data.contentRating || 'family-friendly',
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
                venueName: data.venueName || '',
                venueDescription: data.venueDescription || data.bio || '',
                address: (() => {
                  // Extract street address from full address if needed
                  const fullAddress = data.actualAddress || '';
                  if (fullAddress.includes(',')) {
                    // If it's a full address, take only the first part (street address)
                    return fullAddress.split(',')[0].trim();
                  }
                  return fullAddress;
                })(),
                city: data.city || '',
                state: data.state || '',
                zip: (() => {
                  // Try to extract zip code from actualAddress if data.zip is not available
                  if (data.zip) return data.zip;
                  const fullAddress = data.actualAddress || '';
                  // Match 5-digit zip code pattern
                  const zipMatch = fullAddress.match(/\b\d{5}\b/);
                  return zipMatch ? zipMatch[0] : '';
                })(),
                profilePhoto: data.profilePhoto || '',
                venuePhoto: data.venuePhoto || '',
                venueType: data.venueType || 'home',
                indoorCapacity: data.indoorCapacity || 20,
                outdoorCapacity: data.outdoorCapacity || 0,
                amenities: data.amenities || [],
                typicalShowLength: data.typicalShowLength || 90,
                preferredDays: data.preferredDays || data.preferredGenres || [],
                suggestedDoorFee: data.suggestedDoorFee || 20,
                soundSystem: data.soundSystem || {
                  available: true,
                  description: '',
                  equipment: {
                    speakers: '',
                    microphones: '',
                    instruments: '',
                    additional: ''
                  }
                },
                hostMembers: data.hostMembers || (data.hostInfo ? [{
                  id: '1',
                  hostName: data.hostInfo.hostName || '',
                  aboutMe: data.hostInfo.aboutMe || '',
                  profilePhoto: data.hostInfo.profilePhoto || data.profilePhoto || ''
                }] : [{
                  id: '1',
                  hostName: data.name || '',
                  aboutMe: '',
                  profilePhoto: data.profilePhoto || ''
                }]),
                website: data.website || '',
                socialLinks: {
                  website: data.socialLinks?.website || data.website || '',
                  instagram: data.socialLinks?.instagram || '',
                  youtube: data.socialLinks?.youtube || '',
                  facebook: data.socialLinks?.facebook || ''
                },
                // Musical Preferences
                preferredGenres: data.preferredGenres || [],
                preferredActSize: data.preferredActSize || 'Doesn\'t Matter',
                actSizeNotes: data.actSizeNotes || '',
                whatWeEnjoy: data.whatWeEnjoy || '',
                musicWeArentInto: data.musicWeArentInto || '',
                contentRating: data.contentRating || 'Doesn\'t Matter',
                photos: data.photos || [],
                offersLodging: data.offersLodging || false,
                lodgingDetails: data.lodgingDetails || {
                  numberOfRooms: 1,
                  rooms: [{
                    id: 1,
                    roomType: 'private_bedroom',
                    bathroomType: 'private',
                    beds: [{ type: 'queen' as 'queen' | 'king' | 'twin' | 'full' | 'couch' | 'air_mattress', quantity: 1 }],
                    maxOccupancy: 2
                  }],
                  amenities: {
                    breakfast: false,
                    wifi: true,
                    parking: false,
                    laundry: false,
                    kitchenAccess: false,
                    workspace: false,
                    linensProvided: true,
                    towelsProvided: true,
                    transportation: 'none'
                  },
                  houseRules: {
                    checkInTime: '3:00 PM',
                    checkOutTime: '11:00 AM',
                    quietHours: { start: '10:00 PM', end: '8:00 AM' },
                    smokingPolicy: 'no_smoking',
                    petPolicy: 'no_pets',
                    alcoholPolicy: 'allowed'
                  },
                  specialConsiderations: '',
                  localRecommendations: '',
                  safetyFeatures: ['smoke_detectors', 'first_aid_kit']
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


  const addAmenity = (amenity: string) => {
    if (!hostProfile.amenities.includes(amenity)) {
      updateHostProfile({ amenities: [...hostProfile.amenities, amenity] });
    }
  };

  const removeAmenity = (amenity: string) => {
    updateHostProfile({ amenities: hostProfile.amenities.filter(a => a !== amenity) });
  };

  const addPreferredGenre = (genre: string) => {
    if (!hostProfile.preferredGenres.includes(genre)) {
      updateHostProfile({ preferredGenres: [...hostProfile.preferredGenres, genre] });
    }
  };

  const removePreferredGenre = (genre: string) => {
    updateHostProfile({ preferredGenres: hostProfile.preferredGenres.filter(g => g !== genre) });
  };
  const addCustomGenre = () => {
    const genre = customGenreInput.trim();
    if (genre && !hostProfile.preferredGenres.includes(genre)) {
      updateHostProfile({ preferredGenres: [...hostProfile.preferredGenres, genre] });
      setCustomGenreInput('');
    }
  };
  const handleCustomGenreKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomGenre();
    }
  };

  const addHostMember = () => {
    const newHostMember = {
      id: Date.now().toString(),
      hostName: '',
      aboutMe: '',
      profilePhoto: ''
    };
    updateHostProfile({ hostMembers: [...hostProfile.hostMembers, newHostMember] });
  };

  const updateHostMember = (hostMemberId: string, updates: Partial<typeof hostProfile.hostMembers[0]>) => {
    updateHostProfile({
      hostMembers: hostProfile.hostMembers.map(member => 
        member.id === hostMemberId ? { ...member, ...updates } : member
      )
    });
  };

  const removeHostMember = (hostMemberId: string) => {
    updateHostProfile({ hostMembers: hostProfile.hostMembers.filter(m => m.id !== hostMemberId) });
  };


  const addVenueRequirement = (requirement: string) => {
    if (!artistProfile.venueRequirements.includes(requirement)) {
      updateArtistProfile({ venueRequirements: [...artistProfile.venueRequirements, requirement] });
    }
  };

  const removeVenueRequirement = (requirement: string) => {
    updateArtistProfile({ venueRequirements: artistProfile.venueRequirements.filter(r => r !== requirement) });
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
        <ProfileHeader
          isArtist={isArtist}
          session={session}
          hasChanges={hasChanges}
          loading={loading}
          onSave={handleSave}
        />
        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isArtist={isArtist}
        />

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Information Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-neutral-900">{isArtist ? 'General Band Info' : 'General Venue Info'}</h2>
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
                  {isArtist ? (
                    <>
                      {/* Brief Introductory Bio */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Brief Introduction
                        </label>
                        <textarea
                          value={artistProfile.briefBio || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 500) {
                              updateArtistProfile({ briefBio: value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={3}
                          maxLength={500}
                          placeholder="A brief intro to you as a band or artist"
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          This is the first thing people will read when they arrive at your profile ({(artistProfile.briefBio || '').length}/500 characters)
                        </p>
                      </div>

                      {/* Full Bio */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Full Bio
                        </label>
                        <textarea
                          value={artistProfile.fullBio || ''}
                          onChange={(e) => updateArtistProfile({ fullBio: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={6}
                          placeholder="Tell hosts about your music, style, and what makes your performances special. Include your history, influences, upcoming projects, and anything else that helps hosts understand who you are as an artist..."
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Venue Description
                      </label>
                      <textarea
                        value={hostProfile.venueDescription}
                        onChange={(e) => updateHostProfile({ venueDescription: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                        placeholder="Describe your space, atmosphere, and what makes it perfect for house concerts..."
                      />
                    </div>
                  )}
                  {!isArtist && (
                    <Input
                      label="Street Address"
                      value={hostProfile.address}
                      onChange={(e) => updateHostProfile({ address: e.target.value })}
                      placeholder="Your venue's street address"
                    />
                  )}
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

                  {/* Formation Year (Artist only) */}
                  {isArtist && (
                    <FormationYearField
                      artistProfile={artistProfile}
                      updateArtistProfile={updateArtistProfile}
                    />
                  )}
                  
                  {/* Venue Profile Photo */}
                  {!isArtist && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Venue Primary Photo</label>
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

              {/* Thumbnail Photo (Artist only) */}
              {isArtist && (
                <ThumbnailPhotoCard
                  artistProfile={artistProfile}
                  updateArtistProfile={updateArtistProfile}
                />
              )}

              {/* Hero Photo (Artist only) */}
              {isArtist && (
                <HeroPhotoCard
                  artistProfile={artistProfile}
                  updateArtistProfile={updateArtistProfile}
                />
              )}

              {/* Band Members (Artist only) */}
              {isArtist && (
                <BandMembersCard
                  artistProfile={artistProfile}
                  updateArtistProfile={updateArtistProfile}
                />
              )}

              {/* Host-specific personal information */}
              {!isArtist && (
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-neutral-900">Personal Host Information</h2>
                        <p className="text-sm text-neutral-600">
                          Add information about each host. This helps artists get to know you personally.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addHostMember}
                        className="flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Host
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {hostProfile.hostMembers.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-neutral-300 rounded-lg">
                        <UserCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                        <p className="text-sm text-neutral-600 mb-3">No hosts added yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addHostMember}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Host
                        </Button>
                      </div>
                    ) : (
                      hostProfile.hostMembers.map((member, index) => (
                        <div key={member.id} className="border border-neutral-200 rounded-lg p-4 relative">
                          {hostProfile.hostMembers.length > 1 && (
                            <button
                              onClick={() => removeHostMember(member.id)}
                              className="absolute top-4 right-4 text-neutral-400 hover:text-red-600 transition-colors"
                              title="Remove host"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                          
                          <div className="space-y-4">
                            <div className="text-sm font-medium text-neutral-700 mb-2">
                              Host #{index + 1}
                            </div>
                            
                            <Input
                              label="Host Name"
                              value={member.hostName}
                              onChange={(e) => updateHostMember(member.id, { hostName: e.target.value })}
                              placeholder="e.g., 'Sarah Johnson'"
                            />
                    
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-1">
                                About Me
                              </label>
                              <textarea
                                value={member.aboutMe}
                                onChange={(e) => updateHostMember(member.id, { aboutMe: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                rows={4}
                                placeholder="Tell artists about yourself. What drew you to house concerts? What do you enjoy about hosting?"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">Profile Photo</label>
                              <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-neutral-100 rounded-full overflow-hidden flex items-center justify-center">
                                  {member.profilePhoto ? (
                                    <img 
                                      src={member.profilePhoto} 
                                      alt={`${member.hostName} profile`} 
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
                                  
                                  // Update this specific host's photo
                                  updateHostMember(member.id, { profilePhoto: data.url });
                                  
                                  alert('Host photo uploaded successfully!');
                                  
                                } catch (error) {
                                  console.error('Upload error:', error);
                                  alert('Failed to upload image. Please try again.');
                                }
                              }
                            }}
                            className="hidden"
                            id={`hostProfilePhotoInput-${member.id}`}
                          />
                          <label htmlFor={`hostProfilePhotoInput-${member.id}`} className="cursor-pointer">
                            <div className="inline-flex items-center px-3 py-1.5 text-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-md mb-2">
                              <Camera className="w-4 h-4 mr-2" />
                              {member.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                            </div>
                          </label>
                          <p className="text-xs text-neutral-500">
                            A friendly photo of this host
                          </p>
                        </div>
                      </div>
                    </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Musical Preferences - Host only */}
              {!isArtist && (
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-neutral-900">Musical Preferences</h2>
                    <p className="text-sm text-neutral-600">
                      Help artists understand what music fits best at your venue
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Preferred Genres */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Genres</label>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {hostProfile.preferredGenres.map(genre => (
                            <Badge key={genre} variant="default" className="flex items-center">
                              {genre}
                              <button
                                onClick={() => removePreferredGenre(genre)}
                                className="ml-1 text-xs hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {GENRE_OPTIONS.filter(g => !hostProfile.preferredGenres.includes(g)).map(genre => (
                            <button
                              key={genre}
                              onClick={() => addPreferredGenre(genre)}
                              className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                            >
                              + {genre}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customGenreInput}
                            onChange={(e) => setCustomGenreInput(e.target.value)}
                            onKeyPress={handleCustomGenreKeyPress}
                            placeholder="Add custom genre..."
                            className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                          <button
                            onClick={addCustomGenre}
                            disabled={!customGenreInput.trim()}
                            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preferred Act Size */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Act Size</label>
                      <select
                        value={hostProfile.preferredActSize}
                        onChange={(e) => updateHostProfile({ preferredActSize: e.target.value as any })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="Solo">Solo</option>
                        <option value="Duo">Duo</option>
                        <option value="Trio">Trio</option>
                        <option value="Full Band">Full Band</option>
                        <option value="Doesn't Matter">Doesn't Matter</option>
                      </select>
                    </div>

                    {/* Act Size Notes */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Act Size Considerations
                      </label>
                      <textarea
                        value={hostProfile.actSizeNotes}
                        onChange={(e) => updateHostProfile({ actSizeNotes: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                        placeholder="e.g., Our living room easily fits a trio but can accommodate a larger band within limits..."
                      />
                      <p className="text-xs text-neutral-500 mt-1">{hostProfile.actSizeNotes.length}/300 characters</p>
                    </div>

                    {/* What We Enjoy */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        What We Enjoy
                      </label>
                      <textarea
                        value={hostProfile.whatWeEnjoy}
                        onChange={(e) => updateHostProfile({ whatWeEnjoy: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                        placeholder="Describe the types of music and acts that would be a perfect fit for your venue..."
                      />
                      <p className="text-xs text-neutral-500 mt-1">{hostProfile.whatWeEnjoy.length}/500 characters</p>
                    </div>

                    {/* Music We Aren't Into */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Things we Dislike
                      </label>
                      <textarea
                        value={hostProfile.musicWeArentInto}
                        onChange={(e) => updateHostProfile({ musicWeArentInto: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                        placeholder="Optional: Mention any types of music or acts that don't fit your venue..."
                      />
                      <p className="text-xs text-neutral-500 mt-1">{hostProfile.musicWeArentInto.length}/300 characters</p>
                    </div>

                    {/* Content Rating */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Content Rating Preference</label>
                      <select
                        value={hostProfile.contentRating}
                        onChange={(e) => updateHostProfile({ contentRating: e.target.value as any })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="Kid Friendly">Kid Friendly</option>
                        <option value="Explicit">Explicit Content OK</option>
                        <option value="Doesn't Matter">Doesn't Matter</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Artist-specific fields */}
              {isArtist && (
                <>
                  {/* Musical Details */}
                  <ArtistMusicalDetailsCard
                    artistProfile={artistProfile}
                    updateArtistProfile={updateArtistProfile}
                  />

                  {/* Tour & Logistics */}
                  <TourLogisticsCard
                    artistProfile={artistProfile}
                    updateArtistProfile={updateArtistProfile}
                  />

                </>
              )}

              {/* Host-specific fields */}
              {!isArtist && (
                <HostVenueDetailsCard
                  hostProfile={hostProfile}
                  updateHostProfile={updateHostProfile}
                />
              )}

              {/* Social Links */}
              <SocialLinksCard
                isArtist={isArtist}
                artistProfile={artistProfile}
                hostProfile={hostProfile}
                updateArtistProfile={updateArtistProfile}
                updateHostProfile={updateHostProfile}
              />
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
                        onChange={async (e) => {
                          // Handle multiple file uploads with proper error handling
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;
                          
                          setUploading(true);
                          const uploadedPhotos = [];
                          
                          try {
                            for (const file of files) {
                              // Validate file type and size
                              if (!file.type.startsWith('image/')) {
                                console.error('Invalid file type:', file.type);
                                continue;
                              }
                              if (file.size > 5 * 1024 * 1024) { // 5MB limit
                                console.error('File too large:', file.size);
                                continue;
                              }
                              
                              const formData = new FormData();
                              formData.append('file', file);
                              formData.append('category', 'venue');
                              
                              const response = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                              });
                              
                              if (response.ok) {
                                const result = await response.json();
                                uploadedPhotos.push({
                                  id: result.id || `temp-${Date.now()}-${Math.random()}`,
                                  fileUrl: result.url,
                                  title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                                  description: '',
                                  category: 'venue',
                                  sortOrder: (hostProfile.photos?.length || 0) + uploadedPhotos.length
                                });
                              } else {
                                console.error('Upload failed for:', file.name);
                              }
                            }
                            
                            // Add uploaded photos to state
                            if (uploadedPhotos.length > 0) {
                              updateHostProfile({
                                photos: [...(hostProfile.photos || []), ...uploadedPhotos]
                              });
                            }
                          } catch (error) {
                            console.error('Upload error:', error);
                          } finally {
                            setUploading(false);
                            // Clear the input
                            e.target.value = '';
                          }
                        }}
                        className="hidden"
                        id="venuePhotoInput"
                      />
                      <Button type="button" onClick={() => {
                        document.getElementById('venuePhotoInput')?.click();
                      }}>
                        <Plus className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Photos'}
                      </Button>
                    </div>
                    
                    {/* Photo Grid */}
                    {hostProfile.photos && hostProfile.photos.length > 0 ? (
                      <div className="border-t pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {hostProfile.photos.map((photo, index) => (
                            <div key={photo.id} className="relative group">
                              <img
                                src={photo.fileUrl}
                                alt={photo.title || 'Venue photo'}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <button
                                  onClick={() => {
                                    updateHostProfile({
                                      photos: hostProfile.photos.filter(p => p.id !== photo.id)
                                    });
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              {photo.title && (
                                <p className="text-xs text-neutral-600 mt-1 truncate">{photo.title}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="border-t pt-4">
                        <p className="text-sm text-neutral-500 text-center py-8">
                          No photos uploaded yet. Add your first venue photo above.
                        </p>
                      </div>
                    )}
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

        {/* Lodging Tab - Only for hosts */}
        {activeTab === 'lodging' && !isArtist && (
          <div className="space-y-6">
            {/* Lodging Availability */}
            <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
              <CardHeader>
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-neutral-600 mr-3" />
                  <h2 className="text-xl font-semibold text-neutral-900">Lodging for Artists</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="offersLodging"
                        checked={hostProfile.offersLodging}
                        onChange={() => updateHostProfile({ offersLodging: true })}
                        className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-neutral-900">
                        Yes, I can offer lodging to traveling artists
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="offersLodging"
                        checked={!hostProfile.offersLodging}
                        onChange={() => updateHostProfile({ offersLodging: false })}
                        className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-neutral-900">
                        No, I cannot offer lodging
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lodging Details - Only show if offering */}
            {hostProfile.offersLodging && (
              <>
                {/* Room Configuration */}
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-neutral-900">Room Configuration</h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Number of Rooms Available
                      </label>
                      <select
                        value={hostProfile.lodgingDetails?.numberOfRooms || 1}
                        onChange={(e) => {
                          const numRooms = parseInt(e.target.value);
                          const newRooms = [...(hostProfile.lodgingDetails?.rooms || [])];
                          
                          if (numRooms > (hostProfile.lodgingDetails?.rooms?.length || 0)) {
                            // Add new rooms
                            for (let i = (hostProfile.lodgingDetails?.rooms?.length || 0); i < numRooms; i++) {
                              newRooms.push({
                                id: i + 1,
                                roomType: 'private_bedroom',
                                bathroomType: 'private',
                                beds: [{ type: 'queen' as 'queen' | 'king' | 'twin' | 'full' | 'couch' | 'air_mattress', quantity: 1 }],
                                maxOccupancy: 2
                              });
                            }
                          } else if (numRooms < (hostProfile.lodgingDetails?.rooms?.length || 0)) {
                            // Remove rooms
                            newRooms.splice(numRooms);
                          }
                          
                          updateHostProfile({
                            lodgingDetails: {
                              ...hostProfile.lodgingDetails,
                              numberOfRooms: numRooms,
                              rooms: newRooms
                            }
                          });
                        }}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                        ))}
                      </select>
                    </div>

                    {/* Room Details */}
                    {hostProfile.lodgingDetails.rooms && hostProfile.lodgingDetails.rooms.map((room, index) => (
                      <div key={room.id} className="border border-neutral-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">Room {index + 1}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Room Type
                            </label>
                            <select
                              value={room.roomType}
                              onChange={(e) => {
                                const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
                                  r.id === room.id ? { ...r, roomType: e.target.value as any } : r
                                );
                                updateHostProfile({
                                  lodgingDetails: {
                                    ...hostProfile.lodgingDetails,
                                    rooms: updatedRooms
                                  }
                                });
                              }}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="private_bedroom">Private Bedroom</option>
                              <option value="shared_room">Shared Room</option>
                              <option value="entire_space">Entire Space/Apartment</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Bathroom
                            </label>
                            <select
                              value={room.bathroomType}
                              onChange={(e) => {
                                const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
                                  r.id === room.id ? { ...r, bathroomType: e.target.value as any } : r
                                );
                                updateHostProfile({
                                  lodgingDetails: {
                                    ...hostProfile.lodgingDetails,
                                    rooms: updatedRooms
                                  }
                                });
                              }}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="private">Private Bathroom</option>
                              <option value="shared">Shared Bathroom</option>
                            </select>
                          </div>
                        </div>
                        
                        {/* Bed Configuration */}
                        <div className="mt-4">
                          <h4 className="text-md font-medium text-neutral-900 mb-3">Bed Configuration</h4>
                          <div className="space-y-3">
                            {room.beds && room.beds.map((bed, bedIndex) => (
                              <div key={bedIndex} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Bed Type
                                  </label>
                                  <select
                                    value={bed.type}
                                    onChange={(e) => {
                                      const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
                                        r.id === room.id ? {
                                          ...r,
                                          beds: r.beds.map((b, i) => 
                                            i === bedIndex ? { ...b, type: e.target.value as 'queen' | 'king' | 'twin' | 'full' | 'couch' | 'air_mattress' } : b
                                          )
                                        } : r
                                      );
                                      updateHostProfile({
                                        lodgingDetails: {
                                          ...hostProfile.lodgingDetails,
                                          rooms: updatedRooms
                                        }
                                      });
                                    }}
                                    className="w-full px-2 py-1 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  >
                                    <option value="twin">Twin</option>
                                    <option value="full">Full</option>
                                    <option value="queen">Queen</option>
                                    <option value="king">King</option>
                                    <option value="couch">Couch/Sofa</option>
                                    <option value="air_mattress">Air Mattress</option>
                                  </select>
                                </div>
                                <div className="w-20">
                                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Quantity
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="4"
                                    value={bed.quantity}
                                    onChange={(e) => {
                                      const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
                                        r.id === room.id ? {
                                          ...r,
                                          beds: r.beds.map((b, i) => 
                                            i === bedIndex ? { ...b, quantity: parseInt(e.target.value) || 1 } : b
                                          )
                                        } : r
                                      );
                                      updateHostProfile({
                                        lodgingDetails: {
                                          ...hostProfile.lodgingDetails,
                                          rooms: updatedRooms
                                        }
                                      });
                                    }}
                                    className="w-full px-2 py-1 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-center"
                                  />
                                </div>
                                {room.beds.length > 1 && (
                                  <button
                                    onClick={() => {
                                      const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
                                        r.id === room.id ? {
                                          ...r,
                                          beds: r.beds.filter((_, i) => i !== bedIndex)
                                        } : r
                                      );
                                      updateHostProfile({
                                        lodgingDetails: {
                                          ...hostProfile.lodgingDetails,
                                          rooms: updatedRooms
                                        }
                                      });
                                    }}
                                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            
                            {/* Add Bed Button */}
                            {(!room.beds || room.beds.length < 3) && (
                              <button
                                onClick={() => {
                                  const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
                                    r.id === room.id ? {
                                      ...r,
                                      beds: [...(r.beds || []), { type: 'twin' as 'queen' | 'king' | 'twin' | 'full' | 'couch' | 'air_mattress', quantity: 1 }]
                                    } : r
                                  );
                                  updateHostProfile({
                                    lodgingDetails: {
                                      ...hostProfile.lodgingDetails,
                                      rooms: updatedRooms
                                    }
                                  });
                                }}
                                className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Another Bed
                              </button>
                            )}
                          </div>

                          {/* Room Photos */}
                          <div className="col-span-2 mt-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-medium text-neutral-900">Room Photos</h4>
                              <label htmlFor={`roomPhotoUpload-${room.id}`} className="cursor-pointer">
                                <div className="flex items-center px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                  <Camera className="w-4 h-4 mr-2" />
                                  Add Photos
                                </div>
                              </label>
                              <input
                                id={`roomPhotoUpload-${room.id}`}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length === 0) return;

                                  for (const file of files) {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('type', 'lodging');

                                    try {
                                      const response = await fetch('/api/upload', {
                                        method: 'POST',
                                        body: formData
                                      });

                                      if (response.ok) {
                                        const { url } = await response.json();
                                        
                                        const newPhoto = {
                                          id: `temp-${Date.now()}-${Math.random()}`,
                                          url: url,
                                          title: file.name.replace(/\.[^/.]+$/, ""),
                                          description: ''
                                        };

                                        const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
                                          r.id === room.id ? {
                                            ...r,
                                            photos: [...((r as any).photos || []), newPhoto]
                                          } : r
                                        );
                                        
                                        updateHostProfile({
                                          lodgingDetails: {
                                            ...hostProfile.lodgingDetails,
                                            rooms: updatedRooms
                                          }
                                        });
                                      }
                                    } catch (error) {
                                      console.error('Upload error:', error);
                                    }
                                  }
                                  e.target.value = '';
                                }}
                                className="hidden"
                              />
                            </div>
                            
                            {(room as any).photos && (room as any).photos.length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {(room as any).photos.map((photo: any, photoIndex: number) => (
                                  <div key={photo.id || photoIndex} className="relative group">
                                    <img
                                      src={photo.url}
                                      alt={photo.title || `Room ${index + 1} photo`}
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                      onClick={() => {
                                        const updatedRooms = hostProfile.lodgingDetails.rooms.map(r =>
                                          r.id === room.id ? {
                                            ...r,
                                            photos: (r as any).photos?.filter((_: any, i: number) => i !== photoIndex) || []
                                          } : r
                                        );
                                        updateHostProfile({
                                          lodgingDetails: {
                                            ...hostProfile.lodgingDetails,
                                            rooms: updatedRooms
                                          }
                                        });
                                      }}
                                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                                <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                                <p className="text-neutral-600 text-sm">No photos uploaded yet</p>
                                <p className="text-neutral-500 text-xs mt-1">Click "Add Photos" to upload room images</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Amenities */}
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-neutral-900">Amenities</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { key: 'breakfast', label: 'Breakfast included', icon: Coffee },
                        { key: 'wifi', label: 'WiFi available', icon: Wifi },
                        { key: 'parking', label: 'Free parking', icon: Car },
                        { key: 'laundry', label: 'Laundry access', icon: Home },
                        { key: 'kitchenAccess', label: 'Kitchen access', icon: Utensils },
                        { key: 'workspace', label: 'Workspace available', icon: Briefcase },
                        { key: 'linensProvided', label: 'Linens provided', icon: Home },
                        { key: 'towelsProvided', label: 'Towels provided', icon: Home }
                      ].map(({ key, label, icon: Icon }) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(hostProfile.lodgingDetails?.amenities?.[key as keyof typeof hostProfile.lodgingDetails.amenities] as boolean) || false}
                            onChange={(e) => {
                              updateHostProfile({
                                lodgingDetails: {
                                  ...hostProfile.lodgingDetails,
                                  amenities: {
                                    ...hostProfile.lodgingDetails.amenities,
                                    [key]: e.target.checked
                                  }
                                }
                              });
                            }}
                            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                          />
                          <Icon className="w-4 h-4 text-neutral-500 ml-2 mr-2" />
                          <span className="text-sm text-neutral-700">{label}</span>
                        </label>
                      ))}
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