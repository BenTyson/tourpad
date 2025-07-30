'use client';
import BasicInformationCard from './info/BasicInformationCard';
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
      
      {/* TODO: Add remaining sub-components */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 text-sm">
          BasicInformationCard component integrated successfully! Next: Add remaining sub-components.
        </p>
      </div>
    </div>
  );
}