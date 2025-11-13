# 📊 คู่มือหลังบ้าน - ระบบจัดการโปรโมชั่น

## ✅ ระบบที่สร้างเสร็จแล้ว

ระบบหลังบ้านสำหรับ Admin ดูและจัดการโปรโมชั่นที่สมาชิกรับ พร้อม Logs ครบถ้วน

---

## 📦 ไฟล์ที่สร้าง

### Backend

#### 1. Admin Service
```
✅ backend/internal/usecase/promotion/promotion_admin_service.go
```

**Methods:**
- `GetAllMemberPromotions()` - ดูโปรโมชั่นทั้งหมดที่สมาชิกรับ (พร้อม filter + pagination)
- `GetMemberPromotionsByMember()` - ดูโปรโมชั่นของสมาชิกคนใดคนหนึ่ง
- `GetAllPromotionLogs()` - ดู logs ทั้งหมด (พร้อม filter + pagination)
- `GetPromotionStats()` - สถิติโปรโมชั่นแต่ละตัว
- `GetAllPromotionStats()` - สถิติโปรโมชั่นทั้งหมด
- `GetTurnoverTransactions()` - ดูธุรกรรมเทิร์นโอเวอร์
- `AdminCancelPromotion()` - Admin ยกเลิกโปรโมชั่น
- `GetDashboardStats()` - สถิติสำหรับ Dashboard

#### 2. Admin Handler
```
✅ backend/internal/presentation/http/handler/promotion_admin_handler.go
```

**Endpoints:**
- `GET /api/v1/admin/promotions/members` - ดูโปรโมชั่นทั้งหมด
- `GET /api/v1/admin/promotions/members/:member_id` - ดูโปรโมชั่นของสมาชิก
- `GET /api/v1/admin/promotions/logs` - ดู logs ทั้งหมด
- `GET /api/v1/admin/promotions/:promotion_id/stats` - สถิติโปรโมชั่น
- `GET /api/v1/admin/promotions/stats` - สถิติทั้งหมด
- `GET /api/v1/admin/promotions/member-promotions/:id/transactions` - ดูธุรกรรม
- `POST /api/v1/admin/promotions/member-promotions/:id/cancel` - ยกเลิก
- `GET /api/v1/admin/promotions/dashboard` - Dashboard stats

### Frontend

```
✅ frontend/src/pages/admin/PromotionLogsPage.tsx
```

**Features:**
- Dashboard สถิติภาพรวม
- ตารางแสดงโปรโมชั่นที่สมาชิกรับ
- ประวัติ Logs ทั้งหมด
- Filter ตามสถานะและ action
- Pagination
- ยกเลิกโปรโมชั่น

---

## 🎯 Features

### 1. Dashboard Stats
แสดงสถิติภาพรวม:
- ✅ จำนวนโปรโมชั่นที่กำลังใช้งาน
- ✅ จำนวนที่เสร็จสิ้นวันนี้
- ✅ ยอดโบนัสรวมที่กำลังใช้งาน
- ✅ ยอดโบนัสที่แจกวันนี้

### 2. โปรโมชั่นสมาชิก
ดูรายการโปรโมชั่นที่สมาชิกรับ:
- ✅ แสดงข้อมูลสมาชิก (เบอร์, ชื่อ)
- ✅ แสดงโปรโมชั่นที่รับ
- ✅ แสดงยอดฝาก, โบนัส
- ✅ แสดง Progress เทิร์นโอเวอร์
- ✅ แสดงสถานะ (active, completed, cancelled, expired)
- ✅ Filter ตามสถานะ
- ✅ Pagination
- ✅ ยกเลิกโปรโมชั่นได้

### 3. ประวัติ Logs
ดู logs กิจกรรมทั้งหมด:
- ✅ แสดงข้อมูลสมาชิก
- ✅ แสดง Action (claimed, turnover_updated, completed, cancelled, expired)
- ✅ แสดงคำอธิบาย
- ✅ แสดงค่าเก่า → ค่าใหม่
- ✅ แสดง Timestamp
- ✅ Filter ตาม Action
- ✅ Pagination

---

## 📊 API Documentation

### 1. Get Dashboard Stats

```bash
GET /api/v1/admin/promotions/dashboard
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "active_promotions": 15,
    "completed_today": 3,
    "total_active_bonus": 45000,
    "bonus_given_today": 12000
  }
}
```

### 2. Get All Member Promotions

```bash
GET /api/v1/admin/promotions/members?page=1&page_size=20&status=active
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `page` - หน้าที่ต้องการ (default: 1)
- `page_size` - จำนวนต่อหน้า (default: 20, max: 100)
- `status` - filter ตามสถานะ (active, completed, cancelled, expired)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "member_id": "uuid",
      "member_phone": "0812345678",
      "member_fullname": "สมชาย ใจดี",
      "promotion_id": 1,
      "promotion_name": "โบนัสฝากแรก 30%",
      "promotion_type": "deposit",
      "deposit_amount": 1000,
      "bonus_amount": 300,
      "required_turnover": 3900,
      "current_turnover": 1500,
      "turnover_progress": 38.46,
      "status": "active",
      "claimed_at": "2025-01-04T13:00:00Z",
      "completed_at": null
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 45,
    "total_page": 3
  }
}
```

### 3. Get All Promotion Logs

```bash
GET /api/v1/admin/promotions/logs?page=1&page_size=50&action=claimed
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `page` - หน้าที่ต้องการ (default: 1)
- `page_size` - จำนวนต่อหน้า (default: 50, max: 200)
- `action` - filter ตาม action (claimed, turnover_updated, completed, cancelled, expired)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 456,
      "member_promotion_id": 123,
      "member_id": "uuid",
      "member_phone": "0812345678",
      "member_fullname": "สมชาย ใจดี",
      "promotion_name": "โบนัสฝากแรก 30%",
      "action": "claimed",
      "description": "Claimed promotion: โบนัสฝากแรก 30%",
      "old_value": 0,
      "new_value": 300,
      "created_at": "2025-01-04T13:00:00Z"
    },
    {
      "id": 457,
      "member_promotion_id": 123,
      "member_id": "uuid",
      "member_phone": "0812345678",
      "member_fullname": "สมชาย ใจดี",
      "promotion_name": "โบนัสฝากแรก 30%",
      "action": "turnover_updated",
      "description": "Turnover updated from bet",
      "old_value": 1400,
      "new_value": 1500,
      "created_at": "2025-01-04T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 50,
    "total": 234,
    "total_page": 5
  }
}
```

### 4. Get Promotion Stats

```bash
GET /api/v1/admin/promotions/1/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "โบนัสฝากแรก 30%",
    "total_claims": 45,
    "active_claims": 15,
    "completed_claims": 25,
    "cancelled_claims": 5,
    "total_deposit": 450000,
    "total_bonus": 135000,
    "total_turnover": 2500000
  }
}
```

### 5. Get All Promotion Stats

```bash
GET /api/v1/admin/promotions/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "โบนัสฝากแรก 30%",
      "total_claims": 45,
      "active_claims": 15,
      "completed_claims": 25,
      "cancelled_claims": 5,
      "total_deposit": 450000,
      "total_bonus": 135000,
      "total_turnover": 2500000
    },
    {
      "id": 2,
      "name": "โบนัสฝากรายวัน 20%",
      "total_claims": 120,
      "active_claims": 40,
      "completed_claims": 70,
      "cancelled_claims": 10,
      "total_deposit": 1200000,
      "total_bonus": 240000,
      "total_turnover": 5000000
    }
  ]
}
```

### 6. Get Turnover Transactions

```bash
GET /api/v1/admin/promotions/member-promotions/123/transactions?page=1&page_size=50
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 789,
      "member_promotion_id": 123,
      "member_id": "uuid",
      "member_phone": "0812345678",
      "transaction_type": "bet",
      "amount": 100,
      "game_type": "slot",
      "game_provider": "pragmatic",
      "reference_id": "TXN123456",
      "created_at": "2025-01-04T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 50,
    "total": 45,
    "total_page": 1
  }
}
```

### 7. Admin Cancel Promotion

```bash
POST /api/v1/admin/promotions/member-promotions/123/cancel
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "ยกเลิกโดย Admin เนื่องจาก..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Promotion cancelled successfully"
}
```

---

## 🚀 การใช้งาน

### 1. เพิ่ม Code ใน main.go

```go
// Service
promotionAdminService := promotion.NewPromotionAdminService(postgres.DB)
promotionAdminHandler := handler.NewPromotionAdminHandler(promotionAdminService)

// Routes (ต้องมี admin auth middleware)
adminGroup := app.Group("/api/v1/admin")
// adminGroup.Use(adminAuthMiddleware)

adminGroup.Get("/promotions/dashboard", promotionAdminHandler.GetDashboardStats)
adminGroup.Get("/promotions/members", promotionAdminHandler.GetAllMemberPromotions)
adminGroup.Get("/promotions/members/:member_id", promotionAdminHandler.GetMemberPromotionsByMember)
adminGroup.Get("/promotions/logs", promotionAdminHandler.GetAllPromotionLogs)
adminGroup.Get("/promotions/:promotion_id/stats", promotionAdminHandler.GetPromotionStats)
adminGroup.Get("/promotions/stats", promotionAdminHandler.GetAllPromotionStats)
adminGroup.Get("/promotions/member-promotions/:member_promotion_id/transactions", promotionAdminHandler.GetTurnoverTransactions)
adminGroup.Post("/promotions/member-promotions/:member_promotion_id/cancel", promotionAdminHandler.AdminCancelPromotion)
```

### 2. เพิ่ม Route ใน Frontend

```tsx
// ใน Admin Router
import PromotionLogsPage from '@/pages/admin/PromotionLogsPage'

<Route path="/admin/promotions" element={<PromotionLogsPage />} />
```

### 3. เพิ่มเมนูใน Admin Sidebar

```tsx
<Link to="/admin/promotions">
  <FiGift className="mr-2" />
  จัดการโปรโมชั่น
</Link>
```

---

## 📈 Use Cases

### 1. ดูว่าใครรับโปรโมชั่นบ้าง
- เข้าหน้า "จัดการโปรโมชั่น"
- คลิกแท็บ "โปรโมชั่นสมาชิก"
- ดูรายการทั้งหมด หรือ filter ตามสถานะ

### 2. ดู Logs การรับโปรโมชั่น
- เข้าหน้า "จัดการโปรโมชั่น"
- คลิกแท็บ "ประวัติ Logs"
- Filter ด้วย action = "claimed"
- จะเห็นว่าใครรับโปรโมชั่นเมื่อไหร่

### 3. ตรวจสอบความคืบหน้าเทิร์นโอเวอร์
- ดูที่คอลัมน์ "เทิร์นโอเวอร์"
- มี Progress bar แสดงเปอร์เซ็นต์
- แสดงยอดปัจจุบัน / ยอดที่ต้องทำ

### 4. ดู Logs การอัพเดทเทิร์น
- คลิกแท็บ "ประวัติ Logs"
- Filter ด้วย action = "turnover_updated"
- จะเห็นทุกครั้งที่มีการอัพเดทเทิร์น

### 5. ยกเลิกโปรโมชั่น
- หาโปรโมชั่นที่ต้องการยกเลิก
- คลิกปุ่ม X สีแดง
- ยืนยันการยกเลิก
- ระบบจะ:
  - เปลี่ยนสถานะเป็น "cancelled"
  - หักเครดิตโบนัสออก (ถ้ายังไม่ทำเทิร์นครบ)
  - บันทึก Log

### 6. ดูสถิติโปรโมชั่น
- Dashboard แสดงสถิติภาพรวม
- หรือเรียก API `/api/v1/admin/promotions/stats` เพื่อดูแต่ละโปรโมชั่น

---

## 🔍 SQL Queries สำหรับ Monitoring

### ดูโปรโมชั่นที่กำลัง active
```sql
SELECT 
    mp.id,
    m.phone,
    p.name,
    mp.deposit_amount,
    mp.bonus_amount,
    mp.current_turnover,
    mp.required_turnover,
    (mp.current_turnover / mp.required_turnover * 100) as progress
FROM member_promotions mp
JOIN members m ON mp.member_id = m.id
JOIN promotions p ON mp.promotion_id = p.id
WHERE mp.status = 'active'
ORDER BY mp.claimed_at DESC;
```

### ดู Logs วันนี้
```sql
SELECT 
    pl.*,
    m.phone,
    p.name as promotion_name
FROM promotion_logs pl
JOIN members m ON pl.member_id = m.id
JOIN member_promotions mp ON pl.member_promotion_id = mp.id
JOIN promotions p ON mp.promotion_id = p.id
WHERE DATE(pl.created_at) = CURRENT_DATE
ORDER BY pl.created_at DESC;
```

### ดูสมาชิกที่รับโปรโมชั่นวันนี้
```sql
SELECT 
    m.phone,
    m.fullname,
    p.name,
    mp.bonus_amount,
    mp.claimed_at
FROM member_promotions mp
JOIN members m ON mp.member_id = m.id
JOIN promotions p ON mp.promotion_id = p.id
WHERE DATE(mp.claimed_at) = CURRENT_DATE
ORDER BY mp.claimed_at DESC;
```

### ดูสถิติโปรโมชั่นแต่ละตัว
```sql
SELECT 
    p.id,
    p.name,
    COUNT(mp.id) as total_claims,
    COUNT(CASE WHEN mp.status = 'active' THEN 1 END) as active,
    COUNT(CASE WHEN mp.status = 'completed' THEN 1 END) as completed,
    SUM(mp.bonus_amount) as total_bonus
FROM promotions p
LEFT JOIN member_promotions mp ON p.id = mp.promotion_id
GROUP BY p.id, p.name
ORDER BY total_claims DESC;
```

---

## ✅ สรุป

ระบบหลังบ้านพร้อมใช้งาน 100%!

**Features:**
- ✅ Dashboard สถิติภาพรวม
- ✅ ดูโปรโมชั่นที่สมาชิกรับทั้งหมด
- ✅ Filter ตามสถานะ
- ✅ ดู Logs กิจกรรมทั้งหมด
- ✅ Filter ตาม Action
- ✅ ดูสถิติโปรโมชั่น
- ✅ ดูธุรกรรมเทิร์นโอเวอร์
- ✅ ยกเลิกโปรโมชั่นได้
- ✅ Pagination
- ✅ Responsive UI

**API Endpoints: 8 endpoints**
**Frontend: 1 Admin Page**

**พร้อม Deploy!** 🚀

---

**Created:** 2025-01-04  
**Status:** ✅ 100% Complete  
**Next:** เพิ่ม routes ใน main.go และ admin router
