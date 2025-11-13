# Implementation Plan

- [x] 1. Set up backend foundation
  - Create admin promotion use case with CRUD operations and validation logic
  - Create admin promotion handler with all REST endpoints
  - Extend promotion repository with additional query methods (FindByCode, FindByFilters)
  - _Requirements: 1.1-1.20, 2.1-2.8, 7.1-7.7_

- [x] 2. Implement promotion creation endpoint
  - [x] 2.1 Implement CreatePromotion use case method with validation
    - Validate required fields (code, name, type, bonus_type, bonus_value, turnover_requirement)
    - Validate numeric ranges (bonus_value > 0, turnover_requirement > 0)
    - Validate date range (valid_until > valid_from)
    - Check for duplicate promotion code
    - Create promotion entity and save to database
    - _Requirements: 1.3-1.19, 7.1-7.6_
  
  - [x] 2.2 Implement CreatePromotion handler endpoint
    - Parse and validate request body
    - Call use case method
    - Return success response with created promotion
    - Handle validation errors and return appropriate error responses
    - _Requirements: 1.2, 1.19-1.20, 7.1-7.7_

- [x] 3. Implement promotion listing and retrieval endpoints
  - [x] 3.1 Implement GetPromotions use case method with filtering
    - Support filtering by type, status, isActive
    - Support search by name or code
    - Implement pagination (limit, offset)
    - Return promotions list with total count
    - _Requirements: 1.1, 6.1-6.6_
  
  - [x] 3.2 Implement GetPromotionByID use case method
    - Fetch promotion by ID
    - Return error if not found
    - _Requirements: 1.1_
  
  - [x] 3.3 Implement handler endpoints for listing and retrieval
    - GET /api/v1/admin/promotions with query parameters
    - GET /api/v1/admin/promotions/:id
    - Parse query parameters and validate
    - Return formatted responses
    - _Requirements: 1.1, 6.1-6.6_

- [x] 4. Implement promotion update endpoint
  - [x] 4.1 Implement UpdatePromotion use case method
    - Fetch existing promotion
    - Validate updated fields
    - Check if code is being changed and validate uniqueness
    - Warn if promotion has active claims and critical fields are being modified
    - Update promotion entity
    - Save changes to database
    - _Requirements: 2.1-2.8, 7.1-7.7_
  
  - [x] 4.2 Implement UpdatePromotion handler endpoint
    - PUT /api/v1/admin/promotions/:id
    - Parse request body with partial update data
    - Call use case method
    - Return updated promotion
    - Handle errors appropriately
    - _Requirements: 2.1-2.8, 7.1-7.7_

- [ ] 5. Implement promotion status management
  - [ ] 5.1 Implement ToggleStatus use case method
    - Fetch promotion by ID
    - Toggle is_active and status fields
    - Update updated_at timestamp
    - Save changes
    - _Requirements: 3.1-3.5_
  
  - [ ] 5.2 Implement ToggleStatus handler endpoint
    - PATCH /api/v1/admin/promotions/:id/status
    - Call use case method
    - Return updated promotion
    - _Requirements: 3.1-3.5_

- [ ] 6. Implement promotion deletion endpoint
  - [ ] 6.1 Implement DeletePromotion use case method
    - Fetch promotion by ID
    - Check for active member claims
    - If active claims exist, return warning/error
    - Delete promotion from database
    - Handle cascading deletions
    - _Requirements: 4.1-4.6_
  
  - [ ] 6.2 Implement DeletePromotion handler endpoint
    - DELETE /api/v1/admin/promotions/:id
    - Call use case method
    - Return success response
    - Handle errors (not found, active claims)
    - _Requirements: 4.1-4.6_

- [ ] 7. Implement promotion statistics endpoints
  - [ ] 7.1 Implement GetPromotionStats use case method
    - Query promotion_stats view for specific promotion
    - Calculate additional metrics if needed
    - Return statistics object
    - _Requirements: 5.1-5.8_
  
  - [ ] 7.2 Implement GetAllPromotionStats use case method
    - Query promotion_stats view for all promotions
    - Return array of statistics
    - _Requirements: 5.1-5.8_
  
  - [ ] 7.3 Implement statistics handler endpoints
    - GET /api/v1/admin/promotions/:id/stats
    - GET /api/v1/admin/promotions/stats
    - Return formatted statistics
    - _Requirements: 5.1-5.8_

- [ ] 8. Register routes and wire up dependencies
  - Register all promotion handler routes in router
  - Wire up handler with use case in dependency injection
  - Wire up use case with repository
  - Add authentication middleware to all routes
  - Add admin role authorization middleware
  - _Requirements: 1.1-1.20_

- [ ] 9. Create frontend API client
  - Create promotionAPI.ts with all admin endpoints
  - Implement getPromotions with filter parameters
  - Implement getPromotionById
  - Implement createPromotion
  - Implement updatePromotion
  - Implement deletePromotion
  - Implement toggleStatus
  - Implement getPromotionStats and getAllStats
  - Configure axios interceptors for error handling
  - _Requirements: 1.1-1.20_

- [ ] 10. Create TypeScript types and interfaces
  - Define Promotion interface matching backend entity
  - Define PromotionFormData interface for form state
  - Define PromotionFilters interface
  - Define PromotionStats interface
  - Define PromotionType and BonusType enums
  - Define API response types
  - _Requirements: 1.1-1.20_

- [ ] 11. Implement PromotionManagement component structure
  - [ ] 11.1 Create main component with state management
    - Set up state for promotions list, loading, modal visibility
    - Set up state for form data and editing promotion
    - Set up state for filters and pagination
    - Implement useEffect to load promotions on mount
    - _Requirements: 1.1, 8.1-8.10_
  
  - [ ] 11.2 Implement data loading and refresh logic
    - Create loadPromotions function with filter support
    - Handle loading states
    - Handle errors with toast notifications
    - _Requirements: 1.1, 7.7_

- [ ] 12. Implement promotion list view
  - [ ] 12.1 Create header section
    - Display page title with icon
    - Display summary statistics (total, active, claims, bonus amount)
    - Add create promotion button
    - _Requirements: 8.1-8.10_
  
  - [ ] 12.2 Create filter and search controls
    - Add search input with debounce
    - Add type filter dropdown
    - Add status filter dropdown
    - Add active/inactive filter toggle
    - Update promotions list when filters change
    - _Requirements: 6.1-6.6_
  
  - [ ] 12.3 Create promotion card component
    - Display promotion image with fallback
    - Display promotion name and description
    - Display bonus information (type, value, max)
    - Display turnover requirement
    - Display validity dates
    - Display status badge (active/inactive/expired)
    - Display type badge with color coding
    - Display quick statistics (claims, bonus given)
    - Add action buttons (edit, delete, toggle status)
    - _Requirements: 8.1-8.10_
  
  - [ ] 12.4 Implement grid layout for promotion cards
    - Use responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
    - Handle empty state with helpful message
    - _Requirements: 8.8_

- [ ] 13. Implement promotion form modal
  - [ ] 13.1 Create modal component structure
    - Modal overlay with backdrop
    - Modal header with title and close button
    - Modal body with form sections
    - Modal footer with action buttons
    - Handle open/close state
    - _Requirements: 8.1-8.10_
  
  - [ ] 13.2 Implement basic information section
    - Code input (disabled when editing)
    - Name input
    - Description textarea
    - Type select dropdown
    - _Requirements: 1.3-1.5, 8.2-8.3_
  
  - [ ] 13.3 Implement bonus configuration section
    - Bonus type select (percentage/fixed)
    - Bonus value input (with validation)
    - Max bonus input (conditional on percentage type)
    - Turnover requirement input
    - Display helpful labels and tooltips
    - _Requirements: 1.5-1.10, 8.4_
  
  - [ ] 13.4 Implement conditions section
    - Min deposit input
    - Max withdraw input
    - Applicable games input/select
    - Max uses input (0 for unlimited)
    - Max uses per member input
    - Valid from date picker
    - Valid until date picker
    - _Requirements: 1.8-1.12, 8.5_
  
  - [ ] 13.5 Implement display settings section
    - Image URL input or image selector
    - Display order input
    - Terms and conditions textarea
    - Auto apply checkbox
    - Is active checkbox
    - _Requirements: 1.13-1.18, 8.5-8.6, 9.1-9.5_
  
  - [ ] 13.6 Implement form validation
    - Validate required fields on blur and submit
    - Validate numeric ranges
    - Validate date ranges
    - Display inline error messages
    - Prevent submission with errors
    - _Requirements: 7.1-7.7_

- [ ] 14. Implement form submission logic
  - [ ] 14.1 Implement create promotion flow
    - Validate form data
    - Call createPromotion API
    - Handle success (close modal, show toast, refresh list)
    - Handle errors (show error toast with specific message)
    - _Requirements: 1.19-1.20, 7.7_
  
  - [ ] 14.2 Implement update promotion flow
    - Load existing promotion data into form
    - Validate changes
    - Call updatePromotion API
    - Handle success and errors
    - _Requirements: 2.1-2.8, 7.7_
  
  - [ ] 14.3 Implement modal open/close handlers
    - handleOpenModal for create (clear form)
    - handleOpenModal for edit (load promotion data)
    - handleCloseModal (reset state)
    - _Requirements: 1.2, 2.1_

- [ ] 15. Implement promotion actions
  - [ ] 15.1 Implement status toggle
    - Add toggle button to promotion card
    - Call toggleStatus API
    - Update promotion in list
    - Show success toast
    - Handle errors
    - _Requirements: 3.1-3.5_
  
  - [ ] 15.2 Implement delete action
    - Add delete button to promotion card
    - Show confirmation dialog with promotion name
    - Call deletePromotion API
    - Remove promotion from list on success
    - Show success toast
    - Handle errors (active claims warning)
    - _Requirements: 4.1-4.6_
  
  - [ ] 15.3 Implement edit action
    - Add edit button to promotion card
    - Open modal with promotion data loaded
    - _Requirements: 2.1_

- [ ] 16. Implement statistics display
  - [ ] 16.1 Create statistics modal component
    - Display detailed statistics for a promotion
    - Show total claims, active, completed, cancelled
    - Show total deposit and bonus amounts
    - Show total turnover
    - Show charts or visualizations (optional)
    - _Requirements: 5.1-5.8_
  
  - [ ] 16.2 Add statistics button to promotion card
    - Open statistics modal when clicked
    - Load statistics data from API
    - _Requirements: 5.1-5.8_
  
  - [ ] 16.3 Display summary statistics in header
    - Aggregate statistics from all promotions
    - Display total promotions, active count, total claims, total bonus
    - _Requirements: 5.1-5.8_

- [ ] 17. Implement UI styling and theming
  - Apply modern admin dashboard theme
  - Use consistent color scheme for status and types
  - Implement responsive layout
  - Add loading spinners and skeletons
  - Add smooth transitions and animations
  - Ensure accessibility (ARIA labels, keyboard navigation)
  - _Requirements: 8.1-8.10_

- [ ] 18. Add error handling and user feedback
  - Implement toast notifications for all actions
  - Display loading states during API calls
  - Show error messages for validation failures
  - Show error messages for API failures
  - Provide helpful error messages for common scenarios
  - _Requirements: 7.1-7.7_

- [ ] 19. Implement pagination
  - Add pagination controls to list view
  - Update API calls with limit and offset
  - Display current page and total pages
  - Handle page changes
  - _Requirements: 6.1-6.6_

- [ ] 20. Add image selection integration
  - Integrate with site images management system
  - Add image picker modal
  - Display image preview in form
  - Allow image selection from library
  - _Requirements: 9.1-9.5_

- [ ] 21. Final integration and testing
  - Test complete create flow
  - Test complete edit flow
  - Test delete flow with and without active claims
  - Test status toggle
  - Test all filters and search
  - Test pagination
  - Test form validation
  - Test error scenarios
  - Verify responsive layout on different screen sizes
  - Test with real data
  - _Requirements: 1.1-10.6_
