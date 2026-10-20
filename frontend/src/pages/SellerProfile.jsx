import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaStore, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaEdit, FaSave, FaTimes, FaSpinner, FaShieldAlt, FaCheck,
  FaBox, FaShoppingBag, FaRupeeSign,
} from 'react-icons/fa'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'

const SellerProfile = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'error' })
  const [draft, setDraft] = useState({})

  // ============ FETCH ============
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/sellers/me')
      setProfile(data.data.user)
      setStats(data.data.stats || {})
      setDraft(data.data.user)
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to load profile',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // ============ SAVE ============
  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        name: draft.name,
        phone: draft.phone,
        city: draft.city,
        businessName: draft.businessName,
        gstNumber: draft.gstNumber,
        address: draft.address,
        about: draft.about,
      }
      const { data } = await API.put('/sellers/me', payload)
      setProfile(data.data)
      setDraft(data.data)
      setEditing(false)
      setToast({ message: 'Profile saved!', type: 'success' })
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to save',
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setDraft(profile)
    setEditing(false)
  }

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

  const initials = profile?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'S'

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/seller')}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* COVER */}
        <div className="bg-white rounded-3xl border border-amber-100 overflow-hidden mb-6">
          <div className="relative h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} />
          </div>

          <div className="relative px-6 md:px-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 border-4 border-white flex items-center justify-center text-white text-3xl font-display font-bold shadow-xl">
                  {initials}
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display text-2xl font-bold text-warm-900">
                      {profile?.businessName || profile?.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase">
                      <FaShieldAlt className="text-[8px]" /> Verified
                    </span>
                  </div>
                  <p className="text-sm text-warm-700">
                    {profile?.name} • {profile?.city || '—'}
                  </p>
                  <p className="text-xs text-warm-700">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2.5 rounded-xl bg-white border border-cream-200 text-warm-700 text-sm font-semibold hover:bg-cream-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <FaSpinner className="animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Save
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* STAT CHIPS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              <StatChip
                icon={<FaBox />}
                label="Products"
                value={stats.totalProducts || 0}
              />
              <StatChip
                icon={<FaShoppingBag />}
                label="Orders"
                value={stats.totalOrders || 0}
              />
              <StatChip
                icon={<FaRupeeSign />}
                label="Revenue"
                value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
              />
            </div>
          </div>
        </div>

        {/* BASIC INFO */}
        <SectionCard title="Basic Info" icon={<FaUser />} editing={editing}>
          <Field
            label="Owner Name"
            value={editing ? draft.name : profile?.name}
            editing={editing}
            onChange={(v) => setDraft({ ...draft, name: v })}
          />
          <Field
            label="Business Name"
            icon={<FaStore />}
            value={editing ? draft.businessName : profile?.businessName}
            editing={editing}
            onChange={(v) => setDraft({ ...draft, businessName: v })}
            placeholder="e.g. AutoZone Parts"
          />
          <Field
            label="Email"
            icon={<FaEnvelope />}
            value={profile?.email}
            editing={false}
            onChange={() => {}}
          />
        </SectionCard>

        {/* CONTACT */}
        <SectionCard title="Contact Details" icon={<FaPhone />} editing={editing}>
          <Field
            label="Phone"
            icon={<FaPhone />}
            value={editing ? draft.phone : profile?.phone}
            editing={editing}
            onChange={(v) =>
              setDraft({ ...draft, phone: v.replace(/\D/g, '').slice(0, 10) })
            }
          />
          <Field
            label="City"
            icon={<FaMapMarkerAlt />}
            value={editing ? draft.city : profile?.city}
            editing={editing}
            onChange={(v) => setDraft({ ...draft, city: v })}
          />
          <Field
            label="Address"
            icon={<FaMapMarkerAlt />}
            value={editing ? draft.address : profile?.address}
            editing={editing}
            onChange={(v) => setDraft({ ...draft, address: v })}
            placeholder="Full business address"
          />
        </SectionCard>

        {/* BUSINESS */}
        <SectionCard title="Business Info" icon={<FaStore />} editing={editing}>
          <Field
            label="GST Number"
            value={editing ? draft.gstNumber : profile?.gstNumber}
            editing={editing}
            onChange={(v) => setDraft({ ...draft, gstNumber: v })}
            placeholder="Optional"
          />
          <div>
            <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-1.5 block">
              About Your Business
            </label>
            {editing ? (
              <textarea
                value={draft.about || ''}
                onChange={(e) => setDraft({ ...draft, about: e.target.value })}
                rows={3}
                placeholder="Tell customers about your store..."
                className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 resize-none bg-white"
              />
            ) : (
              <p className="text-sm text-warm-800 leading-relaxed bg-cream-50 rounded-xl px-4 py-3 border border-cream-200">
                {profile?.about || 'No description yet.'}
              </p>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

const SectionCard = ({ title, icon, editing, children }) => (
  <div className="bg-white rounded-3xl border border-amber-100 p-6 md:p-8 mb-6 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-md">
        {icon}
      </div>
      <h2 className="font-display text-lg font-bold text-warm-900">{title}</h2>
      {editing && (
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Editing
        </span>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
)

const StatChip = ({ icon, label, value }) => (
  <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-amber-600 text-xs">{icon}</span>
      <p className="text-[10px] font-bold text-warm-700 uppercase tracking-wider">
        {label}
      </p>
    </div>
    <p className="font-display font-bold text-warm-900 text-base">{value}</p>
  </div>
)

const Field = ({ label, icon, value, editing, onChange, placeholder }) => (
  <div>
    <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider mb-1.5 block">
      {label}
    </label>
    {editing ? (
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-700 text-xs">
            {icon}
          </span>
        )}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-cream-200 rounded-xl ${
            icon ? 'pl-11' : 'pl-4'
          } pr-4 py-3 text-sm font-semibold text-warm-900 placeholder-warm-700/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all bg-white`}
        />
      </div>
    ) : (
      <div className="flex items-center gap-2 py-2">
        {icon && <span className="text-amber-600 text-xs">{icon}</span>}
        <p className="text-sm font-semibold text-warm-900">
          {value || '—'}
        </p>
      </div>
    )}
  </div>
)

export default SellerProfile