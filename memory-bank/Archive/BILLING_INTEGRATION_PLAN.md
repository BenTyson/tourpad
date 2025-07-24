# Payment/Billing Integration Plan - TourPad

**Created**: July 21, 2025  
**Status**: Ready for Implementation  
**Prerequisites**: Stripe integration complete ✅

## Overview
Integrate comprehensive payment/billing information into both artist dashboards and admin interfaces. Replace mock data with real database connections and create robust financial management tools.

## Phase 1: API Foundation (30 min)
**Create Missing API Endpoints**

### 1.1 User Payment APIs
- `/api/payments/subscription-status` - Get user subscription details  
  - Current status (Active/Past Due/Canceled)
  - Next billing date and amount
  - Payment method info (last 4 digits)
  - Grace period information

### 1.2 Admin User Management
- `/api/admin/users` - Real database user management (replace mock data)
  - Full user data with payment status
  - Subscription information
  - Payment history integration
  - Status filtering and search

### 1.3 Admin Finance APIs
- `/api/admin/finance/overview` - Financial dashboard metrics
  - Monthly recurring revenue (MRR)
  - Annual recurring revenue (ARR)  
  - Growth metrics and trends
  - Failed payment counts

- `/api/admin/finance/subscriptions` - Active subscriptions management
  - All active artist subscriptions
  - Subscription status breakdown
  - Churn analysis data

- `/api/admin/finance/failed-payments` - Payment failures requiring attention
  - Failed payments with retry status
  - Grace period tracking
  - Customer contact information

## Phase 2: Artist Dashboard Integration (45 min)
**Add Payment/Billing Section to Dashboard**

### 2.1 Payment Status Card Component
```typescript
interface PaymentStatusCard {
  subscriptionStatus: 'ACTIVE' | 'PAST_DUE' | 'CANCELED'
  nextBillingDate: Date
  amount: number // $400 in cents
  paymentMethod: string // "•••• 4242"
  gracePeriodEnd?: Date
}
```

**Features:**
- Visual status indicator (green/yellow/red)
- Next billing date prominently displayed
- Clear payment method information
- Grace period warning if applicable

### 2.2 Billing History Component
```typescript
interface BillingHistory {
  payments: Payment[]
  subscriptions: Subscription[]
  failedAttempts: FailedPayment[]
}
```

**Features:**
- Chronological payment history
- Success/failure indicators
- Amount and date for each transaction
- Failed payment retry information
- Receipt download links (future enhancement)

### 2.3 Billing Management Section
**Features:**
- "Update Payment Method" → Stripe Customer Portal
- "Cancel Subscription" with confirmation modal
- Billing address management
- Subscription pause/resume options (future)

## Phase 3: Admin Users Page Database Integration (30 min)
**Replace Mock Data with Real Database**

### 3.1 Database Integration
- Connect `/admin/users` to `/api/admin/users` endpoint
- Remove hardcoded mock user data
- Implement real-time status updates

### 3.2 Payment-Specific Features
**Enhanced Filtering:**
- Payment Status: Paid, Overdue, Active, Canceled
- Subscription Type: Artist Annual, Fan Monthly
- Payment Method: Card, Failed Payment

**Enhanced Display:**
- Real Stripe customer information
- Subscription status with next billing date
- Payment failure indicators
- Last payment amount and date

### 3.3 Admin Actions
- Manual subscription pause/resume
- Force payment retry
- Send payment reminder email
- View full payment history per user

## Phase 4: Admin Finance Dashboard Creation (60 min)
**Build `/admin/finance` Page**

### 4.1 Revenue Overview Dashboard
```typescript
interface RevenueMetrics {
  mrr: number // Monthly Recurring Revenue
  arr: number // Annual Recurring Revenue
  growthRate: number // Month-over-month growth
  totalRevenue: number // All-time revenue
}
```

**Visual Components:**
- Revenue trend chart (last 12 months)
- Growth rate indicators
- Revenue breakdown (Artist vs Fan subscriptions)
- Monthly vs annual subscription split

### 4.2 Subscription Analytics
```typescript
interface SubscriptionMetrics {
  activeSubscriptions: number
  newSubscriptions: number // This month
  canceledSubscriptions: number
  churnRate: number
  averageLifetimeValue: number
}
```

**Features:**
- Subscription health indicators
- Churn rate analysis and trends
- Customer lifetime value calculations
- Subscription cohort analysis

### 4.3 Payment Operations Center
```typescript
interface PaymentOperations {
  failedPayments: FailedPayment[]
  overduePayments: Payment[]
  gracePeriodUsers: User[]
  retryQueue: PaymentRetry[]
}
```

**Admin Actions:**
- Review and retry failed payments
- Contact users with overdue payments
- Extend grace periods manually
- Process refunds and adjustments

### 4.4 Financial Reporting
**Export Capabilities:**
- Revenue reports (monthly, quarterly, annual)
- Subscription analytics CSV export
- Failed payment reports
- Tax and accounting data export

**Date Range Filtering:**
- Custom date ranges
- Preset ranges (last 30 days, last quarter, etc.)
- Comparison periods (vs last month, vs last year)

## Phase 5: Integration & Polish (30 min)
**Connect All Systems**

### 5.1 Real-Time Updates
- Webhook integration for immediate dashboard updates
- Payment status change notifications
- Admin dashboard metric refreshes

### 5.2 Admin Audit Trail
```typescript
interface PaymentAuditLog {
  adminId: string
  action: 'REFUND' | 'RETRY' | 'CANCEL' | 'EXTEND_GRACE'
  targetUserId: string
  amount?: number
  reason?: string
  timestamp: Date
}
```

### 5.3 Testing & Validation
- Complete payment lifecycle testing
- Admin dashboard metric accuracy
- Webhook integration verification
- Error handling and edge cases

## Technical Implementation Details

### Database Schema Usage
**Existing Models to Leverage:**
- `Payment` - Transaction records and status
- `Subscription` - Recurring billing information
- `User` - Customer data and status
- `AdminAction` - Audit trail for admin actions

**New Computed Fields:**
```prisma
// Add to Payment model queries
subscription_days_remaining: number
grace_period_expires: Date?
lifetime_value: number
churn_risk_score: number
```

### API Response Patterns
```typescript
// Standard payment info response
interface PaymentResponse {
  subscription: {
    status: SubscriptionStatus
    currentPeriodEnd: Date
    amount: number
    interval: string
  }
  paymentMethod: {
    brand: string
    last4: string
    expiryMonth: number
    expiryYear: number
  }
  billing: {
    nextPaymentDate: Date
    lastPaymentDate: Date
    totalPaid: number
  }
}
```

### Security Considerations
1. **Admin Authentication**: All finance endpoints require admin role
2. **PII Protection**: Mask sensitive payment data in logs
3. **Audit Logging**: Track all admin actions on payment data
4. **Rate Limiting**: Protect finance APIs from abuse
5. **Data Encryption**: Ensure payment data is properly encrypted

### Integration Points
1. **Stripe Webhooks**: Real-time payment status updates
2. **Dashboard Metrics**: Live updates without page refresh
3. **Email Notifications**: Payment failure and success notifications
4. **Customer Portal**: Stripe-hosted payment method management

## Success Metrics
- **Artist Experience**: Clear visibility into subscription status and billing
- **Admin Efficiency**: Quick identification and resolution of payment issues
- **Financial Visibility**: Comprehensive revenue and subscription analytics
- **Data Accuracy**: Real-time synchronization with Stripe data

## Future Enhancements
- **Advanced Analytics**: Predictive churn modeling
- **Automated Dunning**: Smart payment retry sequences
- **Revenue Optimization**: A/B testing for pricing and billing
- **Customer Success**: Proactive outreach for at-risk subscriptions

---

**Implementation Order**: Phase 1 → Phase 3 → Phase 2 → Phase 4 → Phase 5  
**Total Estimated Time**: 3.5 hours  
**Dependencies**: Stripe integration, webhook system, admin authentication