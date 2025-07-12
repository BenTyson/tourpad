import { z } from 'zod';

// User registration validation
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['artist', 'host'], {
    errorMap: () => ({ message: 'User type must be artist or host' })
  })
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Artist application validation
export const artistApplicationSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
  instruments: z.array(z.string()).min(1, 'At least one instrument is required'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'professional']),
  performanceHistory: z.string().min(20, 'Performance history must be at least 20 characters'),
  website: z.string().url('Invalid URL').optional(),
  socialLinks: z.object({
    instagram: z.string().url('Invalid Instagram URL').optional(),
    youtube: z.string().url('Invalid YouTube URL').optional(),
    spotify: z.string().url('Invalid Spotify URL').optional(),
    bandcamp: z.string().url('Invalid Bandcamp URL').optional()
  }).optional()
});

// Host application validation
export const hostApplicationSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  venueType: z.enum(['home', 'studio', 'backyard', 'loft', 'other']),
  capacity: z.number().min(5, 'Capacity must be at least 5').max(200, 'Capacity cannot exceed 200'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().length(2, 'State must be 2 characters'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code')
  }),
  availability: z.object({
    daysOfWeek: z.array(z.number().min(0).max(6)).min(1, 'At least one day must be selected'),
    timeSlots: z.array(z.string()).min(1, 'At least one time slot is required')
  })
});

// Booking creation validation
export const bookingSchema = z.object({
  artistId: z.string().min(1, 'Artist ID is required'),
  hostId: z.string().min(1, 'Host ID is required'),
  eventDate: z.string().datetime('Invalid date format'),
  duration: z.number().min(30, 'Duration must be at least 30 minutes').max(480, 'Duration cannot exceed 8 hours'),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional()
});

// Profile update validation
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().min(20, 'Bio must be at least 20 characters').optional(),
  website: z.string().url('Invalid URL').optional(),
  socialLinks: z.object({
    instagram: z.string().url('Invalid Instagram URL').optional(),
    youtube: z.string().url('Invalid YouTube URL').optional(),
    spotify: z.string().url('Invalid Spotify URL').optional(),
    bandcamp: z.string().url('Invalid Bandcamp URL').optional()
  }).optional()
});

// Media upload validation
export const mediaUploadSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().max(200, 'Description cannot exceed 200 characters').optional()
});

// Admin user status update validation
export const userStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'suspended', 'rejected']),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional()
});

// Booking status update validation
export const bookingStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'cancelled', 'completed']),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional()
});

// Application review validation
export const applicationReviewSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional()
});

// Helper function to validate data against schema
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
}

// Sanitize HTML input to prevent XSS
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate file upload
export function validateFileUpload(file: File): {
  valid: boolean;
  error?: string;
} {
  const allowedTypes = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    video: ['video/mp4', 'video/quicktime', 'video/webm'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/mp3']
  };
  
  const allAllowedTypes = Object.values(allowedTypes).flat();
  
  if (!allAllowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`
    };
  }
  
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size cannot exceed 50MB'
    };
  }
  
  return { valid: true };
}
