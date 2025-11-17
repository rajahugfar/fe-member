# การแก้ไขหน้าผลหวย (Lottery Results)

## สรุปการแก้ไข

แก้ไขหน้าผลหวยให้แสดงผลตามเงื่อนไขดังนี้:
- **หวยทั่วไป**: แสดงเฉพาะของวันที่เลือก (default: วันนี้)
- **หวยพิเศษ (GLO, BAAC, ออมสิน)**: แสดงผลล่าสุดเสมอ ไม่จำกัดวันที่

## ไฟล์ที่แก้ไข

### 1. Backend Repository
**ไฟล์**: `backend/internal/infrastructure/repository/postgres/stock_master_repository.go`

**การเปลี่ยนแปลง**:
- แก้ไข `GetAll()` ให้รองรับ filter `date` และ `huay_codes`
- เพิ่ม query filter สำหรับ `DATE(stock_time) = $date`
- เพิ่ม query filter สำหรับ `huay_code IN (codes...)`

**SQL Query ที่เพิ่ม**:
```sql
-- Filter by date
AND DATE(stock_time) = $1

-- Filter by huay codes
AND huay_code IN ($1, $2, $3, ...)
```

### 2. Backend Handler
**ไฟล์**: `backend/internal/presentation/http/handler/member_lottery_handler.go`

**การเปลี่ยนแปลง**:
- แก้ไข `GetLotteryResults()` ให้รองรับการกรองหวยพิเศษ
- เพิ่มรายการ `specialLotteryCodes` สำหรับหวยที่ต้องแสดงผลล่าสุด: `["GLO", "BAAC", "GSB", "OMSIN"]`
- ดึงข้อมูลหวยทั่วไปของวันที่เลือก (ยกเว้นหวยพิเศษ)
- ดึงข้อมูลหวยพิเศษล่าสุดแยกต่างหาก (ใช้ filter `huay_codes`)
- รวมผลลัพธ์ทั้งสองส่วนก่อนส่งกลับ

**Logic**:
```go
// 1. ดึงหวยทั่วไปของวันที่เลือก (ทั้งหมด)
regularFilters := map[string]any{
    "status": 2,
    "date":   selectedDate,
}
regularStocks, _ := h.stockRepo.GetAll(ctx, regularFilters)

// 2. ดึงหวยพิเศษล่าสุด (ใช้ filter huay_codes)
specialFilters := map[string]any{
    "status":     2,
    "huay_codes": []string{"GLO", "BAAC", "GSB", "OMSIN"},
    "limit":      100,
}
specialStocks, _ := h.stockRepo.GetAll(ctx, specialFilters)

// 3. กรองหวยทั่วไปให้ไม่มีหวยพิเศษ
regularStocksFiltered := filterOutSpecialLotteries(regularStocks)

// 4. เก็บเฉพาะล่าสุดของแต่ละหวยพิเศษ
latestSpecialStocks := getLatestPerCode(specialStocks)

// 5. รวมผลลัพธ์
stocks = regularStocksFiltered + latestSpecialStocks
```

### 2. Frontend Component
**ไฟล์**: `frontend-member/src/pages/member/LotteryResults.tsx`

**การเปลี่ยนแปลง**:
- เพิ่มคำอธิบายใน UI ว่าหวยพิเศษจะแสดงผลล่าสุดเสมอ
- อัพเดท subtitle: "ดูผลการออกรางวัลหวย (วันนี้ + หวยพิเศษล่าสุด)"
- เพิ่มหมายเหตุใต้ date picker: "* หวย GLO, BAAC, ออมสิน จะแสดงผลล่าสุดเสมอ"

## รหัสหวยพิเศษ (Special Lottery Codes)

| รหัส | ชื่อหวย |
|------|---------|
| GLO | หวย GLO |
| BAAC | หวย BAAC (ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร) |
| GSB | หวยออมสิน (Government Savings Bank) |
| OMSIN | หวยออมสิน (ชื่อเต็ม) |

## การทำงาน

1. เมื่อผู้ใช้เข้าหน้าผลหวย จะแสดงผลของวันนี้โดยอัตโนมัติ
2. ผู้ใช้สามารถเลือกวันที่อื่นได้ผ่าน date picker
3. หวยทั่วไปจะแสดงเฉพาะของวันที่เลือก
4. หวยพิเศษ (GLO, BAAC, ออมสิน) จะแสดงผลล่าสุดเสมอ ไม่ว่าจะเลือกวันไหน
5. ผลลัพธ์จะถูกจัดกลุ่มตามประเภทหวย (หวยรัฐบาล, หวยลาว, หวยฮานอย, หุ้นไทย, หุ้นต่างประเทศ)

## การทดสอบ

### ทดสอบ Backend
```bash
# ทดสอบดึงผลหวยของวันนี้
curl -X GET "http://localhost:8080/api/v1/member/lottery/results?date=2024-01-15&status=2" \
  -H "Authorization: Bearer YOUR_TOKEN"

# ควรได้ผลลัพธ์:
# - หวยทั่วไปของวันที่ 2024-01-15 (ยกเว้น GLO, BAAC, GSB, OMSIN)
# - หวย GLO, BAAC, GSB, OMSIN ล่าสุด (อาจไม่ใช่วันที่ 2024-01-15)
```

### ตรวจสอบ SQL Query
```sql
-- Query 1: หวยทั่วไปของวันที่เลือก
SELECT * FROM stock_master 
WHERE status = 2 
  AND DATE(stock_time) = '2024-01-15'
ORDER BY stock_time DESC;

-- Query 2: หวยพิเศษล่าสุด
SELECT * FROM stock_master 
WHERE status = 2 
  AND huay_code IN ('GLO', 'BAAC', 'GSB', 'OMSIN')
ORDER BY stock_time DESC
LIMIT 100;
```

### ทดสอบ Frontend
1. เข้าหน้า `/member/lottery` และคลิกแท็บ "ผลหวย"
2. ตรวจสอบว่าแสดงผลหวยของวันนี้
3. เปลี่ยนวันที่ในตัวเลือก
4. ตรวจสอบว่าหวยทั่วไปเปลี่ยนตามวันที่
5. ตรวจสอบว่าหวย GLO, BAAC, ออมสิน ยังคงแสดงผลล่าสุด

## หมายเหตุ

- หากต้องการเพิ่มหวยพิเศษอื่นๆ ให้เพิ่มรหัสใน `specialLotteryCodes` array
- การแสดงผล "ล่าสุด" หมายถึงงวดที่มี `stock_time` มากที่สุดของแต่ละประเภทหวย
- ระบบจะแสดงเฉพาะหวยที่มี `status = 2` (ประกาศผลแล้ว)
