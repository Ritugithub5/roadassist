const VehicleHealthBar = ({ score, size = 'md' }) => {
  const getColor = () => {
    if (score >= 85) return { bg: 'bg-emerald-500', text: 'text-emerald-600', label: 'Excellent' }
    if (score >= 70) return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Good' }
    if (score >= 50) return { bg: 'bg-orange-500', text: 'text-orange-600', label: 'Fair' }
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'Poor' }
  }

  const colors = getColor()
  const height = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider">
          Health
        </span>
        <span className={`text-xs font-bold ${colors.text}`}>
          {score}% · {colors.label}
        </span>
      </div>
      <div className={`w-full bg-ink-100 rounded-full ${height} overflow-hidden`}>
        <div
          className={`h-full ${colors.bg} rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export default VehicleHealthBar