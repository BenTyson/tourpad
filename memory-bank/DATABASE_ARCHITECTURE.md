# TourPad Database Architecture & Integration Patterns

## Overview
This document outlines the complete database architecture, integration patterns, and lessons learned during the conversion from mock data to PostgreSQL with Prisma ORM. **Last updated: July 2025** after comprehensive schema expansion and profile system implementation.

## Technology Stack
- **Database**: PostgreSQL 
- **ORM**: Prisma with TypeScript
- **Authentication**: NextAuth.js with database adapter
- **Hosting**: Local development (production ready)
- **Migration Strategy**: Nuclear reset pattern for stability

## Complete Database Schema (16 Models)

### Core User Management
```prisma
model User {
  id                      String         @id @default(cuid())
  email                   String         @unique
  passwordHash            String?
  name                    String
  profileImageUrl         String?
  userType                UserType       // ARTIST, HOST, FAN, ADMIN
  status                  UserStatus     @default(PENDING)
  oauthProvider           String?
  oauthId                 String?
  emailVerified           Boolean        @default(false)
  verificationToken       String?
  referralSource          String?
  termsAcceptedAt         DateTime?
  privacyPolicyAcceptedAt DateTime?
  lastLogin               DateTime?
  
  // Relations (All Models)
  profile                 UserProfile?
  artist                  Artist?
  host                    Host?
  fan                     Fan?
  accounts                Account[]
  sessions                Session[]
  sentMessages            Message[]
  notifications           Notification[]
  payments                Payment[]
  reviewsReceived         Review[]       @relation("RevieweeUser")
  reviews                 Review[]       @relation("ReviewerUser")
  adminActions            AdminAction[]
  
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
  socialLinks     Json?    // Flexible JSON for social media links
  preferences     Json?
  profileImageUrl String?  // Separate from User.profileImageUrl
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Role-Specific Models

#### Artist Model (Enhanced)
```prisma
model Artist {
  id                      String        @id @default(cuid())
  userId                  String        @unique
  stageName               String?
  genres                  String[]      // Folk, Rock, Jazz, etc.
  typicalSetLength        Int?          // Minutes
  equipmentNeeds          String[]      // Microphone, Guitar amp, etc.
  travelRadius            Int?          // Miles
  pressPhotoUrl           String?
  performanceVideoUrl     String?
  musicSamples            Json?         // Array of {title, url, duration}
  minGuarantee            Int?          // Minimum payment
  preferredBookingAdvance Int?          // Days
  tourMonthsPerYear       Int?
  tourVehicle             String?
  venueRequirements       String[]      // PA system, stage, etc.
  willingToTravel         Int?
  videoLinks              Json?
  needsLodging            Boolean       @default(false)
  
  // Application workflow
  applicationSubmittedAt  DateTime?
  approvedAt              DateTime?
  approvedByUserId        String?
  
  // Relations
  user                    User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  media                   ArtistMedia[]
  bandMembers             BandMember[]
  bookings                Booking[]
  
  createdAt               DateTime      @default(now())
  updatedAt               DateTime      @updatedAt
}
```

#### Host Model (Enhanced)
```prisma
model Host {
  id                     String      @id @default(cuid())
  userId                 String      @unique
  venueName              String?
  venueType              VenueType   // HOME, LOFT, WAREHOUSE, OTHER
  city                   String
  state                  String
  country                String      @default("USA")
  displayCoordinates     String?     // Public approximate location
  actualAddress          String?     // Private exact address
  indoorCapacity         Int?
  outdoorCapacity        Int?
  preferredGenres        String[]
  hostingExperience      Int?        // Years
  typicalShowLength      Int?        // Minutes
  houseRules             String?
  offersLodging          Boolean     @default(false)
  lodgingDetails         Json?       // Rooms, amenities, etc.
  venuePhotoUrl          String?     // NEW: Venue profile photo
  venueDescription       String?
  
  // Application workflow
  applicationSubmittedAt DateTime?
  approvedAt             DateTime?
  approvedByUserId       String?
  
  // Relations
  user                   User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookings               Booking[]
  media                  HostMedia[]
  
  createdAt              DateTime    @default(now())
  updatedAt              DateTime    @updatedAt
}
```

#### Fan Model
```prisma
model Fan {
  id                    String             @id @default(cuid())
  userId                String             @unique
  favoriteGenres        String[]
  travelRadius          Int?
  subscriptionStatus    SubscriptionStatus // ACTIVE, EXPIRED, CANCELLED
  subscriptionStartDate DateTime?
  subscriptionEndDate   DateTime?
  
  // Relations
  user                  User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  rsvps                 FanRSVP[]
  
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt
}
```

### Media Management Models
```prisma
model ArtistMedia {
  id          String    @id @default(cuid())
  artistId    String
  mediaType   MediaType // PHOTO, VIDEO, AUDIO
  category    String?   // 'performance', 'band', 'press'
  fileUrl     String
  fileSize    Int?
  mimeType    String?
  title       String?
  description String?
  sortOrder   Int       @default(0)
  
  artist      Artist    @relation(fields: [artistId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
}

model HostMedia {
  id          String    @id @default(cuid())
  hostId      String
  mediaType   MediaType // PHOTO, VIDEO, AUDIO
  category    String?   // 'venue', 'exterior', 'performance_space'
  fileUrl     String
  fileSize    Int?
  mimeType    String?
  title       String?
  description String?
  sortOrder   Int       @default(0)
  
  host        Host      @relation(fields: [hostId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
}

model BandMember {
  id         String   @id @default(cuid())
  artistId   String
  name       String
  instrument String?
  role       String?
  photoUrl   String?
  bio        String?
  sortOrder  Int      @default(0)
  
  artist     Artist   @relation(fields: [artistId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Booking & Event Models
```prisma
model Booking {
  id                 String         @id @default(cuid())
  artistId           String
  hostId             String
  requestedDate      DateTime
  requestedTime      DateTime?
  estimatedDuration  Int?
  expectedAttendance Int?
  status             BookingStatus  @default(PENDING)
  artistFee          Int?
  doorFee            Int?
  artistMessage      String?
  hostResponse       String?
  lodgingRequested   Boolean        @default(false)
  lodgingDetails     Json?
  requestedAt        DateTime       @default(now())
  respondedAt        DateTime?
  confirmedAt        DateTime?
  completedAt        DateTime?
  
  // Relations
  artist             Artist         @relation(fields: [artistId], references: [id])
  host               Host           @relation(fields: [hostId], references: [id])
  concert            Concert?
  conversations      Conversation[]
  payments           Payment[]
  reviews            Review[]
  
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt
}

model Concert {
  id                      String        @id @default(cuid())
  bookingId               String        @unique
  title                   String?
  description             String?
  date                    DateTime
  startTime               DateTime
  endTime                 DateTime?
  maxCapacity             Int
  doorFee                 Int?
  advanceTicketsAvailable Boolean       @default(false)
  status                  ConcertStatus @default(SCHEDULED)
  isPrivate               Boolean       @default(false)
  requiresApproval        Boolean       @default(true)
  
  // Relations
  booking                 Booking       @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  rsvps                   FanRSVP[]
  
  createdAt               DateTime      @default(now())
  updatedAt               DateTime      @updatedAt
}

model FanRSVP {
  id              String     @id @default(cuid())
  fanId           String
  concertId       String
  status          RSVPStatus @default(PENDING)
  guestsCount     Int        @default(1)
  specialRequests String?
  rsvpDate        DateTime   @default(now())
  statusUpdatedAt DateTime   @default(now())
  
  // Relations
  fan             Fan        @relation(fields: [fanId], references: [id])
  concert         Concert    @relation(fields: [concertId], references: [id])
  
  @@unique([fanId, concertId])
}
```

### Communication Models
```prisma
model Conversation {
  id             String    @id @default(cuid())
  bookingId      String?
  participantIds String[]  // Array of user IDs
  subject        String?
  lastMessageAt  DateTime?
  
  // Relations
  booking        Booking?  @relation(fields: [bookingId], references: [id])
  messages       Message[]
  
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  senderId       String
  content        String
  messageType    MessageType  @default(TEXT)
  readBy         String[]     // Array of user IDs who read this
  
  // Relations
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User         @relation(fields: [senderId], references: [id])
  
  createdAt      DateTime     @default(now())
}

model Notification {
  id          String           @id @default(cuid())
  userId      String
  type        NotificationType // BOOKING, MESSAGE, PAYMENT, SYSTEM
  title       String
  message     String?
  relatedId   String?          // Related booking/message/payment ID
  relatedType String?          // 'booking', 'message', 'payment'
  isRead      Boolean          @default(false)
  readAt      DateTime?
  actionUrl   String?
  actionText  String?
  
  // Relations
  user        User             @relation(fields: [userId], references: [id])
  
  createdAt   DateTime         @default(now())
}

model Review {
  id           String    @id @default(cuid())
  bookingId    String
  reviewerId   String
  revieweeId   String
  rating       Int       // 1-5 stars
  reviewText   String?
  isPublic     Boolean   @default(true)
  responseText String?   // Reviewee response
  responseDate DateTime?
  
  // Relations
  booking      Booking   @relation(fields: [bookingId], references: [id])
  reviewer     User      @relation("ReviewerUser", fields: [reviewerId], references: [id])
  reviewee     User      @relation("RevieweeUser", fields: [revieweeId], references: [id])
  
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  @@unique([bookingId, reviewerId])
}
```

### Payment & Admin Models
```prisma
model Payment {
  id                    String        @id @default(cuid())
  stripePaymentIntentId String?
  amount                Int           // Amount in cents
  currency              String        @default("USD")
  userId                String
  bookingId             String?
  paymentType           PaymentType   // MEMBERSHIP, BOOKING, DOOR_FEE
  status                PaymentStatus @default(PENDING)
  metadata              Json?
  
  // Relations
  user                  User          @relation(fields: [userId], references: [id])
  booking               Booking?      @relation(fields: [bookingId], references: [id])
  
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
}

model AdminAction {
  id         String          @id @default(cuid())
  adminId    String
  actionType AdminActionType // APPROVE_USER, REJECT_USER, SUSPEND_USER, APPROVE_BOOKING
  targetId   String          // ID of user/booking being acted upon
  targetType String          // 'user', 'booking', etc.
  reason     String?
  notes      String?
  
  // Relations
  admin      User            @relation(fields: [adminId], references: [id])
  
  createdAt  DateTime        @default(now())
}
```

### NextAuth Models
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
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
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
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
4. **Host Data**: Complete Host table with venue details and photos
5. **API Endpoints**: `/api/profile` (GET/PUT), `/api/hosts/[id]` (GET), `/api/user/profile-id` (GET)
6. **Image Management**: Profile photos and venue photos working

#### Phase 2: Media System (READY)
1. **File Storage**: Local development, S3 ready for production
2. **Media Models**: ArtistMedia, HostMedia tables implemented
3. **Upload Endpoints**: `/api/upload` stable and working
4. **Image Types**: Profile photos, venue photos, artist media

#### Phase 3: Booking System (FUTURE)
1. **Booking Models**: Complete Booking workflow with statuses
2. **Concert Models**: Public concert creation and RSVP system
3. **Calendar Integration**: Availability and scheduling
4. **API Endpoints**: Booking CRUD operations

#### Phase 4: Communication System (FUTURE)
1. **Messaging**: Conversation and Message models
2. **Notifications**: Real-time notification system
3. **Reviews**: Post-booking review system
4. **Admin Tools**: User approval and management system

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
  bio: user.profile?.bio || user.artist?.stageName || '',
  location: user.profile?.location || '',
  website: user.profile?.websiteUrl || user.profile?.socialLinks?.website || '',
  socialLinks: user.profile?.socialLinks || {},
  profilePhoto: user.profile?.profileImageUrl || '',
  
  // Artist-specific fields
  genres: user.artist?.genres || [],
  needsLodging: user.artist?.needsLodging || false,
  
  // Host-specific fields
  venueType: user.host?.venueType?.toLowerCase() || 'home',
  venueName: user.host?.venueName || '',
  venuePhoto: user.host?.venuePhotoUrl || '',
  offersLodging: user.host?.offersLodging || false,
};

// PUT /api/profile - Update across multiple tables atomically
const updates = await prisma.$transaction([
  prisma.user.update({ where: { id: userId }, data: { name: data.bandName } }),
  prisma.userProfile.upsert({ 
    where: { userId },
    create: { userId, ...profileData },
    update: profileData
  }),
  user.userType === 'ARTIST' ? 
    prisma.artist.update({ where: { userId }, data: artistData }) : null,
  user.userType === 'HOST' ? 
    prisma.host.update({ where: { userId }, data: hostData }) : null,
].filter(Boolean));
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
- ✅ **Implement image uploads early** - Critical for user engagement
- ✅ **Nuclear reset pattern** - When migrations break localhost, full reset works

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

#### Database Migration Crashes
- **Problem**: Adding new fields causes "Unknown argument" errors and localhost crashes
- **Solution**: Nuclear reset pattern - clear .next cache, reset database, reinstall dependencies
- **Prevention**: Test migrations in isolated environments

#### Image Upload Integration
- **Problem**: Photo uploads working but not displaying in profiles
- **Solution**: Ensure API endpoints read from correct database fields (user.profile?.profileImageUrl)
- **Pattern**: Always verify data flow from upload → storage → database → API → display

#### Next.js 15 Params Changes
- **Problem**: Route params now async, causing TypeScript errors
- **Solution**: `const params = await context.params;` in API routes
- **Critical**: All dynamic route handlers need this update

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

## Current Database State (July 2025)

### Live Features
1. **Complete Profile System**: Artist and Host profiles with database persistence
2. **Image Upload System**: Profile photos and venue photos working end-to-end
3. **Authentication**: NextAuth.js with Google OAuth and database sessions
4. **API Endpoints**: 
   - `/api/profile` (GET/PUT) - User profile management
   - `/api/hosts/[id]` (GET) - Host profile display
   - `/api/user/profile-id` (GET) - Dynamic profile ID mapping
   - `/api/upload` (POST) - File upload handling
5. **Database Integration**: Full CRUD operations with Prisma

### Current Schema Features
- **16 Total Models**: Complete platform architecture
- **User Management**: User, UserProfile, Artist, Host, Fan models
- **Media System**: ArtistMedia, HostMedia, BandMember models
- **Booking System**: Booking, Concert, FanRSVP models ready
- **Communication**: Conversation, Message, Notification, Review models
- **Payment & Admin**: Payment, AdminAction models
- **NextAuth**: Account, Session, VerificationToken models

### Image Management
- **Profile Photos**: User.profileImageUrl and UserProfile.profileImageUrl
- **Venue Photos**: Host.venuePhotoUrl for venue profile images
- **Upload System**: Stable `/api/upload` endpoint with local storage
- **Future Media**: ArtistMedia and HostMedia models ready for gallery features

### Data Mapping
- **Mock Data**: Still used for UI display (`mockData.ts`)
- **Real Data**: Authentication and advanced features (`realTestData.ts`)
- **Database**: Live data for profiles, images, and core functionality
- **ID Mapping**: Dashboard dynamically links mock IDs to database IDs

### Ready for Implementation
1. **Booking Workflow**: Complete models and enums ready
2. **Concert System**: Public event creation and fan RSVP system
3. **Media Galleries**: Artist and host media management
4. **Admin Tools**: User approval and content moderation
5. **Payment Integration**: Stripe-ready payment models
6. **Communication**: In-app messaging and notification system

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

*Last Updated: 2025-07-19*
*This document reflects the current state after comprehensive profile system implementation and image upload integration*