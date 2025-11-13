# Design Document: Admin Promotion Management System

## Overview

The Admin Promotion Management System provides a comprehensive interface for administrators to create, configure, and manage promotional offers. The system builds upon the existing promotion infrastructure (entity, repository, database schema) and adds a complete admin UI with full CRUD operations, validation, and statistics tracking.

The design follows the existing architecture pattern used in the site images management system, utilizing:
- Clean Architecture with separation of concerns (Handler → UseCase → Repository)
- Fiber framework for HTTP handling
- PostgreSQL for data persistence
- React with TypeScript for the frontend
- Existing promotion entity and repository interfaces

## Architecture

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     HTTP Layer (Fiber)                       │
│  AdminPromotionHandler - Routes & Request/Response handling  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Use Case Layer                            │
│  AdminPromotionUseCase - Business logic & validation         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Repository Layer                            │
│  PromotionRepository - Data access & persistence             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Database (PostgreSQL)                     │
│  promotions, member_promotions, promotion_stats view         │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              PromotionManagement Component                   │
│  - List view with cards/table                                │
│  - Create/Edit modal form                                    │
│  - Statistics display                                        │
│  - Search and filter controls                                │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    API Layer                                 │
│  promotionAPI - HTTP client for backend communication        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                Backend REST API                              │
│  /api/v1/admin/promotions/*                                  │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Backend Components

#### 1. AdminPromotionHandler

**Location:** `backend/internal/presentation/http/handler/admin_promotion_handler.go`

**Responsibilities:**
- Handle HTTP requests and responses
- Parse and validate request parameters
- Call use case methods
- Format responses with consistent structure

**Methods:**
```go
type AdminPromotionHandler struct {
    promotionUC adminUC.PromotionUseCase
}

// GET /api/v1/admin/promotions
func (h *AdminPromotionHandler) GetPromotions(c *fiber.Ctx) error

// GET /api/v1/admin/promotions/:id
func (h *AdminPromotionHandler) GetPromotionByID(c *fiber.Ctx) error

// POST /api/v1/admin/promotions
func (h *AdminPromotionHandler) CreatePromotion(c *fiber.Ctx) error

// PUT /api/v1/admin/promotions/:id
func (h *AdminPromotionHandler) UpdatePromotion(c *fiber.Ctx) error

// DELETE /api/v1/admin/promotions/:id
func (h *AdminPromotionHandler) DeletePromotion(c *fiber.Ctx) error

// PATCH /api/v1/admin/promotions/:id/status
func (h *AdminPromotionHandler) TogglePromotionStatus(c *fiber.Ctx) error

// GET /api/v1/admin/promotions/:id/stats
func (h *AdminPromotionHandler) GetPromotionStats(c *fiber.Ctx) error

// GET /api/v1/admin/promotions/stats
func (h *AdminPromotionHandler) GetAllPromotionStats(c *fiber.Ctx) error
```

#### 2. PromotionUseCase

**Location:** `backend/internal/usecase/admin/promotion_usecase.go`

**Responsibilities:**
- Implement business logic
- Validate promotion data
- Calculate bonus amounts
- Check eligibility rules
- Manage promotion lifecycle
- Generate statistics

**Interface:**
```go
type PromotionUseCase interface {
    // CRUD operations
    GetPromotions(ctx context.Context, filters PromotionFilters) ([]entity.Promotion, int64, error)
    GetPromotionByID(ctx context.Context, id uuid.UUID) (*entity.Promotion, error)
    CreatePromotion(ctx context.Context, req CreatePromotionRequest) (*entity.Promotion, error)
    UpdatePromotion(ctx context.Context, id uuid.UUID, req UpdatePromotionRequest) (*entity.Promotion, error)
    DeletePromotion(ctx context.Context, id uuid.UUID) error
    
    // Status management
    ToggleStatus(ctx context.Context, id uuid.UUID) (*entity.Promotion, error)
    
    // Statistics
    GetPromotionStats(ctx context.Context, id uuid.UUID) (*PromotionStats, error)
    GetAllPromotionStats(ctx context.Context) ([]PromotionStats, error)
}

type PromotionFilters struct {
    Type       *entity.PromotionType
    Status     *entity.PromotionStatus
    IsActive   *bool
    SearchTerm string
    Limit      int
    Offset     int
}

type CreatePromotionRequest struct {
    Code                string
    Name                string
    Description         *string
    Type                entity.PromotionType
    BonusType           entity.BonusType
    BonusValue          float64
    MaxBonus            *float64
    MinDeposit          *float64
    TurnoverRequirement float64
    MaxWithdraw         *float64
    ApplicableGames     *string
    ValidFrom           time.Time
    ValidUntil          time.Time
    MaxUses             *int
    MaxUsesPerMember    int
    DisplayOrder        int
    ImageURL            *string
    TermsAndConditions  *string
    AutoApply           bool
}

type UpdatePromotionRequest struct {
    Name                *string
    Description         *string
    BonusType           *entity.BonusType
    BonusValue          *float64
    MaxBonus            *float64
    MinDeposit          *float64
    TurnoverRequirement *float64
    MaxWithdraw         *float64
    ApplicableGames     *string
    ValidFrom           *time.Time
    ValidUntil          *time.Time
    MaxUses             *int
    MaxUsesPerMember    *int
    DisplayOrder        *int
    ImageURL            *string
    TermsAndConditions  *string
    AutoApply           *bool
}

type PromotionStats struct {
    PromotionID      uuid.UUID
    PromotionName    string
    PromotionCode    string
    TotalClaims      int
    ActiveClaims     int
    CompletedClaims  int
    CancelledClaims  int
    TotalDeposit     float64
    TotalBonus       float64
    TotalTurnover    float64
}
```

#### 3. PromotionRepository (Existing - Extensions Needed)

**Location:** `backend/internal/domain/repository/promotion_repository.go`

**Additional Methods Needed:**
```go
// Add to existing PromotionRepository interface
FindByCode(ctx context.Context, code string) (*entity.Promotion, error)
FindByFilters(ctx context.Context, filters PromotionFilters) ([]*entity.Promotion, int64, error)
```

### Frontend Components

#### 1. PromotionManagement Component

**Location:** `frontend-admin/src/pages/admin/PromotionManagement.tsx`

**State Management:**
```typescript
interface PromotionManagementState {
  promotions: Promotion[]
  loading: boolean
  showModal: boolean
  editingPromotion: Promotion | null
  formData: Partial<PromotionFormData>
  filters: PromotionFilters
  stats: PromotionStats[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

interface PromotionFormData {
  code: string
  name: string
  description: string
  type: PromotionType
  bonusType: BonusType
  bonusValue: number
  maxBonus: number
  minDeposit: number
  turnoverRequirement: number
  maxWithdraw: number
  applicableGames: string
  validFrom: string
  validUntil: string
  maxUses: number
  maxUsesPerMember: number
  displayOrder: number
  imageUrl: string
  termsAndConditions: string
  autoApply: boolean
  isActive: boolean
}

interface PromotionFilters {
  type?: PromotionType
  status?: PromotionStatus
  isActive?: boolean
  searchTerm?: string
}
```

**Component Structure:**
```
PromotionManagement
├── Header (Title, Stats Summary, Create Button)
├── Filters (Search, Type Filter, Status Filter)
├── PromotionList
│   └── PromotionCard[] (Image, Info, Stats, Actions)
├── PromotionModal (Create/Edit Form)
│   ├── BasicInfoSection
│   ├── BonusConfigSection
│   ├── ConditionsSection
│   ├── DisplaySettingsSection
│   └── FormActions
└── StatsModal (Detailed Statistics)
```

#### 2. API Client

**Location:** `frontend-admin/src/api/promotionAPI.ts`

```typescript
export const promotionAPI = {
  admin: {
    getPromotions: (filters?: PromotionFilters) => 
      axios.get('/api/v1/admin/promotions', { params: filters }),
    
    getPromotionById: (id: string) => 
      axios.get(`/api/v1/admin/promotions/${id}`),
    
    createPromotion: (data: PromotionFormData) => 
      axios.post('/api/v1/admin/promotions', data),
    
    updatePromotion: (id: string, data: Partial<PromotionFormData>) => 
      axios.put(`/api/v1/admin/promotions/${id}`, data),
    
    deletePromotion: (id: string) => 
      axios.delete(`/api/v1/admin/promotions/${id}`),
    
    toggleStatus: (id: string) => 
      axios.patch(`/api/v1/admin/promotions/${id}/status`),
    
    getPromotionStats: (id: string) => 
      axios.get(`/api/v1/admin/promotions/${id}/stats`),
    
    getAllStats: () => 
      axios.get('/api/v1/admin/promotions/stats'),
  }
}
```

## Data Models

### Promotion Entity (Existing)

Already defined in `backend/internal/domain/entity/promotion.go` with all required fields.

### Database Schema (Existing)

The `promotions` table already exists with the following structure:
- id (UUID, PK)
- code (VARCHAR, UNIQUE)
- name (VARCHAR)
- description (TEXT)
- type (VARCHAR)
- bonus_type (VARCHAR)
- bonus_value (DECIMAL)
- max_bonus (DECIMAL)
- min_deposit (DECIMAL)
- turnover_requirement (DECIMAL)
- max_withdraw (DECIMAL)
- applicable_games (TEXT)
- status (VARCHAR)
- valid_from (TIMESTAMP)
- valid_until (TIMESTAMP)
- max_uses (INTEGER)
- max_uses_per_member (INTEGER)
- current_uses (INTEGER)
- display_order (INTEGER)
- image_url (TEXT)
- terms_and_conditions (TEXT)
- auto_apply (BOOLEAN)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Statistics View (Existing)

The `promotion_stats` view already exists and provides:
- total_claims
- active_claims
- completed_claims
- cancelled_claims
- total_deposit
- total_bonus
- total_turnover

## Error Handling

### Backend Error Responses

```go
type ErrorResponse struct {
    Status  string `json:"status"`  // "error"
    Message string `json:"message"` // User-friendly message
    Error   string `json:"error"`   // Technical error (optional)
}
```

### Common Error Scenarios

1. **Validation Errors (400)**
   - Missing required fields
   - Invalid data types
   - Out of range values
   - Invalid date ranges

2. **Duplicate Code (409)**
   - Promotion code already exists

3. **Not Found (404)**
   - Promotion ID doesn't exist

4. **Active Claims Warning (409)**
   - Attempting to delete promotion with active claims
   - Attempting to modify critical fields with active claims

5. **Database Errors (500)**
   - Connection failures
   - Query execution errors

### Frontend Error Handling

```typescript
try {
  await promotionAPI.admin.createPromotion(formData)
  toast.success('สร้างโปรโมชั่นสำเร็จ')
} catch (error: any) {
  if (error.response?.status === 409) {
    toast.error('รหัสโปรโมชั่นนี้มีอยู่แล้ว')
  } else if (error.response?.status === 400) {
    toast.error(error.response.data.message || 'ข้อมูลไม่ถูกต้อง')
  } else {
    toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
  }
}
```

## Testing Strategy

### Backend Testing

1. **Unit Tests**
   - UseCase validation logic
   - Bonus calculation methods
   - Eligibility checking
   - Date range validation

2. **Integration Tests**
   - Handler → UseCase → Repository flow
   - Database operations
   - Transaction handling

3. **Test Cases**
   - Create promotion with valid data
   - Create promotion with duplicate code (should fail)
   - Update promotion fields
   - Toggle promotion status
   - Delete promotion without claims
   - Delete promotion with active claims (should warn/fail)
   - Calculate percentage bonus
   - Calculate fixed bonus
   - Apply max bonus limit
   - Check eligibility with various conditions

### Frontend Testing

1. **Component Tests**
   - Form validation
   - Modal open/close
   - Filter functionality
   - Search functionality

2. **Integration Tests**
   - API calls
   - State management
   - Error handling
   - Success notifications

3. **E2E Tests**
   - Complete create flow
   - Complete edit flow
   - Delete flow with confirmation
   - Status toggle
   - Statistics viewing

## UI/UX Design

### Design Theme

Use a modern admin dashboard theme with:
- Clean, professional layout
- Card-based design for promotion list
- Modal forms for create/edit
- Color-coded status indicators
- Responsive grid layout
- Clear typography hierarchy

### Color Scheme

```css
/* Status Colors */
--status-active: #10b981 (green)
--status-inactive: #6b7280 (gray)
--status-expired: #ef4444 (red)

/* Promotion Type Colors */
--type-deposit: #3b82f6 (blue)
--type-cashback: #8b5cf6 (purple)
--type-freecredit: #f59e0b (amber)
--type-referral: #ec4899 (pink)

/* Action Colors */
--action-edit: #3b82f6 (blue)
--action-delete: #ef4444 (red)
--action-view: #6b7280 (gray)
```

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Header: จัดการโปรโมชั่น                    [+ สร้างโปรโมชั่น] │
│ Stats: 15 โปรโมชั่น | 8 ใช้งาน | 1,234 ครั้ง | ฿123,456     │
├─────────────────────────────────────────────────────────────┤
│ [🔍 ค้นหา...] [ประเภท ▼] [สถานะ ▼]                         │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                         │
│ │ [Image] │ │ [Image] │ │ [Image] │                         │
│ │ Title   │ │ Title   │ │ Title   │                         │
│ │ 100%    │ │ ฿500    │ │ 50%     │                         │
│ │ 3x Turn │ │ 5x Turn │ │ 10x Turn│                         │
│ │ Stats   │ │ Stats   │ │ Stats   │                         │
│ │ [Actions]│ │ [Actions]│ │ [Actions]│                       │
│ └─────────┘ └─────────┘ └─────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Form Layout

```
┌─────────────────────────────────────────────────────────────┐
│ สร้าง/แก้ไขโปรโมชั่น                                    [✕]  │
├─────────────────────────────────────────────────────────────┤
│ ข้อมูลพื้นฐาน                                                │
│ ├─ รหัสโปรโมชั่น *                                          │
│ ├─ ชื่อโปรโมชั่น *                                          │
│ ├─ คำอธิบาย                                                 │
│ └─ ประเภท *                                                 │
│                                                              │
│ การคำนวณโบนัส                                                │
│ ├─ ประเภทโบนัส * (เปอร์เซ็นต์ / จำนวนคงที่)                │
│ ├─ มูลค่าโบนัส *                                            │
│ ├─ โบนัสสูงสุด                                              │
│ └─ เทิร์นโอเวอร์ * (เท่า)                                   │
│                                                              │
│ เงื่อนไข                                                     │
│ ├─ ฝากขั้นต่ำ                                               │
│ ├─ ถอนสูงสุด                                                │
│ ├─ เกมที่ใช้ได้                                             │
│ ├─ จำนวนครั้งต่อคน *                                        │
│ ├─ จำนวนครั้งทั้งหมด                                        │
│ ├─ วันเริ่มต้น *                                            │
│ └─ วันสิ้นสุด *                                             │
│                                                              │
│ การแสดงผล                                                    │
│ ├─ รูปภาพ                                                   │
│ ├─ ลำดับการแสดง                                             │
│ ├─ เงื่อนไขและข้อกำหนด                                      │
│ ├─ ☐ เปิดใช้งาน                                            │
│ └─ ☐ ใช้อัตโนมัติ                                          │
│                                                              │
│ [บันทึก] [ยกเลิก]                                           │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### Promotion Management

```
GET    /api/v1/admin/promotions
       Query params: type, status, isActive, search, limit, offset
       Response: { status, message, data: { promotions, total } }

GET    /api/v1/admin/promotions/:id
       Response: { status, message, data: promotion }

POST   /api/v1/admin/promotions
       Body: CreatePromotionRequest
       Response: { status, message, data: promotion }

PUT    /api/v1/admin/promotions/:id
       Body: UpdatePromotionRequest
       Response: { status, message, data: promotion }

DELETE /api/v1/admin/promotions/:id
       Response: { status, message }

PATCH  /api/v1/admin/promotions/:id/status
       Response: { status, message, data: promotion }

GET    /api/v1/admin/promotions/:id/stats
       Response: { status, message, data: stats }

GET    /api/v1/admin/promotions/stats
       Response: { status, message, data: stats[] }
```

## Security Considerations

1. **Authentication**
   - All endpoints require admin authentication
   - JWT token validation via middleware

2. **Authorization**
   - Only admin role can access these endpoints
   - Role-based access control (RBAC)

3. **Input Validation**
   - Sanitize all user inputs
   - Validate data types and ranges
   - Prevent SQL injection via parameterized queries

4. **Rate Limiting**
   - Apply rate limits to prevent abuse
   - Especially for create/update operations

5. **Audit Logging**
   - Log all promotion modifications
   - Track who created/updated/deleted promotions
   - Store admin_id with changes

## Performance Considerations

1. **Database Optimization**
   - Use existing indexes on promotions table
   - Leverage promotion_stats view for statistics
   - Implement pagination for large lists

2. **Caching**
   - Cache active promotions list
   - Invalidate cache on updates
   - Use Redis for caching (if available)

3. **Query Optimization**
   - Use selective field loading
   - Avoid N+1 queries
   - Use JOIN for related data

4. **Frontend Optimization**
   - Implement virtual scrolling for large lists
   - Lazy load images
   - Debounce search input
   - Use React.memo for expensive components

## Migration and Deployment

### Database Migrations

No new migrations needed - all tables and views already exist.

### Deployment Steps

1. Deploy backend changes
   - Add new handler file
   - Add new use case file
   - Update repository implementation (if needed)
   - Register routes

2. Deploy frontend changes
   - Add new component
   - Add API client
   - Update routing

3. Testing
   - Run integration tests
   - Verify all CRUD operations
   - Test error scenarios
   - Verify statistics accuracy

4. Monitoring
   - Monitor API response times
   - Track error rates
   - Monitor database query performance
