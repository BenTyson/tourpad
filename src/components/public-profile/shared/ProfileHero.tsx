'use client';
import Link from 'next/link';
import { ArrowLeft, Share2, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProfileHeroProps, HostData, ArtistData } from '../types';

export default function ProfileHero({ isArtist, data, onShare, onFavorite }: ProfileHeroProps) {
  // Add null check
  if (!data) {
    return null;
  }

  const isHost = !isArtist;
  const hostData = data as HostData;
  const artistData = data as ArtistData;

  // Artist profile uses full background image
  if (isArtist) {
    // Get hero image from API data structure
    const heroImage = artistData.heroPhotoUrl || 
                      artistData.thumbnailPhotoUrl || 
                      artistData.profileImageUrl ||
                      artistData.photos?.[0]?.fileUrl ||
                      '/images/default-band.jpg';
    
    // Parse location string (format: "City, State")
    const locationParts = artistData.location?.split(', ') || [];
    const city = locationParts[0] || '';
    const state = locationParts[1] || '';
    
    return (
      <section className="relative h-[70vh] min-h-[500px] bg-neutral-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt={`${artistData.name} hero`}
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        {/* Content Overlay */}
        <div className="relative h-full flex items-end">
          <div className="w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent pb-12 pt-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Artist Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-5xl font-bold text-white mb-3">{artistData.name}</h1>
                  <div className="flex items-center gap-6 text-white/80 mb-4">
                    {(city || state) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {city}{city && state && ', '}{state}
                      </span>
                    )}
                    {artistData.genres && artistData.genres.length > 0 && (
                      <span className="flex items-center gap-2">
                        {artistData.genres.slice(0, 3).map((genre, index) => (
                          <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                            {genre}
                          </Badge>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShare}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onFavorite}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Host profile uses clean white header
  return (
    <section className="bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Host Info */}
          <div className="space-y-6">
            {/* Back Button */}
            <Link 
              href="/hosts" 
              className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hosts
            </Link>
            
            {/* Venue Name & Host Name */}
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                {hostData.venueName}
              </h1>
              <p className="text-lg text-neutral-600">
                Hosted by {
                  hostData.hostMembers && hostData.hostMembers.length > 0
                    ? hostData.hostMembers.map(h => h.hostName).join(' & ')
                    : hostData.name
                }
              </p>
            </div>
            
            {/* Location & Stats */}
            <div className="flex items-center flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1 text-neutral-600">
                <MapPin className="w-4 h-4" />
                {hostData.city}, {hostData.state}
              </span>
              <Badge variant="secondary" className="bg-primary-100 text-primary-800">
                {hostData.venueType}
              </Badge>
              {hostData.rating > 0 && (
                <span className="text-neutral-600">
                  ⭐ {hostData.rating} ({hostData.reviewCount} reviews)
                </span>
              )}
            </div>
            
            {/* Bio */}
            <p className="text-neutral-700 leading-relaxed">
              {hostData.bio}
            </p>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button className="flex-1 sm:flex-initial">
                Request to Book
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onFavorite}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Right Column - Hero Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
            <img 
              src={
                hostData.performanceSpacePhotos?.[0]?.url || 
                hostData.housePhotos?.[0]?.url || 
                '/images/default-venue.jpg'
              } 
              alt={`${hostData.venueName} venue`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}