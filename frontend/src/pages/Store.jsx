import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaShoppingCart, FaTimes, FaSpinner } from 'react-icons/fa'
import ProductCard from '../components/ProductCard'
import BrandMarquee from '../components/BrandMarquee'
import API, { getImageUrl } from '../utils/api'

const Store = () => {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  // ============ FETCH FROM BACKEND ============
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          API.get('/products'),
          API.get('/categories').catch(() => ({ data: { data: [] } })),
          API.get('/brands').catch(() => ({ data: { data: [] } })),
        ])

        const formattedProducts = (productsRes.data.data || []).map((p) => ({
          ...p,
          image: getImageUrl(p.image),
        }))

        setProducts(formattedProducts)
        setCategories(categoriesRes.data.data || [])
        setBrands(brandsRes.data.data || [])
      } catch (err) {
        console.error('Failed to load store data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // ============ CART PERSISTENCE ============
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // ============ FILTER ============
  const activeCatObj = categories.find((c) => c.name === activeCategory)
  const activeCatSlug = activeCatObj?.slug

  const filtered = products.filter((p) => {
    const matchCat =
      activeCategory === 'All' || !activeCatSlug || p.category === activeCatSlug
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // ============ CART OPS ============
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id)
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          emoji: product.emoji,
          image: product.image,
          qty: 1,
        },
      ]
    })
    setCartOpen(true)
  }

  const removeFromCart = (_id) =>
    setCart((prev) => prev.filter((i) => i._id !== _id))

  const updateQty = (_id, qty) =>
    setCart((prev) => prev.map((i) => (i._id === _id ? { ...i, qty } : i)))

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = cartSubtotal > 999 ? 0 : cartSubtotal > 0 ? 49 : 0
  const tax = Math.round(cartSubtotal * 0.18)
  const finalTotal = cartSubtotal + shipping + tax

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ============ HEADER ============ */}
      <div className="pt-24 pb-8 px-6 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
            Store
          </h1>
          <p className="text-sm text-slate-500">
            Emergency kits, tools & car care essentials
          </p>
        </div>
      </div>

      {/* ============ TOOLBAR ============ */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
              />
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              <FaShoppingCart className="text-xs" />
              Cart
              {cartCount > 0 && (
                <span className="ml-1 text-[10px] font-bold bg-teal-500 px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Categories from backend */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  activeCategory === cat.name
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============ BRAND MARQUEE ============ */}
      <BrandMarquee brands={brands} />

      {/* ============ PRODUCTS ============ */}
      <div className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-5">
            <p className="text-xs text-slate-500">
              {loading ? (
                'Loading products...'
              ) : (
                <>
                  <span className="font-semibold text-slate-900">
                    {filtered.length}
                  </span>{' '}
                  {filtered.length === 1 ? 'product' : 'products'}
                </>
              )}
            </p>
          </div>

          {loading && (
            <div className="text-center py-20">
              <FaSpinner className="animate-spin text-3xl text-teal-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Loading products...</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 text-sm mb-4">
                {products.length === 0
                  ? 'No products available yet.'
                  : 'No products match your search.'}
              </p>
              {products.length > 0 && (
                <button
                  onClick={() => {
                    setSearch('')
                    setActiveCategory('All')
                  }}
                  className="text-teal-600 text-sm font-semibold hover:text-teal-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============ CART DRAWER ============ */}
      {cartOpen && (
        <>
          <div
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />

          <aside className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm">
                Cart ({cartCount})
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl mx-auto mb-4">
                    🛒
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">
                    Your cart is empty
                  </p>
                  <p className="text-xs text-slate-400 mb-5">
                    Add products to get started
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-3 p-2.5 rounded-lg border border-slate-100"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 rounded-md bg-slate-100 overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            {item.emoji || '📦'}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 line-clamp-2 mb-1">
                          {item.name}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            onClick={() =>
                              item.qty > 1
                                ? updateQty(item._id, item.qty - 1)
                                : removeFromCart(item._id)
                            }
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-teal-100 text-slate-600 hover:text-teal-700 text-[10px] font-bold flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="text-[11px] font-bold text-slate-900 w-5 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item._id, item.qty + 1)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-teal-100 text-slate-600 hover:text-teal-700 text-[10px] font-bold flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-xs font-bold text-teal-600 mt-1">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-slate-400 hover:text-red-500 text-xs self-start"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-100 p-5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ₹{cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-semibold text-teal-600">
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">GST (18%)</span>
                  <span className="font-semibold text-slate-900">
                    ₹{tax.toLocaleString()}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <span className="font-bold text-slate-900 text-sm">Total</span>
                  <span className="font-bold text-teal-600 text-sm">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>

                {cartSubtotal < 999 && (
                  <p className="text-[10px] text-center text-amber-700 bg-amber-50 py-1.5 rounded-md border border-amber-100">
                    Add ₹{(999 - cartSubtotal).toLocaleString()} more for Free shipping
                  </p>
                )}

                <button
                  onClick={() => {
                    setCartOpen(false)
                    navigate('/checkout')
                  }}
                  className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold mt-2"
                >
                  Checkout
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </div>
  )
}

export default Store