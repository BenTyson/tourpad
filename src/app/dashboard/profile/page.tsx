'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProfileHeader from '@/components/profile/ProfileHeader';
import TabNavigation from '@/components/profile/TabNavigation';
import InfoTab from '@/components/profile/InfoTab';
import PhotosTab from '@/components/profile/PhotosTab';
import MediaTab from '@/components/profile/MediaTab';
import FormationYearField from '@/components/profile/info/FormationYearField';
import SocialLinksCard from '@/components/profile/info/SocialLinksCard';
import TourLogisticsCard from '@/components/profile/info/TourLogisticsCard';
import HostVenueDetailsCard from '@/components/profile/info/HostVenueDetailsCard';
import ArtistMusicalDetailsCard from '@/components/profile/info/ArtistMusicalDetailsCard';
import ThumbnailPhotoCard from '@/components/profile/info/ThumbnailPhotoCard';
import HeroPhotoCard from '@/components/profile/info/HeroPhotoCard';
import BandMembersCard from '@/components/profile/info/BandMembersCard';
import HostPersonalInfoCard from '@/components/profile/info/HostPersonalInfoCard';
import HostMusicalPreferencesCard from '@/components/profile/info/HostMusicalPreferencesCard';
import BasicInformationCard from '@/components/profile/info/BasicInformationCard';


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


const MUSIC_PLATFORMS = [
  { value: 'spotify', label: 'Spotify' },
  { value: 'apple_music', label: 'Apple Music' },
  { value: 'bandcamp', label: 'Bandcamp' },
  { value: 'soundcloud', label: 'SoundCloud' },
  { value: 'youtube', label: 'YouTube Music' },
  { value: 'other', label: 'Other' }
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




  const addVenueRequirement = (requirement: string) => {
    if (!artistProfile.venueRequirements.includes(requirement)) {
      updateArtistProfile({ venueRequirements: [...artistProfile.venueRequirements, requirement] });
    }
  };

  const removeVenueRequirement = (requirement: string) => {
    updateArtistProfile({ venueRequirements: artistProfile.venueRequirements.filter(r => r !== requirement) });
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
    <div className="min-h-screen bg-white">
      <ProfileHeader
        isArtist={isArtist}
        session={session}
        hasChanges={hasChanges}
        loading={loading}
        onSave={handleSave}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
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
              <BasicInformationCard
                isArtist={isArtist}
                artistProfile={artistProfile}
                hostProfile={hostProfile}
                updateArtistProfile={updateArtistProfile}
                updateHostProfile={updateHostProfile}
              />

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
                <HostPersonalInfoCard
                  hostProfile={hostProfile}
                  updateHostProfile={updateHostProfile}
                />
              )}

              {/* Musical Preferences - Host only */}
              {!isArtist && (
                <HostMusicalPreferencesCard
                  hostProfile={hostProfile}
                  updateHostProfile={updateHostProfile}
                />
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


          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <PhotosTab
              isArtist={isArtist}
              artistProfile={artistProfile}
              hostProfile={hostProfile}
              updateArtistProfile={updateArtistProfile}
              updateHostProfile={updateHostProfile}
              hasChanges={hasChanges}
              loading={loading}
            />
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <MediaTab
              isArtist={isArtist}
              artistProfile={artistProfile}
              hostProfile={hostProfile}
              updateArtistProfile={updateArtistProfile}
              updateHostProfile={updateHostProfile}
              hasChanges={hasChanges}
              loading={loading}
            />
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