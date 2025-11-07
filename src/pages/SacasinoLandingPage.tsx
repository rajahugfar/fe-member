import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaUser,
  FaUserPlus,
  FaLine,
  FaChevronDown,
  FaGamepad,
  FaDice,
  FaCoins,
  FaTimes,
  FaTelegram
} from 'react-icons/fa'
import { siteContentAPI } from '@api/siteContentAPI'
import { gameProviderAPI, type GameProvider as DBGameProvider } from '@api/gameProviderAPI'
import type { PromotionBanner, SiteSettingsMap } from '../types/siteContent'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const SacasinoLandingPage = () => {
  const navigate = useNavigate()
  const [providers, setProviders] = useState<DBGameProvider[]>([])
  const [promotions, setPromotions] = useState<PromotionBanner[]>([])
  const [settings, setSettings] = useState<SiteSettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [pendingLink, setPendingLink] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const [providersRes, promotionsRes, settingsRes] = await Promise.all([
        gameProviderAPI.getProviders(false),
        siteContentAPI.getPromotions('home'),
        siteContentAPI.getSiteSettings(),
      ])

      setProviders(providersRes.data)
      setPromotions(promotionsRes.data.data)
      setSettings(settingsRes.data.data)
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setLoading(false)
    }
  }

  // Check if user is logged in
  const isLoggedIn = () => {
    return !!localStorage.getItem('token')
  }

  // Handle click on game category or provider
  const handleGameClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault()
    if (isLoggedIn()) {
      navigate(link)
    } else {
      setPendingLink(link)
      setShowLoginPopup(true)
    }
  }

  // Handle login redirect
  const handleLoginRedirect = () => {
    setShowLoginPopup(false)
    navigate('/login', { state: { from: pendingLink } })
  }

  // Handle register redirect
  const handleRegisterRedirect = () => {
    setShowLoginPopup(false)
    navigate('/register', { state: { from: pendingLink } })
  }

  // Game categories matching sacasino.tech
  const gameCategories = [
    { name: 'สล็อต', image: '/images/sacasino/categories/menu-slot.png', link: '/games?category=slots' },
    { name: 'บาคาร่า', image: '/images/sacasino/categories/menu-baccarat.png', link: '/games?category=baccarat' },
    { name: 'รูเล็ต', image: '/images/sacasino/categories/menu-roulette.png', link: '/games?category=roulette' },
    { name: 'ไฮโล', image: '/images/sacasino/categories/menu-hilo.png', link: '/games?category=hilo' },
    { name: 'เสือมังกร', image: '/images/sacasino/categories/menu-dragon-tiger.png', link: '/games?category=dragon-tiger' },
    { name: 'แบล็กแจ็ก', image: '/images/sacasino/categories/menu-blackjack.png', link: '/games?category=blackjack' },
    { name: 'หวย', image: '/images/sacasino/categories/menu-lotto.png', link: '/lottery' },
    { name: 'กีฬา', image: '/images/sacasino/categories/menu-sport.png', link: '/games?category=sports' },
  ]

  // Default promotions - using actual banners from sacasino.tech
  const defaultPromotions = [
    { id: '1', image: '/images/sacasino/banners/6ac8f2cc45f6b89e2266496f03a8f270.jpg', title: 'โปรโมชั่น 1' },
    { id: '2', image: '/images/sacasino/banners/af6e0b7dacc35d572f58b70a18a5d926.jpg', title: 'โปรโมชั่น 2' },
    { id: '3', image: '/images/sacasino/banners/062a43b54902c26ca542b464642b4dbf.jpg', title: 'โปรโมชั่น 3' },
    { id: '4', image: '/images/sacasino/banners/ed589e77f72bb6e2edc67040e18c6de4.jpg', title: 'โปรโมชั่น 4' },
    { id: '5', image: '/images/sacasino/banners/fad31dcc94be4093b4d36e7786893ca6.jpg', title: 'โปรโมชั่น 5' },
  ]

  // Game providers - using actual images from sacasino.tech
  const staticProviders = [
    { id: '1', name: 'SA Gaming', image: '/images/sacasino/providers/ezs-sa-gaming-vertical.png', link: '/games?provider=SA-GAMING' },
    { id: '2', name: 'Pragmatic Play', image: '/images/sacasino/providers/ezs-wt-ppa-live-vertical.png', link: '/games?provider=PRAGMATIC' },
    { id: '3', name: 'Evolution Gaming', image: '/images/sacasino/providers/ezs-wt-eg-vertical.png', link: '/games?provider=EVOLUTION' },
    { id: '4', name: 'Dream Gaming', image: '/images/sacasino/providers/ezs-wt-dg-v2-vertical.png', link: '/games?provider=DREAM' },
    { id: '5', name: 'WM Casino', image: '/images/sacasino/providers/ezs-wm-vertical.png', link: '/games?provider=WM' },
    { id: '6', name: 'AE Sexy', image: '/images/sacasino/providers/ezs-wt-aesexy-vertical.png', link: '/games?provider=AESEXY' },
    { id: '7', name: 'Allbet', image: '/images/sacasino/providers/ezs-wt-allbet-full-vertical.png', link: '/games?provider=ALLBET' },
    { id: '8', name: 'Asia Gaming', image: '/images/sacasino/providers/ezs-wtm-asia-gaming-vertical.png', link: '/games?provider=ASIA-GAMING' },
  ]

  const faqs = [
    {
      question: `${settings.site_name || 'SACASINO'} เป็นเว็บคาสิโนออนไลน์ที่ไหนเชื่อถือหรือไม่?`,
      answer: 'เว็บคาสิโนออนไลน์ของเรามีมาตรฐานสากล ได้รับใบอนุญาตถูกต้องตามกฎหมาย มีระบบรักษาความปลอดภัยสูง'
    },
    {
      question: `${settings.site_name || 'SACASINO'} มีเกมอะไรให้เล่นบ้าง?`,
      answer: 'มีเกมให้เลือกเล่นมากมาย ทั้งสล็อต บาคาร่า รูเล็ต ไฮโล เสือมังกร ยิงปลา และอื่นๆอีกมากมาย'
    },
    {
      question: `ระบบฝาก-ถอนของ ${settings.site_name || 'SACASINO'} ใช้เวลานานแค่ไหน?`,
      answer: 'ระบบอัตโนมัติ รวดเร็วภายใน 30 วินาที ไม่มีขั้นต่ำ'
    },
    {
      question: `${settings.site_name || 'SACASINO'} มีโปรโมชั่นอะไรบ้าง?`,
      answer: 'มีโปรโมชั่นมากมาย โบนัสต้อนรับ คืนยอดเสีย ฝากครั้งแรก และโปรพิเศษอื่นๆอีกมากมาย'
    },
    {
      question: `สามารถติดต่อทีมงาน ${settings.site_name || 'SACASINO'} ได้ช่องทางไหน?`,
      answer: 'สามารถติดต่อได้ตลอด 24 ชั่วโมง ผ่าน Line, Telegram, Facebook หรือแชทสด'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ 
      background: '#0f1419',
      backgroundAttachment: 'fixed'
    }}>
      {/* Background Pattern - sacasino.tech style (very dark) */}
      <div className="fixed inset-0" style={{
        backgroundImage: 'url(/images/sacasino/backgrounds/index-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.05
      }} />
      <div className="fixed inset-0" style={{
        background: 'radial-gradient(circle at 50% 0%, rgba(20, 30, 40, 0.3) 0%, transparent 50%)'
      }} />

      {/* Animated background elements */}
      <div className="fixed top-20 left-10 animate-bounce-slow opacity-10 hover:opacity-30 transition-opacity">
        <FaCoins className="text-yellow-500 text-6xl drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
      </div>
      <div className="fixed top-40 right-20 animate-bounce-slow opacity-10 hover:opacity-30 transition-opacity" style={{ animationDelay: '1s' }}>
        <FaDice className="text-yellow-500 text-5xl drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
      </div>
      <div className="fixed bottom-40 left-20 animate-bounce-slow opacity-10 hover:opacity-30 transition-opacity" style={{ animationDelay: '2s' }}>
        <FaGamepad className="text-yellow-500 text-5xl drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header - sacasino.tech style */}
        <header className="relative">
          {/* Top decoration bar - gold gradient */}
          <div className="h-2 bg-gradient-to-r from-[#d4af37] via-[#f5d042] to-[#d4af37]" />

          {/* Main header - dark gold/brown */}
          <div className="relative shadow-2xl" style={{
            background: 'linear-gradient(180deg, #8B6914 0%, #6B5011 100%)'
          }}>
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-4 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl">
                      <img
                        src="/images/sacasino/logos/logo.png"
                        alt="Logo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/logo.webp'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-white drop-shadow-2xl tracking-wide text-glow">
                      {settings.site_name || 'SACASINO'}
                    </h1>
                    <p className="text-yellow-200 text-sm font-semibold drop-shadow-lg">
                      คาสิโนออนไลน์ อันดับ 1
                    </p>
                  </div>
                </Link>

                {/* Auth Buttons - sacasino.tech style */}
                <div className="flex items-center gap-3">
                  <Link
                    to="/member/login"
                    className="relative px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all flex items-center gap-2 text-sm"
                    style={{
                      background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    <FaUser /> เข้าสู่ระบบ
                  </Link>
                  <Link
                    to="/member/register"
                    className="relative px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all flex items-center gap-2 text-sm animate-pulse"
                    style={{
                      background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)',
                      color: '#1e3a1e',
                      boxShadow: '0 4px 15px rgba(251, 191, 36, 0.5)'
                    }}
                  >
                    <FaUserPlus /> สมัครสมาชิก
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom curved decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-yellow-800 to-transparent" />
          </div>

          {/* Quick Action Menu */}
          <div className="container mx-auto px-4 -mt-6 relative z-20">
            <div className="grid grid-cols-4 gap-4">
              <Link
                to="/member/profile"
                className="relative hover:scale-105 transition-transform group"
              >
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-center shadow-lg border-2 border-blue-400 group-hover:shadow-glow-green">
                  <FaUser className="text-3xl text-white mx-auto mb-2" />
                  <span className="text-white font-bold">บัญชี</span>
                </div>
              </Link>

              <Link
                to="/member/deposit"
                className="relative hover:scale-105 transition-transform group"
              >
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4 text-center shadow-lg border-2 border-green-400 group-hover:shadow-glow-green">
                  <FaCoins className="text-3xl text-white mx-auto mb-2" />
                  <span className="text-white font-bold">ฝากถอน</span>
                </div>
              </Link>

              <Link
                to="/member/register"
                className="relative hover:scale-105 transition-transform group"
              >
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-center shadow-lg border-2 border-yellow-300 group-hover:shadow-glow-yellow">
                  <FaUserPlus className="text-3xl text-green-900 mx-auto mb-2" />
                  <span className="text-green-900 font-bold">สมัคร</span>
                </div>
              </Link>

              <a
                href={settings.contact_line || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="relative hover:scale-105 transition-transform group"
              >
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-4 text-center shadow-lg border-2 border-green-300 group-hover:shadow-glow-green">
                  <FaLine className="text-3xl text-white mx-auto mb-2" />
                  <span className="text-white font-bold">ติดต่อ</span>
                </div>
              </a>
            </div>
          </div>
        </header>
  
      {/* Hero Section */}
        <section className="container mx-auto px-4 py-10">
          <div className="bg-gradient-to-br from-green-900/50 to-green-950/50 backdrop-blur-md rounded-3xl border-4 border-yellow-600/80 shadow-glow-yellow overflow-hidden hover:border-yellow-500 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left - Promotion Carousel */}
              <div className="relative">
                <Swiper
                  modules={[Autoplay, Pagination, EffectFade]}
                  effect="fade"
                  spaceBetween={0}
                  slidesPerView={1}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  pagination={{
                    clickable: true,
                    bulletActiveClass: '!bg-yellow-500',
                  }}
                  loop
                  className="rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-700"
                >
                  {(promotions.length > 0 ? promotions : defaultPromotions).map((promo: any) => (
                    <SwiperSlide key={promo.id}>
                      <img
                        src={promo.image?.file_url || promo.image}
                        alt={promo.title}
                        className="w-full aspect-square object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/sacasino/default-promo.jpg'
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Right - Quick Links */}
              <div className="flex flex-col gap-4 justify-center">
                <Link
                  to="/member/promotions"
                  className="relative hover:scale-105 transition-transform group"
                >
                  <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-center shadow-lg border-2 border-purple-400 group-hover:shadow-glow-green">
                    <FaGamepad className="text-4xl text-white mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-white">โปรโมชั่น</h3>
                    <p className="text-purple-200 text-sm mt-2">รับโบนัสพิเศษ</p>
                  </div>
                </Link>

                <a
                  href={settings.social_line || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative hover:scale-105 transition-transform group"
                >
                  <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-center shadow-lg border-2 border-green-400 group-hover:shadow-glow-green">
                    <FaLine className="text-4xl text-white mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-white">LINE</h3>
                    <p className="text-green-200 text-sm mt-2">ติดต่อสอบถาม</p>
                  </div>
                </a>

                <a
                  href={settings.social_telegram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative hover:scale-105 transition-transform group"
                >
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-center shadow-lg border-2 border-blue-400 group-hover:shadow-glow-green">
                    <FaTelegram className="text-4xl text-white mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-white">Telegram</h3>
                    <p className="text-blue-200 text-sm mt-2">ข่าวสาร</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Game Categories */}
        <section className="container mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 text-glow">
              หมวดเกมส์
            </h2>
            <p className="text-gray-300 text-lg">เลือกเล่นเกมส์ที่คุณชื่นชอบ</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gameCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <a
                  href={category.link}
                  onClick={(e) => handleGameClick(e, category.link)}
                  className="relative rounded-2xl shadow-glow-yellow hover:shadow-glow-green hover:scale-105 transition-all duration-300 group overflow-hidden block border-2 border-transparent hover:border-yellow-500/50 cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-center border-2 border-gray-700 group-hover:border-yellow-500 transition-all duration-300">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/sacasino/default-game.png'
                      }}
                    />
                    <h3 className="text-white font-bold text-lg group-hover:text-yellow-400 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Game Providers */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 text-glow">
              ค่ายเกมส์
            </h2>
            <p className="text-gray-300 text-lg">ค่ายเกมส์ชั้นนำระดับโลก</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {staticProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <a
                  href={provider.link}
                  onClick={(e) => handleGameClick(e, provider.link)}
                  className="block relative group cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-gray-700 group-hover:border-yellow-500 shadow-lg group-hover:shadow-glow-yellow transition-all duration-300">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-full h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/sacasino/providers/default.png'
                      }}
                    />
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Promotions Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2 text-glow">
              กิจกรรม
            </h2>
            <p className="text-gray-300 text-lg">โปรโมชั่นและกิจกรรมพิเศษ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(promotions.length > 0 ? promotions : defaultPromotions).map((promo: any, index) => (
              <motion.div
                key={promo.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={promo.link_url || '/member/promotions'}
                  className="block relative bg-gradient-to-br from-green-900/80 to-green-950/80 backdrop-blur-sm rounded-2xl border-4 border-yellow-700 shadow-glow-yellow overflow-hidden hover:scale-105 transition-all duration-300 group"
                >
                  <img
                    src={promo.image?.file_url || promo.image}
                    alt={promo.title}
                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/sacasino/default-promo.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>    
    {/* SEO Content & FAQ */}
        <section className="container mx-auto px-4 py-12">
          <div className="bg-gradient-to-br from-green-900/40 to-green-950/40 backdrop-blur-sm rounded-3xl border-4 border-yellow-700 p-8">
            {/* SEO Text */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-green-400 mb-4">
                {settings.site_name || 'SACASINO'} คาสิโนออนไลน์ เล่นง่าย จ่ายจริง การันตีความมั่นคง
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {settings.site_description || 'เว็บคาสิโนออนไลน์อันดับหนึ่งของประเทศไทย มาตรฐานสากล ระบบปลอดภัย ฝาก-ถอนรวดเร็ว พร้อมให้บริการตลอด 24 ชั่วโมง'}
              </p>
              <p className="text-gray-300 leading-relaxed">
                มีเกมให้เลือกเล่นหลากหลาย ทั้ง <span className="text-green-400 font-bold">บาคาร่า สล็อต รูเล็ต ไฮโล</span> และเกมคาสิโนสดอื่นๆอีกมากมาย จากค่ายชั้นนำระดับโลก พร้อมโปรโมชั่นมากมาย โบนัสต้อนรับ คืนยอดเสีย ระบบอัตโนมัติรวดเร็วทันใจ
              </p>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-6">
                FAQ คำถามที่พบบ่อยเกี่ยวกับ {settings.site_name || 'SACASINO'}
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-green-900/30 backdrop-blur-sm rounded-xl border-2 border-green-700 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-green-800/30 transition-colors"
                    >
                      <span className="text-green-300 font-semibold pr-4">{faq.question}</span>
                      <FaChevronDown
                        className={`text-green-400 transition-transform ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950/80 backdrop-blur-sm border-t-4 border-yellow-700 py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Certifications */}
              <div>
                <h3 className="text-green-400 font-bold text-lg mb-4">การรับรอง</h3>
                <div className="flex gap-3 flex-wrap">
                  <img src="/images/sacasino/certs/cert1.png" alt="Cert 1" className="w-12 h-12 object-contain" />
                  <img src="/images/sacasino/certs/cert2.png" alt="Cert 2" className="w-12 h-12 object-contain" />
                  <img src="/images/sacasino/certs/cert3.png" alt="Cert 3" className="w-12 h-12 object-contain" />
                  <img src="/images/sacasino/certs/cert4.png" alt="Cert 4" className="w-12 h-12 object-contain" />
                </div>
              </div>

              {/* Responsible Gaming */}
              <div>
                <h3 className="text-green-400 font-bold text-lg mb-4">การเล่นอย่างมีความรับผิดชอบ</h3>
                <div className="flex gap-3 flex-wrap">
                  <img src="/images/sacasino/gaming/gaming1.png" alt="Gaming 1" className="w-12 h-12 object-contain" />
                  <img src="/images/sacasino/gaming/gaming2.png" alt="Gaming 2" className="w-12 h-12 object-contain" />
                  <img src="/images/sacasino/gaming/gaming3.png" alt="Gaming 3" className="w-12 h-12 object-contain" />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-green-400 font-bold text-lg mb-4">วิธีการชำระเงิน</h3>
                <div className="grid grid-cols-6 gap-2">
                  <img src="/images/sacasino/payments/visa.png" alt="Visa" className="w-8 h-8 object-contain" />
                  <img src="/images/sacasino/payments/mastercard.png" alt="Mastercard" className="w-8 h-8 object-contain" />
                  <img src="/images/sacasino/payments/scb.png" alt="SCB" className="w-8 h-8 object-contain" />
                  <img src="/images/sacasino/payments/kbank.png" alt="KBANK" className="w-8 h-8 object-contain" />
                  <img src="/images/sacasino/payments/truewallet.png" alt="TrueWallet" className="w-8 h-8 object-contain" />
                  <img src="/images/sacasino/payments/promptpay.png" alt="PromptPay" className="w-8 h-8 object-contain" />
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-800">
              © {new Date().getFullYear()} {settings.site_name || 'SACASINO'}. All rights reserved.
              <p className="mt-2">เล่นการพนันอย่างมีสติ ห้ามผู้ที่มีอายุต่ำกว่า 18 ปีเข้าเล่น</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Contact Button */}
      <a
        href={settings.contact_line || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-glow-green hover:scale-110 transition-transform z-50 animate-bounce-slow"
      >
        <FaLine className="text-3xl text-white" />
      </a>

      {/* Login Required Popup */}
      <AnimatePresence>
        {showLoginPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowLoginPopup(false)}
            />

            {/* Popup Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-yellow-500/30 shadow-glow-yellow overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 relative">
                  <button
                    onClick={() => setShowLoginPopup(false)}
                    className="absolute top-4 right-4 text-black hover:text-gray-800 transition-colors"
                  >
                    <FaTimes className="text-2xl" />
                  </button>
                  <FaGamepad className="text-5xl text-black mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-black text-center">
                    เข้าสู่ระบบเพื่อเล่นเกม
                  </h2>
                </div>

                {/* Body */}
                <div className="p-8 text-center">
                  <p className="text-gray-300 text-lg mb-8">
                    กรุณาเข้าสู่ระบบหรือสมัครสมาชิก<br />เพื่อเข้าเล่นเกมส์
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={handleLoginRedirect}
                      className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-xl transition-all duration-300 shadow-glow-yellow hover:shadow-glow-green transform hover:scale-105"
                    >
                      <FaUser className="inline-block mr-2" />
                      เข้าสู่ระบบ
                    </button>

                    <button
                      onClick={handleRegisterRedirect}
                      className="w-full py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300 border-2 border-gray-600 hover:border-gray-500 transform hover:scale-105"
                    >
                      <FaUserPlus className="inline-block mr-2" />
                      สมัครสมาชิก
                    </button>

                    <button
                      onClick={() => setShowLoginPopup(false)}
                      className="w-full py-3 px-6 text-gray-400 hover:text-white transition-colors"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SacasinoLandingPage