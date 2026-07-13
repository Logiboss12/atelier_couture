import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import PublicNavbar from './PublicNavbar.jsx'
import Footer from './Footer.jsx'

export default function PublicLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <div className="bg-mesh" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="page-shell d-flex flex-column min-vh-100">
        <PublicNavbar />
        <main className="container-fluid py-5 flex-grow-1 fade-up" style={{ marginTop: '5.5rem' }} key={location.pathname}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
