import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { GameProvider } from '@/api/gameProviderAPI'
import { publicGameAPI, Game } from '@/api/publicGameAPI'
import { siteContentAPI } from '@/api/siteContentAPI'
import { getImageUrl } from '@/api/client'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import 'swiper/css'
import 'swiper/css/pagination'
import { useTranslation } from 'react-i18next'

const SacasinoHomePage = () => {
  const { t } = useTranslation(['common', 'navigation', 'auth'])
  const [activeTab, setActiveTab] = useState('all')
  const [providers, setProviders] = useState<GameProvider[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [gamesLoading, setGamesLoading] = useState(false)
  const [bannerImages, setBannerImages] = useState<string[]>([])
  const [smallBanners, setSmallBanners] = useState<any[]>([])

  // Load providers and banners from database
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        
        // Load banners
        const [smallBannersRes, largeBannersRes] = await Promise.all([
          siteContentAPI.getPromotions('home', 'small'),
          siteContentAPI.getPromotions('home', 'large')
        ])

        // Load small banners from API
        const smallBannersData = smallBannersRes.data?.data || smallBannersRes.data || []
        //console.log('Small Banners from API:', smallBannersData)
        setSmallBanners(Array.isArray(smallBannersData) ? smallBannersData : [])
        
        // Load large banners from API
        const largeBannersData = largeBannersRes.data?.data || largeBannersRes.data || []
        // console.log('Large Banners from API:', largeBannersData)
        
        // แปลง large banners เป็น array ของ image URLs
        const bannerUrls = (Array.isArray(largeBannersData) ? largeBannersData : [])
          .map((b: any) => {
            const imagePath = b.image_url || b.image?.file_url
            return imagePath ? getImageUrl(imagePath) : ''
          })
          .filter((url: string) => url)
        //console.log('Banner URLs for carousel:', bannerUrls)
        //console.log('Large banners count:', bannerUrls.length)
        setBannerImages(bannerUrls)
      } catch (error) {
        console.error('Failed to load content:', error)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [])

  // Reload providers when tab changes
  useEffect(() => {
    loadProviders(activeTab)
  }, [activeTab])

  const loadProviders = async (category?: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const url = category && category !== 'all'
        ? `${API_URL}/api/v1/member/providers?category=${category}`
        : `${API_URL}/api/v1/member/providers?category=all`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log('Providers response:', data)
        if (data.success && data.data) {
          setProviders(Array.isArray(data.data) ? data.data : [])
        }
      }
    } catch (error) {
      console.error('Failed to load providers:', error)
    }
  }

  // Load games when tab changes
  useEffect(() => {
    const loadGames = async () => {
      try {
        setGamesLoading(true)
        const gameType = mapCategoryToGameType(activeTab)
        const response = await publicGameAPI.getGamesByType(gameType, { limit: 20 })
        setGames(response.games || [])
      } catch (error) {
        console.error('Failed to load games:', error)
        setGames([])
      } finally {
        setGamesLoading(false)
      }
    }
    loadGames()
  }, [activeTab])



  // Map category to game type
  const mapCategoryToGameType = (category: string): string => {
    const mapping: Record<string, string> = {
      'all': 'live',
      'Slot': 'slot',
      'Live Casino': 'live',
      'Game Card': 'card',
      'Lottery': 'lottery',
      'Sport': 'sport',
      'Poker': 'poker',
    }
    return mapping[category] || 'live'
  }

  // Get category display name
  const getCategoryDisplayName = (category: string): string => {
    const names: Record<string, string> = {
      'all': 'เกมทั้งหมด',
      'Slot': t("game:categories.slot"),
      'Live Casino': 'คาสิโนสด',
      'Game Card': 'เกมไพ่',
      'Lottery': t("navigation:menu.lottery"),
      'Sport': 'กีฬา',
      'Poker': 'โป๊กเกอร์',
    }
    return names[category] || 'เกมทั้งหมด'
  }

  // Fallback banner images (if API fails)
  const fallbackBanners = [
    '/images/sacasino/banners/fad31dcc94be4093b4d36e7786893ca6.jpg',
    '/images/sacasino/banners/6ac8f2cc45f6b89e2266496f03a8f270.jpg',
    '/images/sacasino/banners/ed589e77f72bb6e2edc67040e18c6de4.jpg',
    '/images/sacasino/banners/af6e0b7dacc35d572f58b70a18a5d926.jpg',
    '/images/sacasino/banners/062a43b54902c26ca542b464642b4dbf.jpg',
  ]

  // Use API banners if available, otherwise use fallback
  const banners = bannerImages.length > 0 ? bannerImages : fallbackBanners

  // Categories
  const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: '/images/sacasino/categories/menu-icon-category-baccarat.png', iconHover: '/images/sacasino/categories/menu-icon-category-baccarat-hover.png' },
    { id: 'Slot', name: t("game:categories.slot"), icon: '/images/sacasino/categories/menu-icon-category-slot.png', iconHover: '/images/sacasino/categories/menu-icon-category-slot-hover.png' },
    { id: 'Live Casino', name: 'คาสิโนสด', icon: '/images/sacasino/categories/menu-icon-category-baccarat.png', iconHover: '/images/sacasino/categories/menu-icon-category-baccarat-hover.png' },
    { id: 'Game Card', name: 'เกมไพ่', icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
    { id: 'Lottery', name: t("navigation:menu.lottery"), icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
    { id: 'Sport', name: 'กีฬา', icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
    { id: 'Poker', name: 'โป๊กเกอร์', icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
  ]

  // Provider images mapping (fallback for providers without images in DB)
  const providerImageMap: Record<string, string> = {
    'Pragmatic Play': '/images/sacasino/games/casino/ezs-wt-ppa-live-vertical.png',
    'Dream Gaming': '/images/sacasino/games/casino/ezs-wt-dg-v2-vertical.png',
    'SA Gaming': '/images/sacasino/games/casino/ezs-sa-gaming-vertical.png',
    'WM Casino': '/images/sacasino/games/casino/ezs-wm-vertical.png',
    'Pragmatic Live': '/images/sacasino/games/casino/ezs-wt-pt-live-vertical.png',
    'Evolution Gaming': '/images/sacasino/games/casino/ezs-wt-eg-vertical.png',
    'AE Sexy': '/images/sacasino/games/casino/ezs-wt-aesexy-vertical.png',
    'Allbet': '/images/sacasino/games/casino/ezs-wt-allbet-full-vertical.png',
    'Asia Gaming': '/images/sacasino/games/casino/ezs-wtm-asia-gaming-vertical.png',
  }

  // Get provider image (from DB or fallback)
  const getProviderImage = (provider: GameProvider) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    // Try to get from provider's image_path first
    if (provider.image_path) {
      // If it's already a full URL, use it
      if (provider.image_path.startsWith('http')) {
        return provider.image_path
      }
      // If it's a local path, prepend API URL
      return `${API_URL}${provider.image_path}`
    }
    
    // Fallback to SA Gaming local image
    return `${API_URL}/uploads/providers/sa-gaming.png`
  }

  // Static providers as fallback (if API fails)
  const staticProviders = [
    { id: 1, product_name: 'SA Gaming', image_path: '/images/sacasino/games/casino/ezs-sa-gaming-vertical.png' },
    { id: 2, product_name: 'Pragmatic Play', image_path: '/images/sacasino/games/casino/ezs-wt-ppa-live-vertical.png' },
    { id: 3, product_name: 'Evolution Gaming', image_path: '/images/sacasino/games/casino/ezs-wt-eg-vertical.png' },
    { id: 4, product_name: 'Dream Gaming', image_path: '/images/sacasino/games/casino/ezs-wt-dg-v2-vertical.png' },
    { id: 5, product_name: 'WM Casino', image_path: '/images/sacasino/games/casino/ezs-wm-vertical.png' },
    { id: 6, product_name: 'AE Sexy', image_path: '/images/sacasino/games/casino/ezs-wt-aesexy-vertical.png' },
    { id: 7, product_name: 'Allbet', image_path: '/images/sacasino/games/casino/ezs-wt-allbet-full-vertical.png' },
    { id: 8, product_name: 'Asia Gaming', image_path: '/images/sacasino/games/casino/ezs-wtm-asia-gaming-vertical.png' },
    { id: 9, product_name: 'Pragmatic Live', image_path: '/images/sacasino/games/casino/ezs-wt-pt-live-vertical.png' },
  ]

  // Use static providers if no data from API
  const displayProviders = (providers && providers.length > 0) ? providers : staticProviders as any[]

  // Special menu items - use small banners from API or fallback to static (removed daily check-in for non-logged in users)
  const fallbackSpecialMenu = [
    { name: 'แชร์โซเชียล', image: '/images/sacasino/special/special-menu-entry-social-share.png', bg: '/images/sacasino/special/special-menu-entry-item-bg.png', link: '#' },
    { name: 'กงล้อพารวย', image: '/images/sacasino/special/special-menu-entry-wheel.png', bg: '/images/sacasino/special/special-menu-entry-item-bg.png', link: '/lucky-wheel' },
    { name: 'ผูกโซเชียล', image: '/images/sacasino/special/special-menu-entry-bind-social.png', bg: '/images/sacasino/special/special-menu-entry-item-bg.png', link: '#' },
    { name: 'ชวนเพื่อน', image: '/images/sacasino/special/special-menu-entry-invitation.png', bg: '/images/sacasino/special/special-menu-entry-item-bg.png', link: '/invitation' },
    { name: 'วันเกิด', image: '/images/sacasino/special/special-menu-entry-happy-birth-day.png', bg: '/images/sacasino/special/special-menu-entry-item-bg.png', link: 'https://line.me/support', external: true },
    { name: 'จัดอันดับ', image: '/images/sacasino/special/special-menu-entry-ranking.png', bg: '/images/sacasino/special/special-menu-entry-item-bg.png', link: '/ranking/win' },
  ]

  // Map small banners from API to special menu format
  const specialMenu = smallBanners.length > 0 
    ? smallBanners.map((banner: any) => {
        console.log('Processing small banner:', banner)
        const imagePath = banner.image_url || banner.image?.file_url
        const fullImageUrl = imagePath ? getImageUrl(imagePath) : ''
        console.log('Image path:', imagePath, '-> Full URL:', fullImageUrl)
        return {
          name: banner.title,
          image: fullImageUrl,
          bg: '/images/sacasino/special/special-menu-entry-item-bg.png',
          link: banner.link_url || '#',
          external: banner.link_url?.startsWith('http')
        }
      })
    : fallbackSpecialMenu
  
  console.log('Special Menu Items:', specialMenu)

  return (
    <div className="min-h-screen" style={{ background: '#0f1419' }}>
      {/* Background */}
      <div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/images/sacasino/backgrounds/index-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Header */}
      <nav className="relative z-20 bg-[#1a1f2e] border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/images/bicycle678-logo.svg" 
                alt="Bicycle678" 
                className="h-12 w-auto"
              />
            </Link>

            {/* Menu */}
            <div className="flex items-center gap-4">
              <Link to="/invitation" className="flex flex-col items-center text-gray-400 hover:text-white transition">
                <img src="/images/sacasino/icons/ic-menu-invitation.png" alt="ชวนเพื่อน" className="w-8 h-8" />
                <span className="text-xs mt-1">ชวนเพื่อน</span>
              </Link>
              <Link to="/promotions" className="flex flex-col items-center text-gray-400 hover:text-white transition">
                <img src="/images/sacasino/icons/ic-menu-promotion.png" alt={t("navigation:menu.promotions")} className="w-8 h-8" />
                <span className="text-xs mt-1">{t("navigation:menu.promotions")}</span>
              </Link>
            </div>

            {/* Support & Auth */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher variant="compact" />
              <a href="https://t.me/support" target="_blank" rel="noopener noreferrer">
                <img src="/images/sacasino/icons/ic-telegram-support.png" alt="Telegram" className="h-10" />
              </a>
              <a href="https://line.me/support" target="_blank" rel="noopener noreferrer">
                <img src="/images/sacasino/icons/ic-line-support.png" alt="LINE" className="h-10" />
              </a>
              
              <Link
                to="/register"
                className="px-6 py-2 rounded-lg text-sm font-bold text-white transition hover:scale-105"
                style={{ background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)' }}
              >
                {t('auth:register.title')}
              </Link>
              <Link
                to="/login"
                className="px-6 py-2 rounded-lg text-sm font-bold text-white transition hover:scale-105"
                style={{ background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)' }}
              >
                {t('auth:login.title')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Special Menu */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center gap-3 flex-wrap">
            {specialMenu.map((item, index) => (
              item.external ? (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group hover:scale-105 transition-transform block"
                >
                  <img src={item.bg} alt="bg" className="w-32 h-20" />
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-contain p-2"
                  />
                </a>
              ) : (
                <Link
                  key={index}
                  to={item.link}
                  className="relative group hover:scale-105 transition-transform block"
                >
                  <img src={item.bg} alt="bg" className="w-32 h-20" />
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-contain p-2"
                  />
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Banner Carousel */}
        <div className="container mx-auto px-4 py-6">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            loop={true}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={index}>
                <img 
                  src={banner} 
                  alt={`Banner ${index + 1}`}
                  className="w-full rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Title */}
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            Bicycle678 บาคาร่า คาสิโนออนไลน์ เสือมังกร โปรแรงสุดในไทย ฝากถอนออโต้
          </h1>
        </div>

        {/* Category Menu */}
        <div className="bg-[#1a1f2e] border-y border-gray-800 sticky top-0 z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex flex-col items-center min-w-[80px] px-3 py-2 rounded-lg transition-all group
                    ${activeTab === cat.id ? 'bg-gradient-to-b from-[#d4af37] to-[#8B6914]' : 'hover:bg-gray-800'}`}
                >
                  <img 
                    src={activeTab === cat.id ? cat.iconHover : cat.icon}
                    alt={cat.name}
                    className="w-12 h-12 mb-1"
                  />
                  <span className={`text-xs font-medium ${activeTab === cat.id ? 'text-white' : 'text-gray-400'}`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {getCategoryDisplayName(activeTab)}
            </h2>
            <Link 
              to={`/games?category=${activeTab}`}
              className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          
          {gamesLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">ไม่พบเกมในหมวดนี้</div>
              <p className="text-gray-500 text-sm">กรุณาเลือกหมวดหมู่อื่น</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {games.map((game) => (
                <div 
                  key={game.id}
                  className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-800"
                >
                  <img 
                    src={game.imageUrl || game.thumbnailUrl || '/images/sacasino/providers/default.png'}
                    alt={game.gameName}
                    className="w-full h-auto transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/sacasino/providers/default.png'
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex flex-col items-center justify-center gap-2">
                    <button className="opacity-0 group-hover:opacity-100 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold transition transform hover:scale-105">
                      เข้าเล่น
                    </button>
                    <button className="opacity-0 group-hover:opacity-100 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium transition transform hover:scale-105 text-sm">
                      ทดลองเล่น
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                    <p className="text-white text-xs font-semibold truncate">{game.gameName}</p>
                    <p className="text-gray-400 text-xs truncate">{game.provider}</p>
                  </div>
                  {game.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                      HOT
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Show Providers Section */}
          {activeTab && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-white mb-4">ค่ายเกมชั้นนำ ({displayProviders.length} ค่าย)</h3>
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {displayProviders.map((provider) => (
                    <div 
                      key={provider.id}
                      className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-800 p-2 hover:bg-gray-700 transition-all"
                    >
                      <img 
                        src={getProviderImage(provider)}
                        alt={provider.product_name}
                        className="w-full h-auto transition-transform group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/sacasino/games/casino/ezs-sa-gaming-vertical.png'
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold text-center px-2">
                          {provider.product_name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a0e13] py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 SA Casino Gaming. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default SacasinoHomePage
