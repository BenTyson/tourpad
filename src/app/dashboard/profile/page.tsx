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
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'media' | 'sound-system' | 'lodging'>('info');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Tour segment state
  const [tourSegments, setTourSegments] = useState<Array<{
    id: string;
    name: string;
    description: string;
    status: string;
    isPublic: boolean;
    stateRanges: Array<{
      id: string;
      state: string;
      startDate: string;
      endDate: string;
      cities: string[];
      notes: string;
    }>;
  }>>([]);
  const [showTourModal, setShowTourModal] = useState(false);
  const [editingTourSegment, setEditingTourSegment] = useState<string | null>(null);
  const [editingStateRangeId, setEditingStateRangeId] = useState<string | null>(null);

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
  const [customInstrument, setCustomInstrument] = useState('');
  const [customEquipment, setCustomEquipment] = useState('');

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
    },
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
                },
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

  // Fetch tour segments
  useEffect(() => {
    const fetchTourSegments = async () => {
      if (session?.user?.type === 'artist') {
        try {
          const response = await fetch('/api/tour-segments');
          if (response.ok) {
            const segments = await response.json();
            setTourSegments(segments);
          }
        } catch (error) {
          console.error('Error fetching tour segments:', error);
        }
      }
    };
    
    fetchTourSegments();
  }, [session]);

  // Tour segment management functions
  const createTourSegment = async (segmentData: {
    name: string;
    description?: string;
    status?: string;
    isPublic?: boolean;
    stateRanges: Array<{
      state: string;
      startDate: string;
      endDate: string;
      cities: string[];
      notes?: string;
    }>;
  }) => {
    try {
      const response = await fetch('/api/tour-segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segmentData)
      });
      
      if (response.ok) {
        const newSegment = await response.json();
        setTourSegments(prev => [...prev, newSegment]);
        setShowTourModal(false);
      } else {
        const error = await response.json();
        alert(`Error creating tour segment: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating tour segment:', error);
      alert('Error creating tour segment');
    }
  };

  const updateTourSegment = async (segmentId: string, segmentData: {
    name?: string;
    description?: string;
    status?: string;
    isPublic?: boolean;
    stateRanges?: Array<{
      state: string;
      startDate: string;
      endDate: string;
      cities: string[];
      notes?: string;
    }>;
  }) => {
    try {
      const response = await fetch(`/api/tour-segments/${segmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segmentData)
      });
      
      if (response.ok) {
        const updatedSegment = await response.json();
        setTourSegments(prev => 
          prev.map(segment => 
            segment.id === segmentId ? updatedSegment : segment
          )
        );
        setShowTourModal(false);
      } else {
        const error = await response.json();
        alert(`Error updating tour segment: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating tour segment:', error);
      alert('Error updating tour segment');
    }
  };

  const deleteTourSegment = async (segmentId: string) => {
    if (!confirm('Are you sure you want to delete this tour segment?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/tour-segments/${segmentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTourSegments(prev => prev.filter(segment => segment.id !== segmentId));
      } else {
        const error = await response.json();
        alert(`Error deleting tour segment: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting tour segment:', error);
      alert('Error deleting tour segment');
    }
  };

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
  const addCustomInstrument = () => {
    if (customInstrument.trim() && !artistProfile.instruments.includes(customInstrument.trim())) {
      updateArtistProfile({ instruments: [...artistProfile.instruments, customInstrument.trim()] });
      setCustomInstrument('');
    }
  };
  const addCustomEquipment = () => {
    if (customEquipment.trim() && !artistProfile.equipmentProvided.includes(customEquipment.trim())) {
      updateArtistProfile({ equipmentProvided: [...artistProfile.equipmentProvided, customEquipment.trim()] });
      setCustomEquipment('');
    }
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

  // Tour Segment Modal Component
  const TourSegmentModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      status: 'planned',
      isPublic: true,
      stateRanges: [] as Array<{
        id: string;
        state: string;
        startDate: string;
        endDate: string;
        cities: string[];
        notes: string;
      }>
    });
    const [newStateRange, setNewStateRange] = useState({
      state: '',
      startDate: '',
      endDate: '',
      cities: [] as string[],
      notes: ''
    });

    const [cityInput, setCityInput] = useState('');

    // Load existing data when editing - only reset editing state when modal opens/closes
    useEffect(() => {
      if (editingTourSegment && showTourModal) {
        const segment = tourSegments.find(s => s.id === editingTourSegment);
        if (segment) {
          setFormData({
            name: segment.name,
            description: segment.description,
            status: segment.status,
            isPublic: segment.isPublic,
            stateRanges: segment.stateRanges.map(range => ({
              ...range,
              startDate: range.startDate.split('T')[0],
              endDate: range.endDate.split('T')[0]
            }))
          });
        }
      } else if (!showTourModal) {
        // Reset form for new segment only when modal is closed
        setFormData({
          name: '',
          description: '',
          status: 'planned',
          isPublic: true,
          stateRanges: []
        });
        
        // Reset new state range form
        setNewStateRange({
          state: '',
          startDate: '',
          endDate: '',
          cities: [],
          notes: ''
        });
        setCityInput('');
        
        // Reset editing state only when modal closes
        setEditingStateRangeId(null);
      }
    }, [editingTourSegment, showTourModal]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.name || formData.stateRanges.length === 0) {
        alert('Please provide a tour name and add at least one state with dates');
        return;
      }

      const segmentData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        isPublic: formData.isPublic,
        stateRanges: formData.stateRanges.map(range => ({
          state: range.state,
          startDate: range.startDate + 'T00:00:00.000Z',
          endDate: range.endDate + 'T23:59:59.999Z',
          cities: range.cities,
          notes: range.notes
        }))
      };

      if (editingTourSegment) {
        updateTourSegment(editingTourSegment, segmentData);
      } else {
        createTourSegment(segmentData);
      }
    };

    const addStateRange = () => {
      if (!newStateRange.state || !newStateRange.startDate || !newStateRange.endDate) {
        alert('Please fill in state, start date, and end date');
        return;
      }
      
      if (new Date(newStateRange.startDate) >= new Date(newStateRange.endDate)) {
        alert('End date must be after start date');
        return;
      }
      
      // Check if state already exists in this tour
      if (formData.stateRanges.some(range => range.state === newStateRange.state)) {
        alert('This state is already added to the tour');
        return;
      }
      
      const stateRange = {
        id: Date.now().toString(),
        ...newStateRange
      };
      
      setFormData(prev => ({
        ...prev,
        stateRanges: [...prev.stateRanges, stateRange]
      }));
      
      // Reset form
      setNewStateRange({
        state: '',
        startDate: '',
        endDate: '',
        cities: [],
        notes: ''
      });
      setCityInput('');
    };

    const removeStateRange = (id: string) => {
      setFormData(prev => ({
        ...prev,
        stateRanges: prev.stateRanges.filter(range => range.id !== id)
      }));
    };
    
    const updateStateRange = (id: string, field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        stateRanges: prev.stateRanges.map(range => 
          range.id === id ? { ...range, [field]: value } : range
        )
      }));
    };

    const addCityToNewRange = () => {
      if (cityInput && !newStateRange.cities.includes(cityInput)) {
        setNewStateRange(prev => ({
          ...prev,
          cities: [...prev.cities, cityInput]
        }));
        setCityInput('');
      }
    };

    const removeCityFromNewRange = (city: string) => {
      setNewStateRange(prev => ({
        ...prev,
        cities: prev.cities.filter(c => c !== city)
      }));
    };
    
    const addCityToRange = (rangeId: string, city: string) => {
      const range = formData.stateRanges.find(r => r.id === rangeId);
      if (range && city && !range.cities.includes(city)) {
        updateStateRange(rangeId, 'cities', [...range.cities, city]);
      }
    };

    const removeCityFromRange = (rangeId: string, city: string) => {
      const range = formData.stateRanges.find(r => r.id === rangeId);
      if (range) {
        updateStateRange(rangeId, 'cities', range.cities.filter(c => c !== city));
      }
    };

    // Function to load existing state range into the form for editing
    const loadStateRangeForEditing = (range: any) => {
      // Load the data into the form first
      setNewStateRange({
        state: range.state,
        startDate: range.startDate,
        endDate: range.endDate,
        cities: [...range.cities],
        notes: range.notes
      });
      setCityInput('');
      
      // Then set editing state
      setEditingStateRangeId(range.id);
    };

    // Function to save or update state range
    const saveStateRange = () => {
      if (!newStateRange.state || !newStateRange.startDate || !newStateRange.endDate) {
        alert('Please fill in state and date range');
        return;
      }

      if (new Date(newStateRange.startDate) >= new Date(newStateRange.endDate)) {
        alert('End date must be after start date');
        return;
      }

      if (editingStateRangeId) {
        // Update existing state range
        updateStateRange(editingStateRangeId, 'state', newStateRange.state);
        updateStateRange(editingStateRangeId, 'startDate', newStateRange.startDate);
        updateStateRange(editingStateRangeId, 'endDate', newStateRange.endDate);
        updateStateRange(editingStateRangeId, 'cities', newStateRange.cities);
        updateStateRange(editingStateRangeId, 'notes', newStateRange.notes);
        setEditingStateRangeId(null);
      } else {
        // Add new state range
        const newRange = {
          id: Date.now().toString(),
          state: newStateRange.state,
          startDate: newStateRange.startDate,
          endDate: newStateRange.endDate,
          cities: newStateRange.cities,
          notes: newStateRange.notes
        };
        setFormData(prev => ({ 
          ...prev, 
          stateRanges: [...prev.stateRanges, newRange] 
        }));
      }

      // Reset form
      setNewStateRange({
        state: '',
        startDate: '',
        endDate: '',
        cities: [],
        notes: ''
      });
      setCityInput('');
    };

    const cancelStateRangeEdit = () => {
      setEditingStateRangeId(null);
      setNewStateRange({
        state: '',
        startDate: '',
        endDate: '',
        cities: [],
        notes: ''
      });
      setCityInput('');
    };

    if (!showTourModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                  {editingTourSegment ? 'Edit Tour' : 'Plan New Tour'}
                </h2>
                <p className="text-neutral-600 text-sm">
                  {editingTourSegment ? 'Update your tour dates and locations' : 'Add states and dates to let hosts find you'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTourModal(false)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tour Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-3">
                    Tour Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Southwest Spring Tour 2025"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-3">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your tour..."
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm resize-none"
                  />
                </div>
              </div>

              {/* State Tour Schedule */}
              <div>
                <label className="block text-lg font-bold text-neutral-900 mb-4">
                  Tour Schedule by State *
                </label>
                <p className="text-neutral-600 text-sm mb-6">Add each state you'll visit with specific dates. Hosts can discover you when you're in their area.</p>
                
                {/* Add New State Range */}
                <div className="border border-neutral-200 rounded-2xl p-6 mb-6 bg-gradient-to-br from-neutral-50 to-white shadow-sm">
                  <h3 className="text-md font-semibold text-neutral-900 mb-4 flex items-center">
                    <Plus className="w-4 h-4 mr-2 text-primary-600" />
                    Add State to Tour
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">State</label>
                      <select
                        value={newStateRange.state}
                        onChange={(e) => setNewStateRange(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                      >
                        <option value="">Choose state...</option>
                        {US_STATES.map((state) => (
                          <option key={state.value} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Arrival Date</label>
                      <input
                        type="date"
                        value={newStateRange.startDate}
                        onChange={(e) => setNewStateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Departure Date</label>
                      <input
                        type="date"
                        value={newStateRange.endDate}
                        onChange={(e) => setNewStateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Cities and Notes Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Cities (Optional)</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={cityInput}
                          onChange={(e) => setCityInput(e.target.value)}
                          placeholder="Denver, Boulder..."
                          className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCityToNewRange())}
                        />
                        <Button type="button" onClick={addCityToNewRange} size="sm" className="px-4 py-3 rounded-xl">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newStateRange.cities.map((city) => (
                          <Badge key={city} variant="secondary" className="px-3 py-1 rounded-full">
                            {city}
                            <button
                              type="button"
                              onClick={() => removeCityFromNewRange(city)}
                              className="ml-2 text-neutral-500 hover:text-neutral-700"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Notes (Optional)</label>
                      <textarea
                        value={newStateRange.notes}
                        onChange={(e) => setNewStateRange(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Looking for outdoor venues, acoustic preferred..."
                        rows={3}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm resize-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      onClick={saveStateRange}
                      className="flex-1 py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors duration-200 shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {editingStateRangeId ? 'Update State' : 'Add State to Tour'}
                    </Button>
                    {editingStateRangeId && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={cancelStateRangeEdit}
                        className="py-3 px-6 rounded-xl font-medium"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Existing State Ranges */}
                {formData.stateRanges.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        Planned States ({formData.stateRanges.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {formData.stateRanges.map((range) => (
                        <div key={range.id} className={`border rounded-2xl p-5 bg-white shadow-sm transition-all duration-200 ${
                          editingStateRangeId === range.id 
                            ? 'border-primary-300 shadow-lg ring-2 ring-primary-100' 
                            : 'border-neutral-200 hover:shadow-md hover:border-neutral-300 cursor-pointer'
                        }`} onClick={() => loadStateRangeForEditing(range)}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="primary" className="px-3 py-1 rounded-full font-medium">
                                {US_STATES.find(s => s.value === range.state)?.label || range.state}
                              </Badge>
                              {editingStateRangeId === range.id && (
                                <Badge variant="secondary" className="px-2 py-1 rounded-full text-xs">
                                  Editing...
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); removeStateRange(range.id); }}
                                className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm font-medium text-neutral-900 mb-1">Tour Dates</div>
                            <div className="text-sm text-neutral-600">
                              {new Date(range.startDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })} - {new Date(range.endDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm font-medium text-neutral-900 mb-2">Cities</div>
                            <div className="flex flex-wrap gap-2">
                              {range.cities.length > 0 ? range.cities.map((city) => (
                                <Badge key={city} variant="outline" className="px-2 py-1 rounded-full text-xs">
                                  {city}
                                </Badge>
                              )) : (
                                <span className="text-sm text-neutral-400 italic">No cities specified</span>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium text-neutral-900 mb-1">Notes</div>
                            <p className="text-sm text-neutral-600 leading-relaxed">
                              {range.notes || <span className="italic text-neutral-400">No notes</span>}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              {/* Tour Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-3">
                    Tour Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                  >
                    <option value="planned">Planned</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-3">
                    Visibility
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
                    />
                    <label htmlFor="isPublic" className="text-sm text-neutral-700">
                      Make this tour visible to hosts
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-neutral-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTourModal(false)}
                  className="flex-1 py-3 px-6 rounded-xl font-medium border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-sm transition-colors duration-200"
                >
                  {editingTourSegment ? 'Update Tour' : 'Create Tour'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
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
              <>
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
                <button
                  onClick={() => setActiveTab('lodging')}
                  className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeTab === 'lodging'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                  }`}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Lodging
                </button>
              </>
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
                  <h2 className="text-xl font-semibold text-neutral-900">General Band Info</h2>
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
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Formation Year</label>
                        <select
                          value={artistProfile.formationYear}
                          onChange={(e) => updateArtistProfile({ formationYear: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {(() => {
                            const currentYear = new Date().getFullYear();
                            const startYear = 1950;
                            const years = [];
                            for (let year = currentYear; year >= startYear; year--) {
                              years.push(
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              );
                            }
                            return years;
                          })()}
                        </select>
                        <p className="text-xs text-neutral-500 mt-1">
                          Years active: {new Date().getFullYear() - artistProfile.formationYear + 1}
                        </p>
                      </div>
                      <div>
                        {/* Empty space for grid alignment */}
                      </div>
                    </div>
                  )}
                  
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

              {/* Thumbnail Photo (Artist only) */}
              {isArtist && (
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Thumbnail Photo
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Square image (minimum 500x500px). This will be used throughout the site as a thumbnail photo when applicable.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-6">
                      <div className="w-32 h-32 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {artistProfile.thumbnailPhoto ? (
                          <img 
                            src={artistProfile.thumbnailPhoto} 
                            alt="Thumbnail" 
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
                                  updateArtistProfile({ thumbnailPhoto: data.url });
                                  
                                  alert('Image uploaded successfully!');
                                  
                                } catch (error) {
                                  console.error('Upload error:', error);
                                  alert('Failed to upload image. Please try again.');
                                }
                              }
                            }}
                            className="hidden"
                            id="thumbnailPhotoInput"
                          />
                          <label htmlFor="thumbnailPhotoInput" className="cursor-pointer">
                            <div className="inline-flex items-center px-4 py-2 text-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-md">
                              <Camera className="w-4 h-4 mr-2" />
                              {artistProfile.thumbnailPhoto ? 'Change Photo' : 'Upload Photo'}
                            </div>
                          </label>
                          {artistProfile.thumbnailPhoto && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateArtistProfile({ thumbnailPhoto: '' })}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500">
                          Requirements: Square image, minimum 500x500px, JPG or PNG
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          This thumbnail appears in artist cards and search results
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Hero Photo (Artist only) */}
              {isArtist && (
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Hero Photo
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Wide banner image for your artist profile page. Recommended dimensions: 1920x1080 (16:9) or 2400x1200 (2:1)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-full h-48 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {artistProfile.heroPhoto ? (
                          <img 
                            src={artistProfile.heroPhoto} 
                            alt="Hero Banner" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                            <p className="text-sm text-neutral-500">No hero photo uploaded</p>
                          </div>
                        )}
                      </div>
                      <div>
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
                                  formData.append('type', 'hero');
                                  
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
                                  updateArtistProfile({ heroPhoto: data.url });
                                  
                                  alert('Hero photo uploaded successfully!');
                                  
                                } catch (error) {
                                  console.error('Upload error:', error);
                                  alert('Failed to upload image. Please try again.');
                                }
                              }
                            }}
                            className="hidden"
                            id="heroPhotoInput"
                          />
                          <label htmlFor="heroPhotoInput" className="cursor-pointer">
                            <div className="inline-flex items-center px-4 py-2 text-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-md">
                              <Camera className="w-4 h-4 mr-2" />
                              {artistProfile.heroPhoto ? 'Change Hero Photo' : 'Upload Hero Photo'}
                            </div>
                          </label>
                          {artistProfile.heroPhoto && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateArtistProfile({ heroPhoto: '' })}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500">
                          This wide banner image appears at the top of your artist profile page
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Best results: High-quality landscape photo showing your band performing or a professional promotional shot
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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

                      {/* Musical Style Description */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Describe Your Musical Style</label>
                        <textarea
                          value={artistProfile.musicalStyle}
                          onChange={(e) => updateArtistProfile({ musicalStyle: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={3}
                          placeholder="ie: Harmonic Appalachian Folk"
                        />
                      </div>

                      {/* Instruments */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Instruments we play</label>
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
                          <div className="flex gap-2 mt-3">
                            <input
                              type="text"
                              placeholder="Other instrument..."
                              value={customInstrument}
                              onChange={(e) => setCustomInstrument(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addCustomInstrument();
                                }
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <button
                              onClick={addCustomInstrument}
                              disabled={!customInstrument.trim()}
                              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Equipment I Bring to Shows */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Equipment I Bring to Shows</label>
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
                          <div className="flex gap-2 mt-3">
                            <input
                              type="text"
                              placeholder="Other equipment..."
                              value={customEquipment}
                              onChange={(e) => setCustomEquipment(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addCustomEquipment();
                                }
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <button
                              onClick={addCustomEquipment}
                              disabled={!customEquipment.trim()}
                              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content Rating */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Content Rating</label>
                        <select
                          value={artistProfile.contentRating || 'family-friendly'}
                          onChange={(e) => updateArtistProfile({ contentRating: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="family-friendly">Family Friendly</option>
                          <option value="explicit">Explicit</option>
                          <option value="tailored">Can be tailored to suit the requested environment</option>
                        </select>
                        <p className="text-xs text-neutral-500 mt-1">
                          Let hosts know if your performance contains explicit language or adult themes
                        </p>
                      </div>

                    </CardContent>
                  </Card>

                  {/* Tour & Logistics */}
                  <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                    <CardHeader>
                      <h2 className="text-xl font-semibold text-neutral-900">Tour & Logistics</h2>
                    </CardHeader>
                    <CardContent className="space-y-6">
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

                  {/* Tour Planning */}
                  <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-neutral-900">Tour Planning</h2>
                          <p className="text-sm text-neutral-600">Plan your touring schedule so hosts can find you when you're in their area</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingTourSegment(null);
                            setShowTourModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Tour
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tourSegments.length === 0 ? (
                          <>
                            <p className="text-sm text-neutral-600">
                              No tour segments planned yet. Add your first tour to let hosts know when you'll be in their area.
                            </p>
                            <div className="bg-neutral-50 rounded-lg p-4 text-center">
                              <p className="text-sm text-neutral-500 mb-3">
                                Plan your tours by dates and locations to connect with hosts along your route
                              </p>
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  setEditingTourSegment(null);
                                  setShowTourModal(true);
                                }}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Plan Your First Tour
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-3">
                            {tourSegments.map((segment) => (
                              <div key={segment.id} className="border border-neutral-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-medium text-neutral-900">
                                      {segment.name || 'Tour Segment'}
                                    </h4>
                                    <p className="text-sm text-neutral-600">
                                      {segment.stateRanges.length} state{segment.stateRanges.length !== 1 ? 's' : ''} planned
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditingTourSegment(segment.id);
                                        setShowTourModal(true);
                                      }}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteTourSegment(segment.id)}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {segment.stateRanges.map((range) => (
                                    <div key={range.id} className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {range.state}
                                        </Badge>
                                        <span className="text-neutral-600">
                                          {new Date(range.startDate).toLocaleDateString()} - {new Date(range.endDate).toLocaleDateString()}
                                        </span>
                                      </div>
                                      {range.cities.length > 0 && (
                                        <div className="flex gap-1">
                                          {range.cities.map((city) => (
                                            <Badge key={city} variant="outline" className="text-xs">
                                              {city}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
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

                    {/* Suggested Door Fee */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Suggested Door Fee</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-neutral-600">$</span>
                        <Input
                          type="number"
                          value={hostProfile.suggestedDoorFee}
                          onChange={(e) => updateHostProfile({ suggestedDoorFee: parseInt(e.target.value) || 20 })}
                          min="0"
                          max="100"
                          className="w-24"
                        />
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">Typical door fee you suggest for concerts at your venue</p>
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
                            socialLinks: { 
                              ...{
                                instagram: '',
                                youtube: '',
                                spotify: '',
                                bandcamp: '',
                                facebook: '',
                                website: ''
                              },
                              ...socialLinks, 
                              website: e.target.value 
                            } 
                          });
                        } else {
                          updateHostProfile({ 
                            website: e.target.value,
                            socialLinks: { 
                              ...{
                                instagram: '',
                                youtube: '',
                                spotify: '',
                                bandcamp: '',
                                facebook: '',
                                website: ''
                              },
                              ...socialLinks, 
                              website: e.target.value 
                            } 
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
                        if (isArtist) updateArtistProfile({ socialLinks: { 
                          ...{
                            instagram: '',
                            youtube: '',
                            spotify: '',
                            bandcamp: '',
                            facebook: '',
                            website: ''
                          },
                          ...socialLinks, 
                          instagram: e.target.value 
                        } });
                        else updateHostProfile({ socialLinks: { 
                          ...{
                            instagram: '',
                            youtube: '',
                            spotify: '',
                            bandcamp: '',
                            facebook: '',
                            website: ''
                          },
                          ...socialLinks, 
                          instagram: e.target.value 
                        } });
                      }}
                      placeholder="https://instagram.com/username"
                    />
                    <Input
                      label="YouTube"
                      value={isArtist ? artistProfile.socialLinks.youtube : hostProfile.socialLinks.youtube}
                      onChange={(e) => {
                        const socialLinks = isArtist ? artistProfile.socialLinks : hostProfile.socialLinks;
                        if (isArtist) updateArtistProfile({ socialLinks: { 
                          ...{
                            instagram: '',
                            youtube: '',
                            spotify: '',
                            bandcamp: '',
                            facebook: '',
                            website: ''
                          },
                          ...socialLinks, 
                          youtube: e.target.value 
                        } });
                        else updateHostProfile({ socialLinks: { 
                          ...{
                            instagram: '',
                            youtube: '',
                            spotify: '',
                            bandcamp: '',
                            facebook: '',
                            website: ''
                          },
                          ...socialLinks, 
                          youtube: e.target.value 
                        } });
                      }}
                      placeholder="https://youtube.com/channel/..."
                    />
                    <Input
                      label="Facebook"
                      value={isArtist ? artistProfile.socialLinks.facebook : hostProfile.socialLinks.facebook}
                      onChange={(e) => {
                        const socialLinks = isArtist ? artistProfile.socialLinks : hostProfile.socialLinks;
                        if (isArtist) updateArtistProfile({ socialLinks: { 
                          ...{
                            instagram: '',
                            youtube: '',
                            spotify: '',
                            bandcamp: '',
                            facebook: '',
                            website: ''
                          },
                          ...socialLinks, 
                          facebook: e.target.value 
                        } });
                        else updateHostProfile({ socialLinks: { 
                          ...{
                            instagram: '',
                            youtube: '',
                            spotify: '',
                            bandcamp: '',
                            facebook: '',
                            website: ''
                          },
                          ...socialLinks, 
                          facebook: e.target.value 
                        } });
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
      
      {/* Tour Segment Modal */}
      <TourSegmentModal />
    </div>
  );
}