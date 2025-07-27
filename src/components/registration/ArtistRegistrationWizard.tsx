'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wizard, 
  WizardStep, 
  ProgressIndicator, 
  WizardNavigation 
} from '@/components/ui/Wizard';
import {
  ArtistFormData,
  PersonalInfoStep,
  MusicStoryStep,
  MediaPerformanceStep,
  ReviewSubmitStep
} from './ArtistRegistrationSteps';
import { validateData, registrationSchema } from '@/lib/validation';

const WIZARD_STEPS = [
  {
    label: 'Personal Info',
    description: 'Basic details'
  },
  {
    label: 'Music Story',
    description: 'Bio & genres'
  },
  {
    label: 'Media & Sound',
    description: 'Photos & videos'
  },
  {
    label: 'Review',
    description: 'Submit application'
  }
];

export default function ArtistRegistrationWizard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<ArtistFormData>({
    // Step 1: Personal Info
    bandName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Music Story
    bio: '',
    genres: [],
    socialFacebook: '',
    socialInstagram: '',
    bandWebsite: '',
    
    // Step 3: Media & Performance
    musicProfileUrl: '',
    performanceVideoUrl: '',
    artistPhotos: [],
    
    // Form state
    agreeToTerms: false
  });

  const updateFormData = (updates: Partial<ArtistFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepIndex) {
      case 0: // Personal Info
        if (!formData.bandName || formData.bandName.length < 2) {
          newErrors.bandName = 'Band name must be at least 2 characters';
        }
        if (!formData.name || formData.name.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        }
        if (!formData.email || !formData.email.includes('@')) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.password || formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 1: // Music Story
        if (!formData.bio || formData.bio.length < 50) {
          newErrors.bio = 'Bio must be at least 50 characters';
        }
        if (formData.genres.length === 0) {
          newErrors.genres = 'Please select at least one genre';
        }
        break;

      case 2: // Media & Performance
        if (!formData.musicProfileUrl) {
          newErrors.musicProfileUrl = 'Spotify profile URL is required';
        } else if (!formData.musicProfileUrl.includes('spotify.com')) {
          newErrors.musicProfileUrl = 'Please enter a valid Spotify URL';
        }
        if (!formData.performanceVideoUrl) {
          newErrors.performanceVideoUrl = 'Performance video URL is required';
        } else if (!formData.performanceVideoUrl.match(/(youtube|vimeo|youtu\.be)/i)) {
          newErrors.performanceVideoUrl = 'Please enter a valid YouTube or Vimeo URL';
        }
        if (formData.artistPhotos.length === 0) {
          newErrors.artistPhotos = 'Please upload at least one photo';
        }
        break;

      case 3: // Review & Submit
        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepChange = (newStep: number) => {
    // Clear errors when moving to a new step
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep(3)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for backend validation and submission
      const requestData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        userType: 'artist' as const,
        profile: {
          bio: formData.bio,
          websiteUrl: formData.bandWebsite,
          socialLinks: {
            facebook: formData.socialFacebook,
            instagram: formData.socialInstagram,
            spotify: formData.musicProfileUrl,
            website: formData.bandWebsite
          }
        },
        artist: {
          stageName: formData.bandName,
          genres: formData.genres,
          performanceVideoUrl: formData.performanceVideoUrl
        }
      };

      // Validate using the registration schema
      const validation = validateData(registrationSchema, requestData);
      
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

      // Submit to backend API
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

      // Show success message
      alert('Artist application submitted successfully! We will review and get back to you within 48 hours.');
      
      // Auto-login
      const { signIn } = await import('next-auth/react');
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (signInResult?.ok) {
        // Wait for session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Upload photos after authentication
        if (formData.artistPhotos.length > 0) {
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
                console.error(`Photo ${index + 1} upload failed:`, uploadResult);
              }
            } catch (uploadError) {
              console.error(`Photo ${index + 1} upload error:`, uploadError);
            }
          }
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // If auto-login fails, redirect to login page
        router.push('/login');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ 
        general: 'An error occurred while submitting your application. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-evergreen mb-4">
            Artist Application
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Join our community of touring musicians and connect with intimate venues across the country
          </p>
        </div>

        {/* Wizard with Steps */}
        <Wizard initialStep={0} onStepChange={handleStepChange}>
          {/* Step 1: Personal Info */}
          <WizardStep>
            <ProgressIndicator steps={WIZARD_STEPS} className="mb-8" />
            <PersonalInfoStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              clearError={clearError}
            />
            <WizardNavigation 
              onNext={() => validateCurrentStep(0)}
            />
          </WizardStep>

          {/* Step 2: Music Story */}
          <WizardStep>
            <ProgressIndicator steps={WIZARD_STEPS} className="mb-8" />
            <MusicStoryStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              clearError={clearError}
            />
            <WizardNavigation 
              onNext={() => validateCurrentStep(1)}
            />
          </WizardStep>

          {/* Step 3: Media & Performance */}
          <WizardStep>
            <ProgressIndicator steps={WIZARD_STEPS} className="mb-8" />
            <MediaPerformanceStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              clearError={clearError}
            />
            <WizardNavigation 
              onNext={() => validateCurrentStep(2)}
            />
          </WizardStep>

          {/* Step 4: Review & Submit */}
          <WizardStep>
            <ProgressIndicator steps={WIZARD_STEPS} className="mb-8" />
            <ReviewSubmitStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              clearError={clearError}
            />
            <WizardNavigation 
              onNext={handleSubmit}
              nextLabel="Submit Application"
              isLoading={isSubmitting}
            />
          </WizardStep>
        </Wizard>

        {/* General Error Display */}
        {errors.general && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-neutral-500">
            Already have an account?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in here
            </a>
          </p>
          <p className="text-sm text-neutral-500">
            Looking to host?{' '}
            <a href="/register?type=host" className="text-primary-600 hover:text-primary-700 font-medium">
              Apply as Host
            </a>
            {' '}• Music fan?{' '}
            <a href="/register?type=fan" className="text-primary-600 hover:text-primary-700 font-medium">
              Join here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};