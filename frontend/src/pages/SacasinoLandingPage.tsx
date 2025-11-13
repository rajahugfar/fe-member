import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { FaGamepad, FaDice, FaCoins } from 'react-icons/fa'
import { siteContentAPI } from '@api/siteContentAPI'
import type { PromotionBanner, SiteSettingsMap } from '../types/siteContent'
import Header from '@/components/landing/Header'
import HeroSection from '@/components/landing/HeroSection'
import GameCategoriesGrid from '@/components/landing/GameCategoriesGrid'
import GameProvidersSection from '@/components/landing/GameProvidersSection'
import PromotionsGrid from '@/components/landing/PromotionsGrid'
import SEOAndFAQ from '@/components/landing/SEOAndFAQ'
import Footer from '@/components/landing/Footer'
import FloatingContactButton from '@/components/landing/FloatingContactButton'
import LoginRequiredModal from '@/components/landing/LoginRequiredModal'

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'

interface GameProvider {
  id: number
  product_name: string
  image_path: string
  category: string
}

const SacasinoLandingPage = () => {
  const navigate = useNavigate()
  const [providers, setProviders] = useState<GameProvider[]>([])
  const [promotions, setPromotions] = useState<PromotionBanner[]>([])
  const [settings, setSettings] = useState<SiteSettingsMap>({})
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [pendingLink, setPendingLink] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadContent()
  }, [])

  // Reload providers when tab changes
  useEffect(() => {
    loadProviders(activeTab)
  }, [activeTab])

  const loadContent = async () => {
    try {
      const [promotionsRes, settingsRes] = await Promise.all([
        siteContentAPI.getPromotions('home'),
        siteContentAPI.getSiteSettings(),
      ])

      setPromotions(promotionsRes.data.data)
      setSettings(settingsRes.data.data)
      
      // Load initial providers
      await loadProviders(activeTab)
    } catch (error) {
      console.error('Failed to load content:', error)
    }
  }

  const loadProviders = async (category?: string) => {
    try {
      const url = category && category !== 'all'
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

  // Check if user is logged in (check both old and new auth)
  const isLoggedIn = () => {
    return !!localStorage.getItem('token') || !!localStorage.getItem('memberToken')
  }

  // Handle click on game provider
  const handleProviderClick = (e: React.MouseEvent, provider: GameProvider) => {
    e.preventDefault()
    if (isLoggedIn()) {
      // Navigate to game lobby with provider filter
      navigate(`/member/games?provider=${provider.product_name}`)
    } else {
      setPendingLink(`/member/games?provider=${provider.product_name}`)
      setShowLoginPopup(true)
    }
  }

  // Handle login redirect
  const handleLoginRedirect = () => {
    setShowLoginPopup(false)
    navigate('/member/login', { state: { from: pendingLink } })
  }

  // Handle register redirect
  const handleRegisterRedirect = () => {
    setShowLoginPopup(false)
    navigate('/member/login', { state: { from: pendingLink } })
  }







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
        {/* Header Component */}
        <Header 
          siteName={settings.site_name || 'SACASINO'} 
          contactLine={settings.contact_line}
        />

        {/* Hero Section Component */}
        <HeroSection
          promotions={promotions.map((p: any) => ({
            id: p.id,
            image: p.image?.file_url || p.image,
            title: p.title,
            link_url: p.link_url
          }))}
          socialLine={settings.social_line}
          socialTelegram={settings.social_telegram}
        />

        {/* Game Categories Component with Tabs */}
        <GameCategoriesGrid 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Game Providers Component */}
        <GameProvidersSection
          providers={providers}
          onProviderClick={handleProviderClick}
        />

        {/* Promotions Grid Component */}
        <PromotionsGrid
          promotions={promotions.map((p: any) => ({
            id: p.id,
            image: p.image?.file_url || p.image,
            title: p.title,
            link_url: p.link_url
          }))}
        />    
        {/* SEO Content & FAQ Component */}
        <SEOAndFAQ
          siteName={settings.site_name || 'SACASINO'}
          siteDescription={settings.site_description}
          faqs={faqs}
        />

        {/* Footer Component */}
        <Footer siteName={settings.site_name || 'SACASINO'} />
      </div>

      {/* Floating Contact Button Component */}
      <FloatingContactButton contactLine={settings.contact_line} />

      {/* Login Required Modal Component */}
      <AnimatePresence>
        <LoginRequiredModal
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onLogin={handleLoginRedirect}
          onRegister={handleRegisterRedirect}
        />
      </AnimatePresence>
    </div>
  )
}

export default SacasinoLandingPage