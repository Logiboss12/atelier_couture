import { useLocation, useNavigate } from 'react-router-dom'
import { adminNavItems } from './AdminSidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminTopbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const current = [...adminNavItems].reverse().find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )

  const handleLogout = async () => {
    await logout()
    navigate('/connexion')
  }

  return (
    <div className="glass d-flex align-items-center justify-content-between gap-3 p-3 mb-3 sticky-top" style={{ top: '0.75rem', zIndex: 1020 }}>
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-ghost btn-sm d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#adminSidebarOffcanvas"
          aria-controls="adminSidebarOffcanvas"
          aria-label="Ouvrir le menu"
        >
          <i className="bi bi-list fs-5"></i>
        </button>
        <div>
          <div className="eyebrow d-none d-sm-block">Back-office</div>
          <div className="font-display fs-4">{current?.label || 'Administration'}</div>
        </div>
      </div>

      <div className="d-none d-md-flex input-group rounded-pill overflow-hidden" style={{ maxWidth: 280 }}>
        <span className="input-group-text bg-transparent border-0 ps-3" style={{ color: 'var(--iro-faint)' }}>
          <i className="bi bi-search"></i>
        </span>
        <input type="search" className="form-control border-0 bg-transparent" placeholder="Rechercher…" aria-label="Rechercher" />
      </div>

      <div className="d-flex align-items-center gap-2">
        <button type="button" className="btn btn-ghost btn-sm position-relative rounded-circle" aria-label="Notifications">
          <i className="bi bi-bell"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: 'var(--iro-red)' }}>4</span>
        </button>
        <button type="button" className="btn-iro btn btn-sm d-none d-sm-inline-flex" onClick={() => navigate('/admin/commandes')}>
          <i className="bi bi-plus-lg me-1"></i> Nouvelle commande
        </button>
        <span className="text-muted small d-none d-md-inline">{user?.name}</span>
        <button type="button" className="btn btn-ghost btn-sm rounded-circle" aria-label="Déconnexion" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  )
}
