const SectionHeading = ({ badge, title, subtitle, center = true }) => {
  return (
    <div className={`${center ? 'text-center mx-auto' : ''} max-w-3xl mb-14`}>
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase mb-4 border border-brand-100">
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-5xl font-bold text-ink-900 mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-ink-500 text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeading