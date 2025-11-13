import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@api/authAPI'
import type { User, LoginCredentials, RegisterData } from '@/types/auth'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authAPI.login(credentials)

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ',
            isLoading: false,
          })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authAPI.register(data)

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ',
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        const { accessToken } = get()
        if (accessToken) {
          authAPI.logout().catch(() => {})
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        })
      },

      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get()
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const response = await authAPI.refreshToken(refreshToken)
          set({
            accessToken: response.accessToken,
          })
        } catch (error) {
          // If refresh fails, logout user
          get().logout()
          throw error
        }
      },

      refreshUser: async () => {
        try {
          const { isAuthenticated } = get()
          if (!isAuthenticated) return

          const response = await authAPI.getProfile()

          // Debug log to see response structure
          console.log('[refreshUser] Response:', response)

          // Handle different response structures
          let userData = null
          if (response.data?.member) {
            userData = response.data.member
          } else if (response.data?.user) {
            userData = response.data.user
          } else if (response.data) {
            userData = response.data
          } else if (response.member) {
            userData = response.member
          } else if (response.user) {
            userData = response.user
          }

          console.log('[refreshUser] Parsed userData:', userData)

          if (userData) {
            set((state) => ({
              user: { ...state.user, ...userData }, // Always merge to preserve other fields
            }))
            console.log('[refreshUser] User updated with credit:', userData.credit)
          }
        } catch (error) {
          console.error('[refreshUser] Failed to refresh user data:', error)
          // Don't logout on refresh failure, just log the error
        }
      },

      clearError: () => set({ error: null }),

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
