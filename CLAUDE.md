# CLAUDE.md - Core Development Rules

## Methodology
- Development must follow the TDD (Test-Driven Development) methodology.
- All implementation must strictly follow the steps outlined in PLAN.md.

## Tech Stack Constraints
Our primary tech stack is:
- **Next.js 15.3.5** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **React Hook Form + Zod**
- **NextAuth.js**
- **Stripe**

Do not introduce other libraries unless specified in the plan or approved by user.

## Git Workflow
- Remind user to git push after each major conclusion
- Always commit with descriptive messages before switching contexts
- Check git status before making significant changes

## Development Standards
- **NEVER** create files unless explicitly required for the task
- **ALWAYS** prefer editing existing files over creating new ones
- **NEVER** proactively create documentation files (*.md) unless requested
- Use TypeScript for all new code
- Follow existing component patterns and naming conventions
- Maintain mobile-first responsive design

## Critical Patterns
- Check `/memory-bank/` folder for project context and patterns
- Read `DEVELOPMENT_ROADMAP.md` for current priorities
- **Data Sources** (see Data Architecture section below)
- All forms must have Zod validation schemas
- Use the established color system (Rose, Sage, Neutral tones)

## Data Architecture - CRITICAL
We maintain TWO data files with specific purposes:

### `/src/data/mockData.ts` - Use for:
- **Basic UI display data** (artist profiles, host profiles)
- **Artist/host listings and cards**
- **Simple data structures**
- **Core features** (bookings, messages, notifications)
- **IDs**: Simple numeric strings ('1', '2', '3')

### `/src/data/realTestData.ts` - Use for:
- **Authentication system** (`getCurrentUser` function)
- **Advanced features** (lodging system, concerts, detailed capabilities)
- **Complex data structures** with extended properties
- **IDs**: Prefixed strings ('artist1', 'host1', 'fan1')

### ID Mapping Pattern:
- Session uses realTestData IDs ('artist1')
- UI components use mockData IDs ('1') 
- Dashboard maps between them: `mockArtists.find(a => a.userId === 'artist1')`
- **NEVER** change this mapping without updating both files consistently

### When in doubt:
- **Profile pages** → mockData (richer display data)
- **Authentication** → realTestData (getCurrentUser)
- **Lodging features** → realTestData (detailed host capabilities)
- **Basic listings** → mockData (simpler structures)

## Server & Testing
- Run `npm run dev` to start development server (localhost:3000)
- Test all UI changes in the browser before marking complete
- Add TODO comments for future backend integration points

## Security & Privacy
- Never expose real user data in public views
- Implement proper input validation on all forms
- Follow the gated access model (apply → approve → pay → access)

---
*This file contains core rules that must be followed in every Claude Code session*