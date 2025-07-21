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
          <div className="flex items-center mb-4">
            <Link href="/admin" className="mr-4">
              <ArrowLeftIcon className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          </div>
          <p className="text-gray-600">Review and approve new artist and host applications</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilter('all')}
            >
              All ({applications.length})
            </Button>
            <Button
              variant={filter === 'host' ? 'primary' : 'secondary'}
              onClick={() => setFilter('host')}
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Hosts ({applications.filter(a => a.userType.toLowerCase() === 'host').length})
            </Button>
            <Button
              variant={filter === 'artist' ? 'primary' : 'secondary'}
              onClick={() => setFilter('artist')}
            >
              <MusicalNoteIcon className="w-4 h-4 mr-2" />
              Artists ({applications.filter(a => a.userType.toLowerCase() === 'artist').length})
            </Button>
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
                        <h3 className="text-lg font-semibold text-gray-900">{application.name}</h3>
                        <p className="text-sm text-gray-600">{application.email}</p>
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
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><span className="font-medium">Submitted:</span> {new Date(application.createdAt).toLocaleDateString()}</p>
                          {application.profile?.phone && (
                            <p><span className="font-medium">Phone:</span> {application.profile.phone}</p>
                          )}
                          {application.profile?.bio && (
                            <p><span className="font-medium">Bio:</span> {application.profile.bio}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Type-Specific Info */}
                    <div className="space-y-4">
                      {application.userType.toLowerCase() === 'host' && (application as Host).host && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Venue Information</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>
                              <MapPinIcon className="w-4 h-4 inline mr-1" />
                              <span className="font-medium">Location:</span> {(application as Host).host?.city}, {(application as Host).host?.state}
                            </p>
                            <p><span className="font-medium">Venue Type:</span> {(application as Host).host?.venueType}</p>
                            {(application as Host).host?.venueName && (
                              <p><span className="font-medium">Venue Name:</span> {(application as Host).host?.venueName}</p>
                            )}
                            {(application as Host).host?.indoorCapacity && (
                              <p><span className="font-medium">Indoor Capacity:</span> {(application as Host).host?.indoorCapacity} people</p>
                            )}
                            {(application as Host).host?.venueDescription && (
                              <p><span className="font-medium">Motivation to Host:</span> {(application as Host).host?.venueDescription}</p>
                            )}
                            {(application as Host).host?.lodgingDetails && typeof (application as Host).host?.lodgingDetails === 'object' && (
                              <>
                                {/* Additional Information */}
                                {((application as Host).host?.lodgingDetails as any)?.additionalInfo && (
                                  <p><span className="font-medium">Additional Information:</span> {((application as Host).host?.lodgingDetails as any).additionalInfo}</p>
                                )}
                                
                                {/* First time hosting question */}
                                {((application as Host).host?.lodgingDetails as any)?.newToHosting && (
                                  <p><span className="font-medium">Is this your first time hosting?:</span> {((application as Host).host?.lodgingDetails as any).newToHosting}</p>
                                )}
                                
                                {/* Debug info - remove after testing */}
                                <p><span className="font-medium text-red-600">Debug - lodgingDetails keys:</span> {Object.keys((application as Host).host?.lodgingDetails || {}).join(', ')}</p>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {application.userType.toLowerCase() === 'artist' && (application as Artist).artist && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Artist Information</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            {(application as Artist).artist?.stageName && (
                              <p><span className="font-medium">Stage Name:</span> {(application as Artist).artist?.stageName}</p>
                            )}
                            {(application as Artist).artist?.genres && (application as Artist).artist?.genres?.length > 0 && (
                              <p><span className="font-medium">Genres:</span> {(application as Artist).artist?.genres?.join(', ')}</p>
                            )}
                            {(application as Artist).artist?.performanceVideoUrl && (
                              <p><span className="font-medium">Performance Video:</span> 
                                <a href={(application as Artist).artist?.performanceVideoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                  View Video
                                </a>
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photos Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4">Submitted Photos</h4>
                    
                    {/* Host Photos */}
                    {application.userType.toLowerCase() === 'host' && (application as Host).host && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">Venue Photos</h5>
                        {(() => {
                          const host = (application as Host).host!;
                          const venuePhotos: any[] = [];
                          
                          // Add venue photo URL if exists (convert to Photo format)
                          if (host.venuePhotoUrl) {
                            venuePhotos.push({
                              id: 'venue-main',
                              url: host.venuePhotoUrl,
                              alt: 'Main venue photo',
                              category: 'house'
                            });
                          }
                          
                          // Add media items (convert HostMedia to Photo format)
                          if (host.media && host.media.length > 0) {
                            host.media.forEach((media: any, index: number) => {
                              venuePhotos.push({
                                id: media.id || `media-${index}`,
                                url: media.fileUrl,
                                alt: media.title || `Venue photo ${index + 1}`,
                                category: media.category || 'house'
                              });
                            });
                          }
                          
                          console.log('Host media data:', host.media);
                          console.log('Formatted venue photos:', venuePhotos);
                          
                          return venuePhotos.length > 0 ? (
                            <PhotoGallery photos={venuePhotos} onPhotoClick={(index) => console.log('Photo clicked:', index)} />
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <PhotoIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                              <p className="text-sm">No venue photos uploaded during application</p>
                              <p className="text-xs text-gray-400 mt-1">Host can add photos after approval via their dashboard</p>
                              <p className="text-xs text-red-500 mt-1">Debug: host.media = {JSON.stringify(host.media)}</p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Artist Photos */}
                    {application.userType.toLowerCase() === 'artist' && (application as Artist).artist && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">Artist Photos</h5>
                        {(() => {
                          const artist = (application as Artist).artist!;
                          const artistPhotos = [];
                          
                          // Add press photo URL if exists
                          if (artist.pressPhotoUrl) {
                            artistPhotos.push(artist.pressPhotoUrl);
                          }
                          
                          // Add media items (profile and promotional categories)
                          if (artist.media) {
                            artistPhotos.push(...artist.media);
                          }
                          
                          return artistPhotos.length > 0 ? (
                            <PhotoGallery photos={artistPhotos} title="Artist Photos" />
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <PhotoIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                              <p className="text-sm">No artist photos uploaded during application</p>
                              <p className="text-xs text-gray-400 mt-1">Artist can add photos after approval via their dashboard</p>
                            </div>
                          );
                        })()}

                        {/* Band Member Photos */}
                        {(application as Artist).artist?.bandMembers && (application as Artist).artist?.bandMembers?.length > 0 && (
                          <div className="mt-6">
                            <h5 className="font-medium text-gray-700 mb-3">Band Member Photos</h5>
                            {(() => {
                              const bandMemberPhotos = (application as Artist).artist?.bandMembers
                                ?.filter(member => member.photoUrl)
                                .map(member => member.photoUrl!) || [];
                              
                              return bandMemberPhotos.length > 0 ? (
                                <PhotoGallery photos={bandMemberPhotos} title="Band Member Photos" />
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  <PhotoIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                  <p className="text-sm">No band member photos uploaded</p>
                                </div>
                              );
                            })()}
                          </div>
                        )}
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
      </div>
    </div>
  );
}