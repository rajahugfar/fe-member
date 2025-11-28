# Sport และ Poker Game Providers

เอกสารนี้สรุปรายการ Game Providers สำหรับหมวด Sport และ Poker ที่รองรับ Seamless Wallet Integration

## วิธีการใช้งาน

### ติดตั้ง Providers ลงฐานข้อมูล

```bash
# เข้าไปที่ backend directory
cd backend

# รัน migration script
psql -h localhost -U postgres -d bicycle678 -f migrations/add_sport_poker_providers.sql
```

หรือใช้คำสั่ง:

```bash
PGPASSWORD=password psql -h localhost -U postgres -d bicycle678 < migrations/add_sport_poker_providers.sql
```

---

## Sport Providers (15 providers)

รายการ Sport Providers ที่รองรับ **Seamless Wallet**:

| Product Code | Product Name | Category | Image Path | Status |
|-------------|--------------|----------|------------|--------|
| AFB1188 | AFB1188 Sport | Sport | /uploads/providers/sa-gaming.png | Active |
| AMBSPORTBOOK | AMB Sportbook | Sport | /uploads/providers/sa-gaming.png | Active |
| AOG | AOG Sport | Sport | /uploads/providers/sa-gaming.png | Active |
| COCKFIGHT | Cockfight | Sport | /uploads/providers/sa-gaming.png | Active |
| DBSPORT | DB Sport | Sport | /uploads/providers/sa-gaming.png | Active |
| FB_SPORT | FB Sport | Sport | /uploads/providers/sa-gaming.png | Active |
| GA28 | GA28 Sport | Sport | /uploads/providers/sa-gaming.png | Active |
| LALIKA | Lalika Sport | Sport | /uploads/providers/sa-gaming.png | Active |
| MUAYPAKYOK | Muaypakyok | Sport | /uploads/providers/sa-gaming.png | Active |
| SABASPORTS | Saba Sport | Sport | /uploads/providers/sa-gaming.png | Active |
| SBO | Sbobet | Sport | /uploads/providers/sa-gaming.png | Active |
| TFGAME | TF Gaming | Sport | /uploads/providers/sa-gaming.png | Active |
| UFABET | Ufabet+ | Sport | /uploads/providers/sa-gaming.png | Active |
| UMBET | Umbet Sport | Sport | /uploads/providers/sa-gaming.png | Active |
| VIRTUAL_SPORT | Virtual Sportbook | Sport | /uploads/providers/sa-gaming.png | Active |

### ไม่รวม Sport Providers ที่ไม่รองรับ Seamless:
- **MSPORT** (M-Sport) - ไม่รองรับ Seamless Wallet

---

## Poker Providers (2 providers)

รายการ Poker Providers ที่รองรับ **Seamless Wallet**:

| Product Code | Product Name | Category | Image Path | Status |
|-------------|--------------|----------|------------|--------|
| AMBPOKER | Ambpoker | Poker | /uploads/providers/mpoker.png | Active |
| KSGAME | KS Game | Poker | /uploads/providers/mpoker.png | Active |

### ไม่รวม Poker Providers ที่ไม่รองรับ Seamless:
- **KINGMAKER** (KingMidas) - ไม่รองรับ Seamless
- **KINGPOKER** (Kingpoker) - ไม่รองรับ Seamless
- **MIKIWORLD** (Miki Worlds) - ไม่รองรับ Seamless
- **MINILUCK** (Miniluck) - ไม่รองรับ Seamless

---

## การตรวจสอบ

### ตรวจสอบ Providers ในฐานข้อมูล

```sql
-- ดู Sport Providers ทั้งหมด
SELECT product_code, product_name, category, status
FROM game_providers
WHERE category = 'Sport'
ORDER BY product_name;

-- ดู Poker Providers ทั้งหมด
SELECT product_code, product_name, category, status
FROM game_providers
WHERE category = 'Poker'
ORDER BY product_name;

-- สรุปจำนวน Providers แต่ละหมวด
SELECT category, COUNT(*) as total
FROM game_providers
WHERE category IN ('Sport', 'Poker') AND status = 1
GROUP BY category;
```

### ตรวจสอบผ่าน API

```bash
# Sport Providers
curl "http://localhost:8080/api/v1/member/providers?category=Sport"

# Poker Providers
curl "http://localhost:8080/api/v1/member/providers?category=Poker"
```

---

## หมายเหตุ

### รูปภาพ (Image Paths)

**Sport Providers:**
- ปัจจุบันใช้รูป `/uploads/providers/sa-gaming.png` เป็นชั่วคราว
- แนะนำให้อัปโหลดรูปเฉพาะของแต่ละ Sport Provider แล้วอัพเดท `image_path`

**Poker Providers:**
- ใช้รูป `/uploads/providers/mpoker.png`
- มีรูปอยู่แล้วในระบบ

### แหล่งข้อมูล

- **API Documentation:** https://doc.ambsuperapi.com/api-reference.html#product-lists
- **Seamless Support:** เลือกเฉพาะ providers ที่รองรับ Seamless Wallet Integration
- **Migration File:** `backend/migrations/add_sport_poker_providers.sql`

### สถิติ

```
Sport Providers:  15 providers (Seamless support)
Poker Providers:   2 providers (Seamless support)
Total:            17 providers
```

---

## การอัพเดทรูปภาพ

หากต้องการเปลี่ยนรูปของ provider ใด ๆ:

```sql
-- ตัวอย่าง: เปลี่ยนรูป Sbobet
UPDATE game_providers
SET image_path = '/uploads/providers/sbobet.png',
    updated_at = NOW()
WHERE product_code = 'SBO';
```

**ขั้นตอนการเพิ่มรูป:**
1. อัปโหลดรูปไปที่ `backend/uploads/providers/`
2. รันคำสั่ง UPDATE ข้างต้น
3. รีเฟรชหน้าเว็บเพื่อดูผลลัพธ์

---

## ปัญหาที่อาจพบ

### 1. Providers ไม่แสดงใน Frontend

**สาเหตุ:**
- ตรวจสอบว่า `status = 1` (Active)
- ตรวจสอบว่า API endpoint ทำงานถูกต้อง

**วิธีแก้:**
```sql
UPDATE game_providers
SET status = 1
WHERE category IN ('Sport', 'Poker');
```

### 2. รูปภาพไม่แสดง

**สาเหตุ:**
- ไฟล์รูปไม่มีอยู่จริงในโฟลเดอร์

**วิธีแก้:**
- เช็คว่าไฟล์มีอยู่: `ls backend/uploads/providers/`
- อัปโหลดรูปที่ขาดหายไป

---

*เอกสารสร้างโดย: Claude Code*
*วันที่: 2025-11-28*
