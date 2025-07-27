'use client';
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { 
  CloudArrowUpIcon, 
  PhotoIcon, 
  XMarkIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizePerFile?: number; // in bytes
  title?: string;
  description?: string;
  className?: string;
  error?: string;
}

export const FileUpload = ({
  files,
  onChange,
  accept = 'image/*',
  multiple = true,
  maxFiles = 6,
  maxSizePerFile = 5 * 1024 * 1024, // 5MB
  title = 'Upload Photos',
  description = 'Drag and drop your files here, or click to browse',
  className,
  error
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        errors.push(`${file.name} is not a supported file type`);
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

  const handleFiles = (newFiles: File[]) => {
    const { valid, errors } = validateFiles(newFiles);
    
    if (errors.length > 0) {
      setUploadError(errors[0]);
      setTimeout(() => setUploadError(null), 5000);
      return;
    }

    setUploadError(null);
    onChange([...files, ...valid]);
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
    handleFiles(selectedFiles);
    
    // Reset input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const displayError = error || uploadError;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group',
          isDragOver 
            ? 'border-primary-400 bg-primary-50 scale-105' 
            : 'border-neutral-300 hover:border-primary-300 hover:bg-mist',
          displayError && 'border-red-300 bg-red-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          {/* Icon */}
          <div className={cn(
            'mx-auto w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300',
            isDragOver 
              ? 'bg-primary-100' 
              : 'bg-neutral-100 group-hover:bg-primary-50'
          )}>
            <CloudArrowUpIcon className={cn(
              'w-8 h-8 transition-colors',
              isDragOver ? 'text-primary-600' : 'text-neutral-500 group-hover:text-primary-500'
            )} />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              {description}
            </p>
            
            {/* File info */}
            <div className="flex flex-wrap justify-center gap-2 text-xs text-neutral-500">
              <span>Max {maxFiles} files</span>
              <span>•</span>
              <span>Up to {maxSizePerFile / 1024 / 1024}MB each</span>
              {accept.includes('image') && (
                <>
                  <span>•</span>
                  <span>JPG, PNG, WebP</span>
                </>
              )}
            </div>
          </div>

          {/* Upload button */}
          <div className="pt-2">
            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors">
              Choose Files
            </span>
          </div>
        </div>

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-primary-100/80 border-2 border-primary-400 border-dashed rounded-xl flex items-center justify-center">
            <div className="text-primary-700 font-medium">
              Drop files here to upload
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {displayError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{displayError}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-neutral-700">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file, index) => (
              <FilePreview
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  // Generate preview for images
  if (file.type.startsWith('image/') && !preview) {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="relative group bg-white border border-neutral-200 rounded-lg p-3 hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-3">
        {/* Preview */}
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center flex-shrink-0">
          {preview ? (
            <img 
              src={preview} 
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <PhotoIcon className="w-6 h-6 text-neutral-500" />
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-neutral-500">
            {formatFileSize(file.size)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};