# UI Design Specification - Based on sacasino.tech

## 🎨 Design Analysis from sacasino.tech

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Header (Fixed Top)                                      │
│ - Logo (Left)                                           │
│ - Support Button (Right)                                │
│ - Login/Register Buttons (Right)                        │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Special Menu (7 Items - Horizontal Scroll)              │
│ [แชร์โซเชียล] [เช็คอิน] [กงล้อ] [ผูกโซเชียล] ...      │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Banner Carousel (Swiper)                                │
│ - Auto-play                                             │
│ - Pagination dots                                       │
│ - 5 banners                                             │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Category Tabs (10 Categories - Horizontal Scroll)       │
│ [คาสิโน] [บาคาร่า VIP] [เสือมังกร] [รูเล็ต] ...       │
│ - Active state with gradient background                 │
│ - Icon + Text                                           │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Games Grid                                              │
│ - Responsive: 2 cols (mobile) → 5 cols (desktop)       │
│ - Game Card:                                            │
│   • Image (full width)                                  │
│   • Hover: Dark overlay + "เข้าเล่น" button            │
│   • Game name (bottom overlay)                          │
│   • Provider name (small text)                          │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Footer                                                  │
│ - Logo                                                  │
│ - Description                                           │
│ - Payment methods                                       │
│ - License info                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features to Implement

### 1. Header
- ✅ Fixed position at top
- ✅ Dark background (#0f1419)
- ✅ Logo on left
- ✅ Support button (with icon)
- ✅ Login/Register buttons
- 🔄 **Need to add:** Sticky header on scroll

### 2. Special Menu
- ✅ 7 items with icons
- ✅ Horizontal layout
- 🔄 **Need to add:** 
  - Click handlers
  - Scroll behavior on mobile
  - Active states

### 3. Banner Carousel
- ✅ Swiper integration
- ✅ Auto-play
- ✅ Pagination dots
- ✅ 5 banners
- ✅ Responsive

### 4. Category Tabs
- ✅ 10 categories
- ✅ Icons (normal + hover)
- ✅ Active state with gradient
- ✅ Click to filter games
- 🔄 **Need to add:**
  - Smooth scroll on mobile
  - Better active indicator

### 5. Games Grid
- ✅ Responsive grid (2-5 columns)
- ✅ Game cards with images
- ✅ Hover overlay
- ✅ "เข้าเล่น" button
- ✅ Game name + provider
- 🔄 **Need to add:**
  - "ทดลองเล่น" button
  - Loading skeleton
  - Infinite scroll / Load more
  - Featured badge

### 6. Footer
- ✅ Logo
- ✅ Description
- 🔄 **Need to add:**
  - Payment method icons
  - License badges
  - Social links

---

## 🎨 Color Palette (from sacasino.tech)

```css
/* Background Colors */
--bg-primary: #0f1419;      /* Main background */
--bg-secondary: #1a1f26;    /* Card background */
--bg-tertiary: #242a33;     /* Hover background */

/* Text Colors */
--text-primary: #ffffff;    /* Main text */
--text-secondary: #9ca3af;  /* Secondary text */
--text-muted: #6b7280;      /* Muted text */

/* Accent Colors */
--accent-gold: #d4af37;     /* Gold/Yellow accent */
--accent-gold-dark: #8B6914; /* Dark gold */
--accent-green: #10b981;    /* Success/Play button */
--accent-blue: #3b82f6;     /* Info/Demo button */

/* Border Colors */
--border-color: #374151;    /* Border */
--border-hover: #4b5563;    /* Border on hover */
```

---

## 📐 Spacing & Typography

### Spacing Scale
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

### Typography
```css
/* Font Family */
font-family: 'Noto Sans Thai', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

---

## 🎭 Component Specifications

### Game Card
```tsx
<div className="game-card">
  {/* Image Container */}
  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
    <img src={game.image} alt={game.name} />
    
    {/* Featured Badge */}
    {game.isFeatured && (
      <div className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded">
        HOT
      </div>
    )}
    
    {/* Hover Overlay */}
    <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
      <button className="px-6 py-2 bg-green-500 rounded-lg">
        เข้าเล่น
      </button>
      <button className="px-6 py-2 bg-blue-500 rounded-lg text-sm">
        ทดลองเล่น
      </button>
    </div>
    
    {/* Bottom Info */}
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
      <p className="text-white text-xs font-semibold truncate">
        {game.name}
      </p>
      <p className="text-gray-400 text-xs truncate">
        {game.provider}
      </p>
    </div>
  </div>
</div>
```

### Category Tab
```tsx
<button 
  className={`
    flex flex-col items-center gap-1 px-4 py-3 rounded-lg
    transition-all duration-200
    ${isActive 
      ? 'bg-gradient-to-b from-[#d4af37] to-[#8B6914]' 
      : 'hover:bg-gray-800'
    }
  `}
  onClick={() => setActiveCategory(category.id)}
>
  <img 
    src={isActive ? category.iconHover : category.icon}
    alt={category.name}
    className="w-12 h-12"
  />
  <span className={`text-xs font-medium ${
    isActive ? 'text-white' : 'text-gray-400'
  }`}>
    {category.name}
  </span>
</button>
```

---

## 🔄 Interactions & Animations

### 1. Category Tab Click
```typescript
const handleCategoryClick = (categoryId: string) => {
  setActiveCategory(categoryId)
  // Load games for this category
  loadGames(categoryId)
  // Smooth scroll to games section
  gamesRef.current?.scrollIntoView({ behavior: 'smooth' })
}
```

### 2. Game Card Hover
```css
.game-card {
  transition: transform 0.2s ease;
}

.game-card:hover {
  transform: translateY(-4px);
}

.game-card img {
  transition: transform 0.3s ease;
}

.game-card:hover img {
  transform: scale(1.05);
}
```

### 3. Button Hover
```css
.btn-play {
  transition: all 0.2s ease;
}

.btn-play:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
.games-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .games-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .games-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .games-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

---

## 🎯 User Flows

### Flow 1: Browse Games by Category
```
1. User lands on homepage
2. Sees banner carousel (auto-playing)
3. Scrolls down to category tabs
4. Clicks on "สล็อต" category
5. Games grid updates to show slot games
6. Loading spinner appears briefly
7. Slot games appear in grid
8. User can hover over games to see "เข้าเล่น" button
```

### Flow 2: Play a Game
```
1. User hovers over game card
2. Overlay appears with buttons
3. User clicks "เข้าเล่น"
4. If logged in: Redirect to game play page
5. If not logged in: Show login modal
6. After login: Redirect to game play page
```

### Flow 3: Try Demo Game
```
1. User hovers over game card
2. Clicks "ทดลองเล่น"
3. Open game in demo mode (no login required)
4. User can play with virtual credits
```

---

## 🚀 Performance Optimizations

### 1. Image Loading
```typescript
// Lazy load images
<img 
  loading="lazy"
  src={game.image}
  onError={(e) => {
    e.currentTarget.src = '/images/placeholder.png'
  }}
/>
```

### 2. Infinite Scroll
```typescript
const loadMoreGames = async () => {
  if (loading || !hasMore) return
  
  setLoading(true)
  const newGames = await fetchGames({
    category: activeCategory,
    offset: games.length,
    limit: 20
  })
  
  setGames([...games, ...newGames])
  setHasMore(newGames.length === 20)
  setLoading(false)
}

// Use Intersection Observer
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMoreGames()
      }
    },
    { threshold: 0.5 }
  )
  
  if (loadMoreRef.current) {
    observer.observe(loadMoreRef.current)
  }
  
  return () => observer.disconnect()
}, [games, activeCategory])
```

### 3. Skeleton Loading
```tsx
{loading && (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-800 aspect-[3/4] rounded-lg"></div>
        <div className="h-4 bg-gray-800 rounded mt-2"></div>
        <div className="h-3 bg-gray-800 rounded mt-1 w-2/3"></div>
      </div>
    ))}
  </div>
)}
```

---

## 📋 Implementation Checklist

### Phase 1: Core UI ✅
- [x] Header with logo and buttons
- [x] Special menu (7 items)
- [x] Banner carousel
- [x] Category tabs (10 categories)
- [x] Games grid (responsive)
- [x] Footer

### Phase 2: Interactions ✅
- [x] Category tab click → filter games
- [x] Game card hover → show buttons
- [x] Loading states
- [x] Empty states

### Phase 3: Enhancements 🔄
- [ ] Infinite scroll / Load more
- [ ] Skeleton loading
- [ ] Search functionality
- [ ] Filter by provider
- [ ] Sort options (Popular, New, A-Z)
- [ ] Favorites system

### Phase 4: Advanced Features 🔄
- [ ] Game play integration
- [ ] Demo mode
- [ ] Login modal
- [ ] User authentication flow
- [ ] Deposit/Withdrawal flows

---

## 🎨 Current Implementation Status

### ✅ Completed
1. **SacasinoHomePage.tsx**
   - Dynamic provider loading from DB
   - Category filtering with API integration
   - Game display with hover effects
   - Responsive grid layout
   - Loading states
   - Error handling

### 🔄 In Progress
1. **API Integration**
   - Backend sync endpoints created
   - Need to register routes
   - Need to import data

### ⏳ Pending
1. **Additional Pages**
   - Games list page (`/games`)
   - Game detail page (`/games/:id`)
   - Provider page (`/providers/:name`)
   
2. **Features**
   - Search
   - Filters
   - Infinite scroll
   - Game play integration

---

## 📊 Resources Available

### Images ✅
- ✅ Logos (1 file)
- ✅ Categories (20 files - normal + hover)
- ✅ Banners (5 files)
- ✅ Providers (9 files)
- ✅ Special menu (7 files)
- ✅ Game images (54 files)

### Data ✅
- ✅ games-data.json (54 games)
- ✅ Provider mapping
- ✅ Category mapping

### APIs ✅
- ✅ GET /api/v1/public/game-providers
- ✅ GET /api/v1/member/games/all
- ✅ GET /api/v1/member/games/stats
- ✅ POST /api/v1/admin/game-providers/sync (created)
- ✅ POST /api/v1/admin/games/import (created)

---

**Last Updated:** 2025-01-03
**Status:** Phase 2 Complete, Ready for Phase 3
**Next Steps:** Test with real data, add enhancements
