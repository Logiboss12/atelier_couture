import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import NotificationBell from './NotificationBell.jsx'

const links = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/galerie', label: 'Galerie' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/rendez-vous', label: 'Rendez-vous' },
  { to: '/contact', label: 'Contact' },
]

export default function PublicNavbar() {
  const cart = useCart()
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg fixed-top glass mx-2 mx-md-3 mt-2 rounded-4 px-2" style={{ zIndex: 1030 }}>
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand font-display fs-4">
          Maison <span className="text-gradient">Ìró</span>
        </NavLink>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNav"
          aria-controls="publicNav"
          aria-expanded="false"
          aria-label="Ouvrir la navigation"
        >
          <i className="bi bi-list text-white fs-2"></i>
        </button>
        <div className="collapse navbar-collapse" id="publicNav">
          <ul className="navbar-nav mx-auto gap-lg-2 py-2 py-lg-0">
            {links.map((l) => (
              <li className="nav-item" key={l.to}>
                <NavLink to={l.to} end={l.end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-2 pb-3 pb-lg-0">
            <NavLink to="/panier" className="btn-ghost btn btn-sm position-relative" aria-label="Voir le panier">
              <i className="bi bi-bag"></i>
              {cart?.count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: 'var(--iro-magenta)' }}>
                  {cart.count}
                </span>
              )}
            </NavLink>
            <NavLink to="/espace-client" className="btn-iro btn btn-sm">Créer ma pièce</NavLink>
            {user ? (
              <>
                {isAdmin && (
                  <NavLink to="/admin" className="btn-ghost btn btn-sm">Admin</NavLink>
                )}
                {!isAdmin && (
                  <>
                    <NotificationBell />
                    <NavLink to="/espace-client" className="btn-ghost btn btn-sm">Mon espace</NavLink>
                  </>
                )}
                <button type="button" className="btn-ghost btn btn-sm" onClick={handleLogout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <NavLink to="/connexion" className="btn-ghost btn btn-sm">Connexion</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
