# Implementation Plan - Lucky Wheel System

- [x] 1. Fix Repository Import and Setup Core Infrastructure
  - Fix missing domain import in lucky_wheel_repository.go
  - Update repository to use uuid.UUID for member_id
  - Add missing repository methods (GetEnabledPrizes, stats methods)
  - _Requirements: 1.1, 2.1, 9.3_

- [ ] 2. Implement Use Case Layer
  - [x] 2.1 Create MemberLuckyWheelUseCase
    - Implement GetWheelInfo method
    - Implement SpinWheel method with probability engine
    - Implement GetSpinHistory method
    - Add wallet integration for cash prizes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 4.1, 4.3_
  
  - [x] 2.2 Create AdminLuckyWheelUseCase
    - Implement GetAllPrizes method
    - Implement UpdatePrize and UpdatePrizes methods
    - Implement GetSettings and UpdateSettings methods
    - Implement GetStats method
    - Implement GetSpinLogs method with pagination
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 7.1, 7.2, 8.1, 8.2_

- [x] 3. Implement Probability Engine
  - Create weighted random selection algorithm
  - Add validation for probability sum (must equal 100%)
  - Add fallback mechanism for edge cases
  - _Requirements: 1.2, 5.4_

- [ ] 4. Create HTTP Handlers
  - [x] 4.1 Create Member Lucky Wheel Handler
    - Implement GET /api/v1/member/lucky-wheel/info endpoint
    - Implement POST /api/v1/member/lucky-wheel/spin endpoint
    - Implement GET /api/v1/member/lucky-wheel/history endpoint
    - Add JWT authentication middleware
    - Add request validation
    - _Requirements: 1.1, 1.2, 1.5, 4.1, 9.1, 9.3_
  
  - [x] 4.2 Create Admin Lucky Wheel Handler
    - Implement GET /api/v1/admin/lucky-wheel/prizes endpoint
    - Implement PUT /api/v1/admin/lucky-wheel/prizes/:id endpoint
    - Implement PUT /api/v1/admin/lucky-wheel/prizes endpoint
    - Implement GET /api/v1/admin/lucky-wheel/settings endpoint
    - Implement PUT /api/v1/admin/lucky-wheel/settings endpoint
    - Implement GET /api/v1/admin/lucky-wheel/stats endpoint
    - Implement GET /api/v1/admin/lucky-wheel/logs endpoint
    - Add admin authorization middleware
    - _Requirements: 5.1, 5.2, 5.5, 6.1, 6.5, 7.1, 7.4, 8.1, 8.3, 9.2, 9.3_

- [x] 5. Register Routes
  - Register member routes in router
  - Register admin routes in router
  - Apply authentication and authorization middleware
  - _Requirements: 9.1, 9.2_

- [ ] 6. Update Frontend Member - Lucky Wheel Page
  - [x] 6.1 Create API client functions
    - Create luckyWheelAPI.ts with all member endpoints
    - Add TypeScript interfaces for requests/responses
    - _Requirements: 1.1, 1.2, 4.1_
  
  - [x] 6.2 Update LuckyWheelPage component
    - Fix API integration to use real endpoints
    - Update wheel animation logic
    - Add proper error handling with toast notifications
    - Update spin quota display
    - Update history display with real data
    - Add loading states
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 3.1, 4.1, 4.2, 10.1, 10.2_

- [x] 7. Update Frontend Admin - Lucky Wheel Management
  - [x] 7.1 Create admin API client functions
    - Create adminLuckyWheelAPI.ts with all admin endpoints
    - Add TypeScript interfaces for admin requests/responses
    - _Requirements: 5.1, 6.1, 7.1, 8.1_
  
  - [x] 7.2 Update LuckyWheelManagement component
    - Fix API integration for all tabs (stats, settings, prizes, logs)
    - Implement prize management with validation
    - Implement settings management
    - Add probability sum validation (must equal 100%)
    - Update stats display with real data
    - Update logs with pagination
    - Add proper error handling
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4, 10.3, 10.4_

- [x] 8. Add Error Handling and Validation
  - Create custom error types for lucky wheel
  - Add input validation for all endpoints
  - Add business logic validation (quota, enabled status)
  - Implement proper error responses
  - _Requirements: 2.4, 5.4, 9.4, 10.1, 10.5_

- [ ] 9. Database Migration Updates
  - Verify migration 000047 is correct
  - Update member_id column type if needed (BINARY(16) for UUID)
  - Add indexes for performance
  - Verify foreign key constraints
  - _Requirements: All data-related requirements_

- [ ]* 10. Testing
  - [ ]* 10.1 Write repository tests
    - Test all CRUD operations
    - Test query methods with different scenarios
    - _Requirements: All repository methods_
  
  - [ ]* 10.2 Write use case tests
    - Test spin logic with different probabilities
    - Test quota validation
    - Test wallet integration
    - Test admin operations
    - _Requirements: 1.2, 2.1, 2.2, 2.4, 5.4_
  
  - [ ]* 10.3 Write handler tests
    - Test all endpoints with valid/invalid inputs
    - Test authentication and authorization
    - Test error responses
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.1, 10.5_

- [ ] 11. Documentation and Deployment
  - Update API documentation
  - Add inline code comments
  - Create deployment checklist
  - Update environment variables documentation
  - _Requirements: All requirements_
