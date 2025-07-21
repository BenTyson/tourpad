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
  Mic,
  Music,
  Guitar,
  Settings,
  Trees,
  Accessibility,
  Bed,
  Coffee,
  Copy,
  Mail,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Facebook,
  Utensils,
  Briefcase
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
  indoorCapacity?: number;
  outdoorCapacity?: number;
  typicalShowLength?: number;
  preferredDays?: string[];
  website?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
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
  amenities: string[];
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
      instruments?: string;
      additional?: string;
    };
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
              housePhotos: (testHost as any).housePhotos || [],
              performanceSpacePhotos: (testHost as any).performanceSpacePhotos || [],
              showSpecs: {
                ...testHost.showSpecs,
                outdoorAttendanceMax: (testHost.showSpecs as any).outdoorAttendanceMax || 0,
                showDurationMins: (testHost.showSpecs as any).showDurationMins || 120,
                showFormat: (testHost.showSpecs as any).showFormat || 'Intimate house concert',
                daysAvailable: (testHost.showSpecs as any).daysAvailable || ['Friday', 'Saturday'],
                estimatedShowsPerYear: (testHost.showSpecs as any).estimatedShowsPerYear || 10
              },
              amenities: (testHost as any).amenities || {},
              hostInfo: (testHost as any).hostInfo || { hostName: testHost.name, aboutMe: testHost.bio, profilePhoto: '' },
              soundSystem: (testHost as any).soundSystem || {},
              hostingCapabilities: (testHost as any).hostingCapabilities || {},
              website: '',
              socialLinks: {},
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
  const allPhotos = [
    ...host.housePhotos.map(photo => ({ ...photo, category: 'house' as const })), 
    ...host.performanceSpacePhotos.map(photo => ({ ...photo, category: 'performance_space' as const }))
  ];

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
                  <span className="font-semibold text-neutral-900">{host.rating || 0}</span>
                  <span className="ml-1 text-neutral-600">({host.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center bg-neutral-50 rounded-lg px-4 py-2 border border-neutral-200">
                  <Users className="w-5 h-5 mr-2 text-neutral-600" />
                  <span className="text-neutral-900">Up to {host.indoorCapacity || host.outdoorCapacity || 0} guests</span>
                </div>
                <div className="flex items-center bg-neutral-50 rounded-lg px-4 py-2 border border-neutral-200">
                  <DollarSign className="w-5 h-5 mr-2 text-neutral-600" />
                  <span className="text-neutral-900">${(host as any).suggestedDoorFee || 20} suggested door</span>
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
        
        {/* About This Venue - Combined section with Apple-inspired design */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                About this venue
              </h2>
              <p className="text-neutral-600">
                {host.venueType === 'home' ? 'Home/Living Room' :
                 host.venueType === 'studio' ? 'Studio Space' :
                 host.venueType === 'backyard' ? 'Backyard/Garden' :
                 host.venueType === 'loft' ? 'Loft' :
                 host.venueType === 'warehouse' ? 'Warehouse' :
                 host.venueType === 'other' ? 'Other' :
                 host.venueType?.charAt(0).toUpperCase() + host.venueType?.slice(1).toLowerCase() || 'Intimate venue'} 
                for live performances
              </p>
            </div>

            {/* Venue Details Grid - Apple-style clean layout */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Capacity */}
              <div className="bg-neutral-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Capacity</h3>
                    <p className="text-xs text-neutral-500">Typical attendance</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-neutral-900 mb-1">
                  {host.indoorCapacity && host.indoorCapacity > 0 ? (
                    <>
                      {host.indoorCapacity}
                      {host.outdoorCapacity && host.outdoorCapacity > 0 && (
                        <span className="text-lg text-neutral-600 ml-1">
                          +{host.outdoorCapacity}
                        </span>
                      )}
                    </>
                  ) : host.outdoorCapacity && host.outdoorCapacity > 0 ? (
                    host.outdoorCapacity
                  ) : (
                    host.showSpecs.avgAttendance
                  )}
                </div>
                <p className="text-sm text-neutral-600">
                  {host.indoorCapacity && host.indoorCapacity > 0 ? (
                    <>
                      {host.indoorCapacity} indoor
                      {host.outdoorCapacity && host.outdoorCapacity > 0 && `, ${host.outdoorCapacity} outdoor`}
                    </>
                  ) : host.outdoorCapacity && host.outdoorCapacity > 0 ? (
                    'Outdoor space'
                  ) : (
                    'guests typically'
                  )}
                </p>
              </div>

              {/* Show Length */}
              <div className="bg-neutral-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Show length</h3>
                    <p className="text-xs text-neutral-500">Typical duration</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-neutral-900 mb-1">
                  {host.typicalShowLength || host.showSpecs.showDurationMins}
                </div>
                <p className="text-sm text-neutral-600">minutes</p>
              </div>

              {/* Availability */}
              <div className="bg-neutral-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Available</h3>
                    <p className="text-xs text-neutral-500">Preferred days</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-neutral-900">
                  {host.preferredDays && host.preferredDays.length > 0 
                    ? host.preferredDays.join(', ')
                    : host.showSpecs.daysAvailable.join(', ')
                  }
                </div>
              </div>
            </div>

            {/* What's offered */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">What's offered</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                {host.amenities && host.amenities.length > 0 ? (
                  // Show actual amenities from database
                  host.amenities.map((amenity) => {
                    // Map amenity strings to icons
                    const amenityConfig = {
                      'Power access for equipment': { icon: Zap },
                      'Kid friendly environment': { icon: Baby },
                      'Sound system provided': { icon: Volume2 },
                      'Overnight accommodation': { icon: Bed },
                      'Air conditioning / Heating': { icon: Snowflake },
                      'Free parking on premises': { icon: Car },
                      'WiFi available': { icon: Wifi },
                      'Step-free access': { icon: Accessibility },
                      'Food & Refreshments': { icon: Coffee }
                    };
                    
                    const config = amenityConfig[amenity as keyof typeof amenityConfig] || { icon: CheckCircle };
                    const IconComponent = config.icon;
                    
                    return (
                      <div key={amenity} className="flex items-center gap-3 text-neutral-700">
                        <IconComponent className="w-5 h-5 text-neutral-500" />
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    );
                  })
                ) : (
                  // Fallback to show all possible amenities as available
                  [
                    { label: 'Power access', icon: Zap },
                    { label: 'Kid friendly', icon: Baby },
                    { label: 'Sound system', icon: Volume2 },
                    { label: 'Overnight stay', icon: Bed },
                    { label: 'Climate control', icon: Snowflake },
                    { label: 'Free parking', icon: Car },
                    { label: 'WiFi', icon: Wifi },
                    { label: 'Accessible', icon: Accessibility }
                  ].map(({label, icon: IconComponent}) => (
                    <div key={label} className="flex items-center gap-3 text-neutral-700">
                      <IconComponent className="w-5 h-5 text-neutral-500" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ))
                )}
              </div>
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
                
                {/* Social Links */}
                {(host.website || host.socialLinks?.instagram || host.socialLinks?.youtube || host.socialLinks?.facebook) && (
                  <div className="mt-4 flex items-center space-x-4">
                    {host.website && (
                      <a 
                        href={host.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-primary-600 transition-colors"
                        title="Website"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {host.socialLinks?.instagram && (
                      <a 
                        href={host.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-pink-600 transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {host.socialLinks?.youtube && (
                      <a 
                        href={host.socialLinks.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-red-600 transition-colors"
                        title="YouTube"
                      >
                        <Youtube className="w-5 h-5" />
                      </a>
                    )}
                    {host.socialLinks?.facebook && (
                      <a 
                        href={host.socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-blue-600 transition-colors"
                        title="Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                )}
                
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
                  <p className="text-neutral-600">Available to performers</p>
                </div>
                <Badge variant="default" className="bg-primary-100 text-primary-800">
                  Available
                </Badge>
              </div>
              
              {/* System Description */}
              {host.soundSystem.description && (
                <div className="mb-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">About Our Sound System</h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {host.soundSystem.description}
                  </p>
                </div>
              )}
              
              {/* Equipment Grid */}
              <div className="grid gap-6">
                {/* Core Equipment Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  {host.soundSystem.equipment.speakers && (
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Volume2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-neutral-900 mb-1">Speakers</div>
                          <p className="text-sm text-neutral-700 leading-relaxed">
                            {host.soundSystem.equipment.speakers}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {host.soundSystem.equipment.microphones && (
                    <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mic className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-neutral-900 mb-1">Microphones</div>
                          <p className="text-sm text-neutral-700 leading-relaxed">
                            {host.soundSystem.equipment.microphones}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Additional Equipment Row */}
                {(host.soundSystem.equipment.instruments || host.soundSystem.equipment.additional) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {host.soundSystem.equipment.instruments && (
                      <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-6 border border-accent-200">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Guitar className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-neutral-900 mb-1">Available Instruments</div>
                            <p className="text-sm text-neutral-700 leading-relaxed">
                              {host.soundSystem.equipment.instruments}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {host.soundSystem.equipment.additional && (
                      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-6 border border-neutral-200">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-neutral-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Settings className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-neutral-900 mb-1">Additional Equipment</div>
                            <p className="text-sm text-neutral-700 leading-relaxed">
                              {host.soundSystem.equipment.additional}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Lodging Information */}
        {(host as any).offersLodging && (host as any).lodgingDetails && (
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Where you'll sleep
                </h2>
                <p className="text-neutral-600">
                  {(host as any).lodgingDetails?.numberOfRooms || 1} bedroom{((host as any).lodgingDetails?.numberOfRooms || 1) > 1 ? 's' : ''} available
                </p>
              </div>
              
              {/* Room Cards - Apple-inspired design */}
              <div className="space-y-6">
                {(host as any).lodgingDetails?.rooms?.map((room: any, index: number) => {
                  const mainPhoto = room.photos?.[0];
                  const bedInfo = room.beds?.map((bed: any) => 
                    `${bed.quantity} ${bed.type === 'queen' ? 'Queen' : 
                      bed.type === 'king' ? 'King' : 
                      bed.type === 'full' ? 'Full' : 
                      bed.type === 'twin' ? 'Twin' : 
                      bed.type === 'single' ? 'Single' : 
                      bed.type === 'sofa_bed' ? 'Sofa bed' : 
                      bed.type === 'air_mattress' ? 'Air mattress' : 
                      bed.type}`
                  ).join(' + ') || '1 Queen';
                  
                  return (
                    <div key={room.id || index} className="group relative bg-neutral-50 rounded-2xl overflow-hidden transition-all hover:shadow-lg">
                      <div className="flex flex-col md:flex-row">
                        {/* Photo Section - Constrained height */}
                        <div className="relative w-full md:w-1/3 h-48 md:h-48 lg:h-56">
                          {mainPhoto ? (
                            <>
                              <img
                                src={mainPhoto.url}
                                alt={`Bedroom ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {room.photos && room.photos.length > 1 && (
                                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium">
                                  +{room.photos.length - 1} photos
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                              <Bed className="w-12 h-12 text-neutral-400" />
                            </div>
                          )}
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 p-5 md:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                                {room.roomType === 'private_bedroom' ? 'Private Bedroom' :
                                 room.roomType === 'shared_room' ? 'Shared Room' :
                                 room.roomType === 'entire_space' ? 'Entire Space' :
                                 `Bedroom ${index + 1}`}
                              </h3>
                              <p className="text-neutral-600">
                                {bedInfo} · Sleeps {room.maxOccupancy || 2}
                              </p>
                            </div>
                          </div>

                          {/* Key Features */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                                <Bed className="w-4 h-4 text-neutral-700" />
                              </div>
                              <span className="text-neutral-700">{bedInfo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                                <Home className="w-4 h-4 text-neutral-700" />
                              </div>
                              <span className="text-neutral-700">
                                {room.bathroomType === 'private' ? 'Private' : 'Shared'} bath
                              </span>
                            </div>
                          </div>

                          {/* View Photos Link */}
                          {room.photos && room.photos.length > 0 && (
                            <button className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                              View all {room.photos.length} photos →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fallback for single room configuration */}
              {(!(host as any).lodgingDetails?.rooms || (host as any).lodgingDetails?.rooms.length === 0) && (
                <div className="group relative bg-neutral-50 rounded-2xl overflow-hidden transition-all hover:shadow-lg">
                  <div className="flex flex-col md:flex-row">
                    {/* Photo Section - Placeholder */}
                    <div className="relative w-full md:w-1/3 h-48 md:h-48 lg:h-56">
                      <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                        <Bed className="w-12 h-12 text-neutral-400" />
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 p-5 md:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                            Private Bedroom
                          </h3>
                          <p className="text-neutral-600">
                            1 Queen bed · Sleeps 2
                          </p>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <Bed className="w-4 h-4 text-neutral-700" />
                          </div>
                          <span className="text-neutral-700">1 Queen bed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <Home className="w-4 h-4 text-neutral-700" />
                          </div>
                          <span className="text-neutral-700">Shared bath</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* What's included - Apple-style minimal design */}
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-6">What's included</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                  {[
                    { key: 'wifi', label: 'WiFi', icon: Wifi },
                    { key: 'breakfast', label: 'Breakfast', icon: Coffee },
                    { key: 'parking', label: 'Parking', icon: Car },
                    { key: 'laundry', label: 'Laundry', icon: Home },
                    { key: 'kitchenAccess', label: 'Kitchen', icon: Utensils },
                    { key: 'workspace', label: 'Workspace', icon: Briefcase },
                    { key: 'linensProvided', label: 'Linens', icon: Bed },
                    { key: 'towelsProvided', label: 'Towels', icon: Shield },
                  ].filter(({ key }) => {
                    const isAvailable = (host as any).lodgingDetails?.amenities?.[key as keyof any] || false;
                    return isAvailable;
                  }).map(({ key, label, icon: IconComponent }) => (
                    <div key={key} className="flex items-center gap-3 text-neutral-700">
                      <IconComponent className="w-5 h-5 text-neutral-500" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ))}
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
              <Badge variant="secondary" className="bg-sage/10 text-sage">
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