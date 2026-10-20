import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaSpinner, FaCheckCircle, FaArrowUp,
  FaExclamationTriangle, FaClock, FaBalanceScale,
} from 'react-icons/fa'
import Toast from '../components/Toast'
import API from '../utils/api'

const statusStyle = (s) => {
  if (s === 'Open') return 'bg-red-50 text-red-600 border-red-100'
  if (s === 'In Progress') return 'bg-amber-50 text-amber-700 border-amber-100'
  if (s === 'Resolved') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (s === 'Escalated') return 'bg-purple-50 text-purple-700 border-purple-100'
  return 'bg-cream-100 text-warm-700 border-cream-200'
}

const priorityStyle = (p) => {
  if (p === 'Critical') return 'bg-red-50 text-red-700 border-red-200'
  if (p === 'High') return 'bg-orange-50 text-orange-700 border-orange-200'
  if (p === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-blue-50 text-blue-700 border-blue-200'
}

const MyDisputes = () => {
  const navigate = useNavigate()
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: '', type: 'error' })

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        setLoading(true)
        const { data } = await API.get('/disputes/my')
        setDisputes(data.data || [])
      } catch (error) {
        console.error('Fetch disputes error:', error)
        setToast({
          message: error.response?.data?.message || 'Failed to load disputes',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchDisputes()
  }, [])

  const timeAgo = (date) => {
    if (!date) return ''
    const s = Math.floor((Date.now() - new Date(date)) / 1000)
    if (s < 60) return `${s}s ago`
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`
    return `${Math.floor(s / 86400)}d ago`
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />

      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-3">
            <FaBalanceScale className="text-amber-700 text-xs" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
              Disputes
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-1">
            My Disputes
          </h1>
          <p className="text-sm text-warm-700">
            {disputes.length} dispute{disputes.length !== 1 ? 's' : ''} raised by you
          </p>
        </div>

        {/* Stats */}
        {disputes.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'Open',
                value: disputes.filter((d) => d.status === 'Open').length,
                color: 'from-red-500 to-red-600',
                icon: <FaExclamationTriangle />,
              },
              {
                label: 'In Progress',
                value: disputes.filter((d) => d.status === 'In Progress').length,
                color: 'from-amber-500 to-orange-500',
                icon: <FaClock />,
              },
              {
                label: 'Resolved',
                value: disputes.filter((d) => d.status === 'Resolved').length,
                color: 'from-emerald-500 to-emerald-600',
                icon: <FaCheckCircle />,
              },
              {
                label: 'Escalated',
                value: disputes.filter((d) => d.escalated).length,
                color: 'from-purple-500 to-purple-600',
                icon: <FaArrowUp />,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl border border-amber-100 p-5 overflow-hidden group"
              >
                <div
                  className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${s.color} opacity-10 rounded-full blur-2xl`}
                />
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg shadow-md mb-3`}
                  >
                    {s.icon}
                  </div>
                  <p className="font-display text-2xl font-bold text-warm-900 mb-0.5">
                    {s.value}
                  </p>
                  <p className="text-xs text-warm-700 font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-amber-100 p-12 text-center">
            <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
            <p className="text-warm-700">Loading disputes...</p>
          </div>
        ) : disputes.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-amber-200 p-12 md:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-3xl mb-6 shadow-lg shadow-emerald-500/30">
              <FaCheckCircle />
            </div>
            <h2 className="font-display text-2xl font-bold text-warm-900 mb-2">
              No disputes — that's great! 🎉
            </h2>
            <p className="text-warm-700 mb-8 max-w-md mx-auto">
              You haven't raised any disputes. If something goes wrong with a
              service, you can raise a dispute from your service history.
            </p>
            <button
              onClick={() => navigate('/history')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              View Service History
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((d) => (
              <div
                key={d._id}
                className="bg-white rounded-2xl border border-amber-100 p-5 hover:border-amber-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-warm-700">
                        {d.disputeId || 'DSP-' + d._id.slice(-4)}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusStyle(
                          d.status
                        )}`}
                      >
                        {d.status}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${priorityStyle(
                          d.priority
                        )}`}
                      >
                        {d.priority}
                      </span>
                      {d.escalated && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[9px] font-bold uppercase">
                          <FaArrowUp className="text-[7px]" /> Escalated
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-warm-900 text-base mb-1">
                      {d.title}
                    </p>
                    <p className="text-xs text-warm-700 mb-2 line-clamp-2">
                      {d.description}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-warm-700 pt-3 border-t border-cream-200">
                  <span>
                    <strong className="text-warm-800">Against:</strong>{' '}
                    {d.against?.name || '—'}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-warm-800">Category:</strong>{' '}
                    {d.category}
                  </span>
                  <span>•</span>
                  <span>{timeAgo(d.createdAt)}</span>
                  {d.amount > 0 && (
                    <>
                      <span>•</span>
                      <span>
                        <strong className="text-warm-800">Amount:</strong> ₹{d.amount}
                      </span>
                    </>
                  )}
                </div>

                {/* Resolution */}
                {d.resolution && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2">
                    <FaCheckCircle className="text-emerald-600 text-xs mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-emerald-800 mb-0.5">
                        Resolution
                      </p>
                      <p className="text-xs text-emerald-900">{d.resolution}</p>
                    </div>
                  </div>
                )}

                {/* Messages count */}
                {d.messages?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-cream-200 text-[11px] text-warm-700">
                    💬 {d.messages.length} message{d.messages.length !== 1 ? 's' : ''} exchanged
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyDisputes