# Public Profile Components

This directory contains modular components for the public-facing host and artist profile pages.

## Directory Structure

```
public-profile/
├── types.ts              # Shared TypeScript interfaces
├── shared/              # Components used by both host and artist profiles
│   ├── ProfileHero.tsx  # Header section with different layouts
│   ├── ShareModal.tsx   # Social sharing modal
│   ├── StatsSection.tsx # Rating and statistics display
│   └── SocialLinks.tsx  # Social media links section
├── host/                # Host-specific components
│   ├── VenueDetails.tsx     # Venue specs and amenities
│   ├── MusicalPreferences.tsx # Genre and act preferences
│   ├── SoundSystem.tsx      # Audio equipment details (TODO)
│   ├── LodgingInfo.tsx      # Accommodation details (TODO)
│   └── HostProfile.tsx      # Host member profiles (TODO)
└── artist/              # Artist-specific components
    ├── BandMembers.tsx      # Band member profiles
    ├── TourLogistics.tsx    # Tour requirements and details
    ├── UpcomingTours.tsx    # Tour dates and locations (TODO)
    └── RelatedArtists.tsx   # Similar artists section (TODO)
```

## Usage Example

```tsx
// In host profile page
import ProfileHero from '@/components/public-profile/shared/ProfileHero';
import VenueDetails from '@/components/public-profile/host/VenueDetails';
import MusicalPreferences from '@/components/public-profile/host/MusicalPreferences';

// In artist profile page
import ProfileHero from '@/components/public-profile/shared/ProfileHero';
import BandMembers from '@/components/public-profile/artist/BandMembers';
import TourLogistics from '@/components/public-profile/artist/TourLogistics';
```

## Component Breakdown

### Shared Components
- **ProfileHero**: Adaptive header that shows different layouts for hosts vs artists
- **ShareModal**: Modal for sharing profiles via social media/email
- **StatsSection**: Displays ratings, reviews, and custom statistics
- **SocialLinks**: Renders social media and website links

### Host Components
- **VenueDetails**: Shows venue type, capacity, amenities
- **MusicalPreferences**: Displays preferred genres, act sizes, content ratings

### Artist Components  
- **BandMembers**: Grid display of band member profiles
- **TourLogistics**: Tour schedule, travel requirements, equipment needs

## Key Features
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Icon support via Lucide React
- Consistent styling with UI components
- Modular architecture for easy maintenance