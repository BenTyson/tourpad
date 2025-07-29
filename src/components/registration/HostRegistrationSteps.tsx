'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { PhotoIcon, XMarkIcon, HomeIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';

// US States for dropdown
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const VENUE_TYPES = [
  { value: 'HOME', label: 'Home / Living Room' },
  { value: 'LOFT', label: 'Loft / Studio Space' },
  { value: 'BACKYARD', label: 'Backyard / Outdoor Space' },
  { value: 'WAREHOUSE', label: 'Warehouse / Large Space' },
  { value: 'STUDIO', label: 'Studio / Rehearsal Space' },
  { value: 'OTHER', label: 'Other' }
];

const PREFERRED_GENRES = [
  'Folk', 'Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Classical', 
  'Electronic', 'Hip Hop', 'R&B', 'Soul', 'Funk', 'Reggae', 
  'World', 'Experimental', 'Ambient', 'Indie', 'Alternative', 'Other'
];

export interface HostFormData {
  // Step 1: Personal Info
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Venue Details
  address: string;
  city: string;
  state: string;
  zipCode: string;
  venueType: string;
  venueDescription: string;
  indoorCapacity: string;
  outdoorCapacity: string;
  venuePhotos: File[];
  
  // Step 3: Hosting Experience
  hostingExperience: string;
  preferredGenres: string[];
  hostingMotivation: string;
  houseRules: string;
  amenities: string[];
  soundSystem: string;
  
  // Form state
  agreeToTerms: boolean;
}

interface StepProps {
  formData: HostFormData;
  updateFormData: (updates: Partial<HostFormData>) => void;
  errors: Record<string, string>;
  clearError: (field: string) => void;
}

// Step 1: Personal Information
export function PersonalInfoStep({ formData, updateFormData, errors, clearError }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sage rounded-full mb-4">
          <UsersIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-evergreen mb-2">Personal Information</h2>
        <p className="text-neutral-600">Let's start with your basic details</p>
      </div>

      <div className="space-y-4 max-w-lg mx-auto">
        <div>
          <Input
            label="Your Name *"
            value={formData.name}
            onChange={(e) => {
              updateFormData({ name: e.target.value });
              clearError('name');
            }}
            required
            placeholder="Your full name"
            error={errors.name}
          />
        </div>

        <div>
          <Input
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => {
              updateFormData({ email: e.target.value });
              clearError('email');
            }}
            required
            placeholder="your@email.com"
            error={errors.email}
          />
        </div>

        <div>
          <Input
            label="Password *"
            type="password"
            value={formData.password}
            onChange={(e) => {
              updateFormData({ password: e.target.value });
              clearError('password');
            }}
            required
            placeholder="Create a strong password"
            error={errors.password}
          />
          <p className="mt-1 text-xs text-neutral-500">Must be at least 8 characters long</p>
        </div>

        <div>
          <Input
            label="Confirm Password *"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => {
              updateFormData({ confirmPassword: e.target.value });
              clearError('confirmPassword');
            }}
            required
            placeholder="Confirm your password"
            error={errors.confirmPassword}
          />
        </div>
      </div>
    </div>
  );
}

// Step 2: Venue Details
export function VenueDetailsStep({ formData, updateFormData, errors, clearError }: StepProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    updateFormData({ venuePhotos: [...formData.venuePhotos, ...newFiles] });
    clearError('venuePhotos');
  };

  const removeFile = (index: number) => {
    const updatedFiles = formData.venuePhotos.filter((_, i) => i !== index);
    updateFormData({ venuePhotos: updatedFiles });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-french-blue rounded-full mb-4">
          <HomeIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-evergreen mb-2">Venue Details</h2>
        <p className="text-neutral-600">Tell us about your space</p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Address Section */}
        <div className="space-y-4">
          <div>
            <Input
              label="Street Address *"
              value={formData.address}
              onChange={(e) => {
                updateFormData({ address: e.target.value });
                clearError('address');
              }}
              required
              placeholder="123 Main Street"
              error={errors.address}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="City *"
                value={formData.city}
                onChange={(e) => {
                  updateFormData({ city: e.target.value });
                  clearError('city');
                }}
                required
                placeholder="Austin"
                error={errors.city}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => {
                  updateFormData({ state: e.target.value });
                  clearError('state');
                }}
                required
                className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-french-blue focus:outline-none focus:ring-1 focus:ring-french-blue transition-colors"
              >
                <option value="">Select State</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
          </div>

          <div>
            <Input
              label="Zip Code *"
              value={formData.zipCode}
              onChange={(e) => {
                updateFormData({ zipCode: e.target.value });
                clearError('zipCode');
              }}
              required
              placeholder="78701"
              maxLength={5}
              pattern="[0-9]{5}"
              error={errors.zipCode}
            />
          </div>

          <div className="bg-mist border border-sand rounded-lg p-4">
            <div className="flex items-start">
              <MapPinIcon className="w-5 h-5 text-sage mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-evergreen">Privacy Notice</h4>
                <p className="text-sm text-neutral-700 mt-1">
                  Your complete address stays private and is only shared with artists after a show is confirmed at your venue.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Venue Type */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Venue Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {VENUE_TYPES.map(venue => (
              <label key={venue.value} className="flex items-center p-3 border border-neutral-300 rounded-lg hover:border-french-blue cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="venueType"
                  value={venue.value}
                  checked={formData.venueType === venue.value}
                  onChange={(e) => {
                    updateFormData({ venueType: e.target.value });
                    clearError('venueType');
                  }}
                  className="mr-3 text-french-blue focus:ring-sage"
                />
                <span className="text-sm text-neutral-700">{venue.label}</span>
              </label>
            ))}
          </div>
          {errors.venueType && (
            <p className="mt-1 text-sm text-red-600">{errors.venueType}</p>
          )}
        </div>

        {/* Capacity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              label="Indoor Capacity *"
              type="number"
              value={formData.indoorCapacity}
              onChange={(e) => {
                updateFormData({ indoorCapacity: e.target.value });
                clearError('indoorCapacity');
              }}
              required
              placeholder="25"
              min="1"
              max="200"
              error={errors.indoorCapacity}
            />
            <p className="mt-1 text-xs text-neutral-500">Expected seated audience</p>
          </div>
          <div>
            <Input
              label="Outdoor Capacity"
              type="number"
              value={formData.outdoorCapacity}
              onChange={(e) => {
                updateFormData({ outdoorCapacity: e.target.value });
                clearError('outdoorCapacity');
              }}
              placeholder="0"
              min="0"
              max="500"
              error={errors.outdoorCapacity}
            />
            <p className="mt-1 text-xs text-neutral-500">Optional outdoor space</p>
          </div>
        </div>

        {/* Venue Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Venue Description *
          </label>
          <textarea
            value={formData.venueDescription}
            onChange={(e) => {
              updateFormData({ venueDescription: e.target.value });
              clearError('venueDescription');
            }}
            required
            rows={3}
            maxLength={300}
            className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-french-blue focus:outline-none focus:ring-1 focus:ring-french-blue transition-colors"
            placeholder="Describe your venue space, atmosphere, and what makes it special for intimate concerts..."
          />
          <div className="text-xs text-neutral-500 text-right mt-1">
            {formData.venueDescription.length}/300 characters
          </div>
          {errors.venueDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.venueDescription}</p>
          )}
        </div>

        {/* Photo Upload */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-700">
            Venue Photos *
          </label>
          
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-french-blue transition-colors">
            <PhotoIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <div className="space-y-2">
              <label className="cursor-pointer">
                <span className="bg-french-blue text-white px-4 py-2 rounded-lg hover:bg-sage transition-colors inline-block">
                  Choose Photos
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-neutral-500">Upload 1-5 high-quality photos of your performance space</p>
            </div>
          </div>

          {formData.venuePhotos.length > 0 && (
            <div className="space-y-2">
              {formData.venuePhotos.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-mist rounded-lg">
                  <div className="flex items-center space-x-3">
                    <PhotoIcon className="w-5 h-5 text-sage" />
                    <span className="text-sm text-neutral-700 truncate">{file.name}</span>
                    <span className="text-xs text-neutral-500">
                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {errors.venuePhotos && (
            <p className="mt-1 text-sm text-red-600">{errors.venuePhotos}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 3: Hosting Experience
export function HostingExperienceStep({ formData, updateFormData, errors, clearError }: StepProps) {
  const toggleGenre = (genre: string) => {
    const current = formData.preferredGenres;
    const updated = current.includes(genre)
      ? current.filter(g => g !== genre)
      : [...current, genre];
    updateFormData({ preferredGenres: updated });
    clearError('preferredGenres');
  };

  const toggleAmenity = (amenity: string) => {
    const current = formData.amenities;
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    updateFormData({ amenities: updated });
  };

  const AMENITIES = [
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-evergreen rounded-full mb-4">
          <HomeIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-evergreen mb-2">Hosting Experience</h2>
        <p className="text-neutral-600">Share your hosting background and preferences</p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Hosting Experience */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Are you new to hosting house concerts? *
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border border-neutral-300 rounded-lg hover:border-french-blue cursor-pointer">
              <input
                type="radio"
                name="hostingExperience"
                value="beginner"
                checked={formData.hostingExperience === 'beginner'}
                onChange={(e) => {
                  updateFormData({ hostingExperience: e.target.value });
                  clearError('hostingExperience');
                }}
                className="mr-3 text-french-blue focus:ring-sage"
              />
              <div>
                <span className="font-medium text-neutral-900">Yes, this would be my first time hosting</span>
                <p className="text-sm text-neutral-600">I'm new to hosting but excited to start</p>
              </div>
            </label>
            <label className="flex items-center p-3 border border-neutral-300 rounded-lg hover:border-french-blue cursor-pointer">
              <input
                type="radio"
                name="hostingExperience"
                value="experienced"
                checked={formData.hostingExperience === 'experienced'}
                onChange={(e) => {
                  updateFormData({ hostingExperience: e.target.value });
                  clearError('hostingExperience');
                }}
                className="mr-3 text-french-blue focus:ring-sage"
              />
              <div>
                <span className="font-medium text-neutral-900">No, I have experience hosting house concerts</span>
                <p className="text-sm text-neutral-600">I've hosted concerts or similar events before</p>
              </div>
            </label>
          </div>
          {errors.hostingExperience && (
            <p className="mt-1 text-sm text-red-600">{errors.hostingExperience}</p>
          )}
        </div>

        {/* Preferred Genres */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Preferred Music Genres (select 1-5)
          </label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {formData.preferredGenres.map(genre => (
                <span key={genre} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sage text-white">
                  {genre}
                  <button
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className="ml-1 text-xs hover:text-red-200"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {PREFERRED_GENRES.filter(g => !formData.preferredGenres.includes(g)).map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  disabled={formData.preferredGenres.length >= 5}
                  className="px-3 py-1 text-xs bg-mist hover:bg-sand rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + {genre}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Select the music styles you'd most enjoy hosting ({formData.preferredGenres.length}/5)
          </p>
          {errors.preferredGenres && (
            <p className="mt-1 text-sm text-red-600">{errors.preferredGenres}</p>
          )}
        </div>

        {/* Hosting Motivation */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            What motivates you to host house concerts? *
          </label>
          <textarea
            value={formData.hostingMotivation}
            onChange={(e) => {
              updateFormData({ hostingMotivation: e.target.value });
              clearError('hostingMotivation');
            }}
            required
            rows={4}
            maxLength={500}
            className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-french-blue focus:outline-none focus:ring-1 focus:ring-french-blue transition-colors"
            placeholder="Share what excites you about creating intimate musical experiences in your space..."
          />
          <div className="text-xs text-neutral-500 text-right mt-1">
            {formData.hostingMotivation.length}/500 characters
          </div>
          {errors.hostingMotivation && (
            <p className="mt-1 text-sm text-red-600">{errors.hostingMotivation}</p>
          )}
        </div>

        {/* Sound System */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Sound System Available
          </label>
          <div className="space-y-2">
            {[
              { value: 'none', label: 'No sound system (acoustic only)' },
              { value: 'basic', label: 'Basic sound system (small speakers/microphone)' },
              { value: 'professional', label: 'Professional sound system (PA, mixing, etc.)' }
            ].map(option => (
              <label key={option.value} className="flex items-center p-3 border border-neutral-300 rounded-lg hover:border-french-blue cursor-pointer">
                <input
                  type="radio"
                  name="soundSystem"
                  value={option.value}
                  checked={formData.soundSystem === option.value}
                  onChange={(e) => {
                    updateFormData({ soundSystem: e.target.value });
                    clearError('soundSystem');
                  }}
                  className="mr-3 text-french-blue focus:ring-sage"
                />
                <span className="text-sm text-neutral-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.soundSystem && (
            <p className="mt-1 text-sm text-red-600">{errors.soundSystem}</p>
          )}
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Available Amenities (optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map(amenity => (
              <label key={amenity} className="flex items-center p-2 border border-neutral-300 rounded hover:border-french-blue cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="mr-2 text-french-blue focus:ring-sage"
                />
                <span className="text-xs text-neutral-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* House Rules */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            House Rules (optional)
          </label>
          <textarea
            value={formData.houseRules}
            onChange={(e) => {
              updateFormData({ houseRules: e.target.value });
              clearError('houseRules');
            }}
            rows={3}
            maxLength={300}
            className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-french-blue focus:outline-none focus:ring-1 focus:ring-french-blue transition-colors"
            placeholder="Any specific guidelines for guests (e.g., no smoking, shoes off, etc.)"
          />
          <div className="text-xs text-neutral-500 text-right mt-1">
            {formData.houseRules.length}/300 characters
          </div>
          {errors.houseRules && (
            <p className="mt-1 text-sm text-red-600">{errors.houseRules}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 4: Review & Submit
export function ReviewSubmitStep({ formData, updateFormData, errors, clearError }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sand rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-evergreen mb-2">Review Your Application</h2>
        <p className="text-neutral-600">Please review your information before submitting</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Personal Info Review */}
        <div className="bg-mist border border-sand rounded-lg p-4">
          <h3 className="font-medium text-evergreen mb-3">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600">Name:</span>
              <p className="font-medium">{formData.name}</p>
            </div>
            <div>
              <span className="text-neutral-600">Email:</span>
              <p className="font-medium">{formData.email}</p>
            </div>
          </div>
        </div>

        {/* Venue Details Review */}
        <div className="bg-mist border border-sand rounded-lg p-4">
          <h3 className="font-medium text-evergreen mb-3">Venue Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-neutral-600">Address:</span>
              <p className="font-medium">{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-neutral-600">Venue Type:</span>
                <p className="font-medium">{VENUE_TYPES.find(v => v.value === formData.venueType)?.label || formData.venueType}</p>
              </div>
              <div>
                <span className="text-neutral-600">Indoor Capacity:</span>
                <p className="font-medium">{formData.indoorCapacity} people</p>
              </div>
            </div>
            {formData.outdoorCapacity && (
              <div>
                <span className="text-neutral-600">Outdoor Capacity:</span>
                <p className="font-medium">{formData.outdoorCapacity} people</p>
              </div>
            )}
            <div>
              <span className="text-neutral-600">Description:</span>
              <p className="font-medium">{formData.venueDescription}</p>
            </div>
            <div>
              <span className="text-neutral-600">Photos:</span>
              <p className="font-medium">{formData.venuePhotos.length} photo(s) uploaded</p>
            </div>
          </div>
        </div>

        {/* Hosting Experience Review */}
        <div className="bg-mist border border-sand rounded-lg p-4">
          <h3 className="font-medium text-evergreen mb-3">Hosting Experience</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-neutral-600">Experience Level:</span>
              <p className="font-medium">
                {formData.hostingExperience === 'beginner' ? 'New to hosting' : 'Experienced host'}
              </p>
            </div>
            {formData.preferredGenres.length > 0 && (
              <div>
                <span className="text-neutral-600">Preferred Genres:</span>
                <p className="font-medium">{formData.preferredGenres.join(', ')}</p>
              </div>
            )}
            <div>
              <span className="text-neutral-600">Motivation:</span>
              <p className="font-medium">{formData.hostingMotivation}</p>
            </div>
            {formData.soundSystem && (
              <div>
                <span className="text-neutral-600">Sound System:</span>
                <p className="font-medium capitalize">{formData.soundSystem} sound system</p>
              </div>
            )}
            {formData.amenities.length > 0 && (
              <div>
                <span className="text-neutral-600">Amenities:</span>
                <p className="font-medium">{formData.amenities.join(', ')}</p>
              </div>
            )}
            {formData.houseRules && (
              <div>
                <span className="text-neutral-600">House Rules:</span>
                <p className="font-medium">{formData.houseRules}</p>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-sage border border-french-blue rounded-lg p-4">
          <h3 className="font-medium text-white mb-2">What happens next?</h3>
          <ul className="text-sm text-white space-y-1">
            <li>• We'll review your application within 48 hours</li>
            <li>• Approved hosts get full platform access</li>
            <li>• You'll receive email confirmation once approved</li>
            <li>• Start connecting with touring artists in your area</li>
          </ul>
        </div>

        {/* Terms Agreement */}
        <div>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeToTerms}
              onChange={(e) => {
                updateFormData({ agreeToTerms: e.target.checked });
                clearError('agreeToTerms');
              }}
              className="mr-3 h-4 w-4 text-french-blue focus:ring-sage border-neutral-300 rounded mt-1"
              required
            />
            <label htmlFor="terms" className="text-sm text-neutral-600">
              I agree to the{' '}
              <a href="/terms" className="text-french-blue hover:text-sage underline" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-french-blue hover:text-sage underline" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
          )}
        </div>
      </div>
    </div>
  );
}