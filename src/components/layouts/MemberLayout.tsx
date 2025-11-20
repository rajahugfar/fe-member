import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import {
  FaLine,
  FaTrophy,
} from 'react-icons/fa'
import { useMemberStore } from '@store/memberStore'
import { toast } from 'react-hot-toast'
import MemberChat from '@/components/chat/MemberChat'
import { siteContentAPI } from '@api/siteContentAPI'
import MemberNavbar from '@/components/MemberNavbar'

const MemberLayout: React.FC = () => {
  const navigate = useNavigate()
  const { logout, member, loadProfile } = useMemberStore()
  const [lineUrl, setLineUrl] = useState('https://line.me/ti/p/@permchok')

  useEffect(() => {
    // Load profile only if not already in store
    if (!member) {
      loadProfile()
        .catch((error) => {
          console.error('Failed to load profile:', error)
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
    // Refresh immediately
    loadProfile().catch(err => console.error('[MemberLayout] Initial refresh failed:', err))

    // Set up interval
    const interval = setInterval(() => {
      loadProfile().catch(err => console.error('[MemberLayout] Refresh failed:', err))
    }, 60000) // 60 seconds

    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/member/login')
    toast.success('ออกจากระบบสำเร็จ')
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
      <MemberNavbar
        profile={member}
        settings={{ site_logo: '/images/bicycle678-logo.svg', site_name: 'Bicycle678' }}
        onLogout={handleLogout}
      />
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
