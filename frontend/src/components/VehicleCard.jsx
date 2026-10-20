import {
  FaCar, FaMotorcycle, FaTruck, FaGasPump, FaCheck,
  FaEdit, FaTrash, FaCalendarAlt, FaPalette, FaTachometerAlt,
} from 'react-icons/fa'
import VehicleHealthBar from './VehicleHealthBar'

const typeIcons = {
  car: <FaCar />,
  bike: <FaMotorcycle />,
  suv: <FaCar />,
  truck: <FaTruck />,
}

const fuelLabels = {
  petrol: '⛽ Petrol',
  diesel: '🛢️ Diesel',
  cng: '💨 CNG',
  electric: '⚡ Electric',
  hybrid: '🔋 Hybrid',
}

const VehicleCard = ({ vehicle, onEdit, onDelete, onSetDefault }) => {
  return (
    <article className="group relative bg-white rounded-2xl border border-ink-100 hover:border-brand-300 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/10 overflow-hidden">
      {vehicle.isDefault && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md shadow-brand-500/30">
            <FaCheck className="text-[8px]" /> Default
          </span>
        </div>
      )}

      <div className="h-1 bg-gradient-to-r from-brand-500 to-brand-600" />

      <div className="p-5">
        {/* Icon + Name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
            {typeIcons[vehicle.type] || <FaCar />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-ink-900 text-base leading-tight mb-1 truncate">
              {vehicle.name}
            </h3>
            <p className="text-xs text-ink-500">
              {vehicle.make} • {vehicle.year}
            </p>
          </div>
        </div>

        {/* Plate + Odometer */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-900 text-white font-mono text-xs font-bold">
            {vehicle.plate}
          </div>
          {vehicle.odometer > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ink-50 text-ink-600 text-xs font-semibold">
              <FaTachometerAlt className="text-[10px]" />
              {vehicle.odometer.toLocaleString()} km
            </div>
          )}
        </div>

        {/* Health Bar */}
        {vehicle.healthScore > 0 && (
          <div className="mb-4">
            <VehicleHealthBar score={vehicle.healthScore} />
          </div>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="flex items-center gap-2 text-ink-600">
            <FaGasPump className="text-brand-500 text-[10px]" />
            <span>{fuelLabels[vehicle.fuel] || vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-600">
            <FaPalette className="text-brand-500 text-[10px]" />
            <span className="truncate">{vehicle.color || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-600 col-span-2">
            <FaCalendarAlt className="text-brand-500 text-[10px]" />
            <span>Last service: {vehicle.lastService || 'No service yet'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-ink-100">
          {!vehicle.isDefault ? (
            <button
              onClick={() => onSetDefault(vehicle._id)}
              className="flex-1 text-xs font-semibold py-2 rounded-lg bg-ink-50 hover:bg-brand-50 text-ink-700 hover:text-brand-600 transition-colors"
            >
              Set Default
            </button>
          ) : (
            <div className="flex-1 text-xs font-semibold py-2 rounded-lg bg-emerald-50 text-emerald-600 text-center">
              ✓ Primary
            </div>
          )}

          <button
            onClick={() => onEdit(vehicle)}
            className="w-9 h-9 rounded-lg bg-ink-50 hover:bg-brand-50 flex items-center justify-center text-ink-600 hover:text-brand-600 transition-colors"
            title="Edit"
          >
            <FaEdit className="text-xs" />
          </button>
          <button
            onClick={() => onDelete(vehicle)}
            className="w-9 h-9 rounded-lg bg-ink-50 hover:bg-red-50 flex items-center justify-center text-ink-600 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default VehicleCard