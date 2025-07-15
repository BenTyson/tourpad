'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin,
  Star,
  Users,
  Calendar,
  Clock,
  DollarSign,
  Home,
  CheckCircle,
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  Wifi,
  Truck,
  Sparkles,
  Sun,
  Shield,
  Zap,
  Snowflake,
  Signal,
  Baby,
  Car,
  Dog,
  Volume2,
  Trees,
  Accessibility,
  Bed,
  Copy,
  Mail,
  Twitter,
  Coffee
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PhotoGallery } from '@/components/media/PhotoGallery';
import { PhotoLightbox } from '@/components/media/PhotoLightbox';
import { PublicReviewsSection } from '@/components/reviews/PublicReviewsSection';
import { mockHosts } from '@/data/mockData';
import { testHosts } from '@/data/realTestData';

export default function HostProfilePage() {
  const params = useParams();
  const hostId = params.id as string;
  
  const host = testHosts.find(h => h.id === hostId) || mockHosts.find(h => h.id === hostId);
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
                <ArrowLeft className="w-4 h-4 mr-2" />
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
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                      <Copy className="w-4 h-4 mr-3" />
                      Copy Link
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                      <Mail className="w-4 h-4 mr-3" />
                      Email
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                      <Twitter className="w-4 h-4 mr-3" />
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
                <Heart className="w-4 h-4 mr-2" />
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
                  <MapPin className="w-4 h-4 mr-1" />
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
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  <span className="font-semibold text-neutral-900">{host.rating}</span>
                  <span className="ml-1 text-neutral-600">({host.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center bg-neutral-50 rounded-lg px-4 py-2 border border-neutral-200">
                  <Users className="w-5 h-5 mr-2 text-neutral-600" />
                  <span className="text-neutral-900">Up to {host.showSpecs.indoorAttendanceMax} guests</span>
                </div>
                <div className="flex items-center bg-neutral-50 rounded-lg px-4 py-2 border border-neutral-200">
                  <DollarSign className="w-5 h-5 mr-2 text-neutral-600" />
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
                    <Users className="w-6 h-6 text-white" />
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
                    <Clock className="w-6 h-6 text-white" />
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
                    <Calendar className="w-6 h-6 text-white" />
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
                powerAccess: { label: 'Power access for equipment', icon: Zap },
                airConditioning: { label: 'Air conditioning', icon: Snowflake },
                wifi: { label: 'WiFi available', icon: Wifi },
                kidFriendly: { label: 'Kid friendly environment', icon: Baby },
                parking: { label: 'Free parking on premises', icon: Car },
                petFriendly: { label: 'Pets allowed', icon: Dog },
                soundSystem: { label: 'Sound system provided', icon: Volume2 },
                outdoorSpace: { label: 'Private outdoor space', icon: Trees },
                accessible: { label: 'Step-free access', icon: Accessibility },
                bnbOffered: { label: 'Overnight accommodation', icon: Bed }
              }).map(([key, {label, icon: IconComponent}]) => (
                <div key={key} className={`flex items-center p-4 rounded-lg border ${
                  host.amenities[key as keyof typeof host.amenities] 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <IconComponent className={`w-5 h-5 mr-3 ${
                    host.amenities[key as keyof typeof host.amenities] 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`} />
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
                    <CheckCircle className="w-5 h-5 text-green-600" />
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

        {/* Sound System Information */}
        {host.soundSystem?.available && (
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Sound System
                  </h2>
                  <p className="text-neutral-600">Professional audio equipment available</p>
                </div>
                <Badge variant="success" className="bg-green-100 text-green-800">
                  Available
                </Badge>
              </div>
              
              <div className="mb-6">
                <p className="text-neutral-700 leading-relaxed">
                  {host.soundSystem.description}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                        <Volume2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">Speakers</div>
                        <div className="text-sm text-neutral-600">Sound output</div>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-700">
                      {host.soundSystem.equipment.speakers}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                        <Volume2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">Microphones</div>
                        <div className="text-sm text-neutral-600">Audio input</div>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-700">
                      {host.soundSystem.equipment.microphones}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                        <Volume2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">Mixing Board</div>
                        <div className="text-sm text-neutral-600">Audio control</div>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-700">
                      {host.soundSystem.equipment.mixingBoard || 'Basic mixing available'}
                    </div>
                  </div>
                  
                  {host.soundSystem.equipment.instruments && (
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mr-4">
                          <Volume2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">Instruments</div>
                          <div className="text-sm text-neutral-600">Available equipment</div>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-700">
                        {host.soundSystem.equipment.instruments}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {host.soundSystem.equipment.additional && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Additional Equipment</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-700">
                      {host.soundSystem.equipment.additional}
                    </p>
                  </div>
                </div>
              )}
              
              {host.soundSystem.limitations && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">System Limitations</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      {host.soundSystem.limitations}
                    </p>
                  </div>
                </div>
              )}
              
              {host.soundSystem.setupNotes && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Setup Notes</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      {host.soundSystem.setupNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Lodging Information */}
        {host.hostingCapabilities?.lodgingHosting?.enabled && host.hostingCapabilities?.lodgingHosting?.lodgingDetails && (
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Overnight Accommodation
                  </h2>
                  <p className="text-neutral-600">Stay comfortably during your visit</p>
                </div>
                <Badge variant="success" className="bg-green-100 text-green-800">
                  Available
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <Bed className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">Room Type</div>
                      <div className="text-sm text-neutral-600">Sleeping arrangement</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-700">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.roomType.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.bathroomType.replace('_', ' ')} bathroom
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">Capacity</div>
                      <div className="text-sm text-neutral-600">Maximum guests</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.bedConfiguration.maxOccupancy} guests
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.bedConfiguration.beds.map(bed => 
                      `${bed.quantity} ${bed.type.replace('_', ' ')}`
                    ).join(', ')}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">Pricing</div>
                      <div className="text-sm text-neutral-600">Per night</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-purple-700">
                    ${host.hostingCapabilities.lodgingHosting.lodgingDetails.pricing.baseRate}
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.pricing.additionalGuestFee && 
                      `+$${host.hostingCapabilities.lodgingHosting.lodgingDetails.pricing.additionalGuestFee} per extra guest`
                    }
                  </div>
                </div>
              </div>
              
              {/* Lodging Amenities */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Lodging Amenities</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries({
                    breakfast: { label: 'Breakfast included', icon: Coffee },
                    wifi: { label: 'WiFi access', icon: Wifi },
                    parking: { label: 'Free parking', icon: Car },
                    laundry: { label: 'Laundry access', icon: Sparkles },
                    kitchenAccess: { label: 'Kitchen access', icon: Home },
                    workspace: { label: 'Workspace available', icon: Zap },
                    linensProvided: { label: 'Linens provided', icon: Bed },
                    towelsProvided: { label: 'Towels provided', icon: Shield }
                  }).map(([key, {label, icon: IconComponent}]) => (
                    <div key={key} className={`flex items-center p-3 rounded-lg border ${
                      host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities[key as keyof typeof host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities] 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <IconComponent className={`w-5 h-5 mr-3 ${
                        host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities[key as keyof typeof host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities] 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities[key as keyof typeof host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities] 
                          ? 'text-green-900' 
                          : 'text-gray-500'
                      }`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* House Rules */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">House Rules</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Check-in:</strong> {host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules.checkInTime}
                  </div>
                  <div>
                    <strong>Check-out:</strong> {host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules.checkOutTime}
                  </div>
                  <div>
                    <strong>Quiet hours:</strong> {host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules.quietHours.start} - {host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules.quietHours.end}
                  </div>
                  <div>
                    <strong>Smoking:</strong> {host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules.smokingPolicy.replace('_', ' ')}
                  </div>
                  <div>
                    <strong>Pets:</strong> {host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules.petPolicy.replace('_', ' ')}
                  </div>
                  <div>
                    <strong>Alcohol:</strong> {host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules.alcoholPolicy.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <PublicReviewsSection 
          userId={host.id}
          userType="host"
          userName={host.name}
        />

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