'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { testHosts, testArtists } from '@/data/realTestData';
import { apiClient, handleApiResponse } from '@/lib/api-client';
import { validateData, bookingSchema } from '@/lib/validation';
import {
  BookingHeader,
  BookingForm,
  BookingProfileSummary,
  BookingConfirmation
} from '@/components/booking';

function NewBookingForm() {
  const searchParams = useSearchParams();
  const hostId = searchParams.get('hostId');
  const artistId = searchParams.get('artistId');
  
  // State for fetched data
  const [host, setHost] = useState<any>(null);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Determine booking type
  const isHostBookingArtist = !!artistId; // Host is booking an artist
  const isArtistBookingHost = !!hostId;   // Artist is booking a host

  // Fetch host/artist data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (hostId) {
          // Try API first, fallback to test data
          try {
            const response = await fetch(`/api/hosts/${hostId}`);
            if (response.ok) {
              const hostData = await response.json();
              setHost(hostData);
            } else {
              console.warn('Host API failed, falling back to test data');
              // Fallback to test data
              const testHost = testHosts.find(h => h.id === hostId);
              if (testHost) {
                setHost(testHost);
              } else {
                console.error('Host not found in test data either:', hostId);
              }
            }
          } catch (apiError) {
            console.warn('Host API error, falling back to test data:', apiError);
            // Fallback to test data
            const testHost = testHosts.find(h => h.id === hostId);
            if (testHost) {
              setHost(testHost);
            } else {
              console.error('Host not found in test data either:', hostId);
            }
          }
        }
        
        if (artistId) {
          // Try API first, fallback to test data
          try {
            const response = await fetch(`/api/artists/${artistId}`);
            if (response.ok) {
              const artistData = await response.json();
              setArtist(artistData);
            } else {
              console.warn('Artist API failed, falling back to test data');
              // Fallback to test data
              const testArtist = testArtists.find(a => a.id === artistId);
              if (testArtist) {
                setArtist(testArtist);
              } else {
                console.error('Artist not found in test data either:', artistId);
              }
            }
          } catch (apiError) {
            console.warn('Artist API error, falling back to test data:', apiError);
            // Fallback to test data
            const testArtist = testArtists.find(a => a.id === artistId);
            if (testArtist) {
              setArtist(testArtist);
            } else {
              console.error('Artist not found in test data either:', artistId);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setLoading(false);
      }
    };

    if (hostId || artistId) {
      console.log('Fetching data for hostId:', hostId, 'artistId:', artistId);
      fetchData().catch(error => {
        console.error('Unhandled error in fetchData:', error);
        setLoading(false);
      });
    } else {
      console.log('No hostId or artistId provided');
      setLoading(false);
    }
  }, [hostId, artistId]);

  const [formData, setFormData] = useState({
    eventDate: '',
    eventTime: '19:00',
    expectedGuests: 25,
    doorFee: 15,
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

  // Update form defaults when host data is loaded
  useEffect(() => {
    if (host) {
      setFormData(prev => ({
        ...prev,
        expectedGuests: host.showSpecs?.avgAttendance || host.capacity?.preferred || 25,
        doorFee: host.showSpecs?.avgDoorFee || host.suggestedDoorFee || 15,
      }));
    }
  }, [host]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-french-blue)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Show error if no valid host or artist found
  if (!host && !artist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking Request</h1>
          <p className="text-gray-600 mb-4">Could not find the requested host or artist.</p>
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
      // Validate required fields client-side
      if (!formData.eventDate) {
        setErrors(['Please select an event date']);
        return;
      }
      
      if (!formData.message) {
        setErrors(['Please include a message to the host']);
        return;
      }
      
      if (!formData.agreeToTerms) {
        setErrors(['Please agree to the booking terms']);
        return;
      }

      // Prepare booking data
      const bookingData = {
        hostId: hostId,
        requestedDate: formData.eventDate,
        requestedTime: formData.eventTime,
        estimatedDuration: 120, // Default 2 hours, could be made configurable
        expectedAttendance: formData.expectedGuests,
        doorFee: formData.doorFee,
        artistMessage: formData.message,
        lodgingRequested: formData.needsLodging,
        lodgingDetails: formData.needsLodging ? formData.lodgingDetails : null
      };
      
      console.log('Submitting booking data:', bookingData);
      
      // Submit to API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        setErrors(['Invalid server response. Please try again.']);
        return;
      }
      
      if (!response.ok) {
        console.error('API Error:', response.status, data);
        setErrors([data.error || `Server error (${response.status}). Please try again.`]);
        return;
      }
      
      console.log('Booking created successfully:', data);
      setShowConfirmation(true);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrors(['Network error. Please check your connection and try again.']);
      } else {
        setErrors(['An unexpected error occurred. Please try again.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <BookingConfirmation
        isHostBookingArtist={isHostBookingArtist}
        artistName={artist?.name}
        hostName={host?.name}
      />
    );
  }

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const profileData = host || artist;
  const profileType = host ? 'host' : 'artist';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <BookingHeader
          profileType={profileType}
          hostId={hostId}
          artistId={artistId}
          isHostBookingArtist={isHostBookingArtist}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <BookingForm
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            isHostBookingArtist={isHostBookingArtist}
            isArtistBookingHost={isArtistBookingHost}
            host={host}
            artist={artist}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleSubmit}
            profileType={profileType}
          />

          <BookingProfileSummary
            profileData={profileData}
            profileType={profileType}
            host={host}
            artist={artist}
          />
        </div>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-french-blue)] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <NewBookingForm />
    </Suspense>
  );
}