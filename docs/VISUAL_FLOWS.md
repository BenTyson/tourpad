# TourPad Visual Flow Diagrams

## Overview
This document provides ASCII-based visual representations of key user flows through the TourPad platform, making it easy to understand the complete user journey at a glance.

## Quick Navigation
- [Complete Platform Overview](#complete-platform-overview)
- [Artist Journey Visual](#artist-journey-visual)
- [Host Journey Visual](#host-journey-visual)
- [Fan Journey Visual](#fan-journey-visual)
- [Cross-User Interaction Flows](#cross-user-interaction-flows)
- [Authentication & Status Flow](#authentication--status-flow)

---

## Complete Platform Overview

```
                          TourPad Platform Overview
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                           ENTRY POINTS                                 │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
    │  │   Landing   │  │  /for-      │  │  /for-      │  │   Browse    │    │
    │  │   Page      │  │  artists    │  │  hosts      │  │   Pages     │    │
    │  │     /       │  │             │  │             │  │ /artists    │    │
    │  └─────────────┘  └─────────────┘  └─────────────┘  │ /hosts      │    │
    │         │               │               │           └─────────────┘    │
    │         └───────────────┼───────────────┼─────────────────┘            │
    │                         │               │                              │
    └─────────────────────────┼───────────────┼──────────────────────────────┘
                              │               │
                    ┌─────────┼───────────────┼─────────┐
                    │         ▼               ▼         │
                    │    REGISTRATION FLOW              │
                    │  ┌─────────────────────────────┐   │
                    │  │     /register               │   │
                    │  │   User Type Selection       │   │
                    │  └─────────────┬───────────────┘   │
                    │                │                   │
                    │    ┌───────────┼───────────┐       │
                    │    ▼           ▼           ▼       │
                    │  ┌─────┐   ┌─────┐   ┌─────┐      │
                    │  │ARTIST│   │HOST │   │ FAN │      │
                    │  └─────┘   └─────┘   └─────┘      │
                    └────┬─────────┬─────────┬───────────┘
                         │         │         │
         ┌───────────────┼─────────┼─────────┼───────────────┐
         │               ▼         ▼         ▼               │
         │         APPROVAL & PAYMENT FLOW                  │
         │                                                  │
         │  ARTIST:           HOST:            FAN:         │
         │  Onboarding  →     Onboarding  →   Payment  →    │
         │  Admin Review →    Admin Review    Active        │
         │  Payment     →     Active                        │
         │  Active                                          │
         │                                                  │
         └──────────────────┬───────────────────────────────┘
                            │
    ┌───────────────────────┼───────────────────────────────────────────────┐
    │                       ▼                                               │
    │                  ACTIVE PLATFORM                                      │
    │                                                                       │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
    │  │   ARTIST    │  │    HOST     │  │    FAN      │  │   ADMIN     │  │
    │  │ DASHBOARD   │  │ DASHBOARD   │  │ DASHBOARD   │  │  PANEL      │  │
    │  │             │  │             │  │             │  │             │  │
    │  │ • Bookings  │  │ • Venue     │  │ • Concerts  │  │ • Apps      │  │
    │  │ • Tour Plan │  │ • RSVPs     │  │ • RSVPs     │  │ • Users     │  │
    │  │ • Music     │  │ • Messages  │  │ • Reviews   │  │ • Finance   │  │
    │  │ • Messages  │  │ • Lodging   │  │ • Artists   │  │ • Messages  │  │
    │  │ • Profile   │  │ • Reviews   │  │ • Messages  │  │ • Metrics   │  │
    │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
    │         │               │               │               │            │
    └─────────┼───────────────┼───────────────┼───────────────┼────────────┘
              │               │               │               │
              └───────────────┼───────────────┼───────────────┘
                              │               │
                    ┌─────────┼───────────────┼─────────┐
                    │         ▼               ▼         │
                    │     INTERACTION LAYER             │
                    │                                   │
                    │  Artist → Host:  Discovery, Booking, Messaging     │
                    │  Host → Fan:     RSVP Approval, Event Hosting      │
                    │  Artist → Fan:   Performance, Reviews, Community   │
                    │  All Users:      Reviews, Ratings, Reputation      │
                    │                                                     │
                    └─────────────────────────────────────────────────────┘
```

---

## Artist Journey Visual

```
                               ARTIST JOURNEY FLOW
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                           DISCOVERY PHASE                               │
    │                                                                         │
    │  Landing Page  →  /for-artists  →  Learn Benefits  →  "Get Started"    │
    │       /              /for-artists        Value Prop       Register      │
    │                                                                         │
    └────────────────────────────┬────────────────────────────────────────────┘
                                 │
    ┌────────────────────────────▼─────────────────────────────────────────────┐
    │                      REGISTRATION PHASE                                 │
    │                                                                         │
    │  Registration  →  Select "Artist"  →  OAuth Login  →  Onboarding Form  │
    │   /register           User Type         Google           /onboarding/   │
    │                                                           artist        │
    │                                                              │          │
    │  Onboarding Form Includes:                                   │          │
    │  • Personal Info (name, email, location)                    │          │
    │  • Artist Details (stage name, genres, bio)                 │          │
    │  • Performance Video Upload                                  │          │
    │  • Press Photos Upload                                       │          │
    │  • Social Media Links                                        │          │
    │  • Experience & Tour History                                 │          │
    │                                                              │          │
    └──────────────────────────────────────────────────────────────┼──────────┘
                                                                   │
    ┌──────────────────────────────────────────────────────────────▼──────────┐
    │                       APPROVAL PHASE                                    │
    │                                                                         │
    │  Submit Application  →  Status: PENDING  →  /pending-approval          │
    │                             │                    │                     │
    │                             ▼                    │                     │
    │                     Admin Reviews               Wait                   │
    │                    /admin/applications           │                     │
    │                             │                    │                     │
    │                    ┌────────┼────────┐           │                     │
    │                    ▼        ▼        ▼           │                     │
    │                 Approve   Review   Reject        │                     │
    │                    │        │        │           │                     │
    │                    │        └────────┼───────────┘                     │
    │                    │                 │                                 │
    │            Status: APPROVED    Status: REJECTED                        │
    │                    │                 │                                 │
    │              Next: Payment      Access Limited                         │
    │                                                                         │
    └────────────────────┼───────────────────────────────────────────────────┘
                         │
    ┌────────────────────▼─────────────────────────────────────────────────────┐
    │                         PAYMENT PHASE                                   │
    │                                                                         │
    │  Payment Required  →  /payment/artist  →  Stripe Checkout $400/year    │
    │                           │                        │                    │
    │                           ▼                        ▼                    │
    │                    Show Membership              Complete                │
    │                       Details                   Payment                 │
    │                           │                        │                    │
    │                           ▼                        ▼                    │
    │                   "Start Your Music           Webhook                   │
    │                      Journey"                Processing                 │
    │                           │                        │                    │
    │                           ▼                        ▼                    │
    │                   Stripe Checkout  →  /payment/success  →  Status: ACTIVE │
    │                                                                         │
    └────────────────────────────────────────────────────┬────────────────────┘
                                                         │
    ┌────────────────────────────────────────────────────▼────────────────────┐
    │                        ACTIVE PLATFORM                                  │
    │                                                                         │
    │  Full Dashboard Access  →  /dashboard  →  Artist Dashboard             │
    │                                                                         │
    │  ┌─────────────────────────────────────────────────────────────────┐    │
    │  │                    DASHBOARD FEATURES                           │    │
    │  │                                                                 │    │
    │  │  Profile Setup     →  /dashboard/profile                       │    │
    │  │  • Complete artist profile                                     │    │
    │  │  • Upload press photos                                         │    │
    │  │  • Set performance preferences                                 │    │
    │  │                                                                 │    │
    │  │  Music Integration →  /dashboard/music                         │    │
    │  │  • Connect Spotify account                                     │    │
    │  │  • Connect SoundCloud account                                  │    │
    │  │  • Upload MP3 files                                            │    │
    │  │                                                                 │    │
    │  │  Tour Planning     →  /dashboard/tour-planner                  │    │
    │  │  • Create tour segments                                        │    │
    │  │  • Set geographic schedules                                    │    │
    │  │  • Plan state-by-state tours                                   │    │
    │  │                                                                 │    │
    │  │  Host Discovery    →  /hosts                                   │    │
    │  │  • Browse host directory                                       │    │
    │  │  • Filter by location and preferences                          │    │
    │  │  • View venue details                                          │    │
    │  │                                                                 │    │
    │  │  Messaging        →  /dashboard/messages                       │    │
    │  │  • Contact hosts                                               │    │
    │  │  • Discuss show details                                        │    │
    │  │  • Share music samples                                         │    │
    │  │                                                                 │    │
    │  │  Booking Management → /dashboard/bookings                      │    │
    │  │  • Submit booking requests                                     │    │
    │  │  • Manage approval process                                     │    │
    │  │  • Confirm show details                                        │    │
    │  │                                                                 │    │
    │  │  Performance & Reviews                                         │    │
    │  │  • Coordinate shows                                            │    │
    │  │  • Perform at house concerts                                   │    │
    │  │  • Receive and respond to reviews                              │    │
    │  │                                                                 │    │
    │  └─────────────────────────────────────────────────────────────────┘    │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
```

---

## Host Journey Visual

```
                                HOST JOURNEY FLOW
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                          DISCOVERY PHASE                                │
    │                                                                         │
    │  Landing Page  →  /for-hosts  →  Learn Hosting  →  "Become a Host"     │
    │       /              /for-hosts      Benefits        Register           │
    │                                                                         │
    └────────────────────────────┬────────────────────────────────────────────┘
                                 │
    ┌────────────────────────────▼─────────────────────────────────────────────┐
    │                      REGISTRATION PHASE                                 │
    │                                                                         │
    │  Registration  →  Select "Host"  →  OAuth Login  →  Onboarding Form    │
    │   /register         User Type        Google          /onboarding/host  │
    │                                                              │          │
    │  Host Onboarding Form Includes:                              │          │
    │  • Venue Information (name, type, capacity)                 │          │
    │  • Location Details (address, coordinates)                  │          │
    │  • Venue Photos (multiple categories)                       │          │
    │  • Hosting Experience                                        │          │
    │  • Musical Preferences                                       │          │
    │  • Sound System Details                                      │          │
    │  • House Rules                                               │          │
    │  • Lodging Options (optional)                               │          │
    │                                                              │          │
    └──────────────────────────────────────────────────────────────┼──────────┘
                                                                   │
    ┌──────────────────────────────────────────────────────────────▼──────────┐
    │                       APPROVAL PHASE                                    │
    │                                                                         │
    │  Submit Application  →  Status: PENDING  →  /pending-approval          │
    │                             │                    │                     │
    │                             ▼                    │                     │
    │                     Admin Reviews               Wait                   │
    │                    /admin/applications           │                     │
    │                             │                    │                     │
    │  Admin Evaluation Criteria: │                    │                     │
    │  • Venue safety & suitability                   │                     │
    │  • Photo quality & accuracy                      │                     │
    │  • Hosting experience                            │                     │
    │  • Location appropriateness                      │                     │
    │                             │                    │                     │
    │                    ┌────────┼────────┐           │                     │
    │                    ▼        ▼        ▼           │                     │
    │                 Approve   Review   Reject        │                     │
    │                    │        │        │           │                     │
    │                    │        └────────┼───────────┘                     │
    │                    │                 │                                 │
    │            Status: ACTIVE      Status: REJECTED                        │
    │         (No Payment Required)        │                                 │
    │                    │           Access Limited                          │
    │              Full Access                                                │
    │                                                                         │
    └────────────────────┼───────────────────────────────────────────────────┘
                         │
    ┌────────────────────▼─────────────────────────────────────────────────────┐
    │                        ACTIVE PLATFORM                                  │
    │                   (Immediate Dashboard Access)                          │
    │                                                                         │
    │  Full Dashboard Access  →  /dashboard  →  Host Dashboard               │
    │                                                                         │
    │  ┌─────────────────────────────────────────────────────────────────┐    │
    │  │                    DASHBOARD FEATURES                           │    │
    │  │                                                                 │    │
    │  │  Venue Profile Setup → /dashboard/profile                      │    │
    │  │  • Complete venue information                                  │    │
    │  │  • Set capacity and layout                                     │    │
    │  │  • Configure sound system                                      │    │
    │  │  • Update availability                                         │    │
    │  │                                                                 │    │
    │  │  Photo Gallery → /dashboard/lodging/photos                     │    │
    │  │  • Upload venue photos by category                             │    │
    │  │  • Organize display order                                      │    │
    │  │  • Add photo descriptions                                      │    │
    │  │                                                                 │    │
    │  │  Musical Preferences Configuration                             │    │
    │  │  • Select preferred genres                                     │    │
    │  │  • Set act size preferences                                    │    │
    │  │  • Define content rating                                       │    │
    │  │  • Specify hosting style                                       │    │
    │  │                                                                 │    │
    │  │  Lodging Setup (Optional) → /dashboard/lodging/setup           │    │
    │  │  • Configure room details                                      │    │
    │  │  • List amenities                                              │    │
    │  │  • Set house rules                                             │    │
    │  │                                                                 │    │
    │  │  Artist Discovery → /artists                                   │    │
    │  │  • Browse artist directory                                     │    │
    │  │  • Filter by tour schedules                                    │    │
    │  │  • View artist profiles                                        │    │
    │  │                                                                 │    │
    │  │  Messaging → /dashboard/messages                               │    │
    │  │  • Respond to artist inquiries                                 │    │
    │  │  • Discuss show logistics                                      │    │
    │  │  • Share venue details                                         │    │
    │  │                                                                 │    │
    │  │  Booking Management → /dashboard/bookings                      │    │
    │  │  • Review booking requests                                     │    │
    │  │  • Approve/decline requests                                    │    │
    │  │  • Manage calendar                                             │    │
    │  │                                                                 │    │
    │  │  RSVP Management                                               │    │
    │  │  • Review fan RSVP requests                                    │    │
    │  │  • Approve based on capacity                                   │    │
    │  │  • Manage event logistics                                      │    │
    │  │                                                                 │    │
    │  │  Concert Hosting                                               │    │
    │  │  • Host house concerts                                         │    │
    │  │  • Facilitate artist-fan interactions                         │    │
    │  │  • Ensure community guidelines                                 │    │
    │  │                                                                 │    │
    │  └─────────────────────────────────────────────────────────────────┘    │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
```

---

## Fan Journey Visual

```
                                FAN JOURNEY FLOW
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                          DISCOVERY PHASE                                │
    │                                                                         │
    │  Landing Page  →  Browse Concerts  →  "Membership Required"  →  Join   │
    │       /             /concerts           Limited Preview      Register   │
    │                                                                         │
    └────────────────────────────┬────────────────────────────────────────────┘
                                 │
    ┌────────────────────────────▼─────────────────────────────────────────────┐
    │                    REGISTRATION & PAYMENT                               │
    │                                                                         │
    │  Registration  →  Select "Fan"  →  Immediate Payment  →  $10/month     │
    │   /register        User Type        /payment/fan        Subscription    │
    │                         │                │                    │         │
    │                         ▼                ▼                    ▼         │
    │                    No Application    Stripe Checkout    Recurring       │
    │                      Required                           Billing         │
    │                         │                │                    │         │
    │                         └────────────────┼────────────────────┘         │
    │                                          │                              │
    │                                          ▼                              │
    │                                  Payment Success                        │
    │                                          │                              │
    │                                          ▼                              │
    │                                   Status: ACTIVE                        │
    │                                          │                              │
    │                                  Immediate Access                       │
    │                                                                         │
    └────────────────────────────────────────────┬────────────────────────────┘
                                                 │
    ┌────────────────────────────────────────────▼────────────────────────────┐
    │                        ACTIVE PLATFORM                                  │
    │                      (Immediate Access)                                 │
    │                                                                         │
    │  Fan Dashboard Access  →  /dashboard/fan  →  Fan-Specific Features     │
    │                                                                         │
    │  ┌─────────────────────────────────────────────────────────────────┐    │
    │  │                    FAN DASHBOARD FEATURES                       │    │
    │  │                                                                 │    │
    │  │  Profile Setup → /dashboard/fan/profile                        │    │
    │  │  • Set location & travel radius                                │    │
    │  │  • Select favorite genres                                      │    │
    │  │  • Upload profile photo                                        │    │
    │  │  • Write personal bio                                          │    │
    │  │                                                                 │    │
    │  │  Concert Discovery → /concerts                                 │    │
    │  │  • Browse available house concerts                             │    │
    │  │  • Filter by genre, date, location                             │    │
    │  │  • View artist profiles & samples                              │    │
    │  │  • Check venue details                                         │    │
    │  │                                                                 │    │
    │  │  Artist Exploration → /artists                                 │    │
    │  │  • Discover new artists                                        │    │
    │  │  • View tour schedules                                         │    │
    │  │  • Listen to music samples                                     │    │
    │  │                                                                 │    │
    │  │  RSVP System                                                   │    │
    │  │  • Submit RSVP requests                                        │    │
    │  │  • Specify guest count                                         │    │
    │  │  • Wait for host approval                                      │    │
    │  │  • Receive confirmation                                        │    │
    │  │                                                                 │    │
    │  │  Concert Attendance                                            │    │
    │  │  • Attend house concerts                                       │    │
    │  │  • Network with artists & fans                                 │    │
    │  │  • Follow community guidelines                                 │    │
    │  │                                                                 │    │
    │  │  Review System                                                 │    │
    │  │  • Write concert reviews                                       │    │
    │  │  • Rate artist performances                                    │    │
    │  │  • Rate venue experiences                                      │    │
    │  │  • Build community reputation                                  │    │
    │  │                                                                 │    │
    │  │  Community Building                                            │    │
    │  │  • Connect with artists                                        │    │
    │  │  • Discover local music scene                                  │    │
    │  │  • Build fan reputation                                        │    │
    │  │                                                                 │    │
    │  └─────────────────────────────────────────────────────────────────┘    │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
```

---

## Cross-User Interaction Flows

### Artist ↔ Host Booking Flow
```
    ARTIST                                                    HOST
       │                                                       │
       │ 1. Browse Hosts (/hosts)                             │
       │ ─────────────────────────→                           │
       │                                                       │
       │ 2. View Host Profile (/hosts/[id])                   │
       │ ─────────────────────────→                           │
       │                                                       │
       │ 3. Send Message (/dashboard/messages)                │
       │ ─────────────────────────→                           │
       │                           │ 4. Receive Message       │
       │                           │ ←─────────────────────────│
       │                                                       │
       │ 5. Submit Booking Request (/dashboard/bookings)      │
       │ ─────────────────────────→                           │
       │                           │ 6. Review Request        │
       │                           │ ←─────────────────────────│
       │                                                       │
       │                           │ 7. Approve Request       │
       │ 8. Receive Approval       │ ←─────────────────────────│
       │ ←─────────────────────────                           │
       │                                                       │
       │ 9. Confirm Show (5-day window)                       │
       │ ─────────────────────────→                           │
       │                           │ 10. Show Confirmed       │
       │                           │ ←─────────────────────────│
       │                                                       │
       │           CONCERT SCHEDULED                           │
       │ ←─────────────────────────→                           │
```

### Host ↔ Fan RSVP Flow
```
    FAN                                                       HOST
       │                                                       │
       │ 1. Discover Concert (/concerts)                      │
       │ ─────────────────────────→                           │
       │                                                       │
       │ 2. Submit RSVP Request                               │
       │ ─────────────────────────→                           │
       │                           │ 3. Review RSVP          │
       │                           │ ←─────────────────────────│
       │                                                       │
       │                           │ 4. Check Capacity       │
       │                           │ ←─────────────────────────│
       │                                                       │
       │                           │ 5. Approve/Waitlist     │
       │ 6. Receive Decision       │ ←─────────────────────────│
       │ ←─────────────────────────                           │
       │                                                       │
       │ 7. Attend Concert (if approved)                      │
       │ ─────────────────────────→                           │
       │                                                       │
       │ 8. Write Review                                       │
       │ ─────────────────────────→                           │
```

### Artist ↔ Fan Concert Flow
```
    ARTIST                    CONCERT EVENT                    FAN
       │                           │                           │
       │ 1. Arrive at Venue        │                           │
       │ ─────────────────────────→ │                           │
       │                           │ 2. Fan Arrival           │
       │                           │ ←─────────────────────────│
       │                           │                           │
       │ 3. Setup & Soundcheck     │                           │
       │ ─────────────────────────→ │                           │
       │                           │                           │
       │ 4. Performance            │ ←────────────────────────→ │
       │ ←─────────────────────────→ │ ←────────────────────────→ │
       │                           │                           │
       │ 5. Audience Interaction   │                           │
       │ ←─────────────────────────→ │ ←────────────────────────→ │
       │                           │                           │
       │                           │ 6. Post-Show Reviews     │
       │ 7. Receive Fan Reviews    │ ←─────────────────────────│
       │ ←─────────────────────────                           │
```

---

## Authentication & Status Flow

```
                               USER STATUS FLOW
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                              ENTRY                                      │
    │                                                                         │
    │              Registration → OAuth Login → User Type Selection          │
    │                   │              │              │                      │
    │                   └──────────────┼──────────────┘                      │
    │                                  │                                      │
    └──────────────────────────────────┼──────────────────────────────────────┘
                                       │
    ┌──────────────────────────────────▼──────────────────────────────────────┐
    │                           STATUS ROUTING                                │
    │                                                                         │
    │         ARTIST                HOST                 FAN                  │
    │           │                    │                   │                    │
    │           ▼                    ▼                   ▼                    │
    │    Status: PENDING      Status: PENDING    Direct Payment              │
    │           │                    │                   │                    │
    │           ▼                    ▼                   ▼                    │
    │   /onboarding/artist  /onboarding/host     /payment/fan                │
    │           │                    │                   │                    │
    │           ▼                    ▼                   ▼                    │
    │  /pending-approval    /pending-approval    Status: ACTIVE              │
    │           │                    │                   │                    │
    │           ▼                    ▼                   ▼                    │
    │   Admin Review         Admin Review        /dashboard/fan              │
    │           │                    │                                        │
    │    ┌──────┼──────┐      ┌──────┼──────┐                                │
    │    ▼      ▼      ▼      ▼      ▼      ▼                                │
    │ Approve Review Reject Approve Review Reject                            │
    │    │      │      │      │      │      │                                │
    │    ▼      │      ▼      ▼      │      ▼                                │
    │ APPROVED  │  REJECTED ACTIVE   │  REJECTED                             │
    │    │      │      │      │      │      │                                │
    │    ▼      │      ▼      ▼      │      ▼                                │
    │/payment/  │   Limited /dashboard │   Limited                           │
    │ artist    │   Access     │      │   Access                            │
    │    │      │              │      │                                      │
    │    ▼      │              ▼      │                                      │
    │$400/year  │         Full Access │                                      │
    │Payment    │              │      │                                      │
    │    │      │              └──────┘                                      │
    │    ▼      │                                                            │
    │ ACTIVE    │                                                            │
    │    │      │                                                            │
    │    ▼      ▼                                                            │
    │/dashboard Limited                                                      │
    │          Access                                                        │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
```

### Route Protection Matrix
```
                        ROUTE ACCESS BY STATUS
    ┌─────────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
    │     ROUTE       │ NO AUTH  │ PENDING  │ APPROVED │  ACTIVE  │  ADMIN   │
    ├─────────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
    │ /               │    ✅     │    ✅     │    ✅     │    ✅     │    ✅     │
    │ /artists        │    🔒     │    🔒     │    ✅     │    ✅     │    ✅     │
    │ /hosts          │    🔒     │    🔒     │    ✅     │    ✅     │    ✅     │
    │ /login          │    ✅     │    ✅     │    ✅     │    ✅     │    ✅     │
    │ /register       │    ✅     │    ❌     │    ❌     │    ❌     │    ❌     │
    │ /dashboard      │    ❌     │    🔒     │    ✅     │    ✅     │    ✅     │
    │ /pending-       │    ❌     │    ✅     │    ❌     │    ❌     │    ❌     │
    │  approval       │          │          │          │          │          │
    │ /payment/*      │    ❌     │    🔒     │    ✅     │    ❌     │    ❌     │
    │ /admin/*        │    ❌     │    ❌     │    ❌     │    ❌     │    ✅     │
    │ /messages       │    ❌     │    ❌     │    ✅     │    ✅     │    ✅     │
    │ /bookings       │    ❌     │    ❌     │    ✅     │    ✅     │    ✅     │
    └─────────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘

    Legend:
    ✅ = Full Access
    🔒 = Limited/Preview Access
    ❌ = No Access (redirected)
```

---

This visual documentation provides a clear overview of how users navigate through the TourPad platform, showing the complete flow from discovery to active participation in the house concert community. Each journey is designed to be intuitive while maintaining platform security and community standards.