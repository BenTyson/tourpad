'use client';
import { useState } from 'react';
import { HomeIcon, ArrowRightIcon, ArrowLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { hostOnboardingSchema, validateData } from '@/lib/validation';

export default function HostOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Venue Info
    venueName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    bio: '',
    
    // Step 2: Show Specs
    avgAttendance: '',
    avgDoorFee: '',
    indoorMax: '',
    outdoorMax: '',
    showDuration: '',
    showFormat: '',
    estimatedShows: '',
    performanceLocation: 'home',
    daysAvailable: [] as string[],
    
    // Step 3: Amenities
    amenities: {
      powerAccess: false,
      airConditioning: false,
      wifi: false,
      kidFriendly: false,
      adultsOnly: false,
      parking: false,
      petFriendly: false,
      outdoorSpace: false,
      accessible: false,
      soundSystem: false,
      bnbOffered: false
    }
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // Validate the complete form data
      const validation = validateData(hostOnboardingSchema, formData);
      
      if (!validation.success) {
        const errorMap: Record<string, string> = {};
        validation.errors?.forEach(error => {
          const [field, message] = error.split(': ');
          errorMap[field] = message;
        });
        setErrors(errorMap);
        
        // Find the first step with errors and navigate to it
        const errorFields = Object.keys(errorMap);
        if (errorFields.some(field => ['venueName', 'address', 'city', 'state', 'zip', 'bio'].includes(field))) {
          setCurrentStep(1);
        } else if (errorFields.some(field => ['avgAttendance', 'avgDoorFee', 'indoorMax', 'outdoorMax', 'showDuration', 'showFormat', 'estimatedShows', 'performanceLocation', 'daysAvailable'].includes(field))) {
          setCurrentStep(2);
        } else if (errorFields.some(field => field.includes('amenities'))) {
          setCurrentStep(3);
        }
        
        return;
      }
      
      console.log('Host onboarding data:', validation.data);
      // TODO: Submit to backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      alert('Host application submitted! You will be reviewed and approved soon.');
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ general: 'An error occurred while submitting your application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAmenity = (amenity: string, value: boolean) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: value
      }
    });
  };

  const toggleDay = (day: string) => {
    const days = formData.daysAvailable;
    const newDays = days.includes(day) 
      ? days.filter(d => d !== day)
      : [...days, day];
    setFormData({ ...formData, daysAvailable: newDays });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <HomeIcon className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              Host Application
            </h1>
          </div>
          <p className="text-gray-600">
            Tell us about your venue and hosting preferences
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {currentStep === 1 && "Venue Information"}
              {currentStep === 2 && "Show Specifications"}
              {currentStep === 3 && "Amenities & Features"}
            </h2>
          </CardHeader>

          <CardContent>
            {/* General Error Display */}
            {(errors.general || Object.keys(errors).length > 0) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.general ? 'Submission Error' : 'Please fix the following errors:'}
                  </h3>
                </div>
                {errors.general ? (
                  <p className="text-sm text-red-700">{errors.general}</p>
                ) : (
                  <ul className="text-sm text-red-700 space-y-1">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>• {field}: {message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {/* Step 1: Venue Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Input
                  label="Venue Name"
                  value={formData.venueName}
                  onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  placeholder="e.g., The Garden House, Smith Family Living Room"
                />

                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address (private until booking)"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g., TX"
                  />
                </div>

                <Input
                  label="ZIP Code"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About Your Venue
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                    rows={4}
                    placeholder="Describe your space, what makes it special, hosting experience..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Show Specs */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Average Attendance"
                    type="number"
                    value={formData.avgAttendance}
                    onChange={(e) => setFormData({ ...formData, avgAttendance: e.target.value })}
                    placeholder="20"
                  />
                  <Input
                    label="Average Door Fee ($)"
                    type="number"
                    value={formData.avgDoorFee}
                    onChange={(e) => setFormData({ ...formData, avgDoorFee: e.target.value })}
                    placeholder="15"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Indoor Max Capacity"
                    type="number"
                    value={formData.indoorMax}
                    onChange={(e) => setFormData({ ...formData, indoorMax: e.target.value })}
                  />
                  <Input
                    label="Outdoor Max Capacity"
                    type="number"
                    value={formData.outdoorMax}
                    onChange={(e) => setFormData({ ...formData, outdoorMax: e.target.value })}
                  />
                </div>

                <Input
                  label="Typical Show Duration (minutes)"
                  type="number"
                  value={formData.showDuration}
                  onChange={(e) => setFormData({ ...formData, showDuration: e.target.value })}
                  placeholder="90"
                />

                <Input
                  label="Show Format"
                  value={formData.showFormat}
                  onChange={(e) => setFormData({ ...formData, showFormat: e.target.value })}
                  placeholder="e.g., Living room acoustic, Backyard concert, etc."
                />

                <Input
                  label="Estimated Shows Per Year"
                  type="number"
                  value={formData.estimatedShows}
                  onChange={(e) => setFormData({ ...formData, estimatedShows: e.target.value })}
                  placeholder="6"
                />

                {/* Days Available */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days Available to Host
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 px-3 text-sm rounded-md border transition-colors ${
                          formData.daysAvailable.includes(day)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Amenities */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select all amenities and features your venue offers:
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries({
                    powerAccess: 'Power Access',
                    airConditioning: 'Air Conditioning',
                    wifi: 'WiFi',
                    kidFriendly: 'Kid Friendly',
                    adultsOnly: 'Adults Only',
                    parking: 'Parking Available',
                    petFriendly: 'Pet Friendly',
                    outdoorSpace: 'Outdoor Space',
                    accessible: 'Wheelchair Accessible',
                    soundSystem: 'Sound System',
                    bnbOffered: 'Overnight Stay Available'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities[key as keyof typeof formData.amenities]}
                        onChange={(e) => updateAmenity(key, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={handlePrev}
                variant="outline"
                disabled={currentStep === 1}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}