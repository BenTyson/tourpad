# Localhost Recovery Commands

## Quick Recovery (When localhost crashes after database changes)

Run these **3 commands in exact order**:

```bash
# 1. Kill everything
pkill -9 -f "next\|prisma\|node"

# 2. Nuclear reset (safe - keeps database data)
rm -rf .next node_modules && npm install && npx prisma generate

# 3. Start server
npm run dev
```

## When to Use This

- Localhost won't start after database schema changes
- Server says "Ready" but browser shows nothing
- After adding new fields to Prisma models
- After running database migrations
- CSS not loading or build errors

## What This Does (Safe Operations)

✅ **Kills processes** - Stops any hung Next.js/Node processes
✅ **Clears build cache** - Removes `.next` folder (build artifacts only)
✅ **Reinstalls packages** - Fresh `node_modules` to fix dependency issues
✅ **Regenerates Prisma** - Updates Prisma client to match schema
✅ **Starts clean server** - Fresh development server

## What This Does NOT Do

❌ **Does NOT wipe database** - Your data stays intact
❌ **Does NOT affect source code** - No code changes
❌ **Does NOT remove uploads** - `public/uploads/` preserved

## Command Reference for Claude

When user says "localhost down" or similar issues, run:

```bash
pkill -9 -f "next\|prisma\|node" && rm -rf .next node_modules && npm install && npx prisma generate && npm run dev
```

## Alternative: Individual Steps (if batch fails)

```bash
# Step 1: Kill processes
pkill -9 -f "next"
pkill -9 -f "prisma" 
pkill -9 -f "node"

# Step 2: Clean slate
rm -rf .next
rm -rf node_modules

# Step 3: Reinstall
npm install

# Step 4: Regenerate Prisma
npx prisma generate

# Step 5: Start server
npm run dev
```

## Prevention Tips

1. **After schema changes**: Always run the 3-command recovery
2. **Before starting work**: If localhost was down last session, run recovery
3. **Never run**: `npx prisma migrate reset --force` (this DOES wipe data)
4. **Keep this file handy**: Reference for quick recovery

## Last Resort (Nuclear Option with Data Loss)

**⚠️ ONLY if recovery fails and you need to reset everything:**

```bash
# WARNING: This WILL delete all database data
pkill -9 -f "next\|prisma\|node"
rm -rf .next node_modules
npm install
npx prisma migrate reset --force
npm run dev
```

---

**Created**: July 2025 - After repeated localhost crashes during database development
**Usage**: Reference this file whenever localhost becomes unresponsive