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

### Required Environment Variables
- `NEXTAUTH_URL` - Authentication callback URL
- `NEXTAUTH_SECRET` - Session encryption secret
- `DATABASE_URL` - Database connection string (if using database)

### Core Dependencies
- Next.js 15.3.5 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- NextAuth.js
- Stripe (for payments)

### Verification Steps
1. Homepage loads with TourPad branding
2. Authentication system works (login/logout)
3. Dashboard accessible for different user types
4. Artist/host listings display correctly
5. Map component renders (if implemented)