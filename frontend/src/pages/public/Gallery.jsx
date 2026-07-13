import { useState } from 'react'
import { Link } from 'react-router-dom'
import { galleryCategories, galleryItems } from '../../mock/gallery.js'

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('Tout')

  const filtered = activeCategory === 'Tout'
    ? galleryItems
    : galleryItems.filter((g) => g.categorie === activeCategory)

  return (
    <div className="container py-4 py-lg-5">
      <section className="row align-items-center g-4 g-lg-5 mb-5">
        <div className="col-12 col-lg-7">
          <span className="eyebrow">Portfolio</span>
          <h1 className="display-4 mt-3">Des créations qui racontent la couture entre deux continents</h1>
          <p className="lead text-muted mt-3">
            À travers les grands boubous, tailleurs raffinés, robes de mariée et pièces prêt-à-porter,
            Maison Ìró compose des looks à la fois hérités et contemporains.
          </p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            {['Sur-mesure', 'Matières nobles', 'Broderie & finitions', 'Dakar · Paris'].map((tag) => (
              <span key={tag} className="badge rounded-pill" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--iro-border)', color: 'var(--iro-text)' }}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="glass p-3 p-md-4 rounded-4">
            <div className="row g-3">
              <div className="col-6">
                <div className="ratio ratio-1x1 rounded-3 overflow-hidden">
                  <img src={galleryItems[0]?.image} alt="" className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                </div>
              </div>
              <div className="col-6">
                <div className="ratio ratio-1x1 rounded-3 overflow-hidden">
                  <img src={galleryItems[3]?.image} alt="" className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                </div>
              </div>
              <div className="col-12">
                <div className="glass p-3 rounded-3" style={{ background: 'rgba(255,255,255,.05)' }}>
                  <div className="font-display fs-5">Collection signature</div>
                  <p className="text-muted small mb-3 mt-2">
                    Chaque pièce est pensée pour vous accompagner dans vos plus belles occasions, avec une vraie signature textile.
                  </p>
                  <Link to="/sur-mesure" className="btn-iro btn">Créer ma pièce</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="glass p-3 p-md-4 rounded-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <span className="eyebrow">Sélection</span>
            <h2 className="display-6 mt-2 mb-1">Parcourir les créations</h2>
            <p className="text-muted mb-0">Filtrez par univers pour découvrir l’inspiration qui vous ressemble.</p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn rounded-pill ${activeCategory === cat ? 'btn-iro' : 'btn-ghost btn-sm'}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {filtered.map((item) => (
          <div className="col" key={item.id}>
            <article className="glass hover-lift h-100 overflow-hidden">
              <div className="position-relative">
                <div className="ratio ratio-4x5 overflow-hidden">
                  <img src={item.image} alt={item.nom} className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                </div>
                <div className="position-absolute top-0 start-0 p-3">
                  <span className="status neutral">{item.categorie}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="font-display fs-5">{item.nom}</div>
                <p className="text-muted small mt-2 mb-3">{item.description}</p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge rounded-pill" style={{ background: 'rgba(255,138,61,.16)', color: 'var(--iro-orange)', border: '1px solid rgba(255,138,61,.25)' }}>{item.categorie}</span>
                  <span className="badge rounded-pill" style={{ background: 'rgba(123,92,255,.16)', color: 'var(--iro-text)', border: '1px solid rgba(123,92,255,.25)' }}>Made-to-measure</span>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      <section className="glass text-center p-4 p-md-5 rounded-4 mt-5" style={{ background: 'linear-gradient(120deg, rgba(255,138,61,.12), rgba(255,77,141,.12) 60%, rgba(123,92,255,.12))' }}>
        <span className="eyebrow">Prendre rendez-vous</span>
        <h2 className="display-6 mt-2 mb-3">Votre prochaine pièce mérite une vraie présence</h2>
        <p className="text-muted mb-4">Découvrez les matières, les coupes et l’atelier qui donneront vie à votre projet.</p>
        <Link to="/sur-mesure" className="btn-iro btn btn-lg">Réserver un atelier</Link>
      </section>
    </div>
  )
}
