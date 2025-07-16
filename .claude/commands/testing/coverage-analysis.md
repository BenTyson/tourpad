# Testing: Coverage Analysis

<instructions>
  <context>
    Analyze test coverage for TourPad codebase and identify areas needing additional testing. This command assesses current test coverage, identifies gaps, and provides recommendations for improvement.
  </context>
  
  <requirements>
    - Existing test suite (unit, integration, e2e)
    - Test coverage reporting tools
    - Understanding of critical code paths
    - Knowledge of TourPad user workflows
  </requirements>
  
  <execution>
    1. Run existing test suite with coverage reporting
    2. Analyze coverage report by file and function
    3. Identify critical paths with low coverage
    4. Prioritize uncovered code by business impact
    5. Identify missing test scenarios
    6. Create tests for high-priority gaps
    7. Focus on authentication, payment, and core workflows
    8. Re-run coverage analysis to measure improvement
    9. Document coverage targets and standards
    10. Set up coverage monitoring for future development
  </execution>
  
  <validation>
    - Overall coverage meets minimum targets (80%+)
    - Critical paths have high coverage (95%+)
    - All user types and scenarios are covered
    - Authentication flows are thoroughly tested
    - Payment flows have complete coverage
    - Error conditions are tested
    - Edge cases are covered
  </validation>
  
  <examples>
    Analyze overall coverage:
    ```bash
    /test:coverage-analysis
    ```
    
    Focus on specific component:
    ```bash
    /test:coverage-analysis --component=MapContainer
    ```
    
    Target specific coverage level:
    ```bash
    /test:coverage-analysis --target=90%
    ```
  </examples>
</instructions>

## TourPad Coverage Targets

### Critical Components (95%+ coverage required)
- Authentication system (NextAuth integration)
- Payment processing (Stripe integration)
- User registration and profile management
- Booking system and workflow
- Security-related functions

### Core Components (85%+ coverage required)
- Dashboard and navigation
- Artist/host listings and profiles
- Map component and location services
- Message system and notifications
- Search and filtering functionality

### Standard Components (80%+ coverage required)
- UI components and layouts
- Form validation and handling
- Data display and formatting
- Responsive design components

### Coverage Analysis Focus Areas

#### Authentication Testing
- Login/logout workflows
- Session management
- Role-based access control
- Password reset functionality
- User type switching

#### Data Layer Testing
- mockData.ts functions and data integrity
- realTestData.ts authentication integration
- ID mapping consistency
- Data filtering and search

#### User Workflow Testing
- Artist registration and verification
- Host onboarding and setup
- Fan subscription and payment
- Booking creation and management
- Communication and messaging

#### Error Handling Testing
- Network failures and timeouts
- Invalid input validation
- Authentication errors
- Payment processing failures
- Database connection issues

#### Performance Testing
- Large data set handling
- Map rendering with many markers
- Image loading and optimization
- Mobile device performance
- Bundle size and loading times