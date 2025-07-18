# TourPad Database Architecture & Integration Patterns

## Overview
This document outlines the database architecture, integration patterns, and lessons learned during the conversion from mock data to PostgreSQL with Prisma ORM.

## Technology Stack
- **Database**: PostgreSQL 
- **ORM**: Prisma with TypeScript
- **Authentication**: NextAuth.js with database adapter
- **Hosting**: Local development (production TBD)

## Schema Design

### Core User Management
```prisma
model User {
  id                String          @id @default(cuid())
  name              String?
  email             String          @unique
  emailVerified     DateTime?
  profileImageUrl   String?
  type              UserType        // ARTIST, HOST, FAN, ADMIN
  
  // Relations
  profile           UserProfile?
  artist            Artist?
  host              Host?
  fan               Fan?
  
  // NextAuth fields
  accounts          Account[]
  sessions          Session[]
  
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}

model UserProfile {
  id                String          @id @default(cuid())
  userId            String          @unique
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  bio               String?
  location          String?
  websiteUrl        String?
  socialLinks       Json?           // Flexible JSON for social media links
  
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}
```

### Specialized User Types
```prisma
model Artist {
  id                String          @id @default(cuid())
  userId            String          @unique
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  stageName         String?
  genres            String[]        // Array of genre strings
  
  // Application & Approval
  applicationSubmittedAt DateTime?
  approvedAt        DateTime?
  approvedByUserId  String?
  
  // Performance Details (future fields)
  typicalSetLength        Int?
  equipmentNeeds          String[]
  travelRadius           Int?
  pressPhotoUrl          String?
  performanceVideoUrl    String?
  musicSamples           Json?
  minGuarantee           Int?
  preferredBookingAdvance Int?
  
  // Relations
  media             ArtistMedia[]
  bookings          Booking[]
  
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}

model Host {
  id                String          @id @default(cuid())
  userId            String          @unique
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  venueName         String?
  venueType         VenueType?      // HOUSE, VENUE, OUTDOOR, etc.
  
  // Future venue details...
  
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}
```

## Data Architecture Patterns

### 1. Data Source Strategy
We maintain **TWO** data sources during the transition:

#### `/src/data/mockData.ts` - UI Display Data
- **Purpose**: Rich UI display data for artists/hosts
- **Usage**: Profile pages, listings, cards
- **IDs**: Simple numeric strings ('1', '2', '3')
- **Content**: Complete artist profiles, host profiles, bookings, messages

#### `/src/data/realTestData.ts` - Authentication Data
- **Purpose**: Authentication and advanced features
- **Usage**: `getCurrentUser` function, lodging system, complex features
- **IDs**: Prefixed strings ('artist1', 'host1', 'fan1')
- **Content**: User sessions, detailed capabilities, extended properties

### 2. ID Mapping Pattern
Critical pattern for backwards compatibility:

```typescript
// Dashboard component example
const user = getCurrentUser(); // Returns realTestData user (e.g., 'artist1')
const mockArtist = mockArtists.find(a => a.userId === user.id); // Maps to mockData

// Artist profile page
if (artistId === '1') {
  // Mock ID - find database user by known ID
  artist = await prisma.artist.findFirst({
    where: { user: { id: 'cmd7j6xr10002lu1fqxf46mw1' } }
  });
}
```

### 3. Database Integration Strategy

#### Phase 1: Profile System (COMPLETED)
1. **User Authentication**: NextAuth.js with Google OAuth
2. **Profile Management**: UserProfile table with JSON social links
3. **Artist Data**: Core Artist table with genres array
4. **API Endpoints**: `/api/profile` (GET/PUT), `/api/artists/[id]` (GET)

#### Phase 2: Booking System (FUTURE)
1. **Booking Models**: Booking, BookingRequest, BookingStatus tables
2. **Calendar Integration**: Availability and scheduling
3. **API Endpoints**: Booking CRUD operations

#### Phase 3: Media System (FUTURE)
1. **File Storage**: Cloud storage integration (S3/Cloudinary)
2. **Media Models**: ArtistMedia, HostMedia tables
3. **Upload Endpoints**: File processing and optimization

## API Patterns

### 1. URL Validation & Sanitization
```typescript
function ensureProtocol(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed;
  }
  
  return `https://${trimmed}`;
}

// Applied to all URL fields before saving
const normalizedWebsite = ensureProtocol(data.website || '');
```

### 2. Profile Data Management
```typescript
// GET /api/profile - Aggregate data from multiple tables
const profileData = {
  bandName: user.name,
  bio: user.profile?.bio || user.artist?.bio || '',
  location: user.profile?.location || '',
  website: user.profile?.websiteUrl || user.profile?.socialLinks?.website || '',
  socialLinks: user.profile?.socialLinks || {},
  // Artist-specific fields
  genres: user.artist?.genres || [],
  // Host-specific fields
  venueType: user.host?.venueType?.toLowerCase() || 'home',
};

// PUT /api/profile - Update across multiple tables atomically
await prisma.user.update({ ... });
await prisma.userProfile.upsert({ ... });
await prisma.artist.update({ ... }); // if artist
```

### 3. Error Handling Pattern
```typescript
export async function GET/PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Main logic...
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Migration Lessons Learned

### 1. Gradual Conversion Strategy
- ✅ **Start with authentication system** - Foundation for everything else
- ✅ **Convert profile editing first** - Users can see immediate database persistence
- ✅ **Maintain mock data compatibility** - Avoid breaking existing UI components
- ✅ **Use ID mapping** - Seamless transition between mock and database IDs

### 2. Common Integration Pitfalls

#### Schema Mismatches
- **Problem**: Prisma model fields don't match form data
- **Solution**: Use proper field mapping and validation
- **Example**: `userProfile` vs `profile` model naming

#### URL Protocol Issues
- **Problem**: Users enter URLs without `http://` causing routing issues
- **Solution**: Automatic protocol prepending with validation
- **Implementation**: `ensureProtocol()` utility function

#### Controlled Input Warnings
- **Problem**: React controlled/uncontrolled input warnings
- **Solution**: Always initialize form values with defaults
- **Example**: `value={data.field || ''}` instead of `value={data.field}`

### 3. Performance Considerations

#### Database Queries
```typescript
// ✅ Good - Include related data in single query
const artist = await prisma.artist.findFirst({
  where: { userId },
  include: {
    user: {
      include: {
        profile: true
      }
    }
  }
});

// ❌ Bad - Multiple separate queries
const artist = await prisma.artist.findFirst({ where: { userId } });
const user = await prisma.user.findUnique({ where: { id: artist.userId } });
const profile = await prisma.userProfile.findUnique({ where: { userId } });
```

#### Prisma Client Generation
- **Important**: Run `npx prisma generate` after schema changes
- **Deployment**: Ensure Prisma client is generated in production builds
- **Development**: Use `npx prisma studio` for database inspection

## Current Database State

### Seeded Test Data
- **User**: Sarah Johnson (cmd7j6xr10002lu1fqxf46mw1)
- **Artist**: Linked artist profile with folk/indie genres
- **Profile**: Bio, location, website, social links
- **Authentication**: Google OAuth working end-to-end

### Working Features
1. **Profile Edit**: Full database persistence with URL validation
2. **Artist Profile Display**: Database data with mock fallbacks
3. **ID Mapping**: Mock ID '1' maps to database artist
4. **Session Management**: NextAuth.js with database sessions

### Next Integration Points
1. **Host profiles** - Similar to artist conversion
2. **Booking system** - Database models and API endpoints
3. **Media uploads** - File storage and database tracking
4. **Admin approval system** - Application workflow

## File Structure

### Key Files
```
/src/app/api/
├── auth/[...nextauth]/route.ts     # NextAuth configuration
├── profile/route.ts                # Profile GET/PUT endpoints
└── artists/[id]/route.ts           # Artist profile GET endpoint

/src/lib/
├── auth.ts                         # Authentication utilities
├── prisma.ts                       # Prisma client configuration
└── validation.ts                   # Zod schemas (not yet used for DB)

/prisma/
├── schema.prisma                   # Database schema
├── seed.ts                         # Seed data script
└── migrations/                     # Auto-generated migrations

/src/data/
├── mockData.ts                     # UI display data (transitioning)
├── realTestData.ts                 # Auth system data (transitioning)
└── testReviews.ts                  # Review mock data
```

### Environment Configuration
```bash
# Required environment variables
DATABASE_URL="postgresql://username:password@localhost:5432/tourpad"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Security Considerations

### 1. Input Validation
- **URLs**: Automatic protocol sanitization
- **SQL Injection**: Prisma ORM provides built-in protection
- **XSS**: NextAuth.js handles session security

### 2. Access Control
- **Authentication**: Required for all API endpoints
- **Session Validation**: Check `session?.user?.id` in every endpoint
- **Role-based Access**: User type stored in database

### 3. Data Privacy
- **Social Links**: Stored as JSON for flexibility
- **Personal Data**: Proper user relation cascading deletes
- **Profile Visibility**: Separate public/private data handling

## Future Architecture Considerations

### 1. Scalability
- **Database Indexing**: Add indexes for frequently queried fields
- **Caching**: Consider Redis for frequently accessed data
- **CDN**: Implement for media files and static assets

### 2. Performance Optimization
- **Query Optimization**: Use Prisma's `select` for specific fields
- **Connection Pooling**: Configure for production database
- **Image Optimization**: Implement responsive image pipeline

### 3. Monitoring & Observability
- **Database Monitoring**: Query performance tracking
- **Error Tracking**: Structured error logging
- **User Analytics**: Profile completion and usage metrics

---

*Last Updated: 2025-07-18*
*This document should be updated as the database integration continues*