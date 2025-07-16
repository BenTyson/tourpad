# Development: Code Review

<instructions>
  <context>
    Perform a comprehensive code review of current changes or specified files in the TourPad codebase. This command analyzes code quality, security, performance, and adherence to TourPad standards.
  </context>
  
  <requirements>
    - Code changes or files to review
    - Understanding of TourPad architecture and patterns
    - Access to existing codebase for comparison
    - Knowledge of React, Next.js, and TypeScript best practices
  </requirements>
  
  <execution>
    1. Analyze code structure and organization
    2. Check TypeScript usage and type safety
    3. Review component patterns and conventions
    4. Validate responsive design implementation
    5. Check security considerations (no secrets, input validation)
    6. Review performance implications
    7. Verify accessibility compliance
    8. Check integration with existing systems
    9. Validate error handling and edge cases
    10. Generate review summary with recommendations
  </execution>
  
  <validation>
    - Code follows TourPad conventions
    - TypeScript types are properly defined
    - Components are reusable and maintainable
    - No security vulnerabilities
    - Performance is optimized
    - Accessibility standards met
    - Error handling is comprehensive
    - Integration points work correctly
  </validation>
  
  <examples>
    Review current changes:
    ```bash
    /dev:code-review
    ```
    
    Review specific file:
    ```bash
    /dev:code-review --file=src/components/map/MapContainer.tsx
    ```
    
    Focus on security:
    ```bash
    /dev:code-review --focus=security
    ```
    
    Review with performance analysis:
    ```bash
    /dev:code-review --focus=performance,security
    ```
  </examples>
</instructions>

## TourPad Code Review Checklist

### Architecture & Structure
- [ ] Follows Next.js App Router patterns
- [ ] Uses appropriate directory structure (src/app, src/components, src/data)
- [ ] Components are properly organized by feature/domain
- [ ] Maintains separation of concerns

### TypeScript & Type Safety
- [ ] All functions have proper type annotations
- [ ] No `any` types without justification
- [ ] Interface definitions are comprehensive
- [ ] Type imports are correctly organized

### React Best Practices
- [ ] Uses appropriate hooks (useState, useEffect, etc.)
- [ ] Follows component lifecycle best practices
- [ ] Implements proper error boundaries
- [ ] Uses React 19 features appropriately

### TourPad Standards
- [ ] Follows coastal color scheme (sage, french blue, sand, evergreen)
- [ ] Uses existing component patterns
- [ ] Maintains ID mapping consistency between mockData and realTestData
- [ ] Follows authentication patterns (NextAuth.js)

### Performance
- [ ] Implements proper loading states
- [ ] Uses dynamic imports where appropriate
- [ ] Optimizes images and assets
- [ ] Avoids unnecessary re-renders

### Security
- [ ] No hardcoded secrets or API keys
- [ ] Proper input validation
- [ ] Safe authentication handling
- [ ] No XSS vulnerabilities

### Accessibility
- [ ] Proper ARIA labels
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Color contrast compliance

### Mobile-First Design
- [ ] Responsive breakpoints implemented
- [ ] Touch-friendly interface
- [ ] Proper viewport handling
- [ ] Mobile performance optimized