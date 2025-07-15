import { z } from 'zod';

// User registration validation (comprehensive application form)
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$|^\+1\d{10}$/, 'Please enter a valid phone number'),
  location: z.string().min(5, 'Please enter city and state').max(100, 'Location cannot exceed 100 characters'),
  type: z.enum(['artist', 'host', 'fan'], {
    errorMap: () => ({ message: 'Please select a valid user type' })
  }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  }),
  // Artist-specific fields (conditional)
  genre: z.string().min(1, 'At least one genre is required'),
  experience: z.string().optional(),
  // Host-specific fields (conditional)
  venueDescription: z.string().optional()
}).refine((data) => {
  // Conditional validation based on user type
  if (data.type === 'artist') {
    return data.genre && data.genre.trim().length >= 1;
  }
  if (data.type === 'host') {
    return data.venueDescription && data.venueDescription.length >= 20;
  }
  if (data.type === 'fan') {
    // Fans don't have special validation requirements beyond the basic fields
    return true;
  }
  return true;
}, {
  message: 'Please complete all required fields for your user type',
  path: ['type'] // This will show the error on the type field
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Artist onboarding/application validation (comprehensive 4-step form)
export const artistOnboardingSchema = z.object({
  // Step 1: About Artist/Band
  name: z.string().min(2, 'Artist/band name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(1000, 'Bio cannot exceed 1000 characters'),
  yearsActive: z.string().regex(/^\d+$/, 'Years active must be a number').refine(val => parseInt(val) >= 0 && parseInt(val) <= 50, {
    message: 'Years active must be between 0 and 50'
  }),
  members: z.array(z.object({
    name: z.string().min(1, 'Member name is required'),
    instrument: z.string().min(1, 'Instrument is required')
  })).min(1, 'At least one band member is required'),
  
  // Step 2: Tour & Logistics
  tourMonthsPerYear: z.string().regex(/^\d+$/, 'Tour months must be a number').refine(val => parseInt(val) >= 0 && parseInt(val) <= 12, {
    message: 'Tour months must be between 0 and 12'
  }),
  tourVehicle: z.enum(['car', 'van', 'bus', 'other'], {
    errorMap: () => ({ message: 'Please select a valid vehicle type' })
  }),
  requireHomeStay: z.boolean(),
  travelWithAnimals: z.boolean(),
  petAllergies: z.string().max(200, 'Pet allergies description cannot exceed 200 characters').optional(),
  dietaryRestrictions: z.string().max(200, 'Dietary restrictions cannot exceed 200 characters').optional(),
  ownSoundSystem: z.boolean(),
  
  // Step 3: Promo & Media
  socialLinks: z.object({
    website: z.string().url('Invalid website URL').or(z.literal('')).optional(),
    spotify: z.string().url('Invalid Spotify URL').or(z.literal('')).optional(),
    facebook: z.string().url('Invalid Facebook URL').or(z.literal('')).optional(),
    instagram: z.string().url('Invalid Instagram URL').or(z.literal('')).optional(),
    youtube: z.string().url('Invalid YouTube URL').or(z.literal('')).optional(),
    patreon: z.string().url('Invalid Patreon URL').or(z.literal('')).optional()
  }),
  paymentLinks: z.object({
    venmo: z.string().max(100, 'Venmo handle cannot exceed 100 characters').optional(),
    paypal: z.string().email('Invalid PayPal email').or(z.literal('')).optional()
  }),
  livePerformanceVideo: z.string().url('Please provide a valid video URL (YouTube, Vimeo, etc.)'),
  
  // Step 4: Policies & Payment
  cancellationPolicy: z.enum(['strict', 'flexible'], {
    errorMap: () => ({ message: 'Please select a cancellation policy' })
  }),
  cancellationGuarantee: z.string().min(20, 'Cancellation guarantee explanation must be at least 20 characters').max(500, 'Cancellation guarantee cannot exceed 500 characters')
});

// Legacy artist application validation (kept for compatibility)
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

// Host onboarding validation (comprehensive 3-step form)
export const hostOnboardingSchema = z.object({
  // Step 1: Venue Info
  venueName: z.string().min(2, 'Venue name must be at least 2 characters').max(100, 'Venue name cannot exceed 100 characters'),
  address: z.string().min(5, 'Address is required').max(200, 'Address cannot exceed 200 characters'),
  city: z.string().min(2, 'City is required').max(50, 'City cannot exceed 50 characters'),
  state: z.string().length(2, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  bio: z.string().min(50, 'Venue bio must be at least 50 characters').max(1000, 'Bio cannot exceed 1000 characters'),
  
  // Step 2: Show Specs
  avgAttendance: z.string().regex(/^\d+$/, 'Average attendance must be a number').refine(val => parseInt(val) >= 5 && parseInt(val) <= 200, {
    message: 'Average attendance must be between 5 and 200'
  }),
  avgDoorFee: z.string().regex(/^\d+(\.\d{2})?$/, 'Door fee must be a valid amount (e.g., 20.00)').optional(),
  indoorMax: z.string().regex(/^\d+$/, 'Indoor max must be a number').refine(val => parseInt(val) >= 5 && parseInt(val) <= 500, {
    message: 'Indoor max must be between 5 and 500'
  }),
  outdoorMax: z.string().regex(/^\d+$/, 'Outdoor max must be a number').refine(val => parseInt(val) >= 0 && parseInt(val) <= 1000, {
    message: 'Outdoor max must be between 0 and 1000'
  }),
  showDuration: z.string().min(1, 'Show duration is required'),
  showFormat: z.string().min(1, 'Show format is required'),
  estimatedShows: z.string().regex(/^\d+$/, 'Estimated shows must be a number').refine(val => parseInt(val) >= 0 && parseInt(val) <= 100, {
    message: 'Estimated shows must be between 0 and 100'
  }),
  performanceLocation: z.enum(['home', 'studio', 'backyard', 'other'], {
    errorMap: () => ({ message: 'Please select a valid performance location' })
  }),
  daysAvailable: z.array(z.string()).min(1, 'At least one day must be selected'),
  
  // Step 3: Amenities (all boolean values)
  amenities: z.object({
    powerAccess: z.boolean(),
    airConditioning: z.boolean(),
    wifi: z.boolean(),
    kidFriendly: z.boolean(),
    adultsOnly: z.boolean(),
    parking: z.boolean(),
    petFriendly: z.boolean(),
    outdoorSpace: z.boolean(),
    accessible: z.boolean(),
    soundSystem: z.boolean(),
    bnbOffered: z.boolean()
  })
});

// Legacy host application validation (kept for compatibility)
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
