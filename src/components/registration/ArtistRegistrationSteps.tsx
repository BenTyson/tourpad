'use client';
import React, { useEffect } from 'react';
import { FormField, TextAreaField, GenreSelect } from '@/components/ui/FormField';
import { FileUpload } from '@/components/ui/FileUpload';
import { Card, CardContent } from '@/components/ui/Card';
import { useWizard } from '@/components/ui/Wizard';
import { 
  MusicalNoteIcon, 
  UserIcon, 
  DocumentTextIcon,
  PhotoIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export interface ArtistFormData {
  // Step 1: Personal Info
  bandName: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Music Story
  bio: string;
  genres: string[];
  socialFacebook: string;
  socialInstagram: string;
  bandWebsite: string;
  
  // Step 3: Media & Performance
  musicProfileUrl: string;
  performanceVideoUrl: string;
  artistPhotos: File[];
  
  // Form state
  agreeToTerms: boolean;
}

interface StepProps {
  formData: ArtistFormData;
  updateFormData: (updates: Partial<ArtistFormData>) => void;
  errors: Record<string, string>;
  clearError: (field: string) => void;
}

// Step 1: Personal Information
export const PersonalInfoStep = ({ formData, updateFormData, errors, clearError }: StepProps) => {
  const { setCanProceed } = useWizard();

  // Always allow proceeding from this step - validation happens on next click
  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-evergreen mb-2">
            Tell Us About You
          </h2>
          <p className="text-neutral-600">
            Let's start with the basics to get your artist profile set up
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            label="Band Name / Stage Name"
            value={formData.bandName}
            onChange={(e) => {
              updateFormData({ bandName: e.target.value });
              clearError('bandName');
            }}
            placeholder="Enter your band or stage name"
            required
            error={errors.bandName}
            description="This is how you'll be displayed to hosts and fans"
          />

          <FormField
            label="Your Personal Name"
            value={formData.name}
            onChange={(e) => {
              updateFormData({ name: e.target.value });
              clearError('name');
            }}
            placeholder="Enter your full name"
            required
            error={errors.name}
            description="Your legal name for account verification"
          />

          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => {
              updateFormData({ email: e.target.value });
              clearError('email');
            }}
            placeholder="your@email.com"
            required
            error={errors.email}
            description="We'll use this to send you booking notifications"
          />

          <FormField
            label="Create Password"
            type="password"
            value={formData.password}
            onChange={(e) => {
              updateFormData({ password: e.target.value });
              clearError('password');
            }}
            placeholder="Create a secure password"
            required
            error={errors.password}
            description="Must be at least 8 characters long"
          />

          <FormField
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => {
              updateFormData({ confirmPassword: e.target.value });
              clearError('confirmPassword');
            }}
            placeholder="Confirm your password"
            required
            error={errors.confirmPassword}
            description="Must match your password above"
          />
        </div>

        {/* Welcome Message */}
        <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <h4 className="font-medium text-primary-800 mb-2">Welcome to TourPad! 🎵</h4>
          <p className="text-sm text-primary-700">
            You're joining a community of touring musicians who are transforming how live music happens. 
            Our platform connects you with verified hosts for intimate, memorable performances.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 2: Music Story
export const MusicStoryStep = ({ formData, updateFormData, errors, clearError }: StepProps) => {
  const { setCanProceed } = useWizard();

  // Always allow proceeding from this step - validation happens on next click
  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="w-8 h-8 text-secondary-600" />
          </div>
          <h2 className="text-2xl font-bold text-evergreen mb-2">
            Your Music Story
          </h2>
          <p className="text-neutral-600">
            Help hosts understand your unique sound and style
          </p>
        </div>

        <div className="space-y-6">
          <TextAreaField
            label="Artist Bio"
            value={formData.bio}
            onChange={(e) => {
              updateFormData({ bio: e.target.value });
              clearError('bio');
            }}
            placeholder="Tell us about your music style, background, and what makes your performances special..."
            required
            maxLength={500}
            showCharCount
            error={errors.bio}
            description="Share your musical journey and what audiences can expect from your shows"
            rows={5}
          />

          <GenreSelect
            label="Musical Genres"
            selectedGenres={formData.genres}
            onChange={(genres) => {
              updateFormData({ genres });
              clearError('genres');
            }}
            required
            error={errors.genres}
            description="Select genres that best describe your music (choose 1-5)"
            maxGenres={5}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Instagram Handle"
              value={formData.socialInstagram}
              onChange={(e) => {
                updateFormData({ socialInstagram: e.target.value });
                clearError('socialInstagram');
              }}
              placeholder="@yourhandle"
              error={errors.socialInstagram}
              description="Your Instagram profile"
            />

            <FormField
              label="Facebook Page"
              value={formData.socialFacebook}
              onChange={(e) => {
                updateFormData({ socialFacebook: e.target.value });
                clearError('socialFacebook');
              }}
              placeholder="facebook.com/yourpage"
              error={errors.socialFacebook}
              description="Your Facebook page or profile"
            />
          </div>

          <FormField
            label="Band Website"
            value={formData.bandWebsite}
            onChange={(e) => {
              updateFormData({ bandWebsite: e.target.value });
              clearError('bandWebsite');
            }}
            placeholder="https://yourbandwebsite.com"
            error={errors.bandWebsite}
            description="Your official website (optional)"
          />
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-sage/10 rounded-lg border border-sage/20">
          <h4 className="font-medium text-sage mb-2">💡 Pro Tips</h4>
          <ul className="text-sm text-neutral-700 space-y-1">
            <li>• Mention your influences and musical background</li>
            <li>• Describe your typical performance style (acoustic, full band, etc.)</li>
            <li>• Share what makes your live shows unique</li>
            <li>• Include any notable achievements or press coverage</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Media & Performance
export const MediaPerformanceStep = ({ formData, updateFormData, errors, clearError }: StepProps) => {
  const { setCanProceed } = useWizard();

  // Always allow proceeding from this step - validation happens on next click
  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhotoIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-evergreen mb-2">
            Show Us Your Sound
          </h2>
          <p className="text-neutral-600">
            Help hosts experience your music through photos and videos
          </p>
        </div>

        <div className="space-y-8">
          <FormField
            label="Spotify Profile URL"
            value={formData.musicProfileUrl}
            onChange={(e) => {
              updateFormData({ musicProfileUrl: e.target.value });
              clearError('musicProfileUrl');
            }}
            placeholder="https://open.spotify.com/artist/..."
            required
            error={errors.musicProfileUrl}
            description="Your Spotify artist profile for music discovery"
          />

          <FormField
            label="Live Performance Video"
            value={formData.performanceVideoUrl}
            onChange={(e) => {
              updateFormData({ performanceVideoUrl: e.target.value });
              clearError('performanceVideoUrl');
            }}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            required
            error={errors.performanceVideoUrl}
            description="A video showcasing your live performance style"
          />

          <FileUpload
            title="Artist & Band Photos"
            description="Upload 1-6 high-quality promotional photos"
            files={formData.artistPhotos}
            onChange={(files) => {
              updateFormData({ artistPhotos: files });
              clearError('artistPhotos');
            }}
            accept="image/*"
            multiple
            maxFiles={6}
            error={errors.artistPhotos}
          />
        </div>

        {/* Requirements Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">📋 What Hosts Look For</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• High-quality photos that show your performance energy</li>
            <li>• A live video that demonstrates your stage presence</li>
            <li>• Professional promotional images for marketing</li>
            <li>• Clear audio in your performance video</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 4: Review & Submit
export const ReviewSubmitStep = ({ formData, updateFormData, errors, clearError }: StepProps) => {
  const { setCanProceed } = useWizard();

  // Validate on terms agreement
  useEffect(() => {
    setCanProceed(formData.agreeToTerms);
  }, [formData.agreeToTerms, setCanProceed]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-evergreen mb-2">
            Review & Submit
          </h2>
          <p className="text-neutral-600">
            Double-check your information before submitting your application
          </p>
        </div>

        {/* Application Summary */}
        <div className="space-y-6">
          {/* Personal Info Summary */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h3 className="font-medium text-neutral-800 mb-3 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-500">Band Name:</span>
                <p className="font-medium">{formData.bandName}</p>
              </div>
              <div>
                <span className="text-neutral-500">Personal Name:</span>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-neutral-500">Email:</span>
                <p className="font-medium">{formData.email}</p>
              </div>
            </div>
          </div>

          {/* Music Info Summary */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h3 className="font-medium text-neutral-800 mb-3 flex items-center">
              <MusicalNoteIcon className="w-5 h-5 mr-2" />
              Music Information
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-neutral-500">Genres:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.genres.map(genre => (
                    <span key={genre} className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-neutral-500">Bio:</span>
                <p className="font-medium mt-1 overflow-hidden text-ellipsis">{formData.bio}</p>
              </div>
            </div>
          </div>

          {/* Media Summary */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h3 className="font-medium text-neutral-800 mb-3 flex items-center">
              <PhotoIcon className="w-5 h-5 mr-2" />
              Media & Links
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Photos uploaded:</span>
                <span className="font-medium">{formData.artistPhotos.length} files</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Spotify profile:</span>
                <span className="font-medium text-green-600">✓ Provided</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Performance video:</span>
                <span className="font-medium text-green-600">✓ Provided</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="mt-8 p-4 border border-neutral-200 rounded-lg">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => {
                updateFormData({ agreeToTerms: e.target.checked });
                clearError('agreeToTerms');
              }}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
            <div className="text-sm">
              <span className="text-neutral-700">
                I agree to the{' '}
                <a href="/terms" target="_blank" className="text-primary-600 hover:text-primary-700 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-primary-600 hover:text-primary-700 underline">
                  Privacy Policy
                </a>
              </span>
              {errors.agreeToTerms && (
                <p className="text-red-600 mt-1">{errors.agreeToTerms}</p>
              )}
            </div>
          </label>
        </div>

        {/* Next Steps */}
        <div className="mt-8 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <h4 className="font-medium text-secondary-800 mb-2">What happens next?</h4>
          <ul className="text-sm text-secondary-700 space-y-1">
            <li>• We'll review your application within 48 hours</li>
            <li>• Approved artists get full platform access</li>
            <li>• You'll receive email confirmation once approved</li>
            <li>• Annual membership fee applies after approval ($400/year)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};