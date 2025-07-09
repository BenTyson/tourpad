'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPinIcon,
  StarIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HomeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PhotoGallery } from '@/components/media/PhotoGallery';
import { PhotoLightbox } from '@/components/media/PhotoLightbox';
import { mockHosts } from '@/data/mockData';

export default function HostProfilePage() {
  const params = useParams();
  const hostId = params.id as string;
  
  const host = mockHosts.find(h => h.id === hostId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!host) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Host Not Found</h1>
          <Link href="/hosts">
            <Button>Back to Hosts</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Combine all photos for gallery
  const allPhotos = [...host.housePhotos, ...host.performanceSpacePhotos];

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
            <Link href="/hosts">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to search
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <HeartIcon className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {host.name}
          </h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 text-yellow-500 fill-current mr-1" />
              <span className="font-medium">{host.rating.toFixed(1)}</span>
              <span className="mx-1">·</span>
              <span className="underline">{host.reviewCount} reviews</span>
            </div>
            <span>·</span>
            <div className="flex items-center">
              <MapPinIcon className="w-5 h-5 mr-1" />
              <span>{host.city}, {host.state}</span>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-12">
          <PhotoGallery 
            photos={allPhotos}
            onPhotoClick={handlePhotoClick}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Summary */}
            <div className="pb-8 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Venue hosted by {host.name.split(' ')[0]}
                  </h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span>{host.showSpecs.avgAttendance} typical guests</span>
                    <span>·</span>
                    <span>${host.showSpecs.avgDoorFee} suggested door fee</span>
                    <span>·</span>
                    <span>{host.showSpecs.hostingHistory} hosting</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {host.name.charAt(0)}
                </div>
              </div>
            </div>

            {/* About This Space */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                About this space
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {host.bio}
              </p>
            </div>

            {/* What This Place Offers */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                What this place offers
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries({
                  powerAccess: 'Power access for equipment',
                  airConditioning: 'Air conditioning',
                  wifi: 'Wifi',
                  kidFriendly: 'Kid friendly',
                  parking: 'Free parking on premises',
                  petFriendly: 'Pets allowed',
                  soundSystem: 'Sound system provided',
                  outdoorSpace: 'Private patio or balcony',
                  accessible: 'Step-free access',
                  bnbOffered: 'Overnight accommodation'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center py-2">
                    {host.amenities[key as keyof typeof host.amenities] ? (
                      <CheckCircleIcon className="w-6 h-6 text-gray-900 mr-4" />
                    ) : (
                      <div className="w-6 h-6 mr-4"></div>
                    )}
                    <span className={`text-gray-700 ${
                      !host.amenities[key as keyof typeof host.amenities] ? 'line-through opacity-50' : ''
                    }`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Show Details */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Show details
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <UserGroupIcon className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Capacity</div>
                      <div className="text-gray-600">
                        Up to {host.showSpecs.indoorAttendanceMax} guests indoors
                        {host.showSpecs.outdoorAttendanceMax > 0 && (
                          <span>, {host.showSpecs.outdoorAttendanceMax} outdoors</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ClockIcon className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Show length</div>
                      <div className="text-gray-600">{host.showSpecs.showDurationMins} minutes typically</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CurrencyDollarIcon className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Door fee</div>
                      <div className="text-gray-600">${host.showSpecs.avgDoorFee} suggested (goes to artist)</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <HomeIcon className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Venue type</div>
                      <div className="text-gray-600 capitalize">{host.showSpecs.performanceLocation} space</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CalendarIcon className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Availability</div>
                      <div className="text-gray-600">
                        {host.showSpecs.daysAvailable.join(', ')} evenings
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-6 h-6 text-gray-400 mr-4 mt-1">🎵</div>
                    <div>
                      <div className="font-medium text-gray-900">Show format</div>
                      <div className="text-gray-600">{host.showSpecs.showFormat}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Space Photos */}
            {host.performanceSpacePhotos.length > 0 && (
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Performance space
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {host.performanceSpacePhotos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => handlePhotoClick(host.housePhotos.length + index)}
                      className="aspect-[4/3] overflow-hidden rounded-lg hover:scale-105 transition-transform"
                    >
                      <img
                        src={photo.url}
                        alt={photo.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
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
                        ${host.showSpecs.avgDoorFee}
                      </div>
                      <div className="text-gray-600">suggested door fee</div>
                    </div>
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium">{host.rating.toFixed(1)}</span>
                      <span className="text-gray-600 ml-1">({host.reviewCount})</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-gray-300 rounded-lg p-3">
                        <div className="text-xs font-medium text-gray-600 uppercase">Check-in</div>
                        <div className="text-sm text-gray-900">Add dates</div>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-3">
                        <div className="text-xs font-medium text-gray-600 uppercase">Guests</div>
                        <div className="text-sm text-gray-900">{host.showSpecs.avgAttendance}</div>
                      </div>
                    </div>
                  </div>

                  <Link href={`/bookings/new?hostId=${host.id}`}>
                    <Button size="lg" className="w-full mb-4">
                      Request to book
                    </Button>
                  </Link>

                  <div className="text-center text-sm text-gray-600 mb-4">
                    You won't be charged yet
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response rate</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response time</span>
                      <span className="font-medium">Within an hour</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Host */}
              <Card className="mt-6">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                    {host.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hosted by {host.name.split(' ')[0]}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {host.showSpecs.hostingHistory} hosting · {host.reviewCount} reviews
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact host
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