import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  FaTools, FaTruckPickup, FaCarBattery, FaGasPump, FaCarSide, FaCar,
  FaMapMarkerAlt, FaArrowRight, FaArrowLeft, FaCheck,
  FaCrosshairs, FaStar, FaClock, FaShieldAlt, FaMotorcycle,
  FaChevronRight, FaSpinner,
} from 'react-icons/fa'
import { MdOutlineTireRepair } from 'react-icons/md'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Button from '../components/Button'
import Toast from '../components/Toast'
import API from '../utils/api'

// ✅ Fix Leaflet default marker icon (broken with bundlers)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// ============ MAP CLICK HANDLER ============
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng
      await onLocationSelect(lat, lng)
    },
  })
  return null
}

// ============ MAP RECENTER COMPONENT ============
const MapRecenter = ({ lat, lng }) => {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], 15, { animate: true })
  }, [lat, lng, map])
  return null
}

const RequestService = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselected = searchParams.get('service')

  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState(preselected || null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [selectedMechanic, setSelectedMechanic] = useState(null)
  const [location, setLocation] = useState('')
  const [coordinates, setCoordinates] = useState({
    lat: 20.5937, // India center default
    lng: 78.9629,
  })
  const [detecting, setDetecting] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'error' })

  // ✅ REAL DATA FROM BACKEND
  const [vehicles, setVehicles] = useState([])
  const [mechanics, setMechanics] = useState([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [loadingMechanics, setLoadingMechanics] = useState(false)

  const services = [
    { id: 'breakdown', icon: <FaTools />, label: 'Breakdown Repair', price: 499, eta: '20 min', desc: 'Engine & mechanical fixes' },
    { id: 'towing', icon: <FaTruckPickup />, label: 'Towing Service', price: 999, eta: '25 min', desc: 'Flatbed towing', tag: 'Popular' },
    { id: 'battery', icon: <FaCarBattery />, label: 'Battery Jump-Start', price: 299, eta: '15 min', desc: 'Instant battery boost' },
    { id: 'tire', icon: <MdOutlineTireRepair />, label: 'Flat Tire Repair', price: 349, eta: '18 min', desc: 'Puncture fix on-site' },
    { id: 'fuel', icon: <FaGasPump />, label: 'Fuel Delivery', price: 199, eta: '12 min', desc: 'Petrol / diesel to you' },
    { id: 'inspection', icon: <FaCarSide />, label: 'Vehicle Inspection', price: 599, eta: '30 min', desc: '50-point checkup' },
  ]

  const currentService = services.find((s) => s.id === selected)
  const currentVehicle = vehicles.find((v) => v._id === selectedVehicle)
  const currentMechanic = mechanics.find((m) => m._id === selectedMechanic)

  const platformFee = 29
  const totalAmount = (currentService?.price || 0) + platformFee

  // ============ REVERSE GEOCODE (free Nominatim API) ============
  const reverseGeocode = async (lat, lng) => {
    try {
      setGeocoding(true)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      )
      const data = await res.json()
      if (data.display_name) {
        return data.display_name
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch (error) {
      console.error('Geocoding failed:', error)
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } finally {
      setGeocoding(false)
    }
  }

  // ============ HANDLE MAP CLICK ============
  const handleMapClick = async (lat, lng) => {
    setCoordinates({ lat, lng })
    const address = await reverseGeocode(lat, lng)
    setLocation(address)
  }

  // ============ FETCH VEHICLES ============
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoadingVehicles(true)
        const { data } = await API.get('/vehicles')
        setVehicles(data.data)

        const defaultVehicle = data.data.find((v) => v.isDefault)
        if (defaultVehicle) setSelectedVehicle(defaultVehicle._id)
      } catch (error) {
        setToast({
          message: error.response?.data?.message || 'Failed to load vehicles',
          type: 'error',
        })
      } finally {
        setLoadingVehicles(false)
      }
    }
    fetchVehicles()
  }, [])

  // ============ FETCH MECHANICS WHEN STEP 3 ============
  useEffect(() => {
    if (step !== 3) return
    const fetchMechanics = async () => {
      try {
        setLoadingMechanics(true)
        const { data } = await API.get('/mechanics')
        setMechanics(data.data || [])
      } catch (error) {
        setToast({ message: 'Failed to load mechanics', type: 'error' })
      } finally {
        setLoadingMechanics(false)
      }
    }
    fetchMechanics()
  }, [step])

  // ============ AUTO-SELECT FROM QUERY ============
  useEffect(() => {
    if (preselected && services.find((s) => s.id === preselected)) {
      setSelected(preselected)
    }
  }, [preselected])

  // ============ DETECT LOCATION ============
  const handleDetectLocation = () => {
    setDetecting(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          setCoordinates({ lat: latitude, lng: longitude })
          const address = await reverseGeocode(latitude, longitude)
          setLocation(address)
          setDetecting(false)
        },
        () => {
          // Fallback to Bangalore
          setCoordinates({ lat: 12.9716, lng: 77.5946 })
          setLocation('MG Road, Bangalore, Karnataka 560001')
          setDetecting(false)
        },
        { timeout: 8000, enableHighAccuracy: true }
      )
    } else {
      setCoordinates({ lat: 12.9716, lng: 77.5946 })
      setLocation('MG Road, Bangalore, Karnataka 560001')
      setDetecting(false)
    }
  }

  // ============ HANDLE MANUAL INPUT ============
  const handleManualLocationChange = (value) => {
    setLocation(value)
    // Note: typing doesn't move the marker (only clicks/GPS do)
  }

  // ============ SUBMIT ============
  const handleSubmit = async () => {
    if (!selected || !selectedVehicle || !location) {
      setToast({ message: 'Please complete all steps', type: 'error' })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        vehicle: selectedVehicle,
        serviceType: selected,
        location: {
          address: location,
          lat: coordinates.lat,
          lng: coordinates.lng,
        },
        amount: currentService.price,
        tax: Math.round(currentService.price * 0.18),
        total: totalAmount,
      }

      if (selectedMechanic && selectedMechanic !== 'auto') {
        payload.preferredMechanic = selectedMechanic
      }

      const { data } = await API.post('/services', payload)
      const requestId = data.data._id

      setToast({ message: 'Request created! Finding mechanics...', type: 'success' })

      setTimeout(() => {
        navigate(`/track/${requestId}`)
      }, 800)
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to create request',
        type: 'error',
      })
      setSubmitting(false)
    }
  }

  const steps = ['Service', 'Vehicle', 'Mechanic', 'Location', 'Confirm']

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-ink-50">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />

      <div className="max-w-5xl mx-auto">
        {/* ============ PROGRESS BAR ============ */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((label, i) => {
              const n = i + 1
              const isActive = step >= n
              const isComplete = step > n
              return (
                <div key={n} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 ${
                        isActive
                          ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/40 scale-110'
                          : 'bg-ink-200 text-ink-500'
                      }`}
                    >
                      {isComplete ? <FaCheck /> : n}
                    </div>
                    <span
                      className={`text-[10px] mt-2 font-semibold hidden md:block ${
                        isActive ? 'text-brand-600' : 'text-ink-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {n < steps.length && (
                    <div className="flex-1 h-0.5 mx-2 relative overflow-hidden bg-ink-200">
                      <div
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-700 ${
                          step > n ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ============ MAIN CARD ============ */}
        <div className="bg-white rounded-3xl shadow-xl shadow-ink-900/5 border border-ink-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600" />

          <div className="p-8 md:p-12">
            {/* ==================== STEP 1: SERVICE ==================== */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <div className="mb-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase mb-3">
                    Step 1 of 5
                  </span>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 mb-2">
                    What do you need help with?
                  </h1>
                  <p className="text-ink-500">
                    Pick the service that matches your situation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelected(s.id)}
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group ${
                        selected === s.id
                          ? 'border-brand-500 bg-gradient-to-br from-brand-50 to-white shadow-lg shadow-brand-500/20 -translate-y-1'
                          : 'border-ink-100 hover:border-brand-200 hover:bg-brand-50/30 hover:-translate-y-0.5'
                      }`}
                    >
                      {s.tag && (
                        <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500 text-white">
                          {s.tag}
                        </span>
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all ${
                            selected === s.id
                              ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/30'
                              : 'bg-ink-100 text-ink-500 group-hover:bg-brand-100 group-hover:text-brand-600'
                          }`}
                        >
                          {s.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-ink-900 text-sm mb-0.5">
                            {s.label}
                          </h3>
                          <p className="text-xs text-ink-500 mb-2 leading-snug">{s.desc}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="font-bold text-brand-600">₹{s.price}</span>
                            <span className="flex items-center gap-1 text-ink-400">
                              <FaClock className="text-[10px]" /> {s.eta}
                            </span>
                          </div>
                        </div>
                      </div>

                      {selected === s.id && (
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs shadow-lg">
                          <FaCheck />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={() => selected && setStep(2)}
                  className={!selected ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Continue to Vehicle <FaArrowRight />
                </Button>
              </div>
            )}

            {/* ==================== STEP 2: VEHICLE ==================== */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <div className="mb-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase mb-3">
                    Step 2 of 5
                  </span>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 mb-2">
                    Which vehicle needs help?
                  </h1>
                  <p className="text-ink-500">Select a saved vehicle or add a new one.</p>
                </div>

                {loadingVehicles ? (
                  <div className="p-12 text-center">
                    <FaSpinner className="animate-spin text-3xl text-brand-500 mx-auto mb-3" />
                    <p className="text-ink-500">Loading your vehicles...</p>
                  </div>
                ) : vehicles.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-200 text-center mb-6">
                    <div className="text-4xl mb-3">🚗</div>
                    <h3 className="font-bold text-ink-900 mb-2">No vehicles yet</h3>
                    <p className="text-sm text-ink-500 mb-4">
                      Add a vehicle first to request service.
                    </p>
                    <Button onClick={() => navigate('/vehicles')}>Add Vehicle</Button>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {vehicles.map((v) => (
                      <button
                        key={v._id}
                        onClick={() => setSelectedVehicle(v._id)}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-4 ${
                          selectedVehicle === v._id
                            ? 'border-brand-500 bg-gradient-to-br from-brand-50 to-white shadow-lg shadow-brand-500/20'
                            : 'border-ink-100 hover:border-brand-200 hover:bg-brand-50/30'
                        }`}
                      >
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                            selectedVehicle === v._id
                              ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white'
                              : 'bg-ink-100 text-ink-500'
                          }`}
                        >
                          {v.type === 'bike' ? <FaMotorcycle /> : <FaCar />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-ink-900">{v.name}</h3>
                            {v.isDefault && (
                              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-ink-500 mt-0.5">
                            {v.plate} • {v.make}
                          </p>
                        </div>
                        {selectedVehicle === v._id && (
                          <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs">
                            <FaCheck />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} fullWidth>
                    <FaArrowLeft /> Back
                  </Button>
                  <Button
                    onClick={() => selectedVehicle && setStep(3)}
                    fullWidth
                    className={!selectedVehicle ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Continue to Mechanic <FaArrowRight />
                  </Button>
                </div>
              </div>
            )}

            {/* ==================== STEP 3: MECHANIC ==================== */}
            {step === 3 && (
              <div className="animate-fadeIn">
                <div className="mb-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase mb-3">
                    Step 3 of 5
                  </span>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 mb-2">
                    Choose your mechanic
                  </h1>
                  <p className="text-ink-500">
                    Pick a verified mechanic from nearby. Or let us auto-assign.
                  </p>
                </div>

                {loadingMechanics ? (
                  <div className="p-12 text-center">
                    <FaSpinner className="animate-spin text-3xl text-brand-500 mx-auto mb-3" />
                    <p className="text-ink-500">Finding nearby mechanics...</p>
                  </div>
                ) : mechanics.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-200 text-center mb-6">
                    <div className="text-4xl mb-3">🔧</div>
                    <h3 className="font-bold text-ink-900 mb-2">No mechanics online</h3>
                    <p className="text-sm text-ink-500 mb-4">
                      No mechanics are available right now. Let us auto-assign the
                      fastest available partner.
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedMechanic('auto')
                        setStep(4)
                      }}
                    >
                      Continue with Auto-Assign
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {mechanics.map((m) => {
                      const isSelected = selectedMechanic === m._id
                      const name = m.user?.name || m.garageName || 'Mechanic'
                      const initials = name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()

                      return (
                        <button
                          key={m._id}
                          onClick={() => setSelectedMechanic(m._id)}
                          className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-start gap-4 ${
                            isSelected
                              ? 'border-brand-500 bg-gradient-to-br from-brand-50 to-white shadow-lg shadow-brand-500/20'
                              : 'border-ink-100 hover:border-brand-200 hover:bg-brand-50/30'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                            {initials}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-ink-900">{name}</h3>
                              {m.rating >= 4.5 && (
                                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  Top Rated
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-ink-500 mb-2">
                              {m.garageName && `${m.garageName} • `}
                              {m.specialization || 'General Service'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-600">
                              <span className="flex items-center gap-1">
                                <FaStar className="text-yellow-500 text-[10px]" />
                                <strong>{m.rating || '4.8'}</strong>
                                <span className="text-ink-400">({m.totalJobs || 0} jobs)</span>
                              </span>
                              <span>• {m.experience || 5} yrs exp</span>
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Online
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs flex-shrink-0">
                              <FaCheck />
                            </div>
                          )}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => setSelectedMechanic('auto')}
                      className={`w-full p-4 rounded-2xl border-2 border-dashed text-center transition-all ${
                        selectedMechanic === 'auto'
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-ink-200 hover:border-brand-300'
                      }`}
                    >
                      <p className="font-bold text-ink-900 text-sm mb-0.5">
                        🤖 Let RoadAssist choose for me
                      </p>
                      <p className="text-xs text-ink-500">
                        Auto-assign to the fastest available mechanic
                      </p>
                    </button>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)} fullWidth>
                    <FaArrowLeft /> Back
                  </Button>
                  <Button
                    onClick={() => selectedMechanic && setStep(4)}
                    fullWidth
                    className={!selectedMechanic ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Continue to Location <FaArrowRight />
                  </Button>
                </div>
              </div>
            )}

            {/* ==================== STEP 4: LOCATION (REAL MAP) ==================== */}
            {step === 4 && (
              <div className="animate-fadeIn">
                <div className="mb-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase mb-3">
                    Step 4 of 5
                  </span>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 mb-2">
                    Where are you located?
                  </h1>
                  <p className="text-ink-500">
                    Use GPS, click on the map, or type your address.
                  </p>
                </div>

                {/* GPS button */}
                <button
                  onClick={handleDetectLocation}
                  disabled={detecting}
                  className="w-full mb-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 hover:border-emerald-400 transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FaCrosshairs className={detecting ? 'animate-spin' : ''} />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-emerald-900 text-sm">
                      {detecting
                        ? 'Detecting location...'
                        : 'Use My Current Location (GPS)'}
                    </h3>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Fastest way to find nearby mechanics
                    </p>
                  </div>
                  <FaChevronRight className="text-emerald-600" />
                </button>

                {/* Manual input */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-ink-700 mb-3 block flex items-center justify-between">
                    <span>Or enter manually / click on map</span>
                    {geocoding && (
                      <span className="text-xs text-brand-600 flex items-center gap-1">
                        <FaSpinner className="animate-spin" /> Finding address...
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 text-lg" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => handleManualLocationChange(e.target.value)}
                      placeholder="e.g., MG Road, Bangalore"
                      className="w-full border-2 border-ink-100 rounded-xl pl-12 pr-4 py-4 text-ink-900 focus:outline-none focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                {/* ✅ REAL INTERACTIVE MAP */}
                <div className="relative h-80 rounded-2xl overflow-hidden mb-6 border-2 border-ink-100 z-0">
                  <MapContainer
                    center={[coordinates.lat, coordinates.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                    <MapRecenter lat={coordinates.lat} lng={coordinates.lng} />
                    <Marker position={[coordinates.lat, coordinates.lng]} />
                    <MapClickHandler onLocationSelect={handleMapClick} />
                  </MapContainer>

                  {location && (
                    <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      Location set
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-lg text-[11px] text-ink-600 shadow-md">
                    💡 <strong>Tip:</strong> Click anywhere on the map to drop a
                    pin, or drag to explore
                  </div>
                </div>

                {location && (
                  <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 mb-6 flex items-start gap-2">
                    <FaMapMarkerAlt className="text-brand-600 mt-0.5 flex-shrink-0 text-xs" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-brand-800 uppercase tracking-wider mb-0.5">
                        Selected address
                      </p>
                      <p className="text-sm text-brand-900 font-medium leading-relaxed">
                        {location}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(3)} fullWidth>
                    <FaArrowLeft /> Back
                  </Button>
                  <Button
                    onClick={() => location && setStep(5)}
                    fullWidth
                    className={!location ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Review Request <FaArrowRight />
                  </Button>
                </div>
              </div>
            )}

            {/* ==================== STEP 5: CONFIRM ==================== */}
            {step === 5 && (
              <div className="animate-fadeIn">
                <div className="mb-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase mb-3">
                    Step 5 of 5
                  </span>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 mb-2">
                    Confirm your request
                  </h1>
                  <p className="text-ink-500">
                    Review details before we notify the mechanic.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-ink-50 to-white border border-ink-100 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-ink-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                          {currentService?.icon}
                        </div>
                        <div>
                          <p className="text-xs text-ink-500 font-semibold uppercase tracking-wider">
                            Service
                          </p>
                          <p className="font-bold text-ink-900">{currentService?.label}</p>
                        </div>
                      </div>
                      <span className="font-bold text-brand-600">
                        ₹{currentService?.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pb-4 border-b border-ink-100">
                      <div className="w-10 h-10 rounded-lg bg-ink-100 text-ink-600 flex items-center justify-center">
                        {currentVehicle?.type === 'bike' ? <FaMotorcycle /> : <FaCar />}
                      </div>
                      <div>
                        <p className="text-xs text-ink-500 font-semibold uppercase tracking-wider">
                          Vehicle
                        </p>
                        <p className="font-bold text-ink-900 text-sm">
                          {currentVehicle?.name}
                        </p>
                        <p className="text-xs text-ink-500">{currentVehicle?.plate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pb-4 border-b border-ink-100">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <FaTools />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-ink-500 font-semibold uppercase tracking-wider">
                          Mechanic
                        </p>
                        <p className="font-bold text-ink-900 text-sm">
                          {selectedMechanic === 'auto'
                            ? 'Auto-assigned by RoadAssist'
                            : currentMechanic?.user?.name ||
                              currentMechanic?.garageName ||
                              'Mechanic'}
                        </p>
                        {currentMechanic?.garageName &&
                          currentMechanic?.user?.name && (
                            <p className="text-xs text-ink-500">
                              {currentMechanic.garageName}
                            </p>
                          )}
                      </div>
                      <FaShieldAlt className="text-emerald-500" />
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-ink-500 font-semibold uppercase tracking-wider">
                          Location
                        </p>
                        <p className="font-bold text-ink-900 text-sm break-words">
                          {location}
                        </p>
                        <p className="text-[10px] text-ink-500 mt-0.5 font-mono">
                          {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-50 border border-brand-100 mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-700">Service charge</span>
                    <span className="text-sm text-brand-700">₹{currentService?.price}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-brand-200">
                    <span className="text-sm text-brand-700">Platform fee</span>
                    <span className="text-sm text-brand-700">₹{platformFee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-900">Estimated Total</span>
                    <span className="font-bold text-brand-900 text-lg">₹{totalAmount}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(4)}
                    fullWidth
                    disabled={submitting}
                  >
                    <FaArrowLeft /> Back
                  </Button>
                  <Button onClick={handleSubmit} fullWidth size="lg" disabled={submitting}>
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin" /> Creating...
                      </span>
                    ) : (
                      <>
                        Confirm Request <FaCheck />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust footer */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-ink-500">
          <span className="flex items-center gap-2">
            <FaShieldAlt className="text-emerald-500" /> Verified mechanics
          </span>
          <span className="flex items-center gap-2">
            <FaClock className="text-brand-500" /> Avg 15 min response
          </span>
          <span className="flex items-center gap-2">
            <FaStar className="text-yellow-500" /> 4.9★ from 12k+ users
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }

        /* Leaflet overrides */
        .leaflet-container {
          font-family: inherit;
          z-index: 0;
        }
        .leaflet-control-attribution {
          font-size: 9px;
          background: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  )
}

export default RequestService
