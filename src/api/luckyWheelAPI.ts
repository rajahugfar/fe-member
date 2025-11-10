import client from './client'

export interface Prize {
  id: number
  name: string
  type: 'cash' | 'item'
  amount?: number
  itemName?: string
  itemImage?: string
  color: string
  probability: number
}

export interface SpinHistory {
  id: number
  prizeName: string
  prizeType: string
  amount: number
  spunAt: string
}

export interface WheelInfo {
  prizes: Prize[]
  spinCount: number
  maxSpins: number
  canSpin: boolean
  history: SpinHistory[]
}

export interface SpinResult {
  prizeId: number
  prizeName: string
  prizeType: string
  amount: number
  spinCount: number
  maxSpins: number
}

export const luckyWheelAPI = {
  // Get wheel info including prizes, spin count, and history
  getWheelInfo: async (): Promise<WheelInfo> => {
    const response = await client.get('/member/lucky-wheel/info')
    return response.data.data
  },

  // Spin the wheel
  spin: async (): Promise<SpinResult> => {
    const response = await client.post('/member/lucky-wheel/spin')
    return response.data.data
  },

  // Get spin history
  getHistory: async (limit: number = 20): Promise<SpinHistory[]> => {
    const response = await client.get(`/member/lucky-wheel/history?limit=${limit}`)
    return response.data.data
  },
}
