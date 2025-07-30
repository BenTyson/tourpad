'use client';
import BasicInformationCard from './info/BasicInformationCard';
import FormationYearField from './info/FormationYearField';
import SocialLinksCard from './info/SocialLinksCard';
import TourLogisticsCard from './info/TourLogisticsCard';
import HostVenueDetailsCard from './info/HostVenueDetailsCard';
import ArtistMusicalDetailsCard from './info/ArtistMusicalDetailsCard';
import ThumbnailPhotoCard from './info/ThumbnailPhotoCard';
import HeroPhotoCard from './info/HeroPhotoCard';
import BandMembersCard from './info/BandMembersCard';
import HostPersonalInfoCard from './info/HostPersonalInfoCard';
import HostMusicalPreferencesCard from './info/HostMusicalPreferencesCard';
import { ProfileComponentProps } from './types';

export default function InfoTab({ 
  isArtist, 
  artistProfile, 
  hostProfile, 
  updateArtistProfile, 
  updateHostProfile,
  hasChanges,
  loading 
}: ProfileComponentProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <BasicInformationCard
        isArtist={isArtist}
        artistProfile={artistProfile}
        hostProfile={hostProfile}
        updateArtistProfile={updateArtistProfile}
        updateHostProfile={updateHostProfile}
      />
      
      {/* Social Links */}
      <SocialLinksCard
        isArtist={isArtist}
        artistProfile={artistProfile}
        hostProfile={hostProfile}
        updateArtistProfile={updateArtistProfile}
        updateHostProfile={updateHostProfile}
      />
      
      {isArtist ? (
        <>
          {/* Formation Year - Artist Only */}
          <FormationYearField
            artistProfile={artistProfile}
            updateArtistProfile={updateArtistProfile}
          />
          
          {/* Musical Details - Artist Only */}
          <ArtistMusicalDetailsCard
            artistProfile={artistProfile}
            updateArtistProfile={updateArtistProfile}
          />
          
          {/* Thumbnail Photo - Artist Only */}
          <ThumbnailPhotoCard
            artistProfile={artistProfile}
            updateArtistProfile={updateArtistProfile}
          />
          
          {/* Hero Photo - Artist Only */}
          <HeroPhotoCard
            artistProfile={artistProfile}
            updateArtistProfile={updateArtistProfile}
          />
          
          {/* Band Members - Artist Only */}
          <BandMembersCard
            artistProfile={artistProfile}
            updateArtistProfile={updateArtistProfile}
          />
          
          {/* Tour Logistics - Artist Only */}
          <TourLogisticsCard
            artistProfile={artistProfile}
            updateArtistProfile={updateArtistProfile}
          />
        </>
      ) : (
        <>
          {/* Host Venue Details - Host Only */}
          <HostVenueDetailsCard
            hostProfile={hostProfile}
            updateHostProfile={updateHostProfile}
          />
          
          {/* Host Personal Info - Host Only */}
          <HostPersonalInfoCard
            hostProfile={hostProfile}
            updateHostProfile={updateHostProfile}
          />
          
          {/* Host Musical Preferences - Host Only */}
          <HostMusicalPreferencesCard
            hostProfile={hostProfile}
            updateHostProfile={updateHostProfile}
          />
        </>
      )}
    </div>
  );
}