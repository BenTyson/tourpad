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
  ArrowLeft,
  Share2,
  Heart,
  MapPin,
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
import { mockArtists } from '@/data/mockData';

interface ArtistData {
  id: string;
  name: string;
  bio: string;
  location: string;
  genres: string[];
  instruments: string[];
  yearsActive: number;
  experienceLevel: string;
  profileImageUrl: string;
  website: string;
  socialLinks: any;
  rating: number;
  reviewCount: number;
  tourMonthsPerYear: number;
  tourVehicle: string;
  willingToTravel: number;
  equipmentProvided: string[];
  venueRequirements: string[];
  bandMembers?: Array<{
    id: string;
    name: string;
    instrument: string;
    photo?: string;
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

    fetchArtistData();
  }, [artistId]);
  
  // Fallback to mock data for sections not yet converted
  const mockArtist = mockArtists.find(a => a.id === artistId || a.userId === artistId);
  
  // Get related artists (similar genre/region)
  const relatedArtists = mockArtists
    .filter(a => a.id !== artistId && a.approved)
    .slice(0, 3);

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

  // Combine all photos for gallery - using mock data for now
  const allPhotos = [...(mockArtist?.performancePhotos || []), ...(mockArtist?.bandPhotos || [])];

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

      {/* Hero Section - Clean White Design */}
      <section className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  Verified Artist
                </Badge>
                {artistData.location && (
                  <Badge variant="secondary" className="bg-neutral-100 text-neutral-700 border-neutral-200">
                    <MapPin className="w-4 h-4 mr-1" />
                    {artistData.location}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-5xl font-bold mb-4 text-neutral-900">
                {artistData.name}
              </h1>
              
              <p className="text-xl mb-8 text-neutral-600 leading-relaxed">
                {artistData.bio || 'No bio available yet.'}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-neutral-50 rounded-lg px-4 py-2 border border-neutral-200">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  <span className="font-semibold text-neutral-900">{artistData.rating || 'N/A'}</span>
                  <span className="ml-1 text-neutral-600">({artistData.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center bg-neutral-50 rounded-lg px-4 py-2 border border-neutral-200">
                  <Users className="w-5 h-5 mr-2 text-neutral-600" />
                  <span className="text-neutral-900">{artistData.bandMembers?.length || 1} member{(artistData.bandMembers?.length || 1) > 1 ? 's' : ''}</span>
                </div>
                {/* Genre Tags */}
                {artistData.genres && artistData.genres.length > 0 && (
                  artistData.genres.map((genre, index) => (
                    <div key={index} className="flex items-center bg-primary-50 rounded-lg px-4 py-2 border border-primary-200">
                      <Music className="w-5 h-5 mr-2 text-primary-600" />
                      <span className="text-primary-900 font-medium">{genre}</span>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href={`/bookings/new?artistId=${artistData.id}`}>
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg">
                    Request Booking
                  </Button>
                </Link>
                <Link href={`/messages?artistId=${artistData.id}`}>
                  <Button size="lg" variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                    Send Message
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Featured Video with Mock Data */}
            {mockArtist?.livePerformanceVideo && (
              <div className="lg:pl-8">
                <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black">
                  <div className="relative aspect-video">
                    <iframe
                      src={mockArtist.livePerformanceVideo.replace('watch?v=', 'embed/')}
                      title="Live Performance Video"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
                <p className="mt-4 text-center text-neutral-600 text-sm">
                  Watch {artistData.name} perform live
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Music & Website Links Section */}
      {(artistData.website || artistData.socialLinks) && (
        <section className="bg-neutral-50 border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Listen & Connect</h2>
              <p className="text-neutral-600">Find {artistData.name} on your favorite platforms</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {artistData.website && (
                <a 
                  href={artistData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg px-6 py-3 transition-colors group"
                >
                  <Globe className="w-5 h-5 mr-3 text-neutral-600 group-hover:text-primary-600" />
                  <span className="font-medium text-neutral-900">Official Website</span>
                </a>
              )}
              
              {artistData.socialLinks?.spotify && (
                <a 
                  href={artistData.socialLinks.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-green-50 border border-neutral-200 rounded-lg px-6 py-3 transition-colors group"
                >
                  <div className="w-5 h-5 mr-3 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="font-medium text-neutral-900 group-hover:text-green-700">Spotify</span>
                </a>
              )}
              
              {artistData.socialLinks?.youtube && (
                <a 
                  href={artistData.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-red-50 border border-neutral-200 rounded-lg px-6 py-3 transition-colors group"
                >
                  <div className="w-5 h-5 mr-3 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">▶</span>
                  </div>
                  <span className="font-medium text-neutral-900 group-hover:text-red-700">YouTube</span>
                </a>
              )}
              
              {artistData.socialLinks?.instagram && (
                <a 
                  href={`https://instagram.com/${artistData.socialLinks.instagram.replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-pink-50 border border-neutral-200 rounded-lg px-6 py-3 transition-colors group"
                >
                  <div className="w-5 h-5 mr-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">@</span>
                  </div>
                  <span className="font-medium text-neutral-900 group-hover:text-pink-700">Instagram</span>
                </a>
              )}
              
              {artistData.socialLinks?.facebook && (
                <a 
                  href={artistData.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-blue-50 border border-neutral-200 rounded-lg px-6 py-3 transition-colors group"
                >
                  <div className="w-5 h-5 mr-3 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">f</span>
                  </div>
                  <span className="font-medium text-neutral-900 group-hover:text-blue-700">Facebook</span>
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

        {/* Performance Photos Section */}
        {allPhotos.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Performance Gallery
                  </h2>
                  <p className="text-neutral-600">{allPhotos.length} professional photos</p>
                </div>
                <Badge variant="default" className="bg-secondary-100 text-secondary-800">
                  {allPhotos.length} Photos
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
                <p className="text-neutral-600">
                  {artistData.bandMembers?.length === 1 ? 'Individual performer' : `${artistData.bandMembers?.length || 1} talented musicians`}
                </p>
              </div>
              <Badge variant="default" className="bg-primary-100 text-primary-800">
                {artistData.bandMembers?.length || 1} {(artistData.bandMembers?.length || 1) === 1 ? 'Member' : 'Members'}
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
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
          </div>
        </section>

        {/* Technical Requirements */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Technical Requirements</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Equipment Provided by Artist
                </h3>
                <ul className="space-y-2 text-neutral-700">
                  {artistData.equipmentProvided.length > 0 ? (
                    artistData.equipmentProvided.map((equipment, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        {equipment}
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start text-neutral-500 italic">
                      <span className="text-neutral-400 mr-2">•</span>
                      No equipment information provided
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  Venue Requirements
                </h3>
                <ul className="space-y-2 text-neutral-700">
                  {artistData.venueRequirements.length > 0 ? (
                    artistData.venueRequirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {requirement}
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start text-neutral-500 italic">
                      <span className="text-neutral-400 mr-2">•</span>
                      No venue requirements specified
                    </li>
                  )}
                  {/* Always show parking requirement based on tour vehicle */}
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Parking space for {(artistData.tourVehicle || 'van').toLowerCase() === 'van' ? 'van' : 'vehicle'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

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
                      <p className="text-sm text-neutral-700 line-clamp-2">{relatedArtist.bio}</p>
                      <div className="flex items-center mt-4 text-sm text-neutral-600">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{relatedArtist.rating}</span>
                        <span className="mx-2">•</span>
                        <span>{relatedArtist.members.length} member{relatedArtist.members.length > 1 ? 's' : ''}</span>
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