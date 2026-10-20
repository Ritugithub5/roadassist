import { FaBell, FaExclamationTriangle, FaCalendarAlt, FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const RemindersPanel = ({ reminders, onViewAll }) => {
  const navigate = useNavigate()

  if (!reminders || reminders.length === 0) return null

  const urgencyStyles = {
    high: 'bg-red-50 border-red-200 text-red-700',
    medium: 'bg-amber-50 border-amber-200 text-amber-700',
    low: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  }

  // Action handler based on reminder type
  const handleReminderClick = (type) => {
    const t = type.toLowerCase()
    if (t.includes('insurance')) navigate('/insurance')
    else if (t.includes('service')) navigate('/request-service')
    else if (t.includes('puc')) navigate('/insurance')
  }

  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-5 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
            <FaBell />
          </div>
          <div>
            <h2 className="font-display font-bold text-warm-900">Upcoming Reminders</h2>
            <p className="text-xs text-warm-700">{reminders.length} actions needed</p>
          </div>
        </div>

        {/* ✅ FIXED: now calls onViewAll */}
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
        >
          View All <FaArrowRight className="text-[10px]" />
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map((r) => (
          <div
            key={r.id}
            onClick={() => handleReminderClick(r.type)}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${urgencyStyles[r.urgency]}`}
          >
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              {r.urgency === 'high' ? <FaExclamationTriangle /> : <FaCalendarAlt />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{r.type}</p>
              <p className="text-[11px] opacity-80 truncate">
                {r.vehicle} • Due {r.date}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold">{r.days}</p>
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">days</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RemindersPanel