# SOLVED: Localhost Crash After Database Migrations

## Root Cause Identified ✅

**The Issue**: Schema drift caused by `prisma db pull` reordering fields and enums differently than our application expects.

**What Happens**:
1. We add a field to schema (e.g., `soundSystem Json?`)
2. Run `npx prisma migrate dev`
3. Migration succeeds, but Prisma client gets out of sync
4. Next.js starts but crashes on first request due to schema mismatch

## The REAL Solution 🔧

After each database migration, **ALWAYS** run this sequence:

```bash
# 1. Kill processes
pkill -9 -f "next\|prisma\|node"

# 2. Check for schema drift (this often reorders fields!)
npx prisma db pull

# 3. If schema changed, manually restore field order to match our expectations
# Check git diff to see what prisma db pull changed
git diff prisma/schema.prisma

# 4. Restore proper field order (example for Host model):
# - venuePhotoUrl should come before applicationSubmittedAt  
# - amenities should come before applicationSubmittedAt
# - soundSystem should come before applicationSubmittedAt
# - venueDescription should come AFTER updatedAt

# 5. Restore enum order (VenueType should be HOME, STUDIO, BACKYARD, LOFT, WAREHOUSE, OTHER)

# 6. Full regeneration
rm -rf .next node_modules
npm install
npx prisma generate

# 7. Test database connection
node -e "const { PrismaClient } = require('@prisma/client'); new PrismaClient().user.findFirst().then(() => console.log('✅ DB OK')).catch(e => console.log('❌', e.message))"

# 8. Start server
npm run dev
```

## Prevention Protocol 🛡️

**Before EVERY migration**:
1. Commit current schema: `git add prisma/schema.prisma && git commit -m "pre-migration schema"`
2. Run migration
3. Check for drift: `git diff prisma/schema.prisma`
4. If changes detected, restore field order manually
5. Test localhost immediately

## Field Order Template for Host Model

```prisma
model Host {
  # ... other fields ...
  offersLodging          Boolean     @default(false)
  lodgingDetails         Json?
  venuePhotoUrl          String?      # Keep this order!
  amenities              String[]     # Keep this order!
  soundSystem            Json?        # Keep this order!
  applicationSubmittedAt DateTime?    # Keep this order!
  approvedAt             DateTime?
  approvedByUserId       String?
  createdAt              DateTime    @default(now())
  updatedAt              DateTime    @updatedAt
  venueDescription       String?      # This comes AFTER updatedAt
  # ... rest of fields ...
}
```

## Enum Order Template

```prisma
enum VenueType {
  HOME        # Keep this order!
  STUDIO
  BACKYARD
  LOFT
  WAREHOUSE
  OTHER
}
```

## Why This Happens

1. **Prisma's `db pull`** introspects the actual database and rewrites the schema
2. **Database column order** doesn't match our schema file order  
3. **Generated Prisma client** expects specific field arrangements
4. **TypeScript compilation** fails or creates runtime mismatches
5. **Next.js crashes** when trying to use the mismatched client

## Success Indicators ✅

- `curl -I http://localhost:3000` returns `HTTP/1.1 200 OK`
- Homepage loads without connection refused
- API endpoints respond correctly
- No process crashes after "Ready" message

## Emergency Commands

If all else fails:
```bash
# Nuclear option (preserves database data)
pkill -9 -f "next\|prisma\|node" && rm -rf .next node_modules && git checkout prisma/schema.prisma && npm install && npx prisma db push && npx prisma generate && npm run dev
```

---
**Status**: SOLVED - July 19, 2025
**Tested**: ✅ Sound system migration successfully resolved using this method