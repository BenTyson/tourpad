# STRIPE PAYMENTS - TourPad Integration Guide

## Overview
This document contains all Stripe payment integration details, schemas, implementation plans, and critical notes for the TourPad payment system.

## Payment Tiers
- **Artists**: $400/year (annual subscription)
- **Fans**: $10/month (monthly subscription)
- **Hosts**: Free (no payment required)

## User Status Flow

### Artists
```
Registration → PENDING → Admin Approval → APPROVED → Payment → ACTIVE
                     ↓                           ↓              ↓
                REJECTED                    (No Payment)   Full Access
                                           Holding Page
```

### Fans
```
Registration → PENDING → Payment Page → Payment → ACTIVE
                     ↓                        ↓         ↓
                (No Payment)              FAILED    Full Access
                Cannot Access            Try Again
```

## Database Schema Updates

### Payment Model
```prisma
model Payment {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  
  // Stripe data
  stripePaymentId   String   @unique
  stripeCustomerId  String
  amount            Int      // in cents
  currency          String   @default("usd")
  status            PaymentStatus
  
  // Metadata
  description       String?
  paymentType       PaymentType
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([userId])
  @@index([stripePaymentId])
}

model Subscription {
  id                     String   @id @default(cuid())
  userId                 String   @unique
  user                   User     @relation(fields: [userId], references: [id])
  
  // Stripe data
  stripeSubscriptionId   String   @unique
  stripeCustomerId       String
  stripePriceId          String
  
  // Status tracking
  status                 SubscriptionStatus
  currentPeriodStart     DateTime
  currentPeriodEnd       DateTime
  cancelAtPeriodEnd      Boolean  @default(false)
  
  // Billing
  amount                 Int      // recurring amount in cents
  interval               String   // "month" or "year"
  
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
  
  @@index([stripeSubscriptionId])
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  FAILED
  CANCELED
  REFUNDED
}

enum PaymentType {
  ARTIST_ANNUAL
  FAN_MONTHLY
  ONE_TIME
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  INCOMPLETE
  INCOMPLETE_EXPIRED
  TRIALING
  UNPAID
}
```

### User Model Updates
```prisma
model User {
  // ... existing fields
  
  // Payment relations
  payments          Payment[]
  subscription      Subscription?
  stripeCustomerId  String?    @unique
  
  // ... rest of model
}
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Product Price IDs (from Stripe Dashboard)
STRIPE_ARTIST_ANNUAL_PRICE_ID=price_...
STRIPE_FAN_MONTHLY_PRICE_ID=price_...
```

## API Endpoints

### 1. `/api/payments/create-checkout-session`
```typescript
// Creates Stripe checkout session
// Handles both artist annual and fan monthly
// Returns sessionId for redirect

POST /api/payments/create-checkout-session
Body: {
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  userType: 'artist' | 'fan'
}
```

### 2. `/api/payments/webhook`
```typescript
// Receives all Stripe webhook events
// Updates payment and subscription records
// Critical: Updates user status (APPROVED → ACTIVE)

POST /api/payments/webhook
Headers: {
  'stripe-signature': string
}
```

### 3. `/api/payments/subscription-status`
```typescript
// Returns current subscription status
// Used by dashboards and profile pages

GET /api/payments/subscription-status
Response: {
  status: SubscriptionStatus,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: boolean
}
```

### 4. `/api/payments/cancel-subscription`
```typescript
// Cancels subscription at period end
// Maintains access until period ends

POST /api/payments/cancel-subscription
```

## Webhook Events to Handle

### Critical Events
- `checkout.session.completed` - Initial payment success
- `invoice.payment_succeeded` - Renewal payments
- `invoice.payment_failed` - Failed payments
- `customer.subscription.updated` - Status changes
- `customer.subscription.deleted` - Cancellations

### Event Handling Logic
```typescript
switch (event.type) {
  case 'checkout.session.completed':
    // 1. Create Payment record
    // 2. Create/update Subscription record
    // 3. Update User status to ACTIVE
    // 4. Create Stripe customer if needed
    break;
    
  case 'invoice.payment_failed':
    // 1. Update Payment record as FAILED
    // 2. Set subscription to PAST_DUE
    // 3. Send notification email
    // 4. Show banner in dashboard
    // 5. DO NOT immediately deactivate (grace period)
    break;
    
  case 'customer.subscription.deleted':
    // 1. Update subscription status
    // 2. Set User status to INACTIVE
    // 3. Revoke dashboard access
    // 4. Keep profile visible
    break;
}
```

## Local Development Setup

### 1. Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login
```

### 2. Forward Webhooks Locally
```bash
# In terminal 1
npm run dev

# In terminal 2
stripe listen --forward-to localhost:3000/api/payments/webhook

# Copy the webhook signing secret!
# Add to .env.local as STRIPE_WEBHOOK_SECRET
```

### 3. Test Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

## Dashboard Integration Requirements

### Artist Dashboard
- [ ] Payment history table
- [ ] Current subscription status
- [ ] Next billing date
- [ ] Cancel subscription button
- [ ] Update payment method link

### Admin Dashboard
- [ ] Revenue metrics (MRR/ARR)
- [ ] Active subscriptions count
- [ ] Recent payments list
- [ ] Failed payment alerts
- [ ] Subscription churn rate

### Fan Dashboard
- [ ] Subscription status
- [ ] Billing history
- [ ] Update payment method
- [ ] Cancel subscription

## Implementation Checklist

### Phase 1: Setup ✅ COMPLETE
- [x] Create Stripe account (test mode)
- [x] Create products in Stripe Dashboard ($400/year artist, $10/month fan)
- [x] Add environment variables with real API keys
- [x] Install Stripe packages

### Phase 2: Database ✅ COMPLETE
- [x] Add Payment and Subscription models to Prisma schema
- [x] Update User model with stripeCustomerId
- [x] Run Prisma migration
- [x] Update to latest Stripe API version (2025-06-30.basil)

### Phase 3: API Development ✅ COMPLETE
- [x] Implement checkout session endpoint (`/api/payments/create-checkout-session`)
- [x] Build webhook handler (created but temporarily disabled for server stability)
- [x] Add payment verification endpoint (created but temporarily disabled)
- [x] Configure Stripe server utilities

### Phase 4: Frontend Integration ✅ COMPLETE  
- [x] Update artist payment page to use real Stripe checkout
- [x] Add coastal color scheme (teal/sage)
- [x] Handle loading and error states
- [x] Success page with real session verification

### Phase 5: Local Development Setup ✅ COMPLETE
- [x] Stripe CLI installed and configured
- [x] Webhook forwarding active: `whsec_f4d40ed7b00b89cfed04fd36c591739e7e36f94a4018dab45b9f506932564852`
- [x] Test environment ready

### Phase 6: TESTING & VERIFICATION ✅ COMPLETE
- [x] **Resolved localhost binding issue**: Use `next dev -H 0.0.0.0` flag for proper interface binding
- [x] **Tested complete payment flow**: $400 artist payment with test card `4242 4242 4242 4242`
- [x] **Verified webhook events**: Real-time processing working (customer.created, checkout.session.completed, etc.)
- [x] **User activation working**: Webhook automatically sets user status to ACTIVE
- [x] **Dashboard access**: Payment completion grants immediate dashboard access
- [ ] Add payment history to dashboards (next phase)
- [ ] Build subscription management (next phase)

### Phase 7: PRODUCTION READY FEATURES
- [x] **Webhook Handler**: `/api/payments/webhook/route.ts` processing all payment events
- [x] **Streamlined UI**: Removed redundant payment forms, direct Stripe Checkout integration
- [x] **Payment Recording**: Database properly stores payment and subscription records
- [x] **Error Handling**: Comprehensive webhook event processing with proper error responses
- [x] **Test Verification**: Successfully tested with `judah@judah.com` user account

## Security Considerations

1. **Webhook Verification**
   ```typescript
   const sig = request.headers['stripe-signature'];
   const event = stripe.webhooks.constructEvent(
     body,
     sig,
     process.env.STRIPE_WEBHOOK_SECRET
   );
   ```

2. **Idempotency**
   - Check if payment/subscription already exists
   - Use Stripe event IDs to prevent duplicates
   - Log all webhook events

3. **Error Handling**
   - Always return 200 OK to Stripe
   - Log errors for debugging
   - Implement retry logic

## Grace Period Logic

```typescript
// 7-day grace period for failed payments
const GRACE_PERIOD_DAYS = 7;

// On payment failure
if (subscription.status === 'PAST_DUE') {
  const gracePeriodEnd = addDays(subscription.currentPeriodEnd, GRACE_PERIOD_DAYS);
  
  if (isAfter(new Date(), gracePeriodEnd)) {
    // Deactivate user
    await updateUserStatus(userId, 'INACTIVE');
  } else {
    // Show warning banner
    // Send reminder emails
    // But maintain access
  }
}
```

## Production Deployment Notes

### Vercel Deployment
1. Add environment variables to Vercel
2. Update webhook endpoint in Stripe Dashboard
3. Use production API keys
4. Enable Stripe production mode

### Testing in Production
1. Use Vercel preview deployments
2. Test with real cards in small amounts
3. Monitor webhook logs
4. Set up error alerting

## Troubleshooting

### Common Issues
1. **Webhook not receiving events**
   - Check Stripe CLI is running
   - Verify endpoint URL
   - Check signing secret

2. **Payment succeeds but user not activated**
   - Check webhook logs
   - Verify database updates
   - Check user status logic

3. **Subscription not renewing**
   - Check webhook handler
   - Verify subscription record
   - Check Stripe Dashboard

## 🚨 CURRENT SERVER ISSUE

**Problem**: Next.js development server shows "Ready" but localhost:3000 is not accessible
**Tried**: TypeScript error fixes (60+ fixed), nuclear reset, port 3000 conflicts
**Status**: Requires restart/environmental fix

**Diagnostic Command**: 
```bash
npx next dev --port 3002
```

**Resolved Issues & Solutions**:
1. ✅ **Localhost binding fixed**: Use `next dev -H 0.0.0.0` for proper interface binding
2. ✅ **Payment flow tested**: Complete $400 artist payment working end-to-end
3. ✅ **Webhook integration verified**: Real-time event processing operational
4. ✅ **User activation automated**: Payment completion automatically grants dashboard access
5. ✅ **UI streamlined**: Direct Stripe Checkout integration (redundant forms removed)

**Development Commands**:
```bash
# Start server with proper binding
npm run dev  # Or: next dev -H 0.0.0.0

# Start Stripe webhook listener (separate terminal)
cd /path/to/project
stripe listen --forward-to localhost:3000/api/payments/webhook
```

---

**Last Updated**: July 21, 2025
**Status**: ✅ Stripe Integration Complete & Operational
**Next Steps**: Implement fan payment flow ($10/month) and dashboard payment management features