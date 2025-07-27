'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { HomeIcon, MusicalNoteIcon, ExclamationCircleIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { registerSchema, registrationSchema, validateData } from '@/lib/validation';
import ArtistRegistrationWizard from '@/components/registration/ArtistRegistrationWizard';
import HostRegistrationWizard from '@/components/registration/HostRegistrationWizard';

// US States for dropdown
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get('type') as 'host' | 'artist' | 'fan';
  const hostType = searchParams.get('hostType') as 'lodging' | null;
  
  // Always call hooks in the same order
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: userType || 'host',
    // Artist specific
    bandName: '',
    bio: '',
    performanceVideoUrl: '',
    performanceVideoFile: null as File | null,
    musicProfileUrl: '',
    bandWebsite: '',
    socialFacebook: '',
    socialInstagram: '',
    pressPhoto: [] as File[],
    artistPhotos: [] as File[],
    genre: '',
    // Host specific
    address: '',
    city: '',
    state: '',
    zipCode: '',
    estimatedAttendance: '',
    concertSpacePhotos: [] as File[],
    hostingMotivation: '',
    additionalInfo: '',
    newToHosting: '',
    // Lodging-only host specific
    serviceRadius: '15',
    lodgingDescription: '',
    whyLodging: '',
    // Fan specific
    fanCity: '',
    fanState: '',
    favoriteGenres: [] as string[],
    concertFrequency: '',
    referralSource: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted! UserType:', userType);
    console.log('Form data:', formData);
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // For fans, we need minimal validation
      if (userType === 'fan') {
        // Basic validation for fan registration
        const errors: Record<string, string> = {};
        
        if (!formData.name || formData.name.length < 2) {
          errors.name = 'Name must be at least 2 characters';
        }
        if (!formData.email || !formData.email.includes('@')) {
          errors.email = 'Please enter a valid email address';
        }
        if (!formData.password || formData.password.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        }
        if (!formData.fanCity) {
          errors.fanCity = 'City is required';
        }
        if (!formData.fanState) {
          errors.fanState = 'State is required';
        }
        if (!formData.agreeToTerms) {
          errors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        
        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          return;
        }
      } else {
        // For artists and hosts, build data structure that matches registrationSchema
        const dataToValidate = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          userType: userType,
          profile: {
            bio: formData.bio,
            location: `${formData.city}, ${formData.state}`,
            websiteUrl: formData.bandWebsite,
            socialLinks: {
              facebook: formData.socialFacebook,
              instagram: formData.socialInstagram,
              spotify: formData.musicProfileUrl,
              website: formData.bandWebsite
            }
          },
          // Artist-specific validation
          ...(userType === 'artist' && {
            artist: {
              stageName: formData.bandName,
              genres: formData.genre.split(',').map(g => g.trim()).filter(Boolean),
              performanceVideoUrl: formData.performanceVideoUrl
            }
          }),
          // Host-specific validation
          ...(userType === 'host' && {
            host: {
              city: formData.city,
              state: formData.state,
              venueType: 'HOME' as const,
              actualAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
              indoorCapacity: hostType === 'lodging' ? undefined : (formData.estimatedAttendance ? parseInt(formData.estimatedAttendance) : undefined),
              serviceRadius: hostType === 'lodging' ? (formData.serviceRadius ? parseInt(formData.serviceRadius) : undefined) : undefined,
              venueDescription: hostType === 'lodging' ? formData.whyLodging : formData.hostingMotivation,
              hostingExperience: formData.newToHosting === 'yes' ? 0 : 1,
              offersLodging: hostType === 'lodging',
              lodgingDetails: hostType === 'lodging' ? {
                description: formData.lodgingDescription,
                motivation: formData.whyLodging
              } : undefined
            }
          })
        };
        
        // Validate using the registration schema
        console.log('Validating host data:', dataToValidate);
        const validation = validateData(registrationSchema, dataToValidate);
        
        if (!validation.success) {
          console.error('Validation failed:', validation.errors);
          const errorMap: Record<string, string> = {};
          validation.errors?.forEach(error => {
            const [field, message] = error.split(': ');
            errorMap[field] = message;
          });
          setErrors(errorMap);
          return;
        }
        console.log('Validation passed for host registration');
      }
      
      // Submit to backend API
      const requestData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        userType: userType,
        profile: {
          bio: formData.bio,
          location: userType === 'fan' ? `${formData.fanCity}, ${formData.fanState}` : `${formData.city}, ${formData.state}`,
          websiteUrl: formData.bandWebsite,
          socialLinks: {
            facebook: formData.socialFacebook,
            instagram: formData.socialInstagram,
            spotify: formData.musicProfileUrl, // Map musicProfileUrl to Spotify
            website: formData.bandWebsite
          },
          // Fan-specific fields
          ...(userType === 'fan' && {
            favoriteGenres: formData.favoriteGenres
          })
        },
        // Artist-specific application data
        ...(userType === 'artist' && {
          artist: {
            stageName: formData.bandName,
            genres: formData.genre.split(',').map(g => g.trim()).filter(Boolean),
            performanceVideoUrl: formData.performanceVideoUrl,
            // performanceVideoFile will be handled separately via file upload
          }
        }),
        // Host-specific application data
        ...(userType === 'host' && {
          host: {
            city: formData.city,
            state: formData.state,
            venueType: 'HOME' as const,
            actualAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
            indoorCapacity: hostType === 'lodging' ? undefined : (formData.estimatedAttendance ? parseInt(formData.estimatedAttendance) : undefined),
            serviceRadius: hostType === 'lodging' ? (formData.serviceRadius ? parseInt(formData.serviceRadius) : undefined) : undefined,
            venueDescription: hostType === 'lodging' ? formData.whyLodging : formData.hostingMotivation,
            hostingExperience: formData.newToHosting === 'yes' ? 0 : 1,
            offersLodging: hostType === 'lodging',
            lodgingDetails: hostType === 'lodging' ? {
              description: formData.lodgingDescription,
              motivation: formData.whyLodging,
              additionalInfo: formData.additionalInfo
            } : {
              hostingMotivation: formData.hostingMotivation,
              additionalInfo: formData.additionalInfo,
              newToHosting: formData.newToHosting
            }
          }
        })
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

      if (userType === 'fan') {
        // For fans, redirect to payment page
        router.push('/payment/fan');
      } else {
        // Show success message first
        alert(`${userType === 'artist' ? 'Artist' : 'Host'} application submitted successfully! We'll review and get back to you within 48 hours.`);
        
        // Auto-login first
        const { signIn } = await import('next-auth/react');
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        });

        if (signInResult?.ok) {
          // Wait a moment for session to be established
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Now upload photos after authentication
          if (userType === 'host' && formData.concertSpacePhotos.length > 0) {
            console.log(`Uploading ${formData.concertSpacePhotos.length} photos...`);
            for (const [index, photo] of formData.concertSpacePhotos.entries()) {
              const photoFormData = new FormData();
              photoFormData.append('file', photo);
              photoFormData.append('type', 'venue');
              photoFormData.append('category', 'venue');
              
              try {
                const uploadResponse = await fetch('/api/upload', {
                  method: 'POST',
                  body: photoFormData
                });
                const uploadResult = await uploadResponse.json();
                console.log(`Photo ${index + 1} upload result:`, uploadResult);
                
                if (!uploadResponse.ok) {
                  console.error(`Photo ${index + 1} upload failed:`, uploadResult);
                }
              } catch (uploadError) {
                console.error(`Photo ${index + 1} upload error:`, uploadError);
              }
            }
          }
          
          // Upload artist photos after authentication
          if (userType === 'artist' && formData.artistPhotos.length > 0) {
            console.log(`Uploading ${formData.artistPhotos.length} artist photos...`);
            for (const [index, photo] of formData.artistPhotos.entries()) {
              const photoFormData = new FormData();
              photoFormData.append('file', photo);
              photoFormData.append('type', 'artist');
              photoFormData.append('category', 'promotional');
              
              try {
                const uploadResponse = await fetch('/api/upload', {
                  method: 'POST',
                  body: photoFormData
                });
                const uploadResult = await uploadResponse.json();
                console.log(`Artist photo ${index + 1} upload result:`, uploadResult);
                
                if (!uploadResponse.ok) {
                  console.error(`Artist photo ${index + 1} upload failed:`, uploadResult);
                }
              } catch (uploadError) {
                console.error(`Artist photo ${index + 1} upload error:`, uploadError);
              }
            }
          }
          
          // Redirect to dashboard which will show holding page for pending users
          router.push('/dashboard');
        } else {
          // If auto-login fails, redirect to login page
          router.push('/login');
        }
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ general: 'An error occurred while submitting your application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show user type selection if no valid type specified
  if (!userType || (userType !== 'host' && userType !== 'artist' && userType !== 'fan')) {
    return <UserTypeSelection />;
  }

  // Use wizard for artist registrations
  if (userType === 'artist') {
    return <ArtistRegistrationWizard />;
  }

  // Use wizard for host registrations
  if (userType === 'host') {
    return <HostRegistrationWizard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-600 to-secondary-800 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {userType === 'artist' ? 'Artist Application' : 
             userType === 'host' ? (hostType === 'lodging' ? 'Lodging Host Application' : 'Host Application') : 
             'Fan Registration'}
          </h1>
          <p className="text-lg text-secondary-100">
            {userType === 'artist' 
              ? 'Join our community of touring musicians'
              : userType === 'host' 
              ? (hostType === 'lodging' ? 'Provide accommodation for touring artists' : 'Open your space for intimate concerts')
              : 'Get instant access to exclusive house concerts'
            }
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
              {/* Artist fields first */}
              {userType === 'artist' && (
                <>
                  <div>
                    <Input
                      label="Band Name / Act Name *"
                      value={formData.bandName}
                      onChange={(e) => {
                        setFormData({ ...formData, bandName: e.target.value });
                        if (errors.bandName) setErrors(prev => ({ ...prev, bandName: '' }));
                      }}
                      required
                      placeholder="Your band or stage name"
                    />
                    {errors.bandName && (
                      <p className="mt-1 text-sm text-red-600">{errors.bandName}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Applicant (Personal) Name *"
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
                      label="Email Address *"
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
                      label="Password *"
                      type="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                      }}
                      required
                      placeholder="Create a strong password"
                    />
                    <p className="mt-1 text-xs text-neutral-500">Must be at least 8 characters long</p>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                </>
              )}

              {/* Non-artist fields (hosts, fans) */}
              {userType !== 'artist' && (
                <>
                  <div>
                    <Input
                      label="Your Name *"
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
                      label="Email Address *"
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
                      label="Password *"
                      type="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                      }}
                      required
                      placeholder="Create a strong password"
                    />
                    <p className="mt-1 text-xs text-neutral-500">Must be at least 8 characters long</p>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                </>
              )}

              {/* Artist Application Fields */}
              {userType === 'artist' && (
                <>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-neutral-700">
                      Artist Bio *
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => {
                        setFormData({ ...formData, bio: e.target.value });
                        if (errors.bio) setErrors(prev => ({ ...prev, bio: '' }));
                      }}
                      required
                      rows={4}
                      maxLength={500}
                      className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
                      placeholder="Brief bio about your music style, background, and what makes your performances special..."
                    />
                    <div className="text-xs text-neutral-500 text-right">
                      {formData.bio.length}/500 characters
                    </div>
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Live Performance Video URL *"
                      value={formData.performanceVideoUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, performanceVideoUrl: e.target.value });
                        if (errors.performanceVideoUrl) setErrors(prev => ({ ...prev, performanceVideoUrl: '' }));
                      }}
                      required
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    />
                    {errors.performanceVideoUrl && (
                      <p className="mt-1 text-sm text-red-600">{errors.performanceVideoUrl}</p>
                    )}
                  </div>

                  <PhotoUploadSection
                    files={formData.artistPhotos}
                    onChange={(files) => {
                      setFormData({ ...formData, artistPhotos: files });
                      if (errors.artistPhotos) setErrors(prev => ({ ...prev, artistPhotos: '' }));
                    }}
                    error={errors.artistPhotos}
                    label="Artist & Band Photos"
                    description="Upload 1-6 high-quality promotional photos"
                    required
                  />
                  <div>
                    <Input
                      label="Spotify Profile *"
                      value={formData.musicProfileUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, musicProfileUrl: e.target.value });
                        if (errors.musicProfileUrl) setErrors(prev => ({ ...prev, musicProfileUrl: '' }));
                      }}
                      required
                      placeholder="https://open.spotify.com/artist/..."
                    />
                    {errors.musicProfileUrl && (
                      <p className="mt-1 text-sm text-red-600">{errors.musicProfileUrl}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Band Website"
                      value={formData.bandWebsite}
                      onChange={(e) => {
                        setFormData({ ...formData, bandWebsite: e.target.value });
                        if (errors.bandWebsite) setErrors(prev => ({ ...prev, bandWebsite: '' }));
                      }}
                      placeholder="https://yourbandwebsite.com"
                    />
                    {errors.bandWebsite && (
                      <p className="mt-1 text-sm text-red-600">{errors.bandWebsite}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Primary Genre * (choose at least 1)</label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.genre.split(',').filter(g => g.trim()).map(genre => (
                          <span key={genre.trim()} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {genre.trim()}
                            <button
                              type="button"
                              onClick={() => {
                                const genres = formData.genre.split(',').filter(g => g.trim() !== genre.trim());
                                setFormData({ ...formData, genre: genres.join(', ') });
                              }}
                              className="ml-1 text-xs hover:text-red-600"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Folk', 'Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Classical', 'Electronic', 'Hip Hop', 'R&B', 'Soul', 'Funk', 'Reggae', 'World', 'Experimental', 'Ambient'].filter(g => !formData.genre.includes(g)).map(genre => (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => {
                              const currentGenres = formData.genre.split(',').filter(g => g.trim());
                              const newGenres = [...currentGenres, genre];
                              setFormData({ ...formData, genre: newGenres.join(', ') });
                            }}
                            className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                          >
                            + {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                    {errors.genre && (
                      <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Facebook"
                        value={formData.socialFacebook}
                        onChange={(e) => {
                          setFormData({ ...formData, socialFacebook: e.target.value });
                          if (errors.socialFacebook) setErrors(prev => ({ ...prev, socialFacebook: '' }));
                        }}
                        placeholder="facebook.com/yourpage"
                      />
                      {errors.socialFacebook && (
                        <p className="mt-1 text-sm text-red-600">{errors.socialFacebook}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        label="Instagram"
                        value={formData.socialInstagram}
                        onChange={(e) => {
                          setFormData({ ...formData, socialInstagram: e.target.value });
                          if (errors.socialInstagram) setErrors(prev => ({ ...prev, socialInstagram: '' }));
                        }}
                        placeholder="@yourhandle"
                      />
                      {errors.socialInstagram && (
                        <p className="mt-1 text-sm text-red-600">{errors.socialInstagram}</p>
                      )}
                    </div>
                  </div>

                </>
              )}

              {/* Host Application Fields */}
              {userType === 'host' && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Input
                        label="Street Address *"
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value });
                          if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                        }}
                        required
                        placeholder="123 Main Street"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          label="City *"
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                          }}
                          required
                          placeholder="Austin"
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          State *
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => {
                            setFormData({ ...formData, state: e.target.value });
                            if (errors.state) setErrors(prev => ({ ...prev, state: '' }));
                          }}
                          required
                          className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
                        >
                          <option value="">Select State</option>
                          {US_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Input
                        label="Zip Code *"
                        value={formData.zipCode}
                        onChange={(e) => {
                          setFormData({ ...formData, zipCode: e.target.value });
                          if (errors.zipCode) setErrors(prev => ({ ...prev, zipCode: '' }));
                        }}
                        required
                        placeholder="78701"
                        maxLength={5}
                        pattern="[0-9]{5}"
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                      )}
                    </div>

                    <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-secondary-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-secondary-800">Privacy Notice</h4>
                          <p className="text-sm text-secondary-700 mt-1">
                            Your complete address stays private and is only shared with artists after a show is confirmed at your venue.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Show different fields based on host type */}
                  {hostType === 'lodging' ? (
                    <div>
                      <Input
                        label="Service Radius (miles) *"
                        type="number"
                        value={formData.serviceRadius}
                        onChange={(e) => {
                          setFormData({ ...formData, serviceRadius: e.target.value });
                          if (errors.serviceRadius) setErrors(prev => ({ ...prev, serviceRadius: '' }));
                        }}
                        required
                        min="1"
                        max="100"
                        placeholder="15"
                      />
                      {errors.serviceRadius && (
                        <p className="mt-1 text-sm text-red-600">{errors.serviceRadius}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Input
                        label="Expected Average Attendance *"
                        type="number"
                        value={formData.estimatedAttendance}
                        onChange={(e) => {
                          setFormData({ ...formData, estimatedAttendance: e.target.value });
                          if (errors.estimatedAttendance) setErrors(prev => ({ ...prev, estimatedAttendance: '' }));
                        }}
                        required
                        placeholder="25"
                        min="1"
                        max="200"
                      />
                      <p className="mt-1 text-xs text-neutral-500">Expected average attendance</p>
                      {errors.estimatedAttendance && (
                        <p className="mt-1 text-sm text-red-600">{errors.estimatedAttendance}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-neutral-700">
                      {hostType === 'lodging' ? 'Are you new to hosting touring artists for lodging? *' : 'Are you new to hosting house concerts? *'}
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="newToHosting"
                          value="yes"
                          checked={formData.newToHosting === 'yes'}
                          onChange={(e) => {
                            setFormData({ ...formData, newToHosting: e.target.value });
                            if (errors.newToHosting) setErrors(prev => ({ ...prev, newToHosting: '' }));
                          }}
                          required
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">Yes, this would be my first time hosting</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="newToHosting"
                          value="no"
                          checked={formData.newToHosting === 'no'}
                          onChange={(e) => {
                            setFormData({ ...formData, newToHosting: e.target.value });
                            if (errors.newToHosting) setErrors(prev => ({ ...prev, newToHosting: '' }));
                          }}
                          required
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">No, I have experience hosting house concerts</span>
                      </label>
                    </div>
                    {errors.newToHosting && (
                      <p className="mt-1 text-sm text-red-600">{errors.newToHosting}</p>
                    )}
                  </div>

                  <PhotoUploadSection
                    files={formData.concertSpacePhotos}
                    onChange={(files) => {
                      setFormData({ ...formData, concertSpacePhotos: files });
                      if (errors.concertSpacePhotos) setErrors(prev => ({ ...prev, concertSpacePhotos: '' }));
                    }}
                    error={errors.concertSpacePhotos}
                    label={hostType === 'lodging' ? 'Lodging Space Photos *' : 'Concert Space Photos *'}
                    description={hostType === 'lodging' 
                      ? 'Upload 1-5 photos of your lodging space (bedroom, common areas, etc.)'
                      : 'Upload 1-5 photos of your performance space'
                    }
                    required
                  />

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-neutral-700">
                      {hostType === 'lodging' 
                        ? 'Why do you want to offer lodging to touring artists? *'
                        : 'What do you enjoy most about hosting house concerts? *'
                      }
                    </label>
                    <textarea
                      value={hostType === 'lodging' ? formData.whyLodging : formData.hostingMotivation}
                      onChange={(e) => {
                        if (hostType === 'lodging') {
                          setFormData({ ...formData, whyLodging: e.target.value });
                          if (errors.whyLodging) setErrors(prev => ({ ...prev, whyLodging: '' }));
                        } else {
                          setFormData({ ...formData, hostingMotivation: e.target.value });
                          if (errors.hostingMotivation) setErrors(prev => ({ ...prev, hostingMotivation: '' }));
                        }
                      }}
                      required
                      rows={4}
                      className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
                      placeholder={hostType === 'lodging' 
                        ? 'Share what motivates you to support touring artists with accommodation...'
                        : 'Share what motivates you to host intimate concerts in your space...'
                      }
                    />
                    {(hostType === 'lodging' ? errors.whyLodging : errors.hostingMotivation) && (
                      <p className="mt-1 text-sm text-red-600">{hostType === 'lodging' ? errors.whyLodging : errors.hostingMotivation}</p>
                    )}
                  </div>

                  {hostType === 'lodging' && (
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-neutral-700">
                        Describe your lodging space *
                      </label>
                      <textarea
                        value={formData.lodgingDescription}
                        onChange={(e) => {
                          setFormData({ ...formData, lodgingDescription: e.target.value });
                          if (errors.lodgingDescription) setErrors(prev => ({ ...prev, lodgingDescription: '' }));
                        }}
                        required
                        rows={3}
                        className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
                        placeholder="Describe the sleeping arrangements, amenities, and what makes your space welcoming for artists..."
                      />
                      {errors.lodgingDescription && (
                        <p className="mt-1 text-sm text-red-600">{errors.lodgingDescription}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-neutral-700">
                      Additional Information <span className="text-neutral-500">(optional)</span>
                    </label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) => {
                        setFormData({ ...formData, additionalInfo: e.target.value });
                        if (errors.additionalInfo) setErrors(prev => ({ ...prev, additionalInfo: '' }));
                      }}
                      rows={3}
                      className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
                      placeholder="Is there anything else you would like to let us know?"
                    />
                    {errors.additionalInfo && (
                      <p className="mt-1 text-sm text-red-600">{errors.additionalInfo}</p>
                    )}
                  </div>
                </>
              )}

              {/* Fan Registration Fields */}
              {userType === 'fan' && (
                <>
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

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Favorite Music Genres (optional)</label>
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
                </>
              )}

              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="font-medium text-secondary-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-secondary-700 space-y-1">
                  {userType === 'fan' ? (
                    <>
                      <li>• You'll be directed to secure payment page</li>
                      <li>• After payment, you get instant access to all concerts</li>
                      <li>• Start discovering and booking exclusive house concerts</li>
                      <li>• Cancel anytime - no long-term commitment</li>
                    </>
                  ) : (
                    <>
                      <li>• We'll review your application within 48 hours</li>
                      <li>• Approved {userType === 'artist' ? 'artists' : 'hosts'} get full platform access</li>
                      <li>• You'll receive email confirmation once approved</li>
                      {userType === 'artist' && <li>• Annual membership fee applies after approval</li>}
                    </>
                  )}
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
                {isSubmitting ? 'Submitting...' : userType === 'fan' ? 'Continue to Payment' : `Submit ${userType === 'artist' ? 'Artist' : 'Host'} Application`}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in here
                </Link>
              </p>
              {userType === 'host' && (
                <p className="text-sm text-gray-500">
                  Looking for Artist Registration?{' '}
                  <Link href="/register?type=artist" className="text-primary-600 hover:text-primary-700 font-medium">
                    Click here
                  </Link>
                  {' '}| Fan?{' '}
                  <Link href="/register?type=fan" className="text-primary-600 hover:text-primary-700 font-medium">
                    Join here
                  </Link>
                </p>
              )}
              {userType === 'artist' && (
                <p className="text-sm text-gray-500">
                  Looking for Host Registration?{' '}
                  <Link href="/register?type=host" className="text-primary-600 hover:text-primary-700 font-medium">
                    Click here
                  </Link>
                  {' '}| Fan?{' '}
                  <Link href="/register?type=fan" className="text-primary-600 hover:text-primary-700 font-medium">
                    Join here
                  </Link>
                </p>
              )}
              {userType === 'fan' && (
                <p className="text-sm text-gray-500">
                  Are you an artist?{' '}
                  <Link href="/register?type=artist" className="text-primary-600 hover:text-primary-700 font-medium">
                    Apply here
                  </Link>
                  {' '}| Host?{' '}
                  <Link href="/register?type=host" className="text-primary-600 hover:text-primary-700 font-medium">
                    Apply here
                  </Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// User Type Selection Component
function UserTypeSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-600 to-secondary-800 py-12 flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join TourPad
          </h1>
          <p className="text-xl text-secondary-100">
            Choose how you want to experience the magic of house concerts
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Artist Option */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => router.push('/register?type=artist')}>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full mb-4">
                <MusicalNoteIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">I'm an Artist</h2>
              <p className="text-gray-600 mb-4 text-sm">
                I'm a touring musician looking for intimate venues.
              </p>
              <ul className="text-left text-xs text-gray-600 space-y-1 mb-4">
                <li>• Connect with verified hosts</li>
                <li>• Tour planning tools</li>
                <li>• $400/year after approval</li>
              </ul>
              <Button size="sm" className="w-full">
                Apply as Artist
              </Button>
            </CardContent>
          </Card>

          {/* Host Option */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => router.push('/register?type=host')}>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-400 to-primary-500 rounded-full mb-4">
                <HomeIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">I'm a Host</h2>
              <p className="text-gray-600 mb-4 text-sm">
                I want to host intimate concerts in my space.
              </p>
              <ul className="text-left text-xs text-gray-600 space-y-1 mb-4">
                <li>• Browse touring artists</li>
                <li>• Host house concerts</li>
                <li>• Free to join and use</li>
              </ul>
              <Button size="sm" className="w-full" variant="outline">
                Apply as Host
              </Button>
            </CardContent>
          </Card>

          {/* Lodging-Only Host Option */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => router.push('/register?type=host&hostType=lodging')}>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-green-500 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M7 13h10l-1 8H8l-1-8z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">I Offer Lodging</h2>
              <p className="text-gray-600 mb-4 text-sm">
                I provide accommodation for touring artists.
              </p>
              <ul className="text-left text-xs text-gray-600 space-y-1 mb-4">
                <li>• Support touring musicians</li>
                <li>• Earn from accommodation</li>
                <li>• Free to join and use</li>
              </ul>
              <Button size="sm" className="w-full" variant="outline">
                Apply as Lodging Host
              </Button>
            </CardContent>
          </Card>

          {/* Fan Option */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => router.push('/register?type=fan')}>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">I'm a Fan</h2>
              <p className="text-gray-600 mb-4 text-sm">
                I want to discover exclusive house concerts.
              </p>
              <ul className="text-left text-xs text-gray-600 space-y-1 mb-4">
                <li>• Discover intimate concerts</li>
                <li>• Support independent artists</li>
                <li>• Pay & get instant access</li>
              </ul>
              <Button size="sm" className="w-full" variant="secondary">
                Join as Fan
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-secondary-200">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-secondary-100 font-medium underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <RegisterForm />
    </Suspense>
  );
}

// Photo Upload Section Component
function PhotoUploadSection({ 
  files, 
  onChange, 
  error, 
  label, 
  description, 
  required = false,
  multiple = true 
}: {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
  label: string;
  description: string;
  required?: boolean;
  multiple?: boolean;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (multiple) {
      onChange([...files, ...newFiles]);
    } else {
      onChange(newFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-neutral-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
        <PhotoIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <div className="space-y-2">
          <label className="cursor-pointer">
            <span className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-block">
              Choose Photos
            </span>
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <PhotoIcon className="w-5 h-5 text-neutral-400" />
                <span className="text-sm text-neutral-700 truncate">{file.name}</span>
                <span className="text-xs text-neutral-500">
                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}