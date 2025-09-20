'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { validateData, registrationSchema } from '@/lib/validation';

// US States for dropdown
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

interface FanRegistrationWizardProps {}

export default function FanRegistrationWizard({}: FanRegistrationWizardProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    fanCity: '',
    fanState: '',
    favoriteGenres: [] as string[],
    concertFrequency: '',
    referralSource: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Client-side validation
      const validationErrors: Record<string, string> = {};

      if (!formData.name || formData.name.length < 2) {
        validationErrors.name = 'Name must be at least 2 characters';
      }
      if (!formData.email || !formData.email.includes('@')) {
        validationErrors.email = 'Valid email is required';
      }
      if (!formData.password || formData.password.length < 8) {
        validationErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData.fanCity) {
        validationErrors.fanCity = 'City is required';
      }
      if (!formData.fanState) {
        validationErrors.fanState = 'State is required';
      }
      if (!formData.agreeToTerms) {
        validationErrors.agreeToTerms = 'You must agree to the terms';
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Prepare data for API
      const dataToValidate = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        type: 'fan' as const,
        location: `${formData.fanCity}, ${formData.fanState}`,
        fan: {
          favoriteGenres: formData.favoriteGenres,
          concertFrequency: formData.concertFrequency,
          referralSource: formData.referralSource
        }
      };

      // Server validation
      const validation = validateData(registrationSchema, dataToValidate);

      if (!validation.success) {
        const errorMap: Record<string, string> = {};
        validation.errors.forEach(error => {
          const [field, message] = error.split(': ');
          errorMap[field] = message;
        });
        setErrors(errorMap);
        return;
      }

      // Submit to API
      const requestData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        type: 'fan' as const,
        location: `${formData.fanCity}, ${formData.fanState}`,
        fan: {
          favoriteGenres: formData.favoriteGenres,
          concertFrequency: formData.concertFrequency,
          referralSource: formData.referralSource
        }
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // For fans, redirect to payment page
      router.push('/payment/fan');

    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-600 to-secondary-800 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Fan Registration
          </h1>
          <p className="text-lg text-secondary-100">
            Get instant access to exclusive house concerts
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {/* General Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <ExclamationCircleIcon className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <Input
                  label="Full Name *"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  required
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  required
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  label="Password *"
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  required
                  placeholder="At least 8 characters"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="City *"
                    value={formData.fanCity}
                    onChange={(e) => {
                      setFormData({ ...formData, fanCity: e.target.value });
                      if (errors.fanCity) setErrors(prev => ({ ...prev, fanCity: '' }));
                    }}
                    required
                    placeholder="Portland"
                  />
                  {errors.fanCity && (
                    <p className="mt-1 text-sm text-red-600">{errors.fanCity}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    State *
                  </label>
                  <select
                    value={formData.fanState}
                    onChange={(e) => {
                      setFormData({ ...formData, fanState: e.target.value });
                      if (errors.fanState) setErrors(prev => ({ ...prev, fanState: '' }));
                    }}
                    required
                    className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
                  >
                    <option value="">Select State</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.fanState && (
                    <p className="mt-1 text-sm text-red-600">{errors.fanState}</p>
                  )}
                </div>
              </div>

              {/* Music Preferences */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Favorite Music Genres (optional)
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.favoriteGenres.map(genre => (
                      <span key={genre} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {genre}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              favoriteGenres: formData.favoriteGenres.filter(g => g !== genre)
                            });
                          }}
                          className="ml-1 text-xs hover:text-red-600"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Folk', 'Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Classical', 'Electronic', 'Hip Hop', 'R&B', 'Soul', 'Indie', 'Alternative'].filter(g => !formData.favoriteGenres.includes(g)).map(genre => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            favoriteGenres: [...formData.favoriteGenres, genre]
                          });
                        }}
                        className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                      >
                        + {genre}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-neutral-500">Help us recommend concerts you'll love</p>
              </div>

              {/* Concert Frequency */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  How often do you attend live music events?
                </label>
                <select
                  value={formData.concertFrequency}
                  onChange={(e) => {
                    setFormData({ ...formData, concertFrequency: e.target.value });
                    if (errors.concertFrequency) setErrors(prev => ({ ...prev, concertFrequency: '' }));
                  }}
                  className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
                >
                  <option value="">Select frequency</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="few-times-year">A few times a year</option>
                  <option value="rarely">Rarely</option>
                </select>
                {errors.concertFrequency && (
                  <p className="mt-1 text-sm text-red-600">{errors.concertFrequency}</p>
                )}
              </div>

              {/* Referral Source */}
              <div>
                <Input
                  label="How did you hear about TourPad? (optional)"
                  value={formData.referralSource}
                  onChange={(e) => {
                    setFormData({ ...formData, referralSource: e.target.value });
                    if (errors.referralSource) setErrors(prev => ({ ...prev, referralSource: '' }));
                  }}
                  placeholder="Friend, social media, search, etc."
                />
                {errors.referralSource && (
                  <p className="mt-1 text-sm text-red-600">{errors.referralSource}</p>
                )}
              </div>

              {/* What happens next */}
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="font-medium text-secondary-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-secondary-700 space-y-1">
                  <li>• You'll be directed to secure payment page</li>
                  <li>• After payment, you get instant access to all concerts</li>
                  <li>• Start discovering and booking exclusive house concerts</li>
                  <li>• Cancel anytime - no long-term commitment</li>
                </ul>
              </div>

              {/* Terms Agreement */}
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => {
                      setFormData({ ...formData, agreeToTerms: e.target.checked });
                      if (errors.agreeToTerms) setErrors(prev => ({ ...prev, agreeToTerms: '' }));
                    }}
                    className="mr-3"
                    required
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-neutral-700">
                    I agree to TourPad's Terms of Service and Privacy Policy *
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting || !formData.agreeToTerms}
              >
                {isSubmitting ? 'Submitting...' : 'Continue to Payment'}
              </Button>
            </form>

            {/* Already have an account */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign in here
                </button>
              </p>
              <p className="text-xs text-neutral-500">
                Want to host or perform instead?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Choose different account type
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}