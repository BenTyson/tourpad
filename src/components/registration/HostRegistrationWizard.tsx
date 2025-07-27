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
  HostFormData,
  PersonalInfoStep,
  VenueDetailsStep,
  HostingExperienceStep,
  ReviewSubmitStep
} from './HostRegistrationSteps';
import { validateData, registrationSchema } from '@/lib/validation';

const WIZARD_STEPS = [
  {
    label: 'Personal Info',
    description: 'Basic details'
  },
  {
    label: 'Venue Details',
    description: 'Space & location'
  },
  {
    label: 'Hosting Experience',
    description: 'Background & preferences'
  },
  {
    label: 'Review',
    description: 'Submit application'
  }
];

export default function HostRegistrationWizard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<HostFormData>({
    // Step 1: Personal Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Venue Details
    address: '',
    city: '',
    state: '',
    zipCode: '',
    venueType: '',
    venueDescription: '',
    indoorCapacity: '',
    outdoorCapacity: '',
    venuePhotos: [],
    
    // Step 3: Hosting Experience
    hostingExperience: '',
    preferredGenres: [],
    hostingMotivation: '',
    houseRules: '',
    amenities: [],
    soundSystem: '',
    
    // Form state
    agreeToTerms: false
  });

  const updateFormData = (updates: Partial<HostFormData>) => {
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

      case 1: // Venue Details
        if (!formData.address || formData.address.length < 5) {
          newErrors.address = 'Please enter a valid street address';
        }
        if (!formData.city || formData.city.length < 2) {
          newErrors.city = 'City is required';
        }
        if (!formData.state) {
          newErrors.state = 'State is required';
        }
        if (!formData.zipCode || !/^\d{5}$/.test(formData.zipCode)) {
          newErrors.zipCode = 'Please enter a valid 5-digit zip code';
        }
        if (!formData.venueType) {
          newErrors.venueType = 'Please select a venue type';
        }
        if (!formData.venueDescription || formData.venueDescription.length < 20) {
          newErrors.venueDescription = 'Venue description must be at least 20 characters';
        }
        if (!formData.indoorCapacity || parseInt(formData.indoorCapacity) < 1) {
          newErrors.indoorCapacity = 'Indoor capacity must be at least 1';
        }
        if (formData.venuePhotos.length === 0) {
          newErrors.venuePhotos = 'Please upload at least one photo of your venue';
        }
        break;

      case 2: // Hosting Experience
        if (!formData.hostingExperience) {
          newErrors.hostingExperience = 'Please select your hosting experience level';
        }
        if (!formData.hostingMotivation || formData.hostingMotivation.length < 20) {
          newErrors.hostingMotivation = 'Please share your motivation (at least 20 characters)';
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
        userType: 'host' as const,
        profile: {
          bio: formData.hostingMotivation,
          location: `${formData.city}, ${formData.state}`,
          websiteUrl: '',
          socialLinks: {}
        },
        host: {
          city: formData.city,
          state: formData.state,
          venueType: formData.venueType as any,
          actualAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          indoorCapacity: parseInt(formData.indoorCapacity),
          outdoorCapacity: formData.outdoorCapacity ? parseInt(formData.outdoorCapacity) : undefined,
          venueDescription: formData.venueDescription,
          hostingExperience: formData.hostingExperience === 'experienced' ? 1 : 0,
          preferredGenres: formData.preferredGenres,
          houseRules: formData.houseRules,
          amenities: formData.amenities,
          soundSystem: {
            type: formData.soundSystem,
            description: formData.soundSystem
          }
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
      alert('Host application submitted successfully! We will review and get back to you within 48 hours.');
      
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
        
        // Upload venue photos after authentication
        if (formData.venuePhotos.length > 0) {
          console.log(`Uploading ${formData.venuePhotos.length} venue photos...`);
          
          for (const [index, photo] of formData.venuePhotos.entries()) {
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
              console.log(`Venue photo ${index + 1} upload result:`, uploadResult);
              
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
            Host Application
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Open your space to create magical intimate concert experiences for your community
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

          {/* Step 2: Venue Details */}
          <WizardStep>
            <ProgressIndicator steps={WIZARD_STEPS} className="mb-8" />
            <VenueDetailsStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              clearError={clearError}
            />
            <WizardNavigation 
              onNext={() => validateCurrentStep(1)}
            />
          </WizardStep>

          {/* Step 3: Hosting Experience */}
          <WizardStep>
            <ProgressIndicator steps={WIZARD_STEPS} className="mb-8" />
            <HostingExperienceStep
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
            <a href="/login" className="text-french-blue hover:text-sage font-medium">
              Sign in here
            </a>
          </p>
          <p className="text-sm text-neutral-500">
            Looking to tour?{' '}
            <a href="/register?type=artist" className="text-french-blue hover:text-sage font-medium">
              Apply as Artist
            </a>
            {' '}• Music fan?{' '}
            <a href="/register?type=fan" className="text-french-blue hover:text-sage font-medium">
              Join here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};