import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { FaHome, FaGamepad, FaDice, FaGift, FaUser, FaWallet, FaSignOutAlt, FaHistory } from 'react-icons/fa'
import { useMemberStore } from '@store/memberStore'
import { formatCurrency } from '@utils/format'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@components/LanguageSwitcher'

const Navbar = () => {
  const { t } = useTranslation(['navigation', 'auth', 'member'])
  const navigate = useNavigate()
  const { member, isAuthenticated, logout, loadProfile } = useMemberStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Auto-refresh credit every 1 minute
  useEffect(() => {
    if (!isAuthenticated) return

    // Refresh immediately on mount
    loadProfile().catch(console.error)

    // Set up interval to refresh every 60 seconds
    const interval = setInterval(() => {
      loadProfile().catch(console.error)
    }, 60000) // 60000ms = 1 minute

    // Cleanup interval on unmount
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]) // Only depend on isAuthenticated, not loadProfile

  return (
    <nav className="bg-dark-800/95 backdrop-blur-md border-b border-dark-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold gradient-text">Permchok</div>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors"
            >
              <FaHome />
              <span>{t("navigation:menu.home")}</span>
            </Link>
            <Link
              to="/lottery"
              className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors"
            >
              <FaDice />
              <span>{t("navigation:menu.lottery")}</span>
            </Link>
            <Link
              to="/games"
              className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors"
            >
              <FaGamepad />
              <span>{t("navigation:menu.games")}</span>
            </Link>
            <Link
              to="/promotions"
              className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors"
            >
              <FaGift />
              <span>{t("navigation:menu.promotions")}</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher variant="compact" />

            {isAuthenticated && member ? (
              <>
                {/* Balance Display */}
                <div className="glass px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FaWallet className="text-primary-500" />
                    <span className="font-semibold text-primary-500">
                      {formatCurrency(member.credit)}
                    </span>
                  </div>
                </div>

                {/* Deposit Button */}
                <Link
                  to="/deposit"
                  className="btn btn-primary text-sm"
                >
                  {t("navigation:menu.deposit")}
                </Link>

                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 glass px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                    <FaUser />
                    <span>{member.fullname || member.phone}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 glass rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-white/10 transition-colors"
                    >
                      <FaUser className="inline mr-2" />
                      {t('navigation:menu.profile')}
                    </Link>
                    <Link
                      to="/transactions"
                      className="block px-4 py-3 hover:bg-white/10 transition-colors"
                    >
                      <FaWallet className="inline mr-2" />
                      {t('navigation:menu.transactions')}
                    </Link>
                    <Link
                      to="/lottery/history"
                      className="block px-4 py-3 hover:bg-white/10 transition-colors"
                    >
                      <FaHistory className="inline mr-2" />
                      {t('navigation:menu.lotteryHistory')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-red-400"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      {t('auth:logout.title')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary text-sm">
                  {t('auth:login.title')}
                </Link>
                <Link to="/register" className="btn btn-primary text-sm">
                  {t('auth:register.title')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
