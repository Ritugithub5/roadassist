import {
  FaCar, FaMotorcycle, FaTruck, FaCheck, FaEdit, FaTrash, FaGasPump,
} from 'react-icons/fa'
import VehicleHealthBar from './VehicleHealthBar'

const typeIcons = {
  car: <FaCar />,
  bike: <FaMotorcycle />,
  suv: <FaCar />,
  truck: <FaTruck />,
}

const VehicleListItem = ({ vehicle, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 hover:border-brand-300 transition-all p-4 flex items-center gap-4">
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-2xl shadow-md flex-shrink-0">
        {typeIcons[vehicle.type] || <FaCar />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-display font-bold text-ink-900 truncate">
            {vehicle.name}
          </h3>
          {vehicle.isDefault && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold uppercase">
              <FaCheck className="text-[8px]" /> Default
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-ink-500 flex-wrap">
          <span className="font-mono font-bold text-ink-700">{vehicle.plate}</span>
          <span className="flex items-center gap-1">
            <FaGasPump className="text-brand-500 text-[10px]" />
            {vehicle.fuel}
          </span>
          <span>• {vehicle.year}</span>
          {vehicle.odometer > 0 && <span>• {vehicle.odometer.toLocaleString()} km</span>}
        </div>
      </div>

      {/* Health */}
      <div className="hidden md:block w-40">
        {vehicle.healthScore > 0 && (
          <VehicleHealthBar score={vehicle.healthScore} size="sm" />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {!vehicle.isDefault && (
          <button
            onClick={() => onSetDefault(vehicle._id)}
            className="hidden md:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg bg-ink-50 hover:bg-brand-50 text-ink-700 hover:text-brand-600 transition-colors"
          >
            Set Default
          </button>
        )}
        <button
          onClick={() => onEdit(vehicle)}
          className="w-9 h-9 rounded-lg bg-ink-50 hover:bg-brand-50 flex items-center justify-center text-ink-600 hover:text-brand-600 transition-colors"
        >
          <FaEdit className="text-xs" />
        </button>
        <button
          onClick={() => onDelete(vehicle)}
          className="w-9 h-9 rounded-lg bg-ink-50 hover:bg-red-50 flex items-center justify-center text-ink-600 hover:text-red-500 transition-colors"
        >
          <FaTrash className="text-xs" />
        </button>
      </div>
    </div>
  )
}

export default VehicleListItem