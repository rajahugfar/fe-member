import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiGift, FiPercent, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

interface Promotion {
  id: string
  code: string
  name: string
  description: string
  type: string
  bonus_type: string
  bonus_value: number
  max_bonus: number
  min_deposit: number
  turnover_requirement: number
  max_withdraw: number
  image_url: string
  status: string
  is_active: boolean
  terms_and_conditions: string
}

const PromotionsPage = () => {
  const { t } = useTranslation()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null)

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/public/promotions')
      const data = await response.json()
      
      if (data.success) {
        setPromotions(data.data || [])
      } else {
        toast.error('ไม่สามารถโหลดโปรโมชั่นได้')
      }
    } catch (error) {
      console.error('Failed to load promotions:', error)
      toast.error('เกิดข้อผิดพลาดในการโหลดโปรโมชั่น')
    } finally {
      setLoading(false)
    }
  }

  const handleClaimPromotion = async (promoId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('กรุณาเข้าสู่ระบบก่อนรับโปรโมชั่น')
      return
    }

    try {
      const response = await fetch('/api/v1/member/promotions/claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          promotion_id: promoId,
          deposit_amount: 0 // จะต้องใส่ยอดฝากจริงตอนรับโปร
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('รับโปรโมชั่นสำเร็จ!')
        setSelectedPromo(null)
      } else {
        toast.error(data.message || 'ไม่สามารถรับโปรโมชั่นได้')
      }
    } catch (error) {
      toast.error(t("common:messages.error"))
    }
  }

  const getPromotionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'new_member': 'สมาชิกใหม่',
      'daily_first': 'ครั้งแรกของวัน',
      'normal': 'รับได้ตลอด',
      'cashback': 'คืนยอดเสีย',
      'deposit': 'โบนัสฝาก',
      'freespin': 'ฟรีสปิน'
    }
    return types[type] || type
  }

  const getPromotionTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      'new_member': 'bg-gradient-to-r from-yellow-500 to-orange-500',
      'daily_first': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'normal': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'cashback': 'bg-gradient-to-r from-purple-500 to-pink-500',
      'deposit': 'bg-gradient-to-r from-red-500 to-rose-500',
      'freespin': 'bg-gradient-to-r from-indigo-500 to-violet-500'
    }
    return badges[type] || 'bg-gray-500'
  }

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
              <Link to="/invitation" className="flex flex-col items-center text-gray-400 hover:text-white transition">
                <img src="/images/sacasino/icons/ic-menu-invitation.png" alt="ชวนเพื่อน" className="w-8 h-8" />
                <span className="text-xs mt-1">ชวนเพื่อน</span>
              </Link>
              <Link to="/promotions" className="flex flex-col items-center text-yellow-400">
                <img src="/images/sacasino/icons/ic-menu-promotion.png" alt={t("navigation:menu.promotions")} className="w-8 h-8" />
                <span className="text-xs mt-1">{t("navigation:menu.promotions")}</span>
              </Link>
              <Link to="/" className="flex flex-col items-center text-gray-400 hover:text-white transition">
                <img src="/images/sacasino/icons/ic-menu-home.png" alt="หน้าหลัก" className="w-8 h-8" />
                <span className="text-xs mt-1">หน้าหลัก</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FiGift className="text-yellow-500" />
            โปรโมชั่น
          </h1>
          <p className="text-gray-400">รับโบนัสและข้อเสนอพิเศษมากมาย</p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-20">
            <FiGift className="mx-auto text-6xl text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">ไม่มีโปรโมชั่นในขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div 
                key={promo.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-700"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={promo.image_url || '/images/promotions/default.jpg'} 
                    alt={promo.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/sacasino/banners/fad31dcc94be4093b4d36e7786893ca6.jpg'
                    }}
                  />
                  {/* Badge */}
                  <div className={`absolute top-3 right-3 ${getPromotionTypeBadge(promo.type)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                    {getPromotionTypeLabel(promo.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {promo.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {promo.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <FiPercent className="text-yellow-500" />
                        โบนัส:
                      </span>
                      <span className="font-bold text-yellow-500">
                        {promo.bonus_type === 'percentage' 
                          ? `${promo.bonus_value}%` 
                          : `${promo.bonus_value} บาท`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <FiDollarSign className="text-green-500" />
                        รับสูงสุด:
                      </span>
                      <span className="font-semibold text-white">
                        {promo.max_bonus.toLocaleString()} บาท
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">ฝากขั้นต่ำ:</span>
                      <span className="text-white">
                        {promo.min_deposit.toLocaleString()} บาท
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <FiTrendingUp className="text-blue-500" />
                        เทิร์นโอเวอร์:
                      </span>
                      <span className="text-white">
                        {promo.turnover_requirement}x
                      </span>
                    </div>

                    {promo.max_withdraw > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">ถอนสูงสุด:</span>
                        <span className="text-white">
                          {promo.max_withdraw.toLocaleString()} บาท
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => setSelectedPromo(promo)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FiGift />
                    รับโปรโมชั่น
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Modal - Promotion Details */}
      {selectedPromo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedPromo.name}
                </h2>
                <span className={`${getPromotionTypeBadge(selectedPromo.type)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                  {getPromotionTypeLabel(selectedPromo.type)}
                </span>
              </div>
              <button
                onClick={() => setSelectedPromo(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Image */}
            <div className="p-6">
              <img 
                src={selectedPromo.image_url || '/images/promotions/default.jpg'}
                alt={selectedPromo.name}
                className="w-full rounded-lg mb-6"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/sacasino/banners/fad31dcc94be4093b4d36e7786893ca6.jpg'
                }}
              />

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">รายละเอียด</h3>
                <p className="text-gray-300">{selectedPromo.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">โบนัส</p>
                  <p className="text-yellow-500 font-bold text-xl">
                    {selectedPromo.bonus_type === 'percentage' 
                      ? `${selectedPromo.bonus_value}%` 
                      : `${selectedPromo.bonus_value} บาท`}
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">รับสูงสุด</p>
                  <p className="text-white font-bold text-xl">
                    {selectedPromo.max_bonus.toLocaleString()} บาท
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">ฝากขั้นต่ำ</p>
                  <p className="text-white font-bold text-xl">
                    {selectedPromo.min_deposit.toLocaleString()} บาท
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">เทิร์นโอเวอร์</p>
                  <p className="text-blue-500 font-bold text-xl">
                    {selectedPromo.turnover_requirement}x
                  </p>
                </div>
              </div>

              {/* Terms */}
              {selectedPromo.terms_and_conditions && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">เงื่อนไข</h3>
                  <div className="bg-gray-800 p-4 rounded-lg text-gray-300 text-sm">
                    {selectedPromo.terms_and_conditions}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleClaimPromotion(selectedPromo.id)}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  รับโปรโมชั่นนี้
                </button>
                <button
                  onClick={() => setSelectedPromo(null)}
                  className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all duration-300"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default PromotionsPage
