# API Endpoint Analysis for Dynamic Content

## Executive Summary

This document analyzes the required API endpoints for the frontend redesign landing page. The analysis identifies existing APIs that can be leveraged and new APIs that need to be created to support dynamic content management via the admin panel.

## Current State Analysis

### Existing Database Schema

The system already has comprehensive tables for managing dynamic content:

#### 1. **Site Images System** (Migration 000010 & 000055)
- `image_categories` - Categories for organizing images
- `site_images` - All site images with metadata
- **Status**: ✅ Fully implemented with CRUD APIs

#### 2. **Promotion System** (Migration 000051)
- `promotions` - Promotion definitions
- `member_promotions` - User promotion claims
- `promotion_logs` - Audit trail
- **Status**: ✅ Fully implemented with comprehensive admin APIs

#### 3. **Site Content System** (Migration 000010)
- `promotion_banners` - Banner carousel management
- `game_categories` - Game category definitions
- `game_providers` - Game provider information
- `landing_sections` - Landing page section configuration
- `landing_section_items` - Items within landing sections
- `site_settings` - Key-value site configuration
- **Status**: ⚠️ Tables exist but APIs are incomplete

#### 4. **Games System** (Migration 000008)
- `games` - Game catalog with provider integration
- **Status**: ⚠️ Basic structure exists, needs enhancement

---

## Required API Endpoints

### 1. Banner Management APIs

**Purpose**: Manage promotional banners for the hero carousel section

#### Admin APIs (Backend)

```
POST   /api/v1/admin/banners                    - Create new banner
GET    /api/v1/admin/banners                    - List all banners (with filters)
GET    /api/v1/admin/banners/:id                - Get banner details
PUT    /api/v1/admin/banners/:id                - Update banner
DELETE /api/v1/admin/banners/:id                - Delete banner
PATCH  /api/v1/admin/banners/:id/toggle         - Toggle active status
POST   /api/v1/admin/banners/:id/reorder        - Update display order
```

**Request/Response Models**:
```typescript
interface CreateBannerRequest {
  title: string
  description?: string
  imageId: string              // References site_images.id
  linkUrl?: string             // Where to navigate on click
  displayLocation: 'home' | 'member' | 'both'
  sortOrder: number
  startDate?: Date
  endDate?: Date
  isActive: boolean
}

interface BannerResponse {
  id: string
  title: string
  description?: string
  imageId: string
  imageUrl: string             // Populated from site_images
  linkUrl?: string
  displayLocation: string
  sortOrder: number
  startDate?: Date
  endDate?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### Public APIs (Frontend)

```
GET    /api/v1/public/banners                   - Get active banners for display
GET    /api/v1/public/banners/home              - Get home page banners only
```

**Query Parameters**:
- `location` - Filter by display location
- `limit` - Number of results (default: 10)

**Database Schema Changes**: ✅ No changes needed - `promotion_banners` table exists

---

### 2. Site Settings APIs

**Purpose**: Manage site-wide configuration (contact info, colors, text content)

#### Admin APIs (Backend)

```
GET    /api/v1/admin/settings                   - Get all settings (grouped)
GET    /api/v1/admin/settings/:key              - Get specific setting
PUT    /api/v1/admin/settings/:key              - Update setting value
PUT    /api/v1/admin/settings/bulk              - Bulk update settings
POST   /api/v1/admin/settings                   - Create new setting
DELETE /api/v1/admin/settings/:key              - Delete setting (non-system only)
```

**Request/Response Models**:
```typescript
interface SiteSetting {
  id: string
  settingKey: string
  settingValue: string
  settingType: 'text' | 'number' | 'boolean' | 'json' | 'image'
  description?: string
  groupName: 'general' | 'theme' | 'seo' | 'contact' | 'social'
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

interface UpdateSettingRequest {
  settingValue: string
}

interface BulkUpdateRequest {
  settings: Array<{
    settingKey: string
    settingValue: string
  }>
}

interface SettingsGroupResponse {
  [groupName: string]: SiteSetting[]
}
```

#### Public APIs (Frontend)

```
GET    /api/v1/public/settings                  - Get public settings
GET    /api/v1/public/settings/group/:group     - Get settings by group
```

**Common Settings**:
- `site_name` - Site name
- `site_description` - Site description
- `line_contact` - LINE contact ID
- `facebook_url` - Facebook page URL
- `telegram_url` - Telegram contact
- `primary_color` - Theme primary color
- `secondary_color` - Theme secondary color
- `enable_registration` - Enable/disable registration
- `maintenance_mode` - Maintenance mode flag

**Database Schema Changes**: ✅ No changes needed - `site_settings` table exists

---

### 3. Game Category APIs

**Purpose**: Manage game categories displayed on landing page

#### Admin APIs (Backend)

```
POST   /api/v1/admin/game-categories            - Create category
GET    /api/v1/admin/game-categories            - List all categories
GET    /api/v1/admin/game-categories/:id        - Get category details
PUT    /api/v1/admin/game-categories/:id        - Update category
DELETE /api/v1/admin/game-categories/:id        - Delete category
PATCH  /api/v1/admin/game-categories/:id/toggle - Toggle active status
POST   /api/v1/admin/game-categories/reorder    - Reorder categories
```

**Request/Response Models**:
```typescript
interface CreateGameCategoryRequest {
  code: string                 // Unique identifier (e.g., 'slot', 'sport')
  name: string
  description?: string
  iconImageId?: string         // References site_images.id
  buttonImageId?: string       // References site_images.id
  sortOrder: number
  isActive: boolean
}

interface GameCategoryResponse {
  id: string
  code: string
  name: string
  description?: string
  iconImageId?: string
  iconImageUrl?: string        // Populated from site_images
  buttonImageId?: string
  buttonImageUrl?: string      // Populated from site_images
  sortOrder: number
  isActive: boolean
  gameCount?: number           // Count of games in this category
  createdAt: Date
  updatedAt: Date
}
```

#### Public APIs (Frontend)

```
GET    /api/v1/public/game-categories           - Get active categories
GET    /api/v1/public/game-categories/:code     - Get category by code
```

**Database Schema Changes**: ✅ No changes needed - `game_categories` table exists

---

### 4. Game Provider APIs

**Purpose**: Manage game providers displayed on landing page

#### Admin APIs (Backend)

```
POST   /api/v1/admin/game-providers             - Create provider
GET    /api/v1/admin/game-providers             - List all providers
GET    /api/v1/admin/game-providers/:id         - Get provider details
PUT    /api/v1/admin/game-providers/:id         - Update provider
DELETE /api/v1/admin/game-providers/:id         - Delete provider
PATCH  /api/v1/admin/game-providers/:id/toggle  - Toggle active status
PATCH  /api/v1/admin/game-providers/:id/feature - Toggle featured status
POST   /api/v1/admin/game-providers/reorder     - Reorder providers
```

**Request/Response Models**:
```typescript
interface CreateGameProviderRequest {
  code: string                 // Unique identifier (e.g., 'pgsoft', 'pragmatic')
  name: string
  description?: string
  logoImageId?: string         // References site_images.id
  thumbnailImageId?: string    // References site_images.id
  categoryId?: string          // References game_categories.id
  sortOrder: number
  isActive: boolean
  isFeatured: boolean          // Show on landing page
}

interface GameProviderResponse {
  id: string
  code: string
  name: string
  description?: string
  logoImageId?: string
  logoImageUrl?: string        // Populated from site_images
  thumbnailImageId?: string
  thumbnailImageUrl?: string   // Populated from site_images
  categoryId?: string
  categoryName?: string
  sortOrder: number
  isActive: boolean
  isFeatured: boolean
  gameCount?: number           // Count of games from this provider
  createdAt: Date
  updatedAt: Date
}
```

#### Public APIs (Frontend)

```
GET    /api/v1/public/game-providers            - Get active providers
GET    /api/v1/public/game-providers/featured   - Get featured providers only
GET    /api/v1/public/game-providers/:code      - Get provider by code
```

**Query Parameters**:
- `featured` - Filter featured providers (true/false)
- `categoryId` - Filter by category
- `limit` - Number of results

**Database Schema Changes**: ✅ No changes needed - `game_providers` table exists

---

### 5. FAQ Management APIs

**Purpose**: Manage FAQ content for landing page

#### Admin APIs (Backend)

```
POST   /api/v1/admin/faqs                       - Create FAQ
GET    /api/v1/admin/faqs                       - List all FAQs
GET    /api/v1/admin/faqs/:id                   - Get FAQ details
PUT    /api/v1/admin/faqs/:id                   - Update FAQ
DELETE /api/v1/admin/faqs/:id                   - Delete FAQ
PATCH  /api/v1/admin/faqs/:id/toggle            - Toggle active status
POST   /api/v1/admin/faqs/reorder               - Reorder FAQs
```

**Request/Response Models**:
```typescript
interface CreateFAQRequest {
  question: string
  answer: string
  category?: string            // e.g., 'general', 'deposit', 'withdrawal', 'games'
  sortOrder: number
  isActive: boolean
}

interface FAQResponse {
  id: string
  question: string
  answer: string
  category?: string
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### Public APIs (Frontend)

```
GET    /api/v1/public/faqs                      - Get active FAQs
GET    /api/v1/public/faqs/search               - Search FAQs
```

**Query Parameters**:
- `category` - Filter by category
- `search` - Search in questions and answers
- `limit` - Number of results

**Database Schema Changes**: ⚠️ **New table required**

```sql
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_active ON faqs(is_active);
CREATE INDEX idx_faqs_sort_order ON faqs(sort_order);
```

---

### 6. Landing Section APIs

**Purpose**: Manage dynamic landing page sections and their content

#### Admin APIs (Backend)

```
POST   /api/v1/admin/landing-sections           - Create section
GET    /api/v1/admin/landing-sections           - List all sections
GET    /api/v1/admin/landing-sections/:id       - Get section details
PUT    /api/v1/admin/landing-sections/:id       - Update section
DELETE /api/v1/admin/landing-sections/:id       - Delete section
PATCH  /api/v1/admin/landing-sections/:id/toggle - Toggle active status
POST   /api/v1/admin/landing-sections/reorder   - Reorder sections

POST   /api/v1/admin/landing-sections/:id/items - Add item to section
GET    /api/v1/admin/landing-sections/:id/items - Get section items
PUT    /api/v1/admin/landing-sections/:id/items/:itemId - Update item
DELETE /api/v1/admin/landing-sections/:id/items/:itemId - Delete item
```

**Request/Response Models**:
```typescript
interface CreateLandingSectionRequest {
  code: string                 // Unique identifier
  title?: string
  subtitle?: string
  sectionType: 'hero' | 'grid' | 'carousel' | 'custom'
  backgroundImageId?: string   // References site_images.id
  sortOrder: number
  isActive: boolean
  settings?: Record<string, any> // JSON settings
}

interface LandingSectionResponse {
  id: string
  code: string
  title?: string
  subtitle?: string
  sectionType: string
  backgroundImageId?: string
  backgroundImageUrl?: string
  sortOrder: number
  isActive: boolean
  settings?: Record<string, any>
  items?: LandingSectionItem[]
  createdAt: Date
  updatedAt: Date
}

interface LandingSectionItem {
  id: string
  sectionId: string
  title?: string
  description?: string
  imageId?: string
  imageUrl?: string
  linkUrl?: string
  buttonText?: string
  sortOrder: number
  isActive: boolean
  settings?: Record<string, any>
}
```

#### Public APIs (Frontend)

```
GET    /api/v1/public/landing-sections          - Get active sections with items
GET    /api/v1/public/landing-sections/:code    - Get section by code
```

**Database Schema Changes**: ✅ No changes needed - `landing_sections` and `landing_section_items` tables exist

---

## Implementation Priority

### Phase 1: Essential APIs (Week 1)
1. ✅ **Site Images APIs** - Already implemented
2. ✅ **Promotions APIs** - Already implemented
3. **Banners APIs** - High priority for hero carousel
4. **Site Settings APIs** - High priority for site configuration
5. **Game Categories APIs** - High priority for category grid

### Phase 2: Enhanced Content (Week 2)
6. **Game Providers APIs** - For provider showcase section
7. **FAQ APIs** - For FAQ section (requires new table)
8. **Landing Sections APIs** - For flexible content management

### Phase 3: Optimization (Week 3)
- Add caching layer for public APIs
- Implement CDN integration for images
- Add analytics tracking
- Performance optimization

---

## Database Schema Changes Summary

### Required New Tables

#### 1. FAQs Table
```sql
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_active ON faqs(is_active);
CREATE INDEX idx_faqs_sort_order ON faqs(sort_order);

CREATE TRIGGER update_faqs_updated_at 
    BEFORE UPDATE ON faqs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### Recommended Schema Enhancements

#### 1. Add View Count to Banners
```sql
ALTER TABLE promotion_banners 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

CREATE INDEX idx_promotion_banners_view_count ON promotion_banners(view_count);
CREATE INDEX idx_promotion_banners_click_count ON promotion_banners(click_count);
```

#### 2. Add Metadata to Game Providers
```sql
ALTER TABLE game_providers 
ADD COLUMN IF NOT EXISTS website_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS api_endpoint VARCHAR(500),
ADD COLUMN IF NOT EXISTS api_key_encrypted TEXT;
```

---

## API Integration with Existing Systems

### Authentication & Authorization

All admin APIs require:
- JWT authentication via `Authorization: Bearer <token>` header
- Admin role verification
- Activity logging via `admin_activity_logs` table

Public APIs:
- No authentication required
- Rate limiting: 100 requests per minute per IP
- Caching: 5 minutes for most endpoints

### Error Handling

Standard error response format:
```typescript
interface ErrorResponse {
  success: false
  message: string
  error?: string
  code?: string
}
```

Common error codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate code/key)
- `500` - Internal Server Error

### Response Format

Standard success response format:
```typescript
interface SuccessResponse<T> {
  success: true
  message?: string
  data: T
  meta?: {
    total?: number
    limit?: number
    offset?: number
  }
}
```

---

## Frontend Integration Points

### 1. Landing Page Components

**Hero Section**:
- API: `GET /api/v1/public/banners/home`
- Refresh: On page load
- Caching: 5 minutes

**Game Categories Grid**:
- API: `GET /api/v1/public/game-categories`
- Refresh: On page load
- Caching: 10 minutes

**Game Providers Section**:
- API: `GET /api/v1/public/game-providers/featured`
- Refresh: On page load
- Caching: 10 minutes

**Promotions Grid**:
- API: `GET /api/v1/admin/promotions` (filtered by active)
- Refresh: On page load
- Caching: 5 minutes

**FAQ Section**:
- API: `GET /api/v1/public/faqs`
- Refresh: On page load
- Caching: 30 minutes

**Site Settings**:
- API: `GET /api/v1/public/settings`
- Refresh: On app initialization
- Caching: 1 hour

### 2. Admin Panel Components

Each admin component will have:
- List view with search, filter, pagination
- Create/Edit modal with form validation
- Delete confirmation dialog
- Bulk actions (activate/deactivate, reorder)
- Image upload integration with site images system

---

## Performance Considerations

### Caching Strategy

1. **Redis Cache**:
   - Public API responses cached for 5-30 minutes
   - Cache invalidation on admin updates
   - Key pattern: `api:public:{endpoint}:{params}`

2. **CDN Integration**:
   - All images served via CDN
   - Automatic WebP conversion
   - Responsive image variants

3. **Database Optimization**:
   - Indexes on frequently queried columns
   - Materialized views for complex queries
   - Connection pooling

### API Rate Limiting

- Public APIs: 100 requests/minute per IP
- Admin APIs: 1000 requests/minute per user
- Image upload: 10 uploads/minute per user

---

## Security Considerations

1. **Input Validation**:
   - All inputs sanitized and validated
   - SQL injection prevention via parameterized queries
   - XSS prevention via output encoding

2. **File Upload Security**:
   - File type validation (whitelist)
   - File size limits (10MB max)
   - Virus scanning for uploaded files
   - Secure file storage with random filenames

3. **Access Control**:
   - Role-based access control (RBAC)
   - Admin activity logging
   - IP whitelisting for admin panel (optional)

4. **Data Protection**:
   - Sensitive settings encrypted at rest
   - HTTPS required for all API calls
   - CORS configuration for frontend domains

---

## Testing Requirements

### Unit Tests
- Repository layer tests
- Use case layer tests
- Handler layer tests

### Integration Tests
- API endpoint tests
- Database transaction tests
- File upload tests

### Performance Tests
- Load testing for public APIs
- Stress testing for image uploads
- Cache effectiveness testing

---

## Documentation Requirements

1. **API Documentation**:
   - OpenAPI/Swagger specification
   - Request/response examples
   - Error code reference

2. **Admin Guide**:
   - How to manage banners
   - How to configure site settings
   - How to organize game categories

3. **Developer Guide**:
   - API integration examples
   - Caching strategy
   - Error handling patterns

---

## Conclusion

The analysis reveals that most required infrastructure already exists in the database schema. The main implementation work involves:

1. **Creating API handlers and use cases** for existing tables:
   - Banners (promotion_banners)
   - Site Settings (site_settings)
   - Game Categories (game_categories)
   - Game Providers (game_providers)
   - Landing Sections (landing_sections)

2. **Creating new FAQ system**:
   - New database table
   - Complete CRUD APIs
   - Admin interface

3. **Enhancing existing APIs**:
   - Add public endpoints for frontend consumption
   - Implement caching layer
   - Add analytics tracking

The existing site images and promotions systems are already fully functional and can be used immediately. This significantly reduces the implementation effort required for the frontend redesign.
