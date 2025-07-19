'use client';
import { useState, useEffect } from 'react';
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
import { mockRSVPs } from '@/data/mockData';
import { testHosts } from '@/data/realTestData';

interface HostData {
  id: string;
  name: string;
  bio: string;
  city: string;
  state: string;
  venueName: string;
  venueType: string;
  rating: number;
  reviewCount: number;
  housePhotos: Array<{
    id: string;
    url: string;
    alt: string;
    title?: string;
    description?: string;
  }>;
  performanceSpacePhotos: Array<{
    id: string;
    url: string;
    alt: string;
    title?: string;
    description?: string;
  }>;
  showSpecs: {
    avgAttendance: number;
    indoorAttendanceMax: number;
    outdoorAttendanceMax: number;
    showDurationMins: number;
    showFormat: string;
    daysAvailable: string[];
    estimatedShowsPerYear: number;
    avgDoorFee: number;
    hostingHistory: string;
  };
  amenities: {
    powerAccess: boolean;
    airConditioning: boolean;
    wifi: boolean;
    kidFriendly: boolean;
    parking: boolean;
    petFriendly: boolean;
    soundSystem: boolean;
    outdoorSpace: boolean;
    accessible: boolean;
    bnbOffered: boolean;
  };
  hostInfo?: {
    hostName: string;
    profilePhoto?: string;
    aboutMe?: string;
  };
  soundSystem?: {
    available: boolean;
    description: string;
    equipment: {
      speakers: string;
      microphones: string;
      mixingBoard?: string;
      instruments?: string;
      additional?: string;
    };
    limitations?: string;
    setupNotes?: string;
  };
  hostingCapabilities?: {
    lodgingHosting?: {
      enabled: boolean;
      lodgingDetails?: any;
    };
  };
  upcomingConcerts?: Array<{
    id: string;
    title: string;
    artistName: string;
    date: string;
    startTime: string;
    capacity: number;
    ticketPrice: number;
    status: string;
  }>;
}

export default function HostProfilePage() {
  const params = useParams();
  const hostId = params.id as string;
  
  const [hostData, setHostData] = useState<HostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Fetch host data from API
  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const response = await fetch(`/api/hosts/${hostId}`);
        if (!response.ok) {
          // Try to find in test data
          const testHost = testHosts.find(h => h.id === hostId);
          if (testHost) {
            // Transform test data to match API format
            const transformedHost: HostData = {
              id: testHost.id,
              name: testHost.name,
              bio: testHost.bio,
              city: testHost.location.city,
              state: testHost.location.state,
              venueName: testHost.venueName,
              venueType: testHost.venueType,
              rating: testHost.rating,
              reviewCount: testHost.reviewCount,
              housePhotos: testHost.housePhotos,
              performanceSpacePhotos: testHost.performanceSpacePhotos,
              showSpecs: testHost.showSpecs,
              amenities: testHost.amenities,
              hostInfo: testHost.hostInfo,
              soundSystem: testHost.soundSystem,
              hostingCapabilities: testHost.hostingCapabilities,
              upcomingConcerts: []
            };
            setHostData(transformedHost);
            setLoading(false);
            return;
          }
          throw new Error('Host not found');
        }
        const data = await response.json();
        setHostData(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHostData();
  }, [hostId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading host profile...</p>
        </div>
      </div>
    );
  }

  if (error || !hostData) {
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

  const host = hostData;

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
                    ? 'bg-primary-50 border-primary-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <IconComponent className={`w-5 h-5 mr-3 ${
                    host.amenities[key as keyof typeof host.amenities] 
                      ? 'text-primary-600' 
                      : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <span className={`font-medium ${
                      host.amenities[key as keyof typeof host.amenities] 
                        ? 'text-primary-900' 
                        : 'text-gray-500 line-through'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {host.amenities[key as keyof typeof host.amenities] && (
                    <CheckCircle className="w-5 h-5 text-primary-600" />
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
                  <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                    Sound System & Equipment
                  </h2>
                  <p className="text-neutral-600">available to performers</p>
                </div>
                <Badge variant="default" className="bg-primary-100 text-primary-800">
                  Available
                </Badge>
              </div>
              
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mr-4">
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
                  
                  <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center mr-4">
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
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mr-4">
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
                    <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center mr-4">
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
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Overnight Accommodation
                  </h2>
                </div>
                <Badge variant="default" className="bg-primary-100 text-primary-800">
                  Available
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mr-4">
                      <Bed className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">Room Type</div>
                      <div className="text-sm text-neutral-600">Sleeping arrangement</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary-700">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.roomType?.replace('_', ' ') || 'Private room'}
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.bathroomType?.replace('_', ' ') || 'Shared'} bathroom
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">Capacity</div>
                      <div className="text-sm text-neutral-600">Maximum guests</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-secondary-700">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.bedConfiguration?.maxOccupancy || 2} guests
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.bedConfiguration?.beds?.map(bed => 
                      `${bed.quantity} ${bed.type?.replace('_', ' ') || 'bed'}`
                    ).join(', ') || '1 bed'}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mr-4">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">Bathroom</div>
                      <div className="text-sm text-neutral-600">Bathroom details</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary-700">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.bathroomType?.replace('_', ' ') || 'Shared'}
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {host.hostingCapabilities.lodgingHosting.lodgingDetails.bathroomType === 'private' 
                      ? 'Private bathroom for guests'
                      : 'Shared with host family'
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
                    towelsProvided: { label: 'Towels provided', icon: Shield },
                  }).map(([key, {label, icon: IconComponent}]) => (
                    <div key={key} className={`flex items-center p-3 rounded-lg border ${
                      host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities[key as keyof typeof host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities] 
                        ? 'bg-primary-50 border-primary-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <IconComponent className={`w-5 h-5 mr-3 ${
                        host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities[key as keyof typeof host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities] 
                          ? 'text-primary-600' 
                          : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities[key as keyof typeof host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities] 
                          ? 'text-primary-900' 
                          : 'text-gray-500'
                      }`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* House Rules */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">House Rules</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`flex items-center p-4 rounded-lg border ${
                    host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities?.petFriendly 
                      ? 'bg-primary-50 border-primary-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <Heart className={`w-6 h-6 mr-3 ${
                      host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities?.petFriendly 
                        ? 'text-primary-600' 
                        : 'text-red-600'
                    }`} />
                    <div>
                      <div className="font-semibold text-neutral-900">Pets</div>
                      <div className={`text-sm ${
                        host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities?.petFriendly 
                          ? 'text-primary-700' 
                          : 'text-red-700'
                      }`}>
                        {host.hostingCapabilities.lodgingHosting.lodgingDetails.amenities?.petFriendly ? 'Allowed' : 'Not allowed'}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center p-4 rounded-lg border ${
                    host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules?.smokingPolicy !== 'no_smoking' 
                      ? 'bg-primary-50 border-primary-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <Zap className={`w-6 h-6 mr-3 ${
                      host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules?.smokingPolicy !== 'no_smoking' 
                        ? 'text-primary-600' 
                        : 'text-red-600'
                    }`} />
                    <div>
                      <div className="font-semibold text-neutral-900">Smoking</div>
                      <div className={`text-sm ${
                        host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules?.smokingPolicy !== 'no_smoking' 
                          ? 'text-primary-700' 
                          : 'text-red-700'
                      }`}>
                        {host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules?.smokingPolicy !== 'no_smoking' ? 'Allowed' : 'Not allowed'}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center p-4 rounded-lg border ${
                    host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules?.alcoholPolicy !== 'no_alcohol' 
                      ? 'bg-primary-50 border-primary-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <Coffee className={`w-6 h-6 mr-3 ${
                      host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules?.alcoholPolicy !== 'no_alcohol' 
                        ? 'text-primary-600' 
                        : 'text-red-600'
                    }`} />
                    <div>
                      <div className="font-semibold text-neutral-900">Alcohol</div>
                      <div className={`text-sm ${
                        host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules?.alcoholPolicy !== 'no_alcohol' 
                          ? 'text-primary-700' 
                          : 'text-red-700'
                      }`}>
                        {host.hostingCapabilities.lodgingHosting.lodgingDetails.houseRules?.alcoholPolicy !== 'no_alcohol' ? 'Allowed' : 'Not allowed'}
                      </div>
                    </div>
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

        {/* Upcoming Shows */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Upcoming Shows
                </h2>
                <p className="text-neutral-600">Concerts scheduled at this venue</p>
              </div>
              <Badge variant="outline" className="bg-sage/10 text-sage">
                {host.upcomingConcerts?.length || 0} Shows
              </Badge>
            </div>

            <div className="space-y-4">
              {host.upcomingConcerts && host.upcomingConcerts.length > 0 ? (
                host.upcomingConcerts.map((concert) => {
                  const concertRSVPs = mockRSVPs.filter(rsvp => rsvp.concertId === concert.id);
                  const totalGuests = concertRSVPs.reduce((sum, rsvp) => sum + rsvp.guestCount, 0);
                  
                  return (
                    <div key={concert.id} className="bg-gradient-to-r from-sage/5 to-french-blue/5 rounded-lg p-6 border border-sage/20">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-evergreen mb-1">
                            {concert.title}
                          </h3>
                          <p className="text-sm text-neutral-600 mb-2">
                            by {concert.artistName}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-neutral-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(concert.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {concert.startTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-sage">
                            ${concert.ticketPrice}
                          </div>
                          <div className="text-sm text-neutral-600">
                            per person
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4 border border-neutral-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-neutral-700">RSVPs</span>
                            <span className="text-sm text-neutral-600">
                              {concertRSVPs.length} fan{concertRSVPs.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600">Total Guests</span>
                            <span className="font-semibold text-sage">
                              {totalGuests} / {concert.capacity}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-neutral-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-neutral-700">Availability</span>
                            <Badge 
                              variant={concert.capacity - totalGuests > 10 ? "success" : "warning"}
                              className="text-xs"
                            >
                              {concert.capacity - totalGuests > 10 ? "Open" : "Limited"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600">Spots Left</span>
                            <span className="font-semibold text-evergreen">
                              {concert.capacity - totalGuests}
                            </span>
                          </div>
                        </div>
                      </div>

                      {concertRSVPs.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border border-neutral-200">
                          <h4 className="text-sm font-medium text-neutral-700 mb-3">Recent RSVPs</h4>
                          <div className="space-y-2">
                            {concertRSVPs.slice(-3).map((rsvp) => (
                              <div key={rsvp.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-sage/10 rounded-full flex items-center justify-center mr-2">
                                    <Users className="w-3 h-3 text-sage" />
                                  </div>
                                  <span className="text-neutral-700">{rsvp.fanName}</span>
                                </div>
                                <div className="text-neutral-600">
                                  {rsvp.guestCount} guest{rsvp.guestCount > 1 ? 's' : ''}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Upcoming Shows</h3>
                  <p className="text-neutral-600">This venue doesn't have any concerts scheduled yet.</p>
                </div>
              )}
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