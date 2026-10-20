const VeehoTile = ({ img, title, delay = 1 }) => {
  return (
    <div
      className="
        group
        bg-white
        rounded-2xl
        border border-ink-100
        shadow-[0_4px_15px_-6px_rgba(15,23,42,0.1)]
        hover:shadow-[0_12px_30px_-12px_rgba(15,23,42,0.18)]
        hover:-translate-y-1
        transition-all duration-500
        flex flex-col items-center justify-center
        text-center
        w-full aspect-square
        p-3
        relative
        overflow-visible
      "
    >
      {/* Floating Emoji Image */}
      <div className={`relative mb-2 animate-float-emoji delay-${delay}`}>
        <img
          src={img}
          alt={title}
          className="
            w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14
            object-contain
            drop-shadow-[0_6px_10px_rgba(15,23,42,0.2)]
            group-hover:scale-115
            group-hover:-rotate-6
            transition-transform duration-500
            select-none pointer-events-none
          "
          loading="lazy"
          draggable={false}
        />

        {/* Soft shadow beneath */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2/3 h-2 bg-ink-900/15 blur-lg rounded-full -z-10" />
      </div>

      {/* Label */}
      <p className="text-[10px] md:text-[11px] lg:text-xs font-bold text-ink-900 leading-tight relative z-10">
        {title}
      </p>
    </div>
  )
}

export default VeehoTile