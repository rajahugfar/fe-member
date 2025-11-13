# Design Document - Lucky Wheel System

## Overview

ระบบ Lucky Wheel เป็นระบบกงล้อเสี่ยงโชคที่ให้สมาชิกหมุนเพื่อลุ้นรับรางวัล โดยใช้สถาปัตยกรรม Clean Architecture แบ่งเป็น 4 layers หลัก: Domain, Use Case, Infrastructure, และ Presentation

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Member     │  │    Admin     │  │   Public     │      │
│  │   Handler    │  │   Handler    │  │   Handler    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Use Case Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Member     │  │    Admin     │  │  Probability │      │
│  │  Lucky Wheel │  │ Lucky Wheel  │  │   Engine     │      │
│  │   Use Case   │  │  Use Case    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ LuckyWheel   │  │ LuckyWheel   │  │ LuckyWheel   │      │
│  │    Prize     │  │    Spin      │  │   Setting    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Repository  │  │   Database   │  │    Cache     │      │
│  │ Implementation│  │   (MySQL)    │  │   (Redis)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
Frontend-Member                Frontend-Admin
┌──────────────┐              ┌──────────────┐
│ LuckyWheel   │              │ LuckyWheel   │
│   Page       │              │ Management   │
│              │              │   Page       │
│ - Wheel UI   │              │ - Stats      │
│ - Spin Logic │              │ - Settings   │
│ - History    │              │ - Prizes     │
│ - Rules      │              │ - Logs       │
└──────────────┘              └──────────────┘
       │                             │
       └─────────────┬───────────────┘
                     │
              ┌──────────────┐
              │  API Client  │
              │              │
              │ - Member API │
              │ - Admin API  │
              └──────────────┘
```

## Components and Interfaces

### Backend Components

#### 1. Domain Layer

**LuckyWheelPrize**
```go
type LuckyWheelPrize struct {
    ID          uint
    Name        string
    Type        string    // "cash" or "item"
    Amount      float64
    ItemName    string
    ItemImage   string
    Color       string
    Probability float64
    Enabled     bool
    CreatedAt   time.Time
    UpdatedAt   time.Time
}
```

**LuckyWheelSpin**
```go
type LuckyWheelSpin struct {
    ID        uint
    MemberID  uuid.UUID
    PrizeID   uint
    PrizeName string
    PrizeType string
    Amount    float64
    SpunAt    time.Time
    CreatedAt time.Time
}
```

**LuckyWheelSetting**
```go
type LuckyWheelSetting struct {
    ID             uint
    MaxSpinsPerDay int
    Enabled        bool
    ResetTime      string
    CreatedAt      time.Time
    UpdatedAt      time.Time
}
```

#### 2. Repository Interface

```go
type LuckyWheelRepository interface {
    // Prize methods
    GetAllPrizes() ([]domain.LuckyWheelPrize, error)
    GetEnabledPrizes() ([]domain.LuckyWheelPrize, error)
    GetPrizeByID(id uint) (*domain.LuckyWheelPrize, error)
    CreatePrize(prize *domain.LuckyWheelPrize) error
    UpdatePrize(prize *domain.LuckyWheelPrize) error
    DeletePrize(id uint) error
    
    // Spin methods
    CreateSpin(spin *domain.LuckyWheelSpin) error
    GetTodaySpinCount(memberID uuid.UUID) (int64, error)
    GetSpinHistory(memberID uuid.UUID, limit int) ([]domain.LuckyWheelSpin, error)
    GetAllSpins(page, pageSize int) ([]domain.LuckyWheelSpin, int64, error)
    
    // Settings methods
    GetSettings() (*domain.LuckyWheelSetting, error)
    UpdateSettings(settings *domain.LuckyWheelSetting) error
    
    // Stats methods
    GetTotalSpins() (int64, error)
    GetTodaySpins() (int64, error)
    GetTotalPrizeAmount() (float64, error)
    GetTodayPrizeAmount() (float64, error)
    GetActiveMembers() (int64, error)
}
```

#### 3. Use Case Layer

**MemberLuckyWheelUseCase**
```go
type MemberLuckyWheelUseCase struct {
    repo           LuckyWheelRepository
    memberRepo     MemberRepository
    walletUseCase  WalletUseCase
}

Methods:
- GetWheelInfo(memberID uuid.UUID) (*WheelInfoResponse, error)
- SpinWheel(memberID uuid.UUID) (*SpinResultResponse, error)
- GetSpinHistory(memberID uuid.UUID, limit int) ([]SpinHistoryResponse, error)
```

**AdminLuckyWheelUseCase**
```go
type AdminLuckyWheelUseCase struct {
    repo LuckyWheelRepository
}

Methods:
- GetAllPrizes() ([]PrizeResponse, error)
- UpdatePrize(id uint, req UpdatePrizeRequest) error
- UpdatePrizes(prizes []UpdatePrizeRequest) error
- GetSettings() (*SettingsResponse, error)
- UpdateSettings(req UpdateSettingsRequest) error
- GetStats() (*StatsResponse, error)
- GetSpinLogs(page, pageSize int) (*SpinLogsResponse, error)
```

#### 4. Presentation Layer (Handlers)

**Member Handler**
- `GET /api/v1/member/lucky-wheel/info` - ดึงข้อมูลกงล้อและสิทธิ์การหมุน
- `POST /api/v1/member/lucky-wheel/spin` - หมุนกงล้อ
- `GET /api/v1/member/lucky-wheel/history` - ดูประวัติการหมุน

**Admin Handler**
- `GET /api/v1/admin/lucky-wheel/prizes` - ดูรายการรางวัลทั้งหมด
- `PUT /api/v1/admin/lucky-wheel/prizes/:id` - แก้ไขรางวัล
- `PUT /api/v1/admin/lucky-wheel/prizes` - แก้ไขรางวัลหลายรายการ
- `GET /api/v1/admin/lucky-wheel/settings` - ดูการตั้งค่า
- `PUT /api/v1/admin/lucky-wheel/settings` - แก้ไขการตั้งค่า
- `GET /api/v1/admin/lucky-wheel/stats` - ดูสถิติ
- `GET /api/v1/admin/lucky-wheel/logs` - ดูประวัติการหมุนทั้งหมด

### Frontend Components

#### Member Pages

**LuckyWheelPage** (`frontend-member/src/pages/LuckyWheelPage.tsx`)
- Wheel Component: แสดงกงล้อพร้อมรางวัล
- Spin Button: ปุ่มหมุนกงล้อ
- Spin Counter: แสดงจำนวนครั้งที่หมุนได้
- Prize List: แสดงรายการรางวัลและโอกาส
- History List: แสดงประวัติการหมุน
- Rules Section: แสดงกติกา

#### Admin Pages

**LuckyWheelManagement** (`frontend-admin/src/pages/admin/LuckyWheelManagement.tsx`)
- Stats Tab: แสดงสถิติการใช้งาน
- Settings Tab: ตั้งค่าระบบ
- Prizes Tab: จัดการรางวัล
- Logs Tab: ดูประวัติการหมุนทั้งหมด

## Data Models

### Database Schema

**lucky_wheel_prizes**
```sql
id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
name            VARCHAR(100) NOT NULL
type            VARCHAR(20) NOT NULL
amount          DECIMAL(15,2) DEFAULT 0.00
item_name       VARCHAR(200)
item_image      VARCHAR(500)
color           VARCHAR(20) NOT NULL
probability     DECIMAL(5,2) NOT NULL
enabled         BOOLEAN DEFAULT TRUE
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**lucky_wheel_spins**
```sql
id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
member_id       BINARY(16) NOT NULL
prize_id        BIGINT UNSIGNED NOT NULL
prize_name      VARCHAR(100) NOT NULL
prize_type      VARCHAR(20) NOT NULL
amount          DECIMAL(15,2) DEFAULT 0.00
spun_at         TIMESTAMP NOT NULL
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP

INDEX idx_member_id (member_id)
INDEX idx_spun_at (spun_at)
FOREIGN KEY (member_id) REFERENCES members(id)
FOREIGN KEY (prize_id) REFERENCES lucky_wheel_prizes(id)
```

**lucky_wheel_settings**
```sql
id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
max_spins_per_day   INT NOT NULL DEFAULT 3
enabled             BOOLEAN DEFAULT TRUE
reset_time          VARCHAR(10) DEFAULT '00:00'
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### API Request/Response Models

**SpinResultResponse**
```json
{
  "prizeId": 1,
  "prizeName": "50 บาท",
  "prizeType": "cash",
  "amount": 50.00,
  "spinCount": 1,
  "maxSpins": 3
}
```

**WheelInfoResponse**
```json
{
  "prizes": [...],
  "spinCount": 1,
  "maxSpins": 3,
  "canSpin": true,
  "history": [...]
}
```

**StatsResponse**
```json
{
  "totalSpins": 1250,
  "todaySpins": 45,
  "totalPrizeAmount": 125000.00,
  "todayPrizeAmount": 4500.00,
  "activeMembers": 320
}
```

## Probability Engine

### Algorithm

ใช้ Weighted Random Selection Algorithm:

1. รวม probability ของรางวัลทั้งหมดที่ enabled
2. สุ่มตัวเลขระหว่าง 0 ถึงผลรวม probability
3. วนลูปหารางวัลและลบ probability จนกว่าจะถึงรางวัลที่ถูกเลือก

```go
func SelectPrize(prizes []LuckyWheelPrize) *LuckyWheelPrize {
    totalProb := 0.0
    for _, p := range prizes {
        if p.Enabled {
            totalProb += p.Probability
        }
    }
    
    random := rand.Float64() * totalProb
    cumulative := 0.0
    
    for _, p := range prizes {
        if !p.Enabled {
            continue
        }
        cumulative += p.Probability
        if random <= cumulative {
            return &p
        }
    }
    
    return &prizes[len(prizes)-1] // fallback
}
```

## Error Handling

### Error Types

1. **ValidationError**: ข้อมูลไม่ถูกต้อง
2. **AuthorizationError**: ไม่มีสิทธิ์เข้าถึง
3. **QuotaExceededError**: หมุนครบจำนวนแล้ว
4. **SystemDisabledError**: ระบบปิดใช้งาน
5. **DatabaseError**: ข้อผิดพลาดจากฐานข้อมูล

### Error Response Format

```json
{
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "คุณหมุนครบ 3 ครั้งแล้ววันนี้",
    "details": {}
  }
}
```

## Security Considerations

1. **Authentication**: ตรวจสอบ JWT token ในทุก request
2. **Authorization**: แยก endpoint สำหรับ member และ admin
3. **Rate Limiting**: จำกัดจำนวน request ต่อนาที
4. **Input Validation**: ตรวจสอบข้อมูลทุก input
5. **SQL Injection Prevention**: ใช้ prepared statements
6. **Transaction Safety**: ใช้ database transaction สำหรับการหมุนกงล้อ

## Performance Optimization

1. **Caching**: 
   - Cache settings ใน Redis (TTL: 5 minutes)
   - Cache enabled prizes ใน Redis (TTL: 1 minute)

2. **Database Indexing**:
   - Index บน member_id และ spun_at สำหรับ query ที่เร็ว
   - Composite index สำหรับ stats queries

3. **Query Optimization**:
   - ใช้ pagination สำหรับ logs
   - Limit history query เป็น 20 รายการล่าสุด

## Testing Strategy

### Unit Tests
- Repository methods
- Use case business logic
- Probability engine
- Validation functions

### Integration Tests
- API endpoints
- Database operations
- Transaction handling

### E2E Tests
- Member spin flow
- Admin management flow
- Error scenarios

## Deployment Considerations

1. **Database Migration**: ใช้ migrate tool สำหรับ schema changes
2. **Environment Variables**: 
   - `LUCKY_WHEEL_ENABLED`: เปิด/ปิดระบบ
   - `LUCKY_WHEEL_MAX_SPINS`: จำนวนครั้งสูงสุดต่อวัน (default)
3. **Monitoring**: 
   - Log ทุกการหมุนกงล้อ
   - Alert เมื่อมีการแจกรางวัลมูลค่าสูง
4. **Backup**: Backup ตาราง spins ทุกวัน

## Future Enhancements

1. **Special Events**: กงล้อพิเศษในช่วงเทศกาล
2. **VIP Wheels**: กงล้อพิเศษสำหรับ VIP members
3. **Achievements**: รางวัลพิเศษจากการหมุนครบจำนวน
4. **Social Sharing**: แชร์รางวัลที่ได้รับ
5. **Analytics Dashboard**: รายงานเชิงลึกสำหรับ admin
