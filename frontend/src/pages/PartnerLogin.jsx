import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  FaArrowLeft, FaEnvelope, FaLock, FaSignInAlt, FaShieldAlt, FaEye, FaEyeSlash,
} from 'react-icons/fa'
import { partnerRoles } from '../data/partnerRoles'

const PartnerLogin = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleId = searchParams.get('role') || 'garage'
  const role = partnerRoles[roleId] || partnerRoles.garage

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm({ email: '', password: '' })
    setErrors({})
  }, [roleId])

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      console.log('Login:', { role: roleId, ...form })
      // Route to correct dashboard based on role
      navigate(roleId === 'garage' ? '/mechanic' : '/mechanic')
    }, 800)
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-ink-50">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/mechanics')}
          className="inline-flex items-center gap-2 text-ink-500 hover:text-brand-600 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Change Partner Type
        </button>

        <div className="bg-white rounded-3xl border border-ink-100 shadow-xl overflow-hidden">
          {/* Header */}
          <div className={`relative p-8 bg-gradient-to-br ${role.color} text-white overflow-hidden`}>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl mb-4">
                {role.icon}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">
                Welcome back
              </p>
              <h1 className="font-display text-2xl font-bold">{role.name} Login</h1>
              <p className="text-white/90 text-sm mt-1">{role.tagline}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-ink-700 mb-2 block uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: null })
                  }}
                  placeholder="you@example.com"
                  className={`w-full border rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none transition-all ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                      : 'border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  className={`text-xs font-semibold ${role.textColor} hover:underline`}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value })
                    if (errors.password) setErrors({ ...errors, password: null })
                  }}
                  placeholder="••••••••"
                  className={`w-full border rounded-xl pl-11 pr-12 py-3.5 text-sm focus:outline-none transition-all ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                      : 'border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink-400 hover:text-brand-600 transition-colors"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-br ${role.color} text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <FaSignInAlt /> Sign In
                </>
              )}
            </button>

            <p className="text-center text-sm text-ink-500">
              New partner?{' '}
              <Link
                to={`/partner/register?role=${roleId}`}
                className={`font-semibold ${role.textColor} hover:underline`}
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PartnerLogin