# Settings Integration Guide

## ✅ สิ่งที่สร้างเสร็จแล้ว

### 📊 Database Schema
- **Migration**: `000048_add_complete_site_settings.up.sql`
- **Settings ที่เพิ่ม**: 33 settings แบ่งเป็น 8 กลุ่ม

#### Settings Groups:
1. **general** - ตั้งค่าทั่วไป
   - `site_logo`, `site_name`, `site_alert`, `site_alert_description`

2. **contact** - ข้อมูลติดต่อ
   - `site_line`, `site_line_qrcode`

3. **notification** - การแจ้งเตือน
   - `site_notify_admin`, `site_notify_admin_pincode`, `site_notify_admin_withdraw`

4. **banner** - แบนเนอร์
   - `site_banner1`, `site_banner2`, `site_banner3`

5. **security** - ความปลอดภัย
   - `site_status_pincode_login`, `site_status_pincode`

6. **referral** - ระบบแนะนำเพื่อน
   - `site_aff_step`, `site_aff_percent`, `site_aff_type`, `site_aff_min_withdraw`, `site_aff_promotion`

7. **withdrawal** - การถอนเงิน ⭐
   - `status_withdraw` - เปิด/ปิดการถอนเงิน
   - `site_turn_over` - Turn Over (เท่าของยอดฝาก)
   - `site_perday_withdraw` - จำนวนครั้งถอนต่อวัน
   - `site_max_withdraw` - ถอนเงินสูงสุดต่อครั้ง
   - `site_max_auto_withdraw` - ถอนเงินสูงสุดต่อครั้ง (AUTO)
   - `site_status_pincode_withdraw` - ยืนยันรหัสรายการถอน
   - `site_force_all_withdrawals` - บังคับถอนทั้งหมด
   - `site_status_kbank_withdraw` - บังคับถอนเป็น KBANK

8. **cashback** - คืนยอดเสีย
   - `site_cashback_enable`, `site_cashback_percent`, `site_cashback_time_start`, `site_cashback_time_end`, `site_cashback_turnover`

9. **integration** - การเชื่อมต่อระบบภายนอก ⭐
   - `site_amb_auth_token` - Auth Token AMB Transfer
   - `site_amb_auth_token_seamless` - Auth Token AMB Seamless

---

## 🔧 Backend API

### Repository Layer
```go
// SettingsRepository - CRUD operations
type SettingsRepository interface {
    GetAll(ctx context.Context) ([]entity.SiteSetting, error)
    GetByKey(ctx context.Context, key string) (*entity.SiteSetting, error)
    GetByGroup(ctx context.Context, groupName string) ([]entity.SiteSetting, error)
    Update(ctx context.Context, key string, value string) error
    UpdateMultiple(ctx context.Context, settings map[string]string) error
}
```

### Service Layer
```go
// SettingsService - Business logic
type SettingsService struct {
    repo repository.SettingsRepository
}

// Methods:
- GetAllSettings() - ดึงทั้งหมด
- GetAllGrouped() - ดึงแบบแยกกลุ่ม
- GetSettingsByGroup(groupName) - ดึงตามกลุ่ม
- UpdateSettings(updates) - อัพเดทหลายตัว
- GetPublicSettings() - ดึงเฉพาะที่ public ได้
```

### Withdrawal Settings Service ⭐
```go
// WithdrawalSettingsService - Integration กับระบบถอนเงิน
type WithdrawalSettingsService struct {
    settingsRepo   repository.SettingsRepository
    withdrawalRepo repository.WithdrawalRepository
}

// Methods:
- GetWithdrawalLimits() - ดึงข้อมูลวงเงินทั้งหมด
- ValidateWithdrawal(memberID, amount) - ตรวจสอบก่อนถอน
- CanAutoApprove(amount) - เช็คว่าอนุมัติอัตโนมัติได้ไหม
- GetTurnOverRequirement() - ดึง Turn Over requirement
- RequiresPincode() - เช็คว่าต้องใช้ Pincode ไหม
- ShouldForceAllWithdrawal() - เช็คว่าบังคับถอนทั้งหมดไหม
- ShouldForceKBANK() - เช็คว่าบังคับ KBANK ไหม
```

### API Endpoints

#### Admin Routes (Protected)
```
GET  /api/v1/admin/settings              - ดึงทั้งหมดแบบ grouped
GET  /api/v1/admin/settings/group/:group - ดึงตามกลุ่ม
PUT  /api/v1/admin/settings              - อัพเดทหลายตัว
```

#### Public Routes (No Auth)
```
GET  /api/v1/public/settings - ดึง settings ที่ public ได้
```

---

## 🎨 Frontend

### Admin Settings Page
**Path**: `/admin/settings`

#### Components:
1. **SystemTab** - ตั้งค่าระบบ, Banner, Pincode, Referral
2. **LimitsTab** - วงเงิน, Cashback, AMB Token ⭐
3. **LineNotifyTab** - (Placeholder)
4. **TelegramTab** - (Placeholder)
5. **BankAccountsTab** - (Placeholder)

### TypeScript Types
```typescript
interface LimitSettings {
  statusWithdraw: boolean;
  turnOver: number;
  perdayWithdraw: number;
  maxWithdraw: number;
  maxAutoWithdraw: number;
  statusPincodeWithdraw: boolean;
  notifyAdminWithdraw: string;
  forceAllWithdrawals: boolean;
  statusKbankWithdraw: boolean;
  cashbackEnable: boolean;
  cashbackPercent: number;
  cashbackTimeStart: number;
  cashbackTimeEnd: number;
  cashbackTurnover: boolean;
  ambAuthToken: string;
  ambAuthTokenSeamless: string;
}
```

---

## 🔌 Integration Points

### 1. Withdrawal System Integration ⭐

#### ก่อนสร้างรายการถอน:
```go
// ใน member_withdrawal_usecase.go
func (uc *MemberWithdrawalUseCase) CreateWithdrawal(ctx context.Context, memberID uuid.UUID, req *CreateWithdrawalRequest) (*WithdrawalResponse, error) {
    
    // 1. Validate กับ Settings
    err := uc.withdrawalSettingsService.ValidateWithdrawal(ctx, memberID, req.Amount)
    if err != nil {
        return nil, err
    }
    
    // 2. Check Turn Over
    turnover, _ := uc.withdrawalSettingsService.GetTurnOverRequirement(ctx)
    // ตรวจสอบว่าเล่นครบ turnover หรือยัง
    
    // 3. Check Auto Approval
    canAuto, _ := uc.withdrawalSettingsService.CanAutoApprove(ctx, req.Amount)
    
    // 4. Check Force All
    forceAll, _ := uc.withdrawalSettingsService.ShouldForceAllWithdrawal(ctx)
    if forceAll {
        req.Amount = member.CreditGame // ถอนทั้งหมด
    }
    
    // 5. Check Force KBANK
    forceKBANK, _ := uc.withdrawalSettingsService.ShouldForceKBANK(ctx)
    if forceKBANK && member.BankCode != "KBANK" {
        return nil, fmt.Errorf("only KBANK withdrawals are allowed")
    }
    
    // ... สร้างรายการถอน
}
```

#### Validation Rules:
- ✅ เช็คว่าเปิดการถอนหรือไม่ (`status_withdraw`)
- ✅ เช็คยอดถอนสูงสุด (`site_max_withdraw`)
- ✅ เช็คจำนวนครั้งถอนต่อวัน (`site_perday_withdraw`)
- ✅ เช็ค Auto Approval (`site_max_auto_withdraw`)

---

### 2. AMB Gateway Integration ⭐

#### AMB คืออะไร?
AMB (Asia Gaming Platform) เป็น Game Provider Gateway ที่ใช้สำหรับ:
- สร้างบัญชีเกม (Create Game Account)
- โอนเครดิตเข้า-ออกเกม (Transfer In/Out)
- เปิดเกม (Launch Game)
- เช็คยอดเงิน (Get Balance)

#### AMB Gateway Structure:
```go
type AMBGateway struct {
    apiURL     string  // URL ของ AMB API
    agentCode  string  // รหัส Agent
    secretKey  string  // Secret Key สำหรับ sign
    currency   string  // สกุลเงิน (THB)
    walletType string  // ประเภท wallet (transfer/seamless)
}
```

#### AMB Token Usage:

**1. Transfer Wallet** (`site_amb_auth_token`)
- ใช้สำหรับ **Transfer Wallet** แบบปกติ
- ต้องโอนเครดิตเข้า-ออกเกมด้วยตัวเอง
- Flow: Main Wallet → Game Wallet → Play → Transfer Out

**2. Seamless Wallet** (`site_amb_auth_token_seamless`)
- ใช้สำหรับ **Seamless Wallet** 
- ไม่ต้องโอนเครดิต เล่นได้เลย
- Flow: Main Wallet → Play (ตัดเครดิตอัตโนมัติ)

#### การใช้งาน AMB Token:
```go
// ใน config.go
type Config struct {
    AMB struct {
        APIURL              string
        AgentCode           string
        SecretKey           string  // จาก site_amb_auth_token
        Currency            string
        WalletType          string
        
        // Seamless
        SeamlessSecretKey   string  // จาก site_amb_auth_token_seamless
    }
}

// ใน amb_gateway.go
func NewAMBGateway(apiURL, agentCode, secretKey, currency, walletType string) gateway.GameGateway {
    return &AMBGateway{
        apiURL:     apiURL,
        agentCode:  agentCode,
        secretKey:  secretKey,  // ใช้ token จาก settings
        currency:   currency,
        walletType: walletType,
    }
}
```

#### AMB API Methods:
```go
// สร้างบัญชีเกม
CreateGameAccount(ctx, memberID, username, password) error

// เช็คยอดเงิน
GetBalance(ctx, memberID) (float64, error)

// โอนเข้าเกม
TransferIn(ctx, memberID, amount, txID) error

// โอนออกจากเกม
TransferOut(ctx, memberID, amount, txID) error

// เปิดเกม
LaunchGame(ctx, memberID, gameCode, platform, language) (string, error)
```

---

## 📝 TODO: Integration Tasks

### ✅ Completed
- [x] สร้าง Migration สำหรับ Settings
- [x] สร้าง Repository, Service, Handler
- [x] สร้าง Admin Settings Page (Frontend)
- [x] สร้าง WithdrawalSettingsService
- [x] เพิ่ม CountTodayByMemberID ใน WithdrawalRepository

### 🔄 In Progress
- [ ] Wire up SettingsHandler ใน main.go
- [ ] Run Migration
- [ ] Update MemberWithdrawalUseCase ให้ใช้ WithdrawalSettingsService

### 📋 Pending
- [ ] Integrate Settings กับ Deposit System
- [ ] Integrate Settings กับ Cashback System
- [ ] Load AMB Token จาก Settings แทน Config
- [ ] สร้าง Settings Context สำหรับ Frontend
- [ ] Integrate Settings กับ Landing Page (Logo, Banner, Line)
- [ ] Integrate Settings กับ Member Pages (Alert, Limits)
- [ ] สร้าง Line Notify Tab (จัดการ Line Tokens)
- [ ] สร้าง Telegram Tab (จัดการ Telegram Bots)
- [ ] สร้าง Bank Accounts Tab (จัดการบัญชีธนาคาร)

---

## 🚀 การใช้งาน

### 1. Run Migration
```bash
cd backend
psql $DATABASE_URL < migrations/000048_add_complete_site_settings.up.sql
```

### 2. ตั้งค่าผ่าน Admin Panel
1. เข้า `/admin/settings`
2. ไปที่ Tab "วงเงินและข้อจำกัด"
3. ตั้งค่า:
   - Turn Over
   - จำนวนครั้งถอนต่อวัน
   - ถอนสูงสุดต่อครั้ง
   - AMB Auth Token

### 3. ตรวจสอบการทำงาน
```bash
# ดึง Settings
curl http://localhost:8080/api/v1/admin/settings

# อัพเดท Settings
curl -X PUT http://localhost:8080/api/v1/admin/settings \
  -H "Content-Type: application/json" \
  -d '{
    "site_turn_over": "1.5",
    "site_max_withdraw": "100000",
    "site_amb_auth_token": "your-token-here"
  }'
```

---

## 💡 Best Practices

### 1. Settings Caching
```go
// แนะนำให้ cache settings เพื่อลด DB queries
type SettingsCache struct {
    settings map[string]interface{}
    mu       sync.RWMutex
    ttl      time.Duration
}
```

### 2. Settings Validation
```go
// Validate ก่อน save
func ValidateSettings(key, value string) error {
    switch key {
    case "site_turn_over":
        v, err := strconv.ParseFloat(value, 64)
        if err != nil || v < 0 {
            return fmt.Errorf("invalid turnover value")
        }
    case "site_max_withdraw":
        v, err := strconv.ParseFloat(value, 64)
        if err != nil || v <= 0 {
            return fmt.Errorf("invalid max withdrawal")
        }
    }
    return nil
}
```

### 3. AMB Token Security
```go
// ไม่ควร expose token ใน public API
func (s *SettingsService) GetPublicSettings(ctx context.Context) (map[string]interface{}, error) {
    // ไม่ return sensitive keys
    excludeKeys := []string{
        "site_amb_auth_token",
        "site_amb_auth_token_seamless",
        "site_notify_admin",
    }
    // ...
}
```

---

## 📚 References

- **AMB Gateway**: `/backend/internal/infrastructure/gateway/amb_gateway.go`
- **Withdrawal UseCase**: `/backend/internal/usecase/member/member_withdrawal_usecase.go`
- **Settings Migration**: `/backend/migrations/000048_add_complete_site_settings.up.sql`
- **Admin Settings Page**: `/frontend-admin/src/pages/admin/SystemSettings.tsx`
