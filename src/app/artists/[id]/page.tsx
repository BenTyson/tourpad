'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Star,
  Users,
  Clock,
  Truck,
  Globe,
  Music,
  CheckCircle,
  Calendar,
  MapPin,
  ArrowLeft,
  Share2,
  Heart,
  Copy,
  Mail,
  Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArtistPhotoGallery } from '@/components/media/ArtistPhotoGallery';
import { ArtistPhotoLightbox } from '@/components/media/ArtistPhotoLightbox';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { PublicReviewsSection } from '@/components/reviews/PublicReviewsSection';
import EnhancedArtistMusicSection from '@/components/artist/EnhancedArtistMusicSection';
import { mockArtists } from '@/data/mockData';

// Import new modular components for artist profiles
import ProfileHero from '@/components/public-profile/shared/ProfileHero';
import BandMembers from '@/components/public-profile/artist/BandMembers';
import TourLogistics from '@/components/public-profile/artist/TourLogistics';
import UpcomingTours from '@/components/public-profile/artist/UpcomingTours';
import RelatedArtists from '@/components/public-profile/artist/RelatedArtists';

// US States lookup for display names
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
];

const getStateName = (stateCode: string) => {
  return US_STATES.find(state => state.value === stateCode)?.label || stateCode;
};

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
  
  // Fallback to mock data for sections not yet converted
  const mockArtist = mockArtists.find(a => a.id === artistId || a.userId === artistId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
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
          <Link href="/artists">
            <Button>Back to Artists</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Combine all photos for gallery - using database data if available, fallback to mock data
  const allPhotos = artistData?.photos && artistData.photos.length > 0 
    ? artistData.photos.map(photo => ({
        id: photo.id,
        url: photo.fileUrl,
        title: photo.title,
        description: photo.description,
        category: (photo.category as "performance" | "band") || "performance",
        alt: photo.title || photo.description || 'Artist photo'
      }))
    : [...(mockArtist?.performancePhotos || []), ...(mockArtist?.bandPhotos || [])];

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
            <Link href="/artists">
              <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
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
      {artistData && (
        <ProfileHero 
          isArtist={true} 
          data={artistData} 
          onShare={() => setShowShareMenu(true)} 
          onFavorite={() => setIsFavorited(!isFavorited)} 
        />
      )}

      {/* Content Section - Bio, Stats, Video */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          
          {/* Bio & Video Side by Side */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Bio Section */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">{artistData.name}</h2>
              
              {/* Musical Style Description */}
              {artistData.musicalStyle && (
                <p className="text-lg text-neutral-500 font-light mb-6 italic">
                  {artistData.musicalStyle}
                </p>
              )}
              
              {/* Genre Tags */}
              {artistData.genres && artistData.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {artistData.genres.map((genre, index) => (
                    <span key={index} className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-xl text-neutral-600 leading-relaxed">
                {artistData.briefBio || artistData.bio || 'No bio available yet.'}
              </p>
            </div>
            
            {/* Featured Video Section */}
            {(() => {
              const featuredVideo = artistData.videoLinks?.find(video => video.isLivePerformance);
              if (featuredVideo) {
                return (
                  <div>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black ring-1 ring-neutral-900/5 mb-4">
                      <div className="relative aspect-video">
                        <iframe
                          src={(() => {
                            // Extract YouTube video ID from various URL formats
                            const url = featuredVideo.url;
                            let videoId = '';
                            
                            // Handle watch URLs: https://www.youtube.com/watch?v=ID or https://youtu.be/ID
                            if (url.includes('youtube.com/watch?v=')) {
                              videoId = url.split('watch?v=')[1].split('&')[0];
                            } else if (url.includes('youtu.be/')) {
                              videoId = url.split('youtu.be/')[1].split('?')[0];
                            } else if (url.includes('youtube.com/embed/')) {
                              videoId = url.split('embed/')[1].split('?')[0];
                            }
                            
                            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                          })()}
                          title={featuredVideo.title}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 text-center">{featuredVideo.title}</p>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 mr-2 text-yellow-500" />
                <span className="text-3xl font-bold text-neutral-900">{artistData.rating || 'N/A'}</span>
              </div>
              <p className="text-neutral-600">Rating ({artistData.reviewCount || 0} reviews)</p>
            </div>
            <div className="w-px h-16 bg-neutral-200"></div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 mr-2 text-neutral-600" />
                <span className="text-3xl font-bold text-neutral-900">{artistData.bandMembers?.length || 1}</span>
              </div>
              <p className="text-neutral-600">Band Member{(artistData.bandMembers?.length || 1) > 1 ? 's' : ''}</p>
            </div>
            <div className="w-px h-16 bg-neutral-200"></div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 mr-2 text-neutral-600" />
                <span className="text-3xl font-bold text-neutral-900">{artistData.yearsActive || 1}</span>
              </div>
              <p className="text-neutral-600">Years Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Music & Website Links Section */}
      {(artistData.website || artistData.socialLinks) && (
        <section className="bg-neutral-50 border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap justify-center gap-3">
              {artistData.website && (
                <a 
                  href={artistData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-primary-50 border border-neutral-300 hover:border-primary-300 rounded-full px-5 py-2.5 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <Globe className="w-4 h-4 mr-2 text-neutral-600 group-hover:text-primary-600" />
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-primary-700">Website</span>
                </a>
              )}
              
              {artistData.socialLinks?.spotify && (
                <a 
                  href={artistData.socialLinks.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-green-50 border border-neutral-300 hover:border-green-300 rounded-full px-5 py-2.5 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="w-4 h-4 mr-2 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-green-700">Spotify</span>
                </a>
              )}
              
              {artistData.socialLinks?.youtube && (
                <a 
                  href={artistData.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-red-50 border border-neutral-300 hover:border-red-300 rounded-full px-5 py-2.5 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="w-4 h-4 mr-2 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">▶</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-red-700">YouTube</span>
                </a>
              )}
              
              {artistData.socialLinks?.instagram && (
                <a 
                  href={`https://instagram.com/${artistData.socialLinks.instagram.replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-pink-50 border border-neutral-300 hover:border-pink-300 rounded-full px-5 py-2.5 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="w-4 h-4 mr-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">@</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-pink-700">Instagram</span>
                </a>
              )}
              
              {artistData.socialLinks?.facebook && (
                <a 
                  href={artistData.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-blue-50 border border-neutral-300 hover:border-blue-300 rounded-full px-5 py-2.5 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="w-4 h-4 mr-2 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">f</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-blue-700">Facebook</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

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

        {/* Music Section - Spotify & SoundCloud */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Music
            </h2>
            <EnhancedArtistMusicSection
              artistId={artistData.id}
              artistName={artistData.name}
              spotifyConnected={artistData.spotifyVerified || false}
              spotifyFollowers={artistData.spotifyFollowers}
              spotifyPopularity={artistData.spotifyPopularity}
              soundcloudConnected={artistData.soundcloudVerified || false}
              soundcloudFollowers={artistData.soundcloudFollowers}
              soundcloudTrackCount={artistData.soundcloudTrackCount}
            />
          </div>
        </section>

        {/* Performance Photos Section */}
        {allPhotos.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Photo Gallery
                </h2>
                <Badge variant="default" className="bg-neutral-100 text-neutral-700 border-neutral-200">
                  {allPhotos.length} {allPhotos.length === 1 ? 'Photo' : 'Photos'}
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
        {artistData.fullBio && (
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Full Bio</h2>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {artistData.fullBio}
                </p>
              </div>
            </div>
          </section>
        )}

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