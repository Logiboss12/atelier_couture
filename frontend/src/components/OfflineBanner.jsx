import { useEffect, useState } from 'react'

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOffline(false)
    const goOffline = () => setOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      className="text-center small py-1 px-3"
      style={{ background: 'var(--iro-orange)', color: '#2b1503', position: 'sticky', top: 0, zIndex: 2000 }}
      role="status"
    >
      <i className="bi bi-wifi-off me-2"></i>
      Vous êtes hors-ligne. Les nouvelles commandes et prises de mesures seront envoyées automatiquement dès le retour du réseau.
    </div>
  )
}
