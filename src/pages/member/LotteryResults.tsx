import React, { useState, useEffect } from 'react'
import { memberLotteryResultsAPI, LotteryResultItem } from '@api/memberLotteryResultsAPI'
import toast from 'react-hot-toast'
import { FiRefreshCw, FiCalendar, FiAward } from 'react-icons/fi'

const LotteryResults: React.FC = () => {
  const [results, setResults] = useState<LotteryResultItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchResults()
  }, [selectedDate])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const response = await memberLotteryResultsAPI.getResults({ date: selectedDate, status: 2 })
      setResults(response.data.lotteries || [])
    } catch (error) {
      console.error('Failed to fetch results:', error)
      toast.error('ไม่สามารถโหลดผลรางวัลได้')
    } finally {
      setLoading(false)
    }
  }

  const getFlagEmoji = (iconCode: string) => {
    const flags: { [key: string]: string } = {
      'th': '🇹🇭', 'la': '🇱🇦', 'vn': '🇻🇳', 'cn': '🇨🇳', 'jp': '🇯🇵',
      'kr': '🇰🇷', 'sg': '🇸🇬', 'tw': '🇹🇼', 'hk': '🇭🇰', 'gb': '🇬🇧',
      'de': '🇩🇪', 'ru': '🇷🇺', 'us': '🇺🇸'
    }
    return flags[iconCode?.toLowerCase()] || '🏳️'
  }

  const groupedResults = React.useMemo(() => {
    const groups: { [key: string]: { name: string; items: LotteryResultItem[]; order: number } } = {}
    
    results.forEach(lottery => {
      const groupId = lottery.lotteryGroup
      
      // Map group IDs to display names (same as admin page)
      // Group 0 and 1 = หวยรัฐบาลไทย (รวม รัฐบาล, ออมสิน, ธกส)
      const groupNames: { [key: number]: { name: string; order: number } } = {
        0: { name: 'หวยรัฐบาล/ออมสิน/ธกส', order: 0 },
        1: { name: 'หวยรัฐบาล/ออมสิน/ธกส', order: 0 },
        2: { name: 'หวยลาว', order: 1 },
        3: { name: 'หวยฮานอย', order: 2 },
        4: { name: 'หุ้นไทย', order: 3 },
        5: { name: 'หุ้นต่างประเทศ', order: 4 },
      }
      
      const groupInfo = groupNames[groupId] || { name: 'อื่นๆ', order: 99 }
      const groupKey = groupInfo.name
      
      if (!groups[groupKey]) {
        groups[groupKey] = { name: groupKey, items: [], order: groupInfo.order }
      }
      groups[groupKey].items.push(lottery)
    })

    // Sort items within each group by time (earliest first)
    Object.values(groups).forEach(group => {
      group.items.sort((a, b) => {
        const timeA = new Date(a.time).getTime()
        const timeB = new Date(b.time).getTime()
        return timeA - timeB
      })
    })

    // Return groups sorted by order
    return Object.values(groups).sort((a, b) => a.order - b.order)
  }, [results])

  return (
    <div className="min-h-screen space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <FiAward className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">ผลรางวัล</h1>
              <p className="text-white/80">ตรวจผลหวยรางวัลของคุณ</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 z-10" />
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-white focus:border-white shadow-lg"
              />
            </div>
            <button 
              onClick={fetchResults}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-amber-600 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} /> 
              รีเฟรช
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500/30 border-t-yellow-500"></div>
            <FiAward className="absolute inset-0 m-auto w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-gray-400 mt-4 text-lg">กำลังโหลดผลรางวัล...</p>
        </div>
      ) : groupedResults.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
          <FiAward className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-xl mb-2">ยังไม่มีผลรางวัล</p>
          <p className="text-gray-500 text-sm">* หวย GLO, BAAC, ออมสิน จะแสดงผลล่าสุดเสมอ</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedResults.map((group, idx) => (
            <div key={`${group.name}-${idx}`} className="space-y-3">
              {/* Group Header - Modern Design */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 p-4 shadow-lg">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
                <div className="relative flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gray-900 rounded-full"></span>
                    {group.name}
                  </h3>
                  <span className="px-4 py-1.5 bg-gray-900/20 backdrop-blur-sm text-gray-900 font-bold rounded-full text-sm">
                    {group.items.length} งวด
                  </span>
                </div>
              </div>

              {/* Group Items - Card Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {group.items.map((lottery) => (
                  <div 
                    key={lottery.id}
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 p-5"
                  >
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full"></div>
                    
                    {/* Lottery Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl drop-shadow-lg">{getFlagEmoji(lottery.icon)}</div>
                        <div>
                          <h4 className="text-white font-bold text-lg">{lottery.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400 text-xs">
                              {new Date(lottery.time).toLocaleDateString('th-TH', { 
                                day: '2-digit', 
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-400 text-xs">
                              {new Date(lottery.time).toLocaleTimeString('th-TH', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {lottery.has4d && (
                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
                          4 ตัว
                        </span>
                      )}
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* 4 ตัว */}
                      {lottery.has4d && (
                        <div className="col-span-3">
                          <div className="text-center">
                            <div className="text-yellow-400 text-xs font-semibold mb-2 uppercase tracking-wider">รางวัลที่ 1 (4 ตัว)</div>
                            {lottery.result4Up ? (
                              <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/30 to-amber-500/30 backdrop-blur-sm border-2 border-yellow-500/50 rounded-xl p-4 shadow-lg">
                                <div className="text-3xl font-black text-yellow-400 tracking-wider drop-shadow-lg">
                                  {lottery.result4Up}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                                <span className="text-gray-600 text-lg">- - - -</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 3 ตัว */}
                      <div className="text-center">
                        <div className="text-blue-400 text-xs font-semibold mb-2 uppercase tracking-wider">3 ตัว</div>
                        {lottery.result3Up ? (
                          <div className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm border-2 border-blue-500/50 rounded-lg p-3 shadow-md">
                            <div className="text-2xl font-black text-blue-400 tracking-wide">
                              {lottery.result3Up}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                            <span className="text-gray-600">- - -</span>
                          </div>
                        )}
                      </div>

                      {/* 2 ตัวบน */}
                      <div className="text-center">
                        <div className="text-green-400 text-xs font-semibold mb-2 uppercase tracking-wider">2 ตัวบน</div>
                        {lottery.result2Up ? (
                          <div className="bg-gradient-to-br from-green-500/30 to-emerald-500/30 backdrop-blur-sm border-2 border-green-500/50 rounded-lg p-3 shadow-md">
                            <div className="text-2xl font-black text-green-400 tracking-wide">
                              {lottery.result2Up}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                            <span className="text-gray-600">- -</span>
                          </div>
                        )}
                      </div>

                      {/* 2 ตัวล่าง */}
                      <div className="text-center">
                        <div className="text-teal-400 text-xs font-semibold mb-2 uppercase tracking-wider">2 ตัวล่าง</div>
                        {lottery.result2Low ? (
                          <div className="bg-gradient-to-br from-teal-500/30 to-cyan-500/30 backdrop-blur-sm border-2 border-teal-500/50 rounded-lg p-3 shadow-md">
                            <div className="text-2xl font-black text-teal-400 tracking-wide">
                              {lottery.result2Low}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                            <span className="text-gray-600">- -</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Footer Note */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djEyaC00VjM0aDR6bTAtMjR2MTJoLTRWMTBoNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
            <div className="relative">
              <p className="text-blue-300 text-sm font-medium">
                💡 <span className="font-bold">หมายเหตุ:</span> หวย GLO, BAAC, ออมสิน จะแสดงผลล่าสุดเสมอ ไม่จำกัดวันที่
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LotteryResults
