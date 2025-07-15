'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Save,
  Volume2,
  Mic,
  Music,
  Settings,
  AlertCircle,
  Info,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function SoundSystemSetupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [soundSystemData, setSoundSystemData] = useState({
    available: true,
    description: 'Professional-grade sound system perfect for intimate acoustic performances. The system has been optimized for the acoustics of our 1920s home.',
    equipment: {
      speakers: 'Pair of Yamaha HS8 studio monitors, JBL EON615 mains for larger events',
      microphones: '2x Shure SM58 dynamic mics, 1x Audio-Technica AT2020 condenser mic with stand',
      mixingBoard: 'Yamaha MG10XU 10-channel analog mixer with built-in effects',
      instruments: 'Yamaha P-45 digital piano, acoustic guitar DI available',
      additional: 'XLR and 1/4" cables, mic stands, basic lighting for performance area'
    },
    limitations: 'System works best for solo artists or small ensembles (max 3 pieces). Not suitable for full drum kits or high-volume rock performances.',
    setupNotes: 'Artists can do soundcheck starting 1 hour before show. I handle all mixing during performance. Please bring your own instruments and any specific cables you need.'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // Basic validation
      const validationErrors: Record<string, string> = {};
      
      if (soundSystemData.available && !soundSystemData.description.trim()) {
        validationErrors.description = 'Please provide a description of your sound system';
      }
      
      if (soundSystemData.available && !soundSystemData.equipment.speakers.trim()) {
        validationErrors.speakers = 'Please describe your speakers';
      }
      
      if (soundSystemData.available && !soundSystemData.equipment.microphones.trim()) {
        validationErrors.microphones = 'Please describe your microphones';
      }
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      
      // TODO: Submit to backend API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Sound system setup error:', error);
      setErrors({ general: 'An error occurred while saving your sound system setup. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sound System Setup
          </h1>
          <p className="text-gray-600">
            Configure your sound system details to help artists prepare for their performance
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-green-900">Sound system setup saved!</h3>
                <p className="text-sm text-green-800">Your sound system information has been updated successfully.</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sound System Availability */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Sound System Availability</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you have a sound system available for artists?
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="available"
                        value="true"
                        checked={soundSystemData.available === true}
                        onChange={(e) => setSoundSystemData({ ...soundSystemData, available: true })}
                        className="mr-3"
                      />
                      <span>Yes, I have a sound system</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="available"
                        value="false"
                        checked={soundSystemData.available === false}
                        onChange={(e) => setSoundSystemData({ ...soundSystemData, available: false })}
                        className="mr-3"
                      />
                      <span>No, artists need to bring their own equipment</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sound System Details - Only show if available */}
          {soundSystemData.available && (
            <>
              {/* General Description */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">System Description</h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Description
                    </label>
                    <textarea
                      value={soundSystemData.description}
                      onChange={(e) => setSoundSystemData({ ...soundSystemData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={4}
                      placeholder="Describe your sound system in general terms - what type of performances is it best suited for?"
                      required
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Equipment Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">Equipment Details</h2>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Speakers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Speakers & Monitors
                    </label>
                    <textarea
                      value={soundSystemData.equipment.speakers}
                      onChange={(e) => setSoundSystemData({ 
                        ...soundSystemData, 
                        equipment: { ...soundSystemData.equipment, speakers: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={2}
                      placeholder="e.g., Pair of Yamaha HS8 studio monitors, JBL EON615 mains"
                      required
                    />
                    {errors.speakers && (
                      <p className="mt-1 text-sm text-red-600">{errors.speakers}</p>
                    )}
                  </div>

                  {/* Microphones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Microphones
                    </label>
                    <textarea
                      value={soundSystemData.equipment.microphones}
                      onChange={(e) => setSoundSystemData({ 
                        ...soundSystemData, 
                        equipment: { ...soundSystemData.equipment, microphones: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={2}
                      placeholder="e.g., 2x Shure SM58 dynamic mics, 1x Audio-Technica AT2020 condenser mic"
                      required
                    />
                    {errors.microphones && (
                      <p className="mt-1 text-sm text-red-600">{errors.microphones}</p>
                    )}
                  </div>

                  {/* Mixing Board */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mixing Board / Console
                    </label>
                    <textarea
                      value={soundSystemData.equipment.mixingBoard}
                      onChange={(e) => setSoundSystemData({ 
                        ...soundSystemData, 
                        equipment: { ...soundSystemData.equipment, mixingBoard: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={2}
                      placeholder="e.g., Yamaha MG10XU 10-channel analog mixer with built-in effects"
                    />
                  </div>

                  {/* Instruments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Instruments
                    </label>
                    <textarea
                      value={soundSystemData.equipment.instruments}
                      onChange={(e) => setSoundSystemData({ 
                        ...soundSystemData, 
                        equipment: { ...soundSystemData.equipment, instruments: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={2}
                      placeholder="e.g., Yamaha P-45 digital piano, acoustic guitar DI available"
                    />
                  </div>

                  {/* Additional Equipment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Equipment
                    </label>
                    <textarea
                      value={soundSystemData.equipment.additional}
                      onChange={(e) => setSoundSystemData({ 
                        ...soundSystemData, 
                        equipment: { ...soundSystemData.equipment, additional: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={2}
                      placeholder="e.g., XLR and 1/4\" cables, mic stands, basic lighting"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Limitations & Setup Notes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h2 className="text-xl font-semibold">Limitations & Setup</h2>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Limitations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      System Limitations
                    </label>
                    <textarea
                      value={soundSystemData.limitations}
                      onChange={(e) => setSoundSystemData({ ...soundSystemData, limitations: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={3}
                      placeholder="e.g., System works best for solo artists or small ensembles. Not suitable for full drum kits."
                    />
                    <p className="mt-1 text-sm text-gray-600">
                      Help artists understand what types of performances work best with your system
                    </p>
                  </div>

                  {/* Setup Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Setup Notes & Instructions
                    </label>
                    <textarea
                      value={soundSystemData.setupNotes}
                      onChange={(e) => setSoundSystemData({ ...soundSystemData, setupNotes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400"
                      rows={4}
                      placeholder="e.g., Artists can do soundcheck starting 1 hour before show. I handle all mixing during performance."
                    />
                    <p className="mt-1 text-sm text-gray-600">
                      Include soundcheck timing, who handles mixing, what artists should bring, etc.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-red-800">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Sound System
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}