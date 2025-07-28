'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { 
  CloudArrowUpIcon, 
  MusicalNoteIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface MP3File extends File {
  id: string;
  uploadStatus: 'pending' | 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  errorMessage?: string;
  metadata?: {
    title?: string;
    artist?: string;
    album?: string;
    duration?: number;
  };
  _originalFile?: File;
}

interface MP3UploadComponentProps {
  artistId: string;
  onUploadComplete?: (tracks: any[]) => void;
  className?: string;
}

export const MP3UploadComponent = ({
  artistId,
  onUploadComplete,
  className
}: MP3UploadComponentProps) => {
  const [files, setFiles] = useState<MP3File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFiles = 10;
  const maxSizePerFile = 25 * 1024 * 1024; // 25MB
  const acceptedFormats = ['audio/mpeg', 'audio/mp3'];

  const validateFiles = (newFiles: File[]): { valid: File[]; errors: string[] } => {
    const errors: string[] = [];
    const valid: File[] = [];

    // Check total file count
    if (files.length + newFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { valid: [], errors };
    }

    newFiles.forEach(file => {
      // Check file size
      if (file.size > maxSizePerFile) {
        errors.push(`${file.name} is too large (max ${maxSizePerFile / 1024 / 1024}MB)`);
        return;
      }

      // Check file type
      if (!acceptedFormats.includes(file.type) && !file.name.toLowerCase().endsWith('.mp3')) {
        errors.push(`${file.name} is not a valid MP3 file`);
        return;
      }

      // Check for duplicates
      if (files.some(existingFile => 
        existingFile.name === file.name && existingFile.size === file.size
      )) {
        errors.push(`${file.name} has already been uploaded`);
        return;
      }

      valid.push(file);
    });

    return { valid, errors };
  };

  const createMP3File = (file: File): MP3File => {
    // Store reference to original File for upload
    const mp3File = Object.assign(file, {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadStatus: 'pending' as const,
      progress: 0,
      _originalFile: file  // Keep reference to original File object
    });
    return mp3File as MP3File;
  };

  const extractMetadata = async (file: File): Promise<any> => {
    // Simple metadata extraction from filename
    const name = file.name.replace(/\.mp3$/i, '');
    const parts = name.split(' - ');
    
    return {
      title: parts.length > 1 ? parts[1] : name,
      artist: parts.length > 1 ? parts[0] : undefined,
      album: undefined,
      duration: undefined // Will be extracted server-side
    };
  };

  const uploadFile = async (mp3File: MP3File) => {
    console.log('Uploading file with artistId:', artistId);
    
    if (!artistId) {
      throw new Error('Artist ID not available. Please refresh the page and try again.');
    }
    
    const formData = new FormData();
    // Use the original File object, not the extended MP3File object
    const originalFile = mp3File._originalFile || mp3File;
    formData.append('file', originalFile);
    formData.append('artistId', artistId);
    
    // Add metadata if available
    if (mp3File.metadata) {
      formData.append('metadata', JSON.stringify(mp3File.metadata));
    }

    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === mp3File.id 
          ? { ...f, uploadStatus: 'uploading', progress: 0 }
          : f
      ));

      const response = await fetch('/api/upload/mp3', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error response:', errorData);
        const errorMessage = errorData.details 
          ? `${errorData.error} - Provided: ${errorData.details.provided}, Expected: ${errorData.details.expected}`
          : errorData.error || 'Upload failed';
        throw new Error(errorMessage);
      }

      // Update to processing
      setFiles(prev => prev.map(f => 
        f.id === mp3File.id 
          ? { ...f, uploadStatus: 'processing', progress: 90 }
          : f
      ));

      const result = await response.json();
      
      // Update to ready
      setFiles(prev => prev.map(f => 
        f.id === mp3File.id 
          ? { ...f, uploadStatus: 'ready', progress: 100, metadata: result.track }
          : f
      ));

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === mp3File.id 
          ? { 
              ...f, 
              uploadStatus: 'error', 
              progress: 0,
              errorMessage: error instanceof Error ? error.message : 'Upload failed'
            }
          : f
      ));
      throw error;
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    console.log('handleFiles called with:', newFiles.length, 'files');
    console.log('Files:', newFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
    
    const { valid, errors } = validateFiles(newFiles);
    console.log('Validation result:', { valid: valid.length, errors });
    
    if (errors.length > 0) {
      setUploadError(errors[0]);
      setTimeout(() => setUploadError(null), 5000);
      return;
    }

    setUploadError(null);
    
    // Create MP3File objects with metadata extraction
    const mp3Files = await Promise.all(
      valid.map(async (file) => {
        const mp3File = createMP3File(file);
        mp3File.metadata = await extractMetadata(file);
        return mp3File;
      })
    );

    setFiles(prev => [...prev, ...mp3Files]);

    // Start uploading files
    mp3Files.forEach(uploadFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    console.log('Files selected:', selectedFiles.length, selectedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
    handleFiles(selectedFiles);
    
    // Reset input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryUpload = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      uploadFile(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Don't render upload area if artistId is not ready
  if (!artistId) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Loading artist information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group',
          isDragOver 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50',
          uploadError && 'border-red-300 bg-red-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,audio/mpeg,audio/mp3"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          {/* Icon */}
          <div className={cn(
            'mx-auto w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300',
            isDragOver 
              ? 'bg-blue-100' 
              : 'bg-gray-100 group-hover:bg-blue-50'
          )}>
            <MusicalNoteIcon className={cn(
              'w-8 h-8 transition-colors',
              isDragOver ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
            )} />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload MP3 Files
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop your MP3 files here, or click to browse
            </p>
            
            {/* File info */}
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <span>Max {maxFiles} files</span>
              <span>•</span>
              <span>Up to {maxSizePerFile / 1024 / 1024}MB each</span>
              <span>•</span>
              <span>MP3 format only</span>
            </div>
          </div>

          {/* Upload button */}
          <div className="pt-2">
            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Choose MP3 Files
            </span>
          </div>
        </div>

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-100/80 border-2 border-blue-400 border-dashed rounded-xl flex items-center justify-center">
            <div className="text-blue-700 font-medium">
              Drop MP3 files here to upload
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            Uploaded Tracks ({files.length}/{maxFiles})
          </h4>
          
          <div className="space-y-3">
            {files.map((file) => (
              <MP3FilePreview
                key={file.id}
                file={file}
                onRemove={() => removeFile(file.id)}
                onRetry={() => retryUpload(file.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface MP3FilePreviewProps {
  file: MP3File;
  onRemove: () => void;
  onRetry: () => void;
}

const MP3FilePreview = ({ file, onRemove, onRetry }: MP3FilePreviewProps) => {
  const getStatusIcon = () => {
    switch (file.uploadStatus) {
      case 'ready':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      case 'uploading':
      case 'processing':
        return <ClockIcon className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <MusicalNoteIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (file.uploadStatus) {
      case 'pending':
        return 'Pending upload...';
      case 'uploading':
        return `Uploading... ${file.progress}%`;
      case 'processing':
        return 'Processing audio...';
      case 'ready':
        return 'Ready for playback';
      case 'error':
        return file.errorMessage || 'Upload failed';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <MusicalNoteIcon className="w-6 h-6 text-gray-500" />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.metadata?.title || file.name.replace(/\.mp3$/i, '')}
            </p>
            {getStatusIcon()}
          </div>
          
          {file.metadata?.artist && (
            <p className="text-xs text-gray-600 mb-1">by {file.metadata.artist}</p>
          )}
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </p>
            <p className="text-xs text-gray-500">
              {getStatusText()}
            </p>
          </div>

          {/* Progress bar for uploading */}
          {(file.uploadStatus === 'uploading' || file.uploadStatus === 'processing') && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${file.progress}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {file.uploadStatus === 'error' && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          )}
          
          <button
            onClick={onRemove}
            className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}