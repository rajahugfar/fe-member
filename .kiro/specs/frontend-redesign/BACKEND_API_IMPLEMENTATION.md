# Backend API Implementation Guide

## 📋 สรุปงานที่สร้างแล้ว

### ✅ Files Created

1. **`internal/usecase/game_provider_sync_usecase.go`**
   - Usecase สำหรับ sync ข้อมูลจาก games-data.json
   - รองรับ sync ทั้ง providers และ games

2. **`internal/presentation/http/handler/admin_game_provider_sync_handler.go`**
   - Handler สำหรับ Admin API endpoints
   - 3 endpoints: sync providers, sync games, sync all

3. **`scripts/import-game-data.sh`**
   - Shell script สำหรับ import ข้อมูล
   - รองรับการ import ทั้ง providers และ games

---

## 🔌 API Endpoints

### 1. Sync Providers
```http
POST /api/v1/admin/game-providers/sync
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "jsonFilePath": "scripts/games-data.json"  // Optional, defaults to this path
}
```

**Response:**
```json
{
  "success": true,
  "message": "Providers synced successfully"
}
```

### 2. Import Games
```http
POST /api/v1/admin/games/import
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "jsonFilePath": "scripts/games-data.json"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Games synced successfully"
}
```

### 3. Sync All (Providers + Games)
```http
POST /api/v1/admin/game-data/sync-all
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "jsonFilePath": "scripts/games-data.json"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "All data synced successfully",
  "data": {
    "providers_synced": true,
    "games_synced": true
  }
}
```

---

## 🔧 Integration Steps

### Step 1: Register Routes

ต้องเพิ่ม routes ใน router file (ตามโครงสร้างของโปรเจค):

```go
// In your admin routes file (e.g., internal/presentation/http/router/admin_router.go)

func SetupAdminRoutes(r *gin.RouterGroup, db *sqlx.DB) {
    // ... existing routes ...
    
    // Game Provider Sync
    syncUsecase := usecase.NewGameProviderSyncUsecase(db)
    syncHandler := handler.NewAdminGameProviderSyncHandler(syncUsecase)
    
    adminGroup := r.Group("/admin")
    adminGroup.Use(authMiddleware) // Your auth middleware
    {
        // Sync endpoints
        adminGroup.POST("/game-providers/sync", syncHandler.SyncProvidersFromJSON)
        adminGroup.POST("/games/import", syncHandler.SyncGamesFromJSON)
        adminGroup.POST("/game-data/sync-all", syncHandler.SyncAll)
    }
}
```

### Step 2: Copy games-data.json

ตรวจสอบว่าไฟล์ `scripts/games-data.json` อยู่ในตำแหน่งที่ถูกต้อง:

```bash
# From project root
ls -la scripts/games-data.json
```

### Step 3: Run Import Script

```bash
# Set your admin token
export ADMIN_TOKEN="your_admin_token_here"

# Optional: Set API URL (defaults to http://localhost:8081)
export API_URL="http://localhost:8081"

# Make script executable
chmod +x scripts/import-game-data.sh

# Run import
./scripts/import-game-data.sh
```

---

## 📊 Data Mapping

### Provider Mapping

จาก `games-data.json`:
```json
{
  "casino": [
    {
      "code": "wt-ppa-live",
      "name": "Pragmatic Play Live",
      "provider": "Pragmatic Play",
      "image": "/images/sacasino/games/casino/ezs-wt-ppa-live-vertical.png"
    }
  ]
}
```

ไปยัง `game_providers` table:
```sql
INSERT INTO game_providers (
    product_name,      -- "Pragmatic Play"
    description,       -- "Pragmatic Play - Premium Gaming Provider"
    category,          -- "casino"
    game_type,         -- "live"
    image_path,        -- "/images/sacasino/providers/ezs-wt-ppa-live-vertical.png"
    status,            -- 1 (active)
    is_featured,       -- false
    order_no           -- auto-increment
)
```

### Game Mapping

จาก `games-data.json`:
```json
{
  "code": "wt-ppa-live",
  "name": "Pragmatic Play Live",
  "provider": "Pragmatic Play",
  "image": "/images/sacasino/games/casino/ezs-wt-ppa-live-vertical.png"
}
```

ไปยัง `games` table:
```sql
INSERT INTO games (
    id,              -- UUID (auto-generated)
    game_code,       -- "wt-ppa-live"
    game_name,       -- "Pragmatic Play Live"
    game_type,       -- "live" (from category)
    provider,        -- "Pragmatic Play"
    image_url,       -- "/images/sacasino/games/casino/ezs-wt-ppa-live-vertical.png"
    thumbnail_url,   -- same as image_url
    is_active,       -- true
    is_featured,     -- false
    display_order    -- auto-increment
)
```

---

## 🗂️ Category Mapping

| JSON Category | DB Category | DB Game Type |
|--------------|-------------|--------------|
| casino       | casino      | live         |
| baccarat_vip | casino      | live         |
| slot         | slot        | slot         |
| game_show    | game_show   | game_show    |
| roulette     | roulette    | roulette     |

---

## 🖼️ Image Path Mapping

Provider images จาก games-data.json จะถูก map ไปยัง:

```
Pragmatic Play   → /images/sacasino/providers/ezs-wt-ppa-live-vertical.png
Dream Gaming     → /images/sacasino/providers/ezs-wt-dg-v2-vertical.png
SA Gaming        → /images/sacasino/providers/ezs-sa-gaming-vertical.png
WM Casino        → /images/sacasino/providers/ezs-wm-vertical.png
Pragmatic Live   → /images/sacasino/providers/ezs-wt-pt-live-vertical.png
Evolution Gaming → /images/sacasino/providers/ezs-wt-eg-vertical.png
AE Sexy          → /images/sacasino/providers/ezs-wt-aesexy-vertical.png
Allbet           → /images/sacasino/providers/ezs-wt-allbet-full-vertical.png
Asia Gaming      → /images/sacasino/providers/ezs-wtm-asia-gaming-vertical.png
```

---

## 🧪 Testing

### Test Provider Sync

```bash
curl -X POST http://localhost:8081/api/v1/admin/game-providers/sync \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Test Game Import

```bash
curl -X POST http://localhost:8081/api/v1/admin/games/import \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Verify Data

```bash
# Check providers
curl http://localhost:8081/api/v1/public/game-providers | jq '.'

# Check games
curl http://localhost:8081/api/v1/member/games/all | jq '.'

# Check game stats
curl http://localhost:8081/api/v1/member/games/stats | jq '.'
```

---

## ⚠️ Important Notes

### 1. Database Schema
ตรวจสอบว่าตาราง `game_providers` และ `games` มีโครงสร้างดังนี้:

```sql
-- game_providers table
CREATE TABLE IF NOT EXISTS game_providers (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    game_type VARCHAR(100),
    image_path VARCHAR(500),
    status INTEGER DEFAULT 1,
    is_featured BOOLEAN DEFAULT false,
    order_no INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- games table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY,
    game_code VARCHAR(255) UNIQUE NOT NULL,
    game_name VARCHAR(255) NOT NULL,
    game_name_th VARCHAR(255),
    game_type VARCHAR(100),
    provider VARCHAR(255),
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Upsert Logic
- API ใช้ `ON CONFLICT ... DO UPDATE` เพื่อ update ข้อมูลถ้ามีอยู่แล้ว
- ไม่ต้องกังวลเรื่องการ import ซ้ำ

### 3. Transaction Safety
- ทั้ง providers และ games sync ใช้ transaction
- ถ้า error จะ rollback ทั้งหมด

### 4. File Path
- Default path: `scripts/games-data.json` (relative to backend root)
- สามารถ override ได้ผ่าน request body

---

## 🚀 Next Steps

หลังจาก import ข้อมูลเสร็จแล้ว:

### 1. Verify Frontend
```bash
cd frontend
npm run dev
# Open http://localhost:5174
```

### 2. Check Provider Display
- หน้าแรกควรแสดง providers จาก database
- รูปภาพควรโหลดถูกต้อง

### 3. Implement Category Filtering
- แก้ไข `SacasinoHomePage.tsx` ให้ filter เกมตาม category
- เชื่อมต่อกับ API `/api/v1/member/games/all?type={category}`

### 4. Add More Features
- Game detail page
- Search functionality
- Provider page
- Admin management UI

---

## 📝 Troubleshooting

### Problem: "Failed to open JSON file"
**Solution:** ตรวจสอบว่า `scripts/games-data.json` อยู่ในตำแหน่งที่ถูกต้อง

### Problem: "Failed to insert provider"
**Solution:** ตรวจสอบ database schema และ permissions

### Problem: "Providers not showing on frontend"
**Solution:** 
1. ตรวจสอบว่า API `/api/v1/public/game-providers` ทำงาน
2. ตรวจสอบ CORS settings
3. ดู console log ใน browser

### Problem: "Images not loading"
**Solution:**
1. ตรวจสอบว่ารูปภาพอยู่ใน `frontend/public/images/sacasino/`
2. ตรวจสอบ path ใน database
3. ตรวจสอบ file permissions

---

## 📚 Related Files

- **Usecase:** `internal/usecase/game_provider_sync_usecase.go`
- **Handler:** `internal/presentation/http/handler/admin_game_provider_sync_handler.go`
- **Import Script:** `scripts/import-game-data.sh`
- **Data File:** `scripts/games-data.json`
- **Frontend:** `frontend/src/pages/SacasinoHomePage.tsx`
- **API Client:** `frontend/src/api/gameProviderAPI.ts`

---

**Last Updated:** 2025-01-03
**Status:** Ready for Integration
**Priority:** High 🔴
