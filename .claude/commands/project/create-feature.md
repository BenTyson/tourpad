# Project: Create Feature

<instructions>
  <context>
    Create a new feature for TourPad following established patterns and conventions. This command scaffolds the necessary files, components, and tests while maintaining consistency with the existing codebase.
  </context>
  
  <requirements>
    - Feature name specified
    - Understanding of TourPad architecture
    - Existing codebase structure (src/app, src/components, src/data)
    - User type context (artist, host, fan, admin)
  </requirements>
  
  <execution>
    1. Analyze feature requirements and user stories
    2. Review existing similar features for patterns
    3. Create page component in src/app/[feature-name]/
    4. Create supporting components in src/components/[feature-name]/
    5. Update data models in src/data/ if needed
    6. Add navigation links to appropriate layout components
    7. Create basic tests for new components
    8. Update DEVELOPMENT_ROADMAP.md with feature status
    9. Test feature integration with existing system
  </execution>
  
  <validation>
    - Feature follows TourPad design patterns
    - Responsive design (mobile-first)
    - Proper TypeScript typing
    - Follows existing component structure
    - Integrates with authentication system
    - Maintains coastal color scheme (sage, french blue, sand, evergreen)
    - No broken links or navigation issues
  </validation>
  
  <examples>
    Create artist booking feature:
    ```bash
    /project:create-feature artist-booking --type=page
    ```
    
    Create component with tests:
    ```bash
    /project:create-feature notification-system --type=component --with-tests
    ```
    
    Create admin feature:
    ```bash
    /project:create-feature admin-dashboard --user-type=admin
    ```
  </examples>
</instructions>

## TourPad Feature Development Guidelines

### Current Project Status (Key Context)
- **Frontend Foundation Complete**: Comprehensive UI components, routing, layouts
- **Interactive Map Component**: Complete with Leaflet integration and privacy-focused coordinates
- **Gated Access System**: Gateway pages protecting artist/host directories
- **All User Types**: Artists, hosts, fans, admin with role-based access
- **Enhanced Profile Pages**: Professional layouts with social links, photo galleries
- **Mock Data Infrastructure**: Rich data models for testing and development
- **Backend Integration**: TBD - all features currently use mock data

### User Types & Access Control
- **Artists**: Touring musicians ($400/year membership after approval)
- **Hosts**: Venue owners (free membership after approval)  
- **Fans**: Concert attendees (direct paid membership - no approval needed)
- **Admin**: Platform administrators with full access
- **Status Types**: 'pending' | 'approved' | 'suspended' | 'rejected' | 'active' | 'payment_expired'

### Component Architecture
```
/src/components/
├── common/          # Shared components (Button, Card, Badge)
├── dashboard/       # Dashboard-specific components
├── forms/           # Form components with validation
├── layout/          # Navigation, Footer, Layout wrappers
├── media/           # Media upload and display components
├── map/             # Interactive map components (Leaflet)
├── reviews/         # Review system components
└── bookings/        # Booking workflow components
```

### Data Integration (CRITICAL)
- **mockData.ts**: Basic UI display data, artist/host profiles, simple structures
  - IDs: Simple numeric strings ('1', '2', '3')
  - Use for: UI development, listings, core features
- **realTestData.ts**: Authentication system, advanced features, complex structures
  - IDs: Prefixed strings ('artist1', 'host1', 'fan1')
  - Use for: Authentication, lodging system, detailed capabilities
- **ID Mapping**: Dashboard maps between them: `mockArtists.find(a => a.userId === 'artist1')`

### Design System (Coastal Color Scheme)
- **Primary Colors**: French Blue (#8ea58c) - coastal waters
- **Secondary Colors**: Sage (#738a6e) - calming green
- **Coastal Accents**: 
  - Mist (#ebebe9) - light neutral
  - Sand (#d4c4a8) - warm accent
  - Evergreen (#344c3d) - deep green
- **Typography**: Modern with Lucide icons
- **Mobile-First**: Responsive design with touch interactions
- **Form Validation**: React Hook Form + Zod schemas for all forms

### Current Priorities
1. **Backend Integration Foundation**: API setup and database design
2. **Map Component Enhancements**: Tour planning integration
3. **Review System**: Public/private feedback with dashboard integration
4. **Enhanced Search**: Needs reimplementation after server issues

### Testing Requirements
- Test all user types and access levels
- Verify gated access functionality
- Test responsive behavior on mobile
- Validate form submissions with Zod
- Test map component interactions
- Verify ID mapping consistency between data sources