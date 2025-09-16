# TourPad Complete Reverse Sitemap

## Overview
This document maps the complete structure and user flows of the TourPad application, showing all 54 pages, authentication states, and user journey paths.

## Quick Navigation
- [Route Inventory](#route-inventory)
- [User Access Matrix](#user-access-matrix)
- [Authentication Flow](#authentication-flow)
- [Dashboard Routing Logic](#dashboard-routing-logic)
- [Complete User Journeys](#complete-user-journeys)

---

## Route Inventory

### 🌐 Public Routes (19 routes)
*Accessible to all users, authenticated or not*

#### Landing & Information Pages
- `/` - **Homepage** - Main landing page with value propositions
- `/how-it-works` - **How It Works** - Platform explanation
- `/for-artists` - **Artist Information** - Artist-specific landing page
- `/for-hosts` - **Host Information** - Host-specific landing page
- `/pricing` - **Pricing** - Membership pricing information
- `/contact` - **Contact** - Contact form and information

#### Legal & Policy Pages
- `/terms` - **Terms of Service**
- `/privacy` - **Privacy Policy**
- `/cookies` - **Cookie Policy**
- `/refunds` - **Refund Policy**
- `/community-guidelines` - **Community Guidelines**

#### Discovery Pages (Access varies by user status)
- `/artists` - **Browse Artists** - Artist directory with profiles
- `/artists/[id]` - **Artist Profile** - Individual artist pages
- `/hosts` - **Browse Hosts** - Host/venue directory
- `/hosts/[id]` - **Host Profile** - Individual host/venue pages
- `/concerts` - **Browse Concerts** - Public concert listings
- `/map` - **Interactive Map** - Geographic view of hosts/shows
- `/calendar` - **Calendar View** - Calendar-based event browsing
- `/archive` - **Archive** - Historical content

### 🔐 Authentication Routes (4 routes)
*User registration and login flows*

- `/login` - **Login Page** - Google OAuth signin
- `/register` - **Registration** - User type selection and initial signup
- `/auth/error` - **Auth Error** - Authentication error handling
- `/onboarding/artist` - **Artist Onboarding** - Artist application form
- `/onboarding/host` - **Host Onboarding** - Host application form

### 📊 Dashboard Routes (15 routes)
*Protected routes requiring authentication and proper status*

#### Main Dashboard
- `/dashboard` - **Main Dashboard** - Role-based dashboard (redirects based on user type)

#### Universal Dashboard Pages
- `/dashboard/profile` - **Profile Management** - Edit profile information
- `/dashboard/messages` - **Messaging** - Internal messaging system
- `/dashboard/bookings` - **Booking Management** - View and manage bookings

#### Artist-Specific Pages
- `/dashboard/music` - **Music Management** - Spotify/SoundCloud integration
- `/dashboard/artist-media` - **Media Gallery** - Photos, videos, press materials
- `/dashboard/media` - **Legacy Media** - Alternative media management
- `/dashboard/tour-planner` - **Tour Planning** - Geographic tour planning
- `/dashboard/reviews` - **Reviews** - Manage artist reviews
- `/dashboard/concert-reviews` - **Concert Reviews** - Concert-specific feedback

#### Host-Specific Pages
- `/dashboard/lodging/setup` - **Lodging Setup** - Configure lodging options
- `/dashboard/lodging/photos` - **Lodging Photos** - Upload venue photos

#### Fan-Specific Pages
- `/dashboard/fan` - **Fan Dashboard** - Fan-specific dashboard
- `/dashboard/fan/profile` - **Fan Profile** - Fan profile management

### 💳 Payment Routes (4 routes)
*Stripe payment integration*

- `/payment/artist` - **Artist Payment** - $400/year artist membership
- `/payment/fan` - **Fan Payment** - $10/month fan subscription
- `/payment/success` - **Payment Success** - Payment completion confirmation
- `/subscription` - **Subscription Info** - Subscription details
- `/subscription/manage` - **Manage Subscription** - Stripe customer portal

### 📋 Status & Access Routes (3 routes)
*User status and permission handling*

- `/pending-approval` - **Pending Approval** - Holding page for pending applications
- `/unauthorized` - **Unauthorized** - Access denied page
- `/test` - **Test Page** - Development testing

### 👑 Admin Routes (6 routes)
*Admin-only access for platform management*

- `/admin` - **Admin Dashboard** - Central admin control panel
- `/admin/applications` - **Application Review** - Approve/reject user applications
- `/admin/bookings` - **Booking Oversight** - Monitor all platform bookings
- `/admin/messages` - **Message Monitoring** - Oversight of all conversations
- `/admin/users` - **User Management** - Manage user accounts
- `/admin/finance` - **Financial Overview** - Revenue and payment analytics
- `/admin/spotify` - **Spotify Admin** - Spotify integration management

### 🔧 Feature-Specific Routes (10 routes)
*Specialized functionality*

#### Booking Flow
- `/bookings/new` - **Create Booking** - New booking request form
- `/bookings/[id]` - **Booking Details** - Individual booking management
- `/bookings/coordination` - **Show Coordination** - Pre-show planning

#### Lodging System
- `/lodging/search` - **Lodging Search** - Find accommodation
- `/lodging/book` - **Book Lodging** - Reserve accommodation

#### Messaging & Communication
- `/messages` - **Standalone Messages** - Alternative message interface

#### Development & Testing
- `/test-dashboard` - **Test Dashboard** - Development testing
- `/test-polling` - **Test Polling** - Real-time feature testing
- `/test-realtime` - **Test Real-time** - Real-time messaging testing

---

## User Access Matrix

### 🎵 Artists

| Status | Dashboard Access | Browse Access | Payment Required | Available Features |
|--------|------------------|---------------|------------------|-------------------|
| **PENDING** | ❌ Holding page | 🔒 Limited preview | ❌ Not yet | Application status only |
| **APPROVED** | ❌ Payment required | ✅ Full browse | ✅ $400/year | Payment page access |
| **ACTIVE** | ✅ Full dashboard | ✅ Full browse | ✅ Paid | All features unlocked |

**Artist Dashboard Features (ACTIVE only):**
- Profile management with Spotify/SoundCloud integration
- Tour planning and geographic scheduling
- Booking management (send requests, manage approvals)
- Media gallery (photos, videos, press materials)
- Messaging with hosts and fans
- Review management

### 🏠 Hosts

| Status | Dashboard Access | Browse Access | Payment Required | Available Features |
|--------|------------------|---------------|------------------|-------------------|
| **PENDING** | ❌ Holding page | 🔒 Limited preview | ❌ No payment | Application status only |
| **APPROVED** | ✅ Full dashboard | ✅ Full browse | ❌ No payment | All features unlocked |
| **ACTIVE** | ✅ Full dashboard | ✅ Full browse | ❌ No payment | All features unlocked |

**Host Dashboard Features (APPROVED/ACTIVE):**
- Venue profile management with photo galleries
- Musical preferences and hosting requirements
- Lodging setup and accommodation management
- Booking management (receive requests, approve/decline)
- RSVP management for concerts
- Messaging with artists and fans
- Review management

### 🎭 Fans

| Status | Dashboard Access | Browse Access | Payment Required | Available Features |
|--------|------------------|---------------|------------------|-------------------|
| **PENDING** | ❌ Payment required | 🔒 Limited preview | ✅ $10/month | Payment page access |
| **ACTIVE** | ✅ Fan dashboard | ✅ Full browse | ✅ Paid | All fan features |
| **EXPIRED** | 🔒 Limited access | 🔒 Limited preview | ✅ Renewal required | Renewal page only |

**Fan Dashboard Features (ACTIVE only):**
- Concert discovery and search
- RSVP system for house concerts
- Artist directory browsing
- Review system for attended concerts
- Profile management with preferences
- Messaging with artists and hosts

### 👑 Admins

| Status | Dashboard Access | Browse Access | Payment Required | Available Features |
|--------|------------------|---------------|------------------|-------------------|
| **ADMIN** | ✅ Admin panel | ✅ Full browse | ❌ No payment | All admin features |

**Admin Features:**
- Application review (approve/reject artists and hosts)
- User management and status changes
- Booking oversight and monitoring
- Message monitoring for community safety
- Financial analytics and revenue tracking
- Platform metrics and health monitoring

---

## Authentication Flow

### 1. Public User (Not Logged In)
```
Landing Page → Registration → Login
     ↓
Browse Pages (Limited Preview)
     ↓
Registration Required for Full Access
```

### 2. Registration Flow
```
/register → User Type Selection
     ↓
┌─ Artist → /onboarding/artist → PENDING status
├─ Host → /onboarding/host → PENDING status
└─ Fan → /payment/fan → Direct payment → ACTIVE status
```

### 3. Approval Process
```
Artist: PENDING → Admin Approval → APPROVED → Payment → ACTIVE
Host: PENDING → Admin Approval → ACTIVE (no payment)
Fan: PENDING → Payment → ACTIVE (no approval needed)
```

---

## Dashboard Routing Logic

The main `/dashboard` route acts as an intelligent router based on user type and status:

### Authentication Check
```typescript
// From middleware.ts and dashboard/page.tsx
if (!session) → redirect to /login
if (status === 'pending' && type !== 'fan') → redirect to /pending-approval
if (type === 'fan' && paymentStatus !== 'active') → redirect to /payment/fan
```

### Role-Based Dashboard Routing
```typescript
// Main dashboard rendering logic
switch (userType) {
  case 'artist':
    return <ArtistDashboard /> // Bookings, tour planning, music integration
  case 'host':
    return <HostDashboard />   // Venue management, RSVPs, lodging
  case 'fan':
    return <FanDashboard />    // Concert discovery, RSVPs, reviews
  case 'admin':
    return redirect('/admin')  // Admin panel redirect
}
```

---

## Complete User Journeys

### 🎵 Artist Journey
```
1. Landing Page (/): Learns about platform
2. Registration (/register): Selects "Artist" type
3. Onboarding (/onboarding/artist): Completes application
4. Holding (/pending-approval): Waits for admin approval
5. Admin Reviews (/admin/applications): Admin approves application
6. Payment (/payment/artist): Pays $400/year membership
7. Dashboard (/dashboard): Access to full artist features
8. Profile Setup (/dashboard/profile): Complete profile
9. Music Integration (/dashboard/music): Connect Spotify/SoundCloud
10. Tour Planning (/dashboard/tour-planner): Plan geographic tours
11. Host Discovery (/hosts): Find venues in tour areas
12. Messaging (/dashboard/messages): Contact hosts
13. Booking Requests (/dashboard/bookings): Manage booking flow
14. Show Coordination (/bookings/coordination): Pre-show planning
15. Performance & Reviews: Post-show feedback cycle
```

### 🏠 Host Journey
```
1. Landing Page (/): Learns about hosting opportunities
2. Registration (/register): Selects "Host" type
3. Onboarding (/onboarding/host): Venue application with photos
4. Holding (/pending-approval): Waits for admin approval
5. Admin Reviews (/admin/applications): Admin approves venue
6. Dashboard (/dashboard): Immediate access (no payment required)
7. Venue Setup (/dashboard/profile): Complete venue profile
8. Photo Gallery (/dashboard/lodging/photos): Upload venue photos
9. Lodging Setup (/dashboard/lodging/setup): Configure accommodation
10. Musical Preferences: Set hosting preferences and requirements
11. Artist Discovery (/artists): Browse artists and tour schedules
12. Messaging (/dashboard/messages): Connect with artists
13. Booking Management (/dashboard/bookings): Approve/manage bookings
14. RSVP Management: Manage fan attendance for concerts
15. Host Experience: Build hosting reputation
```

### 🎭 Fan Journey
```
1. Landing Page (/): Discovers house concert community
2. Registration (/register): Selects "Fan" type
3. Payment (/payment/fan): Immediate $10/month payment
4. Fan Dashboard (/dashboard/fan): Access to fan features
5. Profile Setup (/dashboard/fan/profile): Set preferences and location
6. Concert Discovery (/concerts): Browse available house concerts
7. Artist Exploration (/artists): Discover new artists
8. Map Exploration (/map): Geographic concert discovery
9. RSVP System: Request attendance at concerts
10. Host Approval: Wait for host to approve RSVP
11. Concert Attendance: Attend approved house concerts
12. Review System (/dashboard/reviews): Rate and review experiences
13. Community Engagement: Build fan reputation and connections
```

### 👑 Admin Journey
```
1. Admin Login (/login): Special admin authentication
2. Admin Dashboard (/admin): Central control panel
3. Application Review (/admin/applications): Process pending applications
4. User Management (/admin/users): Monitor user accounts
5. Booking Oversight (/admin/bookings): Monitor platform activity
6. Message Monitoring (/admin/messages): Community safety oversight
7. Financial Analytics (/admin/finance): Track revenue and growth
8. Platform Maintenance: System health and optimization
```

---

## Navigation Patterns

### Header Navigation (Dynamic)
The header navigation changes based on user authentication and status:

#### Non-Authenticated Users
- How It Works, Browse Artists, Find Hosts, Login/Register

#### Artists (ACTIVE)
- Browse Artists, Find Hosts, Map, My Bookings

#### Hosts (APPROVED/ACTIVE)
- Browse Artists, Find Hosts, Map, My Venue

#### Fans (ACTIVE)
- Find Concerts, Find Venues, Map, My Concerts

#### Admins
- All public navigation + Admin Panel access

### Dashboard Navigation
Each user type has a customized sidebar navigation within the dashboard:

#### Artist Dashboard Sidebar
- Overview, Profile, Music, Bookings, Messages, Tour Planner, Reviews

#### Host Dashboard Sidebar
- Overview, Profile, Venue Photos, Lodging Setup, Bookings, Messages, Reviews

#### Fan Dashboard Sidebar
- Overview, Profile, Concerts, Artists, Reviews, Messages

---

## API Integration Points

### Key Frontend → API Connections
- **Authentication**: `/api/auth/[...nextauth]` ↔ All protected pages
- **Profile Management**: `/api/profile` ↔ `/dashboard/profile`
- **Messaging**: `/api/messages`, `/api/conversations` ↔ `/dashboard/messages`
- **Bookings**: `/api/bookings` ↔ `/dashboard/bookings`
- **User Data**: `/api/users`, `/api/artists`, `/api/hosts` ↔ Browse pages
- **Payments**: `/api/payments/*` ↔ Payment pages
- **Admin Functions**: `/api/admin/*` ↔ Admin dashboard

### Real-time Features
- **Message Polling**: 30-second intervals for new messages
- **Notification System**: Real-time notifications via `/api/notifications`
- **Online Status**: User presence indicators
- **Typing Indicators**: Real-time messaging feedback

---

## Security & Access Control

### Route Protection Layers
1. **Middleware Authentication**: Basic session validation
2. **Component-Level Guards**: User type and status checking
3. **API Route Protection**: Server-side permission validation
4. **Database-Level Security**: User ownership validation

### Status-Based Access Control
```typescript
// Access control matrix
const accessRules = {
  'pending': ['pending-approval', 'auth', 'public'],
  'approved': ['payment', 'public', 'browse'],
  'active': ['dashboard', 'messaging', 'booking', 'full-features'],
  'admin': ['all-routes', 'admin-panel', 'user-management']
}
```

---

This sitemap provides a complete overview of every route, user journey, and access pattern in the TourPad application. Each route serves a specific purpose in the overall user experience, from initial discovery through active community participation.