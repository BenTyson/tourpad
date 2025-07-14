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
import { ArtistPhotoGallery } from '@/components/media/ArtistPhotoGallery';
import { ArtistPhotoLightbox } from '@/components/media/ArtistPhotoLightbox';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { mockArtists } from '@/data/mockData';

export default function ArtistProfilePage() {
  const params = useParams();
  const artistId = params.id as string;
  
  const artist = mockArtists.find(a => a.id === artistId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Get related artists (similar genre/region)
  const relatedArtists = mockArtists
    .filter(a => a.id !== artistId && a.approved)
    .slice(0, 3);

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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-secondary-50">
      {/* Enhanced Navigation Bar with backdrop blur */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/artists">
              <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to artists
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-primary-50 hover:text-primary-700"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                      <span className="w-4 h-4 mr-3">📋</span>
                      Copy Link
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                      <span className="w-4 h-4 mr-3">📧</span>
                      Email
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                      <span className="w-4 h-4 mr-3">🐦</span>
                      Twitter
                    </button>
                  </div>
                )}
              </div>
              <Button 
                variant={isFollowing ? "primary" : "outline"} 
                size="sm" 
                className={isFollowing ? "bg-primary-600 hover:bg-primary-700" : "hover:bg-primary-50 hover:text-primary-700 hover:border-primary-400"}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                <HeartIcon className="w-4 h-4 mr-2" />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Enhanced Design */}
      <section className="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {artist.approved ? 'Verified Artist' : 'Pending'}
                </Badge>
                <Badge variant="secondary" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {artist.location}
                </Badge>
              </div>
              
              <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
                {artist.name}
              </h1>
              
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                {artist.bio}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <StarIcon className="w-5 h-5 mr-2 text-yellow-400" />
                  <span className="font-semibold">{artist.rating}</span>
                  <span className="ml-1 text-white/70">({artist.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  <span>{artist.members.length} member{artist.members.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <MusicalNoteIcon className="w-5 h-5 mr-2" />
                  <span className="capitalize">{getGenre()}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href={`/bookings/new?artistId=${artist.id}`}>
                  <Button size="lg" className="bg-white text-primary-700 hover:bg-neutral-100 shadow-lg">
                    Request Booking
                  </Button>
                </Link>
                <Link href={`/messages?artistId=${artist.id}`}>
                  <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                    Send Message
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Featured Video Placeholder */}
            {allPhotos.length > 0 && (
              <div className="lg:pl-8">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-2xl blur opacity-30"></div>
                  <div className="relative rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <MusicalNoteIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-primary-800">Performance Video</p>
                      <p className="text-sm text-primary-600">Coming Soon</p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center text-white/80 text-sm">
                  Watch {artist.name} perform live
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Additional Videos Section - Placeholder */}
        {false && (
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">More Performances</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Video placeholder content */}
              </div>
            </div>
          </section>
        )}

        {/* Performance Photos Section */}
        {allPhotos.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Performance Gallery
                  </h2>
                  <p className="text-neutral-600">{allPhotos.length} professional photos</p>
                </div>
                <Badge variant="default" className="bg-secondary-100 text-secondary-800">
                  {allPhotos.length} Photos
                </Badge>
              </div>
              <ArtistPhotoGallery 
                photos={allPhotos}
                onPhotoClick={handlePhotoClick}
              />
            </div>
          </section>
        )}

        {/* Band Members Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  {artist.members.length === 1 ? 'Solo Artist' : 'Meet the Band'}
                </h2>
                <p className="text-neutral-600">
                  {artist.members.length === 1 ? 'Individual performer' : `${artist.members.length} talented musicians`}
                </p>
              </div>
              <Badge variant="default" className="bg-primary-100 text-primary-800">
                {artist.members.length} {artist.members.length === 1 ? 'Member' : 'Members'}
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {artist.members.map((member, index) => (
                <div key={index} className="group flex items-center p-6 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200 hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MusicalNoteIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 text-lg">{member.name}</div>
                    <div className="text-sm text-neutral-600 font-medium">{member.instrument}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tour & Logistics Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Tour & Logistics
                </h2>
                <p className="text-neutral-600">Everything you need to know about hosting this artist</p>
              </div>
              <Badge variant="default" className="bg-secondary-100 text-secondary-800">
                Tour Info
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <ClockIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Tour Schedule</div>
                    <div className="text-sm text-neutral-600">Annual touring</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-primary-700">{artist.tourMonthsPerYear} months/year</div>
                <div className="text-sm text-neutral-600 mt-1">Active on the road</div>
              </div>
              
              <div className="group bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <TruckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Transport</div>
                    <div className="text-sm text-neutral-600">Travel method</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-secondary-700">{artist.transportType}</div>
                <div className="text-sm text-neutral-600 mt-1">Professional setup</div>
              </div>
              
              <div className="group bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-neutral-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <GlobeAltIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Tour Radius</div>
                    <div className="text-sm text-neutral-600">From home base</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-neutral-700">{artist.willingToTravel} miles</div>
                <div className="text-sm text-neutral-600 mt-1">Touring range</div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Requirements */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Technical Requirements</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                  Equipment Provided by Artist
                </h3>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    All instruments and personal gear
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Professional sound equipment
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Microphones and stands
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Basic lighting setup if needed
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
                  Venue Requirements
                </h3>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Performance space: Min 12x10 feet
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Power outlets: 2-3 standard outlets
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Seating for audience
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Parking space for {artist.transportType === 'Van' ? 'van' : 'vehicle'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related Artists */}
        {relatedArtists.length > 0 && (
          <section className="bg-gradient-to-br from-neutral-50 to-secondary-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Similar Artists</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArtists.map(relatedArtist => (
                <Link key={relatedArtist.id} href={`/artists/${relatedArtist.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <MusicalNoteIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                            {relatedArtist.name}
                          </h3>
                          <p className="text-sm text-neutral-600">{relatedArtist.location}</p>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-700 line-clamp-2">{relatedArtist.bio}</p>
                      <div className="flex items-center mt-4 text-sm text-neutral-600">
                        <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{relatedArtist.rating}</span>
                        <span className="mx-2">•</span>
                        <span>{relatedArtist.members.length} member{relatedArtist.members.length > 1 ? 's' : ''}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      <ArtistPhotoLightbox
        photos={allPhotos}
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}