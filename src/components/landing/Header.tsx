import { Link } from 'react-router-dom'
import { FaUser, FaUserPlus, FaLine, FaCoins } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

interface HeaderProps {
  siteName?: string
  contactLine?: string
}

const Header = ({ siteName = 'SACASINO', contactLine }: HeaderProps) => {
  return (
    <header className="relative">
      {/* Top decoration bar - gold gradient */}
      <div className="h-2 bg-gradient-to-r from-[#d4af37] via-[#f5d042] to-[#d4af37]" />

      {/* Main header - dark gold/brown gradient */}
      <div
        className="relative shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #8B6914 0%, #6B5011 100%)',
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                
                {/* Logo image */}
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

              {/* Site name */}
              <div>
                <h1 className="text-4xl font-black text-white drop-shadow-2xl tracking-wide text-glow">
                  {siteName}
                </h1>
                <p className="text-yellow-200 text-sm font-semibold drop-shadow-lg">
                  คาสิโนออนไลน์ อันดับ 1
                </p>
              </div>
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/member/login"
                className="relative px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all flex items-center gap-2 text-sm"
                style={{
                  background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
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
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.5)',
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
            href={contactLine || '#'}
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
  )
}

export default Header
