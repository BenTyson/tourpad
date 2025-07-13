'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HomeIcon, MusicalNoteIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { registerSchema, validateData } from '@/lib/validation';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') || 'host';
  const [userType, setUserType] = useState<'host' | 'artist'>(defaultType as 'host' | 'artist');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    type: userType,
    // Artist specific
    genre: '',
    experience: '',
    // Host specific
    venueDescription: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // Update form data with current user type
      const dataToValidate = { ...formData, type: userType };
      
      // Validate form data
      const validation = validateData(registerSchema, dataToValidate);
      
      if (!validation.success) {
        const errorMap: Record<string, string> = {};
        validation.errors?.forEach(error => {
          const [field, message] = error.split(': ');
          errorMap[field] = message;
        });
        setErrors(errorMap);
        return;
      }
      
      // TODO: Submit to backend API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      alert(`${userType === 'artist' ? 'Artist' : 'Host'} application submitted successfully! We'll review and get back to you within 48 hours.`);
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ general: 'An error occurred while submitting your application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-neutral-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-sage-500 rounded-full mb-4">
            {userType === 'artist' ? (
              <MusicalNoteIcon className="w-8 h-8 text-white" />
            ) : (
              <HomeIcon className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {userType === 'artist' ? 'Apply as an Artist' : 'Register as a Host'}
          </h1>
          <p className="text-lg text-gray-600">
            {userType === 'artist' 
              ? 'Join our community of touring musicians'
              : 'Open your space for intimate concerts'
            }
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4">
            {/* User Type Selection */}
            <div className="flex space-x-2 bg-sage-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setUserType('host');
                  setFormData(prev => ({ ...prev, type: 'host' }));
                  setErrors({});
                }}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  userType === 'host'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-sage-700 hover:text-sage-900'
                }`}
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Host
              </button>
              <button
                onClick={() => {
                  setUserType('artist');
                  setFormData(prev => ({ ...prev, type: 'artist' }));
                  setErrors({});
                }}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  userType === 'artist'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-sage-700 hover:text-sage-900'
                }`}
              >
                <MusicalNoteIcon className="w-4 h-4 mr-2" />
                Artist
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* General Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <ExclamationCircleIcon className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common fields */}
              <div>
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  required
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  required
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  required
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
                  }}
                  required
                  placeholder="City, State"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Artist-specific fields */}
              {userType === 'artist' && (
                <>
                  <div>
                    <Input
                      label="Primary Genre"
                      value={formData.genre}
                      onChange={(e) => {
                        setFormData({ ...formData, genre: e.target.value });
                        if (errors.genre) setErrors(prev => ({ ...prev, genre: '' }));
                      }}
                      required
                      placeholder="Folk, Rock, Jazz, etc."
                    />
                    {errors.genre && (
                      <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-neutral-700">
                      Performance Experience
                    </label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => {
                        setFormData({ ...formData, experience: e.target.value });
                        if (errors.experience) setErrors(prev => ({ ...prev, experience: '' }));
                      }}
                      required
                      rows={4}
                      className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
                      placeholder="Brief description of your performance experience and style... (minimum 20 characters)"
                    />
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                    )}
                  </div>
                </>
              )}

              {/* Host-specific field */}
              {userType === 'host' && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-neutral-700">
                    Venue Description
                  </label>
                  <textarea
                    value={formData.venueDescription}
                    onChange={(e) => {
                      setFormData({ ...formData, venueDescription: e.target.value });
                      if (errors.venueDescription) setErrors(prev => ({ ...prev, venueDescription: '' }));
                    }}
                    required
                    rows={4}
                    className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
                    placeholder="Describe your space, capacity, amenities, and what makes it special... (minimum 20 characters)"
                  />
                  {errors.venueDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.venueDescription}</p>
                  )}
                </div>
              )}

              <div className="bg-sage-50 p-4 rounded-lg">
                <h3 className="font-medium text-sage-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-sage-700 space-y-1">
                  <li>• We'll review your application within 48 hours</li>
                  <li>• Approved {userType === 'artist' ? 'artists' : 'hosts'} get full platform access</li>
                  <li>• You'll receive email confirmation once approved</li>
                  {userType === 'artist' && <li>• Annual membership fee of $400 applies after approval</li>}
                </ul>
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => {
                      setFormData({ ...formData, agreeToTerms: e.target.checked });
                      if (errors.agreeToTerms) setErrors(prev => ({ ...prev, agreeToTerms: '' }));
                    }}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-neutral-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-700 underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                )}
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : `Submit ${userType === 'artist' ? 'Artist' : 'Host'} Application`}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}