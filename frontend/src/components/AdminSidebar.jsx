import { NavLink } from 'react-router-dom'

export const adminNavItems = [
  { to: '/admin', label: 'Tableau de bord', icon: 'bi-grid-1x2', end: true },
  { to: '/admin/clients', label: 'Clients', icon: 'bi-people' },
  { to: '/admin/commandes', label: 'Commandes', icon: 'bi-scissors', badge: 18 },
  { to: '/admin/devis', label: 'Devis & Factures', icon: 'bi-receipt', badge: 5 },
  { to: '/admin/catalogue', label: 'Catalogue', icon: 'bi-tag' },
  { to: '/admin/stocks', label: 'Stocks', icon: 'bi-box-seam', badge: 3 },
  { to: '/admin/promotions', label: 'Promos & Événements', icon: 'bi-megaphone' },
  { to: '/admin/finances', label: 'Finances', icon: 'bi-cash-coin' },
  { to: '/admin/livraisons', label: 'Livraisons', icon: 'bi-truck' },
  { to: '/admin/equipe', label: 'Équipe', icon: 'bi-person-badge' },
  { to: '/admin/parametres', label: 'Paramètres', icon: 'bi-gear' },
]

function SidebarNav({ onNavigate }) {
  return (
    <>
      <NavLink to="/admin" end className="d-flex align-items-center gap-2 mb-4 text-decoration-none">
        <span className="font-display fs-5">Maison <span className="text-gradient">Ìró</span></span>
      </NavLink>
      <nav className="d-flex flex-column gap-1 flex-grow-1 overflow-auto">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 rounded-3 px-3 py-2 ${isActive ? 'active' : ''}`
            }
            style={({ isActive }) => isActive
              ? { background: 'linear-gradient(90deg, rgba(255,77,141,.18), transparent)', borderLeft: '3px solid var(--iro-magenta)' }
              : { borderLeft: '3px solid transparent' }}
          >
            <i className={`bi ${item.icon}`} aria-hidden="true"></i>
            <span className="flex-grow-1">{item.label}</span>
            {item.badge ? <span className="badge rounded-pill" style={{ background: 'var(--iro-magenta)' }}>{item.badge}</span> : null}
          </NavLink>
        ))}
      </nav>
      <div className="d-flex align-items-center gap-2 pt-3 mt-3 border-top">
        <div className="rounded-circle" style={{ width: 40, height: 40, background: 'var(--iro-grad)' }} aria-hidden="true"></div>
        <div>
          <div className="fw-semibold small">Khady Sarr</div>
          <div className="text-muted font-mono" style={{ fontSize: '.7rem' }}>Cheffe d'atelier</div>
        </div>
      </div>
    </>
  )
}

export default function AdminSidebar() {
  return (
    <>
      <aside className="d-none d-lg-flex flex-column glass p-3 m-3 me-0" style={{ width: 238, position: 'sticky', top: '1rem', height: 'calc(100vh - 2rem)' }}>
        <SidebarNav />
      </aside>

      <div className="offcanvas offcanvas-start d-lg-none" tabIndex="-1" id="adminSidebarOffcanvas" aria-labelledby="adminSidebarLabel">
        <div className="offcanvas-header">
          <span id="adminSidebarLabel" className="font-display fs-5">Menu</span>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Fermer"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <SidebarNav onNavigate={() => document.getElementById('adminSidebarOffcanvas')?.querySelector('.btn-close')?.click()} />
        </div>
      </div>
    </>
  )
}
