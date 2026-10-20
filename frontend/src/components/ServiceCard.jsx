const ServiceCard = ({ icon, title, description, price, tag }) => {
  return (
    <div className="group relative bg-white p-8 rounded-3xl border border-ink-100 hover:border-brand-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/10 overflow-hidden">
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/0 to-brand-50/0 group-hover:from-brand-50/50 group-hover:to-transparent transition-all duration-500" />

      {/* Tag */}
      {tag && (
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-ink-900 text-white">
          {tag}
        </span>
      )}

      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-3xl mb-6 shadow-lg shadow-brand-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          {icon}
        </div>

        <h3 className="font-display text-xl font-bold text-ink-900 mb-3">
          {title}
        </h3>
        <p className="text-ink-500 text-sm leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-ink-100">
          <span className="text-brand-600 font-bold">{price}</span>
          <span className="text-xs text-ink-400 font-medium group-hover:text-brand-500 transition-colors">
            Learn more →
          </span>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard