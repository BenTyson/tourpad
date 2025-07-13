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
- Mock data lives in `/src/data/mockData.ts` and `/src/data/realTestData.ts`
- All forms must have Zod validation schemas
- Use the established color system (Rose, Sage, Neutral tones)

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