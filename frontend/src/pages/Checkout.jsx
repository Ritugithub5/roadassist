import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  FaArrowLeft, FaMapMarkerAlt, FaUser, FaPhone, FaHome,
  FaSpinner, FaCheckCircle, FaShoppingBag, FaTruck, FaShieldAlt,
} from 'react-icons/fa'
import Toast from '../components/Toast'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'

const Checkout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [cart, setCart] = useState([])
  const [placing, setPlacing] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [placedOrder, setPlacedOrder] = useState(null)

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    city: user?.city || '',
    state: '',
    pincode: '',
  })

  // ============ LOAD CART ============
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCart(parsed)
        if (parsed.length === 0) {
          // Redirect if empty
          navigate('/store')
        }
      } catch {
        navigate('/store')
      }
    } else {
      navigate('/store')
    }
  }, [navigate])

  // ============ TOTALS ============
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = subtotal > 999 ? 0 : subtotal > 0 ? 49 : 0
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  // ============ HANDLE CHANGE ============
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // ============ VALIDATION ============
  const validate = () => {
    if (!form.name.trim()) return 'Full name is required'
    if (form.phone.length !== 10) return 'Enter a valid 10-digit phone number'
    if (!form.line1.trim()) return 'Address line is required'
    if (!form.city.trim()) return 'City is required'
    if (!form.state.trim()) return 'State is required'
    if (form.pincode.length !== 6) return 'Enter a valid 6-digit pincode'
    return null
  }

  // ============ PLACE ORDER ============
  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    const err = validate()
    if (err) {
      setToast({ message: err, type: 'error' })
      return
    }

    setPlacing(true)
    try {
      const payload = {
        items: cart.map((i) => ({ product: i._id, qty: i.qty })),
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          line1: form.line1,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        paymentMode: 'COD',
      }

      const { data } = await API.post('/orders', payload)

      // Clear cart
      localStorage.removeItem('cart')
      setCart([])
      setPlacedOrder(data.data)

      setToast({ message: 'Order placed successfully!', type: 'success' })
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to place order'
      setToast({ message: msg, type: 'error' })
    } finally {
      setPlacing(false)
    }
  }

  // ============ SUCCESS SCREEN ============
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border border-amber-100 p-8 md:p-12 text-center shadow-xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl mb-6 shadow-lg shadow-emerald-500/30">
              <FaCheckCircle />
            </div>

            <h1 className="font-display text-3xl font-bold text-warm-900 mb-2">
              Order Placed! 🎉
            </h1>
            <p className="text-warm-700 mb-8">
              Your order has been successfully placed. We'll notify you when it ships.
            </p>

            <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200 mb-6 text-left">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-cream-200">
                <span className="text-xs text-warm-700 uppercase tracking-wider font-bold">
                  Order ID
                </span>
                <span className="font-mono font-bold text-amber-700 text-lg">
                  {placedOrder.orderId}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-700">Items</span>
                  <span className="font-semibold text-warm-900">
                    {placedOrder.items.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-700">Subtotal</span>
                  <span className="font-semibold text-warm-900">
                    ₹{placedOrder.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-700">Shipping</span>
                  <span className="font-semibold text-emerald-600">
                    {placedOrder.shipping === 0 ? 'FREE' : `₹${placedOrder.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-700">GST</span>
                  <span className="font-semibold text-warm-900">
                    ₹{placedOrder.tax.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-cream-200 flex justify-between">
                  <span className="font-bold text-warm-900">Total</span>
                  <span className="font-bold text-amber-700 text-lg">
                    ₹{placedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6 flex items-start gap-3 text-left">
              <FaTruck className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-900 mb-0.5">
                  Estimated Delivery
                </p>
                <p className="text-xs text-blue-700">
                  3-5 business days · Cash on Delivery
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/store')}
                className="flex-1 py-3 rounded-xl border-2 border-amber-200 text-amber-700 font-semibold hover:bg-amber-50 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============ EMPTY CART ============
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-3xl text-amber-500 mx-auto mb-4" />
          <p className="text-warm-700">Redirecting...</p>
        </div>
      </div>
    )
  }

  // ============ MAIN FORM ============
  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/store')}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Store
        </button>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-8">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-6">
          {/* LEFT — Shipping form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact */}
            <div className="bg-white rounded-2xl border border-amber-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <FaUser />
                </div>
                <div>
                  <h2 className="font-display font-bold text-warm-900">
                    Contact Details
                  </h2>
                  <p className="text-xs text-warm-700">
                    We'll use this for delivery updates
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-1.5 block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-700 text-xs" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full border border-cream-200 rounded-xl pl-10 pr-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-1.5 block">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-700 text-xs" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      placeholder="10-digit mobile"
                      className="w-full border border-cream-200 rounded-xl pl-10 pr-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-amber-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h2 className="font-display font-bold text-warm-900">
                    Shipping Address
                  </h2>
                  <p className="text-xs text-warm-700">
                    Where should we deliver?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-1.5 block">
                    Address Line *
                  </label>
                  <div className="relative">
                    <FaHome className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-700 text-xs" />
                    <input
                      type="text"
                      value={form.line1}
                      onChange={(e) => handleChange('line1', e.target.value)}
                      placeholder="Flat / House no, Street, Area"
                      className="w-full border border-cream-200 rounded-xl pl-10 pr-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-1.5 block">
                      City *
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="City"
                      className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-1.5 block">
                      State *
                    </label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="State"
                      className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-1.5 block">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) =>
                        handleChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))
                      }
                      placeholder="6-digit"
                      className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment method (COD only for now) */}
            <div className="bg-white rounded-2xl border border-amber-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <FaShieldAlt />
                </div>
                <div>
                  <h2 className="font-display font-bold text-warm-900">
                    Payment Method
                  </h2>
                  <p className="text-xs text-warm-700">
                    Pay when you receive
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div>
                  <p className="font-bold text-emerald-900 text-sm">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-emerald-700">
                    Pay in cash when your order arrives
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-amber-100 p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-4">
                <FaShoppingBag className="text-amber-600" />
                <h2 className="font-display font-bold text-warm-900">
                  Order Summary
                </h2>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-5 pb-5 border-b border-cream-200 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-cream-100 overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          {item.emoji}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-warm-900 line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-warm-700 mt-0.5">
                        Qty: {item.qty} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-warm-900 flex-shrink-0">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between text-warm-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-warm-700">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-warm-700">
                  <span>GST (18%)</span>
                  <span className="font-semibold">₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-cream-200 flex justify-between mb-5">
                <span className="font-bold text-warm-900">Total</span>
                <span className="font-display font-bold text-xl text-amber-700">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {placing ? (
                  <>
                    <FaSpinner className="animate-spin" /> Placing Order...
                  </>
                ) : (
                  <>
                    Place Order · ₹{total.toLocaleString()}
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-warm-700 mt-4">
                🔒 Secure checkout · 7-day returns
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout