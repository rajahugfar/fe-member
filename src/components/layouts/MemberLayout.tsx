import React, { useState, useEffect, useRef } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  FaUser,
  FaLine,
  FaSignOutAlt,
  FaTrophy,
  FaComments,
  FaHome,
  FaGamepad,
  FaMoneyBillWave,
  FaGift,
  FaHistory,
  FaBars,
  FaTimes,
  FaWallet,
  FaChartLine,
  FaCoins,
  FaChevronDown,
  FaGlobe
} from 'react-icons/fa'
import { MdHistory } from 'react-icons/md'
import { profileAPI } from '@api/memberAPI'
import { useMemberStore } from '@store/memberStore'
import { toast } from 'react-hot-toast'
import MemberChat from '@/components/chat/MemberChat'
import { siteContentAPI } from '@api/siteContentAPI'

const MemberLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, member, loadProfile } = useMemberStore()
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lineUrl, setLineUrl] = useState('https://line.me/ti/p/@permchok')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [language, setLanguage] = useState<'th' | 'en'>('th')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load profile only if not already in store
    if (!member) {
      setLoading(true)
      loadProfile()
        .catch((error) => {
          console.error('Failed to load profile:', error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [])

  // Load site settings (LINE URL)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await siteContentAPI.getSiteSettings()
        const settings = response.data.data
        if (settings.site_line) {
          setLineUrl(settings.site_line)
        }
      } catch (error) {
        console.error('Failed to load site settings:', error)
      }
    }
    loadSettings()
  }, [])

  // Auto-refresh credit every 1 minute
  useEffect(() => {
    console.log('[MemberLayout] Setting up credit refresh interval')

    // Refresh immediately
    loadProfile().catch(err => console.error('[MemberLayout] Initial refresh failed:', err))

    // Set up interval
    const interval = setInterval(() => {
      console.log('[MemberLayout] Refreshing credit...')
      loadProfile().catch(err => console.error('[MemberLayout] Refresh failed:', err))
    }, 60000) // 60 seconds

    return () => {
      console.log('[MemberLayout] Cleaning up credit refresh interval')
      clearInterval(interval)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

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

  const menuItems = [
    { path: '/member', label: 'เกมส์', icon: FaGamepad },
    { path: '/member/dashboard', label: 'แดชบอร์ด', icon: FaHome },
    { path: '/member/deposit', label: 'ฝากเงิน', icon: FaMoneyBillWave },
    { path: '/member/withdrawal', label: 'ถอนเงิน', icon: FaWallet },
    { path: '/member/promotions', label: 'โปรโมชั่น', icon: FaGift },
    { path: '/member/transactions', label: 'ประวัติ', icon: FaHistory },
    { path: '/member/profile', label: 'โปรไฟล์', icon: FaUser },
  ]

  const isActivePath = (path: string) => {
    if (path === '/member') {
      return location.pathname === '/member'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[#0a1520] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      {/* Header */}
      <header className="relative z-20 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-2xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/member" className="flex items-center">
              <img 
                src="/images/bicycle678-logo.svg" 
                alt="Bicycle678" 
                className="h-12 w-auto" 
              />
            </Link>

            {/* User Info & Actions */}
            {member && (
              <div className="flex items-center space-x-2">
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 md:px-4 py-2 border border-white/10 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-white font-bold text-sm">{member.phone}</div>
                      <div className="text-yellow-400 text-xs font-semibold flex items-center">
                        <FaCoins className="mr-1" />
                        {formatCurrency(member.credit || 0)}
                      </div>
                    </div>
                    <FaChevronDown className={`text-white text-xs transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                      <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-gray-700">
                        <p className="text-white font-bold text-sm">{member.phone}</p>
                        <p className="text-yellow-400 text-xs flex items-center mt-1">
                          <FaCoins className="mr-1" />
                          ฿{formatCurrency(member.credit || 0)}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/member/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-white hover:bg-white/10 transition-colors duration-200"
                        >
                          <FaUser className="mr-3 text-yellow-500" />
                          <span className="text-sm">{language === 'th' ? 'โปรไฟล์' : 'Profile'}</span>
                        </Link>

                        <Link
                          to="/member/deposit/history"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-white hover:bg-white/10 transition-colors duration-200"
                        >
                          <FaMoneyBillWave className="mr-3 text-green-500" />
                          <span className="text-sm">{language === 'th' ? 'ประวัติการฝาก' : 'Deposit History'}</span>
                        </Link>

                        <Link
                          to="/member/withdrawal/history"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-white hover:bg-white/10 transition-colors duration-200"
                        >
                          <MdHistory className="mr-3 text-blue-500 text-lg" />
                          <span className="text-sm">{language === 'th' ? 'ประวัติการถอน' : 'Withdrawal History'}</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-700 py-1">
                        <div className="px-4 py-2">
                          <p className="text-white/60 text-xs mb-2">{language === 'th' ? 'ภาษา' : 'Language'}</p>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setLanguage('th')}
                              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                language === 'th'
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                  : 'bg-gray-700 text-white/60 hover:bg-gray-600'
                              }`}
                            >
                              TH
                            </button>
                            <button
                              onClick={() => setLanguage('en')}
                              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                language === 'en'
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                  : 'bg-gray-700 text-white/60 hover:bg-gray-600'
                              }`}
                            >
                              EN
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-700">
                        <button
                          onClick={() => {
                            setDropdownOpen(false)
                            handleLogout()
                          }}
                          className="w-full flex items-center px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                        >
                          <FaSignOutAlt className="mr-3" />
                          <span className="text-sm">{language === 'th' ? 'ออกจากระบบ' : 'Logout'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Deposit Button */}
                <Link
                  to="/member/deposit"
                  className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-3 md:px-4 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  <FaMoneyBillWave />
                  <span className="hidden md:inline">{language === 'th' ? 'ฝากเงิน' : 'Deposit'}</span>
                </Link>

                {/* Withdraw Button */}
                <Link
                  to="/member/withdrawal"
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 md:px-4 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  <FaWallet />
                  <span className="hidden md:inline">{language === 'th' ? 'ถอนเงิน' : 'Withdraw'}</span>
                </Link>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  <FaSignOutAlt />
                  <span className="hidden md:inline">{language === 'th' ? 'ออกจากระบบ' : 'Logout'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-20 flex flex-col gap-3 z-40">
        <Link
          to="/member/promotions"
          className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform duration-300"
          title="โปรโมชั่น"
        >
          <FaTrophy className="text-2xl" />
        </Link>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform duration-300"
          title="ติดต่อผ่าน LINE"
        >
          <FaLine className="text-2xl" />
        </a>
      </div>

      {/* Chat Component */}
      <MemberChat />

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

export default MemberLayout
