import React, { useState, useEffect } from 'react'
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
  FaCoins
} from 'react-icons/fa'
import { profileAPI } from '@api/memberAPI'
import { useMemberStore } from '@store/memberStore'
import { toast } from 'react-hot-toast'
import MemberChat from '@/components/chat/MemberChat'

const MemberLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, member, loadProfile } = useMemberStore()
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
                <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-sm">{member.phone}</div>
                    <div className="text-yellow-400 text-xs font-semibold flex items-center">
                      <FaCoins className="mr-1" />
                      {formatCurrency(member.credit || 0)}
                    </div>
                  </div>
                </div>
                
                {/* Deposit Button */}
                <Link
                  to="/member/deposit"
                  className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  <FaMoneyBillWave />
                  <span className="hidden md:inline">ฝากเงิน</span>
                </Link>
                
                {/* Withdraw Button */}
                <Link
                  to="/member/withdraw"
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  <FaCoins />
                  <span className="hidden md:inline">ถอนเงิน</span>
                </Link>
                
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
          href="https://line.me/ti/p/@permchok"
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
      `}</style>
    </div>
  )
}

export default MemberLayout
