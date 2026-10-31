import { useState } from 'react'
import { FaTimes, FaStar, FaCheckCircle } from 'react-icons/fa'

const FeedbackModal = ({ open, onClose, onSubmit, item }) => {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!open || !item) return null

  const handleSubmit = () => {
    if (rating === 0) return
    
    // ✅ THE FIX: Send item._id instead of item.id
    onSubmit({ id: item._id, rating, review })
    setSubmitted(true)
  }

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div onClick={onClose} className="absolute inset-0 bg-warm-900/40 backdrop-blur-sm" />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-slideUp">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl mb-5 shadow-lg shadow-emerald-500/30">
            <FaCheckCircle />
          </div>
          <h2 className="font-display text-xl font-bold text-warm-900 mb-2">
            Thanks for your feedback!
          </h2>
          <p className="text-sm text-warm-700 mb-6">
            Your rating helps us improve our service quality.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setRating(0)
              setReview('')
              onClose()
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-warm-900/40 backdrop-blur-sm animate-fadeIn" />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-slideUp overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-bold text-warm-900">
                Rate Your Service
              </h2>
              <p className="text-xs text-warm-700 mt-0.5">
                {item.service} by {item.mechanic}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-cream-100 flex items-center justify-center text-warm-700"
            >
              <FaTimes />
            </button>
          </div>

          {/* Stars */}
          <div className="text-center mb-6">
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-125"
                >
                  <FaStar
                    className={`text-3xl transition-colors ${
                      n <= (hovered || rating) ? 'text-yellow-500' : 'text-cream-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-warm-800">
              {labels[hovered || rating] || 'Tap to rate'}
            </p>
          </div>

          {/* Review */}
          <div className="mb-5">
            <label className="text-xs font-bold text-warm-700 uppercase tracking-wider mb-2 block">
              Your Review (optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={3}
              className="w-full border border-amber-100 rounded-xl px-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full py-3.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Submit Feedback
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out }
        .animate-slideUp { animation: slideUp 0.3s ease-out }
      `}</style>
    </div>
  )
}

export default FeedbackModal