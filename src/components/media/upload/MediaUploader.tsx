'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  XMarkIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  category?: string;
}

interface MediaUploaderProps {
  acceptedTypes: 'images' | 'videos' | 'both';
  maxFiles?: number;
  maxSizeMB?: number;
  onUpload: (files: MediaFile[]) => void;
  categories?: { value: string; label: string }[];
  className?: string;
}

export function MediaUploader({ 
  acceptedTypes, 
  maxFiles = 10, 
  maxSizeMB = 50,
  onUpload,
  categories = [],
  className = '' 
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getAcceptedFormats = () => {
    switch (acceptedTypes) {
      case 'images':
        return { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] };
      case 'videos':
        return { 'video/*': ['.mp4', '.mov', '.avi', '.webm'] };
      case 'both':
        return { 
          'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
          'video/*': ['.mp4', '.mov', '.avi', '.webm']
        };
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: MediaFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      progress: 0,
      status: 'uploading' as const
    }));

    setFiles(prev => [...prev, ...newFiles]);
    simulateUpload(newFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: getAcceptedFormats(),
    maxFiles: maxFiles - files.length,
    maxSize: maxSizeMB * 1024 * 1024,
    disabled: isUploading || files.length >= maxFiles
  });

  const simulateUpload = async (newFiles: MediaFile[]) => {
    setIsUploading(true);
    
    for (const file of newFiles) {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      }
      
      // Mark as completed
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'completed' } : f
      ));
    }
    
    setIsUploading(false);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const updateFileCategory = (fileId: string, category: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, category } : f
    ));
  };

  const handleUpload = () => {
    onUpload(files.filter(f => f.status === 'completed'));
  };

  const getDropzoneText = () => {
    if (isDragActive) {
      return isDragReject ? 'Invalid file type' : 'Drop files here';
    }
    return `Drop ${acceptedTypes} here, or click to select`;
  };

  const getFileIcon = (type: 'image' | 'video') => {
    return type === 'image' ? PhotoIcon : VideoCameraIcon;
  };

  const completedFiles = files.filter(f => f.status === 'completed');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dropzone */}
      {files.length < maxFiles && (
        <Card>
          <CardContent className="p-0">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer ${
                isDragActive
                  ? isDragReject
                    ? 'border-red-400 bg-red-50'
                    : 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 text-gray-400">
                  <CloudArrowUpIcon className="w-full h-full" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {getDropzoneText()}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {acceptedTypes === 'images' && 'JPG, PNG, WEBP up to 50MB'}
                    {acceptedTypes === 'videos' && 'MP4, MOV, AVI up to 50MB'}
                    {acceptedTypes === 'both' && 'Images (JPG, PNG) or Videos (MP4, MOV) up to 50MB'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum {maxFiles} files
                  </p>
                </div>
                <Button variant="outline">
                  Choose Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Uploaded Files ({files.length}/{maxFiles})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => {
              const Icon = getFileIcon(file.type);
              
              return (
                <Card key={file.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Preview */}
                    <div className="aspect-video relative bg-gray-100">
                      {file.type === 'image' ? (
                        <img
                          src={file.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <VideoCameraIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status Overlay */}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        {file.status === 'uploading' && (
                          <div className="text-white text-center">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <div className="text-sm">{file.progress}%</div>
                          </div>
                        )}
                        {file.status === 'completed' && (
                          <CheckCircleIcon className="w-8 h-8 text-green-400" />
                        )}
                        {file.status === 'error' && (
                          <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* File Info */}
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium truncate">
                          {file.file.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        {(file.file.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                      
                      {/* Category Selection */}
                      {categories.length > 0 && file.status === 'completed' && (
                        <select
                          value={file.category || ''}
                          onChange={(e) => updateFileCategory(file.id, e.target.value)}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Select category</option>
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {completedFiles.length > 0 && (
        <div className="flex justify-end">
          <Button 
            onClick={handleUpload}
            disabled={isUploading || completedFiles.length === 0}
          >
            Save {completedFiles.length} {completedFiles.length === 1 ? 'File' : 'Files'}
          </Button>
        </div>
      )}
    </div>
  );
}