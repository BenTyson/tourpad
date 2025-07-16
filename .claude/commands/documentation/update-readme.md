# Documentation: Update README

<instructions>
  <context>
    Update and maintain the TourPad README.md file to reflect current features, setup instructions, and project status. This command ensures documentation stays current with development progress.
  </context>
  
  <requirements>
    - Current project status and features
    - Understanding of setup and deployment process
    - Knowledge of recent changes and updates
    - Access to project configuration files
  </requirements>
  
  <execution>
    1. Review current README.md content
    2. Update project description and features
    3. Verify setup instructions are current
    4. Update technology stack information
    5. Add or update screenshots/demos
    6. Update API documentation if applicable
    7. Review and update troubleshooting section
    8. Check all links and references
    9. Update contribution guidelines
    10. Ensure formatting and structure are clean
  </execution>
  
  <validation>
    - All information is accurate and current
    - Setup instructions work for new developers
    - Technology stack is up to date
    - Screenshots reflect current UI
    - Links are functional
    - Formatting is consistent
    - Professional and welcoming tone
  </validation>
  
  <examples>
    Update full README:
    ```bash
    /docs:update-readme
    ```
    
    Focus on setup section:
    ```bash
    /docs:update-readme --section=setup
    ```
    
    Update with new features:
    ```bash
    /docs:update-readme --features=map-integration
    ```
  </examples>
</instructions>

## TourPad README Structure

### Project Overview
- Mission: "Where Music Feels Like Home"
- Brief description of artist-host connection platform
- Key value propositions

### Features
- User authentication and profiles
- Artist/host discovery and listings
- Interactive venue map
- Booking system and workflow
- Payment processing integration
- Communication and messaging

### Technology Stack
- Next.js 15.3.5 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- NextAuth.js for authentication
- Stripe for payments
- Leaflet for maps

### Setup Instructions
1. Prerequisites (Node.js, npm/yarn)
2. Environment variables setup
3. Dependency installation
4. Development server startup
5. Initial configuration

### Development Workflow
- Reference to Claude Code modular framework
- Available commands and usage
- Testing procedures
- Code review process

### Project Structure
- Key directories and their purposes
- Data architecture (mockData vs realTestData)
- Component organization
- API routes and authentication

### Contributing
- Code standards and conventions
- Git workflow and branching
- Issue reporting and feature requests
- Pull request process

### Security and Privacy
- Data protection measures
- Authentication security
- Privacy-focused location handling
- Payment security (Stripe integration)