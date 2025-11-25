import React, { useState, useEffect } from 'react'
import { FiUsers, FiDollarSign, FiLink, FiCopy, FiCheck, FiTrendingUp, FiAward, FiCalendar, FiChevronLeft, FiChevronRight, FiEye, FiX } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

type TabType = 'overview' | 'members' | 'revenue' | 'withdraw'

interface AffiliateMember {
  id: string
  phone: string
  fullname: string | null
  totalBet: number
  totalCommission: number
  lastActivity: string | null
  createdAt: string
}

interface AffiliateStats {
  totalMembers: number
  activeMembers: number
  totalCommission: number
  availableBalance: number
  todayCommission: number
  monthlyCommission: number
  lotteryCommission: number
  gameCommission: number
  commissionRate: number
}

interface ReferralLinkData {
  referralCode: string
  referralLink: string
  shareText: string
}

interface CommissionHistory {
  id: string
  amount: number
  betAmount: number
  gameType: string
  referredMemberPhone: string
  createdAt: string
}

interface MemberDetailCommission {
  date: string
  lotteryTurnover: number
  lotteryCommission: number
  gameTurnover: number
  gameCommission: number
  totalCommission: number
}

const Affiliate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [stats, setStats] = useState<AffiliateStats>({
    totalMembers: 0,
    activeMembers: 0,
    totalCommission: 0,
    availableBalance: 0,
    todayCommission: 0,
    monthlyCommission: 0,
    lotteryCommission: 0,
    gameCommission: 0,
    commissionRate: 5
  })
  const [members, setMembers] = useState<AffiliateMember[]>([])
  const [linkData, setLinkData] = useState<ReferralLinkData | null>(null)
  const [commissionHistory, setCommissionHistory] = useState<CommissionHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [membersPage, setMembersPage] = useState(1)
  const [totalMembersPages, setTotalMembersPages] = useState(1)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<AffiliateMember | null>(null)
  const [memberDetail, setMemberDetail] = useState<MemberDetailCommission[]>([])
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailTab, setDetailTab] = useState<'lottery' | 'game'>('lottery')

  // Always use current domain for referral link to avoid localhost issue
  const referralLink = linkData?.referralCode
    ? `${window.location.origin}/register/${linkData.referralCode}`
    : `${window.location.origin}/register?ref=...`

  useEffect(() => {
    loadAffiliateData()
  }, [])

  const getAuthHeaders = () => {
    // Try multiple token storage keys
    const token = localStorage.getItem('memberToken') || localStorage.getItem('token') || localStorage.getItem('accessToken')
    if (!token) {
      console.error('No auth token found')
      return {}
    }
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  const loadAffiliateData = async () => {
    setLoading(true)
    try {
      // Load referral link, stats, and members in parallel
      const [linkRes, statsRes, membersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/member/referral/link`, { headers: getAuthHeaders() }),
        axios.get(`${API_BASE_URL}/api/v1/member/referral/stats`, { headers: getAuthHeaders() }),
        axios.get(`${API_BASE_URL}/api/v1/member/referral/members`, { headers: getAuthHeaders() })
      ])

      if (linkRes.data.success) {
        setLinkData(linkRes.data.data)
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data)
      }

      if (membersRes.data.success) {
        setMembers(membersRes.data.data.members || [])
        setTotalMembersPages(membersRes.data.data.totalPages || 1)
      }

      // Load commission history
      try {
        const historyRes = await axios.get(`${API_BASE_URL}/api/v1/member/referral/commissions`, { headers: getAuthHeaders() })
        if (historyRes.data.success) {
          setCommissionHistory(historyRes.data.data.commissions || [])
        }
      } catch (e) {
        // Commission history is optional
      }
    } catch (error: any) {
      console.error('Load affiliate error:', error)
      toast.error(error.response?.data?.message || 'โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  const loadMembersPage = async (page: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/member/referral/members?page=${page}&limit=10`, { headers: getAuthHeaders() })
      if (response.data.success) {
        setMembers(response.data.data.members || [])
        setTotalMembersPages(response.data.data.totalPages || 1)
        setMembersPage(page)
      }
    } catch (error) {
      console.error('Load members page error:', error)
    }
  }

  const getMonthlyRevenue = () => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()

    return commissionHistory.filter(c => {
      const date = new Date(c.createdAt)
      return date.getFullYear() === year && date.getMonth() === month
    })
  }

  const getDailyRevenue = () => {
    const monthly = getMonthlyRevenue()
    const dailyMap = new Map<string, { total: number, count: number }>()

    monthly.forEach(c => {
      const date = new Date(c.createdAt).toISOString().split('T')[0]
      const existing = dailyMap.get(date) || { total: 0, count: 0 }
      dailyMap.set(date, {
        total: existing.total + c.amount,
        count: existing.count + 1
      })
    })

    return Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  const changeMonth = (delta: number) => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + delta)
      return newDate
    })
  }

  const loadMemberDetail = async (member: AffiliateMember) => {
    setSelectedMember(member)
    setShowDetailModal(true)
    setLoadingDetail(true)

    try {
      // Load commission detail (has turnover data grouped by date)
      const commResponse = await axios.get(
        `${API_BASE_URL}/api/v1/member/referral/members/${member.id}/detail`,
        { headers: getAuthHeaders() }
      )
      if (commResponse.data.success) {
        setMemberDetail(commResponse.data.data || [])
      }
    } catch (error) {
      console.error('Load member detail error:', error)
      toast.error('โหลดรายละเอียดไม่สำเร็จ')
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('คัดลอกลิงก์สำเร็จ')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWithdrawCommission = async () => {
    const amount = parseFloat(withdrawAmount) || stats.availableBalance
    if (amount < 1) {
      toast.error('กรุณาระบุจำนวนเงิน')
      return
    }
    if (amount > stats.availableBalance) {
      toast.error('ยอดเงินไม่เพียงพอ')
      return
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/member/referral/withdraw`,
        { amount },
        { headers: getAuthHeaders() }
      )

      if (response.data.success) {
        toast.success('ถอนค่าคอมมิชชั่นเข้าเครดิตสำเร็จ')
        setWithdrawAmount('')
        loadAffiliateData() // Reload data
      } else {
        toast.error(response.data.message || 'ถอนไม่สำเร็จ')
      }
    } catch (error: any) {
      console.error('Withdraw error:', error)
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'ภาพรวม', icon: <FiTrendingUp /> },
    { id: 'members' as TabType, label: 'สมาชิก', icon: <FiUsers /> },
    { id: 'revenue' as TabType, label: 'รายได้', icon: <FiDollarSign /> },
    { id: 'withdraw' as TabType, label: 'ถอนเงิน', icon: <FiAward /> },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 rounded-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.4)] border border-purple-400/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg flex items-center gap-3">
            <FiUsers size={28} />
            แนะนำเพื่อน
          </h1>
          <p className="text-white/90">รับค่าคอมมิชชั่น {stats.commissionRate}% จากยอดเดิมพันของเพื่อน</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Referral Link */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiLink className="text-purple-400" size={24} />
              <h2 className="text-xl font-bold text-white">ลิงก์แนะนำเพื่อน</h2>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleCopyLink}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  copied
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
                {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
              </button>
            </div>

            <p className="text-white/60 text-sm mt-3">
              แชร์ลิงก์นี้ให้เพื่อนของคุณ เมื่อเพื่อนสมัครและฝากเงิน คุณจะได้รับค่าคอมมิชชั่น {stats.commissionRate}%
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <FiUsers size={20} />
                <span className="text-xs">สมาชิกในสายงาน</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalMembers}</p>
              <p className="text-xs text-white/60">คน (ใช้งาน {stats.activeMembers})</p>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <FiDollarSign size={20} />
                <span className="text-xs">ค่าคอมมิชชั่นทั้งหมด</span>
              </div>
              <p className="text-2xl font-bold text-white">฿{formatCurrency(stats.totalCommission)}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <FiAward size={20} />
                <span className="text-xs">คอมมิชชั่นคงเหลือ</span>
              </div>
              <p className="text-2xl font-bold text-white">฿{formatCurrency(stats.availableBalance)}</p>
            </div>

            <div className="bg-gradient-to-br from-pink-600/20 to-pink-700/20 border border-pink-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-pink-400 mb-2">
                <FiTrendingUp size={20} />
                <span className="text-xs">คอมมิชชั่นเดือนนี้</span>
              </div>
              <p className="text-2xl font-bold text-white">฿{formatCurrency(stats.monthlyCommission)}</p>
            </div>
          </div>

          {/* Commission Breakdown by Type */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">รายได้แยกตามประเภท</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-white/60 text-sm mb-1">หวย</p>
                <p className="text-xl font-bold text-yellow-400">฿{formatCurrency(stats.lotteryCommission)}</p>
              </div>
              <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-lg p-4">
                <p className="text-white/60 text-sm mb-1">เกมส์</p>
                <p className="text-xl font-bold text-cyan-400">฿{formatCurrency(stats.gameCommission)}</p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiAward className="text-yellow-400" />
              วิธีรับค่าคอมมิชชั่น
            </h3>
            <div className="space-y-2 text-white/80 text-sm">
              <p>1. คัดลอกลิงก์แนะนำเพื่อนของคุณ</p>
              <p>2. แชร์ลิงก์ให้เพื่อนของคุณ</p>
              <p>3. เมื่อเพื่อนสมัครสมาชิกผ่านลิงก์ของคุณ</p>
              <p>4. คุณจะได้รับค่าคอมมิชชั่น {stats.commissionRate}% จากยอดเดิมพันของเพื่อน</p>
              <p>5. สามารถถอนค่าคอมมิชชั่นเข้าเครดิตได้ทันที</p>
            </div>
          </div>
        </>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">สมาชิกในสายงาน ({stats.totalMembers} คน)</h2>

          {members.length === 0 ? (
            <p className="text-center text-white/60 py-8">ยังไม่มีสมาชิกในสายงาน</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/70 font-medium py-3 px-2">ลำดับ</th>
                      <th className="text-left text-white/70 font-medium py-3 px-2">เบอร์โทร</th>
                      <th className="text-left text-white/70 font-medium py-3 px-2">ชื่อ-นามสกุล</th>
                      <th className="text-left text-white/70 font-medium py-3 px-2">วันที่สมัคร</th>
                      <th className="text-right text-white/70 font-medium py-3 px-2">ยอดแทงรวม</th>
                      <th className="text-right text-white/70 font-medium py-3 px-2">คอมมิชชั่น</th>
                      <th className="text-center text-white/70 font-medium py-3 px-2">รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => (
                      <tr key={member.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 px-2 text-white">{(membersPage - 1) * 10 + index + 1}</td>
                        <td className="py-4 px-2 text-white">{member.phone.slice(0, 3)}****{member.phone.slice(-3)}</td>
                        <td className="py-4 px-2 text-white">{member.fullname || '-'}</td>
                        <td className="py-4 px-2 text-white/70">{formatDate(member.createdAt)}</td>
                        <td className="py-4 px-2 text-right text-blue-400">฿{formatCurrency(member.totalBet)}</td>
                        <td className="py-4 px-2 text-right text-green-400 font-semibold">฿{formatCurrency(member.totalCommission)}</td>
                        <td className="py-4 px-2 text-center">
                          <button
                            onClick={() => loadMemberDetail(member)}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm flex items-center gap-1 mx-auto"
                          >
                            <FiEye size={14} />
                            ดู
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalMembersPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => loadMembersPage(membersPage - 1)}
                    disabled={membersPage === 1}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft />
                  </button>
                  <span className="text-white/70 text-sm">หน้า {membersPage} / {totalMembersPages}</span>
                  <button
                    onClick={() => loadMembersPage(membersPage + 1)}
                    disabled={membersPage === totalMembersPages}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">รายได้รายวัน</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                <FiChevronLeft />
              </button>
              <span className="text-white font-medium px-3">
                {selectedMonth.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-white/60 text-sm">รายได้เดือนนี้</p>
              <p className="text-2xl font-bold text-green-400">
                ฿{formatCurrency(getMonthlyRevenue().reduce((sum, c) => sum + c.amount, 0))}
              </p>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-white/60 text-sm">จำนวนรายการ</p>
              <p className="text-2xl font-bold text-blue-400">{getMonthlyRevenue().length}</p>
            </div>
          </div>

          {/* Daily Breakdown */}
          {getDailyRevenue().length === 0 ? (
            <p className="text-center text-white/60 py-8">ไม่มีรายได้ในเดือนนี้</p>
          ) : (
            <div className="space-y-3">
              {getDailyRevenue().map(day => (
                <div key={day.date} className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-purple-400" />
                    <span className="text-white">{formatDate(day.date)}</span>
                    <span className="text-white/60 text-sm">({day.count} รายการ)</span>
                  </div>
                  <span className="text-green-400 font-semibold">฿{formatCurrency(day.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Withdraw Tab */}
      {activeTab === 'withdraw' && (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">ถอนค่าคอมมิชชั่นเข้าเครดิต</h2>

          <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-white/60 text-sm mb-2">ยอดที่สามารถถอนได้</p>
            <p className="text-4xl font-bold text-green-400">฿{formatCurrency(stats.availableBalance)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/70 text-sm mb-2 block">จำนวนเงินที่ต้องการถอน</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder={`ใส่จำนวน หรือเว้นว่างเพื่อถอนทั้งหมด`}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400"
              />
            </div>

            <button
              onClick={handleWithdrawCommission}
              disabled={stats.availableBalance < 1}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
            >
              ถอนเข้าเครดิต
            </button>

            <p className="text-white/60 text-sm text-center">
              * ยอดที่ถอนจะเข้าเครดิตหลักของคุณทันที
            </p>
          </div>

          {/* Stats Summary */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-white font-medium mb-4">สรุปข้อมูล</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">คอมมิชชั่นทั้งหมด</span>
                <span className="text-white">฿{formatCurrency(stats.totalCommission)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">ถอนไปแล้ว</span>
                <span className="text-white">฿{formatCurrency(stats.totalCommission - stats.availableBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">คงเหลือ</span>
                <span className="text-green-400 font-semibold">฿{formatCurrency(stats.availableBalance)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {showDetailModal && selectedMember && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">รายละเอียดสมาชิก</h3>
                <p className="text-white/60 text-sm">
                  {selectedMember.phone.slice(0, 3)}****{selectedMember.phone.slice(-3)}
                  {selectedMember.fullname ? ` - ${selectedMember.fullname}` : ''}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Tab Selector */}
            <div className="p-4 border-b border-white/10">
              <div className="bg-white/5 rounded-lg p-1 flex">
                <button
                  onClick={() => setDetailTab('lottery')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    detailTab === 'lottery'
                      ? 'bg-yellow-600 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  หวย
                </button>
                <button
                  onClick={() => setDetailTab('game')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    detailTab === 'game'
                      ? 'bg-cyan-600 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  เกมส์
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {loadingDetail ? (
                <div className="text-center py-8 text-white/60">กำลังโหลด...</div>
              ) : (
                // Turnover and Commission View
                memberDetail.length === 0 ? (
                  <div className="text-center py-8 text-white/60">ยังไม่มีค่าคอมมิชชั่น</div>
                ) : (
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-white/60 font-medium">วันที่</th>
                            <th className="text-right py-3 px-4 text-white/60 font-medium">ยอดแทง</th>
                            <th className="text-right py-3 px-4 text-white/60 font-medium">ค่าคอมมิชชั่น</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memberDetail.map((detail) => {
                            const turnover = detailTab === 'lottery' ? detail.lotteryTurnover : detail.gameTurnover
                            const commission = detailTab === 'lottery' ? detail.lotteryCommission : detail.gameCommission

                            if (turnover === 0 && commission === 0) return null

                            return (
                              <tr key={detail.date} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-3 px-4 text-white">{formatDate(detail.date)}</td>
                                <td className="py-3 px-4 text-right text-white">฿{formatCurrency(turnover)}</td>
                                <td className="py-3 px-4 text-right text-green-400 font-medium">฿{formatCurrency(commission)}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-white/20 bg-white/5">
                            <td className="py-3 px-4 text-white font-bold">รวม</td>
                            <td className="py-3 px-4 text-right text-white font-bold">
                              ฿{formatCurrency(
                                memberDetail.reduce((sum, d) => sum + (detailTab === 'lottery' ? d.lotteryTurnover : d.gameTurnover), 0)
                              )}
                            </td>
                            <td className="py-3 px-4 text-right text-green-400 font-bold">
                              ฿{formatCurrency(
                                memberDetail.reduce((sum, d) => sum + (detailTab === 'lottery' ? d.lotteryCommission : d.gameCommission), 0)
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                  </div>
                )
              )}
            </div>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Affiliate
