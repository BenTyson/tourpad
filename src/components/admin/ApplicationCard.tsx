'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  CheckIcon,
  XMarkIcon,
  HomeIcon,
  MusicalNoteIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { PhotoGallery } from './PhotoGallery';

interface MediaItem {
  fileUrl: string;
  title?: string;
}

interface BandMember {
  id: string;
  name: string;
  instrument?: string;
  role?: string;
  photoUrl?: string;
}

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
    preferredGenres?: string[];
    soundSystem?: any;
    hostingExperience?: number;
    amenities?: string[];
    houseRules?: string;
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

interface ApplicationCardProps {
  application: Application;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onPhotoClick: (photos: MediaItem[], index: number) => void;
  getVideoEmbedUrl: (url: string) => string | null;
}

export function ApplicationCard({
  application,
  onApprove,
  onReject,
  onPhotoClick,
  getVideoEmbedUrl
}: ApplicationCardProps) {
  const isHost = application.userType.toLowerCase() === 'host';
  const isArtist = application.userType.toLowerCase() === 'artist';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isHost ? (
              <HomeIcon className="w-6 h-6 text-blue-600" />
            ) : (
              <MusicalNoteIcon className="w-6 h-6 text-purple-600" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isArtist && (application as Artist).artist?.stageName
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
              {isHost ? 'Host' : 'Artist'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Basic Info */}
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

          {/* Host-Specific Details */}
          {isHost && (application as Host).host && (
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
          )}

          {/* Artist-Specific Details */}
          {isArtist && (application as Artist).artist && (
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
          )}

          {/* Photos Section */}
          <div className="pt-6">
            {/* Host Photos */}
            {isHost && (application as Host).host?.media && (
              <PhotoGallery
                title="Venue Photos"
                photos={(application as Host).host?.media || []}
                onPhotoClick={onPhotoClick}
                emptyMessage="No venue photos uploaded"
              />
            )}

            {/* Artist Photos */}
            {isArtist && (application as Artist).artist?.media && (
              <PhotoGallery
                title="Artist Photos"
                photos={(application as Artist).artist?.media || []}
                onPhotoClick={onPhotoClick}
                emptyMessage="No artist photos uploaded"
              />
            )}

            {/* Band Member Photos */}
            {isArtist && (application as Artist).artist?.bandMembers && ((application as Artist).artist?.bandMembers?.length || 0) > 0 && (
              <div className="mt-6">
                <PhotoGallery
                  title="Band Member Photos"
                  photos={
                    (application as Artist).artist?.bandMembers
                      ?.filter(member => member.photoUrl)
                      ?.map(member => ({
                        fileUrl: member.photoUrl!,
                        title: `${member.name} - ${member.instrument || 'Band member'}`
                      })) || []
                  }
                  onPhotoClick={onPhotoClick}
                  emptyMessage="No band member photos uploaded"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => onReject(application.id)}>
                <XMarkIcon className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button variant="primary" onClick={() => onApprove(application.id)}>
                <CheckIcon className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}