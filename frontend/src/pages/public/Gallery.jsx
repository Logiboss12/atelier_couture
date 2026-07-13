import { useState } from 'react'
import TextileTile from '../../components/TextileTile.jsx'
import { galleryCategories, galleryItems } from '../../mock/gallery.js'

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('Tout')

  const filtered = activeCategory === 'Tout'
    ? galleryItems
    : galleryItems.filter((g) => g.categorie === activeCategory)

  return (
    <div className="container">
      <span className="eyebrow">Portfolio</span>
      <h1 className="display-4 mt-2">Galerie de créations</h1>
      <p className="text-muted">Un aperçu de nos pièces sur-mesure et prêt-à-porter, atelier après atelier.</p>

      <div className="d-flex flex-wrap gap-2 my-4">
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

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
        {filtered.map((item) => (
          <div className="col" key={item.id}>
            <div className="position-relative rounded-4 overflow-hidden hover-scale">
              <TextileTile variant={item.tile.replace('tile-', '')} image={item.image} className="ratio ratio-3x4 rounded-4"></TextileTile>
              <div
                className="position-absolute bottom-0 start-0 end-0 p-3"
                style={{ background: 'linear-gradient(0deg, rgba(0,0,0,.65), transparent)' }}
              >
                <div className="font-mono small text-white-50 text-uppercase">{item.categorie}</div>
                <div className="font-display fs-6 text-white">{item.nom}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
