# Landing Page Components

This directory contains reusable components for the landing page, matching the sacasino.tech design.

## Header Component

The Header component provides the main navigation and branding for the landing page.

### Features

- **Top Gold Decoration Bar**: Gradient gold bar at the very top
- **Logo Section**: 
  - Circular logo with green glow effect
  - Site name with text glow effect
  - Tagline "คาสิโนออนไลน์ อันดับ 1"
- **Authentication Buttons**:
  - Login button (green gradient)
  - Register button (yellow gradient with pulse animation)
- **Quick Action Menu**:
  - Profile/Account button (blue)
  - Deposit/Withdraw button (green)
  - Register button (yellow)
  - Contact LINE button (green)
- **Bottom Curved Decoration**: Subtle gradient fade effect

### Usage

```tsx
import Header from '@/components/landing/Header'

<Header 
  siteName="SACASINO" 
  contactLine="https://line.me/ti/p/@example"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `siteName` | `string` | `'SACASINO'` | The site name displayed in the header |
| `contactLine` | `string` | `undefined` | LINE contact URL for the contact button |

### Styling

The component uses:
- Custom gradients matching sacasino.tech color scheme
- Gold/brown header background (#8B6914 to #6B5011)
- Yellow/gold accents (#d4af37, #f5d042)
- Green glow effects for interactive elements
- Tailwind CSS utility classes
- Custom shadow effects (shadow-glow-green, shadow-glow-yellow)

### Responsive Design

- Desktop: Full layout with all elements visible
- Mobile: Responsive grid for quick action buttons (2x2 on small screens)
- Logo scales appropriately for different screen sizes

### Accessibility

- Semantic HTML structure
- Proper alt text for images
- Keyboard navigation support via Link components
- Focus states on interactive elements

### Integration

The Header component is designed to work with:
- React Router for navigation
- Site settings API for dynamic content
- Existing authentication system
- LINE/social media integration


## HeroSection Component

The HeroSection component displays the main promotional content and quick action links in a two-column layout.

### Features

- **Left Column - Promotion Carousel**:
  - Auto-playing carousel with fade effect
  - Displays promotional banners
  - Pagination dots (yellow active state)
  - 4-second auto-play interval
  - Loop enabled
  - Fallback to default promotions if none provided
  
- **Right Column - Quick Links**:
  - Promotions link (purple gradient)
  - LINE contact button (green gradient)
  - Telegram contact button (blue gradient)
  - Hover scale effects
  - Glow shadow effects

- **Container Styling**:
  - Green gradient background with backdrop blur
  - Yellow border with glow effect
  - Rounded corners
  - Hover border color change
  - Responsive grid layout (1 column mobile, 2 columns desktop)

### Usage

```tsx
import HeroSection from '@/components/landing/HeroSection'

<HeroSection
  promotions={[
    {
      id: '1',
      image: '/path/to/image.jpg',
      title: 'Promotion Title',
      link_url: '/promotions/1'
    }
  ]}
  socialLine="https://line.me/ti/p/@example"
  socialTelegram="https://t.me/example"
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `promotions` | `Promotion[]` | Yes | Array of promotion objects to display in carousel |
| `socialLine` | `string` | No | LINE contact URL |
| `socialTelegram` | `string` | No | Telegram contact URL |

### Promotion Object

```typescript
interface Promotion {
  id: string
  image: string
  title: string
  link_url?: string
}
```

### Dependencies

- `swiper` - For carousel functionality
- `react-icons/fa` - For icons
- `react-router-dom` - For navigation

### Styling

- Uses Swiper.js for carousel with custom pagination styling
- Green/yellow color scheme matching sacasino.tech
- Custom shadow effects (shadow-glow-yellow, shadow-glow-green)
- Responsive aspect ratio for images (square)
- Smooth transitions and hover effects

### Responsive Design

- **Desktop (lg+)**: 2-column layout (carousel left, links right)
- **Mobile**: Stacked layout (carousel on top, links below)
- Maintains aspect ratio and proper spacing on all screen sizes

### Error Handling

- Image error fallback to default promotion image
- Graceful handling of missing social links (defaults to '#')
- Falls back to default promotions if none provided

### Accessibility

- Semantic HTML structure
- Proper alt text for images
- Keyboard navigation support
- External links open in new tab with proper rel attributes


## GameCategoriesGrid Component

The GameCategoriesGrid component displays game categories in a 2x4 grid layout with hover effects and animations.

### Features

- **Grid Layout**: 2x4 grid (2 columns on mobile, 4 on desktop)
- **8 Game Categories**:
  - สล็อต (Slots)
  - บาคาร่า (Baccarat)
  - รูเล็ต (Roulette)
  - ไฮโล (Hi-Lo)
  - เสือมังกร (Dragon Tiger)
  - แบล็กแจ็ก (Blackjack)
  - หวย (Lottery)
  - กีฬา (Sports)

- **Interactive Effects**:
  - Staggered fade-in animation on load
  - Scale up on hover
  - Border color change (gray → yellow)
  - Icon scale animation
  - Text color change (white → yellow)
  - Shadow glow effects

- **Authentication Integration**:
  - Optional click handler for authentication checks
  - Can prevent navigation if user not logged in

### Usage

```tsx
import GameCategoriesGrid from '@/components/landing/GameCategoriesGrid'

// Basic usage with default categories
<GameCategoriesGrid />

// With custom categories
<GameCategoriesGrid
  categories={[
    { name: 'สล็อต', image: '/path/to/icon.png', link: '/games/slots' }
  ]}
/>

// With authentication check
<GameCategoriesGrid
  onCategoryClick={(e, link) => {
    e.preventDefault()
    if (isLoggedIn()) {
      navigate(link)
    } else {
      showLoginModal()
    }
  }}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `categories` | `GameCategory[]` | No | Custom game categories (uses defaults if not provided) |
| `onCategoryClick` | `(e: React.MouseEvent, link: string) => void` | No | Click handler for category items |

### GameCategory Object

```typescript
interface GameCategory {
  name: string    // Display name in Thai
  image: string   // Path to category icon
  link: string    // Navigation link
}
```

### Styling

- **Container**: Dark gray gradient background
- **Borders**: Gray default, yellow on hover
- **Icons**: 64x64px, scale to 110% on hover
- **Text**: White default, yellow on hover
- **Shadows**: Yellow glow default, green glow on hover
- **Animation**: 50ms stagger delay between items

### Responsive Design

- **Mobile (< md)**: 2 columns
- **Desktop (≥ md)**: 4 columns
- Maintains consistent spacing and sizing across breakpoints

### Error Handling

- Image fallback to default game icon
- Graceful handling of missing categories (uses defaults)
- Safe navigation with optional click handler

### Accessibility

- Semantic HTML with proper heading structure
- Alt text for all images
- Keyboard navigation support
- Focus states on interactive elements
- Proper link semantics

### Animation Details

- Uses Framer Motion for entrance animations
- Initial state: opacity 0, scale 0.9
- Animate to: opacity 1, scale 1
- Stagger: 50ms delay per item
- Creates smooth cascade effect
