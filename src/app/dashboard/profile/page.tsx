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
  const [activeTab, setActiveTab] = useState<'artist' | 'host'>('artist');
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
  const [showTourModal, setShowTourModal] = useState(false);
  
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

  // Tour planning has been moved to /dashboard/tours


  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Type Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('artist')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'artist'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Artist Profile
              </button>
              <button
                onClick={() => setActiveTab('host')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'host'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Host Profile
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {activeTab === 'artist' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Band/Artist Name
                    </label>
                    <input
                      type="text"
                      value={artistProfile.bandName}
                      onChange={(e) => updateArtistProfile({ bandName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your band or artist name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={artistProfile.city}
                        onChange={(e) => updateArtistProfile({ city: e.target.value })}
                        className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="City"
                      />
                      <select
                        value={artistProfile.state}
                        onChange={(e) => updateArtistProfile({ state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">State</option>
                        {US_STATES.map(state => (
                          <option key={state.value} value={state.value}>{state.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Brief Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brief Bio
                  </label>
                  <textarea
                    value={artistProfile.briefBio || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 500) {
                        updateArtistProfile({ briefBio: value });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Brief introduction that appears at the top of your profile..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is the first thing people will read when they arrive at your profile ({(artistProfile.briefBio || '').length}/500 characters)
                  </p>
                </div>

                {/* Full Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Bio
                  </label>
                  <textarea
                    value={artistProfile.fullBio || ''}
                    onChange={(e) => updateArtistProfile({ fullBio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={6}
                    placeholder="Tell your story, your music journey, influences, what makes your performances special..."
                  />
                </div>

                {/* Musical Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Musical Details</h3>
                  
                  {/* Genres */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genres
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {artistProfile.genres.map((genre) => (
                        <Badge
                          key={genre}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {genre}
                          <button
                            onClick={() => removeGenre(genre)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {GENRE_OPTIONS.filter(genre => !artistProfile.genres.includes(genre)).map((genre) => (
                        <button
                          key={genre}
                          onClick={() => addGenre(genre)}
                          className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                        >
                          + {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Instruments */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instruments
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {artistProfile.instruments.map((instrument) => (
                        <Badge
                          key={instrument}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {instrument}
                          <button
                            onClick={() => removeInstrument(instrument)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {INSTRUMENT_OPTIONS.filter(instrument => !artistProfile.instruments.includes(instrument)).map((instrument) => (
                        <button
                          key={instrument}
                          onClick={() => addInstrument(instrument)}
                          className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                        >
                          + {instrument}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customInstrument}
                        onChange={(e) => setCustomInstrument(e.target.value)}
                        placeholder="Add custom instrument..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Button onClick={addCustomInstrument} size="sm">Add</Button>
                    </div>
                  </div>

                  {/* Formation Year and Musical Style */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Formation Year
                      </label>
                      <input
                        type="number"
                        value={artistProfile.formationYear}
                        onChange={(e) => updateArtistProfile({ formationYear: parseInt(e.target.value) || new Date().getFullYear() })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Musical Style Description
                      </label>
                      <input
                        type="text"
                        value={artistProfile.musicalStyle}
                        onChange={(e) => updateArtistProfile({ musicalStyle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Acoustic folk with jazz influences"
                      />
                    </div>
                  </div>
                </div>

                {/* Band Members */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Band Members</h3>
                    <Button onClick={addBandMember} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                  
                  {artistProfile.bandMembers.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No band members added yet</p>
                      <p className="text-sm text-gray-400">Add your band members to showcase your team</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {artistProfile.bandMembers.map((member) => (
                        <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                              </label>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) => updateBandMember(member.id, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Member name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Instrument/Role
                              </label>
                              <input
                                type="text"
                                value={member.instrument}
                                onChange={(e) => updateBandMember(member.id, 'instrument', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Lead guitar, Vocals"
                              />
                            </div>
                            <div className="flex items-end">
                              <Button
                                onClick={() => removeBandMember(member.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Links */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Video Links</h3>
                    <Button onClick={() => setShowVideoForm(true)} size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                  </div>

                  {showVideoForm && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Video Title
                          </label>
                          <input
                            type="text"
                            value={videoForm.title}
                            onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Video title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            value={videoForm.category}
                            onChange={(e) => setVideoForm({...videoForm, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select category</option>
                            {VIDEO_CATEGORIES.map(category => (
                              <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Video URL
                        </label>
                        <input
                          type="url"
                          value={videoForm.url}
                          onChange={(e) => setVideoForm({...videoForm, url: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="isLivePerformance"
                          checked={videoForm.isLivePerformance}
                          onChange={(e) => setVideoForm({...videoForm, isLivePerformance: e.target.checked})}
                          className="mr-2"
                        />
                        <label htmlFor="isLivePerformance" className="text-sm text-gray-700">
                          This is a live performance
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={editingVideoId ? updateVideoLink : addVideoLink}
                          size="sm"
                        >
                          {editingVideoId ? 'Update Video' : 'Add Video'}
                        </Button>
                        <Button 
                          onClick={() => {
                            setShowVideoForm(false);
                            setEditingVideoId(null);
                            setVideoForm({ title: '', url: '', category: '', isLivePerformance: false });
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {(artistProfile.videoLinks || []).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No videos added yet</p>
                      <p className="text-sm text-gray-400">Add performance videos to showcase your music</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(artistProfile.videoLinks || []).map((video) => (
                        <div key={video.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{video.title}</h4>
                            <div className="flex gap-1">
                              <button
                                onClick={() => editVideoLink(video)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeVideoLink(video.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {VIDEO_CATEGORIES.find(cat => cat.value === video.category)?.label || video.category}
                            {video.isLivePerformance && (
                              <Badge variant="secondary" className="ml-2">Live</Badge>
                            )}
                          </p>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 break-all"
                          >
                            {video.url}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Music Samples */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Music Samples</h3>
                    <Button onClick={() => setShowMusicForm(true)} size="sm">
                      <Music className="w-4 h-4 mr-2" />
                      Add Music
                    </Button>
                  </div>

                  {showMusicForm && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Song Title
                          </label>
                          <input
                            type="text"
                            value={musicForm.title}
                            onChange={(e) => setMusicForm({...musicForm, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Song title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Platform
                          </label>
                          <select
                            value={musicForm.platform}
                            onChange={(e) => setMusicForm({...musicForm, platform: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {MUSIC_PLATFORMS.map(platform => (
                              <option key={platform.value} value={platform.value}>{platform.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Music URL
                        </label>
                        <input
                          type="url"
                          value={musicForm.url}
                          onChange={(e) => setMusicForm({...musicForm, url: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://open.spotify.com/track/..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={addMusicSample} size="sm">Add Music</Button>
                        <Button 
                          onClick={() => {
                            setShowMusicForm(false);
                            setMusicForm({ title: '', url: '', platform: 'spotify' });
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {(artistProfile.musicSamples || []).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Music className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No music samples added yet</p>
                      <p className="text-sm text-gray-400">Add links to your music on streaming platforms</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(artistProfile.musicSamples || []).map((sample) => (
                        <div key={sample.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{sample.title}</h4>
                            <button
                              onClick={() => removeMusicSample(sample.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 capitalize">{sample.platform}</p>
                          <a
                            href={sample.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 break-all"
                          >
                            {sample.url}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Performance Photos */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Performance Photos</h3>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                        className="hidden"
                      />
                      <Button size="sm" disabled={uploading}>
                        <Camera className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Add Photos'}
                      </Button>
                    </label>
                  </div>

                  {(artistProfile.photos || []).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No photos added yet</p>
                      <p className="text-sm text-gray-400">Add performance photos to showcase your shows</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(artistProfile.photos || []).map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={photo.fileUrl}
                            alt={photo.title || 'Performance photo'}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Equipment & Requirements */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment & Requirements</h3>
                  
                  {/* Equipment Provided */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment You Provide
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {artistProfile.equipmentProvided.map((equipment) => (
                        <Badge
                          key={equipment}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {equipment}
                          <button
                            onClick={() => removeEquipment(equipment)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {EQUIPMENT_OPTIONS.filter(equipment => !artistProfile.equipmentProvided.includes(equipment)).map((equipment) => (
                        <button
                          key={equipment}
                          onClick={() => addEquipment(equipment)}
                          className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                        >
                          + {equipment}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customEquipment}
                        onChange={(e) => setCustomEquipment(e.target.value)}
                        placeholder="Add custom equipment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Button onClick={addCustomEquipment} size="sm">Add</Button>
                    </div>
                  </div>

                  {/* Venue Requirements */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue Requirements
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {artistProfile.venueRequirements.map((requirement) => (
                        <Badge
                          key={requirement}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {requirement}
                          <button
                            onClick={() => removeVenueRequirement(requirement)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {VENUE_REQUIREMENT_OPTIONS.filter(requirement => !artistProfile.venueRequirements.includes(requirement)).map((requirement) => (
                        <button
                          key={requirement}
                          onClick={() => addVenueRequirement(requirement)}
                          className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                        >
                          + {requirement}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={artistProfile.socialLinks.website}
                        onChange={(e) => updateArtistProfile({ 
                          socialLinks: { ...artistProfile.socialLinks, website: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={artistProfile.socialLinks.instagram}
                        onChange={(e) => updateArtistProfile({ 
                          socialLinks: { ...artistProfile.socialLinks, instagram: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://instagram.com/yourband"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        YouTube
                      </label>
                      <input
                        type="url"
                        value={artistProfile.socialLinks.youtube}
                        onChange={(e) => updateArtistProfile({ 
                          socialLinks: { ...artistProfile.socialLinks, youtube: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://youtube.com/c/yourband"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Spotify
                      </label>
                      <input
                        type="url"
                        value={artistProfile.socialLinks.spotify}
                        onChange={(e) => updateArtistProfile({ 
                          socialLinks: { ...artistProfile.socialLinks, spotify: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://open.spotify.com/artist/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bandcamp
                      </label>
                      <input
                        type="url"
                        value={artistProfile.socialLinks.bandcamp}
                        onChange={(e) => updateArtistProfile({ 
                          socialLinks: { ...artistProfile.socialLinks, bandcamp: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://yourband.bandcamp.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={artistProfile.socialLinks.facebook}
                        onChange={(e) => updateArtistProfile({ 
                          socialLinks: { ...artistProfile.socialLinks, facebook: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://facebook.com/yourband"
                      />
                    </div>
                  </div>
                </div>

                {/* Tour Preferences */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tour Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tour Months Per Year
                      </label>
                      <input
                        type="number"
                        value={artistProfile.tourMonthsPerYear}
                        onChange={(e) => updateArtistProfile({ tourMonthsPerYear: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        max="12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Willing to Travel (miles)
                      </label>
                      <input
                        type="number"
                        value={artistProfile.willingToTravel}
                        onChange={(e) => updateArtistProfile({ willingToTravel: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tour Vehicle
                      </label>
                      <select
                        value={artistProfile.tourVehicle}
                        onChange={(e) => updateArtistProfile({ tourVehicle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="car">Car</option>
                        <option value="van">Van</option>
                        <option value="bus">Bus</option>
                        <option value="trailer">Trailer/RV</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id="needsLodging"
                      checked={artistProfile.needsLodging}
                      onChange={(e) => updateArtistProfile({ needsLodging: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="needsLodging" className="text-sm text-gray-700">
                      Needs lodging accommodations
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t">
                  <Button
                    onClick={handleSave}
                    disabled={loading || !hasChanges}
                    className="min-w-[120px]"
                  >
                    {loading ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'host' && (
              <div className="space-y-6">
                {/* Basic Host Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={hostProfile.venueName}
                      onChange={(e) => updateHostProfile({ venueName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Mike's Music Room, Sarah's Studio"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Host Name
                    </label>
                    <input
                      type="text"
                      value={hostProfile.hostInfo.hostName}
                      onChange={(e) => updateHostProfile({ 
                        hostInfo: { ...hostProfile.hostInfo, hostName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={hostProfile.city}
                      onChange={(e) => updateHostProfile({ city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      value={hostProfile.state}
                      onChange={(e) => updateHostProfile({ state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select State</option>
                      {US_STATES.map(state => (
                        <option key={state.value} value={state.value}>{state.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={hostProfile.zip}
                      onChange={(e) => updateHostProfile({ zip: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ZIP"
                    />
                  </div>
                </div>

                {/* Venue Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Description
                  </label>
                  <textarea
                    value={hostProfile.venueDescription}
                    onChange={(e) => updateHostProfile({ venueDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Describe your venue space, atmosphere, and what makes it special for live music..."
                  />
                </div>

                {/* About Host */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About You (Host)
                  </label>
                  <textarea
                    value={hostProfile.hostInfo.aboutMe}
                    onChange={(e) => updateHostProfile({ 
                      hostInfo: { ...hostProfile.hostInfo, aboutMe: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Tell artists about yourself, your experience with live music, what you enjoy about hosting..."
                  />
                </div>

                {/* Venue Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Venue Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Venue Type
                      </label>
                      <select
                        value={hostProfile.venueType}
                        onChange={(e) => updateHostProfile({ venueType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="home">Home</option>
                        <option value="studio">Studio</option>
                        <option value="backyard">Backyard</option>
                        <option value="loft">Loft</option>
                        <option value="warehouse">Warehouse</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Indoor Capacity
                      </label>
                      <input
                        type="number"
                        value={hostProfile.indoorCapacity}
                        onChange={(e) => updateHostProfile({ indoorCapacity: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Outdoor Capacity
                      </label>
                      <input
                        type="number"
                        value={hostProfile.outdoorCapacity}
                        onChange={(e) => updateHostProfile({ outdoorCapacity: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Typical Show Length (minutes)
                      </label>
                      <input
                        type="number"
                        value={hostProfile.typicalShowLength}
                        onChange={(e) => updateHostProfile({ typicalShowLength: parseInt(e.target.value) || 90 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="15"
                        max="300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Suggested Door Fee ($)
                      </label>
                      <input
                        type="number"
                        value={hostProfile.suggestedDoorFee}
                        onChange={(e) => updateHostProfile({ suggestedDoorFee: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hostProfile.amenities.map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {amenity}
                        <button
                          onClick={() => removeAmenity(amenity)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.filter(amenity => !hostProfile.amenities.includes(amenity)).map((amenity) => (
                      <button
                        key={amenity}
                        onClick={() => addAmenity(amenity)}
                        className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                      >
                        + {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sound System */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sound System</h3>
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      id="soundSystemAvailable"
                      checked={hostProfile.soundSystem.available}
                      onChange={(e) => updateHostProfile({ 
                        soundSystem: { ...hostProfile.soundSystem, available: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <label htmlFor="soundSystemAvailable" className="text-sm text-gray-700">
                      Sound system available
                    </label>
                  </div>
                  
                  {hostProfile.soundSystem.available && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          System Description
                        </label>
                        <textarea
                          value={hostProfile.soundSystem.description}
                          onChange={(e) => updateHostProfile({ 
                            soundSystem: { ...hostProfile.soundSystem, description: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Describe your sound system setup..."
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Speakers
                          </label>
                          <input
                            type="text"
                            value={hostProfile.soundSystem.equipment.speakers}
                            onChange={(e) => updateHostProfile({ 
                              soundSystem: { 
                                ...hostProfile.soundSystem, 
                                equipment: { ...hostProfile.soundSystem.equipment, speakers: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Speaker details"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Microphones
                          </label>
                          <input
                            type="text"
                            value={hostProfile.soundSystem.equipment.microphones}
                            onChange={(e) => updateHostProfile({ 
                              soundSystem: { 
                                ...hostProfile.soundSystem, 
                                equipment: { ...hostProfile.soundSystem.equipment, microphones: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Microphone details"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lodging Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Lodging</h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="offersLodging"
                        checked={hostProfile.offersLodging}
                        onChange={(e) => updateHostProfile({ offersLodging: e.target.checked })}
                        className="mr-2"
                      />
                      <label htmlFor="offersLodging" className="text-sm text-gray-700">
                        I offer lodging for touring artists
                      </label>
                    </div>
                  </div>

                  {hostProfile.offersLodging && (
                    <div className="space-y-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-in Time
                          </label>
                          <input
                            type="text"
                            value={hostProfile.lodgingDetails.houseRules.checkInTime}
                            onChange={(e) => updateHostProfile({ 
                              lodgingDetails: { 
                                ...hostProfile.lodgingDetails, 
                                houseRules: { ...hostProfile.lodgingDetails.houseRules, checkInTime: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="3:00 PM"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-out Time
                          </label>
                          <input
                            type="text"
                            value={hostProfile.lodgingDetails.houseRules.checkOutTime}
                            onChange={(e) => updateHostProfile({ 
                              lodgingDetails: { 
                                ...hostProfile.lodgingDetails, 
                                houseRules: { ...hostProfile.lodgingDetails.houseRules, checkOutTime: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="11:00 AM"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Smoking Policy
                          </label>
                          <select
                            value={hostProfile.lodgingDetails.houseRules.smokingPolicy}
                            onChange={(e) => updateHostProfile({ 
                              lodgingDetails: { 
                                ...hostProfile.lodgingDetails, 
                                houseRules: { ...hostProfile.lodgingDetails.houseRules, smokingPolicy: e.target.value as any }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="no_smoking">No Smoking</option>
                            <option value="outside_only">Outside Only</option>
                            <option value="allowed">Allowed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pet Policy
                          </label>
                          <select
                            value={hostProfile.lodgingDetails.houseRules.petPolicy}
                            onChange={(e) => updateHostProfile({ 
                              lodgingDetails: { 
                                ...hostProfile.lodgingDetails, 
                                houseRules: { ...hostProfile.lodgingDetails.houseRules, petPolicy: e.target.value as any }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="no_pets">No Pets</option>
                            <option value="cats_ok">Cats OK</option>
                            <option value="dogs_ok">Dogs OK</option>
                            <option value="all_pets_ok">All Pets OK</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alcohol Policy
                          </label>
                          <select
                            value={hostProfile.lodgingDetails.houseRules.alcoholPolicy}
                            onChange={(e) => updateHostProfile({ 
                              lodgingDetails: { 
                                ...hostProfile.lodgingDetails, 
                                houseRules: { ...hostProfile.lodgingDetails.houseRules, alcoholPolicy: e.target.value as any }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="allowed">Allowed</option>
                            <option value="not_allowed">Not Allowed</option>
                            <option value="byob">BYOB</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="breakfast"
                            checked={hostProfile.lodgingDetails.amenities.breakfast}
                            onChange={(e) => updateHostProfile({ 
                              lodgingDetails: { 
                                ...hostProfile.lodgingDetails, 
                                amenities: { ...hostProfile.lodgingDetails.amenities, breakfast: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <label htmlFor="breakfast" className="text-sm text-gray-700">Breakfast</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="wifi"
                            checked={hostProfile.lodgingDetails.amenities.wifi}
                            onChange={(e) => updateHostProfile({ 
                              lodgingDetails: { 
                                ...hostProfile.lodgingDetails, 
                                amenities: { ...hostProfile.lodgingDetails.amenities, wifi: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <label htmlFor="wifi" className="text-sm text-gray-700">WiFi</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="parking"
                            checked={hostProfile.lodgingDetails.amenities.parking}
                            onChange={(e) => updateHostProfile({ 
                              lodgingDetails: { 
                                ...hostProfile.lodgingDetails, 
                                amenities: { ...hostProfile.lodgingDetails.amenities, parking: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <label htmlFor="parking" className="text-sm text-gray-700">Parking</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="laundry"
                            checked={hostProfile.lodgingDetails.amenities.laundry}
                            onChange={(e) => updateHostProfile({ 
                              lodgingDetails: { 
                                ...hostProfile.lodgingDetails, 
                                amenities: { ...hostProfile.lodgingDetails.amenities, laundry: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <label htmlFor="laundry" className="text-sm text-gray-700">Laundry</label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Special Considerations
                        </label>
                        <textarea
                          value={hostProfile.lodgingDetails.specialConsiderations}
                          onChange={(e) => updateHostProfile({ 
                            lodgingDetails: { 
                              ...hostProfile.lodgingDetails, 
                              specialConsiderations: e.target.value 
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Any special considerations for guests..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={hostProfile.socialLinks.website}
                        onChange={(e) => updateHostProfile({ 
                          socialLinks: { ...hostProfile.socialLinks, website: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={hostProfile.socialLinks.instagram}
                        onChange={(e) => updateHostProfile({ 
                          socialLinks: { ...hostProfile.socialLinks, instagram: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://instagram.com/yourvenue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        YouTube
                      </label>
                      <input
                        type="url"
                        value={hostProfile.socialLinks.youtube}
                        onChange={(e) => updateHostProfile({ 
                          socialLinks: { ...hostProfile.socialLinks, youtube: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://youtube.com/c/yourvenue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={hostProfile.socialLinks.facebook}
                        onChange={(e) => updateHostProfile({ 
                          socialLinks: { ...hostProfile.socialLinks, facebook: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://facebook.com/yourvenue"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t">
                  <Button
                    onClick={handleSave}
                    disabled={loading || !hasChanges}
                    className="min-w-[120px]"
                  >
                    {loading ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

