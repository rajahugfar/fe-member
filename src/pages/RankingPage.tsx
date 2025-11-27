import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { rankingAPI, RankingPlayer } from '@/api/rankingAPI'
import { useTranslation } from 'react-i18next'

const RankingPage = () => {
  const { t } = useTranslation()
  const { type = 'win', round } = useParams<{ type?: string; round?: string }>()
  const navigate = useNavigate()
  const [rankings, setRankings] = useState<RankingPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [currentRound, setCurrentRound] = useState({
    startDate: '',
    endDate: '',
    endTimestamp: 0
  })
  const [previousRounds, setPreviousRounds] = useState<Array<{ startDate: string; endDate: string; label: string }>>([])
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [showRulesModal, setShowRulesModal] = useState(false)

  // Load rankings data
  useEffect(() => {
    const loadRankings = async () => {
      try {
        setLoading(true)
        // Use mock data for now
        const response = rankingAPI.getMockRankings(type as 'win' | 'credit')
        setRankings(response.data.rankings)
        setCurrentRound(response.data.currentRound)
        setPreviousRounds(response.data.previousRounds)
      } catch (error) {
        console.error('Failed to load rankings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadRankings()
  }, [type, round])

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000)
      const difference = currentRound.endTimestamp - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / 86400),
          hours: Math.floor((difference % 86400) / 3600),
          minutes: Math.floor((difference % 3600) / 60),
          seconds: difference % 60
        })
      }
    }

    if (currentRound.endTimestamp) {
      calculateTimeLeft()
      const timer = setInterval(calculateTimeLeft, 1000)
      return () => clearInterval(timer)
    }
  }, [currentRound.endTimestamp])

  const getRankIcon = (rank: number) => {
    const icons: { [key: number]: string } = {
      1: 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-win-top-01.png',
      2: 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-second-01.png',
      3: 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-third-01.png',
      4: 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-4.png',
      5: 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-5.png',
      6: 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-6.png',
      7: 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-7.png',
      8: 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-8.png',
      9: 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-9.png',
      10: 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-10.png'
    }
    return icons[rank]
  }

  const getRewardIcon = (rank: number) => {
    if (rank === 1) return 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-reward-1.png'
    if (rank === 2) return 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-reward-2.png'
    if (rank === 3) return 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-reward-3.png'
    return 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-reward-4.png'
  }

  const getHighlightIcon = (rank: number) => {
    if (rank === 1) return 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-win-top-02.png'
    if (rank === 2) return 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-win-second-02.png'
    if (rank <= 10) return 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-rank-win-third-02.png'
    return ''
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
      <div className="relative bg-gradient-to-b from-purple-900/50 to-[#0f1419] py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            {/* Logo */}
            <img 
              src="https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ranking-cover-logo.png"
              alt="Ranking Logo"
              className="w-32 h-32 mx-auto mb-6"
            />
            
            {/* Title Image */}
            <div className="relative mb-8">
              <img 
                src="https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ranking-cover-logo-text.png"
                alt="บาคาร่าทัวร์นาเมนต์"
                className="max-w-md mx-auto"
              />
            </div>

            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg px-4 py-3 min-w-[60px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.days.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-white text-sm mt-1">วัน</div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg px-4 py-3 min-w-[60px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-white text-sm mt-1">ชั่วโมง</div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg px-4 py-3 min-w-[60px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-white text-sm mt-1">นาที</div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg px-4 py-3 min-w-[60px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-white text-sm mt-1">วินาที</div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">ยินดีต้อนรับเข้าสู่ บาคาร่าทัวร์นาเมนต์</h1>
            <p className="text-gray-300 mb-6">Event พิเศษ สำหรับสมาชิก และเว็บไซต์ชั้นนำในเครือ</p>
            
            <button 
              onClick={() => setShowRulesModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              เงื่อนไขกติกา
            </button>
          </div>
        </div>
      </div>

      {/* Ranking Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6 overflow-x-auto">
          <button
            onClick={() => navigate('/ranking/win')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition whitespace-nowrap ${
              type === 'win'
                ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <img src="/build/web/ezl-allbet/img/ranking-board-win-ic.png" alt="Win" className="w-10 h-10" />
            <span>คาสิโน <span className="text-sm">ชนะสูงสุด</span></span>
          </button>
          <button
            onClick={() => navigate('/ranking/credit')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition whitespace-nowrap ${
              type === 'credit'
                ? 'bg-gradient-to-b from-green-400 to-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <img src="/build/web/ezl-allbet/img/ranking-board-credit-ic.png" alt="Credit" className="w-10 h-10" />
            <span>คาสิโน <span className="text-sm">เงินได้สูงสุด</span></span>
          </button>
        </div>

        {/* Round Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => navigate(`/ranking/${type}`)}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              !round
                ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span className="hidden md:inline">ผลรอบปัจจุบัน</span>
            <span className="md:hidden">01 - 07 พ.ย.</span>
          </button>
          {previousRounds.map((r, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/ranking/${type}/${r.startDate}_${r.endDate}`)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                round === `${r.startDate}_${r.endDate}`
                  ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span className="hidden md:inline">ผลรอบ {r.label}</span>
              <span className="md:hidden">{r.label}</span>
            </button>
          ))}
        </div>

        {/* Ranking Table Header */}
        <div className="bg-gray-800/50 rounded-t-lg p-4 grid grid-cols-4 gap-4 text-white font-bold text-sm">
          <div>อันดับ</div>
          <div>ยูสเซอร์</div>
          <div className="text-center">(%) ชนะ</div>
          <div className="text-right">รางวัล</div>
        </div>

        {/* Rankings List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {rankings.map((player) => (
              <div
                key={player.rank}
                className={`bg-gray-800/30 rounded-lg p-4 grid grid-cols-4 gap-4 items-center transition hover:bg-gray-800/50 ${
                  player.rank <= 3 ? 'border-2 border-yellow-500/30' : ''
                }`}
              >
                {/* Rank */}
                <div className="flex items-center gap-2">
                  {player.rank <= 10 && getRankIcon(player.rank) ? (
                    <img src={getRankIcon(player.rank)} alt={`Rank ${player.rank}`} className="w-12 h-12" />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">{player.rank}</span>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-2">
                  <img 
                    src={player.profileImage || '/images/sacasino/profile/default.png'}
                    alt={player.username}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/sacasino/profile/default.png'
                    }}
                  />
                  <div>
                    <div className="text-white font-medium text-sm">{player.username}</div>
                    <div className="text-gray-400 text-xs">{player.memberLevel}</div>
                  </div>
                </div>

                {/* Win Rate */}
                <div className="text-center">
                  <div className="text-yellow-400 font-bold text-lg">{player.winRate.toFixed(2)}%</div>
                  <div className="text-gray-400 text-xs">
                    W {player.wins} L {player.losses} ({player.totalGames})
                  </div>
                  <img 
                    src={player.providerLogo}
                    alt={player.provider}
                    className="w-6 h-6 mx-auto mt-1"
                  />
                </div>

                {/* Reward */}
                <div className="flex items-center justify-end gap-2">
                  {getHighlightIcon(player.rank) && (
                    <img src={getHighlightIcon(player.rank)} alt="Highlight" className="w-8 h-8" />
                  )}
                  <img src={getRewardIcon(player.rank)} alt="Reward" className="w-8 h-8" />
                  <span className="text-yellow-400 font-bold text-lg">{player.reward}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowRulesModal(false)}>
          <div className="bg-[#1a1f26] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">กติกาและรางวัล</h3>
              <button onClick={() => setShowRulesModal(false)} className="text-gray-400 hover:text-white text-2xl">
                ×
              </button>
            </div>

            {/* Provider Logos */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {[
                'https://asset.cloudigame.co/build/admin/img/lobby_main/sa-gaming-logo-circle-notext.png',
                'https://asset.cloudigame.co/build/admin/img/lobby_main/sexy-bac-logo-circle-notext.png',
                'https://asset.cloudigame.co/build/admin/img/lobby_main/wm-logo-circle-notext.png',
                'https://asset.cloudigame.co/build/admin/img/lobby_main/dream-gaming-logo-circle-notext.png',
                'https://asset.cloudigame.co/build/admin/img/lobby_main/allbet-logo-circle-notext.png',
                'https://asset.cloudigame.co/build/admin/img/lobby_main/ae-sexy-logo-circle-notext.png',
                'https://asset.cloudigame.co/build/admin/img/lobby_main/asia-gaming-logo-circle-notext.png'
              ].map((logo, idx) => (
                <img key={idx} src={logo} alt="Provider" className="w-16 h-16" />
              ))}
            </div>

            <div className="text-white space-y-4">
              <div>
                <h4 className="text-xl font-bold mb-2 text-yellow-400">เงื่อนไขการเข้าร่วม</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>เดิมพันขั้นต่ำ 100 บาท / บิล (ต่ำกว่า 100 บาท จะไม่นับ)</li>
                  <li>เดิมพัน 300 บิลขึ้นไป</li>
                  <li>หากเดิมพันในรอบบิลนั้นๆ มากกว่า 1 ช่อง จะไม่นับการเดิมพันในตานั้น</li>
                  <li>ระยะเวลากิจกรรม 1 สัปดาห์ วันเสาร์ 00:00 น. - วันศุกร์ 23:59 น.</li>
                  <li>ตัดรอบกิจกรรม ทุกวันศุกร์ เวลา 23.59 น. และ รับรางวัลได้ทุกวันเสาร์ 00.00 น. เป็นต้นไป</li>
                  <li className="text-green-400">เครดิตที่ได้รับจากกิจกรรม สามารถถอนออกได้ทันที ไม่ติดเทิร์นโอเวอร์</li>
                  <li className="text-red-400">ค่าย Pretty Gaming และ Evolution Gaming ไม่ร่วมกิจกรรมนี้</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-yellow-400">รางวัล</h4>
                <div className="space-y-2">
                  {[
                    { rank: 'อันดับ 1', reward: '30K' },
                    { rank: 'อันดับ 2', reward: '10K' },
                    { rank: 'อันดับ 3', reward: '5.5K' },
                    { rank: 'อันดับ 4-10', reward: '3.5K' },
                    { rank: 'อันดับ 11-20', reward: '2K' },
                    { rank: 'อันดับ 21-30', reward: '1K' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
                      <span className="text-gray-300">{item.rank}</span>
                      <span className="text-yellow-400 font-bold">{item.reward}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RankingPage
