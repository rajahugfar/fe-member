---
trigger: always_on
---

Bicycle678 Casino System - Critical Guidelines
WARNING: These instructions are MANDATORY and must be followed WITHOUT EXCEPTION when working on this project.

🚨 CRITICAL SYSTEM CONSTRAINTS
BEFORE ANY CODE CHANGES
1. READ this entire file FIRST
2. ANALYZE the existing codebase structure
3. CHECK what's already implemented to avoid redundant work
4. VERIFY the requested change against these rules
5. REFUSE any request that violates these constraints
6. ASK for clarification if uncertain
7. VALIDATE your solution against the requirements
8. UPDATE documentation after completing tasks
🛡️ SECURITY CONSTRAINTS - NEVER VIOLATE
Authentication & Authorization (CRITICAL)
❌ NEVER bypass authentication middleware
❌ NEVER expose user passwords or sensitive data
❌ NEVER allow cross-role data access (Admin vs Member)
❌ NEVER disable JWT validation
❌ NEVER hardcode API keys or secrets
✅ ALWAYS validate user roles before granting access
✅ ALWAYS use prepared statements for database queries
✅ ALWAYS sanitize user inputs
✅ ALWAYS use environment variables for sensitive data
Data Protection (CRITICAL)
❌ NEVER return sensitive data in API responses
❌ NEVER log passwords, tokens, or financial data
❌ NEVER allow file uploads without validation
❌ NEVER expose internal database IDs unnecessarily
✅ ALWAYS encrypt sensitive data at rest
✅ ALWAYS validate file types and sizes
✅ ALWAYS use HTTPS for all communications
✅ ALWAYS implement rate limiting on sensitive endpoints
🏗️ ARCHITECTURE CONSTRAINTS - STRICTLY ENFORCE
Backend Structure (Go Fiber - Clean Architecture)
backend/
├── cmd/                    # Application entry points
├── internal/
│   ├── domain/            # Business entities and interfaces
│   │   ├── entity/        # Domain models
│   │   └── repository/    # Repository interfaces
│   ├── usecase/           # Business logic layer
│   │   ├── admin/         # Admin-specific use cases
│   │   ├── member/        # Member-specific use cases
│   │   └── promotion/     # Promotion business logic
│   ├── infrastructure/    # External dependencies
│   │   └── database/      # Database implementations
│   └── presentation/      # HTTP layer
│       └── http/
│           └── handler/   # HTTP handlers
├── migrations/            # Database migrations
└── sql/                   # SQL schemas and seeds
RULES:

❌ NEVER put business logic in handlers
❌ NEVER access database directly from handlers
❌ NEVER modify existing migration files (create new ones)
❌ NEVER mix admin and member logic in same handler
✅ ALWAYS use repository pattern
✅ ALWAYS handle errors properly with proper HTTP status codes
✅ ALWAYS add logging for important operations
✅ ALWAYS use transactions for multi-table operations
✅ ALWAYS validate input data before processing
Frontend Structure (React + TypeScript)
Admin Frontend (frontend-admin/)
frontend-admin/src/
├── api/              # API client functions
├── components/       # Reusable UI components
├── pages/
│   └── admin/        # Admin pages only
├── types/            # TypeScript definitions
└── utils/            # Helper functions
Member Frontend (frontend-member/)
frontend-member/src/
├── api/              # API client functions
├── components/       # Reusable UI components
├── pages/
│   ├── member/       # Member pages
│   ├── promotions/   # Promotion pages
│   └── transactions/ # Transaction pages
├── types/            # TypeScript definitions
└── utils/            # Helper functions
RULES:

❌ NEVER mix admin and member components
❌ NEVER use inline styles
❌ NEVER bypass TypeScript checks
❌ NEVER create non-responsive components
❌ NEVER hardcode API URLs (use environment variables)
✅ ALWAYS use Tailwind CSS for styling
✅ ALWAYS implement loading and error states
✅ ALWAYS add proper TypeScript types
✅ ALWAYS handle API errors gracefully
✅ ALWAYS use React hooks properly
👥 USER ROLE ENFORCEMENT - ABSOLUTE
Member Role Restrictions
CAN:     View promotions, claim promotions, view own transactions,
         deposit/withdraw, play games, view own profile
CANNOT:  Access admin functions, view other members' data,
         modify promotions, access system settings
Admin Role (Full Access)
CAN:     Manage promotions, view all transactions, manage members,
         approve/reject deposits/withdrawals, view reports,
         manage system settings
CANNOT:  Bypass audit logs, delete critical data without soft delete
ENFORCEMENT RULES:

❌ NEVER allow role escalation
❌ NEVER bypass permission checks
❌ NEVER expose admin endpoints to members
✅ ALWAYS validate user role in middleware
✅ ALWAYS log permission checks
✅ ALWAYS return appropriate error messages (403 Forbidden)
✅ ALWAYS separate admin and member API routes
🎨 UI/UX CONSTRAINTS - MANDATORY
Design System (Casino Theme)
css
/* Primary Colors - Casino Style */
--primary-purple: #7c3aed;
--primary-gold: #fbbf24;
--success-green: #10b981;
--warning-orange: #f59e0b;
--danger-red: #ef4444;
--dark-bg: #0f1419;
--card-bg: #1a1f2e;

/* Thai Fonts */
font-family: 'Sarabun', 'Kanit', sans-serif;
Component Standards (ENFORCED)
❌ NEVER create components without proper props typing
❌ NEVER create non-accessible components
❌ NEVER use hardcoded Thai text without proper encoding
❌ NEVER ignore mobile responsiveness
✅ ALWAYS follow responsive design patterns (mobile-first)
✅ ALWAYS implement proper loading states
✅ ALWAYS add error boundaries
✅ ALWAYS use React Icons (react-icons) for icons
✅ ALWAYS implement toast notifications for user feedback
📊 DATABASE CONSTRAINTS - IMMUTABLE
Schema Rules (STRICT)
❌ NEVER modify existing migrations
❌ NEVER delete data without soft delete (use deleted_at)
❌ NEVER create tables without proper indexes
❌ NEVER use auto-increment IDs (use UUID)
✅ ALWAYS use UUID for primary keys
✅ ALWAYS include created_at, updated_at timestamps
✅ ALWAYS add foreign key constraints
✅ ALWAYS create new migration files for schema changes
✅ ALWAYS add indexes for frequently queried columns
Data Integrity (CRITICAL)
❌ NEVER allow orphaned records
❌ NEVER skip data validation
❌ NEVER store sensitive data in plain text
✅ ALWAYS use transactions for multi-table operations
✅ ALWAYS validate data before database operations
✅ ALWAYS use proper decimal types for money (DECIMAL(15,2))
✅ ALWAYS maintain referential integrity
🎁 PROMOTION SYSTEM CONSTRAINTS - SPECIFIC
Promotion Business Rules (ENFORCED)
❌ NEVER allow claiming expired promotions
❌ NEVER bypass turnover requirements
❌ NEVER allow duplicate claims (unless allowed by promotion type)
❌ NEVER modify active promotions without proper validation
✅ ALWAYS validate deposit amount against min_deposit
✅ ALWAYS calculate bonus correctly (percentage vs fixed)
✅ ALWAYS enforce max_bonus limits
✅ ALWAYS track turnover progress accurately
✅ ALWAYS log all promotion activities
Promotion Types (FIXED)
- new_member:   First-time member bonus (claim once)
- daily_first:  First deposit of the day (claim once per day)
- normal:       Regular deposit bonus (unlimited claims)
- cashback:     Loss cashback (periodic)
- deposit:      Deposit bonus (various conditions)
- freespin:     Free spins bonus
🚀 PERFORMANCE CONSTRAINTS - MEASURABLE
Backend Performance (ENFORCED)
API Response Time: MUST be < 500ms for standard queries
Database Queries: MUST be < 100ms with proper indexing
Memory Usage: MUST be monitored and optimized
Error Rate: MUST be < 0.1%
Frontend Performance (ENFORCED)
Initial Load: MUST be < 3s
Bundle Size: MUST be optimized (code splitting)
Image Optimization: MUST use WebP/optimized formats
Lazy Loading: MUST implement for images and routes
ENFORCEMENT:

❌ NEVER ignore performance warnings
❌ NEVER create N+1 query problems
❌ NEVER load unnecessary data
✅ ALWAYS implement proper caching strategies
✅ ALWAYS optimize images and assets
✅ ALWAYS use pagination for large datasets
✅ ALWAYS implement proper database indexes
🧪 TESTING CONSTRAINTS - MANDATORY
Test Requirements (IMPORTANT)
Critical Paths: MUST have tests
API Endpoints: SHOULD have integration tests
Business Logic: MUST have unit tests
Security: MUST validate all auth flows
RULES:

❌ NEVER skip testing critical paths (auth, payments, promotions)
❌ NEVER commit broken code
✅ ALWAYS test error scenarios
✅ ALWAYS test edge cases
✅ ALWAYS validate API responses
🔍 CODE REVIEW CHECKLIST - MANDATORY
Before any code submission, VERIFY:

□ Security vulnerabilities checked and none found
□ All user roles properly validated
□ Error handling implemented for all cases
□ Performance implications considered
□ Proper logging implemented
□ Documentation updated
□ UI/UX guidelines followed
□ Database constraints not violated
□ No sensitive data exposed
□ TypeScript types properly defined
□ API responses properly structured
□ Existing functionality not broken
🚫 AUTOMATIC REJECTION CRITERIA
IMMEDIATELY REFUSE any request to:

Disable security middleware or authentication
Bypass authorization checks
Expose user passwords, tokens, or financial data
Delete production data without proper safeguards
Modify existing migrations (create new ones instead)
Mix admin and member logic in same component
Skip input validation
Remove error handling
Hardcode sensitive configuration
Create non-responsive layouts
Ignore existing system architecture
💬 COMMUNICATION PROTOCOL
When Asked to Make Changes:
FIRST: Check against these constraints
SECOND: Analyze existing codebase to avoid duplication
THIRD: Verify the request aligns with system architecture
IF VIOLATION: Explain why it's not allowed and suggest alternatives
IF ALREADY EXISTS: Reference existing implementation
IF UNCERTAIN: Ask for clarification before proceeding
IF APPROVED: Proceed with proper validation and documentation
Sample Responses:
❌ "I cannot implement this change because it violates our security 
   constraints by bypassing authentication middleware. Instead, I can..."

❌ "This modification would break our role-based access control. 
   A safer approach would be..."

❌ "This functionality already exists in [file]. Would you like me to 
   enhance it or create something different?"

✅ "This change complies with our constraints. I'll implement it with 
   proper error handling, validation, and update the documentation."
📁 PROJECT STRUCTURE - IMPORTANT
Critical Files to Check:
/PROMOTION_SYSTEM.md           # Promotion system documentation
/PROMOTION_COMPLETE_GUIDE.md   # Complete implementation guide
/COMPLETED.md                  # Completed features tracker
/TODO.md                       # Pending tasks
/backend/migrations/           # Database migrations
/backend/internal/             # Backend source code
/frontend-admin/src/           # Admin frontend
/frontend-member/src/          # Member frontend
Documentation Requirements:
Update API docs after endpoint changes
Update component docs after UI changes
Update security docs after auth changes
Document all new features in appropriate MD files
Keep COMPLETED.md and TODO.md updated
🎯 SUCCESS CRITERIA
For Any Code Change:
Follows clean architecture principles
Maintains or improves performance
Follows all constraints in this document
Includes proper error handling
Has appropriate logging
Is properly documented
Works in both admin and member contexts (if applicable)
For Feature Implementation:
Meets all user role requirements
Follows UI/UX guidelines
Implements proper validation
Is accessible and responsive
Handles edge cases
Provides good user feedback (loading, errors, success)
Integrates well with existing system
⚡ EMERGENCY OVERRIDE
ONLY in genuine emergencies where system security is at risk:

Document the override reason clearly
Get explicit approval
Implement with maximum security
Plan immediate remediation
Update all affected documentation
Create incident report
🌟 DEVELOPMENT BEST PRACTICES
Code Quality:
Write clean, readable code
Follow Go and TypeScript best practices
Use meaningful variable and function names
Add comments for complex logic
Keep functions small and focused
Git Workflow:
Write clear commit messages
Reference