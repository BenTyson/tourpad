import React from 'react';

interface ArtistBioSectionProps {
  fullBio: string;
}

export function ArtistBioSection({ fullBio }: ArtistBioSectionProps) {
  if (!fullBio) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Full Bio</h2>
        <div className="prose prose-neutral max-w-none">
          <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
            {fullBio}
          </p>
        </div>
      </div>
    </section>
  );
}