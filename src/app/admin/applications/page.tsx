'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  CheckIcon, 
  XMarkIcon, 
  UserIcon, 
  HomeIcon, 
  MusicalNoteIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowLeftIcon,
  PhotoIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
  status: string;
  createdAt: string;
  profile?: {
    bio?: string;
    phone?: string;
    socialLinks?: any;
  };
}

interface MediaItem {
  id: string;
  fileUrl: string;
  title?: string;
  category?: string;
  mediaType: string;
}

interface BandMember {
  id: string;
  name: string;
  instrument?: string;
  role?: string;
  photoUrl?: string;
}

interface Host extends User {
  host?: {
    city: string;
    state: string;
    venueType: string;
    venueName?: string;
    venueDescription?: string;
    indoorCapacity?: number;
    outdoorCapacity?: number;
    venuePhotoUrl?: string;
    applicationSubmittedAt?: string;
    media?: MediaItem[];
    lodgingDetails?: any;
  };
}

interface Artist extends User {
  artist?: {
    stageName?: string;
    genres: string[];
    performanceVideoUrl?: string;
    pressPhotoUrl?: string;
    applicationSubmittedAt?: string;
    media?: MediaItem[];
    bandMembers?: BandMember[];
  };
}

type Application = Host | Artist;

// Helper function to convert video URLs to embed format
const getVideoEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  return null;
};

// Photo Gallery Component
const PhotoGallery = ({ photos, title }: { photos: (MediaItem | string)[], title: string }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <PhotoIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">No {title.toLowerCase()} uploaded</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h5 className="font-medium text-gray-900 flex items-center">
        <PhotoIcon className="w-4 h-4 mr-2" />
        {title} ({photos.length})
      </h5>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {photos.map((photo, index) => {
          const photoUrl = typeof photo === 'string' ? photo : photo.fileUrl;
          const photoTitle = typeof photo === 'object' ? photo.title : undefined;
          
          
          return (
            <div key={index} className="relative group">
              <img
                src={photoUrl}
                alt={photoTitle || `${title} ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => setSelectedPhoto(photoUrl)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                <EyeIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {photoTitle && (
                <p className="text-xs text-gray-600 mt-1 truncate">{photoTitle}</p>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto}
              alt="Full size view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'host' | 'artist'>('all');
  const [selectedPhotos, setSelectedPhotos] = useState<any[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (photos: any[], startIndex: number) => {
    setSelectedPhotos(photos);
    setCurrentPhotoIndex(startIndex);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedPhotos([]);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % selectedPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length);
  };

  const handleApprove = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${userId}/approve`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${userId}/reject`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.userType.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <Link href="/admin" className="mr-4">
              <ArrowLeftIcon className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('all')}
            >
              All ({applications.length})
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                filter === 'host' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('host')}
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Hosts ({applications.filter(a => a.userType.toLowerCase() === 'host').length})
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                filter === 'artist' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('artist')}
            >
              <MusicalNoteIcon className="w-4 h-4 mr-2" />
              Artists ({applications.filter(a => a.userType.toLowerCase() === 'artist').length})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No pending applications at this time.' 
                  : `No pending ${filter} applications at this time.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {application.userType.toLowerCase() === 'host' ? (
                        <HomeIcon className="w-6 h-6 text-blue-600" />
                      ) : (
                        <MusicalNoteIcon className="w-6 h-6 text-purple-600" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.userType.toLowerCase() === 'artist' && (application as Artist).artist?.stageName
                            ? (application as Artist).artist?.stageName
                            : application.name
                          }
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>{application.email}</span>
                          <span>•</span>
                          <span>Submitted: {new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="warning">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                      <Badge variant="secondary">
                        {application.userType.toLowerCase() === 'host' ? 'Host' : 'Artist'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Top Section - Application Info */}
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {application.profile?.phone && (
                        <div>
                          <span className="font-medium text-gray-900">Phone:</span>
                          <p className="text-gray-600">{application.profile.phone}</p>
                        </div>
                      )}
                      {application.profile?.bio && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-900">Bio:</span>
                          <p className="text-gray-600 leading-relaxed">{application.profile.bio}</p>
                        </div>
                      )}
                    </div>

                    {/* Type-Specific Info */}
                    <div>
                      {application.userType.toLowerCase() === 'host' && (application as Host).host && (
                        <div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3 text-sm">
                              <div className="flex items-start">
                                <MapPinIcon className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-gray-900">Location:</span>
                                  <p className="text-gray-600">{(application as Host).host?.city}, {(application as Host).host?.state}</p>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">Venue Type:</span>
                                <p className="text-gray-600">{(application as Host).host?.venueType}</p>
                              </div>
                              {(application as Host).host?.venueName && (
                                <div>
                                  <span className="font-medium text-gray-900">Venue Name:</span>
                                  <p className="text-gray-600">{(application as Host).host?.venueName}</p>
                                </div>
                              )}
                              {(application as Host).host?.indoorCapacity && (
                                <div>
                                  <span className="font-medium text-gray-900">Indoor Capacity:</span>
                                  <p className="text-gray-600">{(application as Host).host?.indoorCapacity} people</p>
                                </div>
                              )}
                              {(application as Host).host?.outdoorCapacity && (
                                <div>
                                  <span className="font-medium text-gray-900">Outdoor Capacity:</span>
                                  <p className="text-gray-600">{(application as Host).host?.outdoorCapacity} people</p>
                                </div>
                              )}
                              {(application as Host).host?.preferredGenres && ((application as Host).host?.preferredGenres?.length || 0) > 0 && (
                                <div>
                                  <span className="font-medium text-gray-900">Preferred Music Genres:</span>
                                  <p className="text-gray-600">{(application as Host).host?.preferredGenres?.join(', ')}</p>
                                </div>
                              )}
                              {(application as Host).host?.soundSystem && (
                                <div>
                                  <span className="font-medium text-gray-900">Sound System:</span>
                                  <p className="text-gray-600 capitalize">
                                    {typeof (application as Host).host?.soundSystem === 'object' 
                                      ? ((application as Host).host?.soundSystem as any)?.type || 'Not specified'
                                      : (application as Host).host?.soundSystem}
                                  </p>
                                </div>
                              )}
                              {(application as Host).host?.hostingExperience !== undefined && (
                                <div>
                                  <span className="font-medium text-gray-900">New to Hosting:</span>
                                  <p className="text-gray-600">{(application as Host).host?.hostingExperience === 0 ? 'Yes' : 'No'}</p>
                                </div>
                              )}
                            </div>
                            <div className="space-y-3 text-sm">
                              {(application as Host).host?.venueDescription && (
                                <div>
                                  <span className="font-medium text-gray-900">Motivation to Host:</span>
                                  <p className="text-gray-600 leading-relaxed">{(application as Host).host?.venueDescription}</p>
                                </div>
                              )}
                              {(application as Host).host?.amenities && ((application as Host).host?.amenities?.length || 0) > 0 && (
                                <div>
                                  <span className="font-medium text-gray-900">Amenities:</span>
                                  <p className="text-gray-600">{(application as Host).host?.amenities?.join(', ')}</p>
                                </div>
                              )}
                              {(application as Host).host?.houseRules && (
                                <div>
                                  <span className="font-medium text-gray-900">House Rules:</span>
                                  <p className="text-gray-600 leading-relaxed">{(application as Host).host?.houseRules}</p>
                                </div>
                              )}
                              {(application as Host).host?.lodgingDetails && typeof (application as Host).host?.lodgingDetails === 'object' && ((application as Host).host?.lodgingDetails as any)?.additionalInfo && (
                                <div>
                                  <span className="font-medium text-gray-900">Additional Information:</span>
                                  <p className="text-gray-600 leading-relaxed">{((application as Host).host?.lodgingDetails as any).additionalInfo}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {application.userType.toLowerCase() === 'artist' && (application as Artist).artist && (
                        <div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-medium text-gray-900">Personal Name:</span>
                                <p className="text-gray-600">{application.name}</p>
                              </div>
                              {(application as Artist).artist?.genres && ((application as Artist).artist?.genres?.length || 0) > 0 && (
                                <div>
                                  <span className="font-medium text-gray-900">Genres:</span>
                                  <p className="text-gray-600">{(application as Artist).artist?.genres?.join(', ')}</p>
                                </div>
                              )}
                              {/* Social Media Links */}
                              {application.profile?.socialLinks && (
                                <div>
                                  <span className="font-medium text-gray-900">Social Media:</span>
                                  <div className="flex flex-col space-y-1 mt-1">
                                    {typeof application.profile.socialLinks === 'object' && application.profile.socialLinks && (
                                      <>
                                        {(application.profile.socialLinks as any).facebook && (
                                          <a href={(application.profile.socialLinks as any).facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                            Facebook
                                          </a>
                                        )}
                                        {(application.profile.socialLinks as any).instagram && (
                                          <a href={(application.profile.socialLinks as any).instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                            Instagram
                                          </a>
                                        )}
                                        {(application.profile.socialLinks as any).spotify && (
                                          <a href={(application.profile.socialLinks as any).spotify} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                            Spotify
                                          </a>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="space-y-3">
                              {/* Performance Video */}
                              {(application as Artist).artist?.performanceVideoUrl && (
                                <div>
                                  <span className="font-medium text-gray-900 block mb-1">Performance Video:</span>
                                  {(() => {
                                    const embedUrl = getVideoEmbedUrl((application as Artist).artist?.performanceVideoUrl || '');
                                    return embedUrl ? (
                                      <div className="w-full aspect-video">
                                        <iframe
                                          src={embedUrl}
                                          className="w-full h-full rounded-lg border border-gray-200"
                                          frameBorder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                        ></iframe>
                                      </div>
                                    ) : (
                                      <a href={(application as Artist).artist?.performanceVideoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                        View Video (External Link)
                                      </a>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photos Section */}
                  <div className="pt-6">
                    
                    {/* Host Photos */}
                    {application.userType.toLowerCase() === 'host' && (application as Host).host && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">Venue Photos</h5>
                        {((application as Host).host?.media && ((application as Host).host?.media?.length || 0) > 0) ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {(application as Host).host?.media?.map((media: any, index: number) => (
                              <div key={index} className="relative">
                                <img 
                                  src={media.fileUrl}
                                  alt={media.title || `Venue photo ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                                  onClick={() => {
                                    console.log('Photo clicked, opening lightbox');
                                    openLightbox((application as Host).host?.media || [], index);
                                  }}
                                />
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                  {index + 1} / {(application as Host).host?.media?.length || 0}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            <PhotoIcon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">No venue photos uploaded</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Artist Photos */}
                    {application.userType.toLowerCase() === 'artist' && (application as Artist).artist && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">Artist Photos</h5>
                        {((application as Artist).artist?.media && ((application as Artist).artist?.media?.length || 0) > 0) ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {(application as Artist).artist?.media?.map((media: any, index: number) => (
                              <div key={index} className="relative">
                                <img 
                                  src={media.fileUrl}
                                  alt={media.title || `Artist photo ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                                  onClick={() => {
                                    console.log('Artist photo clicked, opening lightbox');
                                    openLightbox((application as Artist).artist?.media || [], index);
                                  }}
                                />
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                  {index + 1} / {(application as Artist).artist?.media?.length || 0}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            <PhotoIcon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">No artist photos uploaded</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Band Member Photos */}
                    {(application as Artist).artist?.bandMembers && ((application as Artist).artist?.bandMembers?.length || 0) > 0 && (
                      <div className="mt-6">
                        <h5 className="font-medium text-gray-700 mb-3">Band Member Photos</h5>
                        {(() => {
                          const bandMembersWithPhotos = (application as Artist).artist?.bandMembers?.filter(member => member.photoUrl) || [];
                          
                          return bandMembersWithPhotos.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {bandMembersWithPhotos.map((member: any, index: number) => (
                                <div key={index} className="relative">
                                  <img 
                                    src={member.photoUrl}
                                    alt={`${member.name} - ${member.instrument || 'Band member'}`}
                                    className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                                    onClick={() => {
                                      console.log('Band member photo clicked');
                                      openLightbox(bandMembersWithPhotos.map(m => ({ fileUrl: m.photoUrl, title: `${m.name} - ${m.instrument || 'Band member'}` })), index);
                                    }}
                                  />
                                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                    {member.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              <PhotoIcon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm">No band member photos uploaded</p>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="secondary"
                        onClick={() => handleReject(application.id)}
                      >
                        <XMarkIcon className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        variant="primary"
                        onClick={() => handleApprove(application.id)}
                      >
                        <CheckIcon className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {showLightbox && selectedPhotos.length > 0 && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={closeLightbox}
          >
            <div className="relative max-w-6xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Navigation Arrows */}
              {selectedPhotos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors"
                  >
                    <ArrowLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors"
                  >
                    <ArrowLeftIcon className="w-6 h-6 transform rotate-180" />
                  </button>
                </>
              )}

              {/* Main Image */}
              <img
                src={selectedPhotos[currentPhotoIndex]?.fileUrl}
                alt={selectedPhotos[currentPhotoIndex]?.title || `Photo ${currentPhotoIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />

              {/* Photo Counter */}
              {selectedPhotos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full">
                  {currentPhotoIndex + 1} of {selectedPhotos.length}
                </div>
              )}

              {/* Photo Info */}
              {selectedPhotos[currentPhotoIndex]?.title && (
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded max-w-md">
                  <p className="text-sm">{selectedPhotos[currentPhotoIndex].title}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}