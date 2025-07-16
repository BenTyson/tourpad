# Development: Debug Session

<instructions>
  <context>
    Systematic debugging and problem-solving session for TourPad issues. This command provides a structured approach to identifying, analyzing, and resolving bugs or performance issues.
  </context>
  
  <requirements>
    - Issue description or error message
    - Access to browser dev tools and server logs
    - Understanding of TourPad architecture
    - Ability to reproduce the issue
  </requirements>
  
  <execution>
    1. Gather issue details (error messages, user actions, environment)
    2. Reproduce the issue in development environment
    3. Analyze browser console for client-side errors
    4. Check server logs for backend issues
    5. Investigate relevant code sections
    6. Identify root cause and potential solutions
    7. Implement fix with proper testing
    8. Verify fix resolves the issue
    9. Test for regression issues
    10. Document the solution for future reference
  </execution>
  
  <validation>
    - Issue is fully reproduced and understood
    - Root cause is identified accurately
    - Solution addresses the core problem
    - No new issues introduced
    - Fix is tested across different scenarios
    - Documentation is updated if needed
  </validation>
  
  <examples>
    Debug specific error:
    ```bash
    /dev:debug-session --error="Map not rendering"
    ```
    
    Debug performance issue:
    ```bash
    /dev:debug-session --type=performance
    ```
    
    Debug authentication issue:
    ```bash
    /dev:debug-session --focus=auth
    ```
  </examples>
</instructions>

## TourPad Debug Checklist

### Common Issues
- **Map rendering problems**: Check Leaflet imports, SSR issues, container dimensions
- **Authentication failures**: Verify NextAuth configuration, session handling
- **Data loading issues**: Check mockData vs realTestData usage, ID mapping
- **Responsive design problems**: Test Tailwind breakpoints, mobile viewport
- **Performance issues**: Check bundle size, unnecessary re-renders, image optimization

### Debug Tools
- Browser Developer Tools (Console, Network, Performance)
- React Developer Tools
- Next.js built-in error pages
- Server logs (`server.log`)
- TypeScript compiler errors

### TourPad-Specific Debug Points
- Check data consistency between mockData and realTestData
- Verify authentication state and user roles
- Test different user types (artist, host, fan, admin)
- Check coastal color scheme rendering
- Validate mobile-first responsive behavior