import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface BookingFormData {
  eventDate: string;
  eventTime: string;
  expectedGuests: number;
  doorFee: number;
  message: string;
  specialRequirements: string;
  contactPhone: string;
  agreeToTerms: boolean;
  needsLodging: boolean;
  lodgingDetails: {
    guestCount: number;
    arrivalDate: string;
    departureDate: string;
    specialRequirements: string;
    dietaryRestrictions: string;
    accessibilityNeeds: string;
  };
}

interface BookingFormProps {
  formData: BookingFormData;
  errors: string[];
  isSubmitting: boolean;
  isHostBookingArtist: boolean;
  isArtistBookingHost: boolean;
  host?: any;
  artist?: any;
  onFormDataChange: (data: Partial<BookingFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  profileType: 'host' | 'artist';
}

export function BookingForm({
  formData,
  errors,
  isSubmitting,
  isHostBookingArtist,
  isArtistBookingHost,
  host,
  artist,
  onFormDataChange,
  onSubmit,
  profileType
}: BookingFormProps) {
  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleLodgingDetailsChange = (field: keyof BookingFormData['lodgingDetails'], value: any) => {
    onFormDataChange({
      lodgingDetails: {
        ...formData.lodgingDetails,
        [field]: value
      }
    });
  };

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Booking Details</h2>
        </CardHeader>
        <CardContent>
          {/* Error Display */}
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

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Date & Time */}
            <div className={isArtistBookingHost ? "" : "grid md:grid-cols-2 gap-4"}>
              <Input
                label="Event Date"
                type="date"
                value={formData.eventDate}
                onChange={(e) => handleInputChange('eventDate', e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
              {isHostBookingArtist && (
                <Input
                  label="Start Time"
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => handleInputChange('eventTime', e.target.value)}
                  required
                />
              )}
            </div>

            {/* Capacity & Pricing */}
            {isHostBookingArtist ? (
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Expected Guests"
                  type="number"
                  value={formData.expectedGuests}
                  onChange={(e) => handleInputChange('expectedGuests', parseInt(e.target.value))}
                  required
                  min="1"
                  max={host?.showSpecs?.indoorAttendanceMax || 100}
                />
              </div>
            ) : (
              <div>
                <Input
                  label="Suggested Door Fee ($)"
                  type="number"
                  value={formData.doorFee}
                  onChange={(e) => handleInputChange('doorFee', parseInt(e.target.value))}
                  min="0"
                />
              </div>
            )}

            {/* Contact */}
            <Input
              label="Contact Phone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
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
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                rows={4}
                placeholder={isArtistBookingHost ? 'Any notes or comments about this booking request?' : `Tell them about your ${profileType === 'host' ? 'event plans' : 'music and what makes this a good fit'}...`}
                required
              />
            </div>

            {/* Special Requirements - only for hosts booking artists */}
            {isHostBookingArtist && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requirements (optional)
                </label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                  rows={3}
                  placeholder="Sound setup, accessibility needs, dietary restrictions, etc."
                />
              </div>
            )}

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
                      onChange={(e) => handleInputChange('needsLodging', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="needsLodging" className="text-sm font-medium text-gray-700">
                      I need overnight accommodation
                    </label>
                  </div>

                  {formData.needsLodging && (
                    <div className="ml-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Input
                          label="Number of Guests"
                          type="number"
                          value={formData.lodgingDetails.guestCount}
                          onChange={(e) => handleLodgingDetailsChange('guestCount', parseInt(e.target.value))}
                          min="1"
                          max="10"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dietary Restrictions
                        </label>
                        <textarea
                          value={formData.lodgingDetails.dietaryRestrictions}
                          onChange={(e) => handleLodgingDetailsChange('dietaryRestrictions', e.target.value)}
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
                          onChange={(e) => handleLodgingDetailsChange('specialRequirements', e.target.value)}
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
                  <label className="flex items-center mt-3">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
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
  );
}