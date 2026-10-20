import { useNavigate } from 'react-router-dom'
import { FaTruckPickup, FaTools, FaShieldAlt, FaFileInvoice, FaArrowRight } from 'react-icons/fa'

const QuickActionsRow = () => {
  const navigate = useNavigate()

  const actions = [
    {
      icon: <FaTruckPickup />,
      title: 'Request Roadside Help',
      desc: 'Towing, jump-start, fuel',
      color: 'from-red-500 to-orange-500',
      path: '/request-service',
    },
    {
      icon: <FaTools />,
      title: 'Book Service',
      desc: 'Schedule at partner garage',
      color: 'from-brand-500 to-brand-600',
      path: '/request-service',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Renew Insurance',
      desc: 'Compare 10+ insurers',
      color: 'from-emerald-500 to-emerald-600',
      path: '/insurance',
    },
    {
      icon: <FaFileInvoice />,
      title: 'Service History',
      desc: 'View past invoices',
      color: 'from-blue-500 to-blue-600',
      path: '/history',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {actions.map((a, i) => (
        <button
          key={i}
          onClick={() => navigate(a.path)}
          className="group relative bg-white rounded-2xl border border-ink-100 p-5 text-left hover:border-brand-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white text-lg mb-3 shadow-md group-hover:scale-110 transition-transform`}>
            {a.icon}
          </div>
          <p className="font-bold text-ink-900 text-sm mb-0.5">{a.title}</p>
          <p className="text-xs text-ink-500 mb-3">{a.desc}</p>
          <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2 transition-all">
            Open <FaArrowRight className="text-[10px]" />
          </div>
        </button>
      ))}
    </div>
  )
}

export default QuickActionsRow