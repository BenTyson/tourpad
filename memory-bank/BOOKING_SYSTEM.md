# TourPad Booking System Architecture

## Overview
The TourPad booking system facilitates connections between artists and hosts for intimate house concerts. This document outlines the complete booking lifecycle, user experiences, and technical implementation.

## Current Implementation Status

### ✅ Completed
- **Database Schema**: Complete booking, concert, and RSVP models
- **API Foundation**: Booking creation and retrieval endpoints
- **Form Submission**: Artist booking request form working with real database
- **User Management**: Artist/host profile creation and approval process
- **Authentication**: Session management and payment integration
- **Base Calendar**: Existing calendar page with booking/concert visualization

### 🔄 In Progress  
- **Artist Dashboard**: Booking request tracking and management
- **Host Interface**: Request approval and venue management
- **Calendar Integration**: Database-driven booking and concert display

## Booking Flow Architecture

### Booking States
```
PENDING → APPROVED → CONFIRMED → COMPLETED
    ↓         ↓          ↓
REJECTED  CANCELED   CANCELED
```

**State Definitions**:
- **PENDING**: Initial state when artist submits request
- **APPROVED**: Host approves the request (venue confirmed)
- **CONFIRMED**: Both parties confirm details (becomes public concert)
- **REJECTED**: Host declines the request
- **CANCELED**: Either party cancels (can happen in any state)
- **COMPLETED**: Show has occurred and is marked complete

### Database Schema

#### Booking Model
```prisma
model Booking {
  id                 String         @id @default(cuid())
  artistId           String         // References Artist.id
  hostId             String         // References Host.id  
  requestedDate      DateTime
  requestedTime      DateTime?
  estimatedDuration  Int?           // Minutes
  expectedAttendance Int?
  status             BookingStatus  @default(PENDING)
  artistFee          Int?           // Cents
  doorFee            Int?           // Cents
  artistMessage      String?        // Initial request message
  hostResponse       String?        // Host response message
  lodgingRequested   Boolean        @default(false)
  lodgingDetails     Json?          // Lodging requirements
  requestedAt        DateTime       @default(now())
  respondedAt        DateTime?      // When host responds
  confirmedAt        DateTime?      // When both confirm
  completedAt        DateTime?      // After show completion
  concert            Concert?       // Created when CONFIRMED
}
```

#### Concert Model (Public Events)
```prisma
model Concert {
  id                      String        @id @default(cuid())
  bookingId               String        @unique
  title                   String?
  description             String?
  date                    DateTime
  startTime               DateTime
  maxCapacity             Int
  doorFee                 Int?
  advanceTicketsAvailable Boolean       @default(false)
  status                  ConcertStatus @default(SCHEDULED)
  isPrivate               Boolean       @default(false)
  requiresApproval        Boolean       @default(true)
  rsvps                   FanRSVP[]
}
```

## User Experiences

### 🎨 Artist Perspective

#### Current Capabilities
- ✅ Browse approved hosts
- ✅ Submit booking requests with details
- ✅ Include lodging requests
- ✅ Specify event requirements

#### Booking Dashboard (`/dashboard/bookings`)
**Sections**:
1. **Pending Requests** - Awaiting host response
2. **Approved Bookings** - Confirmed venues, pending final details
3. **Upcoming Shows** - Confirmed concerts with RSVP tracking
4. **Past Shows** - Completed performances with reviews
5. **Canceled/Rejected** - Historical record

**Actions**:
- View request status and host responses
- Cancel pending requests
- Confirm approved bookings
- Add show details (setlist, photos, etc.)
- View attendance and fan feedback

#### Calendar Integration
- View all bookings/shows in calendar format
- Filter by status (pending, confirmed, completed)
- Quick booking status updates
- Integrated with existing calendar component

### 🏠 Host Perspective

#### Incoming Requests (`/dashboard/bookings`)
**Sections**:
1. **New Requests** - Requiring immediate attention
2. **Approved Bookings** - Awaiting artist confirmation
3. **Upcoming Shows** - Confirmed concerts to host
4. **Past Shows** - Completed events with reviews
5. **Calendar Availability** - Set available dates

**Request Management Flow**:
1. **Review Request** - Artist details, proposed date, requirements
2. **Check Availability** - Calendar integration
3. **Respond** - Approve/reject with custom message
4. **Confirm Details** - Finalize logistics after approval
5. **Host Event** - Day-of coordination tools

**Host Tools**:
- Set venue availability windows
- Define default pricing and capacity
- Manage house rules and requirements
- Lodging accommodation settings
- Calendar blocking for personal events

### 👨‍💼 Admin Perspective

#### Booking Analytics (`/admin/bookings`)
**Metrics Dashboard**:
- Booking request volume and trends
- Success/conversion rates by user type
- Revenue tracking (door fees, platform fees)
- Geographic booking distribution
- Popular venue types and artist genres

**Management Tools**:
- Dispute resolution interface
- Quality control flagging
- User booking pattern analysis
- Platform health monitoring
- Booking fraud detection

**Reports**:
- Monthly booking summaries
- Artist/host performance metrics
- Platform growth indicators
- Revenue breakdowns

## Technical Implementation

### API Endpoints

#### Booking Management
```typescript
GET    /api/bookings              // User's bookings with filters
POST   /api/bookings              // Create new booking request
GET    /api/bookings/[id]         // Booking details
PUT    /api/bookings/[id]         // Update booking (status, details)
DELETE /api/bookings/[id]         // Cancel booking

// Host-specific actions
POST   /api/bookings/[id]/approve // Host approves request
POST   /api/bookings/[id]/reject  // Host rejects request

// Artist-specific actions  
POST   /api/bookings/[id]/confirm // Artist confirms approved booking
POST   /api/bookings/[id]/cancel  // Cancel booking (any party)
```

#### Concert Creation
```typescript
POST   /api/concerts              // Create public concert from booking
GET    /api/concerts              // Public concert listings
GET    /api/concerts/[id]         // Concert details with RSVP
POST   /api/concerts/[id]/rsvp    // Fan RSVP to concert
```

### Real-time Features

#### Notification System
- **SSE Integration**: Extend existing payment notification system
- **Booking Events**: Status changes, new requests, responses
- **Email Notifications**: Critical updates and reminders
- **Dashboard Updates**: Live booking status refresh

#### Calendar Integration
- **Database-driven**: Replace mockData with real booking/concert data
- **User-specific Views**: Artists see their bookings, hosts see their events
- **Status-based Filtering**: Different colors/styles per booking status
- **Quick Actions**: Status updates directly from calendar view

### Data Flow

#### Booking Request Lifecycle
1. **Artist Submission** → `POST /api/bookings` → Database + Host notification
2. **Host Response** → `PUT /api/bookings/[id]` → Status update + Artist notification  
3. **Artist Confirmation** → `POST /api/bookings/[id]/confirm` → Concert creation
4. **Concert Publishing** → `POST /api/concerts` → Public event + Fan notifications
5. **Show Completion** → Manual status update → Review prompts

#### Calendar Data Sources
- **Bookings**: User-specific booking requests and confirmations
- **Concerts**: Public events for fan discovery and RSVP
- **Availability**: Host-defined available/blocked dates
- **Personal Events**: Optional user calendar integration

## Integration Points

### Existing Systems
- **Authentication**: NextAuth session management
- **Payment**: Stripe integration for artist subscriptions
- **Real-time**: SSE notification infrastructure
- **Admin**: User management and analytics dashboards
- **Calendar**: Existing calendar component architecture

### External Integrations (Future)
- **Email**: Booking confirmations and reminders
- **SMS**: Critical notifications and day-of coordination
- **Calendar Sync**: Google Calendar, Outlook integration
- **Social**: Event sharing and promotion tools

## Implementation Phases

### Phase 1: Artist Booking Dashboard
- Build `/dashboard/bookings` for artists
- Integrate with existing calendar component
- Show real booking data from database
- Add basic status tracking and actions

### Phase 2: Host Booking Management  
- Build host version of `/dashboard/bookings`
- Create booking approval/rejection workflow
- Add calendar availability management
- Implement host response messaging

### Phase 3: Booking Status Transitions
- Complete approve/reject/confirm API endpoints
- Add booking cancellation workflows
- Implement concert creation from confirmed bookings
- Add real-time status notifications

### Phase 4: Admin Oversight
- Add booking analytics to admin dashboard
- Create booking health monitoring
- Build dispute resolution tools
- Add platform booking metrics

### Phase 5: Enhanced Features
- Advanced calendar features and integrations
- Comprehensive notification system
- Mobile-optimized booking management
- Third-party calendar sync

## Success Metrics

### User Experience
- **Artists**: Seamless booking request tracking and management
- **Hosts**: Efficient request approval and event coordination  
- **Admins**: Clear platform booking health visibility

### Technical Goals
- **Performance**: Sub-200ms booking API response times
- **Reliability**: 99.9% booking submission success rate
- **Real-time**: <1 second notification delivery
- **Data Integrity**: Zero orphaned bookings or concerts

### Business Objectives
- **Booking Volume**: Increase monthly booking requests by 50%
- **Conversion**: Improve booking approval rate to >70%
- **Retention**: Increase repeat booking rate by 30%
- **Platform Health**: Reduce booking disputes by 80%

---

**Next Steps**: Begin Phase 1 implementation with artist booking dashboard, building on existing calendar component to display real booking data from the database.