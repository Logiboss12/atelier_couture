import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer glass mx-2 mx-md-3 mb-3 rounded-4 p-4 p-md-5 mt-5">
      <div className="row row-cols-2 row-cols-md-4 g-4">
        <div className="col">
          <div className="font-display fs-5 mb-2">Maison Ìró</div>
          <p className="text-muted small mb-0">Couture sur-mesure, axe Dakar · Paris. Fusion tissus africains et matières européennes.</p>
        </div>
        <div className="col">
          <div className="eyebrow mb-2">Navigation</div>
          <ul className="list-unstyled d-flex flex-column gap-2 small">
            <li><Link to="/galerie">Galerie</Link></li>
            <li><Link to="/boutique">Boutique</Link></li>
            <li><Link to="/sur-mesure">Sur-mesure</Link></li>
            <li><Link to="/rendez-vous">Rendez-vous</Link></li>
          </ul>
        </div>
        <div className="col">
          <div className="eyebrow mb-2">Ateliers</div>
          <ul className="list-unstyled small text-muted d-flex flex-column gap-2">
            <li>Dakar, Sénégal — Rue 12 Almadies</li>
            <li>Paris, France — Le Marais</li>
          </ul>
        </div>
        <div className="col">
          <div className="eyebrow mb-2">Suivez-nous</div>
          <div className="d-flex gap-2">
            <a href="#" className="btn-ghost btn btn-sm rounded-circle" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" className="btn-ghost btn btn-sm rounded-circle" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" className="btn-ghost btn btn-sm rounded-circle" aria-label="WhatsApp"><i className="bi bi-whatsapp"></i></a>
          </div>
        </div>
      </div>
      <div className="text-center text-muted small mt-4 pt-3 border-top">
        © 2026 Maison Ìró. Tous droits réservés.
      </div>
    </footer>
  )
}
