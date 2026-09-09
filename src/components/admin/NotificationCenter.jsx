import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import { FaBell, FaClock, FaEnvelope } from 'react-icons/fa'

const NotificationCenter = () => {
  const { isDark } = useTheme()
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()

    const subscription = supabase
      .channel('mentorship_applications_changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mentorship_applications' },
        (payload) => {
          addNotification({
            id: payload.new.id,
            type: 'new_application',
            title: 'New Mentorship Application',
            message: `${payload.new.full_name} applied for ${payload.new.service_title}`,
            data: payload.new,
            timestamp: new Date(),
            read: false
          })
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  const fetchNotifications = async () => {
    const { data: pendingApps } = await supabase
      .from('mentorship_applications')
      .select('*')
      .eq('payment_status', 'awaiting_verification')
      .limit(5)

    const { data: newApps } = await supabase
      .from('mentorship_applications')
      .select('*')
      .eq('status', 'new')
      .limit(5)

    const notifs = []

    if (pendingApps) {
      pendingApps.forEach(app => {
        notifs.push({
          id: `pending-${app.id}`,
          type: 'pending_verification',
          title: 'Payment Pending Verification',
          message: `${app.full_name} - $${app.payment_amount}`,
          data: app,
          timestamp: new Date(app.submitted_at),
          read: false
        })
      })
    }

    if (newApps) {
      newApps.forEach(app => {
        notifs.push({
          id: `new-${app.id}`,
          type: 'new_application',
          title: 'New Application',
          message: `${app.full_name} - ${app.service_title}`,
          data: app,
          timestamp: new Date(app.submitted_at),
          read: false
        })
      })
    }

    setNotifications(notifs.slice(0, 10))
    setUnreadCount(notifs.filter(n => !n.read).length)
  }

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 20))
    setUnreadCount(prev => prev + 1)
  }

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const getIcon = (type) => {
    switch(type) {
      case 'new_application':
        return <FaEnvelope className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      case 'pending_verification':
        return <FaClock className="w-4 h-4 text-yellow-500" />
      default:
        return <FaBell className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
      >
        <FaBell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border z-50 overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-3 border-b flex justify-between items-center ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-yellow-600 hover:underline font-medium">
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className={`p-6 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  No notifications
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3 border-b cursor-pointer transition-colors ${isDark ? 'border-gray-700/50 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} ${!notif.read ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50') : ''}`}
                    onClick={() => {
                      markAsRead(notif.id)
                      setShowDropdown(false)
                    }}
                  >
                    <div className="flex gap-3">
                      {getIcon(notif.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{notif.title}</p>
                        <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{notif.message}</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationCenter
