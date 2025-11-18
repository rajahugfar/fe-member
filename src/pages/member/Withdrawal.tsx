import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiTrendingUp, FiAlertCircle, FiUser } from 'react-icons/fi'
import { withdrawalAPI, profileAPI } from '../../api/memberAPI'
import { toast } from 'react-hot-toast'
import BankIcon from '../../components/BankIcon'

interface MemberProfile {
  phone: string
  fullname?: string
  credit: number
  creditGame: number
  bankCode?: string
  bankNumber?: string
  bankName?: string
  turnover?: number
  turnoverNeed?: number
}

const Withdrawal: React.FC = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<MemberProfile | null>(null)
  const [amount, setAmount] = useState<number | string>('')
  const [loading, setLoading] = useState(false)

  const MIN_WITHDRAWAL = 100
  const MAX_WITHDRAWAL = 100000

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const profileRes = await profileAPI.getProfile()
      setProfile(profileRes.data)
    } catch (error) {
      console.error('Load data error:', error)
      toast.error('โหลดข้อมูลไม่สำเร็จ')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profile) {
      toast.error('ไม่พบข้อมูลโปรไฟล์')
      return
    }

    if (!profile.bankCode || !profile.bankNumber) {
      toast.error('กรุณาเพิ่มบัญชีธนาคารในโปรไฟล์ก่อนถอนเงิน')
      return
    }

    const withdrawAmount = Number(amount)

    if (!withdrawAmount || withdrawAmount < MIN_WITHDRAWAL) {
      toast.error(`ยอดถอนขั้นต่ำ ${MIN_WITHDRAWAL} บาท`)
      return
    }

    if (withdrawAmount > MAX_WITHDRAWAL) {
      toast.error(`ยอดถอนสูงสุด ${MAX_WITHDRAWAL.toLocaleString()} บาท`)
      return
    }

    if (withdrawAmount > profile.creditGame) {
      toast.error('ยอดเงินไม่เพียงพอ')
      return
    }

    setLoading(true)

    try {
      await withdrawalAPI.requestWithdrawal({
        amount: withdrawAmount
      })

      toast.success('ส่งคำขอถอนเงินสำเร็จ กรุณารอการตรวจสอบ')
      navigate('/member/withdrawal/history')
    } catch (error: any) {
      console.error('Withdrawal error:', error)
      toast.error(error.response?.data?.message || 'ถอนเงินไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">กำลังโหลด...</div>
      </div>
    )
  }

  const balance = profile.creditGame

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">ถอนเงิน</h1>
        <p className="text-white/80">กรอกข้อมูลเพื่อถอนเงินออกจากระบบ</p>
      </div>

      {/* Member Info Card */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <p className="text-white/60 text-sm mb-3">ข้อมูลสมาชิก</p>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center text-white font-bold text-2xl border-2 border-blue-500/50">
            {profile.fullname ? profile.fullname.charAt(0).toUpperCase() : <FiUser />}
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-lg">{profile.fullname || 'ไม่ระบุชื่อ'}</p>
            <p className="text-white/60 text-sm">{profile.phone}</p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
        <p className="text-white/80 mb-2">ยอดเงินคงเหลือ (Game Credit)</p>
        <p className="text-4xl font-bold text-white">฿{formatCurrency(balance)}</p>
      </div>

      {/* Turnover Warning */}
      {profile.turnoverNeed && profile.turnoverNeed > 0 && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5 w-5 h-5" />
            <div className="flex-1">
              <p className="text-yellow-400 font-bold mb-2">⚠️ คุณมีเงื่อนไขเทิร์นโอเวอร์</p>
              <div className="space-y-1 text-sm text-white/80">
                <div className="flex justify-between">
                  <span>ทำเทิร์นแล้ว:</span>
                  <span className="font-bold">{formatCurrency(profile.turnover || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ต้องทำให้ครบ:</span>
                  <span className="font-bold text-yellow-400">{formatCurrency(profile.turnoverNeed)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                  <span>เหลืออีก:</span>
                  <span className="font-bold text-red-400">
                    {formatCurrency(Math.max(0, profile.turnoverNeed - (profile.turnover || 0)))}
                  </span>
                </div>
              </div>
              {profile.turnover && profile.turnover >= profile.turnoverNeed ? (
                <p className="text-green-400 text-sm mt-3 flex items-center gap-2">
                  <FiCheck className="w-4 h-4" />
                  ทำเทิร์นครบแล้ว สามารถถอนได้
                </p>
              ) : (
                <p className="text-red-400 text-sm mt-3">
                  ⛔ ยังทำเทิร์นไม่ครบ ต้องเล่นเกมส์/แทงหวยเพิ่มก่อนถึงถอนได้
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bank Account Info */}
      {profile.bankCode && profile.bankNumber ? (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm mb-3">บัญชีที่จะรับเงิน</p>
          <div className="flex items-center gap-4">
            <BankIcon bank={profile.bankCode} size="md" />
            <div className="flex-1">
              <p className="text-white font-medium">{profile.bankName || profile.bankCode}</p>
              <p className="text-white/80 text-sm">{profile.bankNumber}</p>
              <p className="text-white/60 text-sm">{profile.fullname || '-'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <FiAlertCircle />
            กรุณาเพิ่มบัญชีธนาคารในโปรไฟล์ก่อนถอนเงิน
          </p>
        </div>
      )}

      {/* Withdrawal Form */}
      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-white/90 text-sm font-medium mb-3">จำนวนเงินที่ต้องการถอน</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-2xl font-bold placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="0.00"
            min={MIN_WITHDRAWAL}
            max={Math.min(MAX_WITHDRAWAL, balance)}
          />
          <div className="flex items-center justify-between mt-2 text-sm">
            <p className="text-white/60">ขั้นต่ำ: ฿{MIN_WITHDRAWAL.toLocaleString()}</p>
            <p className="text-white/60">สูงสุด: ฿{Math.min(MAX_WITHDRAWAL, balance).toLocaleString()}</p>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <p className="text-white/80 text-sm mb-3">เลือกจำนวนเร็ว</p>
          <div className="grid grid-cols-4 gap-2">
            {[500, 1000, 5000, 10000].map(value => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                disabled={value > balance}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  amount === value
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {value.toLocaleString()}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAmount(balance)}
            disabled={balance === 0}
            className="w-full mt-2 px-3 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ถอนทั้งหมด (฿{formatCurrency(balance)})
          </button>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
          <div className="flex gap-3">
            <FiAlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-200 space-y-1">
              <p>• ระยะเวลาดำเนินการ 1-5 นาที (ในเวลาทำการ)</p>
              <p>• ตรวจสอบชื่อบัญชีให้ตรงกับที่ลงทะเบียน</p>
              <p>• ติดต่อฝ่ายบริการหากมีปัญหา</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        {amount && Number(amount) >= MIN_WITHDRAWAL && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2">
            <p className="text-white/80 text-sm">สรุปการถอน</p>
            <div className="flex justify-between">
              <span className="text-white/60">จำนวนที่ถอน:</span>
              <span className="text-white font-bold">฿{formatCurrency(Number(amount))}</span>
            </div>
            {profile.bankCode && profile.bankNumber && (
              <div className="flex justify-between">
                <span className="text-white/60">โอนเข้าบัญชี:</span>
                <span className="text-white">{profile.bankCode} - {profile.bankNumber}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-white/60">คงเหลือหลังถอน:</span>
              <span className="text-white font-bold">฿{formatCurrency(balance - Number(amount))}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !amount || Number(amount) < MIN_WITHDRAWAL || !profile.bankCode || !profile.bankNumber}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>กำลังส่งคำขอ...</span>
            </>
          ) : (
            <>
              <FiTrendingUp />
              <span>ยืนยันถอนเงิน</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default Withdrawal
