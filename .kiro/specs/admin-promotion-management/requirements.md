# Requirements Document

## Introduction

This document outlines the requirements for a comprehensive Admin Promotion Management System. The system enables administrators to create, configure, and manage various types of promotional offers (deposit bonuses, cashback, free spins, etc.) with detailed conditions including bonus calculations, turnover requirements, deposit limits, and claim restrictions. The system must provide a clear, user-friendly interface for configuring all promotion parameters and tracking promotion usage statistics.

## Glossary

- **Admin System**: The administrative web application used by staff to manage promotions
- **Promotion**: A bonus or reward offer that members can claim
- **Member**: A registered user who can claim promotions
- **Turnover Requirement**: The amount a member must wager before withdrawing bonus funds (expressed as a multiplier)
- **Bonus Type**: The calculation method for bonus amount (percentage or fixed amount)
- **Promotion Type**: The category of promotion (deposit, cashback, freespin, new_member, daily_first, etc.)
- **Claim Limit**: Maximum number of times a member can claim a specific promotion
- **Deposit Range**: Minimum and maximum deposit amounts required to claim a promotion
- **Max Bonus**: The maximum bonus amount that can be awarded regardless of deposit size
- **Auto Apply**: A flag indicating whether the promotion is automatically applied without member action
- **Applicable Games**: The game types or categories where the promotion can be used

## Requirements

### Requirement 1: Promotion Creation and Configuration

**User Story:** As an administrator, I want to create new promotions with comprehensive configuration options, so that I can offer various types of bonuses to members with specific conditions.

#### Acceptance Criteria

1. WHEN the administrator accesses the promotion management page, THE Admin System SHALL display a list of all existing promotions with their key details
2. WHEN the administrator clicks the create promotion button, THE Admin System SHALL display a form with all required configuration fields
3. THE Admin System SHALL require the administrator to specify a unique promotion code, name, and description
4. THE Admin System SHALL allow the administrator to select a promotion type from predefined options (deposit, cashback, freespin, new_member, daily_first, normal)
5. THE Admin System SHALL allow the administrator to select a bonus type (percentage or fixed amount)
6. WHEN bonus type is percentage, THE Admin System SHALL require a percentage value between 1 and 500
7. WHEN bonus type is fixed, THE Admin System SHALL require a fixed amount greater than 0
8. THE Admin System SHALL allow the administrator to specify a maximum bonus amount
9. THE Admin System SHALL allow the administrator to specify minimum and maximum deposit amounts
10. THE Admin System SHALL allow the administrator to specify a turnover multiplier (e.g., 3x, 5x, 10x)
11. THE Admin System SHALL allow the administrator to specify maximum claim limit per member (0 for unlimited)
12. THE Admin System SHALL allow the administrator to specify valid date range (start and end dates)
13. THE Admin System SHALL allow the administrator to specify applicable games (all, slots, casino, sports, etc.)
14. THE Admin System SHALL allow the administrator to specify maximum withdrawal amount (0 for unlimited)
15. THE Admin System SHALL allow the administrator to enable or disable auto-apply functionality
16. THE Admin System SHALL allow the administrator to upload or select a promotion image
17. THE Admin System SHALL allow the administrator to enter terms and conditions text
18. THE Admin System SHALL allow the administrator to set display order for promotion listing
19. WHEN all required fields are completed, THE Admin System SHALL save the promotion to the database
20. WHEN save is successful, THE Admin System SHALL display a success message and return to the promotion list

### Requirement 2: Promotion Editing and Updates

**User Story:** As an administrator, I want to edit existing promotions, so that I can update conditions, extend validity periods, or correct mistakes.

#### Acceptance Criteria

1. WHEN the administrator clicks edit on a promotion, THE Admin System SHALL load the promotion data into the edit form
2. THE Admin System SHALL display all current promotion configuration values in the form fields
3. THE Admin System SHALL allow the administrator to modify any configurable field except the promotion code
4. WHEN the administrator saves changes, THE Admin System SHALL validate all modified fields
5. THE Admin System SHALL update the promotion record with the new values
6. THE Admin System SHALL update the updated_at timestamp
7. WHEN update is successful, THE Admin System SHALL display a success message
8. IF the promotion has active claims, THE Admin System SHALL display a warning before allowing changes to critical fields

### Requirement 3: Promotion Status Management

**User Story:** As an administrator, I want to activate or deactivate promotions, so that I can control which promotions are available to members without deleting them.

#### Acceptance Criteria

1. THE Admin System SHALL display the current active status for each promotion in the list
2. WHEN the administrator clicks the status toggle, THE Admin System SHALL change the is_active flag
3. WHEN a promotion is deactivated, THE Admin System SHALL prevent new claims while preserving existing active claims
4. THE Admin System SHALL display visual indicators for active and inactive promotions
5. WHEN status change is successful, THE Admin System SHALL display a confirmation message

### Requirement 4: Promotion Deletion

**User Story:** As an administrator, I want to delete promotions that are no longer needed, so that I can keep the promotion list clean and organized.

#### Acceptance Criteria

1. WHEN the administrator clicks delete on a promotion, THE Admin System SHALL display a confirmation dialog
2. THE Admin System SHALL show the promotion name in the confirmation dialog
3. IF the promotion has active member claims, THE Admin System SHALL display a warning about existing claims
4. WHEN the administrator confirms deletion, THE Admin System SHALL remove the promotion from the database
5. THE Admin System SHALL handle cascading deletion of related records according to database constraints
6. WHEN deletion is successful, THE Admin System SHALL display a success message and refresh the list

### Requirement 5: Promotion Statistics and Monitoring

**User Story:** As an administrator, I want to view statistics for each promotion, so that I can monitor usage and effectiveness.

#### Acceptance Criteria

1. THE Admin System SHALL display total claims count for each promotion
2. THE Admin System SHALL display total bonus amount distributed for each promotion
3. THE Admin System SHALL display count of active claims for each promotion
4. THE Admin System SHALL display count of completed claims for each promotion
5. THE Admin System SHALL display count of cancelled claims for each promotion
6. THE Admin System SHALL calculate and display total deposit amount associated with each promotion
7. THE Admin System SHALL calculate and display total turnover amount for each promotion
8. WHEN the administrator clicks on statistics, THE Admin System SHALL display detailed statistics in a modal or separate view

### Requirement 6: Promotion Search and Filtering

**User Story:** As an administrator, I want to search and filter promotions, so that I can quickly find specific promotions in a large list.

#### Acceptance Criteria

1. THE Admin System SHALL provide a search input field for promotion name or code
2. WHEN the administrator enters search text, THE Admin System SHALL filter the promotion list in real-time
3. THE Admin System SHALL provide filter options for promotion type
4. THE Admin System SHALL provide filter options for active/inactive status
5. THE Admin System SHALL provide filter options for date range
6. THE Admin System SHALL display the count of filtered results

### Requirement 7: Form Validation and Error Handling

**User Story:** As an administrator, I want clear validation messages when entering promotion data, so that I can correct errors before saving.

#### Acceptance Criteria

1. WHEN required fields are empty, THE Admin System SHALL display field-specific error messages
2. WHEN numeric fields contain invalid values, THE Admin System SHALL display validation errors
3. WHEN date ranges are invalid (end before start), THE Admin System SHALL display a validation error
4. WHEN the promotion code already exists, THE Admin System SHALL display a duplicate error message
5. WHEN percentage values exceed valid range, THE Admin System SHALL display a range error
6. THE Admin System SHALL prevent form submission while validation errors exist
7. WHEN API errors occur, THE Admin System SHALL display user-friendly error messages

### Requirement 8: User Interface Design

**User Story:** As an administrator, I want a clean and intuitive interface for managing promotions, so that I can work efficiently without confusion.

#### Acceptance Criteria

1. THE Admin System SHALL use a modern, professional design theme appropriate for administrative interfaces
2. THE Admin System SHALL organize form fields into logical sections (Basic Info, Bonus Configuration, Conditions, Display Settings)
3. THE Admin System SHALL use clear labels and helpful placeholder text for all input fields
4. THE Admin System SHALL display tooltips or help text for complex fields
5. THE Admin System SHALL use appropriate input types (number, date, select, checkbox) for each field
6. THE Admin System SHALL display promotion images as thumbnails in the list view
7. THE Admin System SHALL use color coding to indicate promotion status (active/inactive)
8. THE Admin System SHALL provide responsive layout that works on different screen sizes
9. THE Admin System SHALL use icons to enhance visual clarity of actions (edit, delete, toggle)
10. THE Admin System SHALL display loading states during API operations

### Requirement 9: Promotion Image Management

**User Story:** As an administrator, I want to associate images with promotions, so that promotions are visually appealing to members.

#### Acceptance Criteria

1. THE Admin System SHALL allow the administrator to select an image from the site images library
2. THE Admin System SHALL display a preview of the selected image in the form
3. THE Admin System SHALL display the promotion image in the list view
4. THE Admin System SHALL allow the administrator to change or remove the promotion image
5. WHEN no image is selected, THE Admin System SHALL display a placeholder image

### Requirement 10: Promotion Conditions Configuration

**User Story:** As an administrator, I want to configure additional conditions for promotions, so that I can create targeted offers for specific scenarios.

#### Acceptance Criteria

1. THE Admin System SHALL allow the administrator to specify applicable payment methods
2. THE Admin System SHALL allow the administrator to specify required member levels
3. THE Admin System SHALL allow the administrator to specify applicable game providers
4. THE Admin System SHALL allow the administrator to add multiple conditions to a single promotion
5. THE Admin System SHALL allow the administrator to mark conditions as required or optional
6. THE Admin System SHALL display all configured conditions in a clear, organized manner
