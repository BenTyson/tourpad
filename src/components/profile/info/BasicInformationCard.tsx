'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArtistProfile, HostProfile } from '../types';

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
        <h2 className="text-xl font-semibold text-neutral-900">
          {isArtist ? 'General Band Info' : 'General Venue Info'}
        </h2>
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
                placeholder="Tell your story - how did you form? What's your musical journey? What makes you unique?"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Share your musical journey, band formation story, and what makes you unique
              </p>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={artistProfile.city || ''}
                onChange={(e) => updateArtistProfile({ city: e.target.value })}
                placeholder="Your home city"
              />
              <Input
                label="State"
                value={artistProfile.state || ''}
                onChange={(e) => updateArtistProfile({ state: e.target.value })}
                placeholder="State/Province"
              />
            </div>

            {/* Formation Year */}
            <Input
              label="Formation Year"
              type="number"
              value={artistProfile.formationYear?.toString() || ''}
              onChange={(e) => updateArtistProfile({ formationYear: parseInt(e.target.value) || 0 })}
              placeholder="Year your band was formed"
              min="1900"
              max={new Date().getFullYear()}
            />
          </>
        ) : (
          <>
            {/* Host Venue Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Venue Description
              </label>
              <textarea
                value={hostProfile.venueDescription || ''}
                onChange={(e) => updateHostProfile({ venueDescription: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                placeholder="Describe your venue - the space, atmosphere, what makes it special..."
              />
              <p className="text-xs text-neutral-500 mt-1">
                Help artists understand what makes your venue unique
              </p>
            </div>

            {/* Host Address */}
            <Input
              label="Street Address"
              value={hostProfile.address || ''}
              onChange={(e) => updateHostProfile({ address: e.target.value })}
              placeholder="Your venue address"
            />

            {/* Host Location */}
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="City"
                value={hostProfile.city || ''}
                onChange={(e) => updateHostProfile({ city: e.target.value })}
                placeholder="City"
              />
              <Input
                label="State"
                value={hostProfile.state || ''}
                onChange={(e) => updateHostProfile({ state: e.target.value })}
                placeholder="State"
              />
              <Input
                label="ZIP Code"
                value={hostProfile.zip || ''}
                onChange={(e) => updateHostProfile({ zip: e.target.value })}
                placeholder="ZIP"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}