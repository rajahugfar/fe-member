import { useState, useEffect } from 'react'
import { FiGift, FiPercent, FiDollarSign, FiTrendingUp, FiCheck, FiX, FiInfo } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface Promotion {
  id: string
  code: string
  name: string
  description: string
  type: string
  bonus_type: 'percentage' | 'fixed'
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

const PromotionClaim = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [calculatedBonus, setCalculatedBonus] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [requiredTurnover, setRequiredTurnover] = useState(0)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    fetchPromotions()
  }, [])

  useEffect(() => {
    if (selectedPromo && depositAmount) {
      calculateBonus()
    } else {
      setCalculatedBonus(0)
      setTotalAmount(0)
      setRequiredTurnover(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAmount, selectedPromo])

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/v1/public/promotions')
      const data = await response.json()
      
      if (data.success) {
        setPromotions(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching promotions:', error)
      toast.error('ไม่สามารถโหลดโปรโมชั่นได้')
    } finally {
      setLoading(false)
    }
  }

  const calculateBonus = () => {
    if (!selectedPromo) return

    const deposit = parseFloat(depositAmount) || 0
    
    // Check minimum deposit
    if (deposit < selectedPromo.min_deposit) {
      setCalculatedBonus(0)
      setTotalAmount(deposit)
      setRequiredTurnover(0)
      return
    }

    // Calculate bonus
    let bonus = 0
    if (selectedPromo.bonus_type === 'percentage') {
      bonus = (deposit * selectedPromo.bonus_value) / 100
    } else {
      bonus = selectedPromo.bonus_value
    }

    // Apply max bonus limit
    if (bonus > selectedPromo.max_bonus) {
      bonus = selectedPromo.max_bonus
    }

    const total = deposit + bonus
    const turnover = total * selectedPromo.turnover_requirement

    setCalculatedBonus(bonus)
    setTotalAmount(total)
    setRequiredTurnover(turnover)
  }

  const handleClaim = async () => {
    if (!selectedPromo) return

    const deposit = parseFloat(depositAmount) || 0
    
    if (deposit < selectedPromo.min_deposit) {
      toast.error(`ยอดฝากขั้นต่ำ ${selectedPromo.min_deposit} บาท`)
      return
    }

    setClaiming(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/v1/member/promotions/claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          promotion_id: parseInt(selectedPromo.id),
          deposit_amount: deposit
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('รับโปรโมชั่นสำเร็จ!')
        setSelectedPromo(null)
        setDepositAmount('')
        // Redirect to deposit page or show success message
      } else {
        toast.error(data.message || 'ไม่สามารถรับโปรโมชั่นได้')
      }
    } catch (error) {
      console.error('Error claiming promotion:', error)
      toast.error(t("common:messages.error"))
    } finally {
      setClaiming(false)
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
    <div className="min-h-screen bg-[#0f1419] p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FiGift className="text-yellow-500" />
            รับโปรโมชั่น
          </h1>
          <p className="text-gray-400">เลือกโปรโมชั่นและคำนวณโบนัสที่คุณจะได้รับ</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Promotions List */}
            <div className="lg:col-span-2 space-y-4">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  onClick={() => setSelectedPromo(promo)}
                  className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-102 border-2 ${
                    selectedPromo?.id === promo.id
                      ? 'border-yellow-500 shadow-lg shadow-yellow-500/50'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
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
                    <div className="md:w-2/3 p-5">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {promo.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {promo.description}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <FiPercent className="text-yellow-500" />
                          <span className="text-gray-400">โบนัส:</span>
                          <span className="font-bold text-yellow-500">
                            {promo.bonus_type === 'percentage'
                              ? `${promo.bonus_value}%`
                              : `${promo.bonus_value} บาท`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <FiDollarSign className="text-green-500" />
                          <span className="text-gray-400">รับสูงสุด:</span>
                          <span className="font-semibold text-white">
                            {promo.max_bonus.toLocaleString()} บาท
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">ฝากขั้นต่ำ:</span>
                          <span className="text-white">
                            {promo.min_deposit.toLocaleString()} บาท
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <FiTrendingUp className="text-blue-500" />
                          <span className="text-gray-400">เทิร์นโอเวอร์:</span>
                          <span className="text-white">
                            {promo.turnover_requirement}x
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculator Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 sticky top-4">
                {selectedPromo ? (
                  <>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <FiGift className="text-yellow-500" />
                      คำนวณโบนัส
                    </h3>

                    {/* Selected Promotion */}
                    <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">โปรโมชั่นที่เลือก:</p>
                      <p className="font-semibold text-white">{selectedPromo.name}</p>
                    </div>

                    {/* Deposit Amount Input */}
                    <div className="mb-4">
                      <label className="block text-sm text-gray-400 mb-2">
                        ยอดฝาก (บาท)
                      </label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder={`ขั้นต่ำ ${selectedPromo.min_deposit} บาท`}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    {/* Calculation Results */}
                    {depositAmount && parseFloat(depositAmount) >= selectedPromo.min_deposit && (
                      <div className="space-y-3 mb-6">
                        {/* Bonus */}
                        <div className="flex items-center justify-between p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                          <span className="text-green-400">โบนัสที่ได้รับ:</span>
                          <span className="font-bold text-green-400 text-lg">
                            ฿{calculatedBonus.toLocaleString()}
                          </span>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                          <span className="text-purple-400">ยอดรวมที่ได้:</span>
                          <span className="font-bold text-purple-400 text-lg">
                            ฿{totalAmount.toLocaleString()}
                          </span>
                        </div>

                        {/* Required Turnover */}
                        <div className="flex items-center justify-between p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                          <span className="text-blue-400">เทิร์นที่ต้องทำ:</span>
                          <span className="font-bold text-blue-400 text-lg">
                            ฿{requiredTurnover.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Warning */}
                    {depositAmount && parseFloat(depositAmount) < selectedPromo.min_deposit && (
                      <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-2">
                        <FiInfo className="text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-400">
                          ยอดฝากขั้นต่ำ {selectedPromo.min_deposit} บาท
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={handleClaim}
                        disabled={
                          claiming ||
                          !depositAmount ||
                          parseFloat(depositAmount) < selectedPromo.min_deposit
                        }
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {claiming ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>กำลังรับโปรโมชั่น...</span>
                          </>
                        ) : (
                          <>
                            <FiCheck />
                            <span>รับโปรโมชั่นนี้</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPromo(null)
                          setDepositAmount('')
                        }}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FiX />
                        <span>{t("common:buttons.cancel")}</span>
                      </button>
                    </div>

                    {/* Terms */}
                    {selectedPromo.terms_and_conditions && (
                      <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">เงื่อนไข:</p>
                        <p className="text-xs text-gray-300 whitespace-pre-line">
                          {selectedPromo.terms_and_conditions}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FiGift className="mx-auto text-6xl text-gray-600 mb-4" />
                    <p className="text-gray-400">เลือกโปรโมชั่นที่ต้องการ</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PromotionClaim
