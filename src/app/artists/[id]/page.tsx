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
import ArtistMusicSection from '@/components/artist/ArtistMusicSection';
import { mockArtists } from '@/data/mockData';

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
  const [tourSegments, setTourSegments] = useState<TourSegment[]>([]);
  const [upcomingTours, setUpcomingTours] = useState<TourStateRange[]>([]);

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
            
            const upcoming: TourStateRange[] = [];
            segments.forEach((segment: TourSegment) => {
              if (segment.isPublic && segment.status !== 'cancelled') {
                segment.stateRanges.forEach((range) => {
                  const endDate = new Date(range.endDate);
                  if (endDate >= now && endDate <= oneYearFromNow) {
                    upcoming.push(range);
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
  
  // Related artists state
  const [relatedArtists, setRelatedArtists] = useState<any[]>([]);

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

      {/* Hero Section - Full Image Background */}
      <section className="relative h-[70vh] min-h-[500px] bg-neutral-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {artistData.heroPhotoUrl ? (
            <img 
              src={artistData.heroPhotoUrl} 
              alt={`${artistData.name} hero background`}
              className="w-full h-full object-cover"
            />
          ) : artistData.profileImageUrl ? (
            <img 
              src={artistData.profileImageUrl} 
              alt={`${artistData.name} background`}
              className="w-full h-full object-cover"
            />
          ) : artistData.photos && artistData.photos.length > 0 ? (
            <img 
              src={artistData.photos[0].fileUrl} 
              alt={`${artistData.name} background`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800"></div>
          )}
        </div>
        
        {/* Overlay Mask */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8">
            {/* Artist Name */}
            <h1 className="text-7xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
              {artistData.name}
            </h1>
            
            {/* Location */}
            {artistData.location && (
              <div className="flex items-center justify-center text-white/90 mb-8">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="font-medium text-lg">{artistData.location}</span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/bookings/new?artistId=${artistData.id}`}>
                <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg px-8 py-3 font-semibold">
                  Request Booking
                </Button>
              </Link>
              <Link href={`/dashboard/messages?startConversation=${artistData.userId}`}>
                <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-neutral-900 px-8 py-3 font-semibold">
                  Send Message
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

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

        {/* Spotify Music Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">
                Music
              </h2>
              <div className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-green-600" />
                <span className="text-sm text-neutral-600">Powered by Spotify</span>
              </div>
            </div>
            <ArtistMusicSection
              artistId={artistData.id}
              artistName={artistData.name}
              spotifyConnected={artistData.spotifyVerified || false}
              spotifyFollowers={artistData.spotifyFollowers}
              spotifyPopularity={artistData.spotifyPopularity}
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
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  {artistData.bandMembers?.length === 1 ? 'Solo Artist' : 'Meet the Band'}
                </h2>
              </div>
              <Badge variant="default" className="bg-primary-100 text-primary-800">
                {artistData.bandMembers?.length || 1} {(artistData.bandMembers?.length || 1) === 1 ? 'Member' : 'Members'}
              </Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(artistData.bandMembers || []).map((member, index) => {
                // Fallback photos if no photo provided
                const fallbackPhotos = [
                  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1494790108755-2616b9a8af3c?w=400&h=400&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
                ];
                
                return (
                  <div key={member.id} className="group flex items-center p-6 bg-white rounded-xl border border-neutral-200 hover:shadow-md transition-all duration-300">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={member.photo || fallbackPhotos[index % fallbackPhotos.length]} 
                        alt={`${member.name} profile photo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 text-lg">{member.name}</div>
                      <div className="text-sm text-neutral-600 font-medium">{member.instrument}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Band Instruments */}
            {artistData.instruments && artistData.instruments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                  Instruments {(artistData.bandMembers?.length || 1) > 1 ? 'we' : 'I'} play
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artistData.instruments.map((instrument, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-200"
                    >
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content Rating */}
            {artistData.contentRating && (
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Our musical content rating:</span>{' '}
                  {(() => {
                    switch (artistData.contentRating) {
                      case 'family-friendly':
                        return 'Family Friendly';
                      case 'explicit':
                        return 'Explicit';
                      case 'tailored':
                        return 'Can be tailored to suit the requested environment';
                      default:
                        return 'Family Friendly';
                    }
                  })()}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Tour & Logistics Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Tour & Logistics</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center bg-primary-50 rounded-lg p-4 border border-primary-200">
                <Clock className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900">{artistData.tourMonthsPerYear || 0} months/year</div>
                  <div className="text-sm text-neutral-600">Touring</div>
                </div>
              </div>
              
              <div className="flex items-center bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                <Truck className="w-5 h-5 text-secondary-600 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900 capitalize">{artistData.tourVehicle || 'Van'}</div>
                  <div className="text-sm text-neutral-600">Transport</div>
                </div>
              </div>
              
              <div className="flex items-center bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <Globe className="w-5 h-5 text-neutral-600 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900">{artistData.willingToTravel || 500} miles</div>
                  <div className="text-sm text-neutral-600">Travel radius</div>
                </div>
              </div>
            </div>
            
            {/* Equipment Brought to Shows */}
            {artistData.equipmentProvided && artistData.equipmentProvided.length > 0 && (
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3 flex items-center">
                  <Music className="w-5 h-5 text-neutral-600 mr-2" />
                  Equipment I Bring to Shows
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artistData.equipmentProvided.map((equipment, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-700 border border-neutral-200"
                    >
                      {equipment}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

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
        {upcomingTours.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">Upcoming Tours</h2>
                  <p className="text-neutral-600">Catch {artistData?.name} when they're in your area</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-500">Next 12 months</div>
                  <div className="text-lg font-semibold text-primary-600">{upcomingTours.length} state{upcomingTours.length !== 1 ? 's' : ''}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingTours.map((tour, index) => {
                  const startDate = new Date(tour.startDate);
                  const endDate = new Date(tour.endDate);
                  const isComingSoon = startDate.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000; // 30 days
                  
                  return (
                    <div key={`${tour.id}-${index}`} className={`border rounded-xl p-4 ${isComingSoon ? 'border-primary-200 bg-primary-50' : 'border-neutral-200 bg-white'} hover:shadow-md transition-shadow duration-200`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${isComingSoon ? 'text-primary-600' : 'text-neutral-600'}`} />
                          <span className={`font-semibold ${isComingSoon ? 'text-primary-900' : 'text-neutral-900'}`}>
                            {getStateName(tour.state)}
                          </span>
                        </div>
                        {isComingSoon && (
                          <Badge variant="primary" className="text-xs px-2 py-1">
                            Soon
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {startDate.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} - {endDate.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {tour.cities.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-neutral-500 mb-1">Cities</div>
                          <div className="flex flex-wrap gap-1">
                            {tour.cities.slice(0, 3).map((city) => (
                              <Badge key={city} variant="outline" className="text-xs px-2 py-0.5">
                                {city}
                              </Badge>
                            ))}
                            {tour.cities.length > 3 && (
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                +{tour.cities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {tour.notes && (
                        <div className="text-xs text-neutral-600 italic line-clamp-2">
                          {tour.notes}
                        </div>
                      )}
                      
                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            // TODO: Implement booking/contact functionality
                            alert('Booking functionality coming soon!');
                          }}
                        >
                          Contact for Booking
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {upcomingTours.length > 6 && (
                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={() => {
                    // TODO: Show all tours modal or expand view
                    alert('Full tour calendar coming soon!');
                  }}>
                    View All Upcoming Tours
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <PublicReviewsSection 
          userId={artistData.id}
          userType="artist"
          userName={artistData.name}
        />

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
                          <Music className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                            {relatedArtist.name}
                          </h3>
                          <p className="text-sm text-neutral-600">{relatedArtist.location}</p>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-700 line-clamp-2">{relatedArtist.bio || 'Professional musician'}</p>
                      <div className="flex items-center mt-4 text-sm text-neutral-600">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{relatedArtist.rating || 'N/A'}</span>
                        <span className="mx-2">•</span>
                        <span>{relatedArtist.bandMembers?.length || 1} member{(relatedArtist.bandMembers?.length || 1) > 1 ? 's' : ''}</span>
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