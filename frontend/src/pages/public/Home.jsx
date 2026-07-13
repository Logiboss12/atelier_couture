import { Link } from 'react-router-dom'
import TextileTile from '../../components/TextileTile.jsx'
import { heroStats, materials, featuredCreations, testimonials } from '../../mock/testimonials.js'
import { photos } from '../../assets/images/index.js'

const ringTiles = ['wax', 'kente', 'indigo', 'hibiscus', 'jacquard', 'dentelle']
const marqueeWords = ['WAX', 'KENTE', 'BAZIN', 'JACQUARD', 'INDIGO', 'DENTELLE', 'SOIE', 'BOGOLAN']

const ringImages = {
  wax: photos.images7,
  kente: photos.images10,
  indigo: photos.costume1,
  hibiscus: photos.images9,
  jacquard: photos.images1,
  dentelle: photos.images2,
}

export default function Home() {
  return (
    <div className="container">
      {/* Hero */}
      <section className="row align-items-center min-vh-hero g-5">
        <div className="col-12 col-lg-6">
          <span className="eyebrow"><i className="bi bi-circle-fill text-success" style={{ fontSize: '.5rem' }}></i> Atelier Dakar · Paris</span>
          <h1 className="display-2 mt-3">
            La couture <span className="text-gradient">sur-mesure</span> qui relie deux continents
          </h1>
          <p className="lead text-muted mt-3">
            Maison Ìró fusionne les tissus africains — wax, kente, bazin — et les matières européennes
            pour des pièces uniques, taillées pour vous.
          </p>
          <div className="d-flex flex-wrap gap-3 mt-4">
            <Link to="/sur-mesure" className="btn-iro btn btn-lg">Créer ma pièce</Link>
            <Link to="/galerie" className="btn-ghost btn btn-lg">Voir la galerie</Link>
          </div>
          <div className="d-flex flex-wrap gap-4 mt-5">
            {heroStats.map((s) => (
              <div key={s.label}>
                <div className="font-display fs-3">{s.valeur}</div>
                <div className="eyebrow" style={{ color: 'var(--iro-faint)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-6 d-flex justify-content-center">
          <div style={{ perspective: '1400px', width: '100%', maxWidth: 420, height: 420 }}>
            <div
              className="position-relative w-100 h-100"
              style={{ transformStyle: 'preserve-3d', animation: 'ringspin 24s linear infinite' }}
            >
              {ringTiles.map((variant, i) => (
                <TextileTile
                  key={variant}
                  variant={variant}
                  image={ringImages[variant]}
                  className="position-absolute top-50 start-50 d-flex align-items-end p-3 shadow"
                  style={{
                    width: 200, height: 260, marginTop: -130, marginLeft: -100,
                    transform: `rotateY(${i * 60}deg) translateZ(215px)`,
                  }}
                >
                  <span className="font-mono text-uppercase small text-white" style={{ textShadow: '0 2px 6px rgba(0,0,0,.5)' }}>{variant}</span>
                </TextileTile>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bandeau défilant */}
      <div className="overflow-hidden border-top border-bottom py-3 my-5" style={{ borderColor: 'var(--iro-border)' }}>
        <div className="marquee-track">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="font-display fs-4 mx-4" style={{ color: 'var(--iro-faint)' }}>{w}</span>
          ))}
        </div>
      </div>

      {/* À propos */}
      <section id="apropos" className="row align-items-center g-5 py-5">
        <div className="col-12 col-lg-5 position-relative">
          <div className="glass p-3">
            <TextileTile image={photos.atelier} className="ratio ratio-4x3"></TextileTile>
          </div>
          <TextileTile variant="wax" className="position-absolute d-none d-md-block" style={{ width: 110, height: 110, bottom: -20, left: -30, transform: 'rotate(-8deg)', boxShadow: '0 10px 30px rgba(0,0,0,.4)' }} />
          <TextileTile variant="kente" className="position-absolute d-none d-md-block" style={{ width: 90, height: 90, top: -20, right: -20, transform: 'rotate(10deg)', boxShadow: '0 10px 30px rgba(0,0,0,.4)' }} />
        </div>
        <div className="col-12 col-lg-7">
          <span className="eyebrow">Notre histoire</span>
          <h2 className="display-6 mt-2">Deux continents, un même fil</h2>
          <p className="text-muted mt-3">
            Depuis Dakar et Paris, nos artisans marient l'héritage textile ouest-africain aux techniques
            de haute couture européenne. Chaque pièce est pensée comme un pont entre les cultures.
          </p>
          <p className="text-muted">
            Broderie main, patronage sur-mesure, matières sélectionnées auprès de fournisseurs de confiance :
            l'exigence est la même à chaque étape.
          </p>
          <div className="d-flex flex-wrap gap-2 mt-3">
            {['Fait main', 'Matières tracées', 'Sur-mesure', 'Livraison Dakar & Paris'].map((v) => (
              <span key={v} className="badge rounded-pill" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--iro-border)', color: 'var(--iro-text)' }}>{v}</span>
            ))}
          </div>
          <div className="row row-cols-3 g-3 mt-2">
            {heroStats.map((s) => (
              <div className="col" key={s.label}>
                <div className="font-display fs-4">{s.valeur}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Créations phares */}
      <section className="py-5">
        <span className="eyebrow">Sélection</span>
        <h2 className="display-6 mt-2 mb-4">Créations phares</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {featuredCreations.map((c) => (
            <div className="col" key={c.id}>
              <div className="glass hover-lift h-100 overflow-hidden">
                <TextileTile variant={c.tile.replace('tile-', '')} image={c.image} className="ratio ratio-4x3 rounded-0"></TextileTile>
                <div className="card-body p-3">
                  <div className="font-display fs-5">{c.nom}</div>
                  <div className="text-muted small">{c.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Matières */}
      <section className="py-5">
        <span className="eyebrow">Matières</span>
        <h2 className="display-6 mt-2 mb-4">Un textile pour chaque récit</h2>
        <div className="row row-cols-2 row-cols-lg-6 g-3">
          {materials.map((m) => (
            <div className="col" key={m.id}>
              <TextileTile variant={m.tile.replace('tile-', '')} className="ratio ratio-1x1 d-flex align-items-end p-2 hover-scale">
                <span className="font-mono small text-white text-uppercase" style={{ textShadow: '0 2px 6px rgba(0,0,0,.5)' }}>{m.nom}</span>
              </TextileTile>
            </div>
          ))}
        </div>
      </section>

      {/* Avis */}
      <section className="py-5">
        <span className="eyebrow">Témoignages</span>
        <h2 className="display-6 mt-2 mb-4">Ce qu'en disent nos client·e·s</h2>
        <div className="overflow-hidden">
          <div className="marquee-track gap-3">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="glass p-4 flex-shrink-0" style={{ width: 'min(360px,85vw)' }}>
                <div className="text-warning mb-2">
                  {Array.from({ length: t.note }).map((_, j) => <i key={j} className="bi bi-star-fill me-1"></i>)}
                </div>
                <p className="mb-3">« {t.texte} »</p>
                <div className="font-mono small text-muted">{t.nom} · {t.ville}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="glass text-center p-5 rounded-4 my-5" style={{ background: 'linear-gradient(120deg, rgba(255,138,61,.12), rgba(255,77,141,.12) 60%, rgba(123,92,255,.12))' }}>
        <h2 className="display-5 mb-3">Prêt·e à porter votre histoire ?</h2>
        <p className="text-muted mb-4">Réservez un rendez-vous ou lancez votre commande sur-mesure dès aujourd'hui.</p>
        <Link to="/sur-mesure" className="btn-iro btn btn-lg">Commencer ma commande</Link>
      </section>
    </div>
  )
}
