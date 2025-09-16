# TourPad Documentation Index

## Complete Reverse Sitemap & Codebase Analysis

This documentation provides a comprehensive reverse sitemap of the entire TourPad codebase, mapping all user flows, routes, and system interactions.

---

## 📚 Documentation Structure

### 1. **[SITEMAP.md](./SITEMAP.md)** - Complete Route & Flow Mapping
*The master document showing all 54 pages and user access patterns*

**Contents:**
- Complete route inventory (54 pages organized by category)
- User access matrix by type and status
- Authentication flow documentation
- Dashboard routing logic
- Complete user journey overview

**Use When:** You need to understand the complete site structure or find a specific route

---

### 2. **[USER_JOURNEYS.md](./USER_JOURNEYS.md)** - Detailed User Path Documentation
*Step-by-step user flows for all user types with decision points and error states*

**Contents:**
- Artist journey (Discovery → Registration → Approval → Payment → Active Use)
- Host journey (Discovery → Registration → Approval → Active Hosting)
- Fan journey (Discovery → Payment → Concert Participation)
- Admin journey (Application Review → Platform Management)
- Cross-user interactions and error handling

**Use When:** You need to understand how users move through the system or debug user flow issues

---

### 3. **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Complete API Reference
*All 65 API endpoints with parameters, responses, and frontend integrations*

**Contents:**
- Authentication APIs (NextAuth, registration)
- User management APIs (profiles, user data)
- Booking & concert APIs (booking flow, RSVP system)
- Messaging APIs (real-time messaging, conversations)
- Payment & subscription APIs (Stripe integration)
- Admin APIs (application review, platform management)
- Music platform APIs (Spotify, SoundCloud integration)
- Geographic & discovery APIs (host/artist discovery)

**Use When:** You need to understand API functionality or integrate with specific endpoints

---

### 4. **[VISUAL_FLOWS.md](./VISUAL_FLOWS.md)** - ASCII Flow Diagrams
*Visual representations of key user journeys and system interactions*

**Contents:**
- Complete platform overview diagram
- Artist journey visual flow
- Host journey visual flow
- Fan journey visual flow
- Cross-user interaction diagrams
- Authentication & status flow charts

**Use When:** You need a visual understanding of user flows or want to explain the system to others

---

## 🎯 Quick Reference Guides

### Find a Specific Route
1. Check **SITEMAP.md** → Route Inventory section
2. Routes are categorized by type (Public, Dashboard, Admin, etc.)
3. Each route includes purpose and frontend integration notes

### Understand User Flow Issues
1. Start with **USER_JOURNEYS.md** for the specific user type
2. Check **VISUAL_FLOWS.md** for visual representation
3. Reference **SITEMAP.md** for authentication requirements

### Debug API Integration
1. Find the endpoint in **API_ENDPOINTS.md**
2. Check parameters, response format, and frontend integration
3. Review authentication requirements and error handling

### Explain System to Others
1. Start with **VISUAL_FLOWS.md** → Complete Platform Overview
2. Use specific journey diagrams for detailed explanations
3. Reference **SITEMAP.md** for comprehensive route understanding

---

## 🔍 Key System Insights

### User Types & Status Flow
```
ARTISTS:  Registration → Admin Approval → Payment ($400/year) → Active
HOSTS:    Registration → Admin Approval → Active (no payment)
FANS:     Registration → Payment ($10/month) → Active (no approval)
ADMINS:   Direct access to all platform features
```

### Authentication Architecture
- **Public Routes:** 19 routes accessible to all users
- **Protected Routes:** Require authentication and proper status
- **Role-Based Access:** Different dashboard experiences by user type
- **Status-Based Gating:** Pending users see holding pages, active users get full access

### Core Platform Features
- **Real-time Messaging:** 30-second polling with safe rate limiting
- **Booking System:** Complete workflow from request to completion
- **Music Integration:** Spotify & SoundCloud API integration
- **Payment System:** Stripe integration with webhook handling
- **Geographic Discovery:** Privacy-conscious location mapping
- **RSVP System:** Fan attendance management for house concerts

---

## 🛠 Development Context

### File Organization
```
/docs/
├── README.md          # This index file
├── SITEMAP.md         # Complete route mapping
├── USER_JOURNEYS.md   # Detailed user flows
├── API_ENDPOINTS.md   # Complete API reference
├── VISUAL_FLOWS.md    # ASCII flow diagrams
└── DATABASE_BACKUP.md # Database backup system docs
```

### Database Architecture
- **18 Models:** Complete schema in `/memory-bank/ARCHITECTURE.md`
- **Two Data Sources:** mockData.ts (UI) and realTestData.ts (auth)
- **ID Mapping:** Database uses Prisma cUIDs, mock data uses simple IDs

### Current System Status
According to `/memory-bank/PROJECT_STATUS.md`:
- ✅ All critical systems operational
- ✅ Zero TypeScript compilation errors
- ✅ Real-time messaging fully functional
- ✅ Payment system integrated and tested
- ✅ 23 total users (9 artists, 9 hosts, 5 fans)

---

## 📊 Platform Statistics

### Route Breakdown
- **54 Total Pages:** Complete frontend coverage
- **65 API Endpoints:** Full backend functionality
- **4 User Types:** Artist, Host, Fan, Admin with distinct experiences
- **3 Status States:** Pending, Approved/Active with different access levels

### Feature Coverage
- **Authentication:** Google OAuth with NextAuth.js
- **Payments:** Stripe integration for artists ($400/year) and fans ($10/month)
- **Messaging:** Real-time communication with file attachments
- **Bookings:** Complete booking workflow with status management
- **Music:** Spotify & SoundCloud integration with direct uploads
- **Geographic:** Map-based discovery with privacy protection
- **Reviews:** Community reputation and feedback system

---

## 💡 Usage Tips

### For Developers
- Use **API_ENDPOINTS.md** as your API reference
- Check **USER_JOURNEYS.md** for authentication flow debugging
- Reference **SITEMAP.md** for route protection patterns

### For Product Managers
- **VISUAL_FLOWS.md** provides clear user journey visualization
- **USER_JOURNEYS.md** shows detailed user experience flows
- **SITEMAP.md** gives complete feature inventory

### For QA Testing
- **USER_JOURNEYS.md** includes error states and edge cases
- **SITEMAP.md** shows all routes that need testing
- **API_ENDPOINTS.md** provides API testing parameters

### For Documentation Updates
- Update **SITEMAP.md** when adding new routes
- Update **USER_JOURNEYS.md** when changing user flows
- Update **API_ENDPOINTS.md** when adding/modifying APIs

---

This reverse sitemap documentation provides complete visibility into the TourPad platform architecture, user flows, and system interactions. Use it as your comprehensive reference for understanding how the entire application works together.