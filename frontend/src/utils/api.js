import axios from 'axios'

// ============ BASE URLS ============
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_BASE = API_BASE.replace('/api', '')

// ============ AXIOS INSTANCE ============
const API = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// ============ REQUEST INTERCEPTOR (attach token) ============
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ============ RESPONSE INTERCEPTOR (handle 401) ============
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ============ IMAGE URL HELPER ============
/**
 * Convert a backend image path to a full URL.
 * - If path is empty → returns ''
 * - If path is already a full URL (starts with http) → returns as-is
 * - Otherwise prepends SERVER_BASE (e.g. http://localhost:5000)
 *
 * Example:
 *   getImageUrl('/uploads/car_tool.png')
 *   → 'http://localhost:5000/uploads/car_tool.png'
 */
export const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${SERVER_BASE}${path.startsWith('/') ? '' : '/'}${path}`
}

// ============ DEFAULT EXPORT ============
export default API