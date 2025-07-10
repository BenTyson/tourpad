'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  TruckIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PhotoGallery } from '@/components/media/PhotoGallery';
import { PhotoLightbox } from '@/components/media/PhotoLightbox';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { mockArtists } from '@/data/mockData';

export default function ArtistProfilePage() {
  const params = useParams();
  const artistId = params.id as string;
  
  const artist = mockArtists.find(a => a.id === artistId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!artist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artist Not Found</h1>
          <Link href="/artists">
            <Button>Back to Artists</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Combine all photos for gallery
  const allPhotos = [...(artist.performancePhotos || []), ...(artist.bandPhotos || [])];
  
  const getGenre = () => {
    const genres = ['folk', 'rock', 'indie', 'country', 'blues', 'jazz', 'experimental'];
    const bio = artist.bio.toLowerCase();
    const foundGenre = genres.find(genre => bio.includes(genre));
    return foundGenre || 'music';
  };

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/artists">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to artists
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <HeartIcon className="w-4 h-4 mr-2" />
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {artist.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <Badge variant="default" className="text-sm">
                  {getGenre()}
                </Badge>
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{artist.rating.toFixed(1)}</span>
                  <span className="mx-1">·</span>
                  <span className="underline">{artist.reviewCount} reviews</span>
                </div>
                <span>·</span>
                <span>{artist.yearsActive} years performing</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <UserGroupIcon className="w-4 h-4 mr-1" />
                  <span>{artist.members.length} {artist.members.length === 1 ? 'member' : 'members'}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span>Tours {artist.tourMonthsPerYear} months/year</span>
                </div>
                {artist.requireHomeStay && (
                  <Badge variant="warning">Needs lodging</Badge>
                )}
              </div>
            </div>
            {artist.approved && (
              <div className="bg-green-500 text-white rounded-full p-2">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Video */}
            {artist.livePerformanceVideo && (
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Watch {artist.name} perform
                </h3>
                <VideoPlayer
                  videoUrl={artist.livePerformanceVideo}
                  title={`${artist.name} - Live Performance`}
                  thumbnailUrl={allPhotos[0]?.url}
                />
              </div>
            )}

            {/* Performance Photos */}
            {allPhotos.length > 0 && (
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Performance photos
                </h3>
                <PhotoGallery 
                  photos={allPhotos}
                  onPhotoClick={handlePhotoClick}
                />
              </div>
            )}

            {/* About the Artist */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                About {artist.name}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {artist.bio}
              </p>
              {artist.cancellationGuarantee && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Performance Guarantee</h4>
                  <p className="text-sm text-blue-800">{artist.cancellationGuarantee}</p>
                </div>
              )}
            </div>

            {/* Band Members */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {artist.members.length === 1 ? 'Solo artist' : 'Band members'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {artist.members.map((member, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                      <MusicalNoteIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.instrument}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tour & Logistics */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Tour information
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <ClockIcon className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Tour schedule</div>
                      <div className="text-gray-600">{artist.tourMonthsPerYear} months per year on the road</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <TruckIcon className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Tour setup</div>
                      <div className="text-gray-600 capitalize">{artist.tourVehicle}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MusicalNoteIcon className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Sound system</div>
                      <div className="text-gray-600">
                        {artist.ownSoundSystem ? 'Brings own PA system' : 'Needs house sound system'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Requirements & preferences</h4>
                    <div className="space-y-2">
                      {artist.requireHomeStay && (
                        <Badge variant="warning" className="mr-2 mb-2">Requires lodging</Badge>
                      )}
                      {artist.ownSoundSystem && (
                        <Badge variant="success" className="mr-2 mb-2">Has sound system</Badge>
                      )}
                      {artist.travelWithAnimals && (
                        <Badge variant="default" className="mr-2 mb-2">Travels with pets</Badge>
                      )}
                    </div>
                  </div>

                  {(artist.petAllergies || artist.dietaryRestrictions) && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Special notes</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {artist.petAllergies && (
                          <div>Pet allergies: {artist.petAllergies}</div>
                        )}
                        {artist.dietaryRestrictions && (
                          <div>Dietary: {artist.dietaryRestrictions}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            {Object.values(artist.socialLinks).some(link => link) && (
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Listen & follow
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(artist.socialLinks).map(([platform, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                      >
                        <GlobeAltIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="font-medium capitalize text-gray-900">{platform}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-xl border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        Available
                      </div>
                      <div className="text-gray-600">for bookings</div>
                    </div>
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium">{artist.rating.toFixed(1)}</span>
                      <span className="text-gray-600 ml-1">({artist.reviewCount})</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="border border-gray-300 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-600 uppercase">Tour dates</div>
                      <div className="text-sm text-gray-900">Check availability</div>
                    </div>
                  </div>

                  <Link href={`/bookings/new?artistId=${artist.id}`}>
                    <Button size="lg" className="w-full mb-4">
                      Book this artist
                    </Button>
                  </Link>

                  <div className="text-center text-sm text-gray-600 mb-4">
                    Contact for availability and pricing
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cancellation policy</span>
                      <Badge variant={artist.cancellationPolicy === 'flexible' ? 'success' : 'warning'}>
                        {artist.cancellationPolicy}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response time</span>
                      <span className="font-medium">Within 4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shows this year</span>
                      <span className="font-medium">24</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Artist */}
              <Card className="mt-6">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                    {artist.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {artist.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {artist.yearsActive} years performing · {artist.reviewCount} reviews
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact artist
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Lightbox */}
      <PhotoLightbox
        photos={allPhotos}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}