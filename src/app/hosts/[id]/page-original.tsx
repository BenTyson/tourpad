'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Import new modular components
import ProfileHero from '@/components/public-profile/shared/ProfileHero';
import StatsSection from '@/components/public-profile/shared/StatsSection';
import SocialLinks from '@/components/public-profile/shared/SocialLinks';
import ShareModal from '@/components/public-profile/shared/ShareModal';
import VenueDetails from '@/components/public-profile/host/VenueDetails';
import MusicalPreferences from '@/components/public-profile/host/MusicalPreferences';
import SoundSystemComponent from '@/components/public-profile/host/SoundSystem';
import LodgingInfo from '@/components/public-profile/host/LodgingInfo';
import HostProfile from '@/components/public-profile/host/HostProfile';

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


// Dynamic import for MapContainer to avoid SSR issues
const TourPadMapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  { ssr: false }
);

interface HostData {
  id: string;
  userId: string;
  name: string;
  bio: string;
  city: string;
  state: string;
  displayCoordinates?: [number, number];
  venueName: string;
  venueType: string;
  indoorCapacity?: number;
  outdoorCapacity?: number;
  typicalShowLength?: number;
  preferredDays?: string[];
  suggestedDoorFee?: number;
  hostingExperience?: number;
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
  hostMembers?: Array<{
    id: string;
    hostName: string;
    profilePhoto?: string;
    aboutMe?: string;
  }>;
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
  // Musical Preferences
  preferredGenres?: string[];
  preferredActSize?: string;
  actSizeNotes?: string;
  whatWeEnjoy?: string;
  musicWeArentInto?: string;
  contentRating?: string;
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
  const [isFavorited, setIsFavorited] = useState(false);

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
              userId: testHost.userId,
              name: testHost.name,
              bio: testHost.bio,
              city: testHost.location.city,
              state: testHost.location.state,
              displayCoordinates: [testHost.location.coordinates.lat, testHost.location.coordinates.lng],
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
              hostMembers: (testHost as any).hostMembers || [],
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-french-blue)] mx-auto mb-4"></div>
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
  const allPhotos = host ? [
    ...(host.housePhotos || []).map(photo => ({ ...photo, category: 'house' as const })), 
    ...(host.performanceSpacePhotos || []).map(photo => ({ ...photo, category: 'performance_space' as const }))
  ] : [];

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

      {/* Profile Hero Section */}
      {host && (
        <ProfileHero 
          isArtist={false} 
          data={host} 
          onShare={() => setShowShareMenu(true)} 
          onFavorite={() => setIsFavorited(!isFavorited)} 
        />
      )}

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Venue Details */}
        {host && <VenueDetails host={host} />}

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
                  Meet Your {(host.hostMembers && host.hostMembers.length > 1) ? 'Hosts' : 'Host'}
                </h2>
                <div>
                  <p className="text-neutral-600">
                    Hosted by {
                      host.hostMembers && host.hostMembers.length > 0
                        ? host.hostMembers.map(h => h.hostName).join(' & ')
                        : host.hostInfo?.hostName || host.name
                    }
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-500 mt-2">
                    <span>{host.showSpecs.hostingHistory} hosting experience</span>
                    <span>•</span>
                    <span>{host.reviewCount} reviews</span>
                    <span>•</span>
                    <span>{host.rating} ⭐ average rating</span>
                  </div>
                </div>
              </div>
              <Badge variant="default" className="bg-primary-100 text-primary-800">
                {host.showSpecs.hostingHistory} Experience
              </Badge>
            </div>
            
            {/* Multiple hosts display */}
            {host.hostMembers && host.hostMembers.length > 0 ? (
              <div className="space-y-6">
                {host.hostMembers.map((hostPerson, index) => (
                  <div key={hostPerson.id} className="flex items-start space-x-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                      {hostPerson.profilePhoto ? (
                        <img 
                          src={hostPerson.profilePhoto} 
                          alt={`${hostPerson.hostName} profile photo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl">
                          {hostPerson.hostName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{hostPerson.hostName}</h3>
                      <p className="text-neutral-700 leading-relaxed">
                        {hostPerson.aboutMe || 'Passionate about bringing live music into intimate settings. I love creating memorable experiences where artists and audiences can connect in a personal, meaningful way.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Single host display (legacy) */
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
                </div>
              </div>
            )}
            
            {/* Social Links */}
            {(host.website || host.socialLinks?.instagram || host.socialLinks?.youtube || host.socialLinks?.facebook) && (
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex items-center space-x-4">
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
                      className="text-neutral-500 hover:text-[var(--color-evergreen)] transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <Link href={`/messages?hostId=${host.id}`}>
                <Button variant="outline" size="sm">
                  Contact Host
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Sound System */}
        {host && <SoundSystemComponent soundSystem={host.soundSystem} />}

        {/* Musical Preferences */}
        {host && <MusicalPreferences host={host} />}

        {/* Lodging Information */}
        {host && (
          <LodgingInfo 
            offersLodging={(host as any).offersLodging} 
            lodgingDetails={(host as any).lodgingDetails} 
          />
        )}
        
        {/* Reviews Section */}
        {host && (
          <PublicReviewsSection 
            userId={host.id}
            userType="host"
            userName={host.name}
          />
        )}

        {/* Booking Information */}
        {host && (
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
                    <span className="font-medium">${host.suggestedDoorFee || host.showSpecs?.avgDoorFee || 20}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Typical audience:</span>
                    <span className="font-medium">{host.showSpecs?.avgAttendance || Math.floor((host.indoorCapacity || 20) * 0.8)} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Response rate:</span>
                    <span className="font-medium">{host.hostingExperience > 2 ? '95%' : host.hostingExperience > 0 ? '85%' : 'New host'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Response time:</span>
                    <span className="font-medium">{host.hostingExperience > 5 ? 'Within 4 hours' : host.hostingExperience > 1 ? 'Within 12 hours' : 'Within 24 hours'}</span>
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
        )}

        {/* Upcoming Shows */}
        {host && (
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
        )}

        {/* Host Location Map */}
        {host && (
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">Location</h2>
                  <p className="text-neutral-600">General area in {host.city}, {host.state}</p>
                </div>
              <Badge variant="secondary" className="bg-neutral-100 text-neutral-700">
                <MapPin className="w-4 h-4 mr-1" />
                Approximate
              </Badge>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-lg">
              {host.displayCoordinates ? (
                <TourPadMapContainer
                  className="w-full h-[400px]"
                  initialCenter={host.displayCoordinates}
                  initialZoom={12}
                  showFilters={false}
                  hosts={[{
                    id: host.id,
                    userId: host.userId,
                    name: host.venueName || host.name,
                    email: '',
                    profileImageUrl: host.housePhotos[0]?.url || '',
                    venueName: host.venueName,
                    venueType: host.venueType,
                    city: host.city,
                    state: host.state,
                    country: 'United States',
                    description: host.bio,
                    capacity: (host.indoorCapacity || 0) + (host.outdoorCapacity || 0),
                    indoorCapacity: host.indoorCapacity,
                    outdoorCapacity: host.outdoorCapacity,
                    preferredGenres: host.preferredGenres || [],
                    suggestedDoorFee: (host as any).suggestedDoorFee,
                    coordinates: host.displayCoordinates,
                    actualCoordinates: host.displayCoordinates,
                    amenities: {
                      soundSystem: false,
                      parking: false,
                      accessible: false,
                      kidFriendly: false,
                      outdoorSpace: false
                    },
                    media: [],
                    hostingExperience: host.showSpecs?.estimatedShowsPerYear || 0,
                    offersLodging: (host as any).offersLodging || false,
                    lodgingDetails: (host as any).lodgingDetails,
                    houseRules: '',
                    mapLocation: {
                      searchKeywords: [host.city, host.state, host.venueType]
                    }
                  }]}
                />
              ) : (
                <div className="bg-neutral-100 rounded-xl flex items-center justify-center h-[400px]">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600">Location information not available</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-sm text-neutral-500 text-center">
              <p>This map shows the general area. Exact address will be shared after booking confirmation.</p>
            </div>
          </div>
        </section>
        )}
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