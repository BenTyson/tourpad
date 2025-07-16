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
    numberOfRooms: 1,
    rooms: [
      {
        id: 1,
        roomType: 'private_bedroom',
        bathroomType: 'private',
        beds: [{ type: 'queen', quantity: 1 }],
        maxOccupancy: 2
      }
    ],
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
    specialConsiderations: '',
    localRecommendations: '',
    safetyFeatures: ['smoke_detectors', 'first_aid_kit']
  });

  const handleToggleLodging = (offer: boolean) => {
    setLodgingData(prev => ({ ...prev, offerLodging: offer }));
  };

  const handleNumberOfRoomsChange = (numRooms: number) => {
    setLodgingData(prev => {
      const newRooms = [...prev.rooms];
      
      if (numRooms > prev.rooms.length) {
        // Add new rooms
        for (let i = prev.rooms.length; i < numRooms; i++) {
          newRooms.push({
            id: i + 1,
            roomType: 'private_bedroom',
            bathroomType: 'private',
            beds: [{ type: 'queen', quantity: 1 }],
            maxOccupancy: 2
          });
        }
      } else if (numRooms < prev.rooms.length) {
        // Remove rooms
        newRooms.splice(numRooms);
      }
      
      return {
        ...prev,
        numberOfRooms: numRooms,
        rooms: newRooms
      };
    });
  };

  const updateRoom = (roomId: number, updates: Partial<typeof lodgingData.rooms[0]>) => {
    setLodgingData(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => 
        room.id === roomId ? { ...room, ...updates } : room
      )
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) { // Changed from 5 to 4 (removed pricing step)
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600">Please sign in to access lodging setup.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="hover:bg-neutral-100 text-neutral-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Lodging Setup
            </h1>
            <p className="text-neutral-600">
              Configure your overnight accommodation options for touring artists
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-900">
              Step {currentStep} of 4
            </span>
            <span className="text-sm text-neutral-600">
              {Math.round((currentStep / 4) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div 
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Lodging Toggle */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-xl font-semibold flex items-center text-neutral-900">
                <Home className="w-5 h-5 mr-2 text-primary-600" />
                Offer Overnight Accommodation
              </h2>
            </div>
            <div className="p-6">
              <p className="text-neutral-600 mb-6">
                Would you like to offer overnight accommodation to touring artists? This can help artists save money and creates deeper connections with the local music community.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    lodgingData.offerLodging ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                  onClick={() => handleToggleLodging(true)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900">Yes, I'll offer lodging</h3>
                    {lodgingData.offerLodging && <Check className="w-5 h-5 text-primary-600" />}
                  </div>
                  <p className="text-sm text-neutral-600">
                    Provide overnight accommodation for artists performing at your venue or nearby
                  </p>
                </div>
                
                <div 
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    !lodgingData.offerLodging ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                  onClick={() => handleToggleLodging(false)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900">No lodging</h3>
                    {!lodgingData.offerLodging && <Check className="w-5 h-5 text-primary-600" />}
                  </div>
                  <p className="text-sm text-neutral-600">
                    Focus on hosting shows only. Artists will find their own accommodation
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Room Configuration */}
        {currentStep === 2 && lodgingData.offerLodging && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-xl font-semibold flex items-center text-neutral-900">
                <Bed className="w-5 h-5 mr-2 text-primary-600" />
                Room Configuration
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Number of Rooms */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Number of Rooms Available
                  </label>
                  <select
                    value={lodgingData.numberOfRooms}
                    onChange={(e) => handleNumberOfRoomsChange(parseInt(e.target.value))}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Room Details */}
                <div className="space-y-6">
                  {lodgingData.rooms.map((room, index) => (
                    <div key={room.id} className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">
                        Room {index + 1}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Room Type */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Room Type
                          </label>
                          <select
                            value={room.roomType}
                            onChange={(e) => updateRoom(room.id, { roomType: e.target.value })}
                            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="private_bedroom">Private Bedroom</option>
                            <option value="guest_room">Guest Room</option>
                            <option value="shared_space">Shared Space</option>
                            <option value="couch_surface">Couch/Surface</option>
                          </select>
                        </div>

                        {/* Bathroom Type */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Bathroom Access
                          </label>
                          <select
                            value={room.bathroomType}
                            onChange={(e) => updateRoom(room.id, { bathroomType: e.target.value })}
                            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="private">Private Bathroom</option>
                            <option value="guest_bathroom">Guest Bathroom</option>
                            <option value="shared">Shared Bathroom</option>
                          </select>
                        </div>

                        {/* Bed Configuration */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Bed Type
                          </label>
                          <select
                            value={room.beds[0].type}
                            onChange={(e) => updateRoom(room.id, { 
                              beds: [{ ...room.beds[0], type: e.target.value }] 
                            })}
                            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="queen">Queen Bed</option>
                            <option value="king">King Bed</option>
                            <option value="full">Full Bed</option>
                            <option value="twin">Twin Bed</option>
                            <option value="sofa_bed">Sofa Bed</option>
                            <option value="air_mattress">Air Mattress</option>
                          </select>
                        </div>

                        {/* Maximum Guests */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Maximum Guests
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={room.maxOccupancy}
                            onChange={(e) => updateRoom(room.id, { maxOccupancy: parseInt(e.target.value) })}
                            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Amenities */}
        {currentStep === 3 && lodgingData.offerLodging && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-xl font-semibold flex items-center text-neutral-900">
                <Coffee className="w-5 h-5 mr-2 text-primary-600" />
                Amenities & Services
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Breakfast */}
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <Coffee className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="font-medium text-neutral-900">Breakfast</span>
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
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <Wifi className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="font-medium text-neutral-900">WiFi</span>
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
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <Car className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="font-medium text-neutral-900">Parking</span>
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
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <Utensils className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="font-medium text-neutral-900">Kitchen Access</span>
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
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="font-medium text-neutral-900">Workspace</span>
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
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="font-medium text-neutral-900">Laundry</span>
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
            </div>
          </div>
        )}

        {/* Step 4: Final Details */}
        {currentStep === 4 && lodgingData.offerLodging && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-xl font-semibold flex items-center text-neutral-900">
                <Shield className="w-5 h-5 mr-2 text-primary-600" />
                Final Details
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
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
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
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
            </div>
          </div>
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
            {currentStep === 4 ? 'Save Configuration' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}