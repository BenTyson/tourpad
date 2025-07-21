# TourPad System Architecture

## Technology Stack

### Core Framework
- **Next.js 15.3.5** (App Router) - Full-stack React framework
- **React 19** - Frontend UI library
- **TypeScript** - Type safety throughout application
- **Tailwind CSS v4** - Utility-first CSS framework

### Backend & Database
- **PostgreSQL** - Primary database
- **Prisma ORM** - Database client with type generation
- **NextAuth.js** - Authentication with Google OAuth
- **Next.js API Routes** - Serverless backend functions

### File Storage & Media
- **Local Storage** - Development file uploads (public/uploads/)
- **AWS S3 + CloudFront** - Production file storage (configured, ready)
- **Image Processing** - JPEG, PNG, WebP support with validation

### Development & Deployment
- **Local Development** - PostgreSQL + Node.js
- **Production Ready** - Vercel deployment configuration
- **Version Control** - Git with documented branching strategy

---

## Database Schema (16 Models)

### User Management

#### User Model
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
  
  // Relations to all other models
  profile                 UserProfile?
  artist                  Artist?
  host                    Host?
  fan                     Fan?
  accounts                Account[]      // NextAuth
  sessions                Session[]      // NextAuth
  sentMessages            Message[]
  notifications           Notification[]
  payments                Payment[]
  reviewsReceived         Review[]       @relation("RevieweeUser")
  reviews                 Review[]       @relation("ReviewerUser")
  adminActions            AdminAction[]
  
  createdAt               DateTime       @default(now())
  updatedAt               DateTime       @updatedAt
}
```

#### UserProfile Model  
```prisma
model UserProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  bio             String?
  location        String?
  phone           String?
  websiteUrl      String?
  socialLinks     Json?    // {instagram, facebook, twitter, youtube, spotify}
  preferences     Json?    // {notifications, privacy, etc}
  profileImageUrl String?
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Role-Specific Models

#### Artist Model
```prisma
model Artist {
  id                      String        @id @default(cuid())
  userId                  String        @unique
  stageName               String?
  genres                  String[]      // [Folk, Rock, Jazz]
  typicalSetLength        Int?          // Minutes
  equipmentNeeds          String[]      // [Microphone, Guitar amp]
  travelRadius            Int?          // Miles
  pressPhotoUrl           String?
  performanceVideoUrl     String?
  musicSamples            Json?         // [{title, url, duration}]
  minGuarantee            Int?          // Minimum payment
  preferredBookingAdvance Int?          // Days
  tourMonthsPerYear       Int?
  tourVehicle             String?
  venueRequirements       String[]      // [PA system, stage]
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

#### Host Model
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
  lodgingDetails         Json?       // Room configuration, amenities
  venuePhotoUrl          String?     // Main venue photo
  venueDescription       String?
  
  // Application workflow
  applicationSubmittedAt DateTime?
  approvedAt             DateTime?
  approvedByUserId       String?
  
  // Relations
  user                   User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookings               Booking[]
  media                  HostMedia[] // Gallery photos
  
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

### Media Management

#### ArtistMedia Model
```prisma
model ArtistMedia {
  id          String    @id @default(cuid())
  artistId    String
  mediaType   MediaType // PHOTO, VIDEO, AUDIO
  category    String?   // performance, band, press
  fileUrl     String
  fileSize    Int?
  mimeType    String?
  title       String?
  description String?
  sortOrder   Int       @default(0)
  
  artist      Artist    @relation(fields: [artistId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
}
```

#### HostMedia Model (ACTIVE - Venue Photo Galleries)
```prisma
model HostMedia {
  id          String    @id @default(cuid())
  hostId      String
  mediaType   MediaType // PHOTO, VIDEO
  category    String?   // venue, exterior, performance_space
  fileUrl     String    // Served via /api/files/[...path]/route.ts
  fileSize    Int?
  mimeType    String?
  title       String?
  description String?
  sortOrder   Int       @default(0)
  
  host        Host      @relation(fields: [hostId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
}
```

**Current Implementation Status:**
- ✅ Photos uploading during host registration to `storage/uploads/`
- ✅ HostMedia records created with proper fileUrl paths
- ✅ Admin applications page displays photos via lightbox gallery
- ✅ File serving API handles image delivery with proper headers

#### BandMember Model
```prisma
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

### Booking & Event System

#### Booking Model
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
```

#### Concert Model
```prisma
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
```

#### FanRSVP Model
```prisma
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

### Communication System

#### Conversation Model
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
```

#### Message Model
```prisma
model Message {
  id             String       @id @default(cuid())
  conversationId String
  senderId       String
  content        String
  messageType    MessageType  @default(TEXT)
  readBy         String[]     // Array of user IDs
  
  // Relations
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User         @relation(fields: [senderId], references: [id])
  
  createdAt      DateTime     @default(now())
}
```

#### Notification Model
```prisma
model Notification {
  id          String           @id @default(cuid())
  userId      String
  type        NotificationType // BOOKING, MESSAGE, PAYMENT, SYSTEM
  title       String
  message     String?
  relatedId   String?          // Related booking/message/payment ID
  relatedType String?          // booking, message, payment
  isRead      Boolean          @default(false)
  readAt      DateTime?
  actionUrl   String?
  actionText  String?
  
  // Relations
  user        User             @relation(fields: [userId], references: [id])
  
  createdAt   DateTime         @default(now())
}
```

### Review System

#### Review Model
```prisma
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

### Payment & Admin

#### Payment Model
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
```

#### AdminAction Model
```prisma
model AdminAction {
  id         String          @id @default(cuid())
  adminId    String
  actionType AdminActionType // APPROVE_USER, REJECT_USER, SUSPEND_USER
  targetId   String          // ID of user/booking being acted upon
  targetType String          // user, booking, etc.
  reason     String?
  notes      String?
  
  // Relations
  admin      User            @relation(fields: [adminId], references: [id])
  
  createdAt  DateTime        @default(now())
}
```

### NextAuth Models

#### Account, Session, VerificationToken
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

### Database Enums
```prisma
enum UserType {
  ARTIST
  HOST
  FAN
  ADMIN
}

enum UserStatus {
  PENDING
  APPROVED
  ACTIVE
  SUSPENDED
  REJECTED
}

enum VenueType {
  HOME
  LOFT
  WAREHOUSE
  OTHER
}

enum MediaType {
  PHOTO
  VIDEO
  AUDIO
}

enum BookingStatus {
  PENDING
  APPROVED
  REJECTED
  CONFIRMED
  COMPLETED
  CANCELLED
}

enum ConcertStatus {
  SCHEDULED
  LIVE
  COMPLETED
  CANCELLED
}

enum RSVPStatus {
  PENDING
  APPROVED
  DECLINED
  WAITLISTED
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
}

enum PaymentType {
  MEMBERSHIP
  BOOKING
  DOOR_FEE
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum MessageType {
  TEXT
  SYSTEM
  BOOKING_UPDATE
}

enum NotificationType {
  BOOKING
  MESSAGE
  PAYMENT
  SYSTEM
}

enum AdminActionType {
  APPROVE_USER
  REJECT_USER
  SUSPEND_USER
  APPROVE_BOOKING
}
```

---

## API Architecture

### Working Endpoints ✅

#### Authentication & Profile Management
```typescript
GET    /api/profile              // Get current user profile with photos
PUT    /api/profile              // Update profile data and photos
GET    /api/user/profile-id      // Get dynamic profile ID mapping
GET    /api/hosts/[id]           // Public host profile display
```

#### Browse & Discovery
```typescript
GET    /api/hosts                // Browse all approved hosts with database data
GET    /api/artists              // Browse all approved artists with database data
GET    /api/artists/[id]         // Individual artist profile with complete data
// Supports: search, filters, pagination, photo galleries
```

#### File Upload & Serving
```typescript
POST   /api/upload               // File upload with authentication
// Supports: profile photos, venue photos, media files
// Storage: Local (dev), AWS S3 (prod ready)
// Validation: File type, size, authentication

GET    /api/files/[...path]      // File serving API (rewrites from /uploads/*)
// Features: Proper content-type headers, caching, security
// Storage: storage/uploads/ directory (outside public for performance)
```

#### NextAuth Integration
```typescript
GET    /api/auth/session         // Current session info
POST   /api/auth/signin          // Google OAuth signin
POST   /api/auth/signout         // Session termination
```

### Ready for Implementation 🔄

#### Booking System
```typescript
POST   /api/bookings             // Create booking request
GET    /api/bookings             // List user bookings
GET    /api/bookings/[id]        // Booking details
PATCH  /api/bookings/[id]/respond // Host response to booking
PATCH  /api/bookings/[id]/confirm // Final confirmation
```

#### Concert & Fan Features  
```typescript
GET    /api/concerts             // Public concert discovery
POST   /api/concerts             // Create concert from booking
GET    /api/concerts/[id]        // Concert details
POST   /api/concerts/[id]/rsvp   // Fan RSVP to concert
GET    /api/fans/[id]/rsvps      // Fan's concert RSVPs
```

#### Payment Integration
```typescript
POST   /api/payments/create-intent    // Stripe payment intent
POST   /api/payments/webhook          // Stripe webhook handler
GET    /api/payments/subscription     // Subscription status
POST   /api/payments/cancel          // Cancel subscription
```

#### Admin Tools ✅ IMPLEMENTED
```typescript
GET    /api/admin/applications        // Pending user applications (WORKING)
GET    /api/admin/metrics            // Real-time dashboard metrics (WORKING)
POST   /api/admin/applications/[userId]/approve // Approve users (WORKING)
POST   /api/admin/applications/[userId]/reject  // Reject users (WORKING)

// Features implemented:
// - Real-time pending count display
// - Photo gallery viewing in applications
// - Host/Artist application filtering
// - Complete application review UI
```

### API Response Patterns

#### Standard Success Response
```typescript
interface APIResponse<T> {
  success: true;
  data: T;
  message?: string;
}
```

#### Standard Error Response
```typescript
interface APIError {
  success: false;
  error: string;
  code?: string;
  details?: any;
}
```

#### Pagination Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## File Storage Architecture

### Current Implementation (Local Storage)
```
public/
└── uploads/
    ├── {userId}-profile-{timestamp}.{ext}    # Profile photos
    ├── {userId}-venue-{timestamp}.{ext}      # Venue photos  
    └── {userId}-{type}-{timestamp}.{ext}     # Media files
```

### Upload Process
1. **File Validation**: Type (JPEG/PNG/WebP), size (5MB max), authentication
2. **File Storage**: Atomic write to public/uploads/ with unique filename
3. **Database Update**: Store file URL in appropriate model (UserProfile, Host, HostMedia)
4. **Response**: Return public URL for immediate display

### Production Storage (AWS S3 Ready)
```typescript
// Configuration ready in /src/lib/storage.ts
const s3Config = {
  bucket: process.env.AWS_S3_BUCKET,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
```

### File Upload Endpoint (`/api/upload`)
```typescript
interface UploadRequest {
  file: File;
  type: 'profile' | 'venue' | 'media';
  category?: string;
}

interface UploadResponse {
  success: boolean;
  url: string;
  fileName: string;
}
```

---

## Authentication Architecture

### NextAuth.js Configuration
```typescript
// /src/lib/auth.ts
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    session: async ({ session, token }) => {
      // Add user type and additional data to session
    },
    jwt: async ({ user, token }) => {
      // Customize JWT token
    },
  },
};
```

### Session Management
```typescript
// Session object structure
interface SessionUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  userType: 'ARTIST' | 'HOST' | 'FAN' | 'ADMIN';
}
```

### Route Protection Pattern
```typescript
// In API routes
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## Data Flow Architecture

### Profile Management Flow
```
User Input → Form Validation → API Call → Database Update → State Update → UI Refresh
```

### Image Upload Flow
```
File Selection → Client Validation → FormData Creation → Upload API → File Storage → Database Update → URL Return → Image Display
```

### Authentication Flow
```
Google OAuth → NextAuth Session → Database User Lookup → Session Creation → Protected Route Access
```

### Booking Flow (Ready for Implementation)
```
Artist Request → Host Notification → Host Response → Confirmation → Concert Creation → Fan Discovery
```

---

## Environment Configuration

### Development
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/tourpad"

# Authentication  
NEXTAUTH_SECRET="dev-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# File Storage (Optional for dev)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="tourpad-dev"
AWS_REGION="us-east-1"
```

### Production (Ready)
```env
# Database
DATABASE_URL="postgresql://user:pass@prod-host:5432/tourpad"

# Authentication
NEXTAUTH_SECRET="prod-secret"
NEXTAUTH_URL="https://tourpad.com"

# Google OAuth (Production credentials)
GOOGLE_CLIENT_ID="prod-google-client-id"  
GOOGLE_CLIENT_SECRET="prod-google-client-secret"

# File Storage
AWS_ACCESS_KEY_ID="prod-access-key"
AWS_SECRET_ACCESS_KEY="prod-secret-key"
AWS_S3_BUCKET="tourpad-prod"
AWS_REGION="us-east-1"

# Payments (Ready for Stripe)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## Performance Considerations

### Database Optimization
- **Indexes**: Added on frequently queried fields (userId, email, status)
- **Relationships**: Proper foreign key constraints with cascade deletes
- **Query Optimization**: Using Prisma's `include` for eager loading
- **Connection Pooling**: Ready for production database configuration

### API Performance
- **Response Caching**: Headers set for static content
- **Pagination**: Implemented for list endpoints
- **Error Handling**: Comprehensive try/catch with proper HTTP status codes
- **Input Validation**: Zod schemas for request validation

### File Storage Performance
- **Local Development**: Direct file system access
- **Production**: AWS S3 with CloudFront CDN
- **Image Optimization**: Planned for WebP conversion and responsive sizing
- **Upload Limits**: 5MB file size limit with type validation

### Frontend Performance
- **Code Splitting**: Next.js automatic route-based splitting
- **Image Optimization**: Next.js Image component ready for production
- **Static Generation**: Ready for ISR (Incremental Static Regeneration)
- **TypeScript**: Full type safety eliminates runtime type errors

---

*This architecture supports TourPad's current working features and provides a solid foundation for implementing the remaining booking, payment, and admin systems.*