import { useState, useEffect } from 'react'
import { FiX, FiCalendar, FiGift } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface DailyCheckInModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CheckInDay {
  date: string
  points: number
  status: 'passed' | 'today' | 'future'
}

interface CollectReward {
  days: number
  maxReward: number
  status: 'locked' | 'available' | 'claimed'
}

const DailyCheckInModal = ({ isOpen, onClose }: DailyCheckInModalProps) => {
  const [checkInDays, setCheckInDays] = useState<CheckInDay[]>([])
  const [collectRewards, setCollectRewards] = useState<CollectReward[]>([
    { days: 3, maxReward: 5, status: 'locked' },
    { days: 7, maxReward: 15, status: 'locked' },
    { days: 15, maxReward: 30, status: 'locked' },
    { days: 25, maxReward: 50, status: 'locked' }
  ])
  const [consecutiveDays, setConsecutiveDays] = useState(0)
  const [canCheckIn, setCanCheckIn] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchCheckInData()
    }
  }, [isOpen])

  const fetchCheckInData = async () => {
    try {
      const response = await fetch('/api/v1/member/daily-checkin/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('memberToken')}`
        },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.data) {
          setCheckInDays(data.data.checkInDays || generateDefaultDays())
          setConsecutiveDays(data.data.consecutiveDays || 0)
          setCanCheckIn(data.data.canCheckIn || false)
          updateCollectRewards(data.data.consecutiveDays || 0)
        }
      } else {
        setCheckInDays(generateDefaultDays())
      }
    } catch (error) {
      console.error('Failed to fetch check-in data:', error)
      setCheckInDays(generateDefaultDays())
    }
  }

  const generateDefaultDays = (): CheckInDay[] => {
    const days: CheckInDay[] = []
    const today = new Date()
    
    for (let i = -1; i < 6; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      days.push({
        date: i === 0 ? 'วันนี้' : `${date.getDate()}/${date.getMonth() + 1}`,
        points: 5,
        status: i < 0 ? 'passed' : i === 0 ? 'today' : 'future'
      })
    }
    
    return days
  }

  const updateCollectRewards = (days: number) => {
    setCollectRewards(prev => prev.map(reward => ({
      ...reward,
      status: days >= reward.days ? 'available' : 'locked'
    })))
  }

  const handleCheckIn = async () => {
    if (!canCheckIn || isChecking) return

    setIsChecking(true)
    try {
      const response = await fetch('/api/v1/member/daily-checkin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('memberToken')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`🎉 เช็คอินสำเร็จ! +${data.data.points} คะแนน`)
        fetchCheckInData()
        
        // Auto close after 2 seconds
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        const error = await response.json()
        toast.error(error.message || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      console.error('Check-in error:', error)
      toast.error('เกิดข้อผิดพลาดในการเช็คอิน')
    } finally {
      setIsChecking(false)
    }
  }

  const handleClaimReward = async (days: number) => {
    try {
      const response = await fetch(`/api/v1/member/daily-checkin/claim/${days}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('memberToken')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`🎁 รับรางวัลสำเร็จ! +${data.data.amount} บาท`)
        fetchCheckInData()
      } else {
        const error = await response.json()
        toast.error(error.message || 'ไม่สามารถรับรางวัลได้')
      }
    } catch (error) {
      console.error('Claim reward error:', error)
      toast.error('เกิดข้อผิดพลาดในการรับรางวัล')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="bg-gradient-to-b from-[#1a1f2e] to-[#0f1419] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="relative bg-cover bg-center p-8 rounded-t-2xl" style={{ backgroundImage: 'url(/build/web/ezl-sa-casino/img/check-in-cover-bg.jpg)' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
          >
            <FiX className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold text-white text-center mb-2">เช็คอินประจำวัน</h2>
          <p className="text-yellow-400 text-center text-sm">เทิร์นโอเวอร์ 500.- ขึ้นไป</p>
          <p className="text-white text-center text-sm mt-2">รับทุกวันเพียงเข้ามาเช็คอิน พร้อมทั้งสะสมเพื่อรับรางวัลที่สูงขึ้น</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Daily Check-in */}
          <div className="bg-[#1a1f2e] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-yellow-400 w-6 h-6" />
                <h3 className="text-xl font-bold text-white">เช็คอินประจำวัน</h3>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {checkInDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => day.status === 'today' && canCheckIn && handleCheckIn()}
                  disabled={day.status !== 'today' || !canCheckIn || isChecking}
                  className={`relative p-4 rounded-lg transition ${
                    day.status === 'passed'
                      ? 'bg-green-900 bg-opacity-30 cursor-not-allowed'
                      : day.status === 'today' && canCheckIn
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:scale-105 cursor-pointer animate-pulse'
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img 
                        src="https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/check-in-coin.png" 
                        alt="coin" 
                        className="w-full h-full"
                      />
                    </div>
                    <span className="text-white font-bold text-sm">+{day.points}</span>
                    <span className="text-white text-xs">{day.date}</span>
                  </div>
                  {day.status === 'passed' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <span className="text-green-400 text-2xl">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Collect Rewards */}
          <div className="bg-[#1a1f2e] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">เช็คอินสะสม</h3>
                <p className="text-gray-400 text-sm">สะสมเช็คอินเพื่อรับรางวัลพิเศษ</p>
              </div>
              <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold">
                {consecutiveDays} วัน
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {collectRewards.map((reward, index) => (
                <button
                  key={index}
                  onClick={() => reward.status === 'available' && handleClaimReward(reward.days)}
                  disabled={reward.status !== 'available'}
                  className={`relative p-4 rounded-lg transition ${
                    reward.status === 'available'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:scale-105 cursor-pointer'
                      : reward.status === 'claimed'
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gray-800 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <FiGift className="w-12 h-12 text-yellow-400" />
                    <div className="text-center">
                      <p className="text-xs text-gray-300">สูงสุด</p>
                      <p className="text-xl font-bold text-white">{reward.maxReward}฿</p>
                    </div>
                    <div className="w-full h-1 bg-gray-600 rounded-full mt-2">
                      <div 
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${Math.min((consecutiveDays / reward.days) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-white text-sm font-medium">{reward.days} วัน</span>
                  </div>
                  {reward.status === 'locked' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg">
                      <span className="text-4xl">🔒</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{consecutiveDays}/25 วัน</span>
                <span>{Math.round((consecutiveDays / 25) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${(consecutiveDays / 25) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-[#1a1f2e] rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-3">กติกา</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• เช็คอินได้ทุกวัน รับคะแนนสะสม</li>
              <li>• ต้องมีเทิร์นโอเวอร์ขั้นต่ำ 500 บาท</li>
              <li>• สะสมเช็คอินครบตามกำหนดรับรางวัลพิเศษ</li>
              <li>• รีเซ็ตสิทธิ์ทุกวันเวลา 00:00 น.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyCheckInModal
