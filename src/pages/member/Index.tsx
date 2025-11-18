import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001' || 'http://localhost:3001'
import {
  FaUser,
  FaSignOutAlt,
  FaGamepad,
  FaDice,
  FaGift,
  FaCoins,
  FaHeadset,
  FaMobileAlt,
  FaShieldAlt,
  FaMoneyBillWave,
  FaFootballBall,
  FaChevronDown,
  FaWallet
} from 'react-icons/fa'
import { FiCalendar, FiClock, FiTrendingUp } from 'react-icons/fi'
import { MdHistory } from 'react-icons/md'
import { SiLivechat } from 'react-icons/si'
import { profileAPI } from '@api/memberAPI'
import { gameProviderAPI, type GameProvider } from '@api/gameProviderAPI'
import { siteContentAPI } from '@api/siteContentAPI'
import { memberLotteryAPI, type OpenPeriod } from '@api/memberLotteryAPI'
import type { PromotionBanner } from '@/types/siteContent'
import { useMemberStore } from '@store/memberStore'
import { toast } from 'react-hot-toast'
import MemberChat from '@/components/chat/MemberChat'
import MemberNavbar from '@/components/MemberNavbar'

// Use the imported PromotionBanner type from siteContentAPI
type SiteSettingsMap = {
  [key: string]: string
}

const MemberIndex = () => {
  const navigate = useNavigate()
  const { logout, member } = useMemberStore()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [providers, setProviders] = useState<GameProvider[]>([])
  const [promotions, setPromotions] = useState<PromotionBanner[]>([])
  const [smallBanners, setSmallBanners] = useState<PromotionBanner[]>([])
  const [largeBanners, setLargeBanners] = useState<PromotionBanner[]>([])
  const [bannerImages, setBannerImages] = useState<string[]>([])
  const [settings, setSettings] = useState<SiteSettingsMap>({})
  const [activeTab, setActiveTab] = useState('Lottery')
  const [games, setGames] = useState<any[]>([])
  const [gamesLoading, setGamesLoading] = useState(false)
  const [lotteryPeriods, setLotteryPeriods] = useState<any[]>([])
  const [lotteryLoading, setLotteryLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('memberToken')

    if (!token) {
      // Redirect to login without showing toast (prevents multiple toasts in loop)
      window.location.href = '/member/login'
      return
    }

    // Check if this is first login
    const isFirstLogin = localStorage.getItem('isFirstLogin')
    if (isFirstLogin === 'true') {
      setShowWelcomeModal(true)
      localStorage.removeItem('isFirstLogin') // Remove flag after showing
    }
  }, [navigate])

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('memberToken')

    if (token) {
      loadContent()
    }
  }, [])

  // Auto-refresh profile every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      loadProfile()
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Reload providers when tab changes
  useEffect(() => {
    if (activeTab === 'Lottery') {
      loadLotteryPeriods()
    } else {
      loadProviders(activeTab)
    }
  }, [activeTab])

  const { loadProfile: loadMemberProfile } = useMemberStore()

  const loadProfile = async () => {
    try {
      await loadMemberProfile()
      // Update local profile state from store
      const updatedMember = useMemberStore.getState().member
      if (updatedMember) {
        setProfile(updatedMember)
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  const loadContent = async () => {
    try {
      setIsLoading(true)

      // Load member profile from store (already loaded from auth)
      if (member) {
        setProfile(member)
      }

      // Load banners from promotion_banners API (public endpoint)
      const bannersRes = await fetch(`${API_URL}/api/v1/public/promotion-banners`)
      if (bannersRes.ok) {
        const bannersData = await bannersRes.json()
        if (bannersData.success && bannersData.data) {
          // Filter banners for home page (display_location = 'home' or 'both')
          const homeBanners = bannersData.data.filter((b: any) => 
            b.display_location === 'home' || b.display_location === 'both'
          )
          setSmallBanners(homeBanners.filter((b: any) => b.banner_type === 'small'))
          const largeBannersData = homeBanners.filter((b: any) => b.banner_type === 'large')
          setLargeBanners(largeBannersData)
          
          // Convert large banners to image URLs
          const imageUrls = largeBannersData.map((b: any) => {
            const imagePath = b.image_url || b.image?.file_url
            return imagePath ? `${API_URL}${imagePath}` : ''
          }).filter((url: string) => url)
          setBannerImages(imageUrls)
        }
      }

      // Load settings
      const settingsRes = await fetch(`${API_URL}/api/v1/public/settings`)
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        if (settingsData.success && settingsData.data) {
          setSettings(settingsData.data)
        }
      }

      // Load initial providers
      await loadProviders(activeTab)
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadProviders = async (category?: string) => {
    try {
      const url = category 
        ? `${API_URL}/api/v1/member/providers?category=${category}`
        : `${API_URL}/api/v1/member/providers`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setProviders(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to load providers:', error)
    }
  }

  const loadLotteryPeriods = async () => {
    try {
      setLotteryLoading(true)
      const data = await memberLotteryAPI.getOpenPeriods()

      // Sort lottery periods: open lotteries first, then closed ones
      const priorityOrder = ['GLO', 'GSB', 'BAAC']
      const sortedData = (data || []).sort((a, b) => {
        const now = new Date().getTime()
        const aExpired = new Date(a.closeTime).getTime() <= now
        const bExpired = new Date(b.closeTime).getTime() <= now

        // Open lotteries come before closed ones
        if (aExpired !== bExpired) {
          return aExpired ? 1 : -1
        }

        // Within same status (both open or both closed), prioritize GLO, GSB, BAAC
        const indexA = priorityOrder.indexOf(a.huayCode)
        const indexB = priorityOrder.indexOf(b.huayCode)

        // If both are in priority list, sort by priority order
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB
        }
        // Priority items come first
        if (indexA !== -1) return -1
        if (indexB !== -1) return 1
        // Others sorted by close time
        return new Date(a.closeTime).getTime() - new Date(b.closeTime).getTime()
      })

      setLotteryPeriods(sortedData)
    } catch (error) {
      console.error('Failed to load lottery periods:', error)
      setLotteryPeriods([])
    } finally {
      setLotteryLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/member/login')
    toast.success('ออกจากระบบสำเร็จ')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Calculate countdown
  const getCountdown = (closeTime: string) => {
    const close = new Date(closeTime).getTime()
    const now = currentTime.getTime()
    const diff = close - now

    if (diff <= 0) {
      return { text: 'ปิดรับแล้ว', expired: true, hours: 0, minutes: 0, seconds: 0 }
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { 
      text: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      expired: false,
      hours,
      minutes,
      seconds
    }
  }

  // Get lottery theme color
  const getLotteryTheme = (huayCode: string) => {
    const themes: Record<string, { gradient: string, glow: string, icon: string }> = {
      'GLO': { 
        gradient: 'from-rose-500 via-red-600 to-rose-700', 
        glow: 'shadow-rose-500/50',
        icon: '🇹🇭'
      },
      'GSB': { 
        gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', 
        glow: 'shadow-pink-500/50',
        icon: '🏦'
      },
      'BAAC': { 
        gradient: 'from-blue-600 via-indigo-700 to-blue-800', 
        glow: 'shadow-blue-500/50',
        icon: '🌾'
      },
    }
    return themes[huayCode] || { 
      gradient: 'from-purple-500 via-violet-600 to-purple-700', 
      glow: 'shadow-purple-500/50',
      icon: '🎲'
    }
  }

  // Get provider image URL
  const getProviderImage = (provider: GameProvider) => {
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

  // Categories - ต้องตรงกับ category ใน database
  const categories = [
    { id: 'Lottery', name: 'หวย', icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
    { id: 'all', name: 'ทั้งหมด', icon: '/images/sacasino/categories/menu-icon-category-baccarat.png', iconHover: '/images/sacasino/categories/menu-icon-category-baccarat-hover.png' },
    { id: 'Slot', name: 'สล็อต', icon: '/images/sacasino/categories/menu-icon-category-slot.png', iconHover: '/images/sacasino/categories/menu-icon-category-slot-hover.png' },
    { id: 'Live Casino', name: 'คาสิโนสด', icon: '/images/sacasino/categories/menu-icon-category-baccarat.png', iconHover: '/images/sacasino/categories/menu-icon-category-baccarat-hover.png' },
    { id: 'Game Card', name: 'เกมไพ่', icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
    { id: 'Sport', name: 'กีฬา', icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
    { id: 'Poker', name: 'โป๊กเกอร์', icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
  ]

  // Action buttons configuration
  const actionButtons = [
    {
      id: 'deposit',
      name: 'เติมเงิน',
      icon: <FaCoins className="text-2xl" />,
      link: '/member/deposit',
      bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
    },
    {
      id: 'withdraw',
      name: 'ถอนเงิน',
      icon: <FaMoneyBillWave className="text-2xl" />,
      link: '/member/withdraw',
      bg: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'lottery-history',
      name: 'โพยหวย',
      icon: <FaDice className="text-2xl" />,
      link: '/member/lottery/history',
      bg: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    },
    {
      id: 'lottery-results',
      name: 'ผลหวย',
      icon: <FaGamepad className="text-2xl" />,
      link: '/member/lottery/results',
      bg: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
    },
    {
      id: 'promotions',
      name: 'โปรโมชั่น',
      icon: <FaGift className="text-2xl" />,
      link: '/member/promotions',
      bg: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
    },
    {
      id: 'support',
      name: 'แชทช่วยเหลือ',
      icon: <SiLivechat className="text-2xl" />,
      link: '#chat',
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
    }
  ]

  // Game categories
  const gameCategories = [
    { id: 'all', name: 'ทั้งหมด', icon: <FaGamepad /> },
    { id: 'slot', name: 'สล็อต', icon: <FaDice /> },
    { id: 'live', name: 'คาสิโนสด', icon: <FaGamepad /> },
    { id: 'lottery', name: 'หวย', icon: <FaDice /> },
    { id: 'sport', name: 'กีฬา', icon: <FaFootballBall /> },
    { id: 'poker', name: 'โป๊กเกอร์', icon: <FaGamepad /> },
  ]

  // Features
  const features = [
    {
      icon: <FaCoins className="text-4xl text-yellow-500" />,
      title: 'ฝาก-ถอน ออโต้',
      description: 'รวดเร็วภายใน 1 นาที',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: <FaMobileAlt className="text-4xl text-blue-500" />,
      title: 'รองรับทุกอุปกรณ์',
      description: 'เล่นได้ทั้งมือถือและคอมพิวเตอร์',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FaHeadset className="text-4xl text-green-500" />,
      title: 'แชทสด 24 ชม.',
      description: 'บริการลูกค้าตลอด 24 ชั่วโมง',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-purple-500" />,
      title: 'ปลอดภัย 100%',
      description: 'ระบบรักษาความปลอดภัยมาตรฐานสูง',
      color: 'from-purple-500 to-violet-500'
    }
  ]


  // Filter games by category
  const filteredGames = activeTab === 'all' 
    ? providers 
    : providers.filter(provider => provider.category === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      <MemberNavbar profile={profile} settings={settings} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Special Menu - Removed hardcoded menu */}

        {/* Small Banners (แบนเนอร์เล็ก - แถวบน) */}
        {smallBanners.length > 0 && (
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {smallBanners.map((banner) => {
                const imagePath = banner.image?.file_url || banner.image_url || banner.banner_image
                const imageUrl = imagePath ? `${API_URL}${imagePath}` : ''
                return (
                  <Link
                    key={banner.id}
                    to={banner.link_url || '#'}
                    className="relative hover:scale-105 transition-transform group"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={banner.title}
                        className="w-full h-auto rounded-lg shadow-lg border-2 border-yellow-600/50 group-hover:border-yellow-400"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg p-4 text-center shadow-lg border-2 border-yellow-400">
                        <span className="text-white font-bold text-sm">{banner.title}</span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Large Banners Carousel (แบนเนอร์ใหญ่ - Swiper Slide from API) */}
        {bannerImages.length > 0 && (
          <div className="container mx-auto px-4 py-6">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop={true}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-12"
            >
              {bannerImages.map((imageUrl, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={imageUrl}
                    alt={`Banner ${index + 1}`}
                    className="w-full rounded-xl"
                    onError={(e) => {
                      console.error('Banner image load error:', imageUrl)
                      const target = e.target as HTMLImageElement
                      target.src = '/images/default-promo.jpg'
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Title */}
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            Bicycle678 บาคาร่า คาสิโนออนไลน์ เสือมังกร โปรแรงสุดในไทย ฝากถอนออโต้
          </h1>
        </div>

        {/* Category Menu (Sticky) */}
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

        {/* Games Grid or Lottery List */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {activeTab === 'Lottery' ? 'รายการหวยเปิดรับแทง' : 'เกมยอดนิยม'}
            </h2>
          </div>
          
          {activeTab === 'Lottery' ? (
            /* Lottery Periods List */
            <>
              {lotteryLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                  <p className="ml-4 text-white">กำลังโหลดรายการหวย...</p>
                </div>
              ) : lotteryPeriods.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lotteryPeriods.map((period) => {
                    const theme = getLotteryTheme(period.huayCode)
                    const countdown = getCountdown(period.closeTime)

                    // If lottery is closed, redirect to results page instead of betting page
                    const targetUrl = countdown.expired
                      ? '/member/lottery/results'
                      : `/member/lottery/bet/${period.id}`

                    return (
                  <Link
                    key={period.id}
                    to={targetUrl}
                    className={`relative overflow-hidden rounded-2xl shadow-2xl ${theme.glow} ${countdown.expired ? 'opacity-75' : 'hover:scale-105'} transition-all duration-300 group`}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-90`}></div>
                    
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                    </div>

                    {/* Content */}
                    <div className="relative p-6 text-white">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-3xl">{theme.icon}</span>
                            <h3 className="text-xl font-bold drop-shadow-lg">
                              {period.huayName}
                            </h3>
                          </div>
                          <p className="text-white/80 text-sm">งวดวันที่ {period.periodName}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                          <span className="text-xs font-semibold">#{period.id}</span>
                        </div>
                      </div>

                      {/* Countdown Timer */}
                      <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-white/70 flex items-center gap-1">
                            <FiClock className="animate-pulse" />
                            เหลือเวลา
                          </span>
                          {countdown.expired && (
                            <span className="text-xs bg-red-500/80 px-2 py-0.5 rounded-full">ปิดรับแล้ว</span>
                          )}
                        </div>
                        <div className={`text-center ${countdown.expired ? 'opacity-50' : ''}`}>
                          <div className="flex justify-center gap-2">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                              <div className="text-2xl font-bold font-mono">{countdown.hours.toString().padStart(2, '0')}</div>
                              <div className="text-[10px] text-white/70">ชั่วโมง</div>
                            </div>
                            <div className="flex items-center text-2xl font-bold">:</div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                              <div className="text-2xl font-bold font-mono">{countdown.minutes.toString().padStart(2, '0')}</div>
                              <div className="text-[10px] text-white/70">นาที</div>
                            </div>
                            <div className="flex items-center text-2xl font-bold">:</div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                              <div className="text-2xl font-bold font-mono">{countdown.seconds.toString().padStart(2, '0')}</div>
                              <div className="text-[10px] text-white/70">วินาที</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                          countdown.expired
                            ? 'bg-blue-500/80 text-white hover:bg-blue-600'
                            : 'bg-white/90 text-gray-900 hover:bg-white hover:shadow-lg'
                        }`}
                      >
                        {countdown.expired ? 'ดูผลหวย' : 'แทงหวยเลย!'}
                      </button>
                    </div>
                  </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <p>ไม่มีหวยเปิดรับแทงในขณะนี้</p>
                </div>
              )}
            </>
          ) : (
            /* Game Providers Grid */
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-800 p-2 hover:scale-105 transition-transform"
                  onClick={() => navigate(`/member/games/${provider.product_code}`)}
                >
                  <img
                    src={getProviderImage(provider)}
                    alt={provider.product_name}
                    className="w-full h-auto transition-transform group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://asset.cloudigame.co/build/admin/img/sa-gaming/ezs-sa-gaming-vertical.png'
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
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md mx-4 border-2 border-yellow-500 shadow-2xl"
          >
            {/* Confetti Animation */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                ยินดีต้อนรับ!
              </h2>
              <p className="text-white text-lg mb-4">
                สมัครสมาชิกสำเร็จ
              </p>
            </div>

            {/* Welcome Message */}
            <div className="bg-white/10 rounded-xl p-6 mb-6">
              <p className="text-white text-center mb-4">
                ขอบคุณที่เป็นส่วนหนึ่งของครอบครัว <span className="font-bold text-yellow-400">Bicycle678</span>
              </p>
              <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                  <FaCoins className="text-yellow-400" />
                  <span>ฝาก-ถอน ออโต้ รวดเร็วภายใน 1 นาที</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGift className="text-pink-400" />
                  <span>โปรโมชั่นสุดพิเศษรอคุณอยู่</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaDice className="text-purple-400" />
                  <span>เริ่มเล่นหวยได้ทันที!</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              เริ่มต้นใช้งาน
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0a0e13] py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 SA Casino Gaming. All rights reserved.</p>
        </div>
      </footer>

      {/* Member Chat */}
      <MemberChat />
    </div>
  )
}

export default MemberIndex
