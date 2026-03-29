# TourPad Documentation

## Active Docs

| File | Purpose |
|------|---------|
| [STATUS.md](./STATUS.md) | Current project state, priorities, what's working |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Database schema, APIs, file storage, tech decisions |
| [CONVENTIONS.md](./CONVENTIONS.md) | Code standards, required patterns, component guidelines |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Known issues, debugging guides, crisis prevention |
| [SITEMAP.md](./SITEMAP.md) | All 54 routes mapped by category and access level |
| [API_ENDPOINTS.md](./API_ENDPOINTS.md) | Complete API reference (65+ endpoints) |
| [USER_JOURNEYS.md](./USER_JOURNEYS.md) | Step-by-step user flows for all roles |
| [VISUAL_FLOWS.md](./VISUAL_FLOWS.md) | ASCII flow diagrams for key journeys |
| [DATABASE_BACKUP.md](./DATABASE_BACKUP.md) | Backup/restore procedures |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Local dev setup, environment config |
| [cleanup.md](./cleanup.md) | Multi-phase cleanup and launch roadmap |

## Archive

Completed feature docs and historical plans in [`archive/`](./archive/).

## Quick Reference

```
ARTISTS:  Register → Admin Approval → Payment ($400/yr) → Active
HOSTS:    Register → Admin Approval → Active (no payment)
FANS:     Register → Payment ($10/mo) → Active (no approval)
```

Stack: Next.js 15 (App Router) + React 19 + TypeScript + Prisma + PostgreSQL + Stripe + NextAuth.js
