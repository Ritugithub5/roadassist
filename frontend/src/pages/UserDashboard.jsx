import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaCar, FaClipboardList, FaPlus, FaMapMarkerAlt, FaClock,
  FaRupeeSign, FaSignOutAlt, FaBell, FaCog, FaArrowRight,
  FaTools, FaShieldAlt, FaStar, FaHistory, FaSpinner,
  FaMotorcycle, FaCheckCircle, FaTimesCircle,
} from 'react-icons/fa'
import Button from '../components/Button'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'

const UserDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [vehicles, setVehicles] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: '', type: 'error' })

  const userName = user?.name || 'Driver'
  const firstName = userName.split(' ')[0]
  const initials = userName
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [vehiclesRes, requestsRes] = await Promise.all([
          API.get('/vehicles').catch(() => ({ data: { data: [] } })),
          API.get('/services/my').catch(() => ({ data: { data: [] } })),
        ])
        setVehicles(vehiclesRes.data.data || [])
        setRequests(requestsRes.data.data || [])
      } catch (error) {
        setToast({
          message: error.response?.data?.message || 'Failed to load dashboard',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ============ STATS FROM REAL DATA ============
  const totalSpent = requests
    .filter((r) => r.status === 'Completed')
    .reduce((sum, r) => sum + (r.total || 0), 0)

  const completedCount = requests.filter((r) => r.status === 'Completed').length
  const cancelledCount = requests.filter((r) => r.status === 'Cancelled').length

  const avgRating =
    requests.filter((r) => r.rating > 0).length > 0
      ? (
          requests.filter((r) => r.rating > 0).reduce((s, r) => s + r.rating, 0) /
          requests.filter((r) => r.rating > 0).length
        ).toFixed(1)
      : '0.0'

  const stats = [
    {
      icon: <FaClipboardList />,
      label: 'Total Requests',
      value: requests.length,
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: <FaCar />,
      label: 'Vehicles',
      value: vehicles.length,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <FaRupeeSign />,
      label: 'Total Spent',
      value: `₹${totalSpent.toLocaleString()}`,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: <FaStar />,
      label: 'Avg Rating Given',
      value: avgRating,
      color: 'from-purple-500 to-purple-600',
    },
  ]

  const quickActions = [
    {
      icon: <FaTools />,
      label: 'New Request',
      desc: 'Get roadside help',
      path: '/request-service',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: <FaCar />,
      label: 'My Garage',
      desc: `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} saved`,
      path: '/vehicles',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <FaHistory />,
      label: 'Service History',
      desc: `${requests.length} request${requests.length !== 1 ? 's' : ''}`,
      path: '/history',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: <FaShieldAlt />,
      label: 'Insurance',
      desc: 'Compare & save',
      path: '/insurance',
      color: 'from-purple-500 to-purple-600',
    },
  ]

  const recentRequests = requests.slice(0, 4)

  const statusColors = {
    Requested: 'bg-blue-50 text-blue-700 border-blue-100',
    Accepted: 'bg-amber-50 text-amber-700 border-amber-100',
    'En Route': 'bg-purple-50 text-purple-700 border-purple-100',
    Arrived: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Cancelled: 'bg-red-50 text-red-600 border-red-100',
  }

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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 mb-2">
                <FaShieldAlt className="text-blue-700 text-[10px]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-blue-800 capitalize">
                  {user?.role || 'Driver'}
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-warm-900">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-sm text-warm-700">
                {userName} • {user?.city || 'Bangalore'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/history')}
              className="relative w-11 h-11 rounded-xl bg-white border border-amber-200 hover:border-amber-400 flex items-center justify-center text-warm-700 hover:text-amber-700 transition-colors"
              title="Notifications"
            >
              <FaBell />
              {requests.filter((r) => ['Accepted', 'En Route', 'Arrived'].includes(r.status)).length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            <button
              onClick={() => navigate('/vehicles')}
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
          {stats.map((s, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl border border-amber-100 p-5 hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${s.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg shadow-md mb-3`}>
                  {s.icon}
                </div>
                <p className="font-display text-2xl font-bold text-warm-900 mb-0.5">{s.value}</p>
                <p className="text-xs text-warm-700 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ============ QUICK ACTIONS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.path)}
              className="group relative bg-white rounded-2xl border border-amber-100 p-5 text-left hover:border-amber-300 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white text-lg mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                {a.icon}
              </div>
              <p className="font-bold text-warm-900 text-sm mb-0.5">{a.label}</p>
              <p className="text-xs text-warm-700 mb-3">{a.desc}</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 group-hover:gap-2 transition-all">
                Open <FaArrowRight className="text-[8px]" />
              </div>
            </button>
          ))}
        </div>

        {/* ============ MAIN GRID ============ */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* My Vehicles */}
            <div className="bg-white rounded-3xl border border-amber-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                    <FaCar />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-warm-900">My Vehicles</h2>
                    <p className="text-xs text-warm-700">
                      {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} in your garage
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/vehicles')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  Manage <FaArrowRight className="text-[9px]" />
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🚗</div>
                  <p className="font-semibold text-warm-900 mb-1">No vehicles yet</p>
                  <p className="text-xs text-warm-700 mb-4">
                    Add a vehicle to request service
                  </p>
                  <Button size="sm" onClick={() => navigate('/vehicles')}>
                    <FaPlus /> Add Vehicle
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {vehicles.slice(0, 3).map((v) => (
                      <div
                        key={v._id}
                        className="flex items-center justify-between p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-amber-200 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                            {v.type === 'bike' ? <FaMotorcycle /> : <FaCar />}
                          </div>
                          <div>
                            <p className="font-bold text-warm-900 text-sm">{v.name}</p>
                            <p className="text-[10px] text-warm-700 font-mono">
                              {v.plate} • {v.type}
                            </p>
                          </div>
                        </div>
                        {v.isDefault && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/vehicles')}
                    className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-400 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <FaPlus className="text-xs" /> Add New Vehicle
                  </button>
                </>
              )}
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-3xl border border-amber-100 overflow-hidden">
              <div className="p-5 border-b border-cream-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                    <FaHistory />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-warm-900">Recent Requests</h2>
                    <p className="text-xs text-warm-700">
                      Your last {recentRequests.length} service{recentRequests.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/history')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  View All <FaArrowRight className="text-[9px]" />
                </button>
              </div>

              {recentRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-semibold text-warm-900 mb-1">No requests yet</p>
                  <p className="text-xs text-warm-700 mb-4">
                    Request help to see your history here
                  </p>
                  <Button size="sm" onClick={() => navigate('/request-service')}>
                    Request Service
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-cream-50 border-b border-cream-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">ID</th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">Service</th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">Date</th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">Status</th>
                        <th className="text-right px-4 py-3 text-[10px] font-bold text-warm-700 uppercase tracking-wider">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map((r) => (
                        <tr
                          key={r._id}
                          onClick={() => navigate(`/track/${r._id}`)}
                          className="border-b border-cream-100 hover:bg-cream-50/60 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3 font-mono text-xs font-bold text-warm-800">
                            {r.requestId || 'SR-' + r._id.slice(-4)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-warm-900 capitalize">
                            {r.serviceType}
                          </td>
                          <td className="px-4 py-3 text-xs text-warm-700">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[r.status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-bold text-warm-900">
                            ₹{(r.total || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Emergency + Account */}
          <div className="space-y-6">
            {/* Emergency card */}
            <div className="relative bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-6 text-white overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                  <FaTools className="text-2xl" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Emergency?</h3>
                <p className="text-white/90 text-sm mb-5">
                  Get roadside help in under 15 minutes.
                </p>
                <button
                  onClick={() => navigate('/request-service')}
                  className="w-full py-3 rounded-xl bg-white text-red-600 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  Request Help Now <FaArrowRight className="text-xs" />
                </button>

                <div className="mt-5 pt-5 border-t border-white/20 space-y-2 text-xs">
                  <div className="flex items-center gap-2 opacity-90">
                    <FaClock /> Avg. 15 min response
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <FaMapMarkerAlt /> 500+ verified partners
                  </div>
                </div>
              </div>
            </div>

            {/* Account card */}
            <div className="bg-white rounded-3xl border border-amber-100 p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-4">
                Account
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cream-100 flex items-center justify-center text-amber-600 text-xs">👤</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-bold text-warm-700">Name</p>
                    <p className="text-sm font-semibold text-warm-900 truncate">{userName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cream-100 flex items-center justify-center text-amber-600 text-xs">✉️</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-bold text-warm-700">Email</p>
                    <p className="text-sm font-semibold text-warm-900 truncate">{user?.email || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cream-100 flex items-center justify-center text-amber-600 text-xs">📱</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-bold text-warm-700">Phone</p>
                    <p className="text-sm font-semibold text-warm-900 truncate">{user?.phone || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cream-100 flex items-center justify-center text-amber-600 text-xs">📍</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-bold text-warm-700">City</p>
                    <p className="text-sm font-semibold text-warm-900 truncate">{user?.city || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-gradient-to-br from-amber-50 to-cream-100 rounded-3xl border border-amber-200 p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                Summary
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-700">Completed</span>
                  <span className="font-bold text-emerald-700">{completedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-700">Cancelled</span>
                  <span className="font-bold text-red-600">{cancelledCount}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-amber-200">
                  <span className="text-warm-700 font-bold">Total Spent</span>
                  <span className="font-bold text-amber-700">₹{totalSpent.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard