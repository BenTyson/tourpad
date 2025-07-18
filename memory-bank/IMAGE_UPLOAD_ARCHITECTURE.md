# Image Upload Architecture

## Overview
This document outlines the image upload system for TourPad to prevent future crashes and ensure proper implementation.

## Critical Issue Resolved (January 2025)
**Problem**: Server crashes due to conflicting upload implementations
**Root Cause**: Duplicate upload routes with incompatible dependencies
**Solution**: Standardized on single, working upload system

## Current Implementation

### Working Upload System
- **Route**: `/api/upload/route.ts`
- **Storage**: Local filesystem (`public/uploads/`)
- **Authentication**: NextAuth session validation
- **File Handling**: Direct file system writes
- **Status**: ✅ STABLE AND WORKING

### Upload Process
1. **File Validation**:
   - Allowed types: JPEG, PNG, WebP
   - Max size: 5MB
   - MIME type validation

2. **File Storage**:
   - Local path: `public/uploads/`
   - Naming: `{userId}-{type}-{timestamp}.{ext}`
   - Auto-creates directory if needed

3. **Database Integration**:
   - Updates `UserProfile.profileImageUrl` for profile photos
   - Returns public URL: `/uploads/{filename}`

### Integration Points
- **Profile Edit Page**: `/dashboard/profile/page.tsx` (lines 1125-1174)
- **API Endpoint**: `/api/upload/route.ts`
- **Database**: Updates via Prisma to `userProfile` table

## Architecture Decisions

### Why Local Storage (Current)
- **Pros**: Simple, no external dependencies, works in development
- **Cons**: Not scalable for production, no CDN benefits

### Future: Cloud Storage Migration
- **Target**: AWS S3 + CloudFront
- **Implementation**: Already exists in `/src/lib/storage.ts`
- **Status**: Ready but requires environment variables

## Critical Rules

### DO NOT CREATE DUPLICATE ROUTES
❌ **Never create**: `/api/media/upload/` or similar competing routes
✅ **Always use**: `/api/upload/` as the single upload endpoint

### Environment Dependencies
- **Local Development**: No external dependencies required
- **Production**: Will require AWS credentials for S3 storage

### File Organization
```
src/
├── app/api/upload/route.ts          # ✅ WORKING - Keep this
├── lib/storage.ts                   # ✅ Future S3 implementation
└── lib/validation.ts                # ✅ File validation utilities
```

## Migration Path to Production

### Phase 1: Current (Local Storage)
- Status: ✅ Complete
- Storage: Local filesystem
- Suitable for: Development, small-scale testing

### Phase 2: Cloud Storage (Future)
- Status: 🔄 Ready for implementation
- Storage: AWS S3
- Required: AWS credentials in environment
- CDN: CloudFront for global delivery

## Troubleshooting

### Server Crash on Startup
**Symptoms**: NextAuth "Failed to fetch" errors, server won't start
**Cause**: Duplicate upload routes or missing dependencies
**Solution**: 
1. Remove any `/api/media/upload/` directories
2. Ensure only `/api/upload/route.ts` exists
3. Check for missing AWS SDK dependencies if using S3

### Upload Failures
**Common Issues**:
- File too large (>5MB)
- Invalid file type
- Missing authentication
- Directory permissions

**Debug Steps**:
1. Check browser network tab for error details
2. Verify file size and type
3. Confirm user is authenticated
4. Check server logs for detailed errors

## Code Examples

### Upload Component Usage
```tsx
// In profile edit page
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'profile');
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  if (response.ok) {
    const { url } = await response.json();
    // Update profile with new image URL
  }
};
```

### API Response Format
```json
{
  "success": true,
  "url": "/uploads/user123-profile-1642678901234.jpg",
  "fileName": "user123-profile-1642678901234.jpg"
}
```

## Team Guidelines

1. **Before Adding Upload Features**: Always use existing `/api/upload` endpoint
2. **File Validation**: Use utilities in `/lib/validation.ts`
3. **Storage**: Current local, future S3 via `/lib/storage.ts`
4. **Testing**: Test file uploads in development before deployment
5. **Documentation**: Update this file for any architecture changes

## Last Updated
January 2025 - After resolving server crash issue and documenting stable architecture.