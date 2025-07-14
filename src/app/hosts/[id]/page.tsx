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
  HeartIcon,
  PhoneIcon,
  WiFiIcon,
  TruckIcon,
  SparklesIcon,
  SunIcon,
  WifiIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
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
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

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
      {/* Enhanced Navigation Bar with backdrop blur */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/hosts">
              <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to hosts
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

      {/* Hero Section - Clean White Design */}
      <section className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  Verified Host
                </Badge>
                <Badge variant="secondary" className="bg-neutral-100 text-neutral-700 border-neutral-200">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {host.city}, {host.state}
                </Badge>
              </div>
              
              <h1 className="text-5xl font-bold mb-4 text-neutral-900">
                {host.name}
              </h1>
              
              <p className="text-xl mb-8 text-neutral-600 leading-relaxed">
                {host.bio}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-neutral-50 rounded-lg px-4 py-2 border border-neutral-200">
                  <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  <span className="font-semibold text-neutral-900">{host.rating}</span>
                  <span className="ml-1 text-neutral-600">({host.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center bg-neutral-50 rounded-lg px-4 py-2 border border-neutral-200">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-neutral-600" />
                  <span className="text-neutral-900">Up to {host.showSpecs.indoorAttendanceMax} guests</span>
                </div>
                <div className="flex items-center bg-neutral-50 rounded-lg px-4 py-2 border border-neutral-200">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 text-neutral-600" />
                  <span className="text-neutral-900">${host.showSpecs.avgDoorFee} suggested door</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href={`/bookings/new?hostId=${host.id}`}>
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg">
                    Request Booking
                  </Button>
                </Link>
                <Link href={`/messages?hostId=${host.id}`}>
                  <Button size="lg" variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                    Send Message
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Featured Photos */}
            <div className="lg:pl-8">
              <div className="grid grid-cols-2 gap-4">
                {allPhotos.slice(0, 4).map((photo, index) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow group"
                    onClick={() => handlePhotoClick(index)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              {allPhotos.length > 4 && (
                <button 
                  onClick={() => handlePhotoClick(0)}
                  className="mt-4 text-center w-full text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all {allPhotos.length} photos
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Venue Details & Capacity */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Venue Details
                </h2>
                <p className="text-neutral-600">Everything you need to know about performing here</p>
              </div>
              <Badge variant="default" className="bg-primary-100 text-primary-800">
                {host.venueType}
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <UserGroupIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Capacity</div>
                    <div className="text-sm text-neutral-600">Typical attendance</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-primary-700">{host.showSpecs.avgAttendance} guests</div>
                <div className="text-sm text-neutral-600 mt-1">Max {host.showSpecs.indoorAttendanceMax} indoors</div>
              </div>
              
              <div className="group bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <ClockIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Show Length</div>
                    <div className="text-sm text-neutral-600">Typical duration</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-secondary-700">{host.showSpecs.showDurationMins} minutes</div>
                <div className="text-sm text-neutral-600 mt-1">{host.showSpecs.showFormat}</div>
              </div>
              
              <div className="group bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-neutral-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Availability</div>
                    <div className="text-sm text-neutral-600">Preferred days</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-neutral-700">{host.showSpecs.daysAvailable.join(', ')}</div>
                <div className="text-sm text-neutral-600 mt-1">{host.showSpecs.estimatedShowsPerYear} shows/year</div>
              </div>
            </div>
          </div>
        </section>

        {/* Amenities & Features */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">What This Venue Offers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries({
                powerAccess: { label: 'Power access for equipment', icon: '🔌' },
                airConditioning: { label: 'Air conditioning', icon: '❄️' },
                wifi: { label: 'WiFi available', icon: '📶' },
                kidFriendly: { label: 'Kid friendly environment', icon: '👶' },
                parking: { label: 'Free parking on premises', icon: '🚗' },
                petFriendly: { label: 'Pets allowed', icon: '🐕' },
                soundSystem: { label: 'Sound system provided', icon: '🔊' },
                outdoorSpace: { label: 'Private outdoor space', icon: '🌿' },
                accessible: { label: 'Step-free access', icon: '♿' },
                bnbOffered: { label: 'Overnight accommodation', icon: '🛏️' }
              }).map(([key, {label, icon}]) => (
                <div key={key} className={`flex items-center p-4 rounded-lg border ${
                  host.amenities[key as keyof typeof host.amenities] 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className="text-2xl mr-3">{icon}</span>
                  <div className="flex-1">
                    <span className={`font-medium ${
                      host.amenities[key as keyof typeof host.amenities] 
                        ? 'text-green-900' 
                        : 'text-gray-500 line-through'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {host.amenities[key as keyof typeof host.amenities] && (
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Venue Gallery
                </h2>
                <p className="text-neutral-600">{allPhotos.length} professional photos</p>
              </div>
              <Badge variant="default" className="bg-secondary-100 text-secondary-800">
                {allPhotos.length} Photos
              </Badge>
            </div>
            <PhotoGallery 
              photos={allPhotos}
              onPhotoClick={handlePhotoClick}
            />
          </div>
        </section>

        {/* Host Profile */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Meet Your Host
                </h2>
                <p className="text-neutral-600">Hosted by {host.hostInfo?.hostName || host.name}</p>
              </div>
              <Badge variant="default" className="bg-primary-100 text-primary-800">
                {host.showSpecs.hostingHistory} Experience
              </Badge>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                {host.hostInfo?.profilePhoto ? (
                  <img 
                    src={host.hostInfo.profilePhoto} 
                    alt={`${host.hostInfo.hostName || host.name} profile photo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl">
                    {host.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{host.hostInfo?.hostName || host.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
                  <span>{host.showSpecs.hostingHistory} hosting experience</span>
                  <span>•</span>
                  <span>{host.reviewCount} reviews</span>
                  <span>•</span>
                  <span>{host.rating} ⭐ average rating</span>
                </div>
                <p className="text-neutral-700 leading-relaxed">
                  {host.hostInfo?.aboutMe || 'Passionate about bringing live music into intimate settings. I love creating memorable experiences where artists and audiences can connect in a personal, meaningful way.'}
                </p>
                <div className="mt-4 flex space-x-3">
                  <Button variant="outline" size="sm">
                    Contact Host
                  </Button>
                  <Button variant="outline" size="sm">
                    View Reviews
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Information */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Ready to Book?</h2>
            <p className="text-neutral-600">Get in touch to check availability and discuss your show</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-neutral-900 mb-4">Show Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Suggested door fee:</span>
                  <span className="font-medium">${host.showSpecs.avgDoorFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Typical audience:</span>
                  <span className="font-medium">{host.showSpecs.avgAttendance} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Response rate:</span>
                  <span className="font-medium">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Response time:</span>
                  <span className="font-medium">Within 24 hours</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-neutral-900 mb-4">Next Steps</h3>
              <div className="space-y-3 text-sm text-neutral-700">
                <div className="flex items-start">
                  <span className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <span>Send a booking request with your preferred dates</span>
                </div>
                <div className="flex items-start">
                  <span className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <span>Host reviews your request and responds</span>
                </div>
                <div className="flex items-start">
                  <span className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <span>Coordinate show details and logistics</span>
                </div>
              </div>
              <div className="mt-6">
                <Link href={`/bookings/new?hostId=${host.id}`}>
                  <Button className="w-full">Send Booking Request</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
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