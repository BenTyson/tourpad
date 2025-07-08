import Link from 'next/link';
import { 
  StarIcon, 
  UserGroupIcon,
  MusicalNoteIcon,
  GlobeAltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ArtistMember {
  name: string;
  instrument: string;
}

interface ArtistSocialLinks {
  website?: string;
  spotify?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  patreon?: string;
}

interface ArtistPaymentLinks {
  venmo?: string;
  paypal?: string;
}

interface ArtistProfile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  yearsActive: number;
  members: ArtistMember[];
  tourMonthsPerYear: number;
  tourVehicle: string;
  requireHomeStay: boolean;
  petAllergies?: string;
  dietaryRestrictions?: string;
  travelWithAnimals: boolean;
  ownSoundSystem: boolean;
  socialLinks: ArtistSocialLinks;
  paymentLinks: ArtistPaymentLinks;
  livePerformanceVideo?: string;
  cancellationPolicy: 'strict' | 'flexible';
  cancellationGuarantee?: string;
  rating: number;
  reviewCount: number;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ArtistCardProps {
  artist: ArtistProfile;
  showBookingButton?: boolean;
}

export function ArtistCard({ artist, showBookingButton = false }: ArtistCardProps) {
  const getGenreFromBio = () => {
    // Simple genre extraction - in real app, you'd have a proper genre field
    const genres = ['folk', 'rock', 'indie', 'country', 'blues', 'jazz', 'experimental'];
    const bio = artist.bio.toLowerCase();
    const foundGenre = genres.find(genre => bio.includes(genre));
    return foundGenre || 'music';
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative">
        <div className="aspect-video relative bg-gray-200">
          {artist.livePerformanceVideo ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-600 to-blue-600">
              <MusicalNoteIcon className="w-12 h-12 text-white" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-500 to-purple-600">
              <MusicalNoteIcon className="w-12 h-12 text-white" />
            </div>
          )}
        </div>
        
        {/* Approval status */}
        {artist.approved && (
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1">
            <CheckCircleIcon className="w-4 h-4" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {artist.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="default">
                {getGenreFromBio()}
              </Badge>
              <span className="text-sm text-gray-600">
                {artist.yearsActive} years active
              </span>
            </div>
          </div>

          {/* Band info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1" />
              {artist.members.length} {artist.members.length === 1 ? 'member' : 'members'}
            </div>
            <div className="flex items-center">
              <StarIcon className="w-4 h-4 mr-1" />
              {artist.rating.toFixed(1)} ({artist.reviewCount})
            </div>
          </div>

          {/* Tour info */}
          <div className="flex items-center space-x-2">
            <Badge variant="default">
              {artist.tourMonthsPerYear} months/year touring
            </Badge>
            {artist.requireHomeStay && (
              <Badge variant="warning">
                Needs lodging
              </Badge>
            )}
          </div>

          {/* Bio preview */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {artist.bio}
          </p>

          {/* Social links preview */}
          {(artist.socialLinks.website || artist.socialLinks.spotify) && (
            <div className="flex items-center space-x-2">
              {artist.socialLinks.website && (
                <GlobeAltIcon className="w-4 h-4 text-gray-400" />
              )}
              {artist.socialLinks.spotify && (
                <span className="text-xs text-green-600 font-medium">Spotify</span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link href={`/artists/${artist.id}`}>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </Link>
            {showBookingButton && artist.approved && (
              <Link href={`/bookings/new?artistId=${artist.id}`}>
                <Button size="sm">
                  Book Artist
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}