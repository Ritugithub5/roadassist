import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaShoppingBag, FaRupeeSign, FaBox, FaStar, FaArrowRight,
  FaSignOutAlt, FaBell, FaCog, FaShieldAlt, FaChartLine,
  FaBoxOpen, FaPlus, FaStore,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'

const SellerDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)

  const userName = user?.name || 'Seller'
  const firstName = userName.split(' ')[0]
  const initials = userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [productsRes, ordersRes, earningsRes] = await Promise.all([
          API.get('/products/seller/me'),
          API.get('/orders/seller'),
          API.get('/orders/seller/earnings'),
        ])
        setProducts(productsRes.data.data)
        setOrders(ordersRes.data.data)
        setEarnings(earningsRes.data.data)
      } catch (error) {
        console.error('Failed to load dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const stats = [
    { icon: <FaShoppingBag />, label: 'Total Orders', value: earnings?.totalOrders || 0, color: 'from-blue-500 to-blue-600', trend: '+18%' },
    { icon: <FaRupeeSign />, label: 'Revenue', value: `₹${((earnings?.totalRevenue || 0) / 100000).toFixed(2)}L`, color: 'from-emerald-500 to-emerald-600', trend: '+24%' },
    { icon: <FaBox />, label: 'Products Listed', value: products.length, color: 'from-purple-500 to-purple-600', trend: '+5' },
    { icon: <FaStar />, label: 'Store Rating', value: '4.7', color: 'from-amber-500 to-orange-500', trend: '248 reviews' },
  ]

  const orderStatusStyle = (status) => {
    if (status === 'Delivered') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (status === 'Shipped') return 'bg-blue-50 text-blue-700 border-blue-100'
    if (status === 'Pending') return 'bg-amber-50 text-amber-700 border-amber-100'
    if (status === 'Cancelled') return 'bg-red-50 text-red-600 border-red-100'
    return 'bg-cream-100 text-warm-700 border-cream-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-warm-700">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-display font-bold text-lg shadow-lg shadow-purple-500/30">
              {initials}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 mb-2">
                <FaStore className="text-purple-700 text-[10px]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-purple-800">
                  Seller Account
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-warm-900">
                Welcome back, {firstName} 🛒
              </h1>
              <p className="text-sm text-warm-700">{userName} • Manage your store</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 text-sm font-semibold transition-all"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="relative bg-white rounded-2xl border border-amber-100 p-5 overflow-hidden group">
              <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${s.color} opacity-10 rounded-full blur-2xl`} />
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

        {/* Quick Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '🛒', label: 'Orders', desc: `${orders.filter(o => o.status === 'Pending').length} pending`, path: '/seller/orders', color: 'from-blue-500 to-blue-600', badge: orders.filter(o => o.status === 'Pending').length },
            { icon: '💰', label: 'Earnings', desc: 'View payouts', path: '/seller/earnings', color: 'from-emerald-500 to-emerald-600' },
            { icon: '⚙️', label: 'Store Profile', desc: 'Business info', path: '/seller/profile', color: 'from-amber-500 to-orange-500' },
          ].map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.path)}
              className="relative bg-white rounded-2xl border border-amber-100 p-4 text-left hover:border-amber-300 hover:-translate-y-0.5 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white text-lg shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-warm-900 text-sm truncate">{a.label}</p>
                  <p className="text-[10px] text-warm-700 truncate flex items-center gap-1">
                    {a.desc} <FaArrowRight className="text-[8px]" />
                  </p>
                </div>
                {a.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {a.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-amber-100 overflow-hidden mb-6">
          <div className="p-5 border-b border-cream-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <FaShoppingBag />
              </div>
              <div>
                <h2 className="font-display font-bold text-warm-900">Recent Orders</h2>
                <p className="text-xs text-warm-700">Latest customer purchases</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/seller/orders')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              View All <FaArrowRight className="text-[9px]" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-bold text-warm-900 mb-1">No orders yet</p>
              <p className="text-xs text-warm-700">Orders will appear here when customers buy</p>
            </div>
          ) : (
            <div className="divide-y divide-cream-100">
              {orders.slice(0, 5).map((o) => (
                <div key={o._id} className="p-4 flex items-center gap-3 hover:bg-cream-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center text-warm-700 flex-shrink-0">
                    <FaBox />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-mono text-[10px] font-bold text-warm-700">{o.orderId}</p>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${orderStatusStyle(o.status)}`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-warm-900 truncate">
                      {o.buyer?.name || 'Customer'} • {o.items.length} item{o.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="font-bold text-warm-900 text-sm flex-shrink-0">
                    ₹{o.total.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
            <FaShieldAlt />
          </div>
          <div>
            <h4 className="font-bold text-warm-900 text-sm mb-1">
              Logged in as {userName}
            </h4>
            <p className="text-xs text-warm-700">
              Store status: <strong className="text-emerald-600">Active</strong> • Payouts every Friday • Commission: 10%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard