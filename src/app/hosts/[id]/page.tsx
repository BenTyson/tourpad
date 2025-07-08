'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPinIcon,
  StarIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HomeIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockHosts } from '@/data/mockData';

export default function HostProfilePage() {
  const params = useParams();
  const hostId = params.id as string;
  
  const host = mockHosts.find(h => h.id === hostId);

  if (!host) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Host Not Found</h1>
          <Link href="/hosts">
            <Button>Back to Hosts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/hosts">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Hosts
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Hero Image */}
          <div className="h-64 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
            <HomeIcon className="w-16 h-16 text-white" />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {host.name}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span>{host.city}, {host.state}</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{host.rating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">({host.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/bookings/new?hostId=${host.id}`}>
                  <Button size="lg" className="px-8">
                    Request Booking
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
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">About the Venue</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {host.bio}
                </p>
              </CardContent>
            </Card>

            {/* Show Specifications */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Show Details</h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <UserGroupIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Typical Attendance</div>
                        <div className="text-sm text-gray-600">{host.showSpecs.avgAttendance} people</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Door Fee</div>
                        <div className="text-sm text-gray-600">${host.showSpecs.avgDoorFee}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Show Duration</div>
                        <div className="text-sm text-gray-600">{host.showSpecs.showDurationMins} minutes</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <HomeIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Venue Type</div>
                        <div className="text-sm text-gray-600 capitalize">{host.showSpecs.performanceLocation}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Shows per Year</div>
                        <div className="text-sm text-gray-600">{host.showSpecs.estimatedShowsPerYear}</div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Show Format</div>
                      <div className="text-sm text-gray-600">{host.showSpecs.showFormat}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="font-medium mb-2">Available Days</div>
                  <div className="flex flex-wrap gap-2">
                    {host.showSpecs.daysAvailable.map((day) => (
                      <Badge key={day} variant="default">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capacity Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Capacity</h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {host.showSpecs.indoorAttendanceMax}
                    </div>
                    <div className="text-sm text-blue-800">Indoor Maximum</div>
                  </div>
                  {host.showSpecs.outdoorAttendanceMax > 0 && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {host.showSpecs.outdoorAttendanceMax}
                      </div>
                      <div className="text-sm text-green-800">Outdoor Maximum</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Amenities */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Amenities</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries({
                    powerAccess: 'Power Access',
                    airConditioning: 'Air Conditioning',
                    wifi: 'WiFi',
                    kidFriendly: 'Kid Friendly',
                    adultsOnly: 'Adults Only',
                    parking: 'Parking',
                    petFriendly: 'Pet Friendly',
                    soundSystem: 'Sound System',
                    outdoorSpace: 'Outdoor Space',
                    accessible: 'Wheelchair Accessible',
                    bnbOffered: 'Overnight Stay Available'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center">
                      {host.amenities[key as keyof typeof host.amenities] ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3"></div>
                      )}
                      <span className={`text-sm ${
                        host.amenities[key as keyof typeof host.amenities] 
                          ? 'text-gray-900' 
                          : 'text-gray-400'
                      }`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Host Stats</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="text-sm font-medium">{host.showSpecs.hostingHistory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium">Within 2 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <Card>
              <CardContent className="text-center p-6">
                <h3 className="font-semibold mb-2">Ready to Book?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Send a booking request to start planning your show
                </p>
                <Link href={`/bookings/new?hostId=${host.id}`}>
                  <Button className="w-full">
                    Request Booking
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