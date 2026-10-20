export const serviceCategories = [
  {
    id: 'breakdown',
    label: 'Breakdown Repair',
    icon: '🔧',
    defaultPrice: 499,
    desc: 'Engine & mechanical fixes',
  },
  {
    id: 'towing',
    label: 'Towing Service',
    icon: '🚛',
    defaultPrice: 999,
    desc: 'Flatbed towing to garage',
  },
  {
    id: 'battery',
    label: 'Battery Jump-Start',
    icon: '🔋',
    defaultPrice: 299,
    desc: 'Instant battery boost',
  },
  {
    id: 'tire',
    label: 'Flat Tire Repair',
    icon: '🛞',
    defaultPrice: 349,
    desc: 'Puncture fix on-site',
  },
  {
    id: 'fuel',
    label: 'Fuel Delivery',
    icon: '⛽',
    defaultPrice: 199,
    desc: 'Petrol/diesel delivered',
  },
  {
    id: 'inspection',
    label: 'Vehicle Inspection',
    icon: '🔍',
    defaultPrice: 599,
    desc: 'Full 50-point checkup',
  },
]

// Default availability for new mechanics
export const defaultAvailability = {
  monday: { open: true, from: '09:00', to: '21:00' },
  tuesday: { open: true, from: '09:00', to: '21:00' },
  wednesday: { open: true, from: '09:00', to: '21:00' },
  thursday: { open: true, from: '09:00', to: '21:00' },
  friday: { open: true, from: '09:00', to: '21:00' },
  saturday: { open: true, from: '10:00', to: '18:00' },
  sunday: { open: false, from: '10:00', to: '14:00' },
}

// Empty services template
export const emptyServices = serviceCategories.map((c) => ({
  id: c.id,
  enabled: false,
  price: c.defaultPrice,
  eta: 20,
}))