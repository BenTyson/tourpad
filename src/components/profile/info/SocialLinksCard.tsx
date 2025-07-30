'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArtistProfile, HostProfile } from '../types';

interface SocialLinksCardProps {
  isArtist: boolean;
  artistProfile: ArtistProfile;
  hostProfile: HostProfile;
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
  updateHostProfile: (updates: Partial<HostProfile>) => void;
}

export default function SocialLinksCard({
  isArtist,
  artistProfile,
  hostProfile,
  updateArtistProfile,
  updateHostProfile
}: SocialLinksCardProps) {
  const defaultSocialLinks = {
    instagram: '',
    youtube: '',
    spotify: '',
    bandcamp: '',
    facebook: '',
    website: ''
  };

  const updateSocialLink = (field: string, value: string) => {
    const currentSocialLinks = isArtist ? artistProfile.socialLinks : hostProfile.socialLinks;
    const updatedSocialLinks = {
      ...defaultSocialLinks,
      ...currentSocialLinks,
      [field]: value
    };

    if (isArtist) {
      updateArtistProfile({ 
        socialLinks: updatedSocialLinks
      });
    } else {
      updateHostProfile({ 
        socialLinks: updatedSocialLinks
      });
    }
  };

  const currentSocialLinks = isArtist ? artistProfile.socialLinks : hostProfile.socialLinks;

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">Social Links & Website</h2>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Website"
            value={currentSocialLinks.website}
            onChange={(e) => updateSocialLink('website', e.target.value)}
            placeholder="https://yourwebsite.com"
          />
          <Input
            label="Instagram"
            value={currentSocialLinks.instagram}
            onChange={(e) => updateSocialLink('instagram', e.target.value)}
            placeholder="https://instagram.com/username"
          />
          <Input
            label="YouTube"
            value={currentSocialLinks.youtube}
            onChange={(e) => updateSocialLink('youtube', e.target.value)}
            placeholder="https://youtube.com/channel/..."
          />
          <Input
            label="Facebook"
            value={currentSocialLinks.facebook}
            onChange={(e) => updateSocialLink('facebook', e.target.value)}
            placeholder="https://facebook.com/page"
          />
          {isArtist && (
            <>
              <Input
                label="Spotify"
                value={currentSocialLinks.spotify}
                onChange={(e) => updateSocialLink('spotify', e.target.value)}
                placeholder="https://open.spotify.com/artist/..."
              />
              <Input
                label="Bandcamp"
                value={currentSocialLinks.bandcamp}
                onChange={(e) => updateSocialLink('bandcamp', e.target.value)}
                placeholder="https://artist.bandcamp.com"
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}