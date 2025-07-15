'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { 
  Home, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Coffee,
  Utensils,
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  Shield,
  ArrowLeft,
  Check
} from 'lucide-react';

export default function LodgingSetupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [lodgingData, setLodgingData] = useState({
    offerLodging: false,
    roomType: 'private_bedroom',
    bathroomType: 'private',
    beds: [{ type: 'queen', quantity: 1 }],
    maxOccupancy: 2,
    amenities: {
      breakfast: false,
      wifi: true,
      parking: false,
      laundry: false,
      kitchenAccess: false,
      workspace: false,
      linensProvided: true,
      towelsProvided: true,
      transportation: 'none'
    },
    houseRules: {
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
      quietHours: { start: '10:00 PM', end: '8:00 AM' },
      smokingPolicy: 'no_smoking',
      petPolicy: 'no_pets',
      alcoholPolicy: 'allowed'
    },
    pricing: {
      baseRate: 50,
      additionalGuestFee: 15,
      cleaningFee: 20
    },
    specialConsiderations: '',
    localRecommendations: '',
    safetyFeatures: ['smoke_detectors', 'first_aid_kit']
  });

  const handleToggleLodging = (offer: boolean) => {
    setLodgingData(prev => ({ ...prev, offerLodging: offer }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save and redirect
      handleSave();
    }
  };

  const handleSave = () => {
    console.log('Saving lodging configuration:', lodgingData);
    // TODO: Implement actual save functionality
    router.push('/dashboard');
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access lodging setup.</p>
        </div>
      </div>
    );
  }

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
            Lodging Setup
          </h1>
          <p className="text-gray-600">
            Configure your overnight accommodation options for touring artists
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 5
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 5) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Lodging Toggle */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Offer Overnight Accommodation
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Would you like to offer overnight accommodation to touring artists? This can help artists save money and creates deeper connections with the local music community.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    lodgingData.offerLodging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleToggleLodging(true)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Yes, I'll offer lodging</h3>
                    {lodgingData.offerLodging && <Check className="w-5 h-5 text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-600">
                    Provide overnight accommodation for artists performing at your venue or nearby
                  </p>
                </div>
                
                <div 
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    !lodgingData.offerLodging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleToggleLodging(false)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">No lodging</h3>
                    {!lodgingData.offerLodging && <Check className="w-5 h-5 text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-600">
                    Focus on hosting shows only. Artists will find their own accommodation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Room Configuration */}
        {currentStep === 2 && lodgingData.offerLodging && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Bed className="w-5 h-5 mr-2" />
                Room Configuration
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type
                  </label>
                  <select
                    value={lodgingData.roomType}
                    onChange={(e) => setLodgingData(prev => ({ ...prev, roomType: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="private_bedroom">Private Bedroom</option>
                    <option value="guest_room">Guest Room</option>
                    <option value="shared_space">Shared Space</option>
                    <option value="couch_surface">Couch/Surface</option>
                  </select>
                </div>

                {/* Bathroom Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathroom Access
                  </label>
                  <select
                    value={lodgingData.bathroomType}
                    onChange={(e) => setLodgingData(prev => ({ ...prev, bathroomType: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="private">Private Bathroom</option>
                    <option value="guest_bathroom">Guest Bathroom</option>
                    <option value="shared">Shared Bathroom</option>
                  </select>
                </div>

                {/* Bed Configuration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bed Configuration
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={lodgingData.beds[0].type}
                      onChange={(e) => setLodgingData(prev => ({
                        ...prev,
                        beds: [{ ...prev.beds[0], type: e.target.value }]
                      }))}
                      className="p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="queen">Queen Bed</option>
                      <option value="king">King Bed</option>
                      <option value="full">Full Bed</option>
                      <option value="twin">Twin Bed</option>
                      <option value="sofa_bed">Sofa Bed</option>
                      <option value="air_mattress">Air Mattress</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={lodgingData.beds[0].quantity}
                      onChange={(e) => setLodgingData(prev => ({
                        ...prev,
                        beds: [{ ...prev.beds[0], quantity: parseInt(e.target.value) }]
                      }))}
                      className="p-3 border border-gray-300 rounded-lg"
                      placeholder="Quantity"
                    />
                  </div>
                </div>

                {/* Max Occupancy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={lodgingData.maxOccupancy}
                    onChange={(e) => setLodgingData(prev => ({ ...prev, maxOccupancy: parseInt(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Amenities */}
        {currentStep === 3 && lodgingData.offerLodging && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Coffee className="w-5 h-5 mr-2" />
                Amenities & Services
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Breakfast */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Coffee className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-medium">Breakfast</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={lodgingData.amenities.breakfast}
                    onChange={(e) => setLodgingData(prev => ({
                      ...prev,
                      amenities: { ...prev.amenities, breakfast: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>

                {/* WiFi */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Wifi className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-medium">WiFi</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={lodgingData.amenities.wifi}
                    onChange={(e) => setLodgingData(prev => ({
                      ...prev,
                      amenities: { ...prev.amenities, wifi: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>

                {/* Parking */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Car className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-medium">Parking</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={lodgingData.amenities.parking}
                    onChange={(e) => setLodgingData(prev => ({
                      ...prev,
                      amenities: { ...prev.amenities, parking: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>

                {/* Kitchen Access */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Utensils className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-medium">Kitchen Access</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={lodgingData.amenities.kitchenAccess}
                    onChange={(e) => setLodgingData(prev => ({
                      ...prev,
                      amenities: { ...prev.amenities, kitchenAccess: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>

                {/* Workspace */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-medium">Workspace</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={lodgingData.amenities.workspace}
                    onChange={(e) => setLodgingData(prev => ({
                      ...prev,
                      amenities: { ...prev.amenities, workspace: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>

                {/* Laundry */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-medium">Laundry</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={lodgingData.amenities.laundry}
                    onChange={(e) => setLodgingData(prev => ({
                      ...prev,
                      amenities: { ...prev.amenities, laundry: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Pricing */}
        {currentStep === 4 && lodgingData.offerLodging && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Rate (per night)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={lodgingData.pricing.baseRate}
                    onChange={(e) => setLodgingData(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, baseRate: parseInt(e.target.value) }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Guest Fee (per person, per night)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={lodgingData.pricing.additionalGuestFee}
                    onChange={(e) => setLodgingData(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, additionalGuestFee: parseInt(e.target.value) }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cleaning Fee (one-time)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={lodgingData.pricing.cleaningFee}
                    onChange={(e) => setLodgingData(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, cleaningFee: parseInt(e.target.value) }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Final Details */}
        {currentStep === 5 && lodgingData.offerLodging && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Final Details
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Considerations
                  </label>
                  <textarea
                    value={lodgingData.specialConsiderations}
                    onChange={(e) => setLodgingData(prev => ({ ...prev, specialConsiderations: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg h-24"
                    placeholder="Any special notes about your space, accessibility, or requirements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Local Recommendations
                  </label>
                  <textarea
                    value={lodgingData.localRecommendations}
                    onChange={(e) => setLodgingData(prev => ({ ...prev, localRecommendations: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg h-24"
                    placeholder="Favorite local restaurants, attractions, or places to visit..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!lodgingData.offerLodging && currentStep > 1}
          >
            {currentStep === 5 ? 'Save Configuration' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}