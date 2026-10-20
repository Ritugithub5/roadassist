import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaSearch, FaUser, FaUserShield, FaTools,
  FaStore, FaCar, FaBan, FaCheckCircle, FaEye, FaEnvelope,
  FaTimes, FaCheck, FaCalendarAlt, FaMapMarkerAlt,
  FaHourglassHalf, FaUndo, FaSpinner, FaPhone,
} from 'react-icons/fa'
import Toast from '../components/Toast'
import API from '../utils/api'

const roleConfig = {
  driver: {
    label: 'Driver',
    icon: <FaCar />,
    color: 'from-blue-500 to-blue-600',
  },
  mechanic: {
    label: 'Mechanic',
    icon: <FaTools />,
    color: 'from-emerald-500 to-emerald-600',
  },
  seller: {
    label: 'Seller',
    icon: <FaStore />,
    color: 'from-purple-500 to-purple-600',
  },
  admin: {
    label: 'Admin',
    icon: <FaUserShield />,
    color: 'from-amber-500 to-orange-500',
  },
}

const AdminUsers = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: '', type: 'error' })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedUser, setSelectedUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  // ============ FETCH USERS ============
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/admin/users')
      setUsers(data.data || [])
    } catch (error) {
      console.error('Fetch users error:', error)
      setToast({
        message: error.response?.data?.message || 'Failed to load users',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ============ STATS ============
  const stats = useMemo(
    () => [
      {
        id: 'total',
        label: 'Total Users',
        value: users.length,
        icon: '👥',
        color: 'from-amber-500 to-orange-500',
      },
      {
        id: 'drivers',
        label: 'Drivers',
        value: users.filter((u) => u.role === 'driver').length,
        icon: '🚗',
        color: 'from-blue-500 to-blue-600',
      },
      {
        id: 'mechanics',
        label: 'Mechanics',
        value: users.filter((u) => u.role === 'mechanic').length,
        icon: '🔧',
        color: 'from-emerald-500 to-emerald-600',
      },
      {
        id: 'sellers',
        label: 'Sellers',
        value: users.filter((u) => u.role === 'seller').length,
        icon: '🛒',
        color: 'from-purple-500 to-purple-600',
      },
    ],
    [users]
  )

  const roleFilters = [
    { id: 'all', label: 'All Users' },
    { id: 'driver', label: 'Drivers' },
    { id: 'mechanic', label: 'Mechanics' },
    { id: 'seller', label: 'Sellers' },
    { id: 'admin', label: 'Admins' },
  ]

  const statusFilters = [
    'All',
    'Active',
    'Suspended',
    'Pending Verification',
  ]

  // ============ FILTER + SORT ============
  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(search)
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      const matchStatus = statusFilter === 'All' || u.status === statusFilter
      return matchSearch && matchRole && matchStatus
    })

    if (sortBy === 'name')
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'recent')
      list = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    return list
  }, [users, search, roleFilter, statusFilter, sortBy])

  // ============ ACTIONS ============
  const handleView = (u) => {
    setSelectedUser(u)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedUser(null)
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/admin/users/${id}/status`, { status: newStatus })
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: newStatus } : u))
      )
      setToast({ message: `User status updated`, type: 'success' })
      if (selectedUser?._id === id) {
        setSelectedUser({ ...selectedUser, status: newStatus })
      }
      setConfirmAction(null)
    } catch (error) {
      setToast({ message: 'Failed to update status', type: 'error' })
    }
  }

  // ============ HELPERS (SAFE) ============
  const statusStyle = (status) => {
    if (status === 'Active')
      return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (status === 'Suspended')
      return 'bg-red-50 text-red-600 border-red-100'
    return 'bg-amber-50 text-amber-700 border-amber-100'
  }

  const statusIcon = (status) => {
    if (status === 'Active') return <FaCheckCircle className="text-[8px]" />
    if (status === 'Suspended') return <FaBan className="text-[8px]" />
    return <FaHourglassHalf className="text-[8px]" />
  }

  const formatDate = (date) => {
    if (!date) return '—'
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return '—'
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
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

        {/* ============ HEADER ============ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-3">
              <FaUserShield className="text-amber-700 text-xs" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                Admin · User Management
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-1">
              Manage Users
            </h1>
            <p className="text-sm text-warm-700">
              {users.length} total users • Drivers, mechanics, sellers, and admins
            </p>
          </div>
        </div>

        {/* ============ STATS ============ */}
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
                  {s.value.toLocaleString()}
                </p>
                <p className="text-xs text-warm-700 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ============ FILTERS ============ */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 mb-6 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-700 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-11 pr-4 py-3 text-sm text-warm-900 placeholder-warm-700/60 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
              />
            </div>

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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 text-sm font-semibold text-warm-800 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="recent">Recently Joined</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {roleFilters.map((rf) => (
              <button
                key={rf.id}
                onClick={() => setRoleFilter(rf.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  roleFilter === rf.id
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-white text-warm-700 border-cream-200 hover:border-amber-300 hover:text-amber-700'
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>
        </div>

        {/* ============ TABLE ============ */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-amber-100 p-12 text-center">
            <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
            <p className="text-warm-700">Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-amber-100 p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-warm-900 mb-2">
              No users found
            </h3>
            <p className="text-warm-700 text-sm mb-6">
              Try a different search or clear filters.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setRoleFilter('all')
                setStatusFilter('All')
              }}
              className="text-amber-700 font-semibold text-sm hover:text-amber-800"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block bg-white rounded-2xl border border-amber-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-cream-50 border-b border-cream-200">
                  <tr>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      City
                    </th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-left px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-4 py-4 text-[10px] font-bold text-warm-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const rc = roleConfig[u.role] || roleConfig.driver
                    return (
                      <tr
                        key={u._id}
                        className="border-b border-cream-100 hover:bg-cream-50/60 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {getInitials(u.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-warm-900 text-sm truncate">
                                {u.name}
                              </p>
                              <p className="text-[10px] text-warm-700 truncate">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-br ${rc.color} text-white shadow-sm`}
                          >
                            <span className="text-[9px]">{rc.icon}</span>
                            {rc.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-warm-800">{u.city || '—'}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-warm-900">
                            {formatDate(u.createdAt)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyle(
                              u.status
                            )}`}
                          >
                            {statusIcon(u.status)}
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleView(u)}
                              className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-amber-100 flex items-center justify-center text-warm-700 hover:text-amber-700 transition-colors"
                              title="View"
                            >
                              <FaEye className="text-xs" />
                            </button>
                            {u.status === 'Active' && u.role !== 'admin' && (
                              <button
                                onClick={() =>
                                  setConfirmAction({ type: 'suspend', user: u })
                                }
                                className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-red-50 flex items-center justify-center text-warm-700 hover:text-red-600 transition-colors"
                                title="Suspend"
                              >
                                <FaBan className="text-xs" />
                              </button>
                            )}
                            {u.status === 'Suspended' && (
                              <button
                                onClick={() => handleStatusChange(u._id, 'Active')}
                                className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-emerald-50 flex items-center justify-center text-warm-700 hover:text-emerald-600 transition-colors"
                                title="Reactivate"
                              >
                                <FaUndo className="text-xs" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-3">
              {filtered.map((u) => {
                const rc = roleConfig[u.role] || roleConfig.driver
                return (
                  <div
                    key={u._id}
                    onClick={() => handleView(u)}
                    className="bg-white rounded-2xl border border-amber-100 p-4 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {getInitials(u.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-warm-900 text-sm truncate">
                          {u.name}
                        </p>
                        <p className="text-[10px] text-warm-700 truncate">
                          {u.email}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusStyle(
                          u.status
                        )}`}
                      >
                        {u.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gradient-to-br ${rc.color} text-white`}
                      >
                        {rc.icon} {rc.label}
                      </span>
                      <span className="text-[11px] text-warm-700">{u.city}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ============ DRAWER ============ */}
      {drawerOpen && selectedUser && (
        <>
          <div
            onClick={handleCloseDrawer}
            className="fixed inset-0 bg-warm-900/40 backdrop-blur-sm z-40"
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-cream-50 z-50 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="relative">
                <button
                  onClick={handleCloseDrawer}
                  className="absolute top-0 right-0 w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30"
                >
                  <FaTimes />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-xl font-bold">
                    {getInitials(selectedUser.name)}
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold">
                      {selectedUser.name}
                    </h2>
                    <p className="text-xs opacity-90">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/20 backdrop-blur">
                    {(roleConfig[selectedUser.role] || roleConfig.driver).icon}{' '}
                    {(roleConfig[selectedUser.role] || roleConfig.driver).label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/20 backdrop-blur">
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <Section title="Contact Info">
                <DetailRow
                  icon={<FaEnvelope />}
                  label="Email"
                  value={selectedUser.email || '—'}
                />
                <DetailRow
                  icon={<FaPhone />}
                  label="Phone"
                  value={selectedUser.phone || '—'}
                />
                <DetailRow
                  icon={<FaMapMarkerAlt />}
                  label="City"
                  value={selectedUser.city || '—'}
                />
              </Section>

              <Section title="Account">
                <DetailRow
                  icon={<FaCalendarAlt />}
                  label="Joined"
                  value={formatDate(selectedUser.createdAt)}
                />
                <DetailRow
                  icon={<FaUserShield />}
                  label="Verified"
                  value={selectedUser.verified ? 'Yes ✓' : 'No'}
                />
              </Section>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {selectedUser.status === 'Active' &&
                  selectedUser.role !== 'admin' && (
                    <button
                      onClick={() =>
                        setConfirmAction({
                          type: 'suspend',
                          user: selectedUser,
                        })
                      }
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                    >
                      <FaBan /> Suspend User
                    </button>
                  )}
                {selectedUser.status === 'Suspended' && (
                  <button
                    onClick={() =>
                      handleStatusChange(selectedUser._id, 'Active')
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <FaUndo /> Reactivate User
                  </button>
                )}
                {selectedUser.status === 'Pending Verification' && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedUser._id, 'Active')
                      }
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      <FaCheck /> Approve & Verify
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedUser._id, 'Suspended')
                      }
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                    >
                      <FaTimes /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ============ CONFIRM MODAL ============ */}
      {confirmAction && (
        <>
          <div
            onClick={() => setConfirmAction(null)}
            className="fixed inset-0 bg-warm-900/50 backdrop-blur-sm z-[60]"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto">
              <div className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 bg-amber-50 text-amber-600">
                  <FaBan />
                </div>
                <h2 className="font-display text-lg font-bold text-warm-900 mb-2">
                  Suspend User?
                </h2>
                <p className="text-sm text-warm-700 mb-6">
                  Suspend <strong>{confirmAction.user.name}</strong>? They won't be
                  able to log in.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 py-3 rounded-xl border-2 border-cream-200 text-warm-700 font-semibold hover:border-cream-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(confirmAction.user._id, 'Suspended')
                    }
                    className="flex-1 py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-lg transition-all active:scale-95"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            </div>
          </div>
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

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-amber-600 flex-shrink-0 text-xs">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-wider font-bold text-warm-700">
        {label}
      </p>
      <p className="text-sm font-semibold text-warm-900 truncate">{value}</p>
    </div>
  </div>
)

export default AdminUsers