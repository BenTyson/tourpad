'use client';
import { Volume2, Mic, Music, Guitar, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { SoundSystem } from '../types';

interface SoundSystemProps {
  soundSystem?: SoundSystem;
}

export default function SoundSystemComponent({ soundSystem }: SoundSystemProps) {
  if (!soundSystem?.available) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Sound System</h2>
            <p className="text-neutral-600">Professional audio equipment available for performances</p>
          </div>
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Volume2 className="w-4 h-4 mr-1" />
            Available
          </Badge>
        </div>

        {/* Description */}
        {soundSystem.description && (
          <div className="mb-8">
            <p className="text-neutral-700 leading-relaxed">{soundSystem.description}</p>
          </div>
        )}

        {/* Equipment Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Speakers */}
          {soundSystem.equipment?.speakers && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Speakers</h3>
              </div>
              <p className="text-neutral-700 bg-neutral-50 p-4 rounded-lg">
                {soundSystem.equipment.speakers}
              </p>
            </div>
          )}

          {/* Microphones */}
          {soundSystem.equipment?.microphones && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mic className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Microphones</h3>
              </div>
              <p className="text-neutral-700 bg-neutral-50 p-4 rounded-lg">
                {soundSystem.equipment.microphones}
              </p>
            </div>
          )}

          {/* Instruments */}
          {soundSystem.equipment?.instruments && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Guitar className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Available Instruments</h3>
              </div>
              <p className="text-neutral-700 bg-neutral-50 p-4 rounded-lg">
                {soundSystem.equipment.instruments}
              </p>
            </div>
          )}

          {/* Additional Equipment */}
          {soundSystem.equipment?.additional && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Additional Equipment</h3>
              </div>
              <p className="text-neutral-700 bg-neutral-50 p-4 rounded-lg">
                {soundSystem.equipment.additional}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}