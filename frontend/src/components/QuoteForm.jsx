import { useState } from 'react'
import {
  FaUser, FaPhone, FaEnvelope, FaCar, FaCheckCircle, FaArrowRight, FaSpinner,
} from 'react-icons/fa'
import API from '../utils/api'

const QuoteForm = ({ preselectedPlan }) => {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [quoteResult, setQuoteResult] = useState(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    brand: '',
    model: '',
    regNumber: '',
    plan: preselectedPlan || 'any',
  })

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const { data } = await API.post('/insurance/quotes', form)
      setQuoteResult(data.data)
      setSubmitted(true)
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to submit. Please try again.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // ============ SUCCESS SCREEN ============
  if (submitted && quoteResult) {
    return (
      <div className="bg-white rounded-3xl border border-ink-100 shadow-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl mb-6 shadow-lg shadow-emerald-500/30">
          <FaCheckCircle />
        </div>
        <h3 className="font-display text-2xl font-bold text-ink-900 mb-2">
          Quote Requested!
        </h3>
        <p className="text-ink-500 mb-6 text-sm">
          Our insurance team will call you within 15 minutes at{' '}
          <strong className="text-ink-900">{quoteResult.phone}</strong> with the best
          plans for your vehicle.
        </p>

        <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 text-left mb-4">
          <p className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
            Reference ID
          </p>
          <p className="font-mono font-bold text-brand-700 text-lg">
            {quoteResult.quoteId}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-cream-50 border border-cream-200 text-left">
          <p className="text-xs font-bold text-warm-700 uppercase tracking-wider mb-3">
            Saved Details
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-warm-700">Name</span>
              <span className="font-semibold text-warm-900">{quoteResult.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-700">Plan</span>
              <span className="font-semibold text-warm-900 capitalize">
                {quoteResult.plan.replace('-', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-700">Status</span>
              <span className="font-semibold text-emerald-600">
                {quoteResult.status}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setSubmitted(false)
            setQuoteResult(null)
            setForm({
              name: '',
              phone: '',
              email: '',
              brand: '',
              model: '',
              regNumber: '',
              plan: 'any',
            })
          }}
          className="mt-5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Submit Another Quote →
        </button>
      </div>
    )
  }

  // ============ FORM ============
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-ink-100 shadow-xl p-6 md:p-8"
    >
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          Free Quote
        </div>
        <h3 className="font-display text-2xl font-bold text-ink-900 mb-1">
          Get a Free Quote
        </h3>
        <p className="text-sm text-ink-500">
          Fill in the details — we'll find the best plans for you.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
          <span className="font-bold">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-ink-700 mb-2 block">
            Full Name *
          </label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm" />
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              className="w-full border border-ink-200 rounded-xl pl-11 pr-4 py-3 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold text-ink-700 mb-2 block">
            Mobile Number *
          </label>
          <div className="relative">
            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm" />
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) =>
                handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              placeholder="9876543210"
              maxLength={10}
              className="w-full border border-ink-200 rounded-xl pl-11 pr-4 py-3 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-ink-700 mb-2 block">
            Email <span className="text-ink-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-ink-200 rounded-xl pl-11 pr-4 py-3 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
            />
          </div>
        </div>

        {/* Brand + Model */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-700 mb-2 block">
              Vehicle Brand
            </label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              placeholder="e.g. Hyundai"
              className="w-full border border-ink-200 rounded-xl px-4 py-3 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-700 mb-2 block">
              Model
            </label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="e.g. Creta"
              className="w-full border border-ink-200 rounded-xl px-4 py-3 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm"
            />
          </div>
        </div>

        {/* Reg Number */}
        <div>
          <label className="text-xs font-semibold text-ink-700 mb-2 block">
            Registration Number
          </label>
          <div className="relative">
            <FaCar className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm" />
            <input
              type="text"
              value={form.regNumber}
              onChange={(e) =>
                handleChange('regNumber', e.target.value.toUpperCase())
              }
              placeholder="DL10AB1234"
              className="w-full border border-ink-200 rounded-xl pl-11 pr-4 py-3 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-mono"
            />
          </div>
        </div>

        {/* Plan */}
        <div>
          <label className="text-xs font-semibold text-ink-700 mb-2 block">
            Interested Plan
          </label>
          <select
            value={form.plan}
            onChange={(e) => handleChange('plan', e.target.value)}
            className="w-full border border-ink-200 rounded-xl px-4 py-3 text-ink-900 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all cursor-pointer bg-white"
          >
            <option value="any">Any / Not sure yet</option>
            <option value="third-party">Third-Party (₹2,094+)</option>
            <option value="comprehensive">Comprehensive (₹5,678+)</option>
            <option value="premium">Premium Care (₹9,999+)</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full mt-6 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {submitting ? (
          <>
            <FaSpinner className="animate-spin" /> Submitting...
          </>
        ) : (
          <>
            Request Free Quote <FaArrowRight />
          </>
        )}
      </button>

      <p className="text-[11px] text-center text-ink-400 mt-4">
        🔒 Your data is secure. No spam, ever.
      </p>
    </form>
  )
}

export default QuoteForm