import { FaStar, FaShoppingCart } from 'react-icons/fa'

const ProductCard = ({ product, onAddToCart }) => {
  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0

  return (
    <article className="group bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* ============ IMAGE AREA ============ */}
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {/* Image — real image first, emoji fallback */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}

        {/* Fallback (emoji or placeholder) */}
        <div
          className={`w-full h-full flex items-center justify-center text-6xl ${
            product.image ? 'hidden' : ''
          }`}
        >
          {product.emoji || '📦'}
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* ============ CONTENT ============ */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1 min-h-[2.5rem]">
          {product.name}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <FaStar className="text-yellow-500 text-[10px]" />
          <span className="text-xs font-semibold text-slate-900">
            {product.rating || '4.5'}
          </span>
          <span className="text-[10px] text-slate-400">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-slate-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-slate-400 line-through">
              ₹{product.mrp.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock */}
        <p
          className={`text-[10px] font-semibold mb-3 flex items-center gap-1 ${
            product.stock > 0 ? 'text-emerald-600' : 'text-red-500'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </p>

        {/* Add to Cart */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaShoppingCart className="text-[10px]" />
          Add to Cart
        </button>
      </div>
    </article>
  )
}

export default ProductCard