const BrandMarquee = ({ brands = [] }) => {
  // Don't render if no brands
  if (!brands || brands.length === 0) return null

  // Duplicate for seamless loop (2x for smooth wrap)
  const doubled = [...brands, ...brands]

  return (
    <section className="relative py-10 overflow-hidden bg-white border-y border-slate-100">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400">
            Shop by Brand
          </p>
        </div>
      </div>

      {/* Marquee row */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <div className="flex gap-16 animate-marquee whitespace-nowrap w-max">
          {doubled.map((brand, i) => (
            <div
              key={`${brand._id || brand.slug || i}-${i}`}
              className="flex-shrink-0 flex items-center justify-center px-2"
            >
              <span className="text-2xl md:text-3xl font-bold text-slate-300 hover:text-teal-600 transition-colors duration-300 cursor-pointer select-none">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

export default BrandMarquee