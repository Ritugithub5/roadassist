import { FaExclamationTriangle, FaTrash, FaTimes } from 'react-icons/fa'

const ConfirmDeleteModal = ({ open, onClose, onConfirm, vehicle }) => {
  if (!open || !vehicle) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm animate-fadeIn"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-slideUp overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-600" />

        <div className="p-6 md:p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-500 text-2xl mb-5">
            <FaExclamationTriangle />
          </div>

          <h2 className="font-display text-xl font-bold text-ink-900 mb-2">
            Delete Vehicle?
          </h2>
          <p className="text-sm text-ink-500 mb-6">
            Are you sure you want to remove{' '}
            <strong className="text-ink-900">{vehicle.name}</strong> (
            {vehicle.plate})? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-ink-200 text-ink-700 font-semibold hover:border-ink-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(vehicle._id)  
                onClose()
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl transition-all active:scale-95"
            >
              <FaTrash className="text-xs" /> Delete
            </button>
          </div>
        </div>
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

export default ConfirmDeleteModal