# Project: Setup Environment

<instructions>
  <context>
    Initialize and validate the TourPad development environment. This command ensures all dependencies are installed, environment variables are configured, and the development server can start successfully.
  </context>
  
  <requirements>
    - Node.js 18+ installed
    - npm or yarn package manager
    - Git repository initialized
    - Environment variables configured (.env files)
  </requirements>
  
  <execution>
    1. Check Node.js version compatibility
    2. Install dependencies: `npm install`
    3. Verify environment variables exist
    4. Run type checking: `npm run type-check`
    5. Run linting: `npm run lint`
    6. Start development server: `npm run dev`
    7. Verify server starts on localhost:3000
    8. Check all core TourPad pages load correctly
  </execution>
  
  <validation>
    - All dependencies installed successfully
    - No TypeScript errors
    - No linting errors
    - Development server starts without errors
    - All core routes (/, /dashboard, /artists, /hosts) accessible
    - Database connection (if applicable) working
  </validation>
  
  <examples>
    Basic setup:
    ```bash
    /project:setup-environment
    ```
    
    Setup with clean install:
    ```bash
    /project:setup-environment --clean
    ```
    
    Setup with specific Node version:
    ```bash
    /project:setup-environment --node-version=18
    ```
  </examples>
</instructions>

## TourPad-Specific Setup

### Current Project Status
- **Frontend Foundation**: ✅ Complete with comprehensive UI components
- **Interactive Map**: ✅ Complete with Leaflet integration and privacy-focused coordinates
- **Gated Access System**: ✅ Gateway pages protecting artist/host directories
- **All User Types**: ✅ Artists, hosts, fans, admin with role-based access
- **Enhanced Profile Pages**: ✅ Professional layouts with social links, photo galleries
- **Mock Data Infrastructure**: ✅ Rich data models for testing and development
- **Backend Integration**: ❌ TBD - all features currently use mock data

### Required Environment Variables
- `NEXTAUTH_URL` - Authentication callback URL
- `NEXTAUTH_SECRET` - Session encryption secret
- `STRIPE_PUBLIC_KEY` - Stripe public key for payments
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `DATABASE_URL` - Database connection string (when backend is implemented)

### Core Dependencies (Current Stack)
- **Next.js 15.3.5** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **React Hook Form + Zod** (form validation)
- **NextAuth.js** (authentication)
- **Stripe** (payments)
- **Leaflet** (interactive maps)
- **Lucide Icons** (updated from Heroicons)

### Verification Steps
1. **Homepage**: Loads with TourPad branding and dual-path design
2. **Authentication**: NextAuth.js login/logout works
3. **User Types**: All dashboards accessible (artist, host, fan, admin)
4. **Gated Access**: Artist/host directories protected by gateway pages
5. **Map Component**: Interactive map renders with Leaflet integration
6. **Profile Pages**: Enhanced layouts with social links and photo galleries
7. **Form Validation**: React Hook Form + Zod schemas working
8. **Payment Flow**: Stripe integration for fan memberships
9. **Media Management**: Upload functionality for artists and hosts
10. **Review System**: Public/private feedback system functional
11. **Booking System**: Complete workflow with approval process

### Data Architecture Validation
- **mockData.ts**: Basic UI display data with numeric IDs ('1', '2', '3')
- **realTestData.ts**: Authentication data with prefixed IDs ('artist1', 'host1', 'fan1')
- **ID Mapping**: Dashboard correctly maps between data sources
- **Map Data**: Privacy-focused coordinates for host locations

### Common Issues to Check
- **Server Status**: Ensure localhost:3000 is accessible
- **Environment Variables**: Check .env.local file exists and is configured
- **Dependencies**: Run `npm install` to ensure all packages are installed
- **TypeScript**: Run `npm run type-check` to verify no type errors
- **Build Process**: Run `npm run build` to ensure production build works
- **Map Issues**: Ensure Leaflet CSS is properly loaded for map rendering