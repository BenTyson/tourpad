# TourPad System Patterns & Architecture

## Architecture Patterns

### 1. Frontend-First Development
- Build complete UI with mock data before backend implementation
- Enables rapid prototyping and UI/UX refinement
- Mock data structure defines eventual API contracts

### 2. Component Architecture
```
/src/components/
├── common/          # Shared components (Button, Card, Badge)
├── dashboard/       # Dashboard-specific components
├── forms/           # Form components with validation
├── layout/          # Navigation, Footer, Layout wrappers
├── media/           # Media upload and display components
└── search/          # Search and filter components
```

### 3. Route Organization (App Router)
```
/src/app/
├── (auth)/          # Auth-required routes
├── admin/           # Admin-only routes
├── api/             # API routes
├── artists/         # Public artist views (gated access)
├── dashboard/       # User dashboards (artist/host/fan-specific)
├── hosts/           # Public host views (gated access)
├── concerts/        # Concert discovery (fan-focused)
└── onboarding/      # User onboarding flows
```

## Design Patterns

### 1. Role-Based Access Control (RBAC)
```typescript
// User types: 'artist' | 'host' | 'fan' | 'admin'
// Status types: 'pending' | 'approved' | 'suspended' | 'rejected' | 'active' | 'payment_expired'
// Access determined by combination of type + status
```

### 2. Gated Access Model
- Public pages show teasers only (no real user data)
- **Artists/Hosts**: Application → Approval → Payment (artists) → Full Access
- **Fans**: Registration → Direct Payment → Immediate Access
- Conditional UI rendering based on user.status and user.type

### 3. Form Validation Pattern
```typescript
// 1. Define Zod schema
const schema = z.object({...})

// 2. Use with React Hook Form
const form = useForm({
  resolver: zodResolver(schema)
})

// 3. Handle submission with error boundaries
try {
  const validatedData = schema.parse(formData)
  // Process data
} catch (error) {
  // Handle validation errors
}
```

### 4. Mock Data Strategy
- Centralized mock data in `/src/data/mockData.ts`
- Realistic test data in `/src/data/realTestData.ts`
- TODO comments mark future API integration points

### 5. Media Management Pattern
- Categorized uploads (performance, band, venue photos)
- Artist-specific photo types: 'performance' | 'band'
- Host-specific photo types: 'house' | 'exterior' | 'performance_space'
- Custom photo gallery components for each role (ArtistPhotoGallery, PhotoGallery)
- Lightbox components with keyboard navigation (ArtistPhotoLightbox, PhotoLightbox)
- Simplified CSS structure to prevent black box display issues
- Drag-and-drop with preview
- Mock upload simulation before backend

### 6. Dashboard Pattern
- Role-specific dashboards (`/dashboard`)
- Metric cards for key stats
- Tabbed interfaces for different sections
- Real-time data simulation with mock data

### 7. Notification System
- In-app notification center (not push)
- Types: booking, message, account, platform
- Badge counts for unread items

## State Management

### 1. Session State
- NextAuth for authentication state
- JWT tokens with user type and status
- 30-day session duration

### 2. Form State
- React Hook Form for form management
- Local state for multi-step forms
- Session storage for form persistence

### 3. UI State
- useState for component-level state
- URL params for search/filter state
- No global state management (yet)

## API Design (Planned)

### 1. RESTful Endpoints
```
GET    /api/artists      # List artists (filtered by status)
GET    /api/artists/:id  # Get artist details
POST   /api/bookings     # Create booking request
PUT    /api/bookings/:id # Update booking status
```

### 2. Protected Routes
- Middleware checks user.type and user.status
- Admin endpoints require admin role
- Artist/host data requires approved status

## Security Patterns

### 1. Data Privacy
- No real user data in public views
- Email/phone revealed only after booking confirmation
- Address approximation for hosts (city level only)

### 2. Input Validation
- Client-side validation with Zod
- Server-side validation (planned)
- Sanitization for all user inputs

### 3. Payment Security
- Stripe integration for payment processing
- No credit card data stored locally
- Webhook validation for payment events

## UI/UX Patterns

### 1. Enhanced Profile Page Design System
- Clean white backgrounds replacing gradient designs
- Consistent color palette (Rose, Sage, Neutral earth tones)
- Professional hero sections with featured content
- Sticky navigation bars with backdrop blur effects
- Social media integration with platform-specific styling
- Venue/artist details cards with gradient accents
- Responsive photo galleries with grid layouts
- Professional lightbox implementations
- Mobile-first responsive design throughout
- Accessible color contrasts maintained
- Warm, intimate feeling matching house concerts

### 2. Progressive Disclosure
- Simple application forms → Detailed profiles
- Expanding cards for additional info
- Multi-step forms for complex processes

### 3. Mobile-First Responsive
- Tailwind breakpoints: sm, md, lg, xl, 2xl
- Touch-friendly interfaces
- Optimized for phone booking flows

### 4. Loading & Error States
- Skeleton loaders for data fetching
- Clear error messages with recovery actions
- Form validation feedback inline

## Development Patterns

### 1. TypeScript Everywhere
- Strict type checking
- Interface definitions for all data models
- Type-safe API contracts

### 2. Component Composition
```typescript
// Prefer composition over inheritance
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>{content}</CardContent>
</Card>
```

### 3. Utility-First CSS (Tailwind)
- No separate CSS files
- Component-specific styles inline
- Custom utilities in globals.css

### 4. Error Boundaries
- Try-catch blocks for async operations
- User-friendly error messages
- Logging for debugging (remove for production)

---
*Last Updated: 2025-07-14*
*Note: These patterns guide consistent development across all features*