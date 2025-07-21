'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { testHosts } from '@/data/realTestData';

function LodgingBookPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hostId = searchParams.get('hostId');
  const showDate = searchParams.get('showDate');
  const showLocation = searchParams.get('showLocation');
  const showHostId = searchParams.get('showHostId');
  
  const [bookingData, setBookingData] = useState({
    checkIn: showDate || '',
    checkOut: showDate || '',
    guests: 1,
    message: '',
    specialRequirements: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
    contactPhone: '',
    agreeToTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const host = testHosts.find(h => h.id === hostId);
  const showHost = showHostId ? testHosts.find(h => h.id === showHostId) : null;
  
  if (!host || !(host as any).hostingCapabilities?.lodgingHosting?.enabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Host Not Found</h1>
          <p className="text-gray-600">The requested lodging host could not be found.</p>
          <Link href="/lodging/search">
            <Button className="mt-4">Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const lodgingDetails = (host as any).hostingCapabilities.lodgingHosting.lodgingDetails!;
  
  const calculateTotalCost = () => {
    const nights = 1; // For now, assuming 1 night
    const additionalGuests = Math.max(0, bookingData.guests - 1);
    
    return lodgingDetails.pricing.baseRate * nights + 
           (lodgingDetails.pricing.additionalGuestFee || 0) * additionalGuests + 
           (lodgingDetails.pricing.cleaningFee || 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // Basic validation
      const validationErrors: Record<string, string> = {};
      
      if (!bookingData.checkIn) validationErrors.checkIn = 'Check-in date is required';
      if (!bookingData.checkOut) validationErrors.checkOut = 'Check-out date is required';
      if (!bookingData.contactPhone) validationErrors.contactPhone = 'Contact phone is required';
      if (!bookingData.message) validationErrors.message = 'Message is required';
      if (!bookingData.agreeToTerms) validationErrors.agreeToTerms = 'You must agree to the terms';
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      
      // TODO: Submit to backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Lodging booking request submitted successfully! The host will review and respond within 24 hours.');
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ general: 'An error occurred while submitting your booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/lodging/search')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Lodging
          </h1>
          <p className="text-gray-600">
            Request accommodation with {host.name}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Booking Details</h2>
              </CardHeader>
              <CardContent>
                {/* Show Connection Info */}
                {showHost && showLocation && showDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <Info className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-blue-900">Connected to your show</h4>
                        <p className="text-sm text-blue-800">
                          {showDate} performance at {showHost.venueName} in {showLocation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                      <p className="text-red-800">{errors.general}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dates */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Check-in Date"
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.checkIn && (
                        <p className="mt-1 text-sm text-red-600">{errors.checkIn}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        label="Check-out Date"
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                        required
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                      />
                      {errors.checkOut && (
                        <p className="mt-1 text-sm text-red-600">{errors.checkOut}</p>
                      )}
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <Input
                      label="Number of Guests"
                      type="number"
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                      min="1"
                      max={lodgingDetails.bedConfiguration.maxOccupancy}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-600">
                      Maximum {lodgingDetails.bedConfiguration.maxOccupancy} guests
                    </p>
                  </div>

                  {/* Contact */}
                  <div>
                    <Input
                      label="Contact Phone"
                      type="tel"
                      value={bookingData.contactPhone}
                      onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                      required
                      placeholder="For coordination and check-in"
                    />
                    {errors.contactPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message to Host
                    </label>
                    <textarea
                      value={bookingData.message}
                      onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={4}
                      placeholder="Tell the host about your visit, performance details, and any questions..."
                      required
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  {/* Special Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requirements (optional)
                    </label>
                    <textarea
                      value={bookingData.specialRequirements}
                      onChange={(e) => setBookingData({ ...bookingData, specialRequirements: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={2}
                      placeholder="Any specific needs for your stay..."
                    />
                  </div>

                  {/* Dietary Restrictions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dietary Restrictions (optional)
                    </label>
                    <textarea
                      value={bookingData.dietaryRestrictions}
                      onChange={(e) => setBookingData({ ...bookingData, dietaryRestrictions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={2}
                      placeholder="Any dietary restrictions or food allergies..."
                    />
                  </div>

                  {/* Terms */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <h4 className="font-medium mb-1">Booking Policy</h4>
                        <p className="mb-2">
                          This lodging host has a {host.rating} star rating with {host.reviewCount} reviews. 
                          House rules and check-in policies apply.
                        </p>
                        <label className="flex items-center mt-3">
                          <input
                            type="checkbox"
                            checked={bookingData.agreeToTerms}
                            onChange={(e) => setBookingData({ ...bookingData, agreeToTerms: e.target.checked })}
                            className="mr-2"
                            required
                          />
                          <span>I agree to the lodging terms and TourPad's policies</span>
                        </label>
                        {errors.agreeToTerms && (
                          <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting || !bookingData.agreeToTerms}
                  >
                    {isSubmitting ? 'Sending Request...' : 'Send Lodging Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lodging Summary Sidebar */}
          <div className="space-y-6">
            {/* Host Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {host.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{host.venueName}</h3>
                  <p className="text-sm text-gray-600">Hosted by {host.name}</p>
                  <div className="flex items-center justify-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {host.location.city}, {host.location.state}
                  </div>
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{host.rating}</span>
                  <span className="text-gray-500 ml-1">({host.reviewCount} reviews)</span>
                </div>
                
                {/* Room Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Room type:</span>
                    <span className="font-medium">{lodgingDetails.roomType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bathroom:</span>
                    <span className="font-medium">{lodgingDetails.bathroomType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Max guests:</span>
                    <span className="font-medium">{lodgingDetails.bedConfiguration.maxOccupancy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Breakdown */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Pricing</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Base rate (1 night):</span>
                    <span>${lodgingDetails.pricing.baseRate}</span>
                  </div>
                  {bookingData.guests > 1 && lodgingDetails.pricing.additionalGuestFee && (
                    <div className="flex justify-between">
                      <span>Additional guests ({bookingData.guests - 1}):</span>
                      <span>${lodgingDetails.pricing.additionalGuestFee * (bookingData.guests - 1)}</span>
                    </div>
                  )}
                  {lodgingDetails.pricing.cleaningFee && (
                    <div className="flex justify-between">
                      <span>Cleaning fee:</span>
                      <span>${lodgingDetails.pricing.cleaningFee}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${calculateTotalCost()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* House Rules */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">House Rules</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Check-in: {lodgingDetails.houseRules.checkInTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Check-out: {lodgingDetails.houseRules.checkOutTime}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Quiet hours:</span>
                    <span>{lodgingDetails.houseRules.quietHours.start} - {lodgingDetails.houseRules.quietHours.end}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Smoking:</span>
                    <span>{lodgingDetails.houseRules.smokingPolicy.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Pets:</span>
                    <span>{lodgingDetails.houseRules.petPolicy.replace('_', ' ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LodgingBookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <LodgingBookPageContent />
    </Suspense>
  );
}