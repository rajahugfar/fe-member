import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface RankingPlayer {
  rank: number
  username: string
  phone: string
  memberLevel: string
  winRate: number
  wins: number
  losses: number
  totalGames: number
  provider: string
  providerLogo: string
  reward: string
  profileImage?: string
}

export interface RankingResponse {
  success: boolean
  data: {
    rankings: RankingPlayer[]
    currentRound: {
      startDate: string
      endDate: string
      endTimestamp: number
    }
    previousRounds: Array<{
      startDate: string
      endDate: string
      label: string
    }>
  }
  message?: string
}

export const rankingAPI = {
  // Get ranking by type (win or credit)
  getRankings: async (type: 'win' | 'credit', round?: string): Promise<RankingResponse> => {
    try {
      const params = new URLSearchParams()
      params.append('type', type)
      if (round) {
        params.append('round', round)
      }

      const response = await axios.get(`${API_BASE_URL}/api/public/rankings?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch rankings:', error)
      throw error
    }
  },

  // Get mock data for development
  getMockRankings: (type: 'win' | 'credit'): RankingResponse => {
    const mockPlayers: RankingPlayer[] = [
      {
        rank: 1,
        username: 'Ny****',
        phone: '0981234567',
        memberLevel: 'Vip',
        winRate: 55.48,
        wins: 314,
        losses: 252,
        totalGames: 566,
        provider: 'SA Gaming',
        providerLogo: 'https://asset.cloudigame.co/build/admin/img/lobby_main/sa-gaming-logo-circle-notext.png',
        reward: '30K',
        profileImage: 'https://allbet.fun/media/cache/strip/202206/block/502fa1cedd7ddf6c076b94be119c5d7f.png'
      },
      {
        rank: 2,
        username: 'ReneRe****',
        phone: '0982345678',
        memberLevel: 'Vip',
        winRate: 54.91,
        wins: 218,
        losses: 179,
        totalGames: 397,
        provider: 'SA Gaming',
        providerLogo: 'https://asset.cloudigame.co/build/admin/img/lobby_main/sa-gaming-logo-circle-notext.png',
        reward: '10K',
        profileImage: 'https://allbet.fun/media/cache/strip/202206/block/502fa1cedd7ddf6c076b94be119c5d7f.png'
      },
      {
        rank: 3,
        username: 'Nupo****',
        phone: '0983456789',
        memberLevel: 'Platinum',
        winRate: 54.87,
        wins: 197,
        losses: 162,
        totalGames: 359,
        provider: 'SA Gaming',
        providerLogo: 'https://asset.cloudigame.co/build/admin/img/lobby_main/sa-gaming-logo-circle-notext.png',
        reward: '5.5K',
        profileImage: 'https://allbet.fun/media/cache/strip/202206/block/007676b8353897259ee202b88ea88b53.png'
      },
      {
        rank: 4,
        username: 'Jtkpea****',
        phone: '0984567890',
        memberLevel: 'Vip',
        winRate: 54.83,
        wins: 176,
        losses: 145,
        totalGames: 321,
        provider: 'AE Sexy',
        providerLogo: 'https://asset.cloudigame.co/build/admin/img/lobby_main/wt-aesexy-logo-circle-notext.png',
        reward: '3.5K',
        profileImage: 'https://allbet.fun/media/cache/strip/202206/block/502fa1cedd7ddf6c076b94be119c5d7f.png'
      },
      {
        rank: 5,
        username: 'Praew****',
        phone: '0985678901',
        memberLevel: 'Gold',
        winRate: 54.49,
        wins: 267,
        losses: 223,
        totalGames: 490,
        provider: 'AE Sexy',
        providerLogo: 'https://asset.cloudigame.co/build/admin/img/lobby_main/wt-aesexy-logo-circle-notext.png',
        reward: '3.5K',
        profileImage: 'https://allbet.fun/media/cache/strip/202206/block/155498d2c00648afdef2a59787ccbc5b.png'
      },
      {
        rank: 6,
        username: 'Phisi****',
        phone: '0986789012',
        memberLevel: 'Gold',
        winRate: 54.27,
        wins: 273,
        losses: 230,
        totalGames: 503,
        provider: 'SA Gaming',
        providerLogo: 'https://asset.cloudigame.co/build/admin/img/lobby_main/sa-gaming-logo-circle-notext.png',
        reward: '3.5K',
        profileImage: 'https://allbet.fun/media/cache/strip/202206/block/155498d2c00648afdef2a59787ccbc5b.png'
      },
      {
        rank: 7,
        username: 'Richbo****',
        phone: '0987890123',
        memberLevel: 'Vip',
        winRate: 54.20,
        wins: 200,
        losses: 169,
        totalGames: 369,
        provider: 'SA Gaming',
        providerLogo: 'https://asset.cloudigame.co/build/admin/img/lobby_main/sa-gaming-logo-circle-notext.png',
        reward: '3.5K',
        profileImage: '/images/sacasino/profile/vip.png'
      },
      {
        rank: 8,
        username: 'Na****',
        phone: '0988901234',
        memberLevel: 'Vip',
        winRate: 53.90,
        wins: 228,
        losses: 195,
        totalGames: 423,
        provider: 'Dream Gaming',
        providerLogo: 'https://asset.cloudigame.co/build/admin/img/lobby_main/wt-dg-v2-logo-circle-notext.png',
        reward: '3.5K',
        profileImage: '/images/sacasino/profile/vip.png'
      },
      {
        rank: 9,
        username: 'Pam****',
        phone: '0989012345',
        memberLevel: 'Vip',
        winRate: 53.80,
        wins: 184,
        losses: 158,
        totalGames: 342,
        provider: 'SA Gaming',
        providerLogo: 'https://asset.cloudigame.co/build/admin/img/lobby_main/sa-gaming-logo-circle-notext.png',
        reward: '3.5K',
        profileImage: '/images/sacasino/profile/vip.png'
      },
      {
        rank: 10,
        username: 'RPaonoii****',
        phone: '0980123456',
        memberLevel: 'Vip',
        winRate: 53.77,
        wins: 171,
        losses: 147,
        totalGames: 318,
        provider: 'SA Gaming',
        providerLogo: 'https://asset.cloudigame.co/build/admin/img/lobby_main/sa-gaming-logo-circle-notext.png',
        reward: '3.5K',
        profileImage: '/images/sacasino/profile/vip.png'
      }
    ]

    // Add more players for ranks 11-30
    for (let i = 11; i <= 30; i++) {
      mockPlayers.push({
        rank: i,
        username: `Player${i}****`,
        phone: `098${i.toString().padStart(7, '0')}`,
        memberLevel: i <= 20 ? 'Gold' : 'Silver',
        winRate: 53.5 - (i - 10) * 0.1,
        wins: 150 - i,
        losses: 130 - i,
        totalGames: 280 - i * 2,
        provider: ['SA Gaming', 'WM Casino', 'AE Sexy', 'Dream Gaming'][i % 4],
        providerLogo: [
          'https://asset.cloudigame.co/build/admin/img/lobby_main/sa-gaming-logo-circle-notext.png',
          'https://asset.cloudigame.co/build/admin/img/lobby_main/wm-logo-circle-notext.png',
          'https://asset.cloudigame.co/build/admin/img/lobby_main/wt-aesexy-logo-circle-notext.png',
          'https://asset.cloudigame.co/build/admin/img/lobby_main/wt-dg-v2-logo-circle-notext.png'
        ][i % 4],
        reward: i <= 20 ? '2K' : '1K',
        profileImage: 'https://allbet.fun/media/cache/strip/202206/block/502fa1cedd7ddf6c076b94be119c5d7f.png'
      })
    }

    return {
      success: true,
      data: {
        rankings: mockPlayers,
        currentRound: {
          startDate: '2025-11-01',
          endDate: '2025-11-07',
          endTimestamp: 1762534800
        },
        previousRounds: [
          {
            startDate: '2025-10-25',
            endDate: '2025-10-31',
            label: '25 - 31 ต.ค.'
          },
          {
            startDate: '2025-10-18',
            endDate: '2025-10-24',
            label: '18 - 24 ต.ค.'
          }
        ]
      }
    }
  }
}
