# Site Images Management - การวิเคราะห์และแผนการทำงาน

## 📊 สถานะปัจจุบัน

### ✅ สิ่งที่มีอยู่แล้ว
1. **Database Schema** - มีตารางครบถ้วน
   - `image_categories` - หมวดหมู่รูปภาพ
   - `site_images` - รูปภาพทั้งหมด
   - `promotion_banners` - แบนเนอร์โปรโมชั่น
   - `game_categories` - หมวดหมู่เกม
   - `game_providers` - ค่ายเกม
   - `site_settings` - การตั้งค่าเว็บไซต์

2. **Frontend UI** - มี UI สมบูรณ์
   - หน้าจัดการรูปภาพ (SiteImagesManagement.tsx)
   - ระบบ Upload รูปภาพ
   - ระบบแก้ไข/ลบรูปภาพ
   - ระบบค้นหาและกรองตามหมวดหมู่
   - Modal สำหรับ Upload และ Edit

3. **API Client** - มี API functions ครบ
   - getSiteImages()
   - uploadImage()
   - updateImage()
   - deleteImage()

### ❌ สิ่งที่ยังไม่มี (Backend)
1. **Handler** - ไม่มี site_content_handler.go
2. **UseCase** - ไม่มี site_content_usecase.go
3. **Repository** - ไม่มี site_image_repository.go
4. **Domain Model** - ไม่มี site_image.go
5. **Routes** - ไม่มี route สำหรับ /admin/site-images

## 🎯 แผนการทำงาน

### Phase 1: สร้าง Domain Layer
**ไฟล์:** `backend/internal/domain/entity/site_image.go`

```go
type SiteImage struct {
    ID          string
    CategoryID  *string
    Code        string
    Title       string
    Description *string
    FilePath    string
    FileURL     string
    FileSize    *int
    Width       *int
    Height      *int
    MimeType    string
    AltText     *string
    SortOrder   int
    IsActive    bool
    CreatedAt   time.Time
    UpdatedAt   time.Time
    CreatedBy   *string
    UpdatedBy   *string
}

type ImageCategory struct {
    ID          string
    Code        string
    Name        string
    Description *string
    SortOrder   int
    IsActive    bool
    CreatedAt   time.Time
    UpdatedAt   time.Time
}
```

### Phase 2: สร้าง Repository Layer
**ไฟล์:** `backend/internal/domain/repository/site_image_repository.go`

**Methods:**
- `FindAll(ctx, categoryID, isActive) ([]*SiteImage, error)`
- `FindByID(ctx, id) (*SiteImage, error)`
- `FindByCode(ctx, code) (*SiteImage, error)`
- `Create(ctx, image) error`
- `Update(ctx, image) error`
- `Delete(ctx, id) error`
- `GetCategories(ctx) ([]*ImageCategory, error)`

**Implementation:** `backend/internal/infrastructure/persistence/postgres/site_image_repository_impl.go`

### Phase 3: สร้าง UseCase Layer
**ไฟล์:** `backend/internal/usecase/admin/site_content_usecase.go`

**Methods:**
- `GetSiteImages(ctx, categoryID, isActive) ([]*SiteImage, error)`
- `GetSiteImageByID(ctx, id) (*SiteImage, error)`
- `UploadImage(ctx, file, metadata) (*SiteImage, error)`
- `UpdateImage(ctx, id, data) (*SiteImage, error)`
- `DeleteImage(ctx, id) error`
- `GetImageCategories(ctx) ([]*ImageCategory, error)`

**Features:**
- รองรับการ upload รูปภาพ (JPEG, PNG, WebP, GIF)
- Resize รูปภาพอัตโนมัติ (optional)
- สร้าง thumbnail
- เก็บไฟล์ใน `/uploads/site-images/`
- Generate unique filename
- Validate file size (max 10MB)

### Phase 4: สร้าง Handler Layer
**ไฟล์:** `backend/internal/presentation/http/handler/admin_site_content_handler.go`

**Endpoints:**
```
GET    /api/v1/admin/site-images              - List all images
GET    /api/v1/admin/site-images/:id          - Get image by ID
POST   /api/v1/admin/site-images/upload       - Upload new image
PUT    /api/v1/admin/site-images/:id          - Update image metadata
DELETE /api/v1/admin/site-images/:id          - Delete image
GET    /api/v1/admin/site-images/categories   - Get categories
```

### Phase 5: เพิ่ม Routes
**ไฟล์:** `backend/internal/presentation/http/route/routes.go`

```go
// Site Content Management
siteContent := protected.Group("/site-images")
siteContent.Get("/", routes.SiteContentHandler.GetSiteImages)
siteContent.Get("/categories", routes.SiteContentHandler.GetImageCategories)
siteContent.Get("/:id", routes.SiteContentHandler.GetSiteImageByID)
siteContent.Post("/upload", routes.SiteContentHandler.UploadImage)
siteContent.Put("/:id", routes.SiteContentHandler.UpdateImage)
siteContent.Delete("/:id", routes.SiteContentHandler.DeleteImage)
```

### Phase 6: เพิ่มฟีเจอร์เสริม
1. **Image Optimization**
   - ใช้ library สำหรับ resize/compress รูปภาพ
   - สร้าง thumbnail อัตโนมัติ
   - Convert เป็น WebP

2. **CDN Integration** (Optional)
   - Upload ไป S3/CloudFlare R2
   - Generate CDN URL

3. **Bulk Operations**
   - Upload หลายรูปพร้อมกัน
   - Delete หลายรูปพร้อมกัน

## 📝 ลำดับการทำงาน

1. ✅ สร้าง Domain Entity (site_image.go)
2. ✅ สร้าง Repository Interface
3. ✅ Implement Repository (PostgreSQL)
4. ✅ สร้าง UseCase
5. ✅ สร้าง Handler
6. ✅ เพิ่ม Routes
7. ✅ ทดสอบ API
8. ✅ ทดสอบ Frontend Integration

## 🔧 Libraries ที่ต้องใช้

```bash
# Image processing
go get github.com/disintegration/imaging

# File upload
go get github.com/gofiber/fiber/v2
```

## 📦 โครงสร้างไฟล์

```
backend/
├── internal/
│   ├── domain/
│   │   ├── entity/
│   │   │   └── site_image.go
│   │   └── repository/
│   │       └── site_image_repository.go
│   ├── infrastructure/
│   │   └── persistence/
│   │       └── postgres/
│   │           └── site_image_repository_impl.go
│   ├── usecase/
│   │   └── admin/
│   │       └── site_content_usecase.go
│   └── presentation/
│       └── http/
│           └── handler/
│               └── admin_site_content_handler.go
└── uploads/
    └── site-images/
        ├── originals/
        └── thumbnails/
```

## ✨ ฟีเจอร์ที่จะได้

1. **Upload รูปภาพ** - รองรับหลายรูปแบบ
2. **จัดการหมวดหมู่** - แยกรูปตามประเภท
3. **ค้นหาและกรอง** - หารูปได้ง่าย
4. **แก้ไขข้อมูล** - เปลี่ยนชื่อ, alt text, code
5. **ลบรูปภาพ** - ลบทั้งไฟล์และข้อมูล
6. **เปิด/ปิดใช้งาน** - ควบคุมการแสดงผล
7. **Preview** - ดูรูปก่อนใช้งาน
8. **Copy URL** - คัดลอก URL ได้ทันที

## 🎨 Use Cases

1. **อัปโหลดโลโก้เว็บไซต์**
2. **จัดการแบนเนอร์โปรโมชั่น**
3. **อัปโหลดไอคอนหมวดหมู่เกม**
4. **จัดการโลโก้ค่ายเกม**
5. **อัปโหลดรูปพื้นหลัง**
6. **จัดการรูปปุ่มต่างๆ**

## 🚀 ประโยชน์

1. **จัดการรูปภาพแบบรวมศูนย์** - ไม่ต้องเข้า FTP
2. **ใช้งานง่าย** - UI สวยงาม ใช้งานง่าย
3. **ปลอดภัย** - มีการ validate และ authentication
4. **รวดเร็ว** - Upload และแสดงผลเร็ว
5. **SEO Friendly** - มี alt text และ metadata
6. **Responsive** - ใช้งานได้ทุกอุปกรณ์
