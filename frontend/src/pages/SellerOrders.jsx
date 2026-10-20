import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaBox, FaSpinner, FaCheck, FaTruck,
  FaTimes, FaEye, FaMapMarkerAlt, FaPhone, FaUser,
} from 'react-icons/fa'
import API from '../utils/api'

const SellerOrders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  // ============ FETCH ORDERS ============
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/seller')
        setOrders(data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // ============ UPDATE STATUS ============
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status })
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      )
      if (selected?._id === id) setSelected({ ...selected, status })
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed')
    }
  }

  // ============ STATUS STYLES ============
  const statusStyle = (s) => {
    if (s === 'Delivered') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (s === 'Shipped') return 'bg-blue-50 text-blue-700 border-blue-100'
    if (s === 'Confirmed') return 'bg-purple-50 text-purple-700 border-purple-100'
    if (s === 'Pending') return 'bg-amber-50 text-amber-700 border-amber-100'
    if (s === 'Cancelled') return 'bg-red-50 text-red-600 border-red-100'
    return 'bg-cream-100 text-warm-700 border-cream-200'
  }

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate('/seller')}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-warm-900 mb-1">
              Orders
            </h1>
            <p className="text-warm-700 text-sm">
              {orders.length} total • {orders.filter((o) => o.status === 'Pending').length} pending
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                filter === s
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                  : 'bg-white text-warm-700 border-cream-200 hover:border-amber-300 hover:text-amber-700'
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

        {/* Orders */}
        {loading ? (
          <div className="text-center py-20">
            <FaSpinner className="animate-spin text-3xl text-amber-500 mx-auto mb-3" />
            <p className="text-warm-700">Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-amber-200 p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="font-display text-xl font-bold text-warm-900 mb-2">
              No orders found
            </h2>
            <p className="text-warm-700 text-sm">
              {filter === 'all'
                ? 'Orders will appear here when customers buy your products.'
                : `No ${filter} orders right now.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => (
              <div
                key={o._id}
                className="bg-white rounded-2xl border border-amber-100 p-5 hover:border-amber-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Left: order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-warm-700">
                        {o.orderId}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusStyle(o.status)}`}
                      >
                        {o.status}
                      </span>
                      <span className="text-[10px] text-warm-700">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="font-bold text-warm-900 text-sm mb-1 flex items-center gap-2">
                      <FaUser className="text-warm-700 text-xs" />
                      {o.buyer?.name || 'Customer'}
                      {o.buyer?.phone && (
                        <>
                          <span className="text-warm-700 font-normal">•</span>
                          <span className="text-warm-700 text-xs font-medium">
                            {o.buyer.phone}
                          </span>
                        </>
                      )}
                    </p>

                    <p className="text-xs text-warm-700">
                      {o.items.length} item{o.items.length > 1 ? 's' : ''} •{' '}
                      {o.items.map((i) => i.name).join(', ').slice(0, 60)}
                      {o.items.map((i) => i.name).join(', ').length > 60 ? '…' : ''}
                    </p>
                  </div>

                  {/* Right: amount + actions */}
                  <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-warm-900">
                        ₹{o.total.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-warm-700">
                        {o.items.length} item{o.items.length > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(o)}
                        className="w-9 h-9 rounded-lg bg-cream-100 hover:bg-amber-100 flex items-center justify-center text-warm-700 hover:text-amber-700 transition-colors"
                        title="View details"
                      >
                        <FaEye className="text-xs" />
                      </button>

                      {o.status === 'Pending' && (
                        <button
                          onClick={() => updateStatus(o._id, 'Confirmed')}
                          className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold hover:shadow-lg transition-all"
                        >
                          Confirm
                        </button>
                      )}
                      {o.status === 'Confirmed' && (
                        <button
                          onClick={() => updateStatus(o._id, 'Shipped')}
                          className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold hover:shadow-lg transition-all flex items-center gap-1"
                        >
                          <FaTruck className="text-[10px]" /> Ship
                        </button>
                      )}
                      {o.status === 'Shipped' && (
                        <button
                          onClick={() => updateStatus(o._id, 'Delivered')}
                          className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold hover:shadow-lg transition-all flex items-center gap-1"
                        >
                          <FaCheck className="text-[10px]" /> Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============ DETAIL DRAWER ============ */}
      {selected && (
        <>
          <div
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-warm-900/40 backdrop-blur-sm z-40 animate-fadeIn"
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-lg bg-cream-50 z-50 shadow-2xl flex flex-col animate-slideIn">
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="relative">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-0 right-0 w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30"
                >
                  <FaTimes />
                </button>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-1">
                  Order Details
                </p>
                <h2 className="font-display text-2xl font-bold mb-1">{selected.orderId}</h2>
                <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur">
                  {selected.status}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Buyer */}
              <div className="bg-white rounded-2xl border border-amber-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                  Buyer
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {selected.buyer?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'B'}
                  </div>
                  <div>
                    <p className="font-bold text-warm-900 text-sm">
                      {selected.buyer?.name || 'Customer'}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-warm-700 mt-0.5">
                      {selected.buyer?.phone && (
                        <span className="flex items-center gap-1">
                          <FaPhone className="text-[9px]" /> {selected.buyer.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping address */}
              {selected.shippingAddress && (
                <div className="bg-white rounded-2xl border border-amber-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-2">
                    Shipping Address
                  </p>
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-amber-600 text-sm mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-warm-800 leading-relaxed">
                      <p className="font-semibold">{selected.shippingAddress.name}</p>
                      <p className="text-xs text-warm-700">{selected.shippingAddress.line1}</p>
                      <p className="text-xs text-warm-700">
                        {selected.shippingAddress.city}, {selected.shippingAddress.state} - {selected.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="bg-white rounded-2xl border border-amber-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                  Items ({selected.items.length})
                </p>
                <div className="space-y-2">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-cream-100 last:border-0">
                      <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-xl flex-shrink-0">
                        {item.emoji || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-warm-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-warm-700">Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm font-bold text-warm-900">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="bg-white rounded-2xl border border-amber-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                  Payment
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-warm-700">
                    <span>Subtotal</span>
                    <span>₹{selected.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-warm-700">
                    <span>Shipping</span>
                    <span>{selected.shipping === 0 ? 'FREE' : `₹${selected.shipping}`}</span>
                  </div>
                  {selected.tax > 0 && (
                    <div className="flex justify-between text-warm-700">
                      <span>GST</span>
                      <span>₹{selected.tax.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-cream-200 flex justify-between font-bold text-warm-900">
                    <span>Total</span>
                    <span className="text-amber-700 text-lg">
                      ₹{selected.total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-warm-700 pt-1">
                    Payment: {selected.paymentMode || 'Pending'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {selected.status !== 'Delivered' && selected.status !== 'Cancelled' && (
                <div className="space-y-2">
                  {selected.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(selected._id, 'Confirmed')}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        Confirm Order
                      </button>
                      <button
                        onClick={() => updateStatus(selected._id, 'Cancelled')}
                        className="w-full py-3 rounded-xl bg-white border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                  {selected.status === 'Confirmed' && (
                    <button
                      onClick={() => updateStatus(selected._id, 'Shipped')}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FaTruck /> Mark as Shipped
                    </button>
                  )}
                  {selected.status === 'Shipped' && (
                    <button
                      onClick={() => updateStatus(selected._id, 'Delivered')}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FaCheck /> Mark as Delivered
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out }
        .animate-slideIn { animation: slideIn 0.3s ease-out }
      `}</style>
    </div>
  )
}

export default SellerOrders