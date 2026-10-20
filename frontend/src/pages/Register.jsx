import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  FaUser, FaEnvelope, FaLock, FaCarCrash, FaArrowLeft,
  FaTools, FaStore, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash,
} from 'react-icons/fa'
import Button from '../components/Button'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [role, setRole] = useState('driver')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'error' })

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: '',
  })

  // ✅ BACKEND ROLES — matches User model enum
  const roles = [
    { id: 'driver', label: 'Driver', icon: <FaUser />, desc: 'Request help' },
    { id: 'mechanic', label: 'Mechanic', icon: <FaTools />, desc: 'Provide service' },
    { id: 'seller', label: 'Seller', icon: <FaStore />, desc: 'Sell products' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setToast({ message: '', type: 'error' })

    // Basic frontend validation
    if (form.phone.length !== 10) {
      setToast({ message: 'Phone must be 10 digits', type: 'error' })
      return
    }
    if (form.password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const user = await register({ ...form, role })
      setToast({
        message: `Welcome, ${user.name.split(' ')[0]}! Account created.`,
        type: 'success',
      })
      setTimeout(() => {
        if (user.role === 'mechanic') navigate('/mechanic')
        else if (user.role === 'seller') navigate('/seller')
        else navigate('/dashboard')
      }, 800)
    } catch (error) {
      const data = error.response?.data
      let message = data?.message || 'Registration failed. Try again.'

      // Handle specific errors
      if (message.toLowerCase().includes('email already')) {
        message = 'Email already registered. Please sign in instead.'
        setTimeout(() => navigate('/login'), 2500)
      } else if (data?.errors?.length) {
        // Validation errors array from express-validator
        message = data.errors.map((e) => e.msg).join(', ')
      }

      setToast({ message, type: 'error' })
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

      <div className="relative max-w-lg mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-ink-400 hover:text-brand-400 mb-8 text-sm transition-colors"
        >
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

          <h1 className="font-display text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-ink-400 text-sm mb-8">Join in less than a minute.</p>

          {/* Role Selection */}
          <label className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-3 block">
            I am a
          </label>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-3 rounded-xl border transition-all text-center ${
                  role === r.id
                    ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className={`text-xl mb-2 ${role === r.id ? 'text-brand-400' : 'text-ink-400'}`}>
                  {r.icon}
                </div>
                <p className="text-xs font-bold">{r.label}</p>
                <p className="text-[10px] text-ink-500 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Subhashree Behera"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-ink-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Phone + City (2 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2 block">
                  Phone
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 text-sm" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                    }
                    placeholder="9876543210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-ink-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2 block">
                  City
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 text-sm" />
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Bangalore"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-ink-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2 block">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-ink-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-brand-400"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-ink-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register