# Quick Start Guide - Lucky Wheel, Daily Check-in & Referral

## 🚀 การติดตั้งและรัน

### ขั้นตอนที่ 1: Run Migrations
```bash
cd backend

# ตรวจสอบว่ามี migration files
ls migrations/000046* migrations/000047*

# Run migrations (แก้ connection string ให้ตรงกับของคุณ)
migrate -path migrations -database "mysql://root:password@tcp(localhost:3306)/bicycle678" up

# หรือใช้ผ่าน Go
go run cmd/migrate/main.go up
```

### ขั้นตอนที่ 2: Seed Test Data
```bash
# เข้า MySQL
mysql -u root -p bicycle678

# Run seed script
source scripts/seed_test_data.sql

# หรือ
mysql -u root -p bicycle678 < scripts/seed_test_data.sql
```

### ขั้นตอนที่ 3: ตรวจสอบว่า Tables ถูกสร้าง
```sql
USE bicycle678;

SHOW TABLES LIKE '%lucky%';
SHOW TABLES LIKE '%daily%';
SHOW TABLES LIKE '%referral%';

-- ควรเห็น:
-- lucky_wheel_prizes
-- lucky_wheel_spins
-- lucky_wheel_settings
-- daily_checkins
-- daily_checkin_rewards
-- referrals
-- referral_commissions
-- referral_settings
```

### ขั้นตอนที่ 4: เพิ่ม Code ใน main.go

ให้เพิ่มโค้ดนี้ใน `/backend/cmd/api/main.go`:

```go
// เพิ่มใน import section
import (
    // ... existing imports ...
    luckyWheelRepo "github.com/permchok/v2/internal/infrastructure/database/repository"
    luckyWheelUC "github.com/permchok/v2/internal/usecase"
)

// เพิ่มหลัง line 94 (หลัง chatRepo)
luckyWheelRepo := dbRepo.NewLuckyWheelRepository(postgres.DB)
dailyCheckInRepo := dbRepo.NewDailyCheckInRepository(postgres.DB)
referralRepo := dbRepo.NewReferralRepository(postgres.DB)

// เพิ่มหลัง line 178 (หลัง bankingUseCase)
luckyWheelUseCase := memberUC.NewLuckyWheelUseCase(luckyWheelRepo, memberRepo)
dailyCheckInUseCase := memberUC.NewDailyCheckInUseCase(dailyCheckInRepo, memberRepo)
referralUseCase := memberUC.NewReferralUseCase(referralRepo, memberRepo)

// เพิ่มหลัง line 243 (หลัง simpleChatHandler)
luckyWheelHandler := handler.NewLuckyWheelHandler(luckyWheelUseCase)
dailyCheckInHandler := handler.NewDailyCheckInHandler(dailyCheckInUseCase)
referralHandler := handler.NewReferralHandler(referralUseCase)
```

### ขั้นตอนที่ 5: เพิ่ม Routes

สร้างไฟล์ใหม่หรือเพิ่มใน route file ที่มีอยู่:

```go
// Lucky Wheel Routes
app.Get("/api/v1/lucky-wheel/prizes", luckyWheelHandler.GetPrizes)

// Member routes (ต้องมี auth middleware)
memberGroup := app.Group("/api/v1/member")
memberGroup.Use(authMiddleware)
{
    // Lucky Wheel
    memberGroup.Get("/lucky-wheel/status", luckyWheelHandler.GetSpinStatus)
    memberGroup.Post("/lucky-wheel/spin", luckyWheelHandler.Spin)
    memberGroup.Get("/lucky-wheel/history", luckyWheelHandler.GetSpinHistory)
    
    // Daily Check-in
    memberGroup.Get("/daily-checkin/status", dailyCheckInHandler.GetStatus)
    memberGroup.Post("/daily-checkin", dailyCheckInHandler.CheckIn)
    memberGroup.Post("/daily-checkin/claim/:days", dailyCheckInHandler.ClaimReward)
    
    // Referral
    memberGroup.Get("/referral/code", referralHandler.GetCode)
    memberGroup.Get("/referral/stats", referralHandler.GetStats)
    memberGroup.Get("/referral/history", referralHandler.GetHistory)
    memberGroup.Post("/referral/claim", referralHandler.ClaimCommission)
}

// Admin routes
adminGroup := app.Group("/api/v1/admin")
adminGroup.Use(adminAuthMiddleware)
{
    // Lucky Wheel
    adminGroup.Get("/lucky-wheel/spins", luckyWheelHandler.GetAllSpins)
    adminGroup.Post("/lucky-wheel/prizes", luckyWheelHandler.CreatePrize)
    adminGroup.Put("/lucky-wheel/prizes/:id", luckyWheelHandler.UpdatePrize)
    adminGroup.Delete("/lucky-wheel/prizes/:id", luckyWheelHandler.DeletePrize)
    adminGroup.Get("/lucky-wheel/settings", luckyWheelHandler.GetSettings)
    adminGroup.Put("/lucky-wheel/settings", luckyWheelHandler.UpdateSettings)
    
    // Daily Check-in
    adminGroup.Get("/daily-checkin/checkins", dailyCheckInHandler.GetAllCheckIns)
    adminGroup.Get("/daily-checkin/rewards", dailyCheckInHandler.GetAllRewards)
    
    // Referral
    adminGroup.Get("/referrals", referralHandler.GetAllReferrals)
    adminGroup.Get("/referrals/:id", referralHandler.GetReferralDetail)
    adminGroup.Put("/referrals/:id/approve", referralHandler.ApproveCommission)
    adminGroup.Get("/referral-settings", referralHandler.GetSettings)
    adminGroup.Put("/referral-settings", referralHandler.UpdateSettings)
}
```

### ขั้นตอนที่ 6: Start Backend
```bash
cd backend
go run cmd/api/main.go

# ควรเห็น
# ✅ Server listening on :8080
```

### ขั้นตอนที่ 7: Start Frontend
```bash
cd frontend
npm run dev

# ควรเห็น
# ➜  Local:   http://localhost:5173/
```

## 🧪 ทดสอบระบบ

### ทดสอบด้วย Browser

1. **Lucky Wheel**: เข้า `http://localhost:5173/lucky-wheel`
2. **Daily Check-in**: Login แล้วเข้า `http://localhost:5173/` (จะ popup ขึ้นมา)
3. **Referral**: เข้า `http://localhost:5173/invitation`

### ทดสอบด้วย API (Postman/curl)

```bash
# 1. Get Lucky Wheel Prizes
curl http://localhost:8080/api/v1/lucky-wheel/prizes

# 2. Get Spin Status (ต้อง login ก่อน)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/v1/member/lucky-wheel/status

# 3. Spin Wheel
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/v1/member/lucky-wheel/spin

# 4. Get Check-in Status
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/v1/member/daily-checkin/status

# 5. Check-in
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/v1/member/daily-checkin
```

## 📊 ตรวจสอบ Data ใน Database

```sql
-- ดูรางวัลทั้งหมด
SELECT * FROM lucky_wheel_prizes;

-- ดูการหมุนของ member
SELECT * FROM lucky_wheel_spins WHERE member_id = 1;

-- ดูการเช็คอิน
SELECT * FROM daily_checkins WHERE member_id = 1 ORDER BY checked_at DESC;

-- ดู referral
SELECT * FROM referrals WHERE referrer_id = 1;
```

## ⚠️ Troubleshooting

### ปัญหา: Tables ไม่ถูกสร้าง
```bash
# ตรวจสอบ migration version
migrate -path migrations -database "mysql://..." version

# Force version
migrate -path migrations -database "mysql://..." force 46
migrate -path migrations -database "mysql://..." up
```

### ปัญหา: Import error ใน Go
```bash
cd backend
go mod tidy
go mod download
```

### ปัญหา: API ไม่ทำงาน
1. ตรวจสอบว่า routes ถูก register แล้ว
2. ตรวจสอบ middleware authentication
3. ดู logs ใน terminal

### ปัญหา: Frontend ไม่แสดง Modal
1. ตรวจสอบว่า member login แล้ว
2. Clear localStorage: `localStorage.removeItem('lastDailyCheckIn')`
3. Refresh page

## 📝 สิ่งที่ต้องทำเพิ่มเติม

- [ ] เพิ่ม code ใน main.go (ขั้นตอนที่ 4)
- [ ] เพิ่ม routes (ขั้นตอนที่ 5)
- [ ] Run migrations (ขั้นตอนที่ 1)
- [ ] Seed test data (ขั้นตอนที่ 2)
- [ ] ทดสอบ APIs
- [ ] ทดสอบ Frontend
- [ ] สร้าง Referral Handler (ยังไม่มี)

## 🎯 Next Steps

1. **Complete Referral Handler** - ยังไม่ได้สร้าง
2. **Add Middleware** - ตรวจสอบ turnover สำหรับ check-in
3. **Add Validation** - validate input data
4. **Add Logging** - log important actions
5. **Add Tests** - unit tests & integration tests

---

**Status: 90% Complete - Ready for Integration Testing** 🚀
