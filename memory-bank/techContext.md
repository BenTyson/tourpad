# TourPad Tech Stack & Versions

## Frontend Framework
- **Next.js**: 15.3.5 (App Router)
- **React**: 19
- **TypeScript**: Latest

## Styling & UI Components
- **Tailwind CSS**: v4 (with custom earth tone palette)
- **Headless UI**: Latest (accessible component primitives)
- **Heroicons**: Latest (icon library)
- **Custom Component Library**: In-house built

## Color Palette (Custom Earth Tones)
- **Primary (Rose)**: #C7999F
- **Secondary (Sage)**: #8BB097
- **Neutral**: #E1E1E1
- **Additional**: Beige (#E0BCA8), Sage Light (#A1CCAD)

## Forms & Validation
- **React Hook Form**: Latest
- **Zod**: Latest (schema validation)

## Authentication
- **NextAuth.js**: Latest
- **Strategy**: JWT sessions
- **Provider**: Credentials provider
- **Session Duration**: 30 days

## Payment Processing
- **Stripe**: Latest (payment integration)
- **Subscription Model**: $400/year for artists

## Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Node.js**: Compatible with Next.js 15.3.5

## Data Layer (Current)
- **Mock Data**: `/src/data/mockData.ts` (Basic UI display, simple structures, IDs: '1','2','3')
- **Real Test Data**: `/src/data/realTestData.ts` (Authentication, advanced features, IDs: 'artist1','host1')
- **ID Mapping**: Dashboard maps realTestData sessions to mockData profiles
- **Status**: Frontend-only, no backend yet

## Planned Backend Stack (TBD)
- **Database**: PostgreSQL (recommended)
- **ORM**: Prisma or Drizzle (recommended)
- **File Storage**: AWS S3, Cloudinary, or Vercel Blob
- **API**: Next.js API routes or separate backend

## Deployment
- **Platform**: Vercel (recommended for Next.js)
- **Environment**: Development (localhost:3000)

## Key Technical Decisions
- **App Router**: Using Next.js 15's App Router for better performance
- **TypeScript First**: All components and utilities in TypeScript
- **Mock Data Strategy**: Complete frontend with mock data before backend
- **Component Architecture**: Reusable component library with consistent patterns
- **Validation Strategy**: Zod schemas for all forms with client-side validation

## Browser Requirements
- Modern browsers with ES6+ support
- CSS Grid and Flexbox support
- JavaScript enabled

---
*Last Updated: 2025-07-13*
*Note: This file tracks our technology choices for consistency across development sessions*