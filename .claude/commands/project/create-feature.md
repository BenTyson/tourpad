# Project: Create Feature

<instructions>
  <context>
    Create a new feature for TourPad following established patterns and conventions. This command scaffolds the necessary files, components, and tests while maintaining consistency with the existing codebase.
  </context>
  
  <requirements>
    - Feature name specified
    - Understanding of TourPad architecture
    - Existing codebase structure (src/app, src/components, src/data)
    - User type context (artist, host, fan, admin)
  </requirements>
  
  <execution>
    1. Analyze feature requirements and user stories
    2. Review existing similar features for patterns
    3. Create page component in src/app/[feature-name]/
    4. Create supporting components in src/components/[feature-name]/
    5. Update data models in src/data/ if needed
    6. Add navigation links to appropriate layout components
    7. Create basic tests for new components
    8. Update DEVELOPMENT_ROADMAP.md with feature status
    9. Test feature integration with existing system
  </execution>
  
  <validation>
    - Feature follows TourPad design patterns
    - Responsive design (mobile-first)
    - Proper TypeScript typing
    - Follows existing component structure
    - Integrates with authentication system
    - Maintains coastal color scheme (sage, french blue, sand, evergreen)
    - No broken links or navigation issues
  </validation>
  
  <examples>
    Create artist booking feature:
    ```bash
    /project:create-feature artist-booking --type=page
    ```
    
    Create component with tests:
    ```bash
    /project:create-feature notification-system --type=component --with-tests
    ```
    
    Create admin feature:
    ```bash
    /project:create-feature admin-dashboard --user-type=admin
    ```
  </examples>
</instructions>

## TourPad Feature Development Guidelines

### Component Structure
- Follow existing patterns in src/components/
- Use TypeScript for all new components
- Implement responsive design with Tailwind CSS
- Include proper error handling and loading states

### Page Structure
- Use Next.js App Router (src/app)
- Implement proper SEO with metadata
- Add authentication checks where needed
- Follow existing layout patterns

### Data Integration
- Use mockData.ts for UI development
- Use realTestData.ts for authentication features
- Maintain ID mapping consistency (mockData uses '1', '2', '3'; realTestData uses 'artist1', 'host1', 'fan1')

### Design System
- Use TourPad coastal color palette
- Maintain consistent typography and spacing
- Follow existing button and form patterns
- Ensure accessibility compliance

### Testing
- Create basic component tests
- Test authentication flows
- Verify responsive behavior
- Test error conditions