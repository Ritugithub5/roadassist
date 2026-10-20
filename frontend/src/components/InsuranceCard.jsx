import { FaStar, FaCheckCircle, FaArrowRight } from 'react-icons/fa'

const InsuranceCard = ({ partner, onGetQuote }) => {
  return (
    <article className="group relative bg-white rounded-2xl border border-ink-100 hover:border-brand-300 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/10 overflow-hidden">
      {/* Top gradient accent */}
      <div className={`h-1 bg-gradient-to-r ${partner.logoColor}`} />

      {/* Tag */}
      {partner.tag && (
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-100">
          {partner.tag}
        </span>
      )}

      <div className="p-6">
        {/* Logo + Name */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${partner.logoColor} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
            {partner.logoInitial}
          </div>
          <div>
            <h3 className="font-display font-bold text-ink-900">{partner.name}</h3>
            <div className="flex items-center gap-1 text-xs">
              <FaStar className="text-yellow-500 text-[10px]" />
              <span className="font-bold text-ink-700">{partner.rating}</span>
              <span className="text-ink-400">/5</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4 pb-4 border-b border-ink-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-bold text-ink-900">
              ₹{partner.price.toLocaleString()}
            </span>
            <span className="text-sm text-ink-500">/ year</span>
          </div>
          <p className="text-xs text-ink-500 mt-1">{partner.tagline}</p>
        </div>

        {/* Claim settlement */}
        <div className="flex items-center gap-2 mb-5">
          <FaCheckCircle className="text-emerald-500 text-sm" />
          <span className="text-sm font-semibold text-ink-700">
            {partner.claimSettlement}% claim settlement
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={() => onGetQuote(partner)}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-ink-900 to-ink-800 text-white text-sm font-semibold hover:from-brand-500 hover:to-brand-600 hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-300 active:scale-95"
        >
          Get This Quote <FaArrowRight className="text-xs" />
        </button>
      </div>
    </article>
  )
}

export default InsuranceCard