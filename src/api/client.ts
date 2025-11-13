import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/api/v1'

export const apiClient = axios.create({
  baseURL: `${API_URL}${API_BASE_PATH}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Try multiple token sources for compatibility (same as memberAPIClient)
    const { accessToken } = useAuthStore.getState()
    const token = accessToken ||
                  localStorage.getItem('memberToken') ||
                  localStorage.getItem('token') ||
                  JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.accessToken

    // Debug: Log token status
    if (import.meta.env.DEV) {
      console.log('[API Request]', config.url, {
        hasToken: !!token,
        tokenSource: accessToken ? 'zustand' : 'localStorage',
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
      })
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        await useAuthStore.getState().refreshAccessToken()

        // Retry original request with new token
        const { accessToken } = useAuthStore.getState()
        if (originalRequest.headers && accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout user
        useAuthStore.getState().logout()
        toast.error('กรุณาเข้าสู่ระบบอีกครั้ง')
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'

    // Don't show toast for specific error codes (let component handle it)
    const silentErrorCodes = [400, 404, 422]
    if (!silentErrorCodes.includes(error.response?.status || 0)) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

// Helper function to get full image URL
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return ''
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // If starts with /, remove it to avoid double slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  return `${API_URL}/${cleanPath}`
}

export default apiClient
