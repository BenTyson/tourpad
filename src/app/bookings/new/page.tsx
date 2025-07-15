'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockHosts, mockArtists } from '@/data/mockData';
import { apiClient, handleApiResponse } from '@/lib/api-client';
import { validateData, bookingSchema } from '@/lib/validation';

function NewBookingForm() {
  const searchParams = useSearchParams();
  const hostId = searchParams.get('hostId');
  const artistId = searchParams.get('artistId');
  
  // Determine booking type and get relevant data
  const isHostBookingArtist = !!artistId; // Host is booking an artist
  const isArtistBookingHost = !!hostId;   // Artist is booking a host
  
  const host = hostId ? mockHosts.find(h => h.id === hostId) : null;
  const artist = artistId ? mockArtists.find(a => a.id === artistId) : null;

  const [formData, setFormData] = useState({
    eventDate: '',
    eventTime: '19:00',
    expectedGuests: host?.showSpecs.avgAttendance || 25,
    doorFee: host?.showSpecs.avgDoorFee || 15,
    message: '',
    specialRequirements: '',
    contactPhone: '',
    agreeToTerms: false,
    // New lodging fields
    needsLodging: false,
    lodgingDetails: {
      guestCount: 1,
      arrivalDate: '',
      departureDate: '',
      specialRequirements: '',
      dietaryRestrictions: '',
      accessibilityNeeds: ''
    }
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  if (!host && !artist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking Request</h1>
          <p className="text-gray-600 mb-4">Please select a host or artist to book.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setErrors([]);
    
    try {
      // Prepare booking data
      const eventDateTime = `${formData.eventDate}T${formData.eventTime}:00.000Z`;
      const duration = 120; // Default 2 hours, could be made configurable
      
      const bookingData = {
        artistId: artistId || 'current-artist-id', // Would come from session
        hostId: hostId || 'current-host-id', // Would come from session
        eventDate: eventDateTime,
        duration,
        message: formData.message
      };
      
      // Validate data
      const validation = validateData(bookingSchema, bookingData);
      if (!validation.success) {
        setErrors(validation.errors || ['Invalid booking data']);
        return;
      }
      
      // Submit to API
      const response = await apiClient.createBooking(validation.data);
      
      await handleApiResponse(
        response,
        (data) => {
          console.log('Booking created:', data);
          setShowConfirmation(true);
        },
        (error, apiErrors) => {
          setErrors(apiErrors || [error]);
        }
      );
      
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors(['Failed to create booking. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h1>
            <p className="text-gray-600 mb-6">
              {isHostBookingArtist 
                ? `Your booking request has been sent to ${artist?.name}. They'll respond within 24-48 hours.`
                : `Your booking request has been sent to ${host?.name}. They'll review and respond soon.`
              }
            </p>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full">View Dashboard</Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" className="w-full">Go to Messages</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profileData = host || artist;
  const profileType = host ? 'host' : 'artist';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={profileType === 'host' ? `/hosts/${hostId}` : `/artists/${artistId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isHostBookingArtist ? 'Book This Artist' : 'Request This Venue'}
          </h1>
          <p className="text-gray-600">
            {isHostBookingArtist 
              ? 'Send a booking request to perform at your venue'
              : 'Send a booking request to perform at this venue'
            }
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
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">Please fix the following errors:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date & Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Event Date"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Input
                      label="Start Time"
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                      required
                    />
                  </div>

                  {/* Capacity & Pricing */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Expected Guests"
                      type="number"
                      value={formData.expectedGuests}
                      onChange={(e) => setFormData({ ...formData, expectedGuests: parseInt(e.target.value) })}
                      required
                      min="1"
                      max={host?.showSpecs.indoorAttendanceMax || 100}
                    />
                    {isArtistBookingHost && (
                      <Input
                        label="Suggested Door Fee ($)"
                        type="number"
                        value={formData.doorFee}
                        onChange={(e) => setFormData({ ...formData, doorFee: parseInt(e.target.value) })}
                        min="0"
                      />
                    )}
                  </div>

                  {/* Contact */}
                  <Input
                    label="Contact Phone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="For coordination closer to show date"
                    required
                  />

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message to {profileType === 'host' ? 'Host' : 'Artist'}
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={4}
                      placeholder={`Tell them about your ${profileType === 'host' ? 'event plans' : 'music and what makes this a good fit'}...`}
                      required
                    />
                  </div>

                  {/* Special Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requirements (optional)
                    </label>
                    <textarea
                      value={formData.specialRequirements}
                      onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={3}
                      placeholder="Sound setup, accessibility needs, dietary restrictions, etc."
                    />
                  </div>

                  {/* Lodging Section */}
                  {isArtistBookingHost && host && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Overnight Accommodation</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="needsLodging"
                            checked={formData.needsLodging}
                            onChange={(e) => setFormData({ ...formData, needsLodging: e.target.checked })}
                            className="mr-3"
                          />
                          <label htmlFor="needsLodging" className="text-sm font-medium text-gray-700">
                            I need overnight accommodation
                          </label>
                        </div>
                        
                        {formData.needsLodging && (
                          <div className="ml-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                            <div className="grid md:grid-cols-2 gap-4">
                              <Input
                                label="Number of Guests"
                                type="number"
                                value={formData.lodgingDetails.guestCount}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  lodgingDetails: { 
                                    ...formData.lodgingDetails, 
                                    guestCount: parseInt(e.target.value) 
                                  } 
                                })}
                                min="1"
                                max="10"
                                required
                              />
                              <div></div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <Input
                                label="Arrival Date"
                                type="date"
                                value={formData.lodgingDetails.arrivalDate}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  lodgingDetails: { 
                                    ...formData.lodgingDetails, 
                                    arrivalDate: e.target.value 
                                  } 
                                })}
                                required
                              />
                              <Input
                                label="Departure Date"
                                type="date"
                                value={formData.lodgingDetails.departureDate}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  lodgingDetails: { 
                                    ...formData.lodgingDetails, 
                                    departureDate: e.target.value 
                                  } 
                                })}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dietary Restrictions
                              </label>
                              <textarea
                                value={formData.lodgingDetails.dietaryRestrictions}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  lodgingDetails: { 
                                    ...formData.lodgingDetails, 
                                    dietaryRestrictions: e.target.value 
                                  } 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                rows={2}
                                placeholder="Any dietary restrictions or food allergies..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lodging Special Requirements
                              </label>
                              <textarea
                                value={formData.lodgingDetails.specialRequirements}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  lodgingDetails: { 
                                    ...formData.lodgingDetails, 
                                    specialRequirements: e.target.value 
                                  } 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                rows={2}
                                placeholder="Any specific needs for accommodation..."
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Terms */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <h4 className="font-medium mb-1">Booking Policy</h4>
                        <p className="mb-2">
                          {isArtistBookingHost 
                            ? `This venue has a ${host?.showSpecs.hostingHistory} hosting history. Cancellation policy and house rules apply.`
                            : `This artist has a ${artist?.cancellationPolicy} cancellation policy.`
                          }
                        </p>
                        <label className="flex items-center mt-3">
                          <input
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                            className="mr-2"
                            required
                          />
                          <span>I agree to the booking terms and TourPad's policies</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting || !formData.agreeToTerms}
                  >
                    {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {profileData?.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{profileData?.name}</h3>
                  {host && (
                    <div className="flex items-center justify-center text-sm text-gray-600 mt-1">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {host.city}, {host.state}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center mb-4">
                  <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{profileData?.rating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">({profileData?.reviewCount} reviews)</span>
                </div>

                {host && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Typical Attendance</span>
                      <span className="font-medium">{host.showSpecs.avgAttendance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usual Door Fee</span>
                      <span className="font-medium">${host.showSpecs.avgDoorFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Capacity</span>
                      <span className="font-medium">{host.showSpecs.indoorAttendanceMax}</span>
                    </div>
                  </div>
                )}

                {artist && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">{artist.yearsActive} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tour Schedule</span>
                      <span className="font-medium">{artist.tourMonthsPerYear} months/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cancellation</span>
                      <Badge variant={artist.cancellationPolicy === 'flexible' ? 'success' : 'warning'}>
                        {artist.cancellationPolicy}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Booking Tips</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Be specific about your event vision and expectations</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Include any special requirements upfront</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Most {profileType === 'host' ? 'hosts' : 'artists'} respond within 24 hours</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Messages continue in your dashboard after booking</span>
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

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <NewBookingForm />
    </Suspense>
  );
}