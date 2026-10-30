import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaUsers, FaTools, FaClipboardList, FaRupeeSign, FaCheck, FaTimes,
  FaEye, FaGavel, FaChartBar, FaSignOutAlt, FaCog,
  FaShieldAlt, FaArrowRight, FaSpinner,
} from 'react-icons/fa'
import Toast from '../components/Toast'
import NotificationBell from '../components/NotificationBell'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [stats, setStats] = useState(null)
  const [pending, setPending] = useState([])
  const [liveRequests, setLiveRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: '', type: 'error' })

  const adminName = user?.name || 'Admin'
  const firstName = adminName.split(' ')[0]
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // ============ FETCH DATA ============
  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsRes, pendingRes, liveRes] = await Promise.all([
        API.get('/admin/dashboard-stats'),
        API.get('/admin/pending-verifications'),
        API.get('/admin/live-requests'),
      ])
      setStats(statsRes.data.data)
      setPending(pendingRes.data.data || [])
      setLiveRequests(liveRes.data.data || [])
    } catch (error) {
      console.error('Admin dashboard error:', error)
      setToast({
        message: error.response?.data?.message || 'Failed to load dashboard',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  // ============ APPROVE / REJECT ============
  const handleApprove = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/status`, { status: 'Active' })
      setToast({ message: 'Partner approved!', type: 'success' })
      setTimeout(fetchData, 400)
    } catch (error) {
      setToast({ message: 'Failed to approve', type: 'error' })
    }
  }

  const handleReject = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/status`, { status: 'Suspended' })
      setToast({ message: 'Partner rejected', type: 'success' })
      setTimeout(fetchData, 400)
    } catch (error) {
      setToast({ message: 'Failed to reject', type: 'error' })
    }
  }

  // ============ HELPERS ============
  const formatCurrency = (n) => {
    if (!n) return '₹0'
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
    return `₹${n.toLocaleString()}`
  }

  const serviceLabel = (type) =>
    ({
      breakdown: 'Breakdown',
      towing: 'Towing',
      battery: 'Battery',
      tire: 'Flat Tire',
      fuel: 'Fuel',
      inspection: 'Inspection',
    }[type] || type)

  const statusColor = (status) => {
    if (status === 'Completed') return 'bg-emerald-50 text-emerald-600'
    if (status === 'Requested') return 'bg-yellow-50 text-yellow-700'
    if (status === 'Cancelled') return 'bg-red-50 text-red-600'
    return 'bg-blue-50 text-blue-600'
  }

  const statCards = stats
    ? [
        {
          icon: <FaUsers />,
          label: 'Total Users',
          value: stats.totalUsers.toLocaleString(),
          trend: '+12%',
          color: 'from-blue-500 to-blue-600',
        },
        {
          icon: <FaTools />,
          label: 'Active Mechanics',
          value: stats.totalMechanics.toLocaleString(),
          trend: '+8%',
          color: 'from-emerald-500 to-emerald-600',
        },
        {
          icon: <FaClipboardList />,
          label: 'Live Requests',
          value: stats.liveRequests,
          trend: 'Live',
          color: 'from-red-500 to-red-600',
        },
        {
          icon: <FaRupeeSign />,
          label: 'Monthly Revenue',
          value: formatCurrency(stats.monthlyRevenue),
          trend: '+22%',
          color: 'from-amber-500 to-orange-500',
        },
      ]
    : []

  const quickLinks = [
    {
      icon: <FaUsers />,
      label: 'Manage Users',
      desc: stats ? `${stats.totalUsers.toLocaleString()} users` : '—',
      path: '/admin/users',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <FaGavel />,
      label: 'Disputes',
      desc: stats ? `${stats.openDisputes} open` : '—',
      path: '/admin/disputes',
      color: 'from-red-500 to-red-600',
      badge: stats?.openDisputes || 0,
    },
    {
      icon: <FaChartBar />,
      label: 'Reports',
      desc: 'View analytics',
      path: '/admin/reports',
      color: 'from-amber-500 to-orange-500',
    },
  ]

  // ============ LOADING ============
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
          <p className="text-warm-700">Loading dashboard...</p>
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
        {/* ============ HEADER ============ */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-display font-bold text-lg shadow-lg shadow-amber-500/30 flex-shrink-0">
              {initials}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-2">
                <FaShieldAlt className="text-amber-700 text-[10px]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                  Admin Access
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-warm-900">
                Welcome back, {firstName}
              </h1>
              <p className="text-sm text-warm-700">
                {adminName} • Full platform access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* ✅ Real Notification Bell */}
            <NotificationBell />

            <button
              onClick={() => navigate('/admin/users')}
              className="w-11 h-11 rounded-xl bg-white border border-amber-200 hover:border-amber-400 flex items-center justify-center text-warm-700 hover:text-amber-700 transition-colors"
              title="Settings"
            >
              <FaCog />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 text-sm font-semibold transition-all"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* ============ STATS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div
              key={i}
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
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      s.trend === 'Live'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}
                  >
                    {s.trend}
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

        {/* ============ QUICK LINKS ============ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => navigate(link.path)}
              className={`relative p-5 rounded-2xl bg-gradient-to-br ${link.color} text-white text-left font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-3`}
            >
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-lg flex-shrink-0">
                {link.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm">{link.label}</p>
                <p className="text-[10px] font-medium opacity-90">{link.desc}</p>
              </div>
              {link.badge > 0 && (
                <span className="w-6 h-6 rounded-full bg-white text-red-600 text-[10px] font-bold flex items-center justify-center">
                  {link.badge}
                </span>
              )}
              <FaArrowRight className="text-xs opacity-60" />
            </button>
          ))}
        </div>

        {/* ============ MAIN GRID ============ */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pending verifications */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-amber-100 overflow-hidden">
            <div className="p-5 border-b border-cream-200 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-warm-900">
                  Pending Partner Verifications
                </h2>
                <p className="text-xs text-warm-700 mt-0.5">
                  Review and approve new partners
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                {pending.length} Pending
              </span>
            </div>

            {pending.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-bold text-warm-900 mb-1">All caught up!</p>
                <p className="text-xs text-warm-700">No pending verifications</p>
              </div>
            ) : (
              <div className="divide-y divide-cream-100">
                {pending.map((p) => (
                  <div
                    key={p._id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-cream-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-warm-900 text-sm">{p.name}</p>
                        <p className="text-xs text-warm-700 capitalize">
                          {p.role} • {p.city} •{' '}
                          {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/admin/users')}
                        className="px-3 py-1.5 rounded-lg bg-cream-100 hover:bg-amber-100 text-warm-700 hover:text-amber-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <FaEye className="text-[10px]" /> View
                      </button>
                      <button
                        onClick={() => handleReject(p._id)}
                        className="px-3 py-1.5 rounded-lg bg-cream-100 hover:bg-red-50 text-warm-700 hover:text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <FaTimes className="text-[10px]" /> Reject
                      </button>
                      <button
                        onClick={() => handleApprove(p._id)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
                      >
                        <FaCheck className="text-[10px]" /> Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live requests */}
          <div className="bg-white rounded-3xl border border-amber-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <h2 className="font-display text-sm font-bold text-warm-900">
                Live Service Requests
              </h2>
            </div>

            {liveRequests.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-warm-700">No live requests right now</p>
              </div>
            ) : (
              <div className="space-y-2">
                {liveRequests.slice(0, 6).map((r) => (
                  <div
                    key={r._id}
                    className="p-3 rounded-xl bg-cream-50 border border-cream-200 hover:border-amber-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-mono font-bold text-warm-700">
                        {r.requestId || 'SR-' + r._id.slice(-4)}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColor(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="font-bold text-warm-900 text-xs">
                      {serviceLabel(r.serviceType)}
                    </p>
                    <p className="text-[10px] text-warm-700">
                      {r.user?.city || r.location?.address || '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate('/admin/reports')}
              className="mt-4 w-full py-2.5 rounded-xl bg-cream-50 hover:bg-amber-50 text-warm-700 hover:text-amber-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              View All Requests <FaArrowRight className="text-[10px]" />
            </button>
          </div>
        </div>

        {/* ============ INFO BANNER ============ */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-cream-100 border border-amber-200 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
            <FaShieldAlt />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-warm-900 text-sm mb-1">
              Logged in as {adminName}
            </h4>
            <p className="text-xs text-warm-700 leading-relaxed">
              Role:{' '}
              <strong className="text-amber-700 capitalize">{user?.role}</strong> •
              Session active • All actions are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard