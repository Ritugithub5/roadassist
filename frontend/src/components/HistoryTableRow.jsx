import {
  FaTools, FaCarBattery, FaTruckPickup, FaGasPump, FaCarSide,
  FaCheckCircle, FaTimesCircle, FaEye, FaDownload,
} from 'react-icons/fa'
import { MdOutlineTireRepair } from 'react-icons/md'

const serviceIcons = {
  battery: <FaCarBattery />,
  tire: <MdOutlineTireRepair />,
  towing: <FaTruckPickup />,
  fuel: <FaGasPump />,
  breakdown: <FaTools />,
  inspection: <FaCarSide />,
}

const HistoryTableRow = ({ item, onView, onDownload }) => {
  const isCompleted = item.status === 'Completed'

  return (
    <tr className="border-b border-ink-100 hover:bg-cream-50/60 transition-colors group">
      <td className="px-4 py-4">
        <span className="font-mono text-xs font-bold text-warm-800">{item.id}</span>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm flex-shrink-0 shadow-sm">
            {serviceIcons[item.serviceId] || <FaTools />}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-warm-900 text-sm truncate">{item.service}</p>
            <p className="text-[11px] text-warm-700 truncate">{item.vehicle}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-warm-900">{item.mechanic}</p>
        <p className="text-[11px] text-warm-700">⭐ {item.mechanicRating}</p>
      </td>

      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-warm-900">{item.dateLabel}</p>
        <p className="text-[11px] text-warm-700">{item.time}</p>
      </td>

      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-red-50 text-red-600 border-red-100'
          }`}
        >
          {isCompleted ? <FaCheckCircle className="text-[9px]" /> : <FaTimesCircle className="text-[9px]" />}
          {item.status}
        </span>
      </td>

      <td className="px-4 py-4 text-right">
        <p className="font-bold text-warm-900 text-sm">₹{item.total.toLocaleString()}</p>
        {isCompleted && item.tax > 0 && (
          <p className="text-[10px] text-warm-700">incl. GST</p>
        )}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => onView(item)}
            className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-amber-100 flex items-center justify-center text-warm-700 hover:text-amber-700 transition-colors"
            title="View details"
          >
            <FaEye className="text-xs" />
          </button>
          {isCompleted && (
            <button
              onClick={() => onDownload(item)}
              className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-amber-100 flex items-center justify-center text-warm-700 hover:text-amber-700 transition-colors"
              title="Download invoice"
            >
              <FaDownload className="text-xs" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default HistoryTableRow