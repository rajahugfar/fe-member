# 🗄️ Promotion System - SQL Setup (สำหรับ sqlc)

## ✅ ไฟล์ SQL ที่สร้างแล้ว

```
backend/sql/
├── schema/
│   └── promotions.sql          # Schema tables, indexes, views
└── seed/
    └── promotions_seed.sql     # Test data (5 โปรโมชั่น)
```

---

## 🚀 วิธี Run SQL (แบบ sqlc)

### วิธีที่ 1: ใช้ psql โดยตรง

```bash
cd backend

# 1. Run schema
psql -U your_user -d your_database -f sql/schema/promotions.sql

# 2. Run seed data
psql -U your_user -d your_database -f sql/seed/promotions_seed.sql
```

### วิธีที่ 2: ใช้ connection string

```bash
# Schema
psql "postgresql://user:pass@localhost:5432/dbname?sslmode=disable" -f sql/schema/promotions.sql

# Seed
psql "postgresql://user:pass@localhost:5432/dbname?sslmode=disable" -f sql/seed/promotions_seed.sql
```

### วิธีที่ 3: Copy-paste ใน psql

```bash
psql -U your_user -d your_database

# แล้ว copy-paste SQL จากไฟล์
```

---

## 📊 สิ่งที่ SQL จะสร้าง

### Tables (3 ตาราง):
1. **promotion_logs** - เก็บ log กิจกรรม
2. **turnover_transactions** - บันทึกธุรกรรมเทิร์น
3. **promotion_conditions** - เงื่อนไขเพิ่มเติม

### Columns เพิ่มใน member_promotions:
- deposit_amount
- bonus_amount
- required_turnover
- current_turnover
- claimed_at
- completed_at
- cancelled_at

### Indexes (11 indexes):
- Performance optimization สำหรับ queries

### View:
- **promotion_stats** - สถิติโปรโมชั่น

### Test Data:
- 5 โปรโมชั่นพร้อมใช้งาน

---

## 🔧 ตรวจสอบว่า Run สำเร็จ

```sql
-- ตรวจสอบ tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('promotion_logs', 'turnover_transactions', 'promotion_conditions');

-- ตรวจสอบโปรโมชั่น
SELECT code, name, is_active FROM promotions 
WHERE code IN ('WELCOME100', 'DAILY30', 'DEPOSIT20', 'CASHBACK10', 'DEPOSIT50');

-- ตรวจสอบ view
SELECT * FROM promotion_stats;
```

---

## 📝 หลัง Run SQL แล้ว

เพิ่ม code ใน `main.go`:

```go
// Promotion Services
promotionCRUDService := promotion.NewPromotionCRUDService(postgres.DB)
promotionCRUDHandler := handler.NewPromotionCRUDHandler(promotionCRUDService)

// Public Routes
app.Get("/api/v1/promotions", promotionCRUDHandler.GetActivePromotions)
```

---

## ✅ ข้อดีของวิธีนี้

1. ✅ ไม่ต้องใช้ goose
2. ✅ Run SQL โดยตรง
3. ✅ เหมาะกับ sqlc
4. ✅ ไม่มีปัญหา version conflict
5. ✅ แก้ไขง่าย

---

**พร้อมใช้งาน!** 🚀
