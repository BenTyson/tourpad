'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin,
  Star,
  Users,
  Calendar,
  DollarSign,
  Bed,
  Car,
  Wifi,
  Coffee,
  Home,
  ArrowLeft,
  Search,
  Filter,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { testHosts } from '@/data/realTestData';

function LodgingSearchContent() {
  const searchParams = useSearchParams();
  const showDate = searchParams.get('showDate');
  const showLocation = searchParams.get('showLocation');
  const showHostId = searchParams.get('showHostId');
  
  const [searchFilters, setSearchFilters] = useState({
    maxDistance: 25,
    maxPrice: 100,
    minRating: 4.0,
    amenities: [] as string[],
    checkIn: showDate || '',
    checkOut: showDate || '',
    guests: 1
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Get lodging hosts (both lodging-only and hybrid hosts that offer lodging)
  const lodgingHosts = testHosts.filter(host => 
    host.hostingCapabilities?.lodgingHosting?.enabled && 
    host.hostingCapabilities?.lodgingHosting?.lodgingDetails
  );
  
  // Filter hosts based on search criteria
  const filteredHosts = lodgingHosts.filter(host => {
    const lodgingDetails = host.hostingCapabilities.lodgingHosting.lodgingDetails!;
    
    // Price filter
    if (lodgingDetails.pricing.baseRate > searchFilters.maxPrice) return false;
    
    // Rating filter
    if (host.rating < searchFilters.minRating) return false;
    
    // Exclude the show host if specified
    if (showHostId && host.id === showHostId) return false;
    
    return true;
  });
  
  const calculateDistance = (host: any) => {
    // Mock distance calculation - in real app would use coordinates
    // For now, simulate realistic distances based on location
    const currentShowLocation = showLocation || 'Nashville, TN';
    const hostLocation = `${host.location.city}, ${host.location.state}`;
    
    // Same city = 1-10 miles
    if (host.location.city === currentShowLocation.split(',')[0]?.trim()) {
      return Math.floor(Math.random() * 10) + 1;
    }
    
    // Different city, same state = 15-50 miles
    if (host.location.state === currentShowLocation.split(',')[1]?.trim()) {
      return Math.floor(Math.random() * 35) + 15;
    }
    
    // Different state = 50-200 miles
    return Math.floor(Math.random() * 150) + 50;
  };
  
  const calculateTotalCost = (host: any) => {
    const lodgingDetails = host.hostingCapabilities.lodgingHosting.lodgingDetails!;
    const nights = 1; // Assuming 1 night for now
    const additionalGuests = Math.max(0, searchFilters.guests - 1);
    
    return lodgingDetails.pricing.baseRate * nights + 
           (lodgingDetails.pricing.additionalGuestFee || 0) * additionalGuests + 
           (lodgingDetails.pricing.cleaningFee || 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Lodging Near Your Show
          </h1>
          <p className="text-gray-600">
            {showLocation && showDate 
              ? `Accommodation options for your ${showDate} show in ${showLocation}`
              : 'Comfortable accommodation options for touring artists'
            }
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <Input
                    label="Check-in Date"
                    type="date"
                    value={searchFilters.checkIn}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, checkIn: e.target.value }))}
                  />
                  <Input
                    label="Check-out Date"
                    type="date"
                    value={searchFilters.checkOut}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, checkOut: e.target.value }))}
                  />
                  <Input
                    label="Guests"
                    type="number"
                    min="1"
                    max="10"
                    value={searchFilters.guests}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  />
                  <Input
                    label="Max Distance (miles)"
                    type="number"
                    min="1"
                    max="100"
                    value={searchFilters.maxDistance}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
              
              {/* Extended Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Max Price per Night"
                      type="number"
                      min="0"
                      max="500"
                      value={searchFilters.maxPrice}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                    />
                    <Input
                      label="Minimum Rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={searchFilters.minRating}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amenities
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Breakfast', 'WiFi', 'Parking', 'Kitchen Access', 'Laundry'].map(amenity => (
                          <button
                            key={amenity}
                            onClick={() => {
                              const newAmenities = searchFilters.amenities.includes(amenity)
                                ? searchFilters.amenities.filter(a => a !== amenity)
                                : [...searchFilters.amenities, amenity];
                              setSearchFilters(prev => ({ ...prev, amenities: newAmenities }));
                            }}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                              searchFilters.amenities.includes(amenity)
                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredHosts.length} accommodation{filteredHosts.length !== 1 ? 's' : ''} found
          </h2>
          <div className="text-sm text-gray-600">
            Sorted by distance
          </div>
        </div>

        {/* Lodging Results */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHosts.map(host => {
            const lodgingDetails = host.hostingCapabilities.lodgingHosting.lodgingDetails!;
            const distance = calculateDistance(host);
            const totalCost = calculateTotalCost(host);
            
            return (
              <Card key={host.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Photo */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={lodgingDetails.lodgingPhotos[0]?.url || 'https://picsum.photos/400/300?random=1'}
                      alt={host.venueName}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{host.venueName}</h3>
                        <p className="text-sm text-gray-600">Hosted by {host.name}</p>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="font-medium">{host.rating}</span>
                        <span className="text-gray-500 ml-1">({host.reviewCount})</span>
                      </div>
                    </div>
                    
                    {/* Location and Distance */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{host.location.city}, {host.location.state}</span>
                      <span className="mx-2">•</span>
                      <span>{distance} miles away</span>
                    </div>
                    
                    {/* Room Details */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{lodgingDetails.roomType.replace('_', ' ')}</span>
                      <span className="mx-2">•</span>
                      <Users className="w-4 h-4 mr-1" />
                      <span>{lodgingDetails.bedConfiguration.maxOccupancy} guests</span>
                    </div>
                    
                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lodgingDetails.amenities.wifi && (
                        <Badge variant="secondary" className="text-xs">
                          <Wifi className="w-3 h-3 mr-1" />
                          WiFi
                        </Badge>
                      )}
                      {lodgingDetails.amenities.breakfast && (
                        <Badge variant="secondary" className="text-xs">
                          <Coffee className="w-3 h-3 mr-1" />
                          Breakfast
                        </Badge>
                      )}
                      {lodgingDetails.amenities.parking && (
                        <Badge variant="secondary" className="text-xs">
                          <Car className="w-3 h-3 mr-1" />
                          Parking
                        </Badge>
                      )}
                      {lodgingDetails.amenities.kitchenAccess && (
                        <Badge variant="secondary" className="text-xs">
                          <Home className="w-3 h-3 mr-1" />
                          Kitchen
                        </Badge>
                      )}
                    </div>
                    
                    {/* Pricing and Book Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          ${totalCost}
                        </div>
                        <div className="text-sm text-gray-600">
                          ${lodgingDetails.pricing.baseRate}/night
                        </div>
                      </div>
                      <Link 
                        href={`/lodging/book?hostId=${host.id}&showDate=${showDate}&showLocation=${showLocation}&showHostId=${showHostId}`}
                      >
                        <Button size="sm">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredHosts.length === 0 && (
          <div className="text-center py-12">
            <Bed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No accommodation found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or expanding your search radius
            </p>
            <Button onClick={() => setShowFilters(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Adjust Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LodgingSearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LodgingSearchContent />
    </Suspense>
  );
}