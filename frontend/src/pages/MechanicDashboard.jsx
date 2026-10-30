import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaMapMarkerAlt, FaClock, FaRupeeSign, FaStar, FaCheck, FaTimes,
  FaTools, FaArrowRight, FaBell, FaPhone, FaComment,
  FaChartLine, FaCog, FaWallet, FaTrophy,
  FaCheckCircle, FaHourglassHalf, FaSpinner,
  FaPlay,
} from 'react-icons/fa'
import Toast from '../components/Toast'
import NotificationBell from '../components/NotificationBell'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'

const MechanicDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [online, setOnline] = useState(false)
  const [mechanicProfile, setMechanicProfile] = useState(null)
  const [newJobs, setNewJobs] = useState([])
  const [progressJobs, setProgressJobs] = useState([])
  const [completedJobs, setCompletedJobs] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('new')
  const [toast, setToast] = useState({ message: '', type: 'error' })
  const [refreshing, setRefreshing] = useState(false)

  // ✅ Fetch ALL jobs at once to prevent backend filtering bugs
  const fetchData = async () => {
    try {
      const [profileRes, jobsRes, earningsRes] = await Promise.all([
        API.get('/mechanics/me').catch(() => ({ data: { data: null } })),
        API.get('/services/mechanic/jobs').catch(() => ({ data: { data: [] } })), // No ?tab=
        API.get('/mechanics/me/earnings').catch(() => ({ data: { data: null } })),
      ])

      if (profileRes.data.data) {
        setMechanicProfile(profileRes.data.data)
        setOnline(profileRes.data.data.isOnline)
      }

      const allJobs = jobsRes.data.data || []
      
      // ✅ Filter on the frontend
      setNewJobs(allJobs.filter((j) => j.status === 'Requested'))
      setProgressJobs(allJobs.filter((j) => ['Accepted', 'En Route', 'Arrived'].includes(j.status)))
      setCompletedJobs(allJobs.filter((j) => j.status === 'Completed'))
      
      setEarnings(earningsRes.data.data || null)
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to load dashboard',
        type: 'error',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleToggleOnline = async () => {
    try {
      const { data } = await API.put('/mechanics/me/online')
      setOnline(data.data.isOnline)
      setToast({
        message: data.data.isOnline ? 'You are now online' : 'You are now offline',
        type: 'success',
      })
    } catch (error) {
      setToast({ message: 'Failed to toggle status', type: 'error' })
    }
  }

  const handleAcceptJob = async (jobId) => {
    try {
      await API.put(`/services/${jobId}/accept`)
      setToast({ message: 'Job accepted!', type: 'success' })
      setTimeout(fetchData, 500)
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to accept job',
        type: 'error',
      })
    }
  }

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      await API.put(`/services/${jobId}/status`, { status: newStatus })
      setToast({ message: `Marked as ${newStatus}`, type: 'success' })
      setTimeout(fetchData, 500)
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to update status',
        type: 'error',
      })
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const firstName = user?.name?.split(' ')[0] || 'Mechanic'
  const garageName = mechanicProfile?.garageName || ''

  const tabs = [
    { id: 'new', label: 'New Requests', count: newJobs.length },
    { id: 'progress', label: 'In Progress', count: progressJobs.length },
    { id: 'completed', label: 'Completed', count: completedJobs.length },
  ]

  const currentJobs =
    activeTab === 'new'
      ? newJobs
      : activeTab === 'progress'
      ? progressJobs
      : completedJobs

  const thisMonthEarnings = earnings?.thisMonthEarnings || 0
  const totalJobsCount = earnings?.totalJobs || 0

  const stats = [
    {
      icon: <FaTools />,
      label: 'Jobs Completed',
      value: totalJobsCount,
      trend: totalJobsCount > 0 ? '+Active' : 'NEW',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: <FaRupeeSign />,
      label: 'This Month',
      value: `₹${thisMonthEarnings.toLocaleString()}`,
      trend: thisMonthEarnings > 0 ? '+Income' : '—',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: <FaHourglassHalf />,
      label: 'Pending Jobs',
      value: newJobs.length + progressJobs.length,
      trend: newJobs.length > 0 ? 'LIVE' : '—',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <FaStar />,
      label: 'Rating',
      value: mechanicProfile?.rating ? mechanicProfile.rating.toFixed(1) : '0.0',
      trend: `${totalJobsCount} JOBS`,
      color: 'from-yellow-500 to-amber-500',
    },
  ]

  const quickLinks = [
    {
      label: 'Edit Profile',
      path: '/mechanic/profile',
      icon: <FaCog />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'My Earnings',
      path: '/mechanic/earnings',
      icon: <FaWallet />,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Service History',
      path: '/mechanic/earnings',
      icon: <FaChartLine />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Notifications',
      path: '#',
      icon: <FaBell />,
      color: 'from-amber-500 to-orange-500',
      badge: newJobs.length,
    },
  ]

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-3">
              <FaTools className="text-amber-700 text-xs" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                Mechanic Dashboard
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-1">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-sm text-warm-700">
              {garageName && <strong>{garageName}</strong>}
              {garageName && ' • '}
              {newJobs.length > 0 ? (
                <>
                  You have{' '}
                  <strong className="text-amber-700">
                    {newJobs.length} new job request{newJobs.length !== 1 ? 's' : ''}
                  </strong>{' '}
                  waiting
                </>
              ) : (
                <>No new job requests right now</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-amber-200 text-warm-800 text-sm font-semibold hover:border-amber-400 hover:bg-amber-50 transition-all disabled:opacity-50"
            >
              <FaSpinner className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>

            <button
              onClick={handleToggleOnline}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold transition-all border-2 ${
                online
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-cream-100 text-warm-700 border-cream-200'
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full ${
                  online ? 'bg-emerald-500 animate-pulse' : 'bg-warm-400'
                }`}
              />
              {online ? 'Online' : 'Offline'}
            </button>
          </div>
        </div>

        {!online && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white flex-shrink-0">
              <FaBell />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm mb-1">
                You're offline — no jobs will be shown
              </h4>
              <p className="text-xs text-amber-800">
                Toggle the "Online" switch above to start receiving job requests.
              </p>
            </div>
          </div>
        )}

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
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg shadow-md`}
                  >
                    {s.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      s.trend === 'LIVE'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : s.trend === 'NEW' || s.trend === '—'
                        ? 'bg-cream-100 text-warm-700'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}
                  >
                    {s.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-warm-900 mb-0.5">{s.value}</p>
                <p className="text-xs text-warm-700 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => link.path !== '#' && navigate(link.path)}
              className="relative bg-white rounded-2xl border border-amber-100 p-4 text-left hover:border-amber-300 hover:-translate-y-0.5 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-warm-900">{link.label}</p>
                  <p className="text-[10px] text-warm-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open <FaArrowRight className="text-[8px]" />
                  </p>
                </div>
                {link.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {link.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-amber-100 overflow-hidden">
              <div className="flex border-b border-cream-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-4 text-sm font-bold transition-all relative ${
                      activeTab === tab.id
                        ? 'text-amber-700'
                        : 'text-warm-700 hover:text-warm-900'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {tab.label}
                      {tab.count > 0 && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            activeTab === tab.id
                              ? 'bg-amber-500 text-white'
                              : tab.id === 'new'
                              ? 'bg-red-500 text-white animate-pulse'
                              : 'bg-cream-100 text-warm-700'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </span>
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-3">
                {currentJobs.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="text-4xl mb-3">
                      {activeTab === 'new'
                        ? '📭'
                        : activeTab === 'progress'
                        ? '🔧'
                        : '✅'}
                    </div>
                    <p className="font-bold text-warm-900 mb-1">
                      {activeTab === 'new'
                        ? 'No new jobs'
                        : activeTab === 'progress'
                        ? 'No jobs in progress'
                        : 'No completed jobs'}
                    </p>
                    <p className="text-xs text-warm-700">
                      {activeTab === 'new'
                        ? online
                          ? 'New requests will appear here automatically'
                          : 'Go online to start receiving jobs'
                        : 'Jobs will show up here'}
                    </p>
                  </div>
                ) : (
                  currentJobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onAccept={() => handleAcceptJob(job._id)}
                      onStatusUpdate={(status) => handleUpdateStatus(job._id, status)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-amber-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700">
                    This Month
                  </p>
                  <p className="font-display text-2xl font-bold text-warm-900">
                    ₹{thisMonthEarnings.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                  <FaChartLine />
                </div>
              </div>

              <button
                onClick={() => navigate('/mechanic/earnings')}
                className="w-full py-2.5 rounded-xl bg-cream-50 hover:bg-amber-50 text-warm-800 hover:text-amber-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                View Full Earnings <FaArrowRight className="text-[10px]" />
              </button>
            </div>

            <div
              className={`relative rounded-3xl p-5 text-white overflow-hidden ${
                totalJobsCount >= 5
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                  : 'bg-gradient-to-br from-blue-500 to-blue-600'
              }`}
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <FaTrophy className="text-white text-lg" />
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">
                    Performance
                  </p>
                </div>
                <p className="font-display text-2xl font-bold mb-1">
                  {totalJobsCount >= 50
                    ? 'Top 5%'
                    : totalJobsCount >= 20
                    ? 'Top 20%'
                    : totalJobsCount >= 5
                    ? 'Rising'
                    : 'New'}
                </p>
                <p className="text-xs opacity-90 mb-4">
                  {totalJobsCount > 0
                    ? "You're climbing the ranks"
                    : 'Complete jobs to unlock performance stats'}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="opacity-90">Total Jobs</span>
                    <span className="font-bold">{totalJobsCount}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${Math.min(totalJobsCount * 2, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="opacity-90">Rating</span>
                    <span className="font-bold">
                      {mechanicProfile?.rating ? mechanicProfile.rating.toFixed(1) : 'New'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{
                        width: `${((mechanicProfile?.rating || 0) / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {mechanicProfile && (
              <div className="bg-white rounded-3xl border border-amber-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                  Your Profile
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    {user?.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-warm-900 text-sm truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-warm-700 truncate">
                      {mechanicProfile.specialization}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-warm-700">
                  <p>📍 {mechanicProfile.address}</p>
                  <p>⭐ {mechanicProfile.experience} years experience</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const JobCard = ({ job, onAccept, onStatusUpdate }) => {
  const customerName = job.user?.name || 'Customer'
  const vehicleName = job.vehicle?.name || 'Vehicle'
  const vehiclePlate = job.vehicle?.plate || ''
  const serviceLabel =
    {
      breakdown: 'Breakdown Repair',
      towing: 'Towing Service',
      battery: 'Battery Jump-Start',
      tire: 'Flat Tire Repair',
      fuel: 'Fuel Delivery',
      inspection: 'Vehicle Inspection',
    }[job.serviceType] || job.serviceType

  const isUrgent = ['battery', 'tire', 'fuel'].includes(job.serviceType)
  const status = job.status
  const [accepting, setAccepting] = useState(false)

  const handleAcceptClick = async () => {
    setAccepting(true)
    await onAccept()
    setAccepting(false)
  }

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isUrgent
          ? 'border-red-200 bg-gradient-to-br from-red-50/50 to-white'
          : 'border-cream-200 hover:border-amber-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <FaTools />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-mono text-[10px] font-bold text-warm-700">
                {job.requestId || 'JOB-' + job._id.slice(-4)}
              </span>
              {isUrgent && status === 'Requested' && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                  Urgent
                </span>
              )}
            </div>
            <h3 className="font-bold text-warm-900 text-sm truncate">
              {serviceLabel}
            </h3>
            <p className="text-[11px] text-warm-700">
              {customerName} • {vehicleName} {vehiclePlate}
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="font-display text-lg font-bold text-amber-700">
            ₹{job.total || 0}
          </p>
          <p className="text-[10px] text-warm-700">
            {job.status === 'Completed' ? 'Paid' : 'Est.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3 text-[11px] text-warm-700">
        <span className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-amber-600" />{' '}
          {job.location?.address || 'Location not set'}
        </span>
        <span className="flex items-center gap-1">
          <FaClock className="text-amber-600" /> Requested{' '}
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>

      {status === 'Requested' && (
        <div className="flex gap-2 pt-3 border-t border-cream-200">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-cream-50 hover:bg-red-50 text-warm-700 hover:text-red-600 text-xs font-semibold transition-colors">
            <FaTimes /> Decline
          </button>
          <button
            onClick={handleAcceptClick}
            disabled={accepting}
            className="flex-[2] flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md shadow-amber-500/30 hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
          >
            {accepting ? (
              <>
                <FaSpinner className="animate-spin" /> Accepting...
              </>
            ) : (
              <>
                <FaCheck /> Accept Job
              </>
            )}
          </button>
        </div>
      )}

      {['Accepted', 'En Route', 'Arrived'].includes(status) && (
        <div className="flex gap-2 pt-3 border-t border-cream-200">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-cream-50 hover:bg-amber-50 text-warm-700 hover:text-amber-700 text-xs font-semibold transition-colors">
            <FaComment /> Chat
          </button>
          {status === 'Accepted' && (
            <button
              onClick={() => onStatusUpdate('En Route')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              <FaPlay /> Start
            </button>
          )}
          {status === 'En Route' && (
            <button
              onClick={() => onStatusUpdate('Arrived')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <FaMapMarkerAlt /> Arrived
            </button>
          )}
          {status === 'Arrived' && (
            <button
              onClick={() => onStatusUpdate('Completed')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <FaCheckCircle /> Complete
            </button>
          )}
        </div>
      )}

      {status === 'Completed' && (
        <div className="flex items-center justify-between pt-3 border-t border-cream-200">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <FaCheckCircle /> Completed
          </span>
          <span className="text-xs text-warm-700">₹{job.total || 0} earned</span>
        </div>
      )}

      {status === 'Cancelled' && (
        <div className="flex items-center justify-between pt-3 border-t border-cream-200">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500">
            <FaTimes /> Cancelled
          </span>
        </div>
      )}
    </div>
  )
}

export default MechanicDashboard