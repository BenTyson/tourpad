# TourPad Development Roadmap

## Project Overview
TourPad is a Next.js-based platform connecting touring musicians with hosts for intimate house concerts and small shows. The platform uses a **gated access model** where artists and hosts must apply and be approved before accessing the community, with artists requiring additional payment verification. The public site serves as a teaser to generate interest without revealing actual user information. Currently in active development with a solid frontend foundation using mock data, preparing for backend integration.

## Current Status
- ✅ **Frontend Foundation Complete**: Comprehensive UI components, routing, and layouts
- ✅ **Artist Media Management**: Full upload, categorization, and management system
- ✅ **Enhanced Artist Profile Pages**: Professional layout with social links, photo galleries, and clean design
- ✅ **Enhanced Homepage**: Compelling dual-path design with immersive mission section and strategic imagery
- ✅ **Booking Workflow UI**: Complete booking request and approval interface
- ✅ **Dashboard System**: Role-based dashboards for artists and hosts
- ✅ **Mock Data Infrastructure**: Rich data models for testing and development
- ✅ **Host Media Management**: Complete dashboard and upload functionality
- ✅ **Access Control & Registration**: Complete UI architecture with streamlined forms
- ❌ **Backend Integration**: All features currently use mock data

## Technology Stack
- **Frontend**: Next.js 15.3.5, React 19, TypeScript, Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation
- **UI**: Headless UI, Heroicons, custom component library
- **Backend**: TBD (needs implementation)
- **Database**: TBD (needs implementation)
- **File Storage**: TBD (needs implementation)

## Current Working State (Last Updated: 2025-07-15)
- **Server Status**: ✅ Working on localhost:3000 (commit c10557e with critical server fixes)
- **Form Validation**: ✅ Complete with comprehensive Zod schemas for all forms
- **Design System**: ✅ Updated to periwinkle & sage color palette with modern Lucide icons
- **Enhanced Homepage**: ✅ Complete with dual-path design, strategic imagery, and immersive mission section
- **Host Media Management**: ✅ Complete dashboard and upload functionality
- **Access Control UI Architecture**: ✅ Complete with status pages and conditional navigation
- **Artist Registration**: ✅ Streamlined with tag-based genre selection and optional video
- **Enhanced Artist Profile Pages**: ✅ Complete with social links, photo galleries, and professional layout
- **Enhanced Host Profile Pages**: ✅ Complete with same design treatment, venue details, and booking flow
- **Enhanced Search**: ❌ Reverted due to server issues - needs reimplementation
- **Current Priority**: Backend Integration Foundation (API setup and database design)

## Key File Locations
- **Validation schemas**: `/src/lib/validation.ts`
- **Mock data**: `/src/data/mockData.ts`
- **Real test data**: `/src/data/realTestData.ts`
- **Color system**: `/src/app/globals.css`
- **NextAuth config**: `/src/app/api/auth/[...nextauth]/route.ts`

## Development Commands
- **Start server**: `npm run dev` (runs on localhost:3000)
- **Git status**: Working clean on main branch
- **Last working commit**: 971aca3 (restored from git stash)

---

## Phase 1: Complete Frontend with Mock Data

### 🎯 Immediate Priority A: Application/Approval System
- [x] **Streamlined Artist Registration Form**
  - [x] Implement tag-based genre selection system (matching profile editor)
  - [x] Make performance video URL optional (preferred)
  - [x] Update field labels and descriptions for clarity
  - [x] Add asterisk system for required fields consistency
  - [x] Remove specific dollar amounts from "What happens next?"
  - [x] Update validation to require at least 1 genre selection
  - [ ] Split into minimal application vs detailed profile (post-approval)
  - [ ] Create payment gateway integration for approved artists

- [x] **Admin Dashboard for Application Review**
  - [x] Create admin application review interface
  - [x] Implement approve/deny workflow with templates
  - [ ] Add follow-up questions system for clarification requests
  - [ ] Build user status management (pending/approved/payment_required/active)

- [ ] **Comprehensive TourPad Admin Dashboard** 🔥 **NEW CRITICAL PRIORITY**
  - [ ] **Platform Overview & Analytics**
    - [ ] Real-time platform metrics dashboard (users, bookings, revenue)
    - [ ] Growth analytics and conversion tracking
    - [ ] Performance KPIs and satisfaction scores
    - [ ] Financial overview with revenue tracking
  - [ ] **User Management System**
    - [ ] Complete artist management interface (approval, payments, profiles)
    - [ ] Host management with venue verification tracking
    - [ ] User activity monitoring and engagement metrics
    - [ ] Account status management (suspend, activate, ban)
  - [ ] **Booking & Event Oversight**
    - [ ] Platform-wide bookings dashboard with status tracking
    - [ ] Event monitoring and capacity management
    - [ ] Booking dispute resolution interface
    - [ ] Calendar overview for platform-wide scheduling
  - [ ] **Payment & Financial Management**
    - [ ] Artist payment tracking ($400 annual fees, renewals)
    - [ ] Revenue analytics and payment method breakdown
    - [ ] Failed payment management and retry mechanisms
    - [ ] Financial reporting and tax compliance tools
  - [ ] **Platform Operations Center**
    - [ ] System health monitoring and error tracking
    - [ ] Content moderation and media approval workflow
    - [ ] Feature flag management for A/B testing
    - [ ] Maintenance scheduling and user notifications
  - [ ] **Support & Communication Hub**
    - [ ] Support ticket management with priority queuing
    - [ ] Platform announcement broadcast system
    - [ ] Email campaign management interface
    - [ ] Communication logs and admin intervention tracking
  - [ ] **Reports & Business Intelligence**
    - [ ] Custom reporting tools with date/geographic filters
    - [ ] Export capabilities (CSV/PDF) for external analysis
    - [ ] Performance benchmarking against business goals
    - [ ] Trend analysis for growth patterns and seasonality
  - [ ] **Security & Compliance Management**
    - [ ] User verification tracking (ID checks, background verification)
    - [ ] Security incident management and fraud detection
    - [ ] Data privacy compliance (GDPR, data deletion requests)
    - [ ] Comprehensive audit logs for all admin actions
  - [ ] **Configuration & Settings Management**
    - [ ] Platform settings (pricing, features, policies)
    - [ ] Geographic expansion tools (new city/region activation)
    - [ ] Third-party integration management
    - [ ] Automated workflow rules and approval criteria

- [ ] **Host Application System**
  - [ ] Design host application form (venue basics, preferences)
  - [ ] Create host approval workflow
  - [ ] Build host profile completion system

### 🎯 Immediate Priority B: Core Features
- [x] **Host Media Management Dashboard**
  - [x] Create `/dashboard/media/` page for host venue photos
  - [x] Implement photo upload and categorization interface
  - [x] Add venue-specific categories (exterior, performance space, amenities, etc.)
  - [x] Test host media workflow end-to-end

- [x] **Dashboard Notification System**
  - [x] Create in-dashboard notification center (not push notifications)
  - [x] Implement notification types: bookings, messages, account, platform
  - [x] Add unread count badges and action buttons
  - [x] Build notification preferences system

### 🔧 Frontend Polish
- [x] **Form Validation & Error Handling**
  - [x] Add Zod schemas for all forms
  - [x] Implement client-side validation
  - [x] Add error state management
  - [x] Create validation for emails, passwords, phone numbers
  - [x] Implement comprehensive validation for registration form
  - [x] Implement comprehensive validation for artist onboarding form
  - [x] Implement comprehensive validation for host onboarding form
  - [x] Add consistent error display patterns across all forms
  - [x] Add loading states and try-catch blocks to all form submissions

- [x] **Access Control UI Architecture**
  - [x] Create approval status pages (/account/status, /pending-approval, /unauthorized)
  - [x] Implement conditional dashboard access based on approval + payment status
  - [x] Add status-based alerts and payment prompts in dashboard
  - [x] Implement conditional navigation based on user access level
  - [x] Design middleware redirect pages for restricted access
  - [x] Design public landing/teaser pages (separate artist/host sections)
  - [x] Create compelling value propositions and CTAs

- [ ] **Enhanced Search & Filtering (Airbnb-style)** ⚠️ *REVERTED DUE TO SERVER ISSUES*
  - [ ] Build advanced search interface with location radius
  - [ ] Add filters: capacity, venue type, equipment, lodging, genres
  - [ ] Create smart filter presets ("Weekend Warrior", "Intimate Acoustic")
  - [ ] Implement comprehensive filtering system for artists and hosts
  - [ ] Add multiple view modes (Grid, List, Map placeholder)
  - [ ] Add advanced sort options (relevance, rating, distance, price, newest)
  - [ ] Create reusable search components (AdvancedSearchFilter, SearchResults)
  - [x] Update mock data with additional fields for enhanced filtering (preserved in stash)
  - [ ] Implement enhanced search pages at /artists/enhanced and /hosts/enhanced
  - [ ] Implement map integration with address privacy (Mapbox recommended)

- [x] **Design System Overhaul**
  - [x] Update color palette from blue/purple to warm earth tones
  - [x] Implement new palette: Rose (#C7999F), Beige (#E0BCA8), Neutral (#E1E1E1), Sage Light (#A1CCAD), Sage Deep (#8BB097)
  - [x] Update Tailwind CSS configuration with new color tokens
  - [x] Redesign components (buttons, cards, badges) with new palette
  - [x] Update gradients and accent colors throughout application
  - [x] Ensure accessibility compliance with new color combinations

- [x] **Enhanced Artist Profile Pages**
  - [x] Remove gradient backgrounds for cleaner white design
  - [x] Add music and website links section with platform-specific styling
  - [x] Integrate mock photos and videos with proper display
  - [x] Add profile pictures for band members instead of icons
  - [x] Fix photo gallery thumbnail display issues
  - [x] Implement proper ArtistPhotoGallery and ArtistPhotoLightbox components
  - [x] Create responsive layout with social media integration
  - [x] Add hover effects and professional styling throughout

- [x] **Enhanced Host Profile Pages**
  - [x] Apply same clean white design treatment as artist profiles
  - [x] Create hero section with venue details and featured photos grid
  - [x] Add venue details cards with capacity, show length, and availability
  - [x] Implement amenities section with emoji icons and visual indicators
  - [x] Integrate full photo gallery with lightbox functionality
  - [x] Create host profile section with contact options and experience details
  - [x] Add booking information section with clear next steps and CTAs
  - [x] Maintain consistent design patterns with artist profile pages

- [ ] **Production Cleanup**
  - [ ] Remove all console.log statements (especially dashboard date filtering debug)
  - [ ] Clean up debug code in dashboard date filtering
  - [ ] Remove demo role switching functionality
  - [ ] Replace placeholder content with proper messaging
  - [ ] Review and clean TODO comments throughout codebase

---

## Phase 2: Backend Foundation

### 🗄️ Database & API Setup
- [ ] **Database Design**
  - [ ] Design schema for users, bookings, media, messages
  - [ ] Add application/approval status tracking tables
  - [ ] Add payment verification status for artists
  - [ ] Choose database technology (PostgreSQL recommended)
  - [ ] Set up migrations and ORM (Prisma/Drizzle recommended for Next.js)
  - [ ] Create seed data scripts

- [ ] **API Infrastructure**
  - [ ] Set up Next.js API routes or separate backend
  - [ ] Implement core CRUD operations
  - [ ] Add API middleware for logging and error handling
  - [ ] Create API documentation

### 🔐 Authentication & Access Control System
- [ ] **User Management**
  - [ ] Implement registration and login endpoints
  - [ ] Add JWT token or session-based authentication
  - [ ] Create protected route middleware
  - [ ] Implement role-based access control (artist/host)
  - [ ] Add password reset functionality

- [ ] **Gated Access Implementation**
  - [ ] Create application approval workflow for hosts
  - [ ] Implement artist application + payment verification workflow
  - [ ] Add admin approval interface for reviewing applications
  - [ ] Create middleware to restrict artist/host browsing based on status
  - [ ] Implement conditional UI rendering based on access levels

### ☁️ File Storage & Media
- [ ] **Cloud Storage Integration**
  - [ ] Set up cloud storage (AWS S3, Cloudinary, or Vercel Blob)
  - [ ] Implement real file upload processing
  - [ ] Add image optimization and resizing
  - [ ] Create CDN integration for fast media delivery
  - [ ] Add file validation and security

---

## Phase 3: Core Feature Implementation

### 📅 Booking System Backend
- [ ] **Booking Workflow**
  - [ ] Replace TODO comments with real API calls
  - [ ] Implement booking request creation and approval
  - [ ] Add email notifications for status changes
  - [ ] Create calendar availability system
  - [ ] Add booking conflict detection

### 💳 Payment Integration
- [ ] **Stripe Integration** (Foundation already exists)
  - [ ] Set up Stripe accounts and API keys
  - [ ] Connect existing payment pages to real Stripe API
  - [ ] Implement artist access payment verification system ($400/year)
  - [ ] Add subscription management with 7-day grace period
  - [ ] Handle failed payment recovery workflow
  - [ ] Build payment dashboard and billing history

### 💬 Communication System (Airbnb Model)
- [ ] **Platform-Contained Messaging**
  - [ ] Build message threading system (inquiry → response → booking → coordination)
  - [ ] Create template-based messaging for common interactions
  - [ ] Implement contact info reveal only after booking confirmation
  - [ ] Add auto-prompts to keep conversations on-platform
  - [ ] Build 48-hour response time tracking with reminders

---

## Phase 4: Premium Features & Advanced Tools

### 🗺️ Tour Planning Premium Feature
- [ ] **Core Tour Builder** (Premium add-on with pricing placeholder)
  - [ ] Interactive map for multi-city tour planning
  - [ ] Date range planning with calendar interface
  - [ ] Batch booking requests to multiple hosts
  - [ ] Route optimization and travel day planning
  - [ ] Tour profitability calculator

- [ ] **Advanced Tour Tools**
  - [ ] Market intelligence ("Austin has 15 available hosts, 80% response rate")
  - [ ] Automated follow-up system for host responses
  - [ ] Tour analytics and success rate tracking
  - [ ] Integration with existing booking workflow

### 🎵 Music Industry Features
- [ ] **Genre & Discovery System**
  - [ ] Spotify-style genre tagging system
  - [ ] Host genre preference matching
  - [ ] Smart artist recommendations
  - [ ] Audio sample integration for artist profiles

### ⚡ Advanced Features

### ⚡ Real-time Features
- [ ] **WebSocket Integration**
  - [ ] Set up WebSocket server for live updates
  - [ ] Implement real-time booking notifications
  - [ ] Add live message delivery
  - [ ] Create online status indicators

### 🔒 Security & Production Readiness
- [ ] **Security Hardening**
  - [ ] Add input validation and sanitization
  - [ ] Implement CSRF protection
  - [ ] Add rate limiting for API endpoints
  - [ ] Set up environment configuration
  - [ ] Create secrets management system

### ⚡ Performance Optimization
- [ ] **Performance Enhancements**
  - [ ] Implement image lazy loading
  - [ ] Add Redis caching for frequently accessed data
  - [ ] Optimize database queries
  - [ ] Set up CDN for static assets
  - [ ] Add service worker for offline functionality

---

## Phase 5: Launch Preparation

### 🚀 Deployment & Infrastructure
- [ ] **Production Setup**
  - [ ] Set up production hosting (Vercel recommended for Next.js)
  - [ ] Configure production database
  - [ ] Set up monitoring and logging
  - [ ] Create backup and recovery procedures
  - [ ] Add error tracking (Sentry)

### 📊 Analytics & Monitoring
- [ ] **User Analytics**
  - [ ] Implement user behavior tracking
  - [ ] Add booking conversion metrics
  - [ ] Create admin analytics dashboard
  - [ ] Set up performance monitoring

---

## Current TODO Items (Tracked in Development)

### High Priority
- [ ] Implement host media management dashboard and upload functionality
- [ ] Plan and implement backend API integration for core features
- [ ] Implement authentication and user session management
- [ ] Complete booking system backend integration
- [ ] Set up cloud file storage for media uploads

### Medium Priority
- [ ] Add comprehensive form validation and error handling
- [ ] Integrate Stripe payment system
- [ ] Design and implement database schema and ORM
- [ ] Implement security features (input validation, CSRF protection, etc.)

### Low Priority
- [ ] Implement real-time messaging and notifications
- [ ] Remove debug logs and prepare for production deployment
- [ ] Optimize images, add lazy loading, implement caching

---

## Known Technical Debt

### Critical Issues to Address
1. **No Error Handling**: Zero try-catch blocks throughout application
2. **Mock Data Dependency**: All features currently use static mock data
3. **Missing Validation**: Only basic HTML validation, no client-side logic
4. **Debug Code**: Extensive console.log statements need removal
5. **Incomplete Media Upload**: File upload simulation only, no real backend
6. **Security Gaps**: No input sanitization, CSRF protection, or rate limiting
7. **Open Access Current State**: All artist/host data currently visible - needs gated access implementation

### Backend Integration Points
These files contain TODO comments that need backend implementation:
- `/src/app/bookings/new/page.tsx:62` - Submit booking request
- `/src/app/bookings/[id]/page.tsx:55,66` - Booking approval/rejection
- `/src/app/register/page.tsx:24` - User registration
- `/src/app/onboarding/artist/page.tsx:67` - Artist onboarding submission
- `/src/app/onboarding/host/page.tsx:62` - Host onboarding submission
- `/src/app/subscription/page.tsx:43,48` - Stripe subscription management

---

## Development Guidelines

### Code Quality Standards
- Always use TypeScript for type safety
- Follow existing component patterns and naming conventions
- Maintain responsive design with mobile-first approach
- Use existing UI components from the design system
- Write comprehensive form validation with Zod schemas

### Testing Strategy
- Test components with mock data during frontend development
- Create integration tests for API endpoints when backend is implemented
- Add end-to-end tests for critical user flows (booking, registration)
- Test file upload functionality with various file types and sizes

### Documentation
- Update this roadmap as features are completed
- Document API endpoints as they are implemented
- Maintain component documentation for the UI library
- Create deployment and setup guides for production

---

## Notes & Decisions

### Architecture Decisions
- **Next.js App Router**: Using modern App Router for better performance and developer experience
- **Tailwind CSS v4**: Latest version for improved styling capabilities
- **Mock Data Strategy**: Building complete frontend first, then replacing with real data
- **Component Library**: Custom UI components for consistency across the application
- **Gated Access Model**: Strategic decision to keep artist/host data private until approval + payment verification
- **Public Teaser Strategy**: Public pages designed to generate interest without revealing sensitive community information
- **Three-Stage User Journey**: Application → Approval + Payment → Full Profile (reduces application abandonment)
- **Payment-After-Approval**: $400/year artist fee only charged after human approval
- **Communication Containment**: Airbnb-style messaging to retain users on platform
- **Dashboard Notifications**: In-app notification center rather than push notifications
- **Mapbox Integration**: Better privacy controls and customization for address hiding
- **Hybrid Video Strategy**: YouTube/Vimeo URLs for applications, direct uploads for profiles
- **48-Hour Response Standard**: Industry-appropriate timeframe with automated reminders
- **Warm Earth Tone Palette**: Moving from blue/purple to rose/beige/sage for more intimate, organic feel

### Future Considerations
- **Mobile App**: Consider React Native or PWA for mobile experience
- **Internationalization**: Plan for multi-language support
- **Advanced Search**: Elasticsearch for complex venue and artist search
- **Video Streaming**: Consider video streaming service for performance videos
- **Social Features**: User reviews, ratings, and social sharing

---

---

## 🚀 Implementation Strategy Summary

### **Phase Priority Order:**
1. **Design System Overhaul** - New warm earth tone palette and component redesign
2. **Application/Approval System** - Critical for gated access model with new visual identity
3. **Host Media Management** - Complete feature parity with artists
4. **Backend Integration** - Replace mock data with real functionality
5. **Premium Features** - Tour planning tools and advanced matching

### **Key Technical Decisions Made:**
- **User Flow**: Application (minimal) → Approval → Payment → Full Profile (detailed)
- **Admin Review**: Human approval with follow-up questions capability
- **Payment Model**: $400/year for artists, free for hosts (for now)
- **Communication**: Platform-contained messaging with Airbnb-style retention
- **Response Times**: 48-hour standard with automated reminders
- **Tour Planning**: Premium add-on with placeholder pricing during development
- **Notifications**: Dashboard-based notification center, not push notifications

### **Streamlined Application Data Models:**

**Artist Application (Stage 1) - Minimal & Focused:**
```typescript
interface ArtistApplication {
  bio: string; // Character limit (300-500 chars)
  performanceVideoUrl: string; // YouTube/Vimeo live performance
  musicProfileUrl: string; // Spotify or Apple Music artist profile
  socialLinks: {
    facebook?: string;
    instagram?: string;
  };
  pressPhoto: File; // Single high-quality press photo upload
  genre: string; // Primary genre selection
}
```

**Host Application (Stage 1) - Streamlined Essentials:**
```typescript
interface HostApplication {
  location: string; // City, State format
  estimatedAttendance: number; // Average attendance at their concerts
  concertSpacePhotos: File[]; // Photo(s) of concert space
  hostingMotivation: string; // "What do you enjoy most about hosting house concerts?"
  additionalInfo?: string; // "Is there anything else you would like to let us know?" (optional)
}
```

### **Next Critical Implementations:**
1. **Backend Foundation** - Database design and API setup for real data integration
2. **Payment Integration** - Stripe setup for artist membership ($400/year) and subscription management
3. **Authentication System** - NextAuth integration with user session management
4. **Public Landing Pages** - Design compelling artist/host value propositions with earth tone branding
5. **Enhanced Search Reimplementation** - Carefully rebuild advanced filtering without server issues

---

*Last Updated: 2025-07-13*
*Next Review: After implementing backend foundation*