# CLAUDE.md - Core Development Rules

## Modular Framework Integration
This project uses the Claude Code modular framework for optimized development workflows:
- Commands are organized in `.claude/commands/` by category
- Use `/[category]:[command]` syntax for execution (e.g., `/project:setup-environment`)
- Framework provides 50-80% token savings through progressive disclosure
- Commands are environment-aware and security-focused

## Available Commands

### Project Management
- `/project:setup-environment` - Initialize development environment
- `/project:create-feature` - Create new feature with scaffolding

### Development Workflow  
- `/dev:code-review` - Comprehensive code review with TourPad standards
- `/dev:debug-session` - Systematic debugging and problem solving

### Testing
- `/test:generate-tests` - Generate comprehensive test suites
- `/test:coverage-analysis` - Test coverage assessment and improvement

## Methodology
- Development must follow the TDD (Test-Driven Development) methodology.
- All implementation must strictly follow the steps outlined in PROJECT_STATUS.md.
- Use modular commands for consistent workflows and token optimization.

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
- **NEVER** create new .md files without explicit user approval - use existing optimized structure
- Use TypeScript for all new code
- Follow existing component patterns and naming conventions
- Maintain mobile-first responsive design

## Critical Patterns
- Check `/memory-bank/` folder for project context and patterns
- Read `PROJECT_STATUS.md` for current priorities and state
- **Data Sources** (see Data Architecture section below)
- All forms must have Zod validation schemas
- Use the established coastal color system (French Blue, Sage, Mist, Sand, Evergreen)

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

## Documentation Architecture
- **Optimized Structure**: Only 4 .md files in `/memory-bank/`
- **PROJECT_STATUS.md**: Current state, priorities, what's working
- **ARCHITECTURE.md**: Complete technical reference (database, APIs, file storage)
- **TROUBLESHOOTING.md**: Crisis prevention and debugging
- **DEVELOPMENT_PATTERNS.md**: Code standards and required patterns
- **NEVER** create additional .md files - update existing ones

## Image Upload Architecture
- **CRITICAL**: Only use `/api/upload/route.ts` for file uploads
- **NEVER** create `/api/media/upload/` or similar competing routes
- Local storage: `public/uploads/` directory (dev), S3 ready (prod)
- File validation: JPEG/PNG/WebP, 5MB limit, authentication required
- See `/memory-bank/ARCHITECTURE.md` for full details

## Security & Privacy
- Never expose real user data in public views
- Implement proper input validation on all forms
- Follow the gated access model (apply → approve → pay → access)

---
*This file contains core rules that must be followed in every Claude Code session*