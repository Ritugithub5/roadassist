import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaSearch, FaFileInvoice, FaDownload,
  FaFilter, FaFileAlt, FaStar, FaTools, FaCalendarAlt,
  FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle,
} from 'react-icons/fa'
import HistoryDetailDrawer from '../components/HistoryDetailDrawer'
import FeedbackModal from '../components/FeedbackModal'
import RaiseDisputeModal from '../components/RaiseDisputeModal'
import Toast from '../components/Toast'
import API from '../utils/api'

const serviceLabels = {
  breakdown: 'Breakdown Repair',
  towing: 'Towing Service',
  battery: 'Battery Jump-Start',
  tire: 'Flat Tire Repair',
  fuel: 'Fuel Delivery',
  inspection: 'Vehicle Inspection',
}

const ServiceHistory = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'error' })

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [serviceFilter, setServiceFilter] = useState('all')

  const [selectedItem, setSelectedItem] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackItem, setFeedbackItem] = useState(null)

  // ✅ NEW — Raise dispute
  const [disputeModal, setDisputeModal] = useState({ open: false, service: null })
  const [disputedServiceIds, setDisputedServiceIds] = useState(new Set())

  // ============ FETCH ============
  const fetchHistory = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/services/my')

      const transformed = (data.data || []).map((r) => {
        const date = new Date(r.createdAt)
        return {
          id: r.requestId || 'SR-' + r._id.slice(-4),
          _id: r._id,
          service: serviceLabels[r.serviceType] || r.serviceType,
          serviceId: r.serviceType,
          mechanic: r.mechanic?.name || 'Not assigned',
          mechanicId: r.mechanic?._id || r.mechanic || null,
          mechanicRating: 4.9,
          date: r.createdAt,
          dateLabel: date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          time: date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: r.location?.address || '—',
          vehicle: r.vehicle ? `${r.vehicle.name} (${r.vehicle.plate})` : '—',
          status: r.status,
          amount: r.amount || 0,
          tax: r.tax || 0,
          total: r.total || 0,
          paymentMode: r.paymentMode || 'Pending',
          invoiceId: r.requestId ? `INV-${r.requestId}` : '—',
          rating: r.rating || 0,
          review: r.review || '',
        }
      })

      setItems(transformed)

      // ✅ Load which services already have disputes
      try {
        const dispRes = await API.get('/disputes/my')
        const ids = new Set(
          (dispRes.data.data || [])
            .map((d) => d.relatedService)
            .filter(Boolean)
            .map((s) => s.toString())
        )
        setDisputedServiceIds(ids)
      } catch (e) {
        // ignore
      }

      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  // ============ FILTERS ============
  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchSearch =
        !search ||
        it.id.toLowerCase().includes(search.toLowerCase()) ||
        it.service.toLowerCase().includes(search.toLowerCase()) ||
        it.mechanic.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || it.status === statusFilter
      const matchService = serviceFilter === 'all' || it.serviceId === serviceFilter
      return matchSearch && matchStatus && matchService
    })
  }, [items, search, statusFilter, serviceFilter])

  // ============ STATS ============
  const stats = useMemo(() => {
    const totalServices = items.length
    const completedItems = items.filter((i) => i.status === 'Completed')
    const totalSpent = completedItems.reduce((sum, i) => sum + i.total, 0)
    const totalSaved = Math.round(totalSpent * 0.2)
    const ratedItems = items.filter((i) => i.rating > 0)
    const avgRating =
      ratedItems.length > 0
        ? (ratedItems.reduce((sum, i) => sum + i.rating, 0) / ratedItems.length).toFixed(1)
        : '0.0'

    return [
      { id: 'total', label: 'Total Services', value: totalServices, icon: '🔧', color: 'brand' },
      { id: 'spent', label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: '💰', color: 'amber' },
      { id: 'saved', label: 'Total Saved', value: `₹${totalSaved.toLocaleString()}`, icon: '📉', color: 'emerald' },
      { id: 'rating', label: 'Avg Rating Given', value: avgRating, icon: '⭐', color: 'blue' },
    ]
  }, [items])

  const colorMap = {
    brand: 'from-amber-500 to-orange-500',
    amber: 'from-amber-400 to-amber-600',
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
  }

  // ============ ACTIONS ============
  const handleView = (item) => {
    setSelectedItem(item)
    setDrawerOpen(true)
  }

  // ✅ NEW — open dispute modal
  const handleRaiseDispute = (item) => {
    if (!item.mechanicId) {
      setToast({
        message: 'Cannot raise dispute — no mechanic assigned to this service',
        type: 'error',
      })
      return
    }
    setDisputeModal({ open: true, service: item })
  }

  const handleDownload = (item) => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${item.invoiceId}</title>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1f2937; background: #fff; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; padding-bottom: 24px; border-bottom: 3px solid #f59e0b; margin-bottom: 32px; }
            .brand-logo { width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; margin-right: 12px; }
            .brand-name { font-size: 24px; font-weight: 800; color: #1f2937; display: inline-block; vertical-align: middle; }
            .brand-name span { color: #f59e0b; }
            .invoice-info { text-align: right; }
            .invoice-info h2 { color: #f59e0b; font-size: 28px; margin-bottom: 4px; }
            .invoice-info p { color: #6b7280; font-size: 13px; }
            .section { margin-bottom: 28px; }
            .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #6b7280; margin-bottom: 10px; }
            .section-content { background: #fef9f3; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; font-size: 14px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; }
            .row:not(:last-child) { border-bottom: 1px dashed #fde68a; }
            .row-label { color: #6b7280; }
            .row-value { font-weight: 600; color: #1f2937; text-align: right; }
            .total-section { background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; border-radius: 12px; padding: 20px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
            .total-label { font-size: 14px; opacity: 0.9; }
            .total-value { font-size: 32px; font-weight: 800; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .badge-completed { background: #d1fae5; color: #065f46; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                <div class="brand-logo">🔧</div>
                <div class="brand-name">Road<span>Assist</span></div>
              </div>
              <div class="invoice-info">
                <h2>INVOICE</h2>
                <p>${item.invoiceId}</p>
                <p>${item.dateLabel}</p>
              </div>
            </div>
            <div class="section">
              <div class="section-title">Service Details</div>
              <div class="section-content">
                <div class="row"><span class="row-label">Request ID</span><span class="row-value">${item.id}</span></div>
                <div class="row"><span class="row-label">Service Type</span><span class="row-value">${item.service}</span></div>
                <div class="row"><span class="row-label">Status</span><span class="row-value"><span class="badge badge-completed">${item.status}</span></span></div>
                <div class="row"><span class="row-label">Payment Mode</span><span class="row-value">${item.paymentMode}</span></div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px;">
              <div>
                <div class="section-title">Vehicle</div>
                <div class="section-content">${item.vehicle}</div>
              </div>
              <div>
                <div class="section-title">Service Provider</div>
                <div class="section-content">${item.mechanic}</div>
              </div>
            </div>
            <div class="section">
              <div class="section-title">Location</div>
              <div class="section-content">📍 ${item.location}</div>
            </div>
            <div class="section">
              <div class="section-title">Cost Breakdown</div>
              <div class="section-content">
                <div class="row"><span class="row-label">Service Charge</span><span class="row-value">₹${item.amount}</span></div>
                <div class="row"><span class="row-label">GST & Fees</span><span class="row-value">₹${item.tax}</span></div>
              </div>
            </div>
            <div class="total-section">
              <span class="total-label">TOTAL AMOUNT PAID</span>
              <span class="total-value">₹${item.total}</span>
            </div>
            <div class="footer">
              <p>Thank you for using RoadAssist!</p>
              <p style="margin-top: 6px;">support@roadassist.in | +91 98765 43210</p>
            </div>
          </div>
          <script>window.onload = () => setTimeout(() => window.print(), 600);</script>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank', 'width=900,height=800')
    if (!printWindow) {
      alert('Please allow popups to download the invoice')
      return
    }
    printWindow.document.write(invoiceHTML)
    printWindow.document.close()
  }

  const handleReorder = (item) => {
    navigate(`/request-service?service=${item.serviceId}`)
  }

  const handleRate = (item) => {
    setFeedbackItem(item)
    setDrawerOpen(false)
    setFeedbackOpen(true)
  }

  const handleFeedbackSubmit = async ({ id, rating, review }) => {
    try {
      await API.post(`/services/${id}/feedback`, { rating, review })
      setToast({ message: 'Rating submitted!', type: 'success' })
      fetchHistory()
    } catch (error) {
      console.error('Feedback error:', error.response?.data || error.message)
      setToast({ 
        message: error.response?.data?.message || 'Failed to submit rating', 
        type: 'error' 
      })
    }
  }

  const statusFilters = ['All', 'Requested', 'Accepted', 'En Route', 'Arrived', 'Completed', 'Cancelled']
  const serviceFilters = [
    { id: 'all', label: 'All Services' },
    { id: 'battery', label: 'Battery' },
    { id: 'tire', label: 'Tire' },
    { id: 'towing', label: 'Towing' },
    { id: 'fuel', label: 'Fuel' },
    { id: 'breakdown', label: 'Breakdown' },
    { id: 'inspection', label: 'Inspection' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
          <p className="text-warm-700 font-semibold">Loading your service history...</p>
        </div>
      </div>
    )
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
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-3">
              <FaFileInvoice className="text-amber-700 text-xs" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                Service History
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-1">
              Your Service Records
            </h1>
            <p className="text-sm text-warm-700">
              {items.length} total request{items.length !== 1 ? 's' : ''} • All your past roadside services
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/my-disputes')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-amber-200 text-warm-800 text-sm font-semibold hover:border-amber-400 hover:bg-amber-50 transition-all"
            >
              My Disputes
            </button>
            <button
              onClick={() => navigate('/request-service')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <FaTools /> New Request
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.id}
              className="relative bg-white rounded-2xl border border-amber-100 p-5 hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden group"
            >
              <div
                className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${colorMap[s.color]} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
              />
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[s.color]} flex items-center justify-center text-white text-lg shadow-md mb-3`}
                >
                  {s.icon}
                </div>
                <p className="text-2xl font-bold text-warm-900 mb-0.5">{s.value}</p>
                <p className="text-xs text-warm-700 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 mb-6 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-700 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, service, or mechanic..."
                className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-11 pr-4 py-3 text-sm text-warm-900 placeholder-warm-700/60 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-700 text-xs pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto appearance-none bg-cream-50 border border-cream-200 rounded-xl pl-10 pr-10 py-3 text-sm font-semibold text-warm-800 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {statusFilters.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {serviceFilters.map((sf) => (
              <button
                key={sf.id}
                onClick={() => setServiceFilter(sf.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  serviceFilter === sf.id
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-white text-warm-700 border-cream-200 hover:border-amber-300 hover:text-amber-700'
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-white rounded-3xl border border-red-100 p-12 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h3 className="font-display text-xl font-bold text-warm-900 mb-2">
              Failed to load history
            </h3>
            <p className="text-warm-700 text-sm mb-6">{error}</p>
            <button
              onClick={fetchHistory}
              className="text-amber-700 font-semibold text-sm hover:text-amber-800"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-amber-200 p-12 md:p-20 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-3xl mb-6 shadow-lg shadow-amber-500/30">
              <FaFileAlt />
            </div>
            <h2 className="font-display text-2xl font-bold text-warm-900 mb-2">
              No service history yet
            </h2>
            <p className="text-warm-700 mb-8 max-w-md mx-auto">
              Your past roadside services will appear here after you complete your first request.
            </p>
            <button
              onClick={() => navigate('/request-service')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Request Your First Service
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-amber-100 p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-warm-900 mb-2">
              No results found
            </h3>
            <p className="text-warm-700 text-sm mb-6">
              Try a different search or clear your filters.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('All')
                setServiceFilter('all')
              }}
              className="text-amber-700 font-semibold text-sm hover:text-amber-800"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl border border-amber-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-cream-50 border-b border-cream-200">
                  <tr>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">ID</th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">Service</th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">Mechanic</th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">Amount</th>
                    <th className="text-right px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const hasDispute = disputedServiceIds.has(item._id)
                    return (
                      <tr key={item._id} className="border-b border-cream-100 hover:bg-cream-50/60 transition-colors">
                        <td className="px-4 py-4">
                          <span className="font-mono text-xs font-bold text-warm-800">{item.id}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                              <FaTools />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-warm-900 text-sm">{item.service}</p>
                              <p className="text-[11px] text-warm-700 truncate">{item.vehicle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-warm-900">{item.mechanic}</p>
                          {item.mechanicRating > 0 && (
                            <p className="text-[11px] text-warm-700">⭐ {item.mechanicRating}</p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-warm-900">{item.dateLabel}</p>
                          <p className="text-[11px] text-warm-700">{item.time}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              item.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : item.status === 'Cancelled'
                                ? 'bg-red-50 text-red-600 border-red-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}
                          >
                            {item.status === 'Completed' ? (
                              <FaCheckCircle className="text-[9px]" />
                            ) : (
                              <FaTimesCircle className="text-[9px]" />
                            )}
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="font-bold text-warm-900 text-sm">
                            ₹{item.total.toLocaleString()}
                          </p>
                          {item.tax > 0 && (
                            <p className="text-[10px] text-warm-700">incl. GST</p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleView(item)}
                              className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-amber-100 flex items-center justify-center text-warm-700 hover:text-amber-700 transition-colors"
                              title="View details"
                            >
                              <FaFileAlt className="text-xs" />
                            </button>
                            {item.status === 'Completed' && (
                              <>
                                <button
                                  onClick={() => handleDownload(item)}
                                  className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-amber-100 flex items-center justify-center text-warm-700 hover:text-amber-700 transition-colors"
                                  title="Download invoice"
                                >
                                  <FaDownload className="text-xs" />
                                </button>
                                {/* ✅ NEW — raise dispute */}
                                <button
                                  onClick={() => handleRaiseDispute(item)}
                                  disabled={hasDispute}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                    hasDispute
                                      ? 'bg-red-50 text-red-400 cursor-not-allowed'
                                      : 'bg-cream-100 hover:bg-red-50 text-warm-700 hover:text-red-600'
                                  }`}
                                  title={
                                    hasDispute ? 'Dispute already raised' : 'Raise dispute'
                                  }
                                >
                                  <FaExclamationTriangle className="text-xs" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {filtered.map((item) => {
                const hasDispute = disputedServiceIds.has(item._id)
                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-amber-100 p-4 hover:border-amber-300 hover:shadow-lg transition-all"
                  >
                    <div onClick={() => handleView(item)} className="cursor-pointer">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
                            <FaTools />
                          </div>
                          <div>
                            <p className="font-bold text-warm-900 text-sm">{item.service}</p>
                            <p className="font-mono text-[10px] text-warm-700">{item.id}</p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="flex items-center gap-1.5 text-warm-700">
                          <FaCalendarAlt className="text-amber-600 text-[10px]" /> {item.dateLabel}
                        </div>
                        <div className="flex items-center gap-1.5 text-warm-700">
                          <FaStar className="text-yellow-500 text-[10px]" /> {item.mechanic}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-cream-200">
                        <span className="text-[11px] text-warm-700 truncate">{item.vehicle}</span>
                        <span className="font-bold text-warm-900 ml-2">
                          ₹{item.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-cream-200">
                      <button
                        onClick={() => handleView(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cream-50 hover:bg-amber-50 text-warm-700 hover:text-amber-700 text-xs font-semibold transition-colors"
                      >
                        View
                      </button>
                      {item.status === 'Completed' && (
                        <>
                          <button
                            onClick={() => handleDownload(item)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                          >
                            <FaDownload className="text-[10px]" /> Invoice
                          </button>
                          <button
                            onClick={() => handleRaiseDispute(item)}
                            disabled={hasDispute}
                            className={`w-10 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                              hasDispute
                                ? 'bg-red-50 text-red-400'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                            title={hasDispute ? 'Dispute already raised' : 'Raise dispute'}
                          >
                            <FaExclamationTriangle className="text-[10px]" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <HistoryDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={selectedItem}
        onDownload={handleDownload}
        onReorder={handleReorder}
        onRate={handleRate}
      />

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
        item={feedbackItem}
      />

      {/* ✅ NEW — Raise Dispute Modal */}
      <RaiseDisputeModal
        open={disputeModal.open}
        onClose={() => setDisputeModal({ open: false, service: null })}
        service={disputeModal.service}
        onSuccess={() => {
          setToast({
            message: 'Dispute raised. Our team will review it.',
            type: 'success',
          })
          fetchHistory()
        }}
      />
    </div>
  )
}

export default ServiceHistory