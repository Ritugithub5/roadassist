export const vehicleTypes = [
  { id: 'car', label: 'Car', icon: '🚗' },
  { id: 'bike', label: 'Motorcycle', icon: '🏍️' },
  { id: 'suv', label: 'SUV', icon: '🚙' },
  { id: 'truck', label: 'Truck', icon: '🚚' },
]

export const fuelTypes = [
  { id: 'petrol', label: 'Petrol' },
  { id: 'diesel', label: 'Diesel' },
  { id: 'cng', label: 'CNG' },
  { id: 'electric', label: 'Electric' },
  { id: 'hybrid', label: 'Hybrid' },
]

export const initialVehicles = [
  {
    id: 'v1',
    name: 'Honda City',
    make: 'Honda',
    model: 'City ZX',
    year: 2022,
    plate: 'OD-02-AB-1234',
    type: 'car',
    fuel: 'petrol',
    color: 'Pearl White',
    isDefault: true,
    lastService: '12 Mar 2026',
    odometer: 24500,
    healthScore: 92,
    insuranceExpiry: '2026-11-15',
    pucExpiry: '2026-08-22',
    serviceDue: '2026-04-12',
    avgMileage: '18.4 km/L',
  },
  {
    id: 'v2',
    name: 'Royal Enfield Classic',
    make: 'Royal Enfield',
    model: 'Classic 350',
    year: 2021,
    plate: 'OD-02-CD-5678',
    type: 'bike',
    fuel: 'petrol',
    color: 'Stealth Black',
    isDefault: false,
    lastService: '05 Feb 2026',
    odometer: 12800,
    healthScore: 86,
    insuranceExpiry: '2026-06-10',
    pucExpiry: '2026-05-30',
    serviceDue: '2026-05-05',
    avgMileage: '35.2 km/L',
  },
]

export const quickStats = [
  { id: 'total', label: 'Total Vehicles', value: 2, icon: '🚗', color: 'brand' },
  { id: 'services', label: 'Services Done', value: 24, icon: '🔧', color: 'emerald' },
  { id: 'spent', label: 'Total Spent', value: '₹18,420', icon: '💰', color: 'amber' },
  { id: 'savings', label: 'Savings', value: '₹4,200', icon: '📈', color: 'blue' },
]

export const upcomingReminders = [
  { id: 'r1', vehicle: 'Royal Enfield Classic', type: 'PUC Expiry', date: '30 May 2026', days: 8, urgency: 'high' },
  { id: 'r2', vehicle: 'Honda City', type: 'Insurance Renewal', date: '15 Nov 2026', days: 42, urgency: 'medium' },
  { id: 'r3', vehicle: 'Royal Enfield Classic', type: 'Insurance Renewal', date: '10 Jun 2026', days: 15, urgency: 'high' },
]