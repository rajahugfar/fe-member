import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
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
  FaFootballBall
} from 'react-icons/fa'
import { SiLivechat } from 'react-icons/si'
import { profileAPI } from '@api/memberAPI'
import { gameProviderAPI, type GameProvider } from '@api/gameProviderAPI'
import { siteContentAPI } from '@api/siteContentAPI'
import type { PromotionBanner } from '@/types/siteContent'
import { useMemberStore } from '@store/memberStore'
import { toast } from 'react-hot-toast'
import MemberChat from '@/components/chat/MemberChat'

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
  const [settings, setSettings] = useState<SiteSettingsMap>({})
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    loadContent()
  }, [])

  // Reload providers when tab changes
  useEffect(() => {
    loadProviders(activeTab)
  }, [activeTab])

  const loadContent = async () => {
    try {
      setIsLoading(true)
      const [profileRes, providersRes, promotionsRes, settingsRes] = await Promise.all([
        profileAPI.getProfile(),
        gameProviderAPI.getProviders(),
        siteContentAPI.getPromotions('home'),
        siteContentAPI.getSiteSettings()
      ])

      setProfile(profileRes.data)
      setProviders(providersRes.data)
      setPromotions(promotionsRes.data.data || [])
      setSettings(settingsRes.data.data || {})
    } catch (error) {
      console.error('Failed to load content:', error)
      // Fallback to member from store if API fails
      if (member) {
        setProfile(member)
      }
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setIsLoading(false)
    }
  }

  const loadProviders = async (category?: string) => {
    try {
      setIsLoading(true)
      let response

      // Filter by category if specified and not 'all' or 'new'
      if (category && category !== 'all' && category !== 'new') {
        response = await gameProviderAPI.getProvidersByCategory(category)
      } else {
        response = await gameProviderAPI.getProviders()
      }

      setProviders(response.data)
    } catch (error) {
      console.error('Failed to load providers:', error)
      toast.error('ไม่สามารถโหลด providers ได้')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/member/login')
    toast.success('ออกจากระบบสำเร็จ')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

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

      {/* Header */}
      <header className="relative z-20 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-2xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/member" className="flex items-center space-x-3">
              <img 
                src="/images/logo.webp" 
                alt="Logo" 
                className="h-12 w-auto" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/logo.png';
                }}
              />
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                {settings.site_name || 'PERMCHOK'}
              </span>
            </Link>

            {/* User Info & Actions */}
            {profile && (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-sm">{profile.username || profile.phone}</div>
                    <div className="text-yellow-400 text-xs font-semibold flex items-center">
                      <FaCoins className="mr-1" />
                      {formatCurrency(profile.credits || 0)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  <FaSignOutAlt />
                  <span className="hidden md:inline">ออกจากระบบ</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 space-y-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8 pb-12 relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
            ยินดีต้อนรับสู่ {settings.site_name || 'Permchok'}
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {settings.site_description || 'เว็บแทงหวยและเกมออนไลน์ จ่ายจริง จ่ายเร็ว ฝาก-ถอนออโต้ 24 ชั่วโมง'}
          </p>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {actionButtons.map((button) => (
              <Link
                key={button.id}
                to={button.link}
                className={`${button.bg} text-white rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
              >
                {button.icon}
                <span className="font-medium text-sm">{button.name}</span>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Game Categories */}
        <section className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">หมวดหมู่เกมส์</h2>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${
                  activeTab === category.id 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg scale-105' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Games Grid */}
        <section className="relative z-10">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
              <p className="mt-4 text-gray-400">กำลังโหลดเกมส์...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link 
                  to={`/games/play/${game.id}`}
                  className="block bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
                >
                  <div className="relative pt-[100%] bg-gray-800">
                    <img
                      src={game.image_path ? `${API_URL}/${game.image_path}` : '/images/game-placeholder.jpg'}
                      alt={game.product_name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/game-placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white font-medium text-sm truncate">{game.product_name}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Features */}
        <section className="relative z-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${feature.color}/10 border ${feature.color}/20 rounded-xl p-6 text-center backdrop-blur-sm`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${feature.color}/20 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Promotions */}
        {promotions.length > 0 && (
          <section className="relative z-10 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">โปรโมชั่นพิเศษ</h2>
              <Link 
                to="/member/promotions" 
                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center"
              >
                ดูทั้งหมด <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.slice(0, 3).map((promo) => (
                <motion.div
                  key={promo.id}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link 
                    to={promo.link_url || '/member/promotions'}
                    className="block bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all duration-300"
                  >
                    <div className="relative pt-[56.25%] bg-gray-800">
                      {promo.image ? (
                        <img
                          src={promo.image.file_url}
                          alt={promo.image.alt_text || promo.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-yellow-600/20">
                          <FaGift className="text-4xl text-yellow-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{promo.title}</h3>
                      {promo.description && (
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {promo.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Chat Widget */}
        <div id="chat" className="fixed bottom-6 right-6 z-50">
          <MemberChat />
        </div>
      </div>
    </div>
  )
}

export default MemberIndex
