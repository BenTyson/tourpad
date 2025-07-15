'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { 
  Upload,
  X,
  Camera,
  ArrowLeft,
  Plus,
  Eye,
  Trash2,
  Check,
  AlertTriangle
} from 'lucide-react';

interface LodgingPhoto {
  id: string;
  url: string;
  category: 'bedroom' | 'bathroom' | 'common_area' | 'exterior' | 'amenities';
  title: string;
  description?: string;
  isRequired: boolean;
}

const photoCategories = [
  { 
    id: 'bedroom', 
    name: 'Bedroom', 
    description: 'Photos of the sleeping area',
    required: true,
    icon: '🛏️'
  },
  { 
    id: 'bathroom', 
    name: 'Bathroom', 
    description: 'Photos of the bathroom guests will use',
    required: true,
    icon: '🚿'
  },
  { 
    id: 'common_area', 
    name: 'Common Areas', 
    description: 'Kitchen, living room, shared spaces',
    required: false,
    icon: '🏠'
  },
  { 
    id: 'exterior', 
    name: 'Exterior', 
    description: 'Outside view for easy recognition',
    required: false,
    icon: '🏡'
  },
  { 
    id: 'amenities', 
    name: 'Amenities', 
    description: 'Parking, workspace, special features',
    required: false,
    icon: '⭐'
  }
];

export default function LodgingPhotosPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [photos, setPhotos] = useState<LodgingPhoto[]>([
    {
      id: 'photo1',
      url: 'https://picsum.photos/400/300?random=1',
      category: 'bedroom',
      title: 'Main Bedroom',
      description: 'Queen bed with city view',
      isRequired: true
    },
    {
      id: 'photo2',
      url: 'https://picsum.photos/400/300?random=2',
      category: 'bathroom',
      title: 'Guest Bathroom',
      description: 'Full bathroom with shower',
      isRequired: true
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('bedroom');
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);

  const handleFileUpload = (category: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingCategory(category);
    
    // Simulate file upload
    setTimeout(() => {
      const newPhotos = Array.from(files).map((file, index) => ({
        id: `photo_${Date.now()}_${index}`,
        url: URL.createObjectURL(file),
        category: category as any,
        title: `${category} photo ${photos.filter(p => p.category === category).length + index + 1}`,
        description: '',
        isRequired: photoCategories.find(c => c.id === category)?.required || false
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
      setUploadingCategory(null);
    }, 1500);
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const getPhotosByCategory = (category: string) => {
    return photos.filter(p => p.category === category);
  };

  const getRequiredCategoriesStatus = () => {
    const requiredCategories = photoCategories.filter(c => c.required);
    return requiredCategories.map(category => ({
      ...category,
      hasPhotos: getPhotosByCategory(category.id).length > 0
    }));
  };

  const allRequiredPhotosUploaded = getRequiredCategoriesStatus().every(c => c.hasPhotos);

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access lodging photos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
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
            Lodging Photos
          </h1>
          <p className="text-gray-600">
            Upload photos of your lodging space to help artists understand what to expect
          </p>
        </div>

        {/* Required Photos Status */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Photo Requirements
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getRequiredCategoriesStatus().map(category => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {category.hasPhotos ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      )}
                      <span className="ml-2 text-sm">
                        {getPhotosByCategory(category.id).length} photos
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {!allRequiredPhotosUploaded && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                    <span className="text-amber-800">
                      Please upload at least one photo for each required category (Bedroom and Bathroom)
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Photo Categories</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {photoCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedCategory === category.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{category.icon}</span>
                          <div>
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          {category.required && <span className="text-red-500 mr-1">*</span>}
                          <span>{getPhotosByCategory(category.id).length}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photo Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {photoCategories.find(c => c.id === selectedCategory)?.name} Photos
                  </h2>
                  <label className="cursor-pointer">
                    <Button disabled={uploadingCategory === selectedCategory}>
                      <Plus className="w-4 h-4 mr-2" />
                      {uploadingCategory === selectedCategory ? 'Uploading...' : 'Add Photos'}
                    </Button>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(selectedCategory, e.target.files)}
                      disabled={uploadingCategory === selectedCategory}
                    />
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPhotosByCategory(selectedCategory).map(photo => (
                    <div key={photo.id} className="relative group">
                      <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      
                      {/* Photo Actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white text-gray-900 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white text-red-600 hover:bg-red-50"
                            onClick={() => handleDeletePhoto(photo.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Photo Info */}
                      <div className="mt-2">
                        <h4 className="font-medium text-sm">{photo.title}</h4>
                        {photo.description && (
                          <p className="text-xs text-gray-600">{photo.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {getPhotosByCategory(selectedCategory).length === 0 && (
                    <div className="col-span-full">
                      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No photos yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Upload photos to showcase your {selectedCategory} space
                        </p>
                        <label className="cursor-pointer">
                          <Button>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photos
                          </Button>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(selectedCategory, e.target.files)}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => router.push('/dashboard')}
            disabled={!allRequiredPhotosUploaded}
            className="w-full md:w-auto"
          >
            {allRequiredPhotosUploaded ? 'Save Photos' : 'Complete Required Photos First'}
          </Button>
        </div>
      </div>
    </div>
  );
}