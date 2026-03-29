# CLAUDE.md - TourPad Development Rules

## Tech Stack
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + coastal color system (French Blue, Sage, Mist, Sand, Evergreen)
- **Prisma** ORM + **PostgreSQL** (18 models, see `prisma/schema.prisma`)
- **NextAuth.js v5** (Google OAuth + credentials)
- **Stripe** ($400/yr artists, $10/mo fans)
- **React Hook Form + Zod** for all forms
- **Lucide** icons (never emoji in UI)

Do not introduce other libraries unless approved by user.

## Project Structure
```
src/
  app/          # Next.js App Router pages (~50 routes)
    api/        # API routes (~65 endpoints)
    admin/      # Admin dashboard
    dashboard/  # User dashboards (artist, host, fan)
  components/   # React components (~31 directories)
  data/         # Mock data files (see Data Architecture below)
  hooks/        # Custom React hooks
  lib/          # Utilities (auth, prisma, storage, validation)
  types/        # TypeScript type definitions
docs/           # All documentation (see docs/README.md)
prisma/         # Schema + migrations
scripts/        # DB seeds, backups, utilities
```

## Documentation
All docs live in `/docs/`. Key files:
- `docs/STATUS.md` -- current priorities and state
- `docs/ARCHITECTURE.md` -- database, APIs, file storage
- `docs/CONVENTIONS.md` -- code standards and patterns
- `docs/cleanup.md` -- multi-phase cleanup roadmap

## Data Architecture
Two data files with specific purposes:

**`src/data/mockData.ts`** -- UI display data, listings, cards. IDs: `'1'`, `'2'`, `'3'`
**`src/data/realTestData.ts`** -- Auth (`getCurrentUser`), lodging, concerts. IDs: `'artist1'`, `'host1'`

ID mapping: session uses realTestData IDs, UI uses mockData IDs.
Dashboard maps between them: `mockArtists.find(a => a.userId === 'artist1')`

## Development Standards
- Prefer editing existing files over creating new ones
- TypeScript for all new code, match neighboring code style
- All forms must have Zod validation schemas
- Only use `/api/upload/route.ts` for file uploads (JPEG/PNG/WebP, 5MB limit)
- Mobile-first responsive design
- `npm run dev` for local server (localhost:3000)

## Known Issues (Phase 0-1 of cleanup.md)
- Calendar page crash (undefined `calendarDays` variable)
- Message send button non-functional on standalone page
- Footer links to non-existent pages
- No automated tests exist yet
- Console.log calls throughout API routes (cleanup in progress)

## Security
- Gated access model: apply -> approve -> pay -> access
- Never expose real user data in public views
- Validate all form inputs with Zod
- Use shared Prisma instance from `src/lib/prisma.ts` (never `new PrismaClient()`)

## Git
- Don't commit unless asked
- Don't push unless asked
- Conventional commit style
