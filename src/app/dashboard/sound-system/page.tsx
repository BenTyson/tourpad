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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sound System Setup</h1>
            <p className="text-gray-600">
              Configure your sound system details to help artists understand your audio capabilities
            </p>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-green-900">Sound System Updated!</h3>
                <p className="text-sm text-green-800">Your sound system details have been saved successfully.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <h3 className="font-medium text-red-900">Error</h3>
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sound System Availability */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Volume2 className="w-5 h-5 text-gray-600 mr-3" />
                <h2 className="text-xl font-semibold">Sound System Availability</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="available"
                      checked={soundSystemData.available}
                      onChange={() => setSoundSystemData(prev => ({ ...prev, available: true }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      Yes, I have a sound system available for artists
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="available"
                      checked={!soundSystemData.available}
                      onChange={() => setSoundSystemData(prev => ({ ...prev, available: false }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      No, artists should bring their own sound equipment
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sound System Details - Only show if available */}
          {soundSystemData.available && (
            <>
              {/* System Description */}
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Info className="w-5 h-5 text-gray-600 mr-3" />
                    <h2 className="text-xl font-semibold">System Description</h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        General Description *
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Describe your sound system setup, quality, and what makes it special..."
                        value={soundSystemData.description}
                        onChange={(e) => setSoundSystemData(prev => ({ ...prev, description: e.target.value }))}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Equipment Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-gray-600 mr-3" />
                    <h2 className="text-xl font-semibold">Equipment Details</h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="speakers" className="block text-sm font-medium text-gray-700 mb-2">
                        Speakers *
                      </label>
                      <Input
                        id="speakers"
                        placeholder="e.g., JBL EON615, Yamaha HS8 monitors..."
                        value={soundSystemData.equipment.speakers}
                        onChange={(e) => setSoundSystemData(prev => ({ 
                          ...prev, 
                          equipment: { ...prev.equipment, speakers: e.target.value }
                        }))}
                        className={errors.speakers ? 'border-red-300' : ''}
                      />
                      {errors.speakers && (
                        <p className="mt-1 text-sm text-red-600">{errors.speakers}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="microphones" className="block text-sm font-medium text-gray-700 mb-2">
                        Microphones *
                      </label>
                      <Input
                        id="microphones"
                        placeholder="e.g., Shure SM58, Audio-Technica AT2020..."
                        value={soundSystemData.equipment.microphones}
                        onChange={(e) => setSoundSystemData(prev => ({ 
                          ...prev, 
                          equipment: { ...prev.equipment, microphones: e.target.value }
                        }))}
                        className={errors.microphones ? 'border-red-300' : ''}
                      />
                      {errors.microphones && (
                        <p className="mt-1 text-sm text-red-600">{errors.microphones}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="mixingBoard" className="block text-sm font-medium text-gray-700 mb-2">
                        Mixing Board / Audio Interface
                      </label>
                      <Input
                        id="mixingBoard"
                        placeholder="e.g., Yamaha MG10XU, Focusrite Scarlett..."
                        value={soundSystemData.equipment.mixingBoard}
                        onChange={(e) => setSoundSystemData(prev => ({ 
                          ...prev, 
                          equipment: { ...prev.equipment, mixingBoard: e.target.value }
                        }))}
                      />
                    </div>

                    <div>
                      <label htmlFor="instruments" className="block text-sm font-medium text-gray-700 mb-2">
                        Available Instruments
                      </label>
                      <Input
                        id="instruments"
                        placeholder="e.g., Piano, keyboard, guitar amp..."
                        value={soundSystemData.equipment.instruments}
                        onChange={(e) => setSoundSystemData(prev => ({ 
                          ...prev, 
                          equipment: { ...prev.equipment, instruments: e.target.value }
                        }))}
                      />
                    </div>

                    <div>
                      <label htmlFor="additional" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Equipment
                      </label>
                      <Input
                        id="additional"
                        placeholder="e.g., Cables, stands, lighting..."
                        value={soundSystemData.equipment.additional}
                        onChange={(e) => setSoundSystemData(prev => ({ 
                          ...prev, 
                          equipment: { ...prev.equipment, additional: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Limitations & Setup Notes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-gray-600 mr-3" />
                    <h2 className="text-xl font-semibold">Limitations & Setup Notes</h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="limitations" className="block text-sm font-medium text-gray-700 mb-2">
                        System Limitations
                      </label>
                      <textarea
                        id="limitations"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any limitations artists should know about (volume, instruments, etc.)..."
                        value={soundSystemData.limitations}
                        onChange={(e) => setSoundSystemData(prev => ({ ...prev, limitations: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label htmlFor="setupNotes" className="block text-sm font-medium text-gray-700 mb-2">
                        Setup Notes for Artists
                      </label>
                      <textarea
                        id="setupNotes"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Instructions for soundcheck, setup time, who handles mixing, etc..."
                        value={soundSystemData.setupNotes}
                        onChange={(e) => setSoundSystemData(prev => ({ ...prev, setupNotes: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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