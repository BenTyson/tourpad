# Testing: Generate Tests

<instructions>
  <context>
    Generate comprehensive tests for TourPad components, pages, and functionality. This command creates unit tests, integration tests, and end-to-end tests following TDD principles and TourPad testing patterns.
  </context>
  
  <requirements>
    - Target components or features specified
    - Understanding of TourPad data flow and user interactions
    - Knowledge of testing frameworks (Jest, React Testing Library)
    - Access to existing test patterns in the codebase
  </requirements>
  
  <execution>
    1. Analyze component/feature requirements
    2. Identify test scenarios (happy path, edge cases, error conditions)
    3. Create unit tests for individual components
    4. Create integration tests for feature workflows
    5. Add accessibility tests where applicable
    6. Test authentication flows if relevant
    7. Create mock data for testing
    8. Test responsive behavior
    9. Run tests and ensure they pass
    10. Update test documentation
  </execution>
  
  <validation>
    - All tests pass successfully
    - Code coverage meets minimum requirements (80%+)
    - Tests cover happy path and edge cases
    - Authentication scenarios are tested
    - Responsive behavior is validated
    - Error conditions are handled
    - Tests are maintainable and readable
  </validation>
  
  <examples>
    Generate tests for component:
    ```bash
    /test:generate-tests --target=MapContainer
    ```
    
    Generate full test suite:
    ```bash
    /test:generate-tests --type=unit,integration
    ```
    
    Generate tests with coverage analysis:
    ```bash
    /test:generate-tests --coverage=true
    ```
  </examples>
</instructions>

## TourPad Testing Guidelines

### Unit Testing
- Test individual components in isolation
- Mock external dependencies (API calls, authentication)
- Test props, state changes, and user interactions
- Use React Testing Library for DOM testing

### Integration Testing
- Test feature workflows end-to-end
- Test authentication flows
- Test data flow between components
- Test navigation and routing

### Test Structure
```javascript
// Example test structure
describe('MapContainer', () => {
  beforeEach(() => {
    // Setup
  });
  
  it('renders map with correct initial state', () => {
    // Test implementation
  });
  
  it('handles user interactions correctly', () => {
    // Test implementation
  });
  
  it('displays error states appropriately', () => {
    // Test implementation
  });
});
```

### Authentication Testing
- Test protected routes
- Test user role-based access
- Test session handling
- Test logout functionality

### Responsive Testing
- Test different viewport sizes
- Test touch interactions
- Test mobile navigation
- Test loading states on slow connections

### Accessibility Testing
- Test keyboard navigation
- Test screen reader compatibility
- Test color contrast
- Test form accessibility

### Mock Data
- Use consistent test data
- Mock API responses
- Mock authentication states
- Mock different user types (artist, host, fan, admin)

### Coverage Requirements
- Minimum 80% code coverage
- 100% coverage for critical paths
- Cover all user types and scenarios
- Cover error conditions and edge cases