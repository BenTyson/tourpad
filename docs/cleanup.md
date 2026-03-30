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

- [ ] **Calendar page crash** (`src/app/calendar/page.tsx`):
  - `calendarDays` variable undefined in month view loop (~line 155)
  - `getEventColor()` and `getEventTextColor()` functions referenced but never defined (~line 180-193)
  - Missing week view implementation (header shows option but no render logic)
- [ ] **Message send broken** (`src/app/messages/page.tsx`):
  - Lines 219-230 have TODO comments, send button non-functional
  - "Coming Soon" notice (lines 253-264) contradicts the working messaging UI -- confusing
  - Wire up to existing `/api/messages` POST endpoint
- [ ] **Footer dead links** (`src/components/layout/Footer.tsx`):
  - Links to non-existent pages: `/about`, `/press`, `/blog`, `/help`, `/safety`, `/guidelines`, `/trust`, `/report`, `/accessibility`, `/sitemap`
  - Either create these pages or remove the links
- [ ] **Login page** (`src/app/login/page.tsx`):
  - Demo account buttons (lines 120-142) should be dev-only or clearly marked
  - "Forgot Password" link points to non-existent page
  - Hardcoded credentials (lines 27-29) -- remove or gate behind NODE_ENV

### 2.2 Accessibility (WCAG AA Target)

Current state: ~10 ARIA attributes across 200+ tsx files. ~30% WCAG AA compliant.

**Focus management & modals:**
- [ ] Add focus trap to all modals (calendar event detail, photo lightbox, any dialogs)
- [ ] Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby` to all modals
- [ ] Return focus to trigger element when modal closes
- [ ] Add `inert` attribute to body content when modal is open

**Navigation & menus:**
- [ ] `src/components/layout/Header.tsx`:
  - Add `aria-expanded`, `aria-haspopup` to user menu button (lines 156-165)
  - Add `role="navigation"`, `aria-label` to mobile menu (lines 245-334)
  - Add keyboard navigation (Up/Down arrows) for dropdown menus
  - Add backdrop click-to-close for mobile menu
- [ ] Add skip-to-content link as first focusable element

**Lists & interactive elements:**
- [ ] Add `role="list"` to booking lists (`src/components/bookings/BookingList.tsx`)
- [ ] Add `role="listbox"`, `aria-selected` to conversation list (`src/app/messages/page.tsx`)
- [ ] Ensure all icon-only buttons have `aria-label` (close buttons, menu buttons throughout)

**Color contrast:**
- [ ] Audit secondary-600 on secondary-50 (form labels) -- likely fails AA
- [ ] Audit placeholder text (neutral-400 on white) -- may fail AA
- [ ] Fix primary-600 error text color -- may not be accessible on all backgrounds
- [ ] Ensure all text meets 4.5:1 contrast ratio (normal) or 3:1 (large text)

**Semantic HTML:**
- [ ] Calendar grid: add `role="grid"`, use proper semantic day headers
- [ ] Form required fields: add asterisk indicators
- [ ] Ensure all images have meaningful alt text (not generic "House concert community")

### 2.3 Loading, Error & Empty States

**Loading states -- add skeletons:**
- [ ] Artist directory (`src/app/artists/page.tsx`) -- skeleton cards while loading
- [ ] Booking list (`src/components/bookings/BookingList.tsx`) -- skeleton rows during filter/page
- [ ] Calendar month view (`src/app/calendar/page.tsx`) -- skeleton calendar grid
- [ ] Dashboard pages -- skeleton widgets while API calls resolve

**Error states:**
- [ ] Add error boundary to admin section (`src/app/admin/error.tsx`)
- [ ] Add retry buttons to all error states (currently show generic messages with no action)
- [ ] `src/app/artists/[id]/page.tsx` (lines 201-222) -- add retry button to "Artist Not Found"
- [ ] Form submission errors should auto-scroll/focus to first invalid field
- [ ] Add `error.tsx` to every route group that doesn't have one

**Empty states:**
- [ ] Messages empty state (`src/app/messages/page.tsx`) -- add "Start a conversation" CTA
- [ ] Artist directory with no search results -- add helpful suggestions
- [ ] Booking list when empty -- add context-appropriate CTA
- [ ] All list views should have distinct empty states (not just blank space)

### 2.4 Responsive Design

**Tablet breakpoint gap:**
Many components jump from `sm:` to `lg:` with no `md:` breakpoint, leaving 768-1024px (iPad) poorly optimized.

- [ ] Messages page (`src/app/messages/page.tsx` line 97): `lg:grid-cols-3` with no md -- add `md:grid-cols-2`
- [ ] Booking detail pages: add `md:` breakpoints
- [ ] Registration grid (`src/app/register/page.tsx`): `lg:grid-cols-4` needs `md:grid-cols-2`
- [ ] Audit all grid layouts for missing `md:` breakpoint

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
- [ ] Verify all loading states show skeletons (throttle network in DevTools)
- [ ] Verify all error states show retry buttons (kill API server, reload pages)
- [ ] `npm run build` passes

---

## Phase 3: Infrastructure & Scalability

**Goal:** Managed database, proper file handling, production-grade logging.
**Sessions:** 1-2
**Priority:** P1 -- required for production deployment.

### 3.1 Migrate PostgreSQL to Supabase Managed Postgres

Keep Prisma and NextAuth -- only change the database hosting. No application code rewrite.

- [ ] Create Supabase project at supabase.com
- [ ] Get connection strings (pooled + direct)
- [ ] Update `.env.local`:
  ```
  DATABASE_URL="postgresql://...@...pooler.supabase.com:6543/postgres?pgbouncer=true"
  DIRECT_URL="postgresql://...@...supabase.com:5432/postgres"
  ```
- [ ] Update `prisma/schema.prisma` to add `directUrl`:
  ```
  datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")
    directUrl = env("DIRECT_URL")
  }
  ```
- [ ] Run `npx prisma migrate deploy` against Supabase DB
- [ ] Seed database or restore from backup (`scripts/restore-database.js`)
- [ ] Update `.env.example` and `docs/env.md` (create if doesn't exist)
- [ ] Verify all existing functionality works against Supabase Postgres
- [ ] Set up automatic backups in Supabase dashboard (point-in-time recovery)

### 3.2 Image Processing

`src/lib/storage.ts` has `processImage()` and `generateThumbnail()` that return the original buffer unprocessed.

- [ ] Install `sharp` package
- [ ] Implement `processImage()`:
  - Resize to max 1920px width
  - Convert to WebP for web display
  - Strip EXIF data (privacy)
  - Compress to 80% quality
- [ ] Implement `generateThumbnail()`:
  - Resize to 400px width
  - WebP format
  - 70% quality
- [ ] Update upload route to process images on upload
- [ ] Generate thumbnails for existing uploads (migration script)

### 3.3 Fix File Serving

Upload route saves to `./storage/uploads/` but files are not publicly accessible via HTTP.

- [ ] Option A (recommended): Move uploads to `public/uploads/` and serve via Next.js static files
- [ ] Option B: Set up S3 + CloudFront (AWS credentials already in .env) and serve via CDN
- [ ] Verify all existing upload references resolve correctly
- [ ] Update `src/lib/storage.ts` to use correct paths
- [ ] Update `next.config.ts` with image remote patterns if using S3

### 3.4 Structured Logging

- [ ] Create `src/lib/logger.ts`:
  - `logger.info(message, context)` -- development: console.log, production: structured JSON
  - `logger.warn(message, context)`
  - `logger.error(message, error, context)` -- never logs raw error objects
  - Include timestamp, request ID, user ID where available
- [ ] Replace remaining console.log calls with logger (Phase 1.7 removes most, this catches stragglers)
- [ ] Add request logging middleware for API routes (optional, for debugging)

### 3.5 Unified API Response Format

Currently API routes return inconsistent response shapes.

- [ ] Define standard response type:
  ```typescript
  type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; error: { code: string; message: string } }
  ```
- [ ] Define error codes: `AUTH_REQUIRED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `RATE_LIMITED`, `INTERNAL_ERROR`
- [ ] Create `src/lib/api-response.ts` helper functions
- [ ] Gradually migrate API routes to use standard format (can be done incrementally)

### 3.6 Verification

- [ ] All pages load data from Supabase-hosted DB
- [ ] Upload an image -- verify it's processed, thumbnail generated, publicly accessible
- [ ] Check logs in production mode -- verify structured JSON, no raw error objects
- [ ] `npm run build` passes
- [ ] Run `scripts/backup-database.js` -- verify backup works against new DB

---

## Phase 4: Feature Completion

**Goal:** Complete all incomplete features, wire up hardcoded data, close TODOs.
**Sessions:** 2-3
**Priority:** P2 -- needed for launch but not blocking security/stability.

### 4.1 Complete TODO Items (36 found)

Prioritized by user impact:

**High impact:**
- [ ] Message sending on standalone messages page (`src/app/messages/page.tsx`)
- [ ] Lodging setup save functionality
- [ ] Photo gallery components (referenced in TODOs)
- [ ] Review form submission
- [ ] Send notification to host about new booking request (`src/app/api/bookings/route.ts`)

**Medium impact:**
- [ ] Favorite artists tracking
- [ ] Concert-based review prompts after attendance
- [ ] Newsletter signup (`src/components/layout/Footer.tsx` -- currently simulated with setTimeout)
- [ ] Contact form backend

**Lower impact (audit remaining TODOs for full list):**
- [ ] Run `grep -rn "TODO\|FIXME\|HACK\|XXX" src/` to get complete list
- [ ] Triage each: fix, delete, or convert to GitHub issue

### 4.2 Replace Hardcoded Data

- [ ] Admin activity feed (`src/app/admin/page.tsx` lines 27-34): `recentActivityData` is static array -- wire to `/api/admin/activity` or similar
- [ ] Login page demo users (`src/app/login/page.tsx` lines 27-29): gate behind `NODE_ENV === 'development'`
- [ ] Audit mockData.ts usage -- identify what should come from DB vs what's legitimately static UI data

### 4.3 Polish Onboarding

- [ ] Artist onboarding: ensure all fields map to Prisma schema correctly
- [ ] Host onboarding: same verification
- [ ] Add progress indicator to multi-step forms
- [ ] Add "save draft" capability for long forms
- [ ] Test the full journey: register → verify email → onboard → approval → payment → active

### 4.4 Verification

- [ ] Every TODO is resolved, deleted, or tracked as a GitHub issue
- [ ] No hardcoded test data in production views
- [ ] Full user journey works end-to-end for each role (artist, host, fan)
- [ ] `npm run build` passes

---

## Phase 5: Launch Prep

**Goal:** Testing, CI/CD, SEO, performance, deployment.
**Sessions:** 2-3
**Priority:** P2 -- final phase before launch.

### 5.1 Testing Framework

- [ ] Install: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- [ ] Configure `vitest.config.ts`
- [ ] Write unit tests for critical paths:
  - `src/lib/validation.ts` (Zod schemas, sanitizeHtml, file validation)
  - `src/lib/auth.ts` (session callbacks, credential validation)
  - `src/lib/storage.ts` (image processing, file type validation)
  - `src/lib/logger.ts` (structured output)
- [ ] Write integration tests for key API routes:
  - Registration → email verification → login
  - Booking creation → approval → confirmation
  - Stripe webhook processing (with idempotency)
- [ ] Optional: Install Playwright for E2E tests of critical user journeys
- [ ] Create `docs/TESTING.md` with test strategy and commands

### 5.2 SEO

- [ ] Update `src/app/layout.tsx` metadata (still says "Create Next App" if not fixed)
- [ ] Add `generateMetadata` to all dynamic pages:
  - `src/app/artists/[id]/page.tsx` -- artist name, bio, genre
  - `src/app/hosts/[id]/page.tsx` -- venue name, location
  - `src/app/concerts/[id]/page.tsx` (if exists) -- event name, date, venue
- [ ] Create `src/app/sitemap.ts` (dynamic sitemap)
- [ ] Create `src/app/robots.ts`
- [ ] Add Open Graph images and Twitter cards
- [ ] Add JSON-LD structured data for events (Schema.org Event type)
- [ ] Add canonical URLs to all pages

### 5.3 Performance

- [ ] Run `next build` and check bundle analysis
- [ ] Audit `"use client"` directives -- ensure no unnecessary client components
- [ ] Add dynamic imports for heavy components (Leaflet maps, rich editors)
- [ ] Verify all images use `next/image` component (not raw `<img>`)
- [ ] Check Prisma query efficiency -- add `select` clauses to avoid fetching unnecessary fields
- [ ] Add `loading.tsx` to every route segment that fetches data

### 5.4 Deployment

- [ ] Set up Vercel project
- [ ] Configure environment variables in Vercel dashboard
- [ ] Set up preview deployments for branches
- [ ] Configure `next.config.ts` production settings:
  - Security headers (X-Frame-Options, X-Content-Type-Options, CSP)
  - Image remote patterns for Supabase Storage / S3
- [ ] Set up Stripe webhook endpoint for production domain
- [ ] Configure Google OAuth redirect URIs for production domain
- [ ] Set up custom domain
- [ ] Create `docs/DEPLOYMENT.md`

### 5.5 CI/CD

- [ ] Create `.github/workflows/ci.yml`:
  - Run `npm run lint` on every PR
  - Run `npm run build` on every PR
  - Run `vitest` on every PR
  - Deploy to Vercel preview on PR, production on main merge
- [ ] Add branch protection rules on main

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
