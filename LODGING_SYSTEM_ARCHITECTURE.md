# TourPad Lodging System - Complete Architecture

## Executive Summary
TourPad's lodging system enables a dual-host model where artists can book shows and accommodation separately or together, creating a comprehensive touring ecosystem.

## System Overview

### Host Types
1. **Show Hosts**: Focus on performance venues (may offer lodging)
2. **Lodging Hosts**: Focus on accommodation only (no show hosting)
3. **Hybrid Hosts**: Both show and lodging capabilities

### Booking Scenarios
- **Scenario A**: Show + Lodging at same host (integrated booking)
- **Scenario B**: Show at Host A + Lodging at Host B (separate bookings)
- **Scenario C**: Show at Host A + Artist finds own lodging (external)

---

## Data Architecture

### Core Host Interface Updates
```typescript
interface Host {
  // Existing fields...
  hostingCapabilities: {
    showHosting: {
      enabled: boolean;
      venueDetails?: VenueDetails;
    };
    lodgingHosting: {
      enabled: boolean;
      lodgingDetails?: LodgingDetails;
    };
  };
  
  // New fields for lodging-only hosts
  primaryHostType: 'show' | 'lodging' | 'hybrid';
  serviceRadius?: number; // miles willing to serve from their location
}
```

### Lodging Data Model
```typescript
interface LodgingDetails {
  // Room Configuration
  roomType: 'private_bedroom' | 'shared_space' | 'guest_room' | 'couch_surface';
  bathroomType: 'private' | 'shared' | 'guest_bathroom';
  bedConfiguration: {
    beds: Array<{
      type: 'queen' | 'king' | 'full' | 'twin' | 'sofa_bed' | 'air_mattress';
      quantity: number;
    }>;
    maxOccupancy: number;
  };
  
  // Amenities & Services
  amenities: {
    breakfast: boolean;
    breakfastType?: 'full' | 'continental' | 'coffee_only';
    wifi: boolean;
    parking: boolean;
    laundry: boolean;
    kitchenAccess: boolean;
    workspace: boolean;
    linensProvided: boolean;
    towelsProvided: boolean;
    transportation?: 'can_pickup' | 'can_drop_off' | 'both' | 'none';
  };
  
  // Policies & Rules
  houseRules: {
    checkInTime: string;
    checkOutTime: string;
    quietHours: { start: string; end: string };
    smokingPolicy: 'no_smoking' | 'outdoor_only' | 'designated_areas';
    petPolicy: 'no_pets' | 'pets_welcome' | 'case_by_case';
    alcoholPolicy: 'no_alcohol' | 'allowed' | 'byo_only';
  };
  
  // Pricing
  pricing: {
    baseRate: number; // per night
    additionalGuestFee?: number; // per person per night
    cleaningFee?: number; // one-time
    discountForLongStays?: { minNights: number; discountPercent: number };
  };
  
  // Availability
  availability: {
    blackoutDates: string[];
    minimumStay: number; // nights
    maximumStay: number; // nights
    advanceBookingRequired: number; // days
  };
  
  // Media
  lodgingPhotos: Array<{
    id: string;
    url: string;
    category: 'bedroom' | 'bathroom' | 'common_area' | 'exterior' | 'amenities';
    title: string;
    description?: string;
    isRequired: boolean; // bedroom photos required
  }>;
  
  // Additional Info
  accessibility: string[];
  specialConsiderations: string;
  localRecommendations: string;
  safetyFeatures: string[];
}
```

### Booking System Updates
```typescript
interface Booking {
  // Existing fields...
  lodgingRequest?: {
    needed: boolean;
    hostId?: string; // if different from show host
    guestCount: number;
    arrivalDate: string;
    departureDate: string;
    specialRequirements: string;
    dietaryRestrictions: string;
    accessibilityNeeds: string;
    totalCost?: number;
    status: 'pending' | 'confirmed' | 'declined';
  };
  
  // New booking type for lodging-only
  bookingType: 'show' | 'lodging' | 'show_with_lodging';
  linkedBookingId?: string; // for show+lodging pairs
}

interface LodgingBooking extends Omit<Booking, 'bookingType'> {
  bookingType: 'lodging';
  showBookingId?: string; // reference to associated show
  showVenue?: {
    hostId: string;
    hostName: string;
    venueName: string;
    showDate: string;
    distance: number; // miles from lodging
  };
}
```

---

## User Experience Flow

### Host Registration & Setup

#### Show Host with Lodging
1. **Registration**: Choose "Host shows and offer lodging"
2. **Venue Setup**: Configure performance space details
3. **Lodging Setup**: Configure accommodation details
4. **Photo Upload**: Show venue photos + lodging photos
5. **Approval Process**: Admin reviews both capabilities

#### Lodging-Only Host
1. **Registration**: Choose "Offer lodging only"
2. **Service Area**: Define radius willing to serve
3. **Lodging Setup**: Configure accommodation details
4. **Photo Upload**: Lodging photos (required categories)
5. **Approval Process**: Admin reviews lodging capability

### Artist Booking Flow

#### Scenario A: Show + Lodging at Same Host
1. **Artist finds show host** with lodging available
2. **Booking form** includes lodging toggle
3. **Lodging details** form appears if toggled
4. **Single booking** created with both components
5. **Host approval** covers both show and lodging

#### Scenario B: Show at Host A + Lodging at Host B
1. **Artist books show** at Host A (no lodging)
2. **System suggests** nearby lodging hosts
3. **Artist browses** lodging options within radius
4. **Separate lodging booking** created
5. **Coordination** between hosts facilitated

---

## Technical Implementation

### Database Schema Changes
```sql
-- Add to hosts table
ALTER TABLE hosts ADD COLUMN primary_host_type ENUM('show', 'lodging', 'hybrid');
ALTER TABLE hosts ADD COLUMN service_radius INTEGER;
ALTER TABLE hosts ADD COLUMN lodging_details JSON;

-- New lodging_bookings table
CREATE TABLE lodging_bookings (
  id VARCHAR(255) PRIMARY KEY,
  host_id VARCHAR(255),
  artist_id VARCHAR(255),
  show_booking_id VARCHAR(255), -- nullable
  check_in_date DATE,
  check_out_date DATE,
  guest_count INTEGER,
  total_cost DECIMAL(10,2),
  status ENUM('pending', 'confirmed', 'declined', 'completed'),
  special_requirements TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (host_id) REFERENCES hosts(id),
  FOREIGN KEY (artist_id) REFERENCES artists(id),
  FOREIGN KEY (show_booking_id) REFERENCES bookings(id)
);

-- New lodging_photos table
CREATE TABLE lodging_photos (
  id VARCHAR(255) PRIMARY KEY,
  host_id VARCHAR(255),
  url VARCHAR(500),
  category ENUM('bedroom', 'bathroom', 'common_area', 'exterior', 'amenities'),
  title VARCHAR(255),
  description TEXT,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  FOREIGN KEY (host_id) REFERENCES hosts(id)
);
```

### API Endpoints
```typescript
// Lodging Management
POST /api/hosts/lodging/setup
PUT /api/hosts/lodging/update
GET /api/hosts/lodging/availability
POST /api/hosts/lodging/photos

// Lodging Discovery
GET /api/lodging/search
GET /api/lodging/nearby?lat=X&lng=Y&radius=Z
GET /api/lodging/host/:hostId

// Lodging Bookings
POST /api/bookings/lodging
GET /api/bookings/lodging/:id
PUT /api/bookings/lodging/:id/status
```

---

## User Interface Components

### Host Dashboard Components
```
/dashboard/lodging/
├── setup/                 # Initial lodging configuration
├── availability/          # Manage calendar and availability
├── photos/               # Upload and manage lodging photos
├── pricing/              # Set rates and policies
├── bookings/             # Manage lodging bookings
└── reviews/              # View lodging reviews
```

### Artist Booking Components
```
/booking/
├── show-with-lodging/    # Combined booking form
├── lodging-search/       # Search nearby lodging
├── lodging-details/      # View lodging details
└── booking-confirmation/ # Confirm show + lodging bookings
```

### New Pages Required
- `/hosts/lodging-only` - Browse lodging-only hosts
- `/lodging/search` - Advanced lodging search
- `/lodging/host/:id` - Lodging host profile
- `/bookings/lodging/:id` - Lodging booking details

---

## Business Logic

### Matching Algorithm
```typescript
function findNearbyLodging(showLocation: Location, radius: number) {
  return lodgingHosts.filter(host => {
    const distance = calculateDistance(showLocation, host.location);
    return distance <= radius && host.availability.matches(dates);
  }).sort((a, b) => a.distance - b.distance);
}
```

### Pricing Logic
```typescript
function calculateLodgingCost(lodging: LodgingDetails, booking: LodgingBooking) {
  const nights = calculateNights(booking.arrivalDate, booking.departureDate);
  const baseRate = lodging.pricing.baseRate * nights;
  const additionalGuests = Math.max(0, booking.guestCount - 1);
  const additionalGuestFees = additionalGuests * (lodging.pricing.additionalGuestFee || 0) * nights;
  const cleaningFee = lodging.pricing.cleaningFee || 0;
  
  return baseRate + additionalGuestFees + cleaningFee;
}
```

### Coordination Logic
```typescript
function coordinateShowAndLodging(showBooking: Booking, lodgingBooking: LodgingBooking) {
  // Link bookings
  showBooking.linkedBookingId = lodgingBooking.id;
  lodgingBooking.showBookingId = showBooking.id;
  
  // Notify both hosts
  notifyHost(showBooking.hostId, 'Artist has lodging arranged nearby');
  notifyHost(lodgingBooking.hostId, 'Guest has show on [date] at [venue]');
}
```

---

## Implementation Phases

### Phase 1: Foundation (Current Priority)
- [ ] Update Host interface with lodging capabilities
- [ ] Create lodging setup forms in host dashboard
- [ ] Implement lodging photo upload
- [ ] Update artist booking flow for show+lodging
- [ ] Add lodging display to host profiles

### Phase 2: Separate Lodging System
- [ ] Create lodging-only host registration
- [ ] Build lodging discovery and search
- [ ] Implement separate lodging booking system
- [ ] Add lodging host profiles and management
- [ ] Create coordination between show and lodging hosts

### Phase 3: Advanced Features
- [ ] Intelligent lodging suggestions
- [ ] Multi-host trip planning
- [ ] Lodging reviews and ratings
- [ ] Advanced matching algorithms
- [ ] Mobile-optimized lodging experience

---

## Quality Assurance

### Required Photos for Lodging
- **Bedroom**: Main sleeping area (required)
- **Bathroom**: Bathroom guests will use (required)
- **Common Areas**: Kitchen, living room access
- **Exterior**: House exterior for recognition
- **Amenities**: Parking, workspace, special features

### Host Approval Process
1. **Identity Verification**: Government ID check
2. **Photo Review**: Ensure photos match descriptions
3. **Reference Check**: Previous hosting experience
4. **Safety Verification**: Basic safety features present
5. **Communication Test**: Response time and quality

### Safety & Security
- Emergency contact information required
- First aid kit availability
- Smoke detector verification
- Security deposit policy
- Insurance coverage confirmation

---

## Revenue Model

### Platform Fees
- **Show Bookings**: Existing 5% fee
- **Lodging Bookings**: 8% fee (higher touch service)
- **Coordination Fee**: 2% when show and lodging are separate hosts

### Host Incentives
- **Hybrid Hosts**: Reduced fees for offering both services
- **High-Rating Hosts**: Fee reductions for excellent reviews
- **Volume Discounts**: Reduced fees for frequent bookings

---

This architecture provides a comprehensive foundation for implementing TourPad's lodging system in a scalable, user-friendly way while maintaining platform quality and safety standards.