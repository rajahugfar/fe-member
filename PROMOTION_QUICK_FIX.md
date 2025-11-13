# 🔧 Quick Fix - Promotion System

## ✅ Frontend แก้ไขเสร็จแล้ว

หน้าโปรโมชั่นตอนนี้มี:
- ✅ Header เหมือนหน้า Invitation
- ✅ โครงสร้างแบบ standalone (ไม่ใช้ MainLayout)
- ✅ Logo + Menu navigation
- ✅ Background สีเข้ม

## ⚠️ Backend API Error - 500

**สาเหตุ:** Backend ยังไม่มี endpoint `/api/v1/promotions`

### วิธีแก้ไข 2 แบบ:

#### แบบที่ 1: ใช้ Mock Data ชั่วคราว (แนะนำ)

แก้ไขใน `PromotionsPage.tsx`:

```typescript
const fetchPromotions = async () => {
  try {
    setLoading(true)
    
    // Mock data ชั่วคราว
    const mockPromotions = [
      {
        id: '1',
        code: 'WELCOME100',
        name: 'โบนัสต้อนรับสมาชิกใหม่ 100%',
        description: 'รับโบนัสสูงสุด 1,000 บาท สำหรับสมาชิกใหม่เท่านั้น',
        type: 'new_member',
        bonus_type: 'percentage',
        bonus_value: 100,
        max_bonus: 1000,
        min_deposit: 100,
        turnover_requirement: 3,
        max_withdraw: 0,
        image_url: '/images/sacasino/banners/fad31dcc94be4093b4d36e7786893ca6.jpg',
        status: 'active',
        is_active: true,
        terms_and_conditions: 'เงื่อนไข: 1. สำหรับสมาชิกใหม่เท่านั้น 2. ฝากขั้นต่ำ 100 บาท'
      },
      {
        id: '2',
        code: 'DAILY30',
        name: 'โบนัสฝากครั้งแรกของวัน 30%',
        description: 'รับโบนัสสูงสุด 500 บาท ทุกวัน',
        type: 'daily_first',
        bonus_type: 'percentage',
        bonus_value: 30,
        max_bonus: 500,
        min_deposit: 200,
        turnover_requirement: 5,
        max_withdraw: 0,
        image_url: '/images/sacasino/banners/6ac8f2cc45f6b89e2266496f03a8f270.jpg',
        status: 'active',
        is_active: true,
        terms_and_conditions: 'เงื่อนไข: 1. รับได้ 1 ครั้งต่อวัน 2. ฝากขั้นต่ำ 200 บาท'
      },
      {
        id: '3',
        code: 'DEPOSIT20',
        name: 'โบนัสฝากเงิน 20%',
        description: 'รับโบนัสสูงสุด 300 บาท รับได้ตลอด',
        type: 'normal',
        bonus_type: 'percentage',
        bonus_value: 20,
        max_bonus: 300,
        min_deposit: 100,
        turnover_requirement: 10,
        max_withdraw: 0,
        image_url: '/images/sacasino/banners/ed589e77f72bb6e2edc67040e18c6de4.jpg',
        status: 'active',
        is_active: true,
        terms_and_conditions: 'เงื่อนไข: 1. รับได้ไม่จำกัด 2. ฝากขั้นต่ำ 100 บาท'
      },
      {
        id: '4',
        code: 'CASHBACK10',
        name: 'คืนยอดเสีย 10%',
        description: 'รับคืนยอดเสียสูงสุด 1,000 บาท ทุกสัปดาห์',
        type: 'cashback',
        bonus_type: 'percentage',
        bonus_value: 10,
        max_bonus: 1000,
        min_deposit: 0,
        turnover_requirement: 1,
        max_withdraw: 0,
        image_url: '/images/sacasino/banners/af6e0b7dacc35d572f58b70a18a5d926.jpg',
        status: 'active',
        is_active: true,
        terms_and_conditions: 'เงื่อนไข: 1. คำนวณจากยอดเสีย 2. จ่ายทุกวันจันทร์'
      }
    ]
    
    setPromotions(mockPromotions)
    
    // Comment out API call ชั่วคราว
    // const response = await fetch('/api/v1/promotions')
    // const data = await response.json()
    // if (data.success) {
    //   setPromotions(data.data || [])
    // }
  } catch (error) {
    console.error('Failed to load promotions:', error)
    toast.error('ไม่สามารถโหลดโปรโมชั่นได้')
  } finally {
    setLoading(false)
  }
}
```

#### แบบที่ 2: เพิ่ม Backend Endpoint (ถาวร)

ต้องเพิ่มใน `main.go`:

```go
// Promotion Services
promotionCRUDService := promotion.NewPromotionCRUDService(postgres.DB)
promotionCRUDHandler := handler.NewPromotionCRUDHandler(promotionCRUDService)

// Public Routes
app.Get("/api/v1/promotions", promotionCRUDHandler.GetActivePromotions)
```

และ run migration:
```bash
cd backend
migrate -path migrations -database "postgresql://..." up
```

---

## 🎯 แนะนำ: ใช้ Mock Data ก่อน

เพราะ:
1. ✅ ใช้งานได้ทันที ไม่ต้องรอ backend
2. ✅ ทดสอบ UI ได้เต็มที่
3. ✅ แก้ไขง่าย เพียง 1 function
4. ✅ เมื่อ backend พร้อม แค่ uncomment API call

---

**Status:** Frontend ✅ พร้อม | Backend ⏳ รอติดตั้ง
