# TourPad API Endpoints - Complete Reference

## Overview
This document maps all 65 API endpoints in TourPad, showing their purposes, parameters, return values, and frontend integrations.

## Quick Navigation
- [Authentication APIs](#authentication-apis)
- [User Management APIs](#user-management-apis)
- [Profile & Media APIs](#profile--media-apis)
- [Booking & Concert APIs](#booking--concert-apis)
- [Messaging APIs](#messaging-apis)
- [Payment & Subscription APIs](#payment--subscription-apis)
- [Admin APIs](#admin-apis)
- [Music Platform APIs](#music-platform-apis)
- [Geographic & Discovery APIs](#geographic--discovery-apis)
- [Real-time & Utility APIs](#real-time--utility-apis)

---

## Authentication APIs

### `/api/auth/[...nextauth]` - NextAuth Integration
**Methods:** `GET`, `POST`
**Purpose:** Handle Google OAuth authentication flow
**Frontend Integration:** All protected routes, login/logout functionality

**Key Flows:**
- `GET /api/auth/signin` → Login page integration
- `POST /api/auth/signin` → Authentication processing
- `GET /api/auth/signout` → Logout functionality
- `GET /api/auth/session` → Session validation

**Frontend Pages:**
- `/login` - Uses signin endpoint
- Header component - Session management
- All protected routes - Session validation

### `/api/auth/register` - User Registration
**Methods:** `POST`
**Purpose:** Create new user accounts with type selection
**Parameters:**
```typescript
{
  name: string,
  email: string,
  userType: 'ARTIST' | 'HOST' | 'FAN',
  password?: string // Optional for OAuth
}
```

**Response:**
```typescript
{
  success: boolean,
  user: User,
  redirectTo: string // Next step in journey
}
```

**Frontend Integration:** `/register` page

---

## User Management APIs

### `/api/users` - User Directory
**Methods:** `GET`
**Purpose:** Retrieve user listings with filtering and pagination
**Query Parameters:**
- `type`: Filter by user type
- `status`: Filter by user status
- `search`: Text search
- `page`: Pagination
- `limit`: Results per page

**Frontend Integration:**
- `/admin/users` - Admin user management
- Browse pages for user discovery

### `/api/users/[id]` - Individual User Details
**Methods:** `GET`, `PUT`, `DELETE`
**Purpose:** CRUD operations for specific users
**Frontend Integration:** User profile pages, admin user management

### `/api/user/current` - Current User Information
**Methods:** `GET`
**Purpose:** Get detailed current user data with role-specific information
**Response Includes:**
- Basic user data
- Role-specific profile (Artist/Host/Fan)
- Subscription status
- Preferences and settings

**Frontend Integration:**
- Dashboard routing logic
- Profile initialization
- Permission checks

### `/api/user/profile-id` - Profile ID Mapping
**Methods:** `GET`
**Purpose:** Map user IDs to profile URLs for dynamic routing
**Frontend Integration:** Dynamic profile links and navigation

---

## Profile & Media APIs

### `/api/profile` - Profile Management
**Methods:** `GET`, `PUT`
**Purpose:** Main profile management endpoint for all user types

**GET Response Structure:**
```typescript
{
  user: User,
  artist?: Artist & { media: ArtistMedia[] },
  host?: Host & { media: HostMedia[] },
  fan?: Fan,
  photos: MediaFile[]
}
```

**PUT Parameters:** Role-specific profile updates

**Frontend Integration:**
- `/dashboard/profile` - Main profile editing
- All dashboard pages - Profile data display

### `/api/upload` - File Upload System
**Methods:** `POST`
**Purpose:** Handle file uploads with authentication and validation
**Parameters:**
```typescript
FormData {
  file: File,
  type: 'profile' | 'venue' | 'media' | 'document'
}
```

**Features:**
- File type validation (JPEG, PNG, WebP)
- Size limits (5MB general, 10MB for audio)
- Authentication required
- Automatic file naming and storage

**Frontend Integration:**
- All profile pages with image upload
- Media galleries
- File attachment in messaging

### `/api/upload/mp3` - Audio File Upload
**Methods:** `POST`
**Purpose:** Specialized endpoint for audio file uploads
**Validation:** MP3 format, artist ownership, metadata extraction

**Frontend Integration:** Artist music upload in dashboard

---

## Booking & Concert APIs

### `/api/bookings` - Booking Management
**Methods:** `GET`, `POST`
**Purpose:** Core booking system functionality

**GET Response:** Paginated booking list with filters
**POST Parameters:**
```typescript
{
  hostId: string,
  requestedDate: Date,
  requestedTime?: Date,
  estimatedDuration?: number,
  expectedAttendance?: number,
  doorFee?: number,
  artistMessage?: string,
  lodgingRequested?: boolean
}
```

**Frontend Integration:**
- `/dashboard/bookings` - Booking management
- `/bookings/new` - Create new bookings
- Booking cards and lists throughout app

### `/api/bookings/[id]` - Individual Booking
**Methods:** `GET`, `PUT`, `DELETE`
**Purpose:** Detailed booking management

**Status Workflow:**
- `PENDING` → Host review
- `APPROVED` → Artist confirmation (5-day window)
- `CONFIRMED` → Show scheduled
- `COMPLETED` → Post-show processing
- `CANCELLED` → Cancellation handling

**Frontend Integration:**
- `/bookings/[id]` - Booking detail pages
- Dashboard booking lists
- Notification system

### `/api/concerts` - Concert Listings
**Methods:** `GET`, `POST`
**Purpose:** Public concert discovery and management

**GET Parameters:**
- Location filtering
- Date range
- Genre filtering
- Availability status

**Frontend Integration:**
- `/concerts` - Public concert browsing
- `/dashboard/fan` - Fan concert discovery
- Calendar integrations

### `/api/rsvps` - RSVP Management
**Methods:** `GET`, `POST`
**Purpose:** Fan RSVP system for concerts

**POST Parameters:**
```typescript
{
  concertId: string,
  guestsCount: number,
  specialRequests?: string
}
```

**Frontend Integration:**
- Concert detail pages
- Fan dashboard
- Host RSVP management

### `/api/rsvps/[id]` - Individual RSVP
**Methods:** `GET`, `PUT`, `DELETE`
**Purpose:** RSVP detail management

**Status Options:**
- `PENDING` → Host review
- `APPROVED` → Attendance confirmed
- `DECLINED` → Request denied
- `WAITLISTED` → Pending capacity

---

## Messaging APIs

### `/api/messages` - Message System
**Methods:** `GET`, `POST`
**Purpose:** Core messaging functionality

**GET Parameters:**
- `conversationId`: Filter by conversation
- `since`: Timestamp for polling
- `limit`: Pagination

**POST Parameters:**
```typescript
{
  conversationId: string,
  content: string,
  messageType: 'TEXT' | 'ATTACHMENT' | 'SYSTEM',
  attachmentUrl?: string
}
```

**Frontend Integration:**
- `/dashboard/messages` - Main messaging interface
- `/admin/messages` - Admin message oversight
- Real-time polling system

### `/api/conversations` - Conversation Management
**Methods:** `GET`, `POST`
**Purpose:** Conversation thread management

**POST Parameters:**
```typescript
{
  participantIds: string[],
  subject?: string,
  bookingId?: string
}
```

**Frontend Integration:**
- Message thread creation
- Conversation listing
- Booking-related messaging

### `/api/conversations/[id]` - Individual Conversation
**Methods:** `GET`, `PUT`
**Purpose:** Conversation details and management

**Features:**
- Message history
- Participant management
- Read status tracking
- Message search

### `/api/messages/poll` - Real-time Message Polling
**Methods:** `GET`
**Purpose:** Safe polling for new messages with rate limiting

**Response:**
```typescript
{
  newMessages: Message[],
  unreadCount: number,
  lastCheck: Date
}
```

**Frontend Integration:** Real-time messaging updates (30-second intervals)

### `/api/messages/typing` - Typing Indicators
**Methods:** `POST`
**Purpose:** Real-time typing status updates

### `/api/messages/online-status` - User Presence
**Methods:** `GET`
**Purpose:** Track user online/offline status

---

## Payment & Subscription APIs

### `/api/payments/create-checkout-session` - Stripe Checkout
**Methods:** `POST`
**Purpose:** Create Stripe checkout sessions for memberships

**Parameters:**
```typescript
{
  priceId: string, // Artist: $400/year, Fan: $10/month
  userType: 'ARTIST' | 'FAN',
  successUrl: string,
  cancelUrl: string
}
```

**Frontend Integration:**
- `/payment/artist` - Artist membership payment
- `/payment/fan` - Fan subscription payment

### `/api/payments/webhook` - Stripe Webhooks
**Methods:** `POST`
**Purpose:** Handle Stripe payment events

**Events Processed:**
- `checkout.session.completed` → User activation
- `invoice.payment_succeeded` → Subscription renewal
- `invoice.payment_failed` → Payment failure handling
- `customer.subscription.deleted` → Cancellation processing

**System Integration:** Automatic user status updates, payment record creation

### `/api/payments/subscription-status` - Subscription Details
**Methods:** `GET`
**Purpose:** Get current user subscription information

**Response:**
```typescript
{
  status: 'active' | 'expired' | 'cancelled',
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: boolean,
  subscriptionId: string
}
```

**Frontend Integration:** Subscription management pages, payment status displays

### `/api/payments/cancel-subscription` - Cancel Subscription
**Methods:** `POST`
**Purpose:** Cancel recurring subscriptions

### `/api/payments/create-portal-session` - Billing Portal
**Methods:** `POST`
**Purpose:** Create Stripe customer portal sessions for billing management

### `/api/payments/verify-and-activate` - Payment Verification
**Methods:** `POST`
**Purpose:** Fallback activation for webhook failures in development

---

## Admin APIs

### `/api/admin/applications` - Application Management
**Methods:** `GET`
**Purpose:** Retrieve pending user applications for review

**Response Structure:**
```typescript
{
  applications: Array<{
    user: User,
    artist?: Artist & { media: ArtistMedia[] },
    host?: Host & { media: HostMedia[] },
    submittedAt: Date,
    type: 'ARTIST' | 'HOST'
  }>,
  total: number
}
```

**Frontend Integration:** `/admin/applications` - Application review interface

### `/api/admin/applications/[userId]/approve` - Approve Application
**Methods:** `POST`
**Purpose:** Approve pending user applications

**Parameters:**
```typescript
{
  userId: string,
  adminNotes?: string
}
```

**Status Updates:**
- Artists: `PENDING` → `APPROVED` (payment required)
- Hosts: `PENDING` → `ACTIVE` (immediate access)

### `/api/admin/applications/[userId]/reject` - Reject Application
**Methods:** `POST`
**Purpose:** Reject user applications with reason

**Parameters:**
```typescript
{
  userId: string,
  reason: string,
  adminNotes?: string
}
```

### `/api/admin/metrics` - Platform Metrics
**Methods:** `GET`
**Purpose:** Real-time platform statistics

**Response:**
```typescript
{
  pendingApplications: number,
  totalUsers: number,
  activeBookings: number,
  revenue: {
    monthly: number,
    total: number
  },
  userBreakdown: {
    artists: number,
    hosts: number,
    fans: number
  }
}
```

**Frontend Integration:** Admin dashboard overview

### `/api/admin/users` - User Management
**Methods:** `GET`, `PUT`
**Purpose:** Admin user account management

**Capabilities:**
- Status changes
- User suspension/reactivation
- Account merging
- Data export

### `/api/admin/finance/overview` - Financial Analytics
**Methods:** `GET`
**Purpose:** Revenue and financial reporting

**Response:**
```typescript
{
  monthlyRevenue: number,
  totalRevenue: number,
  subscriptionMetrics: {
    active: number,
    cancelled: number,
    failed: number
  },
  paymentBreakdown: {
    artists: number,
    fans: number
  }
}
```

**Frontend Integration:** `/admin/finance` - Financial dashboard

### `/api/admin/finance/export` - Financial Data Export
**Methods:** `GET`
**Purpose:** Export financial data for accounting

### `/api/admin/fix-missing-subscriptions` - Data Repair
**Methods:** `POST`
**Purpose:** Fix subscription data inconsistencies

---

## Music Platform APIs

### Spotify Integration

#### `/api/spotify/artist/[artistId]` - Artist Spotify Data
**Methods:** `GET`
**Purpose:** Retrieve cached Spotify data for artist

**Response:**
```typescript
{
  artist: SpotifyArtist,
  albums: SpotifyAlbum[],
  tracks: SpotifyTrack[]
}
```

#### `/api/spotify/artist/[artistId]/sync` - Sync Spotify Data
**Methods:** `POST`
**Purpose:** Force sync artist data from Spotify API

**Process:**
1. Authenticate with Spotify
2. Search for artist
3. Fetch albums and tracks
4. Update local database
5. Cache results

#### `/api/spotify/search` - Spotify Artist Search
**Methods:** `POST`
**Purpose:** Search Spotify for artists during profile setup

**Parameters:**
```typescript
{
  query: string,
  limit?: number
}
```

#### `/api/spotify/health` - Spotify API Health
**Methods:** `GET`
**Purpose:** Check Spotify API connectivity and rate limits

**Frontend Integration:**
- `/dashboard/music` - Spotify connection interface
- Artist profile music sections
- Admin Spotify management

### SoundCloud Integration

#### `/api/soundcloud/artist/[artistId]` - SoundCloud Data
**Methods:** `GET`
**Purpose:** Retrieve cached SoundCloud data for artist

#### `/api/soundcloud/artist/[artistId]/sync` - Sync SoundCloud
**Methods:** `POST`
**Purpose:** Sync artist data from SoundCloud API

#### `/api/soundcloud/search` - SoundCloud Search
**Methods:** `POST`
**Purpose:** Search SoundCloud for artists

#### `/api/soundcloud/health` - SoundCloud Health Check
**Methods:** `GET`
**Purpose:** Check SoundCloud API status

**Note:** SoundCloud integration includes mock data fallback for development

### Uploaded Track Management

#### `/api/artists/[id]/uploaded-tracks` - Direct Music Uploads
**Methods:** `GET`, `POST`, `DELETE`
**Purpose:** Manage directly uploaded MP3 files

**Features:**
- Metadata extraction
- Duration calculation
- Artist ownership validation
- File storage management

---

## Geographic & Discovery APIs

### `/api/hosts` - Host Directory
**Methods:** `GET`
**Purpose:** Host discovery with geographic and preference filtering

**Query Parameters:**
- `search`: Text search
- `genres`: Genre filtering
- `location`: Geographic filtering
- `capacity`: Venue size filtering
- `lodging`: Lodging availability

**Response:**
```typescript
{
  hosts: Array<{
    id: string,
    venueName: string,
    location: string,
    capacity: number,
    photos: HostMedia[],
    preferredGenres: string[],
    lodgingAvailable: boolean
  }>,
  total: number
}
```

**Frontend Integration:**
- `/hosts` - Host browse page
- Host discovery for artists
- Geographic search

### `/api/hosts/[id]` - Individual Host Profile
**Methods:** `GET`
**Purpose:** Detailed host/venue information

**Response Includes:**
- Complete venue details
- Photo galleries
- Musical preferences
- Lodging information
- Location map data
- Reviews and ratings

**Frontend Integration:** `/hosts/[id]` - Host profile pages

### `/api/artists` - Artist Directory
**Methods:** `GET`
**Purpose:** Artist discovery with tour and genre filtering

**Query Parameters:**
- `search`: Text search
- `genres`: Musical genres
- `location`: Tour locations
- `dates`: Tour date ranges
- `verified`: Spotify/SoundCloud verification

**Frontend Integration:**
- `/artists` - Artist browse page
- Artist discovery for hosts and fans

### `/api/artists/[id]` - Individual Artist Profile
**Methods:** `GET`
**Purpose:** Complete artist profile information

**Response Includes:**
- Artist biography and details
- Music integration (Spotify/SoundCloud/uploads)
- Photo and video galleries
- Tour schedules
- Booking information
- Reviews and ratings

**Frontend Integration:** `/artists/[id]` - Artist profile pages

### `/api/artists/discover` - Smart Artist Discovery
**Methods:** `GET`
**Purpose:** Discover artists by tour location and dates

**Parameters:**
- `state`: US state code
- `city`: City name (optional)
- `startDate`: Date range start
- `endDate`: Date range end
- `genres`: Genre preferences

**Use Case:** Hosts finding artists touring in their area

### `/api/map/hosts` - Map Data for Hosts
**Methods:** `GET`
**Purpose:** Geographic data for map visualization

**Response:**
```typescript
{
  hosts: Array<{
    id: string,
    venueName: string,
    displayLat: number, // Privacy-obfuscated coordinates
    displayLng: number,
    capacity: number,
    genres: string[]
  }>
}
```

### `/api/map/shows` - Map Data for Concerts
**Methods:** `GET`
**Purpose:** Geographic concert data for map display

---

## Real-time & Utility APIs

### `/api/notifications` - Notification System
**Methods:** `GET`, `PUT`
**Purpose:** User notification management

**GET Response:**
```typescript
{
  notifications: Array<{
    id: string,
    type: 'BOOKING' | 'MESSAGE' | 'PAYMENT' | 'SYSTEM',
    title: string,
    message: string,
    isRead: boolean,
    actionUrl?: string,
    createdAt: Date
  }>,
  unreadCount: number
}
```

**PUT Parameters:** Mark notifications as read

**Frontend Integration:**
- Header notification bell
- Dashboard notification centers
- Real-time notification updates

### `/api/calendar/events` - Calendar Integration
**Methods:** `GET`
**Purpose:** User-specific calendar data

**Response:** Events formatted for calendar components

**Frontend Integration:** `/calendar` - Calendar view

### `/api/tour-segments` - Tour Planning
**Methods:** `GET`, `POST`
**Purpose:** Artist tour planning and management

**POST Parameters:**
```typescript
{
  name: string,
  description?: string,
  isPublic: boolean,
  stateRanges: Array<{
    state: string,
    startDate: Date,
    endDate: Date,
    cities?: string[],
    notes?: string
  }>
}
```

**Frontend Integration:** `/dashboard/tour-planner` - Tour planning interface

### `/api/tour-segments/[id]` - Individual Tour Management
**Methods:** `GET`, `PUT`, `DELETE`
**Purpose:** Manage specific tour segments

**Features:**
- Date validation
- Overlap prevention
- Public/private visibility
- State-by-state scheduling

### `/api/artists/[id]/tour-segments` - Artist Tour Public View
**Methods:** `GET`
**Purpose:** Public tour information for artist profiles

**Frontend Integration:** Artist profile tour sections

### `/api/reviews` - Review System
**Methods:** `GET`, `POST`
**Purpose:** Concert and user review management

**POST Parameters:**
```typescript
{
  bookingId: string,
  rating: number, // 1-5 stars
  reviewText?: string,
  isPublic: boolean
}
```

**Frontend Integration:**
- Post-concert review forms
- Review displays on profiles
- Review management dashboards

### `/api/reviews/[id]` - Individual Review
**Methods:** `GET`, `PUT`, `DELETE`
**Purpose:** Review detail management

### `/api/stats` - Public Statistics
**Methods:** `GET`
**Purpose:** Public platform statistics for marketing

**Response:**
```typescript
{
  totalConcerts: number,
  totalArtists: number,
  totalHosts: number,
  totalFans: number,
  citiesServed: number
}
```

**Frontend Integration:** Landing page statistics

### `/api/events` - Event Management
**Methods:** `GET`, `POST`
**Purpose:** General event system for calendar integration

### `/api/shows` - Show Listings
**Methods:** `GET`
**Purpose:** Legacy show listing endpoint

---

## Development & Testing APIs

### `/api/test-session` - Session Testing
**Methods:** `GET`
**Purpose:** Development session debugging

### `/api/test-admin` - Admin Testing
**Methods:** `GET`
**Purpose:** Admin functionality testing

### `/api/debug/create-artist-profile` - Profile Testing
**Methods:** `POST`
**Purpose:** Development profile creation

### `/api/debug/check-artist` - Artist Data Debugging
**Methods:** `GET`
**Purpose:** Debug artist data relationships

### `/api/debug/artist-info` - Artist Information Debug
**Methods:** `GET`
**Purpose:** Detailed artist data debugging

---

## File Serving APIs

### `/api/files/[...path]` - File Serving
**Methods:** `GET`
**Purpose:** Serve uploaded files with proper headers

**Features:**
- Content-Type detection
- Caching headers
- Security validation
- Performance optimization

**Frontend Integration:** All image and file displays throughout the app

---

## API Integration Patterns

### Authentication Flow
```typescript
// Every protected API call
const response = await fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Error Handling Pattern
```typescript
// Standard error response format
{
  success: false,
  error: string,
  code?: string,
  details?: any
}
```

### Pagination Pattern
```typescript
// Standard pagination response
{
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

### Real-time Updates
```typescript
// Polling pattern used throughout app
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await fetch('/api/messages/poll');
    // Update UI with new data
  }, 30000); // 30-second intervals

  return () => clearInterval(interval);
}, []);
```

---

## Security & Rate Limiting

### Authentication Requirements
- **Public APIs:** `/api/stats`, `/api/events` (public events)
- **User APIs:** Require valid session
- **Admin APIs:** Require admin role
- **File APIs:** Require ownership validation

### Rate Limiting
- **Message Polling:** 30-second minimum intervals
- **File Uploads:** Size and type validation
- **Search APIs:** Debounced on frontend
- **Payment APIs:** Stripe-managed rate limiting

### Data Privacy
- **User Data:** Owner-only access
- **Admin Access:** Read-only for oversight
- **Geographic Data:** Obfuscated coordinates for privacy
- **Message System:** Encrypted and secure

---

This comprehensive API documentation shows how all 65 endpoints work together to create the complete TourPad platform experience, from user registration through active community participation.