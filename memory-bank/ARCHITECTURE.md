# TourPad System Architecture

## Technology Stack

### Core Framework
- **Next.js 15.3.5** (App Router) - Full-stack React framework
- **React 19** - Frontend UI library
- **TypeScript** - Type safety throughout application
- **Tailwind CSS v4** - Utility-first CSS framework
- **Node.js 20.19.4 LTS** - Runtime environment (migrated from Node 22 for stability)

### Backend & Database
- **PostgreSQL** - Primary database
- **Prisma ORM** - Database client with type generation
- **NextAuth.js** - Authentication with Google OAuth
- **Next.js API Routes** - Serverless backend functions
- **Spotify Web API** - Music data integration with caching (✅ implemented)

### File Storage & Media
- **Local Storage** - Development file uploads (public/uploads/)
- **AWS S3 + CloudFront** - Production file storage (configured, ready)
- **Image Processing** - JPEG, PNG, WebP support with validation
- **Profile Image System** - Smart resolution with fallback chains (✅ implemented)
- **File Attachments** - Message attachments up to 10MB (images, PDFs, documents)

### Development & Deployment
- **Local Development** - PostgreSQL + Node.js 20.x LTS
- **Production Ready** - Vercel deployment configuration
- **Version Control** - Git with documented branching strategy

### Real-time Features ✅ OPERATIONAL
- **Polling System** - Message updates, typing indicators, online status (30s intervals)
- **Status**: ✅ FIXED - Safe polling with rate limiting implemented
- **Fix Applied**: useRealtimeMessagingSafe hook with stable refs pattern

---

## Database Schema (18 Models)

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
  stripeCustomerId        String?        @unique
  
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
  subscription            Subscription?
  
  createdAt               DateTime       @default(now())
  updatedAt               DateTime       @updatedAt
  
  @@map("users")
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
  
  @@map("user_profiles")
}
```

### Role-Specific Models

#### Artist Model ✅ UPDATED WITH SPOTIFY INTEGRATION
```prisma
model Artist {
  id                      String        @id @default(cuid())
  userId                  String        @unique
  stageName               String?
  genres                  String[]      // [Folk, Rock, Jazz]
  typicalSetLength        Int?          // Minutes
  equipmentNeeds          String[]      // [Microphone, Guitar amp]
  travelRadius            Int?          // Miles
  pressPhotoUrl           String?        // Thumbnail photo (square, 500x500px min)
  heroPhotoUrl            String?        // Hero banner (1920x1080 or 2400x1200)
  performanceVideoUrl     String?
  performanceVideoFile    String?       // File path for uploaded MP4 video
  musicSamples            Json?         // [{title, url, duration}]
  minGuarantee            Int?          // Minimum payment
  preferredBookingAdvance Int?          // Days
  tourMonthsPerYear       Int?
  tourVehicle             String?
  venueRequirements       String[]      // [PA system, stage]
  willingToTravel         Int?
  videoLinks              Json?
  needsLodging            Boolean       @default(false)
  contentRating           String?       @default("family-friendly") // family-friendly, explicit, tailored
  briefBio                String?       // Brief introduction (500 char limit)
  fullBio                 String?       // Detailed bio (no limit)
  
  // Spotify Integration ✅ IMPLEMENTED
  spotifyArtistId         String?       // Spotify artist ID from API
  spotifyVerified         Boolean       @default(false)
  spotifyFollowers        Int?          // Follower count from Spotify
  spotifyPopularity       Int?          // Popularity score (0-100)
  spotifyGenres           String[]      @default([])  // Genres from Spotify
  lastSpotifySync         DateTime?     // Last sync timestamp
  
  // SoundCloud Integration ✅ IMPLEMENTED
  soundcloudUserId        Int?          // SoundCloud user ID from API
  soundcloudUsername      String?       // SoundCloud username
  soundcloudVerified      Boolean       @default(false)
  soundcloudFollowers     Int?          // Follower count from SoundCloud
  soundcloudTrackCount    Int?          // Track count from SoundCloud
  soundcloudPlaylistCount Int?          // Playlist count from SoundCloud
  lastSoundCloudSync      DateTime?     // Last sync timestamp
  
  // Application workflow
  applicationSubmittedAt  DateTime?
  approvedAt              DateTime?
  approvedByUserId        String?
  
  // Relations
  user                    User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  media                   ArtistMedia[]
  bandMembers             BandMember[]
  bookings                Booking[]
  spotifyAlbums           SpotifyAlbum[]    // Spotify album data
  spotifyTracks           SpotifyTrack[]    // Spotify track data
  soundcloudTracks        SoundCloudTrack[] // SoundCloud track data
  tourSegments            TourSegment[]     // Tour planning data
  
  createdAt               DateTime      @default(now())
  updatedAt               DateTime      @updatedAt
  
  @@map("artists")
}
```

#### Host Model
```prisma
model Host {
  id                     String              @id @default(cuid())
  userId                 String              @unique
  venueName              String?
  venueType              VenueType           // HOME, LOFT, WAREHOUSE, STUDIO, BACKYARD, OTHER
  city                   String
  state                  String
  country                String              @default("USA")
  displayCoordinates     String?             // Public approximate location
  actualAddress          String?             // Private exact address
  
  // Enhanced location privacy system
  latitude               Float?              // Exact coordinates (private)
  longitude              Float?              // Exact coordinates (private)
  privacyLevel           LocationPrivacy     @default(NEIGHBORHOOD)
  displayLat             Float?              // Obfuscated coordinates for public display
  displayLng             Float?              // Obfuscated coordinates for public display
  
  indoorCapacity         Int?
  outdoorCapacity        Int?
  preferredGenres        String[]
  hostingExperience      Int?                // Years
  typicalShowLength      Int?                // Minutes
  houseRules             String?
  offersLodging          Boolean             @default(false)
  lodgingDetails         Json?               // Room configuration, amenities
  suggestedDoorFee       Int?                // Suggested door fee amount
  venuePhotoUrl          String?             // Main venue photo
  venueDescription       String?
  amenities              String[]            // Venue amenities array
  soundSystem            Json?               // Sound system details
  
  // Application workflow
  applicationSubmittedAt DateTime?
  approvedAt             DateTime?
  approvedByUserId       String?
  
  // Relations
  user                   User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookings               Booking[]
  media                  HostMedia[]         // Gallery photos
  
  createdAt              DateTime            @default(now())
  updatedAt              DateTime            @updatedAt
  
  @@map("hosts")
}
```

#### Fan Model ✅ UPDATED WITH PROFILE FEATURES
```prisma
model Fan {
  id                    String             @id @default(cuid())
  userId                String             @unique
  favoriteGenres        String[]           // Music genres for concert recommendations
  hometown              String?            // Fan's hometown for location-based features
  state                 String?            // Fan's state (US states)
  bio                   String?            // Fan's personal bio/description
  profileImageUrl       String?            // Fan's profile photo (uploadable)
  travelRadius          Int?               // Willing travel distance for concerts
  subscriptionStatus    SubscriptionStatus // ACTIVE, EXPIRED, CANCELLED
  subscriptionStartDate DateTime?
  subscriptionEndDate   DateTime?
  
  // Relations
  user                  User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  rsvps                 FanRSVP[]          // Concert RSVPs
  reviews               Review[]           // Concert reviews written by fan
  
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt
  
  @@map("fans")
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
  
  @@map("artist_media")
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
  
  @@map("host_media")
}
```

**Current Implementation Status:**
- ✅ Photos uploading during host registration to `storage/uploads/`
- ✅ HostMedia records created with proper fileUrl paths
- ✅ Admin applications page displays photos via lightbox gallery
- ✅ File serving API handles image delivery with proper headers

### Music Platform Integration Models ✅ IMPLEMENTED

#### Spotify Integration Models

##### SpotifyAlbum Model
```prisma
model SpotifyAlbum {
  id                  String     @id @default(cuid())
  spotifyId           String     @unique
  artistId            String
  name                String
  albumType           String     // album, single, compilation
  releaseDate         String
  imageUrl            String?    // Spotify album artwork URL
  spotifyUrl          String     // Direct link to Spotify album
  totalTracks         Int
  
  artist              Artist     @relation(fields: [artistId], references: [id], onDelete: Cascade)
  tracks              SpotifyTrack[]
  
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt
  
  @@map("spotify_albums")
}
```

##### SpotifyTrack Model
```prisma
model SpotifyTrack {
  id                  String     @id @default(cuid())
  spotifyId           String     @unique
  artistId            String
  albumId             String?
  name                String
  durationMs          Int
  popularity          Int        // Spotify popularity score (0-100)
  previewUrl          String?    // 30-second preview URL from Spotify
  spotifyUrl          String     // Direct link to Spotify track
  trackNumber         Int?       // Position in album
  explicit            Boolean    @default(false)
  
  artist              Artist     @relation(fields: [artistId], references: [id], onDelete: Cascade)
  album               SpotifyAlbum? @relation(fields: [albumId], references: [id], onDelete: SetNull)
  
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt
  
  @@map("spotify_tracks")
}
```

##### SpotifyCache Model
```prisma
model SpotifyCache {
  id                  String     @id @default(cuid())
  cacheKey            String     @unique
  data                Json       // Cached Spotify API response
  expiresAt           DateTime   // Cache expiration time
  
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt
  
  @@map("spotify_cache")
}
```

#### SoundCloud Integration Models

##### SoundCloudTrack Model
```prisma
model SoundCloudTrack {
  id                  String     @id @default(cuid())
  soundcloudId        Int        @unique
  artistId            String
  title               String
  description         String?
  durationMs          Int
  playbackCount       Int        @default(0)
  likesCount          Int        @default(0)
  streamUrl           String?    // Authenticated stream URL
  soundcloudUrl       String     // Direct link to SoundCloud track
  artworkUrl          String?    // Track artwork URL
  waveformUrl         String?    // Waveform visualization URL
  isStreamable        Boolean    @default(true)
  genre               String?
  tags                String[]   @default([])
  isDownloadable      Boolean    @default(false)
  license             String?
  
  artist              Artist     @relation(fields: [artistId], references: [id], onDelete: Cascade)
  
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt
  
  @@map("soundcloud_tracks")
}
```

##### SoundCloudCache Model
```prisma
model SoundCloudCache {
  id                  String     @id @default(cuid())
  cacheKey            String     @unique
  data                Json       // Cached SoundCloud API response
  expiresAt           DateTime   // Cache expiration time
  
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt
  
  @@map("soundcloud_cache")
}
```

#### Direct MP3 Upload Models ✅ FULLY IMPLEMENTED

##### UploadedTrack Model
```prisma
model UploadedTrack {
  id                  String     @id @default(cuid())
  artistId            String
  title               String
  artistName          String?    // Artist name for display (different from Artist model relation)
  album               String?
  genre               String?
  year                Int?
  trackNumber         Int?
  durationMs          Int?       // Track duration in milliseconds
  originalFilename    String     // Original uploaded filename
  filename            String     // Stored filename (timestamped)
  filePath            String     // Relative path: /uploads/music/{filename}
  fileSize            Int        // File size in bytes
  mimeType            String     // audio/mpeg, audio/mp3
  bitrate             Int?       // Audio bitrate
  sampleRate          Int?       // Audio sample rate (e.g., 44100)
  channels            Int?       // Audio channels (1=mono, 2=stereo)
  description         String?    // Track description/notes
  lyrics              String?    // Track lyrics
  isPublic            Boolean    @default(true)  // Show on public profile
  sortOrder           Int        @default(0)     // Custom ordering
  processingStatus    String     @default("READY") // READY, PROCESSING, ERROR, DELETED
  errorMessage        String?    // Processing error details
  
  artist              Artist     @relation(fields: [artistId], references: [id], onDelete: Cascade)
  
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt
  
  @@map("uploaded_tracks")
}
```

### Music Platform Integration Status

#### Spotify Integration ✅ FULLY IMPLEMENTED
- ✅ **Database Schema**: Complete with Album, Track, and Cache models
- ✅ **Authentication**: Client Credentials flow with auto-refresh tokens
- ✅ **API Client**: Full Spotify Web API integration (`/src/lib/spotify.ts`)
- ✅ **Artist Sync**: Complete artist data sync with album/track relationships
- ✅ **Caching System**: Smart caching to minimize API rate limit usage
- ✅ **UI Components**: Latest Albums section with clickable Spotify links
- ✅ **Audio Player**: Enhanced player with 30-second previews (when available)
- ✅ **Dashboard Integration**: Artist dashboard Spotify connection and sync controls

#### SoundCloud Integration ✅ FULLY IMPLEMENTED
- ✅ **Database Schema**: Complete with Track and Cache models
- ✅ **Authentication**: Client Credentials flow with token management
- ✅ **API Client**: Full SoundCloud API v2 integration (`/src/lib/soundcloud.ts`)
- ✅ **Mock Data System**: Comprehensive fallback for API credentials pending approval
- ✅ **Artist Sync**: Complete artist data sync with track metadata and streaming URLs
- ✅ **Caching System**: Smart caching to minimize API rate limit usage (60-minute TTL)
- ✅ **UI Components**: SoundCloud track display with orange theming
- ✅ **Audio Player**: Stream URL integration with playback controls
- ✅ **Dashboard Integration**: Artist dashboard SoundCloud connection and sync controls
- ✅ **Dual Platform Support**: Artists can display both Spotify AND SoundCloud simultaneously

#### Cross-Platform Features ✅ IMPLEMENTED
- ✅ **Unified Music Display**: EnhancedArtistMusicSection supports both platforms
- ✅ **Simultaneous Integration**: Artists can sync and display both services
- ✅ **Platform-Specific Styling**: Green for Spotify, Orange for SoundCloud
- ✅ **Unified Audio Playback**: Single player handles both Spotify previews and SoundCloud streams
- ✅ **Mock Data Integration**: Development testing with realistic mock data for both platforms

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

#### TourSegment Model ✅ IMPLEMENTED
```prisma
model TourSegment {
  id          String             @id @default(cuid())
  artistId    String
  name        String             // "Southwest Tour Spring 2025" - user-friendly name
  description String?            // Optional detailed description
  status      String             @default("planned") // planned, confirmed, cancelled
  isPublic    Boolean            @default(true)  // Allow private tour planning
  
  artist      Artist             @relation(fields: [artistId], references: [id], onDelete: Cascade)
  stateRanges TourStateRange[]   // Individual state date ranges
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
}
```

#### TourStateRange Model ✅ IMPLEMENTED
```prisma
model TourStateRange {
  id            String      @id @default(cuid())
  tourSegmentId String
  state         String      // "CO", "UT", etc. - state abbreviation
  startDate     DateTime    // When the artist arrives in this state
  endDate       DateTime    // When the artist leaves this state
  cities        String[]    // ["Denver", "Boulder"] - optional specific cities
  notes         String?     // Optional notes for this state leg
  
  tourSegment   TourSegment @relation(fields: [tourSegmentId], references: [id], onDelete: Cascade)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

### Booking & Event System

#### Booking Model ✅ IMPLEMENTED
```prisma
model Booking {
  id                   String         @id @default(cuid())
  artistId             String
  hostId               String
  requestedDate        DateTime
  requestedTime        DateTime?
  estimatedDuration    Int?
  expectedAttendance   Int?
  status               BookingStatus  @default(PENDING)
  doorFee              Int?           // Only door fee, no artist fee
  doorFeeStatus        DoorFeeStatus? // Door fee negotiation workflow
  artistMessage        String?
  hostResponse         String?
  lodgingRequested     Boolean        @default(false)
  lodgingDetails       Json?
  confirmationDeadline DateTime?      // 5-day artist confirmation window
  requestedAt          DateTime       @default(now())
  respondedAt          DateTime?
  confirmedAt          DateTime?
  completedAt          DateTime?
  
  // Relations
  artist               Artist         @relation(fields: [artistId], references: [id])
  host                 Host           @relation(fields: [hostId], references: [id])
  concert              Concert?
  conversations        Conversation[]
  payments             Payment[]
  reviews              Review[]
  
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt
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
  
  // File attachment fields
  attachmentUrl  String?      // URL to the uploaded file
  attachmentType String?      // MIME type (image/jpeg, application/pdf, etc.)
  attachmentName String?      // Original filename
  attachmentSize Int?         // File size in bytes
  
  readBy         String[]     // Array of user IDs
  
  // Relations
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User         @relation(fields: [senderId], references: [id])
  
  createdAt      DateTime     @default(now())
  
  @@map("messages")
}
```

#### Notification Model ✅ IMPLEMENTED
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
  actionUrl   String?          // Deep links to booking/message pages
  actionText  String?          // Custom action button text
  
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

### Payment & Billing System ✅

#### Payment Model
```prisma
model Payment {
  id                    String        @id @default(cuid())
  stripePaymentIntentId String?       // Stripe Payment Intent ID
  stripePaymentId       String?       @unique  // Stripe Payment Intent or Session ID
  stripeCustomerId      String?       // Stripe Customer ID
  amount                Int           // Amount in cents
  currency              String        @default("USD")
  userId                String
  bookingId             String?
  paymentType           PaymentType   // MEMBERSHIP, BOOKING, DOOR_FEE, ARTIST_ANNUAL, FAN_MONTHLY, ONE_TIME
  status                PaymentStatus @default(PENDING) // PENDING, PROCESSING, SUCCEEDED, COMPLETED, FAILED, CANCELED, REFUNDED
  description           String?
  metadata              Json?         // Additional Stripe metadata

  // Relations
  user                  User          @relation(fields: [userId], references: [id])
  booking               Booking?      @relation(fields: [bookingId], references: [id])

  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  @@index([stripePaymentId])
  @@index([userId])
  @@map("payments")
}
```

#### Subscription Model ✅
```prisma
model Subscription {
  id                     String              @id @default(cuid())
  userId                 String              @unique
  user                   User                @relation(fields: [userId], references: [id])
  
  // Stripe data
  stripeSubscriptionId   String?             @unique
  stripeCustomerId       String
  stripePriceId          String?             // Stripe Price ID for the subscription
  
  // Status tracking
  status                 SubscriptionStatus  // ACTIVE, EXPIRED, CANCELLED
  currentPeriodStart     DateTime
  currentPeriodEnd       DateTime
  cancelAtPeriodEnd      Boolean             @default(false)
  
  // Billing
  amount                 Int                 // recurring amount in cents
  interval               String              // "month" or "year"
  
  createdAt              DateTime            @default(now())
  updatedAt              DateTime            @updatedAt

  @@index([stripeSubscriptionId])
  @@map("subscriptions")
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
  PAYMENT_EXPIRED
}

enum VenueType {
  HOME
  LOFT
  WAREHOUSE
  OTHER
  STUDIO
  BACKYARD
}

enum MediaType {
  PHOTO
  VIDEO
  AUDIO
}

enum BookingStatus {
  PENDING      // Initial artist request
  APPROVED     // Host approved, awaiting artist confirmation
  REJECTED     // Host rejected
  CONFIRMED    // Artist confirmed within 5 days
  COMPLETED    // Show completed
  CANCELLED    // Either party cancelled
}

enum DoorFeeStatus {
  PENDING_HOST    // Host needs to approve/counter artist suggestion
  PENDING_ARTIST  // Artist needs to approve host counter-offer
  AGREED          // Both parties agreed on door fee
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
  ARTIST_ANNUAL
  FAN_MONTHLY
  ONE_TIME
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  COMPLETED
  FAILED
  CANCELED
  REFUNDED
}

enum MessageType {
  TEXT
  ATTACHMENT
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

enum LocationPrivacy {
  NEIGHBORHOOD  // ±1 mile radius
  STREET       // ±0.2 mile radius
  EXACT        // Only after booking confirmed
}
```

### Database Performance Indexes

#### Required Indexes for Optimal Performance
```sql
-- Messaging system performance indexes
CREATE INDEX idx_conversation_participants ON Conversation USING GIN(participantIds);
CREATE INDEX idx_conversation_booking ON Conversation(bookingId);
CREATE INDEX idx_conversation_last_message ON Conversation(lastMessageAt DESC);
CREATE INDEX idx_message_conversation ON Message(conversationId, createdAt DESC);
CREATE INDEX idx_message_sender ON Message(senderId);
CREATE INDEX idx_message_read_by ON Message USING GIN(readBy);

-- User and authentication indexes
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_status ON User(status);
CREATE INDEX idx_user_type ON User(userType);

-- Booking system indexes
CREATE INDEX idx_booking_artist ON Booking(artistId);
CREATE INDEX idx_booking_host ON Booking(hostId);
CREATE INDEX idx_booking_status ON Booking(status);
CREATE INDEX idx_booking_date ON Booking(requestedDate);

-- Payment system indexes (already implemented in schema)
-- @@index([stripePaymentId])
-- @@index([userId])
-- @@index([stripeSubscriptionId])

-- Notification system indexes
CREATE INDEX idx_notification_user ON Notification(userId);
CREATE INDEX idx_notification_read ON Notification(isRead);
CREATE INDEX idx_notification_created ON Notification(createdAt DESC);
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
GET    /api/artists/discover     // Discover artists by tour location/dates
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

#### Music Platform Integrations ✅ IMPLEMENTED

##### Spotify Integration
```typescript
GET    /api/spotify/artist/[artistId]        // Get artist's Spotify data (albums, tracks)
POST   /api/spotify/search/artists           // Search for artists on Spotify
POST   /api/spotify/sync/[artistId]          // Sync artist data from Spotify API
GET    /api/spotify/health                   // Spotify API health check

// Features implemented:
// - Client Credentials authentication flow with auto-refresh tokens
// - Complete artist data sync (albums, tracks, metadata, artwork)
// - Smart caching system to minimize API rate limits (60-minute default TTL)
// - Album artwork and track preview URL management
// - Integration with artist dashboard for connection management
// - Latest Albums section with clickable Spotify links (6 albums, horizontal layout)
// - Enhanced audio player with 30-second track previews (when available)
```

##### SoundCloud Integration
```typescript
GET    /api/soundcloud/artist/[artistId]     // Get artist's SoundCloud data (tracks)
POST   /api/soundcloud/search                // Search for artists on SoundCloud
POST   /api/soundcloud/artist/[artistId]/sync // Sync artist data from SoundCloud API
POST   /api/soundcloud/artist/[artistId]/disconnect // Disconnect SoundCloud integration
GET    /api/soundcloud/health                // SoundCloud API health check

// Features implemented:
// - Client Credentials authentication flow with token management
// - Complete artist data sync (tracks, metadata, streaming URLs, artwork)
// - Mock data fallback system for development without API credentials
// - Smart caching system to minimize API rate limits (60-minute default TTL)
// - Track artwork and stream URL management with authentication
// - Integration with artist dashboard for connection management
// - SoundCloud track display with orange theming and platform-specific metadata
// - Stream URL integration with unified audio player
// - Support for SoundCloud-specific features (tags, waveforms, download options)
```

##### Cross-Platform Integration
```typescript
// Unified music display supporting both platforms simultaneously
// - EnhancedArtistMusicSection component displays both Spotify and SoundCloud
// - Platform-specific styling (Spotify: green, SoundCloud: orange)
// - Unified audio playback system handles both platform URLs
// - Artist profiles show both services when connected
// - Dashboard integration allows management of both platforms
// - Mock data system supports development for both platforms
```

### Implemented Systems ✅

#### Booking System ✅ FULLY IMPLEMENTED
```typescript
POST   /api/bookings             // Create booking request
GET    /api/bookings             // List user bookings with filtering
GET    /api/bookings/[id]        // Booking details
PUT    /api/bookings/[id]        // Update booking status/data
DELETE /api/bookings/[id]        // Cancel booking

// Features implemented:
// - Complete CRUD operations with Prisma integration
// - Role-based permission system (artist/host/admin)  
// - Status workflow: PENDING → APPROVED → CONFIRMED → COMPLETED
// - Door fee negotiation workflow with status tracking
// - 5-day confirmation deadline management
// - Real-time notifications on status changes
// - Comprehensive UI with collapsible details
// - Mobile-responsive booking cards
```

#### Notification System ✅ FULLY IMPLEMENTED
```typescript
GET    /api/notifications        // Fetch user notifications (paginated)
PUT    /api/notifications        // Mark notifications as read

// Features implemented:
// - Real-time notification creation on booking events
// - In-app notification bell with unread count badge
// - Notification dropdown with action links
// - Auto-polling every 30 seconds for new notifications
// - Mark individual/all notifications as read
// - Deep linking to relevant pages (booking details)
// - Integrated into header for approved/active users
```

#### Tour Planning System ✅ FULLY IMPLEMENTED
```typescript
// Tour Management CRUD
GET    /api/tour-segments         // List artist's tour segments with state ranges
POST   /api/tour-segments         // Create new tour segment with validation
GET    /api/tour-segments/[id]    // Get specific tour segment details
PUT    /api/tour-segments/[id]    // Update tour segment and state ranges
DELETE /api/tour-segments/[id]    // Delete tour segment and all ranges

// Artist Discovery by Tour Location
GET    /api/artists/discover      // Filter artists by tour state/city/dates
GET    /api/artists/[id]/tour-segments // Get public tour segments for artist

// Features implemented:
// - Complete tour planning UI in artist dashboard with modal interface
// - State-by-state tour scheduling with date ranges and cities
// - Overlap validation prevents conflicting tour dates
// - Public/private tour visibility controls
// - Tour status tracking (planned, confirmed, cancelled)
// - Host discovery of artists by location and tour dates
// - Integration with artist profiles showing upcoming tours
// - Mobile-responsive tour planning interface
// - Tour display on public artist profiles with upcoming tours section
```

### Ready for Implementation 🔄

#### Messaging System 📨 ✅ FULLY IMPLEMENTED
```typescript
// Core Messaging APIs
GET    /api/messages                      // List messages (paginated, filtered)
POST   /api/messages                      // Send new message
GET    /api/messages/[id]                 // Get single message
PUT    /api/messages/[id]                 // Update message (mark read)
DELETE /api/messages/[id]                 // Delete message (soft delete)

// Conversation Management
GET    /api/conversations                 // List user conversations
GET    /api/conversations/[id]            // Get conversation with messages
POST   /api/conversations                 // Start new conversation
PUT    /api/conversations/[id]/mark-read  // Mark all messages as read
GET    /api/conversations/unread-count    // Get total unread count

// Real-time Features
GET    /api/messages/poll                 // Poll for new messages (extend notification polling)
POST   /api/messages/typing               // Send typing indicator
GET    /api/messages/online-status        // Check user online status

// File Attachments
POST   /api/messages/upload               // Upload attachment (reuse existing upload system)

// Implementation Plan:
// Phase 1: Core messaging CRUD, conversation threading, dashboard integration
// Phase 2: Real-time updates, typing indicators, online status
// Phase 3: File attachments, search/filters, message templates
// 
// UI Components:
// - MessageInbox: Main messaging dashboard
// - ConversationList: Sidebar with active conversations
// - ConversationThread: Message display with bubbles
// - MessageComposer: Rich text input with attachments
// - UnreadBadge: Integration with existing notification system
//
// Design Guidelines:
// - French Blue (#6B8CA4): Send buttons, active conversations
// - Sage (#738a6e): Received message bubbles
// - Mist (#ebebe9): Message backgrounds
// - Sand (#d4c4a8): Sent message bubbles
// - Mobile-first responsive design essential
```

#### Fan Portal System ✅ FULLY IMPLEMENTED
```typescript
// Fan Profile Management
GET    /api/fan/profile                        // Get fan profile with subscription status
PUT    /api/fan/profile                        // Update fan profile (hometown, state, bio, genres, photo)

// Concert Discovery & RSVP Management  
GET    /api/concerts                           // Public concert discovery with filtering
GET    /api/concerts/[id]                      // Concert details page
POST   /api/rsvps                              // Create new RSVP for concert
GET    /api/rsvps/[id]                         // Get specific RSVP details
PUT    /api/rsvps/[id]                         // Update RSVP (guest count, special requests)
DELETE /api/rsvps/[id]                         // Cancel RSVP

// Fan Concert History
GET    /api/fan/concerts/upcoming              // Fan's upcoming concerts (with RSVP status)
GET    /api/fan/concerts/past                  // Fan's past concerts (available for review)

// Review System (Concert-based)
GET    /api/reviews                            // Fan's written reviews (paginated)
POST   /api/reviews                            // Create review for attended concert
PUT    /api/reviews/[id]                       // Update existing review
DELETE /api/reviews/[id]                       // Delete review

// Artist Discovery
GET    /api/artists                            // Artist directory with search/filtering
GET    /api/artists/[id]                       // Artist profile details

// Features implemented:
// - Dedicated fan dashboard with stats and quick actions
// - Fan-specific profile editing with photo upload
// - Concert browsing with advanced filtering and capacity validation
// - RSVP system with host approval workflow  
// - Concert-based review system (only for attended events)
// - Artist directory access for fan music discovery
// - Integration with existing booking/calendar system
// - Mobile-responsive design throughout
```

#### Payment & Billing Integration ✅
```typescript
// Stripe Checkout & Webhooks
POST   /api/payments/create-checkout-session  // Create Stripe checkout
POST   /api/payments/webhook                  // Stripe webhook handler (WORKING)

// Subscription Management (WORKING)
GET    /api/payments/subscription-status      // Current user subscription details
POST   /api/payments/cancel-subscription      // Cancel subscription at period end
POST   /api/payments/create-portal-session    // Stripe Customer Portal redirect

// Admin Payment APIs (WORKING)
GET    /api/admin/users                       // Users with payment status
POST   /api/admin/fix-missing-subscriptions   // Retroactive subscription fix
GET    /api/admin/finance/overview            // Revenue analytics (READY)
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

## Stripe Payment Integration ✅

### Stripe Configuration
```typescript
// Environment Variables Required
STRIPE_SECRET_KEY="sk_test_..."           // Stripe secret key
STRIPE_WEBHOOK_SECRET="whsec_..."         // Webhook endpoint secret
NEXTAUTH_URL="http://localhost:3000"      // For return URLs
```

### Payment Flow Architecture
```
User Clicks Pay → Stripe Checkout → Payment Success → Webhook → Database Update → User Activation
```

### Payment System Improvements ✅ IMPLEMENTED
**Issue**: Webhook failures in development causing user activation problems
**Solution**: Fallback activation system implemented
- `/api/payments/verify-and-activate` - Verifies Stripe payment and activates users when webhooks fail
- Payment success page enhanced with verification logic
- Handles both webhook success (production) and webhook failure (development) scenarios

### Webhook Events Handled
```typescript
// /api/payments/webhook/route.ts
'checkout.session.completed'    // Initial payment success
'invoice.payment_succeeded'     // Recurring payment success
'invoice.payment_failed'        // Payment failure handling
'customer.subscription.deleted' // Subscription cancellation
```

### Subscription Management
```typescript
// One-time payments get converted to annual subscriptions
// Stripe recurring subscriptions use actual Stripe subscription data
// Customer Portal allows payment method updates and billing history
```

### Models Integration
- **Payment**: Stores all transaction records with Stripe IDs
- **Subscription**: Tracks user subscription status and periods
- **User**: Links to stripeCustomerId for Stripe operations

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

# Stripe Payments  
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

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

# Stripe Payments (Production)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## Messaging System Architecture ✅ FULLY IMPLEMENTED

### Overview
The TourPad messaging system is designed to be the primary communication channel between artists and hosts, reducing reliance on external communication methods while maintaining platform engagement and providing admin oversight capabilities.

### System Design Principles
1. **Mobile-First**: Messaging is heavily used on mobile devices
2. **Real-time Feel**: Use polling + optimistic updates for responsive UX
3. **Booking Context**: Messages are primarily linked to bookings
4. **Privacy First**: Users only see their own conversations
5. **Admin Oversight**: Support staff can access conversations when needed

### Database Architecture

#### Key Relationships
```
User (1) -> (N) Message (as sender)
User (N) -> (N) Conversation (via participantIds[])
Booking (1) -> (N) Conversation
Conversation (1) -> (N) Message
Message (N) -> (N) User (via readBy[])
```

#### Indexing Strategy
```sql
-- Performance indexes for messaging
CREATE INDEX idx_conversation_participants ON Conversation USING GIN(participantIds);
CREATE INDEX idx_conversation_booking ON Conversation(bookingId);
CREATE INDEX idx_conversation_last_message ON Conversation(lastMessageAt DESC);
CREATE INDEX idx_message_conversation ON Message(conversationId, createdAt DESC);
CREATE INDEX idx_message_sender ON Message(senderId);
CREATE INDEX idx_message_read_by ON Message USING GIN(readBy);
```

### User Experience Flows

#### 1. Artist → Host Initial Contact
- Artist views host profile
- Clicks "Message Host" button
- Creates new conversation (no booking context)
- Sends introductory message
- Host receives notification

#### 2. Booking-Related Messaging
- During booking request: Message attached to booking
- After approval: Continue conversation in booking context
- Pre-show coordination: Logistics, technical requirements
- Post-show: Thank you messages, future planning

#### 3. Message Discovery
- Dashboard: Messages tab with unread count badge
- Booking cards: Quick "Message" button
- Notifications: New message alerts via bell icon
- Search: Find messages by content or participant

### Technical Implementation Details

#### API Response Formats
```typescript
// Conversation List Response
interface ConversationListResponse {
  conversations: {
    id: string;
    subject?: string;
    lastMessage?: {
      content: string;
      senderId: string;
      createdAt: string;
    };
    participants: {
      id: string;
      name: string;
      profileImageUrl?: string;
      userType: UserType;
    }[];
    booking?: {
      id: string;
      requestedDate: string;
      status: BookingStatus;
    };
    unreadCount: number;
    lastMessageAt: string;
  }[];
  total: number;
  page: number;
  pageSize: number;
}

// Message Thread Response
interface MessageThreadResponse {
  conversation: {
    id: string;
    subject?: string;
    participants: User[];
    booking?: Booking;
  };
  messages: {
    id: string;
    content: string;
    senderId: string;
    sender: {
      name: string;
      profileImageUrl?: string;
    };
    messageType: MessageType;
    readBy: string[];
    createdAt: string;
  }[];
  hasMore: boolean;
  nextCursor?: string;
}
```

#### Real-time Updates
```typescript
// Extend existing notification polling
const MessagePolling = {
  interval: 30000, // 30 seconds, same as notifications
  
  endpoints: [
    '/api/notifications?unread=true',
    '/api/conversations/unread-count',
    '/api/messages/new?since={lastCheck}'
  ],
  
  // Optimistic updates for sent messages
  optimisticSend: (message) => {
    // Add to UI immediately
    // Mark with pending status
    // Update when server confirms
  }
};
```

#### Security & Privacy
```typescript
// Message access control
const canAccessMessage = async (userId: string, messageId: string) => {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { conversation: true }
  });
  
  return message?.conversation.participantIds.includes(userId) || 
         isAdmin(userId);
};

// Conversation access control
const canAccessConversation = async (userId: string, conversationId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId }
  });
  
  return conversation?.participantIds.includes(userId) || 
         isAdmin(userId);
};
```

### UI Component Architecture

#### Component Hierarchy
```
MessagesDashboard
├── ConversationList
│   ├── ConversationSearch
│   ├── ConversationFilters
│   └── ConversationItem[]
├── ConversationThread
│   ├── ConversationHeader
│   ├── MessageList
│   │   └── MessageBubble[]
│   └── MessageComposer
│       ├── TextInput
│       ├── AttachmentButton
│       └── SendButton
└── EmptyState
```

#### Mobile Responsive Breakpoints
- Mobile: < 640px (single column, full screen thread)
- Tablet: 640px - 1024px (collapsible sidebar)
- Desktop: > 1024px (persistent sidebar, 1/3 + 2/3 layout)

### Integration Points

#### 1. Booking System
- "Message Host/Artist" buttons on booking cards
- Automatic conversation creation for new bookings
- Booking status updates create system messages

#### 2. Notification System
- New message notifications via existing bell icon
- Mark messages as read when viewed
- Deep links to specific conversations

#### 3. User Profiles
- "Send Message" button on public profiles
- Message history in user dashboard
- Online/offline status indicators

#### 4. Admin Dashboard
- View all conversations for support
- Flag/moderate inappropriate content
- Export conversation history

### Performance Optimizations

#### 1. Message Pagination
```typescript
// Cursor-based pagination for infinite scroll
const getMessages = async (conversationId: string, cursor?: string) => {
  const pageSize = 50;
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      ...(cursor && { createdAt: { lt: new Date(cursor) } })
    },
    orderBy: { createdAt: 'desc' },
    take: pageSize + 1,
    include: { sender: true }
  });
  
  const hasMore = messages.length > pageSize;
  return {
    messages: messages.slice(0, pageSize),
    nextCursor: hasMore ? messages[pageSize].createdAt : null
  };
};
```

#### 2. Conversation List Optimization
- Denormalized lastMessageAt for sorting
- Cached unread counts
- Lazy load participant details

#### 3. Real-time Optimization
- Debounced typing indicators
- Batched read receipts
- Connection pooling for database

### Migration Strategy

#### Phase 1: Foundation (Week 1)
- Create API routes and database queries
- Build basic UI components
- Integrate with authentication

#### Phase 2: Enhancement (Week 2)
- Add real-time updates
- Implement file attachments
- Add search and filters

#### Phase 3: Polish (Week 3)
- Mobile responsive design
- Performance optimization
- Admin tools and moderation

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

## Profile Image System ✅ FULLY IMPLEMENTED

### Overview
The Profile Image System provides intelligent resolution of user profile photos with comprehensive fallback chains, ensuring users always see appropriate images in messaging and throughout the platform.

### Implementation Details

#### Core Utility (`/src/lib/profileImageUtils.ts`)
```typescript
export function resolveProfileImageUrl(user: any): string | null
```

**Resolution Priority for Artists:**
1. `ArtistMedia` with category 'profile' (uploaded press photos)
2. `UserProfile.profileImageUrl` (profile-specific image)
3. `Artist.pressPhotoUrl` (legacy press photo field)
4. `User.profileImageUrl` (basic user profile image)
5. Mock data fallback for development

**Resolution Priority for Hosts:**
1. `UserProfile.profileImageUrl` (personal host photo - NOT venue photo)
2. `User.profileImageUrl` (basic user profile image)  
3. Mock data fallback for development

#### ProfileImage Component (`/src/components/ui/ProfileImage.tsx`)
- **Auto-resolution**: Uses `resolveProfileImageUrl()` utility
- **Error handling**: Automatic fallback to user icon on image load errors
- **Responsive sizing**: `sm` (32px), `md` (40px), `lg` (48px)
- **Consistent styling**: Circular images with proper object-fit

#### Database Integration
- **Extended API queries**: All messaging APIs include necessary relations
- **Case normalization**: Handles `'ARTIST'`/`'HOST'` vs `'artist'`/`'host'`
- **Type inference**: Auto-detects user type from available data when missing
- **Admin access**: Full profile data access for oversight capabilities

#### Integration Points
- **Messaging System**: All conversation lists, headers, and message bubbles
- **Admin Panel**: Complete profile photo display in admin messaging oversight
- **Dashboard Components**: Ready for expansion to other profile displays

### Technical Benefits
- **Performance**: Single utility handles all profile image logic
- **Consistency**: Same resolution logic across all components
- **Reliability**: Multiple fallback levels prevent broken image states
- **Maintainability**: Centralized logic in single utility file
- **Scalability**: Easy to extend for additional user types or image sources

---

## Artist Profile System Enhancements ✅ IMPLEMENTED

### Application Data Integration
**Issue**: Artist profile data not properly flowing from application to dashboard/profile
**Solutions Implemented**:

#### 1. Profile Photo Fallback System ✅
- **Hero Image Logic**: Falls back to first application photo when no Press Photo set
- **API Integration**: Both `/api/profile` and `/api/artists/[id]` include fallback logic
- **Priority Order**: Press Photo → First Application Photo → Gradient background

#### 2. Performance Video Integration ✅  
- **Application Video Sync**: Performance videos from applications automatically appear in dashboard
- **Smart Fallback**: Creates default video object when no custom videos exist
- **API Enhancement**: Enhanced video title formatting: `{Band Name}: Live Performance`
- **YouTube URL Parsing**: Robust URL parsing handles various YouTube formats and parameters

#### 3. Profile Data Mapping Fixes ✅
- **Band Name Correction**: Fixed applicant name vs band name mapping in profile API
- **User Type Detection**: Enhanced case-insensitive user type handling (`'artist'` vs `'ARTIST'`)
- **Profile Save Functionality**: Resolved profile edit save issues with proper user type checking

#### 4. UI/UX Improvements ✅
- **Instruments Section**: Enhanced with custom instrument input and proper plural/singular grammar
- **Video Embed**: Fixed YouTube embed URLs with proper video ID extraction
- **Profile Layout**: Improved artist profile sections with better content hierarchy

### Technical Implementation
```typescript
// Hero image with application photo fallback
{artistData.profileImageUrl ? (
  <img src={artistData.profileImageUrl} />
) : artistData.photos?.[0]?.fileUrl ? (
  <img src={artistData.photos[0].fileUrl} />
) : (
  <div className="gradient-background" />
)}

// Performance video integration
videoLinks: (() => {
  let videos = artist.videoLinks || [];
  if (videos.length === 0 && artist.performanceVideoUrl) {
    videos = [{
      id: 'application-video',
      title: `${artist.stageName || artist.user.name}: Live Performance`,
      url: artist.performanceVideoUrl,
      isLivePerformance: true
    }];
  }
  return videos;
})()
```

---

## Tour Planning System Architecture ✅ FULLY IMPLEMENTED

### Overview
The Tour Planning System enables artists to plan their touring schedules by state and date ranges, allowing hosts to discover artists when they're touring in their area. This creates a foundation for the host-artist discovery workflow.

### Core Architecture Decisions

#### 1. Hierarchical Tour Structure
```
TourSegment (e.g., "Southwest Spring 2025")
├── TourStateRange (Colorado: March 1-15)
├── TourStateRange (Utah: March 16-30)
└── TourStateRange (Arizona: April 1-10)
```

#### 2. State-Based Geographic Organization
- Uses US state abbreviations ("CO", "UT", "AZ") for consistent filtering
- Optional cities array within each state for granular location data
- Supports overlapping validation within artist's tour schedule

#### 3. Public/Private Tour Visibility
- Artists control tour visibility with `isPublic` boolean
- Private tours allow planning without host discovery
- Only public tours appear in host discovery results

#### 4. Database Design Benefits
- **Normalization**: Separate TourSegment and TourStateRange models prevent data duplication
- **Flexibility**: Artists can have multiple concurrent tour segments
- **Scalability**: State-based partitioning enables efficient geographic queries
- **Validation**: Database constraints prevent overlapping date ranges within states

### Integration Points

#### 1. Artist Discovery API (`/api/artists/discover`)
- Filters artists by state, city, and date ranges
- Deduplicates artists while preserving all matching tour ranges
- Supports genre filtering combined with tour location/dates
- Returns paginated results with tour context

#### 2. Artist Dashboard
- Modal-based tour creation/editing interface
- Real-time overlap validation before submission
- Visual tour calendar representation
- Bulk tour operations (edit, delete, status changes)

#### 3. Artist Profiles
- Upcoming tours section displays next 12 months
- Tour cards show state, dates, cities, and tour notes
- Coming soon indicators for tours within 30 days
- Mobile-responsive tour display grid

### Technical Implementation Highlights

#### 1. API Validation
- Start/end date logical validation
- State overlap prevention within artist schedules
- Required field validation with descriptive error messages
- Atomic operations ensure data consistency

#### 2. Query Optimization
- Efficient geographic filtering using state-based indexes
- Date range queries optimized for tour discovery
- Relationship-based queries minimize N+1 problems
- Pagination support for large result sets

#### 3. UI/UX Design
- Progressive disclosure: tour list → edit modal → state details
- Mobile-first responsive design throughout
- Optimistic updates for smooth user experience
- Visual feedback for validation errors and success states

### Future Enhancement Opportunities
- Real-time tour notifications when artists plan tours in host areas
- Tour route optimization suggestions
- Integration with mapping services for geographic visualization
- Automated booking suggestions based on tour schedules

---

## Key Development Notes for Future Claude Agents

### Database ID System 🚨 CRITICAL
- **Seeded Data Uses Prisma IDs**: All database records use auto-generated IDs like `cmdm2rrs50004luune9mx0t5h`
- **Mock Data Uses Simple IDs**: Mock data in `mockData.ts` uses simple IDs like "1", "2", "3"
- **URL Routing**: Artist profiles must use database IDs, not mock IDs
- **Correct Artist URLs**: Use `/artists/{prismaId}` not `/artists/1`
- **Example Working URL**: `/artists/cmdm2rrs50004luune9mx0t5h` (Sarah Johnson with both Spotify + SoundCloud)

### SoundCloud Integration Testing
- **Sarah Johnson**: ID `cmdm2rrs50004luune9mx0t5h` - Has both Spotify AND SoundCloud verified
- **Tommy Blue**: ID `cmdm2rrsc0008luunqqflm6z8` - Has SoundCloud only
- **API Testing**: Always use database IDs when testing APIs
- **Mock Data Fallback**: SoundCloud service automatically falls back to mock data when credentials unavailable

### Data Flow Architecture
```
Mock Data (simple IDs) → Development/UI Testing
Database Data (Prisma IDs) → Production/API Integration
API Routes → Always expect and return database IDs
Artist Profiles → Must use database IDs for proper data loading
```

### Working SoundCloud Integration Features
- ✅ Database schema with Artist model SoundCloud fields
- ✅ API routes for search, sync, and disconnect operations
- ✅ SoundCloudConnectionCard component in artist dashboard
- ✅ EnhancedArtistMusicSection supports both platforms simultaneously
- ✅ Mock data system for development without SoundCloud API credentials
- ✅ Unified audio playback supporting both Spotify previews and SoundCloud streams
- ✅ Orange theming for SoundCloud platform (vs green for Spotify)

### Testing URLs for Claude Agents
- **Sarah Johnson (Both Platforms)**: `http://localhost:3001/artists/cmdm2rrs50004luune9mx0t5h`
- **Marcus Williams Trio**: `http://localhost:3001/artists/cmdm2rrsc0008luunqqflm6z8`
- **Luna Martinez**: `http://localhost:3001/artists/cmdm2rrse000cluunb17hgmb0`
- **Artist Discovery**: `http://localhost:3001/artists`
- **Dashboard**: `http://localhost:3001/dashboard` (requires authentication)

---

*This architecture document is optimized for future Claude agents and contains complete implementation details for TourPad's dual music platform integration system.*