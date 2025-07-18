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
  Users
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
  'Sound System', 'Piano/Keyboard', 'Microphones', 'WiFi', 'Parking',
  'Air Conditioning', 'Outdoor Space', 'Kid Friendly', 'Pet Friendly',
  'Wheelchair Accessible', 'B&B Offered', 'Refreshments Provided'
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
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'media'>('info');
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
    bandMembers: [] as Array<{id: string, name: string, instrument: string, photo?: string}>
  });

  const [hostProfile, setHostProfile] = useState({
    hostName: '',
    bio: '',
    city: '',
    state: '',
    zip: '',
    profilePhoto: '',
    venueType: 'home' as 'home' | 'studio' | 'backyard' | 'loft' | 'other',
    capacity: 20,
    amenities: [] as string[],
    hostInfo: {
      hostName: '',
      aboutMe: '',
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
                profilePhoto: '',
                genres: data.genres || [],
                instruments: data.instruments || [],
                experienceLevel: data.experienceLevel || 'intermediate',
                yearsActive: data.yearsActive || 1,
                tourMonthsPerYear: 3,
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
                bandMembers: data.bandMembers || []
              });
            } else if (session.user.type === 'host') {
              setHostProfile({
                hostName: data.hostName || '',
                bio: data.bio || '',
                city: data.city || '',
                state: data.state || '',
                zip: '',
                profilePhoto: '',
                venueType: data.venueType || 'home',
                capacity: 20,
                amenities: [],
                hostInfo: {
                  hostName: '',
                  aboutMe: '',
                  profilePhoto: ''
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
        throw new Error('Failed to save profile');
      }

      setHasChanges(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Profile Manager</h1>
              <p className="text-neutral-600">
                {isArtist ? 'Manage your artist profile, photos, and media' : 'Manage your venue profile and photos'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href={`/${isArtist ? 'artists' : 'hosts'}/${session.user.id}`} target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Live Profile
                </Button>
              </Link>
              {hasChanges && (
                <>
                  <Badge variant="warning" className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Unsaved Changes
                  </Badge>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2 inline" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'photos'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <UserCircle className="w-4 h-4 mr-2 inline" />
              {isArtist ? 'Press Photos & Band' : 'Venue Photos'}
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'media'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {isArtist ? (
                <Video className="w-4 h-4 mr-2 inline" />
              ) : (
                <Camera className="w-4 h-4 mr-2 inline" />
              )}
              {isArtist ? 'Music & Media' : 'Gallery'}
            </button>
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
                  <h2 className="text-xl font-semibold text-neutral-900">Basic Information</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label={isArtist ? "Artist/Band Name" : "Venue Name"}
                    value={isArtist ? artistProfile.bandName : hostProfile.hostName}
                    onChange={(e) => {
                      if (isArtist) updateArtistProfile({ bandName: e.target.value });
                      else updateHostProfile({ hostName: e.target.value });
                    }}
                    placeholder={isArtist ? "Your stage name or band name" : "Your venue name"}
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      {isArtist ? "Artist Bio" : "Venue Description"}
                    </label>
                    <textarea
                      value={isArtist ? artistProfile.bio : hostProfile.bio}
                      onChange={(e) => {
                        if (isArtist) updateArtistProfile({ bio: e.target.value });
                        else updateHostProfile({ bio: e.target.value });
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
                          <Button variant="outline" size="sm" className="mb-2">
                            <Camera className="w-4 h-4 mr-2" />
                            {hostProfile.hostInfo.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                          </Button>
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
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Months Touring Per Year"
                          type="number"
                          value={artistProfile.tourMonthsPerYear}
                          onChange={(e) => updateArtistProfile({ tourMonthsPerYear: parseInt(e.target.value) || 0 })}
                          min="0"
                          max="12"
                        />
                        <Input
                          label="Performance Radius (miles)"
                          type="number"
                          value={artistProfile.performanceRadius}
                          onChange={(e) => updateArtistProfile({ performanceRadius: parseInt(e.target.value) || 50 })}
                          min="10"
                          max="500"
                        />
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
                    <div className="grid md:grid-cols-2 gap-4">
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
                          <option value="loft">Loft/Warehouse</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <Input
                        label="Maximum Capacity"
                        type="number"
                        value={hostProfile.capacity}
                        onChange={(e) => updateHostProfile({ capacity: parseInt(e.target.value) || 1 })}
                        min="1"
                        max="200"
                      />
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
                    <div className="w-32 h-32 bg-neutral-100 rounded-lg flex items-center justify-center">
                      {(isArtist ? artistProfile.profilePhoto : hostProfile.profilePhoto) ? (
                        <img 
                          src={isArtist ? artistProfile.profilePhoto : hostProfile.profilePhoto} 
                          alt="Profile" 
                          className="w-32 h-32 rounded-lg object-cover"
                        />
                      ) : (
                        <Camera className="w-12 h-12 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Button variant="outline" className="mb-2">
                        <Camera className="w-4 h-4 mr-2" />
                        {(isArtist ? artistProfile.profilePhoto : hostProfile.profilePhoto) ? 'Change Photo' : 'Upload Photo'}
                      </Button>
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
                              <Button variant="outline" size="sm">
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
              <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-neutral-900">
                    {isArtist ? 'Music & Media Management' : 'Venue Photo Gallery'}
                  </h2>
                  <p className="text-sm text-neutral-600">
                    {isArtist 
                      ? 'Upload your music, videos, and media to showcase your talent'
                      : 'Upload photos of your venue space, both interior and exterior'
                    }
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      {isArtist ? (
                        <Video className="w-12 h-12 text-neutral-400 mx-auto" />
                      ) : (
                        <Camera className="w-12 h-12 text-neutral-400 mx-auto" />
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">
                          {isArtist ? 'Media Management' : 'Photo Gallery'}
                        </h3>
                        <p className="text-neutral-600 mb-4">
                          {isArtist 
                            ? 'Upload audio tracks, videos, and other media to showcase your music'
                            : 'Add photos of your venue to help artists visualize the space'
                          }
                        </p>
                        <div className="flex justify-center space-x-3">
                          <Link href={isArtist ? "/dashboard/artist-media" : "/dashboard/media"}>
                            <Button>
                              {isArtist ? (
                                <Video className="w-4 h-4 mr-2" />
                              ) : (
                                <Camera className="w-4 h-4 mr-2" />
                              )}
                              {isArtist ? 'Manage Music & Media' : 'Manage Photos'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Save Section */}
        {hasChanges && (
          <Card className="bg-white rounded-xl shadow-sm border border-neutral-200 mt-8">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">Save Your Changes</h3>
                  <p className="text-sm text-neutral-600">
                    You have unsaved changes that will be lost if you navigate away.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="min-w-32"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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