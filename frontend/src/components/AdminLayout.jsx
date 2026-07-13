import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AdminSidebar from './AdminSidebar.jsx'
import AdminTopbar from './AdminTopbar.jsx'

export default function AdminLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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
