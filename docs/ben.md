# Manual Tasks for Ben

Tasks that require account access, credentials, or manual setup that can't be done in code.

## Deployment

- [ ] Create Supabase project at supabase.com, get pooled + direct connection strings
- [ ] Update `.env.local` with Supabase connection strings, run `npx prisma migrate deploy`
- [ ] Set up Vercel project and link to repo
- [ ] Configure Vercel environment variables (DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, etc.)
- [ ] Set up custom domain in Vercel
- [ ] Configure Stripe webhook endpoint for production domain
- [ ] Update Google OAuth redirect URIs for production domain in Google Cloud Console

## GitHub

- [ ] Add branch protection rules on `main` (require PR reviews, require CI to pass)

## Verification (post-deploy)

- [ ] Stripe test payment works on production
- [ ] Google OAuth login works on production
- [ ] Run Lighthouse audit -- target 90+ across all categories
- [ ] Walk through full user journey for each role (artist, host, fan)

## Deferred Code Tasks (future sessions)

- [ ] Write integration tests (needs test DB fixtures)
- [ ] Set up email service (Resend/SendGrid) for email verification and notifications
- [ ] Prisma query optimization with `select` clauses
- [ ] Add canonical URLs to remaining pages
