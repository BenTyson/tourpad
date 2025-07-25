'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { User, MapPin, Heart, FileText, Camera } from 'lucide-react';

const MUSIC_GENRES = [
  'Rock', 'Pop', 'Hip-Hop', 'R&B', 'Country', 'Jazz', 'Blues', 'Folk', 
  'Classical', 'Electronic', 'Indie', 'Alternative', 'Reggae', 'World Music',
  'Punk', 'Metal', 'Funk', 'Soul', 'Gospel', 'Latin'
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

interface FanProfile {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  favoriteGenres: string[];
  hometown?: string;
  state?: string;
  bio?: string;
  travelRadius?: number;
  subscriptionStatus: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
}

export default function FanProfileForm() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<FanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    favoriteGenres: [] as string[],
    hometown: '',
    state: '',
    bio: '',
    travelRadius: 50,
    profileImageUrl: ''
  });

  // Fetch fan profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fan/profile');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.fan) {
        setProfile(data.fan);
        setFormData({
          favoriteGenres: data.fan.favoriteGenres || [],
          hometown: data.fan.hometown || '',
          state: data.fan.state || '',
          bio: data.fan.bio || '',
          travelRadius: data.fan.travelRadius || 50,
          profileImageUrl: data.fan.profileImageUrl || ''
        });
      }
    } catch (err) {
      console.error('Error fetching fan profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/fan/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.fan);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'profile');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update form data with new image URL
        setFormData(prev => ({
          ...prev,
          profileImageUrl: data.url
        }));
        
        // Update profile state to immediately show the new image
        setProfile(prev => prev ? {
          ...prev,
          profileImageUrl: data.url
        } : prev);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Failed to load fan profile</p>
          <Button onClick={fetchProfile} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              {profile.profileImageUrl ? (
                <img 
                  src={profile.profileImageUrl} 
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-primary-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{profile.name}</h2>
              <p className="text-neutral-600">{profile.email}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile.subscriptionStatus === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profile.subscriptionStatus === 'ACTIVE' ? 'Active Member' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">Profile Information</h3>
          <p className="text-sm text-neutral-600">Update your profile to get personalized concert recommendations</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                <Camera className="w-4 h-4 inline mr-1" />
                Profile Photo
              </label>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden">
                  {(formData.profileImageUrl || profile?.profileImageUrl) ? (
                    <img 
                      src={formData.profileImageUrl || profile?.profileImageUrl} 
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-neutral-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className={`inline-flex items-center px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {uploadingImage ? 'Uploading...' : 'Change Photo'}
                  </label>
                  <p className="text-xs text-neutral-500 mt-2">
                    JPG, PNG or WebP. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Hometown
                </label>
                <input
                  type="text"
                  value={formData.hometown}
                  onChange={(e) => setFormData(prev => ({ ...prev, hometown: e.target.value }))}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your hometown"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Radius */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Travel Radius: {formData.travelRadius} miles
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="25"
                value={formData.travelRadius}
                onChange={(e) => setFormData(prev => ({ ...prev, travelRadius: parseInt(e.target.value) }))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>Local</span>
                <span>Regional</span>
                <span>National</span>
              </div>
            </div>

            {/* Favorite Genres */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                <Heart className="w-4 h-4 inline mr-1" />
                Favorite Music Genres
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {MUSIC_GENRES.map(genre => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      formData.favoriteGenres.includes(genre)
                        ? 'bg-primary-100 border-primary-300 text-primary-800'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:border-primary-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Selected: {formData.favoriteGenres.length} genres
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                maxLength={500}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell artists and hosts about yourself..."
              />
              <p className="text-xs text-neutral-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                Profile updated successfully!
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}