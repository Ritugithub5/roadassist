import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FaMapMarkerAlt, FaPhone, FaComment, FaStar, FaShieldAlt,
  FaCheckCircle, FaTools, FaClock, FaArrowLeft, FaSpinner,
  FaCarBattery, FaTruckPickup, FaGasPump, FaCarSide, FaCar,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { MdOutlineTireRepair } from 'react-icons/md'
import Button from '../components/Button'
import API from '../utils/api'

const serviceIcons = {
  breakdown: <FaTools />,
  towing: <FaTruckPickup />,
  battery: <FaCarBattery />,
  tire: <MdOutlineTireRepair />,
  fuel: <FaGasPump />,
  inspection: <FaCarSide />,
}

const serviceLabels = {
  breakdown: 'Breakdown Repair',
  towing: 'Towing Service',
  battery: 'Battery Jump-Start',
  tire: 'Flat Tire Repair',
  fuel: 'Fuel Delivery',
  inspection: 'Vehicle Inspection',
}

const TrackRequest = () => {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRequest = async () => {
    try {
      const { data } = await API.get(`/services/${requestId}`)
      setRequest(data.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Request not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (requestId) fetchRequest()
    const interval = setInterval(fetchRequest, 5000)
    return () => clearInterval(interval)
  }, [requestId])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
          <p className="text-warm-700 font-semibold">Loading your request...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-red-100 p-12 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 text-3xl mx-auto mb-6">
            <FaExclamationTriangle />
          </div>
          <h1 className="font-display text-2xl font-bold text-warm-900 mb-2">
            Request Not Found
          </h1>
          <p className="text-warm-700 text-sm mb-6">{error}</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  const serviceLabel = serviceLabels[request?.serviceType] || 'Service'
  const serviceIcon = serviceIcons[request?.serviceType] || <FaTools />
  const status = request?.status || 'Requested'
  const mechanic = request?.mechanic
  const vehicle = request?.vehicle
  const user = request?.user

  const mechanicInitials = mechanic?.name
    ? mechanic.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'MK'

  const statusOrder = ['Requested', 'Accepted', 'En Route', 'Arrived', 'Completed']
  const currentIndex = statusOrder.indexOf(status)

  const formatTime = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const stages = [
    { id: 1, label: 'Request Placed', time: formatTime(request?.createdAt), done: true },
    {
      id: 2,
      label: 'Mechanic Accepted',
      time: currentIndex >= 1 ? formatTime(request?.updatedAt) : 'Pending',
      done: currentIndex >= 1,
    },
    {
      id: 3,
      label: 'En Route',
      time: currentIndex >= 2 ? formatTime(request?.updatedAt) : 'Pending',
      done: currentIndex >= 2,
      active: status === 'En Route',
    },
    {
      id: 4,
      label: 'Arrived',
      time: currentIndex >= 3 ? formatTime(request?.updatedAt) : 'Pending',
      done: currentIndex >= 3,
      active: status === 'Arrived',
    },
    {
      id: 5,
      label: 'Service Complete',
      time: currentIndex >= 4 ? formatTime(request?.completedAt) : 'Pending',
      done: currentIndex >= 4,
    },
  ]

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Live Tracking
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-900">
              Request #{request?.requestId || requestId.slice(-6)}
            </h1>
            <p className="text-xs text-warm-700 mt-1">
              Placed on {formatDate(request?.createdAt)}
            </p>
          </div>

          {status !== 'Completed' && status !== 'Cancelled' && (
            <div className="text-right">
              <p className="text-xs text-warm-700 font-semibold uppercase tracking-wider">
                Status
              </p>
              <p className="font-display text-2xl font-bold text-amber-700">{status}</p>
            </div>
          )}
        </div>

        {/* MAP */}
        <div className="relative h-72 rounded-3xl bg-gradient-to-br from-amber-50 to-cream-100 overflow-hidden mb-6 border border-amber-100">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(180,120,60,0.15) 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          />

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 800 320"
            preserveAspectRatio="none"
          >
            <path
              d="M 100 250 Q 300 150 500 180 T 700 90"
              stroke="url(#grad)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8 4"
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
          </svg>

          {mechanic && (
            <div className="absolute top-[45%] left-[30%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-amber-500 rounded-full animate-ping absolute inset-0" />
              <div className="w-4 h-4 bg-amber-500 rounded-full relative shadow-lg" />
            </div>
          )}

          <div className="absolute top-[72%] right-[15%] -translate-x-1/2 -translate-y-1/2">
            <div className="w-5 h-5 bg-emerald-500 rounded-full relative shadow-lg" />
          </div>

          <div className="absolute bottom-4 left-4 glass rounded-xl px-4 py-3 flex gap-4 text-xs font-semibold bg-white/80 backdrop-blur">
            <span className="flex items-center gap-2 text-amber-700">
              <span className="w-3 h-3 bg-amber-500 rounded-full" /> Mechanic
            </span>
            <span className="flex items-center gap-2 text-emerald-700">
              <span className="w-3 h-3 bg-emerald-500 rounded-full" /> You
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-3xl border border-amber-100 p-6">
              <h2 className="font-display text-xl font-bold text-warm-900 mb-6">
                Status Timeline
              </h2>
              <div className="space-y-0">
                {stages.map((s, i) => (
                  <div key={s.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          s.done
                            ? s.active
                              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/40 scale-110'
                              : 'bg-emerald-500 text-white'
                            : 'bg-cream-100 text-warm-700'
                        }`}
                      >
                        {s.done ? <FaCheckCircle /> : s.id}
                      </div>
                      {i < stages.length - 1 && (
                        <div
                          className={`w-0.5 h-10 ${
                            stages[i + 1].done ? 'bg-emerald-500' : 'bg-cream-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-1.5 pb-6 flex-1">
                      <p
                        className={`font-bold ${
                          s.done ? 'text-warm-900' : 'text-warm-700/60'
                        }`}
                      >
                        {s.label}
                      </p>
                      <p className="text-xs text-warm-700 mt-0.5">{s.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service details */}
            <div className="bg-white rounded-3xl border border-amber-100 p-6">
              <h2 className="font-display text-xl font-bold text-warm-900 mb-5">
                Service Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-cream-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      {serviceIcon}
                    </div>
                    <div>
                      <p className="text-xs text-warm-700 font-semibold uppercase tracking-wider">
                        Service
                      </p>
                      <p className="font-bold text-warm-900">{serviceLabel}</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-700">
                    ₹{request?.total || 0}
                  </span>
                </div>

                {vehicle && (
                  <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
                    <div className="w-10 h-10 rounded-lg bg-cream-100 text-warm-700 flex items-center justify-center">
                      <FaCar />
                    </div>
                    <div>
                      <p className="text-xs text-warm-700 font-semibold uppercase tracking-wider">
                        Vehicle
                      </p>
                      <p className="font-bold text-warm-900 text-sm">{vehicle.name}</p>
                      <p className="text-xs text-warm-700 font-mono">{vehicle.plate}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-xs text-warm-700 font-semibold uppercase tracking-wider">
                      Location
                    </p>
                    <p className="font-bold text-warm-900 text-sm">
                      {request?.location?.address || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Mechanic card */}
            {mechanic ? (
              <div className="bg-white rounded-3xl border border-amber-100 p-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-4">
                  Your Mechanic
                </p>
                <div className="text-center mb-5">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-display font-bold text-2xl mb-3 shadow-lg">
                    {mechanicInitials}
                  </div>
                  <h3 className="font-display font-bold text-warm-900 text-lg">
                    {mechanic.name}
                  </h3>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <FaShieldAlt className="text-[10px]" /> Verified
                  </div>
                </div>
                <div className="space-y-2 mb-5 pb-5 border-b border-cream-200">
                  <div className="flex items-center gap-2 text-sm text-warm-700">
                    <FaTools className="text-amber-500" /> {serviceLabel}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-warm-700">
                    <FaPhone className="text-amber-500" /> {mechanic.phone || '—'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm">
                    <FaPhone /> Call
                  </Button>
                  <Button size="sm">
                    <FaComment /> Chat
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-dashed border-amber-200 p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-500 text-2xl mb-4">
                  <FaSpinner className="animate-spin" />
                </div>
                <h3 className="font-bold text-warm-900 mb-1">Finding a mechanic</h3>
                <p className="text-xs text-warm-700">
                  We're notifying nearby verified mechanics. You'll see the assigned
                  mechanic here shortly.
                </p>
              </div>
            )}

            {/* ⭐ RATING FORM */}
            {status === 'Completed' &&
              mechanic &&
              (!request?.rating || request?.rating === 0) && (
                <div className="bg-white rounded-3xl border-2 border-amber-200 p-6">
                  <div className="text-center mb-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-2xl mb-3 shadow-lg">
                      ⭐
                    </div>
                    <h3 className="font-display font-bold text-warm-900 text-lg mb-1">
                      Rate your service
                    </h3>
                    <p className="text-xs text-warm-700">
                      How was your experience with {mechanic.name}?
                    </p>
                  </div>
                  <RatingForm requestId={requestId} mechanicName={mechanic.name} />
                </div>
              )}

            {/* Show existing rating */}
            {status === 'Completed' && request?.rating > 0 && (
              <div className="bg-white rounded-3xl border border-emerald-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                  Your Rating
                </p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= request.rating ? 'text-yellow-500' : 'text-cream-200'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm font-bold text-warm-900 ml-2">
                    {request.rating}.0
                  </span>
                </div>
                {request.review && (
                  <p className="text-xs italic text-warm-700 leading-relaxed">
                    "{request.review}"
                  </p>
                )}
              </div>
            )}

            {/* Driver card */}
            {user && (
              <div className="bg-white rounded-3xl border border-amber-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                  Requested By
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {user.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-warm-900 text-sm truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-warm-700 truncate">{user.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cost breakdown */}
            <div className="bg-gradient-to-br from-amber-50 to-cream-100 rounded-3xl border border-amber-200 p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-warm-700 mb-3">
                Cost Breakdown
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-warm-700">
                  <span>Service charge</span>
                  <span>₹{request?.amount || 0}</span>
                </div>
                <div className="flex justify-between text-warm-700">
                  <span>GST & fees</span>
                  <span>₹{request?.tax || 0}</span>
                </div>
                <div className="pt-3 border-t border-amber-200 flex justify-between font-bold text-warm-900">
                  <span>Total</span>
                  <span className="text-amber-700">₹{request?.total || 0}</span>
                </div>
              </div>
            </div>

            {status === 'Requested' && (
              <button className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors text-sm">
                Cancel Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ RATING FORM COMPONENT ============
const RatingForm = ({ requestId, mechanicName }) => {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await API.post(`/services/${requestId}/feedback`, { rating, review })
      setSubmitted(true)
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-3">🙏</div>
        <p className="font-display font-bold text-emerald-600 text-lg">
          Thanks for your feedback!
        </p>
        <p className="text-xs text-warm-700 mt-1">
          Your rating helps improve our service
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              setRating(star)
              setError('')
            }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-125 active:scale-95"
          >
            <FaStar
              className={`text-3xl transition-colors ${
                star <= (hovered || rating) ? 'text-yellow-500' : 'text-cream-200'
              }`}
            />
          </button>
        ))}
      </div>

      <p className="text-center text-sm font-bold text-warm-800 h-5">
        {labels[hovered || rating] || 'Tap a star to rate'}
      </p>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Tell us about your experience (optional)"
        rows={3}
        className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 resize-none"
      />

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className="w-full py-3.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <FaStar /> Submit Rating
          </>
        )}
      </button>
    </div>
  )
}

export default TrackRequest