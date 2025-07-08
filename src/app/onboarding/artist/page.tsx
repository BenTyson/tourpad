'use client';
import { useState } from 'react';
import { MusicalNoteIcon, ArrowRightIcon, ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface Member {
  name: string;
  instrument: string;
}

export default function ArtistOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    // Step 1: About Artist/Band
    name: '',
    bio: '',
    yearsActive: '',
    members: [{ name: '', instrument: '' }] as Member[],
    
    // Step 2: Tour & Logistics
    tourMonthsPerYear: '',
    tourVehicle: 'car',
    requireHomeStay: false,
    travelWithAnimals: false,
    petAllergies: '',
    dietaryRestrictions: '',
    ownSoundSystem: false,
    
    // Step 3: Promo & Media
    socialLinks: {
      website: '',
      spotify: '',
      facebook: '',
      instagram: '',
      youtube: '',
      patreon: ''
    },
    paymentLinks: {
      venmo: '',
      paypal: ''
    },
    livePerformanceVideo: '',
    
    // Step 4: Policies & Payment
    cancellationPolicy: 'flexible' as 'strict' | 'flexible',
    cancellationGuarantee: ''
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

  const handleSubmit = () => {
  console.log('Artist onboarding data:', formData);
  // TODO: Submit to backend for approval first
  alert('Application submitted for review! You will receive an email when approved, then you can complete your $400 annual membership payment.');
  window.location.href = '/dashboard';
};

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: '', instrument: '' }]
    });
  };

  const removeMember = (index: number) => {
    const newMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: newMembers });
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, members: newMembers });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MusicalNoteIcon className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              Artist Application
            </h1>
          </div>
          <p className="text-gray-600">
            Join our network of touring musicians
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
              {currentStep === 1 && "About Artist/Band"}
              {currentStep === 2 && "Tour & Logistics"}
              {currentStep === 3 && "Promo & Media"}
              {currentStep === 4 && "Policies & Payment"}
            </h2>
          </CardHeader>

          <CardContent>
            {/* Step 1: About Artist/Band */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Input
                  label="Artist/Band Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your stage name or band name"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                    rows={4}
                    placeholder="Tell us about your music style, background, and what makes you unique..."
                  />
                </div>

                <Input
                  label="Years Active"
                  type="number"
                  value={formData.yearsActive}
                  onChange={(e) => setFormData({ ...formData, yearsActive: e.target.value })}
                  placeholder="5"
                />

                {/* Band Members */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Band Members
                    </label>
                    <Button
                      type="button"
                      onClick={addMember}
                      variant="outline"
                      size="sm"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Add Member
                    </Button>
                  </div>
                  
                  {formData.members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Instrument"
                        value={member.instrument}
                        onChange={(e) => updateMember(index, 'instrument', e.target.value)}
                      />
                      {formData.members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMember(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Tour & Logistics */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Input
                  label="Months Per Year Touring"
                  type="number"
                  value={formData.tourMonthsPerYear}
                  onChange={(e) => setFormData({ ...formData, tourMonthsPerYear: e.target.value })}
                  placeholder="6"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tour Vehicle
                  </label>
                  <select
                    value={formData.tourVehicle}
                    onChange={(e) => setFormData({ ...formData, tourVehicle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="highRoofVan">High Roof Van</option>
                    <option value="RV">RV</option>
                    <option value="trailer">Trailer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.requireHomeStay}
                      onChange={(e) => setFormData({ ...formData, requireHomeStay: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Require overnight stay/lodging</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.travelWithAnimals}
                      onChange={(e) => setFormData({ ...formData, travelWithAnimals: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Travel with animals/pets</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.ownSoundSystem}
                      onChange={(e) => setFormData({ ...formData, ownSoundSystem: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Own sound system</span>
                  </label>
                </div>

                <Input
                  label="Pet Allergies (if any)"
                  value={formData.petAllergies}
                  onChange={(e) => setFormData({ ...formData, petAllergies: e.target.value })}
                  placeholder="None, or list specific allergies"
                />

                <Input
                  label="Dietary Restrictions (if any)"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                  placeholder="None, vegetarian, vegan, etc."
                />
              </div>
            )}

            {/* Step 3: Promo & Media */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Social Links</h3>
                  <div className="space-y-3">
                    <Input
                      label="Website"
                      value={formData.socialLinks.website}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, website: e.target.value }
                      })}
                      placeholder="https://yourwebsite.com"
                    />
                    <Input
                      label="Spotify"
                      value={formData.socialLinks.spotify}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, spotify: e.target.value }
                      })}
                      placeholder="Spotify artist URL"
                    />
                    <Input
                      label="YouTube"
                      value={formData.socialLinks.youtube}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                      })}
                      placeholder="YouTube channel URL"
                    />
                  </div>
                </div>

                <Input
                  label="Live Performance Video"
                  value={formData.livePerformanceVideo}
                  onChange={(e) => setFormData({ ...formData, livePerformanceVideo: e.target.value })}
                  placeholder="Link to a live performance video"
                />

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Links</h3>
                  <div className="space-y-3">
                    <Input
                      label="Venmo"
                      value={formData.paymentLinks.venmo}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentLinks: { ...formData.paymentLinks, venmo: e.target.value }
                      })}
                      placeholder="@yourusername"
                    />
                    <Input
                      label="PayPal"
                      value={formData.paymentLinks.paypal}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentLinks: { ...formData.paymentLinks, paypal: e.target.value }
                      })}
                      placeholder="PayPal.me link or email"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Policies & Payment */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Policy
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="flexible"
                        checked={formData.cancellationPolicy === 'flexible'}
                        onChange={(e) => setFormData({ ...formData, cancellationPolicy: 'flexible' })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        <strong>Flexible:</strong> Cancel up to 7 days before show
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="strict"
                        checked={formData.cancellationPolicy === 'strict'}
                        onChange={(e) => setFormData({ ...formData, cancellationPolicy: 'strict' })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        <strong>Strict:</strong> No cancellations within 14 days of show
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cancellation Guarantee (optional)
                  </label>
                  <textarea
                    value={formData.cancellationGuarantee}
                    onChange={(e) => setFormData({ ...formData, cancellationGuarantee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows={3}
                    placeholder="Describe what you guarantee if you need to cancel (makeup show, partial refund, etc.)"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Annual Membership</h3>
                  <p className="text-sm text-blue-800">
                    TourPad artists pay $400/year to access our network of hosts. 
                    After submitting this application, you'll be redirected to complete your payment.
                  </p>
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
                <Button onClick={handleSubmit}>
                  Submit for Review
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}