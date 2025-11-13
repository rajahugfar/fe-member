# 🎁 Promotion Member Flow Design

## 📋 Overview
ระบบตรวจสอบสิทธิ์และการรับโปรโมชั่นสำหรับ Member พร้อม Turnover Tracking

---

## 🔄 Flow Diagram

```
Member → ดูโปรโมชั่น → ตรวจสอบสิทธิ์ → กดรับโปร → บันทึก Log → ติดตาม Turnover
```

---

## 🎯 1. API Endpoints

### 1.1 ดูโปรโมชั่นที่มี (Member)
```
GET /api/v1/member/promotions/available
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "โปรสมาชิกใหม่ 100%",
      "description": "รับโบนัส 100% สูงสุด 5,000 บาท",
      "image_url": "/uploads/promotions/promo-1.jpg",
      "promotion_type": "new_member",
      "bonus_type": "percentage",
      "bonus_value": 100,
      "max_bonus": 5000,
      "min_deposit": 100,
      "turnover_multiplier": 10,
      "is_active": true,
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-12-31T23:59:59Z",
      
      // สิทธิ์การรับ
      "eligibility": {
        "is_eligible": true,
        "can_claim": true,
        "reason": null,
        "requirements": {
          "min_deposit": 100,
          "is_new_member": true,
          "has_claimed_before": false,
          "daily_limit_reached": false
        }
      }
    }
  ]
}
```

### 1.2 ตรวจสอบสิทธิ์โปรโมชั่น
```
GET /api/v1/member/promotions/:id/check-eligibility
```

**Response:**
```json
{
  "success": true,
  "data": {
    "promotion_id": "uuid",
    "is_eligible": true,
    "can_claim": true,
    "reason": null,
    "requirements": {
      "min_deposit": 100,
      "is_new_member": true,
      "has_claimed_before": false,
      "daily_limit_reached": false,
      "current_deposit": 500
    },
    "estimated_bonus": 500,
    "turnover_required": 5000
  }
}
```

**กรณีไม่มีสิทธิ์:**
```json
{
  "success": true,
  "data": {
    "is_eligible": false,
    "can_claim": false,
    "reason": "คุณได้รับโปรนี้ไปแล้ว",
    "requirements": {
      "has_claimed_before": true
    }
  }
}
```

### 1.3 รับโปรโมชั่น (Claim)
```
POST /api/v1/member/promotions/:id/claim
```

**Request Body:**
```json
{
  "deposit_id": "uuid",  // ID ของการฝากที่ต้องการใช้โปร (optional สำหรับบางประเภท)
  "deposit_amount": 500  // จำนวนเงินฝาก
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "member_promotion_id": "uuid",
    "promotion_id": "uuid",
    "promotion_name": "โปรสมาชิกใหม่ 100%",
    "deposit_amount": 500,
    "bonus_amount": 500,
    "total_amount": 1000,
    "turnover_required": 5000,
    "turnover_completed": 0,
    "turnover_remaining": 5000,
    "status": "active",
    "claimed_at": "2024-01-15T10:30:00Z",
    "expires_at": "2024-01-22T10:30:00Z"
  }
}
```

### 1.4 ดูโปรโมชั่นที่กำลังใช้งาน
```
GET /api/v1/member/promotions/active
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "promotion_name": "โปรสมาชิกใหม่ 100%",
      "deposit_amount": 500,
      "bonus_amount": 500,
      "total_amount": 1000,
      "turnover_required": 5000,
      "turnover_completed": 1250,
      "turnover_remaining": 3750,
      "turnover_percentage": 25,
      "status": "active",
      "claimed_at": "2024-01-15T10:30:00Z",
      "expires_at": "2024-01-22T10:30:00Z",
      "days_remaining": 7
    }
  ]
}
```

### 1.5 ดูประวัติโปรโมชั่น
```
GET /api/v1/member/promotions/history
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "promotion_name": "โปรฝากรายวัน 50%",
      "deposit_amount": 1000,
      "bonus_amount": 500,
      "turnover_required": 5000,
      "turnover_completed": 5000,
      "status": "completed",
      "claimed_at": "2024-01-10T10:00:00Z",
      "completed_at": "2024-01-12T15:30:00Z"
    }
  ]
}
```

---

## 🗄️ 2. Database Schema

### 2.1 ตาราง `member_promotions` (ปรับปรุง)
```sql
CREATE TABLE member_promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id),
    promotion_id UUID NOT NULL REFERENCES promotions(id),
    deposit_id UUID REFERENCES deposits(id),
    
    -- จำนวนเงิน
    deposit_amount DECIMAL(15,2) NOT NULL,
    bonus_amount DECIMAL(15,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    
    -- Turnover
    turnover_required DECIMAL(15,2) NOT NULL,
    turnover_completed DECIMAL(15,2) DEFAULT 0,
    turnover_multiplier INT NOT NULL,
    
    -- สถานะ
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    -- active: กำลังใช้งาน
    -- completed: ทำ turnover ครบแล้ว
    -- expired: หมดอายุ
    -- cancelled: ยกเลิก
    
    -- วันที่
    claimed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_member_promotions_member_id (member_id),
    INDEX idx_member_promotions_status (status),
    INDEX idx_member_promotions_claimed_at (claimed_at)
);
```

### 2.2 ตาราง `promotion_logs` (ใหม่)
```sql
CREATE TABLE promotion_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id),
    promotion_id UUID NOT NULL REFERENCES promotions(id),
    member_promotion_id UUID REFERENCES member_promotions(id),
    
    action VARCHAR(50) NOT NULL,
    -- viewed: ดูโปร
    -- checked_eligibility: ตรวจสอบสิทธิ์
    -- claimed: รับโปร
    -- turnover_updated: อัพเดท turnover
    -- completed: ทำ turnover ครบ
    -- expired: หมดอายุ
    -- cancelled: ยกเลิก
    
    details JSONB,
    -- เก็บรายละเอียดเพิ่มเติม เช่น
    -- { "deposit_amount": 500, "bonus_amount": 500, "reason": "..." }
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_promotion_logs_member_id (member_id),
    INDEX idx_promotion_logs_action (action),
    INDEX idx_promotion_logs_created_at (created_at)
);
```

### 2.3 ตาราง `turnover_tracking` (ใหม่)
```sql
CREATE TABLE turnover_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_promotion_id UUID NOT NULL REFERENCES member_promotions(id),
    member_id UUID NOT NULL REFERENCES members(id),
    
    -- Transaction ที่นับเป็น turnover
    transaction_id UUID REFERENCES transactions(id),
    game_transaction_id VARCHAR(255),
    
    -- จำนวน
    bet_amount DECIMAL(15,2) NOT NULL,
    win_amount DECIMAL(15,2) DEFAULT 0,
    turnover_amount DECIMAL(15,2) NOT NULL,
    -- turnover_amount = bet_amount (นับเฉพาะยอดเดิมพัน)
    
    -- ข้อมูลเกม
    game_provider VARCHAR(50),
    game_name VARCHAR(255),
    game_type VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_turnover_tracking_member_promotion_id (member_promotion_id),
    INDEX idx_turnover_tracking_member_id (member_id),
    INDEX idx_turnover_tracking_created_at (created_at)
);
```

---

## 🔐 3. Business Logic

### 3.1 การตรวจสอบสิทธิ์ (Eligibility Check)

```go
type EligibilityChecker struct {
    memberRepo     repository.MemberRepository
    promotionRepo  repository.PromotionRepository
    depositRepo    repository.DepositRepository
}

func (c *EligibilityChecker) CheckEligibility(
    memberID uuid.UUID,
    promotionID uuid.UUID,
    depositAmount float64,
) (*EligibilityResult, error) {
    
    // 1. ดึงข้อมูลโปรโมชั่น
    promotion, err := c.promotionRepo.GetByID(promotionID)
    if err != nil {
        return nil, err
    }
    
    // 2. ตรวจสอบว่าโปรเปิดใช้งานอยู่หรือไม่
    if !promotion.IsActive {
        return &EligibilityResult{
            IsEligible: false,
            Reason: "โปรโมชั่นนี้ปิดใช้งานแล้ว",
        }, nil
    }
    
    // 3. ตรวจสอบวันที่
    now := time.Now()
    if promotion.StartDate.After(now) {
        return &EligibilityResult{
            IsEligible: false,
            Reason: "โปรโมชั่นยังไม่เริ่ม",
        }, nil
    }
    if promotion.EndDate != nil && promotion.EndDate.Before(now) {
        return &EligibilityResult{
            IsEligible: false,
            Reason: "โปรโมชั่นหมดอายุแล้ว",
        }, nil
    }
    
    // 4. ตรวจสอบยอดฝากขั้นต่ำ
    if depositAmount < promotion.MinDeposit {
        return &EligibilityResult{
            IsEligible: false,
            Reason: fmt.Sprintf("ยอดฝากขั้นต่ำ %d บาท", promotion.MinDeposit),
        }, nil
    }
    
    // 5. ตรวจสอบตามประเภทโปร
    switch promotion.PromotionType {
    case "new_member":
        return c.checkNewMemberEligibility(memberID, promotionID)
    case "daily_first":
        return c.checkDailyFirstEligibility(memberID, promotionID)
    case "normal":
        return c.checkNormalEligibility(memberID, promotionID)
    default:
        return &EligibilityResult{IsEligible: true}, nil
    }
}

func (c *EligibilityChecker) checkNewMemberEligibility(
    memberID uuid.UUID,
    promotionID uuid.UUID,
) (*EligibilityResult, error) {
    // ตรวจสอบว่าเคยรับโปรนี้หรือยัง
    hasClaimed, err := c.promotionRepo.HasMemberClaimedPromotion(memberID, promotionID)
    if err != nil {
        return nil, err
    }
    
    if hasClaimed {
        return &EligibilityResult{
            IsEligible: false,
            Reason: "คุณได้รับโปรนี้ไปแล้ว",
        }, nil
    }
    
    return &EligibilityResult{IsEligible: true}, nil
}

func (c *EligibilityChecker) checkDailyFirstEligibility(
    memberID uuid.UUID,
    promotionID uuid.UUID,
) (*EligibilityResult, error) {
    // ตรวจสอบว่าวันนี้เคยรับหรือยัง
    hasClaimedToday, err := c.promotionRepo.HasMemberClaimedPromotionToday(memberID, promotionID)
    if err != nil {
        return nil, err
    }
    
    if hasClaimedToday {
        return &EligibilityResult{
            IsEligible: false,
            Reason: "คุณได้รับโปรวันนี้แล้ว",
        }, nil
    }
    
    return &EligibilityResult{IsEligible: true}, nil
}
```

### 3.2 การรับโปรโมชั่น (Claim Promotion)

```go
func (s *PromotionService) ClaimPromotion(
    memberID uuid.UUID,
    promotionID uuid.UUID,
    depositID uuid.UUID,
    depositAmount float64,
) (*MemberPromotion, error) {
    
    // 1. ตรวจสอบสิทธิ์
    eligibility, err := s.CheckEligibility(memberID, promotionID, depositAmount)
    if err != nil {
        return nil, err
    }
    if !eligibility.IsEligible {
        return nil, errors.New(eligibility.Reason)
    }
    
    // 2. คำนวณโบนัส
    promotion, _ := s.promotionRepo.GetByID(promotionID)
    bonusAmount := s.calculateBonus(promotion, depositAmount)
    totalAmount := depositAmount + bonusAmount
    
    // 3. คำนวณ turnover
    turnoverRequired := totalAmount * float64(promotion.TurnoverMultiplier)
    
    // 4. สร้าง member_promotion
    memberPromotion := &MemberPromotion{
        MemberID:           memberID,
        PromotionID:        promotionID,
        DepositID:          &depositID,
        DepositAmount:      depositAmount,
        BonusAmount:        bonusAmount,
        TotalAmount:        totalAmount,
        TurnoverRequired:   turnoverRequired,
        TurnoverCompleted:  0,
        TurnoverMultiplier: promotion.TurnoverMultiplier,
        Status:             "active",
        ClaimedAt:          time.Now(),
        ExpiresAt:          time.Now().AddDate(0, 0, 7), // หมดอายุใน 7 วัน
    }
    
    // 5. บันทึกลงฐานข้อมูล
    err = s.promotionRepo.CreateMemberPromotion(memberPromotion)
    if err != nil {
        return nil, err
    }
    
    // 6. เพิ่มเครดิตให้ member
    err = s.memberRepo.AddCredit(memberID, bonusAmount, "promotion_bonus")
    if err != nil {
        return nil, err
    }
    
    // 7. บันทึก log
    s.logPromotionAction(memberID, promotionID, "claimed", map[string]interface{}{
        "deposit_amount": depositAmount,
        "bonus_amount": bonusAmount,
        "turnover_required": turnoverRequired,
    })
    
    return memberPromotion, nil
}
```

### 3.3 การอัพเดท Turnover

```go
func (s *PromotionService) UpdateTurnover(
    memberID uuid.UUID,
    betAmount float64,
    winAmount float64,
    gameInfo GameInfo,
) error {
    
    // 1. หาโปรที่กำลังใช้งาน
    activePromotions, err := s.promotionRepo.GetActiveMemberPromotions(memberID)
    if err != nil {
        return err
    }
    
    if len(activePromotions) == 0 {
        return nil // ไม่มีโปรที่ต้องทำ turnover
    }
    
    // 2. อัพเดท turnover แต่ละโปร
    for _, promo := range activePromotions {
        // นับเฉพาะยอดเดิมพัน
        turnoverAmount := betAmount
        
        // บันทึก turnover tracking
        tracking := &TurnoverTracking{
            MemberPromotionID: promo.ID,
            MemberID:          memberID,
            BetAmount:         betAmount,
            WinAmount:         winAmount,
            TurnoverAmount:    turnoverAmount,
            GameProvider:      gameInfo.Provider,
            GameName:          gameInfo.Name,
            GameType:          gameInfo.Type,
        }
        s.turnoverRepo.Create(tracking)
        
        // อัพเดท turnover ใน member_promotion
        promo.TurnoverCompleted += turnoverAmount
        
        // ตรวจสอบว่าทำครบหรือยัง
        if promo.TurnoverCompleted >= promo.TurnoverRequired {
            promo.Status = "completed"
            promo.CompletedAt = time.Now()
            
            // ปลดล็อคเครดิต (ถ้ามีการล็อค)
            s.memberRepo.UnlockCredit(memberID, promo.BonusAmount)
            
            // บันทึก log
            s.logPromotionAction(memberID, promo.PromotionID, "completed", nil)
        }
        
        s.promotionRepo.UpdateMemberPromotion(promo)
    }
    
    return nil
}
```

---

## 🎨 4. Frontend Components (Member)

### 4.1 หน้าโปรโมชั่น
```typescript
// PromotionList.tsx
interface Promotion {
  id: string
  name: string
  description: string
  image_url: string
  bonus_type: string
  bonus_value: number
  max_bonus: number
  min_deposit: number
  turnover_multiplier: number
  eligibility: {
    is_eligible: boolean
    can_claim: boolean
    reason: string | null
  }
}

const PromotionList = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  
  useEffect(() => {
    loadPromotions()
  }, [])
  
  const loadPromotions = async () => {
    const response = await fetch('/api/v1/member/promotions/available')
    const data = await response.json()
    setPromotions(data.data)
  }
  
  const handleClaim = async (promotionId: string) => {
    // แสดง modal ให้กรอกยอดฝาก
    // ...
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {promotions.map(promo => (
        <PromotionCard 
          key={promo.id}
          promotion={promo}
          onClaim={handleClaim}
        />
      ))}
    </div>
  )
}
```

### 4.2 การ์ดโปรโมชั่น
```typescript
// PromotionCard.tsx
const PromotionCard = ({ promotion, onClaim }) => {
  return (
    <div className="card">
      <img src={promotion.image_url} alt={promotion.name} />
      <h3>{promotion.name}</h3>
      <p>{promotion.description}</p>
      
      <div className="details">
        <div>โบนัส: {promotion.bonus_value}%</div>
        <div>สูงสุด: {promotion.max_bonus} บาท</div>
        <div>ฝากขั้นต่ำ: {promotion.min_deposit} บาท</div>
        <div>Turnover: x{promotion.turnover_multiplier}</div>
      </div>
      
      {promotion.eligibility.is_eligible ? (
        <button onClick={() => onClaim(promotion.id)}>
          รับโปรโมชั่น
        </button>
      ) : (
        <div className="ineligible">
          {promotion.eligibility.reason}
        </div>
      )}
    </div>
  )
}
```

### 4.3 หน้าโปรที่กำลังใช้งาน
```typescript
// ActivePromotions.tsx
const ActivePromotions = () => {
  const [activePromotions, setActivePromotions] = useState([])
  
  return (
    <div>
      {activePromotions.map(promo => (
        <div key={promo.id} className="active-promo-card">
          <h4>{promo.promotion_name}</h4>
          
          <div className="amounts">
            <div>ยอดฝาก: {promo.deposit_amount}</div>
            <div>โบนัส: {promo.bonus_amount}</div>
            <div>รวม: {promo.total_amount}</div>
          </div>
          
          <div className="turnover-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${promo.turnover_percentage}%` }}
              />
            </div>
            <div className="progress-text">
              {promo.turnover_completed} / {promo.turnover_required}
              ({promo.turnover_percentage}%)
            </div>
          </div>
          
          <div className="expires">
            หมดอายุใน {promo.days_remaining} วัน
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## 📊 5. Admin Dashboard

### 5.1 รายงานโปรโมชั่น
- จำนวนการรับโปรแต่ละประเภท
- ยอดโบนัสที่แจกออกไป
- Turnover ที่ทำได้
- อัตราการทำ Turnover สำเร็จ

### 5.2 การจัดการโปรของ Member
- ดูรายการโปรที่ member กำลังใช้
- ยกเลิกโปร (กรณีพิเศษ)
- ปรับ Turnover (กรณีพิเศษ)

---

## ✅ 6. Checklist Implementation

### Backend:
- [ ] สร้าง API endpoints ทั้งหมด
- [ ] สร้าง/ปรับปรุง database tables
- [ ] Implement eligibility checker
- [ ] Implement claim promotion logic
- [ ] Implement turnover tracking
- [ ] เพิ่ม promotion logs
- [ ] Unit tests

### Frontend (Member):
- [ ] หน้าโปรโมชั่นทั้งหมด
- [ ] Modal รับโปร
- [ ] หน้าโปรที่กำลังใช้งาน
- [ ] Progress bar turnover
- [ ] หน้าประวัติโปร

### Frontend (Admin):
- [ ] รายงานโปรโมชั่น
- [ ] จัดการโปรของ member
- [ ] Dashboard สถิติ

---

## 🚀 Next Steps

1. **Phase 1:** สร้าง database schema และ migrations
2. **Phase 2:** Implement backend APIs
3. **Phase 3:** สร้าง member frontend
4. **Phase 4:** เพิ่ม admin management
5. **Phase 5:** Testing และ deployment

**พร้อมเริ่มทำ Phase ไหนก่อนครับ?** 🎯
