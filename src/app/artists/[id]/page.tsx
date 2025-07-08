'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  TruckIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockArtists } from '@/data/mockData';

export default function ArtistProfilePage() {
  const params = useParams();
  const artistId = params.id as string;
  
  const artist = mockArtists.find(a => a.id === artistId);

  if (!artist) {
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

  const getGenre = () => {
    const genres = ['folk', 'rock', 'indie', 'country', 'blues', 'jazz', 'experimental'];
    const bio = artist.bio.toLowerCase();
    const foundGenre = genres.find(genre => bio.includes(genre));
    return foundGenre || 'music';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/artists">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Artists
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="h-64 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center relative">
            <MusicalNoteIcon className="w-16 h-16 text-white" />
            {artist.livePerformanceVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button variant="secondary" size="lg" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <PlayIcon className="w-6 h-6 mr-2" />
                  Watch Live Performance
                </Button>
              </div>
            )}
            {artist.approved && (
              <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                <CheckCircleIcon className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {artist.name}
                  </h1>
                  <Badge variant="default" className="text-sm">
                    {getGenre()}
                  </Badge>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  <span>{artist.members.length} {artist.members.length === 1 ? 'member' : 'members'} • {artist.yearsActive} years active</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{artist.rating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">({artist.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/bookings/new?artistId=${artist.id}`}>
                  <Button size="lg" className="px-8">
                    Book Artist
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">About {artist.name}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {artist.bio}
                </p>
                {artist.cancellationGuarantee && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Cancellation Guarantee</h4>
                    <p className="text-sm text-blue-800">{artist.cancellationGuarantee}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Band Members</h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {artist.members.map((member, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <MusicalNoteIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.instrument}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Tour & Logistics</h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Tour Schedule</div>
                        <div className="text-sm text-gray-600">{artist.tourMonthsPerYear} months per year</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <TruckIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Tour Vehicle</div>
                        <div className="text-sm text-gray-600 capitalize">{artist.tourVehicle}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="font-medium mb-2">Requirements</div>
                      <div className="space-y-2">
                        {artist.requireHomeStay && (
                          <Badge variant="warning">Requires lodging</Badge>
                        )}
                        {artist.ownSoundSystem && (
                          <Badge variant="success">Has sound system</Badge>
                        )}
                        {artist.travelWithAnimals && (
                          <Badge variant="default">Travels with pets</Badge>
                        )}
                      </div>
                    </div>

                    {(artist.petAllergies || artist.dietaryRestrictions) && (
                      <div>
                        <div className="font-medium mb-2">Special Notes</div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {artist.petAllergies && (
                            <div>Pet allergies: {artist.petAllergies}</div>
                          )}
                          {artist.dietaryRestrictions && (
                            <div>Dietary: {artist.dietaryRestrictions}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Artist Stats</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="text-sm font-medium">{artist.yearsActive} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cancellation Policy</span>
                    <Badge variant={artist.cancellationPolicy === 'flexible' ? 'success' : 'warning'}>
                      {artist.cancellationPolicy}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="text-sm font-medium">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shows This Year</span>
                    <span className="text-sm font-medium">24</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <h3 className="font-semibold mb-2">Ready to Book?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Send a booking request to {artist.name}
                </p>
                <Link href={`/bookings/new?artistId=${artist.id}`}>
                  <Button className="w-full">
                    Book This Artist
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}