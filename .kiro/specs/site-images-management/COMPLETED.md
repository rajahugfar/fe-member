# ✅ Site Images Management - เสร็จสมบูรณ์

## 🎉 สถานะ: พร้อมใช้งาน

ระบบจัดการรูปภาพเว็บไซต์ได้รับการพัฒนาเสร็จสมบูรณ์แล้ว!

## 📋 ฟีเจอร์ที่ใช้งานได้

### 1. ดูรูปภาพทั้งหมด
- แสดงรูปภาพทั้งหมดในระบบ
- กรองตามหมวดหมู่
- กรองตามสถานะ (เปิด/ปิดใช้งาน)
- ค้นหาด้วยชื่อหรือ code

### 2. อัปโหลดรูปภาพ
- รองรับ JPEG, PNG, WebP, GIF
- ขนาดไฟล์สูงสุด 10MB
- ตรวจสอบขนาดรูปอัตโนมัติ
- สร้าง URL อัตโนมัติ
- เก็บไฟล์ใน `/uploads/site-images/`

### 3. แก้ไขข้อมูลรูป
- เปลี่ยนชื่อ (title)
- เปลี่ยน code
- เปลี่ยน alt text (SEO)
- เปลี่ยนหมวดหมู่
- เปิด/ปิดใช้งาน

### 4. ลบรูปภาพ
- ลบข้อมูลจาก database
- ลบไฟล์จาก disk

### 5. จัดการหมวดหมู่
- ดูหมวดหมู่ทั้งหมด
- หมวดหมู่เริ่มต้น 10 หมวด:
  - โลโก้
  - แบนเนอร์
  - ปุ่ม
  - หมวดหมู่เกม
  - ค่ายเกม
  - โปรโมชั่น
  - พื้นหลัง
  - แท็บ
  - ไอคอน
  - ใบรับรอง

## 🔧 API Endpoints

### Get All Images
```bash
GET /api/v1/admin/site-images
Query Parameters:
  - category_id (optional): UUID
  - is_active (optional): true/false

Response:
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "category_id": "uuid",
      "code": "logo-main",
      "title": "Logo หลัก",
      "file_url": "http://localhost:3001/uploads/site-images/xxx.png",
      "width": 200,
      "height": 100,
      "is_active": true,
      ...
    }
  ]
}
```

### Get Categories
```bash
GET /api/v1/admin/site-images/categories

Response:
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "code": "logo",
      "name": "โลโก้",
      "sort_order": 1
    }
  ]
}
```

### Upload Image
```bash
POST /api/v1/admin/site-images/upload
Content-Type: multipart/form-data

Form Data:
  - image: File (required)
  - code: String (required) - unique identifier
  - title: String (optional)
  - category_id: UUID (optional)
  - alt_text: String (optional)

Response:
{
  "status": "success",
  "message": "Image uploaded successfully",
  "data": {
    "id": "uuid",
    "code": "logo-main",
    "file_url": "http://localhost:3001/uploads/site-images/xxx.png",
    ...
  }
}
```

### Update Image
```bash
PUT /api/v1/admin/site-images/:id
Content-Type: application/json

Body:
{
  "code": "logo-main-updated",
  "title": "Logo หลักใหม่",
  "alt_text": "Logo description",
  "category_id": "uuid",
  "is_active": true
}

Response:
{
  "status": "success",
  "message": "Image updated successfully",
  "data": { ... }
}
```

### Delete Image
```bash
DELETE /api/v1/admin/site-images/:id

Response:
{
  "status": "success",
  "message": "Image deleted successfully"
}
```

## 🎨 Frontend Usage

### เข้าใช้งาน
```
URL: http://localhost:5175/admin/site-images
```

### ฟีเจอร์ UI
- ✅ Grid view แสดงรูปภาพ
- ✅ Upload modal พร้อมฟอร์ม
- ✅ Edit modal แก้ไขข้อมูล
- ✅ ค้นหาและกรอง
- ✅ Preview รูปภาพ
- ✅ Delete confirmation
- ✅ Responsive design

## 📁 โครงสร้างไฟล์

### Backend
```
backend/
├── internal/
│   ├── domain/
│   │   ├── entity/
│   │   │   └── site_content.go (มีอยู่แล้ว)
│   │   └── repository/
│   │       └── site_content_repository.go (อัปเดต)
│   ├── infrastructure/
│   │   ├── database/repository/
│   │   │   └── site_image_repository_impl.go (ใหม่)
│   │   └── repository/postgres/
│   │       └── site_image_repository.go (มีอยู่แล้ว + อัปเดต)
│   ├── usecase/admin/
│   │   └── site_content_usecase.go (ใหม่)
│   └── presentation/http/
│       ├── handler/
│       │   └── admin_site_content_handler.go (ใหม่)
│       └── route/
│           └── routes.go (อัปเดต)
└── uploads/
    └── site-images/ (สร้างอัตโนมัติ)
```

### Frontend
```
frontend-admin/
├── src/
│   ├── api/
│   │   └── siteContentAPI.ts (มีอยู่แล้ว)
│   ├── pages/admin/
│   │   └── SiteImagesManagement.tsx (มีอยู่แล้ว)
│   └── types/
│       └── siteContent.ts (มีอยู่แล้ว)
```

## 🧪 การทดสอบ

### 1. ทดสอบ Upload
```bash
curl -X POST http://localhost:3001/api/v1/admin/site-images/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.png" \
  -F "code=test-logo" \
  -F "title=Test Logo"
```

### 2. ทดสอบ Get All
```bash
curl http://localhost:3001/api/v1/admin/site-images \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. ทดสอบ Get Categories
```bash
curl http://localhost:3001/api/v1/admin/site-images/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔐 Authentication

ทุก endpoint ต้องมี Authentication:
- ใช้ Admin Auth Middleware
- ต้องมี Bearer Token ใน Authorization header
- Token ได้จากการ login ที่ `/api/v1/admin/login`

## 💾 Database

### Tables ที่ใช้
- `site_images` - เก็บข้อมูลรูปภาพ
- `image_categories` - เก็บหมวดหมู่รูปภาพ

### Indexes
- `idx_site_images_category` - category_id
- `idx_site_images_code` - code (unique)
- `idx_site_images_active` - is_active

## 🎯 Use Cases

### 1. อัปโหลดโลโก้เว็บไซต์
```
1. เข้า /admin/site-images
2. คลิก "อัปโหลดรูป"
3. เลือกหมวดหมู่ "โลโก้"
4. ใส่ code: "logo-main"
5. ใส่ชื่อ: "Logo หลัก"
6. เลือกไฟล์รูป
7. คลิก Upload
```

### 2. จัดการแบนเนอร์โปรโมชั่น
```
1. เข้า /admin/site-images
2. กรองหมวดหมู่ "แบนเนอร์"
3. อัปโหลดรูปแบนเนอร์ใหม่
4. ใส่ code: "banner-promo-1"
5. ใส่ alt text สำหรับ SEO
```

### 3. อัปเดตรูปภาพ
```
1. คลิกปุ่ม Edit ที่รูปภาพ
2. แก้ไขชื่อ, code, alt text
3. เปิด/ปิดใช้งาน
4. บันทึก
```

## 🚨 Error Handling

### Upload Errors
- ❌ File type not allowed → รองรับเฉพาะ JPEG, PNG, WebP, GIF
- ❌ File too large → ขนาดสูงสุด 10MB
- ❌ Code already exists → ใช้ code ที่ไม่ซ้ำ

### Update Errors
- ❌ Image not found → ตรวจสอบ ID
- ❌ Code already exists → ใช้ code ที่ไม่ซ้ำ

### Delete Errors
- ❌ Image not found → ตรวจสอบ ID
- ⚠️ File delete failed → ลบข้อมูลสำเร็จแต่ไฟล์อาจยังอยู่

## 📈 Next Steps (Optional)

### ฟีเจอร์เพิ่มเติมที่อาจทำ
1. **Image Optimization**
   - Auto resize รูปภาพ
   - สร้าง thumbnail
   - Convert เป็น WebP

2. **CDN Integration**
   - Upload ไป S3/CloudFlare R2
   - ใช้ CDN URL

3. **Bulk Operations**
   - Upload หลายรูปพร้อมกัน
   - Delete หลายรูปพร้อมกัน

4. **Image Editor**
   - Crop รูปภาพ
   - Resize ในหน้าเว็บ

## ✨ สรุป

ระบบจัดการรูปภาพเว็บไซต์พร้อมใช้งานแล้ว! 🎉

- ✅ Backend API สมบูรณ์
- ✅ Frontend UI พร้อมใช้งาน
- ✅ Database schema พร้อม
- ✅ Authentication ครบถ้วน
- ✅ Error handling ดี
- ✅ File upload ทำงานได้

**ลองใช้งานได้เลย!** 🚀
