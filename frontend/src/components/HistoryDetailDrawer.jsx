import {
  FaTimes, FaMapMarkerAlt, FaCar, FaClock, FaRupeeSign,
  FaDownload, FaRedo, FaStar, FaCheckCircle, FaTimesCircle,
  FaWallet, FaHourglassHalf,
} from 'react-icons/fa'

const HistoryDetailDrawer = ({ open, onClose, item, onDownload, onReorder, onRate }) => {
  if (!item) return null

  const isCompleted = item.status === 'Completed'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-warm-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-cream-50 z-50 shadow-2xl flex flex-col transition-transform duration-500 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <FaTimes />
            </button>

            <p className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-1">
              Request Details
            </p>
            <h2 className="font-display text-2xl font-bold mb-1">{item.service}</h2>
            <p className="font-mono text-xs opacity-90">{item.id}</p>

            <div className="flex items-center gap-2 mt-4">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isCompleted
                  ? 'bg-white/20 backdrop-blur'
                  : 'bg-red-500/80'
              }`}>
                {isCompleted ? <FaCheckCircle className="text-[9px]" /> : <FaTimesCircle className="text-[9px]" />}
                {item.status}
              </span>
              <span className="text-[11px] opacity-90">{item.dateLabel} • {item.time}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mechanic */}
          <div className="bg-white rounded-2xl border border-amber-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
              Service Provider
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                {item.mechanic.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="font-bold text-warm-900">{item.mechanic}</p>
                <div className="flex items-center gap-1 text-xs mt-0.5">
                  <FaStar className="text-yellow-500 text-[10px]" />
                  <span className="font-bold text-warm-800">{item.mechanicRating}</span>
                  <span className="text-warm-700">rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-amber-100 p-4 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-1">
              Service Info
            </p>

            <DetailRow icon={<FaCar />} label="Vehicle" value={item.vehicle} />
            <DetailRow icon={<FaMapMarkerAlt />} label="Location" value={item.location} />
            <DetailRow icon={<FaClock />} label="Duration" value={item.duration} />
            <DetailRow icon={<FaWallet />} label="Payment" value={item.paymentMode} />
            {item.invoiceId !== '—' && (
              <DetailRow icon={<FaHourglassHalf />} label="Invoice" value={item.invoiceId} />
            )}
          </div>

          {/* Cost breakdown */}
          {isCompleted && (
            <div className="bg-white rounded-2xl border border-amber-100 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                Cost Breakdown
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-warm-700">
                  <span>Service charge</span>
                  <span>₹{item.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-warm-700">
                  <span>GST & fees</span>
                  <span>₹{item.tax.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-cream-200 flex justify-between font-bold text-warm-900">
                  <span>Total Paid</span>
                  <span className="text-amber-700">₹{item.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Review */}
          {item.review && (
            <div className="bg-white rounded-2xl border border-amber-100 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                Your Feedback
              </p>
              {item.rating > 0 && (
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <FaStar
                      key={n}
                      className={`text-sm ${n <= item.rating ? 'text-yellow-500' : 'text-cream-200'}`}
                    />
                  ))}
                </div>
              )}
              <p className="text-sm text-warm-800 leading-relaxed italic">
                "{item.review}"
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2.5">
            {isCompleted && (
              <>
                <button
                  onClick={() => onDownload(item)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <FaDownload /> Download Invoice
                </button>
                <button
                  onClick={() => onReorder(item)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-amber-200 text-warm-800 font-semibold hover:bg-amber-50 transition-colors"
                >
                  <FaRedo /> Rebook This Service
                </button>
                {item.rating === 0 && (
                  <button
                    onClick={() => onRate(item)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-amber-200 text-warm-800 font-semibold hover:bg-amber-50 transition-colors"
                  >
                    <FaStar className="text-yellow-500" /> Rate This Service
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-amber-600 flex-shrink-0 text-xs">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-wider font-bold text-warm-700">{label}</p>
      <p className="text-sm font-semibold text-warm-900 truncate">{value}</p>
    </div>
  </div>
)

export default HistoryDetailDrawer