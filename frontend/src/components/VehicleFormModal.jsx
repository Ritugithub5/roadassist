import { useState, useEffect } from 'react'
import { FaTimes, FaCar, FaCheck, FaSpinner } from 'react-icons/fa'
import { vehicleTypes, fuelTypes } from '../data/vehicles'

const emptyForm = {
  name: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  type: 'car',
  fuel: 'petrol',
  color: '',
  odometer: 0,
}

const VehicleFormModal = ({ open, onClose, onSave, editingVehicle, saving }) => {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return

    if (editingVehicle) {
      console.log('📋 Pre-filling form with:', editingVehicle.name)
      setForm({
        name: editingVehicle.name || '',
        make: editingVehicle.make || '',
        model: editingVehicle.model || '',
        year: editingVehicle.year || new Date().getFullYear(),
        plate: editingVehicle.plate || '',
        type: editingVehicle.type || 'car',
        fuel: editingVehicle.fuel || 'petrol',
        color: editingVehicle.color || '',
        odometer: editingVehicle.odometer || 0,
      })
    } else {
      console.log('📋 New empty form')
      setForm(emptyForm)
    }
    setErrors({})
  }, [editingVehicle, open])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Vehicle name is required'
    if (!form.make.trim()) e.make = 'Make is required'
    if (!form.plate.trim()) e.plate = 'Registration number is required'
    if (!form.year || form.year < 1990 || form.year > new Date().getFullYear() + 1) {
      e.year = 'Enter a valid year'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('🎯 Form submit triggered')
    console.log('📦 Form data:', form)

    if (!validate()) {
      console.log('❌ Validation failed')
      return
    }

    console.log('✅ Validation passed, calling onSave')
    onSave(form)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={saving ? undefined : onClose}
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm animate-fadeIn"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-ink-100 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white">
              <FaCar />
            </div>
            <div>
              <h2 className="font-display font-bold text-ink-900 text-lg">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <p className="text-xs text-ink-500">
                {editingVehicle ? 'Update the details below' : 'Fill in your vehicle details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-9 h-9 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Vehicle Type */}
          <div>
            <label className="text-xs font-semibold text-ink-700 mb-2 block uppercase tracking-wider">
              Vehicle Type
            </label>
            <div className="grid grid-cols-4 gap-3">
              {vehicleTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleChange('type', t.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    form.type === t.id
                      ? 'border-brand-500 bg-brand-50 shadow-md shadow-brand-500/20'
                      : 'border-ink-100 hover:border-brand-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <p className={`text-[11px] font-bold ${
                    form.type === t.id ? 'text-brand-600' : 'text-ink-600'
                  }`}>
                    {t.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Name + Make */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink-700 mb-2 block uppercase tracking-wider">
                Vehicle Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Honda City"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                    : 'border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-700 mb-2 block uppercase tracking-wider">
                Make / Brand *
              </label>
              <input
                type="text"
                value={form.make}
                onChange={(e) => handleChange('make', e.target.value)}
                placeholder="e.g., Honda"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                  errors.make
                    ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                    : 'border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                }`}
              />
              {errors.make && <p className="text-xs text-red-500 mt-1.5">{errors.make}</p>}
            </div>
          </div>

          {/* Model + Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink-700 mb-2 block uppercase tracking-wider">
                Model
              </label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="e.g., City ZX"
                className="w-full border border-ink-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-700 mb-2 block uppercase tracking-wider">
                Year *
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => handleChange('year', parseInt(e.target.value) || '')}
                min="1990"
                max={new Date().getFullYear() + 1}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                  errors.year
                    ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                    : 'border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                }`}
              />
              {errors.year && <p className="text-xs text-red-500 mt-1.5">{errors.year}</p>}
            </div>
          </div>

          {/* Plate */}
          <div>
            <label className="text-xs font-semibold text-ink-700 mb-2 block uppercase tracking-wider">
              Registration Number *
            </label>
            <input
              type="text"
              value={form.plate}
              onChange={(e) => handleChange('plate', e.target.value.toUpperCase())}
              placeholder="e.g., OD-02-AB-1234"
              className={`w-full border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none transition-all ${
                errors.plate
                  ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                  : 'border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
              }`}
            />
            {errors.plate && <p className="text-xs text-red-500 mt-1.5">{errors.plate}</p>}
          </div>

          {/* Fuel + Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink-700 mb-2 block uppercase tracking-wider">
                Fuel Type
              </label>
              <select
                value={form.fuel}
                onChange={(e) => handleChange('fuel', e.target.value)}
                className="w-full border border-ink-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all bg-white cursor-pointer"
              >
                {fuelTypes.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-700 mb-2 block uppercase tracking-wider">
                Color
              </label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="e.g., Pearl White"
                className="w-full border border-ink-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-ink-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-3.5 rounded-xl border-2 border-ink-200 text-ink-700 font-semibold hover:border-ink-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-lg shadow-brand-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaCheck /> {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out }
        .animate-slideUp { animation: slideUp 0.3s ease-out }
      `}</style>
    </div>
  )
}

export default VehicleFormModal