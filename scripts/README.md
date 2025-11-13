# Download Sacasino Images Script

สคริปต์สำหรับดาวน์โหลดรูปภาพจาก sacasino.tech เพื่อใช้ในการทดสอบและพัฒนา

## วิธีใช้งาน

### แบบที่ 1: ใช้ Puppeteer (แนะนำ - ครบถ้วนที่สุด)

```bash
# ติดตั้ง dependencies ก่อน (ครั้งแรกเท่านั้น)
cd scripts
npm install

# รันสคริปต์
npm run download
# หรือ
node download-with-puppeteer.js
```

Script นี้จะ:
- เปิด browser (headless: false เพื่อให้เห็นการทำงาน)
- เข้าหน้าแรก sacasino.tech
- คลิกเข้าแต่ละ tab (10 tabs)
- ดาวน์โหลดรูปภาพทั้งหมดจากทุก tab
- จัดเก็บตามหมวดหมู่อัตโนมัติ

### แบบที่ 2: ใช้ Node.js ธรรมดา (เร็วกว่าแต่ไม่ครบ)

```bash
# รันสคริปต์
node download-sacasino-images.js
# หรือ
npm run download-simple
```

## รูปภาพที่จะดาวน์โหลด

- **Logo**: โลโก้หลักและโลโก้แบบ invert
- **Icons**: ไอคอนเมนูต่างๆ (invitation, promotion, telegram, line)
- **Categories**: ไอคอนหมวดหมู่เกม (casino, slot, sport, lotto, baccarat, roulette, etc.)
- **Banners**: แบนเนอร์โปรโมชั่น 5 รูป
- **Backgrounds**: รูปพื้นหลัง
- **Providers**: โลโก้ค่ายเกมต่างๆ (SA Gaming, Sexy Gaming, Dream Gaming, etc.)
- **Modals**: ไอคอนสำหรับ modal ต่างๆ
- **Footer**: รูปภาพสำหรับ footer

## โครงสร้างโฟลเดอร์

### Puppeteer Script (แนะนำ)
```
frontend/public/images/sacasino/
├── homepage/          # รูปจากหน้าแรก
├── logos/             # โลโก้ทั้งหมด
├── icons/             # ไอคอนต่างๆ
├── banners/           # แบนเนอร์โปรโมชั่น
├── backgrounds/       # รูปพื้นหลัง
├── providers/         # โลโก้ค่ายเกม
└── categories/        # แยกตาม tab
    ├── casino/
    │   ├── providers/
    │   └── games/
    ├── baccarat_vip/
    │   ├── providers/
    │   └── games/
    ├── dragon_tiger/
    ├── roulette/
    ├── hilo/
    ├── blackjack/
    ├── slot/
    ├── sport/
    ├── lotto/
    └── game_show/
```

### Simple Script
```
frontend/public/images/sacasino/
├── logo.png
├── logo-invert.png
├── icons/
├── categories/
├── banners/
├── backgrounds/
├── providers/
├── modals/
└── footer/
```

## หมายเหตุ

- สคริปต์นี้ใช้สำหรับการทดสอบและพัฒนาเท่านั้น
- รูปภาพจะถูกดาวน์โหลดและบันทึกในโฟลเดอร์ `frontend/public/images/sacasino/`
- หากมีรูปภาพเดิมอยู่แล้ว จะถูก overwrite
