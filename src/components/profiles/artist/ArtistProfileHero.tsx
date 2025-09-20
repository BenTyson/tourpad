import React from 'react';
import {
  Star,
  Users,
  Clock,
  Globe,
  ArrowLeft,
  Share2,
  Heart,
  Copy,
  Mail,
  Twitter
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface ArtistProfileHeroProps {
  artist: {
    id: string;
    name: string;
    bio: string;
    briefBio?: string;
    musicalStyle?: string;
    location: string;
    rating: number;
    reviewCount: number;
    yearsActive: number;
    bandMembers?: Array<{
      id: string;
      name: string;
      instrument: string;
      photo?: string;
    }>;
    website?: string;
    socialLinks?: {
      spotify?: string;
      youtube?: string;
      instagram?: string;
      facebook?: string;
    };
    videoLinks?: Array<{
      id: string;
      title: string;
      url: string;
      platform: string;
      category: string;
      isLivePerformance: boolean;
    }>;
  };
  isFollowing: boolean;
  showShareMenu: boolean;
  onToggleFollow: () => void;
  onToggleShare: () => void;
}

export function ArtistProfileHero({
  artist,
  isFollowing,
  showShareMenu,
  onToggleFollow,
  onToggleShare
}: ArtistProfileHeroProps) {
  return (
    <>
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
                  onClick={onToggleShare}
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
                onClick={onToggleFollow}
              >
                <Heart className="w-4 h-4 mr-2" />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bio & Video Side by Side */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Bio Section */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">{artist.name}</h2>

              {/* Musical Style Description */}
              {artist.musicalStyle && (
                <p className="text-lg text-neutral-500 font-light mb-6 italic">
                  {artist.musicalStyle}
                </p>
              )}

              <p className="text-xl text-neutral-600 leading-relaxed">
                {artist.briefBio || artist.bio || 'No bio available yet.'}
              </p>
            </div>

            {/* Featured Video Section */}
            {(() => {
              const featuredVideo = artist.videoLinks?.find(video => video.isLivePerformance);
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
                <span className="text-3xl font-bold text-neutral-900">{artist.rating || 'N/A'}</span>
              </div>
              <p className="text-neutral-600">Rating ({artist.reviewCount || 0} reviews)</p>
            </div>
            <div className="w-px h-16 bg-neutral-200"></div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 mr-2 text-neutral-600" />
                <span className="text-3xl font-bold text-neutral-900">{artist.bandMembers?.length || 1}</span>
              </div>
              <p className="text-neutral-600">Band Member{(artist.bandMembers?.length || 1) > 1 ? 's' : ''}</p>
            </div>
            <div className="w-px h-16 bg-neutral-200"></div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 mr-2 text-neutral-600" />
                <span className="text-3xl font-bold text-neutral-900">{artist.yearsActive || 1}</span>
              </div>
              <p className="text-neutral-600">Years Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Music & Website Links Section */}
      {(artist.website || artist.socialLinks) && (
        <section className="bg-neutral-50 border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap justify-center gap-3">
              {artist.website && (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-white hover:bg-primary-50 border border-neutral-300 hover:border-primary-300 rounded-full px-5 py-2.5 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <Globe className="w-4 h-4 mr-2 text-neutral-600 group-hover:text-primary-600" />
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-primary-700">Website</span>
                </a>
              )}

              {artist.socialLinks?.spotify && (
                <a
                  href={artist.socialLinks.spotify}
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

              {artist.socialLinks?.youtube && (
                <a
                  href={artist.socialLinks.youtube}
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

              {artist.socialLinks?.instagram && (
                <a
                  href={`https://instagram.com/${artist.socialLinks.instagram.replace('@', '')}`}
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

              {artist.socialLinks?.facebook && (
                <a
                  href={artist.socialLinks.facebook}
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
    </>
  );
}