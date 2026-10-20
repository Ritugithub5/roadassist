import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaRupeeSign, FaWallet, FaChartLine,
  FaCheckCircle, FaHourglassHalf, FaFileInvoice,
  FaSearch, FaSpinner, FaUser,
} from 'react-icons/fa'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'

const MechanicEarnings = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'error' })

  // ============ FETCH EARNINGS FROM BACKEND ============
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true)
        const { data } = await API.get('/mechanics/me/earnings')
        setEarnings(data.data)
      } catch (error) {
        setToast({
          message: error.response?.data?.message || 'Failed to load earnings',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchEarnings()
  }, [])

  const fullName = user?.name || 'Mechanic'

  // ============ FILTERED JOBS ============
  const jobs = earnings?.recentJobs || []
  const filteredJobs = jobs.filter((j) => {
    if (!search) return true
    const q = search.toLowerCase()
    const serviceMap = {
      breakdown: 'Breakdown Repair',
      towing: 'Towing Service',
      battery: 'Battery Jump-Start',
      tire: 'Flat Tire Repair',
      fuel: 'Fuel Delivery',
      inspection: 'Vehicle Inspection',
    }
    return (
      j.requestId?.toLowerCase().includes(q) ||
      serviceMap[j.serviceType]?.toLowerCase().includes(q) ||
      j.user?.name?.toLowerCase().includes(q)
    )
  })

  // ============ STATS ============
  const stats = [
    {
      icon: <FaRupeeSign />,
      label: 'Total Earnings',
      value: earnings?.totalEarnings || 0,
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: <FaChartLine />,
      label: 'This Month',
      value: earnings?.thisMonthEarnings || 0,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: <FaCheckCircle />,
      label: 'Total Jobs',
      value: earnings?.totalJobs || 0,
      isCount: true,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <FaHourglassHalf />,
      label: 'This Month Jobs',
      value: earnings?.thisMonthJobs || 0,
      isCount: true,
      color: 'from-purple-500 to-purple-600',
    },
  ]

  // ============ LOADING ============
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
          <p className="text-warm-700">Loading earnings...</p>
        </div>
      </div>
    )
  }

  // ============ CHART DATA FROM REAL JOBS ============
  const chartJobs = jobs.slice(0, 10).reverse()
  const maxAmount = Math.max(...chartJobs.map((j) => j.total || 0), 1)
  const chartTotal = chartJobs.reduce((sum, j) => sum + (j.total || 0), 0)
  const chartAvg = chartJobs.length > 0 ? Math.round(chartTotal / chartJobs.length) : 0

  const serviceMap = {
    breakdown: 'Breakdown Repair',
    towing: 'Towing Service',
    battery: 'Battery Jump-Start',
    tire: 'Flat Tire Repair',
    fuel: 'Fuel Delivery',
    inspection: 'Vehicle Inspection',
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />

      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate('/mechanic')}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-3">
              <FaWallet className="text-amber-700 text-xs" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                Earnings
              </span>
            </div>
            {/* ✅ DYNAMIC NAME */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-1">
              {fullName}'s Earnings
            </h1>
            <p className="text-sm text-warm-700">
              Track your income, transactions, and payouts
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div
              key={i}
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
                  {s.isCount ? s.value : `₹${s.value.toLocaleString()}`}
                </p>
                <p className="text-xs text-warm-700 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-3xl border border-amber-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <FaChartLine />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-warm-900">
                Recent Earnings
              </h2>
              <p className="text-xs text-warm-700">
                Total: <strong className="text-amber-700">₹{chartTotal.toLocaleString()}</strong> •
                Avg: <strong className="text-amber-700">₹{chartAvg.toLocaleString()}</strong>
              </p>
            </div>
          </div>

          {chartJobs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">💰</div>
              <p className="font-bold text-warm-900 mb-1">No earnings yet</p>
              <p className="text-xs text-warm-700">
                Complete jobs to see your earnings here
              </p>
            </div>
          ) : (
            <div className="relative h-48 flex items-end gap-1.5 md:gap-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-t border-dashed border-cream-200 w-full" />
                ))}
              </div>

              {chartJobs.map((j, i) => {
                const heightPct = ((j.total || 0) / maxAmount) * 100
                const isTop = j.total === maxAmount
                return (
                  <div key={i} className="relative flex-1 flex flex-col items-center gap-1 group">
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-warm-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                      ₹{(j.total || 0).toLocaleString()}
                    </div>
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isTop
                          ? 'bg-gradient-to-t from-amber-500 to-orange-400 shadow-md shadow-amber-500/30'
                          : 'bg-gradient-to-t from-amber-300 to-amber-200'
                      } group-hover:from-amber-500 group-hover:to-orange-400`}
                      style={{ height: `${heightPct}%`, minHeight: '6px' }}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-3xl border border-amber-100 overflow-hidden">
          <div className="p-5 border-b border-cream-200">
            <h2 className="font-display text-lg font-bold text-warm-900 mb-3">
              Recent Transactions
            </h2>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-700 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, service, or customer..."
                className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-11 pr-4 py-3 text-sm text-warm-900 placeholder-warm-700/60 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
              />
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-bold text-warm-900 mb-1">
                {jobs.length === 0 ? 'No transactions yet' : 'No matching transactions'}
              </p>
              <p className="text-xs text-warm-700">
                {jobs.length === 0
                  ? 'Completed jobs will appear here'
                  : 'Try a different search term'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-cream-100">
              {filteredJobs.map((job) => (
                <div key={job._id} className="p-4 hover:bg-cream-50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                        <FaCheckCircle />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[10px] font-bold text-warm-700">
                            {job.requestId || 'JOB-' + job._id.slice(-4)}
                          </span>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Completed
                          </span>
                        </div>
                        <p className="font-bold text-warm-900 text-sm truncate">
                          {serviceMap[job.serviceType] || job.serviceType}
                        </p>
                        <p className="text-[11px] text-warm-700">
                          {job.user?.name || 'Customer'} •{' '}
                          {new Date(job.completedAt || job.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-amber-700 text-base">
                        ₹{job.total || 0}
                      </p>
                      <p className="text-[10px] text-warm-700">Earned</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MechanicEarnings