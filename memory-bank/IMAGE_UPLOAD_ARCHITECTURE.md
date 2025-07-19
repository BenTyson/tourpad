# Image Upload Architecture

## Overview
This document outlines the comprehensive image upload system for TourPad, documenting the stable architecture achieved after resolving server crashes and implementing full profile image integration.

## Critical Issues Resolved (July 2025)
**Problem 1**: Server crashes due to conflicting upload implementations
**Root Cause**: Duplicate upload routes with incompatible dependencies
**Solution**: Standardized on single, working upload system

**Problem 2**: Images uploading but not displaying in profiles
**Root Cause**: API endpoints reading from wrong database fields
**Solution**: Fixed data flow from upload → database → display

## Current Implementation

### Working Upload System
- **Route**: `/api/upload/route.ts` (SINGLE SOURCE OF TRUTH)
- **Storage**: Local filesystem (`public/uploads/`)
- **Authentication**: NextAuth session validation
- **File Handling**: Direct file system writes with atomic operations
- **Database Integration**: Updates UserProfile.profileImageUrl and Host.venuePhotoUrl
- **Status**: ✅ STABLE AND WORKING WITH FULL PROFILE INTEGRATION

### Upload Process
1. **File Validation**:
   - Allowed types: JPEG, PNG, WebP
   - Max size: 5MB
   - MIME type validation
   - Authentication check (session required)

2. **File Storage**:
   - Local path: `public/uploads/`
   - Naming: `{userId}-{type}-{timestamp}.{ext}`
   - Auto-creates directory if needed
   - Atomic file operations prevent corruption

3. **Database Integration**:
   - Profile photos: Updates `UserProfile.profileImageUrl`
   - Venue photos: Updates `Host.venuePhotoUrl`
   - Artist media: Ready for `ArtistMedia` table
   - Host media: Ready for `HostMedia` table
   - Returns public URL: `/uploads/{filename}`

4. **Profile Integration**:
   - Upload triggers immediate profile update via `/api/profile`
   - Images display instantly after successful upload
   - Error handling with user feedback

### Integration Points
- **Profile Edit Page**: `/dashboard/profile/page.tsx`
  - Host Profile Photo: Lines ~882-920 (working)
  - Venue Profile Photo: Lines ~990-1028 (working)
  - Hidden file inputs with label click handlers
  - Real-time preview after upload
- **API Endpoints**: 
  - `/api/upload/route.ts` - File upload handler
  - `/api/profile/route.ts` - Profile data with image URLs
  - `/api/hosts/[id]/route.ts` - Public host profile with images
- **Database**: 
  - `UserProfile.profileImageUrl` for profile photos
  - `Host.venuePhotoUrl` for venue photos
  - Future: `ArtistMedia` and `HostMedia` tables for galleries

## Architecture Decisions

### Why Local Storage (Current)
- **Pros**: Simple, no external dependencies, works in development, immediate testing
- **Cons**: Not scalable for production, no CDN benefits, limited by server storage
- **Perfect for**: Development, prototyping, small-scale testing

### Future: Cloud Storage Migration
- **Target**: AWS S3 + CloudFront
- **Implementation**: Already exists in `/src/lib/storage.ts`
- **Status**: Ready but requires environment variables
- **Benefits**: Scalable, global CDN, automatic backups, image optimization
- **Migration**: Can be implemented without changing upload API contracts

## Critical Rules

### DO NOT CREATE DUPLICATE ROUTES
❌ **Never create**: `/api/media/upload/` or similar competing routes
✅ **Always use**: `/api/upload/` as the single upload endpoint
❌ **Never create**: Multiple upload handlers in different directories
✅ **Always verify**: Only one upload route exists before adding features

### Database Field Consistency
❌ **Wrong**: Reading from `user.profileImageUrl` when data is in `user.profile.profileImageUrl`
✅ **Correct**: Always verify which table stores the image URL
❌ **Wrong**: Hardcoded database IDs in API responses
✅ **Correct**: Dynamic profile ID mapping via `/api/user/profile-id`

### Environment Dependencies
- **Local Development**: No external dependencies required
- **Production**: Will require AWS credentials for S3 storage
- **Nuclear Reset**: When localhost breaks, full reset usually resolves issues

### File Organization
```
src/
├── app/api/upload/route.ts          # ✅ WORKING - Single upload endpoint
├── app/api/profile/route.ts         # ✅ Profile data with image URLs
├── app/api/hosts/[id]/route.ts      # ✅ Public host profiles with images
├── app/api/user/profile-id/route.ts # ✅ Dynamic profile ID mapping
├── app/dashboard/profile/page.tsx   # ✅ Upload UI components
├── lib/storage.ts                   # ✅ Future S3 implementation
├── lib/validation.ts                # ✅ File validation utilities
└── prisma/schema.prisma             # ✅ Database schema with image fields

public/
└── uploads/                         # ✅ Local image storage
    ├── {userId}-profile-{timestamp}.jpg
    ├── {userId}-venue-{timestamp}.jpg
    └── ... (auto-generated filenames)
```

## Migration Path to Production

### Phase 1: Local Storage (COMPLETE)
- Status: ✅ Complete with full profile integration
- Storage: Local filesystem (`public/uploads/`)
- Features: Profile photos, venue photos, real-time preview
- Database: UserProfile.profileImageUrl, Host.venuePhotoUrl
- Suitable for: Development, prototyping, small-scale deployment

### Phase 2: Media Galleries (READY)
- Status: 🔄 Database models ready
- Features: Artist performance photos, host venue galleries
- Models: ArtistMedia, HostMedia with categories and metadata
- Implementation: Extend `/api/upload` with media type routing

### Phase 3: Cloud Storage (FUTURE)
- Status: 🔄 Infrastructure ready
- Storage: AWS S3 + CloudFront
- Required: AWS credentials in environment
- Benefits: Scalable, global CDN, automatic backups
- Migration: Update `/lib/storage.ts` without changing API contracts

### Phase 4: Advanced Features (FUTURE)
- Image optimization and resizing
- Multiple format support (WebP conversion)
- Progressive image loading
- Advanced media management UI

### Current Architecture Status
- **Upload System**: ✅ Stable and battle-tested
- **Profile Photos**: ✅ Working end-to-end
- **Venue Photos**: ✅ Working end-to-end
- **Database Integration**: ✅ Full CRUD operations
- **Error Handling**: ✅ User-friendly feedback
- **Nuclear Reset Pattern**: ✅ Documented for stability
- **Future Media Galleries**: 🔄 Database ready, UI pending
- **Cloud Storage Migration**: 🔄 Infrastructure ready, config pending

## Troubleshooting

### Server Crash on Startup
**Symptoms**: NextAuth "Failed to fetch" errors, server won't start, CSS not loading
**Cause**: Duplicate upload routes, database migration errors, or missing dependencies
**Solution**: 
1. Remove any `/api/media/upload/` directories
2. Ensure only `/api/upload/route.ts` exists
3. Check for missing AWS SDK dependencies if using S3
4. **Nuclear Reset Pattern**:
   - `rm -rf .next node_modules`
   - `npm install`
   - `npx prisma migrate reset --force`
   - `npm run dev`

### Images Upload but Don't Display
**Symptoms**: Upload succeeds, but profile shows default avatar
**Cause**: API endpoints reading from wrong database fields
**Debug Steps**:
1. Verify upload endpoint updates correct database field
2. Check profile API reads from same field
3. Test data flow: upload → database → API → display
4. Use curl to test API responses directly

**Example Fix**:
```typescript
// Wrong (was causing issues)
profilePhoto: user.profileImageUrl

// Correct (working)
profilePhoto: user.profile?.profileImageUrl
```

### Upload Failures
**Common Issues**:
- File too large (>5MB)
- Invalid file type
- Missing authentication
- Directory permissions
- Button component interference with file input labels

**Debug Steps**:
1. Check browser network tab for error details
2. Verify file size and type
3. Confirm user is authenticated
4. Check server logs for detailed errors
5. Ensure file input is triggered correctly (div inside label, not Button component)

### Database Migration Issues
**Symptoms**: "Unknown argument" errors after adding image fields
**Cause**: Prisma schema changes not reflected in generated client
**Solution**:
1. Run migration: `npx prisma migrate dev --name add_image_field`
2. Generate client: `npx prisma generate`
3. If localhost crashes, use nuclear reset pattern
4. Always test migrations in development first

## Code Examples

### Upload Component Usage (Working Pattern)
```tsx
// In profile edit page - CORRECT implementation
const handleFileUpload = async (file: File, type: 'profile' | 'venue') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const { url } = await response.json();
      
      // Update profile with new image URL
      const profileUpdate = type === 'profile' 
        ? { profilePhoto: url }
        : { venuePhoto: url };
        
      await updateProfile(profileUpdate);
      
      // Update local state for immediate UI feedback
      setCurrentData(prev => ({ ...prev, ...profileUpdate }));
    }
  } catch (error) {
    console.error('Upload failed:', error);
    // Show user-friendly error message
  }
};

// File input trigger - CORRECT pattern
<label htmlFor="profilePhotoInput" className="cursor-pointer">
  <div className="inline-flex items-center px-3 py-1.5 text-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-md mb-2">
    <Camera className="w-4 h-4 mr-2" />
    {hasPhoto ? 'Change Photo' : 'Upload Photo'}
  </div>
</label>
<input
  id="profilePhotoInput"
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file, 'profile');
  }}
  className="hidden"
/>
```

### API Response Format
```json
{
  "success": true,
  "url": "/uploads/user123-profile-1642678901234.jpg",
  "fileName": "user123-profile-1642678901234.jpg"
}
```

### Database Update Pattern
```typescript
// In /api/upload/route.ts - Update correct database fields
if (type === 'profile') {
  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      profileImageUrl: `/uploads/${fileName}`
    },
    update: {
      profileImageUrl: `/uploads/${fileName}`
    }
  });
} else if (type === 'venue') {
  await prisma.host.update({
    where: { userId: session.user.id },
    data: {
      venuePhotoUrl: `/uploads/${fileName}`
    }
  });
}
```

### Profile API Integration
```typescript
// In /api/profile/route.ts - Return image URLs
const profileData = {
  // ... other fields
  profilePhoto: user.profile?.profileImageUrl || '',
  venuePhoto: user.host?.venuePhotoUrl || '',
};

// In /api/hosts/[id]/route.ts - Public profile display
const hostData = {
  // ... other fields
  profileImageUrl: user.profile?.profileImageUrl || null,
  venuePhotoUrl: user.host?.venuePhotoUrl || null,
};
```

## Team Guidelines

1. **Before Adding Upload Features**: Always use existing `/api/upload` endpoint
2. **File Validation**: Use utilities in `/lib/validation.ts`
3. **Storage**: Current local, future S3 via `/lib/storage.ts`
4. **Testing**: Test file uploads in development before deployment
5. **Database Fields**: Always verify which table stores image URLs
6. **UI Components**: Use div inside label, never Button components for file inputs
7. **Data Flow Testing**: Verify upload → database → API → display pipeline
8. **Migration Safety**: Test database changes before implementing
9. **Nuclear Reset**: Use when localhost becomes unstable after changes
10. **Documentation**: Update this file for any architecture changes

## Implementation Checklist

When adding new image upload features:
- [ ] Use `/api/upload` endpoint (never create new upload routes)
- [ ] Define database field for image URL storage
- [ ] Update upload endpoint to save to correct database field
- [ ] Update profile/display APIs to read from correct field
- [ ] Test complete data flow: upload → storage → database → API → display
- [ ] Implement error handling and user feedback
- [ ] Use label + hidden input pattern for file selection
- [ ] Add image preview after successful upload
- [ ] Document any new database fields or API changes

## Last Updated
July 2025 - After implementing complete profile image system with host and venue photos working end-to-end.