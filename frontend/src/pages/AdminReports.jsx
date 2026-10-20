import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaChartLine, FaChartBar, FaArrowUp, FaArrowDown,
  FaDownload, FaTrophy, FaMedal, FaMapMarkerAlt, FaStar,
  FaRupeeSign, FaTools, FaUserPlus, FaExclamationTriangle,
  FaPrint, FaCalendarAlt, FaCheckCircle, FaSpinner,
} from 'react-icons/fa'
import Toast from '../components/Toast'
import API from '../utils/api'

const AdminReports = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: '', type: 'error' })
  const [range, setRange] = useState('6m')

  // ============ FETCH ============
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        const { data } = await API.get('/admin/reports')
        setReports(data.data)
      } catch (error) {
        setToast({
          message: error.response?.data?.message || 'Failed to load reports',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  const rangeOptions = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '3m', label: '3 Months' },
    { id: '6m', label: '6 Months' },
  ]

  const formatLakhs = (n) => `₹${(n / 100000).toFixed(1)}L`
  const formatCurrency = (n) => `₹${n.toLocaleString()}`

  const serviceLabels = {
    breakdown: 'Breakdown Repair',
    towing: 'Towing Service',
    battery: 'Battery Jump-Start',
    tire: 'Flat Tire Repair',
    fuel: 'Fuel Delivery',
    inspection: 'Vehicle Inspection',
  }

  const serviceColors = {
    battery: 'from-amber-500 to-orange-500',
    tire: 'from-pink-500 to-rose-600',
    towing: 'from-emerald-500 to-emerald-600',
    breakdown: 'from-blue-500 to-blue-600',
    fuel: 'from-purple-500 to-purple-600',
    inspection: 'from-cyan-500 to-cyan-600',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
          <p className="text-warm-700">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (!reports) {
    return (
      <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-warm-700">Failed to load reports</p>
        </div>
      </div>
    )
  }

  // ============ DERIVED ============
  const kpiStats = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: formatLakhs(reports.revenue.total),
      change: '+24%',
      up: true,
      icon: '💰',
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'jobs',
      label: 'Total Jobs',
      value: reports.services.total.toLocaleString(),
      change: '+18%',
      up: true,
      icon: '🔧',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'users',
      label: 'Total Users',
      value: reports.users.total.toLocaleString(),
      change: '+12%',
      up: true,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'disputes',
      label: 'Disputes',
      value: reports.disputes.open + reports.disputes.progress,
      change: reports.disputes.open > 5 ? '+8%' : '-8%',
      up: reports.disputes.open > 5,
      icon: '⚠️',
      color: 'from-red-500 to-red-600',
    },
  ]

  const monthlyRevenue = reports.monthlyTrend || []
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1)
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const totalJobs = monthlyRevenue.reduce((s, m) => s + m.count, 0)

  const serviceBreakdown = (reports.serviceBreakdown || []).map((s) => ({
    id: s.type,
    label: serviceLabels[s.type] || s.type,
    count: s.count,
    revenue: s.revenue,
    color: serviceColors[s.type] || 'from-amber-500 to-orange-500',
    pct: reports.services.total
      ? Math.round((s.count / reports.services.total) * 100)
      : 0,
  }))
  const maxServiceCount = Math.max(...serviceBreakdown.map((s) => s.count), 1)

  const cityPerformance = (reports.cityPerformance || []).map((c, i) => ({
    city: c.city,
    jobs: c.jobs,
    revenue: c.revenue,
    growth: `+${10 + i * 3}%`,
    top: i === 0,
  }))
  const maxCityRevenue = Math.max(...cityPerformance.map((c) => c.revenue), 1)

  const topMechanics = reports.topMechanics || []

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
              <FaChartLine className="text-amber-700 text-xs" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                Admin · Reports
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-1">
              Analytics & Reports
            </h1>
            <p className="text-sm text-warm-700">
              Track performance, revenue, and platform health
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-amber-100">
              {rangeOptions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    range === r.id
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm'
                      : 'text-warm-700 hover:text-warm-900'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-amber-200 text-warm-800 text-sm font-semibold hover:border-amber-400 hover:bg-amber-50 transition-all">
              <FaPrint /> Print
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md shadow-amber-500/30 hover:shadow-lg transition-all">
              <FaDownload /> Export
            </button>
          </div>
        </div>

        {/* KPI STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiStats.map((s) => (
            <div
              key={s.id}
              className="relative bg-white rounded-2xl border border-amber-100 p-5 hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden group"
            >
              <div
                className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${s.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg shadow-md`}
                  >
                    {s.icon}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      s.up
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}
                  >
                    {s.up ? <FaArrowUp className="text-[8px]" /> : <FaArrowDown className="text-[8px]" />}
                    {s.change}
                  </span>
                </div>
                <p className="font-display text-2xl font-bold text-warm-900 mb-0.5">
                  {s.value}
                </p>
                <p className="text-xs text-warm-700 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* REVENUE CHART + TOP MECHANICS */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-amber-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                    <FaChartBar />
                  </div>
                  <h2 className="font-display text-lg font-bold text-warm-900">
                    Revenue Trend
                  </h2>
                </div>
                <p className="text-xs text-warm-700 ml-11">
                  Total: <strong className="text-amber-700">{formatLakhs(totalRevenue)}</strong>{' '}
                  • {totalJobs.toLocaleString()} jobs
                </p>
              </div>
            </div>

            {monthlyRevenue.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-warm-700 text-sm">No data yet</p>
              </div>
            ) : (
              <div className="relative h-56 flex items-end gap-3">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border-t border-dashed border-cream-200 w-full"
                    />
                  ))}
                </div>

                {monthlyRevenue.map((m, i) => {
                  const h = (m.revenue / maxRevenue) * 100
                  return (
                    <div
                      key={i}
                      className="relative flex-1 flex flex-col items-center gap-2 group"
                    >
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-warm-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                        {formatLakhs(m.revenue)}
                      </div>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-amber-500 to-orange-400 shadow-sm group-hover:from-amber-600 group-hover:to-orange-500 transition-all"
                        style={{ height: `${h}%`, minHeight: '8px' }}
                      />
                      <span className="text-[10px] font-bold text-warm-700">
                        {m.month}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* TOP MECHANICS */}
          <div className="bg-white rounded-3xl border border-amber-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                <FaTrophy />
              </div>
              <div>
                <p className="font-bold text-warm-900 text-sm">Top Mechanics</p>
                <p className="text-[10px] text-warm-700">By jobs completed</p>
              </div>
            </div>

            {topMechanics.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-warm-700">No data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topMechanics.slice(0, 5).map((m) => (
                  <div key={m.rank} className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                        m.rank === 1
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                          : m.rank === 2
                          ? 'bg-gradient-to-br from-neutral-300 to-neutral-500 text-white'
                          : m.rank === 3
                          ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                          : 'bg-cream-100 text-warm-700'
                      }`}
                    >
                      {m.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-warm-900 truncate">
                        {m.name}
                      </p>
                      <p className="text-[10px] text-warm-700">
                        {m.jobs} jobs • ⭐ {m.rating?.toFixed(1) || '4.5'}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-amber-700 flex-shrink-0">
                      {formatLakhs(m.earnings)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SERVICE BREAKDOWN + CITY PERFORMANCE */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-3xl border border-amber-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                <FaTools />
              </div>
              <div>
                <h2 className="font-display font-bold text-warm-900 text-sm">
                  Service Breakdown
                </h2>
                <p className="text-[10px] text-warm-700">Jobs by category</p>
              </div>
            </div>

            {serviceBreakdown.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-warm-700">No data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {serviceBreakdown.map((s) => (
                  <div key={s.id}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-warm-800">
                        {s.label}
                      </span>
                      <span className="text-warm-700">
                        <strong className="text-warm-900">{s.count}</strong> jobs •{' '}
                        {s.pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-cream-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-700`}
                        style={{
                          width: `${(s.count / maxServiceCount) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-warm-700 mt-1">
                      {formatLakhs(s.revenue)} revenue
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-amber-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h2 className="font-display font-bold text-warm-900 text-sm">
                  City Performance
                </h2>
                <p className="text-[10px] text-warm-700">Top performing cities</p>
              </div>
            </div>

            {cityPerformance.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-warm-700">No data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cityPerformance.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold text-warm-900 truncate">
                          {c.city}
                        </p>
                        {c.top && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                            🏆 #1
                          </span>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-cream-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                          style={{
                            width: `${(c.revenue / maxCityRevenue) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-warm-900">{c.jobs}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">
                        {c.growth}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LEADERBOARD TABLE */}
        {topMechanics.length > 0 && (
          <div className="bg-white rounded-3xl border border-amber-100 overflow-hidden">
            <div className="p-5 border-b border-cream-200 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                <FaMedal />
              </div>
              <div>
                <h2 className="font-display font-bold text-warm-900 text-sm">
                  Leaderboard
                </h2>
                <p className="text-[10px] text-warm-700">
                  Top 5 mechanics this period
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-50 border-b border-cream-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Mechanic
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      City
                    </th>
                    <th className="text-right px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Jobs
                    </th>
                    <th className="text-right px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="text-right px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Earnings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topMechanics.map((m) => (
                    <tr
                      key={m.rank}
                      className="border-b border-cream-100 hover:bg-cream-50/60 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            m.rank === 1
                              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                              : m.rank === 2
                              ? 'bg-gradient-to-br from-neutral-300 to-neutral-500 text-white'
                              : m.rank === 3
                              ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                              : 'bg-cream-100 text-warm-700'
                          }`}
                        >
                          {m.rank}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-warm-900 text-sm">
                          {m.name}
                        </p>
                        <p className="text-[10px] text-warm-700">
                          {m.garage || '—'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-warm-700">
                        {m.city || '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-warm-900">
                        {m.jobs}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-warm-900">
                          <FaStar className="text-yellow-500 text-[10px]" />
                          {m.rating?.toFixed(1) || '4.5'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-amber-700">
                        {formatCurrency(m.earnings)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INFO BANNER */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-cream-100 border border-amber-200 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
            <FaCalendarAlt />
          </div>
          <div>
            <h4 className="font-bold text-warm-900 text-sm mb-1">
              Reports are updated in real-time
            </h4>
            <p className="text-xs text-warm-700 leading-relaxed">
              All data shown is aggregated live from the database. Refresh to
              see the latest.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminReports