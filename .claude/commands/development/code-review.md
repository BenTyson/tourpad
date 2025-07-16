# Development: Code Review

<instructions>
  <context>
    Perform a comprehensive code review of current changes or specified files in the TourPad codebase. This command analyzes code quality, security, performance, and adherence to TourPad standards.
  </context>
  
  <requirements>
    - Code changes or files to review
    - Understanding of TourPad architecture and patterns
    - Access to existing codebase for comparison
    - Knowledge of React, Next.js, and TypeScript best practices
  </requirements>
  
  <execution>
    1. Analyze code structure and organization
    2. Check TypeScript usage and type safety
    3. Review component patterns and conventions
    4. Validate responsive design implementation
    5. Check security considerations (no secrets, input validation)
    6. Review performance implications
    7. Verify accessibility compliance
    8. Check integration with existing systems
    9. Validate error handling and edge cases
    10. Generate review summary with recommendations
  </execution>
  
  <validation>
    - Code follows TourPad conventions
    - TypeScript types are properly defined
    - Components are reusable and maintainable
    - No security vulnerabilities
    - Performance is optimized
    - Accessibility standards met
    - Error handling is comprehensive
    - Integration points work correctly
  </validation>
  
  <examples>
    Review current changes:
    ```bash
    /dev:code-review
    ```
    
    Review specific file:
    ```bash
    /dev:code-review --file=src/components/map/MapContainer.tsx
    ```
    
    Focus on security:
    ```bash
    /dev:code-review --focus=security
    ```
    
    Review with performance analysis:
    ```bash
    /dev:code-review --focus=performance,security
    ```
  </examples>
</instructions>

## TourPad Code Review Checklist

### TourPad-Specific Architecture
- [ ] Follows Next.js 15.3.5 App Router patterns
- [ ] Uses proper component structure (common/, dashboard/, forms/, layout/, media/, map/, reviews/, bookings/)
- [ ] Implements role-based access control (artist, host, fan, admin)
- [ ] Follows gated access patterns for protected routes
- [ ] Maintains separation between public and dashboard areas

### Data Architecture (CRITICAL)
- [ ] **mockData.ts**: Used for UI display data, simple structures, numeric IDs ('1', '2', '3')
- [ ] **realTestData.ts**: Used for authentication, complex features, prefixed IDs ('artist1', 'host1', 'fan1')
- [ ] **ID Mapping**: Dashboard correctly maps between data sources
- [ ] **Status Handling**: Proper user status validation ('pending', 'approved', 'suspended', etc.)

### TypeScript & Type Safety
- [ ] All functions have proper type annotations
- [ ] No `any` types without justification
- [ ] User types properly defined ('artist' | 'host' | 'fan' | 'admin')
- [ ] Status types properly defined ('pending' | 'approved' | 'suspended' | 'rejected' | 'active' | 'payment_expired')
- [ ] Interface definitions match mockData and realTestData structures

### TourPad Design System (Coastal Color Scheme)
- [ ] **Primary Colors**: French Blue (#8ea58c) - coastal waters
- [ ] **Secondary Colors**: Sage (#738a6e) - calming green  
- [ ] **Coastal Accents**: Mist (#ebebe9), Sand (#d4c4a8), Evergreen (#344c3d)
- [ ] **Typography**: Modern with Lucide icons (not Heroicons)
- [ ] **Mobile-First**: Touch interactions and responsive breakpoints
- [ ] **Form Validation**: React Hook Form + Zod schemas implemented
- [ ] **Component Patterns**: Follows existing TourPad component structure

### Authentication & Access Control
- [ ] **NextAuth.js**: Proper session handling
- [ ] **Role-Based Access**: Different views for each user type
- [ ] **Gated Access**: Gateway pages protect artist/host directories
- [ ] **Payment Integration**: Stripe integration for fan memberships
- [ ] **Status Checks**: Proper validation of user approval status

### Feature-Specific Checks
- [ ] **Map Component**: Leaflet integration with privacy-focused coordinates
- [ ] **Media Management**: Upload functionality with proper validation
- [ ] **Booking System**: Complete workflow with approval process
- [ ] **Review System**: Public/private feedback with dashboard integration
- [ ] **Profile Pages**: Enhanced layouts with social links and photo galleries

### Performance & Optimization
- [ ] **Loading States**: Proper loading indicators for all async operations
- [ ] **Image Optimization**: Next.js Image component usage
- [ ] **Dynamic Imports**: Used for heavy components (map, media)
- [ ] **Bundle Size**: No unnecessary dependencies added
- [ ] **SSR Compatibility**: Components handle server-side rendering

### Security (TourPad-Specific)
- [ ] **Gated Access**: Protected routes properly secured
- [ ] **User Data**: No exposure of real user data in public views
- [ ] **Form Validation**: Zod schemas prevent malicious input
- [ ] **Privacy**: Map coordinates offset for host location privacy
- [ ] **Payment Security**: Stripe integration follows best practices

### Testing Requirements
- [ ] **User Types**: Tests cover all user types and access levels
- [ ] **Data Sources**: Tests verify both mockData and realTestData usage
- [ ] **Mobile Testing**: Responsive behavior validated
- [ ] **Authentication**: Login/logout flows tested
- [ ] **Error Handling**: Edge cases and error states covered

### Current Project Context
- [ ] **Frontend-First**: UI development with mock data before backend
- [ ] **Backend Integration**: Ready for eventual API integration
- [ ] **Map Integration**: Leaflet components properly integrated
- [ ] **Review System**: Public/private feedback system implemented
- [ ] **Enhanced Search**: Consider reimplementation needs after server issues