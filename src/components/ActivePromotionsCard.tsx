import { useState, useEffect } from 'react'
import { FiGift, FiTrendingUp, FiCheckCircle, FiClock, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

interface ActivePromotion {
  id: number
  promotion_id: number
  promotion_name: string
  promotion_type: string
  deposit_amount: number
  bonus_amount: number
  required_turnover: number
  current_turnover: number
  turnover_percentage: number
  status: string
  claimed_at: string
}

const ActivePromotionsCard = () => {
  const { t } = useTranslation()
  const [promotions, setPromotions] = useState<ActivePromotion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPromo, setSelectedPromo] = useState<ActivePromotion | null>(null)
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    fetchActivePromotions()
  }, [])

  const fetchActivePromotions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/v1/member/promotions/active', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setPromotions(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching promotions:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelPromotion = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกโปรโมชั่นนี้?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/v1/member/promotions/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'ยกเลิกโดยสมาชิก' })
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('ยกเลิกโปรโมชั่นเรียบร้อยแล้ว')
        fetchActivePromotions()
      } else {
        toast.error(data.message || {t("common:messages.error"))
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการยกเลิกโปรโมชั่น')
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (promotions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiGift className="text-purple-600" />
          โปรโมชั่นที่กำลังใช้งาน
        </h3>
        <div className="text-center py-8 text-gray-500">
          <FiGift className="mx-auto text-4xl mb-2 opacity-50" />
          <p>ยังไม่มีโปรโมชั่นที่กำลังใช้งาน</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FiGift className="text-purple-600" />
        โปรโมชั่นที่กำลังใช้งาน ({promotions.length})
      </h3>

      <div className="space-y-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {promo.promotion_name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiClock className="text-xs" />
                  <span>รับเมื่อ: {new Date(promo.claimed_at).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
              <button
                onClick={() => cancelPromotion(promo.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="ยกเลิกโปรโมชั่น"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-blue-50 rounded p-2">
                <div className="text-xs text-gray-600 mb-1">ยอดฝาก</div>
                <div className="font-semibold text-blue-600">
                  ฿{promo.deposit_amount.toLocaleString()}
                </div>
              </div>
              <div className="bg-green-50 rounded p-2">
                <div className="text-xs text-gray-600 mb-1">โบนัส</div>
                <div className="font-semibold text-green-600">
                  ฿{promo.bonus_amount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Turnover Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 flex items-center gap-1">
                  <FiTrendingUp className="text-xs" />
                  ความคืบหน้าเทิร์นโอเวอร์
                </span>
                <span className="font-semibold text-purple-600">
                  {promo.turnover_percentage.toFixed(1)}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(promo.turnover_percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                <span>฿{promo.current_turnover.toLocaleString()}</span>
                <span>฿{promo.required_turnover.toLocaleString()}</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {promo.turnover_percentage >= 100 ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <FiCheckCircle />
                    ทำเทิร์นครบแล้ว
                  </span>
                ) : (
                  <span className="text-orange-600 text-sm font-medium">
                    ยังต้องทำเทิร์นอีก ฿{(promo.required_turnover - promo.current_turnover).toLocaleString()}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => {
                  setSelectedPromo(promo)
                  setShowLogs(true)
                }}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                ดูประวัติ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Logs Modal */}
      {showLogs && selectedPromo && (
        <PromotionLogsModal
          promotionId={selectedPromo.id}
          promotionName={selectedPromo.promotion_name}
          onClose={() => {
            setShowLogs(false)
            setSelectedPromo(null)
          }}
        />
      )}
    </div>
  )
}

// Logs Modal Component
interface LogsModalProps {
  promotionId: number
  promotionName: string
  onClose: () => void
}

const PromotionLogsModal = ({ promotionId, promotionName, onClose }: LogsModalProps) => {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/v1/member/promotions/${promotionId}/logs?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setLogs(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionBadge = (action: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      claimed: { color: 'bg-green-100 text-green-800', text: 'รับโปรโมชั่น' },
      turnover_updated: { color: 'bg-blue-100 text-blue-800', text: 'อัพเดทเทิร์น' },
      completed: { color: 'bg-purple-100 text-purple-800', text: 'ทำเทิร์นครบ' },
      cancelled: { color: 'bg-red-100 text-red-800', text: t("common:buttons.cancel") },
      expired: { color: 'bg-gray-100 text-gray-800', text: 'หมดอายุ' }
    }
    
    const badge = badges[action] || { color: 'bg-gray-100 text-gray-800', text: action }
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">ประวัติ: {promotionName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีประวัติ
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    {getActionBadge(log.action)}
                    <span className="text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString('th-TH')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{log.description}</p>
                  
                  {log.old_value !== log.new_value && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>฿{log.old_value.toLocaleString()}</span>
                      <span>→</span>
                      <span className="font-semibold text-purple-600">
                        ฿{log.new_value.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivePromotionsCard
