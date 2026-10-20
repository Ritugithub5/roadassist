import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  FaArrowLeft, FaCheck, FaShieldAlt, FaEye, FaEyeSlash, FaUserPlus,
} from 'react-icons/fa'
import { partnerRoles } from '../data/partnerRoles'

const PartnerRegister = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleId = searchParams.get('role') || 'garage'
  const role = partnerRoles[roleId] || partnerRoles.garage

  const [form, setForm] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  // Reset form when role changes
  useEffect(() => {
    const initial = {}
    role.registerFields.forEach((f) => {
      initial[f.name] = f.type === 'select' ? f.options[0] : ''
    })
    setForm(initial)
    setErrors({})
    setSubmitted(false)
  }, [roleId])

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value })
    if (errors[field]) setErrors({ ...errors, [field]: null })
  }

  const validate = () => {
    const e = {}
    role.registerFields.forEach((f) => {
      if (f.required && !form[f.name]?.toString().trim()) {
        e[f.name] = `${f.label} is required`
      }
    })
    if (form.password && form.password.length < 6) {
      e.password = 'Password must be at least 6 characters'
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      e.phone = 'Enter a valid 10-digit phone number'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    console.log('Register:', { role: roleId, ...form })
    setSubmitted(true)
  }

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-6 bg-ink-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-ink-100 shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl mb-6 shadow-lg shadow-emerald-500/30">
            <FaCheck />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-sm text-ink-500 mb-6">
            Welcome aboard, {role.name}. Our team will verify your details within 24 hours.
          </p>

          <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 text-left mb-6">
            <p className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
              Reference ID
            </p>
            <p className="font-mono font-bold text-brand-700">
              {roleId.toUpperCase()}-{Math.floor(100000 + Math.random() * 900000)}
            </p>
          </div>

          <button
            onClick={() => navigate(`/partner/login?role=${roleId}`)}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold shadow-lg shadow-brand-500/30 hover:shadow-xl transition-all"
          >
            Continue to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-ink-50">
      <div className="max-w-2xl mx-auto">
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
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
                  {role.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-90">
                    Register as
                  </p>
                  <h1 className="font-display text-2xl font-bold">{role.name}</h1>
                </div>
              </div>
              <p className="text-white/90 text-sm">{role.tagline}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {role.registerFields.map((field) => (
              <div key={field.name}>
                <label className="text-xs font-semibold text-ink-700 mb-2 block uppercase tracking-wider">
                  {field.label} {field.required && '*'}
                </label>

                {field.type === 'select' ? (
                  <select
                    value={form[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all bg-white cursor-pointer ${
                      errors[field.name]
                        ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                        : 'border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                    }`}
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'password' ? (
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none transition-all ${
                        errors[field.name]
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
                ) : (
                  <input
                    type={field.type}
                    value={form[field.name] || ''}
                    onChange={(e) =>
                      handleChange(
                        field.name,
                        field.type === 'tel' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value
                      )
                    }
                    placeholder={field.placeholder}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                      errors[field.name]
                        ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                        : 'border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                    }`}
                  />
                )}

                {errors[field.name] && (
                  <p className="text-xs text-red-500 mt-1.5">{errors[field.name]}</p>
                )}
              </div>
            ))}

            

            {/* Submit */}
            <button
              type="submit"
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-br ${role.color} text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 mt-6`}
            >
              <FaUserPlus /> Create {role.name} Account
            </button>

            <p className="text-center text-sm text-ink-500 pt-2">
              Already registered?{' '}
              <Link
                to={`/partner/login?role=${roleId}`}
                className={`font-semibold ${role.textColor} hover:underline`}
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PartnerRegister