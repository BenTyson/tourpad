# TourPad Map Functionality - Implementation Plan

## 🎯 Vision Statement
Create an intuitive, mobile-first mapping experience that allows users to discover available hosts and explore confirmed shows while maintaining location privacy and delivering exceptional UX across all device sizes, similar to Airbnb's map feature.

---

## 📋 Two Core Map Modes

### Mode 1: Available Hosts Discovery
- **Primary users**: Artists seeking venues, Fans exploring local hosts
- **Data source**: Host profiles with `APPROVED` status from database
- **Privacy**: Obfuscated coordinates (±0.01 lat/lng radius)
- **CTA**: "View Details" → "Request Booking"

### Mode 2: Confirmed Shows Explorer
- **Primary users**: Fans finding concerts, Artists seeing competition  
- **Data source**: Bookings with `CONFIRMED` status + Concert records from database
- **Privacy**: Exact coordinates for confirmed public shows
- **CTA**: "View Show" → "RSVP" or "Get Tickets"

---

## 🔍 Enhanced Filter System

### Essential Filters (Both Modes)
```typescript
interface CoreFilters {
  location: {
    searchRadius: number;        // 5, 10, 25, 50 miles
    coordinates: [lat, lng];
  };
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  capacity: {
    min: number;
    max: number;
  };
}
```

### Available Hosts Mode Filters
```typescript
interface HostFilters extends CoreFilters {
  venueTypes: ('Home/Living Room' | 'Backyard' | 'Loft/Warehouse' | 'Studio/Workshop')[];
  amenities: ('sound_system' | 'parking' | 'accessible' | 'kid_friendly' | 'outdoor_space')[];
  availability: ('weekends' | 'weekdays' | 'flexible')[];
  priceRange: {
    min: number;  // Door fee range
    max: number;
  };
  hostExperience: ('new' | 'experienced' | 'veteran')[];
  responseTime: ('within_hour' | 'same_day' | 'within_week')[];
}
```

### Confirmed Shows Mode Filters
```typescript
interface ShowFilters extends CoreFilters {
  genres: string[];             // From artist genres
  ticketPrice: {
    min: number;
    max: number;
  };
  showType: ('free' | 'donation' | 'ticketed')[];
  timeOfDay: ('afternoon' | 'evening' | 'late_night')[];
  ageRestriction: ('all_ages' | '18+' | '21+')[];
  rsvpStatus: ('available' | 'waitlist' | 'sold_out')[];
}
```

---

## 🎨 UI/UX Design System

### Color Scheme Integration (TourPad Coastal Theme)
```css
/* Map cluster colors */
--cluster-french-blue: #3b82f6;    /* High density clusters */
--cluster-sage: #9ca3af;           /* Medium density */
--cluster-mist: #f3f4f6;           /* Low density background */

/* Map pins */
--pin-available-host: #064e3b;     /* Evergreen for available hosts */
--pin-confirmed-show: #3b82f6;     /* French Blue for shows */
--pin-selected: #fef3c7;           /* Sand for selected state */
```

### Mobile-First Component Structure
```typescript
interface MapLayoutProps {
  mapMode: 'hosts' | 'shows';
  viewMode: 'map' | 'list' | 'hybrid';
  isMobile: boolean;
}

// Mobile: Bottom sheet overlay
// Desktop: Side panel  
// Tablet: Adaptive based on orientation
```

---

## 🗺️ Map Interaction Flows

### Card Click Behavior - Available Hosts
```typescript
// When host pin/card is clicked:
1. **Immediate**: Highlight pin + show preview card
2. **Navigation**: 
   - Primary CTA: "View Full Profile" → `/hosts/[id]`
   - Secondary CTA: "Quick Request" → Booking modal
3. **Data tracking**: Log interaction for recommendations
4. **Privacy**: Show approximate location, hide exact address
```

### Card Click Behavior - Confirmed Shows
```typescript
// When show pin/card is clicked:
1. **Immediate**: Show event details overlay
2. **Navigation**:
   - Primary CTA: "RSVP" or "Get Tickets" → Booking flow
   - Secondary CTA: "View Artist" → `/artists/[id]`
   - Tertiary CTA: "View Venue" → `/hosts/[id]` (if public)
3. **Social features**: Share event, add to calendar
4. **Location**: Show exact address for confirmed shows
```

---

## 📱 Mobile UX Strategy

### Responsive Breakpoints
```typescript
const breakpoints = {
  mobile: '< 768px',    // Bottom sheet, full-screen map
  tablet: '768-1024px', // Side drawer, split view
  desktop: '> 1024px'   // Fixed sidebar, integrated layout
};
```

### Mobile-Specific Features
- **Bottom Sheet**: Swipe up for filters, swipe down to dismiss
- **Quick Actions**: One-tap RSVP, bookmark, share
- **Location Services**: "Near Me" button with GPS integration
- **Offline Mode**: Cache recent searches and favorites
- **Voice Search**: "Show me folk venues in Austin"

### Gesture Controls
```typescript
// Map gestures
- Pinch: Zoom in/out
- Double tap: Zoom to pin
- Long press: Drop custom location pin
- Swipe up: Open filters (mobile)
- Pull to refresh: Update listings
```

---

## 🔐 Privacy & Security Framework

### Location Obfuscation Algorithm
```typescript
interface LocationPrivacy {
  displayCoordinates: {
    lat: number;  // ±0.008-0.015 degrees (~0.5-1 mile radius)
    lng: number;
  };
  actualCoordinates: {
    lat: number;  // Stored securely, only revealed upon booking confirmation
    lng: number;
  };
  privacyLevel: 'neighborhood' | 'street' | 'exact';
}

// Host settings allow choosing privacy level:
// - Neighborhood: ±1 mile radius
// - Street: ±0.2 mile radius  
// - Exact: Only after booking confirmed
```

### Progressive Disclosure
```typescript
// Information revealed at each stage:
Stage 1: Browse → General area, basic venue info
Stage 2: Request → Street-level location
Stage 3: Confirmed → Exact address + contact info
```

---

## 🚀 Detailed Implementation Steps

### Phase 1: Foundation & Data Integration (Week 1-2)

#### Step 1.1: Create Real Data API Endpoints
```bash
# Create new API endpoints for map data
/src/app/api/map/hosts/route.ts        # Available hosts with location data
/src/app/api/map/shows/route.ts        # Confirmed shows with concert data
/src/app/api/map/search/route.ts       # Location-based search
```

**Implementation Tasks:**
1. **Host Map API** (`/api/map/hosts`)
   - Query hosts with `status: 'APPROVED'`
   - Include location obfuscation logic
   - Add capacity, amenities, availability filters
   - Return format: `{ hosts: Host[], total: number, bounds: LatLngBounds }`

2. **Shows Map API** (`/api/map/shows`)
   - Query bookings with `status: 'CONFIRMED'` + Concert records
   - Include exact coordinates for public shows
   - Add date range, genre, price filters
   - Return format: `{ shows: ConcertWithBooking[], total: number, bounds: LatLngBounds }`

3. **Search API** (`/api/map/search`)
   - Geocoding integration for location search
   - Radius-based queries
   - Autocomplete suggestions

#### Step 1.2: Update Database Schema for Location Data
```prisma
// Add to Host model if missing
model Host {
  // ... existing fields
  latitude    Float?
  longitude   Float?
  privacyLevel LocationPrivacy @default(NEIGHBORHOOD)
  displayLat  Float?  // Obfuscated coordinates for public display
  displayLng  Float?
}

enum LocationPrivacy {
  NEIGHBORHOOD  // ±1 mile radius
  STREET       // ±0.2 mile radius
  EXACT        // Only after booking confirmed
}
```

#### Step 1.3: Replace Mock Data with Real Data
**Files to Update:**
1. `/src/app/map/page.tsx` - Remove mockHosts import, add API calls
2. `/src/components/map/MapFilters.tsx` - Connect to real data
3. `/src/components/map/MapContainer.tsx` - Update for real host data
4. `/src/components/map/HostListCard.tsx` - Update for database host model

### Phase 2: Map Mode Implementation (Week 2-3)

#### Step 2.1: Add Map Mode Toggle
```typescript
// Update /src/app/map/page.tsx
type MapMode = 'hosts' | 'shows';
const [mapMode, setMapMode] = useState<MapMode>('hosts');

// Add toggle UI
<div className="flex rounded-lg border border-[var(--color-sage)] bg-white p-1">
  <Button
    variant={mapMode === 'hosts' ? 'default' : 'ghost'}
    size="sm"
    onClick={() => setMapMode('hosts')}
    className={mapMode === 'hosts' 
      ? 'bg-[var(--color-french-blue)] text-white' 
      : 'text-neutral-600 hover:text-neutral-900'
    }
  >
    Available Hosts
  </Button>
  <Button
    variant={mapMode === 'shows' ? 'default' : 'ghost'}
    size="sm"
    onClick={() => setMapMode('shows')}
    className={mapMode === 'shows' 
      ? 'bg-[var(--color-french-blue)] text-white' 
      : 'text-neutral-600 hover:text-neutral-900'
    }
  >
    Confirmed Shows
  </Button>
</div>
```

#### Step 2.2: Apply TourPad Color Scheme
**Update all map components with coastal colors:**
```typescript
// Replace existing color classes throughout map components
'bg-primary-600' → 'bg-[var(--color-french-blue)]'
'border-neutral-200' → 'border-[var(--color-sage)]'
'bg-neutral-50' → 'bg-[var(--color-mist)]'
'text-primary-600' → 'text-[var(--color-french-blue)]'
'hover:bg-primary-50' → 'hover:bg-[var(--color-mist)]'
```

#### Step 2.3: Enhanced Filter System
```typescript
// Create /src/components/map/EnhancedMapFilters.tsx
interface EnhancedFilterProps {
  mapMode: 'hosts' | 'shows';
  onFiltersChange: (filters: HostFilters | ShowFilters) => void;
}

// Implement mode-specific filter sets
const HostModeFilters = () => (
  <>
    <FilterSection title="Availability">
      <CheckboxGroup options={['weekends', 'weekdays', 'flexible']} />
    </FilterSection>
    <FilterSection title="Experience Level">
      <RadioGroup options={['new', 'experienced', 'veteran']} />
    </FilterSection>
    <FilterSection title="Response Time">
      <SelectBox options={['within_hour', 'same_day', 'within_week']} />
    </FilterSection>
  </>
);

const ShowModeFilters = () => (
  <>
    <FilterSection title="Genres">
      <MultiSelect options={genres} />
    </FilterSection>
    <FilterSection title="Show Type">
      <CheckboxGroup options={['free', 'donation', 'ticketed']} />
    </FilterSection>
    <FilterSection title="Age Restriction">
      <RadioGroup options={['all_ages', '18+', '21+']} />
    </FilterSection>
  </>
);
```

### Phase 3: Mobile-First UX (Week 3-4)

#### Step 3.1: Responsive Layout Implementation
```typescript
// Create /src/components/map/ResponsiveMapLayout.tsx
const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return { isMobile, showBottomSheet, setShowBottomSheet };
};
```

#### Step 3.2: Bottom Sheet Component
```typescript
// Create /src/components/map/BottomSheet.tsx
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet = ({ isOpen, onClose, children }: BottomSheetProps) => (
  <div className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ${
    isOpen ? 'translate-y-0' : 'translate-y-full'
  }`}>
    <div className="bg-white rounded-t-xl shadow-xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-center pt-2 pb-4">
        <div className="w-8 h-1 bg-[var(--color-sage)] rounded-full" />
      </div>
      {children}
    </div>
  </div>
);
```

#### Step 3.3: Mobile Gesture Controls
```typescript
// Add to MapContainer component
const handleMapInteraction = {
  longPress: (coordinates: [number, number]) => {
    // Drop custom location pin
    setCustomPin(coordinates);
  },
  doubleClick: (pin: MapPin) => {
    // Zoom to pin location
    map.flyTo(pin.coordinates, 14);
  },
  swipeUp: () => {
    // Open filters bottom sheet on mobile
    if (isMobile) setShowBottomSheet(true);
  }
};
```

### Phase 4: Advanced Features (Week 4-5)

#### Step 4.1: Location Privacy Implementation
```typescript
// Create /src/lib/locationPrivacy.ts
export const obfuscateCoordinates = (
  lat: number, 
  lng: number, 
  privacyLevel: LocationPrivacy
): [number, number] => {
  const radiusMap = {
    NEIGHBORHOOD: 0.015, // ~1 mile
    STREET: 0.003,       // ~0.2 mile
    EXACT: 0             // No obfuscation
  };
  
  const radius = radiusMap[privacyLevel];
  const randomLat = lat + (Math.random() - 0.5) * radius * 2;
  const randomLng = lng + (Math.random() - 0.5) * radius * 2;
  
  return [randomLat, randomLng];
};
```

#### Step 4.2: Progressive Information Disclosure
```typescript
// Create /src/components/map/ProgressiveHostCard.tsx
interface HostCardProps {
  host: Host;
  interactionLevel: 'browse' | 'interested' | 'booking';
}

const ProgressiveHostCard = ({ host, interactionLevel }: HostCardProps) => {
  const showDetails = {
    browse: { location: 'general', contact: false, exact_address: false },
    interested: { location: 'street', contact: false, exact_address: false },
    booking: { location: 'exact', contact: true, exact_address: true }
  }[interactionLevel];
  
  return (
    <Card>
      <LocationDisplay 
        coordinates={showDetails.location === 'exact' ? host.coordinates : host.displayCoordinates}
        precision={showDetails.location}
      />
      {showDetails.contact && <ContactInfo host={host} />}
      {showDetails.exact_address && <ExactAddress host={host} />}
    </Card>
  );
};
```

#### Step 4.3: Real-time Updates
```typescript
// Create /src/hooks/useMapData.ts
export const useMapData = (mapMode: MapMode, filters: FilterState) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = mapMode === 'hosts' ? '/api/map/hosts' : '/api/map/shows';
      const response = await fetch(`${endpoint}?${new URLSearchParams(filters)}`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);
    }
  }, [mapMode, filters]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, refetch: fetchData };
};
```

### Phase 5: Performance & Polish (Week 5-6)

#### Step 5.1: Map Clustering
```typescript
// Create /src/components/map/ClusterManager.tsx
interface ClusterManagerProps {
  pins: MapPin[];
  zoomLevel: number;
  onClusterClick: (pins: MapPin[]) => void;
}

const ClusterManager = ({ pins, zoomLevel, onClusterClick }: ClusterManagerProps) => {
  const clusters = useMemo(() => {
    return createClusters(pins, zoomLevel);
  }, [pins, zoomLevel]);
  
  return (
    <>
      {clusters.map(cluster => (
        cluster.count > 1 ? (
          <ClusterMarker
            key={cluster.id}
            position={cluster.center}
            count={cluster.count}
            onClick={() => onClusterClick(cluster.pins)}
            color="var(--color-french-blue)"
          />
        ) : (
          <IndividualPin
            key={cluster.pins[0].id}
            pin={cluster.pins[0]}
            color={cluster.pins[0].type === 'host' 
              ? 'var(--color-evergreen)' 
              : 'var(--color-french-blue)'
            }
          />
        )
      ))}
    </>
  );
};
```

#### Step 5.2: Offline Capabilities
```typescript
// Create /src/hooks/useOfflineMap.ts
export const useOfflineMap = () => {
  const [offlineData, setOfflineData] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  
  const cacheMapData = (data: any) => {
    localStorage.setItem('tourpad_map_cache', JSON.stringify(data));
  };
  
  const getCachedData = () => {
    const cached = localStorage.getItem('tourpad_map_cache');
    return cached ? JSON.parse(cached) : null;
  };
  
  return { isOffline, cacheMapData, getCachedData };
};
```

---

## 📊 Success Metrics & Testing

### Key Performance Indicators
- **Discovery Rate**: % of users who find & contact hosts via map
- **Booking Conversion**: Map interaction → confirmed booking rate  
- **Mobile Usage**: % of map interactions on mobile devices
- **Filter Effectiveness**: Most used filters, abandonment rates

### Performance Targets
- **Time to First Interaction**: < 3 seconds to first pin click
- **Search Success Rate**: > 80% of searches yield results
- **Mobile Performance**: < 2 seconds map load time
- **User Retention**: > 60% return usage of map feature

### Testing Strategy
1. **Unit Tests**: Filter logic, location privacy, data transformations
2. **Integration Tests**: API endpoints, database queries
3. **E2E Tests**: Complete user flows from search to booking
4. **Performance Tests**: Map load times, large dataset handling
5. **Mobile Tests**: Cross-device compatibility, gesture recognition

---

## 🚀 Launch Checklist

### Pre-Launch Requirements
- [ ] All mock data replaced with real database integration
- [ ] Location privacy system tested and verified
- [ ] Mobile responsiveness across all major devices
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Analytics tracking implemented

### Launch Day Tasks
- [ ] Feature flag enabled for gradual rollout
- [ ] Monitoring dashboards active
- [ ] User feedback collection ready
- [ ] Documentation updated
- [ ] Team trained on new features

### Post-Launch (Week 1)
- [ ] Monitor performance metrics
- [ ] Collect user feedback
- [ ] Address any critical issues
- [ ] Plan iteration based on usage data

---

This comprehensive plan provides a roadmap for creating a world-class mapping experience that will be central to TourPad's value proposition, focusing on real data integration, mobile-first design, and privacy-conscious implementation.