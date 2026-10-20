import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBell, FaTools, FaStar, FaRupeeSign,
  FaExclamationTriangle, FaInfoCircle,
} from 'react-icons/fa'
import API from '../utils/api'

const iconMap = {
  job: <FaTools />,
  payment: <FaRupeeSign />,
  rating: <FaStar />,
  dispute: <FaExclamationTriangle />,
  system: <FaInfoCircle />,
}

const colorMap = {
  job: 'bg-blue-50 text-blue-600',
  payment: 'bg-emerald-50 text-emerald-600',
  rating: 'bg-yellow-50 text-yellow-600',
  dispute: 'bg-red-50 text-red-600',
  system: 'bg-amber-50 text-amber-600',
}

const NotificationBell = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({ notifications: [], unreadCount: 0 })
  const dropdownRef = useRef(null)

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications')
      setData(data.data)
    } catch (error) {
      // Silent fail
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleMarkAllRead = async (e) => {
    e.stopPropagation()
    try {
      await API.put('/notifications/read-all')
      fetchNotifications()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClickNotification = async (n) => {
    if (!n.read) {
      try {
        await API.put(`/notifications/${n._id}/read`)
      } catch (e) {}
    }
    if (n.link) navigate(n.link)
    setOpen(false)
    fetchNotifications()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-11 h-11 rounded-xl bg-white border border-amber-200 hover:border-amber-400 flex items-center justify-center text-warm-700 hover:text-amber-700 transition-colors"
        title="Notifications"
      >
        <FaBell />
        {data.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {data.unreadCount > 9 ? '9+' : data.unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl border border-amber-100 shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-cream-200 flex items-center justify-between">
            <h3 className="font-bold text-warm-900 text-sm">Notifications</h3>
            {data.unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold text-amber-700 hover:text-amber-800"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {data.notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-3xl mb-2">🔕</div>
                <p className="text-sm text-warm-700 font-semibold">
                  No notifications
                </p>
                <p className="text-xs text-warm-700 mt-1">You're all caught up!</p>
              </div>
            ) : (
              data.notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleClickNotification(n)}
                  className={`w-full p-3 flex items-start gap-3 text-left hover:bg-cream-50 transition-colors border-b border-cream-100 last:border-0 ${
                    !n.read ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      colorMap[n.type] || colorMap.system
                    }`}
                  >
                    {iconMap[n.type] || iconMap.system}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs ${
                        !n.read ? 'font-bold' : 'font-semibold'
                      } text-warm-900 truncate`}
                    >
                      {n.title}
                    </p>
                    <p className="text-[11px] text-warm-700 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[9px] text-warm-700/70 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell