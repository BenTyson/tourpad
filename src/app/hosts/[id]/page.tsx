'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PhotoGallery } from '@/components/media/PhotoGallery';
import { PhotoLightbox } from '@/components/media/PhotoLightbox';
import { PublicReviewsSection } from '@/components/reviews/PublicReviewsSection';

// Import new modular components
import ProfileHero from '@/components/public-profile/shared/ProfileHero';
import VenueDetails from '@/components/public-profile/host/VenueDetails';
import MusicalPreferences from '@/components/public-profile/host/MusicalPreferences';
import SoundSystemComponent from '@/components/public-profile/host/SoundSystem';
import LodgingInfo from '@/components/public-profile/host/LodgingInfo';

// Import Host Profile Components
import {
  HostProfileHero,
  HostDetailsSection,
  HostBookingInfo,
  HostUpcomingShows
} from '@/components/profiles/host';

import { Badge } from '@/components/ui/Badge';
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
          <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">
            Go Back
          </button>
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
      {/* Host Profile Hero */}
      <HostProfileHero
        host={host}
        isFollowing={isFollowing}
        showShareMenu={showShareMenu}
        onToggleFollow={() => setIsFollowing(!isFollowing)}
        onToggleShare={() => setShowShareMenu(!showShareMenu)}
      />

      {/* Profile Hero Section (existing) */}
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

        {/* Host Profile Details */}
        <HostDetailsSection host={host} />

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
        {host && <HostBookingInfo host={host} />}

        {/* Upcoming Shows */}
        {host && (
          <HostUpcomingShows concerts={host.upcomingConcerts || []} />
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
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
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
                      <svg className="w-12 h-12 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
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