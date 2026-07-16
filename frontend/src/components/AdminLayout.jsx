import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AdminSidebar from './AdminSidebar.jsx'
import AdminTopbar from './AdminTopbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLayout() {
  const location = useLocation()
  const { loading, isAuthenticated, isStaff } = useAuth()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border" style={{ color: 'var(--iro-magenta)' }} role="status">
          <span className="visually-hidden">Chargement…</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isStaff) {
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />
  }

  return (
    <>
      <div className="bg-mesh bg-mesh-admin" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <div className="page-shell d-flex" style={{ minHeight: '100vh' }}>
        <AdminSidebar />
        <div className="flex-grow-1 d-flex flex-column p-3 p-md-4" style={{ minWidth: 0 }}>
          <AdminTopbar />
          <div className="flex-grow-1 fade-up" key={location.pathname}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}
