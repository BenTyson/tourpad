# Fan Portal Development Plan

*Created: 2025-07-24*  
*Status: Implementation Started*

## Executive Summary

The TourPad fan portal foundation is **excellent** - database schema, Stripe payments, and discovery features are complete. This plan outlines building the missing fan-facing UI and API endpoints to create a fully functional fan experience.

---

## Current State Analysis

### ✅ **What's Already Built (Strong Foundation)**

#### Database Models
- **Fan Model**: Complete with favoriteGenres, travelRadius, subscriptionStatus
- **FanRSVP Model**: Full RSVP system with status tracking, guest counts, special requests  
- **Concert Model**: Public concert discovery with capacity management
- **Subscription System**: Full Stripe integration with status tracking

#### Payment & Subscription System
- **Stripe Integration**: Complete checkout flow for fan subscriptions ($9.99/month)
- **Status Tracking**: Active/expired/cancelled subscription states
- **Billing Portal**: Stripe customer portal for payment management
- **Webhook Processing**: Automated subscription activation

#### Discovery Features  
- **Calendar Integration**: Fan view of confirmed concerts
- **Map-based Discovery**: Advanced concert filtering and location-based search
- **Concert Status Tracking**: Real-time concert and RSVP status

#### UI Components
- **FanConcertReviewModal**: Complete review submission interface with separate artist/venue/overall ratings
- **FanConcertReviewCard**: Review display with recommendation tracking
- **Messaging System**: Full message threads with fan access

### ❌ **What's Missing (Implementation Gaps)**

#### Fan Dashboard
- No dedicated fan interface (dashboard only supports artists/hosts)
- No profile management for hometown, state, bio, profile picture
- No upcoming/past concert tracking interface

#### RSVP Management
- Database models exist but no UI for fans to book concerts
- No host interface for approving/declining RSVP requests
- No automated address sharing on approval

#### API Endpoints
- No `/api/fans/*` endpoints for profile management
- No `/api/rsvps/*` endpoints for booking management  
- No review submission APIs (components exist but no backend)
- No fan-specific concert history APIs

---

## Phased Implementation Plan

### **Phase 1: Core Fan Experience** (Week 1-2)
*Goal: Functional dashboard and profile management*

#### Database Updates Required
```sql
-- Add missing Fan profile fields
ALTER TABLE Fan ADD COLUMN hometown VARCHAR(255);
ALTER TABLE Fan ADD COLUMN state VARCHAR(50);  
ALTER TABLE Fan ADD COLUMN bio TEXT;
ALTER TABLE Fan ADD COLUMN profileImageUrl VARCHAR(500);
```

#### Components to Build
1. **Fan Dashboard** (`/dashboard/fan/`)
   - Upcoming RSVP'd concerts widget
   - Past attended concerts summary
   - Profile completion status indicator
   - Quick action buttons (browse concerts, messages)

2. **Fan Profile Management**
   - Edit hometown, state, bio, favorite genres
   - Profile picture upload (leverage existing `/api/upload/`)
   - Subscription status display with billing portal link

#### API Endpoints to Create
- `GET /api/fan/profile` - Retrieve fan profile data
- `PUT /api/fan/profile` - Update fan profile information  
- `GET /api/fan/concerts/upcoming` - Fan's upcoming RSVP'd concerts
- `GET /api/fan/concerts/past` - Fan's attended concert history

### **Phase 2: RSVP System** (Week 3-4)
*Goal: Complete concert booking flow*

#### Components to Build
1. **Fan RSVP Interface**  
   - Browse confirmed concerts (enhance existing map/calendar)
   - Send RSVP requests with guest count and special requests
   - Track RSVP status changes (pending → approved/declined)

2. **Host RSVP Management**
   - View incoming fan RSVP requests in host dashboard
   - Approve/decline with automatic capacity validation
   - Automated address sharing to approved fans

#### API Endpoints to Create  
- `GET /api/rsvps/fan/:fanId` - Fan's RSVP history and status
- `POST /api/rsvps` - Create new RSVP request
- `PUT /api/rsvps/:id` - Host approve/decline RSVP
- `GET /api/rsvps/host/:hostId` - Host's incoming RSVP requests

### **Phase 3: Reviews & Social Features** (Week 5-6)
*Goal: Enable fan reviews and artist interaction*

#### Components to Build
1. **Review Submission System**
   - Connect existing `FanConcertReviewModal` to backend APIs
   - Post-concert review prompts and reminders
   - Review history and management interface

2. **Fan Artist Directory**
   - Browse all artists (filtered view of existing directory)
   - Artist profiles with aggregated review scores
   - Message artists (restrict to messages, no booking requests)

#### API Endpoints to Create
- `POST /api/reviews` - Submit concert reviews  
- `GET /api/reviews/fan/:fanId` - Fan's submitted reviews
- `GET /api/reviews/concert/:concertId` - All reviews for concert
- `GET /api/artists/browse` - Fan-filtered artist directory (no booking info)

### **Phase 4: Polish & Advanced Features** (Week 7-8)  
*Goal: Complete fan experience with billing and personalization*

#### Components to Build
1. **Enhanced Billing Dashboard**
   - Detailed subscription history and status
   - Payment method management interface
   - Integration with existing Stripe billing portal

2. **Advanced Discovery & Personalization**
   - Favorite artists and venues tracking
   - Personalized concert recommendations based on history
   - Enhanced search and filtering options

#### API Endpoints to Create
- `GET/POST /api/fan/favorites` - Manage favorite artists/venues
- `GET /api/fan/recommendations` - Personalized concert suggestions
- `GET /api/fan/billing/history` - Subscription and payment history

---

## Technical Implementation Details  

### Security & Access Control
- **Middleware Updates**: Route fan users to appropriate dashboards
- **Permission System**: Fans cannot access host directory or booking creation
- **RSVP Validation**: Enforce concert capacity limits and approval requirements

### Data Architecture Integration
- **Test Data**: Leverage existing comprehensive fan data in `realTestData.ts`
- **ID Mapping**: Maintain consistency with existing patterns (realTestData ↔ mockData)
- **Database Seeding**: Use existing fan profiles for development testing

### System Integration Points
- **Calendar Page**: Add fan-specific concert filtering (confirmed concerts only)
- **Map Page**: Remove host directory access for fan users  
- **Messaging System**: Restrict fans from sending booking requests
- **Notification System**: Add RSVP status updates and concert reminders

### Performance Considerations
- **RSVP Queries**: Index on fanId and concertId for efficient lookups
- **Review Aggregation**: Cache review averages for artist/venue profiles
- **Concert Discovery**: Optimize location-based queries for map interface

---

## Success Metrics

### Phase 1 Success Criteria
- [ ] Fan can complete full profile setup (hometown, state, bio, genres, photo)
- [ ] Fan dashboard displays upcoming and past concerts accurately  
- [ ] Profile management integrates with existing upload system
- [ ] Subscription status correctly displayed with billing portal access

### Phase 2 Success Criteria  
- [ ] Fan can discover and RSVP to confirmed concerts
- [ ] Host receives and can manage RSVP requests
- [ ] Approved fans automatically receive venue address
- [ ] Concert capacity limits properly enforced

### Phase 3 Success Criteria
- [ ] Fan can submit reviews using existing modal components
- [ ] Reviews are stored and displayed correctly
- [ ] Fan can browse artist directory and send messages
- [ ] Artist booking requests properly restricted

### Phase 4 Success Criteria
- [ ] Comprehensive billing management interface  
- [ ] Personalized concert recommendations based on history
- [ ] Favorite artists/venues tracking functional
- [ ] Advanced search and filtering working

---

## Risk Mitigation

### Technical Risks
- **Database Migration**: Test schema changes on development data first
- **Payment Integration**: Ensure fan billing changes don't affect existing Stripe setup
- **Performance**: Monitor RSVP query performance with realistic data volumes

### User Experience Risks  
- **Access Control**: Thoroughly test fan restrictions (no host directory, no booking creation)
- **RSVP Flow**: Validate complete flow from request → approval → address sharing
- **Mobile Experience**: Ensure fan portal is fully mobile-responsive

---

## Implementation Notes

- **Start Point**: Begin with Phase 1 database migrations and basic fan dashboard
- **Testing Strategy**: Use existing `realTestData.ts` fan profiles for comprehensive testing
- **Deployment**: Each phase can be deployed independently without breaking existing functionality
- **Documentation**: Update existing API documentation as new endpoints are created

---

*This plan leverages TourPad's excellent existing foundation. Most work involves building fan-facing UI and connecting existing components to new backend APIs rather than creating complex new systems.*