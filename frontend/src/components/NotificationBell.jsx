import { useState } from 'react'
import { useFetch } from '../api/useFetch.js'
import { getMe, markNotificationRead } from '../api/me.js'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return "à l'instant"
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`
  return `il y a ${Math.floor(diff / 86400)} j`
}

export default function NotificationBell() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data } = useFetch(getMe, [refreshKey])
  const notifications = data?.client?.notifications || []
  const unreadCount = notifications.filter((n) => !n.read_at).length

  const handleClick = async (notification) => {
    if (notification.read_at) return
    await markNotificationRead(notification.id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="dropdown">
      <button
        type="button"
        className="btn btn-ghost btn-sm position-relative rounded-circle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Notifications"
      >
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: 'var(--iro-magenta)' }}>
            {unreadCount}
          </span>
        )}
      </button>
      <div className="dropdown-menu dropdown-menu-end p-2" style={{ minWidth: 300, maxHeight: 360, overflowY: 'auto' }}>
        {notifications.length === 0 && <p className="text-muted small px-2 py-1 mb-0">Aucune notification.</p>}
        {notifications.map((n) => (
          <button
            key={n.id}
            type="button"
            className="dropdown-item small py-2 border-bottom bg-transparent"
            style={{ whiteSpace: 'normal', borderColor: 'var(--iro-border)', opacity: n.read_at ? 0.6 : 1 }}
            onClick={() => handleClick(n)}
          >
            <div>{n.message}</div>
            <div className="text-muted" style={{ fontSize: '.7rem' }}>{timeAgo(n.created_at)}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
