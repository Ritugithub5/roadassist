import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaSpinner, FaTruck, FaCheck, FaBox,
  FaMapMarkerAlt, FaPhone, FaTimes, FaEye, FaShoppingBag,
} from 'react-icons/fa'
import API from '../utils/api'

const MyOrders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  // ============ FETCH MY ORDERS ============
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const { data } = await API.get('/orders/my')
        setOrders(data.data || [])
      } catch (err) {
        console.error('Failed to load orders:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // ============ STATUS STYLES ============
  const statusStyle = (s) => {
    if (s === 'Delivered') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (s === 'Shipped') return 'bg-blue-50 text-blue-700 border-blue-100'
    if (s === 'Confirmed') return 'bg-purple-50 text-purple-700 border-purple-100'
    if (s === 'Pending') return 'bg-amber-50 text-amber-700 border-amber-100'
    if (s === 'Cancelled') return 'bg-red-50 text-red-600 border-red-100'
    return 'bg-slate-100 text-slate-700'
  }

  const statusIcon = (s) => {
    if (s === 'Delivered') return <FaCheck className="text-[9px]" />
    if (s === 'Shipped') return <FaTruck className="text-[9px]" />
    if (s === 'Confirmed') return <FaBox className="text-[9px]" />
    if (s === 'Cancelled') return <FaTimes className="text-[9px]" />
    return <FaBox className="text-[9px]" />
  }

  const stages = ['Pending', 'Confirmed', 'Shipped', 'Delivered']
  const currentStage = (status) => stages.indexOf(status)

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-3">
            <FaShoppingBag className="text-amber-700 text-xs" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
              My Orders
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-warm-900 mb-1">
            Track Your Orders
          </h1>
          <p className="text-sm text-warm-700">
            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                filter === s
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md'
                  : 'bg-white text-warm-700 border-cream-200 hover:border-amber-300'
              }`}
            >
              {s === 'all' ? 'All' : s}
              {s !== 'all' && (
                <span className="ml-1.5 text-[10px] opacity-80">
                  ({orders.filter((o) => o.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-20">
            <FaSpinner className="animate-spin text-3xl text-amber-500 mx-auto mb-3" />
            <p className="text-warm-700">Loading your orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-amber-200 p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="font-display text-xl font-bold text-warm-900 mb-2">
              No orders yet
            </h2>
            <p className="text-warm-700 text-sm mb-6">
              {filter === 'all'
                ? 'Start shopping to see your orders here.'
                : `No ${filter} orders right now.`}
            </p>
            <button
              onClick={() => navigate('/store')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Browse Store
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => (
              <div
                key={o._id}
                className="bg-white rounded-2xl border border-amber-100 p-5 hover:border-amber-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-warm-700">
                        {o.orderId}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${statusStyle(
                          o.status
                        )}`}
                      >
                        {statusIcon(o.status)}
                        {o.status}
                      </span>
                      <span className="text-[10px] text-warm-700">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="font-bold text-warm-900 text-sm mb-1">
                      {o.items.length} item{o.items.length > 1 ? 's' : ''} •{' '}
                      {o.items.map((i) => i.name).join(', ').slice(0, 50)}
                      {o.items.map((i) => i.name).join(', ').length > 50 ? '…' : ''}
                    </p>

                    <p className="text-xs text-warm-700">
                      Sold by {o.seller?.name || 'Seller'}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-warm-900">
                        ₹{o.total.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-warm-700">{o.paymentMode}</p>
                    </div>

                    <button
                      onClick={() => setSelected(o)}
                      className="px-3 py-2 rounded-lg bg-cream-100 hover:bg-amber-100 text-warm-700 hover:text-amber-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <FaEye className="text-[10px]" /> Track
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============ ORDER DETAIL DRAWER ============ */}
      {selected && (
        <>
          <div
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-warm-900/40 backdrop-blur-sm z-40"
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-lg bg-cream-50 z-50 shadow-2xl flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="relative">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-0 right-0 w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center"
                >
                  <FaTimes />
                </button>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-1">
                  Order
                </p>
                <h2 className="font-display text-2xl font-bold mb-1">
                  {selected.orderId}
                </h2>
                <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur">
                  {selected.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Tracking timeline */}
              <div className="bg-white rounded-2xl border border-amber-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-4">
                  Order Tracking
                </p>
                <div className="space-y-0">
                  {stages.map((s, i) => {
                    const currentIdx = currentStage(selected.status)
                    const done = i <= currentIdx && selected.status !== 'Cancelled'
                    const isActive = i === currentIdx && selected.status !== 'Cancelled'
                    return (
                      <div key={s} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                              done
                                ? isActive
                                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg scale-110'
                                  : 'bg-emerald-500 text-white'
                                : 'bg-cream-200 text-warm-700'
                            }`}
                          >
                            {done ? <FaCheck className="text-[10px]" /> : i + 1}
                          </div>
                          {i < stages.length - 1 && (
                            <div
                              className={`w-0.5 h-8 ${
                                done ? 'bg-emerald-500' : 'bg-cream-200'
                              }`}
                            />
                          )}
                        </div>
                        <div className="pt-1.5 pb-4">
                          <p
                            className={`font-bold text-xs ${
                              done ? 'text-warm-900' : 'text-warm-700'
                            }`}
                          >
                            {s}
                          </p>
                          {isActive && (
                            <p className="text-[10px] text-amber-600 mt-0.5">
                              Current status
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {selected.status === 'Cancelled' && (
                  <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-xs text-red-700 font-semibold">
                      This order was cancelled
                    </p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl border border-amber-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                  Items
                </p>
                <div className="space-y-2">
                  {selected.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2 border-b border-cream-100 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-xl flex-shrink-0">
                        {item.emoji || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-warm-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-warm-700">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-warm-900">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selected.shippingAddress && (
                <div className="bg-white rounded-2xl border border-amber-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-2">
                    Shipping To
                  </p>
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-amber-600 text-sm mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-warm-800 leading-relaxed">
                      <p className="font-semibold">
                        {selected.shippingAddress.name}
                      </p>
                      <p className="text-xs text-warm-700">
                        {selected.shippingAddress.line1}
                      </p>
                      <p className="text-xs text-warm-700">
                        {selected.shippingAddress.city},{' '}
                        {selected.shippingAddress.state} -{' '}
                        {selected.shippingAddress.pincode}
                      </p>
                      {selected.shippingAddress.phone && (
                        <p className="text-xs text-warm-700 flex items-center gap-1 mt-1">
                          <FaPhone className="text-[9px]" />
                          {selected.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Seller */}
              {selected.seller && (
                <div className="bg-white rounded-2xl border border-amber-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-2">
                    Sold By
                  </p>
                  <p className="font-bold text-warm-900 text-sm">
                    {selected.seller.name}
                  </p>
                  <p className="text-xs text-warm-700">
                    {selected.seller.city}
                  </p>
                  {selected.seller.phone && (
                    <p className="text-xs text-warm-700 flex items-center gap-1 mt-1">
                      <FaPhone className="text-[9px]" /> {selected.seller.phone}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-white rounded-2xl border border-amber-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                  Payment Summary
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-warm-700">
                    <span>Subtotal</span>
                    <span>₹{selected.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-warm-700">
                    <span>Shipping</span>
                    <span>
                      {selected.shipping === 0
                        ? 'FREE'
                        : `₹${selected.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-warm-700">
                    <span>GST</span>
                    <span>₹{selected.tax?.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-cream-200 flex justify-between font-bold text-warm-900">
                    <span>Total</span>
                    <span className="text-amber-700 text-lg">
                      ₹{selected.total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-warm-700 pt-1">
                    Payment: {selected.paymentMode}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

export default MyOrders