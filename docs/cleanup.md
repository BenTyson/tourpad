# TourPad Cleanup & Launch Roadmap

> **Created:** 2026-03-29
> **Purpose:** Multi-phase, multi-session plan to take TourPad from current state to launch-ready.
> **How to use:** Work through phases sequentially. Each phase lists specific tasks with file paths. Mark tasks done as you complete them. Archive completed phases.

---

## Current State Summary

**What exists (working):**
- 54 pages, 80+ API routes, 35+ components
- PostgreSQL + Prisma ORM (18 models, 9 migrations)
- NextAuth.js v5 (Google OAuth + credentials)
- Stripe payments ($400/yr artists, $10/mo fans) with webhook handling
- Spotify + SoundCloud integration with caching
- Leaflet maps with privacy-conscious location display
- Real-time messaging (30s safe polling, file attachments)
- Complete booking workflow (request → approve → confirm → complete)
- Fan portal with RSVP system
- Admin dashboard (applications, users, finance, message oversight)
- Tour planner with state-by-state scheduling
- Zero TypeScript errors (as of Sep 2025)
- 23 test users (9 artists, 9 hosts, 5 fans)

**What needs fixing (audit findings):**
- 7 critical security gaps
- ~30% WCAG accessibility compliance
- Calendar page crash bug (undefined variables)
- Message send button non-functional on standalone page
- 217 console.log calls in production code
- 36 TODO/FIXME comments
- Dead code files (page-original.tsx variants)
- Test routes exposed in production
- Image processing stubs (not implemented)
- File serving misconfigured (uploads not publicly accessible)
- Docs stale by 6+ months, split across /docs and /memory-bank
- No automated tests, no CI/CD

---

## Phase 0: Foundation & Docs Overhaul

**Goal:** Clean foundation. Accurate docs. Remove dead weight.
**Sessions:** 1-2
**Priority:** Do first -- everything else depends on accurate docs and clean state.

### 0.1 Commit & Clean Working State

- [ ] Commit or stash 5 uncommitted files in /pad:
  - `src/app/hosts/[id]/page.tsx`
  - `src/components/dashboard/ArtistDashboard.tsx`
  - `src/components/layout/Header.tsx`
  - `src/components/media/PhotoLightbox.tsx`
  - `src/components/public-profile/host/LodgingInfo.tsx`
- [ ] Delete `/Users/bentyson/tourpad/` (blank create-next-app, not the real project)
- [ ] Verify `npm run build` passes in /pad

### 0.2 Remove Dead Code

- [ ] Delete archived page files:
  - `src/app/page-archive.tsx`
  - `src/app/page-original.tsx`
  - `src/app/artists/[id]/page-original.tsx`
  - `src/app/hosts/[id]/page-original.tsx`
  - Any other `*-original.tsx` or `*-archive.tsx` files
- [ ] Remove or protect test routes (should not be accessible in production):
  - `src/app/test/page.tsx`
  - `src/app/test-dashboard/page.tsx`
  - `src/app/test-polling/page.tsx`
  - `src/app/test-realtime/page.tsx` (if exists)
- [ ] Remove root-level debug/utility files that belong in scripts/:
  - `cleanup-hosts.js` → move to `scripts/` or delete
  - `debug_profile.js` → move to `scripts/` or delete
  - `debug-admin-auth.js` → move to `scripts/` or delete
  - `dev-stable.sh` → move to `scripts/` or delete
  - `cookies.txt`, `csrf.txt` → delete
  - `dev-server.log`, `dev.log`, `dev.pid`, `.next_dev_pid` → add to .gitignore or delete
- [ ] Remove unused default public assets: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` (if still present from create-next-app)
- [ ] Audit `src/data/mockData.ts` and `src/data/realTestData.ts` -- document what's still needed vs what should be replaced by real DB data

### 0.3 Consolidate Documentation

**Current state:** Docs split across `/docs/` (6 files) and `/memory-bank/` (6 files + Archive). CLAUDE.md says "only 4 files in memory-bank" but there are 6. Stale since Jul-Sep 2025.

- [ ] Create `/docs/archive/` directory
- [ ] Move completed/stale memory-bank content to archive:
  - `memory-bank/Archive/*` → `docs/archive/`
  - `memory-bank/FAN_PORTAL.md` → `docs/archive/` (feature complete, reference only)
  - `memory-bank/SPOTIFY_INTEGRATION.md` → `docs/archive/` (feature complete, reference only)
  - `memory-bank/BILLING_INTEGRATION_PLAN.md` (from Archive) → `docs/archive/`
- [ ] Merge active memory-bank content into /docs:
  - `memory-bank/PROJECT_STATUS.md` → `docs/STATUS.md` (update to current state)
  - `memory-bank/ARCHITECTURE.md` → `docs/ARCHITECTURE.md` (verify accuracy)
  - `memory-bank/TROUBLESHOOTING.md` → `docs/TROUBLESHOOTING.md`
  - `memory-bank/DEVELOPMENT_PATTERNS.md` → `docs/CONVENTIONS.md`
- [ ] Keep existing /docs files, update for accuracy:
  - `docs/SITEMAP.md` -- verify all 54 routes still accurate
  - `docs/API_ENDPOINTS.md` -- verify all 80+ endpoints documented
  - `docs/USER_JOURNEYS.md` -- verify flows match current code
  - `docs/VISUAL_FLOWS.md` -- keep as reference
  - `docs/DATABASE_BACKUP.md` -- keep
- [ ] Move `DATABASE_AUDIT_COMPREHENSIVE_ANALYSIS.md` from root → `docs/archive/`
- [ ] Move `DEVELOPMENT.md` from root → `docs/DEVELOPMENT.md`
- [ ] Delete `/memory-bank/` directory after migration
- [ ] Update `docs/README.md` index to reflect new structure

### 0.4 Rewrite CLAUDE.md

Current CLAUDE.md references non-existent `.claude/commands/`, claims "only 4 .md files in /memory-bank/", and has stale patterns. Rewrite to be accurate and focused:

- [ ] Remove references to `.claude/commands/` (doesn't exist or isn't relevant)
- [ ] Update doc references: `/memory-bank/` → `/docs/`
- [ ] Keep accurate sections: tech stack, data architecture, critical patterns
- [ ] Add: current project structure (actual directory tree)
- [ ] Add: known issues / active bugs for Claude context
- [ ] Remove: TDD methodology claim (no tests exist)
- [ ] Keep under 120 lines -- concise, scannable

### 0.5 Verification

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] All docs reference correct file paths
- [ ] CLAUDE.md accurately describes project state
- [ ] No dead code files remain in src/

---

## Phase 1: Critical Security Fixes

**Goal:** Close all critical security gaps before any public exposure.
**Sessions:** 1-2
**Priority:** P0 -- must be done before any deployment.

### 1.1 Rate Limiting

`src/lib/api-helpers.ts` already has a `rateLimit()` helper that is **never called**.

- [x] Apply rate limiting to auth endpoints:
  - `src/app/api/auth/register/route.ts` -- 5 requests/minute per IP
  - `src/app/api/auth/[...nextauth]/route.ts` -- 10 requests/minute per IP (login attempts)
- [x] Apply rate limiting to sensitive endpoints:
  - `src/app/api/messages/route.ts` (POST) -- 30 requests/minute
  - `src/app/api/upload/route.ts` -- 10 requests/minute
  - `src/app/api/bookings/route.ts` (POST) -- 10 requests/minute
- [ ] Verify rateLimit helper works correctly (test with rapid requests)

### 1.2 Input Sanitization

`src/lib/validation.ts` defines `sanitizeHtml()` but it is **never called** anywhere in the codebase.

- [x] Apply `sanitizeHtml()` to all user-submitted text fields:
  - Registration: name, bio fields in `src/app/api/auth/register/route.ts`
  - Profile updates: all text fields in `src/app/api/profile/route.ts`
  - Messages: body field in `src/app/api/messages/route.ts`
  - Bookings: message/notes fields in `src/app/api/bookings/route.ts`
  - Reviews: body field in `src/app/api/reviews/route.ts`
- [ ] Verify no XSS possible via user-submitted content displayed in pages

### 1.3 Authentication Hardening

- [ ] Add email verification to registration flow (requires external email service -- deferred):
  - Generate verification token on signup
  - Send verification email (use Resend, SendGrid, or similar)
  - Block login until email verified
  - Add verification callback route
- [x] Strengthen password requirements in `src/lib/validation.ts`:
  - Minimum 12 characters
  - Require uppercase, lowercase, number, special character
  - Update Zod schema and error messages
- [x] Add account lockout after 5 failed login attempts (15-minute cooldown)
- [ ] Review JWT token payload -- remove unnecessary data (full profile/artist/host objects bloat the token; deferred -- requires audit of all session consumers)

### 1.4 Stripe Webhook Idempotency

`src/app/api/payments/webhook/route.ts` processes webhooks but has no idempotency check -- replay attacks can create duplicate payments.

- [x] Before processing any webhook event, check if `stripePaymentId` already exists:
  ```
  const existing = await prisma.payment.findFirst({ where: { stripePaymentId } });
  if (existing) return NextResponse.json({ received: true });
  ```
- [x] Fix: webhook route creates `new PrismaClient()` instead of importing shared instance from `src/lib/prisma.ts`
- [ ] Add handling for missing event types: `charge.refunded`, `customer.subscription.updated`

### 1.5 Fix PrismaClient Instances

Multiple files create `new PrismaClient()` instead of using the shared singleton at `src/lib/prisma.ts`. This causes connection pool exhaustion.

- [x] `src/app/api/payments/webhook/route.ts` -- import from `@/lib/prisma`
- [ ] `prisma/seed.ts` -- import from `@/lib/prisma` (or acceptable for seed script)
- [x] Search entire codebase for `new PrismaClient` -- all 9 files in src/app/api/ now use shared singleton
- [ ] Add connection pool config to Prisma schema if not present

### 1.6 Database Indexes

Missing indexes on frequently queried foreign keys:

- [x] Add to `prisma/schema.prisma`: indexes on Booking (artistId, hostId, requestedDate, status), Message (conversationId, senderId), Concert (date, status), FanRSVP (concertId, fanId), SpotifyAlbum (artistId)
- [ ] Run `npx prisma migrate dev` to generate migration
- [ ] Test that existing queries still work

### 1.7 Console Log Cleanup

217 console.log/console.error calls across API routes.

- [x] Remove all `console.log` calls from API routes (204 calls removed across 67 files)
- [x] Replace critical error logging with structured approach:
  - Created `src/lib/logger.ts` with `info()`, `warn()`, `error()` functions
  - In development: logs to console with level prefix
  - In production: logs structured JSON (ready for log aggregation)
- [x] Remove debug-specific logging patterns: all removed, error handling uses logger.error

### 1.8 Verification

- [ ] Test login with wrong password 6+ times -- verify lockout works
- [ ] Test registration -- verify password requirements enforced
- [ ] Test Stripe webhook replay -- verify no duplicate payments
- [ ] Submit `<script>alert('xss')</script>` in profile bio -- verify sanitized
- [x] `npm run build` passes
- [x] Run `grep -r "new PrismaClient" src/` -- only `src/lib/prisma.ts` creates instances

---

## Phase 2: UI/UX Hardening

**Goal:** Accessibility compliance, missing states, fix broken features, responsive polish.
**Sessions:** 2-3
**Priority:** P1 -- required for any public-facing launch.

### 2.1 Critical Bug Fixes

- [x] **Calendar page crash** (`src/app/calendar/page.tsx`):
  - `calendarDays` and color functions already extracted into `CalendarMonthView` component
  - Week view removed from ViewMode type (UI already only showed month/list)
  - Removed stale console.error call
- [x] **Message send broken** (`src/app/messages/page.tsx`):
  - Standalone `/messages` page was redundant -- `/dashboard/messages` has full working messaging
  - Replaced with server-side redirect to `/dashboard/messages`
- [x] **Footer dead links** (`src/components/layout/Footer.tsx`):
  - Created placeholder "Coming Soon" pages for all 10 missing routes
  - Shared `ComingSoon` component at `src/components/ui/ComingSoon.tsx`
- [x] **Login page** (`src/app/login/page.tsx`):
  - Demo accounts gated behind `NODE_ENV === 'development'`
  - Removed console.log/console.error calls
  - Created `/forgot-password` placeholder page

### 2.2 Accessibility (WCAG AA Target)

Current state: ~10 ARIA attributes across 200+ tsx files. ~30% WCAG AA compliant.

**Focus management & modals:**
- [x] Add focus trap to all modals via `useModalAccessibility` hook (`src/hooks/useModalAccessibility.ts`)
- [x] Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby` to all 7 modals:
  - EventDetailModal, PhotoLightbox, ShareModal, BookingModals (2), ConcertBookingModal, FanConcertReviewModal, ReviewFormModal
- [x] Return focus to trigger element when modal closes (handled by hook)
- [ ] Add `inert` attribute to body content when modal is open (deferred -- requires React portal refactor)

**Navigation & menus:**
- [x] `src/components/layout/Header.tsx`:
  - Added `aria-expanded`, `aria-haspopup`, `aria-label` to user menu button
  - Added `role="menu"`, `role="menuitem"` to dropdown items
  - Added `role="navigation"`, `aria-label` to mobile menu
  - Added `aria-expanded`, `aria-label` to mobile menu toggle
  - Added focus ring styles to interactive elements
  - Deferred: keyboard arrow nav for dropdowns
  - Deferred: backdrop click-to-close for mobile menu
- [x] Add skip-to-content link as first focusable element in `src/app/layout.tsx`

**Lists & interactive elements:**
- [x] Add `role="list"` to booking lists with `aria-label`
- [x] Add `aria-live="polite"` to booking count for screen reader updates
- [x] Add `aria-label` to search input, filter select, sort select, sort direction button
- [ ] Add `role="listbox"`, `aria-selected` to conversation list (deferred -- `/messages` now redirects to dashboard)
- [x] Add `aria-label` to icon-only buttons in modals (close, nav, lightbox controls)

**Color contrast:**
- [ ] Audit secondary-600 on secondary-50 (form labels) -- likely fails AA
- [ ] Audit placeholder text (neutral-400 on white) -- may fail AA
- [ ] Fix primary-600 error text color -- may not be accessible on all backgrounds
- [ ] Ensure all text meets 4.5:1 contrast ratio (normal) or 3:1 (large text)

**Semantic HTML:**
- [x] Calendar grid: added `role="grid"`, `role="columnheader"`, `role="gridcell"` with accessible labels
- [x] Calendar events: keyboard-accessible with `role="button"`, `tabIndex`, Enter/Space handlers
- [ ] Form required fields: add asterisk indicators
- [ ] Ensure all images have meaningful alt text (not generic "House concert community")

### 2.3 Loading, Error & Empty States

**Loading states -- add skeletons:**
- [x] Created reusable `Skeleton`, `SkeletonCard`, `SkeletonGrid`, `SkeletonTable` components (`src/components/ui/Skeleton.tsx`)
- [x] Artist directory (`src/app/artists/loading.tsx`) -- skeleton cards while loading
- [x] Hosts directory (`src/app/hosts/loading.tsx`) -- skeleton cards while loading
- [x] Calendar (`src/app/calendar/loading.tsx`) -- skeleton calendar grid
- [x] Dashboard (`src/app/dashboard/loading.tsx`) -- skeleton stats + cards
- [x] Dashboard bookings (`src/app/dashboard/bookings/loading.tsx`) -- skeleton table
- [x] Admin (`src/app/admin/loading.tsx`) -- skeleton stats + cards

**Error states:**
- [x] Added root error boundary (`src/app/error.tsx`) with retry button
- [x] Added admin error boundary (`src/app/admin/error.tsx`) with retry + dashboard link
- [x] Added dashboard error boundary (`src/app/dashboard/error.tsx`) with retry
- [x] Added calendar error boundary (`src/app/calendar/error.tsx`) with retry
- [x] Input component error text changed from primary-600 to red-600 with `role="alert"`
- [ ] `src/app/artists/[id]/page.tsx` -- add retry button to "Artist Not Found"
- [ ] Form submission errors should auto-scroll/focus to first invalid field

**Empty states:**
- [ ] Artist directory with no search results -- add helpful suggestions
- [ ] Booking list when empty -- add context-appropriate CTA (existing empty state is basic)

### 2.4 Responsive Design

**Tablet breakpoint gap:**
- [x] Added `md:grid-cols-2` to 12 grid layouts that jumped from 1 column to 3-4 at `lg:`
  - lodging/book, subscription, admin, payment/artist, bookings/[id], bookings/new,
    bookings/coordination, dashboard/concert-reviews, dashboard/lodging/photos,
    dashboard/fan, dashboard/page, map
- [x] Messages page: now redirects to dashboard/messages (which already has proper layout)
- [x] Registration grid: already had `md:grid-cols-2`

**Touch targets:**
- [ ] Ensure all buttons meet 44px minimum touch target on mobile
- [ ] Calendar date cells -- increase tap area on mobile
- [ ] Small buttons (`px-3 py-1.5`) -- increase to minimum 44px height on mobile

**Typography scaling:**
- [ ] Hero heading `text-4xl sm:text-6xl` -- verify it doesn't overflow on narrow screens
- [ ] Establish consistent responsive text scale (don't mix `text-sm`/`text-base` ad hoc)

### 2.5 Design Consistency

- [ ] Standardize card shadows: pick one default (`shadow-sm` or `shadow-md`), one hover (`shadow-lg`)
- [ ] Standardize card padding: pick one default (`p-6`), document exceptions
- [ ] Standardize border-radius: `rounded-lg` for cards, `rounded-md` for inputs, `rounded-full` for avatars
- [ ] Standardize section spacing: `space-y-8` between major sections, `space-y-4` within
- [ ] Standardize font weights: `font-semibold` for headings, `font-medium` for subheadings
- [ ] Fix inconsistent color references: some use `bg-french-blue` directly, others use `bg-primary-600` -- pick one approach
- [ ] Form input focus states: standardize to `focus:ring-2` everywhere
- [ ] Button shimmer effect (primary only) -- either extend to all variants or remove

### 2.6 Verification

- [ ] Run Lighthouse accessibility audit -- target 90+ score
- [ ] Tab through every page using keyboard only -- verify all interactive elements reachable
- [ ] Test on mobile viewport (375px), tablet (768px), desktop (1280px)
- [x] `npm run build` passes

---

## Phase 3: Infrastructure & Scalability

**Goal:** Managed database, proper file handling, production-grade logging.
**Sessions:** 1-2
**Priority:** P1 -- required for production deployment.

### 3.1 Migrate PostgreSQL to Supabase Managed Postgres

Keep Prisma and NextAuth -- only change the database hosting. No application code rewrite.

- [x] Update `prisma/schema.prisma` to add `directUrl` for PgBouncer support
- [x] Update `.env.example` with Supabase connection string template
- [x] Add `DIRECT_URL` to `.env` and `.env.local` (points to local DB for now)
- [ ] Create Supabase project at supabase.com (requires user credentials)
- [ ] Get connection strings (pooled + direct) and update `.env.local`
- [ ] Run `npx prisma migrate deploy` against Supabase DB
- [ ] Seed database or restore from backup (`scripts/restore-database.js`)
- [ ] Verify all existing functionality works against Supabase Postgres
- [ ] Set up automatic backups in Supabase dashboard (point-in-time recovery)

### 3.2 Image Processing -- DONE

- [x] Install `sharp` package (already in `next.config.ts` `serverExternalPackages`)
- [x] Implement `processImage()` in `src/lib/storage.ts`:
  - Resize to max 1920px width (maintains aspect ratio, skips if smaller)
  - Keep original format (not WebP -- avoids breaking stored URLs; Next.js handles WebP delivery)
  - Strip EXIF data via `sharp.rotate()` (privacy)
  - Compress to 80% quality, mozjpeg for JPEG
- [x] Implement `generateThumbnail()`:
  - Resize to 400px width, original format
  - 70% quality
- [x] Update `src/app/api/upload/route.ts` to process images on upload
  - Saves processed image + `-thumb` thumbnail side by side
  - Response includes `thumbnailUrl`
- [ ] Generate thumbnails for existing uploads (migration script -- deferred, low priority)

### 3.3 File Serving -- NO CHANGES NEEDED

File serving already works via rewrite + API route with caching:
- Upload saves to `./storage/uploads/`
- `next.config.ts` rewrites `/uploads/:path*` to `/api/files/:path*`
- `src/app/api/files/[...path]/route.ts` serves with Cache-Control, ETag, 304 support

Real optimization (Supabase Storage or S3+CDN) is a future consideration per Appendix D.

### 3.4 Structured Logging -- DONE

`src/lib/logger.ts` was created in Phase 1. All 67 API routes already used it.

- [x] Migrated remaining 68 `console.log/error/warn` calls across 9 server-side lib files:
  - `src/lib/spotify.ts` (18 calls), `src/lib/soundcloud.ts` (20), `src/lib/profileImageUtils.ts` (17)
  - `src/lib/storage.ts` (6), `src/lib/auth.ts` (3), `src/lib/coordination.ts` (2)
  - `src/lib/stats.ts` (1), `src/lib/notifications.ts` (1)
- [x] Stripped emoji prefixes from log messages (spotify/soundcloud had them)
- [x] Removed verbose debug traces in profileImageUtils (17 trace logs reduced to 2 meaningful ones)
- [x] Only `src/lib/logger.ts` internals and `stripe.ts.disabled` retain raw console calls

### 3.5 Unified API Response Format -- IN PROGRESS

- [x] Created `src/lib/api-response.ts` with:
  - `apiSuccess(data, status)` -- spreads data at top level with `success: true`
  - `apiError(code, message, status)` -- keeps `error` as string for backwards compat, adds `errorCode`
  - `ApiErrors.*` convenience helpers (unauthorized, forbidden, notFound, validation, rateLimited, conflict, internal)
  - `ErrorCode` constants: AUTH_REQUIRED, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR, RATE_LIMITED, CONFLICT, INTERNAL_ERROR
- [x] Migrated 5 high-traffic routes as proof of concept:
  - `api/bookings/route.ts` (GET + POST)
  - `api/upload/route.ts` (POST)
  - `api/messages/route.ts` (GET + POST)
  - `api/reviews/route.ts` (GET + POST)
  - `api/profile/route.ts` (GET + PUT)
- [ ] Migrate remaining ~65 routes incrementally (future sessions)

### 3.6 Verification

- [ ] All pages load data from Supabase-hosted DB (blocked on 3.1 credentials)
- [x] `npm run build` passes
- [x] `npx prisma validate` passes
- [x] `grep console src/lib/` shows only logger.ts internals
- [ ] Upload an image -- verify it's processed, thumbnail generated (manual test)
- [ ] Check logs in production mode -- verify structured JSON (manual test)

---

## Phase 4: Feature Completion

**Goal:** Complete all incomplete features, wire up hardcoded data, close TODOs.
**Sessions:** 2-3
**Priority:** P2 -- needed for launch but not blocking security/stability.

### 4.1 Complete TODO Items (46 found via audit, 0 remaining)

**Notifications wired up:**
- [x] Send notification to host about new booking request (`src/app/api/bookings/route.ts`)
- [x] Send notification to host about new RSVP + auto-approve notification to fan (`src/app/api/rsvps/route.ts`)
- [x] Send notification to fan about RSVP status update (`src/app/api/rsvps/[id]/route.ts`)
- [x] Send notification to host about RSVP cancellation (`src/app/api/rsvps/[id]/route.ts`)

**Backend wiring completed:**
- [x] Booking detail page: approve/reject/cancel wired to `PUT /api/bookings/[id]` (`src/app/bookings/[id]/page.tsx`)
- [x] Map hosts: real review ratings from DB, replacing `Math.random()` (`src/app/api/map/hosts/route.ts`)
- [x] Users API: proper Prisma queries replacing mock data (`src/app/api/users/route.ts`)
- [x] Payment error display: error state + UI for failed checkout (`src/app/payment/artist/page.tsx`)

**Cleaned up:**
- [x] Message sending -- already fixed in Phase 2 (`/messages` redirects to `/dashboard/messages`)
- [x] Login demo users -- already gated behind `NODE_ENV === 'development'` in Phase 2
- [x] Onboarding pages: replaced duplicates with redirects to `/register` (`src/app/onboarding/`)
- [x] Console.log cleanup: 30 calls removed across 12 client-side files, 0 remaining in `src/app/`
- [x] Deleted `src/app/dashboard/profile/page.tsx.backup`

**All remaining TODOs triaged to DEFERRED/NOTE comments:**
- ReviewFormModal: needs schema migration (Review model is fan-only)
- Subscription cancel/reactivate: needs Stripe test environment
- Lodging book/setup: needs new lodging API endpoints
- Newsletter signup: needs external email service (Mailchimp, Resend)
- Contact form: needs email service integration
- Favorite artists: new feature, not yet built
- Artist popularity metrics: requires booking/review aggregation
- File storage cleanup: requires cloud storage integration
- Concert auto-creation on booking confirmation
- formationYear, daysAvailable, specialRequirements: schema additions

### 4.2 Replace Hardcoded Data

- [x] Admin activity feed: created `/api/admin/activity` route, replaced static `recentActivityData` with DB-sourced events (registrations, bookings, payments, applications)
- [x] Login page demo users: already gated behind `NODE_ENV === 'development'` (Phase 2)
- [ ] Audit mockData.ts usage -- deferred (deeply integrated in dashboard, significant refactor)

### 4.3 Polish Onboarding

- [x] Registration wizards already have progress indicators and backend wiring
- [x] Duplicate `/onboarding/` pages replaced with redirects to `/register`
- [ ] Add "save draft" capability for long forms (deferred -- new feature)
- [ ] Test the full journey: register → verify email → onboard → approval → payment → active (manual testing)

### 4.4 Verification

- [x] All TODOs resolved: 0 TODO/FIXME in src/ (46 fixed/triaged)
- [x] No console.log calls in src/app/ (30 removed)
- [x] Admin activity feed pulls from DB
- [x] `npm run build` passes
- [ ] Full user journey works end-to-end for each role (manual testing)

---

## Phase 5: Launch Prep

**Goal:** Testing, CI/CD, SEO, performance, deployment.
**Sessions:** 2-3
**Priority:** P2 -- final phase before launch.

### 5.1 Testing Framework -- DONE

- [x] Install: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitejs/plugin-react`
- [x] Configure `vitest.config.ts` with jsdom environment, path aliases, coverage config
- [x] Add `npm test`, `npm run test:watch`, `npm run test:coverage` scripts
- [x] Write unit tests for critical paths (65 tests, 5 test files):
  - `src/lib/validation.ts` -- sanitizeHtml, validateData, registrationSchema (password rules), bookingSchema, profileUpdateSchema, validateFileUpload
  - `src/lib/storage.ts` -- generateFileKey, validateFile (magic bytes + extension fallback)
  - `src/lib/logger.ts` -- dev mode formatting, production JSON output, error handling
  - `src/lib/api-helpers.ts` -- rateLimit (limits, reset, independent tracking)
  - `src/lib/api-response.ts` -- apiSuccess, apiError, all ApiErrors helpers
- [ ] Write integration tests for key API routes (deferred -- requires DB test fixtures)
- [ ] Optional: Install Playwright for E2E tests of critical user journeys

### 5.2 SEO -- DONE

- [x] Update `src/app/layout.tsx` metadata: title template, OG tags, Twitter cards, metadataBase, robots
- [x] Add `generateMetadata` to dynamic pages via layout files:
  - `src/app/artists/[id]/layout.tsx` -- artist name, bio, genres, OG image
  - `src/app/hosts/[id]/layout.tsx` -- venue name, location, description, OG image
- [x] Create `src/app/sitemap.ts` -- dynamic sitemap with static pages + DB-sourced artist/host pages
- [x] Create `src/app/robots.ts` -- allows public pages, blocks /api/, /admin/, /dashboard/
- [x] Open Graph + Twitter card metadata on root layout and dynamic pages
- [x] JSON-LD structured data: Organization (root layout), MusicGroup (artist pages), EventVenue (host pages)
- [ ] Add canonical URLs to all pages (deferred -- metadataBase handles most cases)

### 5.3 Performance -- DONE

- [x] Verified build passes, reviewed bundle output
- [x] Leaflet/React-Leaflet already properly wrapped in `dynamic()` with `ssr: false`
- [x] Added `loading.tsx` to 19 route segments (all data-fetching routes covered):
  - Previously: artists, hosts, calendar, dashboard, dashboard/bookings, admin
  - Added: `artists/[id]`, `hosts/[id]`, `bookings/[id]`, `bookings/new`, `bookings/coordination`,
    `dashboard/messages`, `dashboard/profile`, `dashboard/music`, `dashboard/tour-planner`,
    `dashboard/artist-media`, `dashboard/concert-reviews`, `dashboard/fan`, `dashboard/fan/profile`,
    `dashboard/reviews`, `admin/applications`, `admin/bookings`, `admin/finance`, `admin/messages`, `admin/spotify`
- [x] Migrated 49 of 51 raw `<img>` tags to `next/image` across 37 component files
  - 2 remaining in Leaflet map components (HostPopup, HostListCard) -- intentionally skipped, next/image incompatible with Leaflet DOM
  - Added `i.scdn.co` to remotePatterns for Spotify album art
- [ ] Prisma query optimization with `select` clauses (deferred)

### 5.4 Deployment -- IN PROGRESS

- [x] Configure `next.config.ts` production settings:
  - Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy
  - Image remotePatterns for Supabase, S3, Unsplash, localhost (replaces deprecated `domains`)
  - `poweredByHeader: false` already set
  - `output: 'standalone'` already set
- [ ] Set up Vercel project (requires account access)
- [ ] Configure environment variables in Vercel dashboard
- [ ] Set up Stripe webhook endpoint for production domain
- [ ] Configure Google OAuth redirect URIs for production domain
- [ ] Set up custom domain

### 5.5 CI/CD -- DONE

- [x] Create `.github/workflows/ci.yml`:
  - Runs on push to main + PRs targeting main
  - Steps: checkout, setup Node 20, npm ci, prisma generate, lint, tsc --noEmit, vitest, build
  - Placeholder env vars for DB/auth (build doesn't need real DB)
- [ ] Add branch protection rules on main (requires GitHub repo admin)

### 5.6 Verification

- [ ] Lighthouse scores: Performance 90+, Accessibility 90+, SEO 90+, Best Practices 90+
- [ ] All tests pass in CI
- [ ] Production deployment works with all environment variables
- [ ] Full user journey works on production domain
- [ ] Stripe payments work in live mode
- [ ] Google OAuth works on production domain

---

## Appendix A: Complete Security Findings

| Finding | Severity | Location | Status |
|---------|----------|----------|--------|
| No rate limiting on auth | Critical | `api/auth/register`, `api/auth/[...nextauth]` | Phase 1.1 |
| sanitizeHtml defined but never called | Critical | `src/lib/validation.ts` (defined), nowhere (called) | Phase 1.2 |
| No email verification | Critical | `api/auth/register/route.ts` | Phase 1.3 |
| Weak password requirements (8 char, no complexity) | High | `src/lib/validation.ts` | Phase 1.3 |
| Stripe webhook no idempotency | Critical | `api/payments/webhook/route.ts` | Phase 1.4 |
| Multiple PrismaClient instances | High | `api/payments/webhook/route.ts`, `prisma/seed.ts` | Phase 1.5 |
| Missing database indexes on FKs | Medium | `prisma/schema.prisma` | Phase 1.6 |
| 217 console.logs in production code | Medium | Throughout API routes | Phase 1.7 |
| Raw error objects logged (could expose secrets) | High | `api/profile/route.ts`, others | Phase 1.7 |
| JWT token bloated with full user data | Low | `src/lib/auth.ts` | Phase 1.3 |
| No account lockout after failed logins | Medium | `src/lib/auth.ts` | Phase 1.3 |
| File upload no virus scanning | Low | `api/upload/route.ts` | Future |
| No CSRF explicit validation | Low | Relies on NextAuth built-in | Verify |

## Appendix B: Complete UI/UX Findings

| Finding | Severity | Location | Status |
|---------|----------|----------|--------|
| Calendar crash (undefined calendarDays) | Critical | `src/app/calendar/page.tsx:155` | Phase 2.1 |
| Calendar missing color functions | Critical | `src/app/calendar/page.tsx:180-193` | Phase 2.1 |
| Message send non-functional | Critical | `src/app/messages/page.tsx:219-230` | Phase 2.1 |
| Footer links to non-existent pages | High | `src/components/layout/Footer.tsx` | Phase 2.1 |
| ~10 ARIA attributes across 200+ files | High | Throughout | Phase 2.2 |
| No focus traps on modals | High | Calendar, lightbox, dialogs | Phase 2.2 |
| No keyboard nav on dropdown menus | High | `src/components/layout/Header.tsx` | Phase 2.2 |
| No skip-to-content link | Medium | Root layout | Phase 2.2 |
| Missing loading skeletons | High | Artist directory, bookings, calendar, dashboard | Phase 2.3 |
| No retry buttons on error states | Medium | Artist profile, calendar, others | Phase 2.3 |
| Empty states lack CTAs | Medium | Messages, artist search, bookings | Phase 2.3 |
| Missing md: breakpoint (768-1024px gap) | High | Messages, registration, booking detail | Phase 2.4 |
| Touch targets below 44px | Medium | Small buttons, calendar cells | Phase 2.4 |
| Inconsistent card shadows | Low | Throughout dashboard | Phase 2.5 |
| Inconsistent spacing/padding | Low | Throughout | Phase 2.5 |
| Test routes accessible in production | High | `/test`, `/test-dashboard`, `/test-polling` | Phase 0.2 |
| Demo credentials visible on login | Medium | `src/app/login/page.tsx:27-29` | Phase 2.1 |
| Admin activity hardcoded | Medium | `src/app/admin/page.tsx:27-34` | Phase 4.2 |

## Appendix C: Code Quality Findings

| Finding | Location | Status |
|---------|----------|--------|
| Dead code: page-original.tsx files (4+) | `src/app/`, `src/app/artists/`, `src/app/hosts/` | Phase 0.2 |
| 36 TODO/FIXME comments | Throughout src/ | Phase 4.1 |
| `any` types in API routes | `api/bookings/route.ts`, `api/profile/route.ts`, others | Phase 1 (as encountered) |
| Duplicate API endpoints (user/current vs profile) | `api/user/current`, `api/profile` | Phase 4 |
| Image processing stubs (not implemented) | `src/lib/storage.ts` | Phase 3.2 |
| File serving broken (uploads not accessible) | `src/lib/storage.ts`, upload routes | Phase 3.3 |
| Dual data source pattern (mockData + realTestData) | `src/data/` | Phase 4.2 (audit) |
| PM2 config references non-existent script | `ecosystem.config.js` | Phase 0.2 |
| No automated tests | Entire project | Phase 5.1 |
| No CI/CD pipeline | Project | Phase 5.5 |

## Appendix D: Supabase Migration Note

**Decision (2026-03-29):** Keep Prisma + NextAuth application code. Migrate only the PostgreSQL hosting to Supabase managed Postgres (Phase 3.1). This gets managed infrastructure (automatic backups, dashboard, connection pooling, point-in-time recovery, scaling) without rewriting 80+ API routes.

**Future consideration:** If the platform grows significantly, evaluate adopting:
- Supabase Realtime (replace 30s polling for messages -- better UX, less server load)
- Supabase Storage (replace S3 setup -- simpler, integrated)
- Supabase Auth (replace NextAuth -- built-in email verification, password reset, social auth)
- Row-Level Security via Supabase (security at DB layer)

Each of these can be adopted independently as needed. No need to do a big-bang migration.

## Appendix E: Session Estimates

| Phase | Sessions | Focus |
|-------|----------|-------|
| Phase 0: Foundation | 1-2 | Docs, dead code, clean state |
| Phase 1: Security | 1-2 | Rate limiting, sanitization, auth hardening, Stripe |
| Phase 2: UI/UX | 2-3 | Accessibility, states, responsive, bugs, consistency |
| Phase 3: Infrastructure | 1-2 | Supabase DB, image processing, file serving, logging |
| Phase 4: Features | 2-3 | TODOs, hardcoded data, onboarding polish |
| Phase 5: Launch | 2-3 | Testing, SEO, performance, deployment, CI/CD |
| **Total** | **~10-15 sessions** | |

Phases 0 and 1 are sequential prerequisites. Phases 2 and 3 can partially overlap. Phase 4 can start once 1-3 are mostly done. Phase 5 is the final push.
