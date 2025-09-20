'use client';
import { Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface HostProfile {
  soundSystem: {
    available: boolean;
    description: string;
    equipment: {
      speakers: string;
      microphones: string;
      instruments: string;
      additional: string;
    };
  };
}

interface SoundSystemTabProps {
  hostProfile: HostProfile;
  updateHostProfile: (updates: Partial<HostProfile>) => void;
}

export function SoundSystemTab({ hostProfile, updateHostProfile }: SoundSystemTabProps) {
  return (
    <div className="space-y-6">
      {/* Sound System Availability */}
      <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <CardHeader>
          <div className="flex items-center">
            <Volume2 className="w-5 h-5 text-neutral-600 mr-3" />
            <h2 className="text-xl font-semibold text-neutral-900">Sound System Availability</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="soundSystemAvailable"
                  checked={hostProfile.soundSystem.available}
                  onChange={() => updateHostProfile({
                    soundSystem: { ...hostProfile.soundSystem, available: true }
                  })}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm font-medium text-neutral-900">
                  Yes, I have a sound system available for artists
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="soundSystemAvailable"
                  checked={!hostProfile.soundSystem.available}
                  onChange={() => updateHostProfile({
                    soundSystem: { ...hostProfile.soundSystem, available: false }
                  })}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm font-medium text-neutral-900">
                  No, artists should bring their own sound equipment
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sound System Details - Only show if available */}
      {hostProfile.soundSystem.available && (
        <>
          {/* System Description */}
          <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-900">System Description</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="soundSystemDescription" className="block text-sm font-medium text-neutral-700 mb-2">
                    General Description *
                  </label>
                  <textarea
                    id="soundSystemDescription"
                    rows={3}
                    placeholder="Describe your sound system setup, its quality, and what makes it special..."
                    value={hostProfile.soundSystem.description}
                    onChange={(e) => updateHostProfile({
                      soundSystem: { ...hostProfile.soundSystem, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Details */}
          <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-900">Equipment Details</h2>
              <p className="text-sm text-neutral-600 mt-1">Knowing what specific equipment you have is very helpful for the artists.</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="speakers" className="block text-sm font-medium text-neutral-700 mb-2">
                    Speakers
                  </label>
                  <textarea
                    id="speakers"
                    rows={3}
                    placeholder="e.g., JBL EON615, Yamaha HS8 monitors..."
                    value={hostProfile.soundSystem.equipment.speakers}
                    onChange={(e) => updateHostProfile({
                      soundSystem: {
                        ...hostProfile.soundSystem,
                        equipment: { ...hostProfile.soundSystem.equipment, speakers: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="microphones" className="block text-sm font-medium text-neutral-700 mb-2">
                    Microphones
                  </label>
                  <textarea
                    id="microphones"
                    rows={3}
                    placeholder="e.g., Shure SM58, Audio-Technica AT2020..."
                    value={hostProfile.soundSystem.equipment.microphones}
                    onChange={(e) => updateHostProfile({
                      soundSystem: {
                        ...hostProfile.soundSystem,
                        equipment: { ...hostProfile.soundSystem.equipment, microphones: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="instruments" className="block text-sm font-medium text-neutral-700 mb-2">
                    Available Instruments
                  </label>
                  <textarea
                    id="instruments"
                    rows={3}
                    placeholder="e.g., Piano, keyboard, guitar amp..."
                    value={hostProfile.soundSystem.equipment.instruments}
                    onChange={(e) => updateHostProfile({
                      soundSystem: {
                        ...hostProfile.soundSystem,
                        equipment: { ...hostProfile.soundSystem.equipment, instruments: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="additional" className="block text-sm font-medium text-neutral-700 mb-2">
                    Additional Equipment
                  </label>
                  <textarea
                    id="additional"
                    rows={3}
                    placeholder="e.g., Cables, stands, lighting..."
                    value={hostProfile.soundSystem.equipment.additional}
                    onChange={(e) => updateHostProfile({
                      soundSystem: {
                        ...hostProfile.soundSystem,
                        equipment: { ...hostProfile.soundSystem.equipment, additional: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}