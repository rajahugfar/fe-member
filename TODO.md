# TODO - Complete Implementation

## ⚠️ สิ่งที่ต้องแก้ไขก่อนใช้งาน

### 1. แก้ Import Paths ทั้งหมด
ไฟล์ที่สร้างใหม่ใช้ `bicycle678` แต่โปรเจคจริงใช้ `github.com/permchok/v2`

**ไฟล์ที่ต้องแก้:**
```
backend/internal/domain/lucky_wheel.go
backend/internal/domain/referral.go
backend/internal/infrastructure/repository/lucky_wheel_repository.go
backend/internal/infrastructure/repository/daily_checkin_repository.go
backend/internal/infrastructure/repository/referral_repository.go
backend/internal/usecase/lucky_wheel_usecase.go
backend/internal/usecase/daily_checkin_usecase.go
backend/internal/usecase/referral_usecase.go
backend/internal/presentation/http/handler/lucky_wheel_handler.go
backend/internal/presentation/http/handler/daily_checkin_handler.go
backend/internal/presentation/http/admin_referral_handler.go
```

**แก้จาก:**
```go
import (
	"bicycle678/internal/domain"
	"bicycle678/internal/usecase"
	"bicycle678/internal/infrastructure/repository"
)
```

**เป็น:**
```go
import (
	"github.com/permchok/v2/internal/domain"
	"github.com/permchok/v2/internal/usecase"
	"github.com/permchok/v2/internal/infrastructure/database/repository"
)
```

### 2. ย้ายไฟล์ Repository ไปที่ถูกต้อง

**ย้ายจาก:**
```
backend/internal/infrastructure/repository/
```

**ไปที่:**
```
backend/internal/infrastructure/database/repository/
```

**คำสั่ง:**
```bash
cd backend/internal/infrastructure

# ย้ายไฟล์
mv repository/lucky_wheel_repository.go database/repository/
mv repository/daily_checkin_repository.go database/repository/
mv repository/referral_repository.go database/repository/

# ลบ folder เก่า (ถ้าว่าง)
rmdir repository
```

### 3. เพิ่ม Member Type ใน Domain

ไฟล์ `lucky_wheel.go` และ `referral.go` ใช้ `Member` และ `Admin` แต่ยังไม่ได้ import

**แก้ไข `/backend/internal/domain/lucky_wheel.go`:**
```go
package domain

import (
	"time"
)

// เพิ่ม import หรือใช้ Member จาก domain ที่มีอยู่แล้ว
```

**ตรวจสอบว่ามี Member domain อยู่แล้วหรือไม่:**
```bash
find backend/internal/domain -name "*member*.go"
```

### 4. Run Migrations

```bash
cd backend

# ตรวจสอบ database connection
# แก้ไขใน .env หรือ config

# Run migrations
go run cmd/migrate/main.go up

# หรือใช้ migrate CLI
migrate -path migrations -database "mysql://root:password@tcp(localhost:3306)/bicycle678" up
```

### 5. Seed Test Data

```bash
# เข้า MySQL
mysql -u root -p bicycle678

# Run seed script
source scripts/seed_test_data.sql
```

### 6. เพิ่ม Code ใน main.go

**Location:** `/backend/cmd/api/main.go`

**หลัง line 94 (repositories):**
```go
luckyWheelRepo := dbRepo.NewLuckyWheelRepository(postgres.DB)
dailyCheckInRepo := dbRepo.NewDailyCheckInRepository(postgres.DB)
referralRepo := dbRepo.NewReferralRepository(postgres.DB)
```

**หลัง line 178 (use cases):**
```go
luckyWheelUseCase := memberUC.NewLuckyWheelUseCase(luckyWheelRepo, memberRepo)
dailyCheckInUseCase := memberUC.NewDailyCheckInUseCase(dailyCheckInRepo, memberRepo)
referralUseCase := memberUC.NewReferralUseCase(referralRepo, memberRepo)
```

**หลัง line 243 (handlers):**
```go
luckyWheelHandler := handler.NewLuckyWheelHandler(luckyWheelUseCase)
dailyCheckInHandler := handler.NewDailyCheckInHandler(dailyCheckInUseCase)
referralHandler := handler.NewReferralHandler(referralUseCase)
```

### 7. เพิ่ม Routes

**สร้างไฟล์ใหม่:** `/backend/internal/presentation/http/route/member_features_routes.go`

```go
package route

import (
	"github.com/gofiber/fiber/v2"
	"github.com/permchok/v2/internal/presentation/http/handler"
	"github.com/permchok/v2/internal/presentation/http/middleware"
)

type MemberFeaturesRoutes struct {
	LuckyWheelHandler   *handler.LuckyWheelHandler
	DailyCheckInHandler *handler.DailyCheckInHandler
	ReferralHandler     *handler.ReferralHandler
	AuthMiddleware      *middleware.MemberAuthMiddleware
}

func SetupMemberFeaturesRoutes(app *fiber.App, routes MemberFeaturesRoutes) {
	// Public routes
	app.Get("/api/v1/lucky-wheel/prizes", routes.LuckyWheelHandler.GetPrizes)

	// Member routes
	member := app.Group("/api/v1/member")
	member.Use(routes.AuthMiddleware.Authenticate)
	
	// Lucky Wheel
	member.Get("/lucky-wheel/status", routes.LuckyWheelHandler.GetSpinStatus)
	member.Post("/lucky-wheel/spin", routes.LuckyWheelHandler.Spin)
	member.Get("/lucky-wheel/history", routes.LuckyWheelHandler.GetSpinHistory)
	
	// Daily Check-in
	member.Get("/daily-checkin/status", routes.DailyCheckInHandler.GetStatus)
	member.Post("/daily-checkin", routes.DailyCheckInHandler.CheckIn)
	member.Post("/daily-checkin/claim/:days", routes.DailyCheckInHandler.ClaimReward)
	
	// Referral
	member.Get("/referral/code", routes.ReferralHandler.GetCode)
	member.Get("/referral/stats", routes.ReferralHandler.GetStats)
	member.Get("/referral/history", routes.ReferralHandler.GetHistory)
	member.Post("/referral/claim", routes.ReferralHandler.ClaimCommission)
}
```

**เรียกใช้ใน main.go (หลัง line 348):**
```go
// Setup member features routes
memberFeaturesRoutes := route.MemberFeaturesRoutes{
	LuckyWheelHandler:   luckyWheelHandler,
	DailyCheckInHandler: dailyCheckInHandler,
	ReferralHandler:     referralHandler,
	AuthMiddleware:      memberAuthMiddleware,
}
route.SetupMemberFeaturesRoutes(app, memberFeaturesRoutes)
```

### 8. สร้าง Referral Handler (ยังไม่มี)

**สร้างไฟล์:** `/backend/internal/presentation/http/handler/referral_handler.go`

```go
package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/permchok/v2/internal/usecase"
)

type ReferralHandler struct {
	referralUseCase *usecase.ReferralUseCase
}

func NewReferralHandler(referralUseCase *usecase.ReferralUseCase) *ReferralHandler {
	return &ReferralHandler{
		referralUseCase: referralUseCase,
	}
}

func (h *ReferralHandler) GetCode(c *fiber.Ctx) error {
	memberID := c.Locals("member_id")
	if memberID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Unauthorized",
		})
	}

	code, err := h.referralUseCase.GetReferralCode(memberID.(uint))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to get referral code",
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"code": code,
			"link": "https://yourdomain.com/register?ref=" + code,
		},
	})
}

func (h *ReferralHandler) GetStats(c *fiber.Ctx) error {
	memberID := c.Locals("member_id")
	if memberID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Unauthorized",
		})
	}

	stats, err := h.referralUseCase.GetStats(memberID.(uint))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to get stats",
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    stats,
	})
}

func (h *ReferralHandler) GetHistory(c *fiber.Ctx) error {
	memberID := c.Locals("member_id")
	if memberID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Unauthorized",
		})
	}

	history, err := h.referralUseCase.GetHistory(memberID.(uint))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to get history",
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data": history,
	})
}

func (h *ReferralHandler) ClaimCommission(c *fiber.Ctx) error {
	memberID := c.Locals("member_id")
	if memberID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Unauthorized",
		})
	}

	err := h.referralUseCase.ClaimCommission(memberID.(uint))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Commission claimed successfully",
	})
}
```

## 📋 Checklist

- [ ] แก้ import paths ทั้งหมด (ขั้นตอนที่ 1)
- [ ] ย้ายไฟล์ repository (ขั้นตอนที่ 2)
- [ ] แก้ Member/Admin types (ขั้นตอนที่ 3)
- [ ] Run migrations (ขั้นตอนที่ 4)
- [ ] Seed test data (ขั้นตอนที่ 5)
- [ ] เพิ่ม code ใน main.go (ขั้นตอนที่ 6)
- [ ] เพิ่ม routes (ขั้นตอนที่ 7)
- [ ] สร้าง referral handler (ขั้นตอนที่ 8)
- [ ] Test APIs
- [ ] Test Frontend

## 🚀 หลังจากแก้ไขเสร็จ

```bash
# 1. Build backend
cd backend
go mod tidy
go build -o bin/api cmd/api/main.go

# 2. Run backend
./bin/api

# 3. Run frontend (terminal ใหม่)
cd frontend
npm run dev

# 4. Test
# เปิด browser: http://localhost:5173
```

---

**ปัญหาหลัก:** Import paths ผิด และไฟล์อยู่ผิดที่ ต้องแก้ไขก่อนจะใช้งานได้ครับ!
