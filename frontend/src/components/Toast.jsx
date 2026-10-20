import { useEffect } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa'

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  const config = {
    error: {
      bg: 'bg-red-500',
      icon: <FaExclamationCircle />,
    },
    success: {
      bg: 'bg-emerald-500',
      icon: <FaCheckCircle />,
    },
    info: {
      bg: 'bg-blue-500',
      icon: <FaExclamationCircle />,
    },
  }[type]

  return (
    <div className="fixed top-24 right-6 z-[100] animate-slideIn">
      <div className={`${config.bg} text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm`}>
        <span className="text-lg flex-shrink-0">{config.icon}</span>
        <p className="text-sm font-semibold flex-1">{message}</p>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center flex-shrink-0"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  )
}

export default Toast