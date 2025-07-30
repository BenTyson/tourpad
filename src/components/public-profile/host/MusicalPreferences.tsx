'use client';
import { Music, Users, Heart, ThumbsDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { HostData } from '../types';

interface MusicalPreferencesProps {
  host: HostData;
}

export default function MusicalPreferences({ host }: MusicalPreferencesProps) {
  // Add null check
  if (!host) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        {/* Simple Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Musical Preferences</h2>
          <p className="text-neutral-600">Find out what kind of artists perform best at this venue</p>
        </div>
        
        <div className="space-y-8">
          {/* Preferred Genres */}
          {host.preferredGenres && host.preferredGenres.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Preferred Genres</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {host.preferredGenres.map((genre, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-primary-50 text-primary-700 border-primary-200 px-4 py-2"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Preferred Act Size */}
          {host.preferredActSize && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Preferred Act Size</h3>
              </div>
              <p className="text-neutral-700">
                <span className="font-medium">{host.preferredActSize}</span>
                {host.preferredActSize === 'Solo' && ' - Perfect for intimate acoustic performances'}
                {host.preferredActSize === 'Duo' && ' - Great for harmonies and collaborative sets'}
                {host.preferredActSize === 'Trio' && ' - Ideal for small ensemble performances'}
                {host.preferredActSize === 'Full Band' && ' - Space for complete band setups'}
                {host.preferredActSize === "Doesn't Matter" && ' - All act sizes welcome'}
              </p>
            </div>
          )}
          
          {/* What We Enjoy */}
          {host.whatWeEnjoy && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">What We Enjoy</h3>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                {host.whatWeEnjoy}
              </p>
            </div>
          )}
          
          {/* Music We Aren't Into */}
          {host.musicWeArentInto && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsDown className="w-5 h-5 text-neutral-500" />
                <h3 className="text-lg font-semibold text-neutral-900">Not Our Style</h3>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                {host.musicWeArentInto}
              </p>
            </div>
          )}
          
          {/* Content Rating */}
          {host.contentRating && (
            <div className="pt-6 border-t border-neutral-200">
              <Badge 
                variant="default" 
                className={
                  host.contentRating === 'Kid Friendly' 
                    ? 'bg-green-100 text-green-800' 
                    : host.contentRating === 'Explicit' 
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-neutral-100 text-neutral-800'
                }
              >
                Content: {host.contentRating}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}