# Frontend Admin Turnover System - Complete Documentation

## ✅ สรุปการทำงาน

ระบบ Turnover Frontend สำหรับ Admin Panel พร้อมใช้งานครบทุกฟีเจอร์ 100%

---

## 📁 ไฟล์ที่สร้าง/แก้ไข

### 1. Navigation & Routing

#### `/frontend-admin/src/components/admin/AdminLayout.tsx`
**แก้ไข:**
- เพิ่ม import `FiRepeat` icon
- เพิ่มเมนู "ระบบเทิร์นโอเวอร์" ใน `menuItems` (หลังเมนู "สรุปยอด/รายงาน")
- Sub-menu 4 รายการ:
  - ภาพรวม → `/admin/turnover/overview`
  - สมาชิกและเทิร์น → `/admin/turnover/members`
  - ประวัติการแลก → `/admin/turnover/redemptions`
  - ตั้งค่าระบบ → `/admin/turnover/settings`

#### `/frontend-admin/src/App.tsx`
**แก้ไข:**
- Import หน้า Turnover ทั้ง 4 หน้า
- เพิ่ม Routes:
```tsx
<Route path="turnover">
  <Route index element={<Navigate to="/admin/turnover/overview" replace />} />
  <Route path="overview" element={<TurnoverOverview />} />
  <Route path="members" element={<TurnoverMembers />} />
  <Route path="redemptions" element={<TurnoverRedemptions />} />
  <Route path="settings" element={<TurnoverSettings />} />
</Route>
```

---

### 2. Admin Pages (4 หน้า)

#### A. `/frontend-admin/src/pages/admin/TurnoverOverview.tsx`
**📊 หน้าภาพรวมระบบ**

**ฟีเจอร์:**
- ✅ แสดงสถิติ 4 Card:
  - สมาชิกที่มีเทิร์น (Members with Turnover)
  - เทิร์นรวมทั้งหมด (Total Turnover)
  - ยอดแลกรวม (Total Redeemed)
  - อัตราการแลก (Redemption Rate %)

- ✅ แสดงแยกแหล่งที่มา:
  - เทิร์นจากหวย (Lottery Turnover)
  - เทิร์นจากเกมส์ (Game Turnover)
  - แสดง: จำนวนธุรกรรม, ยอดรวม, สัดส่วน%

- ✅ Quick Links ไปยัง:
  - สมาชิกและเทิร์น
  - ประวัติการแลก
  - ตั้งค่าระบบ

- ✅ แสดงช่วงเวลาข้อมูล (Start Date - End Date)

**API Endpoint:**
```
GET /api/v1/admin/turnover/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "member_count": 1,
    "lottery_count": 5,
    "lottery_total": 15000,
    "game_count": 3,
    "game_total": 3000,
    "redeem_count": 1,
    "redeem_total": 2000
  },
  "period": {
    "startDate": "2025-10-15",
    "endDate": "2025-11-14"
  }
}
```

---

#### B. `/frontend-admin/src/pages/admin/TurnoverMembers.tsx`
**👥 หน้าสมาชิกและเทิร์นโอเวอร์**

**ฟีเจอร์:**
- ✅ ตารางแสดงสมาชิกทั้งหมด
- ✅ คอลัมน์:
  - เบอร์โทร (Phone)
  - ชื่อ-นามสกุล (Fullname)
  - เทิร์นคงเหลือ (Turnover Balance) - สีทอง
  - เทิร์นสะสม (Lifetime Turnover)
  - แลกสะสม (Total Redeemed) - สีเขียว
  - แลกล่าสุด (Last Redeem Date)
  - จัดการ (Actions)

- ✅ ช่องค้นหา (Real-time Search):
  - ค้นหาตามเบอร์โทร
  - ค้นหาตามชื่อสมาชิก

- ✅ ปุ่มจัดการ 2 ปุ่ม:
  - 🟡 ปรับยอดเทิร์น (Adjust) - เปิด Modal
  - 🔵 ดูรายละเอียด (View) - ไปหน้าสมาชิก

**API Endpoint:**
```
GET /api/v1/admin/turnover/members
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "memberId": "a9ade5c3-5bec-4b52-ae40-c17fed52dde9",
      "phone": "0991234567",
      "fullname": "Test Turnover User",
      "turnoverBalance": 16000,
      "turnoverLifetime": 18000,
      "turnoverRedeemed": 2,
      "turnoverLastRedeemAt": "2025-11-12T10:54:47.874266Z",
      "turnoverUpdatedAt": "2025-11-14T10:54:47.874266Z"
    }
  ]
}
```

---

#### C. `/frontend-admin/src/pages/admin/TurnoverRedemptions.tsx`
**💰 หน้าประวัติการแลกเทิร์น**

**ฟีเจอร์:**
- ✅ Summary Cards (3 card):
  - จำนวนการแลก (Count)
  - เทิร์นรวมที่แลก (Total Turnover Redeemed)
  - เงินสดที่จ่ายออก (Total Cash Paid)

- ✅ กรองตามวันที่:
  - วันที่เริ่มต้น (Start Date)
  - วันที่สิ้นสุด (End Date)
  - Default: 30 วันย้อนหลัง

- ✅ ตารางรายการแลก:
  - วันที่-เวลา (Date & Time)
  - สมาชิก (Member Name)
  - เบอร์โทร (Phone)
  - เทิร์นที่แลก (Turnover Amount) - สีน้ำเงิน
  - เงินที่ได้รับ (Cash Received) - สีเขียว
  - อัตราแลก (Exchange Rate %)
  - สถานะ (Status)

**API Endpoint:**
```
GET /api/v1/admin/turnover/transactions?type=REDEEM&startDate=2025-10-15&endDate=2025-11-14
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "memberId": "...",
      "memberPhone": "0991234567",
      "memberName": "Test User",
      "turnoverAmount": 2000,
      "cashReceived": 2.00,
      "exchangeRate": 0.001,
      "status": "completed",
      "createdAt": "2025-11-12T10:54:47.874266Z"
    }
  ]
}
```

---

#### D. `/frontend-admin/src/pages/admin/TurnoverSettings.tsx`
**⚙️ หน้าตั้งค่าระบบเทิร์นโอเวอร์**

**ฟีเจอร์:**

**1. สถานะระบบ:**
- ✅ Checkbox เปิด/ปิดระบบ (isEnabled)

**2. การตั้งค่าการแลก:**
- ✅ อัตราแลก (%) - Exchange Rate
  - ตัวอย่าง: 0.10% = 1000 เทิร์น = 1 บาท
- ✅ ยอดเทิร์นขั้นต่ำในการแลก (Min Turnover to Redeem)
- ✅ ยอดแลกสูงสุดต่อวัน (Max Redeem Per Day)
  - ใส่ 0 หรือเว้นว่าง = ไม่จำกัด

**3. ตั้งค่าแหล่งที่มาเทิร์น:**

**หวย (Lottery):**
- ✅ Checkbox เปิด/ปิดเทิร์นจากหวย
- ✅ ตัวคูณเทิร์นหวย (Multiplier)
- ✅ แสดงตัวอย่างการคำนวณ

**เกมส์ (Game):**
- ✅ Checkbox เปิด/ปิดเทิร์นจากเกมส์
- ✅ ตัวคูณเทิร์นเกมส์ (Multiplier)
- ✅ แสดงตัวอย่างการคำนวณ

**4. คำอธิบายระบบ:**
- ✅ Textarea สำหรับคำอธิบายให้สมาชิกเห็น

**5. ตัวอย่างการแลก (Preview):**
- แสดงตัวอย่าง 3 ระดับ:
  - 10,000 เทิร์น = ? บาท
  - 50,000 เทิร์น = ? บาท
  - 100,000 เทิร์น = ? บาท

**6. ปุ่มจัดการ:**
- ปุ่มรีเซ็ต (Reset to API data)
- ปุ่มบันทึก (Save)

**API Endpoints:**
```
GET /api/v1/admin/turnover/config
PUT /api/v1/admin/turnover/config
```

**Config Object:**
```json
{
  "id": 1,
  "exchangeRate": 0.1,
  "minTurnoverToRedeem": 1000,
  "maxRedeemPerDay": 10000,
  "isEnabled": true,
  "allowLotteryTurnover": true,
  "allowGameTurnover": true,
  "lotteryTurnoverMultiplier": 1,
  "gameTurnoverMultiplier": 1,
  "description": "..."
}
```

---

### 3. Modal Component

#### `/frontend-admin/src/components/admin/modals/AdjustTurnoverModal.tsx`
**🔧 Modal ปรับยอดเทิร์น**

**Props:**
```tsx
interface Props {
  member: Member
  onClose: () => void
  onSuccess: () => void
}
```

**ฟีเจอร์:**
- ✅ แสดงข้อมูลสมาชิก:
  - ชื่อสมาชิก
  - เบอร์โทร
  - เทิร์นปัจจุบัน (Highlighted)

- ✅ เลือกประเภทการปรับ (2 ปุ่ม):
  - 🟢 เพิ่มเทิร์น (ADD)
  - 🔴 ลดเทิร์น (DEDUCT)

- ✅ ระบุจำนวน (Amount):
  - Input type=number
  - Step 0.01
  - Min 0

- ✅ ระบุหมายเหตุ (Remark) *Required*:
  - Textarea
  - Required field

- ✅ Preview Box (แสดงเมื่อกรอกจำนวน):
  - แสดง "ยอดหลังปรับ"
  - แสดง +/- จำนวน

- ✅ ปุ่ม:
  - ยกเลิก (Cancel)
  - ยืนยันการปรับยอด (Confirm)

- ✅ Validation:
  - ตรวจสอบจำนวน > 0
  - ตรวจสอบหมายเหตุไม่ว่าง
  - แสดง Toast error ถ้าไม่ผ่าน

- ✅ Submit:
  - POST request to API
  - แสดง Loading state
  - Toast success/error
  - Callback onSuccess() เมื่อสำเร็จ

**API Endpoint:**
```
POST /api/v1/admin/turnover/members/:id/adjust
```

**Request Body:**
```json
{
  "type": "ADD",
  "amount": 5000,
  "remark": "โบนัสพิเศษ"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Turnover adjusted successfully",
  "data": {
    "memberId": "...",
    "balanceBefore": 16000,
    "balanceAfter": 21000,
    "amount": 5000,
    "type": "ADD"
  }
}
```

---

## 🎨 Design System

### สีที่ใช้ (Dark Theme)

**Background:**
- `bg-admin-bg` - พื้นหลังหลัก (สีเข้ม)
- `bg-admin-card` - พื้นหลัง Card (สีเข้มอ่อน)
- `bg-admin-hover` - Hover state

**Border:**
- `border-admin-border` - สีขอบ

**Text:**
- `text-brown-100` - ข้อความหลัก (สว่าง)
- `text-brown-200` - ข้อความรอง
- `text-brown-300` - ข้อความปกติ
- `text-brown-400` - ข้อความเบา
- `text-brown-500` - ข้อความจาง

**Accent Colors:**
- `text-gold-500` / `bg-gold-500` - สีทอง (Primary)
- `text-green-500` / `bg-green-500` - สีเขียว (Success)
- `text-blue-500` / `bg-blue-500` - สีน้ำเงิน (Info)
- `text-red-500` / `bg-red-500` - สีแดง (Error/Deduct)
- `text-purple-500` / `bg-purple-500` - สีม่วง (Stats)

### Icons (react-icons/fi)
- `FiRepeat` - เมนูเทิร์นโอเวอร์
- `FiUsers` - สมาชิก
- `FiDollarSign` - เงิน/การแลก
- `FiTrendingUp` - อัตราการแลก
- `FiAward` - หวย/เกมส์
- `FiSettings` - ตั้งค่า
- `FiEdit2` - ปรับยอด
- `FiEye` - ดูรายละเอียด
- `FiSearch` - ค้นหา
- `FiCalendar` - วันที่
- `FiSave` - บันทึก
- `FiAlertCircle` - แจ้งเตือน
- `FiX` - ปิด

### Components Pattern

**Card:**
```tsx
<div className="bg-admin-card border border-admin-border rounded-lg p-6">
  {/* Content */}
</div>
```

**Button Primary:**
```tsx
<button className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white font-medium rounded-lg transition-colors">
  บันทึก
</button>
```

**Button Secondary:**
```tsx
<button className="px-4 py-2 bg-admin-hover text-brown-200 hover:bg-admin-border rounded-lg transition-colors">
  ยกเลิก
</button>
```

**Input:**
```tsx
<input
  className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-brown-100 placeholder-brown-500 focus:outline-none focus:border-gold-500"
/>
```

**Table:**
```tsx
<table className="w-full">
  <thead className="bg-admin-hover border-b border-admin-border">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-brown-400 uppercase tracking-wider">
        Header
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-admin-border">
    <tr className="hover:bg-admin-hover transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-brown-100">Data</span>
      </td>
    </tr>
  </tbody>
</table>
```

**Modal:**
```tsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-admin-card border border-admin-border rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
    {/* Content */}
  </div>
</div>
```

---

## 📱 Responsive Design

ทุกหน้าใช้ Responsive Grid:

```tsx
// Stats Cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Source Breakdown
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

// Quick Links
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
```

---

## 🔄 State Management

ทุกหน้าใช้ React Hooks:
- `useState` - Local state
- `useEffect` - Fetch data on mount
- `useNavigate` - Navigation (ถ้าจำเป็น)

ไม่ได้ใช้ Global State Management เพราะแต่ละหน้าเป็นอิสระจากกัน

---

## 🌐 API Integration

### Authentication
ทุก API call ใช้:
```tsx
headers: {
  'Authorization': `Bearer ${localStorage.getItem('admin_selector')}`,
},
credentials: 'include',
```

### Error Handling
```tsx
try {
  const response = await fetch(url, options)
  const data = await response.json()

  if (data.success) {
    // Handle success
    toast.success('Success message')
  } else {
    toast.error(data.message || 'Error message')
  }
} catch (error) {
  console.error('API Error:', error)
  toast.error('Network error')
}
```

### Loading States
```tsx
const [isLoading, setIsLoading] = useState(true)

// Show spinner
{isLoading ? (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
  </div>
) : (
  // Content
)}
```

### Empty States
```tsx
{data.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-brown-400">ไม่พบข้อมูล</p>
  </div>
) : (
  // Show data
)}
```

---

## 🧪 การทดสอบ

### 1. Start Backend
```bash
cd backend
./bin/api
```

### 2. Start Frontend
```bash
cd frontend-admin
npm run dev
```

### 3. Login
- URL: http://localhost:5173/login
- Username: `admin`
- Password: `admin123`

### 4. เข้าเมนู
```
สรุปยอด/รายงาน → ระบบเทิร์นโอเวอร์
```

### 5. ทดสอบ Functions

**หน้าภาพรวม:**
- ✅ ดูสถิติทั้งหมด
- ✅ คลิก Quick Links

**หน้าสมาชิก:**
- ✅ ดูรายการสมาชิก
- ✅ ค้นหาด้วยเบอร์โทร/ชื่อ
- ✅ คลิกปรับยอด
- ✅ กรอก Form + ยืนยัน
- ✅ ตรวจสอบ Toast notification

**หน้าประวัติแลก:**
- ✅ ดูรายการแลก
- ✅ เปลี่ยนช่วงวันที่
- ✅ ตรวจสอบข้อมูลถูกต้อง

**หน้าตั้งค่า:**
- ✅ แก้ไขค่าต่างๆ
- ✅ ดู Preview
- ✅ บันทึก
- ✅ รีเซ็ต

---

## 🚀 Deployment Checklist

- [x] ทุกหน้าใช้ Dark Theme
- [x] ทุก Modal ใช้ Dark Theme
- [x] Responsive ทุกหน้า
- [x] Loading States ทุกหน้า
- [x] Empty States ทุกหน้า
- [x] Error Handling ครบ
- [x] Toast Notifications ครบ
- [x] API Integration ครบ
- [x] Form Validation ครบ
- [x] Thai Locale (dayjs)
- [x] Number Formatting (Thai)
- [x] Icons สวยงาม
- [x] Animation (fade-in, zoom-in)

---

## 📝 Notes

1. **Modal Animation**: ใช้ `animate-in fade-in zoom-in duration-200` (Tailwind v3.4+)
   - ถ้า Tailwind รุ่นเก่ากว่า อาจต้องเพิ่ม custom animation

2. **localStorage Key**: ใช้ `admin_selector` สำหรับ Authorization token

3. **Date Format**: ใช้ `dayjs` กับ locale 'th' สำหรับแสดงวันที่แบบไทย

4. **Number Format**: ใช้ `Intl.NumberFormat('th-TH')` สำหรับจัด Format ตัวเลข

5. **Toast Position**: `top-right` (ตามที่กำหนดใน App.tsx)

---

## 🎉 สรุป

✅ **เสร็จสมบูรณ์ 100%**

- เมนูแสดงใน Sidebar แล้ว
- ทั้ง 4 หน้าพร้อมใช้งาน
- Modal ปรับยอดทำงานได้
- ใช้ Dark Theme ทั้งหมด
- เชื่อมต่อ API ครบ
- UI/UX สวยงาม เป็นมาตรฐาน

**พร้อมใช้งานจริงได้เลย!** 🚀
