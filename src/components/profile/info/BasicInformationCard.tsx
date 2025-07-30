'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Camera, Home } from 'lucide-react';
import { ArtistProfile, HostProfile } from '../types';

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

interface BasicInformationCardProps {
  isArtist: boolean;
  artistProfile: ArtistProfile;
  hostProfile: HostProfile;
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
  updateHostProfile: (updates: Partial<HostProfile>) => void;
}

export default function BasicInformationCard({
  isArtist,
  artistProfile,
  hostProfile,
  updateArtistProfile,
  updateHostProfile
}: BasicInformationCardProps) {
  return (
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
              <option value="">Select State</option>
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="ZIP Code"
            value={isArtist ? artistProfile.zipCode : hostProfile.zipCode}
            onChange={(e) => {
              if (isArtist) updateArtistProfile({ zipCode: e.target.value });
              else updateHostProfile({ zipCode: e.target.value });
            }}
            placeholder="12345"
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={isArtist ? artistProfile.email : hostProfile.email}
          onChange={(e) => {
            if (isArtist) updateArtistProfile({ email: e.target.value });
            else updateHostProfile({ email: e.target.value });
          }}
          placeholder="your@email.com"
        />
        <Input
          label="Phone"
          type="tel"
          value={isArtist ? artistProfile.phone : hostProfile.phone}
          onChange={(e) => {
            if (isArtist) updateArtistProfile({ phone: e.target.value });
            else updateHostProfile({ phone: e.target.value });
          }}
          placeholder="(555) 123-4567"
        />
        {!isArtist && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Venue Photo</label>
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
  );
}