const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 active:scale-95 whitespace-nowrap'

  const variants = {
    primary:
      'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5',
    secondary:
      'bg-ink-900 text-white hover:bg-ink-800 shadow-lg shadow-ink-900/20 hover:-translate-y-0.5',
    outline:
      'border-2 border-ink-200 text-ink-900 hover:border-brand-500 hover:text-brand-600 bg-white/50 backdrop-blur',
    ghost:
      'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
    glass:
      'glass text-white border border-white/20 hover:bg-white/20',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {children}
    </button>
  )
}

export default Button