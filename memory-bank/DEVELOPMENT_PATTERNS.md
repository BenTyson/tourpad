# TourPad Development Patterns

## Core Development Rules

## UI/UX Design Patterns ✅ ESTABLISHED

### Site-Wide Color Scheme (Coastal Theme)
```css
/* Color variables - use these consistently */
--color-french-blue: #3b82f6;  /* Primary actions, links, focus states */
--color-sage: #9ca3af;         /* Borders, subtle backgrounds */
--color-mist: #f3f4f6;         /* Light backgrounds, hover states */
--color-sand: #fef3c7;         /* Warnings, highlights (sparingly) */
--color-evergreen: #064e3b;    /* Dark text, important headers */
```

### Message Input Standards
```typescript
// ✅ Use textarea for multi-line inputs
<textarea
  className="flex-1 resize-none h-12 px-3 py-2 border border-[var(--color-sage)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent disabled:opacity-50"
  rows={2}
  placeholder="Type a message..."
  onKeyPress={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }}
/>
```

### Admin Interface Standards
Based on successful admin applications page implementation:

```typescript
// ✅ Lightbox Gallery Pattern for Photo Viewing
const [selectedPhotos, setSelectedPhotos] = useState<any[]>([]);
const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
const [showLightbox, setShowLightbox] = useState(false);

const openLightbox = (photos: any[], startIndex: number) => {
  setSelectedPhotos(photos);
  setCurrentPhotoIndex(startIndex);
  setShowLightbox(true);
};

// Modal with navigation arrows, photo counter, close button
// Supports multi-photo navigation with keyboard controls ready

// ✅ Compact Card Design Pattern
// - Move metadata to header (submission date with email)
// - Remove unnecessary section headers and borders
// - Grid layouts instead of stacked columns
// - Clean filter buttons with gray theme (not blue/green)
```

### Photo Management Patterns
```typescript
// ✅ Venue Photo Display in Admin Applications
{((application as Host).host?.media && (application as Host).host?.media.length > 0) ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
    {(application as Host).host?.media.map((media: any, index: number) => (
      <div key={index} className="relative">
        <img 
          src={media.fileUrl}
          alt={media.title || `Venue photo ${index + 1}`}
          className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => openLightbox((application as Host).host?.media || [], index)}
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded pointer-events-none">
          {index + 1} / {(application as Host).host?.media.length}
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="text-center py-4 text-gray-500">
    <PhotoIcon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
    <p className="text-sm">No venue photos uploaded</p>
  </div>
)}
```

## Core Development Rules

### Required Code Quality Standards

#### Defensive Programming (MANDATORY)
All new code must use defensive programming patterns to prevent runtime crashes:

```typescript
// ✅ ALWAYS use optional chaining with defaults
const count = photos?.length || 0;
const name = user?.profile?.name || '';
const bio = artist?.bio || 'No bio available';

// ✅ ALWAYS provide defaults for arrays
{photos?.map((photo) => (
  <div key={photo.id}>{photo.title}</div>
)) || <div>No photos available</div>}

// ✅ ALWAYS validate objects before iteration
if (lodgingDetails?.rooms?.length) {
  return lodgingDetails.rooms.map(room => renderRoom(room));
}

// ❌ NEVER access arrays/objects directly
const count = photos.length;           // CRASHES!
const name = user.profile.name;        // CRASHES!
photos.map(photo => ...)              // CRASHES!
```

#### TypeScript Compilation (ZERO TOLERANCE)
- **Always run** `npx tsc --noEmit` before implementing features
- **Fix ALL compilation errors** immediately - do not let them accumulate
- **Zero compilation errors** must be maintained at all times
- Accumulated TypeScript errors destabilize the development server

#### Error Handling Patterns
```typescript
// ✅ API calls with proper error handling
try {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const result = await response.json();
  return result;
} catch (error) {
  console.error('Profile update failed:', error);
  setError('Failed to update profile. Please try again.');
  return null;
}

// ✅ React component error boundaries
const MyComponent = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  try {
    return (
      <div>
        {data?.items?.map(item => (
          <div key={item.id}>{item.name}</div>
        )) || <div>No items</div>}
      </div>
    );
  } catch (error) {
    console.error('Component render error:', error);
    return <div>Error displaying data</div>;
  }
};
```

---

## File Upload Implementation Pattern

### Using Existing Upload System (MANDATORY)
**Always use** `/api/upload` endpoint - never create duplicate upload routes.

```typescript
// ✅ Standard file upload implementation
const handleFileUpload = async (file: File, type: 'profile' | 'venue' | 'media') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const { url } = await response.json();
      
      // Update profile with new image URL
      await updateProfile({ [type + 'Photo']: url });
      
      // Update local state for immediate UI feedback
      setImageUrl(url);
      
      return url;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    setError('Upload failed. Please try again.');
    return null;
  }
};

// ✅ File input trigger pattern
<label htmlFor="fileInput" className="cursor-pointer">
  <div className="upload-button">
    <Camera className="w-4 h-4 mr-2" />
    {hasImage ? 'Change Photo' : 'Upload Photo'}
  </div>
</label>
<input
  id="fileInput"
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file, 'profile');
  }}
  className="hidden"
/>
```

### File Upload Rules
- **Single endpoint**: Always use `/api/upload/route.ts`
- **Authentication required**: Session validation mandatory
- **File validation**: Type (JPEG/PNG/WebP), size (5MB max)
- **Storage location**: `public/uploads/` for development
- **Database integration**: Update appropriate model after upload

---

## Database Integration Patterns

### Browse Page Database Integration Pattern
This pattern was established for converting mock data browse pages to real database integration:

```typescript
// ✅ API Endpoint for Browse Pages (/api/hosts, /api/artists)
export async function GET(request: NextRequest) {
  try {
    // 1. Parse search params for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre');
    
    // 2. Build dynamic where clause
    const whereClause: any = {
      // Only show approved entities
      approvedAt: { not: null }
    };
    
    // Add search filters
    if (search) {
      whereClause.OR = [
        { stageName: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // 3. Fetch with comprehensive includes
    const entities = await prisma.artist.findMany({
      where: whereClause,
      include: {
        user: { include: { profile: true } },
        bandMembers: { orderBy: { sortOrder: 'asc' } },
        media: { orderBy: { sortOrder: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 4. Transform to frontend expectations
    const transformed = entities.map(entity => ({
      id: entity.id,
      name: entity.stageName || entity.user.name,
      bio: entity.user.profile?.bio || 'Default bio text',
      photos: entity.media
        .filter(m => m.mediaType === 'PHOTO')
        .map(m => ({
          id: m.id,
          url: m.fileUrl,
          alt: m.title || 'Photo',
          category: m.category || 'promotional'
        })),
      // ... other transformed fields
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Browse API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
```

```typescript
// ✅ Frontend Browse Page Integration
const [entities, setEntities] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchEntities = async () => {
    if (!hasAccess) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/artists');
      if (response.ok) {
        const data = await response.json();
        setEntities(data);
      } else {
        console.error('Failed to fetch entities');
      }
    } catch (error) {
      console.error('Error fetching entities:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchEntities();
}, [hasAccess]);

// Safe filtering with database data
const filteredEntities = entities.filter(entity => {
  const matchesSearch = searchQuery === '' || 
    entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.bio?.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesSearch;
});
```

### Component Data Structure Alignment Pattern
When updating components to work with database data:

```typescript
// ✅ Update component interfaces to match API response
interface ArtistProfile {
  // Change from separate photo arrays to unified photos array
  photos?: Array<{           // API returns this
    id: string;
    url: string;
    alt: string;
    category: string;
  }>;
  // Remove outdated fields
  // performancePhotos?: Array<...>;  // Remove this
  // bandPhotos?: Array<...>;         // Remove this
  
  // Align property names with API
  verified: boolean;         // API returns 'verified'
  // approved: boolean;      // Remove this, use 'verified'
}

// ✅ Update component logic to match new structure
const allPhotos = artist.photos || [];  // Instead of [...performancePhotos, ...bandPhotos]
```

### Database Seeding Pattern
For creating sample data with photos:

```typescript
// ✅ Comprehensive entity seeding script
const sampleEntities = [
  {
    name: "Entity Name",
    email: "entity@email.com",
    stageName: "Stage Name",
    genres: ["genre1", "genre2"],
    bio: "Comprehensive bio text with details...",
    // ... complete entity data
    bandMembers: [
      { name: "Member Name", instrument: "Instrument", role: "Role" }
    ]
  }
];

async function seedEntities() {
  for (const entityData of sampleEntities) {
    try {
      // 1. Create user first
      const user = await prisma.user.create({
        data: {
          email: entityData.email,
          name: entityData.name,
          userType: 'ARTIST',
          status: 'ACTIVE',
          emailVerified: true,
          profile: {
            create: {
              bio: entityData.bio,
              location: 'United States'
            }
          }
        }
      });

      // 2. Create entity record
      const entity = await prisma.artist.create({
        data: {
          userId: user.id,
          stageName: entityData.stageName,
          genres: entityData.genres,
          // ... other fields
          approvedAt: new Date(), // Pre-approve samples
          applicationSubmittedAt: new Date()
        }
      });

      // 3. Create related records (band members, etc.)
      for (let i = 0; i < entityData.bandMembers.length; i++) {
        await prisma.bandMember.create({
          data: {
            artistId: entity.id,
            ...entityData.bandMembers[i],
            sortOrder: i
          }
        });
      }
    } catch (error) {
      console.error(`Error creating entity:`, error);
    }
  }
}
```

### Photo Management Pattern
For adding diverse photos to seeded entities:

```typescript
// ✅ Photo diversity script
const diversePhotos = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop',
  // ... 20+ different photo URLs
];

async function updateEntityPhotos() {
  const entities = await prisma.artist.findMany({
    include: { user: { include: { profile: true } } }
  });

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    
    // Update profile photo
    const profilePhotoUrl = profilePhotos[i % profilePhotos.length];
    await prisma.userProfile.update({
      where: { id: entity.user.profile.id },
      data: { profileImageUrl: profilePhotoUrl }
    });

    // Create 3-4 diverse promotional photos
    const numPhotos = 3 + Math.floor(Math.random() * 2);
    for (let j = 0; j < numPhotos; j++) {
      const photoIndex = (i * 4 + j) % diversePhotos.length;
      await prisma.artistMedia.create({
        data: {
          artistId: entity.id,
          mediaType: 'PHOTO',
          category: j === 0 ? 'profile' : 'promotional',
          fileUrl: diversePhotos[photoIndex],
          title: j === 0 ? 'Profile Photo' : `Performance Photo ${j}`,
          sortOrder: j
        }
      });
    }
  }
}
```

### Prisma Client Usage
```typescript
// ✅ Profile data with proper includes
const getUserProfile = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        artist: true,
        host: {
          include: {
            media: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        }
      }
    });
    
    return user;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch user profile');
  }
};

// ✅ Safe upsert pattern
const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...profileData
      },
      update: profileData
    });
    
    return updatedProfile;
  } catch (error) {
    console.error('Profile update error:', error);
    throw new Error('Failed to update profile');
  }
};
```

### API Endpoint Pattern
```typescript
// ✅ Standard API route structure
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Database operation
    const data = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true }
    });

    // 3. Success response
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    // 4. Error handling
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Database update operations
    const result = await prisma.$transaction([
      // Multiple operations in transaction for data consistency
    ]);

    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update data' 
    }, { status: 500 });
  }
}
```

---

## React Component Patterns

### State Management Pattern
```typescript
// ✅ Defensive state initialization
const [hostProfile, setHostProfile] = useState({
  // Always provide defaults to prevent undefined access
  photos: [] as Array<{
    id: string;
    fileUrl: string;
    title: string;
    description: string;
    category: string;
    sortOrder: number;
  }>,
  lodgingDetails: {
    numberOfRooms: 1,
    rooms: [{
      id: 1,
      roomType: 'private_bedroom' as const,
      bathroomType: 'private' as const,
      beds: [{ type: 'queen' as const, quantity: 1 }],
      maxOccupancy: 2
    }],
    amenities: {
      breakfast: false,
      wifi: true,
      parking: false,
      laundry: false,
      kitchenAccess: false,
      workspace: false,
      linensProvided: true,
      towelsProvided: true,
      transportation: 'none' as const
    }
  },
  // ... other fields with defaults
});

// ✅ Safe state updates
const addPhoto = (newPhoto: PhotoType) => {
  setHostProfile(prev => ({
    ...prev,
    photos: [...(prev.photos || []), newPhoto]
  }));
};

const removePhoto = (photoId: string) => {
  setHostProfile(prev => ({
    ...prev,
    photos: prev.photos?.filter(photo => photo.id !== photoId) || []
  }));
};
```

### Conditional Rendering Pattern
```typescript
// ✅ Safe conditional rendering
const PhotoGallery = ({ photos }) => {
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No photos uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative">
          <img 
            src={photo.fileUrl} 
            alt={photo.title || 'Venue photo'}
            className="w-full h-32 object-cover rounded"
          />
          <button
            onClick={() => handleDeletePhoto(photo.id)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Form Handling Pattern
```typescript
// ✅ Safe form field access
const handleInputChange = (field: string, value: any) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Validate required fields
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    const response = await updateProfile(formData);
    
    if (response?.success) {
      setSuccess('Profile updated successfully');
      setError('');
    } else {
      throw new Error('Update failed');
    }
    
  } catch (error) {
    console.error('Form submission error:', error);
    setError('Failed to update profile. Please try again.');
    setSuccess('');
  }
};
```

---

## File Organization Rules

### Critical File Structure
```
/src/app/
├── dashboard/
│   └── profile/page.tsx          # Main profile editing (2,500+ lines)
├── api/
│   ├── profile/route.ts          # Profile GET/PUT endpoints
│   ├── upload/route.ts           # File upload endpoint (SINGLE SOURCE)
│   ├── hosts/
│   │   ├── route.ts              # Browse hosts from database
│   │   └── [id]/route.ts         # Individual host profiles
│   └── artists/
│       ├── route.ts              # Browse artists from database
│       └── [id]/route.ts         # Individual artist profiles

/src/lib/
├── auth.ts                       # NextAuth configuration
├── prisma.ts                     # Prisma client
└── validation.ts                 # Zod schemas

/src/data/
├── mockData.ts                   # UI display data (transitioning)
└── realTestData.ts               # Auth system data (transitioning)

/scripts/
├── seed-hosts.js                 # Database seeding for hosts
├── seed-artists.js               # Database seeding for artists
├── update-host-photos.js         # Photo management for hosts
└── update-artist-photos.js       # Photo management for artists

/memory-bank/
├── PROJECT_STATUS.md             # Current state
├── ARCHITECTURE.md               # Technical reference
├── TROUBLESHOOTING.md            # Crisis prevention
└── DEVELOPMENT_PATTERNS.md       # This file
```

### File Creation Rules
- **NEVER** create duplicate upload routes (`/api/media/upload/` etc.)
- **ALWAYS** prefer editing existing files over creating new ones
- **NEVER** create documentation files unless explicitly requested
- **ALWAYS** check for existing similar functionality before creating new files

---

## Development Workflow

### Pre-Implementation Checklist
```bash
# 1. Always check TypeScript compilation first
npx tsc --noEmit

# 2. Fix any compilation errors before proceeding
# (Don't implement features with existing TypeScript errors)

# 3. Read relevant memory-bank files for context
# - PROJECT_STATUS.md for current state
# - ARCHITECTURE.md for technical details
# - TROUBLESHOOTING.md if issues arise

# 4. Test frequently during development
npm run dev
# Verify localhost:3000 works after each major change
```

### Feature Implementation Process
1. **Plan**: Check PROJECT_STATUS.md for priorities and current state
2. **Research**: Review ARCHITECTURE.md for existing patterns and APIs
3. **Code**: Follow defensive programming patterns in this document
4. **Test**: Verify functionality works end-to-end
5. **Validate**: Run `npx tsc --noEmit` and fix any errors
6. **Document**: Update PROJECT_STATUS.md with changes

### Git Workflow
```bash
# Commit frequently with descriptive messages
git add .
git commit -m "Add venue photo gallery with delete functionality

- Implement photo grid display in Gallery tab
- Add delete functionality with confirmation
- Update HostMedia model integration
- Add defensive programming patterns"

# User should push after major functionality complete
# (Remind user to git push after conclusions)
```

---

## Testing Patterns

### Manual Testing Checklist
When implementing new features, always test:

#### File Upload Features
- [ ] File selection works (drag-and-drop or click)
- [ ] Upload progress provides feedback
- [ ] Success displays new image immediately
- [ ] Error handling shows user-friendly messages
- [ ] File validation works (size, type limits)

#### Profile Features
- [ ] Data saves to database correctly
- [ ] UI updates reflect saved changes
- [ ] Page refresh maintains changes
- [ ] Error states handled gracefully
- [ ] Required fields validated

#### Authentication Features
- [ ] Login/logout flows work correctly
- [ ] Protected routes redirect properly
- [ ] Session persistence across page refreshes
- [ ] User data displays correctly

### Error Scenario Testing
Always test these error conditions:
- Network failures during API calls
- Invalid file uploads (wrong type, too large)
- Missing required form fields
- Database connection issues
- Authentication failures

---

## Performance Guidelines

### Database Query Optimization
```typescript
// ✅ Efficient query with includes
const hostWithPhotos = await prisma.host.findUnique({
  where: { userId },
  include: {
    user: {
      include: { profile: true }
    },
    media: {
      where: { category: 'venue' },
      orderBy: { sortOrder: 'asc' }
    }
  }
});

// ❌ Inefficient separate queries
const host = await prisma.host.findUnique({ where: { userId } });
const user = await prisma.user.findUnique({ where: { id: host.userId } });
const photos = await prisma.hostMedia.findMany({ where: { hostId: host.id } });
```

### Frontend Performance
```typescript
// ✅ Efficient image loading
<img 
  src={photo.fileUrl} 
  alt={photo.title || 'Photo'}
  loading="lazy"
  className="w-full h-32 object-cover"
/>

// ✅ Debounced search inputs
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

---

## Security Patterns

### Authentication Checks
```typescript
// ✅ Always verify session in API routes
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// ✅ Verify user ownership for user-specific data
const profile = await prisma.userProfile.findUnique({
  where: { 
    userId: session.user.id  // Only allow access to own data
  }
});
```

### Input Validation
```typescript
// ✅ Validate file uploads
const isValidFileType = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return allowedTypes.includes(file.type);
};

const isValidFileSize = (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
};

// ✅ Sanitize URL inputs
const ensureProtocol = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed;
  }
  
  return `https://${trimmed}`;
};
```

---

## Emergency Procedures

### When Things Break During Development

#### TypeScript Errors Accumulating
```bash
# Stop development immediately
npx tsc --noEmit

# Fix ALL errors before continuing
# Common fixes:
# - Add 'alt' props to images
# - Add optional chaining to object access
# - Provide default values for arrays

# Only continue when zero errors
```

#### Server Crashes or Instability
```bash
# Nuclear reset pattern
killall node 2>/dev/null
rm -rf .next node_modules
npm install
npx prisma generate
npm run dev
```

#### Database Issues
```bash
# Check connection
npx prisma studio

# Regenerate client
npx prisma generate

# Reset if corrupted (DANGER: loses data)
npx prisma migrate reset --force
```

### Success Indicators
- ✅ TypeScript: `npx tsc --noEmit` shows zero errors
- ✅ Server: `curl -I http://localhost:3000` returns 200 OK
- ✅ Database: Prisma Studio opens without errors
- ✅ Features: All implemented functionality works end-to-end

---

## Common Patterns Reference

### Data Fetching
```typescript
// ✅ Client-side data fetching with error handling
const fetchUserProfile = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/profile');
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    const data = await response.json();
    setProfile(data);
  } catch (error) {
    console.error('Fetch error:', error);
    setError('Failed to load profile');
  } finally {
    setLoading(false);
  }
};
```

### Form Validation
```typescript
// ✅ Client-side validation before API call
const validateForm = (data: FormData) => {
  const errors: Record<string, string> = {};
  
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }
  
  return errors;
};
```

### Modal/Dialog Patterns
```typescript
// ✅ Safe modal state management
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalData, setModalData] = useState(null);

const openModal = (data?: any) => {
  setModalData(data || null);
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
  setModalData(null);
};
```

---

*These patterns are battle-tested and ensure stable, maintainable code. Follow them religiously to prevent development issues.*