# Authentication & Profile Management Architecture

## Overview
This document outlines the complete authentication and profile management system for TourPad, covering NextAuth.js integration, database models, API patterns, and profile editing workflows.

## Authentication System

### NextAuth.js Configuration
- **Provider**: Google OAuth (primary)
- **Database Adapter**: Prisma adapter for database sessions
- **Session Strategy**: Database-stored sessions with 30-day expiration
- **JWT Strategy**: Not used - database sessions preferred for user type tracking

### Authentication Flow
1. **User Registration**: Google OAuth → User record creation
2. **User Type Assignment**: Manual assignment during onboarding (ARTIST, HOST, FAN, ADMIN)
3. **Session Management**: Database-stored sessions with user type and status
4. **Profile Creation**: Automatic UserProfile creation on first login

### Database Models

#### Core Authentication Models
```prisma
model User {
  id                      String         @id @default(cuid())
  email                   String         @unique
  passwordHash            String?        # For future direct auth
  name                    String
  profileImageUrl         String?        # Legacy field, use UserProfile instead
  userType                UserType       # ARTIST, HOST, FAN, ADMIN
  status                  UserStatus     @default(PENDING)
  oauthProvider           String?        # 'google'
  oauthId                 String?        # Google user ID
  emailVerified           Boolean        @default(false)
  verificationToken       String?
  referralSource          String?
  termsAcceptedAt         DateTime?
  privacyPolicyAcceptedAt DateTime?
  lastLogin               DateTime?
  
  // Relations
  profile                 UserProfile?
  artist                  Artist?
  host                    Host?
  fan                     Fan?
  accounts                Account[]      # NextAuth accounts
  sessions                Session[]      # NextAuth sessions
  
  createdAt               DateTime       @default(now())
  updatedAt               DateTime       @updatedAt
}

model UserProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  bio             String?
  location        String?
  phone           String?
  websiteUrl      String?
  socialLinks     Json?    # {facebook: '', instagram: '', twitter: '', website: ''}
  preferences     Json?    # User preferences and settings
  profileImageUrl String?  # Primary profile image field
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### NextAuth Integration Models
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String  # 'oauth'
  provider          String  # 'google'
  providerAccountId String  # Google account ID
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String   # Email address
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

## Profile Management System

### Profile Data Architecture

#### Data Sources Strategy
During transition period, we maintain multiple data sources:

1. **Database** (`/api/profile`): Primary source for profile editing
   - User table: Basic info (name, email, userType, status)
   - UserProfile table: Extended info (bio, location, social links, profile image)
   - Artist/Host tables: Role-specific data

2. **Mock Data** (`/src/data/mockData.ts`): UI display data
   - Rich artist/host profiles for listings and cards
   - Simple numeric IDs ('1', '2', '3')
   - Used for profile display pages

3. **Real Test Data** (`/src/data/realTestData.ts`): Authentication data
   - `getCurrentUser()` function for session management
   - Complex IDs ('artist1', 'host1', 'fan1')
   - Advanced features and capabilities

#### Profile API Endpoints

##### GET /api/profile
Returns aggregated profile data for authenticated user:
```typescript
{
  bandName: string,           // user.name
  bio: string,                // user.profile?.bio || user.artist?.stageName
  location: string,           // user.profile?.location
  website: string,            // user.profile?.websiteUrl
  socialLinks: {              // user.profile?.socialLinks
    facebook: string,
    instagram: string,
    twitter: string,
    website: string
  },
  profilePhoto: string,       // user.profile?.profileImageUrl
  
  // Artist-specific
  genres: string[],           // user.artist?.genres
  needsLodging: boolean,      // user.artist?.needsLodging
  
  // Host-specific
  venueType: string,          // user.host?.venueType
  venueName: string,          // user.host?.venueName
  venuePhoto: string,         // user.host?.venuePhotoUrl
  offersLodging: boolean      // user.host?.offersLodging
}
```

##### PUT /api/profile
Updates profile data across multiple tables atomically:
```typescript
// Transaction-based update
await prisma.$transaction([
  // Update User table
  prisma.user.update({
    where: { id: userId },
    data: { name: data.bandName }
  }),
  
  // Upsert UserProfile
  prisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...profileData },
    update: profileData
  }),
  
  // Update role-specific table
  userType === 'ARTIST' ? 
    prisma.artist.update({ where: { userId }, data: artistData }) :
    prisma.host.update({ where: { userId }, data: hostData })
]);
```

##### GET /api/user/profile-id
Dynamic profile ID mapping for backwards compatibility:
```typescript
{
  profileId: string,  // Artist/Host database ID
  type: string        // 'artist' | 'host' | 'fan'
}
```

### Profile Editing Workflow

#### Form Management
- **Library**: React Hook Form with Zod validation
- **State Management**: Local state with optimistic updates
- **Persistence**: Automatic save on form submission
- **Error Handling**: Form-level and field-level validation

#### Image Upload Integration
```typescript
// Profile photo upload flow
const handleProfilePhotoUpload = async (file: File) => {
  // 1. Upload to /api/upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'profile');
  
  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  if (uploadResponse.ok) {
    const { url } = await uploadResponse.json();
    
    // 2. Update profile with new image URL
    await updateProfile({ profilePhoto: url });
    
    // 3. Update local state for immediate UI feedback
    setCurrentData(prev => ({ ...prev, profilePhoto: url }));
  }
};
```

#### Social Links Management
```typescript
// Social links structure
const socialLinks = {
  facebook: 'https://facebook.com/username',
  instagram: 'https://instagram.com/username',
  twitter: 'https://twitter.com/username',
  website: 'https://example.com'
};

// URL validation and sanitization
function ensureProtocol(url: string): string {
  if (!url.trim()) return '';
  if (url.match(/^https?:\/\//i)) return url;
  return `https://${url}`;
}
```

## Role-Specific Profile Extensions

### Artist Profiles
```prisma
model Artist {
  id                      String   @id @default(cuid())
  userId                  String   @unique
  stageName               String?  # Different from user.name
  genres                  String[] # ['Folk', 'Indie', 'Acoustic']
  typicalSetLength        Int?     # Minutes
  equipmentNeeds          String[] # ['Microphone', 'Guitar amp']
  travelRadius            Int?     # Miles
  needsLodging            Boolean  @default(false)
  pressPhotoUrl           String?
  performanceVideoUrl     String?
  musicSamples            Json?    # [{title, url, duration}]
  minGuarantee            Int?     # Minimum payment
  preferredBookingAdvance Int?     # Days
  
  // Application workflow
  applicationSubmittedAt  DateTime?
  approvedAt              DateTime?
  approvedByUserId        String?
}
```

### Host Profiles
```prisma
model Host {
  id                     String    @id @default(cuid())
  userId                 String    @unique
  venueName              String?   # 'The Listening Room'
  venueType              VenueType # HOME, LOFT, WAREHOUSE, OTHER
  city                   String
  state                  String
  country                String    @default("USA")
  displayCoordinates     String?   # Public approximate location
  actualAddress          String?   # Private exact address
  indoorCapacity         Int?
  outdoorCapacity        Int?
  preferredGenres        String[]
  hostingExperience      Int?      # Years
  typicalShowLength      Int?      # Minutes
  houseRules             String?
  offersLodging          Boolean   @default(false)
  lodgingDetails         Json?     # {rooms, amenities, policies}
  venuePhotoUrl          String?   # Venue profile photo
  venueDescription       String?
  
  // Application workflow
  applicationSubmittedAt DateTime?
  approvedAt             DateTime?
  approvedByUserId       String?
}
```

## Authentication Patterns

### Session Management
```typescript
// Get current user session
import { auth } from '@/lib/auth';

export async function getCurrentUser() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }
  
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    type: session.user.type,      // 'artist' | 'host' | 'fan' | 'admin'
    status: session.user.status   // 'pending' | 'approved' | 'active' | etc.
  };
}
```

### API Route Protection
```typescript
// Standard API protection pattern
export async function GET/PUT/POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check user status for protected operations
    if (session.user.status !== 'APPROVED' && session.user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Account not approved' }, { status: 403 });
    }
    
    // Main logic here...
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Role-Based Access Control
```typescript
// Check user permissions
function hasPermission(user: User, action: string, resource: string): boolean {
  // Admin has all permissions
  if (user.userType === 'ADMIN') return true;
  
  // Resource ownership checks
  if (action === 'edit' && resource === 'profile') {
    return user.status === 'APPROVED' || user.status === 'ACTIVE';
  }
  
  // Booking permissions
  if (action === 'create' && resource === 'booking') {
    return user.userType === 'ARTIST' && user.status === 'APPROVED';
  }
  
  return false;
}
```

## Data Migration Patterns

### ID Mapping Strategy
```typescript
// Dashboard component bridges mock and database IDs
export default function Dashboard() {
  const [userProfileId, setUserProfileId] = useState<string | null>(null);
  
  useEffect(() => {
    // Get database profile ID for current user
    fetch('/api/user/profile-id')
      .then(res => res.json())
      .then(data => setUserProfileId(data.profileId));
  }, []);
  
  // Use database ID for View Profile link
  const profileLink = user.type === 'host' 
    ? `/hosts/${userProfileId}`
    : `/artists/${userProfileId}`;
    
  return (
    <Link href={profileLink}>View Profile</Link>
  );
}
```

### Profile Display Integration
```typescript
// Public profile pages (e.g., /hosts/[id])
export async function generateStaticParams() {
  // Use mock data for static generation
  return mockHosts.map(host => ({ id: host.id }));
}

export default async function HostProfile({ params }: { params: { id: string } }) {
  const hostId = params.id;
  
  if (hostId === '1') {
    // Mock ID - fetch from database
    const response = await fetch(`/api/hosts/${KNOWN_DATABASE_ID}`);
    const hostData = await response.json();
    
    // Merge database data with mock display data
    const displayData = {
      ...mockHosts.find(h => h.id === '1'),
      ...hostData,
      profileImageUrl: hostData.profileImageUrl || mockHosts[0].profileImageUrl
    };
    
    return <HostProfileDisplay host={displayData} />;
  }
  
  // Handle other IDs...
}
```

## Error Handling & Validation

### Form Validation
```typescript
import { z } from 'zod';

const profileSchema = z.object({
  bandName: z.string().min(1, 'Band name is required'),
  bio: z.string().max(500, 'Bio must be under 500 characters'),
  location: z.string().optional(),
  website: z.string().url('Invalid URL').or(z.literal('')),
  socialLinks: z.object({
    facebook: z.string().url('Invalid Facebook URL').or(z.literal('')),
    instagram: z.string().url('Invalid Instagram URL').or(z.literal('')),
    twitter: z.string().url('Invalid Twitter URL').or(z.literal('')),
    website: z.string().url('Invalid website URL').or(z.literal(''))
  }),
  genres: z.array(z.string()).min(1, 'At least one genre required'),
  needsLodging: z.boolean()
});
```

### Database Error Handling
```typescript
// Atomic updates with rollback
async function updateProfile(userId: string, data: ProfileData) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Update User table
      const user = await tx.user.update({
        where: { id: userId },
        data: { name: data.bandName }
      });
      
      // Update UserProfile
      const profile = await tx.userProfile.upsert({
        where: { userId },
        create: { userId, ...profileData },
        update: profileData
      });
      
      // Update role-specific table
      if (user.userType === 'ARTIST') {
        await tx.artist.update({
          where: { userId },
          data: { genres: data.genres, needsLodging: data.needsLodging }
        });
      }
      
      return { user, profile };
    });
    
    return result;
  } catch (error) {
    console.error('Profile update failed:', error);
    throw new Error('Failed to update profile');
  }
}
```

## Security Considerations

### Data Privacy
- **Profile Images**: Stored with user ID prefixes to prevent enumeration
- **Social Links**: Validated and sanitized before storage
- **Personal Data**: Separate public/private data handling
- **Address Information**: Hosts show city-level location only in public profiles

### Input Sanitization
```typescript
// URL sanitization
function sanitizeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  
  // Ensure protocol
  if (!trimmed.match(/^https?:\/\//i)) {
    return `https://${trimmed}`;
  }
  
  return trimmed;
}

// Social media username extraction
function extractUsername(platform: string, url: string): string {
  const patterns = {
    instagram: /(?:instagram\.com\/)?@?([a-zA-Z0-9_.]+)/,
    twitter: /(?:twitter\.com\/)?@?([a-zA-Z0-9_]+)/,
    facebook: /(?:facebook\.com\/)?([a-zA-Z0-9.]+)/
  };
  
  const match = url.match(patterns[platform]);
  return match ? match[1] : url;
}
```

### Session Security
- **CSRF Protection**: Built into NextAuth.js
- **Session Rotation**: Automatic session refresh
- **Secure Cookies**: HTTPOnly, Secure, SameSite settings
- **Token Validation**: Database lookup for every request

## Performance Optimization

### Database Queries
```typescript
// Optimized profile fetch with includes
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    profile: true,
    artist: true,
    host: true,
    fan: true
  }
});

// Selective field queries
const basicProfile = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    email: true,
    userType: true,
    profile: {
      select: {
        bio: true,
        location: true,
        profileImageUrl: true
      }
    }
  }
});
```

### Caching Strategy
- **Session Cache**: NextAuth.js handles session caching
- **Profile Cache**: Consider React Query for client-side caching
- **Static Generation**: Use mock data for static profile pages
- **API Cache**: Implement cache headers for profile endpoints

## Future Enhancements

### Advanced Authentication
- **Multi-factor Authentication**: Email/SMS verification
- **Social Login**: Facebook, Apple ID integration
- **Direct Registration**: Email/password option
- **Account Linking**: Multiple OAuth providers per user

### Profile Features
- **Profile Verification**: Email, phone, identity verification
- **Profile Completeness**: Progress tracking and incentives
- **Profile Analytics**: View counts, engagement metrics
- **Profile Templates**: Quick setup for common use cases

### Admin Tools
- **User Management**: Bulk operations, status changes
- **Profile Moderation**: Content review, automated flagging
- **Analytics Dashboard**: User growth, engagement metrics
- **Audit Logging**: Track profile changes and access

---

**Last Updated**: July 2025 - After completing profile system integration with image uploads and role-specific extensions