import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaPlus, FaCar, FaSearch, FaArrowLeft, FaShieldAlt,
} from 'react-icons/fa'
import VehicleCard from '../components/VehicleCard'
import VehicleListItem from '../components/VehicleListItem'
import VehicleFormModal from '../components/VehicleFormModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import QuickStatsBanner from '../components/QuickStatsBanner'
import RemindersPanel from '../components/RemindersPanel'
import QuickActionsRow from '../components/QuickActionsRow'
import ViewToggle from '../components/ViewToggle'
import Button from '../components/Button'
import Toast from '../components/Toast'
import API from '../utils/api'
import { upcomingReminders } from '../data/vehicles'

const Vehicles = () => {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [stats, setStats] = useState([
    { id: 'total', label: 'Total Vehicles', value: 0, icon: '🚗', color: 'brand' },
    { id: 'services', label: 'Services Done', value: 0, icon: '🔧', color: 'emerald' },
    { id: 'spent', label: 'Total Spent', value: '₹0', icon: '💰', color: 'amber' },
    { id: 'savings', label: 'Savings', value: '₹0', icon: '📈', color: 'blue' },
  ])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'error' })
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [view, setView] = useState('grid')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ open: false, vehicle: null })

  // ============ FETCH VEHICLES + STATS ============
  const fetchData = async () => {
    try {
      setLoading(true)

      const [vehiclesRes, statsRes] = await Promise.all([
        API.get('/vehicles'),
        API.get('/vehicles/stats').catch(() => ({ data: { data: null } })),
      ])

      setVehicles(vehiclesRes.data.data || [])

      // ✅ Update stats with real backend data
      if (statsRes.data.data) {
        const { totalVehicles, totalServices, totalSpent, totalSavings } =
          statsRes.data.data

        setStats([
          {
            id: 'total',
            label: 'Total Vehicles',
            value: totalVehicles,
            icon: '🚗',
            color: 'brand',
          },
          {
            id: 'services',
            label: 'Services Done',
            value: totalServices,
            icon: '🔧',
            color: 'emerald',
          },
          {
            id: 'spent',
            label: 'Total Spent',
            value: `₹${totalSpent.toLocaleString()}`,
            icon: '💰',
            color: 'amber',
          },
          {
            id: 'savings',
            label: 'Savings',
            value: `₹${totalSavings.toLocaleString()}`,
            icon: '📈',
            color: 'blue',
          },
        ])
      }
    } catch (error) {
      console.error('❌ Fetch error:', error)
      setToast({
        message: error.response?.data?.message || 'Failed to load data',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ============ SAVE (CREATE + UPDATE) ============
  const handleSave = async (formData) => {
    try {
      setSaving(true)

      if (editingVehicle) {
        await API.put(`/vehicles/${editingVehicle._id}`, formData)
        setToast({ message: '✓ Vehicle updated', type: 'success' })
      } else {
        await API.post('/vehicles', formData)
        setToast({ message: '✓ Vehicle added', type: 'success' })
      }

      setModalOpen(false)
      setEditingVehicle(null)
      fetchData()  // ✅ Refetch both vehicles AND stats
    } catch (error) {
      console.error('❌ Save error:', error)
      setToast({
        message: error.response?.data?.message || 'Failed to save vehicle',
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  // ============ DELETE ============
  const handleDeleteConfirm = async (id) => {
    try {
      await API.delete(`/vehicles/${id}`)
      setToast({ message: '✓ Vehicle deleted', type: 'success' })
      setDeleteModal({ open: false, vehicle: null })
      fetchData()  // ✅ Refetch
    } catch (error) {
      console.error('❌ Delete error:', error)
      setToast({
        message: error.response?.data?.message || 'Failed to delete',
        type: 'error',
      })
    }
  }

  // ============ SET DEFAULT ============
  const handleSetDefault = async (id) => {
    try {
      await API.put(`/vehicles/${id}/default`)
      setToast({ message: '✓ Default vehicle updated', type: 'success' })
      fetchData()
    } catch (error) {
      console.error('❌ Default error:', error)
      setToast({
        message: error.response?.data?.message || 'Failed to set default',
        type: 'error',
      })
    }
  }

  // ============ MODAL HANDLERS ============
  const handleAdd = () => {
    setEditingVehicle(null)
    setModalOpen(true)
  }

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingVehicle(null)
  }

  // ============ SCROLL TO GRID ============
  const handleViewAllReminders = () => {
    document.getElementById('vehicles-grid')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  // ============ FILTER + SORT ============
  let filtered = vehicles.filter((v) => {
    const matchSearch =
      !search ||
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.plate?.toLowerCase().includes(search.toLowerCase()) ||
      v.make?.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || v.type === filterType
    return matchSearch && matchType
  })

  if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  if (sortBy === 'year') filtered = [...filtered].sort((a, b) => b.year - a.year)

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-warm-700 hover:text-amber-700 mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-3">
              <FaShieldAlt className="text-amber-700 text-xs" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                My Garage
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-1">
              Vehicle Management
            </h1>
            <p className="text-warm-700 text-sm">
              {loading
                ? 'Loading...'
                : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} in your garage`}
            </p>
          </div>

          <Button onClick={handleAdd}>
            <FaPlus /> Add Vehicle
          </Button>
        </div>

        {/* Stats — now with real data */}
        {vehicles.length > 0 && <QuickStatsBanner stats={stats} />}
        {vehicles.length > 0 && <QuickActionsRow />}

        {vehicles.length > 0 && (
          <RemindersPanel
            reminders={upcomingReminders}
            onViewAll={handleViewAllReminders}
          />
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-3xl border border-amber-100 p-12 text-center">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-warm-700">Loading your vehicles...</p>
          </div>
        )}

        {/* Filters */}
        {!loading && vehicles.length > 0 && (
          <div className="bg-white rounded-2xl border border-amber-100 p-4 mb-6 flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-700 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, plate, or make..."
                className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-11 pr-4 py-3 text-sm text-warm-900 placeholder-warm-700/60 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 text-sm font-semibold text-warm-800 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="car">Cars</option>
                <option value="bike">Motorcycles</option>
                <option value="suv">SUVs</option>
                <option value="truck">Trucks</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 text-sm font-semibold text-warm-800 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="recent">Recent</option>
                <option value="name">Name A-Z</option>
                <option value="year">Year</option>
              </select>

              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {vehicles.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-amber-200 p-12 md:p-20 text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-3xl mb-6 shadow-lg shadow-amber-500/30">
                  <FaCar />
                </div>
                <h2 className="font-display text-2xl font-bold text-warm-900 mb-2">
                  No vehicles yet
                </h2>
                <p className="text-warm-700 mb-8 max-w-md mx-auto">
                  Add your first vehicle to start requesting roadside assistance.
                </p>
                <Button onClick={handleAdd} size="lg">
                  <FaPlus /> Add Your First Vehicle
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-3xl border border-amber-100 p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-display text-xl font-bold text-warm-900 mb-2">
                  No vehicles match your search
                </h3>
                <button
                  onClick={() => {
                    setSearch('')
                    setFilterType('all')
                  }}
                  className="text-amber-700 font-semibold text-sm hover:text-amber-800 mt-4"
                >
                  Clear all filters
                </button>
              </div>
            ) : view === 'grid' ? (
              <div
                id="vehicles-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-28"
              >
                {filtered.map((vehicle) => (
                  <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                    onEdit={handleEdit}
                    onDelete={(v) => setDeleteModal({ open: true, vehicle: v })}
                    onSetDefault={handleSetDefault}
                  />
                ))}
              </div>
            ) : (
              <div id="vehicles-grid" className="space-y-3 scroll-mt-28">
                {filtered.map((vehicle) => (
                  <VehicleListItem
                    key={vehicle._id}
                    vehicle={vehicle}
                    onEdit={handleEdit}
                    onDelete={(v) => setDeleteModal({ open: true, vehicle: v })}
                    onSetDefault={handleSetDefault}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <VehicleFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingVehicle={editingVehicle}
        saving={saving}
      />

      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, vehicle: null })}
        onConfirm={handleDeleteConfirm}
        vehicle={deleteModal.vehicle}
      />
    </div>
  )
}

export default Vehicles