import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Authenticated API client
const authClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token interceptor
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('memberToken')
  const selector = localStorage.getItem('memberSelector')

  if (token && selector) {
    config.headers.Authorization = `Bearer ${selector}:${token}`
  }

  return config
})

export interface AMBGame {
  gameCode: string
  gameName: string
  imageUrl: string
  thumbnailUrl?: string
  provider: string
  category: string
  isFeatured: boolean
  isActive: boolean
}

export interface AMBGameListResponse {
  success: boolean
  data: {
    productId?: string
    games: AMBGame[]
    total?: number
  }
}

export interface AMBLaunchGameResponse {
  success: boolean
  data: {
    gameUrl: string
    token: string
  }
  message?: string
}

export interface AMBProvider {
  productCode: string
  productName: string
  category: string
}

export interface AMBCategory {
  code: string
  name: string
}

export const ambGameAPI = {
  /**
   * Get games by provider (productId)
   */
  getGamesByProvider: async (provider: string): Promise<AMBGameListResponse> => {
    const response = await authClient.get<AMBGameListResponse>(
      `/member/games/amb/${provider}`
    )
    return response.data
  },

  /**
   * Get games by category
   */
  getGamesByCategory: async (category: string): Promise<AMBGameListResponse> => {
    const response = await authClient.get<AMBGameListResponse>(
      `/member/games/amb/category/${category}`
    )
    return response.data
  },

  /**
   * Launch game - need to implement backend endpoint
   */
  launchGame: async (gameCode: string, provider: string): Promise<AMBLaunchGameResponse> => {
    const response = await authClient.post<AMBLaunchGameResponse>(
      '/member/games/launch',
      {
        gameCode,
        provider,
        platform: 'desktop',
        language: 'th',
      }
    )
    return response.data
  },

  /**
   * Get all providers
   */
  getProviders: async (): Promise<{ success: boolean; data: AMBProvider[] }> => {
    const response = await authClient.get('/member/games/amb/providers')
    return response.data
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<{ success: boolean; data: AMBCategory[] }> => {
    const response = await authClient.get('/member/games/amb/categories')
    return response.data
  },
}

export default ambGameAPI
