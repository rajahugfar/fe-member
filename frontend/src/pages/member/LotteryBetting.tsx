import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { memberLotteryAPI, OpenPeriod, LotteryRate } from '@api/memberLotteryAPI'
import { toast } from 'react-hot-toast'
import {
  FiClock,
  FiDollarSign,
  FiShoppingCart,
  FiTrash2,
  FiArrowLeft,
} from 'react-icons/fi'

interface CartItem {
  bet_type: string
  number: string
  amount: number
  payout_rate: number
}

const LotteryBetting: React.FC = () => {
  const { periodId } = useParams<{ periodId: string }>()
  const navigate = useNavigate()

  const [period, setPeriod] = useState<OpenPeriod | null>(null)
  const [rates, setRates] = useState<LotteryRate[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [betType, setBetType] = useState('3top')
  const [number, setNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    loadData()
  }, [periodId])

  const loadData = async () => {
    if (!periodId) {
      navigate('/member/lottery')
      return
    }

    setLoading(true)
    try {
      const periods = await memberLotteryAPI.getOpenPeriods()
      const foundPeriod = periods.find((p: OpenPeriod) => p.id === periodId)

      if (!foundPeriod) {
        toast.error('ไม่พบงวดหวยนี้')
        navigate('/member/lottery')
        return
      }

      setPeriod(foundPeriod)

      const ratesData = await memberLotteryAPI.getLotteryRates(foundPeriod.huayCode)
      setRates(ratesData || [])
    } catch (error) {
      console.error('Load error:', error)
      toast.error('โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (!number || !amount) {
      toast.error('กรุณากรอกเลขและจำนวนเงิน')
      return
    }

    const rate = rates.find(r => r.bet_type === betType)
    if (!rate) {
      toast.error('ไม่พบอัตราจ่าย')
      return
    }

    const amountNum = parseFloat(amount)
    if (amountNum < rate.min_bet || amountNum > rate.max_bet) {
      toast.error(`จำนวนเงินต้องอยู่ระหว่าง ${rate.min_bet}-${rate.max_bet} บาท`)
      return
    }

    setCart([...cart, {
      bet_type: betType,
      number,
      amount: amountNum,
      payout_rate: rate.multiply
    }])

    setNumber('')
    setAmount('')
    toast.success('เพิ่มลงตะกร้าแล้ว')
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const submitBets = async () => {
    if (cart.length === 0) {
      toast.error('กรุณาเพิ่มรายการแทงก่อน')
      return
    }

    if (!periodId) return

    setSubmitting(true)
    try {
      await memberLotteryAPI.placeBulkBets(
        cart.map(item => ({
          period_id: periodId,
          bet_type: item.bet_type,
          number: item.number,
          amount: item.amount
        }))
      )

      toast.success('แทงหวยสำเร็จ')
      setCart([])
      navigate('/member/lottery')
    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(error.response?.data?.message || 'แทงหวยไม่สำเร็จ')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
      </div>
    )
  }

  if (!period) {
    return null
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/member/lottery')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 mb-4"
          >
            <FiArrowLeft /> กลับ
          </button>
          <h1 className="text-3xl font-bold text-white">{period.huayName}</h1>
          <p className="text-gray-400">{period.periodName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Betting Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">เลือกประเภทการแทง</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-white mb-2 block">ประเภท</label>
                  <select
                    value={betType}
                    onChange={(e) => setBetType(e.target.value)}
                    className="w-full p-3 bg-white/20 border-2 border-white/30 rounded-lg text-white"
                  >
                    {rates.map(rate => (
                      <option key={rate.bet_type} value={rate.bet_type}>
                        {rate.bet_type} (จ่าย {rate.multiply}x)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white mb-2 block">เลข</label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full p-3 bg-white/20 border-2 border-white/30 rounded-lg text-white"
                    placeholder="กรอกเลข"
                  />
                </div>

                <div>
                  <label className="text-white mb-2 block">จำนวนเงิน (บาท)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 bg-white/20 border-2 border-white/30 rounded-lg text-white"
                    placeholder="กรอกจำนวนเงิน"
                  />
                </div>

                <button
                  onClick={addToCart}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          </div>

          {/* Cart */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <FiShoppingCart className="text-white text-xl" />
                <h2 className="text-xl font-bold text-white">ตะกร้า ({cart.length})</h2>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">ยังไม่มีรายการ</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {cart.map((item, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-bold">{item.bet_type}</p>
                          <p className="text-yellow-400 text-xl font-mono">{item.number}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">จำนวน:</span>
                        <span className="text-white">{item.amount} บาท</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ถูกรางวัลได้:</span>
                        <span className="text-green-400">{item.amount * item.payout_rate} บาท</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-white/20 pt-4 mb-4">
                <div className="flex justify-between text-white mb-2">
                  <span>ยอดรวม:</span>
                  <span className="text-xl font-bold text-yellow-400">{totalAmount} บาท</span>
                </div>
              </div>

              <button
                onClick={submitBets}
                disabled={submitting || cart.length === 0}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
              >
                {submitting ? 'กำลังแทง...' : 'ยืนยันการแทง'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LotteryBetting
