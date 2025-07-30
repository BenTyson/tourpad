'use client';
import { ArtistProfile } from '../types';

interface FormationYearFieldProps {
  artistProfile: ArtistProfile;
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
}

export default function FormationYearField({
  artistProfile,
  updateArtistProfile
}: FormationYearFieldProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Formation Year</label>
        <select
          value={artistProfile.formationYear}
          onChange={(e) => updateArtistProfile({ formationYear: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {(() => {
            const currentYear = new Date().getFullYear();
            const startYear = 1950;
            const years = [];
            for (let year = currentYear; year >= startYear; year--) {
              years.push(
                <option key={year} value={year}>
                  {year}
                </option>
              );
            }
            return years;
          })()}
        </select>
        <p className="text-xs text-neutral-500 mt-1">
          Years active: {new Date().getFullYear() - artistProfile.formationYear + 1}
        </p>
      </div>
      <div>
        {/* Empty space for grid alignment */}
      </div>
    </div>
  );
}