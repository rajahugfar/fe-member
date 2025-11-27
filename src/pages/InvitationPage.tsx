import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMemberStore } from '@/store/memberStore'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const InvitationPage = () => {
  const { t } = useTranslation()
  const { member } = useMemberStore()
  const [referralCode, setReferralCode] = useState('')
  const [referralLink, setReferralLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalCommission: 0,
    pendingCommission: 0
  })

  useEffect(() => {
    // Get referral code from member or generate default
    if (member) {
      // Use member phone or generate code
      const code = `REF${member.id || Math.floor(Math.random() * 100000)}`
      setReferralCode(code)
    } else {
      // Default for non-logged in users
      setReferralCode('DEMO123')
    }
  }, [member])

  useEffect(() => {
    if (referralCode) {
      const baseUrl = window.location.origin
      setReferralLink(`${baseUrl}/register?ref=${referralCode}`)
      
      // Fetch referral stats if logged in
      if (member) {
        fetchStats()
      }
    }
  }, [referralCode, member])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/v1/member/referral/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('memberToken')}`
        },
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.data) {
          setStats(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch referral stats:', error)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('คัดลอกลิงก์เรียบร้อย!')
    setTimeout(() => setCopied(false), 2000)
  }

  const commissionRates = [
    { type: t("game:categories.casino"), rate: '0.3%', max: '5000 /วัน' },
    { type: t("game:categories.slot"), rate: '0.5%', max: '5000 /วัน' },
    { type: t("navigation:menu.lottery"), rate: '3%', max: '5000 /วัน' },
    { type: '1234 คริปโต', rate: '0.3%', max: '5000 /วัน' },
    { type: 'กีฬา', rate: '1%', max: '2000 /วัน' }
  ]

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <nav className="relative z-20 bg-[#1a1f2e] border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/images/bicycle678-logo.svg" 
                alt="Bicycle678" 
                className="h-12 w-auto"
              />
            </Link>

            {/* Menu */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher variant="compact" />
              <Link to="/invitation" className="flex flex-col items-center text-yellow-400">
                <img src="/images/sacasino/icons/ic-menu-invitation.png" alt="ชวนเพื่อน" className="w-8 h-8" />
                <span className="text-xs mt-1">ชวนเพื่อน</span>
              </Link>
              <Link to="/promotions" className="flex flex-col items-center text-gray-400 hover:text-white transition">
                <img src="/images/sacasino/icons/ic-menu-promotion.png" alt={t("navigation:menu.promotions")} className="w-8 h-8" />
                <span className="text-xs mt-1">{t("navigation:menu.promotions")}</span>
              </Link>
            </div>

            {/* Support & Auth */}
            <div className="flex items-center gap-2">
              <a href="https://t.me/support" target="_blank" rel="noopener noreferrer">
                <img src="/images/sacasino/icons/ic-telegram-support.png" alt="Telegram" className="h-10" />
              </a>
              <a href="https://line.me/support" target="_blank" rel="noopener noreferrer">
                <img src="/images/sacasino/icons/ic-line-support.png" alt="LINE" className="h-10" />
              </a>
              
              <Link 
                to="/register"
                className="px-6 py-2 rounded-lg text-sm font-bold text-white transition hover:scale-105"
                style={{ background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)' }}
              >
                สมัครสมาชิก
              </Link>
              <Link 
                to="/login"
                className="px-6 py-2 rounded-lg text-sm font-bold text-white transition hover:scale-105"
                style={{ background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)' }}
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Cover Section */}
      <div 
        className="relative bg-cover bg-center py-20"
        style={{ backgroundImage: 'url(/build/web/ezl-sa-casino/img/invitation-cover-bg-dark.jpg)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">ลิงก์รับทรัพย์</h1>
          <p className="text-2xl text-white">
            รับคอมมิชชั่นสูงถึง <span className="text-yellow-400 font-bold">3%</span>
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Stats Section (if logged in) */}
        {member && (
          <div className="bg-[#1a1f26] rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">สถิติของคุณ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm">ผู้แนะนำทั้งหมด</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.totalReferrals}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">ใช้งานอยู่</p>
                <p className="text-2xl font-bold text-green-400">{stats.activeReferrals}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">คอมมิชชั่นทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-400">฿{stats.totalCommission.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">รอรับ</p>
                <p className="text-2xl font-bold text-orange-400">฿{stats.pendingCommission.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">รับเงินได้ทุกวัน</h2>
          <h3 className="text-4xl font-bold text-yellow-400">Passive Income ที่แท้จริง</h3>
        </div>

        {/* Image 1 */}
        <div className="mb-12">
          <img 
            src="/build/web/ezl-sa-casino/img/invitation-content-section-1-dark.jpg"
            alt="เริ่มต้นง่ายๆ ได้ทุกการเล่น"
            className="w-full rounded-lg"
          />
        </div>

        {/* Title 2 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">ทำมาแล้ว!</h2>
          <h3 className="text-2xl font-bold text-white">แค่เพื่อนเล่น เราก็รับทรัพย์</h3>
          <h3 className="text-2xl font-bold text-yellow-400">รายได้ 6 หลัก <span className="underline">ง่ายๆ ทุกเดือน</span></h3>
        </div>

        {/* Image 2 */}
        <div className="mb-12">
          <img 
            src="/build/web/ezl-sa-casino/img/invitation-content-section-2-dark.jpg"
            alt="รายได้ 6 หลัก"
            className="w-full rounded-lg"
          />
        </div>

        {/* How it works */}
        <div className="bg-[#1a1f26] rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-6">แนะนำเพื่อนกับเราดียังไง</h2>
          
          <h3 className="text-xl font-bold text-yellow-400 mb-4">
            ง่ายกว่าที่คุณคิด เพียงคัดลอกลิงก์ของคุณ ส่งให้เพื่อน ยิ่งชวน ยิ่งได้ มีรายได้ทุกวัน
          </h3>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            ส่วนแบ่งจากการแนะนำ สามารถนำไปเดิมพันต่อ หรือ ถอนได้เลย ไม่มีเทิร์นโอเวอร์ ไม่จำกัดยอด 
            สร้างรายได้กับเราได้ทันที ชวนเลย เพื่อนสายบาคาร่า เพื่อนสายสล็อต เพื่อนสายกีฬา เพื่อนสายยิงปลา 
            เพื่อนสายหวย ไม่ว่าสายไหนก็ชวนเพื่อนได้ไม่จำกัด รับส่วนแบ่งค่าคอมมิชชั่นแบบเน้นๆ จ่ายกันแบบรายวัน 
            อัพเดทยอดของเพื่อนคุณแบบเรียลไทม์ แค่เพื่อนเล่น คุณก็มีรายได้ไม่จำกัด
          </p>

          {/* Referral Link Box */}
          <div className="bg-[#0f1419] rounded-lg p-6 mb-6">
            <h4 className="text-white font-bold mb-3">ลิงก์แนะนำเพื่อนของคุณ</h4>
            <div className="flex gap-2">
              <input 
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700"
              />
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 bg-gradient-to-b from-yellow-400 to-yellow-600 text-white font-bold rounded-lg hover:opacity-90 transition"
              >
                {copied ? 'คัดลอกแล้ว!' : t("common:buttons.copy")}
              </button>
            </div>
          </div>
        </div>

        {/* Commission Rates */}
        <div className="bg-[#1a1f26] rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">เงื่อนไขและเปอร์เซ็นต์</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {commissionRates.map((item, index) => (
              <div key={index} className="bg-[#0f1419] rounded-lg p-4 text-center">
                <h3 className="text-white font-bold mb-2">{item.type}</h3>
                <p className="text-3xl font-bold text-yellow-400 mb-1">{item.rate}</p>
                <span className="text-gray-400 text-sm">{item.max}</span>
              </div>
            ))}
          </div>

          <div className="text-gray-300 space-y-4">
            <p className="text-sm">
              *เปอร์เซนต์คิดจาก <strong>"Turnover"</strong> ของสมาชิกคุณ{' '}
              <span className="text-red-400 underline">ยกเว้นประเภทกีฬา</span> จะคิดจาก <strong>"ยอดได้"</strong>
            </p>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">ตัวอย่างการได้ค่าแนะนำแนะนำเพื่อนเล่นหวย</h3>
              <p className="text-gray-300">
                สมาชิกของคุณ 1 คน เดิมพันหวย 1,000 เครดิต คุณจะได้รับรายได้ 30 เครดิต<br />
                สมาชิกของคุณ 10 คน เดิมพันหวย 1,000 เครดิต คุณจะได้รับรายได้ 300 เครดิต<br />
                สมาชิกของคุณ 100 คน เดิมพันหวย 1,000 เครดิต คุณจะได้รับรายได้ 3,000 เครดิต
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">แนะนำเพื่อนเล่นคาสิโน</h3>
              <p className="text-gray-300">
                สมาชิกของคุณ 1 คน เดิมพันคาสิโน 1,000 เครดิต คุณจะได้รับรายได้ 3 เครดิต<br />
                สมาชิกของคุณ 10 คน เดิมพันคาสิโน 1,000 เครดิต คุณจะได้รับรายได้ 30 เครดิต<br />
                สมาชิกของคุณ 100 คน เดิมพันคาสิโน 1,000 เครดิต คุณจะได้รับรายได้ 300 เครดิต
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">แนะนำเพื่อนเล่นกีฬา</h3>
              <p className="text-gray-300">
                สมาชิกของคุณ 1 คน มียอดได้จากกีฬา 1,000 เครดิต คุณจะได้รับรายได้ 10 เครดิต<br />
                สมาชิกของคุณ 10 คน มียอดได้จากกีฬา 1,000 เครดิต คุณจะได้รับรายได้ 100 เครดิต<br />
                สมาชิกของคุณ 100 คน มียอดได้จากกีฬา 1,000 เครดิต คุณจะได้รับรายได้ 1,000 เครดิต
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">เงื่อนไขการถอนเครดิตแนะนำเพื่อน</h3>
              <p className="text-gray-300">
                ต้องมีรายการฝากเงิน 1 ครั้งขึ้นไป ภายในเดือนที่แจ้งถอนเครดิตแนะนำเพื่อน
              </p>
            </div>

            <p className="text-sm italic text-gray-400">
              ** หากพบว่ามีการทุจริตในการปั้มค่าคอมมิชชั่น เดิมพันผิดปกติ และ ล่าโปรโมชั่น มีมากกว่า 1 ยูส 
              หรืออื่นๆ ที่เข้าข่ายการฉ้อโกงทางบริษัทจะทำการระงับการจ่ายค่าคอมโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvitationPage
