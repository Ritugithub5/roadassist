import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaEnvelope, FaLock, FaCarCrash, FaArrowLeft } from 'react-icons/fa'
import Button from '../components/Button'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'error' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setToast({ message: '', type: 'error' })
    setLoading(true)

    try {
      const user = await login(form.email, form.password)
      setToast({ message: `Welcome back, ${user.name.split(' ')[0]}!`, type: 'success' })

      // ✅ Role-based redirect
      setTimeout(() => {
        switch (user.role) {
          case 'admin':
            navigate('/admin')
            break
          case 'mechanic':
            navigate('/mechanic')
            break
          case 'seller':
            navigate('/seller')
            break
          default:
            navigate('/dashboard')
        }
      }, 600)
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Try again.'

      if (message.toLowerCase().includes('invalid credentials')) {
        setToast({ message: 'No account found. Please register first.', type: 'error' })
        setTimeout(() => navigate('/register'), 2500)
      } else {
        setToast({ message, type: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative pt-28 pb-16 px-6 bg-ink-900 text-white overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-20 -left-20 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-3xl" />

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'error' })} />

      <div className="relative max-w-md mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-ink-400 hover:text-brand-400 mb-8 text-sm transition-colors">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="glass-dark rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <FaCarCrash className="text-white text-xl" />
            </div>
            <span className="font-display text-2xl font-bold">
              Road<span className="gradient-text">Assist</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-ink-400 text-sm mb-8">Sign in to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2 block">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-ink-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2 block">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-14 py-3.5 text-white placeholder-ink-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-400 hover:text-brand-400 font-semibold"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
                Forgot password?
              </a>
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : 'Sign In'}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-ink-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-center text-sm text-ink-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login