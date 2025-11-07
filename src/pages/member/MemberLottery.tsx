import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiClock,
  FiTrendingUp,
  FiFileText,
  FiCalendar,
  FiAward,
  FiChevronRight,
  FiStar,
  FiZap
} from 'react-icons/fi'
import { memberLotteryAPI, OpenPeriod } from '@api/memberLotteryAPI'
import { toast } from 'react-hot-toast'

type TabType = 'list' | 'results' | 'history'

// Helper function to get lottery flag/icon
const getLotteryIcon = (huayCode: string) => {
  const icons: Record<string, string> = {
    'GLO': '🇹🇭',
    'GSB': '🏦',
    'BAAC': '🌾',
    'SET_1': '📈',
    'SET_2': '📊',
    'SET_3': '📉',
    'SETNOON': '🔔',
    'SET': '💹',
    'YEEKEE': '🎲'
  }
  return icons[huayCode] || '🎰'
}

// Helper to get lottery theme color - ปรับสีให้นุ่มนวลและ elegant มากขึ้น
const getLotteryTheme = (huayCode: string) => {
  const themes: Record<string, {
    gradient: string
    shadow: string
    border: string
    glow: string
    accent: string
  }> = {
    'GLO': {
      gradient: 'from-rose-500/90 via-red-600/90 to-rose-700/90',
      shadow: 'shadow-rose-500/30',
      border: 'border-rose-300/50',
      glow: 'hover:shadow-rose-400/50',
      accent: 'text-rose-200'
    },
    'GSB': {
      gradient: 'from-pink-500/90 via-fuchsia-600/90 to-pink-700/90',
      shadow: 'shadow-pink-500/30',
      border: 'border-pink-300/50',
      glow: 'hover:shadow-pink-400/50',
      accent: 'text-pink-200'
    },
    'BAAC': {
      gradient: 'from-blue-600/90 via-indigo-700/90 to-blue-800/90',
      shadow: 'shadow-blue-500/30',
      border: 'border-blue-300/50',
      glow: 'hover:shadow-blue-400/50',
      accent: 'text-blue-200'
    },
    'SET_1': {
      gradient: 'from-emerald-500/90 via-green-600/90 to-emerald-700/90',
      shadow: 'shadow-emerald-500/30',
      border: 'border-emerald-300/50',
      glow: 'hover:shadow-emerald-400/50',
      accent: 'text-emerald-200'
    },
    'SET_2': {
      gradient: 'from-cyan-500/90 via-teal-600/90 to-cyan-700/90',
      shadow: 'shadow-cyan-500/30',
      border: 'border-cyan-300/50',
      glow: 'hover:shadow-cyan-400/50',
      accent: 'text-cyan-200'
    },
    'SET_3': {
      gradient: 'from-amber-500/90 via-orange-600/90 to-amber-700/90',
      shadow: 'shadow-amber-500/30',
      border: 'border-amber-300/50',
      glow: 'hover:shadow-amber-400/50',
      accent: 'text-amber-200'
    },
    'SETNOON': {
      gradient: 'from-yellow-500/90 via-amber-600/90 to-yellow-700/90',
      shadow: 'shadow-yellow-500/30',
      border: 'border-yellow-300/50',
      glow: 'hover:shadow-yellow-400/50',
      accent: 'text-yellow-200'
    },
    'SET': {
      gradient: 'from-purple-500/90 via-violet-600/90 to-purple-700/90',
      shadow: 'shadow-purple-500/30',
      border: 'border-purple-300/50',
      glow: 'hover:shadow-purple-400/50',
      accent: 'text-purple-200'
    },
    'YEEKEE': {
      gradient: 'from-fuchsia-500/90 via-purple-600/90 to-fuchsia-700/90',
      shadow: 'shadow-fuchsia-500/30',
      border: 'border-fuchsia-300/50',
      glow: 'hover:shadow-fuchsia-400/50',
      accent: 'text-fuchsia-200'
    }
  }
  return themes[huayCode] || {
    gradient: 'from-slate-500/90 via-gray-600/90 to-slate-700/90',
    shadow: 'shadow-slate-500/30',
    border: 'border-slate-300/50',
    glow: 'hover:shadow-slate-400/50',
    accent: 'text-slate-200'
  }
}

// Check if lottery is premium (3 main lotteries)
const isPremiumLottery = (huayCode: string) => {
  return ['GLO', 'GSB', 'BAAC'].includes(huayCode)
}

const MemberLottery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('list')
  const [periods, setPeriods] = useState<OpenPeriod[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'list') {
      loadOpenPeriods()
    }
  }, [activeTab])

  const loadOpenPeriods = async () => {
    setLoading(true)
    try {
      const data = await memberLotteryAPI.getOpenPeriods()
      setPeriods(data || [])
    } catch (error) {
      console.error('Failed to load periods:', error)
      setPeriods([])
    } finally {
      setLoading(false)
    }
  }

  // Group periods by lottery type
  const premiumPeriods = periods.filter(p => isPremiumLottery(p.huayCode))
  const stockPeriods = periods.filter(p => p.huayCode.startsWith('SET'))
  const otherPeriods = periods.filter(p => !isPremiumLottery(p.huayCode) && !p.huayCode.startsWith('SET'))

  const tabs = [
    { key: 'list' as TabType, label: 'รายการหวย', icon: FiCalendar },
    { key: 'results' as TabType, label: 'ผลหวย', icon: FiTrendingUp },
    { key: 'history' as TabType, label: 'โพยหวย', icon: FiFileText },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* Magical background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating stars */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-2 drop-shadow-lg">
              ✨ ระบบหวยออนไลน์
            </h1>
            <p className="text-gray-400 text-sm">เลือกหวยที่ต้องการแทง พร้อมผลรางวัลทันที</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-yellow-400/90 to-orange-500/90 text-white shadow-lg shadow-yellow-500/30'
                      : 'bg-white/5 backdrop-blur-md text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <Icon className="text-base" />
                  {tab.label}
                </motion.button>
              )
            })}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-yellow-400/50 border-t-yellow-400"></div>
                    <p className="text-gray-400 mt-3 text-sm">กำลังโหลด...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Premium Lotteries Section */}
                    {premiumPeriods.length > 0 && (
                      <div>
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="flex items-center gap-2 mb-4"
                        >
                          <div className="flex items-center gap-1.5">
                            <FiStar className="text-yellow-400 text-lg" />
                            <h2 className="text-xl font-bold text-white">หวยรัฐบาล 3 อันดับหลัก</h2>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {premiumPeriods.map((period, index) => (
                            <PremiumLotteryCard key={period.id} period={period} index={index} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock Market Lotteries */}
                    {stockPeriods.length > 0 && (
                      <div>
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="flex items-center gap-2 mb-4"
                        >
                          <div className="flex items-center gap-1.5">
                            <FiTrendingUp className="text-blue-400 text-lg" />
                            <h2 className="text-xl font-bold text-white">หวยหุ้นไทย</h2>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          {stockPeriods.map((period, index) => (
                            <StandardLotteryCard key={period.id} period={period} index={index} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Other Lotteries */}
                    {otherPeriods.length > 0 && (
                      <div>
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="flex items-center gap-2 mb-4"
                        >
                          <div className="flex items-center gap-1.5">
                            <FiZap className="text-purple-400 text-lg" />
                            <h2 className="text-xl font-bold text-white">หวยอื่นๆ</h2>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {otherPeriods.map((period, index) => (
                            <StandardLotteryCard key={period.id} period={period} index={index} />
                          ))}
                        </div>
                      </div>
                    )}

                    {periods.length === 0 && !loading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
                      >
                        <FiCalendar className="text-5xl text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">ไม่มีงวดหวยที่เปิดรับแทง</p>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LotteryResults />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LotteryMyBets />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Premium Lottery Card (for 3 main lotteries)
const PremiumLotteryCard: React.FC<{ period: OpenPeriod; index: number }> = ({ period, index }) => {
  const [timeLeft, setTimeLeft] = useState('')
  const theme = getLotteryTheme(period.huayCode)
  const icon = getLotteryIcon(period.huayCode)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const closeTime = new Date(period.closeTime)
      const diff = closeTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('ปิดรับแล้ว')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [period])

  return (
    <Link to={`/member/lottery/bet/${period.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.03, y: -5 }}
        className={`relative bg-gradient-to-br ${theme.gradient} backdrop-blur-md rounded-2xl p-5 border ${theme.border} cursor-pointer ${theme.shadow} hover:shadow-xl ${theme.glow} transition-all duration-300 overflow-hidden group`}
      >
        {/* Magical shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Sparkle corner */}
        <div className="absolute top-2 right-2">
          <FiStar className="text-yellow-300/80 text-lg animate-pulse" />
        </div>

        {/* Icon & Name */}
        <div className="relative text-center mb-4">
          <div className="text-5xl mb-2">{icon}</div>
          <h3 className="text-2xl font-bold text-white drop-shadow-md">{period.huayName}</h3>
          <p className="text-white/70 text-xs mt-1">{period.periodName}</p>
        </div>

        {/* Countdown */}
        <div className="relative bg-black/20 backdrop-blur-sm rounded-xl p-3 mb-3 border border-white/10">
          <div className="flex items-center justify-center gap-1.5 text-yellow-300/90 mb-1">
            <FiClock className="text-sm animate-pulse" />
            <span className="text-xs font-medium">เหลือเวลา</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-mono font-bold text-white drop-shadow">{timeLeft}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="relative w-full py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            แทงเลย
            <FiChevronRight className="text-lg group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        </button>
      </motion.div>
    </Link>
  )
}

// Standard Lottery Card (for stock market and other lotteries)
const StandardLotteryCard: React.FC<{ period: OpenPeriod; index: number }> = ({ period, index }) => {
  const [timeLeft, setTimeLeft] = useState('')
  const theme = getLotteryTheme(period.huayCode)
  const icon = getLotteryIcon(period.huayCode)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const closeTime = new Date(period.closeTime)
      const diff = closeTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('ปิดรับแล้ว')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [period])

  return (
    <Link to={`/member/lottery/bet/${period.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.03, y: -3 }}
        className={`relative bg-gradient-to-br ${theme.gradient} backdrop-blur-md rounded-xl p-4 border ${theme.border} cursor-pointer ${theme.shadow} hover:shadow-lg ${theme.glow} transition-all duration-300 overflow-hidden group`}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Icon & Name */}
        <div className="relative flex items-center gap-2.5 mb-3">
          <div className="text-3xl">{icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate">{period.huayName}</h3>
            <p className="text-white/60 text-xs truncate">{period.periodName}</p>
          </div>
        </div>

        {/* Countdown */}
        <div className="relative bg-black/20 backdrop-blur-sm rounded-lg p-2.5 mb-3 border border-white/10">
          <div className="flex items-center justify-center gap-1.5">
            <FiClock className="text-yellow-300/90 text-sm" />
            <span className="text-base font-mono font-bold text-white">{timeLeft}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="relative w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md text-sm overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            แทงเลย
            <FiChevronRight className="text-base group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        </button>
      </motion.div>
    </Link>
  )
}

// Component: Lottery Results
const LotteryResults: React.FC = () => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 border border-white/10 text-center">
      <FiAward className="text-5xl text-yellow-400/80 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-white mb-2">ผลหวย</h2>
      <p className="text-gray-400 text-sm">กำลังพัฒนา...</p>
    </div>
  )
}

// Component: My Bets
const LotteryMyBets: React.FC = () => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 border border-white/10 text-center">
      <FiFileText className="text-5xl text-purple-400/80 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-white mb-2">โพยหวยของฉัน</h2>
      <p className="text-gray-400 text-sm">กำลังพัฒนา...</p>
    </div>
  )
}

export default MemberLottery
