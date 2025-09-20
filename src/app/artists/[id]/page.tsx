'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArtistPhotoLightbox } from '@/components/media/ArtistPhotoLightbox';
import { PublicReviewsSection } from '@/components/reviews/PublicReviewsSection';
import BandMembers from '@/components/public-profile/artist/BandMembers';
import TourLogistics from '@/components/public-profile/artist/TourLogistics';
import UpcomingTours from '@/components/public-profile/artist/UpcomingTours';
import RelatedArtists from '@/components/public-profile/artist/RelatedArtists';
import {
  ArtistProfileHero,
  ArtistMusicSection,
  ArtistPhotoGallerySection,
  ArtistBioSection
} from '@/components/profiles/artist';

interface TourStateRange {
  id: string;
  state: string;
  startDate: string;
  endDate: string;
  cities: string[];
  notes: string;
}

interface TourSegment {
  id: string;
  name: string;
  description: string;
  status: string;
  isPublic: boolean;
  stateRanges: TourStateRange[];
}

interface ArtistData {
  id: string;
  userId: string;
  name: string;
  bio: string;
  briefBio?: string;
  fullBio?: string;
  location: string;
  genres: string[];
  musicalStyle: string;
  instruments: string[];
  yearsActive: number;
  experienceLevel: string;
  profileImageUrl: string;
  thumbnailPhotoUrl?: string;
  heroPhotoUrl?: string;
  website: string;
  socialLinks: any;
  rating: number;
  reviewCount: number;
  tourMonthsPerYear: number;
  tourVehicle: string;
  willingToTravel: number;
  equipmentProvided: string[];
  venueRequirements: string[];
  contentRating?: string;
  // Spotify fields
  spotifyVerified?: boolean;
  spotifyFollowers?: number;
  spotifyPopularity?: number;
  spotifyArtistId?: string;
  // SoundCloud fields
  soundcloudVerified?: boolean;
  soundcloudFollowers?: number;
  soundcloudTrackCount?: number;
  soundcloudUserId?: number;
  bandMembers?: Array<{
    id: string;
    name: string;
    instrument: string;
    photo?: string;
  }>;
  videoLinks?: Array<{
    id: string;
    title: string;
    url: string;
    platform: string;
    category: string;
    isLivePerformance: boolean;
  }>;
  musicSamples?: Array<{
    id: string;
    title: string;
    url: string;
    platform: string;
  }>;
  photos?: Array<{
    id: string;
    fileUrl: string;
    title: string;
    description: string;
    sortOrder: number;
    category: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function ArtistProfilePage() {
  const params = useParams();
  const artistId = params.id as string;

  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [tourSegments, setTourSegments] = useState<TourSegment[]>([]);
  const [upcomingTours, setUpcomingTours] = useState<Array<TourStateRange & { tourName: string }>>([]);
  const [relatedArtists, setRelatedArtists] = useState<any[]>([]);

  // Fetch artist data from API
  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await fetch(`/api/artists/${artistId}`);
        if (!response.ok) {
          throw new Error('Artist not found');
        }
        const data = await response.json();
        setArtistData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artist data:', error);
        setError(true);
        setLoading(false);
      }
    };

    const fetchRelatedArtists = async () => {
      try {
        const response = await fetch(`/api/artists?exclude=${artistId}&limit=3`);
        if (response.ok) {
          const data = await response.json();
          setRelatedArtists(data);
        }
      } catch (error) {
        console.error('Error fetching related artists:', error);
      }
    };

    fetchArtistData();
    fetchRelatedArtists();
  }, [artistId]);

  // Fetch tour segments for this artist
  useEffect(() => {
    const fetchTourSegments = async () => {
      if (artistData?.userId) {
        try {
          console.log('Fetching tour segments for artist:', artistData.userId);
          const response = await fetch(`/api/artists/${artistData.userId}/tour-segments`);
          if (response.ok) {
            const segments = await response.json();
            console.log('Tour segments received:', segments);
            setTourSegments(segments);

            // Process upcoming tours (next 12 months)
            const now = new Date();
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(now.getFullYear() + 1);

            const upcoming: Array<TourStateRange & { tourName: string }> = [];
            segments.forEach((segment: TourSegment) => {
              if (segment.isPublic && segment.status !== 'cancelled') {
                segment.stateRanges.forEach((range) => {
                  const endDate = new Date(range.endDate);
                  if (endDate >= now && endDate <= oneYearFromNow) {
                    upcoming.push({
                      ...range,
                      tourName: segment.name
                    });
                  }
                });
              }
            });

            // Sort by start date
            upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
            console.log('Upcoming tours processed:', upcoming);
            setUpcomingTours(upcoming);
          } else {
            console.log('Failed to fetch tour segments:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error fetching tour segments:', error);
        }
      }
    };

    fetchTourSegments();
  }, [artistData?.userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-french-blue)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (error || !artistData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artist Not Found</h1>
          <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Combine all photos for gallery - using database data if available
  const allPhotos = artistData?.photos && artistData.photos.length > 0
    ? artistData.photos.map(photo => ({
        id: photo.id,
        url: photo.fileUrl,
        title: photo.title,
        description: photo.description,
        category: (photo.category as "performance" | "band") || "performance",
        alt: photo.title || photo.description || 'Artist photo'
      }))
    : [];

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Artist Profile Hero */}
      <ArtistProfileHero
        artist={artistData}
        isFollowing={isFollowing}
        showShareMenu={showShareMenu}
        onToggleFollow={() => setIsFollowing(!isFollowing)}
        onToggleShare={() => setShowShareMenu(!showShareMenu)}
      />

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* Music Section - Spotify & SoundCloud */}
        <ArtistMusicSection artist={artistData} />

        {/* Performance Photos Section */}
        <ArtistPhotoGallerySection
          photos={allPhotos}
          onPhotoClick={handlePhotoClick}
        />

        {/* Band Members Section */}
        {artistData && (
          <BandMembers
            bandMembers={artistData.bandMembers}
            instruments={artistData.instruments}
            contentRating={artistData.contentRating}
            artistName={artistData.name}
          />
        )}

        {/* Tour & Logistics Section */}
        {artistData && (
          <TourLogistics
            tourMonthsPerYear={artistData.tourMonthsPerYear}
            tourVehicle={artistData.tourVehicle}
            willingToTravel={artistData.willingToTravel}
            equipmentProvided={artistData.equipmentProvided}
          />
        )}

        {/* Full Bio Section */}
        <ArtistBioSection fullBio={artistData.fullBio} />

        {/* Upcoming Tours Section */}
        {artistData && upcomingTours.length > 0 && (
          <UpcomingTours
            tours={upcomingTours}
            artistName={artistData.name}
          />
        )}

        {/* Reviews Section */}
        {artistData && (
          <PublicReviewsSection
            userId={artistData.id}
            userType="artist"
            userName={artistData.name}
          />
        )}

        {/* Related Artists Section */}
        {relatedArtists.length > 0 && (
          <RelatedArtists artists={relatedArtists} />
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