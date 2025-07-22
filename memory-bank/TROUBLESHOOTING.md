# TourPad Troubleshooting Guide

## Localhost Crash Prevention & Resolution

### Known Crash Scenarios & Solutions

#### 1. TypeScript Compilation Errors
**Symptoms**: 
- Server starts but crashes when clicking UI elements
- "Ready" message displays but development server unstable
- Hot reload triggers full page reloads repeatedly

**Root Cause**: Accumulated TypeScript compilation errors destabilize Next.js development server

**Solution Protocol**:
```bash
# 1. Check compilation status
npx tsc --noEmit

# 2. Fix ALL compilation errors before proceeding
# Common errors:
# - Missing 'alt' properties in image components
# - Type mismatches in component props (help prop on Input, variant="outline" on Badge)
# - Missing imports (Input component, getStripe function)  
# - Unsafe array/object access patterns

# 3. Nuclear reset after fixing TypeScript errors
killall node 2>/dev/null
rm -rf .next node_modules
npm install
npx prisma generate
npm run dev
```

#### 4. Large File Uploads Memory Issues (NEW)
**Symptoms**: 
- Server crashes during hot reload after code changes
- Memory spikes when file watcher processes large uploads folder
- Repeated server restarts needed after minor edits

**Root Cause**: Next.js file watcher consuming excessive memory with large uploads folder (57+ images, 42MB+ in /public/uploads/)

**Immediate Solution**:
```bash
# Start with increased memory limit
NODE_OPTIONS='--max-old-space-size=4096' npm run dev
```

**Permanent Solution - Webpack Config**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ignore uploads folder to prevent file watcher memory issues
    config.watchOptions = {
      ignored: /public\/uploads/,
    };
    return config;
  },
};
```

**Alternative Solutions**:
1. **Move uploads outside public folder** (recommended for production)
2. **Use external CDN** for user uploads  
3. **Implement upload cleanup** (delete old files periodically)
4. **Use .gitignore** for uploads folder to reduce file count

**Prevention**:
- Always run `npx tsc --noEmit` before implementing new features
- Fix compilation errors immediately, don't let them accumulate
- Use TypeScript strict mode to catch errors early

#### 2. Unsafe Code Patterns (React Crashes)
**Symptoms**:
- Runtime errors during component rendering
- "Cannot read properties of undefined" errors
- Fast Refresh triggering full reloads

**Root Cause**: Direct access to arrays/objects without null checks

**Common Unsafe Patterns**:
```typescript
// ❌ CRASHES - Direct array access
hostProfile.photos.length
hostProfile.photos.map()
user.profile.name

// ❌ CRASHES - Object property access
lodgingDetails.rooms.map()
user.artist.genres
```

**Safe Pattern Solutions**:
```typescript
// ✅ SAFE - Optional chaining with defaults
hostProfile.photos?.length || 0
hostProfile.photos?.map() || []
user?.profile?.name || ''

// ✅ SAFE - Conditional rendering
{photos?.length > 0 && (
  <div>{photos.map(photo => ...)}</div>
)}

// ✅ SAFE - Defensive object access
if (lodgingDetails?.rooms) {
  return lodgingDetails.rooms.map(room => ...)
}
```

**Nuclear Reset for React Crashes**:
```bash
# Full system reset
killall node 2>/dev/null
rm -rf .next node_modules
npm install
npx prisma generate
npm run dev
```

#### 3. Database Schema Drift
**Symptoms**:
- Server won't start after database migrations
- "Unknown argument" errors in Prisma operations
- Field order mismatches in generated client

**Root Cause**: `prisma db pull` reorders fields differently than application expects

**Solution Protocol**:
```bash
# 1. Kill all processes
pkill -9 -f "next\\|prisma\\|node"

# 2. Check for schema drift
npx prisma db pull

# 3. Verify changes with git
git diff prisma/schema.prisma

# 4. Restore proper field order if changed
# Key fields that must maintain order:
# - Host model: venuePhotoUrl before applicationSubmittedAt
# - Enum order: VenueType (HOME, LOFT, WAREHOUSE, OTHER)

# 5. Full regeneration
rm -rf .next node_modules
npm install
npx prisma generate

# 6. Test database connection
node -e "const { PrismaClient } = require('@prisma/client'); new PrismaClient().user.findFirst().then(() => console.log('✅ DB OK')).catch(e => console.log('❌', e.message))"

# 7. Start server
npm run dev
```

**Prevention**:
- Commit schema before migrations: `git add prisma/schema.prisma && git commit -m "pre-migration schema"`
- Always check `git diff prisma/schema.prisma` after migrations
- Test localhost immediately after schema changes

---

## Crisis Resolution History

### July 19, 2025 - Photo Gallery Implementation Crisis
**Challenge**: Implementing venue photo galleries caused 3 consecutive localhost crashes

**Timeline**:
1. **First Crash**: After implementing photo upload functionality
2. **Light Recovery**: `killall node; rm -rf .next; npm run dev` - temporarily worked
3. **Second Crash**: When user clicked a button, crashed again
4. **Nuclear Reset**: Full node_modules reinstall + Prisma regeneration - still unstable
5. **User Feedback**: "SOMETHING in the photo gallery build caused this"

**Investigation Process**:
1. **Verified Upload Success**: Found 27 venue photos successfully uploaded to public/uploads/
2. **Identified Root Causes**:
   - **105+ TypeScript compilation errors** across codebase
   - **Unsafe array access**: `hostProfile.photos.length` without null checks
   - **React re-render loops** from component crashes
   - **Large file modifications** triggering Next.js hot reload issues

**Solution Implementation**:
1. **Comprehensive TypeScript Fix**: Resolved all 105+ compilation errors systematically
2. **Defensive Programming**: Implemented optional chaining (`?.`) throughout codebase
3. **Photo Gallery**: Successfully completed venue photo gallery system
4. **Database Integration**: HostMedia model working with full CRUD operations
5. **UI Integration**: Gallery tab with photo grid, upload, and delete functionality

**Final Outcome**:
- ✅ Venue photo galleries fully working
- ✅ Server stability restored
- ✅ TypeScript compilation clean (zero errors)
- ✅ Defensive programming patterns established throughout codebase

**Lessons Learned**:
- TypeScript errors accumulate and destabilize development server even when hidden
- React component crashes trigger cascading Next.js hot reload issues
- Defensive programming patterns prevent most runtime crashes
- Nuclear reset pattern essential for development environment recovery

---

## Development Environment Debugging

### Server Won't Start

#### NextAuth "Failed to fetch" Errors
**Symptoms**:
- Authentication redirects fail
- CSS not loading properly
- Database connection errors

**Causes & Solutions**:
```bash
# 1. Check environment variables
echo $NEXTAUTH_SECRET
echo $GOOGLE_CLIENT_ID
echo $DATABASE_URL

# 2. Verify database connection
npx prisma studio  # Should open without errors

# 3. Clear Next.js cache
rm -rf .next

# 4. Restart with clean slate
npm run dev
```

#### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use our standard kill command
killall node 2>/dev/null
```

#### Localhost Binding Issues (macOS)
**Symptoms**:
- Next.js shows "Ready" but localhost:3000 not accessible
- curl fails with "Couldn't connect to server"
- netstat shows no processes listening on ports

**Root Cause**: Next.js binding to limited interfaces instead of all interfaces

**Critical Solution**:
```bash
# ALWAYS start Next.js with explicit host binding
npx next dev -H 0.0.0.0 -p 3000

# Or for different port
npx next dev -H 0.0.0.0 -p 3002
```

**Update package.json to prevent recurrence**:
```json
"scripts": {
  "dev": "next dev -H 0.0.0.0",
  "dev:stable": "next dev -H 0.0.0.0 -p 3002"
}
```

**Verification Commands**:
```bash
# Test connectivity
curl -I http://localhost:3000
# Should return: HTTP/1.1 200 OK

# Check port binding
netstat -an | grep 3000
# Should show: *.3000 (not just 127.0.0.1.3000)
```

#### Database Connection Issues
```bash
# Test Prisma connection
npx prisma db push

# Generate fresh client
npx prisma generate

# Reset database if corrupted
npx prisma migrate reset --force
```

### File Upload Issues

#### Images Upload but Don't Display
**Debug Steps**:
1. **Verify Upload Endpoint**: Check `/api/upload` returns correct URL
2. **Check Database Storage**: Confirm image URL saved to correct field
3. **Verify API Response**: Ensure profile API returns image URLs
4. **Test File Access**: Check file exists in `public/uploads/`

**Common Fix**:
```typescript
// Wrong - was causing display issues
profilePhoto: user.profileImageUrl

// Correct - working pattern
profilePhoto: user.profile?.profileImageUrl || ''
```

#### Upload Endpoint Crashes
**Common Issues**:
- File too large (>5MB limit)
- Invalid file type (only JPEG/PNG/WebP allowed)
- Missing authentication
- Directory permissions

**Debug Commands**:
```bash
# Check upload directory exists and writable
ls -la public/uploads/

# Test file upload with curl
curl -X POST -F "file=@test.jpg" -F "type=profile" http://localhost:3000/api/upload

# Check server logs for detailed errors
tail -f /tmp/nextjs.log
```

### React Component Issues

#### Component Crashes on Render
**Symptoms**:
- White screen with error boundary
- Console errors about undefined properties
- Fast Refresh performs full reload

**Debug Pattern**:
```typescript
// Add defensive logging
console.log('Data check:', { 
  photos: photos?.length || 'undefined',
  user: user?.name || 'undefined',
  profile: user?.profile || 'undefined'
});

// Add error boundaries
try {
  return photos?.map(photo => (
    <div key={photo.id}>{photo.title}</div>
  )) || <div>No photos available</div>;
} catch (error) {
  console.error('Component render error:', error);
  return <div>Error loading photos</div>;
}
```

#### State Update Issues
**Common Pattern**:
```typescript
// ❌ Wrong - can cause crashes
setHostProfile(prev => ({
  ...prev,
  photos: [...prev.photos, newPhoto]  // Crashes if photos undefined
}));

// ✅ Correct - defensive update
setHostProfile(prev => ({
  ...prev,
  photos: [...(prev.photos || []), newPhoto]
}));
```

---

## Database Troubleshooting

### Migration Issues

#### "Unknown argument" Errors
**Cause**: Prisma client out of sync with schema
**Solution**:
```bash
npx prisma generate
npx prisma migrate reset --force
npm run dev
```

#### Schema Field Order Issues
**Symptoms**: Generated types don't match expected structure
**Solution**: Manually restore field order in schema.prisma:
```prisma
model Host {
  # ... other fields ...
  offersLodging          Boolean     @default(false)
  lodgingDetails         Json?
  venuePhotoUrl          String?      # Keep before applicationSubmittedAt
  applicationSubmittedAt DateTime?    # This order matters
  # ... rest of fields ...
}
```

#### Enum Order Problems
```prisma
enum VenueType {
  HOME        # Maintain this exact order
  LOFT
  WAREHOUSE
  OTHER
}
```

### Data Consistency Issues

#### Profile Data Not Saving
**Debug Steps**:
1. Check API endpoint logs
2. Verify Prisma operations
3. Test database directly

**Common Fix**:
```typescript
// Ensure proper upsert pattern
await prisma.userProfile.upsert({
  where: { userId },
  create: { userId, ...profileData },
  update: profileData
});
```

#### Image URLs Not Persisting
**Check Data Flow**:
1. Upload API saves file ✅
2. Database stores URL ✅
3. Profile API returns URL ✅
4. Component displays image ✅

---

## Performance Troubleshooting

### Slow Page Loads
**Common Causes**:
- Missing database indexes
- N+1 query problems
- Large image files
- Unoptimized API calls

**Solutions**:
```typescript
// Use Prisma includes for eager loading
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    profile: true,
    artist: true,
    host: {
      include: {
        media: true  // Load related data in single query
      }
    }
  }
});
```

### Memory Issues
**Symptoms**:
- Server crashes with heap errors
- Slow response times
- Process killed by system

**Solutions**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Monitor memory usage
node --inspect npm run dev
```

---

## Emergency Procedures

### Nuclear Reset Pattern
**When to Use**: 
- Multiple crashes after changes
- Server won't start properly
- Unexplained instability

**Full Reset Command**:
```bash
# Kill all processes
killall node 2>/dev/null

# Remove all generated files
rm -rf .next node_modules

# Clean install
npm install

# Regenerate Prisma client
npx prisma generate

# Start fresh
npm run dev
```

### Database Reset (Data Loss)
```bash
# Reset database completely (DANGER: Loses all data)
npx prisma migrate reset --force

# Or reset with seed data
npx prisma migrate reset --force && npx prisma db seed
```

### Emergency Recovery Checklist
1. ✅ Kill all Node processes
2. ✅ Check TypeScript compilation (`npx tsc --noEmit`)
3. ✅ Fix any compilation errors
4. ✅ Clear .next cache
5. ✅ Reinstall dependencies if needed
6. ✅ Regenerate Prisma client
7. ✅ Test database connection
8. ✅ Start development server
9. ✅ Verify critical features work

---

## Success Indicators

### Healthy Development Environment
- ✅ `curl -I http://localhost:3000` returns `HTTP/1.1 200 OK`
- ✅ Homepage loads without connection refused
- ✅ API endpoints respond correctly
- ✅ No process crashes after "Ready" message
- ✅ TypeScript compilation shows zero errors (ACHIEVED July 2025!)
- ✅ Hot reload works without full page refreshes

### July 2025 Status Update
✅ **ALL 54 TypeScript errors eliminated** - server compilation now clean
✅ **Package.json updated** with `"dev": "next dev -H 0.0.0.0"` for macOS localhost binding  
📋 **After restart**: Run `npm run dev` and test booking dashboard at `/dashboard/bookings`

### Stable Feature Implementation
- ✅ New features don't break existing functionality
- ✅ Error handling provides user-friendly feedback
- ✅ Database operations complete successfully
- ✅ File uploads work end-to-end
- ✅ Authentication flows function properly

---

## Code Quality Maintenance

### Required Patterns for All New Code
```typescript
// ✅ ALWAYS use optional chaining
const count = items?.length || 0;
const name = user?.profile?.name || '';

// ✅ ALWAYS provide defaults for arrays
{photos?.map((photo) => (
  <div key={photo.id}>{photo.title}</div>
)) || <div>No photos</div>}

// ✅ ALWAYS validate objects before access
if (lodgingDetails?.rooms) {
  return lodgingDetails.rooms.map(room => ...)
}

// ✅ ALWAYS handle async operations properly
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  // Handle error
}
```

### Pre-Implementation Checklist
- [ ] Run `npx tsc --noEmit` and fix all errors
- [ ] Use defensive programming patterns
- [ ] Add proper error handling
- [ ] Test frequently during development
- [ ] Commit working state before major changes

---

*This troubleshooting guide contains battle-tested solutions for all known TourPad development issues. Follow these patterns to maintain system stability.*