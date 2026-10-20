import car1 from '../image/car.png'   // Porsche
import car2 from '../image/car1.png'  // Ferrari teal
import car3 from '../image/car2.png'  // Ferrari yellow

const RotatingCar = () => {
  const cars = [
    {
      img: car1,
      name: 'Porsche 911 GT3',
      price: '₹1.85 Cr',
      stats: [
        { label: 'Top Speed', value: '318', unit: 'km/h' },
        { label: '0 – 100', value: '3.2', unit: 's' },
        { label: 'Power', value: '510', unit: 'HP' },
        { label: 'Drive', value: 'RWD', unit: '' },
      ],
    },
    {
      img: car2,
      name: 'Ferrari 296 GTB',
      price: '₹4.05 Cr',
      stats: [
        { label: 'Top Speed', value: '330', unit: 'km/h' },
        { label: '0 – 100', value: '2.9', unit: 's' },
        { label: 'Power', value: '819', unit: 'HP' },
        { label: 'Drive', value: 'RWD', unit: '' },
      ],
    },
    {
      img: car3,
      name: 'Ferrari F8 Tributo',
      price: '₹3.90 Cr',
      stats: [
        { label: 'Top Speed', value: '340', unit: 'km/h' },
        { label: '0 – 100', value: '2.8', unit: 's' },
        { label: 'Power', value: '720', unit: 'HP' },
        { label: 'Drive', value: 'RWD', unit: '' },
      ],
    },
  ]

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">

      {/* Aurora glow */}
      <div className="animate-aurora absolute w-[560px] h-[400px] bg-gradient-radial from-brand-500/25 via-brand-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Floor glow */}
      <div className="animate-floor-glow absolute bottom-16 w-[600px] h-[140px] bg-gradient-to-t from-brand-500/25 via-brand-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Car stage */}
      <div className="relative z-10 w-[92%] max-w-3xl h-[440px] animate-car-float">
        <div className="relative w-full h-full">

          {/* Cars — absolute positioned, fade one at a time */}
          {cars.map((car, i) => (
            <img
              key={i}
              src={car.img}
              alt={car.name}
              className={`rotating-car absolute inset-0 w-full h-full object-contain rotating-car-${i + 1} drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]`}
            />
          ))}

          {/* Shine sweep */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="animate-shine absolute top-0 left-0 w-2/5 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />
          </div>
        </div>

        {/* Contact shadow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[400px] h-6 bg-black/70 rounded-full blur-2xl" />
      </div>

      {/* Info panel — one per car, fades with car */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-20 h-32">
        {cars.map((car, i) => (
          <div
            key={i}
            className={`rotating-info absolute inset-x-6 flex flex-col items-center text-center rotating-info-${i + 1}`}
          >
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">
              {car.name}
            </h3>
            <p className="text-xs text-brand-400 font-semibold tracking-[0.2em] uppercase mb-6">
              {car.price}
            </p>

            <div className="flex items-center gap-2 md:gap-3 glass-dark rounded-2xl px-2 py-2 border border-white/10 backdrop-blur-xl">
              {car.stats.map((s, j) => (
                <div
                  key={j}
                  className={`flex flex-col items-center px-4 md:px-5 py-2 ${
                    j < car.stats.length - 1 ? 'border-r border-white/10' : ''
                  }`}
                >
                  <span className="text-[9px] text-ink-400 uppercase tracking-[0.15em] font-semibold mb-1">
                    {s.label}
                  </span>
                  <span className="font-display text-sm md:text-base font-bold text-white">
                    {s.value}
                    {s.unit && (
                      <span className="text-[10px] text-ink-400 ml-1 font-normal">
                        {s.unit}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="relative h-1 w-10 rounded-full bg-white/10 overflow-hidden"
          >
            <div className={`rotating-progress-${n} absolute inset-y-0 left-0 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full`} />
          </div>
        ))}
      </div>

      {/* ✨ All rotation animations in one <style> block */}
      <style>{`
        @keyframes carCycle {
          0%, 27% { opacity: 1; transform: scale(1); }
          33%, 94% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes progressFill {
          0% { width: 0%; }
          33% { width: 100%; }
          100% { width: 100%; }
        }

        @keyframes carFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shineSweep {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(400%); opacity: 0; }
        }

        @keyframes auroraPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes floorGlow {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 1; transform: translateX(-50%) scaleX(1.1); }
        }

        /* 3 cars → 12s total cycle, 4s each */
        .rotating-car-1 { animation: carCycle 12s infinite; animation-delay: 0s; }
        .rotating-car-2 { animation: carCycle 12s infinite; animation-delay: 4s; }
        .rotating-car-3 { animation: carCycle 12s infinite; animation-delay: 8s; }

        .rotating-info-1 { animation: carCycle 12s infinite; animation-delay: 0s; }
        .rotating-info-2 { animation: carCycle 12s infinite; animation-delay: 4s; }
        .rotating-info-3 { animation: carCycle 12s infinite; animation-delay: 8s; }

        /* Progress bars — 12s cycle */
        .rotating-progress-1 { animation: progressFill 12s infinite; animation-delay: 0s; }
        .rotating-progress-2 { animation: progressFill 12s infinite; animation-delay: 4s; }
        .rotating-progress-3 { animation: progressFill 12s infinite; animation-delay: 8s; }

        .animate-car-float { animation: carFloat 6s ease-in-out infinite; }
        .animate-shine { animation: shineSweep 4s ease-in-out infinite; }
        .animate-aurora { animation: auroraPulse 6s ease-in-out infinite; }
        .animate-floor-glow { animation: floorGlow 6s ease-in-out infinite; }

        /* Start cars hidden, animate in */
        .rotating-car { opacity: 0; }
        .rotating-info { opacity: 0; }
      `}</style>
    </div>
  )
}

export default RotatingCar