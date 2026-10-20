import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaSearch, FaExclamationTriangle,
  FaEye, FaCheckCircle, FaTimes, FaArrowUp,
  FaUser, FaUserTie, FaStore, FaCar, FaBalanceScale,
  FaPaperPlane, FaHourglassHalf, FaRedo, FaSpinner,
} from 'react-icons/fa'
import Toast from '../components/Toast'
import API from '../utils/api'

const priorityStyle = (p) => {
  if (p === 'Critical') return 'bg-red-50 text-red-700 border-red-200'
  if (p === 'High') return 'bg-orange-50 text-orange-700 border-orange-200'
  if (p === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-blue-50 text-blue-700 border-blue-200'
}

const statusStyle = (s) => {
  if (s === 'Open') return 'bg-red-50 text-red-600 border-red-100'
  if (s === 'In Progress') return 'bg-amber-50 text-amber-700 border-amber-100'
  if (s === 'Resolved') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (s === 'Escalated') return 'bg-purple-50 text-purple-700 border-purple-100'
  return 'bg-cream-100 text-warm-700 border-cream-200'
}

const roleIcon = (role) => {
  if (role === 'driver') return <FaCar />
  if (role === 'mechanic') return <FaUserTie />
  if (role === 'seller') return <FaStore />
  return <FaUser />
}

const AdminDisputes = () => {
  const navigate = useNavigate()
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: '', type: 'error' })
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  // ============ FETCH ============
  const fetchDisputes = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/admin/disputes')
      setDisputes(data.data || [])
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to load disputes',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  // Refresh a single dispute inside the drawer
  const refreshSelected = async (id) => {
    try {
      const { data } = await API.get(`/admin/disputes`)
      const fresh = data.data.find((d) => d._id === id)
      if (fresh) setSelected(fresh)
      setDisputes(data.data)
    } catch (e) {
      // silent
    }
  }

  useEffect(() => {
    fetchDisputes()
  }, [])

  // ============ STATS ============
  const stats = useMemo(() => {
    return [
      {
        id: 'open',
        label: 'Open Disputes',
        value: disputes.filter((d) => d.status === 'Open').length,
        icon: '⚠️',
        color: 'from-red-500 to-red-600',
      },
      {
        id: 'progress',
        label: 'In Progress',
        value: disputes.filter((d) => d.status === 'In Progress').length,
        icon: '⏳',
        color: 'from-amber-500 to-orange-500',
      },
      {
        id: 'resolved',
        label: 'Resolved',
        value: disputes.filter((d) => d.status === 'Resolved').length,
        icon: '✅',
        color: 'from-emerald-500 to-emerald-600',
      },
      {
        id: 'escalated',
        label: 'Escalated',
        value: disputes.filter((d) => d.escalated || d.status === 'Escalated').length,
        icon: '🚨',
        color: 'from-purple-500 to-purple-600',
      },
    ]
  }, [disputes])

  const priorityFilters = ['All', 'Critical', 'High', 'Medium', 'Low']
  const statusFilters = ['All', 'Open', 'In Progress', 'Resolved', 'Escalated']

  // ============ FILTER ============
  const filtered = useMemo(() => {
    return disputes.filter((d) => {
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        d.disputeId?.toLowerCase().includes(q) ||
        d.title?.toLowerCase().includes(q) ||
        d.category?.toLowerCase().includes(q) ||
        d.raisedBy?.name?.toLowerCase().includes(q)
      const matchPriority = priorityFilter === 'All' || d.priority === priorityFilter
      const matchStatus = statusFilter === 'All' || d.status === statusFilter
      return matchSearch && matchPriority && matchStatus
    })
  }, [disputes, search, priorityFilter, statusFilter])

  // ============ ACTIONS ============
  const handleView = (d) => {
    setSelected(d)
    setDrawerOpen(true)
    setReplyText('')
  }

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/admin/disputes/${id}`, { status })
      setDisputes((prev) =>
        prev.map((d) => (d._id === id ? { ...d, status } : d))
      )
      setToast({ message: `Dispute marked as ${status}`, type: 'success' })
      if (selected?._id === id) setSelected({ ...selected, status })
    } catch (error) {
      setToast({ message: 'Failed to update', type: 'error' })
    }
  }

  const handleEscalate = async (id) => {
    try {
      await API.put(`/admin/disputes/${id}`, {
        escalated: true,
        status: 'Escalated',
      })
      setDisputes((prev) =>
        prev.map((d) =>
          d._id === id ? { ...d, escalated: true, status: 'Escalated' } : d
        )
      )
      setToast({ message: 'Dispute escalated', type: 'success' })
      if (selected?._id === id)
        setSelected({ ...selected, escalated: true, status: 'Escalated' })
    } catch (error) {
      setToast({ message: 'Failed to escalate', type: 'error' })
    }
  }

  // ✅ NEW: uses dedicated /disputes/:id/messages endpoint
  const handleSendReply = async () => {
    if (!replyText.trim() || !selected) return
    setSending(true)
    try {
      await API.post(`/disputes/${selected._id}/messages`, {
        text: replyText.trim(),
      })
      setToast({ message: 'Reply sent', type: 'success' })
      setReplyText('')
      await refreshSelected(selected._id)
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to send reply',
        type: 'error',
      })
    } finally {
      setSending(false)
    }
  }

  // ✅ NEW: Resolve with resolution text
  const handleResolve = async (id) => {
    const resolution = window.prompt('Enter resolution note (visible to both parties):')
    if (resolution === null) return // cancelled
    try {
      await API.put(`/admin/disputes/${id}`, {
        status: 'Resolved',
        resolution: resolution || 'Resolved by admin.',
      })
      setToast({ message: 'Dispute resolved', type: 'success' })
      if (selected?._id === id)
        setSelected({
          ...selected,
          status: 'Resolved',
          resolution: resolution || 'Resolved by admin.',
        })
      fetchDisputes()
    } catch (error) {
      setToast({ message: 'Failed to resolve', type: 'error' })
    }
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const timeAgo = (date) => {
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

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Admin
        </button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-3">
              <FaBalanceScale className="text-amber-700 text-xs" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                Admin · Disputes
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-1">
              Dispute Resolution
            </h1>
            <p className="text-sm text-warm-700">
              {disputes.filter((d) => d.status !== 'Resolved').length} open disputes • Handle complaints between users
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div
              key={s.id}
              className="relative bg-white rounded-2xl border border-amber-100 p-5 hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden group"
            >
              <div
                className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${s.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
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

        {/* FILTERS */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 mb-6 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-700 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, title, category, or user..."
                className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-11 pr-4 py-3 text-sm text-warm-900 placeholder-warm-700/60 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 text-sm font-semibold text-warm-800 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {priorityFilters.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 text-sm font-semibold text-warm-800 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {statusFilters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-amber-100 p-12 text-center">
            <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
            <p className="text-warm-700">Loading disputes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-amber-100 p-12 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-display text-xl font-bold text-warm-900 mb-2">
              No disputes found
            </h3>
            <p className="text-warm-700 text-sm mb-6">
              {disputes.length === 0
                ? 'No disputes raised yet. All clear!'
                : 'Try a different search or clear filters.'}
            </p>
            {disputes.length > 0 && (
              <button
                onClick={() => {
                  setSearch('')
                  setPriorityFilter('All')
                  setStatusFilter('All')
                }}
                className="text-amber-700 font-semibold text-sm hover:text-amber-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block bg-white rounded-2xl border border-amber-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-cream-50 border-b border-cream-200">
                  <tr>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Dispute
                    </th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Raised By
                    </th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr
                      key={d._id}
                      className="border-b border-cream-100 hover:bg-cream-50/60 transition-colors"
                    >
                      <td className="px-4 py-4 max-w-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-bold text-warm-700">
                            {d.disputeId || 'DSP-' + d._id.slice(-4)}
                          </span>
                          {d.escalated && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[9px] font-bold uppercase">
                              <FaArrowUp className="text-[7px]" /> Esc
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-warm-900 text-sm truncate">
                          {d.title}
                        </p>
                        <p className="text-[10px] text-warm-700">
                          {timeAgo(d.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
                            {roleIcon(d.raisedBy?.role)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-warm-900">
                              {d.raisedBy?.name || '—'}
                            </p>
                            <p className="text-[10px] text-warm-700 capitalize">
                              {d.raisedBy?.role}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-semibold text-warm-700 bg-cream-100 px-2 py-0.5 rounded">
                          {d.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${priorityStyle(
                            d.priority
                          )}`}
                        >
                          {d.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusStyle(
                            d.status
                          )}`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleView(d)}
                          className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-amber-100 flex items-center justify-center text-warm-700 hover:text-amber-700 transition-colors ml-auto"
                        >
                          <FaEye className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-3">
              {filtered.map((d) => (
                <div
                  key={d._id}
                  onClick={() => handleView(d)}
                  className="bg-white rounded-2xl border border-amber-100 p-4 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-mono text-[10px] font-bold text-warm-700">
                      {d.disputeId || 'DSP-' + d._id.slice(-4)}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${priorityStyle(
                        d.priority
                      )}`}
                    >
                      {d.priority}
                    </span>
                  </div>
                  <p className="font-bold text-warm-900 text-sm mb-2 line-clamp-2">
                    {d.title}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-warm-700">
                    <span>{d.raisedBy?.name || '—'}</span>
                    <span className={`font-bold ${statusStyle(d.status).split(' ')[1]}`}>
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* DRAWER */}
      {drawerOpen && selected && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-warm-900/40 backdrop-blur-sm z-40"
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-lg bg-cream-50 z-50 shadow-2xl flex flex-col">
            {/* Header */}
            <div
              className={`p-6 text-white relative overflow-hidden ${
                selected.priority === 'Critical'
                  ? 'bg-gradient-to-br from-red-500 to-red-600'
                  : selected.priority === 'High'
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                  : 'bg-gradient-to-br from-amber-500 to-amber-600'
              }`}
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="relative">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="absolute top-0 right-0 w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30"
                >
                  <FaTimes />
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">
                    {selected.disputeId || 'DSP-' + selected._id.slice(-4)}
                  </span>
                  {selected.escalated && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur">
                      <FaArrowUp className="text-[8px]" /> Escalated
                    </span>
                  )}
                </div>
                <h2 className="font-display text-xl font-bold mb-3 leading-tight">
                  {selected.title}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 backdrop-blur">
                    {selected.priority}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 backdrop-blur">
                    {selected.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <Section title="Description">
                <p className="text-sm text-warm-800 leading-relaxed">
                  {selected.description}
                </p>
              </Section>

              <Section title="Parties Involved">
                {selected.raisedBy && (
                  <PartyCard
                    label="Raised By"
                    icon={roleIcon(selected.raisedBy.role)}
                    name={selected.raisedBy.name}
                    role={selected.raisedBy.role}
                    color="from-blue-500 to-blue-600"
                  />
                )}
                {selected.against && (
                  <PartyCard
                    label="Against"
                    icon={roleIcon(selected.against.role)}
                    name={selected.against.name}
                    role={selected.against.role}
                    color="from-red-500 to-red-600"
                  />
                )}
              </Section>

              <Section title="Details">
                <DetailRow label="Category" value={selected.category} />
                <DetailRow label="Job ID" value={selected.jobId || '—'} />
                <DetailRow label="Amount" value={`₹${selected.amount || 0}`} />
                <DetailRow
                  label="Created"
                  value={`${formatDate(selected.createdAt)} (${timeAgo(selected.createdAt)})`}
                />
              </Section>

              {/* Messages thread */}
              {selected.messages?.length > 0 && (
                <Section title={`Conversation (${selected.messages.length})`}>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selected.messages.map((m, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border ${
                          m.isAdminNote
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-white border-cream-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-bold text-warm-900">
                            {m.senderName || 'User'}{' '}
                            <span className="text-warm-700 font-medium capitalize">
                              ({m.senderRole || 'user'})
                            </span>
                          </p>
                          <p className="text-[9px] text-warm-700">
                            {m.createdAt ? timeAgo(m.createdAt) : ''}
                          </p>
                        </div>
                        <p className="text-xs text-warm-800">{m.text}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {selected.resolution && (
                <Section title="Resolution">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2">
                    <FaCheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-emerald-900 leading-relaxed">
                      {selected.resolution}
                    </p>
                  </div>
                </Section>
              )}

              {selected.status !== 'Resolved' && (
                <Section title="Send Reply">
                  <div className="space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response..."
                      rows={3}
                      className="w-full border border-amber-100 rounded-xl px-3 py-2.5 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 resize-none bg-white"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sending}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <>
                          <FaSpinner className="animate-spin text-xs" /> Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="text-xs" /> Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </Section>
              )}

              <div className="space-y-2 pt-2">
                {selected.status === 'Open' && (
                  <button
                    onClick={() => handleStatusChange(selected._id, 'In Progress')}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <FaHourglassHalf /> Start Investigation
                  </button>
                )}
                {selected.status === 'In Progress' && (
                  <button
                    onClick={() => handleResolve(selected._id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <FaCheckCircle /> Mark as Resolved
                  </button>
                )}
                {selected.status !== 'Resolved' && !selected.escalated && (
                  <button
                    onClick={() => handleEscalate(selected._id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition-colors"
                  >
                    <FaArrowUp /> Escalate to Senior
                  </button>
                )}
                {selected.status === 'Resolved' && (
                  <button
                    onClick={() => handleStatusChange(selected._id, 'In Progress')}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-amber-200 text-amber-700 font-semibold hover:bg-amber-50 transition-colors"
                  >
                    <FaRedo /> Reopen Dispute
                  </button>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-amber-100 p-4">
    <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
      {title}
    </p>
    <div className="space-y-3">{children}</div>
  </div>
)

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <p className="text-xs text-warm-700 font-medium">{label}</p>
    <p className="text-xs font-bold text-warm-900">{value}</p>
  </div>
)

const PartyCard = ({ label, icon, name, role, color }) => (
  <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
    <p className="text-[9px] font-bold uppercase tracking-wider text-warm-700 mb-2">
      {label}
    </p>
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white`}
      >
        {icon}
      </div>
      <div>
        <p className="font-bold text-warm-900 text-sm">{name}</p>
        <p className="text-[10px] text-warm-700 capitalize">{role}</p>
      </div>
    </div>
  </div>
)

export default AdminDisputes