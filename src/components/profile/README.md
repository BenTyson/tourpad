# Profile Components Architecture

## Overview
The profile page has been refactored from a single 3000+ line file into a modular component architecture.

## Component Structure

### Main Components
- **ProfileHeader** - User info, save button, and profile status
- **TabNavigation** - Tab switching between different sections
- **InfoTab** - Profile information tab containing multiple sub-components
- **PhotosTab** - Photo management (Gallery for hosts, Performance photos for artists)
- **MediaTab** - Videos and music samples (Artists only)

### InfoTab Sub-components
Located in `/src/components/profile/info/`:

#### Shared Components
- **BasicInformationCard** - Name, bio, location, contact info
- **SocialLinksCard** - Social media links

#### Artist-Only Components
- **FormationYearField** - Band formation year dropdown
- **ArtistMusicalDetailsCard** - Genres, instruments, equipment
- **ThumbnailPhotoCard** - Square profile photo
- **HeroPhotoCard** - Wide banner photo
- **BandMembersCard** - Band member management
- **TourLogisticsCard** - Tour months, travel, lodging needs

#### Host-Only Components
- **HostVenueDetailsCard** - Venue type, capacity, amenities
- **HostPersonalInfoCard** - Host member profiles
- **HostMusicalPreferencesCard** - Preferred genres, act sizes

## Tab Structure

### Artist Tabs
1. **Profile Information** - All profile details
2. **Photos** - Performance photo gallery
3. **Music & Media** - Videos and music samples

### Host Tabs
1. **Profile Information** - All profile details
2. **Gallery** - Venue photos
3. **Sound System & Equipment** - Audio equipment details
4. **Lodging** - Accommodation options

## Key Improvements
- **Reduced Complexity**: Main file reduced from 3000+ to ~800 lines
- **Better Organization**: 15+ focused components instead of one monolithic file
- **Reusability**: Shared components between artist/host profiles
- **Maintainability**: Each component has a single responsibility
- **Type Safety**: Shared TypeScript interfaces in `types.ts`

## Future Enhancements
- Sound System tab component extraction
- Lodging tab component extraction
- Drag-and-drop photo reordering
- Media player integration
- Real-time validation feedback