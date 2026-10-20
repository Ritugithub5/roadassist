import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaTools, FaCheck, FaTimes, FaClock, FaStar, FaShieldAlt,
  FaEdit, FaSave, FaToggleOn, FaToggleOff, FaRupeeSign, FaSpinner,
} from 'react-icons/fa'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'
import {
  serviceCategories,
  defaultAvailability,
  emptyServices,
} from '../data/mechanicProfile'

const MechanicProfile = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)  // null = no profile yet
  const [draft, setDraft] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'error' })

  // ============ FETCH PROFILE FROM BACKEND ============
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data } = await API.get('/mechanics/me')
        setProfile(data.data)
        setDraft(JSON.parse(JSON.stringify(data.data)))
      } catch (error) {
        // No profile yet → prepare empty form for creation
        if (error.response?.status === 404) {
          const empty = {
            garageName: '',
            specialization: '',
            experience: 0,
            address: '',
            about: '',
            isOnline: false,
            rating: 0,
            totalJobs: 0,
            services: emptyServices,
            availability: defaultAvailability,
          }
          setProfile(null)
          setDraft(empty)
          setEditing(true)  // Start in edit mode if no profile
        } else {
          setToast({
            message: error.response?.data?.message || 'Failed to load profile',
            type: 'error',
          })
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // ============ SAVE PROFILE TO BACKEND ============
  const handleSave = async () => {
    // Validate
    if (!draft.garageName?.trim()) {
      setToast({ message: 'Garage name is required', type: 'error' })
      return
    }
    if (!draft.specialization?.trim()) {
      setToast({ message: 'Specialization is required', type: 'error' })
      return
    }
    if (!draft.address?.trim()) {
      setToast({ message: 'Address is required', type: 'error' })
      return
    }

    setSaving(true)
    try {
      const payload = {
        garageName: draft.garageName,
        specialization: draft.specialization,
        experience: draft.experience || 0,
        address: draft.address,
        about: draft.about || '',
        services: draft.services,
        availability: draft.availability,
        isOnline: draft.isOnline,
      }

      const { data } = await API.put('/mechanics/me', payload)
      setProfile(data.data)
      setDraft(JSON.parse(JSON.stringify(data.data)))
      setEditing(false)
      setToast({ message: 'Profile saved successfully', type: 'success' })
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to save profile',
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setDraft(JSON.parse(JSON.stringify(profile || {})))
    setEditing(false)
  }

  const handleEdit = () => {
    setDraft(JSON.parse(JSON.stringify(profile)))
    setEditing(true)
  }

  // ============ DRAFT UPDATES ============
  const updateDraft = (path, value) => {
    setDraft((prev) => {
      const next = { ...prev }
      if (path.length === 1) {
        next[path[0]] = value
      } else if (path[0] === 'services') {
        next.services = prev.services.map((s) =>
          s.id === path[1] ? { ...s, [path[2]]: value } : s
        )
      } else if (path[0] === 'availability') {
        next.availability = {
          ...prev.availability,
          [path[1]]: { ...prev.availability[path[1]], [path[2]]: value },
        }
      }
      return next
    })
  }

  // ============ LOADING ============
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
          <p className="text-warm-700">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!draft) return null

  const displayData = editing ? draft : profile
  const isNewProfile = !profile

  const fullName = user?.name || 'Mechanic'
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const activeServices = (displayData?.services || []).filter((s) => s.enabled).length
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />

      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/mechanic')}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* ============ HEADER CARD ============ */}
        <div className="bg-white rounded-3xl border border-amber-100 overflow-hidden mb-6 shadow-sm">
          <div className="relative h-32 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative px-6 md:px-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 border-4 border-white flex items-center justify-center text-white text-3xl font-display font-bold shadow-xl">
                  {/* ✅ DYNAMIC initials from useAuth() */}
                  {initials}
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    {/* ✅ DYNAMIC name from useAuth() */}
                    <h1 className="font-display text-2xl font-bold text-warm-900">
                      {displayData?.garageName || fullName}
                    </h1>
                    {profile && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase">
                        <FaShieldAlt className="text-[8px]" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-warm-700">
                    {/* ✅ DYNAMIC name from useAuth() */}
                    {fullName}
                    {displayData?.specialization && ` • ${displayData.specialization}`}
                  </p>
                  {profile && (
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1 text-warm-800">
                        <FaStar className="text-yellow-500 text-[10px]" />
                        <span className="font-bold">{profile.rating?.toFixed(1) || 0}</span>
                        <span className="text-warm-700">({profile.totalJobs || 0} jobs)</span>
                      </span>
                      <span className="text-warm-700">•</span>
                      <span className="text-warm-700">{profile.experience || 0} yrs exp</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md shadow-amber-500/30 hover:shadow-lg transition-all"
                  >
                    <FaEdit /> {isNewProfile ? 'Create Profile' : 'Edit Profile'}
                  </button>
                ) : (
                  <>
                    {!isNewProfile && (
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2.5 rounded-xl bg-white border border-cream-200 text-warm-700 text-sm font-semibold hover:bg-cream-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-sm font-bold shadow-md shadow-emerald-500/30 hover:shadow-lg transition-all disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <FaSpinner className="animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Save Profile
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stat chips */}
            {profile && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <StatChip label="Active Services" value={activeServices} />
                <StatChip label="Jobs Completed" value={profile.totalJobs || 0} />
                <StatChip label="Rating" value={`⭐ ${profile.rating?.toFixed(1) || 0}`} />
                <StatChip label="Experience" value={`${profile.experience || 0} yrs`} />
              </div>
            )}
          </div>
        </div>

        {/* ============ BASIC INFO ============ */}
        <SectionCard title="Basic Information" icon={<FaUser />} editing={editing}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Garage Name *"
              value={editing ? draft.garageName : profile?.garageName}
              editing={editing}
              onChange={(v) => updateDraft(['garageName'], v)}
              placeholder="e.g., Ramesh Auto Works"
            />
            <Field
              label="Owner Name"
              value={user?.name}  // ✅ From login
              editing={false}
              disabled
            />
            <Field
              label="Phone"
              icon={<FaPhone />}
              value={editing ? draft.phone || user?.phone : user?.phone}
              editing={editing}
              onChange={(v) => updateDraft(['phone'], v.replace(/\D/g, '').slice(0, 10))}
              placeholder="9876543210"
            />
            <Field
              label="Email"
              icon={<FaEnvelope />}
              value={user?.email}  // ✅ From login
              editing={false}
              disabled
            />
            <Field
              label="Specialization *"
              value={editing ? draft.specialization : profile?.specialization}
              editing={editing}
              onChange={(v) => updateDraft(['specialization'], v)}
              placeholder="e.g., Engine Repair"
            />
            <Field
              label="Experience (yrs)"
              value={editing ? draft.experience : profile?.experience}
              editing={editing}
              onChange={(v) => updateDraft(['experience'], parseInt(v) || 0)}
              type="number"
            />
            <div className="md:col-span-2">
              <Field
                label="Full Address *"
                icon={<FaMapMarkerAlt />}
                value={editing ? draft.address : profile?.address}
                editing={editing}
                onChange={(v) => updateDraft(['address'], v)}
                placeholder="Shop No, Street, Area, City"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-2 block">
                About Your Business
              </label>
              {editing ? (
                <textarea
                  value={draft.about || ''}
                  onChange={(e) => updateDraft(['about'], e.target.value)}
                  rows={3}
                  placeholder="Tell customers about your services..."
                  className="w-full border border-amber-100 rounded-xl px-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 resize-none bg-white"
                />
              ) : (
                <p className="text-sm text-warm-800 leading-relaxed bg-cream-50 rounded-xl px-4 py-3 border border-cream-200">
                  {profile?.about || 'No description yet'}
                </p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* ============ SERVICES ============ */}
        <SectionCard
          title="Services & Pricing"
          icon={<FaTools />}
          subtitle="Toggle services and set your own prices"
          editing={editing}
        >
          <div className="space-y-3">
            {serviceCategories.map((cat) => {
              const current = (editing ? draft : profile).services?.find(
                (s) => s.id === cat.id
              ) || { enabled: false, price: cat.defaultPrice, eta: 20 }

              return (
                <div
                  key={cat.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    current.enabled
                      ? 'border-amber-200 bg-gradient-to-br from-amber-50/50 to-white'
                      : 'border-cream-200 bg-cream-50/50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all ${
                          current.enabled
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30'
                            : 'bg-cream-200 text-warm-700'
                        }`}
                      >
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-bold text-sm ${
                            current.enabled ? 'text-warm-900' : 'text-warm-700'
                          }`}
                        >
                          {cat.label}
                        </h3>
                        <p className="text-[11px] text-warm-700">{cat.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-warm-700 uppercase tracking-wider mb-1 block">
                          Your Price
                        </label>
                        <div className="relative">
                          <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-700 text-xs" />
                          <input
                            type="number"
                            value={current.price}
                            disabled={!editing || !current.enabled}
                            onChange={(e) =>
                              updateDraft(
                                ['services', cat.id, 'price'],
                                parseInt(e.target.value) || 0
                              )
                            }
                            className={`w-24 border rounded-lg pl-7 pr-2 py-2 text-sm font-bold focus:outline-none transition-all ${
                              editing && current.enabled
                                ? 'border-amber-200 focus:border-amber-400 bg-white text-warm-900'
                                : 'border-cream-200 bg-cream-100 text-warm-700 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-warm-700 uppercase tracking-wider mb-1 block">
                          ETA (min)
                        </label>
                        <input
                          type="number"
                          value={current.eta}
                          disabled={!editing || !current.enabled}
                          onChange={(e) =>
                            updateDraft(
                              ['services', cat.id, 'eta'],
                              parseInt(e.target.value) || 0
                            )
                          }
                          className={`w-20 border rounded-lg px-3 py-2 text-sm font-bold focus:outline-none transition-all ${
                            editing && current.enabled
                              ? 'border-amber-200 focus:border-amber-400 bg-white text-warm-900'
                              : 'border-cream-200 bg-cream-100 text-warm-700 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      <button
                        onClick={() =>
                          editing &&
                          updateDraft(['services', cat.id, 'enabled'], !current.enabled)
                        }
                        disabled={!editing}
                        className={`w-12 h-7 rounded-full relative transition-all flex-shrink-0 ${
                          current.enabled
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                            : 'bg-cream-200'
                        } ${editing ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                      >
                        <span
                          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                            current.enabled ? 'left-6' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>

        {/* ============ AVAILABILITY ============ */}
        <SectionCard
          title="Weekly Availability"
          icon={<FaClock />}
          subtitle="Set your working hours for each day"
          editing={editing}
        >
          <div className="space-y-2">
            {days.map((day) => {
              const a =
                (editing ? draft : profile)?.availability?.[day] || {
                  open: false,
                  from: '09:00',
                  to: '18:00',
                }
              return (
                <div
                  key={day}
                  className={`flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-xl border transition-all ${
                    a.open
                      ? 'bg-gradient-to-r from-emerald-50/50 to-white border-emerald-100'
                      : 'bg-cream-50 border-cream-200'
                  }`}
                >
                  <div className="w-24 flex-shrink-0">
                    <p
                      className={`font-bold text-sm capitalize ${
                        a.open ? 'text-warm-900' : 'text-warm-700'
                      }`}
                    >
                      {day}
                    </p>
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        a.open ? 'text-emerald-600' : 'text-warm-700'
                      }`}
                    >
                      {a.open ? 'Open' : 'Closed'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={a.from}
                      disabled={!editing || !a.open}
                      onChange={(e) => updateDraft(['availability', day, 'from'], e.target.value)}
                      className={`flex-1 border rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none transition-all ${
                        editing && a.open
                          ? 'border-amber-200 focus:border-amber-400 bg-white text-warm-900'
                          : 'border-cream-200 bg-cream-100 text-warm-700 cursor-not-allowed'
                      }`}
                    />
                    <span className="text-warm-700 text-sm font-semibold">to</span>
                    <input
                      type="time"
                      value={a.to}
                      disabled={!editing || !a.open}
                      onChange={(e) => updateDraft(['availability', day, 'to'], e.target.value)}
                      className={`flex-1 border rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none transition-all ${
                        editing && a.open
                          ? 'border-amber-200 focus:border-amber-400 bg-white text-warm-900'
                          : 'border-cream-200 bg-cream-100 text-warm-700 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  <button
                    onClick={() =>
                      editing && updateDraft(['availability', day, 'open'], !a.open)
                    }
                    disabled={!editing}
                    className={`w-12 h-7 rounded-full relative transition-all flex-shrink-0 ${
                      a.open
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                        : 'bg-cream-200'
                    } ${editing ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                  >
                    <span
                      className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                        a.open ? 'left-6' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </SectionCard>

        {/* Sticky save bar */}
        {editing && (
          <div className="sticky bottom-6 mt-8 p-4 bg-warm-900 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <p className="text-white text-sm font-semibold">
                {isNewProfile ? 'Fill in the details above' : 'You have unsaved changes'}
              </p>
            </div>
            <div className="flex gap-2">
              {!isNewProfile && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ SMALL COMPONENTS ============
const SectionCard = ({ title, icon, subtitle, editing, children }) => (
  <div className="bg-white rounded-3xl border border-amber-100 p-6 md:p-8 mb-6 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
        {icon}
      </div>
      <div>
        <h2 className="font-display text-lg font-bold text-warm-900">{title}</h2>
        {subtitle && <p className="text-xs text-warm-700">{subtitle}</p>}
      </div>
      {editing && (
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Editing
        </span>
      )}
    </div>
    {children}
  </div>
)

const StatChip = ({ label, value }) => (
  <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
    <p className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-0.5">
      {label}
    </p>
    <p className="font-display font-bold text-warm-900 text-base">{value}</p>
  </div>
)

const Field = ({ label, icon, value, editing, onChange, type = 'text', placeholder = '', disabled = false }) => (
  <div>
    <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-2 block">
      {label}
    </label>
    {editing && !disabled ? (
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-700 text-xs">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-amber-200 rounded-xl ${
            icon ? 'pl-11' : 'px-4'
          } pr-4 py-3 text-sm font-semibold text-warm-900 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all bg-white`}
        />
      </div>
    ) : (
      <div className={`flex items-center gap-2 ${icon ? 'pl-1' : ''} py-2`}>
        {icon && <span className="text-amber-600 text-xs">{icon}</span>}
        <p className={`text-sm font-semibold ${disabled ? 'text-warm-700' : 'text-warm-900'}`}>
          {value || '—'}
        </p>
        {disabled && (
          <span className="text-[9px] text-warm-500 uppercase font-bold ml-1">
            (Locked)
          </span>
        )}
      </div>
    )}
  </div>
)

export default MechanicProfile