import { useState } from 'react'
import { FaTimes, FaExclamationTriangle, FaSpinner, FaCheck } from 'react-icons/fa'
import Toast from './Toast'
import API from '../utils/api'

const categories = [
  'Late Arrival',
  'Overcharging',
  'Poor Service',
  'Behaviour',
  'Wrong Item',
  'Payment Issue',
  'Property Damage',
  'Billing',
  'Other',
]

const priorities = ['Low', 'Medium', 'High', 'Critical']

const RaiseDisputeModal = ({ open, onClose, service, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Late Arrival',
    priority: 'Medium',
  })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'error' })

  if (!open || !service) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      setToast({ message: 'Please fill title and description', type: 'error' })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        against: service.mechanic?._id || service.mechanic,
        relatedService: service._id,
        jobId: service.requestId,
        amount: service.total || 0,
      }

      await API.post('/disputes', payload)
      setToast({ message: 'Dispute raised successfully', type: 'success' })
      onSuccess?.()
      setTimeout(() => {
        onClose?.()
        setForm({ title: '', description: '', category: 'Late Arrival', priority: 'Medium' })
      }, 800)
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to raise dispute',
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-warm-900/60 backdrop-blur-sm z-[80]"
      />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg pointer-events-auto my-8">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: 'error' })}
          />

          {/* Header */}
          <div className="bg-gradient-to-br from-red-500 to-orange-500 p-6 text-white rounded-t-3xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <FaExclamationTriangle />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Raise a Dispute</h2>
                  <p className="text-xs opacity-90">
                    Report an issue with your service
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Related service info */}
            {service.mechanic && (
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <p className="text-[10px] font-bold uppercase text-warm-700 mb-1">
                  Regarding
                </p>
                <p className="text-sm font-semibold text-warm-900">
                  {service.serviceType || service.service} • {service.requestId}
                </p>
                <p className="text-xs text-warm-700 mt-0.5">
                  Against: {service.mechanic?.name || 'Mechanic'}
                </p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-warm-700 uppercase tracking-wider mb-2 block">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Mechanic arrived 45 minutes late"
                className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            {/* Category + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-warm-700 uppercase tracking-wider mb-2 block">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-cream-200 rounded-xl px-3 py-3 text-sm text-warm-900 focus:outline-none focus:border-amber-400 bg-white cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-warm-700 uppercase tracking-wider mb-2 block">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full border border-cream-200 rounded-xl px-3 py-3 text-sm text-warm-900 focus:outline-none focus:border-amber-400 bg-white cursor-pointer"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-warm-700 uppercase tracking-wider mb-2 block">
                Describe the issue *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Explain what went wrong in detail..."
                rows={4}
                className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 resize-none"
              />
            </div>

            {/* Info banner */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
              <FaExclamationTriangle className="text-amber-600 text-xs mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Our team will review your dispute within 24 hours. False disputes
                may result in account suspension.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border-2 border-cream-200 text-warm-700 font-semibold hover:border-cream-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <FaCheck /> Raise Dispute
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default RaiseDisputeModal