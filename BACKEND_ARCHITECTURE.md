# TourPad Backend Architecture Plan

## Overview
Comprehensive backend system design for TourPad's house concert platform, supporting artists, hosts, fans, and admin users with gated access control, payments, and real-time features.

## Architecture Decision Summary

### Technology Stack Selection

#### Core Backend
- **Framework**: Next.js 15 API Routes (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with multiple providers
- **File Storage**: AWS S3 + CloudFront CDN
- **Payments**: Stripe Connect for multi-party payments
- **Real-time**: Pusher or WebSockets for live updates
- **Email**: SendGrid for transactional emails

#### Infrastructure
- **Hosting**: Vercel for frontend + API routes
- **Database**: Railway PostgreSQL (dev) → AWS RDS (prod)
- **Cache**: Redis for session/query caching
- **Monitoring**: Sentry for error tracking
- **Analytics**: PostHog for user behavior

### Architecture Rationale

#### Why Next.js API Routes?
- **Unified Stack**: Single deployment, shared types
- **Edge Functions**: Global performance with Vercel
- **Serverless**: Auto-scaling, pay-per-use
- **Type Safety**: Full-stack TypeScript integration

#### Why PostgreSQL + Prisma?
- **Relational Data**: Complex booking relationships
- **ACID Compliance**: Financial transactions
- **Type Safety**: Prisma generates TypeScript types
- **Migrations**: Version-controlled schema changes

#### Why Stripe Connect?
- **Multi-party Payments**: Artist fees, host payouts
- **Compliance**: PCI DSS handled by Stripe
- **Global**: International payment processing
- **Integration**: Existing TourPad Stripe setup

---

## Database Schema Design

### User Management Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  profile_image_url TEXT,
  user_type user_type_enum NOT NULL, -- 'artist', 'host', 'fan', 'admin'
  status user_status_enum NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'active', 'suspended', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- OAuth fields
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  
  -- Verification
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  
  -- Metadata
  referral_source VARCHAR(100),
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE
);
```

#### user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  location VARCHAR(255),
  phone VARCHAR(20),
  website_url TEXT,
  
  -- Social links
  social_links JSONB, -- {instagram, facebook, twitter, youtube, spotify, etc}
  
  -- Preferences
  preferences JSONB, -- {notifications, privacy, etc}
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Artist-Specific Tables

#### artists
```sql
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stage_name VARCHAR(255),
  genres TEXT[], -- Array of genre strings
  
  -- Performance details
  typical_set_length INTEGER, -- minutes
  equipment_needs TEXT[],
  travel_radius INTEGER, -- miles
  
  -- Media
  press_photo_url TEXT,
  performance_video_url TEXT,
  music_samples JSONB, -- Array of {title, url, platform}
  
  -- Booking preferences
  min_guarantee INTEGER, -- dollars
  preferred_booking_advance INTEGER, -- days
  
  -- Verification
  application_submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### artist_media
```sql
CREATE TABLE artist_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  media_type media_type_enum NOT NULL, -- 'photo', 'video', 'audio'
  category VARCHAR(50), -- 'performance', 'promo', 'band', 'press'
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Host-Specific Tables

#### hosts
```sql
CREATE TABLE hosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_name VARCHAR(255),
  venue_type venue_type_enum NOT NULL, -- 'home', 'loft', 'warehouse', 'other'
  
  -- Location (privacy-focused)
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  country VARCHAR(50) DEFAULT 'USA',
  display_coordinates POINT, -- Approximate location for map
  actual_address TEXT, -- Full address (private)
  
  -- Venue specs
  indoor_capacity INTEGER,
  outdoor_capacity INTEGER,
  preferred_genres TEXT[],
  
  -- Hosting details
  hosting_experience INTEGER, -- years
  typical_show_length INTEGER, -- minutes
  house_rules TEXT,
  
  -- Lodging capabilities
  offers_lodging BOOLEAN DEFAULT FALSE,
  lodging_details JSONB, -- {beds, bathroom, amenities, rules, pricing}
  
  -- Verification
  application_submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### host_media
```sql
CREATE TABLE host_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
  media_type media_type_enum NOT NULL, -- 'photo', 'video'
  category VARCHAR(50), -- 'exterior', 'performance_space', 'amenities', 'lodging'
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Fan-Specific Tables

#### fans
```sql
CREATE TABLE fans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Preferences
  favorite_genres TEXT[],
  travel_radius INTEGER, -- miles for concert discovery
  
  -- Membership
  subscription_status subscription_status_enum NOT NULL, -- 'active', 'expired', 'cancelled'
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Booking System Tables

#### bookings
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id),
  host_id UUID NOT NULL REFERENCES hosts(id),
  
  -- Booking details
  requested_date DATE NOT NULL,
  requested_time TIME,
  estimated_duration INTEGER, -- minutes
  expected_attendance INTEGER,
  
  -- Status management
  status booking_status_enum NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'confirmed', 'completed', 'cancelled'
  
  -- Financial
  artist_fee INTEGER, -- dollars
  door_fee INTEGER, -- dollars per person
  
  -- Communication
  artist_message TEXT,
  host_response TEXT,
  
  -- Lodging
  lodging_requested BOOLEAN DEFAULT FALSE,
  lodging_details JSONB, -- {guests, nights, special_requests}
  
  -- Timestamps
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### concerts
```sql
CREATE TABLE concerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Concert details
  title VARCHAR(255),
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  
  -- Capacity and pricing
  max_capacity INTEGER NOT NULL,
  door_fee INTEGER, -- dollars
  advance_tickets_available BOOLEAN DEFAULT FALSE,
  
  -- Status
  status concert_status_enum NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed', 'cancelled'
  
  -- Metadata
  is_private BOOLEAN DEFAULT FALSE,
  requires_approval BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Fan Engagement Tables

#### fan_rsvps
```sql
CREATE TABLE fan_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID NOT NULL REFERENCES fans(id),
  concert_id UUID NOT NULL REFERENCES concerts(id),
  
  status rsvp_status_enum NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'declined', 'waitlisted'
  guests_count INTEGER DEFAULT 1,
  special_requests TEXT,
  
  -- Timestamps
  rsvp_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(fan_id, concert_id)
);
```

### Review System Tables

#### reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  
  -- Visibility
  is_public BOOLEAN DEFAULT TRUE,
  
  -- Response
  response_text TEXT,
  response_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(booking_id, reviewer_id)
);
```

### Payment System Tables

#### payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Payment details
  stripe_payment_intent_id VARCHAR(255),
  amount INTEGER NOT NULL, -- cents
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Associations
  user_id UUID NOT NULL REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  
  -- Payment type
  payment_type payment_type_enum NOT NULL, -- 'membership', 'booking', 'door_fee'
  
  -- Status
  status payment_status_enum NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  
  -- Metadata
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Messaging System Tables

#### conversations
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  
  -- Participants
  participant_ids UUID[] NOT NULL,
  
  -- Metadata
  subject VARCHAR(255),
  last_message_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  
  -- Message content
  content TEXT NOT NULL,
  message_type message_type_enum DEFAULT 'text', -- 'text', 'system', 'booking_update'
  
  -- Metadata
  read_by UUID[], -- Array of user IDs who have read this message
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Notification System Tables

#### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Notification details
  type notification_type_enum NOT NULL, -- 'booking', 'message', 'payment', 'system'
  title VARCHAR(255) NOT NULL,
  message TEXT,
  
  -- Associations
  related_id UUID, -- booking_id, message_id, etc.
  related_type VARCHAR(50), -- 'booking', 'message', etc.
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Actions
  action_url TEXT,
  action_text VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Admin Tables

#### admin_actions
```sql
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action_type admin_action_enum NOT NULL, -- 'approve_user', 'reject_user', 'suspend_user', 'approve_booking'
  target_id UUID NOT NULL,
  target_type VARCHAR(50) NOT NULL, -- 'user', 'booking', 'review'
  
  -- Action details
  reason TEXT,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## API Architecture

### Authentication Endpoints

#### POST /api/auth/register
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  userType: 'artist' | 'host' | 'fan';
  profile: {
    bio?: string;
    location?: string;
    // Type-specific fields
  };
}

interface RegisterResponse {
  user: UserWithProfile;
  requiresApproval: boolean;
  nextStep: 'email_verification' | 'payment' | 'application' | 'approval_pending';
}
```

#### POST /api/auth/login
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: UserWithProfile;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

### User Management Endpoints

#### GET /api/users/me
```typescript
interface UserMeResponse {
  user: UserWithProfile;
  permissions: string[];
  subscription?: SubscriptionInfo;
}
```

#### PATCH /api/users/me
```typescript
interface UpdateUserRequest {
  name?: string;
  profile?: {
    bio?: string;
    location?: string;
    socialLinks?: SocialLinks;
  };
}
```

### Artist Endpoints

#### GET /api/artists
```typescript
interface ArtistListRequest {
  page?: number;
  limit?: number;
  genres?: string[];
  location?: string;
  radius?: number;
}

interface ArtistListResponse {
  artists: ArtistWithMedia[];
  pagination: PaginationInfo;
  filters: FilterOptions;
}
```

#### POST /api/artists/application
```typescript
interface ArtistApplicationRequest {
  bio: string;
  genres: string[];
  performanceVideoUrl: string;
  musicProfileUrl: string;
  socialLinks: SocialLinks;
  pressPhoto: File;
}
```

### Host Endpoints

#### GET /api/hosts
```typescript
interface HostListRequest {
  page?: number;
  limit?: number;
  venueType?: VenueType[];
  location?: string;
  radius?: number;
  capacity?: {min?: number; max?: number};
  offersLodging?: boolean;
}

interface HostListResponse {
  hosts: HostWithMedia[];
  pagination: PaginationInfo;
  filters: FilterOptions;
}
```

#### POST /api/hosts/application
```typescript
interface HostApplicationRequest {
  venueName: string;
  venueType: VenueType;
  city: string;
  state: string;
  indoorCapacity: number;
  outdoorCapacity?: number;
  hostingExperience: number;
  venuePhotos: File[];
  hostingMotivation: string;
}
```

### Booking Endpoints

#### POST /api/bookings
```typescript
interface CreateBookingRequest {
  hostId: string;
  requestedDate: string;
  requestedTime: string;
  estimatedDuration: number;
  expectedAttendance: number;
  artistFee: number;
  message: string;
  lodgingRequested: boolean;
  lodgingDetails?: LodgingDetails;
}

interface CreateBookingResponse {
  booking: BookingWithDetails;
  estimatedResponse: string; // "within 48 hours"
}
```

#### PATCH /api/bookings/:id/respond
```typescript
interface BookingResponseRequest {
  status: 'approved' | 'rejected';
  response: string;
  counterOffer?: {
    date?: string;
    time?: string;
    fee?: number;
  };
}
```

### Concert & Fan Endpoints

#### GET /api/concerts
```typescript
interface ConcertListRequest {
  page?: number;
  limit?: number;
  location?: string;
  radius?: number;
  dateRange?: {start: string; end: string};
  genres?: string[];
}

interface ConcertListResponse {
  concerts: ConcertWithDetails[];
  pagination: PaginationInfo;
}
```

#### POST /api/concerts/:id/rsvp
```typescript
interface RSVPRequest {
  guestsCount: number;
  specialRequests?: string;
}

interface RSVPResponse {
  rsvp: FanRSVP;
  status: 'confirmed' | 'waitlisted' | 'pending_approval';
}
```

### Payment Endpoints

#### POST /api/payments/create-intent
```typescript
interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  paymentType: 'membership' | 'booking' | 'door_fee';
  metadata?: Record<string, any>;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}
```

#### POST /api/payments/webhook
```typescript
// Stripe webhook handler
interface StripeWebhookEvent {
  type: string;
  data: {
    object: any;
  };
}
```

### Admin Endpoints

#### GET /api/admin/applications
```typescript
interface AdminApplicationsRequest {
  status?: 'pending' | 'approved' | 'rejected';
  userType?: 'artist' | 'host';
  page?: number;
  limit?: number;
}

interface AdminApplicationsResponse {
  applications: ApplicationWithUser[];
  pagination: PaginationInfo;
  stats: {
    pending: number;
    approved: number;
    rejected: number;
  };
}
```

#### POST /api/admin/applications/:id/review
```typescript
interface ReviewApplicationRequest {
  status: 'approved' | 'rejected';
  notes?: string;
  followUpQuestions?: string[];
}
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
1. **Database Setup**
   - PostgreSQL + Prisma configuration
   - Core schema migration
   - Seed data scripts

2. **Authentication System**
   - NextAuth.js v5 setup
   - User registration/login endpoints
   - JWT token management
   - Password reset flow

3. **Basic User Management**
   - User profile CRUD operations
   - Role-based access control
   - Email verification system

### Phase 2: Core Features (Weeks 3-4)
1. **Artist/Host Systems**
   - Application submission endpoints
   - Profile management APIs
   - Media upload integration (AWS S3)
   - Admin approval workflow

2. **Booking System**
   - Booking request creation
   - Host response handling
   - Status management
   - Email notifications

### Phase 3: Advanced Features (Weeks 5-6)
1. **Payment Integration**
   - Stripe Connect setup
   - Artist membership payments
   - Booking fee processing
   - Subscription management

2. **Fan System**
   - Fan registration/payment
   - Concert discovery API
   - RSVP system
   - Notification preferences

### Phase 4: Real-time & Polish (Weeks 7-8)
1. **Messaging System**
   - Real-time chat implementation
   - Message history
   - Notification delivery

2. **Admin Dashboard**
   - Application review interface
   - Platform analytics
   - User management tools

---

## Security Considerations

### Authentication & Authorization
- JWT tokens with refresh mechanism
- Role-based permissions system
- API rate limiting
- Password hashing with bcrypt

### Data Protection
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF tokens

### File Upload Security
- File type validation
- Size limits
- Virus scanning
- Secure S3 bucket configuration

### Privacy Features
- Approximate location display
- Contact info reveal after booking
- Private messaging system
- Data deletion compliance

---

## Development Approach

### Environment Setup
```bash
# Development
DATABASE_URL="postgresql://user:pass@localhost:5432/tourpad_dev"
NEXTAUTH_SECRET="dev-secret"
STRIPE_SECRET_KEY="sk_test_..."

# Production
DATABASE_URL="postgresql://user:pass@prod-db:5432/tourpad"
NEXTAUTH_SECRET="prod-secret"
STRIPE_SECRET_KEY="sk_live_..."
```

### Testing Strategy
- Unit tests for API endpoints
- Integration tests for booking flow
- E2E tests for user journeys
- Load testing for concurrent users

### Deployment Pipeline
1. **Development**: Local PostgreSQL + Redis
2. **Staging**: Railway PostgreSQL + Redis
3. **Production**: AWS RDS + ElastiCache
4. **Monitoring**: Sentry + DataDog

---

## Migration Strategy

### Data Migration from Mock to Real
1. **User Data**: Convert mock users to real accounts
2. **Booking History**: Preserve existing booking records
3. **Media Files**: Upload mock images to S3
4. **Relationships**: Maintain ID mappings during transition

### Gradual Rollout
1. **Admin Users**: First to use real backend
2. **Beta Users**: Small group of artists/hosts
3. **Full Release**: All users migrated

---

## Performance Optimization

### Database Optimization
- Proper indexing strategy
- Query optimization
- Connection pooling
- Read replicas for heavy queries

### API Performance
- Response caching with Redis
- Pagination for large datasets
- Eager loading for related data
- Background job processing

### File Storage
- CDN integration
- Image optimization
- Lazy loading
- Progressive image enhancement

---

## Monitoring & Analytics

### Error Tracking
- Sentry for error monitoring
- Custom error logging
- Performance monitoring
- User behavior analytics

### Business Metrics
- User conversion rates
- Booking success rates
- Payment completion rates
- User engagement metrics

---

*This architecture provides a solid foundation for TourPad's backend system while maintaining scalability and security.*