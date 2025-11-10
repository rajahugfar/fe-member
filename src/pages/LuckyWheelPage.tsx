import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMemberStore } from '@/store/memberStore'
import toast from 'react-hot-toast'
import { FiGift, FiRotateCw, FiTrendingUp } from 'react-icons/fi'
import { luckyWheelAPI, Prize, SpinHistory } from '@/api/luckyWheelAPI'

const LuckyWheelPage = () => {
  const { member } = useMemberStore()
  const [isSpinning, setIsSpinning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [canSpin, setCanSpin] = useState(true)
  const [spinCount, setSpinCount] = useState(0)
  const [maxSpins, setMaxSpins] = useState(3)
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [history, setHistory] = useState<SpinHistory[]>([])
  const wheelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (member) {
      fetchWheelInfo()
    }
  }, [member])

  const fetchWheelInfo = async () => {
    try {
      setIsLoading(true)
      const info = await luckyWheelAPI.getWheelInfo()
      setPrizes(info.prizes)
      setSpinCount(info.spinCount)
      setMaxSpins(info.maxSpins)
      setCanSpin(info.canSpin)
      setHistory(info.history)
    } catch (error: any) {
      console.error('Failed to fetch wheel info:', error)
      toast.error(error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลกงล้อได้')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpin = async () => {
    if (!member) {
      toast.error('กรุณาเข้าสู่ระบบก่อนหมุนกงล้อ')
      return
    }

    if (isSpinning) return
    
    if (spinCount >= maxSpins) {
      toast.error(`คุณหมุนครบ ${maxSpins} ครั้งแล้ววันนี้`)
      return
    }

    setIsSpinning(true)
    setCanSpin(false)

    try {
      // Call API to spin
      const result = await luckyWheelAPI.spin()
      
      // Find the won prize
      const wonPrize = prizes.find(p => p.id === result.prizeId)
      if (!wonPrize) {
        throw new Error('Prize not found')
      }

      // Calculate rotation
      const prizeIndex = prizes.findIndex(p => p.id === wonPrize.id)
      const segmentAngle = 360 / prizes.length
      const targetAngle = (prizeIndex * segmentAngle) + (segmentAngle / 2)
      const spins = 5 // Number of full rotations
      const finalRotation = (360 * spins) + (360 - targetAngle)

      setRotation(prev => prev + finalRotation)

      // Wait for animation to complete
      setTimeout(() => {
        setIsSpinning(false)
        setSpinCount(result.spinCount)
        
        // Show result
        if (wonPrize.type === 'item') {
          toast.success(`🎉 ยินดีด้วย! คุณได้รับ ${wonPrize.itemName || wonPrize.name}!`, { duration: 5000 })
        } else if (result.amount > 0) {
          toast.success(`🎉 ยินดีด้วย! คุณได้รับ ${result.amount} บาท`)
        } else {
          toast('โชคดีครั้งหน้า!', { icon: '🍀' })
        }

        // Refresh data
        fetchWheelInfo()
        
        // Allow spin again after 2 seconds
        setTimeout(() => {
          setCanSpin(result.spinCount < result.maxSpins)
        }, 2000)
      }, 4000)

    } catch (error: any) {
      console.error('Spin error:', error)
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      setIsSpinning(false)
      setCanSpin(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1419] to-[#1a1f2e] flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1419] to-[#1a1f2e]">
      {/* Header */}
      <nav className="bg-[#1a1f2e] border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/images/sacasino/logo.png" alt="Logo" className="h-12" />
            </Link>
            <h1 className="text-2xl font-bold text-yellow-400">กงล้อเสี่ยงโชค</h1>
            <Link 
              to="/"
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Wheel */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1f2e] rounded-lg p-8">
              {/* Spin Info */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">หมุนกงล้อลุ้นรางวัล</h2>
                <p className="text-gray-400">
                  คุณหมุนไปแล้ว <span className="text-yellow-400 font-bold">{spinCount}</span> / {maxSpins} ครั้ง
                </p>
                {!member && (
                  <p className="text-red-400 mt-2">กรุณาเข้าสู่ระบบเพื่อหมุนกงล้อ</p>
                )}
              </div>

              {/* Wheel Container */}
              <div className="relative flex justify-center items-center">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-yellow-400 drop-shadow-lg"></div>
                </div>

                {/* Wheel */}
                <div className="relative w-[600px] h-[600px]">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 animate-pulse opacity-50 blur-xl"></div>
                  
                  <div
                    ref={wheelRef}
                    className="w-full h-full rounded-full relative overflow-hidden shadow-2xl border-8 border-yellow-400"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                      boxShadow: '0 0 40px rgba(251, 191, 36, 0.5), inset 0 0 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    {prizes.map((prize, index) => {
                      const segmentAngle = 360 / prizes.length
                      const rotation = index * segmentAngle
                      
                      return (
                        <div
                          key={prize.id}
                          className="absolute w-full h-full"
                          style={{
                            transform: `rotate(${rotation}deg)`,
                            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.cos((segmentAngle * Math.PI) / 180)}%)`
                          }}
                        >
                          <div
                            className="w-full h-full relative"
                            style={{ 
                              background: `linear-gradient(180deg, ${prize.color} 0%, ${prize.color}dd 100%)`,
                              borderRight: '1px solid rgba(255,255,255,0.2)'
                            }}
                          />
                        </div>
                      )
                    })}
                    
                    {/* Text overlay - outside clipPath */}
                    {prizes.map((prize, index) => {
                      const segmentAngle = 360 / prizes.length
                      const rotation = index * segmentAngle
                      const textRotation = rotation + (segmentAngle / 2)
                      
                      return (
                        <div
                          key={`text-${prize.id}`}
                          className="absolute top-0 left-0 w-full h-full flex items-start justify-center pt-20"
                          style={{
                            transform: `rotate(${textRotation}deg)`,
                            transformOrigin: 'center center'
                          }}
                        >
                          <div className="text-white font-extrabold text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                            {prize.type === 'item' && prize.itemImage && (
                              <div className="text-4xl mb-2">{prize.itemImage}</div>
                            )}
                            <div className={`${prize.type === 'item' ? 'text-sm' : 'text-lg'} leading-tight px-2`}>
                              {prize.name}
                            </div>
                            {prize.type === 'item' && (
                              <div className="text-xs text-yellow-300 mt-1 font-bold">⭐ พิเศษ</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Center Button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <button
                      onClick={handleSpin}
                      disabled={!canSpin || isSpinning || !member || spinCount >= maxSpins}
                      className={`w-32 h-32 rounded-full font-bold text-white shadow-2xl flex flex-col items-center justify-center transition-all border-4 ${
                        canSpin && member && spinCount < maxSpins
                          ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 hover:scale-110 cursor-pointer border-yellow-200 animate-pulse'
                          : 'bg-gray-600 cursor-not-allowed border-gray-500'
                      }`}
                      style={{
                        boxShadow: canSpin && member && spinCount < maxSpins 
                          ? '0 0 30px rgba(251, 191, 36, 0.8), inset 0 0 20px rgba(255,255,255,0.3)'
                          : 'none'
                      }}
                    >
                      {isSpinning ? (
                        <FiRotateCw className="w-10 h-10 animate-spin" />
                      ) : (
                        <>
                          <span className="text-2xl mb-1">หมุน!</span>
                          <span className="text-xs opacity-80">SPIN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info & History */}
          <div className="space-y-6">
            {/* Prize List */}
            <div className="bg-[#1a1f2e] rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FiGift className="text-yellow-400" />
                รางวัล
              </h3>
              <div className="space-y-2">
                {prizes.filter(p => p.type === 'cash' ? (p.amount && p.amount > 0) : true).map(prize => (
                  <div key={prize.id} className="flex items-center justify-between p-3 bg-[#0f1419] rounded-lg hover:bg-[#1a1f2e] transition">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: prize.color }}></div>
                      {prize.type === 'item' && prize.itemImage && (
                        <span className="text-2xl">{prize.itemImage}</span>
                      )}
                      <div>
                        <span className="text-white font-medium">{prize.name}</span>
                        {prize.type === 'item' && (
                          <span className="ml-2 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full">พิเศษ!</span>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">{prize.probability}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="bg-[#1a1f2e] rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-yellow-400" />
                ประวัติการหมุน
              </h3>
              {history.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {history.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#0f1419] rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.prizeName}</p>
                        <p className="text-gray-400 text-xs">{new Date(item.spunAt).toLocaleString('th-TH')}</p>
                      </div>
                      {item.amount > 0 && (
                        <span className="text-green-400 font-bold">+{item.amount} บาท</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">ยังไม่มีประวัติการหมุน</p>
              )}
            </div>

            {/* Rules */}
            <div className="bg-[#1a1f2e] rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">กติกา</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• หมุนได้วันละ {maxSpins} ครั้ง</li>
                <li>• รางวัลจะเข้าบัญชีทันที</li>
                <li>• ต้องเป็นสมาชิกที่เข้าสู่ระบบ</li>
                <li>• รีเซ็ตสิทธิ์ทุกวันเวลา 00:00 น.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LuckyWheelPage
