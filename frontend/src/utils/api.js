import axios from 'axios'

// ============ BASE URLS ============
// In production (Render), we use the relative path '/api' because the frontend and backend are on the same URL.
// In development (localhost), we use the environment variable or default to localhost:5000.
const API_BASE = import.meta.env.PROD 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')

const SERVER_BASE = import.meta.env.PROD 
  ? '' 
  : API_BASE.replace('/api', '')

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
export const getImageUrl = (path) => {
  if (!path) return ''
  
  // 1. If it's already an external URL, return it
  if (path.startsWith('http')) return path
  
  // 2. In production, both are on the same domain, just return the path
  if (import.meta.env.PROD) {
    return path
  }
  
  // 3. In development (localhost), point to the local backend
  return `${SERVER_BASE}${path.startsWith('/') ? '' : '/'}${path}`
}

// ============ DEFAULT EXPORT ============
export default API