const QuickStatsBanner = ({ stats }) => {
  const colorMap = {
    brand: 'from-brand-500 to-brand-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-orange-500',
    blue: 'from-blue-500 to-blue-600',
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="relative bg-white rounded-2xl border border-ink-100 p-5 hover:border-brand-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
        >
          <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${colorMap[stat.color]} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

          <div className="relative flex items-start justify-between mb-2">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[stat.color]} flex items-center justify-center text-white text-lg shadow-md`}>
              {stat.icon}
            </div>
          </div>

          <p className="text-2xl font-bold text-ink-900 mb-0.5">{stat.value}</p>
          <p className="text-xs text-ink-500 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default QuickStatsBanner