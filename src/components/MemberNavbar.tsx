import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaUser,
  FaSignOutAlt,
  FaMoneyBillWave,
  FaCoins,
  FaChevronDown,
  FaWallet,
  FaHistory,
  FaUserFriends
} from 'react-icons/fa'
import { MdHistory } from 'react-icons/md'

interface MemberNavbarProps {
  profile: any
  settings: any
  onLogout: () => void
}

const MemberNavbar = ({ profile, settings, onLogout }: MemberNavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [language, setLanguage] = useState<'th' | 'en'>('th')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

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

  return (
    <header className="relative z-20 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-2xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/member" className="flex items-center">
            <img
              src={settings.site_logo || '/images/bicycle678-logo.svg'}
              alt={settings.site_name || 'Bicycle678'}
              className="h-12 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/bicycle678-logo.svg';
              }}
            />
          </Link>

          {/* User Info & Actions */}
          {profile && (
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
                    <div className="text-white font-bold text-sm">{profile.username || profile.phone}</div>
                    <div className="text-yellow-400 text-xs font-semibold flex items-center">
                      <FaCoins className="mr-1" />
                      {formatCurrency(profile.credit || 0)}
                    </div>
                  </div>
                  <FaChevronDown className={`text-white text-xs transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                    <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-gray-700">
                      <p className="text-white font-bold text-sm">{profile.username || profile.phone}</p>
                      <p className="text-yellow-400 text-xs flex items-center mt-1">
                        <FaCoins className="mr-1" />
                        ฿{formatCurrency(profile.credit || 0)}
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
                      to="/member/lottery/history"
                      className="block px-4 py-3 hover:bg-white/10 transition-colors"
                    >
                      <FaHistory className="inline mr-2" />
                      ประวัติโพย
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

                      <Link
                        to="/member/affiliate"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        <FaUserFriends className="mr-3 text-purple-500" />
                        <span className="text-sm">{language === 'th' ? 'แนะนำเพื่อน' : 'Invite Friends'}</span>
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
                          onLogout()
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
                to="/member/withdraw"
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 md:px-4 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
              >
                <FaWallet />
                <span className="hidden md:inline">{language === 'th' ? 'ถอนเงิน' : 'Withdraw'}</span>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
              >
                <FaSignOutAlt />
                <span className="hidden md:inline">{language === 'th' ? 'ออกจากระบบ' : 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
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
    </header>
  )
}

export default MemberNavbar
